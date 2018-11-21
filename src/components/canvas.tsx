import * as React from 'react';
import { connect } from 'react-redux';
import { ICommandModel } from 'src/models';
import { CommandActions } from 'src/actions';
import { Turtle } from '../utils/turtle';
import { Caller } from 'src/utils/caller';


class Canvas extends React.Component<IProps, IState> {
  public canvas: HTMLCanvasElement | null;
  public caller: Caller;
  public turtle: Turtle;
  private canvasX: number;
  private canvasY: number;
  constructor(props: any) {
    super(props);
    this.canvasX = 800;
    this.canvasY = 800;
    this.turtle = new Turtle({
      canvas: null,
      homeX: this.canvasX / 2,
      homeY: this.canvasY / 2,
      dir: 0,
      strokeColor: '#ffffff',
      strokeWeight: 1,
      pen: true,
      visible: true
    })
    this.caller = new Caller(this.turtle);
  };
  

  public componentDidMount() {
    this.turtle.canvas = this.canvas;
    const { commands } = this.props;
    commands.forEach((command: ICommandModel) => {
      if(command.name === 'repeat' && command.commands) {
        this.caller[command.name](command)
      } else if(command.name === 'setpos') {
        console.log(command)
        if(command.value && command.arg2) {
          this.caller[command.name](command.value, command.arg2)
        }        
      } else {
        this.caller[command.name](command.value);
      }
    });
    this.turtle.drawTurtle();
  }

  public componentWillReceiveProps(nextProps: IProps){
    this.turtle.clearCanvas();
    const { commands } = nextProps;
    commands.forEach((command: ICommandModel) => {
      if(command.name === 'repeat' && command.commands) {
        this.caller[command.name](command)
      } else if(command.name === 'setpos' && command.value && command.arg2) {
        this.caller[command.name](command.value, command.arg2)                
      } else {
        this.caller[command.name](command.value);
      }
    });
    this.turtle.drawTurtle();  
  } 

  public render() {
    return (
      <div className="canvas">
        <canvas ref={elem => this.canvas = elem} width={this.canvasX} height={this.canvasY}/>
      </div>
    );
  }
}

function mapStateToProps(props: IProps){
  return props;
}

export default connect(mapStateToProps)(Canvas);

interface IProps {
  text?: string | null
  commands: Array<ICommandModel>
  actions: CommandActions
}

interface IState {
  html: string
}

