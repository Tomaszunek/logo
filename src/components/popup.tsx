import * as React from 'react';

const Popup: React.FC<IProps> = ({ massage }) => (
    <div className="popup" role="alert" aria-live="assertive">
      <div className="popupInner">
        <p>{massage}</p>
      </div>
    </div>
  );

export default Popup;

interface IProps {
  massage: string;
}

  
  



