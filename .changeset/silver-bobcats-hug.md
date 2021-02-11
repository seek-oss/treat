---
'treat': major
---

Add Webpack 5 compatibility

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