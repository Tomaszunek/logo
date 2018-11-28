import * as React from 'react';
import { IPathwayExample } from 'src/models';
import { CommandActions } from 'src/actions';


export default class PathwayExample extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  public render() {
    const { name, path, image} = this.props.examplePath;    
    return (
        <div className="pathexample" onClick={(e) => this.setCommands(e)}>
            <p>{name}</p>
            <img src={"./images/examples/" + image} alt=""/> 
            <p className="path">{path}</p>
        </div>
    );
  }

  private setCommands = (e: React.MouseEvent<HTMLDivElement>) => {
    const { command } = this.props.examplePath;    
    this.props.actions.setCommand({
      id: 10000,
      name: "fd",
      commands: [command]
    });

  }
}

interface IProps {
    examplePath: IPathwayExample,
    actions: CommandActions
}

interface IState {
  html: string
}

