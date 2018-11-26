import * as React from 'react';

export default class TutorialPopup extends React.Component<IProps, IState> { 
  constructor(props: IProps) {
    super(props);
  };  

  public render() {
    console.log(this.setVisibility())
    return (
      <div className="tutorialPopup">
        <div>
          turorial          
        </div>
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
}

interface IProps {
    tutorialPages: Array<any>,
}
interface IState {
    showPopup: boolean
}
  
  



