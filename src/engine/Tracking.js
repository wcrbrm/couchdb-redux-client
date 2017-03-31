import React from 'react';
import { Logger } from './Logger';

/* eslint-disable no-undef */

export const trackPageview = (cb) => {
  Logger.of('tracking').info('pageview');
  const callback = typeof cb === 'function' ? cb : (() => {});
  if (typeof window.ga === 'function') { window.ga('send', 'pageview'); }
  callback();
};

/*
 * Callback on tracking event is a bit complex.
 * There is a possibility of timeout
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/sending-hits
 */
export const trackEvent = ({ category, action, value }, cb) => {
  Logger.of('tracking').info('category=', category, 'action=', action, 'value=', value);

  const callback = typeof cb === 'function' ? cb : (() => {});
  if (typeof window.ga === 'function') {
    let called = false;
    window.ga('send', 'event', category, action, value, {
      hitCallback: () => {
        called = true;
        callback();
      }
    });
    setTimeout(() => { if (!called) { callback(); } }, 1000);
  } else {
    callback();
  }
};

export default {
  trackPageview,
  trackEvent
};
