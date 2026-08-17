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

## 決定

npm workspacesによる複数パッケージ構成ではなく、単一npmパッケージ(`ifvw`)の中でディレクトリを分けて疎結合にする形にした。`npx ifvw` で配布する1パッケージ構成にした方がMVP段階ではシンプルなため。

Lint/Formatは依存最小方針に合わせ、ESLintは導入せず `tsc --strict` (型チェック) と Prettier (フォーマットのみ) に絞った。

Unified Interface Model(`core`)・OpenAPI parser(`parsers/openapi`)・静的サイト生成(`site`)は、この時点では作らない。プロダクトの立ち位置([issue #1](https://github.com/ningenMe/ifvw/issues/1)、「1つのinterfaceを気持ちよく見るビューアが核」への再整理)を踏まえた設計がまだ固まっていないため、中身のない・後で名前が変わる可能性のあるプレースホルダを先にコミットするのはやめた。実装は各タスク([004](./004-define-unified-api-model.md), [005](./005-implement-openapi-parser.md), [011](./011-generate-static-site.md)ほか)に着手するタイミングでちゃんと設計してから追加する。

このスキャフォールドで実際に用意したのは `src/cli`(CLIエントリポイント、Unified Interface Modelに依存しないので先に作れる)のみ。ビルド(`tsc --strict`)・テスト(`node:test`)・フォーマット(Prettier)・CLI起動(`node bin/ifvw.js --help`)まで実際に動作確認済み。
