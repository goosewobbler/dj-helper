import * as React from 'react';

import ComponentState from '../../types/ComponentState';
import ComponentData from '../../types/IComponentData';
import ExternalLink from './ExternalLink';
import IconButton from './IconButton';

const createID = (componentName: string) => `component-list-item-${componentName}`;

const backgroundColorForState = (state: ComponentState) => {
  switch (state) {
    case ComponentState.Linking:
    case ComponentState.Starting:
      return 'orange';
    case ComponentState.Installing:
      return 'rgb(255, 90, 90)';
    case ComponentState.Building:
      return '#cb75ff';
    case ComponentState.Running:
      return '#baecff';
    default:
      break;
  }
  return 'white';
};

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
      <IconButton
        className="unfavorite-button"
        label="Unfavorite"
        image="/image/icon/favourited.svg"
        onClick={() => props.onToggleFavourite()}
      />
    );
  }
  return (
    <IconButton
      className="favorite-button"
      label="Favorite"
      image="/image/icon/unfavourited.svg"
      onClick={() => props.onToggleFavourite()}
    />
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

const renderStartStopButton = (props: IComponentListItemProps) => {
  switch (props.component.state) {
    case ComponentState.Stopped:
      return (
        <IconButton
          className="start-button"
          label="Start"
          image="/image/icon/gel-icon-play.svg"
          onClick={props.onStart}
        />
      );
    case ComponentState.Installing:
      return <IconButton label="Installing" loading />;
    case ComponentState.Building:
      return <IconButton label="Building" loading />;
    case ComponentState.Linking:
      return <IconButton label="Linking" loading />;
    case ComponentState.Starting:
      return <IconButton label="Starting" loading />;
    case ComponentState.Running:
      return (
        <IconButton
          className="stop-button"
          label="Stop"
          image="/image/icon/gel-icon-pause.svg"
          onClick={props.onStop}
        />
      );
  }
};

class ComponentListItem extends React.PureComponent<IComponentListItemProps> {
  public shouldComponentUpdate(nextProps: IComponentListItemProps) {
    if (this.props.component !== nextProps.component) {
      return true;
    }
    if (this.props.selected !== nextProps.selected) {
      return true;
    }
    return false;
  }

  public render() {
    const name: string =
      this.props.component.highlighted && this.props.component.highlighted.length > 0
        ? this.props.component.highlighted
        : this.props.component.displayName;

    return (
      <div role="button" id={createID(this.props.component.name)}>
        {renderFavouriteButton(this.props)}
        <span className="component-name-label">{name}</span>
        {renderLaunchButton(this.props.component)}
        {renderStartStopButton(this.props)}
      </div>
    );
  }
}

export default ComponentListItem;
