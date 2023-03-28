import { isString } from '../../shared'
import { NodeTypes } from './ast'
import { CREATE_ELEMENT_VNODE, helperMapName, TO_DISPLAY_STRING } from './transforms/runtimeHelpers'

export function generate(ast: any) {
    const context = createCodegenContext()
    const { push } = context


    genFunctionPreamble(ast, context)
    const functionName = 'render'
    const args = ['_ctx', '_cache']
    const signature = args.join(', ')
    push(`function ${functionName}(${signature}){`)

    push(`\nreturn `)
    const node = ast.codegenNode
    genNode(node, context)
    push('\n}')

    return {
        code: context.code,
    }
}

// 获取导入的Vue内部方法
function genFunctionPreamble(ast: any, context: any) {
    const { push } = context
    const VueBinding = 'Vue'
    const aliasHelper = (s: any) => `${helperMapName[s]}: _${helperMapName[s]}`
    if (ast.helpers.length > 0) {
        push(`const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBinding}`)
    }

    push('\nreturn ')
}

function createCodegenContext() {
    const context = {
        code: '',
        push(source: string) {
            context.code += source
        },
        helper(key: string) {
            return `_${helperMapName[key]}`
        }
    }
    return context
}
function genNode(node: any, context: any) {
    switch (node.type) {
        // 文本类型 hi
        case NodeTypes.TEXT:
            genText(node, context)
            break
        // 插值类型 {{message}}
        case NodeTypes.INTERPOLATION:
            genInterpolation(node, context)
            break
        // 简单表达式类型
        case NodeTypes.SIMPLE_EXPRESSION:
            genExpression(node, context)
            break
        // 元素类型 <div></div>
        case NodeTypes.ELEMENT:
            genElement(node, context)
            break
        // 复合类型
        case NodeTypes.COMPOUND_EXPRESSION:
            genCompoundExpression(node, context)
            break
        default:
            break
    }
}
function genText(node: any, context: any) {

    const { push } = context
    push(`'${node.content}'`)
}

function genInterpolation(node: any, context: any) {
    const { push, helper } = context
    push(`${helper(TO_DISPLAY_STRING)}(`)
    genNode(node.content, context)
    push(')')
}

function genExpression(node: any, context: any) {
    const { push } = context
    push(`${node.content}`)

}

function genElement(node: any, context: any) {
    const { push, helper } = context
    const { tag, children, props } = node
    push(`${helper(CREATE_ELEMENT_VNODE)}(`)
    genNodeList(genNullable([tag, props, children]), context)
    // genNode(child, context)
    push(')')
}

function genNodeList(nodes, context) {
    const { push } = context
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (isString(node)) push(node)
        else genNode(node, context)

        if (i < nodes.length - 1) push(', ')
    }
}

// 把一些空值替换成null
function genNullable(args: any) {
    return args.map(arg => arg || 'null')
}

// 复合类型表达式
function genCompoundExpression(node: any, context: any) {
    const { children } = node
    const { push } = context
    for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (isString(child)) {
            push(child)
        } else {
            genNode(child, context)
        }
    }
}