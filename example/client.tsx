import React from 'react';
import ReactDom from 'react-dom';
import App from './App';

Promise.all([
  import(`./Themes/JobStreet.treat`),
  import(`./Themes/SeekAnz.treat`),
]).then(themes => {
  ReactDom.render(
    <App themes={themes.map(t => t.default)} />,
    document.body.appendChild(document.createElement('div')),
  );
});
