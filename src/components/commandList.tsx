import * as React from 'react';
import { ICommandModel } from 'src/models';
import { CommandActions } from 'src/actions';

export default class CommandList extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props)
  };

  public displayCommands = () => {
    const { commands } = this.props;
    return commands.map((item: ICommandModel) => {
      return (
        <div className={item.name} key={item.id}>
          {item.name} | {item.value}
        </div>
      )
    });
  }
  
  public render() {
    return (
      <div className="CommendList">
        {this.displayCommands()}
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


