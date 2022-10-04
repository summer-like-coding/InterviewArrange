# React生命周期

**持续创作，加速成长！这是我参与「掘金日新计划 · 10 月更文挑战」的第4天，[点击查看活动详情](https://juejin.cn/post/7147654075599978532)**

## 前言

最近看了点React面经，今天看到了`react`的生命周期，这里就简单的总结一下，记录一下我对React生命周期的理解

## 生命周期

首先看一下React官网给出的一些**常用**的的生命周期[React lifecycle methods diagram (wojtekmaj.pl)](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

### 挂载时

#### `constructor()`

**如果不需要初始化state,或者进行方法的绑定，那么我们其实不需要用到这个**

使用这个构造函数，我们只会有这两种情况

+ 需要用`this.state`赋值对象来初始化内部的`state`,**但是这里面不是使用`setState()`**，在这里面只能使用`赋值`
+ 绑定事件

```react
constructor(props){
    super(props)//获取父类身上的props
    //初始化state
    this.state = {count:0}
    //绑定事件
   	this.handleClick = this.handleClick.bind(this)
}
```

我感觉我一直都没怎么用过这个钩子，因为我觉得，初始化state，我可以使用`useState()`,绑定事件，可以通过`useEffet()`给组件绑定事件，当组件一渲染，我就触发这个组件的这个事件。

#### `render()`

作用：当react被调用时，它会去调用`props`和`state`,观察他们是不是变化，如果发生变化，那么他就会执行并且返回这些类型之一

+ `React`元素

  通常由`JSX`来创建

  + `<div/>`:会被变为节点
  + `<Mycomponent/>`:会被渲染为一个组件

+ `数组或者fragments`

  **其实我感觉其实就是和`React`元素差不多，只不过他是嵌套的**

  ```react
  render(){
      return (
      	<React.Fragement>
          	<ChildA></ChildA>
              <ChildB></ChildB>
              <ChildC></ChildC>
          </React.Fragement>
      )
  }
  ```

  **或者你需要渲染`state`或者`props`,但是状态是一个数组，这时候你需要使用`map`，并且需要`key`**

  ```react
  function Glossary(props) {
    return (
      <dl>
        {props.items.map(item => (
          // 没有`key`，React 会发出一个关键警告
          <React.Fragment key={item.id}>
            <dt>{item.term}</dt>
            <dd>{item.description}</dd>
          </React.Fragment>
        ))}
      </dl>
    );
  }
  ```

+ `布尔类型`或者`null`

  **这几个我应该没有遇到过感觉，后续遇到补充吧**

关于我对`render`的理解，**我觉得其实`render`其实就是我们函数组件里面的`return`**

#### `componentDidMount()`

**这个在组建挂载后会立即执行，所以他其实是进行一些网络请求，发布订阅的最好时机**，但是如果发布订阅不要忘记在结束的时候，结束订阅`componentWillUnmount()`

但是目前React`useEffect()`，其实就是专门来处理这种有副作用的事情的，我感觉其实他将`componentDidMount()`和`componentWillUnmount()`结合起来

这里我想好好理解一下`useEffect()`

##### `useEffect()`

**`useEffect`就是专门用来处理一些产生副作用的事件**

只要我的组件每渲染一次，那么这个`useEffect()`函数就会立即执行

`useEffect()`接受两个参数

+ `函数`

  产生副作用的函数

+ `数组`

  指定了副作用函数的依赖，一旦依赖发生了变化，那么这个函数才会执行,**当然你也可以为一个空的数组，那么这个意思就是，只会执行一次（在组件加载进入DOM时执行一次）**，其实这样，就类似于`componentDidUpdate()`

**返回一个函数，其实就是在组件卸载时进行执行，用于消除副作用**

```react
useEffect(()=>{
    const subscription = props.source.subscribe()
    return ()=>{
        subscription.unsubscription()
    }
},[props.source])
```

**假如你有几个会产生副作用的函数，那么请分开写，而不是放在一个`useEffect`里面**

参考链接：[轻松学会 React 钩子：以 useEffect() 为例 - 阮一峰的网络日志 (ruanyifeng.com)](https://www.ruanyifeng.com/blog/2020/09/react-hooks-useeffect-tutorial.html)

### 更新时

#### `render()`

#### `componentDidUpdate()`

定义：**在组件进行更新后进行调用**

### 卸载时

#### `componentWillUnmount()`

定义：用于组件卸载时，就是清理一些监听事件，订阅事件啥的

只要我们执行了这个函数，那么我们下一次**这个组件再想要使用，就是重新创建**

## 感悟

我感觉在`react18`

+ `useEffect()`就已经结合了`componentDidMount`,`componentDidUpdate()`,`componentWillUnmount()`
+ `return`其实执行的就是类似于`render()`的操作

关于还有一些不太常用的生命周期函数，这里就不介绍了