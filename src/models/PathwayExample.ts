import { ICommandModel } from './Command';

export interface IPathwayExample {
    name: string,
    path: string,
    command: ICommandModel,
    image: string,
    type:  "simple" | "color" | "crazy"
}
  
