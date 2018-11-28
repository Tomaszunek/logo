import * as React from 'react';
import { IPathwayExample } from 'src/models';
import PathwayExample from './templates/pathwayExample';
import CommandDescription from './templates/CommandDescription';
import { CommandActions } from 'src/actions';

export default class HelperWindow extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  
  public render() {    
    return (
      <div style={this.props.itemStyle} className={"helperWindow " + this.props.site}>
        {(this.props.site === 'right') ? (this.displayAll()) : (this.displayCommands())}
      </div>      
    );
  }

  private displayAll() {
    const { examplePaths } = this.props;
    const groups = { };
    examplePaths.forEach((item) => {
      const list = groups[item.type];
      if(list){
          list.push(item);
      } else{
          groups[item.type] = [item];
      }
    });
    const renderedTypes = [];
    for(const i in groups) {      
      if(groups[i]) {
        renderedTypes.push(
          <div key={i}>
            <div className={"header " + i}>
              {i}
            </div>
            <div className={"commandType " + i}>
              {this.displayExample(groups[i])}
            </div>
          </div>
        )        
      }
    }
    return renderedTypes;
  }

  private displayExample(examples: Array<IPathwayExample>) {
    return examples.map((example) => {
      return (
        <PathwayExample actions={this.props.actions} key={example.name} examplePath={example}/>
      )          
    })
  }

  private displayCommands() {
    const { descriptions } = this.props;
    const renderedTypesL = [];
    const renderedTypesR = [];
    let index = 0;
    for(const i in descriptions) {      
      if(descriptions[i]) {
        if(index % 2 === 0) {
          renderedTypesL.push(
            <CommandDescription key={i} description={descriptions[i]}/>
          )  
        } else {
          renderedTypesR.push(
            <CommandDescription key={i} description={descriptions[i]}/>
          ) 
        }
         index++;     
      }
    }
    return (
      <div className="commandsList">
        <div className="commandsLeft">
          {renderedTypesL}
        </div>
        <div className="commandsRight">
          {renderedTypesR}
        </div>
      </div>
    );
  }  
}

interface IProps {
  examplePaths: Array<IPathwayExample>,
  descriptions: any,
  itemStyle: React.CSSProperties,
  site: string,
  actions: CommandActions
}

interface IState {
  html: string
}

