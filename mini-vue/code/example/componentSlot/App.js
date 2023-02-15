import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
    name: "App",
    /**
    <Foo> 
        <p>slot element</p>
        <p>slot element2</p>
    </Foo>
    
    */
    render() {
        const app = h('div', {}, 'App')
        const foo = h(Foo, {}, {
            header: ({ age }) => h('p', {}, 'header --' + age),
            footer: () => h('p', {}, 'footer'),
        })
        return h('div', {}, [app, foo])
    },
    setup() {
        return {}
    }
}