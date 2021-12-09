import React from 'react';

export const Switch = ({ id, isOn, handleToggle }: { id: string; isOn: boolean; handleToggle: () => void }) => (
  <div className="inline-block float-right mt-4 mr-4">
    <label className="switch-label" htmlFor={id}>
      <span className="switch-button" />
      Small Embed
      <input checked={isOn} onChange={handleToggle} className="switch-checkbox" id={id} type="checkbox" />
    </label>
  </div>
);
