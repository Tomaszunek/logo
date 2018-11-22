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
          <div className="tagName" >
            {name} {value}
            {((item.commands) ? (<ul>{this.displayCommands(item.commands)}</ul>) : (null))}
          </div>
          <div className="removeButton" onClick={(e) => this.removeCommand(e, id)}>
            x
          </div>                  
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
  
  private removeCommand = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    this.props.actions.deleteCommand(id);
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

