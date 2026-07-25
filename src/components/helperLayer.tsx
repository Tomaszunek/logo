import * as React from 'react';
import type { ICommandDescription, IPathwayExample } from 'src/models';
import HelperWindow from './helperWindow';

interface HelperLayerProps {
  examplePaths: readonly IPathwayExample[];
  descriptions: Readonly<Record<string, ICommandDescription>>;
  visible: boolean;
  panel: 'tips' | 'examples';
  onClose: () => void;
}

const HelperLayer: React.FC<HelperLayerProps> = ({ examplePaths, descriptions, visible, panel, onClose }) => {
  if (!visible) {return null;}
  const site = panel === 'tips' ? 'left' : 'right';
  return (
    <div className="modalBackdrop">
      <section
        className="helperLayer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="examples-title"
      >
        <div className="modalHeader">
          <div>
            <p className="eyebrow">Inspiration gallery</p>
            <h2 id="examples-title">Start from an example</h2>
            <p>Pick a design to load its editable command stack.</p>
          </div>
          <button
            type="button"
            className="modalClose"
            aria-label="Close examples"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <HelperWindow
          descriptions={descriptions}
          itemStyle={{ display: "block" }}
          examplePaths={examplePaths}
          site={site}
          onSelect={onClose}
        />
      </section>
    </div>
  );
};

export default HelperLayer;
