import { describe, expect, it, vi } from "vitest";
import type { ICommandModel } from "../models";
import { Parser } from "../utils/parser";
import { pathwayExamples } from "./pathwayExamples";

const withoutIds = (commands: readonly ICommandModel[]): unknown[] =>
  commands.map((command) => ({
    name: command.name,
    ...(command.value === undefined ? {} : { value: command.value }),
    ...(command.arg2 === undefined ? {} : { arg2: command.arg2 }),
    ...(command.color === undefined ? {} : { color: command.color }),
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
});
