import * as React from 'react';
import ContentEditable from 'react-contenteditable';

export default class CommandEditor extends React.Component<IProps, IState> { 
  constructor(props: any) {
    super(props)
    this.state = {html: "<ul></ul>"};
  };
 
  public handleChange = (evt:any) => {    
    this.setState({
      ...this.state,
      html: evt.target.value      
    })
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
}

interface IState {
  html: string
}

