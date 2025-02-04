---
title: 功能开启
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 146
---
# 功能开启

[微信公众号  (opens new window)](https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html)的功能，由 [`yudao-module-mp`  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-mp/) 模块实现，对应前端代码为 [`@/views/mp`  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue2/tree/master/src/views/mp) 目录。

 主要包括如下 10 个功能（菜单）：

 ![功能列表](https://cloud.iocoder.cn/img/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/%E5%8A%9F%E8%83%BD%E5%88%97%E8%A1%A8.png)

 

| 功能 | 描述 |
| --- | --- |
| 账号管理 | 配置接入的微信公众号，可支持多个公众号 |
| 数据统计 | 统计公众号的用户增减、累计用户、消息概况、接口分析等数据 |
| 粉丝管理 | 查看已关注、取关的粉丝列表，可对粉丝进行同步、打标签等操作 |
| 消息管理 | 查看粉丝发送的消息列表，可主动回复粉丝消息 |
| 自动回复 | 自动回复粉丝发送的消息，支持关注回复、消息回复、关键字回复 |
| 标签管理 | 对公众号的标签进行创建、查询、修改、删除等操作 |
| 菜单管理 | 自定义公众号的菜单，也可以从公众号同步菜单 |
| 素材管理 | 管理公众号的图片、语音、视频等素材，支持在线播放语音、视频 |
| 图文草稿箱 | 新增常用的图文素材到草稿箱，可发布到公众号 |
| 图文发表记录 | 查看已发布成功的图文素材，支持删除操作 |

 

---

 只需要启动 `yudao-module-mp` 服务，就可以使用公众号的功能。步骤如下：

 * 第一步，导入公众号的 SQL 数据库脚本
* 第二步，启动服务，确认功能是否生效

 ## [#](#_1-第一步-导入-sql) 1. 第一步，导入 SQL

 点击 [`mp-2024-01-05.sql.zip`  (opens new window)](https://t.zsxq.com/15fQYbLxU) 下载附件，解压出 SQL 文件，然后导入到数据库中。 如下图所示：

 友情提示：↑↑↑ mp.sql 是可以点击下载的！ ↑↑↑

 ![导入数据库](https://cloud.iocoder.cn/img/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/%E7%AC%AC%E4%BA%8C%E6%AD%A5-01.png)

 以 `mp_` 作为前缀的表，就是公众号模块的表。

 ## [#](#_2-第二步-启动服务) 2. 第二步，启动服务

 ① 运行该服务的 [MpServerApplication  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-mp/yudao-module-mp-biz/src/main/java/cn/iocoder/yudao/module/mp/MpServerApplication.java) 启动类，看到 `"Started MpServerApplication in 18.105 seconds"` 说明开启成功。

 ② 然后，访问前端的公众号菜单，确认功能是否生效。如下图所示：

 ![确认功能是否生效](https://cloud.iocoder.cn/img/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/%E7%AC%AC%E4%B8%89%E6%AD%A5-01.png)

 至此，我们就成功开启了公众号的功能 🙂

