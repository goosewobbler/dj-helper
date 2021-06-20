import * as React from 'react';

const renderStarred = (colour: string): React.ReactElement => (
  <svg width="100%" height="100%" viewBox="0 0 482.207 482.207" fill={colour}>
    <path d="M482.207 186.973l-159.699-33.704-81.404-141.466-81.405 141.466L0 186.973l109.388 121.135-17.294 162.296 149.01-66.601 149.009 66.601-17.295-162.296z" />
  </svg>
);

const renderUnstarred = (colour: string): React.ReactElement => (
  <svg width="100%" height="100%" viewBox="0 0 510 510" fill={colour}>
    <path d="M510 197.472l-183.37-15.734L255 12.75l-71.629 168.988L0 197.472l139.103 120.539L97.41 497.25 255 402.186l157.59 95.064-41.692-179.239L510 197.472zM255 354.348l-95.957 57.886 25.398-109.166-84.736-73.389 111.69-9.588L255 117.172l43.605 102.918 111.689 9.588-84.711 73.389 25.398 109.166L255 354.348z" />
  </svg>
);

const StarIcon = ({ colour, starred }: { colour?: string; starred: boolean }): React.ReactElement =>
  starred ? renderStarred(colour!) : renderUnstarred(colour!); // TODO: Tech debt

export default StarIcon;
