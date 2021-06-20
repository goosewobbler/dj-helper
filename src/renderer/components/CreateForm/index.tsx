import * as React from 'react';

import LabelButton from '../LabelButton';

const KEY_ENTER = 13;
const KEY_ESCAPE = 27;

const SelectInput = ({
  labelText,
  className = '',
  onChange,
  options,
}: {
  className?: string;
  labelText: string;
  options: { value: string; label: string }[];
  onChange(event: React.ChangeEvent): void;
}): React.ReactElement => (
  <div className="mx-0 my-2 text-xl">
    <label className="flex" htmlFor={className}>
      <span className="w-32">{labelText}</span>
      <select id={className} className={`flex-grow h-8 text-form-field-text ${className}`} onChange={onChange}>
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
  className = '',
  onChange,
  onKeyDown,
}: {
  className?: string;
  labelText: string;
  onChange(event: React.ChangeEvent): void;
  onKeyDown(event: React.KeyboardEvent): void;
}): React.ReactElement => (
  <div className="mx-0 my-2 text-xl">
    <label className="flex" htmlFor={className}>
      <span className="w-32">{labelText}</span>
      <input
        id={className}
        className={`flex-grow h-8 border-solid border text-form-field-text border-primary-text-30 ${className}`}
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </label>
  </div>
);

type CreateFormProps = {
  typeSelectEnabled: boolean;
  submitModule(name: string, description: string, type: string): void;
  onClose(): void;
};

const CreateForm = ({ typeSelectEnabled, submitModule, onClose }: CreateFormProps): React.ReactElement => {
  const [valid, setValid] = React.useState(false);
  const options = [
    { label: 'React with Grandstand and Sass', value: 'viewcss' },
    { label: 'React without Grandstand and Sass', value: 'view' },
    { label: 'Data Template', value: 'data' },
  ];
  let type = 'viewcss';
  let name = '';
  let description = '';

  const create = (): void => {
    submitModule(name, description, type);
  };

  const updateValid = (): void => {
    setValid(!!(name && description && type));
  };

  const handleNameChange = (event: React.BaseSyntheticEvent): void => {
    name = (event.target as HTMLInputElement).value;
    updateValid();
  };

  const handleDescriptionChange = (event: React.BaseSyntheticEvent): void => {
    description = (event.target as HTMLInputElement).value;
    updateValid();
  };

  const handleTypeChange = (event: React.BaseSyntheticEvent): void => {
    type = (event.target as HTMLSelectElement).value;
    updateValid();
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.keyCode === KEY_ENTER && valid) {
      create();
    } else if (event.keyCode === KEY_ESCAPE) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col">
      {typeSelectEnabled && (
        <SelectInput
          className="create-type-select"
          labelText="Type"
          options={options}
          onChange={(event): void => handleTypeChange(event)}
        />
      )}
      <TextInput
        labelText="Name"
        className="create-name-input"
        onChange={(event): void => handleNameChange(event)}
        onKeyDown={(event): void => handleKeyDown(event)}
      />
      <TextInput
        labelText="Description"
        className="create-description-input"
        onChange={(event): void => handleDescriptionChange(event)}
        onKeyDown={(event): void => handleKeyDown(event)}
      />
      <div className="mt-2 ml-auto">
        <LabelButton className="create-create-button" label="Create" disabled={!valid} onClick={(): void => create()} />
      </div>
    </div>
  );
};

export { CreateForm };
