# ユビキタス語彙

`ifvw`のドメインで使う言葉の定義。コード上の型名・ファイル名・issueの文言は、ここで定めた言葉に揃える。

MVPで対応するのはOpenAPIのみ。他protocolの列は将来の対応先を検討するための参考。

## 用語

| 用語                        | 意味                                                                                                                                                                                | 型名(案)                                                                           |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Interface**               | 1つのプロダクト/サービスが持つ、schema・operationなどを含む「interface定義」全体を指す**概念語**。コード上の型名としては使わない(TypeScriptの`interface`キーワードと紛らわしいため) | (型名にはしない。ドキュメント・プロパティ名用の言葉)                               |
| **InterfaceDefinition**(仮) | 上記Interfaceを表すコード上の型。1つのSourceをfetch+parseした結果。`operations`・(将来)`schemas`などを持つ                                                                          | `InterfaceDefinition { operations: Operation[] }`                                  |
| **Operation**               | InterfaceDefinitionに属する、1つの呼び出し可能/観測可能な単位                                                                                                                       | `InterfaceOperation { id, action, target, description?, deprecated? }`(既存のまま) |
| **action**                  | Operationの「動詞的な軸」                                                                                                                                                           | `InterfaceOperation.action`                                                        |
| **target**                  | Operationの「対象の軸」                                                                                                                                                             | `InterfaceOperation.target`                                                        |
| **Schema**                  | Operationのparameters/request body/responseなどが参照する型定義。未実装                                                                                                             | 未定義(005/008で必要になった時に設計)                                              |
| **Source**                  | 1つのInterfaceをどこから取得するかのconfig上の記述。取得方法(`type`+`url`)のみを持ち、Interface自体は持たない                                                                       | `Source { type, url }`(nameは持たない)                                             |
| **Catalog**(仮)             | 複数のInterfaceDefinitionを束ねた全体。UIが表示する対象そのもの                                                                                                                     | 未定義(007/009などUI実装時に設計)                                                  |
| **Parser**                  | 1つのprotocolの生仕様を、InterfaceDefinitionへ変換するコンポーネント。protocolごとに1つ存在する                                                                                     | `parseOpenApi()`(既存)、将来 `parseGrpc()` など                                    |

## protocolごとの対応

| 用語                 | OpenAPI                                        | gRPC / Protobuf                                           | GraphQL                                          | AsyncAPI(Kafkaなど)                             | JSON Schema(単体)             |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------- | ----------------------------- |
| **Interface**        | 1つのOpenAPI document                          | 1つの`.proto`ファイル(またはservice定義群)                | 1つのGraphQL schema                              | 1つのAsyncAPI document                          | 1つのJSON Schemaファイル(群)  |
| **Operation**        | 1つのpath × 1つのHTTP method(Operation Object) | serviceの1つのrpc method                                  | Query/Mutation/Subscriptionの1 field             | 1つのchannelの1つのoperation(publish/subscribe) | 該当なし(operationを持たない) |
| **action**           | HTTP method(`GET`/`POST`/...)                  | 呼び出し種別(unary/client-stream/server-stream/bidi)      | root type(`QUERY`/`MUTATION`/`SUBSCRIPTION`)     | `PUBLISH`/`SUBSCRIBE`                           | -                             |
| **target**           | path(`/users/{id}`)                            | `Service.Method`                                          | field名(例: `user`)                              | channel/topic名(例: `user.created`)             | -                             |
| **Schema**           | Schema Object(`components/schemas`)            | message型                                                 | type(object/input/enum/scalar)                   | messageのpayload schema                         | JSON Schemaそのもの           |
| **Source(取得方法)** | `https://.../openapi.json` などのURL           | `.proto`ファイル(ローカル/リポジトリ)、reflection APIなど | introspection endpoint、または`.graphql`ファイル | AsyncAPI documentのURL                          | `.json`スキーマファイルのURL  |
| **Parser**           | 実装済み(`@apidevtools/swagger-parser`ベース)  | 未実装                                                    | 未実装                                           | 未実装                                          | 未実装                        |

## 未確定・議論中

- `InterfaceDefinition`という型名の是非(他の案: `Definition`, `InterfaceDocument`)
- `Source`は本当に`{ type, url }`だけでいいか。将来sourceの取得方法自体が複数(URL/ローカルファイル/Git/GitHub/S3等、[issue #1](https://github.com/ningenMe/ifvw/issues/1)の設計方針3参照)になった時にどう拡張するか
- `Catalog`という言葉が適切か
