import {pushTarget, popTarget} from './dep'

let id = 0 
export default class Watcher {
  constructor(vm, expOrFn, cb = () => {}, opts = {}) {
    this.vm = vm 
    this.expOrFn = expOrFn 
    if(typeof expOrFn === 'function') {
      this.getter = expOrFn 
    }
    this.cb = cb 
    this.opts = opts 
    this.id = id++

    this.deps = []
    this.depsId = new Set()

    this.get()
  }
  get() {
    // 收集watcher到dep中
    pushTarget(this)
    this.getter()
    // 取完值后将target至为空
    popTarget()
  }
  // watch记录dep
  addDep(dep) {
    let id = dep.id 
    // 同一个属性可能多次被使用 watcher应该只记录一次dep
    if (!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)

      dep.addSub(this)
    }

  }

  update() {
    // 直接调用this.get会触发重新编译 多次调用性能不好
    // this.get()
    queueWatcher(this)
  }

  run() {
    this.get()
  }

}

let has = {}
let queue = []

function flushQueue() {
  queue.forEach(watcher => {
    watcher.run()
  })

  has = {}
  queue = []
}

function queueWatcher(watcher) {
  let id = watcher.id 
  if (!has[id]) {
    has[id] = true 
    queue.push(watcher)

    nextTick(flushQueue)
  }
}

let callbacks = []

function flushCallbacks() {
  callbacks.forEach(cb => cb())
}


function nextTick(cb) {
  callbacks.push(cb)

  let timerFunc = () => {
    flushCallbacks()
  }

  if (Promise) {
    return Promise.resolve().then(timerFunc)
  }

  if (MutationObserver) {
    let observe = new MutationObserver(timerFunc)
    let textNode = document.createTextNode(1)
    observe.observe(textNode, {characterData: true})
    textNode.textContent = 2

    return 
  }

  if (setImmediate) {
    return setImmediate(timerFunc)
  }

  if (setTimeout) {
    setTimeout(timerFunc, 0)
  }
}