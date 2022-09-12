let obj = {
    age: 18,
    nature: ['smart', 'good'],
    names: {
        name1: 'fx',
        name2: 'xka'
    },
    love: function () {
        console.log('fx is a great girl')
    }
}
// var newObj = Object.assign({}, obj);
// console.log(newObj);
// // 对数据进行更改
// newObj.age = 22
// newObj.names.name2 = 'summer'
// console.log("obj",obj);
// console.log("newObj", newObj);


// 一般深拷贝都需要一个递归实现，就是一直将引用类型变为基本类型为止
const deepClone = (obj) => {
    // 深拷贝结果
    let res = {}
    for (let key in obj) {
        let value = obj[key]
        // 判断是不是引用类型
        if (typeof value === "object") {
            res[key] =  deepClone(value)
        } else {
            res[key] = value
        }
    }
    return res
}

let deepCloneObj = deepClone(obj)
deepCloneObj.names.name1 = "summer"
deepCloneObj.age = 20
console.log("obj", obj);
console.log("deepCloneObj",deepCloneObj);