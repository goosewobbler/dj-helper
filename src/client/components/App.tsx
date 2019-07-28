import * as React from 'react';

import Theme from '../../types/Theme';
import ComponentDetailsContainer from '../containers/ComponentDetailsContainer';
import ComponentListContainer from '../containers/ComponentListContainer';
import ComponentListFilterContainer from '../containers/ComponentListFilterContainer';
import UpdateBar from '../containers/UpdateBarContainer';
import AppContainer from '../ui/AppContainer';
import HeaderLinks from '../ui/HeaderLinks';
import AddIcon from '../ui/icon/AddIcon';
import LabelButton from '../ui/LabelButton';
import CreateForm from './CreateForm';
import Dialog from './Dialog';
import GitHubLink from './GitHubLink';

interface IAppProps {
  shouldShowCreateDialog: boolean;
  cloningName: string;
  theme: Theme;
  onCreate(): any;
  showCreateDialog(show: boolean): any;
  hideCloneDialog(): any;
  cloneComponent(name: string, cloneName: string, description: string): any;
  submitModule(name: string, description: string, type: string): any;
}

const renderHeader = (props: IAppProps) => [
  <h1 key="title">
    Morph Developer Console
  </h1>,
  <HeaderLinks key="links">
    <LabelButton
      theme={props.theme}
      className="create-button"
      label="Create"
      image={<AddIcon colour={props.theme.primaryTextColour} />}
      onClick={() => props.showCreateDialog(true)}
    />
    <GitHubLink theme={props.theme} link="https://github.com/bbc/morph-developer-console" />
  </HeaderLinks>,
];

const renderCreateDialog = (props: IAppProps) =>
  props.shouldShowCreateDialog ? (
    <Dialog theme={props.theme} title="Create a new Morph module" onClose={() => props.showCreateDialog(false)}>
      <CreateForm
        typeSelectEnabled={true}
        theme={props.theme}
        submitModule={props.submitModule}
        onClose={() => props.showCreateDialog(false)}
      />
    </Dialog>
  ) : null;

const renderCloneDialog = (props: IAppProps) =>
  props.cloningName ? (
    <Dialog
      theme={props.theme}
      title={`Clone ${props.cloningName.replace('bbc-morph-', '')}`}
      onClose={() => props.hideCloneDialog()}
    >
      <CreateForm
        typeSelectEnabled={false}
        theme={props.theme}
        submitModule={(name: string, description: string) => props.cloneComponent(props.cloningName, name, description)}
        onClose={() => props.hideCloneDialog()}
      />
    </Dialog>
  ) : null;

const App = (props: IAppProps) => (
  <AppContainer
    theme={props.theme}
    banner={<UpdateBar />}
    header={renderHeader(props)}
    leftPanel={[<ComponentListFilterContainer key="filter" />, <ComponentListContainer key="list" />]}
    rightPanel={<ComponentDetailsContainer />}
    dialog={renderCreateDialog(props) || renderCloneDialog(props)}
  />
);

export default App;
