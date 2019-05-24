---
title: Runtime API
---

# Runtime API

> Note: If you're using React, you should use our [React API](#react-api) instead.

## resolveStyles

Type: `function`

Resolves styles for an entire treat file relative to a given theme.

```js
import { resolveStyles } from 'treat';
import * as styleRefs from './styles.treat.js';
import theme from './theme.treat.js';

const styles = resolveStyles(theme, styleRefs);
```

## resolveClassName

Type: `function`

Resolves a single treat class name relative to a given theme.

```js
import { resolveClassName } from 'treat';

import theme from './theme.treat.js';
import * as styleRefs from './Button.treat.js';

const className = resolveClassName(theme, styleRefs.button);
```
