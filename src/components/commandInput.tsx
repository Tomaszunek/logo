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
  const addCommand = useCommandStore((state) => state.addCommand);
  const timeoutRef = React.useRef<number | null>(null);
  const [input, setInput] = React.useState("");
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

    const parsedCommands = new Parser(value).parse(onError);
    if (parsedCommands.length === 0) {
      return;
    }

    const complexity = getCommandComplexity([...commands, ...parsedCommands]);
    if (complexity.exceedsLimit) {
      showError(
        `This program is too large to run safely. Keep it below ${MAX_COMMAND_OPERATIONS.toLocaleString()} command operations.`,
      );
      return;
    }

    parsedCommands.forEach(addCommand);
    setInput("");
    setShowPopup(false);
  };

  return (
    <div className="commandComposer">
      <div className="composerHeading">
        <div>
          <p className="eyebrow">Command line</p>
          <h2>Build your mark</h2>
        </div>
        <code>repeat 6 [fd 120 tr 60]</code>
      </div>
      <form className="commandForm" onSubmit={submitCommand}>
        <span className="commandPrompt" aria-hidden="true">
          &gt;
        </span>
        <label className="srOnly" htmlFor="command-input">
          Enter one or more Logo commands
        </label>
        <input
          id="command-input"
          className="commandInput"
          placeholder="Try: repeat 5 [fd 140 tr 144]"
          autoComplete="off"
          spellCheck={false}
          autoFocus={true}
          value={input}
          onChange={(event) => {
            setInput(event.currentTarget.value);
          }}
        />
        <button type="submit" className="button buttonPrimary runButton">
          Run
        </button>
      </form>
      <p className="inputHint">
        Chain commands with spaces. Colors accept hex values with or without #.
        Large repeat trees are stopped before they can freeze the browser.
      </p>
      {showPopup && <Popup massage={popupText} />}
    </div>
  );
};

export default CommandInput;
