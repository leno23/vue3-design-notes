import { createRenderer } from "../runtime-core";
function createElement(type) {
    return document.createElement(type);
}

function patchProp(el, key, val) {
    const isOn = (v: string) => /^on[A-Z]/.test(v)
    if (isOn(key)) {
        el.addEventListener(key.slice(2).toLowerCase(), val)
    } else {
        el.setAttribute(key, val)
    }
}

function insert(el, parent) {
    parent.appendChild(el)
}

export const render: any = createRenderer({
    createElement,
    patchProp,
    insert
})

export function createApp(...args:any[]) {
    return render.createApp(...args)
}

export * from '../runtime-core'