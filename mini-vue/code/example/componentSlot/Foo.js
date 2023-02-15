import { h, renderSlots } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
    setup(props, { slots }) {
        console.log(slots);
        return {
            age: 10
        }
    },
    render() {
        console.log(this.$slots);
        const foo = h('p', {}, 'foo')
        // 具名插槽，通过name执行他渲染的位置
        // 作用于插槽：获取放在插槽上的组件的内部变量

        return h('div', {}, [
            renderSlots(this.$slots, 'header', { age: this.age }),
            foo,
            renderSlots(this.$slots, 'footer')
        ])
    }
}