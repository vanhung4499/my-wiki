---
title: 服务网关 Spring Cloud Gateway
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 53
---
# 服务网关 Spring Cloud Gateway

[`yudao-gateway`](https://github.com/YunaiV/yudao-cloud/tree/master/yudao-gateway) 模块，基于 Spring Cloud Gateway 构建 API 服务网关，提供用户认证、服务路由、灰度发布、访问日志、异常处理等功能。

 友情提示：如何学习 Spring Cloud Gateway？

 阅读 [《芋道 Spring Cloud 网关 Spring Cloud Gateway 入门
》](https://www.iocoder.cn/Spring-Cloud/Spring-Cloud-Gateway/?yudao) 文章。

 ## [#](#_1-服务路由) 1. 服务路由

 新建服务后，在 [`application.yaml`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/resources/application.yaml) 配置文件中，需要添加该服务的路由配置。示例如下图：

 ![服务网关](https://cloud.iocoder.cn/img/%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%85%B3/%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%85%B3.png)

 ## [#](#_2-用户认证) 2. 用户认证

 由 [`filter/security`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/filter/security/) 包实现，无需配置。

 TokenAuthenticationFilter 会获得请求头中的 `Authorization` 字段，调用 `system-server` 服务，进行用户认证。

 * 如果认证成功，会将用户信息放到 `login-user` 请求头，转发到后续服务。后续服务可以从 `login-user` 请求头，[解析](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-spring-boot-starter-security/src/main/java/cn/iocoder/yudao/framework/security/core/filter/TokenAuthenticationFilter.java#L77-L95)到用户信息。
* 如果认证失败，依然会转发到后续服务，由该服务决定是否需要登录，是否需要校验权限。

 ![用户认证](https://cloud.iocoder.cn/img/%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%85%B3/%E7%94%A8%E6%88%B7%E8%AE%A4%E8%AF%81.png)

 考虑到性能，API 网关会[本地缓存](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/filter/security/TokenAuthenticationFilter.java#L56-L71) Token 与用户信息，每次收到 HTTP 请求时，异步从 `system-server` 刷新本地缓存。

 ## [#](#_3-灰度发布) 3. 灰度发布

 由 [`filter/grey`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/filter/grey/) 包实现，实现原理如下：

 ![灰度发布原理](https://cloud.iocoder.cn/img/%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%85%B3/%E7%81%B0%E5%BA%A6%E5%8F%91%E5%B8%83%E5%8E%9F%E7%90%86.png)

 所以在使用灰度时，如要如下配置：

 ① 第一步，【网关】配置服务的路由配置使用 `grebLb://` 协议，指向灰度服务。例如说：

 ![ 协议](https://cloud.iocoder.cn/img/%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%85%B3/%E7%81%B0%E5%BA%A6%E8%B7%AF%E7%94%B1greyLb.png)

 ② 第二步，【服务】配置服务的版本 `version` 配置。例如说：

 ![ 版本](https://cloud.iocoder.cn/img/%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%85%B3/%E7%81%B0%E5%BA%A6%E8%B7%AF%E7%94%B1version.png)

 ③ 第三步，请求 API 网关时，请求头带上想要 `version` 版本。

 可能想让用户的请求带上 `version` 请求头比较难，可以通过 Spring Cloud Gateway 修改请求头，通过 User Agent、Cookie、登录用户等信息，来判断用户想要的版本。详细的解析，可见 [《Spring Cloud Gateway 实现灰度发布功能 》](https://www.jianshu.com/p/6db15bc0be8f) 文章。

 ## [#](#_4-访问日志) 4. 访问日志

 由 [`filter/logging`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/filter/logging/) 包实现，无需配置。

 每次收到 HTTP 请求时，会打印访问日志，包括 Request、Response、用户等信息。如下图所示：

 ![访问日志](https://cloud.iocoder.cn/img/%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%85%B3/%E8%AE%BF%E9%97%AE%E6%97%A5%E5%BF%97.png)

 ## [#](#_5-异常处理) 5. 异常处理

 由 [GlobalExceptionHandler](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/handler/GlobalExceptionHandler.java) 累实现，无需配置。

 请求发生异常时，会翻译异常信息，返回给用户。例如说：


```
{
  "code": 500,
  "data": null,
  "msg": "系统异常"
}

```
## [#](#_6-动态路由) 6. 动态路由

 在 Nacos 配置发生变化时，Spring Cloud Alibaba Nacos Config 内置的监听器，会监听到配置刷新，最终触发 Gateway 的路由信息刷新。

 参见 [《芋道 Spring Cloud 网关 Spring Cloud Gateway 入门 》](https://www.iocoder.cn/Spring-Cloud/Spring-Cloud-Gateway/?yudao) 博客的「6. 基于配置中心 Nacos 实现动态路由」小节。

 使用方式：在 Nacos 新增 DataId 为 `gateway-server.yaml` 的配置，修改 `spring.cloud.gateway.routes` 配置项。

 ## [#](#_7-swagger-接口文档) 7. Swagger 接口文档

 基于 Knife4j 实现 Swagger 接口文档的 [网关聚合](https://doc.xiaominfo.com/docs/middleware-sources/spring-cloud-gateway/spring-gateway-introduction)。需要路由配置如下：

 ![网关路由配置](https://cloud.iocoder.cn/img/%E6%96%B0%E5%BB%BA%E6%9C%8D%E5%8A%A1/102.png)

 友情提示：图中的 /v2/ 都改成 /v3/，或者以下面的文字为准！！！

 * 管理后台的接口：`- RewritePath=/admin-api/{服务的基础路由}/v3/api-docs, /v3/api-docs`
* 用户 App 的接口：`- RewritePath=/app-api/{服务的基础路由}/v3/api-docs, /v3/api-docs`
* Knife4j 配置：`knife4j.gateway.routes` 添加

 浏览器访问 [http://127.0.0.1:48080/doc.html](http://127.0.0.1:48080/doc.html) 地址，可以看到所有接口的信息。如下图所示：

 ![接口文档](https://cloud.iocoder.cn/img/%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%85%B3/%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3.png)

 ### [#](#_7-1-如何调用) 7.1 如何调用

 〇 点击左边「文档管理 - 全局参数设置」菜单，设置 `header-id` 和 `Authorization` 请求头。如下图所示：


```
tenant-id：1
Authorization: Bearer test1

```
![Knife4j 全局参数设置](https://cloud.iocoder.cn/img/%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%85%B3/Knife4j%E5%85%A8%E5%B1%80%E5%8F%82%E6%95%B0%E8%AE%BE%E7%BD%AE.png)

 添加完后，需要 F5 刷新下网页，否则全局参数不生效。

 ① 点击任意一个接口，进行接口的调用测试。这里，使用「管理后台 - 用户个中心」的“获得登录用户信息”举例子。

 ② 点击左侧「调试」按钮，并将请求头部的 `header-id` 和 `Authorization` 勾选上。

 其中，`header-id` 为租户编号，`Authorization` 的 `"Bearer test"` 后面为用户编号（模拟哪个用户操作）。

 ③ 点击「发送」按钮，即可发起一次 API 的调用。

 ![Knife4j 调试](https://cloud.iocoder.cn/img/%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3/Knife4j%E8%B0%83%E7%94%A8.png)

 ### [#](#_7-2-如何关闭) 7.2 如何关闭

 如果想要禁用 Swagger 功能，可通过 `knife4j.gateway.enabled` 配置项为 `false`。一般情况下，建议 prod 生产环境进行禁用，避免发生安全问题。

 ![Knife4j 关闭](https://cloud.iocoder.cn/img/%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%85%B3/Knife4j%E5%85%B3%E9%97%AD.png)

 ## [#](#_8-cors-跨域处理) 8. Cors 跨域处理

 由 [`filter/cors`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/filter/cors/) 包实现，无需配置。
