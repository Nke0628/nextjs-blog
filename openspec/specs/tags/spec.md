# tags Specification

## Purpose

記事をタグ（microCMS の `categories` エンドポイント）で分類・絞り込みする機能を提供する。タグ一覧の表示、タグ別記事一覧（ページネーション付き）、記事カード／詳細でのタグバッジ表示を担う。UI・ルーティング上は「タグ」と呼称し、データ上は microCMS の categories を用いる。

## Requirements

### Requirement: タグ一覧

システムは `/tags` で全タグをクリック可能なバッジとして表示 SHALL する。

#### Scenario: タグ一覧を閲覧する

- **WHEN** 利用者が `/tags` にアクセスする
- **THEN** `categories` エンドポイントから取得したタグがバッジで一覧表示される
- **AND** 各バッジは `/tags/[slug]/page/1` にリンクする

### Requirement: タグ別記事一覧

システムは `/tags/[slug]/page/[pageId]` で当該タグに属する記事を 1 ページ 6 件（`PAGE_ARTICLE_LIMIT = 6`）でページネーション表示 SHALL する。

#### Scenario: タグで絞り込んだ記事を閲覧する

- **WHEN** 利用者が `/tags/[slug]/page/[pageId]` にアクセスする
- **THEN** `slug[equals]<slug>` でタグを特定し、`categories[contains]<tagId>` で絞り込んだ記事を `offset`／`limit: 6` で取得・表示する
- **AND** 見出しに「#<タグ名> の記事一覧」、ページネーション（basePath `/tags/<slug>/page`）が表示される
- **AND** ビルド時に全タグ × ページ数のパスが静的生成される（フォールバック `false`）

#### Scenario: 記事のないタグ

- **WHEN** 当該タグに紐づく記事が存在しない
- **THEN** 「このタグの記事はまだありません」を表示する

### Requirement: 記事のタグバッジ

システムは記事カードおよび記事詳細で、記事に紐づくタグをバッジ表示 SHALL する。

#### Scenario: 記事のタグを表示する

- **WHEN** 記事カードまたは記事詳細が表示される
- **THEN** 記事の各カテゴリ／タグがバッジとして表示され、対応するタグ別一覧へリンクする
