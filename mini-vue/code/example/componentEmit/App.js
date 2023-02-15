import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js';
export const App = {
    // template
    render() {
        window.self = this
        return h("div", {
            id: "root",
        },
            [
                h(Foo, {
                    count: 123,
                    onTriggerAdd(...arg) {
                        console.log('onAdd', arg);
                    }
                })
            ]
        )
    },
    setup() {
        return {
            msg: 'mini-vue2'
        }
    }
}