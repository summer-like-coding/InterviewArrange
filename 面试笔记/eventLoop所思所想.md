# 什么是EventLoop？

## 前言

**持续创作，加速成长！这是我参与「掘金日新计划 · 10 月更文挑战」的第6天，[点击查看活动详情](https://juejin.cn/post/7147654075599978532)**

**参考视频：[【中文字幕】Philip Roberts：到底什么是Event Loop呢？（JSConf EU 2014）_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1oV411k7XY/?spm_id_from=333.788.recommend_more_video.-1&vd_source=a3f1462922db1047190b7ea5ac2089a1)**

参考文章：

[The event loop - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)

[JavaScript 运行机制详解：再谈Event Loop - 阮一峰的网络日志 (ruanyifeng.com)](http://ruanyifeng.com/blog/2014/10/event-loop.html)

## 理论模型

首先我们先来看一下`javascript`的理论模型(当时视频中介绍的是：`chrome`的`V8`的引擎)：

![](D:\Workspace\知识整理\面试整理\面试笔记\理论模型.png)

这边我们可以看到，一共有三给区域

+ `Stack`：这个是，当函数被调用的时候，那么我们这个函数的帧`Frame`就会进入这个栈，并且这个`Frame`里面是会包括这个函数的很多内容（参数等），当我们这个函数执行完成以后(`return`)以后，我们才会将这个`Frame`释放掉

+ `Queue`：这个就是用于存储`Message`的地方,每一个Message都会关联着一个`函数`

  意思就是：当我们这个`Message`被处理，那么首先`Message`从`Queue`里面`shift`出去，然后，`Message`会引来一个函数，那么这个函数`unshift`进入，然后执行，然后执行完，`pop`出去

+ `Webapis`：我的理解是：浏览器进行处理的地方，比如`网络请求`，`setTimeout`等，等这个浏览器处理完了，那么就会进入队列`Queue`成为一个`Message`,等我们将`stack`里面处理完了，那么我们才会将这个`Message`放入`Stack`里

## 代码分析

首先拿`MDN`上的一个例子来说明：

```javascript
function foo(b) {
  let a = 10;
  return a + b + 11;
}
function bar(x) {
  let y = 3;
  return foo(x * y);
}
console.log(bar(7));
```

先看运行状态：[latentflip.com/loupe/?code=ZnVuY3Rpb24gZm9vKGIpIHsNCiAgbGV0IGEgPSAxMDsNCiAgcmV0dXJuIGEgKyBiICsgMTE7DQp9DQpmdW5jdGlvbiBiYXIoeCkgew0KICBsZXQgeSA9IDM7DQogIHJldHVybiBmb28oeCAqIHkpOw0KfQ0KY29uc29sZS5sb2coYmFyKDcpKTs%3D!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D](http://latentflip.com/loupe/?code=ZnVuY3Rpb24gZm9vKGIpIHsNCiAgbGV0IGEgPSAxMDsNCiAgcmV0dXJuIGEgKyBiICsgMTE7DQp9DQpmdW5jdGlvbiBiYXIoeCkgew0KICBsZXQgeSA9IDM7DQogIHJldHVybiBmb28oeCAqIHkpOw0KfQ0KY29uc29sZS5sb2coYmFyKDcpKTs%3D!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D)

理解：

+ 我们可以很清晰的看到，首先`bar(7)`这个函数被调用，那么想进入`Stack`
+ 在`bar()`里面，因为调用了`foo()`,所以`foo()`函数进入
+ 这时候`foo()`函数执行，并且具有返回值，那么`foo()`出栈
+ 这时候，我的`bar()`也就有了返回值`42`，然后出栈
+ 最后整个结束

那么我们现在来看一下`setTimeout`

### 栈溢出

所以这就可以解释，我们之前可能遇到的`栈溢出`问题:`Maximum call stack size exceeded`

```javascript
function cb(){
    return cb()
}
cb()
```

这个函数很明显，他就是会`栈溢出`

+ 因为它一直在调用`cb`这个函数，这个函数会一直进入到`Stack`里面
+ 直到`栈`满为止

### 阻塞

视频的解释很好理解：当我们在栈中执行一段很慢的东西的时候我们就会产生阻塞

为什么？

首先，我们必须知道`js`是一个单线程语言，我是这么理解的，也就是，你在这个函数还没有执行完成以后，其他的函数是无法影响这个函数的执行的，他只能等待，等我将这个函数执行完了，你才能执行

```javascript
var foo = $.getSync("//foo.com")
var bar = $.getSync("//bar.com")
var qux = $.getSync("//qux.com")
console.log(foo)
console.log(bar)
console.log(qux)
```

这时候我们会看到，我们的栈中,首先进入`foo`,当`foo`执行完成，`shift`结束了,我们的`bar`才会进入，我们的`foo`执行了很长一段时间，这时候我们的`bar`和`qux`就只能等待，所以，产生了阻塞

### setTimeout

>  `setTimeout`:其实是一个异步的函数他接受两个参数，一个是回调函数，一个是time

```javascript
setTimeout(function(){
    console.log("hello,summer")
},1000);
```

这段代码大家应该都很熟悉：就是一秒以后，输出`hello,summer`

当时这么说，其实并不准确，因为，这里的message，并不是指的是:**等待的准确时间，其实它是指等待的最少事件**

什么意思？

意思就是：当我们的`stack`里面是非空的时候，我们的`setTimeOut`里面的回调函数，即使到了那个`time`,也不会执行，他会变为一个`message`进入`Queue`进行等待，当我们`Stack`空了，那个`回调函数`才会执行

先看一段代码（来自`MDN`）

```javascript
const s = new Date().getSeconds();
setTimeout(function cb() {
  // 输出 "2"，表示回调函数并没有在 500 毫秒之后立即执行
  console.log("Ran after " + (new Date().getSeconds() - s) + " seconds");
}, 500);
while(true) {
  if(new Date().getSeconds() - s >= 2) {
    console.log("Good, looped for 2 seconds");
    break;
  }
}
```

先看是如何运行的：[latentflip.com/loupe/?code=!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D](http://latentflip.com/loupe/?code=!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D)

我们可以看到

+ 首先函数入栈`setTimeout`这个函数入栈，当时他需要经过`500ms`以后才会执行，那么我们的`webAPis`先去进行计时，那么这是我们其实对`setTimeout`已经有一个交代了，那么`setTimeout`出栈，

+ 然后我们就会执行这个`while`循环

  可能在这个时候，我的定时器已经完成了计时任务，需要执行回调函数了，当时他也是不可以随随便便就可以进入`stack`里面的，他需要等`stack`全部都空了，才可以进行

+ 所以，等2秒以后,`log`结束了，那么才会执行回调`cb`，然后进行我们熟悉的入栈出栈，得到输出

其实这就是事件循环

### 事件循环

事件循环：**就是查看`stack`和`queue`,当`stack`空的时候，将`queue`的队头元素放进去**

那么我们现在来看点好玩的

### setTimeout(callback,0)

> 我们定义：setTimeout的等待时间是`0ms`

你可能会疑惑，都`0ms`了，不使用这个`setTimeout`不可以嘛？

那么想让我们看一段代码：

```javascript
console.log("hello");
setTimeout(function cb(){
    console.log("summer")
},0)
console.log("summer瓜瓜")
```

那么其实他的输出是

```bash
hello
summer瓜瓜
summer
```

我们来模拟一下是如何实现的：

+ 首先，先输出`hello`
+ 然后我们会遇到一个`setTimeout`函数，然后，这个会`webApis`进行计时,那么他会立刻就被变为一个`message`,进入`queue`，因为我们栈里面是非空的，所以需要等待。
+ 然后我们继续向下执行输出`summer瓜瓜`
+ 然后`queue`将队头拿出来，也就是那个`cb`回调，然后就会进行入栈和出栈操作
+ 然后输出`summer`

总结一下：

`setTimeout`的时间设置为0，其实就是为了让代码到栈顶执行，或者等栈空了，再去执行

## 总结

事件循环：就是它关注`stack`和`queue`,然后将`queue`的队头放入`stack`里面

`setTimeout`:是异步的，他其实是`webApis`进行处理的，处理好了，将`message`放入`queue`里面，当`stack`空了以后，我们在将`message`所联系的`函数`,入栈和出栈

阻塞：其实就是栈里面的函数在进行很慢的操作，导致后面的函数执行不了