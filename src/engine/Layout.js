import React, { Component } from 'react';
import { Link } from 'react-router';
import { renderDocument } from './TplRenderer';
import { getDocumentTitle } from './TplTitle';


export default class Layout extends Component {

  /* eslint-disable no-undef */
  assignDocument(url) {
    this.props.onChangeRoute(url, this.props.documents, () => {
      document.title = getDocumentTitle(this.props.routeObject, this.props.doc, this.props.website);
      document.body.classList.add(`layout${this.props.layout._id}`);
    });
  }
  releaseDocument() {
    document.title = '';
    document.body.classList.remove(`layout${this.props.layout._id}`);
  }
  /* eslint-enable no-undef */

  componentWillReceiveProps(nextProps) {
    if (this.props.params.splat !== nextProps.params.splat) {
      this.assignDocument(nextProps.params.splat);
    }
  }
  componentDidMount() {
    this.assignDocument(this.props.params.splat);
  }
  componentWillUnmount() {
    this.releaseDocument();
  }

  render() {
    const p = this.props;
    // return renderDocument(p.tpl, p.layout, p.doc, p.documents);
    return (
      <div>
        {renderDocument(p.tpl, p.layout, p)}
      </div>
    );
  }
}

