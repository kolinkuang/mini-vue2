import Watcher from './watcher.js'
import {observe, proxy} from './core.js'

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

        const updateComponent = () => {
            // TODO how to generate render()?
            const {render} = this.$options
            const vnode = render.call(this, this.$createElement)
            this._update(vnode)
        }

        new Watcher(this, updateComponent)
    }

    $createElement(tag, props, children) {
        return {tag, props, children}
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
            } else {
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
