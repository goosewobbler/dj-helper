import * as React from 'react';
import { useSelector } from 'react-redux';
import ExternalLink from '../../ExternalLink';
import { LoadingIcon } from '../../LoadingIcon';
import PauseIcon from '../PauseIcon';
import PlayIcon from '../PlayIcon';
import StarIcon from '../StarIcon';
import IconButton from '../IconButton';
import { ComponentData, ComponentState, AppState } from '../../../../common/types';
import Spacer from '../../Spacer';

const createID = (componentName: string): string => `component-list-item-${componentName}`;

type ComponentListItemProps = {
  componentName: string;
  style: React.CSSProperties;
  selected: boolean;
  onFavourite(name: string, favourite: boolean): void;
  onClick(name: string): void;
  onStart(name: string): void;
  onStop(name: string): void;
};

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

const renderFavouriteButton = (
  favourite: ComponentData['favourite'],
  handleClickFavourite: () => void,
  handleClickUnfavourite: () => void,
): React.ReactElement => {
  if (favourite) {
    return (
      <IconButton className="unfavourite-button" label="Unfavourite" onClick={handleClickUnfavourite}>
        <StarIcon starred />
      </IconButton>
    );
  }
  return (
    <IconButton className="favourite-button" label="Favourite" onClick={handleClickFavourite}>
      <StarIcon starred={false} />
    </IconButton>
  );
};

const renderLaunchButton = ({ url = '', state, history }: ComponentData): React.ReactElement | null => {
  const link = `${url}${history?.length ? history[0] : ''}`;

  if (state === ComponentState.Running) {
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
  state: ComponentData['state'],
  handleClickStart: () => void,
  handleClickStop: () => void,
): React.ReactElement | null => {
  switch (state) {
    case ComponentState.Stopped:
      return (
        <IconButton className="start-button" label="Start" onClick={handleClickStart}>
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
        <IconButton className="stop-button" label="Stop" onClick={handleClickStop}>
          <PauseIcon />
        </IconButton>
      );
    default:
      return null;
  }
};

const getComponentFromList = (components: ComponentData[], componentName: string): ComponentData => {
  return components.find((component: ComponentData) => component.name === componentName) as ComponentData;
};

const ComponentListItem = ({
  componentName,
  style,
  selected,
  onClick,
  onStart,
  onStop,
  onFavourite,
}: ComponentListItemProps): React.ReactElement => {
  const component = useSelector((state: AppState) => getComponentFromList(state.components, componentName));
  const { highlighted, displayName, name, state, favourite } = component;
  const labelText: React.ReactElement[] | string = highlighted && highlighted.length > 0 ? highlighted : displayName;
  const backgroundColor = getBackgroundColor(state);

  let borderColor = 'border-selected-item-border';
  let boxShadow = 'shadow';

  if (selected) {
    borderColor = 'border-selected-item-border-10';
    boxShadow = 'component-focus-shadow';
  }

  const handleClick = (): void => onClick(name);
  const handleClickStart = (): void => onStart(name);
  const handleClickStop = (): void => onStop(name);
  const handleClickFavourite = (): void => onFavourite(name, true);
  const handleClickUnfavourite = (): void => onFavourite(name, false);

  const id = createID(name);

  return (
    <div
      className={`border outline-none ${boxShadow} border-solid ${borderColor} flex items-center h-10 p-2 mb-2 overflow-hidden text-lg cursor-pointer text-primary-text component-dependency ${backgroundColor}`}
      role="button"
      id={id}
      key={id}
      onClick={handleClick}
      tabIndex={0}
      onKeyPress={(): void => {}}
      style={style}
    >
      {renderFavouriteButton(favourite, handleClickFavourite, handleClickUnfavourite)}
      <Spacer />
      <span className="mr-auto truncate component-name-label">{labelText}</span>
      <Spacer />
      {renderLaunchButton(component)}
      <Spacer />
      {renderStartStopButton(state, handleClickStart, handleClickStop)}
    </div>
  );
};

export { ComponentListItem, ComponentListItemProps };
