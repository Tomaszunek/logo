import * as React from 'react';
import { ICommandModel, ICommandDescription } from 'src/models';
// actions removed; use Zustand store instead

import { Parser } from 'src/utils/parser';
import Popup from './popup';
import { ErrorHandler } from 'src/utils/errorHandler';

interface IProps {
  text?: string | null;
  commands: Array<ICommandModel>;
  actions: any; // use actions from Zustand store
  descriptions: Readonly<Record<string,ICommandDescription>>;
}

const CommandInput: React.FC<IProps> = ({ text, commands, actions, descriptions }) => {
  const timeoutRef = React.useRef<number | null>(null);

  // Cleanup any pending error popup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupText, setPopupText] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onError = (insideCommand: string, wrongCommand: string) => {
    const errorHandler = new ErrorHandler(
      {
        fullCommand: inputRef.current ? inputRef.current.value : '',
        insideCommand,
        wrongCommand
      },
      descriptions
    ).handleError();

    setShowPopup(true);
    setPopupText(errorHandler);

    // Clear any existing timer before setting a new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setShowPopup(false);
      setPopupText(errorHandler);
      timeoutRef.current = null;
    }, 5000);
  };

  const togglePopup = () => setShowPopup(prev => !prev);

  const onInputChange = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const parser = new Parser((e.target as HTMLInputElement).value.trim()).parse(onError);
      if (parser && parser.length > 0) {
        for (const item of parser) {
          actions.addCommand(item);
        }
        if (!inputRef.current) return;
        inputRef.current.value = '';
      } else {
        // no valid commands
      }
    }
  };

  return (
    <>
      <input
        className="commandInput"
        placeholder="Enter a command"
        aria-label="Command input"
        autoFocus={true}
        ref={inputRef}
        onKeyPress={onInputChange}
      />
      {showPopup && (
        <Popup massage={popupText} closePopup={togglePopup} />
      )}
    </>
  );
};

export default CommandInput;
