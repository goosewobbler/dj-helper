import * as React from 'react';
import ExternalLink from '../../ExternalLink';
import LoadingIcon from '../../LoadingIcon';
import PauseIcon from './PauseIcon';
import PlayIcon from './PlayIcon';
import StarIcon from './StarIcon';
import IconButton from './IconButton';
import { ComponentData, ComponentState } from '../../../../common/types';
import Spacer from '../../Spacer';

const createID = (componentName: string): string => `component-list-item-${componentName}`;

interface ComponentListItemProps {
  component: ComponentData;
  selected: boolean;
  onFavourite?(name: string, favourite: boolean): void;
  onClick?(name: string): void;
  onToggleFavourite?(): void;
  onStart?(name: string): void;
  onStop?(name: string): void;
}

const renderFavouriteButton = ({
  component: { favourite, name },
  onFavourite,
}: ComponentListItemProps): React.ReactElement => {
  if (favourite) {
    return (
      <IconButton className="unfavourite-button" label="Unfavourite" onClick={(): void => onFavourite(name, false)}>
        <StarIcon starred />
      </IconButton>
    );
  }
  return (
    <IconButton className="favourite-button" label="Favourite" onClick={(): void => onFavourite(name, true)}>
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
  { component: { state } }: ComponentListItemProps,
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
    const {
      component: { name },
      onClick,
      onStart,
      onStop,
    } = this.props;
    this.handleClick = (): void => onClick(name);
    this.handleStart = (): void => onStart(name);
    this.handleStop = (): void => onStop(name);
  }

  public shouldComponentUpdate(nextProps: ComponentListItemProps): boolean {
    const { component, selected } = this.props;
    const { highlighted, displayName, name, url, favourite, state } = component;
    if (
      // TODO: sort out this piece of shit
      name !== nextProps.component.name ||
      displayName !== nextProps.component.displayName ||
      highlighted !== nextProps.component.highlighted ||
      url !== nextProps.component.url ||
      favourite !== nextProps.component.favourite ||
      state !== nextProps.component.state ||
      selected !== nextProps.selected
    ) {
      return true;
    }
    return false;
  }

  public render(): React.ReactElement {
    const { selected, component } = this.props;
    const { highlighted, displayName, name } = component;
    const labelText: React.ReactElement[] | string = highlighted && highlighted.length > 0 ? highlighted : displayName;

    return (
      <div role="button" id={createID(name)} onClick={this.handleClick}>
        {renderFavouriteButton(this.props)}
        <Spacer />
        <span className="component-name-label">{labelText}</span>
        <Spacer />
        {renderLaunchButton(component)}
        <Spacer />
        {renderStartStopButton(this.props, this.handleStart, this.handleStop)}
      </div>
    );
  }
}

export { ComponentListItem, ComponentListItemProps };
