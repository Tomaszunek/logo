import * as React from 'react';
import { ICommandModel } from 'src/models';

export default class HelperWindow extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  public render() {
    return (
      <div className="helperWindow">
        abba
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

