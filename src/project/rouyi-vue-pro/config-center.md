---
title: 配置管理
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 51
---
# 配置管理

在 [基础设施 -> 配置管理] 菜单，可以查看和管理配置，适合业务上需要动态的管理某个配置。

 例如说：创建用户时，需要配置用户的默认密码，这个密码是不会变的，但是有时候需要修改这个默认密码，这个时候就可以通过配置管理来修改。

 ![配置中心](https://doc.iocoder.cn/img/%E9%85%8D%E7%BD%AE%E4%B8%AD%E5%BF%83/01.png)

 对应的后端代码是 `yudao-module-infra` 的 [`config`](https://github.com/YunaiV/ruoyi-vue-pro/blob/master/yudao-module-infra/yudao-module-infra-biz/src/main/java/cn/iocoder/yudao/module/infra/service/config/) 业务模块。

 ## [#](#_1-配置的表结构) 1. 配置的表结构

 `infra_config` 的表结构如下：


```
CREATE TABLE `infra_config` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '参数主键',
  `group` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '参数分组',
  `type` tinyint NOT NULL COMMENT '参数类型',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '参数名称',
  `key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '参数键名',
  `value` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '参数键值',
  `sensitive` bit(1) NOT NULL COMMENT '是否敏感',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='参数配置表';

```
* `key` 字段，对应到 Spring Boot 配置文件的配置项，例如说 `yudao.captcha.enable`、`sys.user.init-password` 等等。

 ## [#](#_3-后端案例) 3. 后端案例

 TODO 芋艿：待补充

 ## [#](#_4-前端案例) 4. 前端案例

 后端提供了 [`/admin-api/infra/config/get-value-by-key`](https://github.com/YunaiV/ruoyi-vue-pro/blob/master/yudao-module-infra/yudao-module-infra-biz/src/main/java/cn/iocoder/yudao/module/infra/controller/admin/config/ConfigController.java#L70-L82) RESTful API 接口，返回指定配置项的值。前端的使用示例如下图：

 ![前端案例](https://doc.iocoder.cn/img/%E9%85%8D%E7%BD%AE%E4%B8%AD%E5%BF%83/07-vue2.png)
