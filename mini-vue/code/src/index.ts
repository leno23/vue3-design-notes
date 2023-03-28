
export * from './runtime-dom'

import * as runtimeDom from './runtime-dom'
import { registerRuntimeCompiler } from './runtime-dom'
import { baseCompile } from './compiler-core/src/transforms/compile'

function compileToFunction(template: string) {
    const { code }: any = baseCompile(template)
    
    const render = new Function('Vue', code)(runtimeDom)
    return render
}

registerRuntimeCompiler(compileToFunction)