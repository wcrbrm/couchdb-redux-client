const modules = {
  routesMatchPath: 'OFF',
  routesNeedDocument: 'OFF',
  routesMatchDocument: 'OFF',
  receiveDocument: 'OFF',
  getMissingDocuments: 'OFF',
  evaluateTitlePattern: 'OFF',
  getDocumentTitle: 'OFF',
  detectTemplates: 'OFF',
  evaluateUrlPattern: 'OFF',
  receiveRequiredDocuments: 'OFF',
  'render.Element': 'OFF',
  'render.Container': 'OFF',
  'render.Masonry': 'OFF',
  'render.SimpleMenu': 'OFF',
  'render.ErrorMessageBox': 'OFF',
  'reducer.setNewRoute': 'OFF'
};

export const DEFAULT_LEVEL = 'INFO';
export const MODULE_LEVELS = modules;

export default {
  DEFAULT_LEVEL,
  MODULE_LEVELS
};
