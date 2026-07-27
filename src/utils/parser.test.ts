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

  it("parses an explicit animated forward range", () => {
    const { commands, onError } = parse(
      "fd anim[20 200 1200 linear] tr 90 fd 30",
    );

    expect(commands).toMatchObject([
      {
        animation: {
          cycles: 1,
          durationMs: 1200,
          easing: "linear",
          finish: 200,
          mode: "once",
          property: "value",
          start: 20,
        },
        name: "fd",
        value: 200,
      },
      { name: "tr", value: 90 },
      { name: "fd", value: 30 },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it("parses animated forward ranges inside repeat blocks", () => {
    const { commands, onError } = parse(
      "repeat 2 [fd anim[0 120 500 ease-out] tr 90]",
    );

    expect(commands).toMatchObject([
      {
        commands: [
          {
            animation: {
              cycles: 1,
              durationMs: 500,
              easing: "ease-out",
              finish: 120,
              mode: "once",
              property: "value",
              start: 0,
            },
            name: "fd",
            value: 120,
          },
          { name: "tr", value: 90 },
        ],
        name: "repeat",
        value: 2,
      },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it("parses animated ranges for one-number commands", () => {
    const { commands, onError } = parse(
      "tr anim[0 360 900 linear repeat 2] circle anim[20 120 700 ease-out pingpong 3] setsw anim[2 24 500 ease-in-out] gradientbg 020617 172554 anim[0 180 1200 linear]",
    );

    expect(commands).toMatchObject([
      {
        animation: {
          cycles: 2,
          finish: 360,
          mode: "repeat",
          property: "value",
          start: 0,
        },
        name: "tr",
        value: 360,
      },
      {
        animation: {
          cycles: 3,
          finish: 120,
          mode: "pingpong",
          property: "value",
          start: 20,
        },
        name: "circle",
        value: 120,
      },
      {
        animation: {
          cycles: 1,
          finish: 24,
          mode: "once",
          property: "value",
          start: 2,
        },
        name: "setsw",
        value: 24,
      },
      {
        animation: {
          finish: 180,
          property: "value",
          start: 0,
        },
        color: "#020617",
        color2: "#172554",
        name: "gradientbg",
        value: 180,
      },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it("animates either parameter of two-number commands", () => {
    const { commands, onError } = parse(
      "ellipse anim[30 180 1000 ease-in-out] 45 setpos 100 anim[200 600 800 ease-out] star anim[5 14 900 linear] anim[40 180 1200 ease-in-out pingpong infinite]",
    );

    expect(commands).toMatchObject([
      {
        animations: [
          {
            finish: 180,
            property: "value",
            start: 30,
          },
        ],
        arg2: 45,
        name: "ellipse",
        value: 180,
      },
      {
        animations: [
          {
            finish: 600,
            property: "arg2",
            start: 200,
          },
        ],
        arg2: 600,
        name: "setpos",
        value: 100,
      },
      {
        animations: [
          {
            finish: 14,
            property: "value",
            start: 5,
          },
          {
            cycles: "infinite",
            finish: 180,
            mode: "pingpong",
            property: "arg2",
            start: 40,
          },
        ],
        arg2: 180,
        name: "star",
        value: 14,
      },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it.each([
    "bk",
    "circle",
    "dot",
    "fd",
    "setalpha",
    "setflow",
    "setglow",
    "seth",
    "setseed",
    "setsoftness",
    "setsw",
    "setsymmetry",
    "tl",
    "tr",
  ])("%s accepts a numeric animation range", (name) => {
    const { commands, onError } = parse(
      `${name} anim[0 10 100 linear]`,
    );

    expect(commands).toMatchObject([
      {
        animation: { finish: 10, property: "value", start: 0 },
        name,
        value: 10,
      },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it.each(["gradientbg", "setgradient", "setradial"])(
    "%s accepts an animated numeric parameter after its colors",
    (name) => {
      const { commands, onError } = parse(
        `${name} ff0000 0000ff anim[0 180 500 linear]`,
      );

      expect(commands).toMatchObject([
        {
          animation: {
            finish: 180,
            property: "value",
            start: 0,
          },
          color: "#ff0000",
          color2: "#0000ff",
          name,
          value: 180,
        },
      ]);
      expect(onError).not.toHaveBeenCalled();
    },
  );

  it.each([
    "arc",
    "ellipse",
    "fillpoly",
    "grid3d",
    "polygon",
    "setdash",
    "setpos",
    "sphere",
    "spiral",
    "spray",
    "star",
  ])("%s accepts animation ranges in both numeric slots", (name) => {
    const { commands, onError } = parse(
      `${name} anim[1 10 100 linear] anim[2 20 200 ease-out]`,
    );

    expect(commands).toMatchObject([
      {
        animations: [
          { finish: 10, property: "value", start: 1 },
          { finish: 20, property: "arg2", start: 2 },
        ],
        arg2: 20,
        name,
        value: 10,
      },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it("parses animated cube rotation with default or explicit dimensions", () => {
    const { commands, onError } = parse(
      "cube anim[0 360 4000 linear] cube 180 70 anim[-45 45 900 ease-in-out]",
    );

    expect(commands).toMatchObject([
      {
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
        name: "cube",
        rotation: 360,
        value: 220,
      },
      {
        animation: {
          cycles: 1,
          durationMs: 900,
          easing: "ease-in-out",
          finish: 45,
          mode: "once",
          property: "rotation",
          start: -45,
        },
        arg2: 70,
        name: "cube",
        rotation: 45,
        value: 180,
      },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it("parses independent cube tracks with finite and infinite cycles", () => {
    const { commands, onError } = parse(
      "cube width anim[120 260 1600 ease-in-out pingpong infinite] height anim[220 100 1200 ease-in-out pingpong 6] depth 80 rotation anim[0 360 4000 linear repeat infinite]",
    );

    expect(commands).toMatchObject([
      {
        animations: [
          {
            cycles: "infinite",
            durationMs: 1600,
            easing: "ease-in-out",
            finish: 260,
            mode: "pingpong",
            property: "width",
            start: 120,
          },
          {
            cycles: 6,
            durationMs: 1200,
            easing: "ease-in-out",
            finish: 100,
            mode: "pingpong",
            property: "height",
            start: 220,
          },
          {
            cycles: "infinite",
            durationMs: 4000,
            easing: "linear",
            finish: 360,
            mode: "repeat",
            property: "rotation",
            start: 0,
          },
        ],
        depth: 80,
        height: 100,
        name: "cube",
        rotation: 360,
        value: 260,
        width: 260,
      },
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

  it("parses symmetry, blend, and particle spray commands", () => {
    const { commands, onError } = parse(
      "setsymmetry 12 setblend screen spray 90 450 setblend source-over",
    );

    expect(commands).toMatchObject([
      { name: "setsymmetry", value: 12 },
      { name: "setblend", blend: "screen" },
      { name: "spray", value: 90, arg2: 450 },
      { name: "setblend", blend: "source-over" },
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  it("parses seeds, variable palettes, and state stack commands", () => {
    const { commands, onError } = parse(
      "setseed 42 setpalette ff006e ffb703 3a86ff push fd 20 pop",
    );

    expect(commands).toMatchObject([
      { name: "setseed", value: 42 },
      {
        name: "setpalette",
        palette: ["#ff006e", "#ffb703", "#3a86ff"],
      },
      { name: "push" },
      { name: "fd", value: 20 },
      { name: "pop" },
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
    "fd anim[0 100 0 linear]",
    "fd anim[0 100 500 bounce]",
    "fd anim[0 100 500 linear",
    "cube anim[0 360 0 linear]",
    "cube 200 anim[0 360 500 linear]",
    "setpos 10",
    "setsc 12345",
    "setbc not-a-color",
    "setgradient ff0000 nope 45",
    "setradial ff0000 00ff00 nope",
    "gradientbg ff0000",
    "setblend unknown",
    "spray 40",
    "setpalette",
    "setpalette nope",
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
