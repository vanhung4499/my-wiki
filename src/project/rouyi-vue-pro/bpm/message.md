---
title: 流程审批通知
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 75
---
# 流程审批通知

相关视频：

 * [22、如何实现工作流的短信通知？](https://t.zsxq.com/04eyRRJ2f)
 流程（审批）在发生变化时，会发送通知给相关的人。目前有三个场景会有通知，通过短信的方式。

 ![短信通知](https://doc.iocoder.cn/img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%89%8B%E5%86%8C/%E6%B5%81%E7%A8%8B%E5%AE%A1%E6%89%B9%E9%80%9A%E7%9F%A5/%E7%9F%AD%E4%BF%A1%E6%A8%A1%E7%89%88.png)

 它是通过 [BpmMessageService](https://github.com/YunaiV/ruoyi-vue-pro/blob/master/yudao-module-bpm/yudao-module-bpm-biz/src/main/java/cn/iocoder/yudao/module/bpm/framework/flowable/core/candidate/expression/BpmTaskAssignLeaderExpression.java) 调用 SmsSendApi 短信 API 所实现，如下图所示：

 ![BpmMessageService](https://doc.iocoder.cn/img/%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%89%8B%E5%86%8C/%E6%B5%81%E7%A8%8B%E5%AE%A1%E6%89%B9%E9%80%9A%E7%9F%A5/BpmMessageService.png)

 ① 如果想要接入其它通知方式，在 BpmMessageService 调用其它通知的 API 即可，例如说：

 * [《邮件配置》](/mail)
* [《站内信配置》](/notify)

 ② 如果想要更多场景的通知，可以考虑基于 [《执行监听器、任务监听器》](/bpm/listener/) 实现，在监听器中调用通知 API。
