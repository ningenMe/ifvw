# OpenAPI parserを実装する

関連: #1 (concept), #004

## 背景

MVPではOpenAPIのみを対象とする。OpenAPI specification(JSON/YAML)を読み込み、
`004-define-unified-api-model` で定義した `InterfaceOperation` へ変換するparserが必要。

## やること

- OpenAPI 3.x(JSON/YAML)をパースする
- path × HTTP methodを `InterfaceOperation`(id, action, target, description, deprecated)にマッピングする
- `$ref` によるスキーマ参照を解決する

## 完了条件

- サンプルのOpenAPI specificationから、期待通りの `InterfaceOperation[]` が生成されることをテストで確認できる

## 決定

`src/parsers/openapi/index.ts` に `parseOpenApi(specPath: string): Promise<InterfaceOperation[]>` を実装した。

- パース・`$ref`解決には `@apidevtools/swagger-parser` の `dereference()` を使う
- HTTP methodは `openapi-types` の `OpenAPIV3.HttpMethods` を使って列挙する。型のために `openapi-types` をdevDependenciesに追加した(`@apidevtools/swagger-parser` の依存として間接的に入っていたものを、直接importする以上は明示的な依存にした)
- `id` は `operationId` があればそれを使い、無ければ `${method}_${path}` で組み立てる
- `description` は `operation.description ?? operation.summary` にフォールバックする

parameters・request body・response・schema・enum・examplesのマッピングは行っていない。`004-define-unified-api-model` の決定通り、`InterfaceOperation` 自体にまだこれらのフィールドが無いため。不正なspecificationのエラーハンドリングも独自には実装せず、`dereference()` が投げるエラーをそのまま呼び出し元に伝播させる(`$ref`解決に失敗するケースをテストで確認済み)。これらは `InterfaceOperation` が実際にフィールドを持つタイミングで合わせて拡張する。
