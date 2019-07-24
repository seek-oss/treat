export { resolveStyles } from './resolveStyles';
export { resolveClassName } from './resolveClassName';
export * from './types';

// Mock builder functions as they should only be run in node context
export const createTheme = () => {};
export const style = () => {};
export const styleMap = () => {};
export const styleTree = () => {};
export const globalStyle = () => {};
