#!/usr/bin/env node
/**
 * data/menu.js 格式化脚本
 * --------------------------------------------
 * 规则（按截图样式）：
 *   - 对象字段（properties）按一行展示，逗号+空格分隔
 *   - childs 数组换行，每个元素（对象）单独一行
 *   - 顶层 const menu = [...] 也是每个元素一行
 *   - 保留原始字面量（引号风格、数字、null 等），通过 AST node.extra.raw
 *   - 仅重写 const menu = [...] 段，文件其他部分（export 等）原样保留
 *   - 支持 --data <path> 覆盖目标文件（默认 src/data/menu.js）
 *
 * 使用：node scripts/format-menu.mjs   或   npm run format
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_PATH = join(__dirname, '..', 'src', 'data', 'menu.js');

function resolveTarget(argv) {
  let raw = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--data' || argv[i] === '-d') {
      raw = argv[i + 1];
      break;
    }
  }
  if (!raw) raw = process.env.MENU_DATA_PATH;
  if (raw) return isAbsolute(raw) ? raw : resolve(process.cwd(), raw);
  return DEFAULT_PATH;
}

const INDENT = '    ';

/** 取节点原始字面量文本（含引号风格等），无则退回 JSON.stringify */
function getRaw(node) {
  if (node.extra && node.extra.raw != null) return node.extra.raw;
  if (node.type === 'NullLiteral') return 'null';
  return JSON.stringify(node.value);
}

function printKey(key) {
  if (key.type === 'Identifier') return key.name;
  return getRaw(key);
}

function printValue(node, indent) {
  switch (node.type) {
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
      return getRaw(node);
    case 'NullLiteral':
      return 'null';
    case 'ArrayExpression':
      return printArray(node, indent);
    case 'ObjectExpression':
      return printObject(node, indent);
    default:
      // 兜底：未识别类型
      return `/* <${node.type}> */`;
  }
}

function printProperty(prop, indent) {
  const key = printKey(prop.key);
  const val = printValue(prop.value, indent);
  if (prop.computed) return `${indent}[${key}]: ${val}`;
  return `${indent}${key}: ${val}`;
}

/** 对象多行样式：每个 property 一行，整体以 indent 缩进（左大括号也在 indent） */
function printObject(obj, indent) {
  if (obj.properties.length === 0) return '{}';
  const childIndent = indent + INDENT;
  const parts = obj.properties.map((p) => printProperty(p, childIndent));
  const propsStr = parts.join(',\n');
  return [`${indent}{`, propsStr, `${indent}}`].join('\n');
}

/** 数组：空数组内联 []；非空时 `[` 紧跟前缀、`]` 在 indent，元素在 childIndent */
function printArray(arr, indent) {
  if (arr.elements.length === 0) return '[]';
  const childIndent = indent + INDENT;
  const elements = arr.elements.map((el) => printValue(el, childIndent));
  const elemsStr = elements.join(',\n');
  return ['[', elemsStr, `${indent}]`].join('\n');
}

/** 从 start 起找到与 openChar 配对的 closeChar 的索引（处理字符串/反引号/转义） */
function findMatching(src, start, openChar, closeChar) {
  let depth = 0;
  let inStr = null;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === inStr) inStr = null;
    } else {
      if (ch === '"' || ch === "'" || ch === '`') {
        inStr = ch;
      } else if (ch === openChar) {
        depth++;
      } else if (ch === closeChar) {
        depth--;
        if (depth === 0) return i;
      }
    }
  }
  return -1;
}

function main() {
  const target = resolveTarget(process.argv.slice(2));
  let src;
  try {
    src = readFileSync(target, 'utf-8');
  } catch (err) {
    throw new Error(`读取失败：${target}（${err.message}）`);
  }

  const ast = parse(src, { sourceType: 'module' });

  let menuArray = null;
  for (const node of ast.program.body) {
    if (
      node.type === 'VariableDeclaration' &&
      node.declarations[0].id.name === 'menu'
    ) {
      menuArray = node.declarations[0].init;
      break;
    }
  }
  if (!menuArray) throw new Error('未找到 const menu = [...]');

  // 定位 const menu = [ 在源文本中的范围
  const constIdx = src.indexOf('const menu =');
  if (constIdx < 0) throw new Error('未找到 const menu');
  const arrayOpenIdx = src.indexOf('[', constIdx);
  const arrayCloseIdx = findMatching(src, arrayOpenIdx, '[', ']');
  if (arrayCloseIdx < 0) throw new Error('未找到匹配的 ]');

  // 源文件中 arrayCloseIdx 后应是 ;
  const before = src.slice(0, constIdx);
  const after = src.slice(arrayCloseIdx + 1).replace(/^\n+/, '');
  const formatted = `const menu = ${printArray(menuArray, '')};\n`;

  const output = before + formatted + after;
  writeFileSync(target, output);

  console.log('格式化完成：');
  console.log(`  文件：${target}`);
  console.log(`  原行数：${src.split('\n').length} | 格式化后行数：${output.split('\n').length}`);
}

try {
  main();
} catch (err) {
  console.error(`[失败] ${err.message}`);
  process.exitCode = 1;
}