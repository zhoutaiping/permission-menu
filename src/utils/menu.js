/**
 * 菜单树工具函数（适配 childs 字段）
 */

/** 把树拍平为数组，便于按 id 查找 */
export function flatten(list, acc = []) {
  list.forEach((it) => {
    acc.push(it);
    if (it.childs && it.childs.length) flatten(it.childs, acc);
  });
  return acc;
}

/** 按 id 查找节点 */
export function findById(list, id) {
  return flatten(list).find((it) => it.id == id) || null;
}

/** 按 id 查找直接父节点（list 可为顶层数组或任意层的 childs 数组） */
export function findParent(list, id) {
  for (const node of list) {
    if (node.childs && node.childs.length) {
      for (const c of node.childs) {
        if (c.id == id) return node;
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
    if (l1.id == id) return l1;
    if (containsId(l1, id)) return l1;
  }
  return null;
}

function containsId(node, id) {
  if (!node.childs || !node.childs.length) return false;
  for (const c of node.childs) {
    if (c.id == id) return true;
    if (containsId(c, id)) return true;
  }
  return false;
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
    if (n.id == id) return { level1Name: l1, level2Name: l2, depth };
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
