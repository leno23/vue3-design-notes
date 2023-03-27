import { NodeTypes } from './ast'
import { helperMapName, TO_DISPLAY_STRING } from './transforms/runtimeHelpers'

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
function genFunctionPreamble(ast, context) {
    const { push } = context
    const VueBinding = 'Vue'
    const aliasHelper = (s) => `${helperMapName[s]}: _${helperMapName[s]}`
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
        helper(key){
            return `_${helperMapName[key]}`
        }
    }
    return context
}
function genNode(node: any, context: any) {
    switch (node.type) {
        case NodeTypes.TEXT:
            genText(node, context)
            break
        case NodeTypes.INTERPOLATION:
            genInterpolation(node, context)
            break
        case NodeTypes.SIMPLE_EXPRESSION:
            genExpression(node, context)
            break
        default:
            break
    }
}
function genText(node, context) {

    const { push } = context
    push(`'${node.content}'`)
}

function genInterpolation(node, context) {
    const { push,helper } = context
    push(`${helper(TO_DISPLAY_STRING)}(`)
    genNode(node.content, context)
    push(')')
}

function genExpression(node, context) {
    const { push } = context
    push(`${node.content}`)

}