const publicPropertiesMap: any = {
    $el: i => i.vnode.el
}
export const PublicInstanceProxyHandlers = {
    get({ _: instance }: any, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const publicGetter = publicPropertiesMap[key]
        if (publicGetter) {
            return publicGetter(instance)
        }
    }
}