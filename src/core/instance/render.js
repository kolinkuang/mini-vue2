import { createElement } from '../vdom/create-element.js'

export function initRender(vm) {
    vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
    vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

    //TODO

}

export function renderMixin(Vue) {

    Vue.prototype._render = function() {
        const vm = this
        const { render, _parentVnode } = vm.$options
        vm.$vnode = _parentVnode

        let vnode
        try {
            vnode = render.call(vm._renderProxy, vm.$createElement)
        } catch (e) {
            console.error(e)
        } finally {

        }

        vnode.parent = _parentVnode
        return vnode
    }

}
