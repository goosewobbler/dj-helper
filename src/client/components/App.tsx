import * as React from 'react';

import ComponentDetailsContainer from '../containers/ComponentDetailsContainer';
import ComponentListContainer from '../containers/ComponentListContainer';
import ComponentListFilterContainer from '../containers/ComponentListFilterContainer';
import UpdateBar from '../containers/UpdateBarContainer';
import AppContainer from '../ui/AppContainer';
import AddIcon from '../ui/icon/AddIcon';
import LabelButton from '../ui/LabelButton';
import CreateForm from './CreateForm';
import Dialog from './Dialog';
import GitHubLink from './GitHubLink';

interface AppProps {
  shouldShowCreateDialog: boolean;
  cloningName: string;
  onCreate(): any;
  showCreateDialog(show: boolean): any;
  hideCloneDialog(): any;
  cloneComponent(name: string, cloneName: string, description: string): any;
  submitModule(name: string, description: string, type: string): any;
}

const renderHeader = (props: AppProps) => [
  <h1 key="title">Morph Developer Console</h1>,
  <div key="links">
    <LabelButton
      className="create-button"
      label="Create"
      image={<AddIcon />}
      onClick={() => props.showCreateDialog(true)}
    />
    <GitHubLink link="https://github.com/bbc/morph-developer-console" />
  </div>,
];

const renderCreateDialog = (props: AppProps) =>
  props.shouldShowCreateDialog ? (
    <Dialog title="Create a new Morph module" onClose={() => props.showCreateDialog(false)}>
      <CreateForm typeSelectEnabled submitModule={props.submitModule} onClose={() => props.showCreateDialog(false)} />
    </Dialog>
  ) : null;

const renderCloneDialog = (props: AppProps) =>
  props.cloningName ? (
    <Dialog title={`Clone ${props.cloningName.replace('bbc-morph-', '')}`} onClose={() => props.hideCloneDialog()}>
      <CreateForm
        typeSelectEnabled={false}
        submitModule={(name: string, description: string) => props.cloneComponent(props.cloningName, name, description)}
        onClose={() => props.hideCloneDialog()}
      />
    </Dialog>
  ) : null;

const App = (props: AppProps) => (
  <AppContainer
    banner={<UpdateBar />}
    header={renderHeader(props)}
    leftPanel={[<ComponentListFilterContainer key="filter" />, <ComponentListContainer key="list" />]}
    rightPanel={<ComponentDetailsContainer />}
    dialog={renderCreateDialog(props) || renderCloneDialog(props)}
  />
);

export default App;
