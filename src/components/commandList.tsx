import * as React from 'react';
import { ICommandModel, ICommandDescription, CommandTypes } from 'src/models';
import { CommandActions } from 'src/actions';

export default class CommandList extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props)
  };

  public displayCommands = (items: Array<ICommandModel>) => {
    return items.map((item: ICommandModel) => {
      const itemDesc = this.props.descriptions[item.name];
      const { short, name, long } = itemDesc;
      return (
        <div className={"commandItem " + item.name} key={item.id}>
          <div className="heading">
            <p>
              {short} | {name}
            </p>
              <div>
                {
                  ((item.value) ?
                  <input value={item.value} name="value" onChange={ e => this.onChangeInput(e, item, item.name) }/> :
                  null)              
                }
                {
                  ((item.arg2) ?
                  <input value={item.arg2} name="arg2" onChange={ e => this.onChangeInput(e, item, item.name) }/> :
                  null)              
                }
                {
                  ((item.color) ?
                  <input type="color" value={item.color} onChange={ e => this.onChangeInput(e, item, item.name) }/> :
                  null)              
                }
                <button className="remove">X</button>
              </div>
            </div>            
          <p>
            {long}
          </p>
          {
            (((item.commands)) ? this.displayCommands(item.commands) : null)
          }          
        </div>
      )
    });
  }  
  
  public render() {
    return (
      <div className="commendList">
        {this.displayCommands(this.props.commands)}
      </div>
    );
  }

  private onChangeInput = (e: React.ChangeEvent<HTMLInputElement>, item: ICommandModel, type: CommandTypes) => {
    console.log(type);
    const command = item;
    if(type === "setbc" || type === "setsc") {
      command.color = e.target.value
    } else if (type === "setpos") {
      if(e.target.getAttribute("name") === "value") {
        command.value = Number(e.target.value)
      } else {
        command.arg2 = Number(e.target.value)
      }
    }
    this.props.actions.editCommand({
      ...command
    });
  } 
}


interface IProps {
  text?: string | null
  commands: Array<ICommandModel>
  descriptions: Array<ICommandDescription>
  actions: CommandActions
}

interface IState {
  html: string
}


