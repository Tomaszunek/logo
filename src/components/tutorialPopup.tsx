import * as React from 'react';

export default class TutorialPopup extends React.Component<IProps, IState> { 
  public input: HTMLInputElement | null;
  constructor(props: IProps) {
    super(props);
  };  

  public render() {
    return (
      <div className="tutorialPopup">
        a     
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
  
  



