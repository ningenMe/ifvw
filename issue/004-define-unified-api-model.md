# Unified API Modelを設計する

関連: #1 (concept)

## 背景

設計方針(#1)の「Protocol非依存」を実現するため、OpenAPIをはじめ将来のProtobuf/GraphQL/AsyncAPIなどを共通表現できる内部モデル(Unified API Model)が必要。
UIやTry it out機能はこのモデルにのみ依存し、protocol固有の詳細を意識しない形にする。

## やること

- 以下を表現できるモデルを設計する
  - service / endpoint(HTTP method, path, RPCなど protocol差異を吸収できる形)
  - description
  - parameters
  - request body
  - response
  - schema
  - enum
  - examples
  - deprecatedフラグ
- 型定義またはスキーマとしてドキュメント化する

## 完了条件

- Unified API Modelの型定義/スキーマがコードまたはドキュメントとして存在する
- OpenAPIの代表的な要素(上記項目)がすべてモデルにマッピングできることを確認済み
