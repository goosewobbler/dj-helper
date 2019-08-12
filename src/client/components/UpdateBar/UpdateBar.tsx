import * as React from 'react';

import LoadingIcon from '../LoadingIcon';

interface UpdateBarProps {
  updating: boolean;
  updated: boolean;
  onUpdate(): () => void;
}

const renderUpdateMessage = (messageText: React.ReactElement): React.ReactElement => {
  return (
    <React.Fragment>
      <span key="update-message-1">{messageText}</span>
    </React.Fragment>
  );
};

const renderUpdateButton = (onUpdate: () => void): React.ReactElement => (
  <button type="button" className="update-button" onClick={onUpdate}>
    Update
  </button>
);

const renderLoadingSpan = (): React.ReactElement => (
  <span className="loading">
    <LoadingIcon />
  </span>
);

const renderUpdateLink = (): React.ReactElement => (
  <React.Fragment>
    <a
      key="update-message-link"
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/bbc/morph-developer-console/blob/master/docs/whats-new.md"
    >
      what&apos;s new
    </a>
    <span key="update-message-2">
      .
      <span className="update-emoji" role="img" aria-label="eyes">
        👀
      </span>
    </span>
  </React.Fragment>
);

const UpdateBar = ({ updating, updated, onUpdate }: UpdateBarProps): React.ReactElement => {
  let messageText = <React.Fragment>There is an update available for the Morph Developer Console. See </React.Fragment>;

  if (updating) {
    messageText = (
      <React.Fragment>
        Updating
        <span className="update-emoji" role="img" aria-label="anguished face">
          😟
        </span>
      </React.Fragment>
    );
  }
  if (updated) {
    messageText = (
      <React.Fragment>
        Morph Developer Console updated sucessfully
        <span className="update-emoji" role="img" aria-label="hooray">
          🎉
        </span>
        Restart to apply updates.
      </React.Fragment>
    );
  }

  return (
    <div className="update-bar">
      <h1 className="update-header">
        {renderUpdateMessage(messageText)}
        {!updating && !updated && renderUpdateLink()}
      </h1>
      {updating && renderLoadingSpan()}
      {!updated && renderUpdateButton(onUpdate)}
    </div>
  );
};

export default UpdateBar;
