# dev-projects Specification

## Purpose

開発したプロジェクトを紹介するショーケースページを提供する。プロジェクトデータは microCMS ではなくページ内に静的定義され、カードのグリッドレイアウトで表示する。

## Requirements

### Requirement: プロジェクト一覧表示

システムは `/dev` で開発プロジェクトをカードのグリッドで表示 SHALL する。

#### Scenario: 開発プロジェクトページを訪問する

- **WHEN** 利用者が `/dev` にアクセスする
- **THEN** `getStaticProps` 内に静的定義されたプロジェクト配列がカード一覧で表示される
- **AND** 各カードにタイトル・説明・使用技術バッジ、存在すればデモ URL・GitHub URL へのリンクを表示する
- **AND** レイアウトはレスポンシブのグリッド（`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`）である

### Requirement: 技術バッジ表示

システムは各プロジェクトの使用技術を、技術名と指定カラーのバッジ（`TechBadge`）で表示 SHALL する。

#### Scenario: 使用技術を表示する

- **WHEN** プロジェクトカードが描画される
- **THEN** `technologies` の各要素を `name` と `color` を用いたバッジとして表示する
