import React, { Component } from 'react';

export const EditorLayout = (props) => {
  return (
    <div className='narrow'>
      <div className='inner-area' style={{ width: '100%', height: '100%' }} >
        {props.children}
      </div>
    </div>
  );
};

export default { EditorLayout };
