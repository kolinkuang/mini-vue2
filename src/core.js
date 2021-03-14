import Observer from './observer.js';
import Dep from './dep.js';

function observe(obj) {
    if (typeof obj !== 'object') {
        return
    }

    new Observer(obj)
}

function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },

            set(val) {
                vm.$data[key] = val
            }
        })
    })
}

function defineReactive(obj, key, val) {
    observe(val)

    const dep = new Dep()

    Object.defineProperty(obj, key, {
        get() {
            Dep.target && dep.addDep(Dep.target)
            return val
        },

        set(newVal) {
            if (newVal !== val) {
                observe(newVal)
                val = newVal
                dep.notify()
            }
        }
    })

}

export {observe, proxy, defineReactive}
