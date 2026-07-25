import * as React from "react";
import type { ITutorialPage } from "../models";

interface IProps {
  tutorialPages: readonly ITutorialPage[];
  onClose: () => void;
}

const TutorialPopup: React.FC<IProps> = ({ tutorialPages, onClose }) => {
  const [pageNumber, setPageNumber] = React.useState(0);
  const tutorialPage = tutorialPages[pageNumber];

  if (tutorialPage === undefined) {
    return null;
  }

  const { title, content, image, name } = tutorialPage;

  return (
    <div className="modalBackdrop">
      <section
        className="tutorialPopup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
      >
        <div className="title">
          <div>
            <p className="eyebrow">
              Quick guide · {pageNumber + 1} of {tutorialPages.length}
            </p>
            <h2 id="tutorial-title">
              {title} — {name}
            </h2>
          </div>
          <button
            type="button"
            className="modalClose"
            aria-label="Close tutorial"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="content">
          <img src={`./images/tutorial/${image}`} alt="" />
          <div className="tip">{content}</div>
        </div>
        <div className="tutorialNav">
          <button
            type="button"
            className="button buttonGhost"
            disabled={pageNumber === 0}
            onClick={() => {
              setPageNumber((previous) => previous - 1);
            }}
          >
            ← Back
          </button>
          <button
            type="button"
            className="button buttonPrimary"
            disabled={pageNumber === tutorialPages.length - 1}
            onClick={() => {
              setPageNumber((previous) => previous + 1);
            }}
          >
            Next →
          </button>
        </div>
      </section>
    </div>
  );
};

export default TutorialPopup;
