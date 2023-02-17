import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import { initSlots } from './componentsSlots'

export function createComponentInstance(vnode, parent) {
    const component: any = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        parent,
        providers: parent ? parent.providers : {},
        emit: () => { },
        slots: {}
    }
    component.emit = emit.bind(null, component)
    return component
}
// 初始化组件
export function setupComponent(instance) {
    initProps(instance, instance.vnode.props)
    initSlots(instance, instance.vnode.children)
    // 
    // 初始化有状态的组件
    setupStatefulComponent(instance)

}

// 初始化有状态的组件
function setupStatefulComponent(instance) {
    // 获取到用户的配置
    const { vnode } = instance
    const Component = vnode.type
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

    const { setup } = Component
    if (setup) {
        setCurrentInstance(instance)
        // 可以返回function作为render函数 或 object 作为组件状态
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit,
            slots: instance.slots
        })
        setCurrentInstance(null)
        handleSetuoResult(instance, setupResult)
    }
}

// 处理组件状态
function handleSetuoResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        // 组件状态保存在setupState属性上
        instance.setupState = setupResult
    }

    finishComponentSetup(instance)
}

// 设置render函数
function finishComponentSetup(instance) {
    const component = instance.type
    instance.render = component.render

}
let currentInstance: any = null

export function getCurrentInstance() {
    return currentInstance
}
// 设置currentInstance独立成一个方法，将来的问题追溯会更方便
export function setCurrentInstance(instance) {
    currentInstance = instance
}