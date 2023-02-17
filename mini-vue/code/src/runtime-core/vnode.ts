import { ShapeFlags } from '../shared/shapeFlags'
export interface VNode {
    type: any
    props: any
    children: VNode[] | string
    shapeFlag: number
    el: HTMLElement | null
}
export const Fragment = Symbol("Fragment")

export const Text = Symbol("Text")

export function createVNode(type: any, props?: any, children?: any): VNode {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null
    }
    if (typeof children === 'string') {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
    } else if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
    }

    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        if (typeof children === 'object') {
            vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
        }
    }
    return vnode
}

export function createTextVNode(text) {
    return createVNode(Text, {}, text)

}
function getShapeFlag(type: any) {
    return typeof type === 'string' ?
        ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}