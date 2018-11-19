import * as React from 'react';
import { ICommandModel } from 'src/models';

export default class CommandEditor extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  public render() {
    return (
      <div className="commandEditor">
        <div>
            a
        </div>
        <div>
            b
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

