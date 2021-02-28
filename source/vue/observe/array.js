// push pop unshift shift reverse sort splice 

import { observe } from "."

let oldArrayPrototypeMethods = Array.prototype 

export let arrayMethods = Object.create(oldArrayPrototypeMethods)

let methods = [
  'push',
  'pop', 
  'unshift', 
  'shift', 
  'reverse', 
  'sort', 
  'splice' 
]

export function observeArray(inserted) {
  for (let i = 0; i < inserted.length; i++) {
    // 观测数组中新增属性 如果新增元素为对象，则为属性添加set、get方法
    observe(inserted[i])
  }
}

methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    // console.log(this, 'this')
    let ret = oldArrayPrototypeMethods[method].apply(this, args)

    let insertedVal 
    switch (method) {
      case 'push':
      case 'unshift':
        insertedVal = args 
        break 
      case 'splice':
        insertedVal = args.slice(2)
        break 
      default:
        break;
    }

    if (insertedVal) {
      observeArray(insertedVal)
    }

    return ret 
  }
})