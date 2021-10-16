import React from 'react';

export const Switch = ({ isOn, handleToggle }: { isOn: boolean; handleToggle: () => void }) => {
  return (
    <div className="inline-block float-right mt-4 mr-4 ">
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label className="react-switch-label" htmlFor={`react-switch-new`}>
        <span className={`react-switch-button`} />
        Small Embed
      </label>
    </div>
  );
};
