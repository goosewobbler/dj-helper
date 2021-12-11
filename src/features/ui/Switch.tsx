import React from 'react';

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
  <div className="inline-block float-right mt-4 mr-4">
    <label className="switch-label" htmlFor={id}>
      <span className="switch-button" />
      {text}
      <input checked={isOn} onChange={handleToggle} className="ml-1 switch-checkbox" id={id} type="checkbox" />
    </label>
  </div>
);
