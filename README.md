# ifvw

複数のマイクロサービスに分散したAPI仕様を、1つのUIで横断して探索できるAPI Explorer。

Swagger UIの代替ではなく、Swagger UIを束ねたAPI Explorer / API Catalog。「このシステムにはどんなAPIが存在するのか?」を最初に開く場所を目指すOSS。

詳しくはコンセプト([issue #1](https://github.com/ningenMe/ifvw/issues/1))と、タスク分解([issue/](./issue))を参照。

## 技術スタック

依存を極力少なくする方針。TypeScript / Node.js / Web標準APIを中心に構築し、ライブラリは必要なものだけ採用する。
**「標準APIで実装できるものには依存を追加しない」**を基本原則とする。

| 項目            | 採用                                      |
| --------------- | ----------------------------------------- |
| 言語            | TypeScript                                |
| Runtime         | Node.js                                   |
| CLI             | Node.js標準API(CLIフレームワークなし)     |
| OpenAPI Parser  | `@apidevtools/swagger-parser`             |
| Frontend        | TypeScript + DOM API(React等は使用しない) |
| CSS             | 素のCSS                                   |
| 検索            | 自前実装(Fuse.js等は使用しない)           |
| State管理       | 自前実装(Redux/Zustand等は使用しない)     |
| Test            | Node.js標準 `node:test`                   |
| Package Manager | npm                                       |
| 配布            | npm → `npx ifvw`                          |

常駐サーバーは持たず、CLIが `sources.yaml` を読んでOpenAPI一式をfetchし、静的サイト(HTML/JS)を生成する方式。生成物はnginx/S3/GitHub Pagesなど任意の場所にそのまま配置できる。

設計上、OpenAPI固有の型をUIに直接渡さず `Source → Parser → Unified API Model → UI` の責務分離を行い、将来的なProtobuf / gRPC / GraphQL / AsyncAPI対応を可能にする。

詳細は [issue/002-decide-tech-stack.md](./issue/002-decide-tech-stack.md) を参照。

## 開発

```sh
npm install
npm run build   # dist/(CLI/Node側)と dist-browser/(静的サイトのフロントエンド)を生成
npm test
```
