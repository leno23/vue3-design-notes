import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text, VNode } from './vnode';
import { createAppAPI } from './createApp';
import { effect } from '../reactivity/effect';
import { EMPTY_OBJ, getSequence } from '../shared';
import { shouldUpdateComponent } from './componentUpdateUtils';
import { queueJobs } from './scheduler';

export function createRenderer(options: any) {
    const {
        createElement: hostCrateElement,
        patchProp: hostPatchProp,
        insert: hostInsert,
        remove: hostRemove,
        setElementText: hostSetElementText
    } = options

    function render(vnode: VNode, container: any, parentComponent: any) {
        patch(null, vnode, container, parentComponent, null)
    }

    // n1老节点VNode n2新节点VNode
    function patch(n1: any, n2: VNode, container: any, parentComponent: any, anchor: any) {

        // 处理不同类型的元素
        // console.log(vnode);
        const { shapeFlag, type } = n2
        // Fragment ->只渲染children
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent, anchor)
                break;
            case Text:
                processText(n1, n2, container)
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent, anchor)
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent, anchor)
                }
                break
        }
    }
    function processFragment(n1: VNode, n2: VNode, container: any, parentComponent: any, anchor: any) {
        mountChildren(n2, container, parentComponent, anchor)
    }

    function processText(n1: any, n2: any, container: any) {
        const { children } = n2
        const el = document.createTextNode(children)
        n2.el = el
        container.appendChild(el)
    }


    function processElement(n1: VNode, n2: VNode, container: any, parentComponent: any, anchor: any) {
        if (!n1) {
            mountElement(n1, n2, container, parentComponent, anchor)
        } else {
            patchElement(n1, n2, container, parentComponent, anchor)
        }
    }

    function patchElement(n1: VNode, n2: VNode, container: any, parentComponent: any, anchor: any) {
        console.log(n1, n2);
        const oldProps = n1.props || EMPTY_OBJ
        const newProps = n2.props || EMPTY_OBJ

        const el = n1.el
        n2.el = n1.el
        patchChildren(n1, n2, el, parentComponent, anchor)
        patchProps(el, oldProps, newProps)

    }

    function patchChildren(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
        const preShapeFlag = n1.shapeFlag
        const shapeFlag = n2.shapeFlag
        const c1 = n1.children
        const c2 = n2.children

        // 由于children有2中类型，对比新老vnode的children 首先需要根据类型的不同分为4种情况
        // 老的是text，新的为text
        // 老的是text，新的为array
        // 老的是array，新的为text
        // 老的是array，新的为array
        // 下面分别处理这四种情况

        // 新节点child为text
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            // 老节点child为数组
            if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                unmountChildren(n1.children)

                hostSetElementText(container, c2)

            } else {
                // 老节点child为text
                if (c1 !== c2) {
                    hostSetElementText(container, c2)
                }
            }
        } else {
            // 新节点child为array，老节点为text
            if (preShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                hostSetElementText(container, '')
                mountChildren(c2, container, parentComponent, anchor)
            } else {
                // 新老节点均为array
                patchKeyedChildren(c1, c2, container, parentComponent, anchor)
            }
        }
    }

    function patchKeyedChildren(c1: any, c2: any, container: any, parentComponent: any, parentAnchor: any) {
        let i = 0
        const l1 = c1.length, l2 = c2.length
        let e1 = l1 - 1, e2 = l2 - 1
        function isSameVNodeType(n1: any, n2: any) {
            return n1.type === n2.type && n1.key === n2.key
        }
        // (a b)
        // (a b) c
        // 前面部分相同类型的元素进行更新
        // 左侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[i]
            const n2 = c2[i]
            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor)
            } else {
                break
            }
            i += 1
            console.log(i);

        }
        // (a b)
        // c (a b)
        // 后面部分相同类型的元素进行更新
        // 右侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1]
            const n2 = c2[e2]
            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor)
            } else {
                break
            }
            e1--
            e2--
        }
        /*
        i>e1，说明i~e2部分为新增的元素
        a  b  f  g
           e1 i
        a  b  (c e) f  g
                 e2
        i>e2，说明i~e1部分为删除的元素
        a  b  (c e) f  g
              i  e1
        a  b   f  g
           e2
        中间需要对比
        a  b  (c  e)  f  g
               i  e1
        a  b  (e  c  d)  f  g
                     e2
        */
        // i~e2 部分为新增加的节点
        // 新的比老的多，创建
        if (i > e1) {
            if (i <= e2) {
                const nextPos = e2 + 1
                const anchor = nextPos < l2 ? c2[nextPos].el : null
                while (i <= e2) {
                    patch(null, c2[i], container, parentComponent, anchor)
                    i++
                }
            }
        } else if (i > e2) {
            while (i <= e1) {
                hostRemove(c1[i].el)
                i++
            }
        } else {
            // 中间对比
            let s1 = i
            let s2 = i
            // 新节点总数量
            const toBePatched = e2 - s2 + 1
            // 已经处理的数量
            let patched = 0
            const keyToNewIndexMap = new Map()
            const newIndexToOldIndexMap = new Array(toBePatched)
            for (let i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

            let moved = false  // 是否发生了移动
            let maxNewIndexSoFar = 0

            // 节点的key和新的下标的映射关系
            for (let i = s2; i <= e2; i++) {
                const nextChild = c2[i]
                keyToNewIndexMap.set(nextChild.key, i)
            }
            // 遍历老节点，
            for (let i = s1; i <= e1; i++) {
                const preChild = c1[i]
                // 如果已经处理的数量 >= 新节点的数量，那么剩余的节点都是要删除的
                if (patched >= toBePatched) {
                    hostRemove(preChild.el)
                    continue
                }
                let newIndex
                if (preChild.key !== null) {
                    newIndex = keyToNewIndexMap.get(preChild.key)
                } else {
                    // 没有设置key的话，在新的s2 children逐个对比，查看有无相同的节点
                    // 这里也是不设置key引起的性能问题
                    for (let j = s2; j <= e2; j++) {
                        if (isSameVNodeType(preChild, c2[j])) {
                            newIndex = j
                            break
                        }
                    }
                }
                // 老节点i在新的children中没有找到，直接删除
                if (newIndex === undefined) {
                    hostRemove(preChild.el)
                } else {
                    if (newIndex >= maxNewIndexSoFar) {
                        maxNewIndexSoFar = newIndex
                    } else {
                        moved = true
                    }
                    // i可能=0，但是0表示新节点在老children中不存在，所以向后偏移一位
                    // newIndex - s2 按toBePatched的第一个节点下标为0计算
                    newIndexToOldIndexMap[newIndex - s2] = i + 1
                    patch(preChild, c2[newIndex], container, parentComponent, null)
                    patched++
                }

            }
            // 找到稳定的序列，对应的元素不需要移动，
            const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
            // 从后往前对比，因为保证处理一个元素时，后面的元素已经处理好了，这样才可以拿到锚点anchor
            let j = increasingNewIndexSequence.length - 1
            for (let i = toBePatched - 1; i >= 0; i--) {
                const nextIndex = i + s2
                const nextChild = c2[nextIndex]
                const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null
                // =0表示新节点在老children中不存在，需要创建
                if (newIndexToOldIndexMap[i] == 0) {
                    patch(null, nextChild, container, parentComponent, anchor)
                } else if (moved) {

                    if (j < 0 || i !== increasingNewIndexSequence[j]) {
                        console.log('移动位置');
                        hostInsert(nextChild.el, container, anchor)
                    } else {
                        j--
                    }
                }
            }
        }
    }

    function unmountChildren(children: any) {
        for (const child of children) {
            let el = child.el
            hostRemove(el)
        }
    }


    // 对比新老Prop，处理一下四种情况
    // 1.props 没有发生变化
    // 2.某些属性值发生变化
    // 3.删除某些属性
    // 4.新增新的属性
    function patchProps(el: any, oldProps: any, newProps: any) {
        if (oldProps === newProps) return
        // 老的属性的值发生变更
        for (const key in newProps) {
            const preProp = oldProps[key]
            const nextProp = newProps[key]

            if (preProp !== nextProp) {
                hostPatchProp(el, key, preProp, nextProp)
            }
        }

        // 老的属性发生了移除，如果老的props是空的，就没有必要进行属性移除判断了
        if (oldProps === EMPTY_OBJ) return
        for (const key in oldProps) {
            if (!(key in newProps)) {
                hostPatchProp(el, key, oldProps[key], null)
            }
        }
    }

    // 挂载Element类型元素
    function mountElement(n1: VNode, n2: VNode, container: any, parentComponent: any, anchor: any) {
        const { type, props, children } = n2
        const el = hostCrateElement(type)
        n2.el = el
        const { shapeFlag } = n2
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(n2.children, el, parentComponent, anchor)
        }
        for (const key in props) {
            const val = props[key]
            hostPatchProp(el, key, null, val)
        }
        hostInsert(el, container, anchor)
    }

    function mountChildren(children: any, container: any, parentComponent: any, anchor: any) {
        children.forEach((child: any) => {
            patch(null, child, container, parentComponent, anchor)
        })

    }
    // 处理组件类型
    function processComponent(n1: VNode, n2: VNode, container: any, parentComponent: any, anchor: any) {
        if (!n1) {

            mountComponent(n2, container, parentComponent, anchor)
        } else {

            updateComponent(n1, n2)
        }
    }
    function updateComponent(n1, n2) {
        const instance = (n2.component = n1.component)
        if (shouldUpdateComponent(n1, n2)) {
            console.log('updateComponent');
            instance.next = n2
            instance.update()
        } else {
            n2.el = n1.el
            instance.vnode = n2
        }
    }


    // 挂载组件
    function mountComponent(initialVNode: VNode, container: any, parentComponent: any, anchor: any) {
        const instance = createComponentInstance(initialVNode, parentComponent,)
        initialVNode.component = instance
        setupComponent(instance)

        setupRenderEffect(instance, initialVNode, container, anchor)
    }
    // 初始化 render函数的副作用 也就是状态改变 -> render() -> render Effect 的过程
    function setupRenderEffect(instance: any, initialVNode: VNode, container: any, anchor: any) {
        // vnode
        // 为render函数设置副作用，这样在render函数中的状态发生变化时，render调用时，然后这个副作用函数会被调用
        instance.update = effect(() => {
            const { proxy } = instance
            if (!instance.isMounted) {
                console.log('init');

                const subTree = instance.render.call(proxy)
                instance.subTree = subTree
                patch(null, subTree, container, instance, anchor)
                // 深度优先遍历，此处会完成元素的挂载
                initialVNode.el = subTree.el
                instance.isMounted = true
            } else {
                const { next, vnode } = instance

                if (next) {
                    next.el = vnode.el
                    updateComponentPreRender(instance, next)
                }
                const subTree = instance.render.call(proxy)
                let preSubTree = instance.subTree
                // 更新实例的子树
                instance.subTree = subTree
                // console.log(pre, subTree);
                console.log('update');
                patch(preSubTree, subTree, container, instance, anchor)

            }
        },{
            scheduler(){
                // console.log('update - sheduler');
                queueJobs(instance.update)
                
            }
        })
    }

    return {
        createApp: createAppAPI(render)
    }
}

function updateComponentPreRender(instance, nextVNode) {
    instance.vnode = nextVNode
    nextVNode.next = null
    instance.props = nextVNode.props
}