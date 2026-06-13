## Why

ヘッダーは現在ロゴ・ナビゲーション・テーマ切替で構成され、視覚的な動きがなくやや無機質である。テーマ切替アイコンの隣に Lottie によるアニメーションアイコンを置くことで、ブランド感とサイトの個性（ポートフォリオとしての表現力）を高める。装飾目的に限定し、既存機能の挙動は一切変えない。

## What Changes

- ヘッダーの `ThemeToggle` の隣に、Lottie アニメーションを再生する装飾アイコンを追加する
- アニメーションは**常時ループ自動再生**する（クリック等のインタラクションは持たない）
- アイコンのサイズは**テーマ切替アイコン（`ThemeToggle`）と同程度**（`w-5 h-5` 相当）にする
- **PC・モバイル双方で表示**する（モバイルでも非表示にしない）
- 新規 atoms コンポーネント `LottieIcon` として切り出す
- 描画ライブラリ `@lottiefiles/dotlottie-react` を新規依存として追加する
- アニメーション素材は `public/dog.lottie`（`/dog.lottie` で参照）を読み込む
- 純粋な装飾のため `aria-hidden` 扱いとし、支援技術には公開しない
- 既存の `ThemeToggle` の挙動・テーマ切替ロジックは変更しない（非破壊）

## Capabilities

### New Capabilities
<!-- なし。ヘッダー UI の追加要素であり、既存の site-navigation capability に属する -->

### Modified Capabilities
- `site-navigation`: グローバルヘッダーに、テーマ切替アイコンの隣で再生される装飾用 Lottie アニメーションアイコンの要件を追加する

## Impact

- **依存追加**: `@lottiefiles/dotlottie-react`（React 19 / Next.js 16 Pages Router 対応）
- **新規ファイル**: `src/components/atoms/LottieIcon.tsx`（素材 `public/dog.lottie` は配置済み）
- **変更ファイル**: `src/components/layout/Header.tsx`（アイコンの配置）、`package.json`
- **SSR**: Pages Router 環境のため、クライアント専用描画となるよう SSR 安全に実装する
- **パフォーマンス**: アニメーションアセット（`dog.lottie`、約 5KB）の読み込みコストが増える。ヘッダー（全ページ共通）かつ常時再生のため、軽量アセットの採用とクライアント専用 dynamic import で影響を抑える
- **アクセシビリティ**: 装飾要素として `aria-hidden`、`prefers-reduced-motion` への配慮（低減時は再生を抑止）
