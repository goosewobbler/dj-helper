import React, { ReactElement } from 'react';
import { MetaPanel } from './MetaPanel';

export function BrowserPane(): ReactElement {
  return (
    <div>
      <MetaPanel />
      <div className="browserPanel" />
    </div>
  );
}
