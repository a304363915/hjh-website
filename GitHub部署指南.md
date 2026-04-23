# GitHub Pages 部署指南 - 泓锦浩机械科技官网

> 零成本上线，无需服务器，完全免费！

---

## 目录

1. [第一步：创建 GitHub 仓库](#第一步创建-github-仓库)
2. [第二步：上传网站文件](#第二步上传网站文件)
3. [第三步：开启 GitHub Pages](#第三步开启-github-pages)
4. [第四步：绑定你的域名](#第四步绑定你的域名)
5. [第五步：验证网站](#第五步验证网站)

---

## 第一步：创建 GitHub 仓库

### 1.1 登录 GitHub

打开浏览器访问：https://github.com

如果你还没有账号，点击 **Sign up** 注册（用邮箱即可，免费）。

### 1.2 新建仓库

登录后，点击右上角 **+** 按钮 → **New repository**

按如下填写：

```
Owner:          （你的用户名，自动填充）
Repository name: hjh-website
Description:    上海泓锦浩机械科技有限公司官网
Visibility:     ○ Private（私有）● Public（公开）← 选择这个！
☑ Add a README file   ← 不要勾选
```

> ⚠️ **必须选择 Public**，否则 GitHub Pages 无法免费托管。

填写完毕后，点击 **Create repository**。

---

## 第二步：上传网站文件

### 2.1 下载网站文件

我已为你打包好，文件位置：
```
C:\Users\30436\WorkBuddy\20260423135931\hjh-website-GitHub.zip
```

**下载这个文件，然后解压到文件夹备用。**

### 2.2 上传到 GitHub

回到你刚创建的仓库页面，你会看到仓库是空的。

#### 方法 A：拖拽上传（最简单）

在仓库页面，找到上传区域，直接把解压后的**所有文件和文件夹**拖进去：

```
拖入的文件应该包含：
├── index.html
├── about.html
├── contact.html
├── products.html
├── admin/
├── assets/
└── 部署指南.md（可选，不上传也行）
```

> ⚠️ 注意：不要拖 `hjh-website` 这个**文件夹本身**，要打开它，把里面的**内容**都拖进去。

确认文件结构如下（不要有多余的 hjh-website 层级）：

```
your-repo/
├── index.html      ✓
├── about.html      ✓
├── contact.html    ✓
├── products.html   ✓
├── admin/          ✓
├── assets/         ✓
└── 部署指南.md     ✓（可选）
```

点击 **Commit changes** 完成上传。

#### 方法 B：用 Git 命令行上传

如果你会使用命令行，在解压后的文件夹里打开 PowerShell：

```powershell
# 1. 进入网站目录
cd C:\Users\30436\Downloads\hjh-website

# 2. 初始化 Git
git init

# 3. 添加所有文件
git add .

# 4. 提交
git commit -m "first commit"

# 5. 关联你的 GitHub 仓库（把下面的 URL 换成你的仓库地址）
git remote add origin https://github.com/你的用户名/hjh-website.git

# 6. 推送上去
git branch -M main
git push -u origin main
```

---

## 第三步：开启 GitHub Pages

### 3.1 进入仓库设置

在仓库页面，点击顶部的 **Settings**（不是你的头像 Settings，是这个仓库的 Settings）。

### 3.2 找到 Pages 设置

在左侧菜单中找到 **Pages**，点击进入。

### 3.3 配置部署选项

```
Source（来源）
  ○ None
  ● Deploy from a branch    ← 选这个

Branch（分支）
  branch: main  ▼           ← 选 main
  / (root)     ▼           ← 选 / (root)

Custom domain（自定义域名）
  （先留空，第四步再填）
```

点击 **Save**。

### 3.4 等待部署

页面会提示：
> "Your site is live at https://你的用户名.github.io/hjh-website/"

**等 1-3 分钟**，刷新页面，GitHub 会生成你的免费网址。先把这个地址复制保存好，后面用得上。

---

## 第四步：绑定你的域名

### 4.1 在 GitHub 配置域名

回到仓库 **Settings → Pages**：

在 **Custom domain** 框里填入你的域名，例如：
```
www.hjh-tech.com
```
或者
```
hjh-tech.com
```

✅ 勾选 **Enforce HTTPS**（GitHub 会自动帮你申请 SSL 证书，几分钟后生效）

点击 **Save**。

### 4.2 在你的域名 DNS 里添加解析记录

登录你的域名管理后台（阿里云 / 腾讯云 / DNSPod 等）。

#### 如果你用阿里云域名：

1. 进入 **云解析 DNS**
2. 点击你的域名
3. 添加以下两条记录：

| 记录类型 | 主机记录 | 记录值 | 说明 |
|---------|--------|--------|------|
| **CNAME** | `www` | `你的用户名.github.io` | 把 www 指向 GitHub |
| **A** | `@` | `185.199.108.153` | 根域名指向 GitHub 固定 IP |

> 💡 **为什么用 A 记录指向 IP？**
> GitHub 要求根域名用 A 记录，固定 IP 是 `185.199.108.153`。
> 如果你用 CNAME 指向 GitHub，GitHub 只允许给 www 子域名用 CNAME，根域名不行。

#### 如果你用 DNSPod / 腾讯云：

| 记录类型 | 主机记录 | 记录值 |
|---------|--------|--------|
| CNAME | www | `你的用户名.github.io` |
| A | @ | `185.199.108.153` |

#### 如果你用 Cloudflare：

| 记录类型 | 名称 | 目标 | 代理状态 |
|---------|------|------|---------|
| CNAME | www | `你的用户名.github.io` | 代理关闭（DNS only） |
| A | @ | `185.199.108.153` | 代理关闭（DNS only） |

> ⚠️ 如果用 Cloudflare，**Proxy 状态选 DNS only**，不要选橙色云，GitHub Pages 不支持 CDN 代理。

### 4.3 等待 DNS 生效

DNS 解析通常在 **10分钟 - 48小时** 内生效，大多数情况下半小时内就能用。

---

## 第五步：验证网站

### 5.1 访问你的域名

在浏览器输入你的域名，应该能看到官网首页了！

### 5.2 验证 HTTPS

浏览器地址栏应该显示 🔒 小锁图标，说明 SSL 证书生效了。

### 5.3 测试后台

在浏览器访问：`你的域名/admin/login.html`

应该看到登录页面，输入账号密码登录：
- **账号**：`admin`
- **密码**：`hjh@2026`

---

## 常见问题

### Q：DNS 解析多久生效？
A：通常 10 分钟内，国内域名最长 48 小时。可以用这个工具检查：
https://tool.chinaz.com/dns/

### Q：访问域名显示 404？
A：检查两点：
1. GitHub Pages 是否已部署成功（试访问 `用户名.github.io/hjh-website/`）
2. DNS 解析是否正确配置

### Q：根域名（hjh-tech.com）能打开，但 www 打不开？
A：检查 DNS 里是否添加了 www 的 CNAME 记录。

### Q：能访问前台，但后台打不开？
A：正常！后台 `admin/login.html` 是隐藏入口，前台没有任何链接指向它。直接访问 `你的域名/admin/login.html` 即可。

### Q：怎么更新网站内容？
A：
1. 修改本地文件
2. 重新上传到 GitHub 仓库
3. GitHub Pages 会自动重新部署（1-3分钟生效）

---

## ⚠️ 重要提醒

1. **ICP 备案**：在国内访问域名，**必须完成 ICP 备案**。备案期间可以用 GitHub 临时地址访问：`你的用户名.github.io/hjh-website/`

2. **修改后台密码**：上线前建议修改 `admin/login.html` 里的密码（在第86行）

3. **数据说明**：后台修改的内容存在浏览器 localStorage 里，换设备会看不到。如需完整动态后台，可后续升级。

---

*生成时间：2026-04-23*
