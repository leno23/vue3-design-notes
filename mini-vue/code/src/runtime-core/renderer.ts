import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text, VNode } from './vnode';

export function render(vnode: VNode, container: any) {
    patch(vnode, container)
}

function patch(vnode: VNode, container: any) {

    // 处理不同类型的元素
    // console.log(vnode);
    const { shapeFlag, type } = vnode
    // Fragment ->只渲染children
    switch (type) {
        case Fragment:
            processFragment(vnode, container)
            break;
        case Text:
            processText(vnode, container)
            break;
        default:
            if (shapeFlag & ShapeFlags.ELEMENT) {
                processElement(vnode, container)
            } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                processComponent(vnode, container)
            }
            break
    }
}
function processFragment(vnode, container) {
    mountChildren(vnode, container)
}

function processText(vnode, container) {
    const { children } = vnode
    const el = document.createTextNode(children)
    vnode.el = el
    container.appendChild(el)
}


function processElement(vnode: VNode, container: any) {
    mountElement(vnode, container)
}

// 挂载Element类型元素
function mountElement(vnode: VNode, container: any) {
    const { type, props, children } = vnode
    const el = document.createElement(type)
    vnode.el = el
    const { shapeFlag } = vnode
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el)
    }
    const isOn = (v: string) => /^on[A-Z]/.test(v)
    for (const key in props) {
        const val = props[key]
        if (isOn(key)) {
            el.addEventListener(key.slice(2).toLowerCase(), val)
        } else {
            el.setAttribute(key, val)
        }
    }
    container.appendChild(el)
}
function mountChildren(vnode: VNode, container: any) {
    vnode.children.forEach(child => {
        patch(child, container)
    })

}
// 处理组件类型
function processComponent(vnode: VNode, container: any) {
    mountComponent(vnode, container)
}

// 挂载组件
function mountComponent(initialVNode: VNode, container: any) {
    const instance = createComponentInstance(initialVNode)
    setupComponent(instance)

    setupRenderEffect(instance, initialVNode, container)
}
function setupRenderEffect(instance: any, initialVNode: VNode, container: any) {
    // vnode
    const { proxy } = instance
    const subTree = instance.render.call(proxy)

    patch(subTree, container)
    // 深度优先遍历，此处会完成元素的挂载
    initialVNode.el = subTree.el
}