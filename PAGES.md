# Tender Paws A2-2 页面功能（领养与照护方向）

## 子项目定位

| 项 | 内容 |
|---|---|
| 子项目 | A2-2 |
| 子方向 | 领养与照护 Adoption & Care（discovery workbench homepage） |
| 端口 | 3204 |
| 入口 | `source/client/index.html` |
| 数据源 | `GET /api/events`（无 MySQL 时返回 ≥8 条 preview fallback） |
| 类别 | Adoption / Shelter / Volunteer（本方向聚焦领养与照护） |

A2-2 以「发现工作台」开场：首页即筛选面板（左）+ 结果网格（右）的 workbench 布局。聚焦领养与照护——寄养照护、兽医照护、领养指导、收容所值班。**与 A2-1 的 mission-first 首页形态明显不同。**

---

## 1. index.html（首页 · discovery workbench）

### Section 结构
`workbench-header → filter-panel + results-grid → services-teaser → contact-cta → footer`

### 详细 section
| Section | 内容 | 数据 |
|---|---|---|
| workbench-header | 紧凑页头：kicker「Tender Paws / Adoption & Care」+ h1「Every paw deserves a second chance.」+ 一行引导文案 | 静态 |
| filter-panel（左侧） | 筛选面板：service-type（rescue-support / foster-care / adoption-guidance / shelter-shift）+ date + location + category + 「Clear」 | `GET /api/categories` 填充 category |
| results-grid（右侧） | 卡片网格同 EventCard，按筛选结果渲染；默认列出全部 Active 服务 | `GET /api/events/search` |
| services-teaser | 3 个照护亮点：Foster care visits / Adopter classes / Shelter open days（icon + 简述 + 频次/地点） | 静态 |
| contact-cta | 「Need help choosing?」+「Email the rescue & adoption team」mailto 按钮 | 静态 |
| footer | 品牌简介 + 探索链接 + 联系方式 | 静态 |

### 布局要点
- 桌面：`grid-template-columns: 280px 1fr`（左筛选 + 右结果），筛选面板 sticky
- 平板：筛选面板折叠为顶部「Filters」按钮触发的抽屉
- 手机：单列堆叠，筛选在前结果在后

### 数据源
- `GET /api/categories`（填充 category select）
- `GET /api/events/search?service-type=&date=&location=&category=`（无筛选参数时返回默认 Active 列表）

### 状态
| 状态 | 表现 |
|---|---|
| loading | 结果区显示「Loading adoption services…」骨架 |
| error | 「Unable to load services right now.」+ 重试按钮 |
| empty | 「No services match your filters.」+ 建议清除筛选 |
| clear | 清空筛选后恢复默认列表 |

### 导航
- header nav：Adoption & care（current）→ Search events（`/search.html`）→ Contact us（`#contact`）
- 结果卡 → `/event.html?id={event_id}`
- 「Clear」→ 重置筛选并重新加载默认列表

---

## 2. search.html（领养照护搜索 · 增强）

### Section 结构
`hero-bar → filter-form（含 service-type）→ results-grid → footer`

### 详细 section
| Section | 内容 |
|---|---|
| hero-bar | 「Search adoption & care」+ 引导文案 |
| filter-form | 四条件：service-type（本方向新增维度）/ date / location / category + Clear |
| results-grid | 卡片网格，按筛选结果渲染 |
| footer | 同首页 |

### 数据源
- `GET /api/categories`
- `GET /api/events/search?service-type=&date=&location=&category=`

### 状态
| 状态 | 表现 |
|---|---|
| loading | 「Searching…」骨架 |
| error | 「Search is unavailable right now.」+ 重试 |
| empty | 「No services match your filters. Try a different combination.」 |
| clear | 重置表单并恢复默认列表 |

### 导航
- header nav 同首页
- 结果卡 → `/event.html?id={event_id}`

---

## 3. event.html（领养照护详情）

### Section 结构
`hero-image → service-detail → registrations-hint → register-cta → footer`

### 详细 section
| Section | 内容 |
|---|---|
| hero-image | 大图（cover_image_url，回退 P-02）+ 类别徽章 + service-type 标签 |
| service-detail | 标题 / 日期 / 地点 / 类别 / 照护说明（描述照护内容：频次、对象、注意事项） |
| registrations-hint | 「N neighbours are already supported.」（A2 只读计数，明细在 A3） |
| register-cta | 「Request this service」按钮 → `/registration-placeholder.html?id={event_id}` |

### 数据源
- `GET /api/events/:id`（404 时显示「Service not found or unavailable.」+ 返回首页链接）

### 状态
| 状态 | 表现 |
|---|---|
| loading | 骨架屏 |
| error / 404 | 「Service not found or unavailable.」+ 返回搜索链接 |
| Suspended | 状态徽章 + 报名按钮置灰，提示「This service is not open for registration.」 |

### 导航
- header nav 同首页
- 「Back to adoption & care」→ `/index.html` 或 `/search.html`
- 「Request this service」→ `/registration-placeholder.html?id={event_id}`

---

## 4. registration-placeholder.html（照护预约占位）

### Section 结构
`notice → summary → next-steps → footer`

### 详细 section
| Section | 内容 |
|---|---|
| notice | 说明：「This is a preview service request. Full sign-up is completed in the A3 team project.」（与 A2-1 文案不同，强调服务预约） |
| summary | 回显服务名 / 日期 / 地点 / service-type（由 `?id=` 拉取） |
| next-steps | 指引：A3 预约表单位置 + 联系救助与领养团队 mailto（adoption@tenderpaws.example） |
| footer | 同首页 |

### 数据源
- `GET /api/events/:id`（回显服务摘要；无 id 或 404 显示通用说明）

### 状态
| 状态 | 表现 |
|---|---|
| loading | 骨架 |
| error / 404 | 通用占位文案（仍可读，不阻断） |

### 导航
- 「Back to service」→ `/event.html?id={event_id}`
- 「Talk to the adoption team」→ `mailto:adoption@tenderpaws.example`

---

## 页面跳转图

```
index.html(workbench) ──▶ search.html ──▶ event.html?id= ──▶ registration-placeholder.html?id=
   │                          ▲                  │                    │
   │ (filter panel +           │                  └── Back ─────────────┘
   │  results grid)            │
   └─ contact #anchor ─────────┘
```

## 与 A2-1 差异化要点（必须明显不同）

| 维度 | A2-2 | A2-1 |
|---|---|---|
| 首页形态 | discovery workbench（筛选面板 + 结果网格，首屏即发现） | mission-first（hero 使命 + 活动网格） |
| 聚焦内容 | 领养与照护（寄养照护 / 兽医照护 / 领养指导） | 流浪动物救助（救助行动 / 收容照护 / 社区宣导） |
| preview 数据 | 以 Adoption / Shelter / Volunteer 类别为主 | 以 Rescue / Shelter / Volunteer 类别为主 |
| hero 文案 | 「Every paw deserves a second chance.」 | 「Every rescue starts with someone who cares.」 |
| 筛选维度 | 四条件（多 service-type 维度） | 三条件（date / location / category） |
| CTA 用词 | 「Request this service」「Email the adoption team」 | 「Find a rescue」「Register interest」 |
| 卡片排序 | 按 service-type 分组 | 按日期升序 |
