function getCount(n, arr) {
    let nums = arr;
    let n1 = -1;
    let n2 = -1;
    // 找出积数和偶数最大值
    for (let i = 0; i < n; i++) {
        if (!(i % 2)) {
            n2 = Math.max(n2, nums[i])
        }
        // 基数
        if (i % 2) {
            n1 = Math.max(n1, nums[i])
        }
    }
    let count = 0;
    // 求差
    for (let i = 0; i < n; i++)
    {
        if (!(i % 2)) count += n2 - nums[i];
        if (i % 2) count += n1 - nums[i];
    }
    if (n1 === n2) {
        count += Math.floor(n/2) 
    }
    return count
}
console.log(getCount(7, [1, 1, 2, 2, 1, 1,1]));