import Watcher from '../observer/watcher.js'

export function initLifecycle(vm) {
    const options = vm.$options

    vm.$parent = parent
    vm.$root = parent ? parent.$root : vm

    vm.$children = []
    vm.$refs = {}
}

export function mountComponent(vm, el, hydrating) {
    //TODO
    vm.$el = el
    let updateComponent = () => {
        vm._update(vm._render(), hydrating)
    }

    new Watcher(vm, updateComponent, noop, {}, true /* isRenderWatcher */)
    hydrating = false

    if (vm.$vnode == null) {
        vm._isMounted = true
    }
    return vm

}

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
        const vm = this
        const prevEl = vm.$el
        const prevVnode = vm._vnode
        vm._vnode = vnode
        if (!prevVnode) {
            // initial render
            vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
        } else {
            // updates
            vm.$el = vm.__patch__(prevVnode, vnode)
        }
    }
}
