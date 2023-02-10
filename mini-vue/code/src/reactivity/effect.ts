import { extend } from '../shared'

let activeEffect: any = null
class ReactiveEffect {
    deps: any = []
    active = true
    onStop?: () => void
    private _fn: any
    scheduler?: () => void
    constructor(fn: any, scheduler: any) {
        this._fn = fn
        this.scheduler = scheduler
    }
    run() {
        activeEffect = this
        return this._fn()
    }
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
}

const targetMap = new Map()
export function track(target: any, key: any) {
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
    if (!activeEffect) return
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
}
export function trigger(target: any, key: any) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)

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