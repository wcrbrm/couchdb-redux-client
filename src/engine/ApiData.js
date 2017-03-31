import React from 'react';
import { Logger } from './Logger';

export const getRoot = () => {
  return '/';
};

/* eslint-disable no-undef */
export const fetchOne = (url, onSuccess, onError) => {
  // TODO: add the token in the header, add application/json
  jQuery.getJSON(getRoot() + url, onSuccess, onError);
};

export const saveOne = (url, obj, onSuccess, onError) => {
  // TODO: add the token in the header,
  jQuery.ajax({
    type: 'PUT',
    url: getRoot() + url,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: JSON.stringify(obj),
    success: onSuccess,
    error: onError
  });
};

export const deleteOne = (url, docRev, onSuccess, onError) => {
  Logger.of('ApiData.deleteOne').info('url=', url, 'docRev=', docRev);
  jQuery.ajax({
    type: 'DELETE',
    url: `${getRoot()}${url}?rev=${docRev}`,
    success: onSuccess,
    error: onError
  });
};
/* eslint-enable no-undef */

export const dataToMap = (data, funcKey) => {
  const map = {};
  data.forEach((obj, index) => {
    const key = funcKey(obj, index);
    if (typeof key !== 'undefined') {
      if (typeof map[key] === 'undefined') map[key] = [];
      map[key].push(obj);
    }
  });
  return map;
};

export const keyFrom = (field) => {
  return (obj, index) => (obj[field]);
};

export default {
  getRoot,
  fetchOne,
  saveOne,
  dataToMap,
  keyFrom,
  deleteOne
};
