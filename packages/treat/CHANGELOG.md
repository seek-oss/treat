# Change Log

## 2.0.2

### Patch Changes

- [`37a44be`](https://github.com/seek-oss/treat/commit/37a44be14d27a0d3edbb2e49920c2bcdcc9d0b57) [#167](https://github.com/seek-oss/treat/pull/167) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix style exports not being available when window is defined

## 2.0.1

### Patch Changes

- [`84905f3`](https://github.com/seek-oss/treat/commit/84905f3b357422307bed6c2ad5c267e374332b18) [#161](https://github.com/seek-oss/treat/pull/161) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add types to release

## 2.0.0

### Major Changes

- [`0869329`](https://github.com/seek-oss/treat/commit/086932913da1b07084ea386159645f9fc3a7849e) [#156](https://github.com/seek-oss/treat/pull/156) Thanks [@mattcompiles](https://github.com/mattcompiles)! - The `verbose` option has been removed in favor of using [debug](https://www.npmjs.com/package/debug)

* [`0869329`](https://github.com/seek-oss/treat/commit/086932913da1b07084ea386159645f9fc3a7849e) [#156](https://github.com/seek-oss/treat/pull/156) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add Webpack 5 compatibility

  Treat has been upgraded to work with Webpack 5. While Webpack 4 is still supported, our ability to support Webpack 4 specific issues going forward will be limited and the suggested path will be to upgrade to Webpack 5.

  **Dependency version uplift**

  Most core dependencies have been uplifted as part of this change. As treat shares a lot of core dependencies with other webpack/styling libraries some setups may have issues due to mismatching dependencies.

  Highlight changes:

  - `autoprefixer`: v9 -> v10
  - `css-loader`: v2 -> v5
  - `csstype`: v2 -> v3
  - `postcss`: v7 -> v8
  - `postcss-js`: v2 -> v3
  - `style-loader`: v0 -> v2

  **Hot module reloading**

  The `hmr` option is no longer required when used with Webpack 5 as it is now inferred.

  **Note for Gatsby and Next.js users**

  Unfortunately, both `gatsby-plugin-treat` and `next-treat` are not yet working with treat v2. The cause of the issue is currently unknown. Community help would be appreciated.

- [`fe950bc`](https://github.com/seek-oss/treat/commit/fe950bc5b5e00bd520ef17aa97400575f63ca859) [#153](https://github.com/seek-oss/treat/pull/153) Thanks [@mattcompiles](https://github.com/mattcompiles)! - `treat/webpack-plugin` is now an ES module.

  BREAKING CHANGE:
  When importing `treat/webpack-plugin` in a commonjs file you must now use the named export `TreatPlugin`.

  ```js
  const { TreatPlugin } = require('treat/webpack-plugin');
  ```

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.6.1](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.6.0...v1.6.1) (2020-10-19)

### Bug Fixes

- Process animations for globalStyle ([#138](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/138)) ([819646d](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/819646d))

# [1.6.0](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.5.1...v1.6.0) (2020-09-16)

### Features

- Add [@supports](https://github.com/supports) support ([#133](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/133)) ([ca2eb47](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/ca2eb47))

## [1.5.1](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.5.0...v1.5.1) (2020-07-27)

### Bug Fixes

- Allow custom treat file module rules ([#128](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/128)) ([a0f1bad](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/a0f1bad))

# [1.5.0](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.4.3...v1.5.0) (2020-07-23)

### Features

- Add hot module reloading support ([#127](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/127)) ([ce5b667](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/ce5b667))

## [1.4.3](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.4.2...v1.4.3) (2020-07-13)

### Bug Fixes

- Ensure consistent and valid content hashes ([#111](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/111)) ([d6993a4](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/d6993a4)), closes [#121](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/121)

## [1.4.1](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.4.0...v1.4.1) (2020-04-26)

### Bug Fixes

- **webpack-plugin:** Checking treat file extension ([#107](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/107)) ([5f5e838](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/5f5e838))

## [1.2.4](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.2.3...v1.2.4) (2020-01-31)

### Bug Fixes

- **styleMap:** Support numbers as keys on 'styleMap' objects ([#88](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/88)) ([1fd5f1f](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/1fd5f1f))

## [1.2.2](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.2.1...v1.2.2) (2020-01-15)

### Bug Fixes

- Detect multiple webpack versions error ([#80](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/80)) ([c067bdf](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/c067bdf))

## [1.2.1](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.2.0...v1.2.1) (2020-01-12)

### Bug Fixes

- Handle undefined watcher error ([#82](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/82)) ([c3b44e9](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/c3b44e9))

## [1.1.7](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.1.6...v1.1.7) (2019-12-02)

### Bug Fixes

- Produce single type definitions ([#70](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/70)) ([b60aebd](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/b60aebd))

## [1.1.6](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.1.5...v1.1.6) (2019-10-20)

### Bug Fixes

- Handle zeroes in treat class selectors ([#66](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/66)) ([2d44b72](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/2d44b72))

## [1.1.5](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.1.4...v1.1.5) (2019-10-15)

### Bug Fixes

- Honour input order for simple pseudos ([#65](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/65)) ([ee7ae3e](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/ee7ae3e))

## [1.1.4](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.1.3...v1.1.4) (2019-10-08)

### Bug Fixes

- Gracefully handle compilation errors ([#64](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/64)) ([47dd4e8](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/47dd4e8))

## [1.1.3](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.1.2...v1.1.3) (2019-09-20)

### Bug Fixes

- Normalize CSS file paths for Windows ([#61](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/61)) ([0c96664](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/0c96664))

## [1.1.2](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.1.1...v1.1.2) (2019-09-20)

### Bug Fixes

- Add theme.d.ts to npm package ([#59](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/59)) ([39a7c63](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/39a7c63))

## [1.1.1](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.1.0...v1.1.1) (2019-09-19)

### Bug Fixes

- Handle tree shaking of themes ([#60](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/60)) ([26ebcd8](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/26ebcd8))

## [1.0.3](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.0.2...v1.0.3) (2019-08-01)

### Bug Fixes

- Fail validation for undefined styles ([#55](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/55)) ([b8399d9](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/b8399d9))

## [1.0.2](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.0.1...v1.0.2) (2019-08-01)

### Bug Fixes

- **deps:** Update Autoprefixer, suppresses browserslist warning ([#54](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/54)) ([dde0281](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/dde0281))

# [1.0.0](https://github.com/seek-oss/treat/tree/master/packages/treat/compare/v1.0.0-beta.2...v1.0.0) (2019-07-24)

### Bug Fixes

- Correctly order themed styles from multiple modules ([#2](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/2)) ([8393fed](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/8393fed))
- Don't publish global theme declaration ([#5](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/5)) ([4e141cc](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/4e141cc))
- Dont throw selector error until all themes found ([#12](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/12)) ([5c01c96](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/5c01c96))
- Handle themed OR selectors in local styles ([#20](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/20)) ([f5e5049](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/f5e5049))
- Make ‘resolveStyles’ support deep objects, add ‘resolveClassName’ ([#6](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/6)) ([a94d920](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/a94d920))
- Mark all treat files as having side effects ([#16](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/16)) ([828a1dd](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/828a1dd))
- **globalStyle:** Handle selectors correctly when no local styles ([#11](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/11)) ([09d80d0](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/09d80d0))
- Mark loader as cacheable ([#23](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/23)) ([53cd2dd](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/53cd2dd))
- Recompile styles when theme dependencies update ([#26](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/26)) ([2f03b8e](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/2f03b8e))
- Remove css dependency when tree shaking ([#4](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/4)) ([114fcf6](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/114fcf6))
- Rename `css` function to `styleMap` ([#7](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/7)) ([110848b](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/110848b))
- **globalStyle:** Correct type signature ([#15](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/15)) ([1b7d025](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/1b7d025))
- **keyframes:** Handle keyframes in selectors block ([#10](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/10)) ([f973d5b](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/f973d5b))
- **resolveClassNames:** Handle theme dereferencing in object keys ([#3](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/3)) ([7957554](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/7957554))
- **selectors:** Enforce targeting of ‘&’ in selectors ([#17](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/17)) ([728c9fa](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/728c9fa))
- **styleTree:** Remove possible styleTree class clashes ([#34](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/34)) ([64862eb](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/64862eb))
- Simplify globalStyles type ([#14](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/14)) ([791fb89](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/791fb89))
- Support Safari < 9 by using var for named exports ([#37](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/37)) ([fc36761](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/fc36761))

### Features

- Add 'styleTree' function ([#28](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/28)) ([88ff843](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/88ff843))
- Add [@keyframes](https://github.com/keyframes) API ([#8](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/8)) ([f115e78](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/f115e78))
- Add runtime validation of styles, optimize compilation ([#18](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/18)) ([5018046](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/5018046))
- Add webpack-plugin option validation ([#32](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/32)) ([a40e7aa](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/a40e7aa))
- Allow ‘undefined’ to be exported from treat files ([#30](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/30)) ([d302abd](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/d302abd))
- Allow themeable global styles ([#19](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/19)) ([1da4b89](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/1da4b89))
- Release v1.0.0 ([#39](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/39)) ([ee7e890](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/ee7e890))

### Performance Improvements

- Add compiler cache ([#25](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/25)) ([616627a](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/616627a))
- Avoid unnecessary rebuilds ([#24](https://github.com/seek-oss/treat/tree/master/packages/treat/issues/24)) ([64c994e](https://github.com/seek-oss/treat/tree/master/packages/treat/commit/64c994e))
