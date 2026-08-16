# Unified Interface Model — プロトコル対応表

## 目的

`ifvw`はOpenAPI・gRPC(Protobuf)・GraphQL・AsyncAPI・JSON Schemaなど、形式の異なるinterface定義を1つのUIで表示する。protocolごとの差異は内部モデル(Unified Interface Model)に吸収し、UIおよびTry it out機能はこのモデルにのみ依存する。protocol固有のデータ構造を直接扱うことはない。

型定義の実体は `src/core/model.ts`。このドキュメントは、そこで定義した型の各protocolへのマッピングを定める仕様。将来protocolのparserを実装する人、sourceとして登録する人は、自分の対象がどう表示されるかをここで確認する。

MVPで実装するのはOpenAPIのみ。他protocolはこのマッピングに従って将来実装する。

## operationの表現

1つのoperationは、**action**(動詞的な軸)と**target**(対象の軸)の組で表現する。

| Protocol            | 1 operationの単位                    | action                                                      | target                              |
| ------------------- | ------------------------------------ | ----------------------------------------------------------- | ----------------------------------- |
| OpenAPI (REST)      | 1つのpathの1つのHTTP method          | `GET` / `POST` / `PUT` / `DELETE`                           | `/users/{id}`                       |
| gRPC / Protobuf     | serviceの1つのRPC method             | `UNARY` / `CLIENT_STREAM` / `SERVER_STREAM` / `BIDI_STREAM` | `UserService.GetUser`               |
| GraphQL             | Query/Mutation/Subscriptionの1 field | `QUERY` / `MUTATION` / `SUBSCRIPTION`                       | field名(例: `user`)                 |
| AsyncAPI(Kafkaなど) | 1つのchannelの1つのoperation         | `PUBLISH` / `SUBSCRIBE`                                     | channel/topic名(例: `user.created`) |
| JSON Schema(単体)   | operationを持たない                  | -                                                           | -                                   |

JSON Schemaのようにoperationを持たず型定義(schema)だけを提供するsourceは、`operations` を空配列にし `schemas` のみを持つ。これは正常なケースとして扱う。

## action/target以外の要素

| 要素          | 定義                                                                                                                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `parameters`  | `in` は `"path" \| "query" \| "header" \| "cookie"` の4種類。OpenAPI(REST)のparameterの置き場所を表す。GraphQLの引数やAsyncAPIのchannel parameterなど他protocolの概念は、そのprotocolのparserを実装するタイミングで選択肢を追加する              |
| `requestBody` | 1つのschemaを持つ送信物。OpenAPIのrequest body、gRPCのrequestメッセージ、GraphQLのmutation input、AsyncAPIのpublish payloadをこの1つの形で表す                                                                                                   |
| `responses`   | 空配列を許容する。`status` は任意項目。OpenAPIはHTTP status codeごとに複数のresponseを持つが、gRPCは1つのresponseメッセージ + gRPC status code、GraphQLは1つの戻り値の型、AsyncAPIのpublish operationは応答を持たない(fire-and-forget)ことが多い |

## 型名

型名に「Api」という単語は含めない(`UnifiedInterfaceModel` / `InterfaceOperation` など)。OpenAPI固有ではなく、あらゆるprotocolに対して中立な名前にする。
