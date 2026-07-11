# 🧰 Mihomo（Clash Meta）/ singbox 配置生成工具

![Mihomo Logo](./icon/icon.png)

# 🚀 Mihomo (Clash Meta) 订阅汇聚工具

Mihomo（Clash Meta）是一款高效的订阅汇聚工具，内置 [Sub-Store](https://github.com/sub-store-org/Sub-Store.git), 支持快速生成 Clash/singbox 配置文件，提供强大的分流与隐私防护功能，助您畅享安全无忧的网络体验。

## ✨ 核心特性

### 🔍 智能分流

- 全面的规则分流机制
- 支持自定义规则集
- 智能路由优化

### 🔒 隐私保护

- **DNS广告过滤**：内置Adblock功能
- **防泄漏保护**：
    - 防止DNS/WebRTC泄漏
    - 安全DNS/DoH支持
- **数据加密**：确保传输安全

### 🌐 订阅管理

- 多订阅汇聚整合
- 支持单节点地址
- Singbox自动节点过滤
- 自定义分流规则

### 📦 多格式支持

- 原生支持mihomo/clash/singbox配置文件
- 保留所有节点参数（无转换丢失）
- 兼容各种订阅链接格式
- 集成sub-store后端转换

### ⚡ Singbox专属优化

- 完美支持 1.11.x 及以上版本
- 自动适配版本生成配置
- 全平台无弹窗体验：
    - iOS版本
    - 谷歌版本
    - GitHub版本

## 🖥 在线控制台

[![访问在线配置生成器](https://img.shields.io/badge/访问在线配置生成器-基于vercel-blue?style=for-the-badge)](https://sub.ikar.eu.org)

[![访问在线配置生成器](https://img.shields.io/badge/访问在线配置生成器-基于cloudflare_workers-blue?style=for-the-badge)](https://substore.haxtop.ggff.net)

### 💡 使用建议

1. 关闭所有覆写功能（非关闭功能本身）
2. 推荐使用 [clashmi](https://github.com/KaringX/clashmi/releases)（轻量高效的客户端）

---

## 🛠 部署指南

### 1. 安装依赖

```bash
pnpm install
```

### 2. 初始化子模块

```bash
git submodule update --init --recursive
```

### 3. 更新子模块

```bash
git submodule update --remote --recursive
```

### 4. 构建项目

```bash
pnpm build
```

### 5. 开发模式运行

```bash
pnpm run dev
```

### 1️⃣ Vercel 部署

#### 准备工作

- [Vercel账号](https://vercel.com/signup)
- [Node.js](https://nodejs.org/) v16+
- [Git](https://git-scm.com/)

#### 方法一：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/Kwisma/cf-worker-mihomo)

1. 点击上方按钮
2. 登录Vercel账号
3. 配置项目信息
4. 点击 **Deploy** 开始部署
5. 等待1-3分钟完成

#### 方法二：CLI部署

```bash
npm run deploy
```

> 首次部署需按提示登录Vercel账号

---

### 2️⃣ Cloudflare Workers 部署

#### 方法一：一键部署

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Kwisma/cf-worker-mihomo)

**配置参数**：

- 构建命令：`npm run build`
- 部署命令：`npx wrangler deploy --keep-vars`

#### 方法二：CLI部署

```bash
npm run deploy:workers
```

---

## ⚙️ 环境变量

| 参数名     | 说明             | 示例值                                                                                                                      |
| ---------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `IMG`      | 背景图 URL       | `https://t.alcy.cc/ycy`                                                                                                     |
| `SUB`      | 转换后端地址     | [Sub-Store-node](https://github.com/Kwisma/Sub-Store-node)                                                                  |
| `BEIAN`    | 备案信息         | `萌ICP备20250001号`                                                                                                         |
| `BEIANURL` | 备案跳转链接     | `https://t.me/Marisa_kristi`                                                                                                |
| `CHECKUA`  | 请求校验         | `true`                                                                                                                      |
| `TPLMH`    | mihomo 规则模板  | [mihomo模板参考](https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/mihomo/ACL4SSR_Online_Full.yaml)   |
| `TPLSB`    | singbox 规则模板 | [singbox模板参考](https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/singbox/ACL4SSR_Online_Full.yaml) |

---

## 🤝 参与贡献

欢迎通过以下方式参与：

- 提交 [Issue](https://github.com/Kwisma/cf-worker-mihomo/issues)
- 发起 [Pull Request](https://github.com/Kwisma/cf-worker-mihomo/pulls)

## 📜 开源协议

[MIT License](LICENSE) © 2025 Kwisma
