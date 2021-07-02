import React from 'react';
import { MetaPanel } from './MetaPanel';

export function BrowserPane() {
  return (
    <div>
      <MetaPanel />
      <div className="browserPanel" />
    </div>
  );
}
