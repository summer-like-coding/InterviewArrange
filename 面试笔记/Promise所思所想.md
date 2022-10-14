# 关于Promise的所思所想

## 前言

**持续创作，加速成长！这是我参与「掘金日新计划 · 10 月更文挑战」的第7天，[点击查看活动详情](https://juejin.cn/post/7147654075599978532)**

参考文章：

[Promise 对象 - ECMAScript 6入门 (ruanyifeng.com)](https://es6.ruanyifeng.com/#docs/promise)

[Promise - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

## 基础知识

### 三种状态

+ `pending`(进行中)
+ `fullfilled`(已成功)
+ `rejected`(已失败)

Promise的状态改变只有两种

+ 从`pending`到`fullfilled`
+ 从`pending`到`rejected`

假如你已经直到自己目前是什么状态（`resolve`还是`reject`）,那么这时候，只要你`then()`了，那么Promise对象就会立即调用他的回调函数

### 基本使用

```javascript
const promise = new Promise(function（resolve,reject){
    if(成功){
        resolve()
    }else{
        reject
    }
})
```

首先观察代码，你可以发现

+ `Promise`是`new`出来的，那么，大胆猜测，`Promise`就是一个对象
+ 发现`Promise`里面含有参数，说明，`Promise`对象的构造函数接受了一个参数
+ 这个参数是一个函数，并且这个函数也接受两个参数，这两个参数(·`resolve`·`reject`)也是函数（有点套娃行为）
+ 当时这个`resolve`,和`reject`他们其实是内置的一个函数，不需要我们做什么，只需要调用即可
+ `resolve`：当我们状态由`pending`变为`fullfied`时执行
+ `reject`：当我们状态由`pending`到`rejected`
+ 这时候我们的`promise`，就是一个`Promise`的实例

那么我们使用`then`，来获取他们状态的回调

```javascript
promise.then(()=>{
    //成功
},()=>{
    //失败
})
```

你可以知道

+ `then`方法也是，具有两个参数，两个参数都是函数
+ 分别表示的时`resolve`和`reject`的回调

#### 执行顺序

Promise是进行异步操作的，结合我们的`eventLoop`,其实我们可以大概知道，就是`Promise`之后执行的回调，首先会变为一个`message`进入我们的`queue`，等我们的`stack`全部都处理完成了，我们的`message`才会被`shift()`出来，那么回调才会被执行

```javascript
let promise = new Promise(function(resolve,reject){
    console.log("hello")
    resolve();
})
promise.then(function(){
    console.log("summer")
})
console.log("你好")
//hello
//你好
//summer
```

让我们来分析一下

+ 在`js`中函数是很重要的，浅看一下，没有函数，很好，那么就往下执行
+ 首先，遇到了`Promise`对象，那么按照顺序执行这个`hello`,并且我知道了，当前`Promise`的状态为`fullfilled`
+ 这时因为回调函数是异步的，并且我当前的`stack`里面是非空的，所以，回调函数作为一个参数进入`queue`里面
+ 然后执行输出`你好`
+ 这时候同步操作处理完了，这时候去处理这个回调，输出`summer`

#### 参数问题

如果你的`resolve`或者`reject`函数含有参数，那么这个参数会带给回调函数

现在来看一下这段代码

```javascript
const p1 = new Promise(function(resolve,reject){
    //操作
    reject()
})
const p2 = new Promise(function(resolve,reject){
    //
    resolve(p1)
})
p2.then(result=>console.log(result))
	.catch(error=>{
    	console.log(error)
})
```

现在我们可以知道，`p1`和`p2`都是`Promise`的实例对象

+ `P1`是`reject`，`p2`是`resolve`
+ 但是在`p2`里，我们发现，他将`p1`作为参数，传给了`resolve`
+ 那么也就是，我`p1`的状态会传给`p2`,**`p1`的状态会就觉得`p2`的状态**
+ 就算你现在`p2`是`resolve`的，但是因为我`p1`是`reject`，那么，我的`p2`也只能是`reject`

### `promise.then()`

> 接受两个可选参数，分别表示`resolve`和`reject`的回调

但是：**我们需要知道，每次`then`他是生成了一个新的`Promise`对象，和原来那个`Promise`是没有关系的**

正是因为这个原因，我们才可以使用`Promise`的链式写法

约定：

+ 使用`then`，第一个回调的返回值会作为第二个回调的参数
+ 那么也即是,假如你第一个回调返回的是一个`Promise`,那么你的状态会直接影响下一个回调的状态

```javascript
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('foo');
  }, 300);
});
myPromise
  .then(handleResolvedA)
  .then(handleResolvedB)
  .then(handleResolvedC)
  .catch(handleRejectedAny);
```

### `Promise.catch()`

> Promise对于错误的处理

**其实它就相当于`Promise.then(null,(error)=>{})`**

Promise的错误处理，如果没有处理，那么会一直往下去，知道遇到`catch`捕获

所以，这也就是为什么，我们很少在`Promise.then()`里面传入两个回调函数的原因

```javascript
const promise = new Promise(function(resolve, reject) {
  throw new Error('test');
});
promise.catch(function(error) {
  console.log(error);
});
// Error: test
```

在`Promise`里其实抛出错误和`reject`是一回事

**所以，一般情况下，我们`Promise`后面都会跟着一个`catch`方法，用于捕获错误**

如果我们不对错误进行捕获，那么试想一下，他这个错误会一直存在，然后到他的调用者也会有

其实`catch`返回的也是一个`Promise`对象，所以，在`catch`里面才会可以使用`then()`方法

```javascript
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};
someAsyncThing()
.catch(function(error) {
  console.log('oh no', error);
})
//捕获以后，会依然是一个Promise对象，然后再次进行
.then(function() {
  console.log('carry on');
});
```

这样我们就可以看出，其实`Promise`是相互独立的，所以，我们才会有`链式`

`catch`:只会捕获，在他之前的`错误`，对于他之后的错误，这能说，这个`catch`是管不了了

### `Promise.finally()`

> 无论我的状态是什么（`fullfilled`还是`reject`）我们都会执行的操作

教程里面说：`finally`其实是一种特殊的`then`

为什么？

我的理解是：因为`finally`总是会有一个返回值

```javascript
// resolve 的值是 undefined
Promise.resolve(2).then(() => {}, () => {})

// resolve 的值是 2
Promise.resolve(2).finally(() => {})

// reject 的值是 undefined
Promise.reject(3).then(() => {}, () => {})

// reject 的值是 3
Promise.reject(3).finally(() => {})
```

这样我们就可以看出，其实`finally`就是会返回上次你的`Promise`的返回值

那么也就是，我不管你错不错误，我都会将它返回出去了

## 总结

Promise还有一些其他的方法，后续慢慢补充吧

其实之前我一直都没怎么用`Promise`，因为之前只用过`async`和`await`，其实我现在感觉，`await`是`promise.then()`的一种封装，因为`await`后面一定是一个`Promise`实例。
