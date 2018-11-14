import * as React from 'react';
import ContentEditable from 'react-contenteditable';
import { ICommandModel } from 'src/models';

export default class CommandEditor extends React.Component<IProps, IState> { 
  constructor(props: any) {
    super(props)
    this.state = {html: this.props.commands.map((item:ICommandModel) => {
      const { name, value } = item;
      return `<ul key={ind}>${name} ${value}</ul>`;      
    }).join('').concat('<ul></ul>')};
  };
 
  public handleChange = (evt:any) => {    
    this.setState({
      ...this.state,
      html: evt.target.value      
    })
  }

  public displayCommands = () => {
    const { commands } = this.props;
    return commands.map((item:ICommandModel) => {
      const { name, value } = item;
      return `<ul key={ind}>${name} ${value}</ul>`;      
    }).join('').concat('<ul></ul>')
  }

  public render() {
    return (
      <div className="commandEditor">
          <ContentEditable
            html={this.state.html}
            disabled={false}
            onChange={this.handleChange}
            className="editorCont"            
          />
      </div>
      
    );
  }  
}

interface IProps {
  text?: string | null
  commands: Array<ICommandModel>
}

interface IState {
  html: string
}

