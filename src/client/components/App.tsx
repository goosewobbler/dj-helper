import * as React from 'react';

// import ComponentDetailsContainer from '../containers/ComponentDetailsContainer';
// import ComponentListContainer from '../containers/ComponentListContainer';
// import ComponentListFilterContainer from '../containers/ComponentListFilterContainer';
// import UpdateBar from '../containers/UpdateBarContainer';
// import CreateForm from './CreateForm';
// import Dialog from './Dialog';
import ExternalLink from './ExternalLink';
import GitHubLink from './GitHubLink';
// import LabelButton from './LabelButton';

interface IAppProps {
  shouldShowCreateDialog: boolean;
  onCreate(): any;
  showCreateDialog(show: boolean): any;
  submitModule(name: string, description: string, type: string): any;
}

const App = (props: IAppProps) => (
  <div className="container">
    <div className="header">
      <h1 className="title">Morph Developer Console</h1>
      <div className="header-links">
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
      Weeeeeeeeeeeeee
    </div>
  </div>
);

export default App;
