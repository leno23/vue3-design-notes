import { ReactiveEffect } from './effect'

class ComputedRefImpl{
    private _getter:any
    // 是否需要重新计算
    private _dirty = true
    private _value:any
    private _effect:any
    constructor(getter){
        this._getter = getter
        // 当computed的依赖项发生变化时，执行schduler
        this._effect = new ReactiveEffect(getter,() => {
            // 依赖项变化时，需要能够重新执行getter
            if(!this._dirty){
                this._dirty = true
            }
        })
    }
    // 防止getter多次调用
    get value(){
        if (this._dirty) {
            this._dirty = false
            this._value = this._effect.run()
        }
        return this._value
    }


}


export function computed(getter): any {
    return new ComputedRefImpl(getter)
}