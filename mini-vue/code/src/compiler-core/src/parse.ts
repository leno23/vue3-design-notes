import { NodeTypes } from './ast'

const enum TagType {
    Start,
    End
}
export function baseParse(content: string) {
    const context = createParserContext(content)
    return createRoot(parseChildren(context, []))
}

// 解析模板中的所有类型的节点
function parseChildren(context: any, ancestors: any[]) {
    const nodes = []
    while (!isEnd(context, ancestors)) {

        let node: any
        const s = context.source
        if (s.startsWith('{{')) {
            node = parseInterpolation(context)
        } else if (s[0] === '<') {
            // 以 <[a-z] 开头的字符命中element类型
            if (/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestors)
            }
        }
        if (!node) {
            node = parseText(context)
        }
        nodes.push(node)
    }
    return nodes
}

// 是否以结束标签结尾，或者字符消费完了
function isEnd(context: any, ancestors: any[]) {
    const s = context.source
    if (s.startsWith('</')) {
        for (let i = ancestors.length - 1; i >= 0; i--) {
            const tag = ancestors[i].tag

            if (startsWithEndTagOpen(s, tag)) {
                return true
            }
        }
    }
    // if (parentTag && s.startsWith(`</${parentTag}>`))
    //     return 1
    return !s
}

// 解析文本数据
function parseTextData(context: any, length: number) {

    const content = context.source.slice(0, length)
    advanceBy(context, length)
    return content

}

// 解析文本
function parseText(context: any) {
    let endIndex = context.source.length
    console.log(context.source);

    const endToken = ['<', '{{']
    for (let i = 0; i < endToken.length; i++) {

        const index = context.source.indexOf(endToken[i])
        if (index !== -1 && endIndex > index) {
            endIndex = index
        }
    }
    const content = parseTextData(context, endIndex)
    // console.log('--------', content);

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

    advanceBy(context, closeDelimiter.length)

    return {
        type: NodeTypes.INTERPOLATION,
        content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content
        }
    }
}

function parseElement(context: any, ancestors: any[]) {
    const element: any = parseTag(context, TagType.Start)
    ancestors.push(element)
    element.children = parseChildren(context, ancestors)
    ancestors.pop()
    if (startsWithEndTagOpen(context.source, element.tag)) {

        parseTag(context, TagType.End)
    } else {
        throw new Error(`缺少结束标签:${element.tag}`)
    }
    return element
}
function startsWithEndTagOpen(context: any, tag: string) {
    return context.source.slice(2, 2 + tag.length) === tag
}

function parseTag(context: any, type: TagType) {
    const match: any = /^<\/?([a-z]*)/i.exec(context.source)

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

function createRoot(children: any) {
    return {
        children
    }
}

// 创建上下文
function createParserContext(content: string) {
    return {
        source: content
    }
}