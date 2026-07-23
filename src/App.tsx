import * as React from "react";
import Canvas from "./components/canvas";
import CommandEditor from "./components/commandEditor";
import CommandList from "./components/commandList";
import CommandInput from "./components/commandInput";
import HelperLayer from "./components/helperLayer";
import TutorialPopup from "./components/tutorialPopup";
import Header from "./components/header";
import SkipLink from "./components/skipLink";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { CommandActions } from "./actions";
import { CommandModel } from "./models";
import { IRootState, CommandState } from "./reducers";
import { commandDescriptions } from "./data/commandDescriptions";
import { pathwayExamples } from "./data/pathwayExamples";
import { tutorialPages } from "./data/tutorialPages";
import { omit } from "./utils";
import "./App.css";
import "./vis-001.css";

interface IAppState {
  showHelper: boolean;
  activePanel: "tips" | "examples";
}

const FILTER_VALUES = (
  Object.keys(CommandModel.Filter) as (keyof typeof CommandModel.Filter)[]
).map((key) => CommandModel.Filter[key]);

export namespace App {
  export interface IProps extends RouteComponentProps<void> {
    commands: CommandState;
    descriptions: CommandDescriptionState;
    pathwayExample: PathwayExample;
    tutorialPages: TutorialPages;
    actions: CommandActions;
    filter: CommandModel.Filter;
  }
}

// Map state and dispatch to props
const mapStateToProps = (
  state: IRootState,
  ownProps: any,
): Pick<
  App.IProps,
  "commands" | "descriptions" | "pathwayExample" | "tutorialPages" | "filter"
> => {
  const hash = ownProps.location && ownProps.location.hash.replace("#", "");
  const filter =
    FILTER_VALUES.find((value) => value === hash) ||
    CommandModel.Filter.SHOW_ALL;
  return {
    commands: state.commands,
    descriptions: state.descriptions,
    pathwayExample: state.pathwayExample,
    tutorialPages: state.tutorialPages,
    filter,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
): Pick<App.IProps, "actions"> => ({
  actions: bindActionCreators(omit(CommandActions, "Type"), dispatch),
});

const App: React.FC<App.IProps> = (props) => {
  const [showHelper, setShowHelper] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState<"tips" | "examples">("tips");

  const handleShowHelper = (panel: "tips" | "examples") => {
    setShowHelper(true);
    setActivePanel(panel);
  };

  const { descriptions, commands, pathwayExample, tutorialPages, actions } = props;

  return (
    <main id="main" className="App">
      <SkipLink />
      <Header onShowHelper={handleShowHelper} />
      <div className="appMain">
        {showHelper && activePanel === "examples" && (
          <HelperLayer
            visible={true}
            panel="examples"
            onClose={() => setShowHelper(false)}
            examplePaths={pathwayExample}
            descriptions={descriptions}
            actions={actions}
          />
        )}
        {showHelper && activePanel === "tips" && (
          <TutorialPopup tutorialPages={tutorialPages} />
        )}
        <div className="editorContainer">
          <section className="editorLine">
            <CommandEditor commands={commands} actions={actions} />
            <CommandInput
              commands={commands}
              actions={actions}
              descriptions={descriptions}
            />
            <Canvas commands={commands} actions={actions} />
          </section>
          <aside className="commandListLine">
            <CommandList
              commands={commands}
              descriptions={descriptions}
              actions={actions}
            />
          </aside>
        </div>
      </div>
      <footer className="appFooter">© 2026 Logo Playground</footer>
    </main>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
