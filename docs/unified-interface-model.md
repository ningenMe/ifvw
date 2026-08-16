# Unified Interface Model — プロトコル対応表

`ifvw`はOpenAPI・Protobuf/gRPC・GraphQL・AsyncAPI・JSON Schemaなど、形の異なるinterface定義を1つのUIで表示する。
そのためにはprotocolごとの差異を1つの内部モデル(Unified Interface Model)に吸収する必要がある。

このドキュメントは、コードで型を確定させる前に「各protocolの概念がどうマッピングされるか」を検証したもの。MVPで対応するのはOpenAPIのみだが、将来protocolを追加する人・sourceとして登録する人がここを見て自分のprotocolがどう表示されるか把握できることも目的にしている。

## 各protocolの「operation」概念

interfaceの多くは、**「動詞的な軸(action)」× 「対象の軸(target)」**という組で1つの操作(operation)を表現できる。

| Protocol            | 1 operationの単位                    | action の例                                                 | target の例                            |
| ------------------- | ------------------------------------ | ----------------------------------------------------------- | -------------------------------------- |
| OpenAPI (REST)      | 1つのpathの1つのHTTP method          | `GET` / `POST` / `PUT` / `DELETE`                           | `/users/{id}`                          |
| gRPC / Protobuf     | serviceの1つのRPC method             | `UNARY` / `CLIENT_STREAM` / `SERVER_STREAM` / `BIDI_STREAM` | `UserService.GetUser`                  |
| GraphQL             | Query/Mutation/Subscriptionの1 field | `QUERY` / `MUTATION` / `SUBSCRIPTION`                       | `user(id: ID!): User`(field名は`user`) |
| AsyncAPI(Kafkaなど) | 1つのchannelの1つのoperation         | `PUBLISH` / `SUBSCRIBE`                                     | `user.created`(topic/channel名)        |
| JSON Schema(単体)   | 該当なし。operationを持たないsource  | -                                                           | -                                      |

JSON Schemaのようにoperationを持たず、型定義(schema)だけを提供するsourceもある。この場合 `operations` は空配列になり、`schemas` だけが埋まる。これはモデル上、正常なケースとして扱う。

## action / targetで表現しきれない部分

action/targetの2軸で「一覧に出す1行」は表現できるが、以下はprotocolごとに存在有無・意味が異なり、今の型では無理に統一していない。

- **parameters**: OpenAPIは `path` / `query` / `header` / `cookie` という置き場所を持つ。GraphQLの引数(field argument)やAsyncAPIのchannel parameter(例: `user/{userId}/events`の`{userId}`)は概念としては近いが、「置き場所」の分類が同じではない。今のところ `in` は `"path" | "query" | "header" | "cookie"` のままにしており、対応するprotocolを実装するタイミングで選択肢を拡張する
- **requestBody**: OpenAPIのrequest body、gRPCのrequestメッセージ、GraphQLのmutation input、AsyncAPIのpublishするmessage payloadは、いずれも「1つのschemaを持つ送信物」という点で共通するため、そのまま流用できる見込み
- **responses**: OpenAPIはHTTP status codeごとに複数のresponseを持てるが、gRPCは1つのresponseメッセージ + gRPC status code、GraphQLは1つの戻り値の型、AsyncAPIのpublish operationはそもそも「応答」という概念を持たないことが多い(fire-and-forget)。そのため `responses` は空配列になりうる前提にし、`status` は必須にしない

## 結論

- `UnifiedInterfaceModel` / `InterfaceOperation` のように、型名から「Api」という単語を外し、OpenAPI固有ではないニュートラルな名前にする
- `method` / `path` という必須フィールドは `action` / `target` という汎用的な名前に置き換える。4つのprotocolすべてで「動詞的な軸」「対象の軸」に分解できることを確認できたため
- `responses` は空配列を許容し、`InterfaceResponse.status` は任意項目にする(gRPC/GraphQL/AsyncAPIには複数status codeという概念がないため)
- `parameters` の `in` 分類、`requestBody`/`responses` の中身は、実際にOpenAPI以外のparserを実装するタイミングで拡張する。今それを先回りして設計するのはしない
