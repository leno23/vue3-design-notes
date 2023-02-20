import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text, VNode } from './vnode';
import { createAppAPI } from './createApp';

export function createRenderer(options) {
    const {
        createElement: hostCrateElement,
        patchProp: hostPatchProp,
        insert: hostInsert
    } = options

    function render(vnode: VNode, container: any, parentComponent: any) {
        patch(vnode, container, parentComponent)
    }

    function patch(vnode: VNode, container: any, parentComponent: any) {

        // 处理不同类型的元素
        // console.log(vnode);
        const { shapeFlag, type } = vnode
        // Fragment ->只渲染children
        switch (type) {
            case Fragment:
                processFragment(vnode, container, parentComponent)
                break;
            case Text:
                processText(vnode, container)
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(vnode, container, parentComponent)
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(vnode, container, parentComponent)
                }
                break
        }
    }
    function processFragment(vnode: VNode, container: any, parentComponent: any) {
        mountChildren(vnode, container, parentComponent)
    }

    function processText(vnode: any, container: any) {
        const { children } = vnode
        const el = document.createTextNode(children)
        vnode.el = el
        container.appendChild(el)
    }


    function processElement(vnode: VNode, container: any, parentComponent: any) {
        mountElement(vnode, container, parentComponent)
    }

    // 挂载Element类型元素
    function mountElement(vnode: VNode, container: any, parentComponent: any) {
        const { type, props, children } = vnode
        const el = hostCrateElement(type)
        vnode.el = el
        const { shapeFlag } = vnode
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(vnode, el, parentComponent)
        }
        for (const key in props) {
            const val = props[key]
            hostPatchProp(el, key, val)
        }
        hostInsert(el, container)
        // container.appendChild(el)
    }
    function mountChildren(vnode: VNode, container: any, parentComponent: any) {
        vnode.children.forEach(child => {
            patch(child, container, parentComponent)
        })

    }
    // 处理组件类型
    function processComponent(vnode: VNode, container: any, parentComponent: any) {
        mountComponent(vnode, container, parentComponent)
    }

    // 挂载组件
    function mountComponent(initialVNode: VNode, container: any, parentComponent: any) {
        const instance = createComponentInstance(initialVNode, parentComponent)
        setupComponent(instance)

        setupRenderEffect(instance, initialVNode, container)
    }
    function setupRenderEffect(instance: any, initialVNode: VNode, container: any) {
        // vnode
        const { proxy } = instance
        const subTree = instance.render.call(proxy)

        patch(subTree, container, instance)
        // 深度优先遍历，此处会完成元素的挂载
        initialVNode.el = subTree.el
    }

    return {
        createApp: createAppAPI(render)
    }
}