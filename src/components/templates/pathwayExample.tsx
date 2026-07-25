import * as React from "react";
import type { IPathwayExample } from "src/models";
import { useCommandStore } from "src/store/commandStore";

const PathwayExample: React.FC<IProps> = ({ examplePath, onSelect }) => {
  const replaceCommands = useCommandStore((state) => state.replaceCommands);
   const { name, path, image, type } = examplePath;
   const setCommands = () => {
    const { command } = examplePath;
    replaceCommands([command]);
    onSelect();
  };
  return (
    <button
      type="button"
      className="pathexample"
      onClick={setCommands}
      aria-label={`Load ${name} ${type} example`}
    >
      <p>{name}</p>
      <img
        src={`./images/examples/${image}`}
        alt={`${name} Logo drawing preview`}
      />
      <p className="path">{path}</p>
    </button>
  );
};

export default PathwayExample;

interface IProps {
  examplePath: IPathwayExample;
  onSelect: () => void;
}
