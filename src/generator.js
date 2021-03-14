/**
 * _c => createElement()
 * _v => createTextNode()
 * _s => {{name}} => _s(name)
 */
const defaultTagReg = /{{((?:.|\r?\n)+?)}}/g;

function formatProps(attrs) {
    let attrStr = ''
    attrs.forEach(attr => {
        if (attr.name === 'style') {
            const attrStyle = {}
            attr.value.split(';').map(style => {
                if (style) {
                    const [key, value] = style.split(':')
                    attrStyle[key] = value.trim()
                }
            })
            attr.value = attrStyle
        }
        attrStr += `${attr.name}: ${JSON.stringify(attr.value)},`
    })

    return `{${attrStr.slice(0, -1)}}`
}

function generateChild(astNode) {
    const type = astNode.type
    if (type === 1) {
        return generate(astNode)
    } else if (type === 3) {
        const text = astNode.text

        if (!defaultTagReg.test(text)) {
            return `_v(${JSON.stringify(text)})`
        }

        let match,
            index,
            lastIndex = defaultTagReg.lastIndex = 0,
            textArr = []

        while (match = defaultTagReg.exec(text)) {
            index = match.index
            if (index > lastIndex) {
                textArr.push(JSON.stringify(text.slice(lastIndex, index)))
            }

            textArr.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }

        if (lastIndex < text.length) {
            textArr.push(JSON.stringify(text.slice(lastIndex)))
        }

        return `_v(${textArr.join('+')})`
    }
}

function getChildren(ast) {
    const children = ast.children
    if (children) {
        return children.map(child => generateChild(child)).join(',')
    }
}

function generate(astNode) {
    let children = getChildren(astNode)
    let code = `_c(
                "${astNode.tag}",
                ${
        astNode.attrs.length
            ?
            formatProps(astNode.attrs)
            :
            "undefined"
    },
                ${
        children
            ?
            `${children}`
            :
            ''
    }
              )
            `
    return `with(this){return ${code}}`
}

export default generate

// const rawAst = JSON.parse('')
// const code = generate(rawAst)
// console.log(code)
//Expected:
//with(this){return _c('div',{attrs:{"id":"demo"}},[_c('h1',[_v("Set/Delete")]),_v(" "),_c('p',[_v(_s(obj.foo))])])}

//"with(this){return _c(
//                 "div",
//                 {id: "app"},
//                 _v(_s(counter))
//               )
//             }"
