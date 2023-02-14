import { reactive } from '../reactive'
import { effect, stop } from '../effect'


describe("effect", () => {
    it("happy path", () => {
        const user = reactive({
            age: 10
        })
        let next
        effect(() => {
            next = user.age + 1
        })
        expect(next).toBe(11)

        user.age++
        expect(next).toBe(12)
    })

    it('should return runner when call effect', () => {
        let foo = 10
        const runner = effect(() => {
            foo++
            return 'foo'
        })
        expect(foo).toBe(11)

        const r = runner()
        expect(foo).toBe(12)
        expect(r).toBe("foo")
    })

    it('scheduler', () => {
        /*
        1.通过effect的第二个参数给定的一个scheduler的fn
        2.effect第一次执行的时候，还会执行fn
        3.当响应式对象set update时 不会执行fn 而是执行scheduler
        4.如果说当执行runner的时候，会再次执行fn
         */
        let dummy
        let run: any
        const scheduler = jest.fn(() => {
            run = runner
        })
        const obj = reactive({ foo: 1 })
        const runner = effect(() => {
            dummy = obj.foo
        }, {
            scheduler
        })
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)

        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)

        expect(dummy).toBe(1)
        run()
        expect(dummy).toBe(2)
    })

    it('stop', () => {
        let dummy
        const obj = reactive({ props: 1 })
        const runner = effect(() => {
            dummy = obj.prop
        })
        obj.prop = 2
        expect(dummy).toBe(2)
        stop(runner)
        // obj.prop = 3
        // obj.prop = obj.prop + 1 触发get操作重新收集依赖，导致stop失效
        obj.prop++
        expect(dummy).toBe(2)

        runner()
        expect(dummy).toBe(3)
    })
    // 支持onStop钩子
    it("onStop", () => {
        const obj = reactive({ foo: 1 })
        const onStop = jest.fn()
        let dummy
        const runner = effect(() => {
            dummy = obj.foo
        }, {
            onStop
        })
        stop(runner)
        expect(onStop).toBeCalledTimes(1)
    })
})
