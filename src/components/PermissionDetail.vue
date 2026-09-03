<template>
  <section class="permission-content">
    <div class="content-title">
      <span>
        当前一级菜单：<strong>{{ level1Name }}</strong>
      </span>
      <el-tag size="small" effect="plain">
        共 {{ rows.length }} 项
      </el-tag>
    </div>

    <!-- 权限矩阵表格 -->
    <div class="table-wrapper" v-if="rows.length">
      <el-table :data="rows" border stripe style="width: 100%" height="100%">
        <el-table-column prop="level1" label="一级菜单" width="160" />
        <el-table-column prop="level2" label="二级菜单" width="180" />
        <el-table-column prop="level3" label="三级菜单" width="180" />
        <el-table-column label="全选" width="90" align="center">
          <template slot="header" slot-scope="{}">
            <el-checkbox
              class="header-checkbox"
              :value="isAllRowsChecked"
              :indeterminate="isPartiallyChecked"
              @change="onHeaderSelectAll"
            ></el-checkbox>
            <span class="header-label">全选</span>
          </template>
          <template slot-scope="{ row }">
            <el-switch
              :value="isAllChecked(row._node)"
              @change="(val) => onSelectAllChange(row._node, val)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="查看权限" width="80" align="center">
          <template slot-scope="{ row }">
            <el-checkbox
              v-model="row._node.isOn"
              :true-label="2"
              :false-label="1"
              :disabled="isLocked(row._node)"
              @change="(val) => onViewChange(row._node, val)"
            >查看</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作权限" min-width="300">
          <template slot-scope="{ row }">
            <span v-if="!row.buttons.length" class="empty-btn">—</span>
            <el-checkbox
              v-for="b in row.buttons"
              :key="renderKey(b)"
              v-model="b.isOn"
              :true-label="2"
              :false-label="1"
              class="btn-checkbox"
              @change="() => onButtonChange(row._node)"
            >{{ b.name }}</el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="empty-tip" v-if="!rows.length">
      当前菜单下暂无权限数据
    </div>
  </section>
</template>

<script>
import { findById, findTopLevel, findPosition, isFullyChecked, syncAncestors, enforceLocked } from '../utils/menu';

export default {
  name: 'PermissionDetail',
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
    activeId: {
      type: String,
      default: 'all',
    },
    // 默认锁定 code 列表：仅通过 props 从父组件传入；不传或为空数组时不锁定任何节点
    lockedCodes: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    // 初始化：先强制锁定节点选中，再聚合祖先链路（跳过锁定节点，避免被覆盖）
    enforceLocked(this.menu, this.resolvedLockedCodes);
    this.syncAll();
  },
  watch: {
    // props 传入的 lockedCodes 变化时，重新强制锁定并联动
    lockedCodes() {
      enforceLocked(this.menu, this.resolvedLockedCodes);
      this.syncAll();
    },
  },
  computed: {
    /** 实际生效的锁定 code 列表：完全由 props 提供 */
    resolvedLockedCodes() {
      return this.lockedCodes || [];
    },
    rows() {
      return this.buildRows();
    },
    level1Name() {
      if (this.activeId == 'all') return '全部';
      const node = findById(this.menu, this.activeId);
      if (!node) return '-';
      if (node.level == 1) return node.name;
      const top = findTopLevel(this.menu, this.activeId);
      return top ? top.name : '-';
    },

    /** 表头全选：所有行均已全选 */
    isAllRowsChecked() {
      if (!this.rows.length) return false;
      return this.rows.every((r) => this.isAllChecked(r._node));
    },

    /** 表头半选：有任意行已全选（但不是全部） */
    isPartiallyChecked() {
      if (!this.rows.length) return false;
      return (
        !this.isAllRowsChecked &&
        this.rows.some((r) => this.isAllChecked(r._node))
      );
    },
  },
  methods: {
    // 渲染 key（用于 v-for :key，全局唯一；兼容未预处理的旧数据）
    renderKey(item) {
      return item._renderKey != null ? item._renderKey : String(item.id);
    },
    buildRows() {
      const rows = [];
      if (this.activeId == 'all') {
        this.menu.forEach((l1) => this.collectLevel1(l1, rows));
        return rows;
      }

      const node = findById(this.menu, this.activeId);
      if (!node) return rows;

      const pos = findPosition(this.menu, this.activeId) || {};
      const level1Name = pos.level1Name || node.name;

      if (node.level == 1) {
        this.collectLevel1(node, rows);
      } else if (node.meanType == 'menu') {
        // 从选中节点开始递归，depth 为它在树中的实际深度
        this.collectMenuNode(
          node,
          level1Name,
          pos.level2Name || '',
          pos.depth || 1,
          rows
        );
      }
      return rows;
    },

    /** 收集一级菜单下所有权限行 */
    collectLevel1(l1, rows) {
      (l1.childs || []).forEach((l2) => {
        if (l2.meanType !== 'menu') return;
        this.collectMenuNode(l2, l1.name, '', 1, rows);
      });
    },

    /**
     * 递归收集菜单节点为表格行
     */
    collectMenuNode(node, level1Name, level2Name, depth, rows) {
      const buttons = (node.childs || []).filter((c) => c.meanType !== 'menu');
      const subMenus = (node.childs || []).filter((c) => c.meanType == 'menu');

      const level2 = depth == 1 ? node.name : level2Name;
      const level3 = depth >= 2 ? node.name : '-';

      if (buttons.length) {
        rows.push({ level1: level1Name, level2, level3, _node: node, buttons });
      }
      if (subMenus.length) {
        const nextLevel2 = depth == 1 ? node.name : level2Name;
        subMenus.forEach((sm) => {
          this.collectMenuNode(sm, level1Name, nextLevel2, depth + 1, rows);
        });
      }
      if (!buttons.length && !subMenus.length) {
        rows.push({ level1: level1Name, level2, level3, _node: node, buttons: [] });
      }
    },

    /**
     * 派生判断：节点查看=2 且所有按钮=2 时视为"全选"。
     * 单一数据源：完全从 isOn 计算，不再依赖 selectAllMap 临时字段。
     * 委托 utils.isFullyChecked 处理，避免规则在多处分散。
     */
    isAllChecked(node) {
      return isFullyChecked(node);
    },

    /** 判断节点是否为锁定权限（默认选中且不可取消） */
    isLocked(node) {
      return !!node && this.resolvedLockedCodes.includes(String(node.code));
    },

    /** 祖先链路联动（跳过锁定节点，避免其 isOn 被聚合覆盖） */
    syncAll() {
      syncAncestors(this.menu, (n) => this.isLocked(n));
    },

    /** 全选开关变化 → 设置查看 + 所有按钮的 isOn */
    onSelectAllChange(node, val) {
      if (!node) return;
      const v = val ? 2 : 1;
      if (this.isLocked(node)) {
        // 锁定节点：查看强制保持勾选，按钮仍可跟随全选
        (node.childs || []).forEach((c) => {
          if (c.meanType !== 'menu') c.isOn = v;
        });
        node.isOn = 2;
        this.syncAll();
        return;
      }
      node.isOn = v;
      (node.childs || []).forEach((c) => {
        if (c.meanType !== 'menu') c.isOn = v;
      });
      this.syncAll();
    },

    /**
     * 查看 checkbox 变化 → 只改自身查看状态，不联动任何按钮；
     * 锁定节点：查看不可取消（强制保持勾选）；
     * 规则3：只要存在已勾选的操作权限按钮，查看不可取消（强制保持勾选）。
     */
    onViewChange(node, val) {
      if (!node) return;
      if (this.isLocked(node)) {
        node.isOn = 2; // 锁定节点查看不可取消
        return;
      }
      const buttons = (node.childs || []).filter((c) => c.meanType !== 'menu');
      if (val !== 2 && buttons.some((b) => b.isOn == 2)) {
        // v-model 已把 isOn 置为 1，这里强制恢复，实现"查看无法取消"
        node.isOn = 2;
        this.syncAll();
        return;
      }
      node.isOn = val;
      this.syncAll();
    },

    /**
     * 操作权限按钮变化 → 规则2：任一按钮勾选即自动勾选上级查看；
     * 全部勾选时"查看选中"自然成立（任一已勾选）。
     * 操作权限全部取消时查看保持原状（不自动取消），
     * 此时无按钮勾选，用户可手动取消查看（一次即生效）。
     */
    onButtonChange(node) {
      if (!node) return;
      const buttons = (node.childs || []).filter((c) => c.meanType !== 'menu');
      if (!buttons.length) return;
      if (buttons.some((b) => b.isOn == 2)) {
        node.isOn = 2;
      }
      this.syncAll();
    },

    /** 表头全选 checkbox 变化 → 对所有行同步 */
    onHeaderSelectAll(val) {
      if (!this.rows.length) return;
      this.rows.forEach((r) => {
        this.onSelectAllChange(r._node, val);
      });
      // onSelectAllChange 内部已调用 syncAll；为保险此处再调用一次（幂等）
      this.syncAll();
    },
  },
};
</script>

<style scoped>
.permission-content {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.content-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content-title strong {
  color: #409eff;
  margin-left: 4px;
}
.table-wrapper {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  flex: 1;
  min-height: 0;
}
.btn-checkbox {
  margin-right: 14px !important;
}
.header-checkbox {
  margin-right: 4px;
}
.header-checkbox + .header-label,
.header-label {
  font-weight: 600;
  color: #606266;
}
.empty-btn {
  color: #c0c4cc;
  font-size: 13px;
}
.empty-tip {
  padding: 40px 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style>