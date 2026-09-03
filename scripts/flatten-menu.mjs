#!/usr/bin/env node
/**
 * 菜单树扁平化 + 导出脚本
 * --------------------------------------------
 * 数据源：src/view/system/menu.js（ESM 语法，package.json 无 type:module，用 vm 沙箱加载，不改动业务文件）
 * 输出：
 *   - scripts/export/menu-flat.json   扁平化数据，每节点一个对象
 *   - scripts/export/menu-flat.jsonl  每行一个节点
 *   - scripts/export/menu-flat.xlsx   中文表头 Excel，每节点一行
 *
 * 数据路径解析优先级（目录有变动时无需改代码）：
 *   1. 命令行参数：--data <path> 或 -d <path>（相对路径以运行目录为准）
 *   2. 环境变量：MENU_DATA_PATH=<path>
 *   3. 默认：相对脚本位置的 src/view/system/menu.js
 *
 * 可重复运行：数据变更后重新执行 `node scripts/flatten-menu.mjs` 即可。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import * as XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** 按优先级解析数据源路径：--data/-d 参数 > MENU_DATA_PATH 环境变量 > 默认相对脚本位置 */
function resolveDataPath(argv) {
  let raw = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--data' || argv[i] === '-d') {
      raw = argv[i + 1];
      break;
    }
  }
  if (!raw) raw = process.env.MENU_DATA_PATH;
  if (raw) return isAbsolute(raw) ? raw : resolve(process.cwd(), raw);
  return join(__dirname, '..', 'src', 'data', 'menu.js');
}

const DATA_PATH = resolveDataPath(process.argv.slice(2));
const OUT_DIR = join(__dirname, 'export');
const JSON_PATH = join(OUT_DIR, 'menu-flat.json');
const JSONL_PATH = join(OUT_DIR, 'menu-flat.jsonl');
const XLSX_PATH = join(OUT_DIR, 'menu-flat.xlsx');

/** 加载 src/data/menu.js（ESM export default → 沙箱内转 module.exports 执行） */
function loadMenuData() {
  let source;
  try {
    source = readFileSync(DATA_PATH, 'utf-8');
  } catch (err) {
    throw new Error(`读取数据源失败：${DATA_PATH}（${err.message}）`);
  }
  // 兼容：`export { menu }`（命名导出）与 `export default menu;` 两种写法
  // 先移除命名导出块（仅保留 default），再把 export default 转为 CommonJS 赋值
  source = source
    .replace(/export\s*\{[\s\S]*?\}\s*;?/g, '')
    .replace(/export\s+default\s*/, 'module.exports = ');
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  try {
    vm.runInContext(source, sandbox, { filename: 'menu.js' });
  } catch (err) {
    throw new Error(`解析数据源失败：${err.message}`);
  }
  const menu = sandbox.module.exports;
  if (!Array.isArray(menu)) {
    throw new Error('数据源未导出数组，请检查 src/data/menu.js 的 export default 内容');
  }
  return menu;
}

/** 深度优先递归扁平化：每节点生成一行记录 */
function flattenMenu(menu) {
  const rows = [];
  const isOnTextOf = (node) =>
    node.isOn == 2
      ? '已选中'
      : node.isOn == 1
        ? '未选中'
        : node.isOn != null
          ? String(node.isOn)
          : '';

  // 重新编号：深度优先顺序分配新 id（1,2,3...），parentId 指向父节点新 id（顶层为 0）
  let nextId = 1;
  const walk = (nodes, path, parentNewId) => {
    for (const node of nodes || []) {
      const name = node.name != null ? node.name : '';
      const newId = nextId++;
      const isMenuNode = node.meanType === 'menu';
      // 层级：优先节点自带 level，缺失（如按钮）按遍历深度推导
      const depth = path.length + 1;
      const level = node.level != null ? node.level : depth;
      // 自身层级：仅菜单节点占据对应层级列；按钮仅填充祖先菜单名
      const ownLevel = isMenuNode ? depth : -1;
      const level1 = ownLevel === 1 ? name : path[0] || '';
      const level2 = ownLevel === 2 ? name : path[1] || '';
      const level3 = ownLevel === 3 ? name : path[2] || '';

      rows.push({
        index: rows.length + 1,
        id: newId,
        parentId: parentNewId,
        origId: node.id != null ? node.id : '',
        name,
        code: node.code != null ? node.code : '',
        parentCode: node.parentCode != null ? node.parentCode : '',
        type: isMenuNode ? 'menu' : 'button',
        level,
        isOn: node.isOn != null ? node.isOn : '',
        isOnText: isOnTextOf(node),
        level1,
        level2,
        level3,
        fullPath: [...path, name].join(' / '),
      });

      if (isMenuNode && node.childs && node.childs.length) {
        walk(node.childs, [...path, name], newId);
      }
    }
  };

  walk(menu, [], 0);
  return rows;
}

/** 输出 JSON（每节点一个对象） */
function writeJson(rows) {
  writeFileSync(JSON_PATH, JSON.stringify(rows, null, 2), 'utf-8');
}

/** 输出 JSONL（每行一个节点对象，紧凑格式） */
function writeJsonl(rows) {
  writeFileSync(JSONL_PATH, rows.map((r) => JSON.stringify(r)).join('\n') + '\n', 'utf-8');
}

/** 输出 Excel（中文表头，每节点一行） */
function writeExcel(rows) {
  const headers = [
    '序号',
    '节点ID',
    '父ID',
    '原ID',
    '名称',
    '编码',
    '父编码',
    '类型（菜单/按钮）',
    '层级',
    '选中状态',
    '一级菜单',
    '二级菜单',
    '三级菜单',
    '完整路径',
  ];
  const keys = [
    'index',
    'id',
    'parentId',
    'origId',
    'name',
    'code',
    'parentCode',
    'type',
    'level',
    'isOnText',
    'level1',
    'level2',
    'level3',
    'fullPath',
  ];
  const widthMap = {
    index: 6,
    id: 8,
    parentId: 8,
    origId: 10,
    name: 16,
    code: 14,
    parentCode: 14,
    type: 14,
    level: 6,
    isOnText: 10,
    level1: 18,
    level2: 18,
    level3: 18,
    fullPath: 52,
  };

  // 仅保留 keys 指定的列（json_to_sheet 的 header 之外字段会被追加，需先裁剪）
  const cleanRows = rows.map((r) =>
    keys.reduce((o, k) => {
      o[k] = r[k];
      return o;
    }, {})
  );
  const sheet = XLSX.utils.json_to_sheet(cleanRows);
  // 替换为中文表头
  XLSX.utils.sheet_add_aoa(sheet, [headers], { origin: 'A1' });
  sheet['!cols'] = keys.map((k) => ({ wch: widthMap[k] || 12 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, '扁平化菜单');
  XLSX.writeFile(wb, XLSX_PATH);
}

function main() {
  try {
    mkdirSync(OUT_DIR, { recursive: true });
    const menu = loadMenuData();
    const rows = flattenMenu(menu);
    if (!rows.length) throw new Error('扁平化结果为空');

    writeJson(rows);
    writeJsonl(rows);
    writeExcel(rows);

    const menuCount = rows.filter((r) => r.type === 'menu').length;
    const btnCount = rows.length - menuCount;

    console.log('扁平化完成：');
    console.log(`  数据源：${DATA_PATH}`);
    console.log(`  节点总数：${rows.length}（菜单 ${menuCount} 个 / 按钮 ${btnCount} 个）`);
    console.log(`  JSON ：${JSON_PATH}`);
    console.log(`  JSONL：${JSONL_PATH}`);
    console.log(`  Excel：${XLSX_PATH}`);
    console.log('\n预览（前 5 行）：');
    console.table(rows.slice(0, 5));
  } catch (err) {
    console.error(`[失败] ${err.message}`);
    process.exitCode = 1;
  }
}

main();
