import { NodeTypes } from '../src/ast'
import { baseParse } from '../src/parse'

describe('Parse', () => {

    describe('interpolation', () => {
        test('simple interpolation', () => {
            const ast = baseParse('{{ message }}')
            expect(ast.children[0]).toStrictEqual({
                type: NodeTypes.INTERPOLATION,
                content: {
                    type: NodeTypes.SIMPLE_EXPRESSION,
                    content: 'message'
                }
            })
        })

        test('it can have tag-like notation', () => {
            const ast = baseParse('{{ a<b }}')
            expect(ast.children[0]).toStrictEqual({
                type: NodeTypes.INTERPOLATION,
                content: {
                    type: NodeTypes.SIMPLE_EXPRESSION,
                    content: 'a<b'
                }
            })
        })

        test('it can have tag-like notation(2)', () => {
            const ast = baseParse("{{ '</div>' }}")
            expect(ast.children[0]).toStrictEqual({
                type: NodeTypes.INTERPOLATION,
                content: {
                    type: NodeTypes.SIMPLE_EXPRESSION,
                    content: "'</div>'"
                }
            })
        })
    })

    describe('element', () => {
        test('simple element div', () => {
            const ast = baseParse('<div></div>')
            expect(ast.children[0]).toStrictEqual({
                children:[],
                type: NodeTypes.ELEMENT,
                tag: 'div'
            })
        })
    })

    describe('text', () => {
        test('simple text', () => {
            const ast = baseParse('some text')
            expect(ast.children[0]).toStrictEqual({
                type: NodeTypes.TEXT,
                content: 'some text'
            })
        })
    })


    test('nested element', () => {
        const ast = baseParse('<div><p>hi,</p>{{message}}</div>')
        expect(ast.children[0]).toStrictEqual({
            type: NodeTypes.ELEMENT,
            tag: 'div',
            children: [
                {
                    type: NodeTypes.ELEMENT,
                    tag: 'p',
                    children: [
                        {
                            type: NodeTypes.TEXT,
                            content: 'hi,',
                        }
                    ]
                },
                {
                    type: NodeTypes.INTERPOLATION,
                    content: {
                        type: NodeTypes.SIMPLE_EXPRESSION,
                        content: 'message'
                    }
                }
            ]
        })
    })


    test('hello world', () => {
        const ast = baseParse('<div>hi,{{message}}</div>')
        expect(ast.children[0]).toStrictEqual({
            type: NodeTypes.ELEMENT,
            tag: 'div',
            children: [
                {
                    type: NodeTypes.TEXT,
                    content: 'hi,'
                },
                {
                    type: NodeTypes.INTERPOLATION,
                    content: {
                        type: NodeTypes.SIMPLE_EXPRESSION,
                        content: 'message'
                    }
                }
            ]
        })
    })

    
    test('should throw error when lack end tag', () => {
        expect(() => {
            baseParse('<div><span>asdsa</div>')
        }).toThrow('缺少结束标签:span') 
    })
    
    test('should throw error when lack end tag', () => {
        expect(() => {
            baseParse('<div><span>asdsa</div>')
        }).toThrow('缺少结束标签:span') 
    })
})