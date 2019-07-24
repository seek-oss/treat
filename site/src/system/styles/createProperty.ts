import { style, CSSProperties, ClassRef } from 'treat';
import { mapValues, keyBy } from 'lodash';
import { Breakpoints, StyleFn } from './types';
import { responsiveStyles } from './responsiveStyles';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type ValidCSSProperties = Omit<CSSProperties, '@keyframes' | '@media'>;

export function createProperty<
  Breakpoint extends string,
  PropertyName extends keyof ValidCSSProperties,
  Value extends NonNullable<ValidCSSProperties[PropertyName]>
>(
  tokens: Breakpoints<Breakpoint>,
  propertyName: PropertyName,
  propertyValues: Array<Value>,
  styleFn: StyleFn = style,
): Record<Value, Record<Breakpoint, ClassRef>> {
  const values = keyBy(propertyValues) as Record<Value, Value>;

  return mapValues(values, value =>
    mapValues(tokens.breakpoints, (minWidth, breakpoint) =>
      styleFn(
        responsiveStyles(minWidth, { [propertyName]: value }),
        `${propertyName}_${value}_${breakpoint}`,
      ),
    ),
  );
}
