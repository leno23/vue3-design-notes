import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js';
export const App = {
    // template
    render() {
        window.self = this
        return h("div", {
            id: "root",
            // class: ["red"]
        },
            [
                h("h4", {
                    class: 'red',
                    onClick() {
                        alert('click');
                    }
                }, 'inner'),
                h("h4", { class: 'blue' }, this.msg),
                h(Foo, {
                    count: 123
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