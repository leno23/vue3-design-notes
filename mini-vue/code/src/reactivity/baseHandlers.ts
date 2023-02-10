import { track, trigger } from './effect'
import { ReactiveFlags } from './reactive'

const get = createGetter()
const set = createSetter()
const readOnlyGet = createGetter(true)
function createGetter(isReadonly = false) {
    return function get(target: any, key: any, value: any) {
        const res = Reflect.get(target, key)
        if(key ===ReactiveFlags.IS_REACTIVE){
            return  !isReadonly
        }else if(key ===ReactiveFlags.IS_READONLY){
            return isReadonly
        }
        if (!isReadonly) {

            track(target, key)
        }
        return res
    }
}
function createSetter(isReadonly = false) {
    return function set(target: any, key: any, value: any) {
        const res = Reflect.set(target, key, value)
        trigger(target, key)
        return res
    }
}

export const mutableHanlders = {
    get,
    set,
}

export const readonlyHanlders = {
    get: readOnlyGet,
    set(target: any, key: any, value: any) {
        console.warn(`key:${key}不能被修改，因为他是readonly的`)
        return true
    }
}