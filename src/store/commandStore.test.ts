import { beforeEach, describe, expect, it } from "vitest";
import { useCommandStore } from "./commandStore";

describe("commandStore procedures", () => {
  beforeEach(() => {
    useCommandStore.setState({ commands: [], procedures: [] });
  });

  it("defines, replaces, and deletes procedures by name", () => {
    const store = useCommandStore.getState();

    store.defineProcedures([
      {
        body: "fd :size",
        name: "line",
        parameters: ["size"],
      },
    ]);
    useCommandStore.getState().defineProcedures([
      {
        body: "fd :size bk :size",
        name: "line",
        parameters: ["size"],
      },
      {
        body: "repeat 4 [ fd :size tr 90 ]",
        name: "square",
        parameters: ["size"],
      },
    ]);

    expect(useCommandStore.getState().procedures).toEqual([
      {
        body: "fd :size bk :size",
        name: "line",
        parameters: ["size"],
      },
      {
        body: "repeat 4 [ fd :size tr 90 ]",
        name: "square",
        parameters: ["size"],
      },
    ]);

    useCommandStore.getState().deleteProcedure("line");

    expect(useCommandStore.getState().procedures).toEqual([
      {
        body: "repeat 4 [ fd :size tr 90 ]",
        name: "square",
        parameters: ["size"],
      },
    ]);
  });
});
