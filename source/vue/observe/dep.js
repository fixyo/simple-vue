let id = 0 

export default class Dep { // s收集watcher
  constructor() {
    this.id = id++ 
    this.subs = []
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
      // this.addSub(Dep.target)
    }
  }

  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

let stack = []
export function pushTarget(watcher) {
  Dep.target = watcher 
  stack.push(watcher)
}
export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}



