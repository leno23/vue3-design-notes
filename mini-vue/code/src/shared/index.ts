export const extend = Object.assign

export const isObject = (val: any) => {
    return val !== null && typeof val === 'object'
}

export function isString(value:string) {
    return typeof value === 'string'
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

export const EMPTY_OBJ = {}

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
export function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
                p[i] = j;
                result.push(i);
                continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
                c = (u + v) >> 1;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                }
                else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}
