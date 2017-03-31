import React from 'react';
import { Logger } from './Logger';
import { default as doT } from './doT';
/* eslint-disable no-continue */

const escapeRegExp = (str) => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

export const routesMatchPath = (path, routes) => {
  const p = `/${path}`;
  const res = [];
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const routePath = route.path;
    if (!routePath) { continue; }
    let match = false;
    if (routePath.indexOf('*') !== -1) {
      // the case when routepath has some mask, replace the mask into regex,
      // then test path with that regex
      let regexTpl = escapeRegExp(routePath);
      regexTpl = replaceAll(regexTpl, '\\*\\*', '.+');
      regexTpl = replaceAll(regexTpl, '\\*', '[^/]+');
      // Logger.of('routePath').info(routePath, 'regex=', regexTpl);
      const regex = new RegExp(regexTpl);
      if (regex.test(p)) { match = true; }
    } else {
      match = (routePath === p);
    }
    if (match) { res.push(route); }
  }
  Logger.of('routesMatchPath').info('path=', path, res);
  return res;
};

export const routesMatchType = (docType, routes) => {
  const res = [];
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    if (!docType) {
      res.push(route);
    } else {
      const routeType = route.type;
      if (typeof routeType === 'string' && docType === routeType) {
        res.push(route);
      }
    }
  }
  Logger.of('routesMatchDocument').info('type=', docType, res);
  return res;
};

export const routesNeedDocument = (routes) => {
  // currently there is a list of routes that could match our requirement
  // we might not require the document if
  // 1) we already have it in cache
  // 2) there is the only route which doesn't requires it.
  let result = false;
  if (!routes || routes.length <= 1) {
    result = false;
  } else {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (typeof route.type === 'string') {
        // at least one of multiple documents have type
        result = true;
      }
    }
  }
  Logger.of('routesNeedDocument').info(result);
  return result;
};
