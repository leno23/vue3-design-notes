import { createRenderer } from "../runtime-core";
function createElement(type) {
    return document.createElement(type);
}

function patchProp(el, key, preVal, nextVal) {
    const isOn = (v: string) => /^on[A-Z]/.test(v)
    if (isOn(key)) {
        el.addEventListener(key.slice(2).toLowerCase(), nextVal)
    } else {
        if (nextVal == undefined || nextVal === null) {
            el.removeAttribute(key)
        } else {
            el.setAttribute(key, nextVal)
        }
    }
}

function insert(el, parent, anchor) {
    parent.insertBefore(el, anchor || null)
}

function remove(child) {
    let parent = child.parentNode
    if (parent) {
        parent.removeChild(child)
    }
}
function setElementText(el, text) {
    el.textContent = text
}

// 创建浏览器平台操作节点的API
export const render: any = createRenderer({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText
})

export function createApp(...args: any[]) {
    return render.createApp(...args)
}

export * from '../runtime-core'