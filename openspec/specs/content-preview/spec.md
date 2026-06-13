# content-preview Specification

## Purpose

microCMS の下書き（draft）記事を公開前に確認するためのプレビュー機能を提供する。Next.js のプレビューモードと microCMS の `draftKey` を組み合わせ、下書き内容を記事詳細ページで表示する。

## Requirements

### Requirement: プレビュー開始 API

システムは `GET /api/preview?contentId=<id>&draftKey=<key>` でプレビューモードを開始 SHALL する。

#### Scenario: 下書きのプレビューを開始する

- **WHEN** `contentId` と `draftKey` を伴うリクエストを受け取る
- **THEN** `draftKey` で microCMS への取得を試みて妥当性を検証する
- **AND** `setPreviewData({ contentId, draftKey })` を設定し、`/articles/<contentId>` にリダイレクトする

#### Scenario: パラメータ不足

- **WHEN** `contentId` または `draftKey` が欠落している
- **THEN** 401 を返す

### Requirement: プレビューモードでの記事表示

システムは記事詳細ページでプレビューモードを検知し、下書き内容を表示 SHALL する。

#### Scenario: プレビューモードで記事を開く

- **WHEN** プレビューモードで `/articles/[id]` が表示される
- **THEN** `previewData` の `draftKey` を用いて下書きを取得・表示する
- **AND** 「プレビューモード中」の通知バナーと「プレビューを終了」ボタンを表示する

### Requirement: プレビュー終了 API

システムは `GET /api/exit-preview` でプレビューモードを解除 SHALL する。

#### Scenario: プレビューを終了する

- **WHEN** 利用者がプレビュー終了を操作する
- **THEN** `clearPreviewData()` を実行し、`/` にリダイレクトする
