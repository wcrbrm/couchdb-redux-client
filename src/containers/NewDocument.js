import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/ext/searchbox';
import 'brace/theme/github';
import { CouchDB } from './../services/ApiRequest';
import { Logger } from './../services/Logger';

class WebsiteNewDocument extends Component {

  constructor(props) {
    super(props);
    this.state = { value: '', canBeSaved: false, errorMessage: '', currentDoc: {} };
    this.onCreateDoc = this.onCreateDoc.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  generateNewDocument() {
    const generateDocId = () => {
      let result = '';
      const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 32; i += 1) {
        result += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return result;
    };
    const newDoc = { _id: generateDocId() };
    this.setState({
      value: JSON.stringify(newDoc, null, 2),
      currentDoc: newDoc,
      defaultDocId: newDoc._id,
      errorMessage: '',
      canBeSaved: true
    });
  }

  componentDidMount() {
    this.generateNewDocument();
  }

  onChange(newValue) {
    let currentDocValue = {};
    let errorMessage = '';
    try {
      currentDocValue = JSON.parse(newValue);
    } catch (e) {
      errorMessage = e.toString();
      Logger.of('NewDocument').warn(e.toString());
    }
    const canBeSaved = errorMessage.length === 0 && currentDocValue._id !== '';
    if (canBeSaved) {
      this.setState({ currentDoc: currentDocValue });
    }
    this.setState({ value: newValue, errorMessage, canBeSaved });
  }

  onCreateDoc() {
    this.props.onAddNewDocument(this.state.currentDoc._id, this.state.currentDoc);
  }

  render() {
    const currentDoc = this.state.currentDoc;
    if (!currentDoc) return false;
    const docId = this.state.currentDoc._id !== '' ? this.state.currentDoc._id : this.state.defaultDocId;
    if (!docId) return false;
    const nowGMT = (new Date()).toISOString();
    const open = (currentDoc && currentDoc.status === 'published' && currentDoc.published < nowGMT);
    return (
      <div>
        <Link to='/documents' >All Documents</Link>
        <div>
          <div style={{ float: 'right', textAlign: 'right' }}>
            <button className='btn btn-success' disabled={!this.state.canBeSaved} onClick={this.onCreateDoc}>
              Create Document
            </button>
          </div>
          <h1>New Document</h1>
        </div>
        { this.props.errorMessage &&
          <div
            className='alert alert-danger'
            style={{ padding: '0px 20px', margin: '5px 0px' }}
          >
            {this.props.errorMessage}
          </div>
        }
        {(this.state.errorMessage) ? (
          <div
            className='alert alert-danger'
            style={{ padding: '0px 20px', margin: '5px 0px' }}
          >
            {this.state.errorMessage}
          </div>
        ) : (
          <div style={{ padding: '2px 0px' }}>
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
      </div>
    );
  }
}
const mapStateToProps = state => ({
  editLoading: state.editLoading,
  browser: state.browser,
  errorMessage: state.editorDbMessages.error && state.editorDbMessages.error
});
const mapDispatchToProps = (dispatch, props) => {
  return {
    onAddNewDocument: (documentId, doc) => {
      if (documentId) {
        dispatch({ type: 'WAIT_STARTED' });
        CouchDB.createOne(documentId, doc).then((data) => {
          if (data.errors) {
            Logger.of('NewDocument.onAddNewDocument.Error').info('data=', data);
            dispatch({ type: 'WAIT_FINISHED' });
            dispatch({ type: 'SET_ERROR_MESSAGES', payload: data.errors.message });
          } else {
            Logger.of('NewDocument.onAddNewDocument.Success').info('data=', data);
            dispatch({ type: 'WAIT_FINISHED' });
            dispatch({ type: 'SET_ERROR_MESSAGES', payload: '' });
            dispatch({ type: 'SET_SUCCESS_MESSAGES', payload: 'Saving document.' });
            dispatch(push('/documents'));
          }
        });
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteNewDocument);
