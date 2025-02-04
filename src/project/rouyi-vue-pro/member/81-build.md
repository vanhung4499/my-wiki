---
title: 功能开启
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 83
---
# 功能开启

## [#](#_1-概述) 1. 概述

 会员中心，围绕“会员”建设，包括会员用户、VIP 等级、经验、积分、签到等一系列的功能。

 疑问：什么是会员？

 对于管理系统来说，管理员是它的用户，也就是项目中的 `system_users` 表

 而对于商城、论坛、博客等前台系统来说，会员是它的用户，也就是会员中心的 `member_user` 表。

 ## [#](#_2-后端启动) 2. 后端启动

 考虑到编译速度，默认 `yudao-module-member` 模块是关闭的，需要手动开启。步骤如下：

 * 第一步，开启 `yudao-module-member` 模块
* 第二步，导入会员的 SQL 数据库脚本
* 第三步，重启后端项目，确认功能是否生效

 ### [#](#_2-1-开启模块) 2.1 开启模块

 ① 修改根目录的 [`pom.xml`  (opens new window)](https://github.com/YunaiV/ruoyi-vue-pro/blob/master/pom.xml) 文件，取消 `yudao-module-member` 模块的注释。如下图所示：

 ![取消  模块的注释](https://doc.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/%E5%BC%95%E5%85%A5%E6%A8%A1%E5%9D%9701.png)

 ② 修改 `yudao-server` 目录的 [`pom.xml`  (opens new window)](https://github.com/YunaiV/ruoyi-vue-pro/blob/master/yudao-server/pom.xml) 文件，引入 `yudao-module-member` 模块。如下图所示：

 ![引入  模块](https://doc.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/%E5%BC%95%E5%85%A5%E6%A8%A1%E5%9D%9702.png)

 ③ 点击 IDEA 右上角的【Reload All Maven Projects】，刷新 Maven 依赖。如下图所示：

 ![刷新 Maven 依赖](https://doc.iocoder.cn/img/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/%E7%AC%AC%E4%B8%80%E6%AD%A5-03.png)

 ### [#](#_2-2-第二步-导入-sql) 2.2 第二步，导入 SQL

 点击 [`member-2024-01-18.sql.zip`  (opens new window)](https://t.zsxq.com/16XkmImMO) 下载附件，解压出 SQL 文件，然后导入到数据库中。

 友情提示：↑↑↑ member.sql 是可以点击下载的！ ↑↑↑

 ### [#](#_2-3-第三步-重启项目) 2.3 第三步，重启项目

 重启后端项目，然后访问前端的会员菜单，确认功能是否生效。如下图所示：

 ![确认功能是否生效](https://doc.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0.png)

 至此，我们就成功开启了会员中心的功能 🙂

 ## [#](#_3-前端-商城-启动) 3. 前端（商城）启动

 可阅读 [《商城 - 功能开启》](/mall/build/) 文档，目前商城 uni-app 接入会员中心进行购物。

