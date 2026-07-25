import type { CommandTypes } from "./CommandTypes";

export interface ICommandModel {
  id: number;
  name: CommandTypes;
  value?: number;
  arg2?: number;
  color?: string;
  commands?: ICommandModel[];
}
