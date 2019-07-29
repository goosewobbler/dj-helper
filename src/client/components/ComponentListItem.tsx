import * as React from 'react';

import ComponentState from '../../types/ComponentState';
import ComponentData from '../../types/ComponentData';
import ExternalLink from '../ui/ExternalLink';
import LoadingIcon from '../ui/icon/LoadingIcon';
import PauseIcon from '../ui/icon/PauseIcon';
import PlayIcon from '../ui/icon/PlayIcon';
import StarIcon from '../ui/icon/StarIcon';
import IconButton from './IconButton';

const createID = (componentName: string) => `component-list-item-${componentName}`;

interface IComponentListItemProps {
  component: ComponentData;
  selected: boolean;
  onClick?(): null;
  onToggleFavourite?(): null;
  onStart?(): null;
  onStop?(): null;
}

const renderFavouriteButton = (props: IComponentListItemProps) => {
  if (props.component.favorite) {
    return (
      <IconButton className="unfavorite-button" label="Unfavorite" onClick={() => props.onFavourite(props.name, false)}>
        <StarIcon starred />
      </IconButton>
    );
  }
  return (
    <IconButton className="favorite-button" label="Favorite" onClick={() => props.onFavourite(props.name, true)}>
      <StarIcon starred={false} />
    </IconButton>
  );
};

const renderLaunchButton = (component: ComponentData) => {
  const link = `${component.url}${
    Array.isArray(component.history) && component.history.length > 0 ? component.history[0] : ''
  }`;

  if (component.state === ComponentState.Running) {
    return (
      <ExternalLink className="launch-button" label="Launch" link={link} color="#2491c8" height="21" padding="0 4px" />
    );
  }
  return null;
};

const renderStartStopButton = (props: IComponentListItemProps, handleStart: () => void, handleStop: () => void) => {
  switch (props.state) {
    case ComponentState.Stopped:
      return (
        <IconButton className="start-button" label="Start" onClick={handleStart}>
          <PlayIcon />
        </IconButton>
      );
    case ComponentState.Installing:
      return (
        <IconButton label="Installing">
          <LoadingIcon />
        </IconButton>
      );
    case ComponentState.Building:
      return (
        <IconButton label="Building">
          <LoadingIcon />
        </IconButton>
      );
    case ComponentState.Linking:
      return (
        <IconButton label="Linking">
          <LoadingIcon />
        </IconButton>
      );
    case ComponentState.Starting:
      return (
        <IconButton label="Starting">
          <LoadingIcon />
        </IconButton>
      );
    case ComponentState.Running:
      return (
        <IconButton className="stop-button" label="Stop" onClick={handleStop}>
          <PauseIcon />
        </IconButton>
      );
  }
};

class ComponentListItem extends React.PureComponent<IComponentListItemProps> {
  public static displayName = 'ComponentListItem';

  private handleClick: () => void;
  private handleStart: () => void;
  private handleStop: () => void;

  constructor(props: IComponentListItemProps) {
    super(props);
    this.handleClick = () => this.props.onClick(this.props.name);
    this.handleStart = () => this.props.onStart(this.props.name);
    this.handleStop = () => this.props.onStop(this.props.name);
  }

  public shouldComponentUpdate(nextProps: IComponentListItemProps, nextState: {}, context: any) {
    if (
      this.props.name !== nextProps.name ||
      this.props.displayName !== nextProps.displayName ||
      this.props.highlighted !== nextProps.highlighted ||
      this.props.url !== nextProps.url ||
      this.props.favourite !== nextProps.favourite ||
      this.props.state !== nextProps.state ||
      this.props.selected !== nextProps.selected
    ) {
      return true;
    }
    return false;
  }

  public render() {
    const name: any =
      this.props.highlighted && this.props.highlighted.length > 0 ? this.props.highlighted : this.props.displayName;

    return (
      <div
        role="button"
        id={createID(this.props.name)}
        highlighted={this.props.selected}
        onClick={this.handleClick}
      >
        {renderFavouriteButton(this.props)}
        <span className="component-name-label">{name}</span>
        {renderLaunchButton(this.props.component)}
        {renderStartStopButton(this.props, this.handleStart, this.handleStop)}
      </div>
    );
  }
}

export default ComponentListItem;
