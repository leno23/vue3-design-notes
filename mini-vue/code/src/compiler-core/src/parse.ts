import { NodeTypes } from './ast'

export function baseParse(content) {
    const context = createParserContext(content)
    return createRoot(parseChildren(context))
}

// 解析模板中的所有类型
function parseChildren(context) {
    const nodes = []
    let node: any
    if (context.source.startsWith('{{')) {
        node = parseInterpolation(context)
    }
    nodes.push(node)
    return nodes
}

function parseInterpolation(context: any) {
    const openDelimiter: string = '{{'
    const closeDelimiter: string = '}}'

    const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)
    advanceBy(context, openDelimiter.length)

    const rawContentLength = closeIndex - openDelimiter.length
    const rawContent = context.source.slice(0, rawContentLength)
    const content = rawContent.trim()

    advanceBy(context, rawContentLength + closeDelimiter.length)
    console.log(context.source);

    return {
        type: NodeTypes.INTERPOLATION,
        content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content
        }
    }
}
function advanceBy(context: any, length: number) {
    context.source = context.source.slice(length)
}

function createRoot(children) {
    return {
        children
    }
}

// 创建上下文
function createParserContext(content) {
    return {
        source: content
    }
}