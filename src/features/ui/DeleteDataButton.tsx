import React, { ReactElement, useState } from 'react';

import { BombIcon } from '../../icons/BombIcon.js';
import { ExplosionIcon } from '../../icons/ExplosionIcon.js';
import { useDispatch } from '../../renderer/hooks/useDispatch.js';

export function DeleteDataButton(): ReactElement {
  // const { isDev } = window.api;
  const isDev = true;
  const dispatch = useDispatch();
  const [clicked, setClicked] = useState(false);
  const [displayExplosion, setDisplayExplosion] = useState(false);
  const [fadeExplosion, setFadeExplosion] = useState(false);

  if (clicked) {
    // TODO: clean this up
    setTimeout(() => {
      setClicked(false);
      setDisplayExplosion(true);
      dispatch('STORE:RESET');
      setTimeout(() => {
        setFadeExplosion(true);
        setTimeout(() => {
          setDisplayExplosion(false);
          setFadeExplosion(false);
        }, 1000);
      }, 1000);
    }, 1600);
  }

  const bombAdditionalClassNamesWhenClicked = 'animate-explode';
  const bombAdditionalClassNames = clicked ? bombAdditionalClassNamesWhenClicked : '';
  const explosionAdditionalClassNames = fadeExplosion ? 'opacity-0 scale-150' : 'opacity-100';

  return (
    <div className="inline-block float-right mt-4 mr-4 w-30">
      {isDev && (
        <button
          type="button"
          onClick={() => {
            if (!clicked) {
              setClicked(true);
            }
          }}
        >
          {displayExplosion ? (
            <ExplosionIcon
              className={`explosion-icon ml-auto transition transform duration-1000 ease-in-out ${explosionAdditionalClassNames}`}
            />
          ) : (
            <BombIcon className={`bomb-icon ml-auto ${bombAdditionalClassNames}`} />
          )}
        </button>
      )}
    </div>
  );
}
