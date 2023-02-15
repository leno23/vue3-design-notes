import { isObject } from '../shared/index';
import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
    patch(vnode, container)
}

function patch(vnode, container) {

    // 处理不同类型的元素
    console.log(vnode);
    if (typeof vnode.type === 'string') {
        processElement(vnode, container)
    } else if (isObject(vnode.type)) {
        processComponent(vnode, container)
    }
}

function processElement(vnode, container) {
    mountElement(vnode, container)
}

function mountElement(vnode, container) {
    const { type, props, children } = vnode
    const el = document.createElement(type)
    vnode.el = el

    if (typeof children === 'string') {
        el.textContent = children
    } else if (Array.isArray(children)) {
        mountChildren(vnode, el)
    }
    for (const key in props) {
        el.setAttribute(key, props[key])
    }
    container.appendChild(el)
}
function mountChildren(vnode, container) {
    vnode.children.forEach(child => {
        patch(child, container)
    })

}
// 处理组件类型
function processComponent(vnode, container) {
    mountComponent(vnode, container)
}

// 挂载组件
function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode)
    setupComponent(instance)

    setupRenderEffect(instance, vnode, container)
}
function setupRenderEffect(instance, initialVNode, container) {
    // vnode
    const { proxy } = instance
    const subTree = instance.render.call(proxy)

    patch(subTree, container)
    // 深度优先遍历，此处会完成元素的挂载
    initialVNode.el = subTree.el
}