import React, { PropType } from 'react';
import ReactDOM from 'react-dom';
import { Logger } from './../engine/Logger';
import { renderElementsContainer } from './../engine/TplRenderer';
import EvEmitter from './../util/EvEmitter';
import ImagesLoaded from './../util/ImagesLoaded';
/* eslint-disable no-new, new-cap */

class ItemRenderer extends React.Component {

  componentDidMount() {
    const onReady = this.props.onReady;
    const item = this.item;
    new ImagesLoaded(EvEmitter, item, {}, (self) => (onReady(self)));
  }

  render() {
    const arrHiddenStyle = { width: this.props.width };
    return (
      <div ref={c => (this.item = c)} style={arrHiddenStyle}>{this.props.children}</div>
    );
  }
}

export const prerender = (itemsToBeLoaded, width, itemTemplate, context, onReady) => {
  Logger.of('prerender').info('itemsToBeLoaded', itemsToBeLoaded);

  /* eslint-disable no-undef */
  const elemHidden = document.createElement('div');
  elemHidden.style.position = 'absolute';
  elemHidden.style.zIndex = 1000;
  elemHidden.style.top = '-10000px';
  elemHidden.style.left = '-10000px';
  document.body.appendChild(elemHidden);
  ///* eslint-enable no-undef */

  const onImagesReady = (iloaded) => {
    Logger.of('onImagesReady').info('elemHidden.firstChild.firstChild.children=',
      elemHidden.firstChild.firstChild.children);
    onReady(elemHidden.firstChild.firstChild.children);
  };

  ReactDOM.render((
    <ItemRenderer onReady={onImagesReady} width={width}>
      { renderElementsContainer('itemsLoader', itemTemplate, { ...context, itemsToBeLoaded }) }
    </ItemRenderer>
  ), elemHidden);
};

export default {
  prerender
};
