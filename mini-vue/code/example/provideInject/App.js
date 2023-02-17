import { getCurrentInstance, h, inject, provide } from '../../lib/guide-mini-vue.esm.js';

const Provider = {
    name: 'Provider',
    setup() {
        provide('foo', 'fooVal')
        provide('bar', 'barVal')
    },
    render() {
        return h('div', {}, [h('p', {}, 'Provider'), h(ProviderTwo)])
    }
}


const ProviderTwo = {
    name: 'ProviderTwo',
    setup() {
        
        provide('foo', 'fooTwo')
        let foo = inject('foo',() => 'defaultFoo')
        let baz = inject('baz',() => 'defaultBaz')
        return {
            foo,
            baz
        }

    },
    render() {
        return h('div', {}, [h('p', {}, `ProviderTwo foo:${this.foo}---${this.baz}`), h(Consumer)])
    }
}
const Consumer = {
    name: 'Consumer',
    setup() {
        const foo = inject('foo')
        const bar = inject('bar')
        return {
            foo,
            bar
        }
    },
    render() {
        return h('div', {}, `Consumers: -  ${this.foo} - ${this.bar}`)
    }
}

export const App = {
    name: 'App',
    setup() {
        let ins = getCurrentInstance()
        console.log(ins);
    },
    render() {
        return h('div', {}, [
            h('p', {}, 'appInject'),
            h(Provider)
        ])
    }

}