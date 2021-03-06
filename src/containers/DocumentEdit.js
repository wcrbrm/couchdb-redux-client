import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/ext/searchbox';
import 'brace/theme/github';
import { Logger } from './../services/Logger';
import { getRoot, CouchDB } from './../services/ApiRequest';

const isReadonly = (docId) => { return false; };
/* eslint-disable no-undef */
const isCms = () => (window.COUCHDB_CMS);
/* eslint-enable no-undef */

class WebsiteDocumentEdit extends Component {

  state = { documentId: '', value: '', canBeSaved: false, errorMessage: '', currentDoc: {} };

  loadDocument = (docId = this.state.documentId) => {
    //const docId = this.state.documentId;
    Logger.of('DocumentEdit.loadDocument').info('docId=', docId);
    this.props.load(docId, () => {
      const doc = this.props.dbDocuments[docId];
      this.setState({
        value: JSON.stringify(doc, null, 2),
        currentDoc: doc,
        errorMessage: '',
        canBeSaved: false
      });
    });
  };

  componentDidMount() {
    const docId = this.props.routeParams.splat;
    Logger.of('DocumentEdit.componentDidMount').info('docId=', docId);
    const p = this.props;
    this.state = { documentId: docId };
    this.loadDocument(this.props.routeParams.splat);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.routeParams.splat !== nextProps.routeParams.splat) {
      Logger.of('DocumentEdit.componentWillReceiveProps').info('docId=', nextProps.routeParams.splat);
      this.setState({ documentId: nextProps.routeParams.splat });
      this.loadDocument(nextProps.routeParams.splat);
    }
  }

  onChange = (newValue) => {
    const oldDocument = this.props.dbDocuments[this.state.documentId];
    let currentDoc = {};
    let errorMessage = '';
    try {
      currentDoc = JSON.parse(newValue);
    } catch (e) {
      errorMessage = e.toString();
      Logger.of('DocumentEdit').warn(e.toString());
    }
    const canBeSaved = !isReadonly(this.state.documentId) &&
      !this.props.editLoading.error &&
      (errorMessage.length === 0 && JSON.stringify(currentDoc) !== JSON.stringify(oldDocument));
    this.setState({
      value: newValue,
      errorMessage, currentDoc,
      canBeSaved
    });
    this.props.cleanError();
  }

  onSave = (e) => {
    this.props.save(this.state.documentId, this.state.currentDoc, () => {
      this.loadDocument(this.state.documentId);
    });
  }

  onDeleteDocument = () => {
    this.props.onDeleteDocument(this.state.currentDoc._id, this.state.currentDoc._rev);
  }

  render() {
    const docId = this.state.documentId;
    if (!docId) return false;
    const nowGMT = (new Date()).toISOString();
    const currentDoc = this.state.currentDoc;
    if (!currentDoc) return false;
    const open = (currentDoc && currentDoc.status === 'published' && currentDoc.published < nowGMT);

    const styleReadonlyContainer = {
      background: 'transparent',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      fontSize: 12
    };
    const styleAddNewDocButton = {
      display: 'inline-block',
      float: 'left',
      paddingTop: '12px',
      paddingLeft: '0',
      fontSize: '1.3em',
      paddingRight: '5px'
    };
    return (
      <div>
        <Link to='/documents' >All Documents</Link>
        <div>
          <div style={{ float: 'right', textAlign: 'right' }}>
            {this.props.editLoading.loading ? (
              <span>...</span>
            ) : (
              <button className='btn btn-success' disabled={!this.state.canBeSaved} onClick={this.onSave}>
                Save Document
              </button>
            )}
            {
              this.props.editorDbMessages.error &&
              <div
                className='alert alert-danger'
                style={{ padding: '0px 20px', marginBottom: 5 }}
              >
                {this.props.editorDbMessages.error}
              </div>
            }
            {
              this.props.editLoading.error &&
              <div
                className='alert alert-danger'
                style={{ padding: '0px 20px', marginBottom: 5 }}
              >
                {this.props.editLoading.error}
              </div>
            }
          </div>
          <Link to='/new-document' style={styleAddNewDocButton} className='btn btn-link' >
            <i className='fa fa-plus' />
          </Link>
          <h1>Edit Document</h1>
        </div>
        {(this.state.errorMessage) ? (
          <div
            className='alert alert-danger'
            style={{ padding: '0px 20px', margin: '5px 0px' }}
          >
            {this.state.errorMessage}
          </div>
        ) : (
          <div style={{ padding: '2px 0px' }}>
            <div style={{ float: 'right', textAlign: 'right' }}>
              <a href={`${getRoot()}/${docId}`} target='_blank' rel='noopener noreferrer'>API</a>
            </div>
            {(!open) ? (
              <div>
                <i className='fa fa-lock' title={'Document is not publicly visible'} />
                &nbsp;
                <strong>{docId}</strong>
                &nbsp; &nbsp;
                {(currentDoc.status === 'published') ?
                  <span style={{ fontSize: 12 }}>to be published {currentDoc.published} GMT</span> :
                  <div style={{ color: '#aaa' }}>{currentDoc.status}</div>
                }
              </div>
            ) : (
              <div>
                <i className='fa fa-eye' title={'Public Document'} />
                &nbsp;
                <a target='_blank' rel='noopener noreferrer' href={`/${currentDoc._id}`}>View Published</a>
              </div>
            )}
          </div>
        )}

        {(isReadonly(docId)) ? (
          <div>
            <div className='alert alert-warning' style={{ padding: '5px 20px' }}>
              This document is read only for the sake of system integrity.
            </div>
            <pre style={styleReadonlyContainer}>{this.state.value}</pre>
          </div>
        ) : (
          <div style={{ height: this.props.browser.height - 190, border: '1px #ccc solid' }}>
            <AceEditor
              mode='json'
              theme='github'
              onChange={this.onChange}
              value={this.state.value}
              style={{ width: '100%', height: '100%' }}
              wrapEnabled={true}
              name='UNIQUE_ID_OF_DIV'
              editorProps={{ $blockScrolling: true }}
            />
          </div>
        )}
        <button className='btn btn-danger' style={{ margin: '1em' }} onClick={this.onDeleteDocument}>
          Delete Document
        </button>
      </div>
    );
  }
}
const mapStateToProps = state => (state);
const mapDispatchToProps = (dispatch, props) => {
  return {
    cleanError: () => {
      dispatch({ type: 'saveError', payload: '' });
    },

    save: (documentId, doc, cb) => {
      dispatch({ type: 'saveStarted' });
      CouchDB.saveOne(documentId, doc).then((data) => {
        if (data.error || data.reason) {
          dispatch({ type: 'saveError', payload: data });
        } else {
          dispatch({ type: 'saveFinished' });
          if (typeof cb === 'function') { cb(data); }
        }
      });
    },

    load: (documentId, cb) => {
      if (documentId) {
        CouchDB.fetchOne(documentId).then((data) => {
          dispatch({ type: 'saveDbDocument', payload: [documentId, data] });
          if (typeof cb === 'function') cb(data);
        });
      }
    },

    onDeleteDocument: (documentId, documentRev) => {
      if (documentId) {
        dispatch({ type: 'WAIT_STARTED' });
        const url = `${documentId}?rev=${documentRev}`;
        CouchDB.removeOne(url).then((data) => {
          if (data.errors) {
            dispatch({ type: 'WAIT_FINISHED' });
            dispatch({ type: 'SET_ERROR_MESSAGES', payload: data.errors.message });
          } else {
            Logger.of('DocumentsEdit.delete').info('data=', data);
            dispatch({ type: 'WAIT_FINISHED' });
            dispatch({ type: 'SET_ERROR_MESSAGES', payload: '' });
            dispatch({ type: 'SET_SUCCESS_MESSAGES', payload: 'Your document has been successfully deleted.' });
            dispatch(push('/documents'));
          }
        });
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteDocumentEdit);
