import { DEFAULT_LEVEL, MODULE_LEVELS } from '../config/logging.config';

/**
 * USAGE examples:
 * import { Logger } from './Logger';
 *
 * Logger.of('module').info("test", "2", "3")
 * Logger.of('module').warn(object)
 */

const isLevelEnabled = (actualLevel, levelToMatch) => {
  if (levelToMatch === 'OFF') return false;
  if (levelToMatch === actualLevel) return true;
  switch (actualLevel) {
    case 'TRACE':
      return (['INFO', 'WARN', 'ERROR'].indexOf(levelToMatch) !== -1);
    case 'INFO':
      return (['WARN', 'ERROR'].indexOf(levelToMatch) !== -1);
    case 'WARN':
      return (['ERROR'].indexOf(levelToMatch) !== -1);
    default:
  }
  return false;
};

const documentMatchesLevel = (doc, levelToMatch) => {
  if (MODULE_LEVELS[doc]) {
    // we have the rule for that function/class
    return isLevelEnabled(MODULE_LEVELS[doc], levelToMatch);
  }
  return isLevelEnabled(DEFAULT_LEVEL, levelToMatch);
};

/* eslint-disable no-console */
const of = (document) => {
  const prefix = `${document} |`;
  return {
    info: (...args) => {
      if (documentMatchesLevel(document, 'INFO')) {
        console.info(prefix, ...args);
      }
    },
    warn: (...args) => {
      if (documentMatchesLevel(document, 'WARN')) {
        console.warn(prefix, ...args);
      }
    },
    error: (...args) => {
      if (documentMatchesLevel(document, 'ERROR')) {
        console.error(prefix, ...args);
      }
    },
    trace: (...args) => {
      if (documentMatchesLevel(document, 'TRACE')) {
        console.trace(prefix, ...args);
      }
    }
  };
};

export const Logger = { of };

export default { of };
