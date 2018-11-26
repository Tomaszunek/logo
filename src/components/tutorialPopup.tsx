import * as React from 'react';

export default class TutorialPopup extends React.Component<IProps, IState> { 
  public input: HTMLInputElement | null;
  constructor(props: IProps) {
    super(props);
  };  

  public render() {
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
}

interface IProps {
    tutorialPages: Array<any>,
}
interface IState {
    showPopup: boolean
}
  
  



