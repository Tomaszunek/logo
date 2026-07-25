import * as React from "react";
import type { ICommandDescription, IPathwayExample } from "src/models";
import PathwayExample from "./templates/pathwayExample";
import CommandDescription from "./templates/CommandDescription";

interface IProps {
  examplePaths: readonly IPathwayExample[];
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
    const groups: Partial<Record<string, IPathwayExample[]>> = {};

    examplePaths.forEach((item) => {
      const list = groups[item.type];
      if (list) {
        list.push(item);
      } else {
        groups[item.type] = [item];
      }
    });

    return Object.entries(groups).map(([type, examples]) => {
      if (examples === undefined) {
        return null;
      }

      return (
        <div key={type}>
          <div className={`commandType ${type}`}>
            {" "}
            {displayExample(examples)}{" "}
          </div>
        </div>
      );
    });
  };

   const displayExample = (examples: readonly IPathwayExample[]) =>
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

    for (const [key, description] of Object.entries(descriptions)) {
      if (index % 2 === 0) {
        renderedTypesL.push(
          <CommandDescription key={key} description={description} />,
        );
      } else {
        renderedTypesR.push(
          <CommandDescription key={key} description={description} />,
        );
      }
      index += 1;
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
