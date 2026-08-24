<template>
  <div id="app-root" class="app-container">
    <div class="permission-card">
      <div class="permission-title">
        <span>权限配置列表</span>
        <el-button type="primary" size="small" @click="handleSave">
          保存
        </el-button>
      </div>

      <div class="permission-body">
        <!-- 左侧菜单 -->
        <sidebar-menu
          :menu="menu"
          :active-id="activeId"
          @select="handleSelect"
        ></sidebar-menu>

        <!-- 右侧详情 -->
        <permission-detail
          :menu="menu"
          :active-id="activeId"
        ></permission-detail>
      </div>
    </div>
  </div>
</template>

<script>
import menuData from './data/menu';
import SidebarMenu from './components/SidebarMenu.vue';
import PermissionDetail from './components/PermissionDetail.vue';

export default {
  name: 'App',
  components: { SidebarMenu, PermissionDetail },
  data() {
    return {
      menu: menuData,
      activeId: 'all',
    };
  },
  methods: {
    handleSelect(index) {
      this.activeId = index;
    },
    // 保存：打印所有节点（含选中状态），保留完整树形结构，不做扁平化
    handleSave() {
      const cloneTree = (nodes) =>
        nodes.map((n) => ({
          id: n.id,
          parentId: n.parentId,
          name: n.name,
          code: n.code,
          type: n.meanType,
          level: n.level,
          isOn: n.isOn,
          childs: n.childs && n.childs.length ? cloneTree(n.childs) : [],
        }));
      const result = cloneTree(this.menu);
      console.log('保存的权限数据（完整树形，含选中状态，未扁平化）：', result);
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
html,
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC',
    'Helvetica Neue', Helvetica, 'Microsoft YaHei', Arial, sans-serif;
  background: #f5f7fa;
  color: #303133;
  height: 100%;
}
#app-root {
  min-height: 100vh;
  padding: 24px;
}
.permission-card {
  max-width: 1280px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 24px 28px;
}
.permission-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.permission-body {
  display: flex;
  gap: 20px;
  padding-top: 20px;
  align-items: flex-start;
}

@media (max-width: 992px) {
  .permission-body {
    flex-direction: column;
  }
  .permission-sidebar {
    width: 100%;
  }
}
</style>
