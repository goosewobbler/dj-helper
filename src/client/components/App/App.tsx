import * as React from 'react';

import ComponentDetailsContainer from '../ComponentDetails';
import ComponentListContainer from '../ComponentList';
import ComponentListFilterContainer from '../ComponentListFilter';
import UpdateBar from '../UpdateBar';
import CreateIcon from '../CreateIcon';
import LabelButton from '../LabelButton';
import CreateForm from '../CreateForm';
import Dialog from '../Dialog';
import GitHubLink from '../GithubLink';

interface AppProps {
  outOfDate: boolean;
  shouldShowCreateDialog: boolean;
  cloningName: string;
  onCreate(): any;
  showCreateDialog(show: boolean): any;
  hideCloneDialog(): any;
  cloneComponent(name: string, cloneName: string, description: string): any;
  submitModule(name: string, description: string, type: string): any;
}

const renderCreateDialog = (props: AppProps) => (
  <Dialog title="Create a new Morph module" onClose={() => props.showCreateDialog(false)}>
    <CreateForm typeSelectEnabled submitModule={props.submitModule} onClose={() => props.showCreateDialog(false)} />
  </Dialog>
);

const renderCloneDialog = (props: AppProps) => (
  <Dialog title={`Clone ${props.cloningName.replace('bbc-morph-', '')}`} onClose={() => props.hideCloneDialog()}>
    <CreateForm
      typeSelectEnabled={false}
      submitModule={(name: string, description: string) => props.cloneComponent(props.cloningName, name, description)}
      onClose={() => props.hideCloneDialog()}
    />
  </Dialog>
);

const App = (props: AppProps) => {
  const { outOfDate, showCreateDialog, shouldShowCreateDialog, cloningName } = props;

  return (
    <div>
      {outOfDate && <UpdateBar />}
      <div className="header">
        <h1 key="title">Morph Developer Console</h1>
        <div key="links">
          <LabelButton
            className="create-button"
            label="Create"
            image={<CreateIcon />}
            onClick={() => showCreateDialog(true)}
          />
          <GitHubLink link="https://github.com/bbc/morph-developer-console" />
        </div>
      </div>
      <div className="content">
        <div className="section">
          <ComponentListFilterContainer key="filter" />
          <ComponentListContainer key="list" />
        </div>
        <div className="section">
          <ComponentDetailsContainer />
        </div>
        {shouldShowCreateDialog && renderCreateDialog(props)}
        {cloningName && renderCloneDialog(props)}
      </div>
    </div>
  );
};

export default App;
