import * as React from "react";
import { IPathwayExample } from "src/models";
import { useCommandStore } from "src/store/commandStore";

const PathwayExample: React.FC<IProps> = ({ examplePath }) => {
  const replaceCommands = useCommandStore((state) => state.replaceCommands);
  const { name, path, image } = examplePath;
  const setCommands = () => {
    const { command } = examplePath;
    replaceCommands([command]);
  };
  return (
    <button
      type="button"
      className="pathexample"
      onClick={setCommands}
      aria-label={`Load ${name} example`}
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
}
