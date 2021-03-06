import Vue from '../../../core/'
import { patch } from './patch.js'
import { mountComponent } from '../../../core/instance/lifecycle.js'

// 定义 __patch__：补丁函数，执行 patching 算法进行更新
Vue.prototype.__patch__ = patch

// 定义 $mount：挂载 Vue 实例到指定宿主元素（获得 DOM 并替换宿主元素）
Vue.prototype.$mount = function (el, hydrating) {
    return mountComponent(this, el, hydrating)
}

export default Vue
