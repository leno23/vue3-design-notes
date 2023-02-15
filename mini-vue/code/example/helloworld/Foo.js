import { h } from '../../lib/guide-mini-vue.esm.js';

export const Foo = {
    setup(props, { emit }) {
        console.log(props);
        function emitAdd() {
            console.log('emitAdd');
            emit('trigger-add', 1, 2)
        }
        return {
            emitAdd
        }
    },
    render() {
        const btn = h('button', {
            onClick: this.emitAdd
        }, 'emitAdd')
        return h("div", {}, [btn])
    }
}