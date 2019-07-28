# 🍬 react-treat-styled

## Docs

```tsx
import React from 'react';
import { styled } from 'react-treat-styled';

import * as styleRefs from './Demo.treat';

const Test = styled.div([
  styles.foo.someStyle.button,
  styles.nonThemeStyles.yellow,
]);

export default () => <Test id="main">This font is always yellow</Test>;
```

## License

MIT.
