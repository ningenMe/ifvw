import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { fetchSources, loadSources } from "../dist/sources/index.js";

function fixture(...segments) {
  return fileURLToPath(new URL(`./fixtures/${segments.join("/")}`, import.meta.url));
}

test("loadSources parses sources.yaml into Source[]", () => {
  const sources = loadSources(fixture("sources", "sample.yaml"));

  assert.deepStrictEqual(sources, [
    { name: "user-service", type: "openapi", url: "https://user.example.com/openapi.json" },
    { name: "order-service", type: "openapi", url: "https://order.example.com/openapi.json" },
  ]);
});

test("fetchSources isolates per-source failures", async () => {
  const sources = [
    { name: "ok", type: "openapi", url: fixture("openapi", "sample.yaml") },
    { name: "missing", type: "openapi", url: fixture("openapi", "does-not-exist.yaml") },
  ];

  const { results, errors } = await fetchSources(sources);

  assert.equal(results.length, 1);
  assert.equal(results[0].name, "ok");
  assert.equal(results[0].operations.length, 2);

  assert.equal(errors.length, 1);
  assert.equal(errors[0].name, "missing");
  assert.ok(errors[0].error instanceof Error);
});
