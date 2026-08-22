# ユビキタス語彙

`ifvw`のドメインで使う言葉の定義。prose(会話・ドキュメント)とコード上の型名を完全に一致させる。ここに載るのはデータ構造として現れる**ドメイン概念**のみ。設定値(URL+typeのような単なる参照情報)や、処理・関数などのプロセスを表す言葉は含めない。

MVPで対応するのはOpenAPIのみ。他protocolの列は将来の対応先を検討するための参考。

すべての用語は`NormalizedInterface`を軸に、それを束ねる(`InterfaceCatalog`)という一本の線で繋がるようにする。

| 用語                    | 意味                                                                                                                   | 型名(案)                                                                | OpenAPI                                        | gRPC / Protobuf                                      | GraphQL                                      | AsyncAPI(Kafkaなど)                             | JSON Schema(単体)   |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------- | -------------------------------------------- | ----------------------------------------------- | ------------------- |
| **NormalizedInterface** | 1つの呼び出し可能/観測可能な単位を、protocol横断で正規化した形。ユーザーが実際に閲覧する「1つのinterface」はこれを指す | `NormalizedInterface { id, action, target, description?, deprecated? }` | 1つのpath × 1つのHTTP method(Operation Object) | serviceの1つのrpc method                             | Query/Mutation/Subscriptionの1 field         | 1つのchannelの1つのoperation(publish/subscribe) | 該当なし            |
| **action**              | NormalizedInterfaceの「動詞的な軸」                                                                                    | `NormalizedInterface.action`                                            | HTTP method(`GET`/`POST`/...)                  | 呼び出し種別(unary/client-stream/server-stream/bidi) | root type(`QUERY`/`MUTATION`/`SUBSCRIPTION`) | `PUBLISH`/`SUBSCRIBE`                           | -                   |
| **target**              | NormalizedInterfaceの「対象の軸」                                                                                      | `NormalizedInterface.target`                                            | path(`/users/{id}`)                            | `Service.Method`                                     | field名(例: `user`)                          | channel/topic名(例: `user.created`)             | -                   |
| **Schema**              | NormalizedInterfaceのparameters/request body/responseなどが参照する型定義。未実装                                      | 未定義(005/008で必要になった時に設計)                                   | Schema Object(`components/schemas`)            | message型                                            | type(object/input/enum/scalar)               | messageのpayload schema                         | JSON Schemaそのもの |
| **InterfaceCatalog**    | 複数のNormalizedInterfaceを束ねた全体。UIが表示する対象そのもの。特定protocolに紐づかないifvw独自の集約概念            | 未定義(007/009などUI実装時に設計)                                       | -                                              | -                                                    | -                                            | -                                               | -                   |

`sources.yaml`のようなconfigで`type`+`url`を指定すると、そこから取得・パースして`NormalizedInterface[]`が得られる。この参照情報(どこから取るか)は単なる設定値であって、ドメイン概念ではないためこの表には含めない。実装上の型は `006-implement-source-registration` を参照。

## 未確定・議論中

- `InterfaceCatalog`という言葉が適切か
