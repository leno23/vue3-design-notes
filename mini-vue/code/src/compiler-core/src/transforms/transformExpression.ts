import { NodeTypes } from '../ast';

export function transformExpression(node) {
    if (node.type === NodeTypes.INTERPOLATION) {
        node.content = processExpressions(node.content);
    }
}

function processExpressions(node) {
    node.content = `_ctx.${ node.content }`
    return node
}