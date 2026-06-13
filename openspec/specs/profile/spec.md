# profile Specification

## Purpose

ブログ運営者のプロフィール情報を表示する静的ページを提供する。アカウント（外部リンク）、職種、自己紹介を掲載する。

## Requirements

### Requirement: プロフィール表示

システムは `/profile` で運営者のプロフィールを静的に表示 SHALL する。

#### Scenario: プロフィールページを訪問する

- **WHEN** 利用者が `/profile` にアクセスする
- **THEN** Account・Job・About を含むプロフィールが表示される
- **AND** GitHub・Zenn への外部リンクが新規タブ・`rel="noreferrer"` で開く
- **AND** データ取得は行わず、ビルド時に静的生成される
