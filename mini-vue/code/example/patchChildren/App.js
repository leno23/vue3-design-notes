import { h, ref } from '../../lib/guide-mini-vue.esm.js'
import ArrayToText from './ArrayToText.js'
import TextToText from './TextToText.js'
import TextToArray from './TextToArray.js'

export const App = {
    setup() {
        return {}
    },
    render() {
        return h('div', {},
            [
                h('p', {}, '主页'),
                // h(ArrayToText),
                h(TextToArray),
                // h(TextToText),
                h('button', {
                    onClick() {
                        window.isChange.value = !window.isChange.value
                    }
                },'click')
            ]
        )
    }
}