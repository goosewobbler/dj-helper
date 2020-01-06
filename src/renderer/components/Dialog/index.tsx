import * as React from 'react';

import RemoveIcon from './RemoveIcon';
import LabelButton from '../LabelButton';

const Dialog = ({
  title,
  onClose,
  children,
}: {
  children?: React.ReactElement;
  title: string;
  onClose(): void;
}): React.ReactElement => (
  <div className="dialog">
    <div className="box">
      <div className="header">
        <h1>{title}</h1>
        <div>
          <LabelButton className="dialog-close-button" width="full" image={<RemoveIcon />} label="" onClick={onClose} />
        </div>
      </div>
      <div className="content">{children}</div>
    </div>
  </div>
);

export default Dialog;
