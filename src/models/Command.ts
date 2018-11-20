import { CommandTypes } from './CommandTypes';

export interface ICommandModel {
    id: number;
    name: CommandTypes;
    value?: number | string;
    arg2?: number;
    commands?: Array<ICommandModel>;
  }
  
  export namespace CommandModel {
    export enum Filter {
      SHOW_ALL = 'all',
      SHOW_ACTIVE = 'active',
      SHOW_COMPLETED = 'completed'
    }
  }