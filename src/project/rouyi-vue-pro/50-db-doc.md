---
title: 数据库文档
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 52
---
# 数据库文档

友情提示：

 最新版本的代码，已经移除“数据库文档”功能。原因是，该功能比较小众，可能只有极少数的用户需要~

 如果你系统里需要，可以参考 [ff0c12c（后端）  (opens new window)](https://gitee.com/zhijiantianya/ruoyi-vue-pro/commit/ff5276998cb956fc0878bf39a194040378ce7363)、[ff52769（前端）  (opens new window)](https://gitee.com/zhijiantianya/ruoyi-vue-pro/commit/ff5276998cb956fc0878bf39a194040378ce7363) 把代码复制、粘贴回来。

 `yudao-module-infra` 的 [DatabaseDocController  (opens new window)](https://github.com/YunaiV/ruoyi-vue-pro/blob/master/yudao-module-infra/yudao-module-infra-biz/src/main/java/cn/iocoder/yudao/module/infra/controller/admin/db/DatabaseDocController.java) 类，基于 [Screw  (opens new window)](https://github.com/pingfangushi/screw) 工具，生成数据库表结构的文档。

 访问 [基础设施 -> 数据库文档] 菜单，可以查看项目的数据库文档。如下图所示：

 ![基础设施 -> 数据库文档](https://doc.iocoder.cn/img/%E6%95%B0%E6%8D%AE%E5%BA%93%E6%96%87%E6%A1%A3/01.png)

 关于 Screw 的使用讲解，可见 [《芋道 Spring Boot 数据表结构文档 》  (opens new window)](https://www.iocoder.cn/Spring-Boot/DB-Doc-screw/?yudao) 文章。

