---
title: 配置读取
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 205
---
# 配置读取

在 [基础设施 -> 配置管理] 菜单，可以动态修改配置，无需重启服务器即可生效。

 ![配置管理](https://cloud.iocoder.cn/img/Vue2/%E9%85%8D%E7%BD%AE%E8%AF%BB%E5%8F%96/01.png)

 提示

 对应 [《后端手册 —— 配置中心》](/config-center/) 文档。

 ## [#](#_1-读取配置) 1. 读取配置

 前端调用 [`/@api/infra/config`  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue2/blob/master/src/api/infra/config.js#L20-L26) 的 `#getConfigKey(configKey)` 方法，获取指定 key 对应的配置的值。代码如下：

 
```
export function getConfigKey(configKey) {
  return request({
    url: '/infra/config/get-value-by-key?key=' + configKey,
    method: 'get'
  })
}

```
## [#](#_2-实战案例) 2. 实战案例

 在 [`src/views/infra/server/index.vue`  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue2/blob/master/src/views/infra/server/index.vue) 页面中，获取 key 为 `"url.skywalking"` 的配置的值。代码如下：

 ![前端案例](https://cloud.iocoder.cn/img/%E9%85%8D%E7%BD%AE%E4%B8%AD%E5%BF%83/07-vue2.png)

