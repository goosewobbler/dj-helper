import * as React from 'react';

import LabelButton from '../LabelButton';

const KEY_ENTER = 13;
const KEY_ESCAPE = 27;

const SelectInput = ({
  label,
  className,
  onChange,
  options,
}: {
  className?: string;
  label: string;
  options: { value: string; label: string }[];
  onChange(event: any): void;
}): React.ReactElement => (
  <div>
    <label htmlFor={className}>
      {label}
      <select id={className} className={className} onChange={onChange}>
        {options.map(
          (option): React.ReactElement => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ),
        )}
      </select>
    </label>
  </div>
);

const TextInput = ({
  labelText,
  className,
  onChange,
  onKeyDown,
}: {
  className?: string;
  labelText: string;
  onChange(event: any): void;
  onKeyDown(event: any): void;
}): React.ReactElement => (
  <div>
    <label htmlFor={className}>
      {labelText}
      <input id={className} className={className} type="text" onChange={onChange} onKeyDown={onKeyDown} />
    </label>
  </div>
);

interface CreateFormProps {
  typeSelectEnabled: boolean;
  submitModule(name: string, description: string, type: string): void;
  onClose(): void;
}

interface CreateFormState {
  valid: boolean;
}

class CreateForm extends React.Component<CreateFormProps, CreateFormState> {
  private name: string;

  private description: string;

  private type: string;

  public constructor(props: CreateFormProps) {
    super(props);

    this.type = 'viewcss';

    this.state = {
      valid: false,
    };
  }

  private create(): void {
    const { submitModule } = this.props;
    submitModule(this.name, this.description, this.type);
  }

  private updateValid(): void {
    this.setState({
      valid: Boolean(this.name && this.description && this.type),
    });
  }

  private handleNameChange(event: any): void {
    this.name = event.target.value;
    this.updateValid();
  }

  private handleDescriptionChange(event: any): void {
    this.description = event.target.value;
    this.updateValid();
  }

  private handleTypeChange(event: any): void {
    this.type = event.target.value;
    this.updateValid();
  }

  private handleKeyDown(event: React.KeyboardEvent): void {
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

  public render(): React.ReactElement {
    const options = [
      { label: 'React with Grandstand and Sass', value: 'viewcss' },
      { label: 'React without Grandstand and Sass', value: 'view' },
      { label: 'Data Template', value: 'data' },
    ];
    const { typeSelectEnabled } = this.props;
    const { valid } = this.state;

    return (
      <div>
        {typeSelectEnabled && (
          <SelectInput
            className="create-type-select"
            label="Type"
            options={options}
            onChange={(event): void => this.handleTypeChange(event)}
          />
        )}
        <TextInput
          labelText="Name"
          className="create-name-input"
          onChange={(event): void => this.handleNameChange(event)}
          onKeyDown={(event): void => this.handleKeyDown(event)}
        />
        <TextInput
          labelText="Description"
          className="create-description-input"
          onChange={(event): void => this.handleDescriptionChange(event)}
          onKeyDown={(event): void => this.handleKeyDown(event)}
        />
        <div>
          <LabelButton
            className="create-create-button"
            label="Create"
            disabled={!valid}
            onClick={(): void => this.create()}
          />
        </div>
      </div>
    );
  }
}

export default CreateForm;
