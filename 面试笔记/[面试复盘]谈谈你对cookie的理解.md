# [面试复盘]谈谈你对cookie的理解

**持续创作，加速成长！这是我参与「掘金日新计划 · 10 月更文挑战」的第11天，[点击查看活动详情](https://juejin.cn/post/7147654075599978532)**

## 什么是`cookie`

+ 是服务器保存在浏览器的一个文本信息
+ 大小很小，只有`4KB`
+ **浏览器每次发送请求，都会将`cookie`里的数据带上**
+ **一般我们用它来保存一些状态信息：（登录状态，购物车信息等）**

`cookie`其实并不是一个理想的客户端储存机制，因为大小很小，且不具有数据操作的的接口，一般我们会使用`Web Storage Api`和`IndexdDB`

`web Storage Api`其实就是我们常说的：`localStorage`和`sessionStorage`

`IndexDB`：是一个浏览器数据库

每一个Cookie都有以下几个部分

+ `Cookie`名字
+ `Cookie`的数据
+ **到期时间(超过这个时间，就会失效)**
+ **所属域名(一般默认为当前域名)**
+ **生效路径(一般为当前路径)**

举例：

> 当用户下想访问`www.examlpe.com`，那么这个时候，服务器就会在浏览器写入一个`cookie`

+ `cookie`的域：`www.example.com`
+ `cookie`的路径：`/`

假设`cookie`的生效路径设置为`/home`,那么也就意味之，这个`cookie`只可以访问`www.example.com/home`

**在之后浏览器访问相关的服务器时，就会将该域名和路径都对的上的，且cookie没有失效的cookie发送给服务器**

浏览器的同源政策规定：**在相同域名的cookie是可以共享的，就是它不考虑你的`port`和`协议`**

## `Cookie`和`HTTP`协议

**`cookie`由`http`产生，也被`http`所使用**

### cookie的生成

> 我们可以在请求的响应头里面看到

我们拿bing主页进行演示，首先将原来有的cookie删除，避免缓存之类的

然后刷新，选择一个查看他的响应头

![](D:\Workspace\知识整理\面试整理\面试笔记\setCookie.png)

我们可以看到`set-cookie`,其实这就是服务器在给浏览器设置的`cookie`

并且我们还可以看到，其实一次`HTTP`回应中会设置多个`cookie`（包含了多个`set-cookie`字段）

举例：

```bash
Set-Cookie:foo=bar
```

那么其实我们就是设置了一个名为`foo`的`cookie`,它的值是`bar`

`set-cookie`不仅可以设置cookie的值，还可以设置`cookie`的**多个**属性，多个属性间用`；`号分隔，**且无次序要求**

```bash
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly
```

如果服务器想要改变cookie，就是`patch`类似，那么**必须保证`key`,`domain`,`secure`,`path`全部匹配**，只要有一个不一致，那么都是`put`，就是会重新设置一个新的`cookie`

举例：

```bash
Set-Cookie: key1=value1; domain=example.com; path=/blog
```

你想要改变cookie值，那么你必须使用相同的`set-cookie`

```bash
Set-Cookie: key1=value2; domain=example.com; path=/blog
```

假如你设置为

```bash
Set-Cookie: key1=value1; domain=example.com; path=/
```

那么你就会新建一个`cookie`，并且它只对`www.example.com`生效

### cookie的发送

> 服务器给浏览器`cookie`以后，那么每次请求，浏览器都会带上域名相同，路径相同，且没有失效的cookie

再次拿bing主页举例

![](D:\Workspace\知识整理\面试整理\面试笔记\cookie发送.png)

我们可以在请求标头里面看到`cookie`,这就是浏览器在向服务器发送`cookie`

我们还可以看到，其实cookie中有多个`cookie`,他们用`;`分隔

举例：

```bash
Cookie:foo = bar
```

意思就是：浏览器向服务器发送了名为`foo`的`cookie`，值为`bar`

一次发送多个`cookie`

```bash
Cookie:name1 = value1 ; name2 = value2; name 3 = value3
```

## Cookie属性

### `Expires`和`max-Age`

> 都和**到期时间有关**

+ `Expires`：指定了一个具体的到期时间：当到达这个时间的时候，浏览器就不再保留这个`cookie`了
+ `max-age`:指定从cookie开始存在的秒数，**max-age的优先级更高**

拿bing主页的一个cookie举例：

```bash
Set-Cookie: fpc=AmQiYzUk3T9JmANktmQVQjKCeMQLAwAAAPLE6doOAAAA; expires=Thu, 24-Nov-2022 11:56:08 GMT; path=/; secure; HttpOnly; SameSite=None
```

#### `Expires`

> 指定的是到期时间，**值的格式是`UTC`(世界协调时间)格式**，要想转换为我们一般的时间**，我们可以使用`Date.prototype.toUTCString()`，将我们现在的时间改为`UTC`时间**

大概意思就是，拿中国举例，我们在东八区，所以时间快了8小时：[UTC时间与北京时间换算 (datetime360.com)](https://datetime360.com/cn/utc-beijing-time/)

**你可能也会发现，一些cookie中并没有设置`Expires`，那么就说明，他只在当前`session`有效，你页面一关闭，就需要重新获取`cookie`**

另外：其实`cookie`的过期时间不是准确遵守的，因为浏览器是通过当地时间来判断是不是过期的，但是转化为`UTC`总会有误差，所以，不一定还在服务器指定的时间就失效

#### `max-age`

> 设置的从cookie设置到cookie消失的秒数，超过时间，立刻就被删除

**假如你既没有设置`cookie`,有没有设置`max-age`,那么你相当于一个`session cookie`，也就是，你浏览器页面一关闭，浏览器不会帮你保留这个`cookie`**

### `Domain`和`Path`

#### `domain`

从上面的描述，我们其实可以知道，如果我们处于相同的域名，那么其实我们的cookie是可以进行共享的，那么domain就是来设置，你是不是要共享这个cookie的

看上面那个例子：我们因为没有设置domain属性，所以，我这个cookie就是不共享的，也就是我的子域名下面是获取不到这个cookie的

```bash
Set-Cookie: esctx=AQABAAAAAAD--....; domain=.login.microsoftonline.com; path=/; secure; HttpOnly; SameSite=None
```

在这个cookie中，他设置了`domain`，也就是，我浏览器访问服务器，会去判断这个`domain`是不是满足`cookie`设置的`domain`，那么请求的时候带上这个`cookie`

#### `path`

大概意思就是，假如我这个`path`是后续我需要请求的路径开头一部分，那么我就会带上这个`cookie`

现在`path:/`,那么意思就是，下次你`/home`的时候，他这个cookie也是会带着的，**当然前提条件是domain保持一致**

### `secure`和`http-only`

#### `secure`

> 规定只有在加密`https`协议下，这cookie才会发送给服务器

#### `http-only`

> 只有在浏览器发送`Http`请求的时候，才会带上该`cookie`

**并且使用了`http-only`，是无法使用`js`获取的，类似(`document.domain`等)**

### `samesite`

> 其实就是为了防止产生`CRFS`攻击

`CRFS`攻击·：就是会去伪造带有我们正确的`cookie`信息的网络请求

`samesite`有三个属性值

+ none
+ strict
+ lax

1. none:

   >  chrome将lax设置为默认值，但是哦我们不需要这个`samesite`属性，所以就需要显示的关闭

   **一定需要设置`secure`才会生效，也就是，你的cookie需要通过`HTTPS`才可以发送**

2. strict

   > 严格，不允许任何第三方的`cookie`，也就是，只有当我们的url和请求目标一致时，才会发送

   过于严格，体验感不好

3. lax

   > 也是不允许第三方的cookie，但是导航到目标的get请求除外

## 总结

cookie

+ 大小很小，只有`4KB`左右
+ 由`http`产生又被`http`使用
  + `set-cookie`：服务器设置的cookie
    + cookie具有多个属性
      + 截止时间：`max-age`和`expires`
      + 协议：`http-only`和`secure`
      + `CSRF`:`samesite`
      + 范围：`domain`和`path`
  + `Cookie`：浏览器发送的cookie
    + 一次可以发送多个，之间用逗号分开

参考链接:

[浏览器模型 - Cookie - 《阮一峰 JavaScript 教程》 - 书栈网 · BookStack](https://www.bookstack.cn/read/javascript-tutorial/docs-bom-cookie.md)