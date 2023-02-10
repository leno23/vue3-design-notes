import { readonly } from '../reactive';

describe('readonly',() => {
    it("happy path",() => {
        const original = {foo:1}
        const obsered = readonly(original)
        expect(obsered).not.toBe(original)
        expect(obsered.foo).toBe(1)
    })

    it('warn then call set',() => {
        console.warn = jest.fn()
        const user = readonly({
            age:10
        })
        user.age = 11
        expect(console.warn).toBeCalledTimes(1)
    })
})