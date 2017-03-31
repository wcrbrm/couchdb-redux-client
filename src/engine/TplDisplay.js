import React from 'react';

export const getDisplayClasses = (display, browser) => {
  if (!display || !display.screens) return [];
  const screens = display.screens;
  const arrClasses = [];
  ['xs', 'sm', 'md', 'lg', 'xl'].forEach(device => {
    if (screens.indexOf(device) === -1) { arrClasses.push(`hidden-${device}`); }
  });
  return arrClasses;
};

export const getDisplayStyles = (display, browser) => {
  return {};
};

export const getPositionClasses = (position) => {
  const mapGridClasses = {
    xlColumn: 'col-xl',
    xlOffset: 'offset-xl',
    lgColumn: 'col-lg',
    lgOffset: 'offset-lg',
    mdColumn: 'col-md',
    mdOffset: 'offset-md',
    smColumn: 'col-sm',
    smOffset: 'offset-sm',
    xsColumn: 'col-xs',
    xsOffset: 'offset-xs'
  };
  const arrClasses = [];
  Object.keys(position).forEach(key => {
    if (typeof mapGridClasses[key] !== 'undefined') {
      arrClasses.push(`${mapGridClasses[key]}-${position[key]}`);
    }
  });
  return arrClasses;
};

export const getPositionStyles = (position) => {
  return {};
};
