---
title: 流程设计器（钉钉、飞书）
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 66
---
# 流程设计器（钉钉、飞书）

友情提示：

 绝大部署功能，已经在 `master` 和 `master-jdk17` 分支体验。

 如下是我们的开发分支，感兴趣也可以关注：

 * 前端：[https://gitee.com/yudaocode/yudao-ui-admin-vue3  (opens new window)](https://gitee.com/yudaocode/yudao-ui-admin-vue3) 的 [`feature/bpm`  (opens new window)](https://gitee.com/yudaocode/yudao-ui-admin-vue3/tree/feature%2Fbpm/) 分支
* 后端：[https://gitee.com/zhijiantianya/ruoyi-vue-pro  (opens new window)](https://gitee.com/zhijiantianya/ruoyi-vue-pro) 的 [`feature/bpm`  (opens new window)](https://gitee.com/zhijiantianya/ruoyi-vue-pro/tree/feature%2Fbpm/) 分支
 ## [#](#_1-如何体验) 1. 如何体验？

 ① 启动：参考 [《工作流 —— 功能开启》](/bpm/) 文档，前后端都切换成 `feature/bpm` 分支！

 ② 使用：参考 [《流程设计器（BPMN）》](/bpm/model-designer-bpmn/) 文档，只是编辑器换成 [访钉钉设计流程]。新建流程时，选择 “SIMPLE” 设计器即可。后续点击【设计】按钮，就会出现下图：

 ![](https://doc.iocoder.cn/img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%89%8B%E5%86%8C/%E9%92%89%E9%92%89%E8%AE%BE%E8%AE%A1%E5%99%A8/02.png)

 ## [#](#_2-开发进展) 2. 开发进展

 目前正在开发“二期”部分，完成会合并到 master 分支。

 ### [#](#_2-1-一期-已完成) 2.1 一期（已完成）

 

| 功能 | 状态 | 进展 |
| --- | --- | --- |
| 流程节点 -> 发起人 | 已完成 | 100% |
| 流程节点 -> 审批人 | 已完成 | 100% |
| 流程节点 -> 抄送人 | 已完成 | 100% |
| 流程节点 -> 条件分支 | 已完成 | 100% |
| 流程节点 -> 并行分支 | 已完成 | 100% |

 ### [#](#_2-2-二期-进行中) 2.2 二期（进行中）

 

| 功能 | 状态 | 进展 |
| --- | --- | --- |
| 流程节点 -> 表单权限 | 已完成 | 100% |
| 流程节点 -> 包容分支 | 已完成 | 100% |
| 拓展设置 -> 自动去重 | 已完成 | 100% |
| 拓展设置 -> 撤销流程 |  |  |
| 流程节点 -> 延迟器 |  |  |
| 流程节点 -> 同步/异步触发器 |  |  |
| 流程节点 -> 子流程 |  |  |
| 流程节点 -> 动态路由 |  |  |
| 流程节点 -> 修改/删除数据（待定） |  |  |

 ### [#](#_2-3-三期-未开始) 2.3 三期（未开始）

 

| 功能 | 状态 | 进展 |
| --- | --- | --- |
| 拓展设置 -> 前置校验 |  |  |
| 拓展设置 -> 前置/后置通知 |  |  |
| 流程设置 -> 流程报表 |  |  |
| 流程设置 -> 自定义打印模版 |  |  |
| 流程设置 -> 自定义流程编号 |  |  |
| 流程设置 -> 动态路由 |  |  |
| 流程节点 -> 修改/删除数据（待定） |  |  |

