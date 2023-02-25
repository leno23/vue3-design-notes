import { h, ref } from '../../lib/guide-mini-vue.esm.js'
import ArrayToText from './ArrayToText.js'

export const App = {
    setup() {
        return {}
    },
    render() {
        return h('div', {},
            [
                h('p', {}, '主页'),
                h(ArrayToText)
            ]
        )
    }
}