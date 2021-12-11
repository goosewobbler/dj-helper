import React, { ReactElement, useState } from 'react';
import { useAppDispatch } from '../../common/hooks';
import { resetStoreAction } from '../rootReducer';
import { BombIcon } from './BombIcon';
import { ExplosionIcon } from './ExplosionIcon';

export function DeleteDataButton(): ReactElement {
  const { isDev } = window.api;
  const dispatch = useAppDispatch();
  const [clicked, setClicked] = useState(false);
  const [displayExplosion, setDisplayExplosion] = useState(false);
  const [fadeExplosion, setFadeExplosion] = useState(false);

  if (clicked) {
    // TODO: clean this up
    setTimeout(() => {
      setClicked(false);
      setDisplayExplosion(true);
      dispatch(resetStoreAction);
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
