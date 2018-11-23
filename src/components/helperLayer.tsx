import * as React from 'react';
import { IPathwayExample } from 'src/models';
import HelperWindow from './helperWindow';

export default class HelperLayer extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)
    this.state = {
      visible: false,
      site: "left"
    } 
  };   

  public render() {
    const display: React.CSSProperties = {
      display: (this.state.visible ? "block" : "none")
    }
    return (
      <div className="helperLayer">
        <div className="menuIcon left" onClick={(e) => this.openHelperModal(e, "left")}>
            {">"}
        </div>
        <div className="menuIcon right" onClick={(e) => this.openHelperModal(e, "right")}>
            {"<"}
        </div>
        <HelperWindow descriptions={this.props.descriptions} itemStyle={display} examplePaths={this.props.examplePaths} site={this.state.site}/>
      </div>      
    );
  }
  
  private openHelperModal = (e: React.MouseEvent<HTMLDivElement>, site: string) => {
    this.setState({
      visible: !this.state.visible,
      site
    })
  }
}

interface IProps {
  examplePaths: Array<IPathwayExample>,
  descriptions: any
}

interface IState {
  visible: boolean,
  site: string
}

