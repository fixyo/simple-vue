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

    this.get()
  }
  get() {
    this.getter()
  }
}