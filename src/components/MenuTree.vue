<template>
  <div>
    <template v-for="item in visibleItems">
      <!-- 有子菜单（childs 里含 menu 节点）：渲染 el-submenu -->
      <el-submenu
        v-if="hasMenuChild(item)"
        :key="'submenu-' + renderKey(item)"
        :index="renderIndex(item)"
        :class="{ 'is-parent-active': activeId == renderIndex(item) }"
      >
        <template slot="title">
          <span class="submenu-title" @click="onTitleClick(item)">
            {{ item.name }}
          </span>
        </template>
        <menu-tree
          :items="item.childs"
          :active-id="activeId"
          v-on="$listeners"
        ></menu-tree>
      </el-submenu>

      <!-- 无子菜单（叶子/按钮挂在 childs 里）：渲染叶子节点 -->
      <el-menu-item v-else :key="'item-' + renderKey(item)" :index="renderIndex(item)">
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MenuTree',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    // 当前选中节点 id（用于高亮父级 title）
    activeId: {
      type: String,
      default: 'all',
    },
  },
  computed: {
    // 只显示菜单节点，过滤掉按钮（type 缺失 / button）及其他类型（help）
    // 同时排除 id 缺失的节点（避免 ElementUI el-menu-item/submenu 的 index prop 校验失败）
    visibleItems() {
      return this.items.filter(
        (it) =>
          it.meanType == 'menu' &&
          it.id !== undefined &&
          it.id !== null &&
          it.id !== ''
      );
    },
  },
  methods: {
    // 渲染 key（用于 v-for :key，全局唯一；兼容未预处理的旧数据）
    renderKey(item) {
      return item._renderKey != null ? item._renderKey : String(item.id);
    },
    // 渲染 index（用于 el-menu-item / el-submenu 的 index，全局唯一；兼容旧数据）
    renderIndex(item) {
      return item._renderIndex != null ? String(item._renderIndex) : String(item.id);
    },
    // 判断某节点 childs 里是否还有 menu 子节点（决定是否可展开）
    hasMenuChild(item) {
      return (item.childs || []).some((c) => c.meanType == 'menu');
    },
    // 点击父级文本 → 选中该节点（事件冒泡到 title 同时触发展开/收起）
    onTitleClick(item) {
      this.$emit('select', this.renderIndex(item));
    },
  },
};
</script>

<style scoped>
.submenu-title {
  display: inline-flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
