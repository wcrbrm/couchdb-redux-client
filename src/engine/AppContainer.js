import React from 'react';
import { connect } from 'react-redux';
import { setNewRoute, addDocuments, setDocumentError } from '../actions';
import { routesMatchPath, routesMatchType } from './TplRoute';
import { detectTemplates, receiveRequiredDocuments } from './TplDocument';
import { renderDocument } from './TplRenderer';
import Layout from './Layout';
import LayoutDebug from './LayoutDebug';
import { Logger } from './Logger';
import { trackPageview } from './Tracking';
/* eslint-disable no-console */

const mapStateToProps = (state) => {
  const docs = state.documents;
  const objRoute = state.documents['--Route'];
  const tpls = detectTemplates(docs.doc, objRoute, docs);
  return {
    browser: state.browser,
    documents: docs,
    pathname: state.routing.locationBeforeTransitions.pathname.substring(1),
    routeObject: objRoute,
    website: state.documents['--Website'],
    doc: state.documents.doc,
    tpl: docs[tpls[0]],
    layout: docs[tpls[1]]
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    onChangeRoute: (path, documents, callback) => {
      const onError = (response) => {
        if (response.status >= 400) {
          dispatch(setDocumentError(response));
          dispatch(setNewRoute(path, {}));
          if (typeof callback === 'function') callback();
        }
      };
      receiveRequiredDocuments(path, documents, (docs, routeObject) => {
        dispatch(addDocuments(docs));
        dispatch(setNewRoute(path, routeObject));
        if (typeof callback === 'function') callback();
      }, onError);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);

