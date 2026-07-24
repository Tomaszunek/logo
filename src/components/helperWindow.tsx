import * as React from "react";
import { ICommandDescription, IPathwayExample } from "src/models";
import PathwayExample from "./templates/pathwayExample";
import CommandDescription from "./templates/CommandDescription";

interface IProps {
  examplePaths: ReadonlyArray<IPathwayExample>;
  descriptions: Readonly<Record<string, ICommandDescription>>;
  itemStyle: React.CSSProperties;
  site: string;
}

const HelperWindow: React.FC<IProps> = ({
  examplePaths,
  descriptions,
  itemStyle,
  site,
}) => {
  const displayAll = () => {
    const groups: Record<string, IPathwayExample[]> = {};

    examplePaths.forEach((item) => {
      const list = groups[item.type];
      if (list) {
        list.push(item);
      } else {
        groups[item.type] = [item];
      }
    });

    return Object.entries(groups).map(([type, examples]) => (
      <div key={type}>
        <div className={`commandType ${type}`}>
          {" "}
          {displayExample(examples)}{" "}
        </div>
      </div>
    ));
  };

  const displayExample = (examples: ReadonlyArray<IPathwayExample>) =>
    examples.map((example) => (
      <PathwayExample
        key={example.name}
        examplePath={example}
      />
    ));

  const displayCommands = () => {
    const renderedTypesL: React.ReactNode[] = [];
    const renderedTypesR: React.ReactNode[] = [];
    let index = 0;

    for (const i in descriptions) {
      if (descriptions[i]) {
        if (index % 2 === 0) {
          renderedTypesL.push(
            <CommandDescription key={i} description={descriptions[i]} />,
          );
        } else {
          renderedTypesR.push(
            <CommandDescription key={i} description={descriptions[i]} />,
          );
        }
        index++;
      }
    }

    return (
      <div className="commandsList">
        <div className="commandsLeft">{renderedTypesL}</div>
        <div className="commandsRight">{renderedTypesR}</div>
      </div>
    );
  };

  return (
    <div style={itemStyle} className={`helperWindow ${site}`}>
      {" "}
      {site === "right" ? displayAll() : displayCommands()}{" "}
    </div>
  );
};

export default HelperWindow;
