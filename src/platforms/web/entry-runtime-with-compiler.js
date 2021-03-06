import Vue from './runtime/index.js'
import {compileToFunctions} from './compiler/'

// 扩展 $mount()
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (el, hydrating) {
    const options = this.$options
    if (!options.render) {
        let template = options.template
        if (template) {
            if (typeof template === 'string') {

            } else if (template.nodeType) {
                template = template.nodeType
            } else {
                return this
            }
        } else if (el) {
            template = el.outerHTML
        }
        if (template) {
            // TODO
            const {render} = compileToFunctions(template)
            options.render = render
        }
    }

    // 执行默认的挂载行为
    return mount.call(this, el, hydrating)
}

export default Vue
window.Vue = Vue
