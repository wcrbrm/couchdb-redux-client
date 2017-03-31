import React from 'react';
import { Logger } from './Logger';
import { default as doT } from './doT';

export const evaluateTitlePattern = (title, route, doc, website) => {
  if (title.indexOf('{{') === -1) { return title; }
  const tempFn = doT.template(title);
  const resultText = tempFn({ route, doc, website });
  Logger.of('evaluateTitlePattern').info(resultText, route, doc, website);
  return resultText;
};

export const getDocumentTitle = (route, doc, website) => {
  Logger.of('getDocumentTitle').info(route, doc, website);
  let titlePattern = '';
  if (route && route.title) {
    titlePattern = route.title;
  } else if (doc && doc.error) {
    titlePattern = doc.error;
  } else if (doc && doc.windowTitle) {
    titlePattern = doc.windowTitle;
  } else if (website && website.title) {
    titlePattern = website.title;
  }
  return evaluateTitlePattern(titlePattern, route, doc, website);
};

export default {
  evaluateTitlePattern,
  getDocumentTitle
};
