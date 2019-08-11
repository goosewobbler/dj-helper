import * as React from 'react';

import RemoveIcon from './RemoveIcon';
import LabelButton from '../LabelButton';

interface DialogProps {
  children?: any;
  title: string;
  onClose(): any;
}

const Dialog = (props: DialogProps) => (
  <div className="dialog">
    <div className="box">
      <div className="header">
        <h1>{props.title}</h1>
        <div>
          <LabelButton
            className="dialog-close-button"
            width="100%"
            image={<RemoveIcon />}
            label=""
            onClick={props.onClose}
          />
        </div>
      </div>
      <div className="content">{props.children}</div>
    </div>
  </div>
);

export default Dialog;
