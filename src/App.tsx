import * as React from "react";
import Canvas from "./components/canvas";
import CommandEditor from "./components/commandEditor";
import CommandList from "./components/commandList";
import CommandInput from "./components/commandInput";
import HelperLayer from "./components/helperLayer";
import TutorialPopup from "./components/tutorialPopup";
import Header from "./components/header";
import { RouteComponentProps } from "react-router";
import SkipLink from "./components/skipLink";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { CommandActions } from "./actions";
import { CommandModel } from "./models";
import { IRootState, RootState } from "./reducers";
import { omit } from "./utils";
import "./App.css";

interface IAppState {
  showHelper: boolean;
  activePanel: 'tips' | 'examples';
}


const FILTER_VALUES = (
  Object.keys(CommandModel.Filter) as (keyof typeof CommandModel.Filter)[]
).map((key) => CommandModel.Filter[key]);

export namespace App {
  export interface IProps extends RouteComponentProps<void> {
    commands: RootState.CommandState;
    descriptions: RootState.CommandDescriptionState;
    pathwayExample: RootState.PathwayExample;
    tutorialPages: RootState.TutorialPages;
    actions: CommandActions;
    filter: CommandModel.Filter;
  }
}

@connect(
  (
    state: IRootState,
    ownProps,
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
      pathwayExample: state.pathwayexpample,
      tutorialPages: state.tutorialPages,
      filter,
    };
  },
  (dispatch: Dispatch): Pick<App.IProps, "actions"> => ({
    actions: bindActionCreators(omit(CommandActions, "Type"), dispatch),
  }),
)
export default class App extends React.Component<App.IProps, IAppState> {
  constructor(props: App.IProps) {
    super(props);
    this.state = { showHelper: false, activePanel: 'tips' };
    // Bind event handler for header buttons
    this.handleShowHelper = this.handleShowHelper.bind(this);
  }

  handleShowHelper(panel: 'tips' | 'examples') {
    this.setState({ showHelper: true, activePanel: panel });
  }

  public render() {
    const { descriptions, commands, pathwayExample, tutorialPages, actions } =
      this.props;
    return (
      <main id="main" className="App">
        <SkipLink />
        <Header onShowHelper={this.handleShowHelper} />
        <div className="appMain">
          {this.state.showHelper && this.state.activePanel === 'examples' && (
            <HelperLayer
              visible={true}
              panel="right"
              onClose={() => this.setState({ showHelper: false })}
              examplePaths={pathwayExample}
              descriptions={descriptions}
              actions={actions}
            />
          )}
          {this.state.showHelper && this.state.activePanel === 'tips' && (
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
        </div>     {/* close appMain */}
        <footer className="appFooter">© 2026 Logo Playground</footer>
      </main>
    );
  }
}
