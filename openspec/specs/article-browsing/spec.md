# article-browsing Specification

## Purpose

技術記事の閲覧体験を提供する。トップページでの最新記事一覧、ページネーション付きの記事一覧、個別記事の詳細表示を担う。記事データは microCMS の `articles` エンドポイントから取得し、全ページを静的生成（SSG）する。

## Requirements

### Requirement: トップページの記事一覧表示

システムは `/` で全記事をカード形式の一覧として表示し、ビルド時に静的生成 SHALL する。

#### Scenario: トップページを訪問する

- **WHEN** 利用者が `/` にアクセスする
- **THEN** microCMS の `articles` エンドポイントから取得した記事がカード一覧で表示される
- **AND** 各カードにはタイトル、公開日（相対表記）、カテゴリ／タグが表示される
- **AND** `/articles/page/1` へ遷移する導線が表示される

### Requirement: ページネーション付き記事一覧

システムは `/articles/page/[id]` で 1 ページあたり 6 件（`PAGE_ARTICLE_LIMIT = 6`）の記事を表示し、ページ送りを提供 SHALL する。

#### Scenario: 記事一覧ページを閲覧する

- **WHEN** 利用者が `/articles/page/[id]` にアクセスする
- **THEN** `offset = (id - 1) * 6`、`limit = 6` で取得した該当ページの記事がカード一覧で表示される
- **AND** 総記事数に基づき `Math.ceil(totalCount / 6)` 個のページがビルド時に生成される

#### Scenario: ページを移動する

- **WHEN** 利用者がページネーションの前後ページリンクを操作する
- **THEN** 対応する `/articles/page/[id]` に遷移し、そのページの記事が表示される

#### Scenario: 検索モード時のページネーション

- **WHEN** 一覧ページで検索が実行されている
- **THEN** ページネーションは非表示となり、検索結果の表示に切り替わる

### Requirement: 記事詳細表示

システムは `/articles/[id]` で記事タイトル・公開日・本文・カテゴリ／タグを表示 SHALL する。

#### Scenario: 記事を開く

- **WHEN** 利用者が `/articles/[id]` にアクセスする
- **THEN** `articles` エンドポイントから `contentId` 指定で取得した記事が表示される
- **AND** タイトル、JST 表記の公開日、レンダリングされた本文、`/tags/[slug]/page/1` へリンクするカテゴリ／タグが表示される

#### Scenario: 未生成の記事パスにアクセスする

- **WHEN** 利用者がまだ静的生成されていない記事 ID にアクセスする
- **THEN** フォールバック `blocking` により都度生成（ISR 相当）が試みられ、存在しない場合は 404 となる
