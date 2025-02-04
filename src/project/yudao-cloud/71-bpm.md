---
title: 功能开启
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 73
---
# 功能开启

进度说明：

 * 管理后台，请使用 [https://gitee.com/yudaocode/yudao-ui-admin-vue3  (opens new window)](https://gitee.com/yudaocode/yudao-ui-admin-vue3) 仓库的 `master` 分支
* 后端项目，请使用 [https://gitee.com/zhijiantianya/yudao-cloud  (opens new window)](https://gitee.com/zhijiantianya/yudao-cloud) 仓库的 `master`（JDK8） 或 `master-jdk17`（JDK17/21） 分支
 BPM 系统，后端由 `yudao-module-bpm` 模块实现，前端由 `yudao-ui-admin-vue3` 的 `bpm` 目录实现。

 只需要启动 `yudao-module-bpm` 服务，就可以使用 ERP 的功能。步骤如下：

 * 第一步，导入 bpm 系统的 SQL 数据库脚本
* 第二步，启动服务，确认功能是否生效

 ## [#](#_1-第一步-导入-sql) 1. 第一步，导入 SQL

 点击 [`bpm-2024-03-24.sql.zip`  (opens new window)](https://t.zsxq.com/150EPtWgV) 下载附件，解压出 SQL 文件，然后导入到数据库中。

 友情提示：↑↑↑ bpm.sql 是可以点击下载的！ ↑↑↑

 ![导入 ](https://cloud.iocoder.cn/img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/SQL%E5%AF%BC%E5%85%A5.png)

 以 `bpm_` 作为前缀的表，就是 BPM 模块的表。

 ## [#](#_2-第二步-启动服务) 2. 第二步，启动服务

 运行 BpmServerApplication 类，启动工作流服务，看到 `Property Source flowable-liquibase-override refreshed` 说明开启成功。

 然后访问前端的 BPM 菜单，确认功能是否生效。如下图所示：

 ![管理后台](https://cloud.iocoder.cn/img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0.png)

 另外，启动过程中，Flowable 会自动创建 `ACT_` 和 `FLW_` 开头的表。

 常见问题：

 ① 问题：如果启动中报 [MySQL “Specified key was too long; max key length is 1000 bytes”  (opens new window)](https://gitee.com/zhijiantianya/yudao-cloud/issues/I57FYM) 错误？

 解决方案：可以将 MySQL 的缺省存储引擎设置为 innodb，即 `default-storage-engine=innodb` 配置项。

 ② 问题：如果 Flowable 启动报错 `problem during schema upgrade&&couldn‘t upgrade db schema` 错误？

 解决方案：参见 [https://www.cnblogs.com/sowler/p/17195427.html  (opens new window)](https://www.cnblogs.com/sowler/p/17195427.html) 帖子，MySQL 不区分大小写导致的，需要调整为区分。

 ③ 问题：我想使用达梦数据库，怎么办？

 解决方案：参见 [《工作流（达梦适配）》](/bpm/dameng/) 文档。

 ## [#](#_666-后续学习) 666. 后续学习

 建议阅读如下两篇文档，对整个工作流建立一个整体的认识：

 * [《审批接入（流程表单）》](/bpm/use-bpm-form/)
* [《审批接入（业务表单）》](/bpm/use-business-form/)

 ## [#](#补充说明-如何集成-activiti) 补充说明：如何集成 Activiti？

 Activiti 和 Flowable 提供的 Java API 是基本一致的，例如说 Flowable 的 `org.flowable.engine.RepositoryService` 对应 Activiti 的 `org.activiti.engine .RepositoryService`。所以，我们可以修改 `import` 的包路径来替换。

 另外，在项目的老版本，我们也提供了 Activiti 实现，你可以具体参考下：

 * [`yudao-spring-boot-starter-activiti`  (opens new window)](https://gitee.com/zhijiantianya/yudao-cloud/tree/v1.6.2/yudao-framework/yudao-spring-boot-starter-activiti)
* [`yudao-module-bpm-biz-activiti`  (opens new window)](https://gitee.com/zhijiantianya/yudao-cloud/tree/v1.6.2/yudao-module-bpm/yudao-module-bpm-biz-activiti)

 ![项目结构](https://cloud.iocoder.cn/img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/Activiti.png)

