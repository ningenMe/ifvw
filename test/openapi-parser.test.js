import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { parseOpenApi } from "../dist/parsers/openapi/index.js";

function fixture(name) {
  return fileURLToPath(new URL(`./fixtures/openapi/${name}`, import.meta.url));
}

test("parses paths/methods into InterfaceOperation[]", async () => {
  const operations = await parseOpenApi(fixture("sample.yaml"));

  assert.deepStrictEqual(operations, [
    {
      id: "getUser",
      action: "GET",
      target: "/users/{id}",
      description: "Get a user",
      deprecated: undefined,
    },
    {
      id: "post_/users",
      action: "POST",
      target: "/users",
      description: "Create a user",
      deprecated: true,
    },
  ]);
});

test("rejects when a $ref cannot be resolved", async () => {
  await assert.rejects(() => parseOpenApi(fixture("broken-ref.yaml")));
});
