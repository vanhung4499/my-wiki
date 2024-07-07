---
title: 微服务调试（必读）
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 50
---
# 微服务调试（必读）

## [#](#_1-多环境-env-组件) 1. 多环境 env 组件

 在微服务架构下，多服务的调试是个非常大的痛点：在大家使用 **同一个** 注册中心时，如果多个人在本地启动 **相同** 服务，可能需要调试的一个请求会打到其他开发的本地服务，实际是期望达到自己本地的服务。

 一般的解决方案是，使用 **不同** 注册中心，避免出现这个情况。但是，服务一多之后，就会产生新的痛点，同时本地启动所有服务很占用电脑内存。

 因此，我们实现了 [`yudao-spring-boot-starter-env`](https://github.com/YunaiV/yudao-cloud/tree/master/yudao-framework/yudao-spring-boot-starter-env) 组件，通过 Tag 给服务打标，实现在使用 **同一个** 注册中心的情况下，本地只需要启动需要调试的服务，并且保证自己的请求，必须达到自己本地的服务。如下图所示：

 ![整体流程](https://cloud.iocoder.cn/img/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%89%8B%E5%86%8C/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E8%81%94%E8%B0%83/%E6%95%B4%E4%BD%93%E6%B5%81%E7%A8%8B.png)

 * 测试环境：启动了 gateway、system、infra 服务；本地环境：只启动了 system 服务
* 请求时，带上 `tag = yunai`，优先请求本地环境 + `tag = yunai` 的服务：
	+ ① 由于本地未启动 gateway 服务，所以请求打到测试环境的 gateway 服务
	+ ② 由于请求 `tag = yunai`，所以转发到本地环境的 system 服务
	+ ③ 由于本地未启动 infra 服务，所以转发回测试环境的 infra 服务

 ## [#](#_2-功能演示) 2. 功能演示

 在本地模拟，启动三个进程，如下图所示：

 * `tag` 为空的 gateway、system 服务
* `tag` 为本机 `hostname`（例如说我本地是 `Yunai.local`）的 system 服务

 注意！！！

 `hostname` 是你的主机名：

 * Windows 在 cmd 里输入 hostname
* MacOS 在 terminal 里输入 hostname
 ### [#](#第一步-启动-gateway-服务) 第一步，启动 gateway 服务

 直接运行 GatewayServerApplication 类，启动 gateway 服务。此时，我们可以在 Nacos 看到该实例，它是没 `tag` 属性。如下图所示：

 ![gateway 服务](https://cloud.iocoder.cn/img/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%89%8B%E5%86%8C/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E8%81%94%E8%B0%83/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA-gateway%E6%9C%8D%E5%8A%A1.png)

 ### [#](#第二步-启动-system-服务【有-tag】) 第二步，启动 system 服务【有 tag】

 运行 SystemServerApplication 类，启动 system 服务。此时，我们可以在 Nacos 看到该实例，它是有 `tag` 属性。如下图所示：

 ![system 服务](https://cloud.iocoder.cn/img/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%89%8B%E5%86%8C/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E8%81%94%E8%B0%83/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA-system%E6%9C%8D%E5%8A%A1%E2%91%A0.png)

 因为我们默认在 `application-local.yaml` 配置文件里，添加了 `yudao.env.tag` 配置项为 `${HOSTNAME}`。如下图所示：

 ![ 配置项](https://cloud.iocoder.cn/img/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%89%8B%E5%86%8C/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E8%81%94%E8%B0%83/yudao-env-tag%E9%85%8D%E7%BD%AE%E9%A1%B9.png)

 ### [#](#第三步-启动-system-服务-【无-tag】) 第三步，启动 system 服务 【无 tag】

 ① 修改 system 服务的端口为 28081，`yudao.env.tag` 配置项为空。如下图所示：

 ![修改 system 服务的配置](https://cloud.iocoder.cn/img/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%89%8B%E5%86%8C/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E8%81%94%E8%B0%83/%E4%BF%AE%E6%94%B9system%E6%9C%8D%E5%8A%A1%E7%9A%84%E9%85%8D%E7%BD%AE.png)

 ② 再一个 SystemServerApplication，**额外**启动 system 服务。此时，我们可以在 Nacos 看到该实例，它是没 `tag` 属性。如下图所示：

 ![system 服务](https://cloud.iocoder.cn/img/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%89%8B%E5%86%8C/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E8%81%94%E8%B0%83/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA-system%E6%9C%8D%E5%8A%A1%E2%91%A1.png)

 ### [#](#第四步-请求测试) 第四步，请求测试

 ① 打开 `AuthController.http` 文件，设置第一个请求的 `tag` 为 `Yunai.local`（要替换成你的 hostname），如下图所示：

 ![AuthController 请求](https://cloud.iocoder.cn/img/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%89%8B%E5%86%8C/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E8%81%94%E8%B0%83/AuthController%E8%AF%B7%E6%B1%82.png)

 ② 点击前面的绿色小箭头，发起请求。从 IDEA 控制台的日志可以看到，只有有 tag 的 system 服务才会被调用。

 你可以多点几次，依然是这样的情况噢！

 ## [#](#_3-实现原理) 3. 实现原理

 ① 在服务注册时，会将 `yudao.env.tag` 配置项，写到 Nacos 服务实例的元数据，通过 [EnvEnvironmentPostProcessor](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-spring-boot-starter-env/src/main/java/cn/iocoder/yudao/framework/env/config/EnvEnvironmentPostProcessor.java#L22-L27) 类实现。

 ② 在服务调用时，通过 [EnvLoadBalancerClient](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-spring-boot-starter-env/src/main/java/cn/iocoder/yudao/framework/env/core/fegin/EnvLoadBalancerClient.java#L70-L75) 类，筛选服务实例，通过服务实例的 `tag` 元数据，匹配请求的 `tag` 请求头。

 ③ 在网关转发时，通过 [GrayLoadBalancer](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/filter/grey/GrayLoadBalancer.java#L86-L109) 类，效果和 EnvLoadBalancerClient 一致。

 ## [#](#_4-未来的拓展) 4. 未来的拓展

 除了微服务调试比较麻烦外，MQ 消息队列的消费调试也是个麻烦的事儿，未来也会进行支持。实现的效果如下：

 * 本地发送的 MQ 消息，优先被本地启动的消费者进行处理，方便调试。
* 如果本地没有启动消费者，则被测试环境的消费者进行处理，避免一致不被消费。
