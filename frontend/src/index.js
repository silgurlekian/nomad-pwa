import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// Elimina esta línea si no estás utilizando Service Worker
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Elimina o comenta esta línea si no estás utilizando Service Worker
// serviceWorkerRegistration.register();
