---
title: 微信公众号支付接入
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 80
---
# 微信公众号支付接入

前置阅读：

 ① 阅读 [《支付功能开启》](/pay/build/) 和 [《支付宝支付接入》](/pay/alipay-pay-demo/) 文档，一定要先跑通支付宝支付流程！！！不跑通支付宝，微信公众号支付更跑不通。

 ② 阅读 [《微信公众号登录》](/member/weixin-mp-login/) 文档，因为微信公众号支付需要先微信公众号登录，超级麻烦的说！

 注意，微信公众号支付不能使用“测试公众号”，必须使用认证过的公众号。并且，在阅读《公众号登录》文档时，前端项目需要使用 [《内网穿透》](/natapp/)，因为微信公众号支付只能在手机微信上测试！！！

 微信公众号支付，使用 WxPubPayClient 客户端进行对接。

 下面，我们以 `yudao-mall-uniapp` 商城项目，演示微信公众号支付的接入流程。

 友情提示：

 * [http://niubi.natapp1.cc  (opens new window)](http://niubi.natapp1.cc) 域名，是我前端项目的访问域名
* [http://yunai.natapp1.cc  (opens new window)](http://yunai.natapp1.cc) 域名，是我后端项目的访问域名

 所以，你的前后端项目也要分别使用 [《内网穿透》](/natapp/) 实现独立域名！！！

 ## [#](#_1-第一步-配置支付渠道) 1. 第一步，配置支付渠道

 ① 访问 [支付管理 -> 应用信息] 菜单，点击“商城应用”对应的【微信 JSAPI 支付】，进入支付渠道的配置。如下图所示：

 ![支付渠道配置](https://cloud.iocoder.cn/img/%E6%94%AF%E4%BB%98%E6%89%8B%E5%86%8C/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%94%AF%E4%BB%98%E6%8E%A5%E5%85%A5/%E6%94%AF%E4%BB%98%E6%B8%A0%E9%81%93%E9%85%8D%E7%BD%AE.png)

 * 在 [https://pay.weixin.qq.com/index.php/core/account/info  (opens new window)](https://pay.weixin.qq.com/index.php/core/account/info) 地址，可获取微信支付商户号
* 在 [https://pay.weixin.qq.com/index.php/core/cert/api\_cert#/  (opens new window)](https://pay.weixin.qq.com/index.php/core/cert/api_cert#/) 地址，可获取 API 证书、密钥

 友情提示：

 可以简单阅读下 [《微信官方文档 —— JSAPI 支付的接入前准备》  (opens new window)](https://pay.weixin.qq.com/wiki/doc/apiv3_partner/open/pay/chapter2_1.shtml) 文章。

 ② 访问微信支付的 [开发配置  (opens new window)](https://pay.weixin.qq.com/index.php/extend/pay_setting) 地址，设置 JSAPI 支付目录，设置为前端项目的访问域名。如下图所示：

 ![JSAPI 支付目录](https://cloud.iocoder.cn/img/%E6%94%AF%E4%BB%98%E6%89%8B%E5%86%8C/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%94%AF%E4%BB%98%E6%8E%A5%E5%85%A5/JSAPI%E6%94%AF%E4%BB%98%E7%9B%AE%E5%BD%95.png)

 ## [#](#_2-支付功能测试) 2. 支付功能测试

 ① IDEA 打开前端项目，搜索 `http://127.0.0.1:48080` 关键字，都替换成后端项目的访问域名。例如说下图：

 ![替换后端域名](https://cloud.iocoder.cn/img/%E6%94%AF%E4%BB%98%E6%89%8B%E5%86%8C/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%94%AF%E4%BB%98%E6%8E%A5%E5%85%A5/%E6%9B%BF%E6%8D%A2%E5%90%8E%E7%AB%AF%E5%9F%9F%E5%90%8D.png)

 ② 使用手机微信，访问前端项目的域名。随便找个商品下单，一路往下走，可以进入“收银台”界面（对应前端项目的 `pages/pay/index.vue` 文件）。如下图所示：

 ![收银台](https://cloud.iocoder.cn/img/%E6%94%AF%E4%BB%98%E6%89%8B%E5%86%8C/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%94%AF%E4%BB%98%E6%8E%A5%E5%85%A5/%E6%94%B6%E9%93%B6%E5%8F%B0.png)

 ③ 选择“微信支付”，点击“立即支付”按钮，即可进行微信支付。如下图所示：

 ![立即支付](https://cloud.iocoder.cn/img/%E6%94%AF%E4%BB%98%E6%89%8B%E5%86%8C/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%94%AF%E4%BB%98%E6%8E%A5%E5%85%A5/%E7%AB%8B%E5%8D%B3%E6%94%AF%E4%BB%98.png)

 * 前端代码的实现，可见 `sheep/platform/pay.js` 文件的 `#wechatOfficialAccountPay(...)` 方法
* 后端代码的实现，可见 AppPayOrderController 提供的 `#submitPayOrder(...)` 接口

 ④ 支付成功后，跳转到“支付结果”界面（对应前端项目的 `pages/pay/result.vue` 文件）。

 友情提示：

 如果这个过程中碰到问题，可以先使用「微信开发者工具」访问前端项目的域名，看看这个过程中有没什么报错。

 自查 30-60 分钟，如果还是无法解决，可以在星球发帖求助！但是注意，一定要先自查，因为这玩意没环境现场，很难搞啊！！！

