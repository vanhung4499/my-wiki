---
title: 内网穿透
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 16
---
# 内网穿透

在和外部系统对接时，经常需要将本地的服务，暴露到外网中。这时候，就需要使用内网穿透工具了。例如说：支付宝回调、微信支付回调、微信公众号接入、微信小程序接入等等。

 常见的内网穿透工具，例如说，[ngrok  (opens new window)](https://ngrok.com/)、[frp  (opens new window)](https://github.com/fatedier/frp)、[natapp  (opens new window)](https://natapp.cn/) 等等。

 这里，我们使用 natapp 作为内网穿透工具，转发到后端的 48080 端口。

 ## [#](#_1-第一步-购买隧道) 1. 第一步，购买隧道

 访问 [https://natapp.cn/tunnel/buy/free  (opens new window)](https://natapp.cn/tunnel/buy/free) 地址，免费购买一个隧道。如下图所示：

 ![免费购买一个隧道](https://cloud.iocoder.cn/img/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%89%8B%E5%86%8C/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%8E%A5%E5%85%A5/%E7%AC%AC%E4%B8%89%E6%AD%A5-%E5%85%8D%E8%B4%B9%E8%B4%AD%E4%B9%B0%E4%B8%80%E4%B8%AA%E9%9A%A7%E9%81%93.png)

 ## [#](#_2-第二步-启动隧道) 2. 第二步，启动隧道

 购买完成后，参考 [《NATAPP 1 分钟快速新手图文教程》  (opens new window)](https://natapp.cn/article/natapp_newbie) 文档，将 natapp 进行启动。如下图所示：

 ![启动隧道](https://cloud.iocoder.cn/img/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%89%8B%E5%86%8C/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%8E%A5%E5%85%A5/%E7%AC%AC%E4%B8%89%E6%AD%A5-%E5%90%AF%E5%8A%A8%E9%9A%A7%E9%81%93.png)

