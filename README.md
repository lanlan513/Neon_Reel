# Neon Reel 霓虹戲院

一個以**香港電影文化**為主題的復古電影美學探索網站。深色底 + 霓虹點綴的視覺靈感來自香港老街的霓虹招牌、舊戲院與膠片顆粒；用戶可以在這裡瀏覽香港電影、認識經典作品、並沿著年代走廊發現不同時期的電影風格。

> Visual language: neon street signs, film grain, vintage posters, repertory cinema. 深色背景 + 少量霓虹色點綴 —— 由 CSS 變數、氛圍疊層與**程序化生成的 SVG 海報**共同實現。

---

## 功能範圍（MVP）

已實現的三個核心頁面：

| 頁面 | 路由 | 能力 |
| --- | --- | --- |
| 首頁 | `/` | 精選電影、年代走廊（六個十年）、類型索引、資料集統計、隨機觀影 |
| 電影列表 | `/movies` | 按片名/英文名/導演**搜索**（URL 驅動 + 防抖）、按年代過濾、排序、分頁 |
| 電影詳情 | `/movies/:id` | 劇情簡介、演職員、取景地預覽、票根資訊、同年代相關推薦 |

另外包含 404 頁面。

- **搜索**支持中英文片名與導演名（例如 `重庆`、`express`、`王家卫`）。
- 數據集：**24 部**具代表性的香港電影（1966–2016），涵蓋武俠、犯罪、愛情、喜劇等類型。

> 當前版本**不包含**：導演檔案、電影年代專題頁、類型篩選、人物關係、電影地圖。這些已在數據模型與目錄結構中預留擴展位（見下文「為未來功能預留的空間」）。

---

## 技術棧

**前端**
- React 19 + TypeScript 5 + Vite 7
- react-router-dom 7（`Routes` / `Outlet` / `useSearchParams` / `useParams`）
- 純 CSS 設計系統（CSS 變數 tokens + 氛圍層 + 組件層），無 UI 框架
- 海報：**前端程序化生成內聯 SVG**（`client/src/lib/posterArt.ts` + `FilmPoster.tsx`），不依賴任何遠程圖片

**後端**
- Node.js（原生執行 TypeScript）+ Express 5
- SQLite —— 透過 Node 內建 `node:sqlite`（`DatabaseSync`），**無需任何原生編譯依賴**
- 分層架構：`routes → services → repositories → db`，`types` 定義領域模型

**工程**
- npm workspaces（`server` + `client`）+ 根目錄 `concurrently` 一鍵啟動
- Node ≥ 22.6（需要原生 TypeScript type-stripping 與 `node:sqlite` 支持；開發機為 Node 26）

---

## 目錄結構

```
.
├── package.json          # workspaces + 一鍵 dev / seed / build / typecheck 腳本
├── .gitignore
├── README.md
├── server/               # Express + SQLite API
│   ├── .env.example      # 可選的環境變數覆蓋說明
│   ├── data/             # SQLite 文件（git-ignored，由 seed 生成）
│   └── src/
│       ├── index.ts              # 啟動入口（含 EADDRINUSE 友好提示）
│       ├── app.ts                # 裝配 Express（中間件 / 路由 / 錯誤處理）
│       ├── config.ts             # 端口、DB 路徑、CORS 來源
│       ├── types/movie.ts        # 領域模型（Movie / MovieSummary / Paginated / MovieMeta）
│       ├── db/
│       │   ├── connection.ts     # DatabaseSync 單例（WAL + foreign_keys）
│       │   ├── schema.ts         # movies 表 + 索引
│       │   ├── seed.ts           # 寫入種子數據；支持 --reset
│       │   └── bootstrap.ts      # 開機時建表 + 空表時自動 seed
│       ├── data/movies.ts        # 24 部電影的種子數據 + seedMovies()
│       ├── repositories/movieRepository.ts   # SQL ↔ 領域對象 映射
│       ├── services/movieService.ts          # 業務邏輯（分頁、facets）
│       ├── routes/movies.ts / meta.ts        # HTTP 層
│       └── middleware/errors.ts  # 統一錯誤信封 + 404
└── client/               # React + Vite 前端
    ├── index.html
    ├── vite.config.ts    # dev server 5199，/api 代理到 4100
    └── src/
        ├── main.tsx / App.tsx     # 入口 + 路由表
        ├── pages/                 # HomePage / MoviesPage / MovieDetailPage / NotFoundPage
        ├── components/            # Layout、SiteHeader/Footer、MovieCard、FilmPoster、
        │                          # SearchBar、Marquee、TicketStub、Rating、Atmosphere …
        ├── hooks/useApi.ts        # 通用數據獲取 hook（loading / error / reload / 防競態）
        ├── api/client.ts / movies.ts   # 類型化 API 客戶端
        ├── lib/posterArt.ts       # 程序化海報算法（seeded RNG + skyline + genre motif）
        ├── styles/tokens.css / global.css / components.css
        └── types/movie.ts         # 鏡像後端 API 契約
```

---

## 安裝與啟動

前置：**Node ≥ 22.6**（建議 24/26）。

```bash
# 1. 安裝依賴（npm workspaces，一次裝好前後端）
npm install

# 2. 初始化數據庫（可選 —— 伺服器首次啟動時會自動建表並寫入 24 部種子電影）
npm run seed
# 需要清空重建：npm run seed -- --reset

# 3. 同時啟動 API 與前端
npm run dev
```

啟動後：

- 前端：<http://localhost:5199>
- API：<http://localhost:4100>

單獨啟動：

```bash
npm run dev:api   # 只起後端（node --watch src/index.ts）
npm run dev:web   # 只起前端（vite）
npm run start     # 生產模式下只起後端（node src/index.ts）
npm run build     # 前端類型檢查 + 產出 client/dist
npm run typecheck # 前後端 tsc --noEmit
```

### 端口與環境變數

開發機上 4000 / 5173 等常用端口可能被其他項目佔用，因此本項目固定使用：

- **API：4100**（`server/src/config.ts`，可用 `PORT` 覆蓋）
- **前端：5199**（`client/vite.config.ts`，`strictPort: true`）

若需修改：

- 改 API 端口 → 設 `PORT`，並同步更新 `client/vite.config.ts` 裡的 `server.proxy.target`
- 改前端端口 → 更新 `client/vite.config.ts` 的 `server.port`，並同步更新 `CORS_ORIGINS`

可選環境變數（見 `server/.env.example`）：`PORT`、`DB_PATH`、`CORS_ORIGINS`。

> 前端通過 Vite 的 `/api` 代理訪問後端，因此瀏覽器端始終使用同源相對路徑（如 `/api/movies`），開發與生產行為一致。

---

## 數據庫初始化

- 數據庫文件：`server/data/neon-reel.sqlite`（**已加入 `.gitignore`**，不入庫）
- 首次啟動時 `bootstrap.ts` 檢測到空表會**自動寫入種子數據**，無需手動操作
- 手動重寫：`npm run seed`；清空重建：`npm run seed -- --reset`
- 表結構見 `server/src/db/schema.ts`：多值字段（cast / genres / moods / locations）以 **JSON 列**存儲 —— MVP 只整體讀取單部影片，避免過早引入關聯表；未來做導演檔案/人物關係時可平滑升級為獨立表，而不改動 API 契約

---

## API

Base URL：`http://localhost:4100`。錯誤統一返回 `{ "error": { "code": "...", "message": "..." } }`。

| 方法 | 路徑 | 說明 |
| --- | --- | --- |
| `GET` | `/api/health` | 健康檢查，返回 `{ status, service, time }` |
| `GET` | `/api/movies` | 電影列表（搜索 / 過濾 / 排序 / 分頁） |
| `GET` | `/api/movies/featured?limit=6` | 首頁精選電影 |
| `GET` | `/api/movies/:id` | 單部電影詳情（404 → `MOVIE_NOT_FOUND`） |
| `GET` | `/api/meta` | 類型與年代 facets + 資料集總數 |

`GET /api/movies` 查詢參數：

| 參數 | 類型 | 說明 |
| --- | --- | --- |
| `search`（別名 `q`） | string | 按片名 / 英文片名 / 導演模糊匹配，最長 80 字符 |
| `genre` | string | 按類型過濾（已預留） |
| `decade` | number | 按年代過濾，如 `1990` |
| `sort` | `year` \| `rating` \| `title` | 排序字段（白名單校驗） |
| `order` | `asc` \| `desc` | 排序方向，默認 `desc` |
| `limit` | number | 每頁條數，1–100，默認 60 |
| `offset` | number | 偏移量，默認 0 |

返回信封：`{ items, total, limit, offset, hasMore }`。

示例：

```bash
curl "http://localhost:4100/api/movies?search=%E9%87%8D%E5%BA%86"   # 搜索「重庆」
curl "http://localhost:4100/api/movies?decade=1990&sort=rating"     # 90 年代按評分排序
curl "http://localhost:4100/api/movies/chungking-express"           # 重慶森林詳情
```

---

## 架構設計要點

**為什麼要分層**：`routes`（HTTP 解析/校驗）→ `services`（業務邏輯、分頁、facets）→ `repositories`（SQL ↔ 領域對象）→ `db`（連接與 schema）。`services` 不接觸 `req`/`res`，便於單測；`repositories` 隔離存儲細節，日後換庫或加緩存不改上層。

**前端數據獲取**：統一的 `useApi<T>` hook 封裝 loading / error / errorStatus / reload，並在卸載時取消過期請求以**防止競態**。列表頁狀態完全由 URL（`q` / `decade` / `sort`）驅動，因而可分享、可前進後退。

**程序化海報**：不依賴遠程圖片。`posterArt.ts` 以片名 FNV-1a 雜湊作種子、用 mulberry32 生成確定性隨機，據此繪製城市天際線、霓虹圓盤與類型專屬 motif（`blades`/`bars`/`orbs`/`rings`/`blocks`），`FilmPoster.tsx` 組裝為內聯 SVG，並按影片 `accent` 上色。

**為未來功能預留的空間**：
- 導演檔案 → `Movie.director` 已有，且 `MovieLocation` 類型已定義
- 電影年代專題 → 首頁年代走廊已按 `decade` 聚合，`/api/meta` 已提供 `decades` facet
- 類型篩選 → API 已支持 `genre` 參數，`/api/meta` 已提供 `genres` facet（首頁類型索引暫為信息展示）
- 人物關係 → `cast` 已結構化；JSON 列可平滑升級為關聯表
- 電影地圖 → `Movie.locations`（含 `name` / `district` / `lat` / `lng`）已在數據模型中

---

## 授權

本項目為學習與作品展示用途。電影資料（片名、簡介、年份等）為事實性信息，僅作示例。
