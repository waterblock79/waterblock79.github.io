---
title: 浏览器 Data 协议的应用
date: 2022-09-29 22:01:00
tags: [前端]
excerpt: 介绍了浏览器中的 data 协议使用方法。
id: data-uri
---

**本文初稿写于 2020 年 10 月 17 日中午，但是发现写的不太好，所以在 2022 年 9 月 29 日进行了大幅度的修改，本文可能有一些用语不是很准确，但是意思应该是达到了的，仅供参考，具体请以相关文档为准。**

在一些情况下，你可能需要引用一个外部资源，但是又难以保证这个外部资源存在哪是否哪天就会失效了；又或者你需要引入好几十个极其简单的小图标，每个小图标都使用 img 标签发送一个请求，这样会造成一定的性能浪费。对于上面这两种情况，我想 **Data 协议** 是一个适合的答案，在 MDN Web Docs 中，Data 协议被介绍为：

> Data URLs，即前缀为 data: 协议的 URL，其**允许内容创建者向文档中嵌入小文件**。

怎么理解 Data 协议？假如现在在你的作业本上有这样的一道题目：

> 如图所示是某一物体运动的 s-t 图像...  
>  （图请见书第 10 页图 3-4）

此时就需要你去翻书，看一下图是什么，这就像是一般情况下我们去请求外部资源，不过，如果我们把这个图抄在题旁边呢？这样我们既不用担心书丢了找不到图（外部资源失效），也不用再麻烦翻书了（极简单的内容也要请求一下造成性能浪费），这就像是使用 Data 协议了，方便又快捷。

不过也要提到一下 Data URI 的弊处：

1. 冗长：如果在一个 Markdown 文档中使用一个 Data URI 来存储某个图片，那么就会出现一个极长的字符串，会大大影响可编辑性。

2. 占用空间：使用 Data URI 存储可能会相较于直接请求外部资源占用更多的空间。

## 怎么使用

Data URI 的格式，或者说是语法是这样的：

```
data:[资源类型];[编码,][编码方式,]内容
```

- 资源类型：

  列举几种常用的资源类型，比如这个文件是图片，那么就应该填写 `image/png`。

  | 资源类型      | 资源类型名称    |
  | ------------- | --------------- |
  | 图片(PNG)     | `image/png`     |
  | 图片(JPG)     | `image/jpg`     |
  | 动图(GIF)     | `image/gif`     |
  | 矢量图(SVG)   | `image/svg+xml` |
  | 纯文本格式    | `text/plain`    |
  | HTML 文档格式 | `text/html`     |

- 编码方式（可选）

  编码方式是这样填写的：`charset=xxx`

  `xxx` 的内容是这段文本的编码格式，如 ascii、UTF-8 等。举个栗子，可以这样填写：`charset=UTF-8`。

- 编码（可选）

  如果是使用 Base64 编码来编码的，那此处就应为：`base64`，如果不是的话那这里就不填好了。

- 内容

  直接写要显示的数据即可。记得先将这段字符进行 `encodeURI()` 操作。

  只需要执行这段 Javascript 代码 `encodeURIComponent(prompt("请输入你需要转码的内容",""));`，它的返回值就是转码后的内容。

  <div id="encode" style="display: none;">
    <h3>将文本内容进行转换为 Data URI</h3>
    <button id="encodeURI">输入内容并获取 Data URI</button>
    <pre id="encodeResult" class="hljs language-css">No Result</pre>
    <script>
      // 支持 Javascript 脚本就显示这个小工具
      document.querySelector('#encode').style.display = 'block';
      // 绑定点击事件
      document.querySelector('#encodeURI').addEventListener('click', (e) => {
        document.querySelector('#encodeResult').innerText = `data:text/html;charset=UTF-8,` + encodeURIComponent(prompt("请输入你需要转码的内容",""));
      })
    </script>
    <style>
      #encodeResult { 
        padding: 1em;
        overflow-x: auto;
      }
      #encode { margin: 1em; }
    </style>
  </div>
  <div id="convert" style="display: none;">
    <h3>将文件转换为 Data URI</h3>
    <input type="file" id="convert-base64">
    <pre id="convert-result" class="hljs language-css">No Result</pre>
    <script>
      document.querySelector('#convert').style.display = 'block';
      // 绑定点击事件
      document.querySelector('#convert-base64').addEventListener('input', (e) => {
        let reader = new FileReader();
        reader.readAsDataURL(document.querySelector('#convert-base64').files[0]);
        reader.onload = () => {
          if(reader.result.length > 1024 * 1024) {
            alert('文件过大（文件的大小限制为 1 MB）');
            return;
          }
          document.querySelector('#convert-result').innerText = reader.result;
        };
      })
    </script>
    <style>
      #convertResult { padding: 1em; }
      #convert { margin: 1em; }
      #convert-result {
        padding: 1em;
        overflow-x: auto;
      }
    </style>
  </div>

举几个例子：

- 如果你需要显示一个经过 **base64** 处理的**图片文件**，处理后的 base64 是`AAAAAA`，那么 data 的 URI 应该是：`data:image/png;base64,AAAAAA`。

- 如果你需要显示一段 **HTML** 代码，内容是`<b>你好</b>`，那么 data 的 URI 应该是：`data:text/html;charset=UTF-8,%3Cb%3E%E4%BD%A0%E5%A5%BD%3C/b%3E`。

  （这里包含中文，如果不使用 UTF-8 则会出现乱码）

- 如果你需要显示一个 SVG 图片，内容为 `<svg xmlns="http://www.w3.org/2000/svg"></svg>`，那么 data 的 URI 应该是：`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>`，这个时候你应该可以看到一片空白的 svg。

## 应用

举个例子，你可以使用 Data URI 存储一些你想要嵌入在文档内的的图片，来防止外部资源丢失，尤其是在一些不能够直接将内嵌的图片等资源存储在文档里的文档类型中（如 Markdown、HTML 等）。如在 Markdown 中，可以：

> ```markdown
> ![图片](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAIAAAB/FOjAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAA8SURBVChTY/z//z8DKYAJSjMwMDIyopHIDDhAaEAGeKxF0YDHYDhA0UCMf7A7CQ4wjSCgAdNtJAYrAwMA3qUPFUTBASYAAAAASUVORK5CYII=)  
> 上面是一张写着 `Hi!` 的图片。
> ```  

> ![图片](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAIAAAB/FOjAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAA8SURBVChTY/z//z8DKYAJSjMwMDIyopHIDDhAaEAGeKxF0YDHYDhA0UCMf7A7CQ4wjSCgAdNtJAYrAwMA3qUPFUTBASYAAAAASUVORK5CYII=)  
> 上面是一张写着 `Hi!` 的图片。


不过，Data
协议的链接也可能被用来于进行钓鱼诈骗，请见[《Phishing without a webpage
– researcher reveals how a link _itself_ can be
malicious》（没有网页的网上诱骗–研究人员揭示链接自身可能是恶意的）](https://nakedsecurity.sophos.com/2012/08/31/phishing-without-a-webpage-researcher-reveals-how-a-link-itself-can-be-malicious/)。
（2022 年 9 月 27 日注：现在在 Chrome 浏览器 60+ 版本中已经有阻止跳转到 Data URI
限制了，问题不大）