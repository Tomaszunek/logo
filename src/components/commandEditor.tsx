import * as React from 'react';
import { ICommandModel } from 'src/models';
import { CommandActions } from 'src/actions';

export default class CommandEditor extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  }; 
  

  public displayCommands = (commands: Array<ICommandModel>) => {
    return commands.map((item:ICommandModel) => {
      const { name, value, id } = item;
      return (
        <li key={id} attr-n={id} className={name}>
          {name} {value}
        </li>
      )    
    })
  }  

  public render() {
    return (
      <div className="commandEditor">
        <ul className="editorCont">
          {this.displayCommands(this.props.commands)}
        </ul>
      </div>      
    );
  }  
}

interface IProps {
  text?: string | null
  commands: Array<ICommandModel>
  actions: CommandActions
}

interface IState {
  html: string
}

