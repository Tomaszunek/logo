import * as React from 'react';
import ContentEditable from 'react-contenteditable';
import { ICommandModel } from 'src/models';
import { CommandActions } from 'src/actions';

export default class CommandEditor extends React.Component<IProps, IState> { 
  constructor(props: any) {
    super(props)
    this.state = {html: this.displayCommands(this.props.commands)}
  };
 
  public handleChange = (evt:any) => {    
    const {commands} =  this.props;    
    this.setState({
      html: this.displayCommands(commands)
    })
  }

  public displayCommands = (commands: Array<ICommandModel>) => {
    const abc =  commands.map((item:ICommandModel) => {
      const { name, value } = item;
      return `<ul key={ind}>${name} ${value}</ul>`;      
    }).join('').concat('<ul></ul>')
    return abc;
  }

  public handleKeyPress = (event: any) => {
    if(event.key === 'Enter'){
      console.log('enter press here! ', event)
    }
  }

  public render() {
    return (
      <div className="commandEditor">
          <ContentEditable
            html={this.displayCommands(this.props.commands)}
            disabled={false}
            onChange={this.props.actions.addTodo}
            className="editorCont"            
          />
          <input/>
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

