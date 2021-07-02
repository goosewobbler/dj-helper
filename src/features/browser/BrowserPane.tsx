import React from 'react';
import { Iframe } from './Iframe';
import { MetaPanel } from './MetaPanel';

export function BrowserPane() {
  return (
    <div>
      <MetaPanel />
      <Iframe />
    </div>
  );
}
