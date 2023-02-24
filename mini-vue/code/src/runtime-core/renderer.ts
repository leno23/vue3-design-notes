import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text, VNode } from './vnode';
import { createAppAPI } from './createApp';
import { effect } from '../reactivity/effect';

export function createRenderer(options) {
    const {
        createElement: hostCrateElement,
        patchProp: hostPatchProp,
        insert: hostInsert
    } = options

    function render(vnode: VNode, container: any, parentComponent: any) {
        patch(null, vnode, container, parentComponent)
    }

    function patch(n1: VNode | null, n2: VNode, container: any, parentComponent: any) {

        // 处理不同类型的元素
        // console.log(vnode);
        const { shapeFlag, type } = n2
        // Fragment ->只渲染children
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent)
                break;
            case Text:
                processText(n1, n2, container)
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent)
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent)
                }
                break
        }
    }
    function processFragment(n1: VNode, n2: VNode, container: any, parentComponent: any) {
        mountChildren(n2, container, parentComponent)
    }

    function processText(n1: any, n2: any, container: any) {
        const { children } = n2
        const el = document.createTextNode(children)
        n2.el = el
        container.appendChild(el)
    }


    function processElement(n1: VNode, n2: VNode, container: any, parentComponent: any) {
        if (!n1) {
            mountElement(n1, n2, container, parentComponent)
        } else {
            patchElement(n1, n2, container)
        }
    }

    function patchElement(n1: VNode, n2: VNode, container) {
        console.log(n1, n2);

    }

    // 挂载Element类型元素
    function mountElement(n1: VNode, n2: VNode, container: any, parentComponent: any) {
        const { type, props, children } = n2
        const el = hostCrateElement(type)
        n2.el = el
        const { shapeFlag } = n2
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(n2, el, parentComponent)
        }
        for (const key in props) {
            const val = props[key]
            hostPatchProp(el, key, val)
        }
        hostInsert(el, container)
        // container.appendChild(el)
    }
    function mountChildren(vnode: any, container: any, parentComponent: any) {
        vnode.children.forEach(child => {
            patch(null, child, container, parentComponent)
        })

    }
    // 处理组件类型
    function processComponent(n1: VNode, n2: VNode, container: any, parentComponent: any) {
        mountComponent(n1,n2, container, parentComponent)
    }

    // 挂载组件
    function mountComponent(n1: VNode, n2: VNode, container: any, parentComponent: any) {
        const instance = createComponentInstance(n2, parentComponent)
        setupComponent(instance)

        setupRenderEffect(instance, n2, container)
    }
    // 初始化 render函数的副作用 也就是状态改变 -> render() -> render Effect 的过程
    function setupRenderEffect(instance: any, initialVNode: VNode, container: any) {
        // vnode
        // 为render函数设置副作用，这样在render函数被调用时，这个函数会被调用
        effect(() => {
            const { proxy } = instance
            if (!instance.isMounted) {
                console.log('init');

                const subTree = instance.render.call(proxy)
                instance.subTree = subTree
                patch(null, subTree, container, instance)
                // 深度优先遍历，此处会完成元素的挂载
                initialVNode.el = subTree.el
                instance.isMounted = true
            } else {
                const subTree = instance.render.call(proxy)
                let preSubTree = instance.subTree
                // 更新实例的子树
                instance.subTree = subTree
                // console.log(pre, subTree);
                console.log('update');
                patch(preSubTree,subTree,container,instance)

            }
        })
    }

    return {
        createApp: createAppAPI(render)
    }
}