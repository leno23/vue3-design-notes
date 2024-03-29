import { h, ref } from '../../lib/guide-mini-vue.esm.js';

const next = 'newChildren'
const prev = [h('div', {}, 'A'), h('div', {}, 'B')]

export default {
    name: 'ArrayToText',
    setup() {
        const isChange = ref(false)
        window.isChange = isChange
        return {
            isChange
        }
    },
    render() {
        return this.isChange ? h('div', {}, next) : h('div', {}, prev)
    }
}