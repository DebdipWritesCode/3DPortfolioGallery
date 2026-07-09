import test from "node:test";
import assert from "node:assert/strict";
import {
  getLoadingPercent,
  getLoadingStatus,
} from "../loader-progress.js";

test("getLoadingPercent converts item progress to a bounded percent", () => {
  assert.equal(getLoadingPercent(2, 5), 40);
  assert.equal(getLoadingPercent(7, 5), 100);
  assert.equal(getLoadingPercent(-1, 5), 0);
});

test("getLoadingPercent returns zero when total item count is unknown", () => {
  assert.equal(getLoadingPercent(1, 0), 0);
  assert.equal(getLoadingPercent(1, undefined), 0);
});

test("getLoadingStatus describes loading, complete, and error states", () => {
  assert.equal(getLoadingStatus(42), "Loading gallery assets");
  assert.equal(getLoadingStatus(100), "Gallery ready");
  assert.equal(getLoadingStatus(72, true), "Some assets failed to load");
});
