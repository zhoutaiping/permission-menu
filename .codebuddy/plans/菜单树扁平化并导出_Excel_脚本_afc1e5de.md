---
name: 菜单树扁平化并导出 Excel 脚本
overview: 编写一个独立 Node 脚本：读取 src/data/menu.js 的树形菜单数据，深度优先遍历扁平化为"每节点一行"的记录列表（含派生层级路径字段），再基于这些字段用 SheetJS 导出 .xlsx 文件，同时输出 JSON 与控制台表格。
todos:
  - id: install-xlsx
    content: 安装 xlsx 为 devDependency，验证 npm 可用
    status: completed
  - id: write-flatten-script
    content: 编写 scripts/flatten-menu.mjs：加载 ESM 数据、递归扁平化、导出每节点一行的 JSON
    status: completed
    dependencies:
      - install-xlsx
  - id: export-excel
    content: 扩展脚本用 xlsx 生成中文表头 Excel 并运行，核对 JSON 与 Excel 行数
    status: completed
    dependencies:
      - write-flatten-script
  - id: verify-excel
    content: 用 [skill:xlsx] 校验 menu-flat.xlsx 的表头、行数与字段完整性
    status: completed
    dependencies:
      - export-excel
---

## 产品概述

编写一个 Node 脚本，将 `src/data/menu.js` 的树形菜单数据扁平化处理，并导出为「每节点一行」的数据文件与 Excel 表格，便于查看和交付完整权限节点清单。

## 核心功能

- 读取并解析 `src/data/menu.js` 的树形数据（一级菜单 → 二级菜单 → 三级菜单 → 操作按钮），递归遍历所有节点
- 扁平化输出：每个节点一行，包含节点自身字段（id、parentId、name、code、parentCode、type、level、isOn）及层级语义字段（一级菜单、二级菜单、三级菜单、完整路径）
- 导出 JSON 文件（每节点一个对象、一行）与 Excel 文件（中文表头，一节点一行）
- 脚本可重复运行：数据变更后重跑即可重新生成，不改动业务数据文件

## 技术栈

- Node.js 脚本（`.mjs` 模块），零框架
- Excel 生成：SheetJS `xlsx`（安装为 devDependency）
- 数据源：`src/data/menu.js`（ESM `export default`，package.json 无 `type: module`）

## 实现思路

- 数据加载：由于 `src/data/menu.js` 为 ESM 语法且项目非 `type:module`，脚本用 `fs.readFileSync` 读取文件文本，将 `export default` 替换为 `module.exports =` 后用 `vm.runInNewContext` 在沙箱中执行获取树数据，避免改动业务数据文件
- 扁平化：深度优先递归遍历，维护层级路径数组（仅菜单节点入路径，按钮不入），为每个节点生成一行记录
- 导出：`XLSX.utils.json_to_sheet` 生成工作表，`writeFile` 输出 `.xlsx`；JSON 直接 `JSON.stringify` 输出，数组每元素即一个节点
- 输出目录 `scripts/export/` 自动创建，脚本可重复运行

## 扁平化行字段定义

JSON 字段（英文 key，保留原始值）：

- `index` 序号、`id` 节点ID（保留原始值，跨层级重复时不做改写）、`parentId`、`name`、`code`、`parentCode`（缺失填空）
- `type`：`meanType==='menu'` → `menu`；缺失或 `button` → `button`（按钮）
- `level`：优先用节点自带 `level`，缺失（按钮）按遍历深度推导（父菜单层级）
- `isOn`：保留原始数值 1/2；另附 `isOnText`：2→已选中，1→未选中
- `level1`、`level2`、`level3`：所在层级菜单名（不足填空）；`fullPath`：一级/二级/三级/自身名 用 `/` 拼接

Excel 表头（中文）：序号、节点ID、父ID、名称、编码、父编码、类型（菜单/按钮）、层级、选中状态、一级菜单、二级菜单、三级菜单、完整路径

## 性能与可靠性

- 单次 O(N) 深度优先遍历，数据规模百级节点，无性能瓶颈
- 沙箱执行只针对纯数据文件（无外部依赖），若未来数据文件引入 require 需在沙箱注入 `require`；当前 `menu.js` 为纯数据，无需注入
- 输出文件路径通过 `import.meta.url` 定位，脚本可在任意工作目录运行

## 目录结构

```
permission-menu/
├── package.json              # [MODIFY] devDependencies 添加 xlsx
├── scripts/
│   ├── flatten-menu.mjs      # [NEW] 主脚本：数据加载 + 扁平化 + JSON/Excel 导出
│   └── export/               # [NEW] 输出目录（脚本运行时自动创建）
│       ├── menu-flat.json    # [NEW] 扁平化数据，每节点一行（脚本生成）
│       └── menu-flat.xlsx    # [NEW] Excel 导出（脚本生成）
```

## 实现要点

- 递归函数签名：`walk(nodes, depth, path)`，菜单节点 push/pop 路径，按钮不进入路径
- 使用 `XLSX.utils.json_to_sheet(rows, { header })` 指定列顺序，`!cols` 设置列宽提升可读性
- 脚本运行后输出统计信息（节点总数、菜单数、按钮数）便于核对

## Agent Extensions

### Skill

- **xlsx**
- 用途：校验脚本生成的 `menu-flat.xlsx`——读取工作簿，核对行数与扁平化 JSON 一致、表头与字段完整
- 预期结果：确认 Excel 内容正确（无缺列、无乱码、行数匹配），交付前质量把关