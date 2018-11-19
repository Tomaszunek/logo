import * as React from 'react';
import { ICommandModel } from 'src/models';

export default class HelperWindow extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  public render() {
    return (
      <div style={this.props.itemStyle} className={"helperWindow " + this.props.site}>
        abba
      </div>      
    );
  }   
}

interface IProps {
  commandsArray: Array<Array<ICommandModel>>,
  itemStyle: React.CSSProperties,
  site: string
}

interface IState {
  html: string
}

