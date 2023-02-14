import { computed } from '../computed'
import { reactive } from '../reactive'

describe('computed', () => {
    it('happy path', () => {
        const user = reactive({
            age: 1
        })
        const age = computed(()=>{
            return user.age
        })
        expect(age.value).toBe(1)
    })
    it('should compute lazily', () => {
        const value = reactive({
            foo:1
        })
        const getter = jest.fn(() => {
            return value.foo
        })
        // computed是懒加载的，初始化不会执行getter
        const cValue = computed(getter)
        expect(getter).not.toHaveBeenCalled()

        // 获取computed的值时，会执行getter
        expect(cValue.value).toBe(1)
        expect(getter).toHaveBeenCalledTimes(1)

        // 重复获取computed的值，getter不会重复执行
        cValue.value
        expect(getter).toHaveBeenCalledTimes(1)

        // 依赖项发生变化，getter重新执行
        value.foo=2
        expect(getter).toHaveBeenCalledTimes(1)

        // expect(cValue.value).toBe(2)
        // expect(getter).not.toHaveBeenCalledTimes(2)

        // cValue.value
        // expect(getter).toHaveBeenCalledTimes(2)

    })
})
