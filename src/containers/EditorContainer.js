import React from 'react';
import { connect } from 'react-redux';
import { EditorLayout } from '../components/EditorLayout';

// import { setNewRoute, addDocuments, setDocumentError } from '../actions';
/* eslint-disable no-console */

const mapStateToProps = (state) => {
  return {
    browser: state.browser,
    pathname: state.routing.locationBeforeTransitions.pathname.substring(1)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorLayout);

