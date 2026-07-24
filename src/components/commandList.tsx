import * as React from 'react';
import { ICommandModel, ICommandDescription, CommandTypes } from 'src/models';
import { useCommandStore } from 'src/store/commandStore';

interface IProps {
  descriptions: Readonly<Record<string, ICommandDescription>>;
}

const CommandList: React.FC<IProps> = ({ descriptions }) => {
  const commands = useCommandStore((state) => state.commands);
  const editCommand = useCommandStore((state) => state.editCommand);
  const deleteCommand = useCommandStore((state) => state.deleteCommand);

  const displayCommands = (items: ReadonlyArray<ICommandModel>) => {
    return items.map((item: ICommandModel) => {
      const itemDesc = descriptions[item.name];
      const { short, name, long, args } = itemDesc;
      return (
        <div className={"commandItem " + item.name} key={item.id}>
          <div className="heading">
            <p>
              {short} | {name}
            </p>
            <div>
              {(item.value) ?
                <input value={item.value} type="number" name="value" onChange={e => onChangeInput(e, item, item.name)} /> :
                null}
              {(item.arg2) ?
                <input value={item.arg2} type="number" name="arg2" onChange={e => onChangeInput(e, item, item.name)} /> :
                null}
              {(item.color) ?
                <input type="color" value={item.color} onChange={e => onChangeInput(e, item, item.name)} /> :
                null}
              <button
                type="button"
                className="remove"
                aria-label={`Remove ${item.name} command`}
                onClick={(e) => removeCommand(e, item.id)}
              >
                X
              </button>
            </div>
          </div>
          <div className="description">
            <p>
              {long}
              {args.map((argument) => {
                return '(' + argument.name + ' type of ' + argument.type + ')';
              })}
            </p>
          </div>
          {(item.commands ? displayCommands(item.commands) : null)}
        </div>
      );
    });
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>, item: ICommandModel, type: CommandTypes) => {
    const command = { ...item };
    if (type === "setbc" || type === "setsc") {
      command.color = e.target.value;
    } else if (type === "setpos") {
      if (e.target.getAttribute("name") === "value") {
        command.value = Number(e.target.value);
      } else {
        command.arg2 = Number(e.target.value);
      }
    } else {
      command.value = Number(e.target.value);
    }
    editCommand(command);
  };

  const removeCommand = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    deleteCommand(id);
  };

  return (
    <div className="commendList">
      {displayCommands(commands)}
    </div>
  );
};

export default CommandList;
