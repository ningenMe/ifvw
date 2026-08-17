# Source登録機能を実装する

関連: #1 (concept), #005

## 背景

複数のOpenAPI specificationをsourceとして登録できるようにする必要がある。例:

```yaml
sources:
  - name: user-service
    type: openapi
    url: https://user.example.com/openapi.json
```

設計方針(#1)の「外部URLを直接参照できる」を満たし、`https://.../openapi.json` のようなURLを登録するだけで使えるようにする。

## やること

- `sources.yaml` のようなsource設定ファイルのスキーマを定義する
- 設定ファイルを読み込み、各sourceのURLからOpenAPI specificationを取得する
- 取得したspecificationを `005-implement-openapi-parser` に渡し、`InterfaceOperation[]` を構築する
- source取得失敗時のエラーハンドリング(取得できないservice/URLがあっても他serviceは表示できるようにする)

## 完了条件

- 複数サービスを記述した `sources.yaml` を用意し、それぞれのAPIが正しく読み込まれることを確認できる

## 決定

`src/sources/index.ts` に2つの関数を実装した。

- `loadSources(configPath): Source[]` — `sources.yaml`(`js-yaml`でパース)を読み込み、`{ name, type: "openapi", url }[]` を返す。トップレベルに `sources` 配列が無い場合はエラーにする
- `fetchSources(sources): Promise<{ results: SourceResult[]; errors: SourceError[] }>` — 各sourceを順番に`parseOpenApi`へ渡し、成功したものは `{ name, operations }` として`results`に、失敗したものは `{ name, error }` として`errors`に振り分ける。1つのsourceの取得失敗が他のsourceに影響しない

`004-define-unified-api-model` の決定通り、「どのsourceから来たモデルか」は `InterfaceOperation` 自体には持たせず、`SourceResult.name` で紐付ける形にした。

`type` は現状 `"openapi"` の1択のみ。他protocol対応時にunionを広げる。

`js-yaml` を明示的な依存として追加した(`@apidevtools/swagger-parser`の間接依存として既に入っていたものを、直接importする以上は明示的な依存にした)。
