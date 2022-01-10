import React from 'react';
import classNames from 'classnames';
import { Switch as UISwitch } from '@headlessui/react';

export const Switch = ({
  id,
  isOn,
  text,
  handleToggle,
}: {
  id: string;
  text: string;
  isOn: boolean;
  handleToggle: () => void;
}) => (
  <UISwitch.Group id={id} as="div" className="flex items-center mt-1 mb-2">
    <UISwitch
      checked={isOn}
      onChange={handleToggle}
      className={classNames(
        isOn ? 'bg-indigo-600' : 'bg-gray-200',
        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none',
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          isOn ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200',
        )}
      />
    </UISwitch>
    <UISwitch.Label as="span" className="ml-3">
      <span className="text-sm font-medium text-gray-900">{text}</span>
    </UISwitch.Label>
  </UISwitch.Group>
);
