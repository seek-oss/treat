function createStyleElement(id: string) {
  const el = document.createElement('style');

  el.id = `treat-runtime-styles-${id}`;

  // Avoid Edge bug where empty style elements don't create sheets
  el.appendChild(document.createTextNode(''));

  return document.head.appendChild(el);
}

const localStyleElement = createStyleElement('local');

const themeStyleElements = new Map();

const themes = [
  { themeRef: 'themeOne', tokens: 'stuff' },
  { themeRef: 'themewo', tokens: 'stuff' },
];
