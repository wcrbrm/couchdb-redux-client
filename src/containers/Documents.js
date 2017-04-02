import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Logger } from './../services/Logger';
import { CouchDB } from './../services/ApiRequest';

const bottomPosition = (el) => {
  const topScrollPos = el.scrollTop;
  const totalContainerHeight = el.scrollHeight;
  const containerFixedHeight = el.offsetHeight;
  const bottomScrollPos = topScrollPos + containerFixedHeight;
  return (totalContainerHeight - bottomScrollPos);
};

const getDbTitle = () => {
  /* eslint-disable no-undef */
  return window.COUCHDB_TITLE || 'Documents';
  /* eslint-enable no-undef */
};

class WebsiteDocuments extends Component {

  state = { search: '', limit: 100 };
  inputSearch = null;
  scrollingArea = null;

  componentWillMount() {
    this.props.load();
  }
  /* eslint-disable no-undef */
  componentDidMount() {
    this.inputSearch.focus();
    // setTimeout(() => { this.cleanAllMessages(); }, 5000); WHAT IS THAT??? ?????
    this.scrollingArea.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    this.scrollingArea.removeEventListener('scroll', this.handleScroll);
  }
  /* eslint-enable no-undef */
  scroll = () => {
    if (bottomPosition(this.scrollingArea) < 200) {
      if (this.canLoadMore()) this.onLoadMore();
    }
  }

  onSearch = (event) => {
    this.setState({ search: event.target.value });
  }

  getAllItems = () => {
    const rows = this.props.alldocs;
    if (!rows) return 0;
    const searchValue = this.state.search.toLowerCase();
    return rows.filter(obj => (!searchValue || obj.id.toLowerCase().indexOf(searchValue) === 0));
  }

  canLoadMore = () => {
    return (this.state.limit < this.getAllItems().length);
  }

  onLoadMore = () => {
    let newLimit = this.state.limit + 100;
    const items = this.getAllItems();
    if (newLimit > items.length) newLimit = items.length;
    this.setState({ limit: newLimit });
  }

  onAddNewDoc = () => {
    this.props.addNewDoc();
  }

  cleanAllMessages = () => {
    this.props.cleanMessages();
  }

  render() {
    const items = this.getAllItems();
    const onSearch = this.props.onSearch;
    const limit = this.state.limit;
    return (
      <div ref={el => (this.scrollingArea = el ? el.parentNode : null)}>
        <div style={{ float: 'right', display: 'flex' }}>
          <button className='btn btn-success' onClick={this.onAddNewDoc} style={{ marginRight: '1em' }} >
            Add new document
          </button>
          <input
            ref={el => (this.inputSearch = el)}
            type='text' className='form-control' name='search'
            onChange={this.onSearch} placeholder='Document ID'
          />
        </div>
        <h1>{getDbTitle()}</h1>
        {this.props.messages.error !== '' &&
          <div
            className='alert alert-danger'
            style={{ padding: '0px 20px', margin: '5px 0px' }}
          >
            {this.props.messages.error}
          </div>
        }
        {this.props.messages.success !== '' &&
        <div
          className='alert alert-success'
          style={{ padding: '0px 20px', margin: '5px 0px' }}
        >
          {this.props.messages.success}
        </div>
        }
        <table className='table table-bordered table-striped'>
          <thead>
            <tr>
              <th style={{ width: 80 }}>#</th>
              <th>ID</th>
              <th>Revision</th>
            </tr>
          </thead>
          <tbody>
            {items.slice(0, limit).map((obj, index) => {
              const indexKey = index;
              return (
                <tr key={indexKey}>
                  <td>{index + 1}.</td>
                  <td>{obj.id}</td>
                  <td><Link to={`/documents/${obj.id}`}>{obj.value.rev}</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!this.canLoadMore()) ? false : (
          <div style={{ textAlign: 'center', paddingBottom: 30 }}>
            <button className='btn btn-default' onClick={this.onLoadMore}>
              LOAD MORE
            </button>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dbResultSets: state.dbResultSets,
  alldocs: state.dbResultSets.all_docs ? state.dbResultSets.all_docs.rows : [],
  messages: {
    error: state.dbNewDocuments.error && state.dbNewDocuments.error, // <-- MESS!
    success: state.dbDeleteDocuments.success && state.dbDeleteDocuments.success // <-- MESS!
  }
});

const mapDispatchToProps = dispatch => ({
  load: () => {
    CouchDB.fetchAllDocs().then((data) => {
      Logger.of('Document.load').info('data=', data);
      dispatch({ type: 'saveDbResultSets', payload: ['all_docs', data] });
    });
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
    CouchDB.saveOne(newDoc._id, newDoc).then((data) => {
      if (!data.error || !data.reason) {
        Logger.of('Documents.addNewDoc.Success').info('newDocId=', data.id);
        dispatch(push(`/documents/${newDoc._id}`));
      } else {
        dispatch({ type: 'SET_DOCUMENT_ERROR', payload: data });
      }
    });
  },
  cleanMessages: () => {
    Logger.of('Documents.cleanError').info('Clean All Errors');
    dispatch({ type: 'SET_DOCUMENT_ERROR', payload: '' });
    // dispatch({ type: 'SET_DELETE_DOCUMENT_SUCCESS', payload: '' }); ??
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WebsiteDocuments);
