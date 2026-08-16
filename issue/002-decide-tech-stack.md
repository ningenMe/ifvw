# 技術スタックを決定する

関連: #1 (concept)

## 背景

MVPを実装するにあたり、OpenAPIのパース・Web UI・横断検索・Try it out(実リクエスト送信)を実現できる技術スタックを決める必要がある。
サーバーを常時起動する構成ではなく、CLIが `sources.yaml` を読んで静的サイトを生成する方式(`011-generate-static-site` 参照)にするため、Webフロントエンドをビルドして静的出力できる技術であることが前提になる。

## やること

- 静的サイトとしてビルド可能なフロントエンドの言語・フレームワークを選定する
- CLI(generateコマンド)を実装する言語・ランタイムを選定する(フロントエンドと共通のランタイムにできるか検討する)
- OpenAPIのパースに使うライブラリを調査・選定する
- 生成時にUnified API Modelをどう静的サイトへ埋め込むか(JSONバンドル等)を検討する
- 選定理由をドキュメント化する

## 完了条件

- 技術スタックと選定理由が README または `docs/` 配下にまとまっている

## 決定

基本方針: 依存を極力少なくする。TypeScript / Node.js / Web標準APIを中心に構築し、ライブラリは必要なものだけ採用する。
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

設計上、OpenAPI固有の型をUIに直接渡さず `Source → Parser → Unified API Model → UI` の責務分離を行う(`004-define-unified-api-model` 参照)。これにより将来的なProtobuf / gRPC / GraphQL / AsyncAPI対応を可能にする。

詳細はREADMEにも記載。
