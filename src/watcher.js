import Dep from './dep.js';

class Watcher {

    constructor(vm, updateFn) {
        this.vm = vm
        this.getter = updateFn
        this.get()
    }

    get() {
        Dep.target = this
        this.getter.call(this.vm)
        Dep.target = null
    }

    update() {
        this.get()
    }

}

export default Watcher
