# nextjs-blog

## プロジェクト概要

Next.js 13 を使用したブログアプリケーション。microCMS をヘッドレス CMS として使用し、記事管理を行っています。

- デプロイ URL: https://nextjs-blog-lilac-seven-63.vercel.app/
- Node.js バージョン: 22.x

## 技術スタック

- **フレームワーク**: Next.js 13.1.4 (Pages Router)
- **言語**: TypeScript 4.9.4
- **UI ライブラリ**: React 18.2.0
- **スタイリング**: Tailwind CSS 3.2.4
- **CMS**: microCMS (microcms-js-sdk)
- **日付処理**: Day.js
- **コードハイライト**: highlight.js
- **コンテナ**: Docker / Docker Compose

## プロジェクト構造

```
nextjs-blog/
├── blog/app/           # Next.jsアプリケーション本体
│   ├── src/
│   │   ├── components/
│   │   │   ├── atoms/        # 基本的なUIコンポーネント
│   │   │   ├── organisms/    # 複合コンポーネント
│   │   │   ├── template/     # テンプレートコンポーネント
│   │   │   └── layout/       # レイアウトコンポーネント
│   │   ├── pages/            # ページコンポーネント
│   │   │   ├── articles/     # 記事ページ
│   │   │   ├── categories/   # カテゴリページ
│   │   │   ├── profile/      # プロフィールページ
│   │   │   └── dev/          # 開発者ページ
│   │   ├── modules/          # microCMSクライアント設定
│   │   ├── types/            # TypeScript型定義
│   │   ├── utils/            # ユーティリティ関数
│   │   └── styles/           # グローバルスタイル
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## コンポーネント設計

Atomic Design パターンを採用:

- **atoms**: Badge, Pagination などの基本コンポーネント
- **organisms**: ArticleCard, ArticleTemplate などの複合コンポーネント
- **template**: ArticleCardList などのテンプレート
- **layout**: Header, Footer, Container などのレイアウト

## 主要な機能

- 記事一覧表示（ページネーション対応）
- 記事詳細表示
- カテゴリ別表示
- プロフィールページ
- コードシンタックスハイライト
- レスポンシブデザイン

## 開発コマンド

```bash
# アプリケーションディレクトリに移動
cd blog/app

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# Lint実行
npm run lint

# Lint自動修正
npm run lintfix

# コードフォーマット
npm run format
```

## 環境変数

microCMS API キーなどの環境変数設定が必要です。
`.env.local`ファイルに以下を設定:

```
MICROCMS_API_KEY=your_api_key
MICROCMS_SERVICE_DOMAIN=your_service_domain
```

## コーディング規約

- **Linting**: ESLint with Next.js config, TypeScript, Import plugin
- **Formatting**: Prettier
- **スタイリング**: Tailwind CSS
- **型定義**: `src/types/type.ts`に集約

## Git 管理

- メインブランチ: `main`
- 最近のコミット例:
  - SMP-10: 記事一覧の記事数を 6 にする
  - SMP-9: 記事の時刻を JST にする
  - SMP-8: その他の改善

## プロジェクト固有の注意事項

重要: このリポジトリで Jira 操作を行う際は、必ず以下を遵守してください：

対象プロジェクトの限定

操作対象は「XXX」プロジェクトのみ
URL: https://nk0628.atlassian.net/jira/software/projects/SMP/boards/1

安全な操作のガイドライン
全ての検索に project = XXX を含める
課題作成時は必ず project: XXX を指定
他のプロジェクトへの書き込み・更新は禁止

推奨される操作パターン

# 良い例

「project = XXX AND type = Bug の課題を検索」
「XXX プロジェクトに新しいストーリーを作成」

# 悪い例（プロジェクト指定なし）

「全てのバグを検索」 # 危険：他プロジェクトも含む
「新しい課題を作成」 # 危険：どのプロジェクトか不明
