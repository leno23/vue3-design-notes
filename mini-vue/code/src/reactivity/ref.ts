import { hasChanged, isObject } from '../shared';
import { isTracking, trackEffects, triggerEffects } from './effect';
import { reactive } from './reactive';

// 单值类型无法使用Proxy监听变化，只能使用ES6 对象属性getter来做
class RefImple {
    private _value: any
    public dep;
    // 没有处理的原始值
    private _rawValue: any
    public __v_isRef
    constructor(value: any) {
        this._rawValue = value
        this._value = convert(value)
        this.dep = new Set()
        this.__v_isRef = true
    }
    get value() {
        trackRefValue(this)
        return this._value
    }
    set value(newValue: any) {
        // 值发生变更时，才进行更新
        if (hasChanged(newValue, this._rawValue)) {
            // 每次更新，记录下原始值，用于在下次更新时做对比使用
            this._rawValue = convert(newValue)
            this._value = isObject(newValue) ? reactive(newValue) : newValue;
            triggerEffects(this.dep)
        }
    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep)
    }
}

export function ref(value): any {
    return new RefImple(value)
}
export function isRef(ref): any {
    return !!ref.__v_isRef
}
export function unRef(ref): any {
    return isRef(ref) ? ref.value : ref
}