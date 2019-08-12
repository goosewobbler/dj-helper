import * as React from 'react';

import LabelButton from '../LabelButton';

const KEY_ENTER = 13;
const KEY_ESCAPE = 27;

const SelectInput = (props: {
  className?: string;
  label: string;
  options: { value: string; label: string }[];
  onChange(event: any): any;
}): React.ReactElement => (
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

const TextInput = ({
  label,
  className,
  autoFocus,
  onChange,
  onKeyDown,
}: {
  className?: string;
  label: string;
  autoFocus: boolean;
  onChange(event: any): any;
  onKeyDown(event: any): any;
}): React.ReactElement => (
  <div>
    <label>{label}</label>
    <input className={className} type="text" autoFocus={autoFocus} onChange={onChange} onKeyDown={onKeyDown} />
  </div>
);

interface CreateFormProps {
  typeSelectEnabled: boolean;
  submitModule(name: string, description: string, type: string): any;
  onClose(): any;
}

interface CreateFormState {
  valid: boolean;
}

class CreateForm extends React.Component<CreateFormProps, CreateFormState> {
  private name: string;

  private description: string;

  private type: string;

  constructor(props: CreateFormProps) {
    super(props);

    this.type = 'viewcss';

    this.state = {
      valid: false,
    };
  }

  public render(): React.ReactElement {
    const options = [
      { label: 'React with Grandstand and Sass', value: 'viewcss' },
      { label: 'React without Grandstand and Sass', value: 'view' },
      { label: 'Data Template', value: 'data' },
    ];

    const typeSelect = this.props.typeSelectEnabled ? (
      <SelectInput
        className="create-type-select"
        label="Type"
        options={options}
        onChange={event => this.handleTypeChange(event)}
      />
    ) : null;

    return (
      <div>
        {typeSelect}
        <TextInput
          label="Name"
          className="create-name-input"
          autoFocus
          onChange={event => this.handleNameChange(event)}
          onKeyDown={event => this.handleKeyDown(event)}
        />
        <TextInput
          label="Description"
          className="create-description-input"
          autoFocus={false}
          onChange={event => this.handleDescriptionChange(event)}
          onKeyDown={event => this.handleKeyDown(event)}
        />
        <div>
          <LabelButton
            className="create-create-button"
            label="Create"
            disabled={!this.state.valid}
            onClick={() => this.create()}
          />
        </div>
      </div>
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
    const { onClose } = this.props;
    if (event.keyCode === KEY_ENTER) {
      const { valid } = this.state;
      if (valid) {
        this.create();
      }
    } else if (event.keyCode === KEY_ESCAPE) {
      onClose();
    }
  }
}

export default CreateForm;
