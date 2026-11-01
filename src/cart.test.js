import { test } from "node:test";
import assert from "node:assert/strict";
import { updateCart } from "./cart.js";
test("cart quantities remain valid and variants remain independent", () => {
  let c = updateCart({}, "eclipse", 2);
  c = updateCart(c, "volt", 3);
  assert.deepEqual(c, { eclipse: 2, volt: 3 });
  assert.equal(updateCart(c, "eclipse", -1).eclipse, 0);
  assert.equal(updateCart(c, "volt", 100).volt, 99);
  assert.deepEqual(updateCart(c, "unknown", 2), c);
  assert.deepEqual(updateCart(c, "volt", 1.5), c);
});
import { readCart } from "./cart.js";
test("stored demo bags are validated before use", () => {
  assert.deepEqual(readCart('{"volt":3,"eclipse":200,"fake":1}'), {
    volt: 3,
    eclipse: 99,
  });
  for (const value of [null, "bad", "null", "[]", "42", '{"volt":"3"}'])
    assert.deepEqual(readCart(value), {});
  assert.deepEqual(readCart('{"eclipse":-1}'), { eclipse: 0 });
});
