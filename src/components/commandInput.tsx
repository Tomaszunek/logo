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
      <input ref={elem => this.input = elem} onKeyPress={this.onInputChange}/>
    );
  }  

  public onError = (text: string) => {
    console.log(text)
  }

  private onInputChange = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter'){
      const parser = new Parser((e.target as HTMLInputElement).value).parse(this.onError);
      for(const item of parser) {
        this.props.actions.addTodo(item);
      }
      console.log(parser);
    }   
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
  
  



