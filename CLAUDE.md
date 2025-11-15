# Next.js Blog システム仕様書

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
| Next.js | 13.1.4 | Reactフレームワーク（Pages Router） |
| React | 18.2.0 | UIライブラリ |
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
| html-react-parser | 3.0.8 | HTML文字列のReactコンポーネント変換 |

### 2.4 開発ツール
| 技術 | バージョン | 用途 |
|------|-----------|------|
| ESLint | 8.57.0 | コード品質チェック |
| Prettier | 2.8.3 | コードフォーマット |
| @typescript-eslint | 7.3.1 | TypeScript用ESLint |

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
- **ISR (Incremental Static Regeneration)**: 未使用
- **ビルド時データ取得**: `getStaticProps` / `getStaticPaths`

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
│   │   ├── pages/               # ページコンポーネント
│   │   │   ├── _app.tsx         # アプリケーションルート
│   │   │   ├── _document.tsx    # HTMLドキュメント
│   │   │   ├── index.tsx        # トップページ
│   │   │   ├── articles/
│   │   │   │   ├── [id].tsx     # 記事詳細
│   │   │   │   └── page/
│   │   │   │       └── [id].tsx # 記事一覧（ページネーション）
│   │   │   ├── categories/
│   │   │   │   └── index.tsx    # カテゴリ一覧
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
├── Dockerfile
├── docker-compose.yml
├── CLAUDE.md                    # プロジェクト説明
└── SPECIFICATION.md             # 本ドキュメント（仕様書）
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

### 4.2 Category（カテゴリ）
```typescript
type categorie = {
  id: string      // カテゴリID
  name: string    // カテゴリ名
}

type categories = categorie[]
```

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

---

## 5. 機能仕様

### 5.1 記事閲覧機能

#### 5.1.1 トップページ（記事一覧）
- **URL**: `/`
- **機能**:
  - 最新記事を表示（全記事取得、ページネーション未適用）
  - 各記事のカード表示（タイトル、公開日、カテゴリバッジ）
  - 「記事一覧 →」ボタンでページネーション記事一覧へ遷移
- **データ取得**: `getStaticProps`でmicroCMS APIから記事一覧取得

#### 5.1.2 記事一覧（ページネーション）
- **URL**: `/articles/page/[id]`
- **機能**:
  - 1ページあたり6件の記事を表示
  - ページネーションコンポーネントで他ページへ移動可能
  - カード形式で記事表示
- **データ取得**:
  - `getStaticPaths`: 記事総数から必要ページ数を計算
  - `getStaticProps`: オフセット・リミット指定で該当ページの記事取得
- **定数**: `PAGE_ARTICLE_LIMIT = 6`

#### 5.1.3 記事詳細
- **URL**: `/articles/[id]`
- **機能**:
  - 記事タイトル・公開日・本文・カテゴリバッジを表示
  - 本文内のコードブロックをシンタックスハイライト
  - HTML要素の自動スタイリング（見出し、リスト、引用、リンク等）
  - `<aside>`タグのデコード対応
- **データ取得**:
  - `getStaticPaths`: 全記事IDからパス生成
  - `getStaticProps`: 記事IDから記事詳細取得

### 5.2 プロフィール機能
- **URL**: `/profile`
- **機能**:
  - 運営者のプロフィール情報表示
  - SNSリンク（GitHub、Zenn）
  - 職業・スキル・自己紹介テキスト
- **データ取得**: 静的データ（`getStaticProps`で空オブジェクト返却）

### 5.3 開発プロジェクト紹介機能
- **URL**: `/dev`
- **機能**:
  - 開発したプロジェクトの一覧表示
  - プロジェクトカード（タイトル、説明、技術バッジ、リンク）
  - グリッドレイアウト（1列〜3列、レスポンシブ）
- **データ取得**: 静的データ（`getStaticProps`でプロジェクト配列を返却）

### 5.4 カテゴリ機能
- **URL**: `/categories`
- **機能**: カテゴリ一覧表示（現時点では実装途中の可能性）

### 5.5 コードハイライト機能
- **ライブラリ**: highlight.js
- **対応言語**:
  - JavaScript
  - HTML
  - CSS
  - XML
  - TypeScript
  - Python
  - PHP
- **スタイル**: `hybrid.css`
- **実装**: `ArticleTemplate`コンポーネント内で`<code>`タグを検出し、自動ハイライト

### 5.6 日付フォーマット機能
- **ライブラリ**: Day.js（UTC・タイムゾーンプラグイン使用）
- **関数**: `formatUTCtoJST(utcDate, format)`
- **デフォルトフォーマット**: `'YYYY年MM月DD日 HH:mm'`
- **処理**: UTC文字列をJST（日本標準時）でフォーマット

### 5.7 ダークモード
- **実装**: `ThemeToggle`コンポーネント
- **スタイル**: Tailwind CSSの`dark:`クラスで対応

### 5.8 レスポンシブデザイン
- **フレームワーク**: Tailwind CSS
- **ブレークポイント**:
  - デフォルト: モバイル
  - `md:` (768px以上): タブレット
  - `lg:` (1024px以上): デスクトップ

---

## 6. ページ仕様詳細

### 6.1 トップページ (`/`)
| 項目 | 内容 |
|------|------|
| レイアウト | 記事カードリスト + 記事一覧ボタン |
| 最大幅 | `md:max-w-5xl` |
| データソース | microCMS `articles` endpoint |
| レンダリング | SSG（ビルド時生成） |

### 6.2 記事詳細ページ (`/articles/[id]`)
| 項目 | 内容 |
|------|------|
| レイアウト | タイトル + 公開日 + 本文 + カテゴリバッジ |
| 最大幅 | `md:w-3/5` |
| 特殊処理 | HTMLパース、コードハイライト、`<aside>`デコード |
| フォールバック | `false`（未存在パスは404） |

### 6.3 記事一覧ページ (`/articles/page/[id]`)
| 項目 | 内容 |
|------|------|
| レイアウト | SubHeading + 記事カードリスト + ページネーション |
| 表示件数 | 6件/ページ |
| ページ数計算 | `Math.ceil(totalCount / 6)` |
| データ取得 | `offset`, `limit`パラメータ使用 |

### 6.4 プロフィールページ (`/profile`)
| 項目 | 内容 |
|------|------|
| レイアウト | テーブル形式（Account, Job, About） |
| 最大幅 | `md:w-3/5` |
| 外部リンク | GitHub、Zenn（新規タブ、`noreferrer`） |

### 6.5 開発プロジェクトページ (`/dev`)
| 項目 | 内容 |
|------|------|
| レイアウト | グリッドレイアウト（1〜3列） |
| 最大幅 | `md:max-w-5xl` |
| カード内容 | タイトル、説明、技術バッジ、URL、GitHub URL |

---

## 7. コンポーネント設計

### 7.1 Atomic Design パターン
本プロジェクトは **Atomic Design** を採用し、コンポーネントを以下の階層で管理：

#### 7.1.1 Atoms（原子）
最小単位のUIコンポーネント

| コンポーネント | 責務 | Props |
|---------------|------|-------|
| `Badge` | カテゴリバッジ表示 | `text: string` |
| `Logo` | ロゴ表示 | なし |
| `Pagination` | ページネーション | `currentPage: number`, `totalCount: number`, `pageSize: number` |
| `TechBadge` | 技術バッジ表示 | `name: string`, `color: string` |
| `ThemeToggle` | ダークモード切り替えボタン | なし |

#### 7.1.2 Organisms（生命体）
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

#### 7.1.3 Templates（テンプレート）

| コンポーネント | 責務 | Props |
|---------------|------|-------|
| `ArticleCardList` | 記事カードのリスト表示 | `articles: articles` |

#### 7.1.4 Layout（レイアウト）

| コンポーネント | 責務 | Props |
|---------------|------|-------|
| `Container` | ページコンテナ | `children: ReactNode` |
| `Header` | ヘッダー（ナビゲーション、ロゴ） | なし |
| `Footer` | フッター（コピーライト） | なし |
| `SubHeading` | サブ見出し | `text: string` |

---

## 8. API仕様

### 8.1 microCMS API

#### 8.1.1 クライアント設定
```typescript
// src/modules/client.ts
import { createClient } from 'microcms-js-sdk'

export const client = createClient({
  serviceDomain: 'nk-blog',
  apiKey: process.env.API_KEY || '',
})
```

#### 8.1.2 記事一覧取得
```typescript
// 全記事取得
const data = await client.get({ endpoint: 'articles' })
// data.contents: article[]
// data.totalCount: number

// ページネーション付き取得
const data = await client.get({
  endpoint: 'articles',
  queries: {
    offset: (pageNum - 1) * 6,
    limit: 6,
  },
})
```

#### 8.1.3 記事詳細取得
```typescript
const data = await client.get({
  endpoint: 'articles',
  contentId: id
})
// data: article
```

### 8.2 環境変数
| 変数名 | 説明 | 必須 |
|--------|------|------|
| `API_KEY` | microCMS APIキー | ✅ |

**設定ファイル**: `.env.local` (Gitignoreで除外)

---

## 9. スタイリング仕様

### 9.1 Tailwind CSS 設定
- **設定ファイル**: `tailwind.config.js`
- **グローバルスタイル**: `src/styles/globals.css`
- **ダークモード**: `class`戦略

### 9.2 主要スタイルパターン

#### 9.2.1 記事本文のスタイル
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

#### 9.2.2 レスポンシブレイアウト
```css
/* モバイルファースト */
.container { @apply mx-auto px-5 py-12; }

/* タブレット以上 */
@screen md {
  .container { @apply max-w-5xl; }
}
```

---

## 10. ビルド・デプロイメント

### 10.1 ビルドプロセス
```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start
```

### 10.2 静的生成タイミング
- **トリガー**: `git push`時にVercelが自動ビルド
- **生成対象**: 全ページ（SSG）
- **ビルド時間**: 記事数に依存（記事×ページ数）

### 10.3 デプロイ設定
- **プラットフォーム**: Vercel
- **ブランチ**: `main`ブランチへのプッシュで自動デプロイ
- **環境変数**: Vercelダッシュボードで`API_KEY`を設定
- **Node.js**: 22.x（`package.json`の`engines`で指定）

---

## 11. 開発・運用

### 11.1 開発コマンド
| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（http://localhost:3000） |
| `npm run build` | 本番ビルド |
| `npm start` | 本番サーバー起動 |
| `npm run lint` | ESLintでコードチェック |
| `npm run lintfix` | ESLint自動修正 |
| `npm run format` | Prettierでフォーマット |

### 11.2 Linting・Formatting
- **ESLint**: Next.js、TypeScript、Import順序のルール適用
- **Prettier**: コードフォーマット統一
- **設定ファイル**: `.eslintrc.json`, `.prettierrc`

### 11.3 Git管理
- **メインブランチ**: `main`
- **コミットメッセージ例**:
  - `SMP-10: 記事一覧の記事数を6にする`
  - `SMP-9: 記事の時刻をJSTにする`

### 11.4 開発環境（Docker）
```bash
# Dockerコンテナ起動
docker-compose up

# コンテナ停止
docker-compose down
```

---

## 12. セキュリティ考慮事項

### 12.1 環境変数管理
- `.env.local`でAPIキーを管理
- **Gitignore設定**: `.env.local`をコミット対象外に
- **Vercel環境変数**: プロダクションでは環境変数を暗号化保存

### 12.2 XSS対策
- **HTMLパース**: `html-react-parser`を使用し、安全にパース
- **外部リンク**: `rel="noreferrer"`で参照元情報漏洩を防止

### 12.3 HTTPS通信
- Vercel経由で自動HTTPS化
- microCMS APIもHTTPSで通信

---

## 13. パフォーマンス要件

### 13.1 SSG（Static Site Generation）
- 全ページをビルド時に静的生成
- 初回表示が高速（CDNキャッシュ活用）

### 13.2 画像最適化
- （現時点では画像使用が限定的）
- 今後: Next.js `<Image>`コンポーネント推奨

### 13.3 コード分割
- Next.jsの自動コード分割機能を活用
- ページごとに必要なJavaScriptのみ読み込み

---

## 14. 今後の拡張性

### 14.1 実装予定機能
- **検索機能**: 記事タイトル・本文での全文検索
- **タグ機能**: カテゴリとは別に、より細かいタグ分類
- **関連記事表示**: 記事詳細ページに関連記事を表示
- **コメント機能**: 外部サービス（Disqus等）との連携
- **RSS配信**: RSSフィードの生成

### 14.2 カテゴリページの完成
- 現状、`/categories`は実装途中
- カテゴリごとの記事一覧表示機能を追加予定

### 14.3 ISR（Incremental Static Regeneration）
- 記事数増加時のビルド時間短縮のため、ISR導入検討

### 14.4 Analytics連携
- Google Analytics、Vercel Analyticsの導入

---

## 15. トラブルシューティング

### 15.1 ビルドエラー
**問題**: microCMS APIキーが未設定
```
Error: API_KEY is required
```
**解決策**: `.env.local`にAPIキーを設定

### 15.2 記事が表示されない
**問題**: microCMSのエンドポイント名が異なる
**解決策**: `client.ts`の`serviceDomain`を確認

### 15.3 日付がUTCで表示される
**問題**: `formatUTCtoJST`関数未使用
**解決策**: `utils/date.ts`の関数を使用

---

## 16. 参考資料

### 16.1 公式ドキュメント
- [Next.js Documentation](https://nextjs.org/docs)
- [microCMS Documentation](https://document.microcms.io/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### 16.2 使用ライブラリ
- [highlight.js](https://highlightjs.org/)
- [Day.js](https://day.js.org/)
- [html-react-parser](https://www.npmjs.com/package/html-react-parser)

---

## 17. 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| 2025-11-12 | 1.0.0 | 初版作成 | Claude |

---

## 18. 連絡先

- **GitHub**: https://github.com/Nke0628/nextjs-blog
- **本番環境**: https://nextjs-blog-lilac-seven-63.vercel.app/
- **開発者**: Nke0628

---

**本ドキュメントの管理**
- このドキュメントは、システムの仕様変更に合わせて随時更新すること
- 大規模な機能追加時は、バージョンを更新すること
