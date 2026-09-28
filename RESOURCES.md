# Tender Paws A2-2 资源清单（领养与照护方向）

> 定位：Adoption & Care Service Directory（领养照护服务目录）
> 端口：3204
> 数据库：`charityevents_db`（八个 A2 统一沿用课程指定库名，不拆分）

## 一、品牌资产

| 资源 | 路径 | 用途 | 尺寸 |
|---|---|---|---|
| Logo | `/assets/logo.svg` | header 品牌标识 | 160 × 40 |
| Favicon | `/assets/favicon.ico`、`/assets/favicon.svg` | 浏览器 tab | 32 × 32 |
| OG 分享图 | `/assets/og.jpg` | 社交分享预览 | 1200 × 630 |
| 空状态插图 | `/assets/empty-state.svg` | 结果为空状态 | 320 × 240 |
| 后台占位图 | `/assets/admin-placeholder.svg` | 预留后台页面 | — |

## 二、页面图片分配

A2-1 保留原有 `P-01` ~ `P-08`；本项目全部改用独立命名 `AC-01` ~ `AC-08`，两个项目之间**无任何图片文件复用**（复测相同哈希 0/8）。

| 编号 | 路径 | 画面描述 | 用途 | 尺寸 | 授权 / 来源 |
|---|---|---|---|---|---|
| AC-01 | `/assets/AC-01.jpg` | 围栏后等待领养的虎斑犬 | index 首屏主图 | 1600 × 900 | Public domain · Wikimedia Commons |
| AC-02 | `/assets/AC-02.jpg` | 动物收容所犬舍 | 活动图 | 1200 × 675 | CC BY 2.5 · Nhandler |
| AC-03 | `/assets/AC-03.jpg` | 兽医为犬只做健康检查 | 活动图 | 1200 × 675 | Public domain · SrA Jenay Randolph（USAF） |
| AC-04 | `/assets/AC-04.jpg` | 收容所为动物准备玩具 | 活动图 | 1200 × 675 | Public domain · SrA Tiarra Sibley（USSF） |
| AC-05 | `/assets/AC-05.jpg` | 犬只搜救训练 | 活动图 | 1200 × 675 | CC BY 2.0 · vastateparksstaff |
| AC-06 | `/assets/AC-06.jpg` | 兽医猫科门诊 | 活动图 | 1200 × 675 | Public domain · Sgt. Zachary Zippe（U.S. Army NG） |
| AC-07 | `/assets/AC-07.jpg` | 志愿者在收容所陪伴犬只 | 活动图 | 1200 × 675 | Public domain · PO2 Kelly M Agee（U.S. Navy） |
| AC-08 | `/assets/AC-08.jpg` | 社区领养日活动 | search 顶部横幅 / 活动图 | 1200 × 675 | Public domain · Sgt. Valerie Eppler（USMC） |

> 全部图片取自 Wikimedia Commons。`source/database/seed.sql` 的 `events.image` 与上表文件名一一对应（id N → `AC-0N.jpg`），A2-2 不再引用 `P-0x` 命名。

## 三、第三方库

本项目**不引用任何第三方前端运行库**。脚手架遗留的 `client/vendor/`（GSAP + ScrollTrigger）已删除，动效全部由原生 CSS / JavaScript 实现。

## 四、字体

```
font-family: "Segoe UI", ui-sans-serif, system-ui, -apple-system, sans-serif;   /* 正文（--font-body） */
font-family: Georgia, "Times New Roman", serif;                                /* 标题（--font-display） */
```

## 五、配色（CSS 变量）

| 变量 | 值 | 用途 |
|---|---|---|
| `--brand` | `#a53600` | 主色 |
| `--brand-dark` | `#8a2d00` | hover / active |
| `--accent` / `--gold` | `#e5b84b` / `#d79b3d` | 辅色（暖黄） |
| `--rose` | `#bd5d62` | 强调色 |
| `--cream` / `--bg` | `#fff1d7` / `#fffaf1` | 背景 |
| `--surface` / `--surface-soft` | `#ffffff` / `#fff9ef` | 卡片底 |
| `--tint` | `#f3d9a6` | 浅色底 |
| `--ink` / `--muted` | `#3b2b24` / `#806d62` | 正文 / 次要文字 |
| `--line` / `--line-strong` | `#e9d6bd` / `#e5b84b` | 分隔线 |
| `--radius` / `--radius-lg` / `--radius-pill` | `18px` / `26px` / `999px` | 圆角 |

## 六、动效约束

- 允许：hover 位移 ≤4px、淡入
- 禁用：视差 / 跑马灯 / 抖动 / 大幅缩放 / 无限循环
- 全部动效由 `@media (prefers-reduced-motion: reduce)` 兜底关闭

## 七、文件规范

| 类型 | 文件 | 说明 |
|---|---|---|
| CSS | `styles.css` / `home.css` / `search.css` / `event.css` / `theme-b-adoption.css` | 禁止 `@import`；`!important` 仅用于 reduced-motion 兜底 |
| JS | `app.js`（公共）+ `home.js` / `search.js` / `event.js` / `registration.js` | 原生 JavaScript，无构建步骤 |
| 页面 | `index.html` / `search.html` / `event.html` / `registration-placeholder.html` | 无内联脚本 |

## 八、两个不混用的数据维度

- **类别 `category`**（来自 `/api/categories`）：`Rescue` / `Adoption` / `Shelter` / `Volunteer`
- **服务类型 `serviceType`**（来自 `events.service_type`）：`rescue-support` / `foster-care` / `adoption-guidance` / `shelter-shift`

界面上以两组独立入口呈现（类别磁贴 + 服务类型快链），界面文案显示可读标签（Rescue support / Foster care / Adoption guidance / Shelter shift），提交给接口的仍是原始 slug。

## 九、缺失资源 TODO

- [x] `logo.svg`、`favicon.svg/ico`、`og.jpg`、`empty-state.svg`、`AC-01.jpg` ~ `AC-08.jpg` 已放入 `source/assets/`
- [ ] MySQL 连接信息（`DB_HOST` / `DB_USER` / `DB_PASSWORD`，见 `.env.example`）
