import { describe, expect, it, vi } from "vitest";
import { Parser } from "./parser";

const parse = (input: string) => {
  const onError = vi.fn();
  const commands = new Parser(input).parse(onError);
  return { commands, onError };
};

describe("Parser", () => {
  it("parses movement, turn, and stroke-width numbers", () => {
    const { commands, onError } = parse(
      "fd -12.5 bk 4 tl 90 tr 45 setsw .5",
    );

    expect(commands.map(({ name, value }) => ({ name, value }))).toEqual([
      { name: "fd", value: -12.5 },
      { name: "bk", value: 4 },
      { name: "tl", value: 90 },
      { name: "tr", value: 45 },
      { name: "setsw", value: 0.5 },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it("parses every no-argument command", () => {
    const { commands } = parse(
      "penup pendown hideturtle showturtle home",
    );

    expect(commands.map(({ name }) => name)).toEqual([
      "penup",
      "pendown",
      "hideturtle",
      "showturtle",
      "home",
    ]);
  });

  it("parses positions and normalizes both hex color forms", () => {
    const { commands } = parse(
      "setpos -20.5 300 setsc FF00aa setbc #102030",
    );

    expect(commands).toMatchObject([
      { name: "setpos", value: -20.5, arg2: 300 },
      { name: "setsc", color: "#ff00aa" },
      { name: "setbc", color: "#102030" },
    ]);
  });

  it("parses creative geometry and style commands", () => {
    const { commands, onError } = parse(
      "seth 45 arc 120 80 circle 40 ellipse 70 25 dot 12 setalpha .35 setdash 8 4",
    );

    expect(commands).toMatchObject([
      { name: "seth", value: 45 },
      { name: "arc", value: 120, arg2: 80 },
      { name: "circle", value: 40 },
      { name: "ellipse", value: 70, arg2: 25 },
      { name: "dot", value: 12 },
      { name: "setalpha", value: 0.35 },
      { name: "setdash", value: 8, arg2: 4 },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it("supports familiar Logo aliases while storing canonical commands", () => {
    const { commands } = parse(
      "forward 10 back 5 lt 30 rt 60 setheading 90 setxy 12 34",
    );

    expect(commands).toMatchObject([
      { name: "fd", value: 10 },
      { name: "bk", value: 5 },
      { name: "tl", value: 30 },
      { name: "tr", value: 60 },
      { name: "seth", value: 90 },
      { name: "setpos", value: 12, arg2: 34 },
    ]);
  });

  it("parses complex scene and pseudo-3D commands", () => {
    const { commands, onError } = parse(
      "polygon 6 80 fillpoly 5 40 star 9 120 spiral -4 7 cube 100 45 sphere 90 8 grid3d 260 12 setglow 24",
    );

    expect(commands).toMatchObject([
      { name: "polygon", value: 6, arg2: 80 },
      { name: "fillpoly", value: 5, arg2: 40 },
      { name: "star", value: 9, arg2: 120 },
      { name: "spiral", value: -4, arg2: 7 },
      { name: "cube", value: 100, arg2: 45 },
      { name: "sphere", value: 90, arg2: 8 },
      { name: "grid3d", value: 260, arg2: 12 },
      { name: "setglow", value: 24 },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it("parses linear, radial, and background gradients", () => {
    const { commands, onError } = parse(
      "setgradient ff006e 3a86ff 45 setradial ffffff 8338ec 160 gradientbg 071013 240046 90",
    );

    expect(commands).toMatchObject([
      {
        name: "setgradient",
        color: "#ff006e",
        color2: "#3a86ff",
        value: 45,
      },
      {
        name: "setradial",
        color: "#ffffff",
        color2: "#8338ec",
        value: 160,
      },
      {
        name: "gradientbg",
        color: "#071013",
        color2: "#240046",
        value: 90,
      },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it("parses soft-brush controls", () => {
    const { commands, onError } = parse(
      "setsw 48 setsoftness .8 setflow .35 fd 120 setsoftness 0",
    );

    expect(commands).toMatchObject([
      { name: "setsw", value: 48 },
      { name: "setsoftness", value: 0.8 },
      { name: "setflow", value: 0.35 },
      { name: "fd", value: 120 },
      { name: "setsoftness", value: 0 },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it("accepts uppercase commands and flexible whitespace", () => {
    const { commands, onError } = parse(
      "  REPEAT  4 [ FD 100\nTR 90 ]  ",
    );

    expect(commands).toMatchObject([
      {
        name: "repeat",
        value: 4,
        commands: [
          { name: "fd", value: 100 },
          { name: "tr", value: 90 },
        ],
      },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it("parses nested repeat blocks", () => {
    const { commands } = parse(
      "repeat 3 [fd 20 repeat 2 [tl 30 bk 5] tr 90]",
    );

    expect(commands).toMatchObject([
      {
        name: "repeat",
        value: 3,
        commands: [
          { name: "fd", value: 20 },
          {
            name: "repeat",
            value: 2,
            commands: [
              { name: "tl", value: 30 },
              { name: "bk", value: 5 },
            ],
          },
          { name: "tr", value: 90 },
        ],
      },
    ]);
  });

  it.each([
    "unknown 10",
    "fd",
    "fd nope",
    "setpos 10",
    "setsc 12345",
    "setbc not-a-color",
    "setgradient ff0000 nope 45",
    "setradial ff0000 00ff00 nope",
    "gradientbg ff0000",
    "repeat 1.5 [fd 10]",
    "repeat -1 [fd 10]",
    "repeat 2 []",
    "repeat 2 [fd 10",
    "fd 10 ]",
    "save design",
    "load design",
  ])("rejects invalid input: %s", (input) => {
    const { commands, onError } = parse(input);

    expect(commands).toEqual([]);
    expect(onError).toHaveBeenCalledOnce();
  });
});
