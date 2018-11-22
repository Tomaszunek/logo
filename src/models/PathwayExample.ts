import { ICommandModel } from './Command';

export interface IPathwayExample {
    name: string,
    path: string,
    command: Array<ICommandModel>,
    image: string
}
  
