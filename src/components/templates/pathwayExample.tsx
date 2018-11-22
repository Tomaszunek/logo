import * as React from 'react';
import { IPathwayExample } from 'src/models';
import commandImage from 'src/images/command1.jpg';


export default class PathwayExample extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  public render() {
    const { name, path } = this.props.examplePath;    
    return (
        <div className="pathexample">
            <p>{name}</p>
            <img src={commandImage} alt=""/> 
            <p>{path}</p>
        </div>
    );
  } 
}

interface IProps {
    examplePath: IPathwayExample
}

interface IState {
  html: string
}

