import {initProxy} from './proxy.js'
import {initState} from './state.js'
import {initRender} from './render.js'
import {initEvents} from './events.js'
import {initLifecycle} from './lifecycle.js'

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        vm._isVue = true
        // 1.选项合并：系统默认选项和用户选项
        if (options && options._isComponent) {
            initInternalComponent(vm, options)
        } else {
            // vm.$options = mergeOptions(options, vm)
            vm.$options = {}
        }

        initProxy(vm)

        // 核心初始化过程
        vm._self = vm
        initLifecycle(vm)
        initEvents(vm)
        initRender(vm)
        initState(vm)

        // 如果设置了 $el，则直接调用 $mount
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
}

function initInternalComponent(vm, options) {
    const opts = vm.$options = Object.create(vm.constructor.options)
    // const parentVnode = options._parentVnode
    // opts.parent = options.parent
    // opts._parentVnode = parentVnode

    if (options.render) {
        opts.render = options.render
    }
}
