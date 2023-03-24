import { getCurrentInstance, h, nextTick, ref } from '../../lib/guide-mini-vue.esm.js'
export const App = {
    name: 'App',
    setup() {
        const count = ref(1)
        const instance = getCurrentInstance()
        const onClick = () => {
            for (let i = 0; i < 100; i++) {
                console.log('update');
                count.value = i
            }
            console.log(instance.vnode.el.innerText)
            nextTick(()=> {
                console.log(instance.vnode.el.innerText)

            })
        }
        return {
            count,
            onClick
        }
    },
    render() {
        return h('div', {}, [
            h('button', { onClick: this.onClick }, 'update'),
            h('p', {}, 'count:' + this.count)
        ])
    }
}