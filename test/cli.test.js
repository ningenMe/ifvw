import assert from "node:assert/strict";
import { test } from "node:test";
import { main } from "../dist/cli/index.js";

test("--version prints a semver-looking string and exits 0", async () => {
  const originalLog = console.log;
  let output = "";
  console.log = (msg) => {
    output = msg;
  };
  try {
    const code = await main(["--version"]);
    assert.equal(code, 0);
    assert.match(output, /^\d+\.\d+\.\d+$/);
  } finally {
    console.log = originalLog;
  }
});

test("unknown command exits with code 1", async () => {
  const code = await main(["bogus"]);
  assert.equal(code, 1);
});
