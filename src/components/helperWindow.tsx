import * as React from 'react';
import { IPathwayExample } from 'src/models';
import PathwayExample from './templates/pathwayExample';

export default class HelperWindow extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  
  public render() {    
    return (
      <div style={this.props.itemStyle} className={"helperWindow " + this.props.site}>
        {this.displayAll()}
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
    console.log(groups);
    const renderedTypes = [];
    for(const i in groups) {      
      if(groups[i]) {
        console.log(groups[i]);
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
        <PathwayExample key={example.name} examplePath={example}/>
      )          
    })
  }  
}

interface IProps {
  examplePaths: Array<IPathwayExample>,
  itemStyle: React.CSSProperties,
  site: string
}

interface IState {
  html: string
}

