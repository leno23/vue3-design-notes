export function createVNode(type, props?, children?): VNode {
    const vnode = {
        type,
        props,
        children,
        el: null
    }
    return vnode
}