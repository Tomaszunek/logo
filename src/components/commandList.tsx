import * as React from 'react';
import { ICommandModel, ICommandDescription, CommandTypes } from 'src/models';
// 
interface IProps {
  text?: string | null;
  commands: Array<ICommandModel>;
  descriptions: Record<string, ICommandDescription>;
  actions: any; // use actions from Zustand store
}

const CommandList: React.FC<IProps> = ({ text, commands, descriptions, actions }) => {
  const displayCommands = (items: Array<ICommandModel>) => {
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
              <button className="remove" onClick={(e) => removeCommand(e, item.id)}>X</button>
            </div>
          </div>
          <div className="description">
            <p>
              {long}
              {args.map((argument: any) => {
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
    actions.editCommand({ ...command });
  };

  const removeCommand = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    actions.deleteCommand(id);
  };

  return (
    <div className="commendList">
      {displayCommands(commands)}
    </div>
  );
};

export default CommandList;