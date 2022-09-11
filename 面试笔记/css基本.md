## `CSS`面试题

### 盒模型介绍

1. 标准盒模型

   `width = content box width + padding + border`

   `height = content box height + padding + border`

2. `IE`(替代)盒模型

   大小就是你设置的宽高度值，如果你设置了`padding`和`border`,那么实际的大小需要减去内边距和边框

### `CSS`选择器和优先级

| 选择器       | 示例                                                         |
| ------------ | ------------------------------------------------------------ |
| 类型选择器   | h1{}                                                         |
| 通配符       | *{}                                                          |
| 类选择器     | .box{}                                                       |
| ID选择器     | #box{}                                                       |
| 属性选择器   | a[title]{}                                                   |
| 伪类选择器   | p::first-child{}                                             |
| 伪元素选择器 | p:after{}                                                    |
| 后代选择器   | article p{}                                                  |
| 子类选择器   | 元素 1 > 元素 2 {样式声明 },只会匹配作为第一个元素的**直接后代元素** |
| 相邻兄弟元素 | img+p{},意思是匹配，图片后面紧跟的段落将被选择               |
| 通用兄弟元素 | h1~p{},选择h1元素之后的所有同层级的p元素                     |

#### 优先级的计算规则

> 内联>ID选择器>类选择器>标签选择器

优先级是由`A`,`B`,`C`,`D`的值来决定的

1. 当出现内联样式时,`A` = 1,否则`A` = 0
2. `B`的值等于`ID`选择器出现的次数
3. `C`的值等于`类选择器`和`属性选择器`和`伪类`的出现总次数
4. `D`的值等于`标签选择器`和`伪元素`出现的次数

**从左往右依次进行比较 ，较大者胜出，如果相等，则继续往右移动一位进行比较 。如果4位全部相等，则后面的会覆盖前面的**

#### 优先级特殊情况

`!important`，它可以覆盖内联样式，但是我们尽量不要使用

什么时候`!important`不起作用

```html
<div class="box" style="background: #f00; width: 300px!important;">我的宽度是多少呢？？<div>
```

```css
.box {
	max-width: 100px;
}
```

这时候你的样式是没法生效的，因为`max-width`和`width`不是一个属性

**优先级，是来比较相同属性的**

### 重排(reflow)和重绘(repaint)的理解

重排：

> 无论通过什么方式影响了元素的几何信息(元素在视图的位置和尺寸)，浏览器需要**重新计算**元素在视图内的几何属性

重绘：

> 通过渲染树和重排(回流)阶段，我们知道哪些节点是可见的，以及那些样式和具体的几何信息，接下来就可以将渲染树的每个节点转为屏幕上的**实际像素**

如何减少重排和重绘？

+ 最小化重绘和重排

  > 样式集中改变，使用增加新样式类名`.class`

  例子

  ```javascript
  const el = document.getElementById('test');
  el.style.padding = '5px';
  el.style.borderLeft = '1px';
  el.style.borderRight = '2px';
  ```

  这里面大量的直接操作DOM元素，我们可以将他们进行合并

  + 使用`CSSText`

    ```javascript
    const el = document.getElementById('test')
    el.style.cssText += 'border-left: 1px; border-right: 2px; padding: 5px;'
    ```

  + 修改`class`，为他们添加`class`

    ```javascript
    const el = document.getElementById('test')
    el.className +='active'

+ 批量操作`DOM`

  + 使用`absolute`和`fixed`和`float`可以脱离文档流

    > 在制作复杂动画时对性能的影响比较明显

  + 对元素进行多次修改

  + 将元素带回到文档中

+ 开启`GPU`加速

  > 利用`css`属性`transform`,`will-change`等，比如改变元素位置，我们使用`translate`会比使用绝对定位改变其`left`,`top`等来的高效
  >
  > **`translate`不会触发重排或重绘，`transform`会为浏览器元素创建一个`GPU图层`，这使得动画元素在一个独立的层中进行渲染**
  
  - 使用`css3`硬件加速，可以让`transform`、`opacity`、`filters`这些动画不会引起回流重绘
  - 对于动画的其它属性，比如`background-color`这些，还是会引起回流重绘的，不过它还是可以提升这些动画的性能。

#### 回流重绘

   ![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/10/16798b8db54caa31~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

   **layout(回流)**：根据生成的渲染树，进行回流(layout)，**得到的节点的几何信息(位置和大小)**

   **Painting(重绘)**：根据渲染树以及回流得到的几何信息，得到节点的绝对像素

   **Display**:将像素发送给`GPU`，展示在页面上

#### 生成渲染树

1. 从DOM树的根节点开始遍历每一个可见节点
2. 对于每一个可见节点找到对应的`CSS规则树`，并应用他们
3. 根据每一个可见节点以及其对应的样式，组合生成渲染树

**补充**

1. 什么是可见节点，什么是不可见节点

   不可见节点

   + 一些不会渲染的节点,包括`script`,`meta`,`link`
   + 一些通过`css`进行隐藏的节点。**`display:none,节点是不会渲染到渲染树上的，但是和他相同效果的visibility和opacity即使是隐藏了，但是还是会显示在渲染树上的`**

2. 何时发生回流和重绘

   **回流一定会触发重绘，但是重绘不一定会触发回流**

   只有当页面布局和几何信息发生变化，就需要回流

   + 删除或者增加`DOM`元素
   + 元素的位置发生变化
   + 元素的尺寸发生了变化(包括页边距，内边框，边框大小，高度和宽度等)
   + 页面内容发生了变化(文本的变化，图片被替代等)
   + 页面一开始渲染
   + 浏览器窗口尺寸发生了变化(**回流是根据视口的大小来计算元素的位置和大小的**)

#### 浏览器的优化策略

因此大多数浏览器都会通过**队列化修改并批量执行来优化重排过程**。浏览器会将修改操作放入到队列里，直到**过了一段时间或者操作达到了一个阈值，才清空队列**。

**但是，当你去获取页面的布局信息的时候，他还是会强制刷新队列的，这就会造成重排**

+ `offsetTop`、`offsetLeft`、`offsetWidth`、`offsetHeight`
+ `scrollTop`、`scrollLeft`、`scrollWidth`、`scrollHeight`
+ `clientTop`、`clientLeft`、`clientWidth`、`clientHeight`
+ `getComputedStyle()`
+ `getBoundingClientRect`

**最好避免使用上面列出的属性，他们都会刷新渲染队列。**如果要使用它们，最好将值缓存起来

### 对`BFC`的理解

#### `BFC`具有一些特性

1. 块级元素会在垂直方向上面一个接一个的排列，和文档流的排列方式一致
2. 在`BFC`中上下相邻的两个容器的`margin`会重叠，可以创建新的`BFC`来避免外边距重叠
3. 计算`BFC`的高度时，需要计算浮动元素的告诉
4. `BFC`区域不会和浮动的容器发生重叠
5. `BFC`是一个独立的容器，容器内部元素不会影响外部元素
6. 每个元素的左`margin`和容器的左`border`接触

#### 包含块（containing block）

> 其实就是一个矩形的边界

```html
<table>
    <tr>
        <td></td>
    </tr>
</table>
```

这段代码中：`table`和`tr`都是包含块，其中`table`是`tr`的包含块，`tr`是`td`的包含快

**盒子不会受到包含块的影响，当盒子的布局跑到包含块的外边时，就是溢出`overflow`**

#### 盒子分类

+ 块级盒
+ 行内盒
+ 匿名盒

##### 块级元素

> `css`的属性值`display`为`block`,`list-item`,`table`的元素

##### 块级盒

+ 每一个块级元素都至少有一个块级盒，也就是`css`的属性值为`display`为`block`,`list-item`,`table`
+ 块级盒子和块级元素一样，呈现的是竖直排列的块
+ 每一个块级盒都会参与`BFC`的创建
+ 一般来说，一个块级元素会生成一个块级盒子，但是也有块级元素会生成两个块级盒子，例如`li`,他就会有一个用来存放项目符号

##### 行内级元素

> `css`属性值`display`为`inline`,`inline-block`,`inline-table`的元素

##### 行内盒子

+ `css`属性值为`display`为`inline`,`inline-block`,`inline-table`,他就是行内级元素
+ 视觉上，行内盒与其他行内级元素排列为多行
+ 所有的可以替代元素(`display`为`inline`,如`<img>`,`<video>`等)生成的盒子都是行内盒子
+ 所有的非可替代行内元素(`display`值为`inline-block`或者`inline-table`)生成的盒子称为原子行内级盒子

##### 匿名盒

```html
<div>
  匿名盒1
  <p>块盒</p>
  匿名盒2
</div>
```

也就是没有被标签元素所包围的

#### 定位方案

> 定位方案包括`普通流`（Normal Flow，也叫常规流，正常布局流），`浮动`（Float），`定位技术`（Position）

##### 普通流

> 当`position`为`static`或`relative`且`float`为`none`时会触发普通流

+ `BFC`中,盒子都是**竖着**排列
+ `IFC`中,盒子都是**横着**排列
+ 静态定位中(`position`为`static`)，盒的位置就是普通流里布局的位置
+ 相对定位中(`position`为`relative`),盒子的偏移位置由`top`,`right`,`left`,`bottom`定义，**即使有偏移，仍然保留原有的位置，其它普通流不能占用这个位置**

##### 浮动

+ 浮动定位中，盒称为浮动盒
+ 盒位于当前行的开头或者结尾
+ 普通盒会环绕在浮动盒周围,除非设置`clear`属性

##### 定位技术

> 允许我们将一个元素从它在页面的原始位置**准确移动**到其他位置

###### 静态定位

> `position` 为 `static`，此时元素处于`普通流`中

###### 相对定位

>  相对定位通常用来对布局进行微调。
>
>  设置 `top`，`right`，`bottom`，`left`,设置相对于**自身的偏移量**

###### 绝对定位

> `position`为`absolute`，盒子会从普通流中移除

+ `position` 为 `absolute` 或 `fixed` 时，它是绝对定位元素,他们是会**脱离文档流的**
+ `top`，`right`，`bottom`，`left` ，设置其**相对于包含块的偏移量**
+ 子绝父相，否则就相对于`body`

###### 固定定位

> 和绝对定位类似，但是它的包含块时浏览器视窗

#### 块级格式上下文

##### `BFC`创建

+ 根元素(`<html>`)
+ 浮动元素(`float`不为`none`)
+ 绝对定位元素(`position`为`absolute`或者`fixed`)
+ 表格的标题和单元格(`display` 为 `table-caption`，`table-cell`)
+ 行内块元素(`display`为`inline-block`)
+ `overflow`的值不为`visible`的元素
+ 弹性元素(`display`为`flex`或`inline-flex`的直接子元素)
+ 网格元素（`display` 为 `grid` 或 `inline-grid` 的元素的直接子元素）

##### `BFC`的应用

###### 自适应多栏布局

```html
<div class="wrapper">
   <div class="left"></div>
   <div class="right"></div>
   <div class="main"></div>
 </div>
```

```css
.wrapper div{
    height:200px
}
//三栏布局
.left{
    float:left;
    width:200px;
    background:gray
}
.right{
    float:right;
    width:200px;
    background:gray
}
//中间设置自适应
.main {
  /* 中间栏创建 BFC */
  /* 由于 盒子的 margin box 的左边和包含块 border box 的左边相接触 */
  /* 同时 BFC 区域不会和浮动盒重叠，所以宽度会自适应 */
  overflow: auto;
  background: cyan;
}
```

###### 防止外边距折叠

原本在普通文档流中，左右/上下`margin`他们是会折叠的

###### 消除浮动

因为创建了`BFC`以后，那么我们的浮动元素的高度也会进行计算，这时候你就算不设置父元素的宽度他也会被里面的子元素撑开

```html
<div class="bfc">
  <div class="float"></div>
  <div class="inner"></div>
</div>
```

```css
.bfc {
  /* 计算 BFC 高度时，包含 BFC 内所有元素，即使是浮动元素也会参与计算 */
  /* 这一特性可以用来解决浮动元素导致的高度塌陷 */
  /* 尝试注释掉 overflow: auto，看效果 */
  /* 如果父元素没有创建 BFC，在计算高度时，浮动元素不会参与计算，此时就会出现高度塌陷 */
  overflow: auto;
  background: gray;
}

.float {
  float: left;
  width: 100px;
  height: 80px;
  background: green;
}

.inner {
  height: 50px;
  background: yellow;
}

```

### 实现两栏布局

>  左侧固定+右侧自适应

利用浮动，左边元素宽度固定，设置向左浮动。

1. **将右边元素`margin-left`设为固定宽度**

```html
<div class="outer">
  <div class="left">左侧</div>
  <div class="right">右侧</div>
</div>
```

```css
.outer div{
  height:200px
}
.left{
  float:left;
  width:200px;
  height:100%;
  background-color:gray
}
.right{
  margin-left: 200px;
  height: 100%; 
  background: lightseagreen;
}
```

2. 利用`flex`布局，左边元素固定宽度，右边元素设置`flex:1`

```css
.outer{
  display:flex;
  height:200px
}
.left {
  float: left;
  width: 200px;
  /*   height:100%; */
  background-color: gray;
}
.right {
  flex:1;
  /*   height: 100%; */
  background: lightseagreen;
}
```

> `flex:1`,经常用于自适应，将父容器的`display:flex`，侧边栏大小固定后，将内容区`flex:1`,可以自动放大占满剩余空间

3. 使用绝对定位，父级元素设为相对定位。左边元素`absolute`定位，宽度固定，右边元素的`margin-left`的值设置为左边元素的宽度值

```css
.outer div{
  height:200px
}
.outer{
  position:relative
}
.left {
  position:absolute;
  top:0;
  left:0;
  width: 200px;
  background-color: gray;
}
.right {
  margin-left:200px;
  background-color: skyblue;
}
```

### 实现三栏布局

> 实现圣杯布局和双飞翼布局

+ **三栏布局，中间一栏最先加载和渲染**
+ 两栏内容固定，中间随着内容自适应
+ 一般用于`PC端`

**三栏效果的总结**

+ 使用`float`布局

+ 两侧使用`margin`负值，以便和中间的内容横向重叠

  区别

  + 圣杯：用的是`padding`
  + 双飞翼：用的是`margin`

#### 圣杯布局

```html
<div id="container" class="clearfix">
  <p class="center">我是中间</p>
  <p class="left">我是左边</p>
  <p class="right">我是右边</p>
</div>
```

```css
//圣杯布局使用的padding，主要是为了防止中间内容被两侧覆盖
//然后左右的padding，等会用左右两个内容区来填满
#container {
  padding-left: 200px;
  padding-right: 200px;
  overflow: auto;
}
//浮动
#container p {
  float: left;
}
.center {
//中间实现自适应
  width: 100%;
  background-color: lightcoral;
}
//使用margin负值来使和中间内容接在一起
.left {
  width: 200px;
  position: relative;
  left: -200px;
  margin-left: -100%;
  background-color: lightcyan;
}
.right {
  width: 200px;
  margin-right: -200px;
  background-color: lightgreen;
}
```

#### 双飞翼布局

```html
<div id="main" class="float">
  <div id="main-wrap">main</div>
</div>
<div id="left" class="float">left</div>
<div id="right" class="float">right</div>
```

```css
/* 使用float布局 */
.float {
  float: left;
}
#main {
  width: 100%;
  background-color: lightpink;
}
/* 双飞翼中间使用的是margin */
#main-wrap {
  margin-left: 200px;
  margin-right: 200px;
}
/* 左右两个内容区，使用margin负值和中间接壤 */
/* 左右两侧设置宽度 */
#left{
  width:200px;
  background:skyblue;
  margin-left:-100%;
}
#right{
  width:200px;
  background:gray;
  margin-left:-200px;
}
```

**补充**

> 上述的`margin-left:100%`,是相对于父元素的`content`宽度，即不包含padding，border的宽度

### 实现水平垂直居中

1. 使用`flex`布局

```html
<div class="parent">
  <div class="son">
    son
  </div>
</div>
```

```css
.parent{
  display:flex;
  justify-content: center;
  align-items: center;
  border:1px solid black;
  width:500px;
  height:200px;
}
```

2.使用`绝对定位`,设置`top`,`left`

```css
.parent{
  position:relative;
  border:1px solid black;
  width:500px;
  height:200px;
}
.son{
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%)
}
```

3.使用`绝对定位`，子元素所有方向为`0`,将`margin`设置为`auto`,要求盒子有宽高

```css
.parent{
  position:relative;
  border:1px solid black;
  width:500px;
  height:200px;
}
.son{
  position:absolute;
  top:0;
  left:0;
  bottom:0;
  right:0;
/*   margins设置为auto */
  margin:auto;
/*  对子设置宽高  */
  width:50px;
  height:50px
}
```

### `flex`布局

理解`flex:1`

+ `flex-grow:1`:
  + 属性默认为`0`,如果存在剩余空间，元素也不会放大
  + 设置为`1`,代表，设置的那个会被放大，等比放大那种
+ `flex-shrink:1`
  + 默认值为`1`,如果空间不足，元素缩小
+ `flex-basis:0%`
  + 浏览器根据这个属性来**计算是否有多余的空间**
  + 设置为 `0%` 之后，因为有 `flex-grow` 和 `flex-shrink` 的设置会自动放大或缩小

### `line-height`如何继承

+ 父元素的`line-height`写了**具体的值**，比如`30px`，那么子元素`line-height`也会直接继承这个值
+ 父元素的`line-height`写了**比例**，比如`1.5`,那么子元素的`line-height`也会是继承该比列
+ 父元素的`line-height`写的是**百分数**，比如`200%`,那么子元素`line-height`继承的是**父元素`font-size*200%`**计算出来的值