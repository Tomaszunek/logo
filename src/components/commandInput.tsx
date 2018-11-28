import * as React from 'react';
import { ICommandModel } from 'src/models';
import { CommandActions } from 'src/actions';
import { Parser } from 'src/utils/parser';
import Popup from './popup';
import { ErrorHandler } from 'src/utils/errorHandler';

export default class CommandInput extends React.Component<IProps, IState> { 
  public input: HTMLInputElement | null;
  constructor(props: IProps) {
    super(props);
    this.state = {
      showPopup: false,
      popupText: ''
    }
  };  

  public render() {
    return (      
      <>        
        <input className="commandInput" autoFocus={true} 
          ref={elem => this.input = elem} 
          onKeyPress={this.onInputChange}
        />        
        {this.state.showPopup ? 
          <Popup
            massage={this.state.popupText}
            closePopup={this.togglePopup}
          />
          : null
        }
      </>
    );
  }  

  private onError = (insideCommand: string, wrongCommand: string) => {
    const errorHandler = new ErrorHandler({
      fullCommand: (this.input) ? this.input.value : '',
      insideCommand,
      wrongCommand   
    }, this.props.descriptions).handleError();
    this.setState({
      showPopup: true,
      popupText: errorHandler
    })
    setTimeout(() => {
      this.setState({
        showPopup: false,
        popupText: errorHandler
      })
    }, 5000);
  }

  private togglePopup = () => {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  private onInputChange = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter'){
      const parser = new Parser((e.target as HTMLInputElement).value.trim()).parse(this.onError);
      if(parser && parser.length > 0) {
        for(const item of parser) {
          this.props.actions.addCommand(item);
        }
        if(this.input === null) {return;}
        this.input.value = '';
      } else {
        // 
      } 
    }   
  }  
}

interface IProps {
    text?: string | null
    commands: Array<ICommandModel>
    actions: CommandActions
    descriptions: any
  }
  
  interface IState {
    showPopup: boolean,
    popupText: string
  }
  
  



