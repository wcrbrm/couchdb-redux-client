import React, { Component } from 'react';
import { Link } from 'react-router';
import { getDocumentTitle } from './TplTitle';

export default class LayoutDebug extends Component {

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
    const pathname = p.pathname;
    const doc = p.doc;
    const tpl = p.tpl;
    const layout = p.layout;
    return (
      <div>
        <h1>Celebs Networth</h1>
        <div>
          <Link to='/'>Accueil</Link> &nbsp; &bull; &nbsp;
          <Link to='/aaron-carter'>Aaron Carter</Link>  &nbsp; &bull; &nbsp;
          <Link to='/alanis-morissette'>Alanis Morissette</Link>  &nbsp; &bull; &nbsp;
          <Link to='/singer'>Tag: singer</Link>  &nbsp; &bull; &nbsp;
          <Link to='/invalid-page'>Invalid Page</Link>
        </div>
        <h4>Route Object</h4>
        <pre>{JSON.stringify(p.routeObject)}</pre>
        <h4>Loaded</h4>
        <pre>{JSON.stringify(Object.keys(p.documents))}</pre>
        <h4>DOCUMENT</h4>
        <pre>{JSON.stringify(doc, null, 2)}</pre>
        <h4>Template</h4>
        <pre>{JSON.stringify(tpl, null, 2)}</pre>
        <h4>Layout</h4>
        <pre>{JSON.stringify(layout, null, 2)}</pre>
        <h4>Website</h4>
        <pre>{JSON.stringify(p.documents['--Website'], null, 2)}</pre>
      </div>
    );
  }
}
