import { style } from 'treat';

const className = style({ color: 'red' });

export default {
  array: [className],
  null: null,
  number: 123,
  object: { key: className },
  string: className,
  undefined: undefined,
};
