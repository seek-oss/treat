---
title: Background
---

# Background

## Tradeoffs

There are plenty of great CSS-in-JS solutions available—and we're big fans of them. However, treat has taken quite a different approach.

The primary goals of treat are **full static extraction, minimal runtime code, type safety and legacy browser support.** While a great developer experience is important to us, it will never come at the cost of these goals.

Unlike a lot of CSS-in-JS approaches, treat is much more similar to [CSS Modules](https://github.com/css-modules/css-modules), requiring a bit more work to bind styles to your components. It's also unable to generate styles at runtime, which means it cannot handle dynamic theming. The upside of treat is that it allows you to craft themeable, statically extracted CSS using JavaScript (or TypeScript) with little impact to bundle size and negligible runtime performance cost.

If you're used to libraries like [styled-components](https://www.styled-components.com) or [Emotion](https://emotion.sh/), treat might seem like a step backwards. These libraries can quickly and easily create dynamic component-oriented styles. However, they come with a bundle size and performance cost. For plenty of applications, this is a worthwhile tradeoff—and these libraries are a great choice if this isn't an issue for you.

If you're familiar with static CSS-in-JS libraries like [Linaria](https://linaria.now.sh/) and [Astroturf](https://github.com/4Catalyzer/astroturf), treat is very similar but with a couple of notable differences. Firstly, treat's theming mechanism doesn't require CSS custom property support (i.e. CSS variables), which means that legacy browsers like IE11 are supported. Secondly, styles are written as objects rather than template literals, to both ensure type safety, and to encourage you to think of your styles as data rather than strings of CSS.

## Backstory

> You don't have to read this to understand treat, but it'll give you a much better understanding of where we're coming from.

The origins of treat begin with [Braid](https://github.com/seek-oss/braid-design-system), our design system.

Braid was originally built with CSS Modules, but authored in JavaScript (via [css-in-js-loader](https://github.com/naistran/css-in-js-loader)). Unfortunately, we were hitting up against the limits of this approach.

**Problem #1: We were unable to author our CSS Modules in TypeScript.**

When you attempt to write your CSS Modules in TypeScript, you export an entire style sheet object (which then gets converted to a CSS Module by [postcss-js](https://github.com/postcss/postcss-js)).

For example, let's assume we have the following style sheet:

```js
export default {
  '.someClass': {
    color: 'red'
  }
};
```

When importing this file, consumers can only see a flat `styles` object, which is notably different to the object that was exported.

```js
import styles from './styles.css.js';

styles.someClass; // 'GENERATED_CLASS_NAME'
```

The TypeScript compiler can't make sense of this without an understanding of the transformation happening within webpack. When looking at the raw source code, this doesn't make sense from a type perspective.

As a result, even though the rest of our project was now written in TypeScript, we were forced to keep our CSS written in JavaScript. As a workaround, we generated TypeScript declaration files (via our own [css-modules-typescript-loader](https://github.com/seek-oss/css-modules-typescript-loader)), but it was less than ideal.

**Problem #2: CSS Modules only provided a single flat namespace to work with.**

We were generating themed collections of utility classes and wanted to export multiple namespaces from a single file, e.g. `paddingTop`, `background`, `color`, etc.

We were forced to manually namespace properties with underscores, which required a lot of boilerplate code to convert these into nested data structures (e.g. converting `paddingTop_large` into `paddingTop.large`).

TypeScript made this particularly painful because we also had to maintain type definitions for these extra translation steps.

**Potential solution: Runtime CSS-in-JS?**

At this point we talked about migrating to a runtime CSS-in-JS library like [styled-components](https://www.styled-components.com) or [Emotion](https://emotion.sh/). In fact, if we were starting from scratch, it's likely we would have simply reached for one of these libraries. That certainly would have solved our immediate problems.

However, we weren't starting from scratch. Instead, we were beginning to roll out our new design system to an existing, well-established ecosystem that had grown accustomed to the technical tradeoffs and runtime characteristics of CSS Modules.

Some of our projects are particularly sensitive to changes in bundle size and runtime performance, and we didn't want to negatively impact these projects from the outside. Some of our projects are even shipped as standalone JavaScript widgets into external codebases. We wanted to be sure that our new design system wouldn't come with a noticeable change in footprint.

We did leave the door open to adopting this architecture in the future, but decided that we wanted to see how far we could go with our current set of tradeoffs.

**Potential solution: Static CSS-in-JS?**

The next step for us was to investigate libraries like [Linaria](https://linaria.now.sh/) and [Astroturf](https://github.com/4Catalyzer/astroturf), which are both really interesting attempts at getting the best of both worlds—CSS-in-JS without the runtime overhead.

Unfortunately, neither of them quite fit our particular needs.

[Astroturf](https://github.com/4Catalyzer/astroturf) is a really lean solution to this problem, essentially supporting CSS Modules and standard preprocessors within JavaScript template literals. That makes it much more ergonomic than more traditional approaches, but it also inherits all of the limitations we were experiencing with CSS Modules.

[Linaria](https://linaria.now.sh/) looked a lot more promising due to its theming support, but it came with an important caveat. Theming is achieved via CSS custom properties (i.e. CSS variables), which means that legacy browsers like IE11 are not supported. This simply wasn't an option for us.

**Potential solution: Something new?**

As a result, we started talking about alternative ideas. Something that could offer the theming ability of Linaria, but without the reliance on CSS variables. Something that could offer the runtime characteristics of CSS Modules, while feeling like regular JavaScript (or, in our case, TypeScript).

That's when the early ideas for treat started to emerge.

Early API designs looked promising, and initial prototypes proved that the concept could be supported by webpack. We decided to start investing in this approach—slowly at first, but ramping up as it started to further prove itself.

We continued to refine treat over several months while we simultaneously worked on Braid, with the development of one supporting the other. The code in Braid was now much more maintainable than it was before, and treat ultimately shipped to production, supporting real applications, with only a couple of minor hiccups along the way.

After using treat internally for a considerable amount of time, we decided we were finally ready to share treat with the world—and here you are! 😎

## Thanks

**[Johannes Ewald](https://twitter.com/Jhnnns)** for letting us have the `treat` name on npm.

**Nathan Nam Tran** for creating [css-in-js-loader](https://github.com/ntharim/css-in-js-loader), which served as the initial starting point for our approach.

**[SEEK](https://www.seek.com.au)** for giving us the space to do interesting work.
