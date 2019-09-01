import React, { ReactElement } from 'react';
import ComponentDetailsContainer from '../ComponentDetails';
import ComponentListContainer from '../ComponentList';
import ComponentListFilterContainer from '../ComponentListFilter';
import UpdateBar from '../UpdateBar';
import CreateIcon from '../CreateIcon';
import LabelButton from '../LabelButton';
import CreateForm from '../CreateForm';
import Dialog from '../Dialog';
import GitHubLink from '../GithubLink';
import { setApiPort } from '../../helpers/apiPortHelper';
import { AppContextProvider, AppContext } from '../../contexts/appContext';

interface AppProps {
  apiPort: number;
  outOfDate: boolean;
  showCreateDialog: boolean;
  showCloneDialog: boolean;
  componentToClone: string;
  showDialog(name: string): void;
  hideDialog(name: string): void;
  cloneComponent(name: string, description: string, sourceComponent: string): void;
  createComponent(name: string, description: string, type: string): void;
}

const renderCreateDialog = ({ hideDialog, createComponent }: AppProps): ReactElement => {
  const onClose = (): void => hideDialog('create');
  const submitModule = (name: string, description: string, type: string): void =>
    createComponent(name, description, type);
  return (
    <Dialog title="Create a new Morph module" onClose={onClose}>
      <CreateForm typeSelectEnabled submitModule={submitModule} onClose={onClose} />
    </Dialog>
  );
};

const renderCloneDialog = ({ hideDialog, cloneComponent, componentToClone }: AppProps): ReactElement => {
  const title = `Clone ${componentToClone.replace('bbc-morph-', '')}`;
  const onClose = (): void => hideDialog('clone');
  const submitModule = (name: string, description: string): void => cloneComponent(componentToClone, name, description);
  return (
    <Dialog title={title} onClose={onClose}>
      <CreateForm typeSelectEnabled={false} submitModule={submitModule} onClose={onClose} />
    </Dialog>
  );
};

const App = (props: AppProps): ReactElement => {
  const { outOfDate, showDialog, showCreateDialog, showCloneDialog, apiPort } = props;
  const appContextValue: AppContext = { apiPort };

  // TODO: remove hacky singleton and try to do this in a more elegant way - after CSS & Hooks reworks
  setApiPort(apiPort);

  return (
    <AppContextProvider value={appContextValue}>
      <div>
        {outOfDate && <UpdateBar />}
        <div className="header">
          <h1 key="title">Morph Developer Console</h1>
          <div key="links">
            <LabelButton
              className="create-button"
              label="Create"
              image={<CreateIcon />}
              onClick={(): void => showDialog('create')}
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
    </AppContextProvider>
  );
};

export default App;
