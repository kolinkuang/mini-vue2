export function observe (value, asRootData) {
    if (typeof value !== 'object') {
        return
    }
    // 获取一个 Ob 实例
    let ob = null
    // 响应式对象已经拥有了 Ob ，直接返回
    if ('__ob__' in value) {
        ob = value.__ob__
    } else {
        // 初始化时需要创建
        ob = new Observer(value)
    }
    return ob
}

export class Observer {

    constructor (value) {
        this.value = value
        // 内部还创建了一个 Dep 实例，负责变更通知
        // dep.notify() => watcher.update() => componentUpdate() =>
        // render() => _update() => patch()
        this.dep = new Dep()

        // 响应式对象上附加 __ob__， 指向当前 Observer 实例
        Object.defineProperty(value, '__ob__', this)
        if (Array.isArray(value)) {
            value.__proto__ = arrayMethods
            this.observeArray(value)
        } else {
            this.walk(value)
        }

        console.log('Observer instance created')
    }

    walk (obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }

    observeArray (items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }
}
