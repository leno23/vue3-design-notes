import { mutableHanlders, readonlyHanlders } from './baseHandlers'

function createActiveObject(raw,baseHandlers){
    return new Proxy(raw, baseHandlers)

}
export enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly"
}

export function reactive(raw: any) {
    return createActiveObject(raw, mutableHanlders)
}
export function readonly(raw:any) {
    return createActiveObject(raw, readonlyHanlders)
}
export function isReactive(value:any){
    return !!value[ReactiveFlags.IS_REACTIVE]
}
export function isReadonly(value:any){
    return !!value[ReactiveFlags.IS_READONLY]
}