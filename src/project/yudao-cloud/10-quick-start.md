---
title: 快速启动（后端项目）
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 12
---
# 快速启动（后端项目）

目标：使用 IDEA 工具，将后端项目 [yudao-cloud  (opens new window)](https://github.com/YunaiV/yudao-cloud) 运行起来 🛫

 整个过程非常简单，预计 15 分钟就可以完成，取决于大家的网速。

 
> ↓↓↓ 技术交流群，一起苦练技术基本功，每日精进 30 公里！↓↓↓

 ![交流群](https://cloud.iocoder.cn/img/op/mp_yudaoyuanma3.png)

 ## [#](#👍-相关视频教程) 👍 相关视频教程

 * [从零开始 02：在 Windows 环境下，如何运行前后端项目？  (opens new window)](https://t.zsxq.com/07BeiEA6Q)
* [从零开始 03：在 MacOS 环境下，如何运行前后端项目？  (opens new window)](https://t.zsxq.com/07FUNnYFm)

 ## [#](#_1-克隆代码) 1. 克隆代码

 使用 [IDEA  (opens new window)](http://www.iocoder.cn/categories/IDEA/?self) 克隆 [https://github.com/YunaiV/yudao-cloud  (opens new window)](https://github.com/YunaiV/yudao-cloud) 仓库的最新代码，并给该仓库一个 [Star  (opens new window)](https://github.com/YunaiV/yudao-cloud)。

 
> 注意：不建议使用 Eclipse，因为它没有支持 Lombok 和 Mapstruct 插件。

 克隆完成后，耐心等待 Maven 下载完相关的依赖。一定要注意：

 ① 默认情况下，使用 `master` 分支，它对应 JDK 8 + Spring Boot 2.7 版本。

 ② 如果你想体验 JDK 17/21 + Spring Boot 3.2 版本，需要切换到 `master-jdk17` 分支。

 
> 友情提示：项目的每个模块的作用，可见 [《开发指南 —— 项目结构》](/project-intro/) 文档。

 使用的 Spring Cloud 版本较新，所以需要下载一段时间。趁着这个时间，胖友可以给项目添加一个 [Star  (opens new window)](https://github.com/YunaiV/yudao-cloud)，支持下艿艿。

 ![Star 一波](https://cloud.iocoder.cn/img/%E5%90%8E%E7%AB%AF%E6%89%8B%E5%86%8C/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8/Star-Cloud.png)

 ## [#](#_2-apifox-接口工具) 2. Apifox 接口工具

 点击 [Apifox  (opens new window)](http://mtw.so/5NZLsX) 首页，下载对应的 Apifox 桌面版。如下图所示：

 为什么要下载 Apifox 桌面版？

 艿艿已经卸载 Postman，使用 Apifox 进行替代。国产软件，yyds 永远滴神！

 国内很多互联网公司，包括百度、阿里、腾讯、字节跳动等等在内，都在使用 Apifox 作为 API 工具。

 ![Apifox 下载](https://cloud.iocoder.cn/img/%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3/01.png)

 解压后，双击进行安装即可。黑色界面，非常酷炫。

 ![Apifox 界面](https://cloud.iocoder.cn/img/%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3/02.png)

 接口文档？

 阅读 [《开发指南 —— 接口文档》](/api-doc) 呀~~

 ## [#](#_3-基础设施-必选) 3. 基础设施（必选)

 
> 本小节的基础设施【必须】安装，否则项目无法启动。

 ### [#](#_3-1-初始化-mysql) 3.1 初始化 MySQL

 友情提示？

 如果你是 PostgreSQL、Oracle、SQL Server、DM、大金 等其它数据库，也是可以的。

 因为我主要使用 MySQL数据库为主，所以其它数据库的 SQL 文件可能存在滞后，可以加入 [用户群](/qun) 反馈。

 补充说明？

 由于工作较忙，暂时未拆分到多个数据库，可以按照前缀自行处理：

 * `system_` 前缀，属于 `yudao-module-system` 服务
* `infra_` 前缀，属于 `yudao-module-infra` 服务
 项目使用 MySQL 存储数据，所以需要启动一个 MySQL 服务。

 ① 创建一个名字为 `ruoyi-vue-pro` 数据库，**【只要】** 执行对应数据库类型的 [`sql`  (opens new window)](https://github.com/YunaiV/yudao-cloud/tree/master/sql) 目录下的 `ruoyi-vue-pro.sql` SQL 文件，进行初始化。

 ![导入 MySQL 数据库](https://cloud.iocoder.cn/img/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8.png)

 ② 默认配置下，MySQL 需要启动在 3306 端口，并且账号是 root，密码是 123456。如果不一致，需要修改 `application-local.yaml` 配置文件。

 ![修改配置文件](https://cloud.iocoder.cn/img/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8/210.png)

 

---

 疑问：如果我不是 MySQL，想用其它数据库，怎么办？？？

 * 1、【如果是 PostgreSQL、Oracle、SQL Server 数据库】，修改 `yudao-spring-boot-starter-mybatis` 模块的 `pom.xml` 文件，将对应的 JDBC Driver 的 `optional` 移除（注意，需要使用 IDEA 刷新下 Maven 的依赖）。如下图所示：
![数据库依赖](https://cloud.iocoder.cn/img/%E5%90%8E%E7%AB%AF%E6%89%8B%E5%86%8C/%E4%BF%A1%E5%88%9B%E6%95%B0%E6%8D%AE%E5%BA%93/%E6%95%B0%E6%8D%AE%E5%BA%93%E4%BE%9D%E8%B5%96.png)
* 2、【如果是 DM 达梦、大金、OpenGauss 等国产信创数据库】建议先使用 MySQL 跑通，然后再阅读 [《国产信创数据库（DM 达梦、大金、OpenGauss）》](/xinchuang-db) 文档。
 ### [#](#_3-2-初始化-redis) 3.2 初始化 Redis

 项目使用 Redis 缓存数据，所以需要启动一个 Redis 服务。

 
> 不会安装的胖友，可以选择阅读下文，良心的艿艿。
> 
>  * Windows 安装 Redis 指南：[http://www.iocoder.cn/Redis/windows-install  (opens new window)](http://www.iocoder.cn/Redis/windows-install)
> * Mac 安装 Redis 指南：[http://www.iocoder.cn/Redis/mac-install  (opens new window)](http://www.iocoder.cn/Redis/mac-install)

 默认配置下，Redis 启动在 6379 端口，不设置账号密码。如果不一致，需要修改 `application-local.yaml` 配置文件。

 ![修改配置文件](https://cloud.iocoder.cn/img/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8/211.png)

 ### [#](#_3-3-初始化-nacos) 3.3 初始化 Nacos

 项目使用 Nacos 作为**注册中心**和**配置中心**，参考 [《芋道 Nacos 极简入门》  (opens new window)](http://www.iocoder.cn/Nacos/install/?yudao-cloud) 文章，进行安装，只需要看该文的 [「2. 单机部署（最简模式）」](#) 即可。

 安装完成之后，需要创建 `dev` **命名空间**，如下图所示：

 ![创建  命名空间](https://cloud.iocoder.cn/img/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8/221.png)

 注意！新建命名空间时，它的“命名空间ID”、“命名空间名”都要是 `dev` 噢！！！

 
> Nacos 拓展学习资料：
> 
>  * [《芋道 Spring Cloud Alibaba 配置中心 Nacos 入门》  (opens new window)](http://www.iocoder.cn/Spring-Cloud-Alibaba/Nacos-Config/?yudao-cloud) 对应 [labx-05-spring-cloud-alibaba-nacos-config  (opens new window)](https://github.com/YunaiV/SpringBoot-Labs/tree/master/labx-05-spring-cloud-alibaba-nacos-config)
> * [《芋道 Spring Cloud Alibaba 注册中心 Nacos 入门》  (opens new window)](http://www.iocoder.cn/Spring-Cloud-Alibaba/Nacos-Discovery/?yudao-cloud) 对应 [labx-01-spring-cloud-alibaba-nacos-discovery  (opens new window)](https://github.com/YunaiV/SpringBoot-Labs/tree/master/labx-01-spring-cloud-alibaba-nacos-discovery)

 ## [#](#_4-基础设施-可选) 4. 基础设施（可选）

 
> 本小节的基础设施【可选】安装，不影响项目的启动，可在项目启动后再安装。
> 
>  如果你想使用 Docker 一键搭建 RocketMQ、XXL-Job 等相关环境，可阅读 [https://t.zsxq.com/g9nsF  (opens new window)](https://t.zsxq.com/g9nsF) 帖子。

 ### [#](#_4-1-rocketmq) 4.1 RocketMQ

 项目使用 RocketMQ 作为**消息中心**和**事件总线**，参考 [《芋道 RocketMQ 极简入门》  (opens new window)](http://www.iocoder.cn/RocketMQ/install/?yudao-cloud) 文章，进行安装，只需要看该文的 [「2. 单机部署」](#) 即可。

 
> RocketMQ 拓展学习资料：
> 
>  * [《芋道 Spring Cloud Alibaba 消息队列 RocketMQ 入门》  (opens new window)](http://www.iocoder.cn/Spring-Cloud-Alibaba/RocketMQ/?yudao-cloud) 对应 [labx-06-spring-cloud-stream-rocketmq  (opens new window)](https://github.com/YunaiV/SpringBoot-Labs/tree/master/labx-06-spring-cloud-stream-rocketmq)
> * [《芋道 Spring Cloud Alibaba 事件总线 Bus RocketMQ 入门》  (opens new window)](http://www.iocoder.cn/Spring-Cloud-Alibaba/Bus-RocketMQ/?yudao-cloud) 对应 [labx-06-spring-cloud-stream-rocketmq  (opens new window)](https://github.com/YunaiV/SpringBoot-Labs/tree/master/labx-06-spring-cloud-stream-rocketmq)
> * [《性能测试 —— RocketMQ 基准测试》  (opens new window)](http://www.iocoder.cn/Performance-Testing/RocketMQ-benchmark/?yudao-cloud)

 ### [#](#_4-2-xxl-job) 4.2 XXL-Job

 ① 项目使用 XXL-Job 作为**定时任务**，参考 [《芋道 XXL-Job 极简入门》  (opens new window)](https://www.iocoder.cn/XXL-JOB/install/?yudao-cloud) 文章，进行安装，只需要看该文的 [「4. 搭建调度中心」](#) 即可。

 ② 默认配置下，本地 `local` 环境的定时任务是关闭的，避免控制台一直报错报错。如果要开启，请参考 [《微服务手册 —— 定时任务》](/job) 文档。

 ### [#](#_4-3-seata) 4.3 Seata

 TODO 接入中，提供实战案例 ing

 
> Seata 拓展学习资料：
> 
>  * [《芋道 Spring Cloud Alibaba 分布式事务 Seata 入门 》  (opens new window)](http://www.iocoder.cn/Spring-Cloud-Alibaba/Seata/?yudao-cloud) 对应 对应 [labx-17  (opens new window)](https://github.com/YunaiV/SpringBoot-Labs/tree/master/labx-17)

 ### [#](#_4-4-sentinel) 4.4 Sentinel

 TODO 接入中，提供实战案例 ing

 
> Sentinel 拓展学习资料：
> 
>  * [《芋道 Spring Cloud Alibaba 服务容错 Sentinel 入门 》  (opens new window)](http://www.iocoder.cn/Spring-Cloud-Alibaba/Sentinel/?yudao-cloud) 对应 [labx-04-spring-cloud-alibaba-sentinel  (opens new window)](https://github.com/YunaiV/SpringBoot-Labs/tree/master/labx-04-spring-cloud-alibaba-sentinel)

 ### [#](#_4-5-elasticsearch) 4.5 Elasticsearch

 TODO 接入中，提供实战案例 ing

 
> Elasticsearch 拓展学习资料：
> 
>  * [《芋道 Spring Boot Elasticsearch 入门》  (opens new window)](http://www.iocoder.cn/Spring-Boot/Elasticsearch/?onemall)
> * [《芋道 ELK(Elasticsearch + Logstash + Kibana) 极简入门》  (opens new window)](http://www.iocoder.cn/Elasticsearch/ELK-install/?onemall)

 ## [#](#_5-启动后端项目) 5. 启动后端项目

 ### [#](#_5-1-编译项目) 5.1 编译项目

 第一步，使用 IDEA 自带的 Maven 插件，进行项目的编译。如下图所示：

 ![后端编译](https://cloud.iocoder.cn/img/%E5%90%8E%E7%AB%AF%E6%89%8B%E5%86%8C/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8/%E5%90%8E%E7%AB%AF%E7%BC%96%E8%AF%91-Cloud.png)

 【可选】也可以使用 Maven 命令编译：

 * 使用 IDEA 打开 Terminal 终端，在 **根目录** 下直接执行 `mvn clean install package '-Dmaven.test.skip=true'` 命令。
* 如果执行报 `Unknown lifecycle phase “.test.skip=true”` 错误，使用 `mvn clean install package -Dmaven.test.skip=true` 即可。

 ps：只有首次需要执行 Maven 命令，解决基础 `pom.xml` 不存在，导致报 BaseDbUnitTest 类不存在的问题。

 整个过程，预计需要 1 分钟左右。成功后，控制台日志如下：

 
```
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  9.139 s (Wall Clock)
[INFO] Finished at: 2024-05-03T18:56:03+08:00
[INFO] ------------------------------------------------------------------------

```
### [#](#_5-2-启动-gateway-服务) 5.2 启动 `gateway` 服务

 执行 [GatewayServerApplication  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/GatewayServerApplication.java) 类，进行启动。

 启动还是报类不存在？

 可能是 IDEA 的 bug，点击 [File -> Invalidate Caches] 菜单，清空下缓存，重启后在试试看。

 ![启动  服务](https://cloud.iocoder.cn/img/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8/230.png)

 启动完成后，使用浏览器访问 [http://127.0.0.1:48080  (opens new window)](http://127.0.0.1:48080) 地址，返回如下 JSON 字符串，说明成功。

 
> 友情提示：注意，默认配置下，网关启动在 48080 端口。

 
```
{"code":404,"data":null,"msg":null}

```
如果报 “Command line is too long” 错误，参考 [《Intellij IDEA 运行时报 Command line is too long 解决方法 》  (opens new window)](https://www.iocoder.cn/Fight/Intellij-IDEA-Indicates-that-Command-Line-is-too-long/?yudao) 文章解决，或者直接点击 YudaoServerApplication **蓝字**部分！

 ![“Command line is too long” 错误](https://cloud.iocoder.cn/img/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8/01.png)

 ### [#](#_5-3-启动-system-服务) 5.3 启动 `system` 服务

 执行 [SystemServerApplication  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-biz/src/main/java/cn/iocoder/yudao/module/system/SystemServerApplication.java) 类，进行启动。

 ![启动  服务](https://cloud.iocoder.cn/img/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8/231.png)

 启动完成后，使用浏览器访问 [http://127.0.0.1:48081/admin-api/system/  (opens new window)](http://127.0.0.1:48081/admin-api/system/) 和 [http://127.0.0.1:48080/admin-api/system/  (opens new window)](http://127.0.0.1:48080/admin-api/system/) 地址，都返回如下 JSON 字符串，说明成功。

 
> 友情提示：注意，默认配置下，`yudao-module-system` 服务启动在 48081 端口。

 
```
{"code":401,"data":null,"msg":"账号未登录"}

```
### [#](#_5-3-启动-infra-服务) 5.3 启动 `infra` 服务

 执行 [InfraServerApplication  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-infra/yudao-module-infra-biz/src/main/java/cn/iocoder/yudao/module/infra/InfraServerApplication.java) 类，进行启动。

 ![启动  服务](https://cloud.iocoder.cn/img/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8/232.png)

 启动完成后，使用浏览器访问 [http://127.0.0.1:48082/admin-api/infra/  (opens new window)](http://127.0.0.1:48082/admin-api/infra/) 和 [http://127.0.0.1:48080/admin-api/infra/  (opens new window)](http://127.0.0.1:48080/admin-api/infra/) 地址，都返回如下 JSON 字符串，说明成功。

 
> 友情提示：注意，默认配置下，`yudao-module-infra` 服务启动在 48082 端口。

 
```
{"code":401,"data":null,"msg":"账号未登录"}

```
### [#](#_5-4-启动-bpm-服务) 5.4 启动 `bpm` 服务

 参见 [《工作流手册》](/bpm) 文档。

 ### [#](#_5-5-启动-report-服务) 5.5 启动 `report` 服务

 参见 [《大屏手册》](/report/) 文档。

 ### [#](#_5-6-启动-pay-服务) 5.6 启动 `pay` 服务

 参见 [《支付手册》](/pay/build/) 文档。

 ### [#](#_5-7-启动-mp-服务) 5.7 启动 `mp` 服务

 参见 [《公众号手册》](/mp/build/) 文档。

 ### [#](#_5-8-启动-mall-服务) 5.8 启动 `mall` 服务

 参见 [《商城手册》](/mall/build/) 文档。

 ### [#](#_5-9-启动-erp-服务) 5.9 启动 `erp` 服务

 参见 [《ERP 手册》](/erp/build/) 文档。

 ### [#](#_5-10-启动-crm-服务) 5.10 启动 `crm` 服务

 参见 [《CRM 手册》](/crm/build/) 文档。

 ### [#](#_5-11-启动-ai-服务) 5.11 启动 `ai` 服务

 参见 [《AI 大模型手册》](/ai/build/) 文档。

 ## [#](#_6-启动前端项目【简易】) 6. 启动前端项目【简易】

 友情提示：这是可选步骤，想要完整启动前端，可以直接看「7. 启动前端项目【完整】」小节噢！

 在 [yudao-demo  (opens new window)](https://gitee.com/yudaocode/yudao-demo) 项目中，提前编译好了前端项目的静态资源，无需安装 Node 等前端环境，可以直接体验和使用。操作步骤如下：

 ① 克隆 [https://gitee.com/yudaocode/yudao-demo  (opens new window)](https://gitee.com/yudaocode/yudao-demo) 项目，运行对应的启动类：

 ![演示项目](https://cloud.iocoder.cn/img/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8/%E6%BC%94%E7%A4%BA%E9%A1%B9%E7%9B%AE.png)

 * [Vue3 + element-plus  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue3) ：ElementPlusApplication
* [Vue3 + vben  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vben) ：VbenApplication
* [Vue2 + element-ui  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vben) ：ElementUIApplication

 ② 访问 [http://127.0.0.1:2048/  (opens new window)](http://127.0.0.1:2048/) 地址，即可看到对应的管理后台。

 补充说明：

 前端项目是不定期编译，可能不是最新版本。

 如果需要最新版本，请继续往下看。

 ## [#](#_7-启动前端项目【完整】) 7. 启动前端项目【完整】

 参考 [《快速启动（前端项目）》](/quick-start-front) 文档

 ## [#](#_666-彩蛋) 666. 彩蛋

 至此，我们已经完成了项目 [yudao-cloud  (opens new window)](https://github.com/YunaiV/yudao-cloud) 的启动。

 胖友可以根据自己的兴趣，阅读相关源码。如果你想更快速的学习，可以看看 [《视频教程 》](/video/) 教程哟。

 ![架构图](https://cloud.iocoder.cn/img/common/yudao-cloud-architecture.png)

 后面，艿艿会花大量的时间，继续优化这个项目。同时，输出与项目匹配的技术博客，方便胖友更好的学习与理解。

 还是那句话，😆 为开源继绝学，我辈义不容辞！

 

---

 嘿嘿嘿，记得一定要给 [https://github.com/YunaiV/yudao-cloud  (opens new window)](https://github.com/YunaiV/yudao-cloud) 一个 star，这对艿艿真的很重要。

 ![Star 一波](https://cloud.iocoder.cn/img/%E5%90%8E%E7%AB%AF%E6%89%8B%E5%86%8C/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8/Star-Cloud.png)

