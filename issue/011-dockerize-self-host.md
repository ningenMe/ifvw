# Docker化してself-host可能にする

関連: #1 (concept)

## 背景

設計方針(#1)の「OSSとしてSelf-hostしやすくする」を満たすため、`docker run` のように簡単に起動できることを目標とする。
企業内のマイクロサービス環境での利用を想定している。

## やること

- Dockerfileを作成する
- `sources.yaml` をコンテナにマウントして起動できるようにする
- docker-composeでの起動例を用意する
- READMEに起動手順(`docker run ...`)を記載する

## 完了条件

- `docker run` 一発でAPI Explorerが起動し、マウントした `sources.yaml` に記載したサービスのAPIが閲覧できる
- 依存: `006-implement-source-registration` 〜 `010-implement-try-it-out` までのMVP機能が一通り動作していること
