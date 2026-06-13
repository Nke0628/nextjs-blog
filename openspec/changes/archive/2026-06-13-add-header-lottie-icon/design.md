## Context

ヘッダー（`src/components/layout/Header.tsx`）は全ページ共通で、右側に `ThemeToggle`（`src/components/atoms/ThemeToggle.tsx`）とモバイルメニューボタンを配置している。本変更では `ThemeToggle` の隣に Lottie の装飾アニメーションアイコンを追加する。

技術的制約:
- Next.js 16 / React 19 / Pages Router（`src/pages`）。`getStaticProps` ベースの SSG。
- Lottie 系ライブラリはブラウザ API（`document`, Canvas/WASM）に依存するため SSR 非対応。Pages Router では `next/dynamic` の `ssr: false` でクライアント専用描画にする必要がある。
- アニメーション素材は `public/dog.lottie`（約 5KB、配置済み）を `/dog.lottie` で参照する。
- 用途は装飾のみ・常時ループ自動再生。クリック等の機能は持たない。`ThemeToggle` と同程度のサイズで、PC・モバイル双方に表示する。

## Goals / Non-Goals

**Goals:**
- `ThemeToggle` の隣に Lottie 装飾アイコンを表示し、常時ループ自動再生する
- `ThemeToggle` と同程度のサイズで、PC・モバイル双方に表示する
- 再利用可能な atoms コンポーネント（`LottieIcon`）として切り出す
- SSR 安全（hydration mismatch を起こさない）に実装する
- 既存のヘッダー・テーマ切替の挙動を一切変えない（非破壊）
- `prefers-reduced-motion` を尊重し、装飾要素として支援技術から隠す

**Non-Goals:**
- クリック・リンク・モーダル等のインタラクション付与
- テーマ切替アニメーションへの統合（今回は独立した装飾）
- アニメーション素材そのものの制作（手持ち素材を使用）
- 既存 `ThemeToggle` のリファクタ

## Decisions

### 1. ライブラリ: `@lottiefiles/dotlottie-react`
- LottieFiles 公式・React 19 対応・軽量（WASM ベースの dotLottie プレイヤー）。`.lottie`（圧縮）と `.json` の両形式を扱える。
- 代替案: `lottie-react`（lottie-web ラッパー、最も普及）。安定だが React 19 対応や個別 import 制御の点で dotlottie-react を優先。`@lottiefiles/react-lottie-player` は更新頻度の観点で見送り。

### 2. SSR 回避: `next/dynamic` + `ssr: false`
- `DotLottieReact` を直接 import せず、`LottieIcon` 内で `dynamic(() => import(...), { ssr: false })` を用いてクライアント専用に読み込む。
- 代替案: `useEffect` で mounted フラグを立てて条件描画。動くが dynamic import の方が宣言的でバンドル分割にも寄与するため採用。

### 3. コンポーネント設計: `atoms/LottieIcon.tsx`
- Props: `src`（アセットパス）, `className` / `size`, `loop?`（既定 true）, `autoplay?`（既定 true）, `ariaHidden?`（既定 true）。
- `DotLottieReact` に `loop` `autoplay` を渡し、常時ループ自動再生する（ホバー等のイベント制御は持たない）。
- `ThemeToggle` を一般化せず、独立した atoms として追加し Header で並置する。

### 4. アセット配置: `public/dog.lottie`
- 配置済みの `public/dog.lottie` を `src="/dog.lottie"` で参照。差し替え可能なように Header 側でパスを定数化。

### 5. サイズ・表示
- `ThemeToggle` のアイコン（`w-5 h-5`）と同程度に揃え、アニメーションは `w-5 h-5`〜`w-6 h-6` 程度の固定サイズ枠に収める（実装時に微調整）。全幅・大型表示はしない。
- PC・モバイル双方で表示し、モバイル専用の非表示クラス（`hidden md:block` 等）は付けない。

### 6. アクセシビリティ・モーション配慮
- ラッパーに `aria-hidden="true"`。`prefers-reduced-motion: reduce` 時は自動再生を抑止し静止フレーム表示（`matchMedia('(prefers-reduced-motion: reduce)')` で判定し `autoplay`/`loop` を無効化）。

## Risks / Trade-offs

- **[全ページ共通ヘッダーで常時再生のコスト]** → 軽量な `dog.lottie`（約 5KB）を採用し、`ssr: false` の dynamic import で初期 JS を分割。常時ループのため CPU 負荷は素材依存だが小サイズで軽微。
- **[hydration mismatch / SSR エラー]** → `ssr: false` でクライアント専用化し、サーバー描画時はプレースホルダ領域のみ確保（レイアウトシフト防止に固定サイズ）。
- **[dotLottie の WASM 取得失敗]** → 失敗時は何も表示しない（装飾のためフォールバック不要）。レイアウトは固定サイズ枠で吸収。

## Migration Plan

- 追加のみの非破壊変更のため特別な移行は不要。
- ロールバック: `Header.tsx` から `LottieIcon` の配置を外し、依存とアセットを削除すれば原状復帰できる。

## Open Questions

- なし（素材 `dog.lottie`・常時ループ・全幅表示・サイズ方針はすべて確定済み。最終サイズは実装時に視覚調整）。
