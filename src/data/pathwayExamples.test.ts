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
    ...(command.animation === undefined
      ? {}
      : { animation: command.animation }),
    ...(command.animations === undefined
      ? {}
      : { animations: command.animations }),
    ...(command.depth === undefined ? {} : { depth: command.depth }),
    ...(command.height === undefined ? {} : { height: command.height }),
    ...(command.rotation === undefined ? {} : { rotation: command.rotation }),
    ...(command.width === undefined ? {} : { width: command.width }),
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

  it("exposes every gallery scene as a named procedure", () => {
    const procedureNames = pathwayExamples.map((example) => {
      expect(example.procedures.length).toBeGreaterThanOrEqual(1);
      expect(example.path).toContain("\nend\n");
      const entryPoint =
        example.procedures[example.procedures.length - 1];
      expect(entryPoint).toBeDefined();
      expect(example.command.procedureCalls).toEqual([
        {
          arguments: [],
          name: entryPoint.name,
        },
      ]);
      return entryPoint.name;
    });

    expect(new Set(procedureNames)).toHaveLength(pathwayExamples.length);
  });

  it("extracts meaningful helper procedures from repeated scene motifs", () => {
    const examplesWithHelpers = pathwayExamples.filter(
      (example) => example.procedures.length > 1,
    );
    const helperNames = new Set(
      examplesWithHelpers.flatMap((example) =>
        example.procedures.slice(0, -1).map((procedure) => procedure.name),
      ),
    );

    expect(examplesWithHelpers.length).toBeGreaterThanOrEqual(30);
    examplesWithHelpers.forEach((example) => {
      example.procedures.slice(0, -1).forEach((helper, helperIndex) => {
        const helperPattern = new RegExp(`\\b${helper.name}\\b`, "u");
        const isCalled = example.procedures
          .slice(helperIndex + 1)
          .some((procedure) => helperPattern.test(procedure.body));
        expect(isCalled).toBe(true);
      });
    });
    [
      "dot_ring",
      "ellipse_ring",
      "move_forward",
      "move_to",
      "place_cube",
      "place_grid",
      "place_sphere",
      "reset_light",
      "square",
      "start_scene",
    ].forEach((helperName) => {
      expect(helperNames.has(helperName)).toBe(true);
    });
  });

  it("includes a varied collection of advanced infinite animations", () => {
    const motionExamples = pathwayExamples.filter(
      (example) => example.type === "motion",
    );
    const techniques = motionExamples.map((example) => example.animationFocus);

    expect(motionExamples).toHaveLength(13);
    expect(techniques.every((technique) => technique !== undefined)).toBe(true);
    expect(new Set(techniques)).toHaveLength(motionExamples.length);
    motionExamples.forEach((example) => {
      expect(example.path).toContain("anim[");
      expect(example.path).toContain("infinite");
    });
  });

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
