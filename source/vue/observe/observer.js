import { observe } from './index'
import { arrayMethods, observeArray } from './array'
import Dep from './dep'

class Observer {
  constructor(data) {

    this.dep = new Dep() // 给数组用的

    Object.defineProperty(data, '__ob__', {
      get: () => this 
    })

    if (Array.isArray(data)) {
      // 只能拦截数组的方法
      data.__proto__ = arrayMethods

      // 观测数组中的初始值
      observeArray(data)

      // 对数组内部的对象进行监控
      // 对改变数组的方法进行监控
      // 通过索引修改数组，或改变数组length属性检测不到
    } else {
      this.walk(data)
    }
  }
  walk(data) {
    let keys = Object.keys(data)

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let value = data[key]

      defineReactive(data, key, value)
    }
  }
}

export function defineReactive(data, key, value) {
  // 如果value是一个对象，递归调用
  let childOb = observe(value)  // childOb是一个Observe实例 上面有给数组用的dep属性 
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
      // debugger 
      if (Dep.target) {
        dep.depend()

        if (childOb) {
          childOb.dep.depend()
        }
      }
      console.log(`获取对象属性${key}的值`)
      return value 
    },
    set(val) {

      if (val === value) return 

      value = val 
      observe(val) // 对新设置的值进行监控
      console.log(`设置对象属性${key}的值`)

      dep.notify()
    }
  })
}

export default Observer 