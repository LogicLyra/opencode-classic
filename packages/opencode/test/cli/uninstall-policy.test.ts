import { describe, expect, test } from "bun:test"
import yargs from "yargs"
import { retainedStorage, uninstallOptions } from "../../src/cli/cmd/uninstall-policy"

function parse(args: string[]) {
  return yargs(args).parserConfiguration({ "camel-case-expansion": true }).options(uninstallOptions).parseSync()
}

describe("Classic uninstall shared storage", () => {
  for (const args of [[], ["--force"], ["--no-keep-data", "--no-keep-config"], ["--dry-run", "-f"]]) {
    test(`preserves all shared roots for ${JSON.stringify(args)}`, () => {
      expect(retainedStorage(parse(args))).toEqual({ data: true, config: true, cache: true, state: true })
    })
  }

  test("requires explicit shared-data deletion", () => {
    expect(retainedStorage(parse(["--remove-shared-data", "--force"]))).toEqual({
      data: false,
      config: false,
      cache: false,
      state: false,
    })
  })

  test("keep flags override an explicit deletion request", () => {
    expect(retainedStorage(parse(["--remove-shared-data", "-c", "-d"]))).toEqual({
      data: true,
      config: true,
      cache: false,
      state: false,
    })
  })
})
