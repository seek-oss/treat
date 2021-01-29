import React, { useState } from 'react';
import '../components/global.treat';
import { Button } from '../components/Button';

export default () => {
  const [Component, setComponent] = useState(null);

  const handleShowMessage = () => {
    import('../components/SecretMessage').then(
      ({ SecretMessage }) => setComponent(() => SecretMessage),
      (error) => console.error(error),
    );
  };

  return (
    <>
      <Button disabled={Boolean(Component)} onClick={handleShowMessage}>
        Show the secret message{' '}
        <span role="img" aria-label="shushing face">
          🤫
        </span>
      </Button>
      {Component && <Component />}
    </>
  );
};
