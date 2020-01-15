# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.2](https://github.com/seek-oss/treat/compare/v1.2.1...v1.2.2) (2020-01-15)


### Bug Fixes

* Detect multiple webpack versions error ([#80](https://github.com/seek-oss/treat/issues/80)) ([c067bdf](https://github.com/seek-oss/treat/commit/c067bdf))





## [1.2.1](https://github.com/seek-oss/treat/compare/v1.2.0...v1.2.1) (2020-01-12)


### Bug Fixes

* Handle undefined watcher error ([#82](https://github.com/seek-oss/treat/issues/82)) ([c3b44e9](https://github.com/seek-oss/treat/commit/c3b44e9))





# [1.2.0](https://github.com/seek-oss/treat/compare/v1.1.7...v1.2.0) (2019-12-16)


### Features

* Add Gatsby plugin ([#58](https://github.com/seek-oss/treat/issues/58)) ([ad32b00](https://github.com/seek-oss/treat/commit/ad32b00))





## [1.1.7](https://github.com/seek-oss/treat/compare/v1.1.6...v1.1.7) (2019-12-02)


### Bug Fixes

* Produce single type definitions ([#70](https://github.com/seek-oss/treat/issues/70)) ([b60aebd](https://github.com/seek-oss/treat/commit/b60aebd))





## [1.1.6](https://github.com/seek-oss/treat/compare/v1.1.5...v1.1.6) (2019-10-20)


### Bug Fixes

* Handle zeroes in treat class selectors ([#66](https://github.com/seek-oss/treat/issues/66)) ([2d44b72](https://github.com/seek-oss/treat/commit/2d44b72))





## [1.1.5](https://github.com/seek-oss/treat/compare/v1.1.4...v1.1.5) (2019-10-15)


### Bug Fixes

* Honour input order for simple pseudos ([#65](https://github.com/seek-oss/treat/issues/65)) ([ee7ae3e](https://github.com/seek-oss/treat/commit/ee7ae3e))





## [1.1.4](https://github.com/seek-oss/treat/compare/v1.1.3...v1.1.4) (2019-10-08)


### Bug Fixes

* Gracefully handle compilation errors ([#64](https://github.com/seek-oss/treat/issues/64)) ([47dd4e8](https://github.com/seek-oss/treat/commit/47dd4e8))





## [1.1.3](https://github.com/seek-oss/treat/compare/v1.1.2...v1.1.3) (2019-09-20)


### Bug Fixes

* Normalize CSS file paths for Windows ([#61](https://github.com/seek-oss/treat/issues/61)) ([0c96664](https://github.com/seek-oss/treat/commit/0c96664))





## [1.1.2](https://github.com/seek-oss/treat/compare/v1.1.1...v1.1.2) (2019-09-20)


### Bug Fixes

* Add theme.d.ts to npm package ([#59](https://github.com/seek-oss/treat/issues/59)) ([39a7c63](https://github.com/seek-oss/treat/commit/39a7c63))





## [1.1.1](https://github.com/seek-oss/treat/compare/v1.1.0...v1.1.1) (2019-09-19)


### Bug Fixes

* Handle tree shaking of themes ([#60](https://github.com/seek-oss/treat/issues/60)) ([26ebcd8](https://github.com/seek-oss/treat/commit/26ebcd8))





# [1.1.0](https://github.com/seek-oss/treat/compare/v1.0.4...v1.1.0) (2019-09-16)


### Features

* **babel-plugin:** Support anonymous calls in arrays/objects ([#57](https://github.com/seek-oss/treat/issues/57)) ([ec52adb](https://github.com/seek-oss/treat/commit/ec52adb))





## [1.0.4](https://github.com/seek-oss/treat/compare/v1.0.3...v1.0.4) (2019-08-06)


### Bug Fixes

* **babel-plugin-treat:** Support return statements ([#56](https://github.com/seek-oss/treat/issues/56)) ([db47969](https://github.com/seek-oss/treat/commit/db47969))





## [1.0.3](https://github.com/seek-oss/treat/compare/v1.0.2...v1.0.3) (2019-08-01)


### Bug Fixes

* Fail validation for undefined styles ([#55](https://github.com/seek-oss/treat/issues/55)) ([b8399d9](https://github.com/seek-oss/treat/commit/b8399d9))





## [1.0.2](https://github.com/seek-oss/treat/compare/v1.0.1...v1.0.2) (2019-08-01)


### Bug Fixes

* **deps:** Update Autoprefixer, suppresses browserslist warning ([#54](https://github.com/seek-oss/treat/issues/54)) ([dde0281](https://github.com/seek-oss/treat/commit/dde0281))





## [1.0.1](https://github.com/seek-oss/treat/compare/v1.0.0...v1.0.1) (2019-08-01)


### Bug Fixes

* **react-treat:** Add peerDependency on treat ([#53](https://github.com/seek-oss/treat/issues/53)) ([b9498cf](https://github.com/seek-oss/treat/commit/b9498cf))





# [1.0.0](https://github.com/seek-oss/treat/compare/v1.0.0-beta.2...v1.0.0) (2019-07-24)


### Bug Fixes

* Correctly order themed styles from multiple modules ([#2](https://github.com/seek-oss/treat/issues/2)) ([8393fed](https://github.com/seek-oss/treat/commit/8393fed))
* Don't publish global theme declaration ([#5](https://github.com/seek-oss/treat/issues/5)) ([4e141cc](https://github.com/seek-oss/treat/commit/4e141cc))
* Dont throw selector error until all themes found ([#12](https://github.com/seek-oss/treat/issues/12)) ([5c01c96](https://github.com/seek-oss/treat/commit/5c01c96))
* Handle themed OR selectors in local styles ([#20](https://github.com/seek-oss/treat/issues/20)) ([f5e5049](https://github.com/seek-oss/treat/commit/f5e5049))
* Make ‘resolveStyles’ support deep objects, add ‘resolveClassName’ ([#6](https://github.com/seek-oss/treat/issues/6)) ([a94d920](https://github.com/seek-oss/treat/commit/a94d920))
* Mark all treat files as having side effects ([#16](https://github.com/seek-oss/treat/issues/16)) ([828a1dd](https://github.com/seek-oss/treat/commit/828a1dd))
* Mark loader as cacheable ([#23](https://github.com/seek-oss/treat/issues/23)) ([53cd2dd](https://github.com/seek-oss/treat/commit/53cd2dd))
* Recompile styles when theme dependencies update ([#26](https://github.com/seek-oss/treat/issues/26)) ([2f03b8e](https://github.com/seek-oss/treat/commit/2f03b8e))
* Remove css dependency when tree shaking ([#4](https://github.com/seek-oss/treat/issues/4)) ([114fcf6](https://github.com/seek-oss/treat/commit/114fcf6))
* Rename `css` function to `styleMap` ([#7](https://github.com/seek-oss/treat/issues/7)) ([110848b](https://github.com/seek-oss/treat/commit/110848b))
* Simplify globalStyles type ([#14](https://github.com/seek-oss/treat/issues/14)) ([791fb89](https://github.com/seek-oss/treat/commit/791fb89))
* Support Safari < 9 by using var for named exports ([#37](https://github.com/seek-oss/treat/issues/37)) ([fc36761](https://github.com/seek-oss/treat/commit/fc36761))
* **babel:** Traverse objects to resolve debugIdent name ([#22](https://github.com/seek-oss/treat/issues/22)) ([d858113](https://github.com/seek-oss/treat/commit/d858113))
* **globalStyle:** Correct type signature ([#15](https://github.com/seek-oss/treat/issues/15)) ([1b7d025](https://github.com/seek-oss/treat/commit/1b7d025))
* **globalStyle:** Handle selectors correctly when no local styles ([#11](https://github.com/seek-oss/treat/issues/11)) ([09d80d0](https://github.com/seek-oss/treat/commit/09d80d0))
* **keyframes:** Handle keyframes in selectors block ([#10](https://github.com/seek-oss/treat/issues/10)) ([f973d5b](https://github.com/seek-oss/treat/commit/f973d5b))
* **resolveClassNames:** Handle theme dereferencing in object keys ([#3](https://github.com/seek-oss/treat/issues/3)) ([7957554](https://github.com/seek-oss/treat/commit/7957554))
* **selectors:** Enforce targeting of ‘&’ in selectors ([#17](https://github.com/seek-oss/treat/issues/17)) ([728c9fa](https://github.com/seek-oss/treat/commit/728c9fa))
* **styleTree:** Remove possible styleTree class clashes ([#34](https://github.com/seek-oss/treat/issues/34)) ([64862eb](https://github.com/seek-oss/treat/commit/64862eb))


### Features

* Add 'styleTree' function ([#28](https://github.com/seek-oss/treat/issues/28)) ([88ff843](https://github.com/seek-oss/treat/commit/88ff843))
* Add [@keyframes](https://github.com/keyframes) API ([#8](https://github.com/seek-oss/treat/issues/8)) ([f115e78](https://github.com/seek-oss/treat/commit/f115e78))
* Add runtime validation of styles, optimize compilation ([#18](https://github.com/seek-oss/treat/issues/18)) ([5018046](https://github.com/seek-oss/treat/commit/5018046))
* Add webpack-plugin option validation ([#32](https://github.com/seek-oss/treat/issues/32)) ([a40e7aa](https://github.com/seek-oss/treat/commit/a40e7aa))
* Allow ‘undefined’ to be exported from treat files ([#30](https://github.com/seek-oss/treat/issues/30)) ([d302abd](https://github.com/seek-oss/treat/commit/d302abd))
* Allow themeable global styles ([#19](https://github.com/seek-oss/treat/issues/19)) ([1da4b89](https://github.com/seek-oss/treat/commit/1da4b89))
* Release v1.0.0 ([#39](https://github.com/seek-oss/treat/issues/39)) ([ee7e890](https://github.com/seek-oss/treat/commit/ee7e890))


### Performance Improvements

* Add compiler cache ([#25](https://github.com/seek-oss/treat/issues/25)) ([616627a](https://github.com/seek-oss/treat/commit/616627a))
* Avoid unnecessary rebuilds ([#24](https://github.com/seek-oss/treat/issues/24)) ([64c994e](https://github.com/seek-oss/treat/commit/64c994e))
