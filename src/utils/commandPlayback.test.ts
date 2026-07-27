import { describe, expect, it } from "vitest";
import type { ICommandModel } from "src/models";
import {
  applyEasing,
  expandPlaybackCommands,
  getAnimatedCommandAtTime,
  getCommandAnimationDuration,
  getFinalAnimatedCommand,
} from "./commandPlayback";

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

describe("animated command values", () => {
  it("interpolates an authored value range", () => {
    const commandModel: ICommandModel = {
      animation: {
        cycles: 1,
        durationMs: 1000,
        easing: "linear",
        finish: 200,
        mode: "once",
        property: "value",
        start: 20,
      },
      id: 1,
      name: "fd",
      value: 200,
    };

    expect(getAnimatedCommandAtTime(commandModel, 0).value).toBe(20);
    expect(getAnimatedCommandAtTime(commandModel, 500).value).toBe(110);
    expect(getAnimatedCommandAtTime(commandModel, 1000).value).toBe(200);
  });

  it("interpolates cube rotation without changing its dimensions", () => {
    const commandModel: ICommandModel = {
      animation: {
        cycles: 1,
        durationMs: 4000,
        easing: "linear",
        finish: 360,
        mode: "once",
        property: "rotation",
        start: 0,
      },
      arg2: 90,
      id: 1,
      name: "cube",
      rotation: 360,
      value: 220,
    };

    expect(getAnimatedCommandAtTime(commandModel, 1000)).toMatchObject({
      arg2: 90,
      rotation: 90,
      value: 220,
    });
  });

  it("animates independent cube tracks on one shared timeline", () => {
    const commandModel: ICommandModel = {
      animations: [
        {
          cycles: 2,
          durationMs: 1000,
          easing: "linear",
          finish: 260,
          mode: "pingpong",
          property: "width",
          start: 120,
        },
        {
          cycles: "infinite",
          durationMs: 2000,
          easing: "linear",
          finish: 360,
          mode: "repeat",
          property: "rotation",
          start: 0,
        },
      ],
      depth: 90,
      height: 180,
      id: 1,
      name: "cube",
      value: 260,
      width: 260,
    };

    expect(getAnimatedCommandAtTime(commandModel, 500)).toMatchObject({
      height: 180,
      rotation: 90,
      value: 190,
      width: 190,
    });
    expect(getAnimatedCommandAtTime(commandModel, 1500)).toMatchObject({
      rotation: 270,
      width: 190,
    });
    expect(getCommandAnimationDuration(commandModel)).toBe(
      Number.POSITIVE_INFINITY,
    );
  });

  it("uses the start value after a finite pingpong sequence", () => {
    const commandModel: ICommandModel = {
      animation: {
        cycles: 3,
        durationMs: 400,
        easing: "linear",
        finish: 100,
        mode: "pingpong",
        property: "value",
        start: 20,
      },
      id: 1,
      name: "fd",
      value: 100,
    };

    expect(getCommandAnimationDuration(commandModel)).toBe(2400);
    expect(getAnimatedCommandAtTime(commandModel, 2400).value).toBe(20);
    expect(getFinalAnimatedCommand(commandModel).value).toBe(20);
  });

  it("interpolates a command's second numeric parameter", () => {
    const commandModel: ICommandModel = {
      animations: [
        {
          cycles: 1,
          durationMs: 1000,
          easing: "linear",
          finish: 240,
          mode: "once",
          property: "arg2",
          start: 40,
        },
      ],
      arg2: 240,
      id: 1,
      name: "ellipse",
      value: 160,
    };

    expect(getAnimatedCommandAtTime(commandModel, 500)).toMatchObject({
      arg2: 140,
      value: 160,
    });
  });

  it("supports the initial easing set", () => {
    expect(applyEasing(0.5, "linear")).toBe(0.5);
    expect(applyEasing(0.5, "ease-in")).toBe(0.25);
    expect(applyEasing(0.5, "ease-out")).toBe(0.75);
    expect(applyEasing(0.5, "ease-in-out")).toBe(0.5);
  });
});
