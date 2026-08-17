# ifvw (Interface Viewer)

interface定義(まずはOpenAPI)を、1つのUIで気持ちよく閲覧・検索できるビューア。

核はSwagger UIのような単一interfaceのビューア。複数のsource(サービス/プロダクト)を1つのUIに集約して横断的に見られることは、その上に乗るoptionalな機能という位置づけ(マイクロサービス環境での利用はその代表的な活用シーン)。

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

設計上、OpenAPI固有の型をUIに直接渡さず `Source → Parser → Unified Interface Model → UI` の責務分離を行い、将来的なProtobuf / gRPC / GraphQL / AsyncAPI対応を可能にする。

詳細は [issue/002-decide-tech-stack.md](./issue/002-decide-tech-stack.md) を参照。

## ディレクトリ構成

```
src/
├── cli/                CLIエントリポイント
├── core/                InterfaceOperation(protocol非依存の内部モデル)
└── parsers/openapi/     OpenAPI -> InterfaceOperation[] のparser
```

静的サイト生成(`site`)は [011](./issue/011-generate-static-site.md) に着手するタイミングで追加する。中身のないディレクトリを先に置くことはしない。内部モデルの詳細・変遷は [issue/004](./issue/004-define-unified-api-model.md)、parserの詳細は [issue/005](./issue/005-implement-openapi-parser.md) を参照。

## 開発

```sh
npm install
npm run build   # dist/ を生成
npm test
```

CLIをローカルで試す:

```sh
npm run build
node bin/ifvw.js --help
```
