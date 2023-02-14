export function createVNode(type, props?, children?): VNode {
    const vnode = {
        type,
        props,
        children
    }
    return vnode
}