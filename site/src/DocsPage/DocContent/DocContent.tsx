import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Title } from 'react-head';
import docs from '../../docs-store';
import SiblingDoc from '../SiblingDoc/SiblingDoc';

type DocRoute = { doc?: string };

export default ({ match }: RouteComponentProps<DocRoute>) => {
  const docName = match.params.doc;
  const { Component, title, index } =
    docs.find(doc => doc.id === docName) || docs[0];

  const prevDoc = docs[index - 1];
  const nextDoc = docs[index + 1];

  const pageTitle = `Treat${index ? ` – ${title} ` : ''}`;

  return (
    <div>
      <Title>{pageTitle}</Title>
      <Component />
      {prevDoc && (
        <div style={{ float: 'left' }}>
          <SiblingDoc direction="left" {...prevDoc} />
        </div>
      )}
      {nextDoc && (
        <div style={{ float: 'right' }}>
          <SiblingDoc direction="right" {...nextDoc} />
        </div>
      )}
    </div>
  );
};
