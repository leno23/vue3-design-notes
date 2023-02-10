import { track, trigger } from './effect2'

export const reactive = (raw:any) => {
    return new Proxy(raw, {
        get(target, key) {
            track(target,key)
            return Reflect.get(target, key)
        },
        set(target, key, value) {
            let res = Reflect.set(target, key, value)
            trigger(target,key)
            return res
        }
    })
}