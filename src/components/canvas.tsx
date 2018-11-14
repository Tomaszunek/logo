import * as React from 'react';
import { ICommandModel } from 'src/models';
import { CommandActions } from 'src/actions';
import { Turtle } from '../utils/turtle';


export default class Canvas extends React.Component<IProps, IState> {
  public canvas: HTMLCanvasElement | null;
  public turtle: Turtle;
  constructor(props: any) {
    super(props);
    this.turtle = new Turtle({
      currentX: 0,
      currentY: 0})
  };

  public drawLine() {
    if(this.canvas === null) {return};
    const ctx = this.canvas.getContext("2d");
    if(ctx === null) {return};    
    this.turtle.drawLine(this.canvas, 100, 200);
    this.turtle.drawLine(this.canvas, 300, 450);
    this.turtle.drawLine(this.canvas, 50, 50);
    this.turtle.drawLine(this.canvas, -250, -650);
  }

  public componentDidMount() {
    this.drawLine()
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

