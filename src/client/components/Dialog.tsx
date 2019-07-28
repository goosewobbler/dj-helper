import * as React from 'react';

import Theme from '../../types/Theme';
import RemoveIcon from '../ui/icon/RemoveIcon';
import LabelButton from '../ui/LabelButton';

interface IDialogProps {
  theme: Theme;
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
            theme={props.theme}
            className="dialog-close-button"
            width="100%"
            image={<RemoveIcon colour={props.theme.primaryTextColour} />}
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
