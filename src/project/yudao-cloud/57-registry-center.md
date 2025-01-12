---
title: 注册中心 Nacos
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 59
---
# 注册中心 Nacos

项目使用 Nacos 作为配置中心，实现服务的注册发现。

 ![服务列表](https://cloud.iocoder.cn/img/%E6%B3%A8%E5%86%8C%E4%B8%AD%E5%BF%83/%E6%9C%8D%E5%8A%A1%E5%88%97%E8%A1%A8.png)

 ## [#](#_1-搭建-nacos-server) 1. 搭建 Nacos Server

 ① 参考[《芋道 Nacos 极简入门》  (opens new window)](https://www.iocoder.cn/Nacos/install/?qun)文章的「2. 单机部署（最简模式）」或「3. 单机部署（基于 MySQL 数据库）」小节。

 ② 点击 Nacos 控制台的 [命名空间] 菜单，创建一个 ID 和名字都为 `dev` 的命名空间，稍后会使用到。如下图所示：

 ![命名空间](https://cloud.iocoder.cn/img/%E6%B3%A8%E5%86%8C%E4%B8%AD%E5%BF%83/%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4.png)

 注意！新建命名空间时，它的“命名空间ID”、“命名空间名”都要是 `dev` 噢！！！

 ## [#](#_2-项目接入-nacos) 2. 项目接入 Nacos

 友情提示：以 yudao-module-system 服务为例子。

 ### [#](#_2-1-引入依赖) 2.1 引入依赖

 在 `yudao-module-system-biz` 模块的 [`pom.xml`  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-biz/pom.xml) 中，引入 Nacos 对应的依赖。如下所示：

 
```
<!-- Registry 注册中心相关 -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>

```
### [#](#_2-2-添加配置) 2.2 添加配置

 在 [`application-local.yaml`  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-biz/src/main/resources/application-local.yaml#L9-L13) 中，添加 `nacos.config` 配置。如下所示：

 
```
--- #################### 注册中心相关配置 ####################

spring:
  cloud:
    nacos:
      server-addr: 127.0.0.1:8848 # Nacos 服务器地址
      username: # Nacos 账号
      password: # Nacos 密码
      discovery: # 【配置中心】配置项
        namespace: dev # 命名空间。这里使用 dev 开发环境
        group: DEFAULT_GROUP # 使用的 Nacos 配置分组，默认为 DEFAULT_GROUP
        metadata:
          version: 1.0.0 # 服务实例的版本号，可用于灰度发布

```
* `spring.cloud.nacos.discovery.namespace` 配置项：设置为 `dev`，就是刚创建的命名空间

 ### [#](#_2-3-启动项目) 2.3 启动项目

 运行 SystemServerApplication 类，将 `system-server` 服务启动。

 然后，在 Nacos 控制台的 [服务管理 -> 服务列表] 菜单，就可以看到该服务实例。如下图所示：

 ![system-server服务实例](https://cloud.iocoder.cn/img/%E6%B3%A8%E5%86%8C%E4%B8%AD%E5%BF%83/system-server%E6%9C%8D%E5%8A%A1%E5%AE%9E%E4%BE%8B.png)

