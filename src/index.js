import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
ReactDOM.render((
  <BrowserRouter>
    <ReactNotification />
    <App />
  </BrowserRouter>
), document.getElementById('root'));

serviceWorker.unregister();
