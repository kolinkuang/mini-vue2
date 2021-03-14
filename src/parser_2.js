// id="app" id='app' id=app
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
//标签名  <my-header></my-header>
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
// <my:header></my:header>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// <div
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// > />
const startTagClose = /^\s*(\/?)>/;
// </div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)


function parseHtmlToAst(html) {

    let text,
        root = null,
        currentParent,
        stack = []

    while (html) {
        let textEnd = html.indexOf('<')

        if (textEnd === 0) {
            const startTagMatch = parseStartTag()

            if (startTagMatch) {
                const {tagName, attrs} = startTagMatch
                start(tagName, attrs)
                continue
            }

            const endTagMatch = html.match(endTag)

            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }

        if (textEnd > 0) {
            text = html.substring(0, textEnd)
        }

        if (text) {
            advance(text.length)
            chars(text)
        }
    }

    function parseStartTag() {
        const start = html.match(startTagOpen)

        let end, attr

        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }

            advance(start[0].length)

            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })

                advance(attr[0].length)
            }

            if (end) {
                advance(end[0].length)
                return match
            }
        }
    }

    function advance(n) {
        html = html.substring(n)
    }

    function start(tagName, attrs) {
        const element = createASTElement(tagName, attrs)

        if (!root) {
            root = element
        }

        currentParent = element
        stack.push(element)
    }

    function end() {
        const element = stack.pop()
        currentParent = stack[stack.length - 1]

        if (currentParent) {
            element.parent = currentParent
            currentParent.children.push(element)
        }
    }

    function chars(text) {
        text = text.trim()

        if (text.length) {
            currentParent.children.push({
                type: 3,
                text
            })
        }

    }

    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            type: 1,
            children: [],
            attrs,
            parent: null
        }
    }

    return root

}

export default parseHtmlToAst


// const html = '<div id="demo">\n' +
//     ' <h1>Set/Delete</h1>\n' +
//     ' <p>{{obj.foo}}</p>\n' +
//     ' </div>'
// const ast = parseHtmlToAst(html)
// console.log(ast)
