import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
    patch(vnode, container)
}

function patch(vnode, container) {

    // 处理不同类型的元素
    processComponent(vnode, container)
}

// 处理组件类型
function processComponent(vnode, container) {
    mountComponent(vnode, container)
}

// 挂载组件
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode)
    setupComponent(instance)

    setupRenderEffect(instance, container)
}
function setupRenderEffect(instance, container) {
    // vnode
    const subTree = instance.render()

    patch(subTree, container)

}