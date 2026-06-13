# Next.js Blog システム仕様書

> **このドキュメントの位置づけ**
> CLAUDE.md は Claude（および開発者）向けの **作業指示・規約・構成情報**（How / Where）をまとめる。
> 各機能の **要件・振る舞い**（What / Why）の正本は `openspec/specs/` にあり、本書はそれを参照する（[5章](#5-機能仕様正本は-openspec-specs)）。
> 機能仕様を変更する際は、CLAUDE.md ではなく該当 spec を更新すること。

## 1. システム概要

### 1.1 システム名
Next.js Blog - 個人技術ブログアプリケーション

### 1.2 システム目的
技術記事の投稿・閲覧を目的とした個人ブログシステム。microCMSをヘッドレスCMSとして活用し、記事の管理・配信を効率的に行う。開発者のポートフォリオとしての役割も担う。

### 1.3 対象ユーザー
- 主要ユーザー: ブログ閲覧者（技術記事を読みたい開発者）
- 管理ユーザー: ブログ運営者（microCMS管理画面から記事投稿）

### 1.4 システムURL
- 本番環境: https://nextjs-blog-lilac-seven-63.vercel.app/

---

## 2. 技術スタック

### 2.1 フロントエンド
| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js | 16.0.10 | Reactフレームワーク（Pages Router） |
| React | 19.2.3 | UIライブラリ |
| TypeScript | 4.9.4 | 型安全な開発 |
| Tailwind CSS | 3.2.4 | CSSフレームワーク |

### 2.2 バックエンド / CMS
| 技術 | バージョン | 用途 |
|------|-----------|------|
| microCMS | - | ヘッドレスCMS（記事管理） |
| microcms-js-sdk | 2.3.2 | microCMS APIクライアント |

### 2.3 ユーティリティ
| 技術 | バージョン | 用途 |
|------|-----------|------|
| Day.js | 1.11.18 | 日付処理・フォーマット |
| highlight.js | 11.7.0 | コードシンタックスハイライト |
| html-react-parser | 5.2.10 | HTML文字列のReactコンポーネント変換 |

### 2.4 開発ツール
| 技術 | バージョン | 用途 |
|------|-----------|------|
| ESLint | 9.0.0 | コード品質チェック |
| Prettier | 2.8.3 | コードフォーマット |
| @typescript-eslint | 8.0.0 | TypeScript用ESLint |

### 2.5 インフラ
- **ホスティング**: Vercel
- **Node.js**: 22.x
- **コンテナ**: Docker / Docker Compose（開発環境）

---

## 3. システムアーキテクチャ

### 3.1 アプリケーション構成

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ HTTPS
       ▼
┌─────────────┐
│   Vercel    │ (CDN + Hosting)
│  Next.js    │
└──────┬──────┘
       │
       │ API Request
       ▼
┌─────────────┐
│  microCMS   │ (Headless CMS)
└─────────────┘
```

### 3.2 レンダリング戦略
- **SSG (Static Site Generation)**: 全ページで採用
- **ISR / オンデマンド生成**: 記事系ページは `getStaticPaths` の `fallback: 'blocking'` を採用し、未生成パスはアクセス時に都度生成（プロフィール・タグ別一覧の一部は `false`）
- **ビルド時データ取得**: `getStaticProps` / `getStaticPaths`
- **API Routes**: 検索（`/api/search`）・下書きプレビュー（`/api/preview`, `/api/exit-preview`）はサーバー側 API で処理

### 3.3 ディレクトリ構造

```
nextjs-blog/
├── blog/app/                    # Next.jsアプリケーション本体
│   ├── src/
│   │   ├── components/          # コンポーネント
│   │   │   ├── atoms/           # 基本UIコンポーネント
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Logo.tsx
│   │   │   │   ├── Pagination.tsx
│   │   │   │   ├── SearchBox.tsx    # 記事検索ボックス
│   │   │   │   ├── TagBadge.tsx     # タグバッジ
│   │   │   │   ├── TechBadge.tsx
│   │   │   │   └── ThemeToggle.tsx
│   │   │   ├── organisms/       # 複合コンポーネント
│   │   │   │   ├── ArticleCard.tsx
│   │   │   │   ├── ArticleTemplate.tsx
│   │   │   │   └── ProjectCard.tsx
│   │   │   ├── template/        # テンプレート
│   │   │   │   └── ArticleCardList.tsx
│   │   │   └── layout/          # レイアウト
│   │   │       ├── Container.tsx
│   │   │       ├── Footer.tsx
│   │   │       ├── Header.tsx
│   │   │       └── SubHeading.tsx
│   │   ├── contexts/            # React Context
│   │   │   └── ThemeContext.tsx # テーマ（ライト/ダーク）状態管理
│   │   ├── pages/               # ページコンポーネント
│   │   │   ├── _app.tsx         # アプリケーションルート
│   │   │   ├── _document.tsx    # HTMLドキュメント
│   │   │   ├── index.tsx        # トップページ
│   │   │   ├── api/             # API Routes
│   │   │   │   ├── search.ts        # 記事全文検索
│   │   │   │   ├── preview.ts       # 下書きプレビュー開始
│   │   │   │   └── exit-preview.ts  # 下書きプレビュー終了
│   │   │   ├── articles/
│   │   │   │   ├── [id].tsx     # 記事詳細（プレビュー対応）
│   │   │   │   └── page/
│   │   │   │       └── [id].tsx # 記事一覧（ページネーション＋検索）
│   │   │   ├── tags/
│   │   │   │   ├── index.tsx    # タグ一覧
│   │   │   │   └── [slug]/page/
│   │   │   │       └── [pageId].tsx # タグ別記事一覧（ページネーション）
│   │   │   ├── categories/
│   │   │   │   └── index.tsx    # カテゴリ一覧（レガシー・後述）
│   │   │   ├── profile/
│   │   │   │   └── index.tsx    # プロフィール
│   │   │   └── dev/
│   │   │       └── index.tsx    # 開発プロジェクト紹介
│   │   ├── modules/             # 外部サービス連携
│   │   │   └── client.ts        # microCMSクライアント
│   │   ├── types/               # TypeScript型定義
│   │   │   └── type.ts
│   │   ├── utils/               # ユーティリティ関数
│   │   │   └── date.ts          # 日付フォーマット
│   │   └── styles/              # グローバルスタイル
│   │       └── globals.css
│   ├── public/                  # 静的ファイル
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── .eslintrc.json
├── openspec/
│   └── specs/                   # 機能仕様の正本（capability 単位の spec.md）
├── Dockerfile
├── docker-compose.yml
└── CLAUDE.md                    # 本ドキュメント（Claude 向け作業指示・規約）
```

---

## 4. データモデル

### 4.1 Article（記事）
```typescript
type article = {
  id: string              // 記事ID（microCMS自動生成）
  title: string           // 記事タイトル
  content: string         // 記事本文（HTML形式）
  publishedAt: string     // 公開日時（ISO 8601形式）
  categories: categories  // カテゴリリスト
}

type articles = article[]
```

**特記事項:**
- `content`はHTML形式で格納され、`ArticleTemplate`コンポーネントでパース・レンダリング
- `publishedAt`はUTC形式で保存され、表示時にJSTに変換

### 4.2 Category / Tag（カテゴリ・タグ）
```typescript
type categorie = {
  id: string             // カテゴリID
  name: string           // カテゴリ名
  slug?: string          // URL用スラッグ（タグ別一覧のルーティングに使用）
  description?: string   // 説明（オプション）
}

type categories = categorie[]

// UI・ルーティング上は「タグ」と呼称。データ実体は microCMS の categories
type tag = categorie
type tags = categories
```

**特記事項:**
- 「タグ」機能は microCMS の `categories` エンドポイントを利用しており、`tag` は `categorie` のエイリアス
- 記事の絞り込みは `slug`（ルーティング）と `id`（`categories[contains]` フィルタ）を併用

### 4.3 Project（開発プロジェクト）
```typescript
type project = {
  id: string                // プロジェクトID
  title: string             // プロジェクト名
  description: string       // プロジェクト概要
  technologies: technology[] // 使用技術
  image?: string            // プロジェクト画像URL（オプション）
  url?: string              // デモURL（オプション）
  githubUrl?: string        // GitHubリポジトリURL（オプション）
}

type projects = project[]
```

### 4.4 Technology（技術）
```typescript
type technology = {
  name: string   // 技術名（例: "Next.js", "TypeScript"）
  color: string  // バッジ表示用カラーコード（例: "#3178C6"）
}
```

### 4.5 PreviewData（プレビュー）
```typescript
type PreviewData = {
  contentId: string   // プレビュー対象の記事ID
  draftKey: string    // microCMS 下書きキー
}
```

---

## 5. 機能仕様（正本は OpenSpec specs）

> **機能の詳細な振る舞い・要件は `openspec/specs/` を正本とする。**
> 本セクションは capability の索引のみを示す。各機能の WHAT/WHY（要件・シナリオ）を
> 追加・変更する場合は CLAUDE.md ではなく該当 spec を更新すること
> （OpenSpec の change → sync/archive ワークフローを利用）。

### 5.1 Capability 一覧

| Capability（spec） | 主なURL | 概要 |
|---|---|---|
| [`article-browsing`](openspec/specs/article-browsing/spec.md) | `/`, `/articles/page/[id]`, `/articles/[id]` | 記事のトップ一覧・ページネーション一覧（6件/頁）・詳細表示 |
| [`article-rendering`](openspec/specs/article-rendering/spec.md) | （記事本文） | HTML本文パース・要素スタイリング・コードハイライト・JST日付 |
| [`article-search`](openspec/specs/article-search/spec.md) | `/api/search`, `/articles/page/[id]?q=` | 記事の全文検索（サーバーAPI＋一覧上の検索UI） |
| [`tags`](openspec/specs/tags/spec.md) | `/tags`, `/tags/[slug]/page/[pageId]` | タグ（microCMS categories）一覧・タグ別記事一覧 |
| [`content-preview`](openspec/specs/content-preview/spec.md) | `/api/preview`, `/api/exit-preview` | microCMS 下書きのプレビュー |
| [`profile`](openspec/specs/profile/spec.md) | `/profile` | 運営者プロフィール（静的） |
| [`dev-projects`](openspec/specs/dev-projects/spec.md) | `/dev` | 開発プロジェクト紹介（データはページ内に静的定義） |
| [`theming`](openspec/specs/theming/spec.md) | （全ページ） | ライト/ダークテーマ（ダーク既定・localStorage永続化） |
| [`site-navigation`](openspec/specs/site-navigation/spec.md) | （全ページ） | グローバルヘッダー・フッター・ナビゲーション |

### 5.2 横断仕様（spec に含まれない補足）

- **定数**: 記事一覧・タグ別一覧の表示件数は `PAGE_ARTICLE_LIMIT = 6`
- **コードハイライト対応言語**: `js`, `html`, `css`, `xml`, `typescript`, `python`, `php`（スタイル: `hybrid`）
- **日付**: `utils/date.ts` の `formatUTCtoJST(utcDate, format?)`（既定 `'YYYY年MM月DD日 HH:mm'`）
- **レスポンシブ**: Tailwind の `md:`(768px〜) / `lg:`(1024px〜) ブレークポイント
- **`/categories` ページ（レガシー）**: 実装は残るが、リンク先 `/articles?category_id=...` を処理するルートが存在せず機能していない。タグ機能（`/tags`）が後継。新規実装では使用しない

---

## 6. コンポーネント設計

### 6.1 Atomic Design パターン
本プロジェクトは **Atomic Design** を採用し、コンポーネントを以下の階層で管理：

#### 6.1.1 Atoms（原子）
最小単位のUIコンポーネント

| コンポーネント | 責務 | Props |
|---------------|------|-------|
| `Badge` | カテゴリバッジ表示 | `text: string` |
| `Logo` | ロゴ表示 | なし |
| `Pagination` | ページネーション | `currentPage: number`, `totalCount: number`, `pageSize: number` |
| `SearchBox` | 記事検索ボックス | `onSearch`, `initialValue?` |
| `TagBadge` | タグバッジ表示 | `tag` |
| `TechBadge` | 技術バッジ表示 | `name: string`, `color: string` |
| `ThemeToggle` | ライト/ダーク切り替えボタン | なし |

#### 6.1.2 Organisms（生命体）
複数のAtomsを組み合わせた複合コンポーネント

| コンポーネント | 責務 | Props |
|---------------|------|-------|
| `ArticleCard` | 記事カード（タイトル、日付、カテゴリ） | `article: article` |
| `ArticleTemplate` | 記事本文の表示・パース | `contentHtml: string` |
| `ProjectCard` | プロジェクトカード表示 | `project: project` |

**`ArticleTemplate`の特殊処理:**
- HTMLパース（`html-react-parser`使用）
- 要素ごとのスタイリング（h1, h2, ul, ol, blockquote, aside, a, code）
- コードブロックのシンタックスハイライト
- `<aside>`タグのHTML entity デコード

#### 6.1.3 Templates（テンプレート）

| コンポーネント | 責務 | Props |
|---------------|------|-------|
| `ArticleCardList` | 記事カードのリスト表示 | `articles: articles` |

#### 6.1.4 Layout（レイアウト）

| コンポーネント | 責務 | Props |
|---------------|------|-------|
| `Container` | ページコンテナ | `children: ReactNode` |
| `Header` | ヘッダー（ナビゲーション、ロゴ、テーマ切替、モバイルメニュー） | なし |
| `Footer` | フッター（コピーライト、外部リンク） | なし |
| `SubHeading` | サブ見出し | `text: string` |

### 6.2 Context

| Context | 責務 |
|---------|------|
| `ThemeContext` | ライト/ダークテーマの状態管理・localStorage 永続化（既定: ダーク） |

---

## 7. API仕様

### 7.1 microCMS クライアント

#### 7.1.1 クライアント設定
```typescript
// src/modules/client.ts
import { createClient } from 'microcms-js-sdk'

export const client = createClient({
  serviceDomain: 'nk-blog',
  apiKey: process.env.API_KEY || '',
})
```

#### 7.1.2 記事の取得

```typescript
// 全記事取得
const data = await client.get({ endpoint: 'articles' })
// data.contents: article[] / data.totalCount: number

// ページネーション付き取得
const data = await client.get({
  endpoint: 'articles',
  queries: { offset: (pageNum - 1) * 6, limit: 6 },
})

// 記事詳細
const data = await client.get({ endpoint: 'articles', contentId: id })

// 下書きプレビュー
const data = await client.get({ endpoint: 'articles', contentId: id, queries: { draftKey } })

// 全文検索
const data = await client.get({ endpoint: 'articles', queries: { q: keyword } })

// タグ絞り込み（categories エンドポイント由来の id を使用）
const data = await client.get({
  endpoint: 'articles',
  queries: { filters: `categories[contains]${tagId}`, offset, limit: 6 },
})
```

#### 7.1.3 タグ（categories）の取得

```typescript
const data = await client.get({ endpoint: 'categories' })            // 一覧
const data = await client.get({ endpoint: 'categories', queries: { filters: `slug[equals]${slug}` } }) // slug 解決
```

### 7.2 内部 API Routes

| エンドポイント | メソッド | 用途 |
|---|---|---|
| `/api/search?q=<query>` | GET | 記事の全文検索（`{ contents, totalCount }` を返却） |
| `/api/preview?contentId=&draftKey=` | GET | 下書きプレビュー開始（preview cookie 設定後リダイレクト） |
| `/api/exit-preview` | GET | プレビュー終了（`/` へリダイレクト） |

### 7.3 環境変数
| 変数名 | 説明 | 必須 |
|--------|------|------|
| `API_KEY` | microCMS APIキー | ✅ |

**設定ファイル**: `.env.local` (Gitignoreで除外)

---

## 8. スタイリング仕様

### 8.1 Tailwind CSS 設定
- **設定ファイル**: `tailwind.config.js`
- **グローバルスタイル**: `src/styles/globals.css`
- **ダークモード**: `class`戦略

### 8.2 主要スタイルパターン

#### 8.2.1 記事本文のスタイル
| 要素 | スタイル |
|------|---------|
| `<h1>` | `text-3xl mt-6` + 下線 |
| `<h2>` | `text-xl mt-6` |
| `<ul>` | `py-2 px-5 list-disc` |
| `<ol>` | `py-2 px-5 list-decimal` |
| `<blockquote>` | `p-4 my-4 border-l-4 border-gray-500 bg-gray-200` |
| `<aside>` | `p-4 my-4 border-l-4 border-blue-500 bg-blue-50` |
| `<a>` | `text-sky-500 px-1 py-2 break-words` |
| `<code>` | `hljs`（highlight.jsスタイル） |

#### 8.2.2 レスポンシブレイアウト
```css
/* モバイルファースト */
.container { @apply mx-auto px-5 py-12; }

/* タブレット以上 */
@screen md {
  .container { @apply max-w-5xl; }
}
```

---

## 9. ビルド・デプロイメント

### 9.1 ビルドプロセス
```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start
```

### 9.2 静的生成タイミング
- **トリガー**: `git push`時にVercelが自動ビルド
- **生成対象**: 全ページ（SSG）
- **ビルド時間**: 記事数に依存（記事×ページ数）
- **オンデマンド生成**: 記事系ページは `fallback: 'blocking'` のため、ビルド後に追加された記事もアクセス時に生成される

### 9.3 デプロイ設定
- **プラットフォーム**: Vercel
- **ブランチ**: `main`ブランチへのプッシュで自動デプロイ
- **環境変数**: Vercelダッシュボードで`API_KEY`を設定
- **Node.js**: 22.x（`package.json`の`engines`で指定）

---

## 10. 開発・運用

### 10.1 開発コマンド
| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（http://localhost:3000） |
| `npm run build` | 本番ビルド |
| `npm start` | 本番サーバー起動 |
| `npm run lint` | ESLintでコードチェック |
| `npm run lintfix` | ESLint自動修正 |
| `npm run format` | Prettierでフォーマット |

### 10.2 Linting・Formatting
- **ESLint**: Next.js、TypeScript、Import順序のルール適用
- **Prettier**: コードフォーマット統一
- **設定ファイル**: `.eslintrc.json`, `.prettierrc`

### 10.3 Git管理
- **メインブランチ**: `main`
- **コミットメッセージ例**:
  - `SMP-10: 記事一覧の記事数を6にする`
  - `SMP-9: 記事の時刻をJSTにする`

### 10.4 仕様の更新フロー（OpenSpec）
- 機能の要件・振る舞いを変更する場合は、まず `openspec/specs/` の該当 spec を更新する
- 新機能は OpenSpec の change として起票し、実装後に main spec へ反映（sync / archive）する
- 利用可能なワークフロー: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive`, `/opsx:explore`

### 10.5 開発環境（Docker）
```bash
# Dockerコンテナ起動
docker-compose up

# コンテナ停止
docker-compose down
```

---

## 11. セキュリティ考慮事項

### 11.1 環境変数管理
- `.env.local`でAPIキーを管理
- **Gitignore設定**: `.env.local`をコミット対象外に
- **Vercel環境変数**: プロダクションでは環境変数を暗号化保存

### 11.2 XSS対策
- **HTMLパース**: `html-react-parser`を使用し、安全にパース（`style`属性は除去）
- **外部リンク**: `rel="noreferrer"`で参照元情報漏洩を防止

### 11.3 HTTPS通信
- Vercel経由で自動HTTPS化
- microCMS APIもHTTPSで通信

---

## 12. パフォーマンス要件

### 12.1 SSG（Static Site Generation）
- 全ページをビルド時に静的生成
- 初回表示が高速（CDNキャッシュ活用）

### 12.2 画像最適化
- （現時点では画像使用が限定的）
- 今後: Next.js `<Image>`コンポーネント推奨

### 12.3 コード分割
- Next.jsの自動コード分割機能を活用
- ページごとに必要なJavaScriptのみ読み込み

---

## 13. 今後の拡張性

### 13.1 実装済み（旧「実装予定」より反映）
- **検索機能**: 記事の全文検索（`article-search` spec）
- **タグ機能**: タグ別記事一覧（`tags` spec）
- **下書きプレビュー**: microCMS draft プレビュー（`content-preview` spec）

### 13.2 実装予定機能
- **関連記事表示**: 記事詳細ページに関連記事を表示
- **コメント機能**: 外部サービス（Disqus等）との連携
- **RSS配信**: RSSフィードの生成

### 13.3 レガシーの整理
- `/categories` ページはタグ機能（`/tags`）に置き換え済み。リンク先ルートが無く機能していないため、削除または `/tags` への統合を検討

### 13.4 Analytics連携
- Google Analytics、Vercel Analyticsの導入

---

## 14. トラブルシューティング

### 14.1 ビルドエラー
**問題**: microCMS APIキーが未設定
```
Error: API_KEY is required
```
**解決策**: `.env.local`にAPIキーを設定

### 14.2 記事が表示されない
**問題**: microCMSのエンドポイント名が異なる
**解決策**: `client.ts`の`serviceDomain`を確認

### 14.3 日付がUTCで表示される
**問題**: `formatUTCtoJST`関数未使用
**解決策**: `utils/date.ts`の関数を使用

---

## 15. 参考資料

### 15.1 公式ドキュメント
- [Next.js Documentation](https://nextjs.org/docs)
- [microCMS Documentation](https://document.microcms.io/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### 15.2 使用ライブラリ
- [highlight.js](https://highlightjs.org/)
- [Day.js](https://day.js.org/)
- [html-react-parser](https://www.npmjs.com/package/html-react-parser)

---

## 16. 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| 2025-11-12 | 1.0.0 | 初版作成 | Claude |
| 2026-06-13 | 1.1.0 | 実装に合わせて更新（Next.js 16 / React 19）。検索・タグ・プレビュー機能を反映。機能仕様を OpenSpec `openspec/specs/` へ移譲し、CLAUDE.md は作業指示・規約に整理 | Claude |

---

## 17. 連絡先

- **GitHub**: https://github.com/Nke0628/nextjs-blog
- **本番環境**: https://nextjs-blog-lilac-seven-63.vercel.app/
- **開発者**: Nke0628

---

**本ドキュメントの管理**
- このドキュメントは、構成・規約・作業手順の変更に合わせて随時更新すること
- 機能の要件・振る舞いの変更は `openspec/specs/` 側で管理し、本書は索引・参照に留めること
- 大規模な機能追加時は、バージョンを更新すること
