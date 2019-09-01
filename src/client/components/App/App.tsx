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
import Spacer from '../Spacer';

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
      <div className="flex flex-col flex-grow">
        {outOfDate && <UpdateBar />}
        <div className="header flex items-center flex-shrink-0 p-3 justify-between shadow-md border-b">
          <h1 key="title">Morph Developer Console</h1>
          <div key="links" className="flex flex-shrink-0 height h-10 mr-4">
            <LabelButton
              className="create-button flex items-center justify-center flex-shrink-0 bg-transparent rounded p-8 text-sm"
              label="Create"
              image={<CreateIcon />}
              onClick={(): void => showDialog('create')}
            />
            <Spacer />
            <GitHubLink link="https://github.com/bbc/morph-developer-console" />
          </div>
        </div>
        <Spacer />
        <div className="content flex flex-grow">
          <div className="section flex flex-col flex-grow-0 flex-shrink-0 p-2 overflow-hidden flex-basis-30">
            <ComponentListFilterContainer key="filter" />
            <ComponentListContainer key="list" />
          </div>
          <div className="section flex flex-col flex-grow-0 flex-shrink-0 p-2 overflow-hidden flex-basis-70">
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
