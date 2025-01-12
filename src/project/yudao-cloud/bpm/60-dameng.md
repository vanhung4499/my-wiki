---
title: 工作流（达梦适配）
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 62
---
# 工作流（达梦适配）

友情提示：

 本文参考 [《Flowable6.8(6.x 版本通用)整合集成达梦 8 数据库(DM8)详解，解决自动生成表时 dmn 相关表语法报错问题》  (opens new window)](https://blog.csdn.net/TangBoBoa/article/details/130392495) 博客，由开发者（微信号 `barry82`）所贡献！

 ## [#](#_1-覆盖-flowable-liquibase-相关代码) 1. 覆盖 Flowable Liquibase 相关代码

 把项目的 `sql/dm/flowable-patch/src` 下的文件，复制到 `yudao-module-bpm-biz` 项目的 `src` 目录中。

 ## [#](#_2-关于-flowable-database-schema-update-配置) 2. 关于 flowable.database-schema-update 配置

 ① 首次运行，全局搜 `flowable.database-schema-update` 配置项，修改为 `true`，以便生成 Flowable 数据库表。

 ② 再次运行，全局搜 `flowable.database-schema-update` 配置项，修改为 `false`，避免如下报错：

 
```
Object [FLW_EV_DATABASECHANGELOG] already exists

```


---

 ps：😭 MacBook 从 Intel 平台迁移到 M1 平台，达梦数据库的环境坏了，先暂时把相关的操作写到文档里，算是给大家做适配一个方向！
