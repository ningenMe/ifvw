# ユビキタス語彙

`ifvw`のドメインで使う言葉の定義。prose(会話・ドキュメント)とコード上の型名を完全に一致させる。ここに載るのはデータ構造(型・フィールド)として現れる言葉のみで、処理・関数などのプロセスを表す言葉は含めない。

MVPで対応するのはOpenAPIのみ。他protocolの列は将来の対応先を検討するための参考。

すべての用語は`NormalizedInterface`を軸に、そこから取得する(`InterfaceSource`)/束ねる(`InterfaceCatalog`)という一本の線で繋がるようにする。「Source」「Catalog」のような、このプロダクト固有ではない一般語をそのまま型名にしない。

| 用語                    | 意味                                                                                                                           | 型名(案)                                                                | OpenAPI                                        | gRPC / Protobuf                                           | GraphQL                                          | AsyncAPI(Kafkaなど)                             | JSON Schema(単体)            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------- | ---------------------------- |
| **NormalizedInterface** | 1つの呼び出し可能/観測可能な単位を、protocol横断で正規化した形。ユーザーが実際に閲覧する「1つのinterface」はこれを指す         | `NormalizedInterface { id, action, target, description?, deprecated? }` | 1つのpath × 1つのHTTP method(Operation Object) | serviceの1つのrpc method                                  | Query/Mutation/Subscriptionの1 field             | 1つのchannelの1つのoperation(publish/subscribe) | 該当なし                     |
| **action**              | NormalizedInterfaceの「動詞的な軸」                                                                                            | `NormalizedInterface.action`                                            | HTTP method(`GET`/`POST`/...)                  | 呼び出し種別(unary/client-stream/server-stream/bidi)      | root type(`QUERY`/`MUTATION`/`SUBSCRIPTION`)     | `PUBLISH`/`SUBSCRIBE`                           | -                            |
| **target**              | NormalizedInterfaceの「対象の軸」                                                                                              | `NormalizedInterface.target`                                            | path(`/users/{id}`)                            | `Service.Method`                                          | field名(例: `user`)                              | channel/topic名(例: `user.created`)             | -                            |
| **Schema**              | NormalizedInterfaceのparameters/request body/responseなどが参照する型定義。未実装                                              | 未定義(005/008で必要になった時に設計)                                   | Schema Object(`components/schemas`)            | message型                                                 | type(object/input/enum/scalar)                   | messageのpayload schema                         | JSON Schemaそのもの          |
| **InterfaceSource**     | 1つのNormalizedInterfaceの集合をどこから取得するかのconfig上の記述。取得方法(`type`+`url`)のみを持つ                           | `InterfaceSource { type, url }`(nameは持たない)                         | `https://.../openapi.json` などのURL           | `.proto`ファイル(ローカル/リポジトリ)、reflection APIなど | introspection endpoint、または`.graphql`ファイル | AsyncAPI documentのURL                          | `.json`スキーマファイルのURL |
| **InterfaceCatalog**    | 複数のInterfaceSourceから集めたNormalizedInterfaceの全体。UIが表示する対象そのもの。特定protocolに紐づかないifvw独自の集約概念 | 未定義(007/009などUI実装時に設計)                                       | -                                              | -                                                         | -                                                | -                                               | -                            |

1つのInterfaceSourceをfetch+parseすると `NormalizedInterface[]` が得られる。この配列専用のラッパー型は用意しない(フィールドが1つしかない入れ物は作らない方針)。

## 未確定・議論中

- `InterfaceSource`は本当に`{ type, url }`だけでいいか。将来取得方法自体が複数(URL/ローカルファイル/Git/GitHub/S3等、[issue #1](https://github.com/ningenMe/ifvw/issues/1)の設計方針3参照)になった時にどう拡張するか
- 設定ファイル名(`sources.yaml`)も型名に合わせて変えるか、慣用的なファイル名として残すか
