export const extend = Object.assign

export const isObject = (val: any) => {
    return val !== null && typeof val === 'object'
}

export const hasChanged = (val, newValue) => {
    return !Object.is(val, newValue)
}

export function hasOwn(val, key) {
    return Object.prototype.hasOwnProperty.call(val, key)
}

// 烤串命名转驼峰命名
export function camelize(str: string) {

    return str.replace(/-(\w)/g, (_, c: string) => {
        return c ? c.toUpperCase() : ''
    })
}

// 首字母大写
export function capitalize(str: string) {
    return str[0].toUpperCase() + str.slice(1);
}
