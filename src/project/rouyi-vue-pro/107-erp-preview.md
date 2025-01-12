---
title: ERP 演示
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 109
---
# ERP 演示

## [#](#_1-演示地址) 1. 演示地址

 ### [#](#_1-1-erp-管理后台) 1.1 ERP 管理后台

 * 演示地址：[http://dashboard-vue3.yudao.iocoder.cn/  (opens new window)](http://dashboard-vue3.yudao.iocoder.cn/)
* 菜单：“ERP 系统”下的「采购管理」「销售管理」「库存管理」「产品管理」「财务管理」
* 仓库：[https://github.com/yudaocode/yudao-ui-admin-vue3  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue3) 的 `erp` 目录，基于 Vue3 + Element Plus 实现

 ![管理后台](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0.png)

 ### [#](#_1-2-erp-后端) 1.2 ERP 后端

 支持 Spring Boot 单体、Spring Cloud 微服务架构

 * 单体仓库： [https://github.com/YunaiV/ruoyi-vue-pro  (opens new window)](https://github.com/YunaiV/ruoyi-vue-pro) 的 `yudao-module-erp` 模块
* 微服务仓库： [https://github.com/YunaiV/yudao-cloud  (opens new window)](https://github.com/YunaiV/yudao-cloud) 的 `yudao-module-erp` 服务

 ## [#](#_2-erp-启动) 2. ERP 启动

 参见 [《ERP 手册 —— 功能开启》](/erp/build/) 文档，一般 3 分钟就可以启动完成。

 ## [#](#_3-erp-交流) 3. ERP 交流

 专属交流社区，欢迎扫码加入。

 ![交流群](https://doc.iocoder.cn/img/ad/zsxq_erp.png)

 ## [#](#_4-功能描述) 4. 功能描述

 主要分为 5 个核心模块：采购、销售、库存、产品、财务。

 ![ERP 功能列表](https://doc.iocoder.cn/img/common/erp-feature.png)

 ## [#](#_5-表结构) 5. 表结构

 ERP 一共有 **30+** 张表，具备一定的业务复杂度，对提升技术能力会有不错的帮助，平时做项目也可以参考参考。

 ### [#](#_5-1-采购管理) 5.1 采购管理

 以 `erp_purchase_` 作为前缀的表，表结构如下：

 ![采购表](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E9%87%87%E8%B4%AD%E8%A1%A8.png)

 * [《【采购】采购订单、入库、退货》](/erp/purchase/)

 ### [#](#_5-2-销售管理) 5.2 销售管理

 以 `erp_sale_` 作为前缀的表，表结构如下：

 ![销售表](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E9%94%80%E5%94%AE%E8%A1%A8.png)

 * [《【销售】销售订单、出库、退货》](/erp/sale/)

 ### [#](#_5-3-库存管理) 5.3 库存管理

 以 `erp_stock_` 作为前缀的表，表结构如下：

 ![库存表](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E5%BA%93%E5%AD%98%E8%A1%A8.png)

 * [《【库存】产品库存、库存明细》](/erp/stock/)
* [《【库存】其它入库、其它出库》](/erp/stock-in-out/)
* [《【库存】库存调拨、库存盘点》](/erp/stock-move-check/)

 ### [#](#_5-4-产品管理) 5.4 产品管理

 以 `erp_product_` 作为前缀的表，表结构如下：

 ![产品表](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E4%BA%A7%E5%93%81%E8%A1%A8.png)

 * [《【产品】产品信息、分类、单位》](/erp/product/)

 ### [#](#_5-5-财务管理) 5.5 财务管理

 以 `erp_finance_` 作为前缀的表，表结构如下：

 ![财务表](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA/%E8%B4%A2%E5%8A%A1%E8%A1%A8.png)

 * [《【财务】采购付款、销售收款》](/erp/finance-payment-receipt/)
