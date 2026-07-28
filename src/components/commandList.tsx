import * as React from 'react';
import {
  animationEasings,
  animationModes,
  blendModes,
  type CommandTypes,
  type ICommandAnimation,
  type ICommandDescription,
  type ICommandModel,
} from 'src/models';
import { useCommandStore } from 'src/store/commandStore';
import ProcedureCallBadge from "./procedureCallBadge";

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

const hasAnimationProperty = (
  item: Readonly<ICommandModel>,
  properties: readonly ICommandAnimation["property"][],
): boolean =>
  (item.animations ?? []).some(({ property }) =>
    properties.includes(property),
  );

const shouldShowPrimaryValue = (
  item: Readonly<ICommandModel>,
): boolean =>
  item.value !== undefined &&
  item.animation?.property !== "value" &&
  !hasAnimationProperty(item, ["value", "width"]);

const shouldShowSecondValue = (
  item: Readonly<ICommandModel>,
): boolean =>
  item.arg2 !== undefined &&
  !hasAnimationProperty(item, ["arg2", "depth"]);

const getAnimationProperties = (
  item: Readonly<ICommandModel>,
): readonly ICommandAnimation["property"][] => {
  const activeProperties = new Set([
    ...(item.animation === undefined ? [] : [item.animation.property]),
    ...(item.animations ?? []).map(({ property }) => property),
  ]);

  const candidates: readonly ICommandAnimation["property"][] =
    item.name === "cube"
      ? ["width", "height", "depth", "rotation"]
      : [
          ...(item.value === undefined || item.name === "repeat"
            ? []
            : ["value" as const]),
          ...(item.arg2 === undefined ? [] : ["arg2" as const]),
        ];

  return candidates.filter((property) => !activeProperties.has(property));
};

const getAnimationPropertyLabel = (
  property: ICommandAnimation["property"],
  description: Readonly<ICommandDescription>,
): string => {
  const numericArguments = description.args.filter(
    ({ type }) =>
      type.startsWith("number") || type.startsWith("integer"),
  );
  if (property === "value") {
    return numericArguments[0]?.name ?? "value";
  }
  if (property === "arg2") {
    return numericArguments[1]?.name ?? "second value";
  }
  return property;
};

const getAnimationPropertyValue = (
  item: Readonly<ICommandModel>,
  property: ICommandAnimation["property"],
): number => {
  if (property === "arg2") {
    return item.arg2 ?? 0;
  }
  if (property === "width") {
    return item.width ?? item.value ?? 0;
  }
  if (property === "height") {
    return item.height ?? item.value ?? 0;
  }
  if (property === "depth") {
    return item.depth ?? item.arg2 ?? 0;
  }
  if (property === "rotation") {
    return item.rotation ?? 360;
  }
  return item.value ?? 0;
};

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
              <ProcedureCallBadge calls={item.procedureCalls} />
            </div>
            <div className="commandFields">
              {shouldShowPrimaryValue(item) ?
                <input aria-label={`${short} value`} value={item.value} type="number" name="value" onChange={e => { onChangeInput(e, item, item.name); }} /> :
                null}
              {shouldShowSecondValue(item) ?
                <input aria-label={`${short} second value`} value={item.arg2} type="number" name="arg2" onChange={e => { onChangeInput(e, item, item.name); }} /> :
                null}
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
          {item.animation === undefined ? null : (
            <div className="parameterAnimation">
              <strong className="animationProperty">
                {getAnimationPropertyLabel(
                  item.animation.property,
                  itemDesc,
                )}
              </strong>
              <label>
                <span>Start</span>
                <input
                  aria-label={`${short} animation start`}
                  type="number"
                  value={item.animation.start}
                  onChange={(event) => {
                    updateAnimation(item, {
                      start: Number(event.currentTarget.value),
                    });
                  }}
                />
              </label>
              <label>
                <span>Finish</span>
                <input
                  aria-label={`${short} animation finish`}
                  type="number"
                  value={item.animation.finish}
                  onChange={(event) => {
                    updateAnimation(item, {
                      finish: Number(event.currentTarget.value),
                    });
                  }}
                />
              </label>
              <label>
                <span>Time · ms</span>
                <input
                  aria-label={`${short} animation time in milliseconds`}
                  min={1}
                  type="number"
                  value={item.animation.durationMs}
                  onChange={(event) => {
                    updateAnimation(item, {
                      durationMs: Math.max(
                        1,
                        Number(event.currentTarget.value),
                      ),
                    });
                  }}
                />
              </label>
              <label>
                <span>Motion</span>
                <select
                  aria-label={`${short} animation type`}
                  value={item.animation.easing}
                  onChange={(event) => {
                    const easing = animationEasings.find(
                      (candidate) => candidate === event.currentTarget.value,
                    );
                    if (easing !== undefined) {
                      updateAnimation(item, { easing });
                    }
                  }}
                >
                  {animationEasings.map((easing) => (
                    <option key={easing} value={easing}>{easing}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Cycle</span>
                <select
                  aria-label={`${short} animation cycle mode`}
                  value={item.animation.mode}
                  onChange={(event) => {
                    const mode = animationModes.find(
                      (candidate) => candidate === event.currentTarget.value,
                    );
                    if (mode !== undefined) {
                      updateAnimation(item, { mode });
                    }
                  }}
                >
                  {animationModes.map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Cycles</span>
                <input
                  aria-label={`${short} animation cycles`}
                  type="text"
                  defaultValue={item.animation.cycles}
                  onBlur={(event) => {
                    updateAnimation(item, {
                      cycles: parseCycles(event.currentTarget.value),
                    });
                  }}
                />
              </label>
              <button
                type="button"
                className="animationRemove"
                onClick={() => {
                  editCommand({
                    ...item,
                    animation: undefined,
                    value:
                      item.animation?.property === "value"
                        ? item.animation.finish
                        : item.value,
                    rotation: undefined,
                  });
                }}
              >
                Use final value only
              </button>
            </div>
          )}
          {item.animations?.map((animation) => (
            <div
              className="parameterAnimation parameterAnimationTrack"
              key={`${item.id}-${animation.property}`}
            >
              <strong className="animationProperty">
                {getAnimationPropertyLabel(animation.property, itemDesc)}
              </strong>
              <label>
                <span>Start</span>
                <input
                  aria-label={`${short} ${animation.property} animation start`}
                  type="number"
                  value={animation.start}
                  onChange={(event) => {
                    updateAnimationTrack(item, animation.property, {
                      start: Number(event.currentTarget.value),
                    });
                  }}
                />
              </label>
              <label>
                <span>Finish</span>
                <input
                  aria-label={`${short} ${animation.property} animation finish`}
                  type="number"
                  value={animation.finish}
                  onChange={(event) => {
                    updateAnimationTrack(item, animation.property, {
                      finish: Number(event.currentTarget.value),
                    });
                  }}
                />
              </label>
              <label>
                <span>Time · ms</span>
                <input
                  aria-label={`${short} ${animation.property} animation time in milliseconds`}
                  min={1}
                  type="number"
                  value={animation.durationMs}
                  onChange={(event) => {
                    updateAnimationTrack(item, animation.property, {
                      durationMs: Math.max(
                        1,
                        Number(event.currentTarget.value),
                      ),
                    });
                  }}
                />
              </label>
              <label>
                <span>Motion</span>
                <select
                  aria-label={`${short} ${animation.property} animation type`}
                  value={animation.easing}
                  onChange={(event) => {
                    const easing = animationEasings.find(
                      (candidate) => candidate === event.currentTarget.value,
                    );
                    if (easing !== undefined) {
                      updateAnimationTrack(
                        item,
                        animation.property,
                        { easing },
                      );
                    }
                  }}
                >
                  {animationEasings.map((easing) => (
                    <option key={easing} value={easing}>{easing}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Cycle</span>
                <select
                  aria-label={`${short} ${animation.property} animation cycle mode`}
                  value={animation.mode}
                  onChange={(event) => {
                    const mode = animationModes.find(
                      (candidate) => candidate === event.currentTarget.value,
                    );
                    if (mode !== undefined) {
                      updateAnimationTrack(
                        item,
                        animation.property,
                        { mode },
                      );
                    }
                  }}
                >
                  {animationModes.map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Cycles</span>
                <input
                  aria-label={`${short} ${animation.property} animation cycles`}
                  type="text"
                  defaultValue={animation.cycles}
                  onBlur={(event) => {
                    updateAnimationTrack(item, animation.property, {
                      cycles: parseCycles(event.currentTarget.value),
                    });
                  }}
                />
              </label>
              <button
                type="button"
                className="animationRemove"
                onClick={() => {
                  removeAnimationTrack(item, animation);
                }}
              >
                Use final{" "}
                {getAnimationPropertyLabel(animation.property, itemDesc)}
              </button>
            </div>
          ))}
          <div className="animationSetups">
            {getAnimationProperties(item).map((property) => (
              <button
                type="button"
                className="animationSetup"
                key={`${item.id}-setup-${property}`}
                onClick={() => {
                  addAnimationTrack(item, property);
                }}
              >
                + Animate {getAnimationPropertyLabel(property, itemDesc)}
              </button>
            ))}
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

  const updateAnimation = (
    item: Readonly<ICommandModel>,
    update: Partial<ICommandAnimation>,
  ) => {
    const animation: ICommandAnimation = {
      cycles: 1,
      durationMs: 600,
      easing: "linear",
      finish: item.name === "cube" ? 360 : (item.value ?? 0),
      mode: "once",
      property: item.name === "cube" ? "rotation" : "value",
      start: 0,
      ...item.animation,
      ...update,
    };
    editCommand({
      ...item,
      animation,
      value:
        animation.property === "value"
          ? animation.finish
          : item.value,
      ...(animation.property === "rotation"
        ? { rotation: animation.finish }
        : {}),
    });
  };

  const updateAnimationTrack = (
    item: Readonly<ICommandModel>,
    property: ICommandAnimation["property"],
    update: Partial<ICommandAnimation>,
  ) => {
    const animations = (item.animations ?? []).map((animation) =>
      animation.property === property
        ? { ...animation, ...update }
        : animation,
    );
    const updated = animations.find(
      (animation) => animation.property === property,
    );
    if (updated === undefined) {
      return;
    }

    editCommand({
      ...item,
      animations,
      ...(property === "width"
        ? { value: updated.finish, width: updated.finish }
        : {}),
      ...(property === "height" ? { height: updated.finish } : {}),
      ...(property === "depth"
        ? { arg2: updated.finish, depth: updated.finish }
        : {}),
      ...(property === "value" ? { value: updated.finish } : {}),
      ...(property === "arg2" ? { arg2: updated.finish } : {}),
      ...(property === "rotation"
        ? { rotation: updated.finish }
        : {}),
    });
  };

  const addAnimationTrack = (
    item: Readonly<ICommandModel>,
    property: ICommandAnimation["property"],
  ) => {
    const currentValue = getAnimationPropertyValue(item, property);
    const animation: ICommandAnimation = {
      cycles: 1,
      durationMs: 600,
      easing: "linear",
      finish:
        property === "rotation" && currentValue === 0
          ? 360
          : currentValue,
      mode: "once",
      property,
      start: 0,
    };
    editCommand({
      ...item,
      animations: [...(item.animations ?? []), animation],
      ...(property === "width"
        ? { value: animation.finish, width: animation.finish }
        : {}),
      ...(property === "height" ? { height: animation.finish } : {}),
      ...(property === "depth"
        ? { arg2: animation.finish, depth: animation.finish }
        : {}),
      ...(property === "value" ? { value: animation.finish } : {}),
      ...(property === "arg2" ? { arg2: animation.finish } : {}),
      ...(property === "rotation"
        ? { rotation: animation.finish }
        : {}),
    });
  };

  const removeAnimationTrack = (
    item: Readonly<ICommandModel>,
    animation: Readonly<ICommandAnimation>,
  ) => {
    const animations = (item.animations ?? []).filter(
      ({ property }) => property !== animation.property,
    );
    editCommand({
      ...item,
      animations: animations.length === 0 ? undefined : animations,
    });
  };

  const parseCycles = (
    value: string,
  ): ICommandAnimation["cycles"] => {
    if (value.trim().toLowerCase() === "infinite") {
      return "infinite";
    }

    const cycles = Number(value);
    return Number.isSafeInteger(cycles) && cycles > 0 ? cycles : 1;
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
