import * as React from 'react';

import ExternalLink from '../../ExternalLink';
import LoadingIcon from '../../LoadingIcon';
import PauseIcon from './PauseIcon';
import PlayIcon from './PlayIcon';
import StarIcon from './StarIcon';
import IconButton from './IconButton';

import { ComponentData, ComponentState } from '../../../../common/types';

const createID = (componentName: string) => `component-list-item-${componentName}`;

interface ComponentListItemProps {
  component: ComponentData;
  selected: boolean;
  onClick?(): null;
  onToggleFavourite?(): null;
  onStart?(): null;
  onStop?(): null;
  name: string;
  onFavourite?(name: string): null;
  state: ComponentState;
}

const renderFavouriteButton = ({
  component: { favourite },
  onFavourite,
  name,
}: ComponentListItemProps): React.ReactElement => {
  if (favourite) {
    return (
      <IconButton className="unfavourite-button" label="Unfavourite" onClick={() => onFavourite(name, false)}>
        <StarIcon starred />
      </IconButton>
    );
  }
  return (
    <IconButton className="favourite-button" label="Favourite" onClick={() => onFavourite(name, true)}>
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

const renderStartStopButton = ({ state }: ComponentListItemProps, handleStart: () => void, handleStop: () => void) => {
  switch (state) {
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

class ComponentListItem extends React.PureComponent<ComponentListItemProps> {
  public static displayName = 'ComponentListItem';

  private handleClick: () => void;

  private handleStart: () => void;

  private handleStop: () => void;

  public constructor(props: ComponentListItemProps) {
    super(props);
    const { name, onClick, onStart, onStop } = this.props;
    this.handleClick = () => onClick(name);
    this.handleStart = () => onStart(name);
    this.handleStop = () => onStop(name);
  }

  public shouldComponentUpdate(nextProps: ComponentListItemProps, nextState: {}, context: any) {
    const { name, displayName, highlighted, url, favourite, state, selected } = this.props;
    if (
      name !== nextProps.name ||
      displayName !== nextProps.displayName ||
      highlighted !== nextProps.highlighted ||
      url !== nextProps.url ||
      favourite !== nextProps.favourite ||
      state !== nextProps.state ||
      selected !== nextProps.selected
    ) {
      return true;
    }
    return false;
  }

  public render() {
    const { highlighted, displayName, selected, name, component } = this.props;
    const name: any = highlighted && highlighted.length > 0 ? highlighted : displayName;

    return (
      <div role="button" id={createID(name)} highlighted={selected} onClick={this.handleClick}>
        {renderFavouriteButton(this.props)}
        <span className="component-name-label">{name}</span>
        {renderLaunchButton(component)}
        {renderStartStopButton(this.props, this.handleStart, this.handleStop)}
      </div>
    );
  }
}

export { ComponentListItem, ComponentListItemProps };
