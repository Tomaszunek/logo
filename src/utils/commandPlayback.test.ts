import { describe, expect, it } from "vitest";
import type { ICommandModel } from "src/models";
import { expandPlaybackCommands } from "./commandPlayback";

const command = (
  id: number,
  name: ICommandModel["name"],
  value?: number,
  commands?: ICommandModel[],
): ICommandModel => ({
  id,
  name,
  ...(value === undefined ? {} : { value }),
  ...(commands === undefined ? {} : { commands }),
});

describe("expandPlaybackCommands", () => {
  it("expands nested repeats in execution order", () => {
    const commands = [
      command(1, "fd", 10),
      command(2, "repeat", 2, [
        command(3, "tr", 90),
        command(4, "repeat", 2, [command(5, "fd", 20)]),
      ]),
    ];

    expect(expandPlaybackCommands(commands).map(({ id }) => id)).toEqual([
      1, 3, 5, 5, 3, 5, 5,
    ]);
  });

  it("ignores empty and invalid repeat blocks", () => {
    const commands = [
      command(1, "repeat", 0, [command(2, "fd", 10)]),
      command(3, "repeat", Number.POSITIVE_INFINITY, [
        command(4, "fd", 20),
      ]),
      command(5, "home"),
    ];

    expect(expandPlaybackCommands(commands).map(({ id }) => id)).toEqual([5]);
  });
});
