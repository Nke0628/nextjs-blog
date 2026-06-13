# article-search Specification

## Purpose

記事をキーワードで全文検索する機能を提供する。記事一覧ページ上の検索ボックスから、サーバー側 API 経由で microCMS の全文検索クエリを実行し、結果を一覧表示する。

## Requirements

### Requirement: 検索 API

システムは `GET /api/search?q=<query>` で microCMS の全文検索を実行し、結果を JSON で返却 SHALL する。

#### Scenario: 有効なクエリで検索する

- **WHEN** `q` を伴った GET リクエストを受け取る
- **THEN** `client.get({ endpoint: 'articles', queries: { q: q.trim() } })` を実行する
- **AND** `{ contents: article[], totalCount: number }` を返す

#### Scenario: 不正なリクエスト

- **WHEN** `q` が欠落している、または GET 以外のメソッドである
- **THEN** クエリ欠落時は 400、GET 以外は 405 を返す
- **AND** 取得失敗時は 500 を返す

### Requirement: 検索 UI

システムは記事一覧ページに検索ボックスを提供し、検索結果を一覧と統合表示 SHALL する。

#### Scenario: 検索を実行する

- **WHEN** 利用者が検索ボックスにキーワードを入力して送信する
- **THEN** `/articles/page/[currentPage]?q=<encodedQuery>` に遷移し、`/api/search` を呼び出す
- **AND** 取得中はローディング表示、結果ありなら件数（「『<query>』の検索結果: <count> 件」）とカード一覧、結果なしなら空状態を表示する

#### Scenario: 検索を解除する

- **WHEN** 利用者が検索解除を操作する
- **THEN** 検索モードが解除され、通常のページネーション付き一覧表示に戻る
