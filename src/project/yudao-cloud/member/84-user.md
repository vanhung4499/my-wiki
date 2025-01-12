---
title: 会员用户、标签、分组
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 86
---
# 会员用户、标签、分组

本小节，我们主要看看会员用户、标签、分组相关的表。如下图所示：

 ![表关系](https://cloud.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E4%BC%9A%E5%91%98%E7%94%A8%E6%88%B7/%E8%A1%A8%E5%85%B3%E7%B3%BB.png)

 ## [#](#_1-会员用户) 1. 会员用户

 会员用户，由 MemberUserService 实现。

 ### [#](#_1-1-表结构) 1.1 表结构

 
> 省略 creator/create\_time/updater/update\_time/deleted/tenant\_id 等通用字段

 
```
CREATE TABLE `member_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号',
  `mobile` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '手机号',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '密码',
  `status` tinyint NOT NULL COMMENT '状态',
  `register_ip` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '注册 IP',
  `register_terminal` tinyint DEFAULT NULL COMMENT '注册终端',
  `login_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '最后登录IP',
  `login_date` datetime DEFAULT NULL COMMENT '最后登录时间',
  `nickname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '用户昵称',
  `avatar` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '头像',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '真实名字',
  `sex` tinyint DEFAULT '0' COMMENT '用户性别',
  `area_id` bigint DEFAULT NULL COMMENT '所在地',
  `birthday` datetime DEFAULT NULL COMMENT '出生日期',
  `mark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '会员备注',
  
  `tag_ids` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户标签编号列表，以逗号分隔',
  `group_id` bigint DEFAULT NULL COMMENT '用户分组编号',
  
  `level_id` bigint DEFAULT NULL COMMENT '等级编号',
  `experience` int NOT NULL DEFAULT '0' COMMENT '经验',
  
  `point` int NOT NULL DEFAULT '0' COMMENT '积分',

  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=286 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='会员用户';

```
① `id` 到 `mark` 字段，是用户的基本信息。

 ② `tag_ids` 字段，是用户的标签编号列表，以逗号分隔。由于会员标签暂时没有大的业务需求，所以暂时没有独立关联表。

 `group_id` 字段，是用户的分组编号。目前也没有大的用途。

 ③ 【会员等级】`level_id` 字段，是用户的 VIP 等级编号。`experience` 字段，是用户的经验值。相关的内容，可见 [《会员等级、积分、签到》](/member/level/) 文档。

 ④ 【会员积分】`point` 字段，是用户的积分。相关的内容，可见 [《会员等级、积分、签到》](/member/level/) 文档。

 ### [#](#_1-2-管理后台) 1.2 管理后台

 ① 对应 [会员系统 -> 会员中心 -> 会员列表] 菜单，对应 `yudao-ui-admin-vue3` 项目的 `views/member/user/index.vue` 目录。如下图所示：

 ![管理后台 - 列表](https://cloud.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E4%BC%9A%E5%91%98%E7%94%A8%E6%88%B7/%E4%BC%9A%E5%91%98%E7%94%A8%E6%88%B7-%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0-%E5%88%97%E8%A1%A8.png)

 可以给用户「编辑」「发优惠劵」「修改等级」「修改余额」等操作。

 ② 点击「详情」按钮，可以查看该会员用户的基本信息、账户信息、相关明细等。如下图所示：

 ![管理后台 - 详情](https://cloud.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E4%BC%9A%E5%91%98%E7%94%A8%E6%88%B7/%E4%BC%9A%E5%91%98%E7%94%A8%E6%88%B7-%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0-%E8%AF%A6%E6%83%85.png)

 ### [#](#_1-3-移动端) 1.3 移动端

 ① 会员登录，可见 [《微信公众号登录》](/member/weixin-mp-login/)、[《微信小程序登录》](/member/weixin-lite-login/) 文档。

 ② 点击 uni-app 底部的 [我的] 导航，点击顶部头像，进入会员信息界面，对应 `yudao-mall-uniapp` 项目的 `pages/user/info.vue` 页面。如下图所示：

 ![移动端 - 会员信息](https://cloud.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E4%BC%9A%E5%91%98%E7%94%A8%E6%88%B7/%E4%BC%9A%E5%91%98%E7%94%A8%E6%88%B7-%E7%A7%BB%E5%8A%A8%E7%AB%AF-%E4%BC%9A%E5%91%98%E4%BF%A1%E6%81%AF.png)

 ## [#](#_2-会员标签) 2. 会员标签

 会员标签，由 MemberTagService 实现。

 ### [#](#_2-1-表结构) 2.1 表结构

 
> 省略 creator/create\_time/updater/update\_time/deleted/tenant\_id 等通用字段

 
```
CREATE TABLE `member_tag` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '标签名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员标签';

```
### [#](#_2-2-管理后台) 2.2 管理后台

 对应 [会员系统 -> 会员中心 -> 会员标签] 菜单，对应 `yudao-ui-admin-vue3` 项目的 `views/member/tag/index.vue` 目录。如下图所示：

 ![管理后台](https://cloud.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E4%BC%9A%E5%91%98%E7%94%A8%E6%88%B7/%E4%BC%9A%E5%91%98%E6%A0%87%E7%AD%BE-%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0.png)

 ### [#](#_2-3-移动端) 2.3 移动端

 暂时没有移动端的相关操作。

 ## [#](#_3-会员分组) 3. 会员分组

 会员分组，由 MemberGroupService 实现。

 ### [#](#_3-1-表结构) 3.1 表结构

 
> 省略 creator/create\_time/updater/update\_time/deleted/tenant\_id 等通用字段

 
```
CREATE TABLE `member_group` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '名称',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户分组';

```
### [#](#_3-2-管理后台) 3.2 管理后台

 对应 [会员系统 -> 会员中心 -> 会员分组] 菜单，对应 `yudao-ui-admin-vue3` 项目的 `views/member/group/index.vue` 目录。如下图所示：

 ![管理后台](https://cloud.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E4%BC%9A%E5%91%98%E7%94%A8%E6%88%B7/%E4%BC%9A%E5%91%98%E5%88%86%E7%BB%84-%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0.png)

 ### [#](#_3-3-移动端) 3.3 移动端

 暂时没有移动端的相关操作。

