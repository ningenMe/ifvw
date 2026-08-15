# リポジトリ構成をスキャフォールドする

関連: #1 (concept), #002

## 背景

設計方針(#1)にある「Source → Parser → Unified Model → UI」という責務分離を、コード上のディレクトリ構成にも反映させたい。
最初にOpenAPIだけ実装するが、将来Protobuf/GraphQL/AsyncAPIなどのparserを追加できる構造にしておく必要がある。
また、常駐サーバーではなく「CLIが静的サイトを生成する」方式(`011-generate-static-site` 参照)にするため、CLIパッケージとフロントエンド(静的サイト側)のパッケージが分離できる構成にする。

## やること

- `002-decide-tech-stack` の決定を踏まえてディレクトリ構成を設計する
  - source/parser/unified model/UI が疎結合になる構成にする
  - 将来protocolごとのparserを追加しやすい構成(例: `parsers/openapi`, `parsers/protobuf` のような形)にする
  - CLI(generateコマンド)とフロントエンド(静的サイトとしてビルドされるUI)を分離する
- 空のプロジェクト雛形を作成する(パッケージ管理ファイル、Lint/Format設定、CI雛形など)
- ローカルでのビルド/生成コマンドの実行手順をREADMEに書く

## 完了条件

- 空のディレクトリ構成 + 最低限のビルド/起動コマンドが通る状態でREADMEに手順が記載されている
