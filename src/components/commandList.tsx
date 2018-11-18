import * as React from 'react';
import { ICommandModel, ICommandDescription } from 'src/models';
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
        <div className={item.name} key={item.id}>
          <div className="heading">
            <p>
              {short} | {name}
            </p>
              <div>
                {
                  ((itemDesc.argCount === 1) ?
                  <input value={item.value} onChange={this.onChangeInput}/> :
                  null)              
                }
                {
                  ((itemDesc.argCount === 2) ?
                  <input value={item.value} onChange={this.onChangeInput}/> :
                  null)              
                }
                <button className="save">S</button>
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

  private onChangeInput = () => {
    console.log("change")
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


