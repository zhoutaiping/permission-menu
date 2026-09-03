#!/usr/bin/env node
/**
 * 根据扁平化 Excel 重建 src/data/menu.js
 * --------------------------------------------
 * 规则：
 *   - 以 Excel（menu-flat.xlsx）为权威：节点集合、顺序、层级、类型、父子关系（新编号体系）
 *   - 原 data 中不在 Excel 的节点删除；Excel 全部节点按「原ID」映射回 data 继承完整字段
 *     （description / parentCode / orderNum / modules / groupId / isOn / namePath / namePathStr）
 *   - meanType：Excel type=menu → 'menu'；type=button → 继承 data 原值（如 'help'），无则 null
 *   - 输出格式：对象多行（字段一行）、childs 换行、空数组内联，与 format 脚本风格一致
 *
 * 用法：node scripts/rebuild-menu.mjs --excel <menu-flat.xlsx> [--data <src/data/menu.js>]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_DATA = join(__dirname, '..', 'src', 'data', 'menu.js');

const IND = '    ';

function arg(argv, name) {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === name) return argv[i + 1];
  }
  return null;
}

/** 加载 ESM 风格数据文件（export default / export { x }） */
function loadJsFile(file) {
  const src = readFileSync(file, 'utf-8')
    .replace(/export\s*\{[\s\S]*?\}\s*;?/g, '')
    .replace(/export\s+default\s*/, 'module.exports = ');
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: file });
  return sandbox.module.exports;
}

/** 单引号包裹字符串（转义内部单引号与反斜杠） */
function quote(s) {
  return `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function printValue(v, indent) {
  if (v === null) return 'null';
  if (typeof v === 'string') return quote(v);
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return printArray(v, indent);
  if (typeof v === 'object') return printObject(v, indent);
  return String(v);
}

/** 对象多行：每个字段一行，childs 数组换行 */
function printObject(obj, indent) {
  const childIndent = indent + IND;
  const parts = Object.keys(obj).map((k) => {
    const v = obj[k];
    // childs 空数组保持内联，其余字段正常
    return `${childIndent}${k}: ${printValue(v, childIndent)}`;
  });
  const propsStr = parts.join(',\n');
  return [indent + '{', propsStr, indent + '}'].join('\n');
}

function printArray(arr, indent) {
  if (arr.length === 0) return '[]';
  const childIndent = indent + IND;
  const elems = arr.map((el) => printValue(el, childIndent));
  const elemsStr = elems.join(',\n');
  return ['[', elemsStr, indent + ']'].join('\n');
}

function main() {
  const excelPath = arg(process.argv.slice(2), '--excel');
  if (!excelPath) throw new Error('缺少参数 --excel <menu-flat.xlsx>');
  const dataPath = arg(process.argv.slice(2), '--data') || DEFAULT_DATA;
  const excelFile = isAbsolute(excelPath) ? excelPath : resolve(process.cwd(), excelPath);

  // 1. 读 Excel
  const wb = XLSX.readFile(excelFile);
  const sheetName = wb.SheetNames[0];
  const grid = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });
  if (!grid.length) throw new Error(`Excel 为空：${excelFile}`);
  const header = grid[0];
  const col = (name) => header.indexOf(name);
  const iNid = col('节点ID'), iPid = col('父ID'), iOid = col('原ID'), iName = col('名称'),
        iCode = col('编码'), iType = col('类型（菜单/按钮）'), iLevel = col('层级');
  if ([iNid, iPid, iOid, iName, iCode, iType, iLevel].some((i) => i < 0)) {
    throw new Error('Excel 表头不符合预期：需要 节点ID/父ID/原ID/名称/编码/类型（菜单/按钮）/层级');
  }

  const exRows = grid.slice(1).map((r) => ({
    nid: r[iNid],
    pid: r[iPid],
    oid: r[iOid],
    name: r[iName],
    code: String(r[iCode] ?? ''),
    type: r[iType],
    level: r[iLevel],
  }));

  // 2. 读 data（继承字段）
  const dataMenu = loadJsFile(dataPath);
  const curMap = new Map();
  (function walk(nodes) {
    (nodes || []).forEach((n) => {
      curMap.set(String(n.id), n);
      walk(n.childs);
    });
  })(dataMenu);

  // 3. 构建新节点（保留 data 原字段，覆盖/新增关键字段）
  const newNodes = exRows.map((r) => {
    const d = curMap.get(String(r.oid)) || {};
    const node = { ...d };
    node.id = r.nid;
    node.pid = r.pid;
    node.name = r.name;
    node.code = r.code;
    node.level = r.level;
    if (r.type === 'menu') {
      node.meanType = 'menu';
    } else if (d.meanType != null) {
      node.meanType = d.meanType; // 保留 help 等特殊类型
    } else {
      node.meanType = null;
    }
    node.childs = [];
    // 字段顺序按原 data 节点顺序（spread 后覆盖），若 data 无这些字段则补充到末尾
    const order = ['id', 'code', 'description', 'level', 'parentCode', 'orderNum', 'modules', 'groupId', 'name', 'pid', 'childs', 'isOn', 'meanType', 'namePath', 'namePathStr'];
    const reordered = {};
    order.forEach((k) => {
      if (k in node) reordered[k] = node[k];
    });
    return reordered;
  });

  // 4. 组装树
  const byPid = new Map();
  newNodes.forEach((n) => {
    if (!byPid.has(n.pid)) byPid.set(n.pid, []);
    byPid.get(n.pid).push(n);
  });
  const build = (pid) => (byPid.get(pid) || []).map((n) => {
    n.childs = build(n.id);
    return n;
  });
  const tree = build(0);

  // 5. 输出
  const body = printArray(tree, '');
  const output = `const menu = ${body};\n\nexport { menu }\nexport default menu\n`;
  writeFileSync(dataPath, output);

  const count = newNodes.length;
  const removed = dataMenu.length ? null : null;
  console.log('重建完成：');
  console.log(`  Excel 数据源：${excelFile}`);
  console.log(`  输出文件：${dataPath}`);
  console.log(`  节点总数：${count}（菜单 ${newNodes.filter((n) => n.meanType === 'menu').length} / 按钮 ${newNodes.filter((n) => n.meanType !== 'menu').length}）`);
}

try {
  main();
} catch (err) {
  console.error(`[失败] ${err.message}`);
  process.exitCode = 1;
}
