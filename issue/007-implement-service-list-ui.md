# サービス一覧UIを実装する

関連: #1 (concept), #006

## 背景

登録した複数サービスのAPIを、サービス単位でツリー表示するUIが必要。

```
Services
├── User Service
│   ├── GET  /users/{id}
│   └── POST /users
└── Order Service
    ├── GET  /orders/{id}
    └── POST /orders
```

## やること

- サイドバーにサービス→エンドポイント(method + path)のツリーを表示する
- エンドポイントを選択すると詳細画面(`008-implement-api-detail-view`)に遷移できるようにする
- サービス/エンドポイントの折りたたみ表示に対応する

## 完了条件

- 複数サービスのAPIがツリーで表示され、任意のエンドポイントを選択できる
