import * as React from 'react';
import ExternalLink from '../../ExternalLink';
import { LoadingIcon } from '../../LoadingIcon';
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

const getBackgroundColor = (state: ComponentState): string => {
  switch (state) {
    case ComponentState.Linking:
    case ComponentState.Starting:
      return 'bg-component-starting';
    case ComponentState.Installing:
      return 'bg-component-installing';
    case ComponentState.Building:
      return 'bg-component-building';
    case ComponentState.Running:
      return 'bg-component-running';
    default:
      break;
  }
  return 'bg-secondary-background';
};

const renderFavouriteButton = ({
  component: { favourite, name },
  onFavourite,
}: ComponentListItemProps): React.ReactElement => {
  if (favourite) {
    return (
      <IconButton className="unfavourite-button" label="Unfavourite" onClick={(): void => onFavourite!(name, false)}>
        <StarIcon starred />
      </IconButton>
    );
  }
  return (
    <IconButton className="favourite-button" label="Favourite" onClick={(): void => onFavourite!(name, true)}>
      <StarIcon starred={false} />
    </IconButton>
  );
};

const renderLaunchButton = (component: ComponentData): React.ReactElement | null => {
  const link = `${component.url}${
    Array.isArray(component.history) && component.history.length > 0 ? component.history[0] : ''
  }`;

  if (component.state === ComponentState.Running) {
    return (
      <ExternalLink
        className="launch-button"
        label="Launch"
        link={link}
        backgroundColor="component-launch"
        height="h-5"
        padding="py-0 px-1"
        textColor="secondary-text"
      />
    );
  }
  return null;
};

const renderStartStopButton = (
  { component: { state } }: ComponentListItemProps,
  handleStart: () => void,
  handleStop: () => void,
): React.ReactElement | null => {
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

class ComponentListItem extends React.Component<ComponentListItemProps> {
  private handleClick: () => void;

  private handleStart: () => void;

  private handleStop: () => void;

  public static displayName: string;

  public constructor(props: ComponentListItemProps) {
    super(props);
    const {
      component: { name },
      onClick,
      onStart,
      onStop,
    } = this.props;
    this.handleClick = (): void => onClick!(name);
    this.handleStart = (): void => onStart!(name);
    this.handleStop = (): void => onStop!(name);
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
    const { highlighted, displayName, name, state } = component;
    const labelText: React.ReactElement[] | string = highlighted && highlighted.length > 0 ? highlighted : displayName;
    const backgroundColor = getBackgroundColor(state);

    let borderColor = 'border-selected-item-border';
    let boxShadow = 'shadow';

    if (selected) {
      borderColor = 'border-selected-item-border-10';
      boxShadow = 'component-focus-shadow';
    }

    return (
      <div
        className={`border outline-none ${boxShadow} border-solid ${borderColor} flex items-center h-10 p-2 mb-2 overflow-hidden text-lg cursor-pointer text-primary-text component-dependency ${backgroundColor}`}
        role="button"
        id={createID(name)}
        onClick={this.handleClick}
        tabIndex={0}
        onKeyPress={(): void => {}}
      >
        {renderFavouriteButton(this.props)}
        <Spacer />
        <span className="mr-auto truncate component-name-label">{labelText}</span>
        <Spacer />
        {renderLaunchButton(component)}
        <Spacer />
        {renderStartStopButton(this.props, this.handleStart, this.handleStop)}
      </div>
    );
  }
}

ComponentListItem.displayName = 'ComponentListItem';

export { ComponentListItem, ComponentListItemProps };
