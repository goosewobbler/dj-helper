import * as React from 'react';

import LabelButton from './LabelButton';

interface IDialogProps {
  children?: any;
  title: string;
  onClose(): any;
}

const Dialog = (props: IDialogProps) => (
  <div className="dialog">
    <div className="box">
      <div className="header">
        <h1>{props.title}</h1>
        <div>
          <LabelButton
            className="dialog-close-button"
            width="100%"
            image="/image/icon/no.svg"
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
