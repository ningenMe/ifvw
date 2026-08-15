# 静的サイトを生成するCLIを実装する

関連: #1 (concept), #006

## 背景

設計方針(#1)の「OSSとしてSelf-hostしやすくする」を満たす手段として、常駐サーバー(Docker等)を運用させるのではなく、
CLIが `sources.yaml` を読み込んでOpenAPI一式をfetchし、Unified API Modelに変換した上で静的サイト(HTML/JS一式)を生成する方式にする。
生成された静的サイトはnginx/S3/GitHub Pagesなど任意の場所にそのまま配置すれば動く。

## やること

- `sources.yaml` を入力に静的サイト一式を出力するCLIコマンド(例: `generate`)を実装する
- サービス一覧(`007`)・API詳細(`008`)・横断検索(`009`)が、生成された静的サイト単体(バックエンドなし)で動作するようにする
- 出力先ディレクトリや基本的なCLIオプションを決める
- source取得に失敗した場合のCLIの挙動(エラー終了 or 該当serviceをスキップして続行)を決める
- READMEに生成〜配置までの手順を記載する

## 完了条件

- CLIを実行すると `sources.yaml` の内容から静的サイト一式が生成される
- 生成された静的サイトを適当な静的ホスティング(ローカルの `serve` 等でも可)に置くだけでAPI Explorerとして閲覧できる
- 依存: `006-implement-source-registration` 〜 `009-implement-cross-service-search` が動作していること(Try it outは別課題、`010-implement-try-it-out` 参照)
