import mapValues from 'lodash/mapValues';
import { CSSProperties } from 'treat';

export const mapToStyleProperty = <
  Key extends string,
  Value extends string | number
>(
  tokens: Record<Key, Value>,
  propertyName: keyof CSSProperties,
  minWidth: number,
  mapValue?: (value: Value) => Value,
) =>
  mapValues(tokens, (value: Value) => {
    const style = {
      [propertyName]: mapValue ? mapValue(value) : value,
    };

    return minWidth === 0
      ? style
      : { '@media': { [`screen and (min-width: ${minWidth}px)`]: style } };
  });
