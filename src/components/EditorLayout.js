import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Panels/HeaderPanel.css';

export const EditorLayout = (props) => {
  const isActiveLink = (path) => {
    if (!props.location || !props.location.pathname) return false;
    if (props.location.pathname.indexOf('/website/') !== 0) return false; // start only from website
    const left = props.location.pathname.substring('/website/'.length);
    return path === left || left.indexOf(path) === 0;
  };
  return (
    <div className='narrow'>
      <div className='left-panel'>
        <Link className={isActiveLink('documents') ? 'active' : false} to='/documents'>Documents</Link>
      </div>
      <div className='inner-area' style={{ width: 'calc(100% - 160px)', height: '100%' }} >
        {props.children}
      </div>
    </div>
  );
};

export default { EditorLayout };
