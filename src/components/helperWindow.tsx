import * as React from 'react';
import { IPathwayExample } from 'src/models';
import PathwayExample from './templates/pathwayExample';

export default class HelperWindow extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  
  public render() {
    const { examplePaths } = this.props;
    return (
      <div style={this.props.itemStyle} className={"helperWindow " + this.props.site}>
        {this.displayExample(examplePaths)}
      </div>      
    );
  } 

  private displayExample(examples: Array<IPathwayExample>) {
    console.log(examples)    
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

