import * as React from 'react';

import ExternalLink from '../../ExternalLink';
import LoadingIcon from '../../LoadingIcon';
import PauseIcon from './PauseIcon';
import PlayIcon from './PlayIcon';
import StarIcon from './StarIcon';
import IconButton from './IconButton';

import { ComponentData, ComponentState } from '../../../../common/types';

const createID = (componentName: string): string => `component-list-item-${componentName}`;

interface ComponentListItemProps {
  component: ComponentData;
  selected: boolean;
  name: string;
  highlighted: string;
  displayName: string;
  url: string;
  favourite: string;
  state: ComponentState;
  onFavourite?(name: string, favourite: boolean): () => void;
  onClick?(name: string): void;
  onToggleFavourite?(): void;
  onStart?(name: string): () => void;
  onStop?(name: string): () => void;
}

const renderFavouriteButton = ({
  component: { favourite },
  onFavourite,
  name,
}: ComponentListItemProps): React.ReactElement => {
  if (favourite) {
    return (
      <IconButton className="unfavourite-button" label="Unfavourite" onClick={(): Function => onFavourite(name, false)}>
        <StarIcon starred />
      </IconButton>
    );
  }
  return (
    <IconButton className="favourite-button" label="Favourite" onClick={(): Function => onFavourite(name, true)}>
      <StarIcon starred={false} />
    </IconButton>
  );
};

const renderLaunchButton = (component: ComponentData): React.ReactElement => {
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

const renderStartStopButton = (
  { state }: ComponentListItemProps,
  handleStart: () => void,
  handleStop: () => void,
): React.ReactElement => {
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
    default:
      return null;
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
    this.handleClick = (): void => onClick(name);
    this.handleStart = (): Function => onStart(name);
    this.handleStop = (): Function => onStop(name);
  }

  public shouldComponentUpdate(nextProps: ComponentListItemProps): boolean {
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

  public render(): React.ReactElement {
    const { highlighted, displayName, selected, component } = this.props;
    const name: string = highlighted && highlighted.length > 0 ? highlighted : displayName;

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
