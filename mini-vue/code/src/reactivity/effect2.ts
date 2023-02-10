let activeEffect: any

class ReactiveEffect {
    private _fn: any
    scheduler: () => void
    onStop?: () => void
    deps = []
    constructor(fn: any, scheduler?: any) {
        this._fn = fn
        this.scheduler = scheduler
    }
    run() {
        activeEffect = this
        return this._fn()
    }
    stop() {
        if (this.onStop) {
            this.onStop()
        }
        cleanupEffect(this)
    }
}
function cleanupEffect(effect: any) {
    for (const dep of effect.deps) {
        dep.delete(effect)
    }
}
/**
 * targetMap {
 *    obj -> {
 *       key1: set(fn,fn2)
 *    }
 * }
 * 
 * 
 */
let targetMap = new Map()
export function track(target, key) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let deps = depsMap.get(key)
    if (!deps) {
        deps = new Set()
        depsMap.set(key, deps)
    }
    if (!activeEffect) return
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
}
export function trigger(target, key) {
    let depsMap = targetMap.get(target)
    let deps = depsMap.get(key)
    for (const effect of deps) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}
export function effect(fn, options?: any) {
    let _effect = new ReactiveEffect(fn)
    Object.assign(_effect, options)
    _effect.run()
    let runner: any = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}
export function stop(runner) {
    runner.effect.stop()
}