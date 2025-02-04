---
title: 功能开启
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 132
---
# 功能开启

进度说明：

 * 管理后台，请使用 [https://gitee.com/yudaocode/yudao-ui-admin-vue3  (opens new window)](https://gitee.com/yudaocode/yudao-ui-admin-vue3) 仓库的 `master` 分支
* 后端项目，请使用 [https://gitee.com/zhijiantianya/ruoyi-vue-pro  (opens new window)](https://gitee.com/zhijiantianya/ruoyi-vue-pro) 仓库的 `master`（JDK8） 或 `master-jdk17`（JDK17//21） 分支
 CRM 系统，后端由 `yudao-module-crm` 模块实现，前端由 `yudao-ui-admin-vue3` 的 `crm` 目录实现。

 考虑到编译速度，默认 `yudao-module-crm` 模块是关闭的，需要手动开启。步骤如下：

 * 第一步，开启 `yudao-module-crm` 模块
* 第二步，导入 CRM 系统的 SQL 数据库脚本
* 第三步，重启后端项目，确认功能是否生效

 补充说明：

 由于 CRM 合同、回款使用到 BPM 的审批功能，所以你需要先看 [《工作流》](/bpm/) 文档，将工作流开启！

 ## [#](#_1-第一步-开启模块) 1. 第一步，开启模块

 ① 修改根目录的 [`pom.xml`  (opens new window)](https://github.com/YunaiV/ruoyi-vue-pro/blob/master/pom.xml) 文件，取消 `yudao-module-crm` 模块的注释。如下图所示：

 ![取消  模块的注释](https://doc.iocoder.cn/img/CRM%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/%E7%AC%AC%E4%B8%80%E6%AD%A5-01.png)

 ② 修改 `yudao-server` 目录的 [`pom.xml`  (opens new window)](https://github.com/YunaiV/ruoyi-vue-pro/blob/master/yudao-server/pom.xml) 文件，引入 `yudao-module-crm` 模块。如下图所示：

 ![引入  模块](https://doc.iocoder.cn/img/CRM%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/%E7%AC%AC%E4%B8%80%E6%AD%A5-02.png)

 ③ 点击 IDEA 右上角的【Reload All Maven Projects】，刷新 Maven 依赖。如下图所示：

 ![刷新 Maven 依赖](https://doc.iocoder.cn/img/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/%E7%AC%AC%E4%B8%80%E6%AD%A5-03.png)

 ## [#](#_2-第二步-导入-sql) 2. 第二步，导入 SQL

 点击 [`crm-2024-02-26.sql.zip`  (opens new window)](https://t.zsxq.com/15v3qYyNi) 下载附件，解压出 SQL 文件，然后导入到数据库中。

 所以表名字，都使用 `crm_` 作为前缀。

 ## [#](#_3-第三步-重启项目) 3. 第三步，重启项目

 重启后端项目，然后访问前端的 CRM 城菜单，确认功能是否生效。如下图所示：

 ![确认功能是否生效](https://doc.iocoder.cn/img/CRM%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0.png)

 至此，我们就成功开启了 CRM 的功能 🙂

