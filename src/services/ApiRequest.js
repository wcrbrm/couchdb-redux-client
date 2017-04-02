import fetch_ from 'isomorphic-fetch';
import { Logger } from './Logger';
/* eslint-disable no-undef, no-console */
// HACK for 'Uncaught TypeError: Illegal invocation' error in Chrome
// https://github.com/matthew-andrews/isomorphic-fetch/pull/20/files
const fetch = fetch_.bind(undefined);
const Promise = require('es6-promise').Promise;

export const getRoot = () => {
  if (!window.COUCHDB_URL) {
    Logger.of('ApiRequest').warn('COUCHDB_URL must be defined for proper work of database editor');
  }
  return window.COUCHDB_URL;
};

export const getStaticRoot = () => (`${getRoot()}/static`);
export const openUrl = (url) => { window.open(`${getRoot()}/${url}`); };
export const navigateUrl = (url) => { window.location.href = url; };

export const fetchRequest = req => (
  fetch(req).then((response) => {
    const status = response.status;
    if (status !== 200 && status !== 201) {
      return { errors: { message: `${status} ${response.statusText}` } };
    }
    return response.json();
  }).catch(err => console.error(err))
);

const getRequestHeaders = () => {
  const reqHeaders = new Headers();
  reqHeaders.append('Accept', 'application/json');
  reqHeaders.append('Content-Type', 'application/json');
  // there could be additional headers from the environment
  const headers = window.COUCHDB_HEADERS;
  if (headers && typeof headers === 'object') {
    Object.keys(headers).forEach((hdrKey) => { reqHeaders.append(hdrKey, headers[hdrKey]); });
  }
  return reqHeaders;
};

const getPayloadParams = object => ({
  mode: 'cors',
  redirect: 'follow',
  headers: getRequestHeaders(),
  body: JSON.stringify(object)
});

export const ApiRequest = {
  fetchOne: (url) => {
    const u = url.indexOf(':') !== -1 ? url : `${getRoot()}/${url}`;
    const req = new Request(u, { method: 'get', mode: 'cors', headers: getRequestHeaders() });
    return fetchRequest(req);
  },
  createOne: (object) => {
    const reqParams = Object.assign({ method: 'POST' }, getPayloadParams(object));
    return fetchRequest(new Request(`${getRoot()}`, reqParams));
  },
  saveOne: (url, object) => {
    const u = url.indexOf(':') !== -1 ? url : `${getRoot()}/${url}`;
    const reqParams = Object.assign({ method: 'PUT' }, getPayloadParams(object));
    return fetchRequest(new Request(u, reqParams));
  },
  removeOne: (url, object) => {
    const u = url.indexOf(':') !== -1 ? url : `${getRoot()}/${url}`;
    const reqParams = Object.assign({ method: 'PUT' }, getPayloadParams(Object.assign({ _deleted: true }, object)));
    return fetchRequest(new Request(u, reqParams));
  }
};

export const CRUD = methods => (
  Object.assign({}, {
    fetchOne: ApiRequest.fetchOne,
    saveOne: ApiRequest.saveOne,
    createOne: object => (ApiRequest.createOne(Object.assign({}, object, { type }))),
    removeOne: ApiRequest.removeOne
  }, methods || {})
);

export const CouchDB = CRUD({
  fetchAllDocs: () => (ApiRequest.fetchOne('_all_docs'))
});

export default {
  ApiRequest, CRUD, CouchDB, fetchRequest, getStaticRoot, openUrl, navigateUrl, getRoot
};
