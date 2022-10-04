# React

## React的特性以及理解

#### 使用`jsx`

**什么是`jsx`**?

+ `jsx`其实是一种语法糖，他会被`babel`转换，转换为`js`代码
+ 其实我们可以将`jsx`理解为`React.createElement()`的一种语法糖
+ `createElement()`接受三个参数
  + 标签名
  + 对象：里面含有一些属性，例如`id`，`class`等
  + 内容
+ `createElememt()`他最后会返回一个对象，那么返回的这个对象又被我们成为是**`VDOM`（虚拟`DOM`）**

```react
<h1 className="test" id='testh1'></h1>
```

其实这个就已经是一个虚拟节点了

#### 虚拟`DOM`

什么是虚拟`DOM`

+ 将虚拟`DOM`理解为一个`js`对象，他是真实DOM的一个**一一映射**的关系

#### 单向数据流

它遵循的是高阶组件向低阶组件的单向数据流，利用`Props`

#### 声明式编程

区别于指令式的编程

**举例：**

当你使用原生`JS`去创建一个节点时

```javascript
//创建节点
var createNode = document.createElement("div");
//创建文本
var createTextNode = document.createTextNode("hello world");
//为节点添加文本节点
createNode.appendChild(createTextNode);
//将创建的节点放在你要添加的节点上
document.body.appendChild(createNode);
document.documentElement.appendChild(createNode);
```

但是对于React来说，你要实现添加一个节点，你完全可以使用

```react
<Slide>
	<Menu></Menu>
</Slide>
```

1. 组件

   在React中，一切都是组件。很多大的东西都是由一个个组件来构成的

   其实组件就理解为我们定义的一个个的标签

   **好处：**

   + 复用性增强：因为每一个组件都是独立的，它可以在多个场景里面进行使用

   + 可维护性：因为组件里只定义自身的一些逻辑，更容易去管理

   + 可组合：因为组件里面是可以使用其他组件的

     ```react
     <Slide>
     	<Menu></Menu>
     </Slide>
     ```

## 谈谈虚拟DOM和真实DOM的区别   

### 虚拟`DOM`

> 其实就是一个真实DOM的映射的一个对象

就像上面说的，我们的虚拟`DOM`其实就是`CreateELement`的返回的结果

### 区别

+ 虚拟`DOM`如果进行更改不会引起重排和重绘，但是真实`DOM`会引起重排和重绘
+ 一般来说，虚拟`DOM`更新的总消耗 = 虚拟`DOM`的增删改+diff算出来的与真实`DOM`的增删改+重排和重绘
+ 但是真实`DOM`的总消耗  = 全部节点的`增删改`+重排和重绘

那么我们可能会有疑惑，我们的虚拟`DOM`是怎么转换为真实`DOM`的呢？

### 转换过程

在`React`中，我们会使用`createRoot`

```react
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

之前我们使用的是`Render()`方法

在`react`中，`root`是指一个指向顶层数据结构(DOM树)的指针，`react`用它来渲染树

在`react17`里，`root`是不透明的，因为我们将他附在了`DOM`元素上

```react
import * as ReactDOM from 'react-dom';
import App from 'App';

const container = document.getElementById('app');

ReactDOM.render(<App tab="home" />, container);
```

意思就是我其实目前不知道我的`root`是什么

但是在`react18`里我们可以使用`createRoot`来创建一个`root`

```react
//获取到root指针
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
//render用于在每一次渲染页面，就会调用
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

区别：

当我们在重新渲染页面的时候，`react17`需要你将`root`重新传入，这里的`root`是指那个我们看不见的那个指针，但是对于`react`当我们需要重新渲染页面时，我们不需要传入`root`，只需要直接调用`render`就可以了
