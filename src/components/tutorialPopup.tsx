import * as React from 'react';
import type { ITutorialPage } from '../models'
import { useState } from 'react';

const TutorialPopup: React.FC<IProps> = ({ tutorialPages }) => {
  const [siteNumber, setSiteNumber] = useState(0);
   const [visibility, setVisibility] = useState(true);

   const changeSite = (siteButton: 'left' | 'right') => {
    if (siteButton === 'left') {
      setSiteNumber(prev => prev - 1);
    } else {
      setSiteNumber(prev => prev + 1);
    }
  };

   const displayContent = (tutorialPage: ITutorialPage | undefined) => {
    if (tutorialPage === undefined) {return null;}
    const { title, content, image, name } = tutorialPage;
    return (
      <div>
        <div className="title">
          <button
            type="button"
            aria-label="Close tutorial"
            onClick={() => { setVisibility(prev=>!prev); }}
          >
            X
          </button>
          <p>{siteNumber + 1}) {title} - {name}</p>
        </div>
        <div className="content">
          <img src={`./images/tutorial/${image}`} alt={image}/>
          <div className="tip">{content}</div>
        </div>
      </div>
    );
  };

   const style = { display: visibility ? 'grid' : 'none' };
   const bbstyle = { display: siteNumber === 0 ? 'none' : 'block' };
   const brstyle = {
    display: siteNumber === tutorialPages.length - 1 ? 'none' : 'block'
  };

  return (
    <div className="tutorialPopup" style={style}>
      {displayContent(tutorialPages[siteNumber])}
      <div className="tutorialNav">
        <button type="button" style={bbstyle} onClick={() => { changeSite('left'); }}>{'< BACK'}</button>
        <button type="button" style={brstyle} onClick={() => { changeSite('right'); }}>{'NEXT >'}</button>
      </div>
    </div>
  );
};

export default TutorialPopup;

interface IProps {
  tutorialPages: readonly ITutorialPage[];
}
