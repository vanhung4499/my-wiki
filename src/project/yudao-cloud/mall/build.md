---
title: 功能开启
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 93
---
# 功能开启

进度说明：

 ① 项目地址：

 * uni-app 商城前端，已经基于 Vue3 重构，对应 [https://gitee.com/yudaocode/yudao-mall-uniapp](https://gitee.com/yudaocode/yudao-mall-uniapp) 仓库的 `master` 分支
* 管理后台，请使用 [https://gitee.com/yudaocode/yudao-ui-admin-vue3](https://gitee.com/yudaocode/yudao-ui-admin-vue3) 仓库的 `master` 分支
* 后端项目，请使用 [https://gitee.com/zhijiantianya/yudao-cloud](https://gitee.com/zhijiantianya/yudao-cloud) 仓库的 `master`（JDK8） 或 `master-jdk17`（JDK17/21） 分支

 ② 项目进展：

 * 主流程，已经跑通，用户登录、商品信息、订单流程、支付流程、退款流程、店铺装修、优惠劵、秒杀、积分、签到、会员 VIP 等等，可以尝试生产使用
* 非主流程，继续优化，主要是拼团、砍价、分销的 uni-app 部分（后端已经完成），期望是年前搞完
 商城的功能，由三部分代码组成：

 ![功能图](https://cloud.iocoder.cn/img/common/mall-feature.png)

 * 后端实现，对应 [`yudao-module-mall`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-mall/) 模块
* 管理后台，对应 [`@/views/mall`](https://github.com/yudaocode/yudao-ui-admin-vue3/tree/master/src/views/mall) 目录
* 用户前台，对应 [https://github.com/yudaocode/yudao-mall-uniapp](https://github.com/yudaocode/yudao-mall-uniapp) 项目

 ![功能图](https://cloud.iocoder.cn/img/common/mall-preview.png)

 ## [#](#_1-功能介绍) 1. 功能介绍

 主要拆分四大模块：商品中心、交易中心、营销中心、会员中心。如下图所示：

 ![功能列表](https://cloud.iocoder.cn/img/%E5%95%86%E5%9F%8E%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/%E7%AC%AC%E4%B8%89%E6%AD%A5-01.png)

 ## [#](#_2-后端开启) 2. 后端开启

 友情提示：

 ① 商城使用到支付，所以需要参考 [《支付手册》](/pay/build) 文档，将支付功能开启。

 ② 商城使用到会员，所以需要参考 [《会员手册》](/member/build) 文档，将会员功能开启。

 只需要启动 `yudao-module-member` 下的 4 个 product、trade、promotion、statistics 服务，就可以使用商城的功能。步骤如下：

 * 第二步，导入商城的 SQL 数据库脚本
* 第三步，启动 4 个服务，确认功能是否生效

 ### [#](#_2-1-第一步-导入-sql) 2.1 第一步，导入 SQL

 点击 [`mall-2024-01-17.sql.zip`](https://t.zsxq.com/15mDotnaB) 下载附件，解压出 SQL 文件，然后导入到数据库中。

 友情提示：↑↑↑ mall.sql 是可以点击下载的！ ↑↑↑

 ### [#](#_2-2-第二步-启动服务) 2.2 第二步，启动服务

 ① 运行 product 服务的 [ProductServerApplication](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-mall/yudao-module-product-biz/src/main/java/cn/iocoder/yudao/module/product/ProductServerApplication.java) 启动类，看到 `"Started ProductServerApplication in 5.131 seconds (JVM running for 5.412)"` 说明开启成功。

 ② 运行 trade 服务的 [TradeServerApplication](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-mall/yudao-module-product-biz/src/main/java/cn/iocoder/yudao/module/product/ProductServerApplication.java) 启动类，看到 `"Started TradeServerApplication in 7.154 seconds (JVM running for 7.467)"` 说明开启成功。

 ③ 运行 promotion 服务的 [PromotionServerApplication](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-mall/yudao-module-trade-biz/src/main/java/cn/iocoder/yudao/module/trade/TradeServerApplication.java) 启动类，看到 `"Started PromotionServerApplication in 5.88 seconds (JVM running for 6.189)"` 说明开启成功。

 ④ 运行 statistics 服务的 [StatisticsServerApplication](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-mall/yudao-module-promotion-biz/src/main/java/cn/iocoder/yudao/module/promotion/PromotionServerApplication.java) 启动类，看到 `"Started StatisticsServerApplication in 5.369 seconds (JVM running for 5.669)"` 说明开启成功。

 ⑤ 然后，访问前端的商城菜单，确认功能是否生效。如下图所示：

 ![确认功能是否生效](https://cloud.iocoder.cn/img/%E5%95%86%E5%9F%8E%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/%E7%AC%AC%E4%B8%89%E6%AD%A5-01.png)

 至此，我们就成功开启了商城的功能 🙂

 ## [#](#_3-前端开启) 3. 前端开启

 参考 [《快速启动（前端项目）》](/quick-start-front/) 文档的「2. uni-app 商城移动端」小节。

 ## [#](#_4-推荐阅读) 4. 推荐阅读

 微信公众号相关：

 * [《微信公众号登录》](/member/weixin-mp-login/)
* [《微信公众号支付接入》](/pay/wx-pub-pay-demo/)

 微信小程序相关：

 * [《微信小程序登录》](/member/weixin-lite-login/)
* [《微信小程序支付接入》](/pay/wx-lite-pay-demo/)
