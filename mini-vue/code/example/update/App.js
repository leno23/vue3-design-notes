import { h, ref } from '../../lib/guide-mini-vue.esm.js'
export const App = {
    // template
    render() {
        window.self = this
        return h("div", {
            id: "root",
            ...this.props
        },
            [
                h('div', {}, 'count:' + this.count),
                h('button', { onClick: this.onClick }, 'click'),
                h('button', { onClick: this.changeProps1 }, 'change Props 值改变 修改'),
                h('button', { onClick: this.changeProps2 }, 'change Props 值变成undefined/null 删除'),
                h('button', { onClick: this.changeProps3 }, 'change Props 值改变 修改'),
            ]
        )
    },
    setup() {
        const count = ref(0)
        const props = ref({
            foo:'foo',
            bar:'bar'
        })
        const onClick = () => {
            count.value++
        }
        const changeProps1 = () => {
            props.value.foo = 'newfoo'
        }
        const changeProps2 = () => {
            props.value.foo = undefined

        }
        const changeProps3 = () => {
            props.value = {
                foo:'foo'
            }
        }
        return {
            count,
            props,
            onClick,
            changeProps1,
            changeProps2,
            changeProps3,
        }
    }
}