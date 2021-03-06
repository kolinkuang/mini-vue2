export function stateMixin(Vue) {

    //TODO

}

export function initState(vm) {
    //TODO
    vm._watchers = []
    const opts = vm.$options
    if (opts.props) {
        initProps(vm, opts.props)
    }
    if (opts.methods) {
        initMethods(vm, opts.methods)
    }
    if (opts.data) {
        initData(vm)
    } else {
        observe(vm._data = {}, true /* asRootData */)
    }
    if (opts.computed) {
        initComputed(vm, opts.computed)
    }
    if (opts.watch) {
        initWatch(vm, opts.watch)
    }
}

function initProps(vm, props) {}
function initMethods(vm, methods) {}
function initData(vm) {}
function initComputed(vm, computed) {}
function initWatch(vm, watch) {}
