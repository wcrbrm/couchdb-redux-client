/* eslint-disable padded-blocks, no-undef, no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IndexRedirect, DefaultRoute, IndexRoute, Route, Router, Redirect, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { responsiveStoreEnhancer, createResponsiveStoreEnhancer, createResponsiveStateReducer } from 'redux-responsive';
import reducers from '../reducers';
import { EditorContainer, WebsiteDocumentEdit, WebsiteDocuments, WebsiteNewDocument } from './';

const envApplocation = (elem, __w, callback) => {
  const state = __w.__initialState__ || {};
  // state.WebsitesList = JSON.stringify(__w.document.getElementById('websitesList').innerText);
  const store = createStore(
    combineReducers({
      ...reducers,
      browser: createResponsiveStateReducer({ xs: 544, sm: 768, md: 992, lg: 1200, xl: 10000 })
    }),
    compose(
      responsiveStoreEnhancer,
      applyMiddleware(
        routerMiddleware(hashHistory),
        thunk
      )
    )
  );
  const history = syncHistoryWithStore(hashHistory, store);
  // please see https://github.com/ReactTraining/react-router/blob/master/docs/guides/RouteMatching.md#path-syntax
  const application = (
    <Provider store={store}>
      <Router history={history} onUpdate={() => __w.scrollTo(0, 0)}>
        <Route path='/' component={EditorContainer}>
          <IndexRedirect to='/documents' />
          <Route path='/documents/**' component={WebsiteDocumentEdit} />
          <Route path='/documents' component={WebsiteDocuments} />
          <Route path='/new-document' component={WebsiteNewDocument} />
        </Route>
      </Router>
    </Provider>
  );

  const docPreload = document.getElementById('preloadedDocuments');
  if (docPreload) {
    const preloadedJson = JSON.parse(docPreload.innerText);
    store.dispatch({ type: 'SAVE_DOCUMENTS', payload: preloadedJson });
  }
  ReactDOM.render(application, elem, callback);
};

export default envApplocation;
