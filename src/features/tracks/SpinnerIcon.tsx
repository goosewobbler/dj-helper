import React from 'react';

export const SpinnerIcon = () => {
  const childClassNames = 'absolute opacity-100 rounded-full border-4 border-gray-500 animate-ripple';
  return (
    <div className="relative inline-block w-20 h-20 spinner-ripple">
      <div className={childClassNames} />
      <div className={`delay-500 ${childClassNames}`} />
    </div>
  );
};
