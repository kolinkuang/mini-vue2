import {defineReactive} from './core.js';

class Observer {

    constructor(value) {
        this.walk(value)
    }

    walk(obj) {
        Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
    }

}

export default Observer
