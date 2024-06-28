---
date: 2023-3-14 21:45:45
icon: info
sidebar: false
category:
  - Blog
tag:
  - Blog
---
# About this site

:::: info ✨📒
Record the process of building this site, and share some thoughts and experiences.
::::

## Introduction

My previous wiki was built with [Quartz](https://quartz.jzhao.xyz/), which is a publish tool for obsidian nots. I have been using it for a long time, but I found that it is not very convenient to share and search because of the navigation and the structure of the page. So I need to find a better alternative.

After some searching on github, I found some good-looking wiki/blog sites. I tried some of them then the last choice of me is [VuePress](https://v2.vuepress.vuejs.org/zh/), which is a static site generator based on Vue.js. It is very easy to use and has a lot of plugins and themes. I chose the [vuepress-theme-hope](https://theme-hope.vuejs.press/zh/) theme, which is very beautiful and has a lot of features.

And I found a customized of hope theme, which is [https://github.com/OrageKK/oragekk.github.io](https://github.com/OrageKK/oragekk.github.io), It is very beautiful and has a lot of features. So I forked it and made some changes to fit my needs. Thanks to the author for the great work.

## Markdown Enhancement

The Markdown effect of the hope theme is surprisingly good, and it supports many features that ordinary Markdown does not, such as custom containers, code blocks with tabs, and the most convenient feature of being able to write flowcharts directly. It also allows for optional highlight themes (the code highlighting on this site is based on shikiPlugin, which, although not as lightweight and efficient as the default prismjs, provides more accurate syntax highlighting). For specific effects, see here ☞ [Markdown Enhance](https://theme-hope.vuejs.press/guide/markdown/intro.html).

## Project Structure

```shell
.
├── .github
│   ├── ISSUE_TEMPLATE # Issue templates
│   │   └── bug-report.yml
│   └── workflows
│       └── deploy-docs.yml # Deployment script
├── CNAME
├── LICENSE
├── README.md
├── api
│   └── proxy.js # Cross-origin proxy
├── env.d.ts
├── package.json
├── pnpm-lock.yaml
├── script
│   ├── requirements.txt
│   └── submit.py # GitHub Actions script for submitting URLs
├── src
│   ├── .vuepress
│   │   ├── client.ts # Client configuration file
│   │   ├── components
│   │   │   ├── MyCoverLink.vue # Friend link component
│   │   │   └── Mylink.vue # Card component
│   │   ├── config.ts # VuePress configuration file
│   │   ├── data # Data
│   │   ├── navbar
│   │   ├── plugins
│   │   │   ├── vuepress-plugin-canvas
│   │   │   ├── vuepress-plugin-gradient-cover
│   │   │   ├── vuepress-plugin-hitokoto
│   │   │   ├── vuepress-plugin-live2DAssist
│   │   │   └── vuepress-plugin-popper
│   │   ├── public
│   │   │   ├── assets # Resources
│   │   ├── sidebar
│   │   ├── styles
│   │   ├── theme
│   │   │   ├── api
│   │   │   │   └── bing.ts # Bing daily wallpaper
│   │   │   ├── components # Custom components
│   │   │   ├── index.ts
│   │   │   ├── layouts # Custom layouts
│   │   │   └── utils
│   │   │       ├── busuanzi.pure.js # Busuanzi statistics
│   │   │       └── time.ts # Runtime
│   │   └── theme.ts # Theme configuration file
│   └── README.md
├── tsconfig.json
└── vercel.json # Vercel configuration file
```

## Framework Support

[vuepress2.x](https://v2.vuepress.vuejs.org/)

## Theme Support

[vuepress-theme-hope](https://theme-hope.vuejs.press/)

## Markdown Editor

I use [Obsidian](https://obsidian.md/) to write markdown files, which is a very powerful markdown editor. It supports many features such as graph view, backlinks, and plugins. I highly recommend it.

To work along with VuePress, you only need create a new vault in `src` folder, and then you can write markdown files in it.

::: tip
When you create a new vault, an `.obsidian` will be created in the `src` directory, this is Obsidian configs and plugins folder. You can ignore it in the `.gitignore` file to avoid uploading it to the repository.
:::

## Customization

I have customized the original theme as follows. The main customizations are divided into:

1. **Custom Layouts**
   - `NotFound.vue`
   - `Layout.vue` (added a donation component)
   - `News.vue` (layout for news list)

2. **Custom Components**
   - `BlogHero.vue`
   - `PageFooter.vue`
   - `Sponsor.vue` (donation component) // Not used in my site
   - `NewsList.vue` (news list)
   - `NewsItem.vue` (news item)

3. **Local Plugin Development**
   - `vuepress-plugin-canvas` (supports two types of dynamic backgrounds: rainbow background and geometric shapes)
   - `vuepress-plugin-gradient-cover` (background overlay)
   - `vuepress-plugin-hitokoto` (Hitokoto plugin) // Not used in my site
   - `vuepress-plugin-live2DAssist` (assistant for Live2D; hides on pages with sidebars to avoid obstruction)
   - `vuepress-plugin-popper` (mouse effect, based on [@moefy-canvas/theme-popper](https://github.com/moefyit/moefy-canvas))

4. **External Content References**
   - [vuepress-plugin-oh-my-live2d](https://github.com/oh-my-live2d/vuepress-plugin-oh-my-live2d) (Live2D plugin)
   - Busuanzi statistics
   - [@moefy-canvas/theme-popper](https://github.com/moefyit/moefy-canvas) (original plugin only supported VuePress 1.x, developed a localized plugin to support VuePress 2.x)
   - [@vuepress/plugin-google-analytics](https://v2.vuepress.vuejs.org/zh/reference/plugin/google-analytics.html) (supports Google Analytics 4, which replaces the old UA)

5. **Configuration Content**
   - Navbar
   - Sidebar
   - Comments using [Waline](https://waline.js.org/)
   - Search using [vuepress-plugin-search-pro](https://plugin-search-pro.vuejs.press/)
   - Enabled copyright plugin
   - Feed RSS plugin
   - Added article type - "News"; added image preview selector for news markdown images

6. **Miscellaneous**
   - Runtime statistics
   - CSS beautification
   - Introduced fonts: PinYu Handwriting, XiaXingKai
   - Added custom emojis for Waline and modified the display style
   - Personalized log
   - Automatically push new article URLs to search engines (Baidu, Bing, Google) 👉 [Detailed Configuration](/platform/github/github-action)

## Conclusion

> This is an ongoing project, with continuous optimization.
>
> Local plugins are available for anyone interested. The source code is open; click the GitHub icon in the top right corner to access it. And don't forget to leave a star! 🌟

