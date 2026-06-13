# theming Specification

## Purpose

ライト／ダークの 2 テーマ切り替えを提供する。テーマ状態は React Context で管理し、localStorage に永続化する。Tailwind のクラス戦略（`darkMode: 'class'`）に基づき、ルート要素にクラスを付与して配色を切り替える。

## Requirements

### Requirement: テーマの永続化と初期化

システムはテーマ状態を localStorage（キー `theme`）に永続化し、初回アクセス時はダークをデフォルト SHALL とする。

#### Scenario: 初回アクセス

- **WHEN** localStorage に `theme` が保存されていない状態でアプリが読み込まれる
- **THEN** ダークテーマを適用し、`theme = 'dark'` を localStorage に保存する
- **AND** `document.documentElement` と `document.body` に `dark` クラスを付与する

#### Scenario: 再訪問

- **WHEN** localStorage に `theme` が保存された状態でアプリが読み込まれる
- **THEN** 保存されたテーマ（`light` または `dark`）を適用する

### Requirement: テーマ切り替え

システムは `ThemeToggle` でライト／ダークを切り替え SHALL する。

#### Scenario: テーマを切り替える

- **WHEN** 利用者が `ThemeToggle` を操作する
- **THEN** ライト⇄ダークが切り替わり、localStorage が更新され、ルート要素の `dark` クラスが付与／除去される
- **AND** ダーク時は太陽アイコン、ライト時は月アイコンを表示する
