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
  showCreateDialog: boolean;
  showCloneDialog: boolean;
  componentToClone: string;
  onCreate(): () => void;
  showDialog(name: string): () => void;
  hideDialog(name: string): () => void;
  cloneComponent(name: string, cloneName: string, description: string): () => void;
  submitModule(name: string, description: string, type: string): () => void;
}

const renderCreateDialog = ({ hideDialog, submitModule }: AppProps): React.ReactElement => (
  <Dialog title="Create a new Morph module" onClose={() => hideDialog('create')}>
    <CreateForm typeSelectEnabled submitModule={submitModule} onClose={() => hideDialog('create')} />
  </Dialog>
);

const renderCloneDialog = ({ hideDialog, cloneComponent, componentToClone }: AppProps): React.ReactElement => (
  <Dialog title={`Clone ${componentToClone.replace('bbc-morph-', '')}`} onClose={() => hideDialog('clone')}>
    <CreateForm
      typeSelectEnabled={false}
      submitModule={(name: string, description: string) => cloneComponent(componentToClone, name, description)}
      onClose={() => hideDialog('clone')}
    />
  </Dialog>
);

const App = (props: AppProps): React.ReactElement => {
  const { outOfDate, showDialog, showCreateDialog, showCloneDialog } = props;

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
            onClick={() => showDialog('create')}
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
        {showCreateDialog && renderCreateDialog(props)}
        {showCloneDialog && renderCloneDialog(props)}
      </div>
    </div>
  );
};

export default App;
