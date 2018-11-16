import * as React from 'react';
import { ICommandModel } from 'src/models';
import { CommandActions } from 'src/actions';
import { Turtle } from '../utils/turtle';
import { Caller } from 'src/utils/caller';


export default class Canvas extends React.Component<IProps, IState> {
  public canvas: HTMLCanvasElement | null;
  public caller: Caller;
  public turtle: Turtle;
  constructor(props: any) {
    super(props);
    this.turtle = new Turtle({
      canvas: null,
      homeX: 0,
      homeY: 0,
      dir: 0,
      strokeColor: '#ffffff',
      strokeWeight: 1,
      pen: true
    })
    this.caller = new Caller(this.turtle);
  };
  

  public componentDidMount() {
    this.turtle.canvas = this.canvas;
    const { commands } = this.props;
    commands.forEach((command: ICommandModel) => {
      console.log(command, this.caller);
      this.caller[command.name](command.value);
    });
    this.turtle.drawTurtle();
  }

  public render() {
    return (
      <div className="canvas">
        <canvas ref={elem => this.canvas = elem} width="800" height="800"/>
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

