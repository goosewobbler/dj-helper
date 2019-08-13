import * as React from 'react';

const renderSearchButton = (): React.ReactElement => (
  <button type="button" className="search-btn" key="search-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
      <path d="M32 28.5l-8.2-8.2c3.4-5.1 2.9-12-1.6-16.4C19.7 1.3 16.3 0 13 0 9.7 0 6.3 1.3 3.8 3.8c-5.1 5.1-5.1 13.3 0 18.4C6.3 24.7 9.7 26 13 26c2.5 0 5.1-.7 7.3-2.2l8.2 8.2 3.5-3.5zM6.6 19.4C4.9 17.7 4 15.4 4 13s.9-4.7 2.6-6.4C8.3 4.9 10.6 4 13 4c2.4 0 4.7.9 6.4 2.6 3.5 3.5 3.5 9.2 0 12.7-1.7 1.7-4 2.6-6.4 2.6s-4.7-.8-6.4-2.5z" />
    </svg>
  </button>
);

const renderClearButton = (onClick: () => void): React.ReactElement => (
  <button type="button" className="clear-btn" key="clear-button" onClick={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
      <path d="M32 3.5L28.5 0 16 12.5 3.5 0 0 3.5 12.5 16 0 28.5 3.5 32 16 19.5 28.5 32l3.5-3.5L19.5 16z" />
    </svg>
  </button>
);

interface ComponentListFilterProps {
  onInput(filter: string): null;
}

interface ComponentListFilterState {
  filter: string;
  focussed: boolean;
}

class ComponentListFilter extends React.Component<ComponentListFilterProps, ComponentListFilterState> {
  constructor(props: ComponentListFilterProps) {
    super(props);
    this.state = {
      filter: '',
      focussed: false,
    };
  }

  private onFocussed(focussed: boolean): void {
    this.setState({
      focussed,
    });
  }

  private onInput({ target: { value } }: { target: { value: string } }): void {
    const { onInput } = this.props;
    this.setState({
      filter: value,
    });
    onInput(value);
  }

  private onKeyDown({ keyCode }: React.KeyboardEvent<HTMLInputElement>): void {
    if (keyCode === 27) {
      this.clearSearchInput();
    }
  }

  private clearSearchInput(): void {
    const { onInput } = this.props;
    this.setState({
      filter: '',
    });
    onInput('');
  }

  private renderIcon(): React.ReactElement {
    const { filter } = this.state;
    return filter.length > 0 ? renderClearButton((): void => this.clearSearchInput()) : renderSearchButton();
  }

  public render(): React.ReactElement {
    const { filter } = this.state;
    return (
      <div>
        <input
          value={filter}
          id="search-input"
          placeholder="Search"
          onKeyDown={(event): void => this.onKeyDown(event)}
          onFocus={(): void => this.onFocussed(true)}
          onBlur={(): void => this.onFocussed(false)}
          onChange={(event): void => this.onInput(event)}
        />
        {this.renderIcon()}
      </div>
    );
  }
}

export default ComponentListFilter;
