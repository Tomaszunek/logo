import * as React from 'react';
import { ICommandModel } from 'src/models';

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

