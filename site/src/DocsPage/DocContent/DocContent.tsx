import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import docs from '../../docs-store';
import SiblingDoc from '../SiblingDoc/SiblingDoc';

type DocRoute = { doc?: string };

export default ({ match }: RouteComponentProps<DocRoute>) => {
  const docName = match.params.doc;
  const { Component, index } = docs.find(doc => doc.id === docName) || docs[0];

  const prevDoc = docs[index - 1];
  const nextDoc = docs[index + 1];

  return (
    <div>
      <Component />
      {prevDoc && (
        <div style={{ float: 'left' }}>
          <SiblingDoc {...prevDoc} />
        </div>
      )}
      {nextDoc && (
        <div style={{ float: 'right' }}>
          <SiblingDoc {...nextDoc} />
        </div>
      )}
    </div>
  );
};
