import { ShapeFlags } from '../shared/shapeFlags'
export interface VNode{
    type:any
    props:any
    children:VNode[]
    shapeFlag: number
    el: HTMLElement | null
}

export function createVNode(type:any, props?:any, children?:any): VNode {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null
    }
    if(typeof children === 'string'){
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
    }else if(Array.isArray(children)){
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
    }
    return vnode
}

function getShapeFlag(type:any) {
    return typeof type === 'string' ?
    ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}