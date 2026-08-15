# OpenAPI parserを実装する

関連: #1 (concept), #004

## 背景

MVPではOpenAPIのみを対象とする。OpenAPI specification(JSON/YAML)を読み込み、
`004-define-unified-api-model` で定義したUnified API Modelへ変換するparserが必要。

## やること

- OpenAPI 3.x(JSON/YAML)をパースする
- endpoint、parameters、request body、response、schema、enum、examples、deprecatedをUnified API Modelにマッピングする
- `$ref` によるスキーマ参照を解決する
- 不正/非対応なspecificationに対するエラーハンドリングを行う

## 完了条件

- サンプルのOpenAPI specificationから、期待通りのUnified API Modelが生成されることをテストで確認できる
