import * as React from 'react';
import { IPathwayExample } from 'src/models';
import { CommandActions } from 'src/actions';

const PathwayExample: React.FC<IProps> = ({ examplePath, actions }) => {
  const { name, path, image } = examplePath;
  const setCommands = () => {
    const { command } = examplePath;
    actions.setCommand({
      id: 10000,
      name: 'fd',
      commands: [command]
    });
  };
  return (
    <div className="pathexample" onClick={setCommands}>
      <p>{name}</p>
      <img src={`./images/examples/${image}`} alt={`${name} Logo drawing preview`} />
      <p className="path">{path}</p>
    </div>
  );
};

export default PathwayExample;

interface IProps {
  examplePath: IPathwayExample;
  actions: CommandActions;
}
