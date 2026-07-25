import * as React from "react";
import type { ICommandDescription, IPathwayExample } from "src/models";
import { exampleCollections } from "src/data/pathwayExamples";
import PathwayExample from "./templates/pathwayExample";
import CommandDescription from "./templates/CommandDescription";

interface IProps {
  examplePaths: readonly IPathwayExample[];
  descriptions: Readonly<Record<string, ICommandDescription>>;
  itemStyle: React.CSSProperties;
  site: string;
  onSelect: () => void;
}

const HelperWindow: React.FC<IProps> = ({
  examplePaths,
  descriptions,
  itemStyle,
  site,
  onSelect,
}) => {
  const [activeCollection, setActiveCollection] = React.useState<
    IPathwayExample["type"] | "all"
  >("all");

  const displayAll = () => {
    const visibleCollections =
      activeCollection === "all"
        ? exampleCollections
        : exampleCollections.filter(
            (collection) => collection.id === activeCollection,
          );

    return (
      <>
        <nav className="exampleFilters" aria-label="Example collections">
          <button
            type="button"
            className={activeCollection === "all" ? "active" : ""}
            aria-pressed={activeCollection === "all"}
            onClick={() => {
              setActiveCollection("all");
            }}
          >
            All <span>{examplePaths.length}</span>
          </button>
          {exampleCollections.map((collection) => (
            <button
              type="button"
              key={collection.id}
              className={activeCollection === collection.id ? "active" : ""}
              aria-pressed={activeCollection === collection.id}
              onClick={() => {
                setActiveCollection(collection.id);
              }}
            >
              {collection.label}{" "}
              <span>
                {
                  examplePaths.filter(
                    (examplePath) => examplePath.type === collection.id,
                  ).length
                }
              </span>
            </button>
          ))}
        </nav>
        <div className="exampleCollections">
          {visibleCollections.map((collection) => {
            const examples = examplePaths.filter(
              (examplePath) => examplePath.type === collection.id,
            );
            return (
              <section key={collection.id} className="exampleGroup">
                <div className="exampleGroupHeading">
                  <h3>{collection.label}</h3>
                  <p>{collection.description}</p>
                </div>
                <div className={`commandType ${collection.id}`}>
                  {displayExample(examples)}
                </div>
              </section>
            );
          })}
        </div>
      </>
    );
  };

   const displayExample = (examples: readonly IPathwayExample[]) =>
    examples.map((example) => (
      <PathwayExample
        key={example.name}
        examplePath={example}
        onSelect={onSelect}
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
      {site === "right" ? displayAll() : displayCommands()}
    </div>
  );
};

export default HelperWindow;
