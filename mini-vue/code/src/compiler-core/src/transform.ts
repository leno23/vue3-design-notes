import { NodeTypes } from './ast';
import { TO_DISPLAY_STRING } from './transforms/runtimeHelpers';

export function transform(root: any, options = {}) {
    const context = createTransformContext(root, options)
    traverseNode(root, context)

    createRootCodegen(root)

    root.helpers = [...context.helpers.keys()]
}

function createRootCodegen(root: any) {
    const child = root.children[0]
    if (child.type === NodeTypes.ELEMENT) {

        root.codegenNode = child.codegenNode
    } else {
        root.codegenNode = root.children[0]
    }
}

function createTransformContext(root: any, options: any) {
    const context = {
        root,
        nodeTransforms: options.nodeTransforms || [],
        helpers: new Map(),
        helper(key: string) {
            context.helpers.set(key, 1)
        }
    }
    return context
}

function traverseNode(node: any, context: any) {
    const nodeTransforms = context.nodeTransforms
    const exitFn: any = []
    for (let i = 0; i < nodeTransforms.length; i++) {
        const transform = nodeTransforms[i]
        const onExit = transform(node, context)
        if (onExit) exitFn.push(onExit)
    }
    switch (node.type) {
        case NodeTypes.INTERPOLATION:
            context.helper(TO_DISPLAY_STRING)
            break
        case NodeTypes.ROOT:
        case NodeTypes.ELEMENT:
            traverseChildren(node, context)
            break
        default:
            break
    }
    // 让nodeTransforms中一些方法从后往前执行
    let i = exitFn.length
    while (i--) {
        exitFn[i]()
    }
}

function traverseChildren(node: any, context: any) {
    const children = node.children;
    if (children) {
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            traverseNode(node, context)
        }
    }
}