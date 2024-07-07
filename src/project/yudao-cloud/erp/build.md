---
title: 功能开启
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 114
---
# 功能开启

进度说明：

 * 管理后台，请使用 [https://gitee.com/yudaocode/yudao-ui-admin-vue3](https://gitee.com/yudaocode/yudao-ui-admin-vue3) 仓库的 `master` 分支
* 后端项目，请使用 [https://gitee.com/zhijiantianya/yudao-cloud](https://gitee.com/zhijiantianya/yudao-cloud) 仓库的 `master`（JDK8） 或 `master-jdk17`（JDK17/21） 分支
 ERP 系统，后端由 `yudao-module-erp` 模块实现，前端由 `yudao-ui-admin-vue3` 的 `erp` 目录实现。

 只需要启动 `yudao-module-erp` 服务，就可以使用 ERP 的功能。步骤如下：

 * 第一步，导入 ERP 系统的 SQL 数据库脚本
* 第二步，启动服务，确认功能是否生效

 ## [#](#_1-1-第一步-导入-sql) 1.1 第一步，导入 SQL

 点击 [`erp-2024-02-16.sql.zip`](https://t.zsxq.com/17iEOp1oE) 下载附件，解压出 SQL 文件，然后导入到数据库中。 如下图所示：

 友情提示：↑↑↑ erp.sql 是可以点击下载的！ ↑↑↑

 ![导入数据库](https://cloud.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E5%BC%80%E5%90%AF/%E7%AC%AC%E4%BA%8C%E6%AD%A5-01.png)

 以 `erp_` 作为前缀的表，就是 ERP 模块的表。

 ## [#](#_1-2-第二步-启动服务) 1.2 第二步，启动服务

 ① 运行该服务的 [ErpServerApplication](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-erp/yudao-module-erp-biz/src/main/java/cn/iocoder/yudao/module/erp/ErpServerApplication.java) 启动类，看到 `"Started ErpServerApplication in 5.963 seconds (JVM running for 6.253)"` 说明开启成功。

 ② 然后，访问前端的 ERP 菜单，确认功能是否生效。如下图所示：

 ![确认功能是否生效](https://cloud.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0.png)

 至此，我们就成功开启了 ERP 的功能 🙂
