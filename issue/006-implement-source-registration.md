# Source登録機能を実装する

関連: #1 (concept), #005

## 背景

複数のOpenAPI specificationをsourceとして登録できるようにする必要がある。例:

```yaml
sources:
  - name: user-service
    type: openapi
    url: https://user.example.com/openapi.json
```

設計方針(#1)の「外部URLを直接参照できる」を満たし、`https://.../openapi.json` のようなURLを登録するだけで使えるようにする。

## やること

- `sources.yaml` のようなsource設定ファイルのスキーマを定義する
- 設定ファイルを読み込み、各sourceのURLからOpenAPI specificationを取得する
- 取得したspecificationを `005-implement-openapi-parser` に渡し、Unified API Modelを構築する
- source取得失敗時のエラーハンドリング(取得できないservice/URLがあっても他serviceは表示できるようにする)

## 完了条件

- 複数サービスを記述した `sources.yaml` を用意し、それぞれのAPIが正しく読み込まれることを確認できる
