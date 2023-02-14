import { extend } from '../shared'

let activeEffect: any = null
let shouldTrack = false
export class ReactiveEffect {
    deps: any = []
    active = true
    onStop?: () => void
    private _fn: any
    // 允许外界自定义副作用函数
    scheduler?: () => void
    constructor(fn: any, scheduler?: any) {
        this._fn = fn
        this.scheduler = scheduler
    }
    run() {
        // 调用stop后时，不可以收集依赖 防止stop()之后，state.num++重新收集依赖导致stop失效
        if (!this.active) {
            return this._fn()
        }

        // 1.会收集依赖
        shouldTrack = true
        activeEffect = this
        const res = this._fn()
        // reset
        shouldTrack = false
        return res
    }
    // 同一个副作用依赖，stop只允许调用一次
    stop() {
        // 防止重复调用
        if (this.active) {
            cleanupEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }
    }
}
function cleanupEffect(effect: any) {

    for (let dep of effect.deps) {
        dep.delete(effect)
    }
    effect.deps.length = 0
}
export function isTracking() {
    return shouldTrack && activeEffect
}

const targetMap = new Map()
export function track(target: any, key: any) {
    if (!isTracking()) return
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }
    trackEffects(dep)
}
export  function trackEffects(dep){
    // 防止重复收集
    if (dep.has(activeEffect)) return
    // 依赖双向收集
    // 变量依赖那些副作用
    dep.add(activeEffect)
    // 副作用依赖那些变量
    activeEffect.deps.push(dep)
}

export function trigger(target: any, key: any) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)

    triggerEffects(dep)
}

export function triggerEffects(dep){
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}

export function effect(fn: any, options: any = {}) {
    const scheduler = options.scheduler
    const _effect = new ReactiveEffect(fn, scheduler)
    extend(_effect, options)
    _effect.run()

    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}

export function stop(runner: any) {
    runner.effect.stop()
}