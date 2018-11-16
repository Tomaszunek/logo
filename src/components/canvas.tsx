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
      canvas: null,
      homeX: 0,
      homeY: 0,
      dir: 0,
      strokeColor: '#ffffff',
      strokeWeight: 1,
      pen: true
    })
  };

  public drawLine() { 
    this.turtle.drawLine(100, 200);
    this.turtle.drawLine(300, 450);
    this.turtle.drawLine(50, 50);
    this.turtle.drawLine(-250, -650);
    this.turtle.drawTurtle(10, 10);
    this.turtle.clearCanvas();
    this.turtle.drawTurtle(50, 50);
  }

  public componentDidMount() {
    this.turtle.canvas = this.canvas;
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

