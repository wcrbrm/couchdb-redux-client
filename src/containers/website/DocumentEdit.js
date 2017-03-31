import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/ext/searchbox';
import 'brace/theme/github';
import { fetchOne, saveOne, deleteOne } from '../../engine/ApiData';
import { Logger } from './../../engine/Logger';

const isReadonly = (docId) => {
  // docId === '--Config' || docId === '--Views' ||
  return docId.substring(0, 8) === '_design/';
};

class WebsiteDocumentEdit extends Component {

  constructor(props) {
    super(props);
    this.state = { documentId: '', value: '', canBeSaved: false, errorMessage: '', currentDoc: {} };
    this.onDelete = this.onDelete.bind(this);
    this.onAddNewDoc = this.onAddNewDoc.bind(this);
  }

  loadDocument(docId = this.state.documentId) {
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
  }

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

  onChange(newValue) {
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

  onSave(e) {
    this.props.save(this.state.documentId, this.state.currentDoc, this.loadDocument.bind(this));
  }

  onDelete() {
    this.props.delete(this.state.currentDoc._id, this.state.currentDoc._rev);
  }

  onAddNewDoc() {
    this.props.addNewDoc();
  }

  render() {
    const docId = this.state.documentId;
    if (!docId) return false;
    const onChange = this.onChange.bind(this);
    const onSave = this.onSave.bind(this);
    // const value = JSON.stringify(doc, null, 2);
    const nowGMT = (new Date()).toISOString(); //
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
        <div style={{ float: 'right', textAlign: 'right' }}>
          {this.props.editLoading.loading ? (
            <span>...</span>
          ) : (
            <button className='btn btn-success' disabled={!this.state.canBeSaved} onClick={onSave}>
              Save Document
            </button>
          )}
          {(this.props.editLoading.error) ? (
            <div
              className='alert alert-danger'
              style={{ padding: '0px 20px', marginBottom: 5 }}
            >
              {this.props.editLoading.error}
            </div>
          ) : false}
        </div>
        <button style={styleAddNewDocButton} className='btn btn-link' onClick={this.onAddNewDoc} >
          <i className='fa fa-plus' />
        </button>
        <h1>Edit Document</h1>
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
              <a href={`/db/${docId}`} target='_blank' rel='noopener noreferrer'>API</a>
            </div>
            {(!open) ? (
              <div>
                <i className='fa fa-lock' title={'Document is not publicly visible'}></i>
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
                <i className='fa fa-eye' title={'Public Document'}></i>
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
              onChange={onChange}
              value={this.state.value}
              style={{ width: '100%', height: '100%' }}
              wrapEnabled={true}
              name='UNIQUE_ID_OF_DIV'
              editorProps={{ $blockScrolling: true }}
            />
          </div>
        )}
        <button className='btn btn-danger' style={{ float: 'left', marginTop: '1em' }} onClick={this.onDelete}>
          Delete Document
        </button>
      </div>
    );
  }
}

export default connect(
  state => (state),
  dispatch => ({

    cleanError: () => {
      dispatch({ type: 'saveError', payload: '' });
    },

    save: (documentId, doc, cb) => {
      dispatch({ type: 'saveStarted' });
      saveOne(`db/${documentId}`, doc, (data) => {
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
        fetchOne(`db/${documentId}`, (data) => {
          dispatch({ type: 'saveDbDocument', payload: [documentId, data] });
          if (typeof cb === 'function') cb(data);
        });
      }
    },

    addNewDoc: () => {
      dispatch({ type: 'ADD_DOCUMENT' });
      const docId = () => {
        let result = '';
        const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i += 1) {
          result += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return result;
      };
      const newDoc = { _id: docId() };
      saveOne(`db/${newDoc._id}`, newDoc, (data) => {
        if (!data.error || !data.reason) {
          Logger.of('DocumentEdit.addNewDoc.Success').info('newDocId=', data.id);
          dispatch(push(`/documents/${data.id}`));
        } else {
          dispatch({ type: 'SET_DOCUMENT_ERROR', payload: data });
        }
      });
    },

    delete: (documentId, documentRev) => {
      if (documentId) {
        dispatch({ type: 'DELETE_DOCUMENT' });
        deleteOne(`db/${documentId}`, documentRev, (data) => {
          if (data.error || data.reason) {
            dispatch({ type: 'SET_DELETE_DOCUMENT_ERROR', payload: data });
          } else {
            Logger.of('DocumentsEdit.delete').info('data=', data);
            dispatch({ type: 'SET_DELETE_DOCUMENT_SUCCESS', payload: data });
            dispatch(push('/documents'));
          }
        });
      }
    }
  })
)(WebsiteDocumentEdit);
