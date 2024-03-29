import { proxyRefs } from '../reactivity'
import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import { initSlots } from './componentsSlots'
import { VNode } from './vnode'

export function createComponentInstance(vnode: VNode, parent: any) {
    const component: any = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        parent,
        next: null,
        providers: parent ? parent.providers : {},
        emit: () => { },
        // 组件实例对应的vnode
        subTree: {},
        isMounted: false,
        slots: {}
    }
    component.emit = emit.bind(null, component)
    return component
}
// 初始化组件
export function setupComponent(instance: any) {
    initProps(instance, instance.vnode.props)
    initSlots(instance, instance.vnode.children)
    // 
    // 初始化有状态的组件
    setupStatefulComponent(instance)

}

// 初始化有状态的组件
function setupStatefulComponent(instance: any) {
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
function handleSetuoResult(instance: any, setupResult: any) {
    if (typeof setupResult === 'object') {
        // 组件状态保存在setupState属性上
        instance.setupState = proxyRefs(setupResult)
    }

    finishComponentSetup(instance)
}

// 设置render函数
function finishComponentSetup(instance: any) {
    const component = instance.type
    if (compiler && !component.render) {
        if (component.template) {
            component.render = compiler(component.template)
        }
    }
    instance.render = component.render

}
let currentInstance: any = null

export function getCurrentInstance() {
    return currentInstance
}
// 设置currentInstance独立成一个方法，将来的问题追溯会更方便
export function setCurrentInstance(instance: any) {
    currentInstance = instance
}

let compiler: any
export function registerRuntimeCompiler(_compiler: any) {
    compiler = _compiler
}