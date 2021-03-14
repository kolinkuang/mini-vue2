/**
 * The subject for all watchers to rely on.
 * **/
class Dep {

    constructor() {
        this.watchers = new Set()
    }

    addDep(watcher) {
        this.watchers.add(watcher)
    }

    notify() {
        this.watchers.forEach(watcher => watcher.update())
    }

}

export default Dep
