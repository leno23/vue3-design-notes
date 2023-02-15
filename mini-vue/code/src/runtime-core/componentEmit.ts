import { camelize, capitalize } from '../shared/index';

export function emit(instance:any, event:any, ...args:any[]) {
    console.log('emit', event);
    const { props } = instance;
    
    // eventKey转换成事件名
    const toHandlerKey = (str: string) => {
        return str ? 'on' + capitalize(camelize(str)) : ''
    }
    const handlerName = toHandlerKey(event)
    const handler = props[handlerName]
    handler && handler(...args)
}