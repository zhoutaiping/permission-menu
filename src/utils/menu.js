/**
 * 菜单树工具函数（适配 childs 字段）
 */

/**
 * 确保树中每个节点拥有全局唯一的渲染 key（_renderKey / _renderIndex）。
 * 相同 id 的节点（跨层级也算）依次追加 _1、_2 后缀，原始 id 字段保留不动，
 * 供渲染层（MenuTree / PermissionDetail 的 v-for :key）使用，避免 Duplicate keys 警告。
 * @param {Array} nodes 菜单树（可为顶层数组或任意层 childs）
 * @param {Set} [seen] 已使用的渲染 key 集合（递归时内部传递）
 * @returns {Array} 返回新数组（节点为浅拷贝，不修改入参）
 */
export function ensureUniqueIds(nodes, seen = new Set()) {
  return (nodes || []).map((node) => {
    const base = String(node.id);
    let renderKey = base;
    if (seen.has(renderKey)) {
      let i = 1;
      while (seen.has(base + '_' + i)) i += 1;
      renderKey = base + '_' + i;
    }
    seen.add(renderKey);
    const next = { ...node, _renderKey: renderKey, _renderIndex: renderKey };
    if (node.childs && node.childs.length) {
      next.childs = ensureUniqueIds(node.childs, seen);
    }
    return next;
  });
}

/** 判断某 id 是否为节点的渲染 key（_renderIndex） */
function isRenderKey(node, id) {
  return node._renderIndex != null && String(node._renderIndex) == id;
}

/** 把树拍平为数组，便于按 id 查找 */
export function flatten(list, acc = []) {
  list.forEach((it) => {
    acc.push(it);
    if (it.childs && it.childs.length) flatten(it.childs, acc);
  });
  return acc;
}

/** 按 id 或渲染 key（_renderIndex）查找节点 */
export function findById(list, id) {
  return (
    flatten(list).find((it) => it.id == id || isRenderKey(it, id)) || null
  );
}

/** 按 id 或渲染 key 查找直接父节点（list 可为顶层数组或任意层的 childs 数组） */
export function findParent(list, id) {
  for (const node of list) {
    if (node.childs && node.childs.length) {
      for (const c of node.childs) {
        if (c.id == id || isRenderKey(c, id)) return node;
      }
    }
  }
  for (const node of list) {
    if (node.childs && node.childs.length) {
      const found = findParent(node.childs, id);
      if (found) return found;
    }
  }
  return null;
}

/** 查找某节点所属的顶层（level 1）节点 */
export function findTopLevel(list, id) {
  for (const l1 of list) {
    if (l1.id == id || isRenderKey(l1, id)) return l1;
    if (containsId(l1, id)) return l1;
  }
  return null;
}

function containsId(node, id) {
  if (!node.childs || !node.childs.length) return false;
  for (const c of node.childs) {
    if (c.id == id || isRenderKey(c, id)) return true;
    if (containsId(c, id)) return true;
  }
  return false;
}

/**
 * 节点是否为"已完全勾选"：
 * - 无按钮时只看自身 isOn == 2
 * - 有按钮时需自身 isOn == 2 且所有按钮 isOn == 2
 * 是"二级全选→一级自动 2"规则的判定基础。
 */
export function isFullyChecked(node) {
  if (!node) return false;
  const buttons = (node.childs || []).filter((c) => c.meanType !== 'menu');
  if (!buttons.length) return node.isOn == 2;
  return node.isOn == 2 && buttons.every((b) => b.isOn == 2);
}

/**
 * 二级菜单 isOn 向上聚合：
 * 只要某一二级菜单下存在任一三级菜单（meanType='menu'）已选中（isOn == 2），
 * 该二级菜单 isOn 即设为 2；全部三级均未选中时才设为 1。
 * 无三级子菜单的二级节点不处理（保持用户直接操作/按钮联动结果）。
 * 原地修改 menu 数据，无返回值。
 */
export function syncLevel2(menu) {
  (menu || []).forEach((l1) => {
    (l1.childs || []).forEach((l2) => {
      if (l2.meanType !== 'menu') return;
      const subMenus = (l2.childs || []).filter((c) => c.meanType == 'menu');
      if (!subMenus.length) return;
      const anyChecked = subMenus.some((sm) => sm.isOn == 2);
      l2.isOn = anyChecked ? 2 : 1;
    });
  });
}

/**
 * 一级菜单 isOn 向上聚合：
 * 只要某一级菜单下存在任一二级菜单（meanType='menu'）已选中（isOn == 2），
 * 该一级菜单 isOn 即设为 2；全部二级均未选中时才设为 1。
 * 原地修改 menu 数据，无返回值。
 */
export function syncTopLevel(menu) {
  (menu || []).forEach((l1) => {
    const subMenus = (l1.childs || []).filter((c) => c.meanType == 'menu');
    if (!subMenus.length) return;
    const anyChecked = subMenus.some((sm) => sm.isOn == 2);
    l1.isOn = anyChecked ? 2 : 1;
  });
}

/**
 * 祖先链路向上聚合（先二级后一级，保证顺序依赖正确）：
 * - L2 根据其下三级菜单选中状态聚合
 * - L1 再根据聚合后的二级状态聚合
 * 交互修改点（全选/查看/操作权限/表头全选）统一调用此入口即可。
 */
export function syncAncestors(menu) {
  syncLevel2(menu);
  syncTopLevel(menu);
}

/** 判断节点是否为按钮权限（meanType 为 button 或缺失 meanType） */
export function isButton(item) {
  return item.meanType == 'button' || !item.meanType;
}

/** 判断节点是否为菜单（meanType 为 menu） */
export function isMenu(item) {
  return item.meanType == 'menu';
}

/**
 * 定位节点在树中的位置，返回 { level1Name, level2Name, depth }
 * depth：0=一级菜单，1=二级，2=三级，...
 */
export function findPosition(list, id) {
  return _find(list, id, '', '', 0);
}

function _find(nodes, id, l1, l2, depth) {
  for (const n of nodes) {
    if (n.id == id || isRenderKey(n, id)) {
      return { level1Name: l1, level2Name: l2, depth };
    }
  }
  for (const n of nodes) {
    const menus = (n.childs || []).filter((c) => c.meanType == 'menu');
    if (!menus.length) continue;
    const nl1 = depth == 0 ? n.name : l1;
    const nl2 = depth == 1 ? n.name : l2;
    const found = _find(menus, id, nl1, nl2, depth + 1);
    if (found) return found;
  }
  return null;
}
