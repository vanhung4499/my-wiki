---
title: 异常处理（错误码）
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 37
---
# 异常处理（错误码）

本章节，将讲解异常相关的统一响应、异常处理、业务异常、错误码这 4 块的内容。

 ## [#](#_1-统一响应) 1. 统一响应

 后端提供 RESTful API 给前端时，需要响应前端 API 调用是否成功：

 * 如果成功，成功的数据是什么。后续，前端会将数据渲染到页面上
* 如果失败，失败的原因是什么。一般，前端会将原因弹出提示给用户

 因此，需要有**统一响应**，而不能是每个接口定义自己的风格。一般来说，统一响应返回信息如下：

 * 成功时，返回成功的状态码 + 数据
* 失败时，返回失败的状态码 + 错误提示

 在标准的 RESTful API 的定义，是推荐使用 [HTTP 响应状态码  (opens new window)](https://zh.wikipedia.org/wiki/HTTP%E7%8A%B6%E6%80%81%E7%A0%81) 作为状态码。一般来说，我们实践很少这么去做，主要原因如下：

 * 业务返回的错误状态码很多，HTTP 响应状态码无法很好的映射。例如说，活动还未开始、订单已取消等等
* 学习成本高，开发者对 HTTP 响应状态码不是很了解。例如说，可能只知道 200、403、404、500 几种常见的

 ### [#](#_1-1-commonresult) 1.1 CommonResult

 [`yudao-cloud`  (opens new window)](https://github.com/YunaiV/yudao-cloud) 项目在实践时，将状态码放在 Response Body 响应内容中返回。一共有 3 个字段，通过 [CommonResult  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/pojo/CommonResult.java) 定义如下：

 ![CommonResult](https://cloud.iocoder.cn/img/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/01.png)

 
```
// 成功响应
{
    code: 0,
    data: {
        id: 1,
        username: "yudaoyuanma"
    }
}

// 失败响应
{
    code: 233666,
    message: "徐妈太丑了"
}

```
可以增加 success 字段吗？

 有些团队在实践时，会增加了 `success` 字段，通过 `true` 和 `false` 表示成功还是失败。  

这个看每个团队的习惯吧。艿艿的话，还是偏好基于约定，返回 `0` 时表示成功。

 失败时的 `code` 字段，使用全局的错误码，稍后在 [「4. 错误码」](#_4-%E9%94%99%E8%AF%AF%E7%A0%81) 小节来讲解。

 ① 在 RESTful API 成功时，定义 Controller 对应方法的返回类型为 CommonResult，并调用 [`#success(T data)`  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/pojo/CommonResult.java#L63-L69) 方法来返回。代码如下图：

 ![CommonResult](https://cloud.iocoder.cn/img/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/02.png)

 CommonResult 的 `data` 字段是**泛型**，建议定义对应的 VO 类，而不是使用 Map 类。

 ② 在 RESTful API 失败时，通过抛出 Exception 异常，具体在 [「2. 异常处理」](#_2-%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86) 小节。

 ### [#](#_1-2-使用-controlleradvice) 1.2 使用 `@ControllerAdvice` ？

 在 Spring MVC 中，可以使用 `@ControllerAdvice` 注解，通过 Spring AOP 拦截修改 Controller 方法的返回结果，从而实现全局的统一返回。

 使用 @ControllerAdvice 注解的实战案例？

 如果你感兴趣的话，可以阅读 [《芋道 Spring Boot SpringMVC 入门 》  (opens new window)](https://www.iocoder.cn/Spring-Boot/SpringMVC/?yudao) 文章的「4. 全局统一返回 」小节。

 为什么项目不采用这种方式呢？主要原因是，这样的方式“破坏”了方法的定义，导致一些隐性的问题。例如说，Swagger 接口定义错误，展示的响应结果不是 CommonResult。

 还有个原因，部分 RESTful API 不需要自动包装 CommonResult 结果。例如说，第三方支付回调只需要返回 `"success"` 字符串。

 ## [#](#_2-异常处理) 2. 异常处理

 RESTful API 发生异常时，需要拦截 Exception 异常，转换成**统一响应**的格式，否则前端无法处理。

 ### [#](#_2-1-spring-mvc-的异常) 2.1 Spring MVC 的异常

 在 Spring MVC 中，通过 `@ControllerAdvice` + `@ExceptionHandler` 注解，声明将指定类型的异常，转换成对应的 CommonResult 响应。实现的代码，可见 [GlobalExceptionHandler  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-spring-boot-starter-web/src/main/java/cn/iocoder/yudao/framework/web/core/handler/GlobalExceptionHandler.java) 类，代码如下：

 ![GlobalExceptionHandler 异常处理](https://cloud.iocoder.cn/img/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/03.png)

 ### [#](#_2-2-filter-的异常) 2.2 Filter 的异常

 在请求被 Spring MVC 处理之前，是先经过 Filter 处理的，此时发生异常时，是无法通过 `@ExceptionHandler` 注解来处理的。只能通过 `try catch` 的方式来实现，代码如下：

 ![Filter 异常处理](https://cloud.iocoder.cn/img/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/04.png)

 ## [#](#_3-业务异常) 3. 业务异常

 在 Service 发生业务异常时，如果进行返回呢？例如说，用户名已经存在，商品库存不足等。常用的方案选择，主要有两种：

 * 方案一，使用 CommonResult 统一响应结果，里面有错误码和错误提示，然后进行 `return` 返回
* 方案二，使用 ServiceException 统一业务异常，里面有错误码和错误提示，然后进行 `throw` 抛出

 选择方案一 CommonResult 会存在两个问题：

 * 因为 Spring `@Transactional` 声明式事务，是基于异常进行回滚的，如果使用 CommonResult 返回，则事务回滚会非常麻烦
* 当调用别的方法时，如果别人返回的是 CommonResult 对象，还需要不断的进行判断，写起来挺麻烦的

 因此，项目采用方案二 ServiceException 异常。

 ### [#](#_3-1-serviceexception) 3.1 ServiceException

 定义 [ServiceException  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/exception/ServiceException.java) 异常类，继承 RuntimeException 异常类（非受检），用于定义业务异常。代码如下：

 ![ServiceException 业务异常](https://cloud.iocoder.cn/img/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/05.png)

 为什么继承 RuntimeException 异常？

 大多数业务场景下，我们无需处理 ServiceException 业务异常，而是通过 GlobalExceptionHandler 统一处理，转换成对应的 CommonResult 对象，进而提示给前端即可。  

如果真的需要处理 ServiceException 时，通过 `try catch` 的方式进行主动捕获。

 ### [#](#_3-2-serviceexceptionutil) 3.2 ServiceExceptionUtil

 在 Service 需抛出业务异常时，通过调用 [ServiceExceptionUtil  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/exception/util/ServiceExceptionUtil.java) 的 `#exception(ErrorCode errorCode, Object... params)` 方法来构建 ServiceException 异常，然后使用 `throw` 进行抛出。代码如下：

 
```
// ServiceExceptionUtil.java

public static ServiceException exception(ErrorCode errorCode) { /** 省略参数 */ }
public static ServiceException exception(ErrorCode errorCode, Object... params) { /** 省略参数 */ }

```
![ServiceException 业务异常](https://cloud.iocoder.cn/img/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/06.png)

 为什么使用 ServiceExceptionUtil 来构建 ServiceException 异常？

 错误提示的内容，支持使用管理后台进行动态配置，所以通过 ServiceExceptionUtil 获取内容的配置与格式化。

 ## [#](#_4-错误码) 4. 错误码

 错误码，对应 [ErrorCode  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/exception/ErrorCode.java) 类，枚举项目中的错误，**全局唯一**，方便定位是谁的错、错在哪。

 ![错误码](https://cloud.iocoder.cn/img/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/07.png)

 ### [#](#_4-1-错误码分类) 4.1 错误码分类

 错误码分成两类：全局的系统错误码、模块的业务错误码。

 #### [#](#_4-1-1-系统错误码) 4.1.1 系统错误码

 全局的系统错误码，使用 0-999 错误码段，和 [HTTP 响应状态码  (opens new window)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status) 对应。虽然说，HTTP 响应状态码作为业务使用表达能力偏弱，但是使用在系统层面还是非常不错的。

 系统错误码定义在 [GlobalErrorCodeConstants  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/exception/enums/GlobalErrorCodeConstants.java) 类，代码如下：

 ![GlobalErrorCodeConstants 类](https://cloud.iocoder.cn/img/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/08.png)

 #### [#](#_4-1-2-业务错误码) 4.1.2 业务错误码

 模块的业务错误码，按照模块分配错误码的**区间**，避免模块之间的错误码冲突。

 ① 业务错误码一共 10 位，分成 4 段，在 [ServiceErrorCodeRange  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/exception/enums/ServiceErrorCodeRange.java) 分配，规则与代码如下图：

 ![ServiceErrorCodeRange 类](https://cloud.iocoder.cn/img/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/09.png)

 ② 每个业务模块，定义自己的 ErrorCodeConstants 错误码枚举类。以 `yudao-module-system` 模块举例子，代码如下：

 ![ErrorCodeConstants 类](https://cloud.iocoder.cn/img/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/10.png)

 ### [#](#_4-2-错误码管理-已删除) 4.2 错误码管理（已删除）

 友情提示：

 最新版本的代码，已经移除“错误码管理”功能。原因是，该功能比较小众，可能只有极少数的用户需要~

 如果你系统里需要，可以参考 [8093ef3（后端）  (opens new window)](https://gitee.com/zhijiantianya/ruoyi-vue-pro/commit/8093ef3b968d566c9b42e9442a100932540683a7)、[98bf5a1（前端）  (opens new window)](https://gitee.com/yudaocode/yudao-ui-admin-vue3/commit/98bf5a102ee1533068b6ce5b2aa6cde2deb70c1b) 把代码复制、粘贴回来。

 在管理后台的 [系统管理 -> 错误码管理] 菜单，可以进行错误码的管理。

 ![系统管理 -> 错误码管理](https://cloud.iocoder.cn/img/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/11.png)

 启动中的项目会每 60 秒，加载最新的错误码配置。所以，我们在修改完错误码的提示后，无需重启项目。

 #### [#](#_4-2-1-手动添加) 4.2.1 手动添加

 点击 [新增] 按钮，进行错误码的手动添加。如下图所示：

 ![系统管理 -> 错误码管理](https://cloud.iocoder.cn/img/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/13.png)

 #### [#](#_4-2-2-自动添加) 4.2.2 自动添加

 通过 `yudao.error-code.constants-class-list` 配置项，设置需要自动添加的 ErrorCodeConstants 错误码枚举类。如下图所示：

 ![ 配置项](https://cloud.iocoder.cn/img/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/12.png)

 项目启动时，会自动扫描对应的 ErrorCodeConstants 中的错误码，自动添加或修改错误码的配置。

 **注意**，自动添加的错误码的类型为【自动生成】，一旦在管理后台手动 [编辑] 后，该错误码就不再支持自动修改。

 自动添加是如何实现的？

 参见 [`system/framework/errorcode`  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-spring-boot-starter-web/src/main/java/cn/iocoder/yudao/framework/errorcode/) 包的代码。
