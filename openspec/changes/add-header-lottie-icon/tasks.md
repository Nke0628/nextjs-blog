## 1. 準備（依存）

- [x] 1.1 `@lottiefiles/dotlottie-react` を `blog/app` に追加する（`npm install @lottiefiles/dotlottie-react`）
- [x] 1.2 素材 `public/dog.lottie`（配置済み）が `/dog.lottie` で読めることを確認する

## 2. LottieIcon コンポーネント

- [x] 2.1 `src/components/atoms/LottieIcon.tsx` を新規作成する
- [x] 2.2 `DotLottieReact` を `next/dynamic` の `ssr: false` で読み込み、SSR 安全にする
- [x] 2.3 Props（`src`, `size`/`className`, `loop?`=既定true, `autoplay?`=既定true, `ariaHidden?`）を定義し、ラッパーに固定サイズ枠を与えてレイアウトシフトを防ぐ
- [x] 2.4 `loop`・`autoplay` を有効にして常時ループ自動再生する（ホバー等のイベント制御は持たない）
- [x] 2.5 装飾要素として `aria-hidden="true"` を付与する
- [x] 2.6 `prefers-reduced-motion: reduce` 時は自動再生を抑止し静止表示にする

## 3. ヘッダーへの組み込み

- [x] 3.1 `src/components/layout/Header.tsx` の `ThemeToggle` の隣（`flex items-center gap-4` 内）に `LottieIcon` を配置する
- [x] 3.2 アセットパス（`/dog.lottie`）を定数化し差し替え可能にする
- [x] 3.3 サイズ・間隔を調整する（枠 `w-24 h-24`。素材内余白を相殺するため犬に `-mr-7` を当て `ThemeToggle` 側へ寄せる。画質はスーパーサンプリング(実DPR×2)＋`quality:100` でシャープ化）
- [x] 3.4 PC・モバイル双方で表示されること（非表示クラスを付けない）を確認する

## 4. 検証

- [ ] 4.1 `npm run dev` でライト/ダーク双方でアイコンが表示され、常時ループ再生されることを確認する（ブラウザ目視・要ユーザー確認）
- [x] 4.2 モバイル幅でもアイコンが表示されること（非表示クラス未付与をコードで確認）
- [x] 4.3 既存ヘッダー機能（ナビ・テーマ切替・モバイルメニュー）が従来どおり動作する（構造変更なし／build 成功で確認）
- [x] 4.4 `npm run build` が成功し、SSR/hydration エラーが出ないことを確認する
- [ ] 4.5 `npm run lint` を通す（注: `next lint` が Next.js 16 で廃止＋ESLint 9 と `.eslintrc.json` が非互換でプロジェクト全体の lint が壊れている。本変更とは無関係の既存問題。TypeScript 型チェックは build で成功）
- [x] 4.6 `prefers-reduced-motion: reduce` 時に自動再生されない実装（`usePrefersReducedMotion` で再生を抑止）
