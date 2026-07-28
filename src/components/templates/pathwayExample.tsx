import * as React from "react";
import type { IPathwayExample } from "src/models";
import { useCommandStore } from "src/store/commandStore";
import { getCommandComplexity } from "src/utils/commandComplexity";

const getCommandNames = (
  command: Readonly<IPathwayExample["command"]>,
): readonly string[] => {
  const names = new Set<string>();
  const visit = (current: Readonly<IPathwayExample["command"]>) => {
    names.add(current.name);
    current.commands?.forEach(visit);
  };
  visit(command);
  return [...names].filter((name) => name !== "repeat");
};

const PathwayExample: React.FC<IProps> = ({ examplePath, onSelect }) => {
  const replaceCommands = useCommandStore((state) => state.replaceCommands);
  const defineProcedures = useCommandStore(
    (state) => state.defineProcedures,
  );
  const { animationFocus, name, image, performanceFocus, procedures, type } =
    examplePath;
  const entryPoint =
    procedures[procedures.length - 1]?.name ?? name;
  const commandNames = getCommandNames(examplePath.command);
  const operationCount = getCommandComplexity([examplePath.command]).operations;
  const setCommands = () => {
    const { command } = examplePath;
    defineProcedures(procedures);
    replaceCommands([command]);
    onSelect();
  };
  return (
    <button
      type="button"
      className="pathexample"
      onClick={setCommands}
      aria-label={`Load ${name} ${type} example`}
    >
      <p>{name}</p>
      <img
        src={`./images/examples/${image}`}
        alt={`${name} Logo drawing preview`}
      />
      <span className="exampleTags" aria-label="Commands demonstrated">
        {animationFocus !== undefined && (
          <>
            <code className="motionBadge">LIVE</code>
            <code className="motionBadge">{animationFocus}</code>
          </>
        )}
        {performanceFocus !== undefined && (
          <>
            <code className="performanceBadge">
              {operationCount.toLocaleString()} ops
            </code>
            <code className="performanceBadge">
              {performanceFocus}
            </code>
          </>
        )}
        {commandNames.slice(0, 5).map((commandName) => (
          <code key={commandName}>{commandName}</code>
        ))}
        {commandNames.length > 5 && <code>+{commandNames.length - 5}</code>}
      </span>
      <p className="path procedureEntryPoint">
        <span aria-hidden="true">ƒ</span>
        {entryPoint}
      </p>
    </button>
  );
};

export default PathwayExample;

interface IProps {
  examplePath: IPathwayExample;
  onSelect: () => void;
}
