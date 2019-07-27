import * as React from 'react';

import ComponentDetailsContainer from '../containers/ComponentDetailsContainer';
import ComponentListContainer from '../containers/ComponentListContainer';
import ComponentListFilterContainer from '../containers/ComponentListFilterContainer';
import UpdateBar from '../containers/UpdateBarContainer';
import CreateForm from './CreateForm';
import Dialog from './Dialog';
import ExternalLink from './ExternalLink';
import GitHubLink from './GitHubLink';
import LabelButton from './LabelButton';

interface IAppProps {
  shouldShowCreateDialog: boolean;
  //  onCreate(): any;
  showCreateDialog(show: boolean): any;
  submitModule(name: string, description: string, type: string): any;
}

const App = (props: IAppProps) => (
  <div className="container">
    <UpdateBar />
    <div className="header">
      <h1 className="title">Morph Developer Console</h1>
      <div className="header-links">
        <LabelButton
          className="create-button"
          label="Create"
          image="/image/icon/gel-icon-add.svg"
          onClick={() => props.showCreateDialog(true)}
        />
        <ExternalLink
          link="https://ci.sport.tools.bbc.co.uk/view/morph-module-pipeline/"
          label="INT Pipeline"
          black={true}
        />
        <ExternalLink
          link="https://ci.sport.tools.bbc.co.uk/view/morph-module-test-pipeline//"
          label="TEST Pipeline"
          black={true}
        />
        <ExternalLink
          link="https://ci.sport.tools.bbc.co.uk/view/morph-module-live-pipeline//"
          label="LIVE Pipeline"
          black={true}
        />
        <GitHubLink link="https://github.com/bbc/morph-developer-console" />
      </div>
    </div>
    <div className="content">
      <div className="section">
        <ComponentListFilterContainer />
        <ComponentListContainer />
      </div>
      <div className="section">
        <ComponentDetailsContainer />
      </div>
      {props.shouldShowCreateDialog ? (
        <Dialog title="Create a new Morph module" onClose={() => props.showCreateDialog(false)}>
          <CreateForm submitModule={props.submitModule} onClose={() => props.showCreateDialog(false)} />
        </Dialog>
      ) : null}
    </div>
  </div>
);

export default App;
