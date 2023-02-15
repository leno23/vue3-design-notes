import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component'
import { VNode } from './vnode';

export function render(vnode, container) {
    patch(vnode, container)
}

function patch(vnode:VNode, container) {

    // 处理不同类型的元素
    console.log(vnode);
    const {shapeFlag} = vnode
    if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container)
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container)
    }
}

function processElement(vnode:VNode, container) {
    mountElement(vnode, container)
}

function mountElement(vnode:VNode, container) {
    const { type, props, children } = vnode
    const el = document.createElement(type)
    vnode.el = el
    const {shapeFlag} = vnode
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el)
    }
    for (const key in props) {
        el.setAttribute(key, props[key])
    }
    container.appendChild(el)
}
function mountChildren(vnode:VNode, container) {
    vnode.children.forEach(child => {
        patch(child, container)
    })

}
// 处理组件类型
function processComponent(vnode:VNode, container) {
    mountComponent(vnode, container)
}

// 挂载组件
function mountComponent(initialVNode:VNode, container) {
    const instance = createComponentInstance(initialVNode)
    setupComponent(instance)

    setupRenderEffect(instance, initialVNode, container)
}
function setupRenderEffect(instance, initialVNode:VNode, container) {
    // vnode
    const { proxy } = instance
    const subTree = instance.render.call(proxy)

    patch(subTree, container)
    // 深度优先遍历，此处会完成元素的挂载
    initialVNode.el = subTree.el
}