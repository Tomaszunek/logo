import * as React from 'react';
import { ICommandModel } from 'src/models';
import HelperWindow from './helperWindow';

export default class HelperLayer extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  public render() {
    return (
      <div className="helperLayer">
        <div className="menuIcon left">
            {">"}
        </div>
        <div className="menuIcon right">
            {"<"}
        </div>
        <HelperWindow commandsArray={this.props.commandsArray}/>
      </div>      
    );
  }   
}

interface IProps {
  commandsArray: Array<Array<ICommandModel>>
}

interface IState {
  html: string
}

