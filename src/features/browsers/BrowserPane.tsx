import React, { ReactElement } from 'react';
import { MetaPanel } from './MetaPanel';
import { Browser } from '../../common/types';

export function BrowserPane({ browser }: { browser: Browser }): ReactElement {
  return (
    <div>
      <MetaPanel browser={browser} />
      <div className="browserPanel" />
    </div>
  );
}
