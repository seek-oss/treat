import React from 'react';
import ReactDom from 'react-dom';
import App from './App';

ReactDom.render(
  <App />,
  document.body.appendChild(document.createElement('div')),
);
