import { CSSProperties } from 'react';

import { bgc, ff, fs, fw, tc } from '../theme';
import {
  StyleSystemProps,
  colorProps,
  fontProps,
  marginProps,
  paddingProps,
  sizeProps,
  styleSystemPropNames
} from '../types';
import {
  resolveColorProp,
  resolveResponsiveProp,
  spacingPropsToClassNames,
  splitProps
} from '../utils';
import { useScreenSize } from './useScreenSize';
import { useTheme } from './useTheme';

/**
 * Extract style system props into a separate object
 */
export function useStyleSystem(props: Record<string, any>) {
  const styleSystemProps: StyleSystemProps = Object.keys(props)
    .filter((key) => styleSystemPropNames.indexOf(key as any) >= 0)
    .reduce((v, k) => ((v[k] = props[k]), v), {} as Record<string, any>);

  const otherProps = Object.keys(props)
    .filter((key) => styleSystemPropNames.indexOf(key as any) < 0)
    .reduce((v, k) => ((v[k] = props[k]), v), {} as Record<string, any>);

  // TODO: Rest of the style system... things?

  return {
    styleSystemProps,
    otherProps
  };
}

/**
 * Convert style system props into classNames and styles
 */
export function useStyleSystemV2<P>(props: P): [string[], CSSProperties, P] {
  const [screen] = useScreenSize();
  const theme = useTheme();

  // TODO: Condense into one vararg call so we don't have all these temp objects.
  const [padding, _1] = splitProps(paddingProps, props as { [K: string]: any });
  const [margin, _2] = splitProps(marginProps, _1);
  const [size, _3] = splitProps(sizeProps, _2);
  const [font, _4] = splitProps(fontProps, _3);
  const [color, _5] = splitProps(colorProps, _4);
  const { style, ...unused } = _5;

  return [
    // Construct an array of Tailwind class names
    // resolved from the style system props
    [
      ...spacingPropsToClassNames(paddingProps, padding, screen),
      ...spacingPropsToClassNames(marginProps, margin, screen),
      // ...spacingPropsToClassNames(sizeProps, size, screen),

      tc(resolveColorProp(color.c, theme)),
      bgc(resolveColorProp(color.bgc, theme)),

      fs(font.fs),
      fw(font.fw),
      ff(font.ff)
    ],

    // Styles that can't be resolved by spacing keys end up getting
    // resolved as inline styles.
    {
      width: resolveResponsiveProp(size.w, screen),
      height: resolveResponsiveProp(size.h, screen),
      minWidth: resolveResponsiveProp(size.miw, screen),
      minHeight: resolveResponsiveProp(size.mih, screen),
      maxWidth: resolveResponsiveProp(size.maw, screen),
      maxHeight: resolveResponsiveProp(size.mah, screen),
      ...(style ? style : {})
    },

    unused as P
  ];
}
