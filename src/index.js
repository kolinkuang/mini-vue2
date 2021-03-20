import Watcher from './watcher.js'
import {observe, proxy} from './core.js'
import compileToRenderFunction from './compiler.js'

class Vue {

    constructor(options) {
        this.$options = options
        this.$data = options.data

        observe(this.$data)

        proxy(this)

        if (options.el) {
            this.$mount(options.el)
        }
    }

    $mount(el) {
        this.$el = document.querySelector(el)

        const options = this.$options
        if (!options.render &&
            this.$el &&
            this.$el.outerHTML
        ) {
            const template = this.$el.outerHTML
            options.render = compileToRenderFunction(template).render
        }

        const updateComponent = () => {
            const {render} = this.$options
            const vnode = render.call(this, this._c.bind(this))

            console.log(vnode)
            this._update(vnode)
        }

        this._c = this.$createElement
        this._v = this.createTextNode;
        this._s = this.toString;

        new Watcher(this, updateComponent)
    }

    // create vnode
    $createElement(tag, props, children) {
        return this.vnode(tag, props, children)
    }

    createTextNode(text) {
        return this.vnode(null, null, null, text)
    }

    toString(value) {
        if (value === null) {
            return value
        }

        return typeof value === 'object' ? JSON.stringify(value) : value
    }

    vnode(tag, props, children, text) {
        return {
            tag,
            props,
            children,
            text
        }
    }

    _update(vnode) {
        const prevVnode = this._vnode
        if (prevVnode) {
            // update
            this.__patch__(prevVnode, vnode)
        } else {
            // init
            this.__patch__(this.$el, vnode)
        }
    }

    __patch__(oldVnode, vnode) {
        if (oldVnode.nodeType) {
            // init
            const parent = oldVnode.parentElement
            const refElm = oldVnode.nextSibling

            const el = this.createElm(vnode)
            parent.insertBefore(el, refElm)
            parent.removeChild(oldVnode)
        } else {
            // update
            const el = vnode.el = oldVnode.el

            if (oldVnode.tag === vnode.tag) {
                const oldCh = oldVnode.children
                const newCh = vnode.children
                if (typeof newCh === 'string') {
                    if (typeof oldCh === 'string') {
                        if (oldCh !== newCh) {
                            el.textContent = newCh
                        }
                    } else {
                        el.textContent = newCh
                    }
                } else {
                    if (typeof oldCh === 'string') {
                        el.innerHTML = ''
                        newCh.forEach(child => {
                            el.appendChild(this.createElm(child))
                        })
                    } else {
                        this.updateChildren(el, oldCh, newCh)
                    }
                }
            }
        }

        this._vnode = vnode
    }

    createElm(vnode) {
        const el = document.createElement(vnode.tag)

        for (const key in vnode.props) {
            if (vnode.props.hasOwnProperty(key)) {
                el.setAttribute(key, vnode.props[key])
            }
        }

        if (vnode.children) {
            if (typeof vnode.children === 'string') {
                el.textContent = vnode.children
            } else if (Array.isArray(vnode.children)) {
                vnode.children.forEach(vnode => {
                    el.appendChild(this.createElm(vnode))
                })
            }
        }

        vnode.el = el
        return el
    }

    updateChildren(parentElm, oldCh, newCh) {
        const len = Math.min(oldCh.length, newCh.length)
        for (let i = 0; i < len; i++) {
            this.__patch__(oldCh[i], newCh[i])
        }

        if (newCh.length > oldCh.length) {
            newCh.slice(len).forEach(child => {
                const el = this.createElm(child)
                parentElm.appendChild(el)
            })
        } else if (newCh.length < oldCh.length) {
            oldCh.slice(len).forEach(child => {
                parentElm.removeChild(child.el)
            })
        }
    }
}

export default Vue
