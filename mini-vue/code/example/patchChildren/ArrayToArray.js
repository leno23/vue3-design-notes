import { h, ref } from '../../lib/guide-mini-vue.esm.js';

/* 1.左侧对比
    (a b) c
    (a b) d e
*/
// const prev = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'), 
//     h('div', {key:'C'}, 'C'), 
// ]
// const next = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'), 
//     h('div', {key:'D'}, 'D'), 
//     h('div', {key:'E'}, 'E'), 
// ]

/* 1.左侧对比
    a (b c)
    d e (b c)
*/
// const prev = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'), 
//     h('div', {key:'C'}, 'C'), 
// ]
// const next = [
//     h('div', {key:'D'}, 'D'), 
//     h('div', {key:'E'}, 'E'), 
//     h('div', {key:'B'}, 'B'), 
//     h('div', {key:'C'}, 'C'), 
// ]

/*
3.新的比老的多，需要创建
(a b)
(a b) c
*/
const prev = [
    h('div', {key:'A'}, 'A'), 
    h('div', {key:'B'}, 'B'), 
]
const next = [
    h('div', {key:'D'}, 'D'), 
    h('div', {key:'C'}, 'C'), 
    h('div', {key:'A'}, 'A'), 
    h('div', {key:'B'}, 'B'), 
]

/*
3.新的比老的少，需要删除
(a b)
(a b) c
*/
// const prev = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'), 
//     h('div', {key:'C'}, 'C'), 
// ]
// const next = [
//     h('div', {key:'B'}, 'B'), 
//     h('div', {key:'C'}, 'C'), 
// ]
export default {
    name: 'ArrayToArray',
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