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
    <div className="helperLayer">
      <HelperWindow
        descriptions={descriptions}
        itemStyle={{ display: 'block' }}
        examplePaths={examplePaths}
        site={site}
      />
      <button
        type="button"
        aria-label="Close helper panel"
        onClick={onClose}
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        &times;
      </button>
    </div>
  );
};

export default HelperLayer;
