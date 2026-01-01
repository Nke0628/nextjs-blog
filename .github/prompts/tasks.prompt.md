# タスク分割

> **パラメータ**: `$ARGUMENTS` に `identifier` を指定してください
>
> - 形式: `/tasks <identifier>`
> - 例: `/tasks SMP-123`
>
> **指示**: このプロンプトはタスク分割を目的としています。
>
> - コードの実装・修正は行わないでください
> - `spec/<identifier>/design.md` を読み込み、実装タスクを分割してください
> - 1タスク = 1PR を目安に
> - 受け入れ条件は `requirement.md` を参照
> - 出力ファイル: `spec/<identifier>/tasks.md`

---

## 参照ドキュメント

#file:spec/{identifier}/requirement.md
#file:spec/{identifier}/design.md

---

# tasks.md の出力形式

## タスク一覧

| No  | タスク名   | 概要         | 対応UC   | 依存 |
| --- | ---------- | ------------ | -------- | ---- |
| 1   | {タスク名} | {概要}       | UC-001   | -    |
| 2   | {タスク名} | {概要}       | UC-001   | 1    |
| 3   | {タスク名} | {概要}       | UC-002   | -    |

---

## 次のステップ

> 実装を開始してください:
>
> ```
> /implement <identifier> 1
> ```
>
> テストケースを作成する場合:
>
> ```
> /testcase <identifier>
> ```
