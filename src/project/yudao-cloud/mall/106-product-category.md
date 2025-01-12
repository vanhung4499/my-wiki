---
title: 【商品】商品分类
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 108
---
# 【商品】商品分类

## [#](#_1-表结构) 1. 表结构

 商品分类，由 `yudao-module-product-biz` 后端模块的 `category` 包实现。表结构如下：

 
> 省略 creator/create\_time/updater/update\_time/deleted/tenant\_id 等通用字段

 
```
CREATE TABLE `product_category` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '分类编号',
  `parent_id` bigint NOT NULL COMMENT '父分类编号',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类名称',
  `pic_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '移动端分类图',
  `sort` int DEFAULT '0' COMMENT '分类排序',
  `status` tinyint NOT NULL COMMENT '开启状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类';

```
① 分类目前支持 2 级分类，即 `parent_id` 为 0 的是一级分类，否则是二级分类。

 ② `pic_url` 分类图片，一级、二级分类都需要设置。

 ## [#](#_2-管理后台) 2. 管理后台

 对应 [商城系统 -> 商品中心 -> 商品分类] 菜单，对应 `yudao-ui-admin-vue3` 项目的 `@/views/mall/product/category` 目录。

 ![管理后台 - 商品分类](https://cloud.iocoder.cn/img/%E5%95%86%E5%9F%8E%E6%89%8B%E5%86%8C/%E5%95%86%E5%93%81%E5%88%86%E7%B1%BB/%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0-%E5%95%86%E5%93%81%E5%88%86%E7%B1%BB.png)

 ## [#](#_3-移动端) 3. 移动端

 对应 uni-app 底部的 [分类] 导航，对应 `yudao-mall-uniapp` 项目的 `pages/index/category.vue` 页面。

 ![移动端 - 商品分类](https://cloud.iocoder.cn/img/%E5%95%86%E5%9F%8E%E6%89%8B%E5%86%8C/%E5%95%86%E5%93%81%E5%88%86%E7%B1%BB/%E7%A7%BB%E5%8A%A8%E7%AB%AF-%E5%95%86%E5%93%81%E5%88%86%E7%B1%BB.png)

 分类目前有 `first_one`、`first_two`、`second_one` 三种展示风格，可以手动进行修改。如下图所示：

 ![移动端 - 商品分类 - 展示样式](https://cloud.iocoder.cn/img/%E5%95%86%E5%9F%8E%E6%89%8B%E5%86%8C/%E5%95%86%E5%93%81%E5%88%86%E7%B1%BB/%E7%A7%BB%E5%8A%A8%E7%AB%AF-%E5%95%86%E5%93%81%E5%88%86%E7%B1%BB-%E5%B1%95%E7%A4%BA%E6%A0%B7%E5%BC%8F.png)

