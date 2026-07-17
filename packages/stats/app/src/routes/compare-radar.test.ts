import { describe, expect, test } from "bun:test"
import { radarSeriesPolygon } from "./compare-radar"

describe("comparison radar geometry", () => {
  test("does not render missing scores as zero", () => {
    expect(radarSeriesPolygon([100, undefined, 50, 75, 25, 90])).toBeUndefined()
  })
})
