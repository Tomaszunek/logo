import * as React from 'react';
import { ITutorialPage } from '../models'

export default class TutorialPopup extends React.Component<IProps, IState> { 
  constructor(props: IProps) {
    super(props);
    this.state = {
      siteNumber: 0
    }
  };  

  public render() {
    console.log(this.setVisibility())
    const tutorialPage = this.props.tutorialPages[this.state.siteNumber]
    return (
      <div className="tutorialPopup">
        {this.displayContent(tutorialPage)}
        <div className="tutorialNav">
          <button  onClick={(e) => this.changeSite(e, "left")}>{"< BACK"}</button>
          <button onClick={(e) => this.changeSite(e, "right")}>{"NEXT >"}</button>
        </div>
      </div>
    );
  }

  private setVisibility = () => {
    return 0;
  }

  private changeSite = (e: React.MouseEvent<HTMLButtonElement>, siteButton: "left" | "right") => {
    switch (siteButton) {
      case "left":
        this.setState({
          siteNumber: this.state.siteNumber - 1
        })
        break;
      case "right":
        this.setState({
          siteNumber: this.state.siteNumber + 1
        })
        break;        
      default:
        break;
    }
  }

  private displayContent = (tutorialPage: ITutorialPage) => {
    if(tutorialPage) {
      const { title } = tutorialPage;
      return (
        <div>
          <button>X</button>
          <p>{title}</p>      
        </div>
      ) 
    } else {
      return null;
    }       
  }
}

interface IProps {
    tutorialPages: Array<ITutorialPage>,
}
interface IState {
    siteNumber: number
}
  
  



