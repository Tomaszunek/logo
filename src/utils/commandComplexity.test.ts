import { describe, expect, it } from "vitest";
import type { ICommandModel } from "src/models";
import { pathwayExamples } from "src/data/pathwayExamples";
import {
  getCommandComplexity,
  MAX_COMMAND_OPERATIONS,
} from "./commandComplexity";

const command = (
  name: ICommandModel["name"],
  value?: number,
  commands?: ICommandModel[],
): ICommandModel => ({
  id: 0,
  name,
  ...(value === undefined ? {} : { value }),
  ...(commands === undefined ? {} : { commands }),
});

describe("getCommandComplexity", () => {
  it("counts primitive commands", () => {
    expect(
      getCommandComplexity([
        command("fd", 10),
        command("tr", 90),
        command("penup"),
      ]),
    ).toEqual({ operations: 3, exceedsLimit: false });
  });

  it("counts exact repeat and nested-repeat execution cost", () => {
    const square = command("repeat", 4, [
      command("fd", 100),
      command("tr", 90),
    ]);
    const nested = command("repeat", 10, [
      command("repeat", 10, [command("fd", 1)]),
    ]);

    expect(getCommandComplexity([square]).operations).toBe(9);
    expect(getCommandComplexity([nested]).operations).toBe(111);
  });

  it("stops counting when a program exceeds its budget", () => {
    const result = getCommandComplexity(
      [command("repeat", 1_000_000, [command("fd", 1)])],
      1_000,
    );

    expect(result).toEqual({ operations: 1_001, exceedsLimit: true });
  });

  it("rejects invalid repeat values as unsafe", () => {
    expect(
      getCommandComplexity(
        [command("repeat", Number.POSITIVE_INFINITY, [command("fd", 1)])],
        100,
      ),
    ).toEqual({ operations: 101, exceedsLimit: true });
  });

  it("keeps every bundled example inside the production budget", () => {
    pathwayExamples.forEach((example) => {
      expect(
        getCommandComplexity([example.command]),
        example.name,
      ).toMatchObject({
        exceedsLimit: false,
      });
    });

    expect(MAX_COMMAND_OPERATIONS).toBeGreaterThan(0);
  });
});
