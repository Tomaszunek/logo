import * as React from 'react';
import { blendModes, type CommandTypes, type ICommandDescription, type ICommandModel } from 'src/models';
import { useCommandStore } from 'src/store/commandStore';

interface IProps {
  descriptions: Readonly<Record<string, ICommandDescription>>;
}

const twoNumberCommands = new Set<CommandTypes>([
  "arc",
  "cube",
  "ellipse",
  "fillpoly",
  "grid3d",
  "polygon",
  "setdash",
  "setpos",
  "sphere",
  "spray",
  "spiral",
  "star",
]);

const CommandList: React.FC<IProps> = ({ descriptions }) => {
  const commands = useCommandStore((state) => state.commands);
  const editCommand = useCommandStore((state) => state.editCommand);
  const deleteCommand = useCommandStore((state) => state.deleteCommand);

    const displayCommands = (items: readonly ICommandModel[]) => items.map((item: ICommandModel) => {
      const itemDesc = descriptions[item.name];
      const { short, name, long } = itemDesc;
      return (
        <div className={`commandItem ${  item.name}`} key={item.id}>
          <div className="heading">
            <div className="commandTitle">
              <code>{short}</code>
              <span>{name}</span>
            </div>
            <div className="commandFields">
              {(item.value === undefined) ?
                null :
                <input aria-label={`${short} value`} value={item.value} type="number" name="value" onChange={e => { onChangeInput(e, item, item.name); }} />}
              {(item.arg2 === undefined) ?
                null :
                <input aria-label={`${short} second value`} value={item.arg2} type="number" name="arg2" onChange={e => { onChangeInput(e, item, item.name); }} />}
              {(item.color !== undefined && item.color !== '') ?
                <input aria-label={`${short} first color`} name="color" type="color" value={item.color} onChange={e => { onChangeInput(e, item, item.name); }} /> :
                null}
              {(item.color2 !== undefined && item.color2 !== '') ?
                <input aria-label={`${short} second color`} name="color2" type="color" value={item.color2} onChange={e => { onChangeInput(e, item, item.name); }} /> :
                null}
              {item.blend === undefined ? null : (
                <select
                  aria-label={`${short} mode`}
                  value={item.blend}
                  onChange={(event) => {
                    const blend = blendModes.find(
                      (candidate) => candidate === event.target.value,
                    );
                    if (blend !== undefined) {
                      editCommand({ ...item, blend });
                    }
                  }}
                >
                  {blendModes.map((blend) => (
                    <option key={blend} value={blend}>{blend}</option>
                  ))}
                </select>
              )}
              {item.palette?.map((color, paletteIndex) => (
                <input
                  key={`${item.id}-${paletteIndex}`}
                  aria-label={`${short} color ${paletteIndex + 1}`}
                  type="color"
                  value={color}
                  onChange={(event) => {
                    const palette = [...(item.palette ?? [])];
                    palette[paletteIndex] = event.target.value;
                    editCommand({ ...item, palette });
                  }}
                />
              ))}
              <button
                type="button"
                className="remove"
                aria-label={`Remove ${item.name} command`}
                onClick={() => { removeCommand(item.id); }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
          <div className="description">
            <p>{long}</p>
          </div>
          {item.commands ? (
            <div className="nestedInspector">{displayCommands(item.commands)}</div>
          ) : null}
        </div>
      );
    });

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>, item: ICommandModel, type: CommandTypes) => {
    const command = { ...item };
    if (
      type === "setbc" ||
      type === "setsc" ||
      type === "gradientbg" ||
      type === "setgradient" ||
      type === "setradial"
    ) {
      if (e.target.name === "color2") {
        command.color2 = e.target.value;
      } else if (e.target.name === "color") {
        command.color = e.target.value;
      } else {
        command.value = Number(e.target.value);
      }
    } else if (twoNumberCommands.has(type)) {
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

  const removeCommand = (id: number) => {
    deleteCommand(id);
  };

  return (
    <>
      <div className="panelHeader">
        <div>
          <p className="eyebrow">Inspector</p>
          <h2>Fine-tune</h2>
        </div>
      </div>
      <p className="inspectorIntro">
        Adjust values and colors—the canvas updates instantly.
      </p>
      <div className="commendList">
        {commands.length === 0 ? (
          <div className="inspectorEmpty">
            Controls appear here when you add a command.
          </div>
        ) : (
          displayCommands(commands)
        )}
      </div>
    </>
  );
};

export default CommandList;
