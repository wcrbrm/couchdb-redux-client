import React from 'react';
import { Logger } from './Logger';
import { default as doT } from './doT';
import { routesMatchPath, routesMatchType, routesNeedDocument } from './TplRoute';

/* eslint-disable no-console, no-undef, padded-blocks */
if (!Array.isArray) {
  Array.isArray = (arg) => (Object.prototype.toString.call(arg) === '[object Array]');
}

export const getDocIndex = (path) => {
  if (Array.isArray(path)) {
    return path[0];
  }
  if (!path) return '--Index';
  return path;
};


export const evaluateUrlPattern = (url, route, doc, website) => {
  if (url.indexOf('{{') === -1) { return url; }
  const tempFn = doT.template(url);
  const resultUrl = tempFn({ route, doc, website });
  Logger.of('evaluateUrlPattern').info(resultUrl, route, doc, website);
  return resultUrl;
};

export const getDocUrl = (path, route, doc, website) => {
  let p = path;
  if (Array.isArray(path)) {
    p = path[1];
  }
  p = evaluateUrlPattern(p, route, doc, website);
  if (p.substring(0, 1) === '/') return `/db${p}`;
  return `/db/${p}`;
};

export const getTplDocIndex = (template) => {
  if (template.indexOf('--Template') === 0) return template;
  return `--Template-${template}`;
};

/**
 * Get IDs of template and Layout that are required
 * to display this particular document.
*/
export const detectTemplates = (pageDoc, routeObject, docs) => {
  let tpl = '';
  let layout = getTplDocIndex('Layout');
  if (routeObject) {
    if (routeObject.template) { tpl = getTplDocIndex(routeObject.template); }
    if (routeObject.layout) { layout = getTplDocIndex(routeObject.layout); }
  }
  if (pageDoc) {
    if (pageDoc.template) { tpl = getTplDocIndex(pageDoc.template); }
    if (pageDoc.layout) { layout = getTplDocIndex(pageDoc.layout); }
  }
  Logger.of('detectTemplates').info([tpl, layout], routeObject);
  return [tpl || '--Template-NotFound', layout];
};

/**
 * Downloading single document from the DB database
 */
export const receiveDocument = (path, routeObject, pageDoc, website, onSuccess, onError) => {
  const url = getDocUrl(path, routeObject, pageDoc, website);
  Logger.of('receiveDocument').info('receiving', url, 'path=', path);
  jQuery.getJSON(url, onSuccess).fail(onError);
};

/**
  * Download
  */
export const receiveDocuments = (paths, routeObject, pageDoc, website, onSuccess, onError) => {
  let remained = paths.length;
  let returned = false;
  const objResult = {};
  paths.forEach(path => {
    receiveDocument(path, routeObject, pageDoc, website, (doc) => {
      if (returned) return; // ignore everything after error
      objResult[getDocIndex(path)] = doc;
      remained--;
      if (remained === 0) {
        if (typeof onSuccess === 'function') onSuccess(objResult);
      }
    }, (e) => {
      returned = true;
      if (typeof onError === 'function') onError(e);
    });
  });
  if (paths.length === 0) {
    if (typeof onSuccess === 'function') onSuccess(objResult);
  }
};

/**
 * @return array
 */
export const getMissingDocuments = (routeObject, pageDoc, docs) => {
  const paths = [];
  Logger.of('getMissingDocuments').info('routeObject', routeObject);
  if (routeObject.data) {
    // here selected route states that he is missing additional dat ato be downloaded
    Object.keys(routeObject.data).forEach(key => {
      Logger.of('getMissingDocuments').info('missingView', key, routeObject.data[key]);
      paths.push([key, routeObject.data[key]]);
    });
  }
  const tpls2Check = detectTemplates(pageDoc, routeObject, docs);
  for (let i = 0; i < tpls2Check.length; i++) {
    const path = getTplDocIndex(tpls2Check[i]);
    if (typeof docs[path] === 'undefined' && paths.indexOf(path) === -1) {
      paths.push(path);
    }
  }
  Logger.of('getMissingDocuments').info('paths=', paths);
  return paths;
};

/**
 * Download all templates that are missing for the given document
 */
export const receiveMissingDocuments = (routeObject, pageDoc, docs, onSuccess, onError) => {
  const paths = getMissingDocuments(routeObject, pageDoc, docs);
  receiveDocuments(paths, routeObject, pageDoc, docs['--Website'], (docsRetrieved) => {
    if (typeof onSuccess === 'function') onSuccess(docsRetrieved);
  }, onError);
};

/**
 * Download all templates that are missing for that PATH
 */
export const receiveRequiredDocuments = (path, docs, onSuccess, onError) => {
  const docsDownloaded = {};
  const onDocumentAvailable = (pageDoc, routes) => {
    const routesByType = routesMatchType(pageDoc.type, routes);
    const routeObject = routesByType[0];
    // This is called when we have the document in our state tree
    receiveMissingDocuments(routeObject, pageDoc, docs, (docsRetrieved) => {
      Object.keys(docsRetrieved).forEach(key => {
        docsDownloaded[key] = docsRetrieved[key];
      });
      if (Object.keys(docsDownloaded).length) {
        Logger.of('receiveRequiredDocuments').info('Docs were received', docsDownloaded);
      }
      if (typeof onSuccess === 'function') onSuccess(docsDownloaded, routeObject);
    }, onError);
  };
  // if at least on route in the list will require the document, we will try to get it first
  const routesByPath = routesMatchPath(path, docs['--Routes'].routes);
  const bDocumentIsRequired = routesNeedDocument(routesByPath);
  if (bDocumentIsRequired) {
    receiveDocument(path, {}, {}, docs['--Website'], pageDoc => {
      docsDownloaded[getDocIndex(path)] = pageDoc;
      onDocumentAvailable(pageDoc, routesByPath);
    }, onError);
  } else {
    docsDownloaded[getDocIndex(path)] = {};
    onDocumentAvailable({}, routesByPath);
  }
};
