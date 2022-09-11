// 遍历出所有a的情况
function getNumbers(source, count) {
    //如果只取一位，返回数组中的所有项，例如 [ [1], [2], [3] ]
    let currentList = source.map((item) => [item]);
    if (count === 1) {
        return currentList;
    }
    let result = [];
    //取出第一项后，再取出后面count - 1 项的排列组合，并把第一项的所有可能（currentList）和 后面count-1项所有可能交叉组合
    for (let i = 0; i < currentList.length; i++) {
        let current = currentList[i];
        //如果是排列的方式，在取count-1时，源数组中排除当前项
        let children = [];
        children = getNumbers(source.filter(item => item !== current[0]), count - 1);
        for (let child of children) {
            result.push([...current, ...child]);
        }
    }
    return result;
}

function getCount(a, b) {
    if (!(a % b) || !(b % a)) {
        return 0
    }
    // 不整除情况
    let arra = a.split("").map(Number)
    let arrb = b.split("").map(Number)
    let resa;
    for (let i = 1; i <= arra.length; i++) {
        
        console.log(getNumbers(arra,i));
        // resa.push(getNumbers(arra))
      }
    let resb;
    for (let i = 1; i <= arrb.length; i++) {
        console.log(getNumbers(arrb,i));
        
        
        // resb.push(getNumbers(arrb))
      }
    console.log(resa);
    console.log(resb);
}

console.log(getCount("1234", "99"));