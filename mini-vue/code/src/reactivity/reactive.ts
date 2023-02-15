import { isObject } from '../shared/index'
import { mutableHanlders, readonlyHanlders, shallowReadonlyHanlders } from './baseHandlers'

function createActiveObject(target, baseHandlers) {
    if (!isObject(target)){
        console.warn(`target is-->${target},not a object`);
        return target
        
    }
    return new Proxy(target, baseHandlers)
}

export enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly"
}

export function reactive(raw: any) {
    return createActiveObject(raw, mutableHanlders)
}
export function readonly(raw: any) {
    return createActiveObject(raw, readonlyHanlders)
}
export function isReactive(value: any) {
    return !!value[ReactiveFlags.IS_REACTIVE]
}
export function isReadonly(value: any) {
    return !!value[ReactiveFlags.IS_READONLY]
}
export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHanlders)

}
export function isProxy(value){
    return isReactive(value) || isReadonly(value)
}