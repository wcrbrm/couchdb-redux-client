import React from 'react';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { responsiveStoreEnhancer } from 'redux-responsive';
// reducers of the application
import * as reducers from './reducers';

// configure middleware of the application
export default (history, initialState) => {
  const reducer = combineReducers({
    ...reducers,
    responsive: responsiveStoreEnhancer,
    routing: routerReducer
  });
  const middlewares = [thunk];
  const store = compose(applyMiddleware(...middlewares))(createStore)(reducer, initialState);
  return store;
};
