import * as React from "react";
import { ICommandDescription } from "src/models";

interface IProps {
  description: ICommandDescription;
}

const CommandDescription: React.FC<IProps> = ({ description }) => {
  const fields: ReadonlyArray<readonly [string, string | number]> = [
    ["short", description.short],
    ["name", description.name],
    ["long", description.long],
    ["description", description.description],
    ["color", description.color],
    ["argCount", description.argCount],
  ];

  return (
    <div className="commandItem">
      <img
        src={`./images/commands/${description.image}`}
        alt={`${description.name} command`}
      />
      <div className="itemDesc">
        <div className="description">
          {fields.map(([key, value]) =>
            value === "" ? null : (
              <div
                key={key}
                style={{ background: key === "color" ? String(value) : "" }}
              >
                {`${key} : ${value}`}
              </div>
            ),
          )}
        </div>
        {description.args.length > 0 && (
          <div className="args">
            Function arguments:
            {description.args.map((argument) => (
              <div key={`${argument.name}-${argument.type}`}>
                Name: {argument.name} - type of {argument.type}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandDescription;
