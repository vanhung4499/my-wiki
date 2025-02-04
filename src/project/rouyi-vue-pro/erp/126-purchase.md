---
title: 【采购】采购订单、入库、退货
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 128
---
# 【采购】采购订单、入库、退货

采购模块，由 `yudao-module-erp-biz` 后端模块的 `purchase` 包实现，主要有采购订单、采购入库、采购退货等功能。如下图所示：

 ![表关系](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E9%87%87%E8%B4%AD%E6%A8%A1%E5%9D%97/%E8%A1%A8%E5%85%B3%E7%B3%BB.png)

 它的整体流程，如下图所示：

 ![整体流程](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E9%87%87%E8%B4%AD%E6%A8%A1%E5%9D%97/%E6%95%B4%E4%BD%93%E6%B5%81%E7%A8%8B.png)

 ## [#](#_1-供应商) 1. 供应商

 供应商，由 ErpSupplierController 提供接口，所有采购都是针对供应商进行操作的。

 ### [#](#_1-1-表结构) 1.1 表结构

 
> 省略 creator/create\_time/updater/update\_time/deleted/tenant\_id 等通用字段

 
```
CREATE TABLE `erp_supplier` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '供应商编号',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '供应商名称',
  `contact` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '联系人',
  `mobile` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号码',
  `telephone` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '联系电话',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '电子邮箱',
  `fax` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '传真',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `status` tinyint NOT NULL COMMENT '开启状态',
  `sort` int NOT NULL COMMENT '排序',
  `tax_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '纳税人识别号',
  `tax_percent` decimal(24,6) DEFAULT NULL COMMENT '税率',
  `bank_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '开户行',
  `bank_account` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '开户账号',
  `bank_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '开户地址',
  PRIMARY KEY (`id` DESC)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ERP 供应商表';

```
都是一些信息字段，仅仅用于展示，没有什么特殊逻辑。

 ### [#](#_1-2-管理后台) 1.2 管理后台

 对应 [ERP 系统 -> 采购管理 -> 供应商信息] 菜单，对应 `yudao-ui-admin-vue3` 项目的 `@/views/erp/purchase/supplier` 目录。

 ![供应商信息](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E9%87%87%E8%B4%AD%E6%A8%A1%E5%9D%97/%E4%BE%9B%E5%BA%94%E5%95%86%E4%BF%A1%E6%81%AF.png)

 ## [#](#_2-采购订单) 2. 采购订单

 采购订单，由 ErpPurchaseOrderController 提供接口，它不会直接影响库存，只有在入库、退货等操作才会影响库存。

 ### [#](#_2-1-表结构) 2.1 表结构

 `erp_purchase_order` 表和 `erp_purchase_order_items` 表，分别对应采购订单和采购订单项。

 
> 省略 creator/create\_time/updater/update\_time/deleted/tenant\_id 等通用字段

 
```
CREATE TABLE `erp_purchase_order` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号',
  `no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '采购单编号',
  
  `status` tinyint NOT NULL COMMENT '采购状态',
  `order_time` datetime NOT NULL COMMENT '采购时间',
  
  `supplier_id` bigint NOT NULL COMMENT '供应商编号',
  `account_id` bigint DEFAULT NULL COMMENT '结算账户编号',

  `total_count` decimal(24,6) NOT NULL COMMENT '合计数量',
  `total_price` decimal(24,6) NOT NULL COMMENT '合计价格，单位：元',
  `total_product_price` decimal(24,6) NOT NULL COMMENT '合计产品价格，单位：元',
  `total_tax_price` decimal(24,6) NOT NULL COMMENT '合计税额，单位：元',
  `discount_percent` decimal(24,6) NOT NULL COMMENT '优惠率，百分比',
  `discount_price` decimal(24,6) NOT NULL COMMENT '优惠金额，单位：元',
  `deposit_price` decimal(24,6) NOT NULL DEFAULT '0.000000' COMMENT '定金金额，单位：元',
  
  `file_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '附件地址',
  `remark` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '备注',

  `in_count` decimal(24,6) NOT NULL DEFAULT '0.000000' COMMENT '采购入库数量',
  `return_count` decimal(24,6) NOT NULL DEFAULT '0.000000' COMMENT '采购退货数量',

  PRIMARY KEY (`id`),
  UNIQUE KEY `no` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ERP 采购订单表';

```
① `no`：采购单号，一般是系统自动生成的，目前格式是 `{prefix}{yyyyMMdd}{6 位自增}`。具体可见 ErpNoRedisDAO 类。

 ② `status`：采购状态，统一使用 ErpAuditStatus 枚举类，只有“未审批”、“已审批”两个状态。

 ③ `supplier_id`：供应商编号，关联到上面的 `erp_supplier` 表。

 `account_id`：结算账户编号，关联后续的 `erp_account` 表。暂时不用关注，它用于采购的付款。

 ④ `total_count`、`total_price`、`total_product_price`、`total_tax_price`、`discount_percent`、`discount_price` 和 `deposit_price`：合计数量、合计价格、合计产品价格、合计税额、优惠率、优惠金额和定金金额。

 ⑤ `in_count`：该采购订单已经入库的数量。一个订单可以被多次采购入库，但是不能超过最大的 `total_count`，所以需要记录已经入库的数量。

 ⑥ `return_count`：该采购订单已经退货的数量。一个订单可以被多次采购退货，但是不能超过最大的 `total_count`，所以需要记录已经退货的数量。

 

---

 
```
CREATE TABLE `erp_purchase_order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号',
  
  `order_id` bigint NOT NULL COMMENT '采购订单编号',
  
  `product_id` bigint NOT NULL COMMENT '产品编号',
  
  `product_unit_id` bigint NOT NULL COMMENT '产品单位单位',
  `product_price` decimal(24,6) NOT NULL COMMENT '产品单价',
  `count` decimal(24,6) NOT NULL COMMENT '数量',
  `total_price` decimal(24,6) NOT NULL COMMENT '总价',
  `tax_percent` decimal(24,6) DEFAULT NULL COMMENT '税率，百分比',
  `tax_price` decimal(24,6) DEFAULT NULL COMMENT '税额，单位：元',
  
  `remark` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '备注',
  
  `in_count` decimal(24,6) NOT NULL DEFAULT '0.000000' COMMENT '采购入库数量',
  `return_count` decimal(24,6) NOT NULL DEFAULT '0.000000' COMMENT '采购退货数量',
  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='ERP 采购订单项表';

```
① `order_id`：采购订单编号，关联到上面的 `erp_purchase_order` 表。

 ② `product_id`：产品编号。

 注意，因为采购订单不直接涉及库存，所以它并没有 `warehouse_id` 字段，也就是说它不关心库存的具体仓库。

 ③ `product_unit_id`、`product_price`、`count`、`total_price`、`tax_percent` 和 `tax_price`：产品单位编号、产品单价、数量、总价、税率和税额。

 其中 `total_price` 等于 `product_price * count + tax_price`。（额外多了税额）

 ④ `in_count` 和 `return_count`：同 `erp_purchase_order` 表，只是它表示的是该订单“项”的入库数量和退货数量，当然它也不能超过最大的 `count`。

 ### [#](#_2-2-管理后台) 2.2 管理后台

 对应 [ERP 系统 -> 采购管理 -> 采购订单] 菜单，对应 `yudao-ui-admin-vue3` 项目的 `@/views/erp/purchase/order` 目录。

 ![采购订单](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E9%87%87%E8%B4%AD%E6%A8%A1%E5%9D%97/%E9%87%87%E8%B4%AD%E8%AE%A2%E5%8D%95.png)

 ① 点击「新增」按钮，随便填写一些信息，点击「确认」按钮，即可新增一条采购订单。

 ![新增采购订单](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E9%87%87%E8%B4%AD%E6%A8%A1%E5%9D%97/%E9%87%87%E8%B4%AD%E8%AE%A2%E5%8D%95-%E6%96%B0%E5%A2%9E.png)

 ② 点击该采购订单的「审批」按钮，审批通过该采购订单，此时状态会变成“已审批”，但是并不会影响库存。

 ## [#](#_3-采购入库) 3. 采购入库

 采购入库，由 ErpPurchaseInController 提供接口，它会影响（增加）库存。总的来说，它的逻辑和 [其它入库](/erp/stock-in-out) 基本一致，只是它是针对采购的入库。

 ### [#](#_3-1-表结构) 3.1 表结构

 `erp_purchase_in` 表和 `erp_purchase_in_items` 表，分别对应采购入库和采购入库项。

 
> 省略 creator/create\_time/updater/update\_time/deleted/tenant\_id 等通用字段

 
```
CREATE TABLE `erp_purchase_in` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号',
  `no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '采购入库编号',
  
  `status` tinyint NOT NULL COMMENT '采购状态',
  `in_time` datetime NOT NULL COMMENT '入库时间',
  
  `supplier_id` bigint NOT NULL COMMENT '供应商编号',
  `account_id` bigint NOT NULL COMMENT '结算账户编号',

  `order_id` bigint NOT NULL COMMENT '采购订单编号',
  `order_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '采购订单号',
  
  `total_count` decimal(24,6) NOT NULL COMMENT '合计数量',
  `total_price` decimal(24,6) NOT NULL COMMENT '合计价格，单位：元',
  `total_product_price` decimal(24,6) NOT NULL COMMENT '合计产品价格，单位：元',
  `total_tax_price` decimal(24,6) NOT NULL COMMENT '合计税额，单位：元',
  `discount_percent` decimal(24,6) NOT NULL COMMENT '优惠率，百分比',
  `discount_price` decimal(24,6) NOT NULL COMMENT '优惠金额，单位：元',
  `other_price` decimal(24,6) NOT NULL DEFAULT '0.000000' COMMENT '其它金额，单位：元',
  
  `payment_price` decimal(24,6) NOT NULL DEFAULT '0.000000' COMMENT '已付款金额，单位：元',
  
  `file_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '附件地址',
  `remark` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `no` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ERP 采购入库表';

```
① `no`：采购入库编号，一般是系统自动生成的，目前格式是 `{prefix}{yyyyMMdd}{6 位自增}`。具体可见 ErpNoRedisDAO 类。

 ② `status`：入库状态，统一使用 ErpAuditStatus 枚举类，只有“未审批”、“已审批”两个状态。

 ③ `supplier_id`：供应商编号，关联到上面的 `erp_supplier` 表。

 `account_id`：结算账户编号，关联后续的 `erp_account` 表。暂时不用关注，它用于采购的付款。

 ④ `order_id` 和 `order_no`：采购订单编号和采购订单号，关联到上面的 `erp_purchase_order` 表。

 ⑤ `total_count`、`total_price`、`total_product_price`、`total_tax_price`、`discount_percent`、`discount_price` 和 `other_price`：合计数量、合计价格、合计产品价格、合计税额、优惠率、优惠金额和其它金额。

 其中，`total_price` 等于 `total_product_price + total_tax_price + other_price - discount_price`。

 ⑥ `payment_price`：已付款金额，单位：元。暂时不用关注，它用于采购的付款。

 

---

 
```
CREATE TABLE `erp_purchase_in_items` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号',
  
  `in_id` bigint NOT NULL COMMENT '采购入库编号',
  
  `order_item_id` bigint NOT NULL COMMENT '采购订单项编号',
  
  `warehouse_id` bigint NOT NULL COMMENT '仓库编号',
  `product_id` bigint NOT NULL COMMENT '产品编号',
  
  `product_unit_id` bigint NOT NULL COMMENT '产品单位单位',
  `product_price` decimal(24,6) NOT NULL COMMENT '产品单价',
  `count` decimal(24,6) NOT NULL COMMENT '数量',
  `total_price` decimal(24,6) NOT NULL COMMENT '总价',
  `tax_percent` decimal(24,6) DEFAULT NULL COMMENT '税率，百分比',
  `tax_price` decimal(24,6) DEFAULT NULL COMMENT '税额，单位：元',

  `remark` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='ERP 销售入库项表';

```
① `in_id`：采购入库编号，关联到上面的 `erp_purchase_in` 表。

 ② `order_item_id`：采购订单项编号，关联到上面的 `erp_purchase_order_items` 表，因为它需要对应的 `in_count` 字段。

 ③ `warehouse_id` 和 `product_id`：分别关联到仓库和产品，因为它涉及到库存变更。

 ④ `product_unit_id`、`product_price`、`count`、`total_price`、`tax_percent` 和 `tax_price`：产品单位编号、产品单价、数量、总价、税率和税额。

 其中 `total_price` 等于 `product_price * count + tax_price`。（额外多了税额）

 ### [#](#_3-2-管理后台) 3.2 管理后台

 对应 [ERP 系统 -> 采购管理 -> 采购入库] 菜单，对应 `yudao-ui-admin-vue3` 项目的 `@/views/erp/purchase/in` 目录。

 ![采购入库](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E9%87%87%E8%B4%AD%E6%A8%A1%E5%9D%97/%E9%87%87%E8%B4%AD%E5%85%A5%E5%BA%93.png)

 ① 点击「新增」按钮，随便填写一些信息，点击「确认」按钮，即可新增一条采购入库。

 ![新增采购入库](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E9%87%87%E8%B4%AD%E6%A8%A1%E5%9D%97/%E9%87%87%E8%B4%AD%E5%85%A5%E5%BA%93-%E6%96%B0%E5%A2%9E.png)

 ② 点击该采购入库的「审批」按钮，审批通过该采购入库，此时状态会变成“已审批”，同时会增加对应的库存、新增库存明细。如下图所示：

 ![审批采购入库](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E9%87%87%E8%B4%AD%E6%A8%A1%E5%9D%97/%E9%87%87%E8%B4%AD%E5%85%A5%E5%BA%93-%E5%AE%A1%E6%89%B9.png)

 ③ 点击该采购入库的「反审批」按钮，反审批该采购入库，此时状态会变成“未审批”，同时会减少对应的库存、新增库存明细。如下图所示：

 ![反审批采购入库](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E9%87%87%E8%B4%AD%E6%A8%A1%E5%9D%97/%E9%87%87%E8%B4%AD%E5%85%A5%E5%BA%93-%E5%8F%8D%E5%AE%A1%E6%89%B9.png)

 ## [#](#_4-采购退货) 4. 采购退货

 采购退货，由 ErpPurchaseReturnController 提供接口，它会影响（减少）库存。总的来说，它的逻辑和 [其它出库](/erp/stock-in-out) 基本一致，只是它是针对采购的出库。

 ### [#](#_4-1-表结构) 4.1 表结构

 友情提示：采购退货相关的表，和采购入库相关的表结构基本一致。

 `erp_purchase_return` 表和 `erp_purchase_return_items` 表，分别对应采购退货和采购退货项。

 
> 省略 creator/create\_time/updater/update\_time/deleted/tenant\_id 等通用字段

 
```
CREATE TABLE `erp_purchase_return` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号',
  `no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '采购退货编号',
  
  `status` tinyint NOT NULL COMMENT '退货状态',
  `return_time` datetime NOT NULL COMMENT '退货时间',
  
  `supplier_id` bigint NOT NULL COMMENT '供应商编号',
  `account_id` bigint NOT NULL COMMENT '结算账户编号',
  
  `order_id` bigint NOT NULL COMMENT '采购订单编号',
  `order_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '采购订单号',
  
  `total_count` decimal(24,6) NOT NULL COMMENT '合计数量',
  `total_price` decimal(24,6) NOT NULL COMMENT '合计价格，单位：元',
  `total_product_price` decimal(24,6) NOT NULL COMMENT '合计产品价格，单位：元',
  `total_tax_price` decimal(24,6) NOT NULL COMMENT '合计税额，单位：元',
  `discount_percent` decimal(24,6) NOT NULL COMMENT '优惠率，百分比',
  `discount_price` decimal(24,6) NOT NULL COMMENT '优惠金额，单位：元',
  `other_price` decimal(24,6) NOT NULL DEFAULT '0.000000' COMMENT '其它金额，单位：元',

  `refund_price` decimal(24,6) NOT NULL DEFAULT '0.000000' COMMENT '已退款金额，单位：元',
  
  `file_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '附件地址',
  `remark` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `no` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ERP 采购退货表';

```
① `no`：采购退货编号，一般是系统自动生成的，目前格式是 `{prefix}{yyyyMMdd}{6 位自增}`。具体可见 ErpNoRedisDAO 类。

 ② `status`：退货状态，统一使用 ErpAuditStatus 枚举类，只有“未审批”、“已审批”两个状态。

 ③ `supplier_id`：供应商编号，关联到上面的 `erp_supplier` 表。

 `account_id`：结算账户编号，关联后续的 `erp_account` 表。暂时不用关注，它用于采购的付款。

 ④ `order_id` 和 `order_no`：采购订单编号和采购订单号，关联到上面的 `erp_purchase_order` 表。

 疑问：采购退货，为什么不是针对采购入库进行退货，而是针对采购订单进行退货呢？

 确实是有 ERP 是针对采购入库进行退货的，不过相对比较少。和一些做 ERP 的朋友交流过，他们的倾向于基于采购订单进行退货。

 ⑤ `total_count`、`total_price`、`total_product_price`、`total_tax_price`、`discount_percent`、`discount_price` 和 `other_price`：合计数量、合计价格、合计产品价格、合计税额、优惠率、优惠金额和其它金额。

 其中，`total_price` 等于 `total_product_price + total_tax_price + other_price - discount_price`。

 【差异】⑥ `refund_price`：已退款金额，单位：元。暂时不用关注，它用于采购的付款。

 

---

 
```
CREATE TABLE `erp_purchase_return_items` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号',
  
  `return_id` bigint NOT NULL COMMENT '采购退货编号',
  
  `order_item_id` bigint NOT NULL COMMENT '采购订单项编号',
  
  `warehouse_id` bigint NOT NULL COMMENT '仓库编号',
  `product_id` bigint NOT NULL COMMENT '产品编号',
  
  `product_unit_id` bigint NOT NULL COMMENT '产品单位单位',
  `product_price` decimal(24,6) NOT NULL COMMENT '产品单价',
  `count` decimal(24,6) NOT NULL COMMENT '数量',
  `total_price` decimal(24,6) NOT NULL COMMENT '总价',
  `tax_percent` decimal(24,6) DEFAULT NULL COMMENT '税率，百分比',
  `tax_price` decimal(24,6) DEFAULT NULL COMMENT '税额，单位：元',

  `remark` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='ERP 采购退货项表';

```
① `return_id`：采购退货编号，关联到上面的 `erp_purchase_return` 表。

 ② `order_item_id`：采购订单项编号，关联到上面的 `erp_purchase_order_items` 表，因为它需要对应的 `return_count` 字段。

 ③ `warehouse_id` 和 `product_id`：分别关联到仓库和产品，因为它涉及到库存变更。

 ④ `product_unit_id`、`product_price`、`count`、`total_price`、`tax_percent` 和 `tax_price`：产品单位编号、产品单价、数量、总价、税率和税额。

 其中 `total_price` 等于 `product_price * count + tax_price`。（额外多了税额）

 ### [#](#_4-2-管理后台) 4.2 管理后台

 对应 [ERP 系统 -> 采购管理 -> 采购退货] 菜单，对应 `yudao-ui-admin-vue3` 项目的 `@/views/erp/purchase/return` 目录。

 ![采购退货](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E9%87%87%E8%B4%AD%E6%A8%A1%E5%9D%97/%E9%87%87%E8%B4%AD%E9%80%80%E8%B4%A7.png)

 ① 点击「新增」按钮，随便填写一些信息，点击「确认」按钮，即可新增一条采购退货。

 ![新增采购退货](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E9%87%87%E8%B4%AD%E6%A8%A1%E5%9D%97/%E9%87%87%E8%B4%AD%E9%80%80%E8%B4%A7-%E6%96%B0%E5%A2%9E.png)

 ② 点击该采购退货的「审批」按钮，审批通过该采购退货，此时状态会变成“已审批”，同时会减少对应的库存、新增库存明细。如下图所示：

 ![审批采购退货](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E9%87%87%E8%B4%AD%E6%A8%A1%E5%9D%97/%E9%87%87%E8%B4%AD%E9%80%80%E8%B4%A7-%E5%AE%A1%E6%89%B9.png)

 ③ 点击该采购退货的「反审批」按钮，反审批该采购退货，此时状态会变成“未审批”，同时会增加对应的库存、新增库存明细。如下图所示：

 ![反审批采购退货](https://doc.iocoder.cn/img/ERP%E6%89%8B%E5%86%8C/%E9%87%87%E8%B4%AD%E6%A8%A1%E5%9D%97/%E9%87%87%E8%B4%AD%E9%80%80%E8%B4%A7-%E5%8F%8D%E5%AE%A1%E6%89%B9.png)

 ## [#](#_5-采购付款) 5. 采购付款

 参见 [《【财务】采购付款、销售收款》](/erp/finance-payment-receipt/) 文档。

