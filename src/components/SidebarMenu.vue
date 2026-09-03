<template>
  <aside class="permission-sidebar">

    <el-menu
      class="sidebar-menu"
      :default-active="activeId"
      :default-openeds="defaultOpeneds"
      unique-opened
      @select="onSelect"
    >
      <!-- 全部节点 -->
      <el-menu-item index="all">
        <span slot="title">全部</span>
      </el-menu-item>

      <!-- 递归菜单树 -->
      <menu-tree
        :items="menu"
        :active-id="activeId"
        @select="onSelect"
      ></menu-tree>
    </el-menu>
  </aside>
</template>

<script>
import MenuTree from './MenuTree.vue';

export default {
  name: 'SidebarMenu',
  components: { MenuTree },
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
  data() {
    return {
      // 默认展开的一级菜单
      defaultOpeneds: ['1'],
    };
  },
  methods: {
    onSelect(index) {
      this.$emit('select', index);
    },
  },
};
</script>

<style scoped>
.permission-sidebar {
  width: 220px;
  flex-shrink: 0;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background: #ffffff;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  flex-shrink: 0;
  padding: 10px 14px;
  font-size: 13px;
  color: #909399;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
}
/* 菜单树内部独立滚动，不与右侧表格共用 */
.sidebar-menu {
  flex: 1;
  min-height: 0;
  border-right: none;
  overflow-y: auto;
}
.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}
.sidebar-menu::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 2px;
}
.sidebar-menu .el-menu-item,
.sidebar-menu >>> .el-submenu__title {
  height: 44px;
  line-height: 44px;
  border-bottom: 1px solid #f0f2f5;
}
.sidebar-menu .el-menu-item.is-active {
  background: #ecf5ff;
  color: #409eff;
  font-weight: 600;
  border-right: 3px solid #409eff;
}
/* 覆盖 element-ui 默认：远祖 submenu（is-active）不高亮（避免一级菜单被误激活） */
.sidebar-menu >>> .el-submenu.is-active > .el-submenu__title {
  color: inherit;
  background: transparent;
  font-weight: normal;
  border-right-color: transparent;
}
/* 高亮：激活项自身（含一级菜单被选中）+ 激活项的直接父级 */
.sidebar-menu >>> .el-submenu.is-self-active > .el-submenu__title,
.sidebar-menu >>> .el-submenu.is-direct-parent-active > .el-submenu__title {
  background: #ecf5ff;
  color: #409eff;
  font-weight: 600;
  border-right: 3px solid #409eff;
}
.sidebar-menu >>> .el-submenu .el-menu-item {
  background: #fafafa;
  min-width: 0;
}
.sidebar-menu >>> .el-submenu .el-menu-item.is-active {
  background: #ecf5ff;
}
</style>
