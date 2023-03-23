import { hasOwn } from '../shared/index';

const publicPropertiesMap: any = {
    $el: i => i.vnode.el,
    $slots: i=>i.slots,
    $props: i => i.props
}
export const PublicInstanceProxyHandlers = {
    get({ _: instance }: any, key) {
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key]
        if (publicGetter) {
            return publicGetter(instance)
        }
    }
}