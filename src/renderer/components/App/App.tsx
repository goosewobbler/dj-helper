import React, { ReactElement } from 'react';
import ComponentDetailsContainer from '../ComponentDetails';
import ComponentListContainer from '../ComponentList';
import ComponentListFilterContainer from '../ComponentListFilter';
import CreateIcon from '../CreateIcon';
import LabelButton from '../LabelButton';
import CreateForm from '../CreateForm';
import Dialog from '../Dialog';
import GitHubLink from '../GithubLink';
import { AppContextProvider, AppContext } from '../../contexts/appContext';
import Spacer from '../Spacer';

interface AppProps {
  componentPort: number;
  showCreateDialog: boolean;
  showCloneDialog: boolean;
  componentToClone: string;
  showDialog(name: string): void;
  hideDialog(): void;
  cloneComponent(name: string, description: string, sourceComponent: string): void;
  createComponent(name: string, description: string, type: string): void;
}

const renderCreateDialog = ({ hideDialog, createComponent }: AppProps): ReactElement => {
  const submitModule = (name: string, description: string, type: string): void =>
    createComponent(name, description, type);
  return (
    <Dialog title="Create a new Morph module" onClose={hideDialog}>
      <CreateForm typeSelectEnabled submitModule={submitModule} onClose={hideDialog} />
    </Dialog>
  );
};

const renderCloneDialog = ({ hideDialog, cloneComponent, componentToClone }: AppProps): ReactElement => {
  const title = `Clone ${componentToClone.replace('bbc-morph-', '')}`;
  const submitModule = (name: string, description: string): void => cloneComponent(componentToClone, name, description);
  return (
    <Dialog title={title} onClose={hideDialog}>
      <CreateForm typeSelectEnabled={false} submitModule={submitModule} onClose={hideDialog} />
    </Dialog>
  );
};

const App = (props: AppProps): ReactElement => {
  const { showDialog, showCreateDialog, showCloneDialog, componentPort } = props;
  const appContextValue: AppContext = { componentPort };

  return (
    <AppContextProvider value={appContextValue}>
      <div className="flex flex-col flex-grow bg-primary-background">
        <div className="flex items-center justify-between flex-shrink-0 p-3 border-b shadow-md header bg-header-5">
          <h1 className="text-3xl text-primary-text" key="title">
            Morph Developer Console
          </h1>
          <div key="links" className="flex flex-shrink-0 h-10 mr-4 height">
            <LabelButton
              className="create-button"
              label="Create"
              image={<CreateIcon />}
              onClick={(): void => showDialog('create')}
            />
            <Spacer />
            <GitHubLink link="https://github.com/bbc/morph-developer-console" />
          </div>
        </div>
        <Spacer />
        <div className="flex flex-grow content">
          <div className="flex flex-col flex-grow-0 flex-shrink-0 w-1/3 p-2 section">
            <ComponentListFilterContainer key="filter" />
            <ComponentListContainer key="list" />
          </div>
          <div className="flex flex-col flex-grow flex-shrink-0 w-2/3 p-2 section">
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
