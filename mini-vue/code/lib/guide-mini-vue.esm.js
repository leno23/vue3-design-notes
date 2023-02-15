const extend = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
function hasOwn(val, key) {
    return Object.prototype.hasOwnProperty.call(val, key);
}
// 烤串命名转驼峰命名
function camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : '';
    });
}
// 首字母大写
function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

const targetMap = new Map();
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

const get = createGetter();
const set = createSetter();
const readOnlyGet = createGetter(true);
const shallowReadonlyGetter = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, value) {
        const res = Reflect.get(target, key);
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        }
        else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter(isReadonly = false) {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
const mutableHanlders = {
    get,
    set,
};
const readonlyHanlders = {
    get: readOnlyGet,
    set(target, key, value) {
        console.warn(`key:${key}不能被修改，因为target是readonly的`);
        return true;
    }
};
const shallowReadonlyHanlders = extend({}, readonlyHanlders, {
    get: shallowReadonlyGetter
});

function createActiveObject(target, baseHandlers) {
    if (!isObject(target)) {
        console.warn(`target is-->${target},not a object`);
        return target;
    }
    return new Proxy(target, baseHandlers);
}
var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REACTIVE"] = "__v_isReactive";
    ReactiveFlags["IS_READONLY"] = "__v_isReadonly";
})(ReactiveFlags || (ReactiveFlags = {}));
function reactive(raw) {
    return createActiveObject(raw, mutableHanlders);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHanlders);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHanlders);
}

function emit(instance, event, ...args) {
    console.log('emit', event);
    const { props } = instance;
    // eventKey转换成事件名
    const toHandlerKey = (str) => {
        return str ? 'on' + capitalize(camelize(str)) : '';
    };
    const handlerName = toHandlerKey(event);
    const handler = props[handlerName];
    handler && handler(...args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

const publicPropertiesMap = {
    $el: i => i.vnode.el
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: () => { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
// 初始化组件
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    // initSlots
    // 
    // 初始化有状态的组件
    setupStatefulComponent(instance);
}
// 初始化有状态的组件
function setupStatefulComponent(instance) {
    // 获取到用户的配置
    const { vnode } = instance;
    const Component = vnode.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
        // 可以返回function作为render函数 或 object 作为组件状态
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        handleSetuoResult(instance, setupResult);
    }
}
// 处理组件状态
function handleSetuoResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        // 组件状态保存在setupState属性上
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
// 设置render函数
function finishComponentSetup(instance) {
    const component = instance.type;
    instance.render = component.render;
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    // 处理不同类型的元素
    // console.log(vnode);
    const { shapeFlag } = vnode;
    if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        processElement(vnode, container);
    }
    else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
// 挂载Element类型元素
function mountElement(vnode, container) {
    const { type, props, children } = vnode;
    const el = document.createElement(type);
    vnode.el = el;
    const { shapeFlag } = vnode;
    if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        mountChildren(vnode, el);
    }
    const isOn = (v) => /^on[A-Z]/.test(v);
    for (const key in props) {
        const val = props[key];
        if (isOn(key)) {
            el.addEventListener(key.slice(2).toLowerCase(), val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    container.appendChild(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(child => {
        patch(child, container);
    });
}
// 处理组件类型
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
// 挂载组件
function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    // vnode
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container);
    // 深度优先遍历，此处会完成元素的挂载
    initialVNode.el = subTree.el;
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null
    };
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string' ?
        1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
