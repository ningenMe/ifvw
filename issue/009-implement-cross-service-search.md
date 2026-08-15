# 横断検索機能を実装する

関連: #1 (concept), #006

## 背景

全サービスのAPIをまとめて検索できるようにする。例:

```
GetUser

User Service
  GET /users/{id}

Profile Service
  GET /users/{id}/profile
```

## やること

- 検索UI(ヘッダーの検索ボックス)を実装する
- endpoint名/path/descriptionなどを対象にインクリメンタル検索できるようにする
- 検索結果からサービスをまたいでどのサービスにヒットしたか分かる表示にする
- 検索結果選択でAPI詳細画面(`008-implement-api-detail-view`)に遷移できるようにする

## 完了条件

- 複数サービスにまたがるキーワードで検索し、サービスをまたいだ結果一覧が表示される
