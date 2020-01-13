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
}): React.ReactElement => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center overlay bg-dialog-overlay-50">
      <div className="flex flex-col w-11/12 max-w-3xl p-4 rounded box shadow-dialog bg-secondary-background text-primary-text">
        <div className="flex mb-4 header">
          <h1 className="items-center mb-4 mr-auto text-2xl font-normal">{title}</h1>
          <div>
            <LabelButton
              className="dialog-close-button"
              width="full"
              image={<RemoveIcon />}
              label=""
              onClick={onClose}
            />
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
