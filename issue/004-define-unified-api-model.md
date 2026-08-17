# Unified Interface Modelを設計する

関連: #1 (concept)

## 背景

設計方針(#1)の「Protocol非依存」を実現するため、OpenAPIをはじめ将来のProtobuf/GraphQL/AsyncAPIなどを共通表現できる内部モデル(Unified Interface Model)が必要。
UIやTry it out機能はこのモデルにのみ依存し、protocol固有の詳細を意識しない形にする。

## やること

- 最初から作り込まず、`operation`(id・action・target・description・deprecated程度)の最小限の型を用意する
- parameters・request body・response・schema・enum・examplesは、それぞれが実際に必要になるタスク(005の parser実装、008の詳細画面実装など)で、実データを見ながら型を育てる

## 完了条件

- 最小限のUnified Interface Modelの型定義が `src/core/model.ts` に存在する
- ビルドが通る

## 決定

`src/core/model.ts` に以下の最小限の型だけを定義した。

```ts
export interface InterfaceOperation {
  id: string;
  action: string;
  target: string;
  description?: string;
  deprecated?: boolean;
}
```

`UnifiedInterfaceModel { operations: InterfaceOperation[] }` というラッパー型も一度作ったが、`operations` 以外にフィールドが無く `InterfaceOperation[]` と実質同じだったため削除した。parser・site生成のどちらもまだ実装されておらず、ラッパーが必要かどうか判断する材料が無い状態だった。schemasなど他のトップレベル項目が実際に必要になったタイミングで、必要な形のラッパーを作る。

当初、schemaを再帰的な判別可能union(object/array/ref/enum/...)として設計し、named ref解決の仕組みまで作っていたが、parserもUIもまだ存在しない段階でそこまでやるのは過剰だった。実装がないまま設計だけ進めると、実際にコードを書いた時に想定と違う部分が出て手戻りになる。そのため巻き戻し、parameters/request body/response/schema/enum/examplesは型として定義しない状態にした。これらは `005-implement-openapi-parser` で実際のOpenAPI specificationをパースしながら、`008-implement-api-detail-view` で実際にUIに表示しながら、必要になった時点で型を足していく。

一方、`method`/`path`ではなく`action`/`target`という名前にする判断は残した。これは実装の複雑さを増やすものではなく単なる命名で、OpenAPI(action: `GET`, target: `/users/{id}`)以外のprotocol(gRPC/GraphQL/AsyncAPIなど)でも「動詞的な軸」「対象の軸」に分解できることは検証済みのため、後から`method`/`path`に戻すよりこのまま使う方が手戻りが少ない。

`UnifiedInterfaceModel` には当初 `service: string` というフィールドがあり、複数source登録時のグルーピング表示に使う想定だった。しかしこれもまだ使う側(source登録・一覧UI)が存在せず、名前の意味(サービス名なのかsource名なのかapplication名なのか)も定まっていなかったため削除した。「どのsourceから来たモデルか」を管理する責務は、`UnifiedInterfaceModel` 自体ではなく `006-implement-source-registration`(sources.yamlの各エントリと生成されたモデルを紐付ける層)に置く想定。
