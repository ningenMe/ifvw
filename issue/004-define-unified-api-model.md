# Unified API Modelを設計する

関連: #1 (concept)

## 背景

設計方針(#1)の「Protocol非依存」を実現するため、OpenAPIをはじめ将来のProtobuf/GraphQL/AsyncAPIなどを共通表現できる内部モデル(Unified API Model)が必要。
UIやTry it out機能はこのモデルにのみ依存し、protocol固有の詳細を意識しない形にする。

## やること

- 以下を表現できるモデルを設計する
  - service / endpoint(HTTP method, path, RPCなど protocol差異を吸収できる形)
  - description
  - parameters
  - request body
  - response
  - schema
  - enum
  - examples
  - deprecatedフラグ
- 型定義またはスキーマとしてドキュメント化する

## 完了条件

- Unified API Modelの型定義/スキーマがコードまたはドキュメントとして存在する
- OpenAPIの代表的な要素(上記項目)がすべてモデルにマッピングできることを確認済み

## 決定

`src/core/model.ts` にTypeScriptの型として定義した。

- `UnifiedApiModel` はsource(サービス)1つ分。`operations`(endpoint一覧)と、使い回されるスキーマを名前付きで保持する `schemas` を持つ
- `ApiOperation` がHTTP method/path/description/parameters/requestBody/responses/deprecatedを表現する
- `ApiSchema` は string/number/integer/boolean/array/object/ref/unknown の判別可能union。enum・exampleはstring/number/boolean側に持たせる。`object`のpropertiesが再帰的に`ApiSchema`を参照する
- OpenAPIの `$ref` は、都度inline展開せずに `UnifiedApiModel.schemas` に名前付きで1回だけ格納し、使う側は `{ type: "ref", name }` で参照する(OpenAPIの `components/schemas` にならった形)。UI側で「User型」のように名前付きで表示・再利用しやすくするため

### OpenAPIとのマッピング例

```yaml
paths:
  /users/{id}:
    get:
      operationId: getUser
      summary: Get a user
      deprecated: true
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
components:
  schemas:
    User:
      type: object
      required: [id, status]
      properties:
        id:
          type: string
        status:
          type: string
          enum: [active, suspended]
```

上記は次のUnified API Modelにマッピングされる:

```ts
{
  service: "user-service",
  operations: [
    {
      id: "getUser",
      method: "GET",
      path: "/users/{id}",
      summary: "Get a user",
      deprecated: true,
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: [
        {
          status: "200",
          description: "OK",
          content: [
            { mediaType: "application/json", schema: { type: "ref", name: "User" } },
          ],
        },
      ],
    },
  ],
  schemas: {
    User: {
      type: "object",
      required: ["id", "status"],
      properties: {
        id: { type: "string" },
        status: { type: "string", enum: ["active", "suspended"] },
      },
    },
  },
}
```

method・path・description・parameters・request body・response・schema・enum・example・deprecatedのすべてがこの形で表現できることを確認済み。実際のOpenAPI -> この形への変換は `005-implement-openapi-parser` で実装する。
