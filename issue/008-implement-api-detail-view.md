# API詳細画面を実装する

関連: #1 (concept), #007

## 背景

Swagger UIに近いUIで、選択したエンドポイントの詳細情報を表示する必要がある。

## やること

- 選択したエンドポイントについて以下を表示する
  - HTTP method / path
  - description
  - parameters
  - request body
  - response
  - schema
  - enum
  - examples
  - deprecatedであることの表示
- Unified API Modelを入力として描画する(protocol固有の情報に依存しない実装にする)

## 完了条件

- 上記すべての項目が、サンプルのOpenAPI specificationに対して正しく表示される
