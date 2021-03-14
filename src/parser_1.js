// id="app" id='app' id=app
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

//标签名  <my-header></my-header>
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`

// <my:header></my:header>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`

// <div
const startTagOpen = new RegExp(`^<${qnameCapture}`)

// > />
const startTagClose = /^\s*(\/?)>/

// </div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

/**
 <div id="demo">
 <h1>Set/Delete</h1>
 <p>{{obj.foo}}</p>
 </div>
 */
function parseHtmlToAst(html) {
    const stack = []
    let index = 0
    let last, lastTag
    let root = null, currentParent

    while (html) {
        last = html
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            // End tag:
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                parseEndTag(endTagMatch[1])
                continue
            }

            // Start tag:
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                handleStartTag(startTagMatch)
                continue
            }
        }

        let text, rest, next
        if (textEnd >= 0) {
            rest = html.slice(textEnd)
            while (
                !endTag.test(rest) &&
                !startTagOpen.test(rest)
                ) {
                // < in plain text, be forgiving and treat it as text
                next = rest.indexOf('<', 1)
                if (next < 0) break
                textEnd += next
                rest = html.slice(textEnd)
            }
            text = html.substring(0, textEnd)
        }

        if (textEnd < 0) {
            text = html
        }

        if (text) {
            advance(text.length)
        }

        if (html === last) {
            break
        }
    }

    // Clean up any remaining tags
    parseEndTag()

    return root


    function advance(n) {
        index += n
        html = html.substring(n)
    }

    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
                start: index
            }
            advance(start[0].length)
            let end, attr
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                attr.start = index
                advance(attr[0].length)
                attr.end = index
                match.attrs.push(attr)
            }
            if (end) {
                match.unarySlash = end[1]
                advance(end[0].length)
                match.end = index
                return match
            }
        }
    }

    function handleStartTag(match) {
        const tagName = match.tagName
        const l = match.attrs.length
        const attrs = new Array(l)
        for (let i = 0; i < l; i++) {
            const args = match.attrs[i]
            const value = args[3] || args[4] || args[5] || ''
            attrs[i] = {
                name: args[1],
                value
            }
        }

        stack.push({
            tag: tagName,
            lowerCasedTag: tagName.toLowerCase(),
            attrs,
            start: match.start,
            end: match.end
        })
        lastTag = tagName

        start(tagName, attrs)
    }

    function start(tag, attrs) {
        const element = createASTElement(tag, attrs, currentParent)

        if (!root) {
            root = element
        }

        currentParent = element
        stack.push(element)
    }

    function createASTElement(
        tag,
        attrs,
        parent
    ) {
        return {
            type: 1,
            tag,
            attrsList: attrs,
            // rawAttrsMap: {},
            parent,
            children: []
        }
    }

    function parseEndTag(tagName) {
        let pos, lowerCasedTagName

        // Find the closest opened tag of the same type
        if (tagName) {
            lowerCasedTagName = tagName.toLowerCase()
            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                    break
                }
            }
        } else {
            // If no tag name is provided, clean shop
            pos = 0
        }

        if (pos >= 0) {
            // Remove the open elements from the stack
            stack.length = pos
            lastTag = pos && stack[pos - 1].tag
        }
    }

}

export default parseHtmlToAst

// const html = '<div id="demo">\n' +
//     ' <h1>Set/Delete</h1>\n' +
//     ' <p>{{obj.foo}}</p>\n' +
//     ' </div>'
// const ast = parseHtmlToAst(html)
// console.log(ast)
