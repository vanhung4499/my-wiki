---
title: 配置中心 Nacos
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 52
---
# 配置中心 Nacos

## [#](#_1-配置中心-nacos) 1. 配置中心 Nacos

 项目使用 Nacos 作为配置中心，实现配置的动态管理。

 ### [#](#_1-1-搭建-nacos-server) 1.1 搭建 Nacos Server

 ① 参考[《芋道 Nacos 极简入门》](https://www.iocoder.cn/Nacos/install/?qun)文章的「2. 单机部署（最简模式）」或「3. 单机部署（基于 MySQL 数据库）」小节。

 ② 点击 Nacos 控制台的 [命名空间] 菜单，创建一个 ID 和名字都为 `dev` 的命名空间，稍后会使用到。如下图所示：

 ![命名空间](https://cloud.iocoder.cn/img/%E6%B3%A8%E5%86%8C%E4%B8%AD%E5%BF%83/%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4.png)

 ### [#](#_1-2-项目接入-nacos) 1.2 项目接入 Nacos

 友情提示：以 yudao-module-system 服务为例子。

 #### [#](#_1-2-1-引入依赖) 1.2.1 引入依赖

 在 `yudao-module-system-biz` 模块的 [`pom.xml`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-biz/pom.xml) 中，引入 Nacos 对应的依赖。如下所示：


```
<!-- Spring Cloud 基础 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>

<!-- Config 配置中心相关 -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>

```
#### [#](#_1-2-2-添加配置) 1.2.2 添加配置

 在 [`bootstrap-local.yaml`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-biz/src/main/resources/bootstrap-local.yaml#L12-L23) 中，添加 `nacos.config` 配置。如下所示：


```
--- #################### 配置中心相关配置 ####################

spring:
  cloud:
    nacos:
      # Nacos Config 配置项，对应 NacosConfigProperties 配置属性类
      config:
        server-addr: 127.0.0.1:8848 # Nacos 服务器地址
        namespace: dev # 命名空间。这里使用 dev 开发环境
        group: DEFAULT_GROUP # 使用的 Nacos 配置分组，默认为 DEFAULT_GROUP
        name: # 使用的 Nacos 配置集的 dataId，默认为 spring.application.name
        file-extension: yaml # 使用的 Nacos 配置集的 dataId 的文件拓展名，同时也是 Nacos 配置集的配置格式，默认为 properties

```
* `spring.cloud.nacos.config.namespace` 配置项：设置为 `dev`，就是刚创建的命名空间

 #### [#](#_1-2-3-配置管理) 1.2.3 配置管理

 ① 参考[《芋道 Spring Cloud Alibaba 配置中心 Nacos 入门 》](https://www.iocoder.cn/Spring-Cloud-Alibaba/Nacos-Config/?qun)文档，学习 Nacos 配置中心的使用。

 ② 按照需要，将不同环境存在差异的 [`application-local.yaml`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-biz/src/main/resources/application-local.yaml) 和 [`application-dev.yaml`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-biz/src/main/resources/application-dev.yaml) 中的配置，迁移到 Nacos 配置中心。

 *一般情况下，不建议将 `application.yaml` 中的配置，迁移到 Nacos 配置中心。因为 `application.yaml` 中的配置，是通用的配置，无需动态管理。*

 疑问：为什么项目中的 `application-{env}.yaml` 中的配置，没有放到 Nacos 配置中心中？

 主要考虑大家 [《快速启动》](/quick-start) 可以更简单。

 实际项目中，是建议放到 Nacos 配置中心，进行配置的动态管理的。

 操作过程中，可能会碰到的问题：

 * [IdTypeEnvironmentPostProcessor 与 Nacos 配置中心加载顺序问题](https://gitee.com/zhijiantianya/yudao-cloud/issues/I5W2N0)

 ## [#](#_2-配置管理) 2. 配置管理

 友情提示：该功能是从 Boot 项目延用到 Cloud 项目，一般情况下不会使用到，使用 Nacos 管理配置即可。

 在 [基础设施 -> 配置管理] 菜单，可以查看和管理配置，适合业务上需要动态的管理某个配置。

 例如说：创建用户时，需要配置用户的默认密码，这个密码是不会变的，但是有时候需要修改这个默认密码，这个时候就可以通过配置管理来修改。

 ![配置中心](https://cloud.iocoder.cn/img/%E9%85%8D%E7%BD%AE%E4%B8%AD%E5%BF%83/01.png)

 对应的后端代码是 `yudao-module-infra` 的 [`config`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-infra/yudao-module-infra-biz/src/main/java/cn/iocoder/yudao/module/infra/service/config/) 业务模块。

 ### [#](#_2-1-配置的表结构) 2.1 配置的表结构

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

 ### [#](#_2-2-后端案例) 2.2 后端案例

 TODO 芋艿：待补充

 ### [#](#_2-3-前端案例) 2.3 前端案例

 后端提供了 [`/admin-api/infra/config/get-value-by-key`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-infra/yudao-module-infra-biz/src/main/java/cn/iocoder/yudao/module/infra/controller/admin/config/ConfigController.java#L70-L82) RESTful API 接口，返回指定配置项的值。前端的使用示例如下图：

 ![前端案例](https://cloud.iocoder.cn/img/%E9%85%8D%E7%BD%AE%E4%B8%AD%E5%BF%83/07-vue3.png)
