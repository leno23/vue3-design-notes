import { h } from '../../lib/guide-mini-vue.esm.js'
export const App = {
    // template
    render() {
        window.self = this
        return h("div", {
            id: "root",
            // class: ["red"]
        },
            [
                h("h4", { class: 'red' }, 'inner'),
                h("h4", { class: 'blue' }, this.msg)
            ]
        )
    },
    setup() {
        return {
            msg: 'mini-vue2'
        }
    }
}