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
        <el-table-column label="查看" width="70" align="center">
          <template slot-scope="{ row }">
            <el-checkbox
              v-model="row._node.isOn"
              :true-label="2"
              :false-label="1"
              @change="(val) => onViewChange(row._node, val)"
            ></el-checkbox>
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
import { findById, findTopLevel, findPosition } from '../utils/menu';

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
  },
  computed: {
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
     * 派生判断：节点查看=2 且所有按钮=2 时视为"全选"
     * 单一数据源：完全从 isOn 计算，不再依赖 selectAllMap 临时字段
     * 无操作权限时：全选状态 = 查看是否勾选（与 isOn 联动）
     */
    isAllChecked(node) {
      if (!node) return false;
      const buttons = (node.childs || []).filter((c) => c.meanType !== 'menu');
      // 无操作权限：全选 = 查看 isOn
      if (!buttons.length) {
        return node.isOn == 2;
      }
      return node.isOn == 2 && buttons.every((b) => b.isOn == 2);
    },

    /** 全选开关变化 → 设置查看 + 所有按钮的 isOn */
    onSelectAllChange(node, val) {
      if (!node) return;
      const v = val ? 2 : 1;
      node.isOn = v;
      (node.childs || []).forEach((c) => {
        if (c.meanType !== 'menu') c.isOn = v;
      });
    },

    /** 查看 checkbox 变化 → 联动操作权限（全选状态自动派生） */
    onViewChange(node, val) {
      if (!node) return;
      (node.childs || []).forEach((c) => {
        if (c.meanType !== 'menu') c.isOn = val;
      });
    },

    /** 操作权限按钮变化 → 全部勾选时联动勾选查看（全选状态自动派生） */
    onButtonChange(node) {
      if (!node) return;
      const buttons = (node.childs || []).filter((c) => c.meanType !== 'menu');
      if (!buttons.length) return;
      if (buttons.every((b) => b.isOn == 2)) {
        node.isOn = 2;
      }
    },

    /** 表头全选 checkbox 变化 → 对所有行同步 */
    onHeaderSelectAll(val) {
      if (!this.rows.length) return;
      this.rows.forEach((r) => {
        this.onSelectAllChange(r._node, val);
      });
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