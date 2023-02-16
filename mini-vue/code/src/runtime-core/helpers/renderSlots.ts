import { h } from '../h';
import { Fragment } from '../vnode';

export function renderSlots(slots: any, name: any, props: any) {
    const slot = slots[name];
    if (slot && typeof slot === 'function') {
        return h(Fragment, {}, slot(props))
    }
}