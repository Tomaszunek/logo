import * as React from 'react';
import { ICommandModel } from 'src/models';
import { useCommandStore } from 'src/store/commandStore';

const CommandEditor: React.FC = () => {
  const commands = useCommandStore((state) => state.commands);
  const deleteCommand = useCommandStore((state) => state.deleteCommand);

  const displayCommands = (cmds: ReadonlyArray<ICommandModel>) =>
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
            aria-label={`Remove ${name} command`}
            className="removeButton"
            onClick={() => deleteCommand(id)}
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
