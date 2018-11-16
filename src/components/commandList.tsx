import * as React from 'react';
import { ICommandModel, ICommandDescription } from 'src/models';
import { CommandActions } from 'src/actions';

export default class CommandList extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props)
  };

  public displayCommands = () => {
    const { commands } = this.props;
    return commands.map((item: ICommandModel) => {
      const itemDesc = this.props.descriptions[item.name];
      return (
        <div className={item.name} key={item.id}>
          {itemDesc.name} | {item.value}
        </div>
      )
    });
  }
  
  public render() {
    return (
      <div className="commendList">
        {this.displayCommands()}
      </div>
    );
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


