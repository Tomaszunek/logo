import * as React from "react";
import type { ICommandDescription } from "src/models";
import { useCommandStore } from "src/store/commandStore";
import {
  getCommandComplexity,
  MAX_COMMAND_OPERATIONS,
} from "src/utils/commandComplexity";
import { ErrorHandler } from "src/utils/errorHandler";
import { Parser } from "src/utils/parser";
import Popup from "./popup";

interface IProps {
  descriptions: Readonly<Record<string, ICommandDescription>>;
}

const CommandInput: React.FC<IProps> = ({ descriptions }) => {
  const commands = useCommandStore((state) => state.commands);
  const procedures = useCommandStore((state) => state.procedures);
  const addCommand = useCommandStore((state) => state.addCommand);
  const defineProcedures = useCommandStore(
    (state) => state.defineProcedures,
  );
  const deleteProcedure = useCommandStore(
    (state) => state.deleteProcedure,
  );
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const timeoutRef = React.useRef<number | null>(null);
  const [input, setInput] = React.useState("");
  const [showProcedures, setShowProcedures] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupText, setPopupText] = React.useState("");

  React.useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const showError = (message: string) => {
    setShowPopup(true);
    setPopupText(message);
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setShowPopup(false);
      timeoutRef.current = null;
    }, 5000);
  };

  const onError = (insideCommand: string, parsedCommand: string) => {
    showError(new ErrorHandler(
      {
        fullCommand: input,
        insideCommand,
        wrongCommand: parsedCommand,
      },
      descriptions,
    ).handleError());
  };

  const submitCommand = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (value === "") {
      return;
    }

    const parsedProgram = new Parser(value, procedures).parseProgram(onError);
    if (
      parsedProgram.commands.length === 0 &&
      parsedProgram.procedures.length === 0
    ) {
      return;
    }

    const complexity = getCommandComplexity([
      ...commands,
      ...parsedProgram.commands,
    ]);
    if (complexity.exceedsLimit) {
      showError(
        `This program is too large to run safely. Keep it below ${MAX_COMMAND_OPERATIONS.toLocaleString()} command operations.`,
      );
      return;
    }

    defineProcedures(parsedProgram.procedures);
    parsedProgram.commands.forEach(addCommand);
    setInput("");
    setShowPopup(false);
  };

  const editProcedure = (name: string) => {
    const procedure = procedures.find(
      (candidate) => candidate.name === name,
    );
    if (procedure === undefined) {
      return;
    }

    const parameters = procedure.parameters
      .map((parameter) => ` :${parameter}`)
      .join("");
    setInput(
      `to ${procedure.name}${parameters}\n  ${procedure.body}\nend`,
    );
    inputRef.current?.focus();
  };

  return (
    <div className="commandComposer">
      <div className="composerHeading">
        <div>
          <p className="eyebrow">Command line</p>
          <h2>Build your mark</h2>
        </div>
        <code>to square :size … end</code>
      </div>
      <form className="commandForm" onSubmit={submitCommand}>
        <span className="commandPrompt" aria-hidden="true">
          &gt;
        </span>
        <label className="srOnly" htmlFor="command-input">
          Enter one or more Logo commands
        </label>
        <textarea
          ref={inputRef}
          id="command-input"
          className="commandInput"
          placeholder={"Try: repeat 5 [fd 140 tr 144]\nOr define: to square :size … end"}
          autoComplete="off"
          spellCheck={false}
          autoFocus={true}
          rows={3}
          value={input}
          onChange={(event) => {
            setInput(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button type="submit" className="button buttonPrimary runButton">
          Run
        </button>
      </form>
      <p className="inputHint">
        Define a procedure with <code>to name :parameter</code>, write its
        commands, then finish with <code>end</code>. Run with the button or
        Ctrl+Enter.
      </p>
      <section
        className="procedureLibrary"
        aria-labelledby="procedure-library-title"
      >
        <div className="procedureLibraryHeader">
          <div>
            <p className="eyebrow">Reusable code</p>
            <h3 id="procedure-library-title">Defined procedures</h3>
          </div>
          <div className="procedureLibraryControls">
            <span className="commandCount">
              {procedures.length}
            </span>
            <button
              type="button"
              className="procedureToggle"
              aria-controls="procedure-library-content"
              aria-expanded={showProcedures}
              onClick={() => {
                setShowProcedures((visible) => !visible);
              }}
            >
              {showProcedures ? "Hide" : "Show"}
              <span aria-hidden="true">
                {showProcedures ? " ↑" : " ↓"}
              </span>
            </button>
          </div>
        </div>
        {showProcedures ? (
          <div id="procedure-library-content">
            {procedures.length === 0 ? (
              <p className="procedureLibraryEmpty">
                No procedures defined yet. Create one with{" "}
                <code>to name … end</code>.
              </p>
            ) : (
              <ul className="procedureList">
                {procedures.map((procedure) => (
                  <li className="procedureCard" key={procedure.name}>
                    <div className="procedureCardHeader">
                      <code className="procedureSignature">
                        {procedure.name}
                        {procedure.parameters.map(
                          (parameter) => ` :${parameter}`,
                        )}
                      </code>
                      <div className="procedureActions">
                        <button
                          type="button"
                          onClick={() => {
                            editProcedure(procedure.name);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="procedureDelete"
                          aria-label={`Delete ${procedure.name} procedure`}
                          onClick={() => {
                            deleteProcedure(procedure.name);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <pre className="procedureBody">
                      <code>{procedure.body}</code>
                    </pre>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </section>
      {showPopup && <Popup massage={popupText} />}
    </div>
  );
};

export default CommandInput;
