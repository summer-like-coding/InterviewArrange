// 实现promise实例
const promise = new Promise(function (resolve, reject) {

})
setTimeout(() => {
    console.log("hello");
    promise.then((a) => {
        console.log("hello", a);
    })
}, 3000)
console.log("promise", promise);