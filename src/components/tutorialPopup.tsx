import * as React from 'react';
import { ITutorialPage } from '../models'

export default class TutorialPopup extends React.Component<IProps, IState> { 
  constructor(props: IProps) {
    super(props);
    this.state = {
      sideNumber: 0
    }
  };  

  public render() {
    console.log(this.setVisibility())
    const tutorialPage = this.props.tutorialPages[this.state.sideNumber]
    return (
      <div className="tutorialPopup">
        {this.displayContent(tutorialPage)}
        <div className="tutorialNav">
          <button>{"< BACK"}</button>
          <button>{"NEXT >"}</button>
        </div>
      </div>
    );
  }

  private setVisibility = () => {
    return 0;
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
    sideNumber: number
}
  
  



