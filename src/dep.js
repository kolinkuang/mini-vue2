class Dep {

    constructor() {
        this.deps = new Set()
    }

    addDep(watcher) {
        this.deps.add(watcher)
    }

    notify() {
        this.deps.forEach(watcher => watcher.update())
    }

}

export default Dep
