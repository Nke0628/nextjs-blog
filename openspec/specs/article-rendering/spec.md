# article-rendering Specification

## Purpose

microCMS から HTML 文字列として取得した記事本文を、安全にパースしてスタイル付きの React コンポーネントへ変換する。見出し・リスト・引用・補足・リンク・コードブロックの装飾、コードのシンタックスハイライト、日付の JST フォーマットを担う。

## Requirements

### Requirement: HTML 本文のパースとスタイリング

システムは `ArticleTemplate` で `html-react-parser` を用いて本文 HTML をパースし、要素ごとに Tailwind スタイルを適用 SHALL する。

#### Scenario: 本文の各要素を描画する

- **WHEN** 記事本文 HTML がレンダリングされる
- **THEN** 各要素に以下のスタイルが適用される
  - `<h1>`: `text-3xl mt-6` と下線
  - `<h2>`: `text-xl mt-6`
  - `<ul>`: `py-2 px-5 list-disc`
  - `<ol>`: `py-2 px-5 list-decimal`
  - `<blockquote>`: `p-4 my-4 border-l-4`（gray 系背景）
  - `<aside>`: `p-4 my-4 border-l-4`（blue 系背景）
  - `<a>`: `text-sky-500 px-1 py-2 break-words` かつ `rel="noreferrer"`

#### Scenario: aside タグのデコード

- **WHEN** 本文 HTML 内に HTML エンティティ化された `<aside>` タグが含まれる
- **THEN** `<aside>` のみデコードして要素として描画し、その他のエンティティは保持される

### Requirement: コードシンタックスハイライト

システムは本文中の `<code>` ブロックを highlight.js でハイライト SHALL する。

#### Scenario: コードブロックを表示する

- **WHEN** 本文に `<code>` 要素が含まれる
- **THEN** highlight.js により対象言語サブセット（`js`, `html`, `css`, `xml`, `typescript`, `python`, `php`）で自動判定・ハイライトされる
- **AND** `hybrid` スタイルが適用される

### Requirement: 日付の JST フォーマット

システムは UTC で保存された日時を日本標準時（JST）の文字列へ変換する `formatUTCtoJST` を提供 SHALL する。

#### Scenario: 公開日を表示する

- **WHEN** `formatUTCtoJST(utcDate, format?)` が呼ばれる
- **THEN** dayjs の UTC・timezone プラグインを用いて JST に変換した文字列を返す
- **AND** `format` 省略時は `'YYYY年MM月DD日 HH:mm'` を用いる
