import * as React from 'react';

interface IUpdateBarProps {
  outOfDate: boolean;
  updating: boolean;
  updated: boolean;
  onUpdate(): any;
}

const getMessage = (props: IUpdateBarProps) => {
  if (props.updating) {
    return 'Updating  😟';
  } else if (props.updated) {
    return 'Morph Developer Console updated sucessfully  🎉  Restart to apply updates.';
  }
  return [
    <span key="update-message-1">There is an update available for the Morph Developer Console. See </span>,
    <a
      key="update-message-link"
      target="_blank"
      href="https://github.com/bbc/morph-developer-console/blob/master/docs/whats-new.md"
    >
      what's new
    </a>,
    <span key="update-message-2">. 👀</span>,
  ];
};

const renderButton = (props: IUpdateBarProps) => {
  if (props.updating) {
    return <img src="/image/icon/gel-icon-loading-white.svg" />;
  } else if (props.updated) {
    return null;
  }
  return (
    <button className="update-button" onClick={props.onUpdate}>
      Update
    </button>
  );
};

const UpdateBar = (props: IUpdateBarProps) =>
  props.outOfDate ? (
    <div className="update-bar">
      <h1 className="update-header">{getMessage(props)}</h1>
      {renderButton(props)}
    </div>
  ) : null;

export default UpdateBar;
