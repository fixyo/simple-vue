import { initState } from './observe'
import Watcher from './observe/watcher'
function Vue (options) {
  this._init(options)
}

Vue.prototype._init = function(options) {
  let vm = this 
	vm.$options = options

	initState(vm) // data watch computed 

  if (vm.$options.el) {
    vm.$mount()
  }
}

function query(el) {
  if (typeof el === 'string') {
    return document.querySelector(el)
  }
  // el: document.getElementById('app')
  return el 
}
// ?: 匹配不捕获
// .|\r 匹配任意字符，或则换行符
// + 至少一个
// ？尽可能少匹配
const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g
const util = {
  getValue(vm, expr) {
    let keys = expr.split('.')
    return keys.reduce((prev, cur) => {
      return prev[cur]
    }, vm)
  },
  compilerText(node, vm) {
    if (!node.exp) {
      node.exp = node.textContent
    }
    node.textContent = node.exp.replace(defaultRE, function(...args) {
      console.log(vm, args[1])
      return util.getValue(vm, args[1])
    })
  }
}

function complier(node, vm) {
  let childNodes = node.childNodes
  let cNodes = [...childNodes]
  cNodes.forEach(child => {
    if (child.nodeType === 1) { // 元素节点
      complier(child, vm)
    } else if (child.nodeType === 3) { // 文本节点
      util.compilerText(child, vm)
    }
  })
}

Vue.prototype._update = function() {
  let vm = this 
  let el = vm.$el
  
  let node = document.createDocumentFragment()

  let firstChild 
  while(firstChild = el.firstChild) {
    node.appendChild(firstChild) // appendChild 有移动的功能 
  }

  complier(node, vm)
  el.appendChild(node)
}

Vue.prototype.$mount = function() {
  let vm = this 
  let el = vm.$el = query(vm.$options.el )

  // 通过watcher渲染
  // 渲染watcher 
  let updateComponent = () => {
    console.log('render')
    vm._update()
  }
  new Watcher(vm, updateComponent) 
}



export default Vue 