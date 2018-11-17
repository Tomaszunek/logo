import * as React from 'react';

export default class Popup extends React.Component<IProps, IState> { 
  public input: HTMLInputElement | null;
  constructor(props: IProps) {
    super(props);
  };  

  public render() {
    return (
      <div className="popup">
        <div className="popupInner">
            <p>
                {this.props.massage}
            </p> 
        </div>       
      </div>
    );
  }  

  

  
}

interface IProps {
    massage: string,
    closePopup: any
}
interface IState {
    showPopup: boolean
}
  
  



