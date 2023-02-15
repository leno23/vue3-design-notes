import { h } from '../h';

export function renderSlots(slots: any, name: any, props: any) {
    const slot = slots[name];
    if (slot && typeof slot === 'function') {
        return h('div', {}, slot(props))
    }
}