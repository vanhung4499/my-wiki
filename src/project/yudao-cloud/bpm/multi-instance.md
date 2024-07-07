---
title: 会签、或签、依次审批
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 72
---
# 会签、或签、依次审批

相关视频：

 * [15、如何实现会签、或签任务？](https://t.zsxq.com/04yFUVZvF)
 支持多人审批，包括：

 * 会签（并行会签）：同一个审批节点设置多个人（如 A、B、C 三人，三人会同时收到待办任务），需全部同意之后，审批才可到下一审批节点
* 或签（并行或签）：同一个审批节点设置多个人，任意一个人处理后，就能进入下一个节点
* 依次审批（顺序会签）：同一个审批节点设置多个人（如 A、B、C 三人），三人按顺序依次收到待办，即 A 先审批，A 提交后 B 才能审批，需全部同意之后，审批才可到下一审批节点

 ## [#](#_1-多人审批) 1. 多人审批

 ## [#](#_1-会签-并行会签) 1. 会签（并行会签）

 ![会签配置](https://cloud.iocoder.cn/img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%89%8B%E5%86%8C/%E5%A4%9A%E4%BA%BA%E5%AE%A1%E6%89%B9/%E4%BC%9A%E7%AD%BE%E9%85%8D%E7%BD%AE.png)

 * 会签配置：并行多重事件，实现多个人同时审批
* 完成条件：`${ nrOfCompletedInstances >= nrOfInstances }`，表示所有人都审批通过，才能进入下一个节点

 疑问：`nrOfCompletedInstances`、`nrOfInstances` 表示什么意思？

 * `nrOfCompletedInstances`：当前节点已完成的任务数量
* `nrOfInstances`：当前节点总的任务数量

 因此，`${ nrOfCompletedInstances >= nrOfInstances }` 就是，“已完成”大于“总的”数量，即所有人都审批通过。

 ## [#](#_2-或签-并行或签) 2. 或签（并行或签）

 ![或签配置](https://cloud.iocoder.cn/img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%89%8B%E5%86%8C/%E5%A4%9A%E4%BA%BA%E5%AE%A1%E6%89%B9/%E6%88%96%E7%AD%BE%E9%85%8D%E7%BD%AE.png)

 * 会签配置：并行多重事件，实现多个人同时审批
* 完成条件：`${ nrOfCompletedInstances == 1 }`，表示只要有一个人审批通过，就能进入下一个节点

 因此，会签和或签的差异，就在于完成条件的不同。

 ## [#](#_3-依次审批) 3. 依次审批

 ![依次审批配置](https://cloud.iocoder.cn/img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%89%8B%E5%86%8C/%E5%A4%9A%E4%BA%BA%E5%AE%A1%E6%89%B9/%E4%BE%9D%E6%AC%A1%E5%AE%A1%E6%89%B9%E9%85%8D%E7%BD%AE.png)

 * 依次审批配置：顺序多重事件，实现多个人按顺序审批
* 循环数量：1，表示每次（“循环”）只有一个人审批
* 完成条件：`${ nrOfCompletedInstances >= nrOfInstances }`，表示只要有一个人审批通过，就能进入下一个节点

 因此，依次审批和会签的差异，就在于是否并行审批。



---

 按照这个思路，实现“票签”，是不是很简单？！

 友情提示：什么是“票签”？

 指同一个审批节点设置多个人，如 A、B、C 三人，当通过比例大于 50% 就能进入下一个节点。

 ## [#](#_2-实现原理) 2. 实现原理

 在 [《选择审批人、发起人自选》](/bpm/assignee) 小节中，我们看到使用 BpmUserTaskActivityBehavior 实现了审批任务的审批人分配。实际上，还有两个 Behavior 类，如下图所示：

 ![Behavior 类图](https://cloud.iocoder.cn/img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%89%8B%E5%86%8C/%E5%A4%9A%E4%BA%BA%E5%AE%A1%E6%89%B9/Behavior.png)

 * [BpmParallelMultiInstanceBehavior](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-bpm/yudao-module-bpm-biz/src/main/java/cn/iocoder/yudao/module/bpm/framework/flowable/core/behavior/BpmParallelMultiInstanceBehavior.java)：并行 + 多实例（单节点多任务）的 Behavior 类
* [BpmSequentialMultiInstanceBehavior](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-bpm/yudao-module-bpm-biz/src/main/java/cn/iocoder/yudao/module/bpm/framework/flowable/core/behavior/BpmSequentialMultiInstanceBehavior.java)：顺序 + 多实例（单节点多任务）的 Behavior 类

 ### [#](#_2-1-并行-bpmparallelmultiinstancebehavior) 2.1 并行 BpmParallelMultiInstanceBehavior

 ① BpmParallelMultiInstanceBehavior 实现 Flowable ParallelMultiInstanceBehavior 类，实现单节点多任务的审批人 **“计算”**。如下图所示：

 ![BpmParallelMultiInstanceBehavior](https://cloud.iocoder.cn/img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%89%8B%E5%86%8C/%E5%A4%9A%E4%BA%BA%E5%AE%A1%E6%89%B9/BpmParallelMultiInstanceBehavior.png)

 ② BpmUserTaskActivityBehavior，判断是多实例的情况，则复用 BpmParallelMultiInstanceBehavior “计算”结果，直接设置审批人。如下图所示：

 ![BpmUserTaskActivityBehavior](https://cloud.iocoder.cn/img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%89%8B%E5%86%8C/%E5%A4%9A%E4%BA%BA%E5%AE%A1%E6%89%B9/BpmUserTaskActivityBehavior.png)

 所以，先是 BpmParallelMultiInstanceBehavior 计算审批任务数量 + 审批人列表，然后 BpmUserTaskActivityBehavior 直接设置审批人。

 ### [#](#_2-2-顺序-bpmsequentialmultiinstancebehavior) 2.2 顺序 BpmSequentialMultiInstanceBehavior

 ① BpmSequentialMultiInstanceBehavior 实现 Flowable SequentialMultiInstanceBehavior 类，实现单节点多任务的审批人 **“计算”**。如下图所示：

 ![BpmSequentialMultiInstanceBehavior](https://cloud.iocoder.cn/img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%89%8B%E5%86%8C/%E5%A4%9A%E4%BA%BA%E5%AE%A1%E6%89%B9/BpmSequentialMultiInstanceBehavior.png)

 ② 还是使用 BpmUserTaskActivityBehavior，逻辑是一模一样的。

 所以，BpmSequentialMultiInstanceBehavior 和 BpmParallelMultiInstanceBehavior 基本是一致的，差异只是前者返回的是 LinkedHashSet 有序集合。最终，还是交给 Flowable 到底是一次性创建多个审批任务，还是按照顺序创建多个审批任务。
