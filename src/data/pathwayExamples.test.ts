import { describe, expect, it, vi } from "vitest";
import type { ICommandModel } from "../models";
import { getCommandComplexity } from "../utils/commandComplexity";
import { Parser } from "../utils/parser";
import { pathwayExamples } from "./pathwayExamples";

const withoutIds = (commands: readonly ICommandModel[]): unknown[] =>
  commands.map((command) => ({
    name: command.name,
    ...(command.value === undefined ? {} : { value: command.value }),
    ...(command.arg2 === undefined ? {} : { arg2: command.arg2 }),
    ...(command.color === undefined ? {} : { color: command.color }),
    ...(command.color2 === undefined ? {} : { color2: command.color2 }),
    ...(command.blend === undefined ? {} : { blend: command.blend }),
    ...(command.palette === undefined ? {} : { palette: command.palette }),
    ...(command.commands
      ? { commands: withoutIds(command.commands) }
      : {}),
  }));

describe("pathwayExamples", () => {
  it.each(pathwayExamples)(
    "$type / $name loads the command shown in its caption",
    (example) => {
      const onError = vi.fn();
      const parsedCommands = new Parser(example.path).parse(onError);

      expect(onError).not.toHaveBeenCalled();
      expect(withoutIds([example.command])).toEqual(withoutIds(parsedCommands));
    },
  );

  it("uses every command available in the guide", async () => {
    const { commandDescriptions } = await import("./commandDescriptions");
    const demonstrated = new Set<string>();
    const visit = (command: Readonly<ICommandModel>) => {
      demonstrated.add(command.name);
      command.commands?.forEach(visit);
    };

    pathwayExamples.forEach((example) => {
      visit(example.command);
    });

    expect([...demonstrated].sort()).toEqual(
      Object.keys(commandDescriptions).sort(),
    );
  });

  it.each(pathwayExamples)(
    "$type / $name stays within the canvas rendering limit",
    (example) => {
      expect(getCommandComplexity([example.command]).exceedsLimit).toBe(false);
    },
  );

  it("keeps a distinct rendering focus for every performance scene", () => {
    const performanceExamples = pathwayExamples.filter(
      (example) => example.type === "performance",
    );
    const focuses = performanceExamples.map(
      (example) => example.performanceFocus,
    );

    expect(performanceExamples).toHaveLength(11);
    expect(focuses.every((focus) => focus !== undefined)).toBe(true);
    expect(new Set(focuses)).toHaveLength(performanceExamples.length);
  });

  it.each(["Obsidian voxel arcology", "Leviathan fusion reactor"])(
    "%s remains a high-load rendering baseline",
    (name) => {
      const example = pathwayExamples.find((item) => item.name === name);

      expect(example).toBeDefined();
      if (example === undefined) {
        throw new Error(`Missing high-load example: ${name}`);
      }
      expect(
        getCommandComplexity([example.command]).operations,
      ).toBeGreaterThanOrEqual(190_000);
    },
  );
});
