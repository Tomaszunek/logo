export interface ICommandArgument {
    name: string;
    type: string;
}

export interface ICommandDescription {
    short: string;
    name: string;
    long: string;
    description: string;
    args: readonly ICommandArgument[];
    color: string;
    image: string;
    argCount: number;
}
  
