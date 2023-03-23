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
// const prev = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'), 
// ]
// const next = [
//     h('div', {key:'D'}, 'D'), 
//     h('div', {key:'C'}, 'C'), 
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'), 
// ]

/*
3.新的比老的少，需要删除
(a b)
(a b) c
*/
// const prev = [
//     h('div', {key:'A'}, 'A'), 
//     h('div', {key:'B'}, 'B'), 
//     h('div', {key:'C'}, 'C'), 
//     h('div', {key:'D'}, 'D'), 
// ]
// const next = [
//     h('div', {key:'B'}, 'B'), 
//     h('div', {key:'C'}, 'C'), 
// ]
/*
中间部分对比
a b (c d) f g
a b (e c) f g
d需要删除 c的props发生变化
*/
// const prev = [
//     h('div', { key: 'A' }, 'A'),
//     h('div', { key: 'B' }, 'B'),
//     h('div', { key: 'C', id: 'c-prev' }, 'C'),
//     h('div', { key: 'D' }, 'D'),
//     h('div', { key: 'F' }, 'F'),
//     h('div', { key: 'G' }, 'G'),
// ]
// const next = [
//     h('div', { key: 'A' }, 'A'),
//     h('div', { key: 'B' }, 'B'),
//     h('div', { key: 'E' }, 'E'),
//     h('div', { key: 'C', id: 'c-next' }, 'C'),
//     h('div', { key: 'F' }, 'F'),
//     h('div', { key: 'G' }, 'G'),
// ]

// test toBePatched优化点
/*

a b (c d e) f g
a b (d c) f g

*/
// const prev = [
//     h('div', { key: 'A' }, 'A'),
//     h('div', { key: 'B' }, 'B'),
//     h('div', { key: 'C', id: 'c-prev' }, 'C'),
//     h('div', { key: 'D' }, 'D'),
//     h('div', { key: 'E' }, 'E'),
//     h('div', { key: 'F' }, 'F'),
//     h('div', { key: 'G' }, 'G'),
// ]
// const next = [
//     h('div', { key: 'A' }, 'A'),
//     h('div', { key: 'B' }, 'B'),
//     h('div', { key: 'D' }, 'D'),
//     h('div', { key: 'C', id: 'c-next' }, 'C'),
//     h('div', { key: 'F' }, 'F'),
//     h('div', { key: 'G' }, 'G'),
// ]

/*
5.中间部分需要移动

a b (c d e) f g
a b (e c d) f g
*/

// const prev = [
//     h('div', { key: 'A' }, 'A'),
//     h('div', { key: 'B' }, 'B'),
//     h('div', { key: 'C', id: 'c-prev' }, 'C'),
//     h('div', { key: 'D' }, 'D'),
//     h('div', { key: 'E' }, 'E'),
//     h('div', { key: 'F' }, 'F'),
//     h('div', { key: 'G' }, 'G'),
// ]
// const next = [
//     h('div', { key: 'A' }, 'A'),
//     h('div', { key: 'B' }, 'B'),
//     h('div', { key: 'E' }, 'E'),
//     h('div', { key: 'C', id: 'c-next' }, 'C'),
//     h('div', { key: 'D' }, 'D'),
//     h('div', { key: 'F' }, 'F'),
//     h('div', { key: 'G' }, 'G'),
// ]
/*
5.中间部分需要 创建


a b (c d e) f g
a b (e c d) f g
*/
// const prev = [
//     h('div', { key: 'A' }, 'A'),
//     h('div', { key: 'B' }, 'B'),
//     h('div', { key: 'C' }, 'C'),
//     h('div', { key: 'D' }, 'D'),
//     h('div', { key: 'E' }, 'E'),
//     h('div', { key: 'H' }, 'H'),
//     h('div', { key: 'F' }, 'F'),
//     h('div', { key: 'G' }, 'G'),
// ]
// const next = [
//     h('div', { key: 'A' }, 'A'),
//     h('div', { key: 'B' }, 'B'),
//     h('div', { key: 'E' }, 'E'),
//     h('div', { key: 'C', id: 'c-next' }, 'C'),
//     h('div', { key: 'M' }, 'M'),
//     h('div', { key: 'D' }, 'D'),
//     h('div', { key: 'F' }, 'F'),
//     h('div', { key: 'G' }, 'G'),
// ]

const prev = [
    h('div', {}, 'A'),
    h('div', {}, 'B'),
    h('div', {}, 'C'),
    h('div', {}, 'D')
]
const next = [
    h('div', {}, 'A'),
    h('div', {}, 'C'),
    h('div', {}, 'B'),
    h('div', {}, 'D')
]

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