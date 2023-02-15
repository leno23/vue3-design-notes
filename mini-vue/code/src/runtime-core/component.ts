export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
    }
    return component
}
// 初始化组件
export function setupComponent(instance) {
    // initProps
    // initSlots
    // 
    // 初始化有状态的组件
    setupStatefulComponent(instance)

}

// 初始化有状态的组件
function setupStatefulComponent(instance) {
    // 获取到用户的配置
    const Component = instance.vnode.type
    const { setup } = Component
    if (setup) {
        // 可以返回function作为render函数 或 object 作为组件状态
        const setupResult = setup()
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