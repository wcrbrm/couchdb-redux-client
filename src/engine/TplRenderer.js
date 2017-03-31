import React from 'react';
import * as bundleIndex from '../elements/render/index';
import { Logger } from './Logger';

export const renderElement = (section, key, element, context) => {
  const type = element.type;
  if (typeof bundleIndex.default[element.type] === 'function') {
    // There could be some properties added.
    const params = { section, key, index: key, props: element, context };
    Logger.of('render.Element').info(element.type, element);
    // return bundleIndex.default[element.type](params);
    return React.createElement(bundleIndex.default[element.type], params);
  }
  Logger.of('render.Element').warn('element', element.type, 'was not defined section', section, element);
  return (
    <div key={key} style={{ borderBottom: '1px #eee solid', margin: 5 }}>
      <div style={{ background: '#f88', color: 'white' }}>
        {section}
      </div>
      <pre>{JSON.stringify(element, null, 2)}</pre>
    </div>
  );
};

export const renderElementsContainer = (section, elements, context) => {
  if (!elements) return false;
  return elements.map((item, index) => renderElement(section, index, item, context));
};

export const renderDocument = (template, layout, context) => {
  return (
    <div className='document'>
      {layout && layout.sticky ? renderElementsContainer('sticky', layout.sticky, context) : ''}
      {layout && layout.header ? renderElementsContainer('header', layout.header, context) : ''}
      {template && template.container ? renderElementsContainer('document', template.container, context) : ''}
      {layout && layout.footer ? renderElementsContainer('footer', layout.footer, context) : ''}
    </div>
  );
};
