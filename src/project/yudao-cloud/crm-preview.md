---
title: CRM 演示
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 122
---
# CRM 演示

## [#](#_1-演示地址) 1. 演示地址

 ### [#](#_1-1-crm-管理后台) 1.1 CRM 管理后台

 * 演示地址：[http://dashboard-vue3.yudao.iocoder.cn/](http://dashboard-vue3.yudao.iocoder.cn/)
* 菜单：“CRM 系统”下的「待办事项」「线索管理」「客户管理」「联系人管理」「客户公海」「商机管理」「合同管理」「回款计划」「还款管理」「产品管理」「数据统计」
* 仓库：[https://github.com/yudaocode/yudao-ui-admin-vue3](https://github.com/yudaocode/yudao-ui-admin-vue3) 的 `crm` 目录，基于 Vue3 + Element Plus 实现

 ![管理后台](https://cloud.iocoder.cn/img/CRM%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0.png)

 ### [#](#_1-2-crm-后端) 1.2 CRM 后端

 支持 Spring Boot 单体、Spring Cloud 微服务架构

 * 单体仓库： [https://github.com/YunaiV/ruoyi-vue-pro](https://github.com/YunaiV/ruoyi-vue-pro) 的 `yudao-module-crm` 模块
* 微服务仓库： [https://github.com/YunaiV/yudao-cloud](https://github.com/YunaiV/yudao-cloud) 的 `yudao-module-crm` 服务

 ## [#](#_2-crm-启动) 2. CRM 启动

 参见 [《CRM 手册 —— 功能开启》](/crm/build/) 文档，一般 3 分钟就可以启动完成。

 ## [#](#_3-crm-交流) 3. CRM 交流

 专属交流社区，欢迎扫码加入。

 ![交流群](https://cloud.iocoder.cn/img/ad/zsxq_crm.png)

 ## [#](#_4-功能描述) 4. 功能描述

 主要分为 6 个核心模块：线索、客户、商机、合同、回款、产品。

 ![ERP 功能列表](https://cloud.iocoder.cn/img/common/crm-feature.png)

 ## [#](#_5-表结构) 5. 表结构

 CRM 一共近 **20+** 张表，具备一定的业务复杂度，对提升技术能力会有不错的帮助，平时做项目也可以参考参考。

 ### [#](#_5-1-线索管理) 5.1 线索管理

 以 `crm_clue` 作为核心表，表结构如下：

 ![线索表](https://cloud.iocoder.cn/img/CRM%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E7%BA%BF%E7%B4%A2%E8%A1%A8.png)

 * [《【线索】线索管理》](/crm/clue/)

 ### [#](#_5-2-客户管理) 5.2 客户管理

 以 `crm_customer` 作为核心表，表结构如下：

 ![客户表](https://cloud.iocoder.cn/img/CRM%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E5%AE%A2%E6%88%B7%E8%A1%A8.png)

 * [《【线索】线索管理》](/crm/customer/)

 ## [#](#_5-3-商机管理) 5.3 商机管理

 以 `crm_business` 作为核心表，表结构如下：

 ![商机表](https://cloud.iocoder.cn/img/CRM%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E5%95%86%E6%9C%BA%E8%A1%A8.png)

 * [《【商机】商机管理、商机状态》](/crm/business/)

 ## [#](#_5-4-合同管理) 5.4 合同管理

 以 `crm_contract` 作为核心表，表结构如下：

 ![合同表](https://cloud.iocoder.cn/img/CRM%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E5%90%88%E5%90%8C%E8%A1%A8.png)

 * [《【合同】合同管理、合同提醒》](/crm/contract/)

 ## [#](#_5-5-回款管理) 5.5 回款管理

 以 `crm_receivable` 作为核心表，表结构如下：

 ![回款表](https://cloud.iocoder.cn/img/CRM%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E5%9B%9E%E6%AC%BE%E8%A1%A8.png)

 * [《【回款】回款管理、回款计划》](/crm/receivable/)

 ## [#](#_5-6-产品管理) 5.6 产品管理

 以 `crm_product` 作为核心表，表结构如下：

 ![产品表](https://cloud.iocoder.cn/img/CRM%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E4%BA%A7%E5%93%81%E8%A1%A8.png)

 * [《【产品】产品管理、产品分类》](/crm/product/)

 ## [#](#_5-7-通用模块) 5.7 通用模块

 * [《【通用】数据权限》](/crm/permission/)
* [《【通用】跟进记录、待办事项》](/crm/follow-up/)

 ## [#](#_5-8-数据统计) 5.8 数据统计

 TODO 数据统计
