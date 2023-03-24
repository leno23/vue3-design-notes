import { NodeTypes } from './ast'

const enum TagType {
    Start,
    End
}

export function baseParse(content) {
    const context = createParserContext(content)
    return createRoot(parseChildren(context))
}

// 解析模板中的所有类型
function parseChildren(context) {
    const nodes = []
    let node: any
    const s = context.source
    if (s.startsWith('{{')) {
        node = parseInterpolation(context)
    } else if (s[0] === '<') {
        // 以 <[a-z] 开头的字符命中element类型
        if (/[a-z]/i.test(s[1])) {
            node = parseElement(context)
        }
    }
    if (!node) {
        node = parseText(context)
    }
    nodes.push(node)
    return nodes
}

// 解析文本数据
function parseTextData(context: any, length: number) {
    const content = context.source.slice(0, length)
    advanceBy(context, length)
    return content

}

// 解析文本
function parseText(context: any) {
    const content = parseTextData(context, context.source.length)

    return {
        type: NodeTypes.TEXT,
        content
    }
}

// 解析插值
function parseInterpolation(context: any) {
    const openDelimiter: string = '{{'
    const closeDelimiter: string = '}}'

    const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)
    advanceBy(context, openDelimiter.length)

    const rawContentLength = closeIndex - openDelimiter.length
    const rawContent = parseTextData(context, rawContentLength)
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

function parseElement(context) {
    const element = parseTag(context, TagType.Start)
    parseTag(context, TagType.End)
    return element
}

function parseTag(context: any, type: TagType) {
    const match: any = /^<\/?([a-z]*)/i.exec(context.source)
    console.log(match);
    const tag = match[1]
    advanceBy(context, match[0].length)
    advanceBy(context, 1)
    if (type === TagType.End) return
    return {
        type: NodeTypes.ELEMENT,
        tag
    }
}
// 前进length步，代表当前处理了length个长度的字符了
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