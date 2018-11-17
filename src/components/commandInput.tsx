import * as React from 'react';
import { ICommandModel } from 'src/models';
import { CommandActions } from 'src/actions';
import { Parser } from 'src/utils/parser';

export default class CommandInput extends React.Component<IProps, IState> { 
  public input: HTMLInputElement | null;
  constructor(props: IProps) {
    super(props);
  };  

  public render() {
    return (
      <input className="commandInput" autoFocus={true} ref={elem => this.input = elem} onKeyPress={this.onInputChange}/>
    );
  }  

  public onError = (text: string) => {
    console.log(text)
  }

  private onInputChange = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter'){
      const parser = new Parser((e.target as HTMLInputElement).value, this.props.descriptions).parse(this.onError);
      if(parser.length > 0) {
        for(const item of parser) {
          this.props.actions.addCommand(item);
        }
        if(this.input === null) {return;}
        this.input.value = '';
      } else {
        console.log(parser);
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
    html: string
  }
  
  



