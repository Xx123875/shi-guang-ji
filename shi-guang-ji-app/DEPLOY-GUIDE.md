# 拾光记 — 完整部署指南（小白版）

> 这份指南手把手教你把"拾光记"部署到网上，让任何人都能通过网址访问。

---

## 第一阶段：准备工作（安装工具）

### 1. 安装 Node.js

Node.js 是运行这个项目的必需软件。

**Windows 用户：**
1. 打开浏览器，访问 https://nodejs.org
2. 点击左边的绿色按钮下载 **LTS（长期支持版）**
3. 双击下载的安装包，一路点"下一步"即可安装

**Mac 用户：**
1. 打开终端（Terminal），粘贴以下命令回车：
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. 然后安装 Node.js：
   ```
   brew install node
   ```

**验证安装成功：**
打开终端/命令行，输入：
```
node -v
npm -v
```
如果显示版本号（如 v20.x.x 和 10.x.x），说明安装成功。

### 2. 安装代码编辑器（推荐 VS Code）

1. 打开 https://code.visualstudio.com
2. 下载并安装 VS Code（免费）

### 3. 注册 GitHub 账号

1. 打开 https://github.com
2. 点击 "Sign up" 注册一个免费账号（记住你的用户名和密码）

---

## 第二阶段：上传代码到 GitHub

### 1. 创建代码仓库

1. 登录 GitHub 后，点击右上角 **"+"** → **"New repository"**
2. 仓库名填：`shi-guang-ji`
3. 描述填：`拾光记 — 情侣线上互动平台`
4. 选择 **Public**（公开，免费部署需要）
5. 勾选 **"Add a README file"**
6. 点击 **"Create repository"**

### 2. 上传项目文件

有两种方式，选一种你方便的：

**方式 A：用 GitHub 网页直接上传（推荐小白）**

1. 在你创建的仓库页面，点击 **"uploading an existing file"**
2. 把 `shi-guang-ji-app` 文件夹里的所有文件和文件夹拖进去
3. 在底部写上：`初始提交：拾光记项目代码`
4. 点击 **"Commit changes"**

**方式 B：用 Git 命令行（如果你安装了 Git）**

```bash
cd shi-guang-ji-app
git init
git add .
git commit -m "初始提交：拾光记项目代码"
git remote add origin https://github.com/你的用户名/shi-guang-ji.git
git push -u origin main
```

---

## 第三阶段：一键部署到 Vercel（免费）

Vercel 是一个免费部署平台，对 Next.js 项目支持最好。

### 1. 注册 Vercel

1. 打开 https://vercel.com
2. 点击 **"Sign Up"**
3. 选择 **"Continue with GitHub"**（用 GitHub 账号登录，最方便）

### 2. 导入项目

1. 登录后，点击 **"Add New..."** → **"Project"**
2. 你会看到你的 GitHub 仓库列表
3. 找到 **"shi-guang-ji"**，点击 **"Import"**
4. 保持所有默认设置，直接点击 **"Deploy"**
5. 等待 1-2 分钟，部署完成！

### 3. 获取网址

部署完成后，Vercel 会给你一个网址，类似：
```
https://shi-guang-ji-xxx.vercel.app
```
任何人都可以通过这个网址访问你的"拾光记"网站！

---

## 第四阶段：绑定自定义域名（可选）

如果你有自己的域名（如 www.shiguangji.com），可以绑定：

1. 在 Vercel 项目页面，点击 **"Settings"** → **"Domains"**
2. 输入你的域名
3. 按照提示在你的域名服务商那里添加 DNS 记录
4. 等待 DNS 生效（通常几分钟到几小时）

---

## 第五阶段：本地开发调试

如果你想在自己电脑上先预览效果：

### 1. 把代码下载到电脑

```bash
git clone https://github.com/你的用户名/shi-guang-ji.git
cd shi-guang-ji/shi-guang-ji-app
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 预览

打开浏览器，访问 http://localhost:3000

每次修改代码后，浏览器会自动刷新显示最新效果。

---

## 项目文件结构说明

```
shi-guang-ji-app/
├── src/
│   ├── app/                    # 页面文件
│   │   ├── layout.tsx          # 全局布局（侧边栏+顶栏）
│   │   ├── globals.css         # 全局样式
│   │   ├── page.tsx            # 首页
│   │   ├── login/page.tsx      # 登录注册页
│   │   ├── anniversary/       # 纪念日页
│   │   ├── calendar/           # 日历页
│   │   ├── gallery/            # 图库页
│   │   ├── recycle-bin/        # 回收站页
│   │   ├── chat/               # 聊天页
│   │   ├── diary/              # 日记与心情页
│   │   └── settings/           # 设置页
│   └── components/
│       ├── Sidebar.tsx         # 侧边导航栏
│       └── Header.tsx          # 顶部栏
├── public/                     # 静态资源（图片等）
├── package.json                # 项目配置
├── tailwind.config.ts          # Tailwind 样式配置
├── tsconfig.json               # TypeScript 配置
└── next.config.js              # Next.js 配置
```

---

## 常见问题

### Q: npm install 报错怎么办？
确保你安装了 Node.js（版本 18 以上），然后重试。

### Q: 部署后样式不对？
Vercel 部署时确保 Framework Preset 选择的是 "Next.js"。

### Q: 怎么修改网站内容？
直接修改 `src/app/` 下对应的文件，保存后部署会自动更新。

### Q: 怎么添加真实功能（登录、数据库等）？
这是前端页面，要添加真实功能需要后端服务。推荐使用：
- **Supabase**（免费数据库 + 认证）：https://supabase.com
- **Firebase**（Google 提供的免费后端）：https://firebase.google.com
- **Vercel Postgres**（Vercel 自带数据库）

后续我会帮你接入这些后端服务，让登录、数据存储等功能真正跑起来。
