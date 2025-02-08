---
title: 花10分钟，搭建你自己的博客
date: 2020-07-13 13:53:06
tags: [好东西]
excerpt: 使用 Hexo 搭建你自己的博客。
id: build-hexo
---

### 环境配置

在搭建Hexo之前，你需要确保有：

* Node.js

  在 [Node.js Download](https://nodejs.org/zh-cn/download/) 下载适合你电脑系统的Node.js版本。Windows系统直接选择**Windows安装包（.msi）** 的 **x64**（如果你的电脑是64位系统的话）。

  然后打开安装的文件，一路摁**Next**（在第二个需要打勾同意用户协议）等待安装完成。

* Git

  前往[Git Download](https://git-scm.com/downloads)下载Git，然后安装。Windows系统直接在[这里](https://git-scm.com/download/win)安装。

### 安装Hexo

1. hexo的安装非常简单，首先在Powershell执行：

   ```
   npm install -g hexo
   ```

2. 接下来找一个你喜欢的文件夹（必须是空的），进到文件夹中，摁住 `Shift` 然后右键空白区域，选择 `在此处打开Powershell窗口` ，执行：

   ```
   hexo init
   ```

   如果你遇到了这样的报错：
   ```
   hexo : 无法加载文件 C:\Users\water\AppData\Roaming\npm\hexo.ps1，因为在此系统上禁止运行脚本。有关详细信息，请参阅 https:/go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies。
   ```
   请在以管理员身份打开 Powershell 并执行：
   ```
   Set-ExecutionPolicy RemoteSigned
   ```
### 创建仓库

* 你需要一个仓库来存储博客网页，那就开始创建一个Github仓库吧~

  **如果你没有Github账号，到这里去[注册](https://github.com/join)一个**

  如果你注册完了或者登录好了，那么可以[创建新仓库](https://github.com/new)了：

  把 `RepoSitory Name` 设为 `【你的用户名】.github.io` ，比如我叫*waterblock79*，那仓库名就应该是 `waterblock79.github.io`。

  填完之后就点击下面的 `Create repository` 创建仓库。

  接下来会跳转到仓库界面，**请复制并保存好这里的链接！**

### 配置Hexo

1. 现在在Powershell中执行：（别忘了替换引号里的内容~）

   ```
   git config --global user.name "你的Github用户名"
   git config --global user.email "你注册Github使用的邮件地址"
   ```

   举个例子，就像这样：

   ```
   git config --global user.name "waterblock79"
   git config --global user.email "waterblock79@outlook.com"
   ```

  2. 然后回到你刚刚的文件夹，打开文件夹中的 *_config.yml* ，找到最下面的 *# Deployment*，把内容改成：

     ```
     # Deployment
     ## Docs: https://hexo.io/docs/deployment.html
     deploy:
       type: git
       repo: 【你刚刚创建的仓库的网址】
       branch: master
     ```

     比如：

     ```
     # Deployment
     ## Docs: https://hexo.io/docs/deployment.html
     deploy:
       type: git
       repo: https://github.com/waterblock79/waterblock79.github.io
       branch: master
     ```

### 最后

**（下面的命令需要在Hexo文件夹中执行）**

**（摁住 `Shift` 然后右键空白区域，选择 `在此处打开Powershell窗口`）**

1. 执行 `hexo new 【文章名】` 来新建文章，

   在你的博客文件夹的 `/source/_posts` 中编辑这篇文章，可以使用如 VSCode 等支持 Markdown 的编辑器来编辑文章。

2. 要上传文章？依次执行这三个命令即可

   ```
   hexo clean
   hexo generate
   hexo deploy
   ```

   （有可能会弹出一个Github的登录框，输入自己的Github账号邮箱和密码即可登录）

---

上传完成后就可以看到自己的博客了，博客的地址是 `【你的Github名称】.github.io` 。