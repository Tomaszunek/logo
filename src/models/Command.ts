import { CommandTypes } from './CommandTypes';
import { Color } from 'csstype';

export interface ICommandModel {
    id: number;
    name: CommandTypes;
    value?: number;
    arg2?: number;
    color?: Color;
    filename?: string;
    commands?: Array<ICommandModel>;
  }
  
  export namespace CommandModel {
    export enum Filter {
      SHOW_ALL = 'all',
      SHOW_ACTIVE = 'active',
      SHOW_COMPLETED = 'completed'
    }
  }