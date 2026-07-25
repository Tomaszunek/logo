import * as React from 'react';
import type { ICommandModel } from 'src/models';
import { useCommandStore } from 'src/store/commandStore';

const CommandEditor: React.FC = () => {
  const commands = useCommandStore((state) => state.commands);
  const deleteCommand = useCommandStore((state) => state.deleteCommand);

  const displayCommands = (cmds: readonly ICommandModel[]) =>
    cmds.map((item) => {
      const { name, value, arg2, color, color2, id } = item;
      return (
        <li key={id} data-id={id} className={name}>
          <span className="tagName">
            <strong>{name}</strong>
            {value !== undefined && <span>{value}</span>}
            {arg2 !== undefined && <span>{arg2}</span>}
            {color !== undefined && <span>{color}</span>}
            {color2 !== undefined && <span>{color2}</span>}
          </span>
          {item.commands ? (
            <ul className="nestedCommands">{displayCommands(item.commands)}</ul>
          ) : null}
          <button
            type="button"
            aria-label={`Remove ${name} command`}
            className="removeButton"
            onClick={() => {
              deleteCommand(id);
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        </li>
      );
    });

  return (
    <div className="commandEditor">
      <div className="panelHeader">
        <div>
          <p className="eyebrow">Program</p>
          <h2>Command stack</h2>
        </div>
        <span className="commandCount">{commands.length} top-level</span>
      </div>
      {commands.length === 0 ? (
        <div className="editorEmpty">
          <span aria-hidden="true">✦</span>
          <div>
            <strong>Your first shape starts here</strong>
            <p>Enter a command below or open Examples for instant inspiration.</p>
          </div>
        </div>
      ) : (
        <ul className="editorCont">{displayCommands(commands)}</ul>
      )}
    </div>
  );
};

export default CommandEditor;
