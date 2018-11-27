import * as React from 'react';
import { ITutorialPage } from '../models'

export default class TutorialPopup extends React.Component<IProps, IState> { 
  constructor(props: IProps) {
    super(props);
    this.state = {
      siteNumber: 0,
      visibility: true
    }
  };  

  public render() {
    console.log(this.setVisibility())
    const tutorialPage = this.props.tutorialPages[this.state.siteNumber];
    const style = {
      display: (this.state.visibility ? 'grid' : 'none')
    }
    const bbstyle = {
      display: (this.state.siteNumber === 0 ? 'none' : 'block')
    }
    const brstyle = {
      display: (this.state.siteNumber !== this.props.tutorialPages.length - 1 ? 'block' : 'none'),
      "margin-left": (this.state.siteNumber === 0 ? '676px' : '578px')
    }
    return (
      <div className="tutorialPopup" style={style}>
        {this.displayContent(tutorialPage)}
        <div className="tutorialNav">
          <button style={bbstyle} onClick={(e) => this.changeSite(e, "left")}>{"< BACK"}</button>
          <button style={brstyle} onClick={(e) => this.changeSite(e, "right")}>{"NEXT >"}</button>
        </div>
      </div>
    );
  }

  private setVisibility = () => {
    return 0;
  }

  private changeSite = (e: React.MouseEvent<HTMLButtonElement>, siteButton: "left" | "right") => {
    const counter = this.state.siteNumber;
    switch (siteButton) {
      case "left":
        this.setState({
          ...this.state,
          siteNumber: counter- 1
        })
        break;
      case "right":
        this.setState({
          ...this.state,
          siteNumber: counter + 1
        })
        break;        
      default:
        break;
    }
  }

  private displayContent = (tutorialPage: ITutorialPage) => {
    if(tutorialPage) {
      const { title, content, image, name } = tutorialPage;
      return (
        <div>
          <div className="title">
            <button onClick={(e) => this.closePopup(e)}>X</button>
            <p>{this.state.siteNumber + 1 + ") " + title + " - " + name}</p>      
          </div>
          <div>
            {image}
            {content}
          </div>
        </div>
      ) 
    } else {
      return null;
    }       
  }

  private closePopup = (e: React.MouseEvent<HTMLButtonElement>) => {
     this.setState({
       ...this.state,
       visibility: !this.state.visibility
     })    
  }
}

interface IProps {
    tutorialPages: Array<ITutorialPage>,
}
interface IState {
    siteNumber: number,
    visibility: boolean
}
  
  



