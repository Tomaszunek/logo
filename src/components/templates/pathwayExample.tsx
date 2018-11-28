import * as React from 'react';
import { IPathwayExample } from 'src/models';


export default class PathwayExample extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  public render() {
    const { name, path, image} = this.props.examplePath;    
    return (
        <div className="pathexample">
            <p>{name}</p>
            <img src={"./images/examples/" + image} alt=""/> 
            <p className="path">{path}</p>
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

