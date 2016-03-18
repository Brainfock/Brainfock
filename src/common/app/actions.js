/**
 * Brainfock - Community & Business Management Solution
 *
 * Copyright (c) 2015-present, Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
export const APP_SET_BASEURL = 'APP_SET_BASEURL';
export const APP_SET_ACTIVE_SECTION = 'APP_SET_ACTIVE_SECTION';
export const APP_WARNING = 'APP_WARNING';

export function setAppBaseUrl(url) {
  return {
    type: APP_SET_BASEURL,
    payload: url
  };
}

export function appWarn(info) {
  if (typeof console !== 'undefined') {
    console.warn(info); // eslint-disable-line no-console, no-undef
  }
  return {
    type: APP_WARNING,
    payload: info
  };
}

export function appSetActiveSectionLabel(label, subLabel = null) {
  return {
    type: APP_SET_ACTIVE_SECTION,
    payload: {
      label: label,
      subLabel: subLabel,
    }
  };
}