import * as React from 'react';
import tw from 'tailwind.macro';

const CreateIcon = (): React.ReactElement => {
  const fillColor = tw`text-primary-text`.color;
  return (
    <svg width="100%" height="100%" viewBox="0 0 32 32" fill={fillColor}>
      <path d="M31.5 13.5h-13V.5h-5v13H.5v5h13v13h5v-13h13z" id="Layer_2" />
    </svg>
  );
};

export default CreateIcon;
