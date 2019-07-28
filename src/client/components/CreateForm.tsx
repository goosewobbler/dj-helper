import * as React from 'react';

import Theme from '../../types/Theme';
import LabelButton from '../ui/LabelButton';

const KEY_ENTER = 13;
const KEY_ESCAPE = 27;

const SelectInput = (props: {
  className?: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  onChange(event: any): any;
}) => (
  <div>
    <label>{props.label}</label>
    <select className={props.className} onChange={props.onChange}>
      {props.options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const TextInput = (props: {
  className?: string;
  label: string;
  autoFocus: boolean;
  onChange(event: any): any;
  onKeyDown(event: any): any;
}) => (
  <div>
    <label>{props.label}</label>
    <input
      className={props.className}
      type="text"
      autoFocus={props.autoFocus}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
    />
  </InputContainingDiv>
);

interface ICreateFormProps {
  typeSelectEnabled: boolean;
  theme: ITheme;
  submitModule(name: string, description: string, type: string): any;
  onClose(): any;
}

interface ICreateFormState {
  valid: boolean;
}

class CreateForm extends React.Component<ICreateFormProps, ICreateFormState> {
  private name: string;
  private description: string;
  private type: string;

  constructor(props: ICreateFormProps) {
    super(props);

    this.type = 'viewcss';

    this.state = {
      valid: false,
    };
  }

  public render() {
    const options = [
      { label: 'React with Grandstand and Sass', value: 'viewcss' },
      { label: 'React without Grandstand and Sass', value: 'view' },
      { label: 'Data Template', value: 'data' },
    ];

    const typeSelect = this.props.typeSelectEnabled ? (
      <SelectInput
        theme={this.props.theme}
        className="create-type-select"
        label="Type"
        options={options}
        onChange={event => this.handleTypeChange(event)}
      />
    ) : null;

    return (
      <ContainingDiv>
        {typeSelect}
        <TextInput
          theme={this.props.theme}
          label="Name"
          className="create-name-input"
          autoFocus={true}
          onChange={event => this.handleNameChange(event)}
          onKeyDown={event => this.handleKeyDown(event)}
        />
        <TextInput
          theme={this.props.theme}
          label="Description"
          className="create-description-input"
          autoFocus={false}
          onChange={event => this.handleDescriptionChange(event)}
          onKeyDown={event => this.handleKeyDown(event)}
        />
        <CreateButtonDiv>
          <LabelButton
            theme={this.props.theme}
            className="create-create-button"
            label="Create"
            disabled={!this.state.valid}
            onClick={() => this.create()}
          />
        </CreateButtonDiv>
      </ContainingDiv>
    );
  }

  private create() {
    this.props.submitModule(this.name, this.description, this.type);
  }

  private updateValid() {
    this.setState({
      valid: Boolean(this.name && this.description && this.type),
    });
  }

  private handleNameChange(event: any) {
    this.name = event.target.value;
    this.updateValid();
  }

  private handleDescriptionChange(event: any) {
    this.description = event.target.value;
    this.updateValid();
  }

  private handleTypeChange(event: any) {
    this.type = event.target.value;
    this.updateValid();
  }

  private handleKeyDown(event: any) {
    if (event.keyCode === KEY_ENTER) {
      if (this.state.valid) {
        this.create();
      }
    } else if (event.keyCode === KEY_ESCAPE) {
      this.props.onClose();
    }
  }
}

export default CreateForm;
