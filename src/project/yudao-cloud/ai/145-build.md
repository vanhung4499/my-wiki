---
title: 功能开启
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 147
---
# 功能开启

进度说明：

 * 管理后台，请使用 [https://gitee.com/yudaocode/yudao-ui-admin-vue3  (opens new window)](https://gitee.com/yudaocode/yudao-ui-admin-vue3) 仓库的 `master` 分支
* 后端项目，请使用 [https://gitee.com/zhijiantianya/yudao-cloud  (opens new window)](https://gitee.com/zhijiantianya/yudao-cloud) 仓库的 `master-jdk17` 分支

 注意！仅支持 JDK 17/21 使用，因为基于 [Spring AI  (opens new window)](https://spring.io/projects/spring-ai) 实现，它基于 Spring Boot 3.X 构建，所以最低要求 JDK 17！！！

 AI 系统，后端由 `yudao-module-ai` 模块实现，前端由 `yudao-ui-admin-vue3` 的 `ai` 目录实现。

 只需要启动 `yudao-module-ai` 服务，就可以使用 CRM 的功能。步骤如下：

 * 第一步，导入 AI 系统的 SQL 数据库脚本
* 第二步，重启后端项目，确认功能是否生效

 ## [#](#_1-第一步-导入-sql) 1. 第一步，导入 SQL

 点击 [`ai-2024-07-07.sql.zip`  (opens new window)](https://t.zsxq.com/09F92) 下载附件，解压出 SQL 文件，然后导入到数据库中。

 所以表名字，都使用 `ai_` 作为前缀。

 ## [#](#_3-第二步-重启项目) 3. 第二步，重启项目

 ① 运行该服务的 [AiServerApplication  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-crm/yudao-module-crm-biz/src/main/java/cn/iocoder/yudao/module/crm/CrmServerApplication.java) 启动类，看到 `"Started AiServerApplication in 5.963 seconds (JVM running for 6.253)"` 说明开启成功。

 ② 然后，访问前端的 AI 大模型菜单，确认功能是否生效。如下图所示：

 ![确认功能是否生效](https://cloud.iocoder.cn/img/AI%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0.png)

 至此，我们就成功开启了 AI 的功能 🙂

 可以访问 [AI 大模型 -> AI 对话] 菜单，点击左上角的【新建对话】按钮后，确认右上角的模型是“deepseek”后，就可以和 AI 大模型聊起来了！

 友情提示：如果你碰到 Spring AI 相关的包，无法从 Maven 仓库下载下来，可以参考如下的链接解决：

 [https://t.zsxq.com/gFtUj  (opens new window)](https://t.zsxq.com/gFtUj)

