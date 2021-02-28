import Vue from 'vue'


let vm = new Vue({
    el: '#app',
    data() {
        return {
            msg: 'hello',
            arr: [1, 2, 3]
        }
    },
    computed: {

    },
    watch: {

    }
})

console.log(vm.arr.push({aaa: '111'}), vm.arr[3].aaa)