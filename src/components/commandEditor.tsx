import * as React from 'react';
import { ICommandModel } from 'src/models';
// CommandActions removed, using Zustand store instead

interface IProps {
  text?: string | null;
  commands: Array<ICommandModel>;
  actions: any; // use actions from Zustand store
}

const CommandEditor: React.FC<IProps> = ({ commands, actions }) => {
  const displayCommands = (cmds: Array<ICommandModel>) =>
    cmds.map((item) => {
      const { name, value, id } = item;
      return (
        <li key={id} data-id={id} role="listitem" tabIndex={0} className={name}>
          <div className="tagName">
            {name} {value}
            {item.commands ? <ul>{displayCommands(item.commands)}</ul> : null}
          </div>
          <button
            type="button"
            aria-label="Remove command"
            className="removeButton"
            onClick={() => actions.deleteCommand(id)}
          >
            x
          </button>
        </li>
      );
    });

  return (
    <div className="commandEditor">
      <ul className="editorCont">{displayCommands(commands)}</ul>
    </div>
  );
};

export default CommandEditor;
