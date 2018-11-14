export interface ICommandModel {
    id: number;
    name: string;
    value: number;
    command?: ICommandModel;
  }
  
  export namespace CommandModel {
    export enum Filter {
      SHOW_ALL = 'all',
      SHOW_ACTIVE = 'active',
      SHOW_COMPLETED = 'completed'
    }
  }