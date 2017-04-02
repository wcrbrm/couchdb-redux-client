import envApplication from './src/containers/EditorApplication';
/* eslint-disable no-undef */
const __w = window;
const __d = document;
const __b = document.body;
/* eslint-enable no-undef */
const elemRootApplication = __d.getElementById('root_application');
//
// Rendering of the application
//
if (elemRootApplication) {
  const elemRootLoader = __d.getElementById('root_loader');
  envApplication(elemRootApplication, __w, () => {
    elemRootApplication.style.display = 'block';
    if (elemRootLoader) elemRootLoader.style.display = 'none';
  });
} else {
  __b.innerText = '#root_application was not found';
}
