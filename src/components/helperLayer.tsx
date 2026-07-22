import * as React from 'react';
import { IPathwayExample } from 'src/models';
import HelperWindow from './helperWindow';
import { CommandActions } from 'src/actions';

interface HelperLayerProps {
  examplePaths: Array<IPathwayExample>;
  descriptions: any;
  actions: CommandActions;
  visible: boolean;
  panel: 'tips' | 'examples';
  onClose: () => void;
}

const HelperLayer: React.FC<HelperLayerProps> = ({ examplePaths, descriptions, actions, visible, panel, onClose }) => {
  if (!visible) return null;
  const site = panel === 'tips' ? 'left' : 'right';
  return (
    <div className="helperLayer">
      <HelperWindow
        actions={actions}
        descriptions={descriptions}
        itemStyle={{ display: 'block' }}
        examplePaths={examplePaths}
        site={site}
      />
      <button aria-label="Close helper panel" onClick={onClose} style={{ position: "absolute", top: 10, right: 10 }}>✖</button>
    </div>
  );
};

export default HelperLayer;
