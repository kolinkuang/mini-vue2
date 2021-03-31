import parseHtmlToAst from './parser_2.js'
import generate from './generator.js'

function compileToRenderFunction(template) {
    const ast = parseHtmlToAst(template.trim())
    console.log('===== AST start =====')
    console.log(ast)
    console.log('===== AST end =====')
    const code = generate(ast)
    return {render: new Function(code)}
}

export default compileToRenderFunction
