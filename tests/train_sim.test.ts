
import { test, expect } from "bun:test";
import { findTrains } from "../src/lib/train-sim";

test("findTrains should return correct results for NDLS -> MAS", () => {
  const results = findTrains("NDLS", "MAS", "2023-10-10");
  expect(results.length).toBeGreaterThan(0);
  results.forEach(r => {
    expect(r.from).toBe("NDLS");
    expect(r.to).toBe("MAS");
  });
});

test("findTrains should return empty array for invalid route", () => {
    const results = findTrains("XYZ", "ABC", "2023-10-10");
    expect(results).toHaveLength(0);
});
