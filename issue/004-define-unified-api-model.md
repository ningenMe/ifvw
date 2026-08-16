# Unified Interface Modelを設計する

関連: #1 (concept)

## 背景

設計方針(#1)の「Protocol非依存」を実現するため、OpenAPIをはじめ将来のProtobuf/GraphQL/AsyncAPIなどを共通表現できる内部モデル(Unified Interface Model)が必要。
UIやTry it out機能はこのモデルにのみ依存し、protocol固有の詳細を意識しない形にする。

## やること

- 最初から作り込まず、`service`/`operation`(id・method・path・description・deprecated程度)の最小限の型を用意する
- parameters・request body・response・schema・enum・examplesは、それぞれが実際に必要になるタスク(005の parser実装、008の詳細画面実装など)で、実データを見ながら型を育てる

## 完了条件

- 最小限のUnified Interface Modelの型定義が `src/core/model.ts` に存在する
- ビルドが通る

## 決定

`src/core/model.ts` に以下の最小限の型だけを定義した。

```ts
export interface UnifiedInterfaceModel {
  service: string;
  operations: InterfaceOperation[];
}

export interface InterfaceOperation {
  id: string;
  method: string;
  path: string;
  description?: string;
  deprecated?: boolean;
}
```

当初、schemaを再帰的な判別可能union(object/array/ref/enum/...)として設計し、OpenAPI以外のprotocol(gRPC/GraphQL/AsyncAPI)への対応も一般化した`action`/`target`という抽象を先に作っていたが、parserもUIもまだ存在しない段階でこれをやるのは過剰だった。実装がないまま設計だけ進めると、実際にコードを書いた時に想定と違う部分が出て手戻りになる。

そのため一度巻き戻し、`method`/`path`という具体的なフィールドに戻し、parameters/request body/response/schema/enum/examplesは型として定義しない状態にした。これらは `005-implement-openapi-parser` で実際のOpenAPI specificationをパースしながら、`008-implement-api-detail-view` で実際にUIに表示しながら、必要になった時点で型を足していく。
