---
name: permission-menu 解决 Duplicate keys 警告（菜单 id 重复）
overview: 由于接口返回的菜单 functionCodes 中存在跨层级 id 重复（如顶层/子层都出现 id=1），导致 MenuTree/PermissionDetail 中的 v-for :key 冲突，Vue 抛出 Duplicate keys detected。本计划在数据预处理环节为重复 id 追加父节点路径后缀以保证全局唯一，从根本上消除冲突。
todos:
  - id: add-unique-ids-util
    content: 在 src/utils/menu.js 中新增并导出 ensureUniqueIds(menu) 工具，递归给重复 id 节点追加 _renderKey/_renderIndex，保留原始 id 字段
    status: completed
  - id: apply-preprocess-in-app
    content: 在 src/App.vue 中引入 ensureUniqueIds，把 data.menu 改为预处理后的结果，handleSave 沿用原始 n.id 不变
    status: completed
    dependencies:
      - add-unique-ids-util
  - id: update-menutree-key
    content: 修改 src/components/MenuTree.vue，将 el-submenu/el-menu-item 的 :key 与 :index 改用 _renderKey/_renderIndex，含 fallback 兼容
    status: completed
    dependencies:
      - apply-preprocess-in-app
  - id: update-permissiondetail-key
    content: 修改 src/components/PermissionDetail.vue，把按钮 el-checkbox 的 :key="b.id" 改为 :key="b._renderKey"，含 fallback 兼容
    status: completed
    dependencies:
      - add-unique-ids-util
  - id: verify-no-warning
    content: 启动 dev server 并点击左侧权限树各节点，验证控制台不再出现 Duplicate keys 警告，保存按钮回填数据中 id 与后端原始一致
    status: completed
    dependencies:
      - update-menutree-key
      - update-permissiondetail-key
---

## 排查结论

用户怀疑的"id 字符串/数字类型"**并非 root cause**。现有代码已全面兼容 `String(item.id)`：

- `MenuTree.vue` 的 `:key="'submenu-' + item.id"`、`:index="String(item.id)"`
- `utils/menu.js` 的 `findById` 使用 `it.id == id`（双等号，类型自动转换）

控制台报错的真正原因在用户提供的 Network 截图中清晰可见：**`data.data.functionCodes` 返回的菜单数据本身存在 id 重复**：

- 顶层：`{id:1, code:'RAA'}` 与 `{id:1, code:'RAA1'}` —— id=1 重复
- 子层：`{id:0}`、`{id:2}`、`{id:5}`、`{id:7}` —— id=0 与顶层 `pid:0` 也重复
- 按钮层：从 `'43' / '70'` 警告可见 button.id 也存在重复

由此触发的 Vue 警告对应三个 key 源：

1. `Duplicate keys detected: 'item-0'` → `MenuTree.vue` 中 `'item-' + item.id`
2. `Duplicate keys detected: '43' / '70'` → `PermissionDetail.vue` 中 `<el-checkbox :key="b.id">`
3. element-ui 内部还会用 `el-menu-item` / `el-submenu` 的 `index` 充当内部 key，重复 index 同样会触发

> 关键：仅把 id 转为字符串并不能解决，因为 bug 在于"id 值是否全局唯一"，不在于类型。

## 修复目标

- 控制台不再出现 `Duplicate keys detected` 警告
- 左侧 MenuTree 正常折叠/展开
- 点击节点切换右侧表格正常
- **后端返回的原始 `id` 字段不被改动**，保存时仍按原 `id` 提交

## 核心功能

- 菜单数据入口处对 id 全局去重：相同 id 的节点依次追加 `_1`、`_2` …，原始 `id` 保留不动
- 渲染层（左侧树、右侧表格）统一使用去重后的渲染 key/index
- 保存按钮回填时使用原始 `id`，对后端透明

## Tech Stack

- Vue 2 + Element UI（项目现状，沿用）
- 原生 JavaScript ES6（无新增依赖）

## Implementation Approach

**策略：数据层兜底去重 + 渲染层使用去重 key，原始 id 完整保留**。

1. **新增 `ensureUniqueIds(menu)` 工具**：递归遍历菜单树，用 `Set` 跟踪已出现 id；当 id 冲突时，给冲突节点附加 `_renderKey`（值为 `<原id>_<n>`）和 `_renderIndex`（同值），原始 `id` 字段不变。
2. **App.vue 数据初始化时预处理**：`menu` 改为 `ensureUniqueIds(rawMenu)` 的结果，并在 `handleSave` 的 `cloneTree` 中优先取 `n.id` 原始值。
3. **MenuTree.vue 改用 `_renderKey` / `_renderIndex`**：把当前 `:key="'submenu-' + item.id"` / `:key="'item-' + item.id"` / `:index="String(item.id)"` 替换为去重字段；`activeId` 比较逻辑也对应改用 `String(item._renderIndex)`，保证 el-menu 高亮与 select 事件正常。
4. **PermissionDetail.vue 改用 `b._renderKey`**：`<el-checkbox :key="b.id">` 改为 `:key="b._renderKey"`；其它地方（`buildRows`、`collectMenuNode`）不动，因为它们走 `findById` 已兼容 `==`。
5. **SidebarMenu.vue 保持现状**：其 `<el-menu-item index="all">` 写死，递归渲染交给 MenuTree，无需调整。

**关键决策权衡**：

- 选择"渲染层使用去重 key"而非"后端修 id"：后端修改周期长，前端容错更稳。
- 选择"数据预处理"而非"模板内 index 拼接"：保持模板简洁，逻辑集中在 `utils/menu.js`，易于扩展（后续若加 `path` 前缀只需改工具函数）。
- 保留原始 `id` 字段：避免对后端协议造成隐式变更，保存回填安全。

## Implementation Notes

- 兜底：若节点没有 `_renderKey`（例如老 mock 数据），回退 `String(item.id)`，保持向后兼容。
- 性能：`ensureUniqueIds` 是 O(n) 单次遍历，组件 mount 期间只执行一次，不存在热路径开销。
- 日志：保持现有 `console.log('保存的权限数据...')` 即可，输出已含原始 `id`，无需新增。
- 作用域控制：仅修改 4 个文件（`utils/menu.js` / `App.vue` / `MenuTree.vue` / `PermissionDetail.vue`），不影响 `SidebarMenu.vue` 和 mock 数据。

## Architecture Design

无架构调整，沿用现有"App → SidebarMenu(MenuTree) + PermissionDetail"的分层。改动是组件 props 不变前提下的内部实现替换。

## Directory Structure

```
src/
├── utils/
│   └── menu.js              # [MODIFY] 新增 ensureUniqueIds(menu) 工具，导出供 App.vue 使用
├── data/
│   └── menu.js              # [UNCHANGED] mock 数据保持不动；接口数据将在 App.vue 处接入
├── App.vue                  # [MODIFY] 引入 ensureUniqueIds，data 初始化调用；handleSave 保持原样（用原始 id）
├── components/
│   ├── SidebarMenu.vue      # [UNCHANGED]
│   ├── MenuTree.vue         # [MODIFY] key / index 改用 _renderKey / _renderIndex（带 fallback）
│   └── PermissionDetail.vue # [MODIFY] button 的 :key="b.id" 改为 :key="b._renderKey"（带 fallback）
```