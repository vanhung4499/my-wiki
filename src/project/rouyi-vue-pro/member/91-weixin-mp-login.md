---
title: 微信公众号登录
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 93
---
# 微信公众号登录

前置阅读文章：

 * [《用户体系》](/user-center/)
* [《三方登录》](/social-user/)
 本文是 [《三方登录》](/social-user/) 的延伸，讲解 [`yudao-mall-uniapp`  (opens new window)](https://github.com/yudaocode/yudao-mall-uniapp) 商城小程序如何实现微信 **公众号** 登录的功能。

 ## [#](#_1-公众号准备) 1. 公众号准备

 友情提示：

 本文，我们以“测试公众号”举例子，方便大家操作，认证一个公众号太难了！！！

 ① 参考 [微信公众平台接口测试帐号申请  (opens new window)](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login) 链接，申请一个测试公众号。

 ② 将 `appID` 和 `appSecret` 配置，设置到后端项目 `application-local.yaml` 的 `wx.mp` 配置项中。如下图所示：

 ![测试公众号 - 密钥](https://doc.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%99%BB%E5%BD%95/%E6%B5%8B%E8%AF%95%E5%85%AC%E4%BC%97%E5%8F%B7-%E5%AF%86%E9%92%A5.png)

 ![ 配置项](https://doc.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%99%BB%E5%BD%95/%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E9%A1%B9.png)

 ③ 修改“JS接口安全域名”，设置为前端的访问地址。例如说，现在本地是 `http://127.0.0.1:3000`。如下图所示：

 ![JS 接口安全域名.png](https://doc.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%99%BB%E5%BD%95/JS%E6%8E%A5%E5%8F%A3%E5%AE%89%E5%85%A8%E5%9F%9F%E5%90%8D.png)

 注意：自己需要关注下自己的测试公众号！！！

 ④ 修改“网页授权获取用户基本信息”，设置为前端的访问地址。例如说，现在本地是 `http://127.0.0.1:3000`。如下图所示：

 ![网页授权获取用户基本信息](https://doc.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%99%BB%E5%BD%95/%E7%BD%91%E9%A1%B5%E6%8E%88%E6%9D%83%E8%8E%B7%E5%8F%96%E7%94%A8%E6%88%B7%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF.png)

 补充说明：如果你是正式的公众号，需要额外看下这部分的内容：

 ① 设置“IP白名单”，在公众号的 [设置与开发 - 安全中心] 菜单，如下图所示：

 ![IP 白名单](https://doc.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%99%BB%E5%BD%95/IP%E7%99%BD%E5%90%8D%E5%8D%95.png)

 ② 在公众号的 [设置与开发 - 公众号设置] 菜单，设置“JS接口安全域名”、“JS接口安全域名”、“网页授权域名”，如下图所示：

 ![公众号设置](https://doc.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%99%BB%E5%BD%95/%E5%85%AC%E4%BC%97%E5%8F%B7%E8%AE%BE%E7%BD%AE.png)

 * 设置时，需要外网可访问，可以需要使用 [natapp](/natapp/) 进行内网穿透
* 上图的 `MP_verify_XXXXXXXXXXXXXXXX.txt` 文件，可以直接放在 `yudao-mall-uniapp` 商城项目的根目录
 ## [#](#_2-代码实现) 2. 代码实现

 ### [#](#_2-1-项目启动) 2.1 项目启动

 ① 参考 [《快速启动【前端】》](/quick-start-front/) 文档的「2. uni-app 商城移动端」小节，将 `yudao-mall-uniapp` 商城项目跑起来。

 ② 下载 [微信开发者工具  (opens new window)](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，并进行安装。安装后，选择「公众号网页项目」。如下图所示：

 ![公众号网页项目](https://doc.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%99%BB%E5%BD%95/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BD%91%E9%A1%B5%E9%A1%B9%E7%9B%AE.png)

 ### [#](#_2-2-微信-jssdk) 2.2 微信 JSSDK

 访问 `http://127.0.0.1:3000/` 地址（其它地址也可以），它会触发 [微信 JSSDK  (opens new window)](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html) 初始化的逻辑，对应前端 `sheep/libs/sdk-h5-weixin.js` 文件的 `#init(...)` 方法中。

 微信 JSSDK 所需要的签名，由后端的 AppAuthController 的 `#createWeixinMpJsapiSignature(...)` 方法所提供。

 ### [#](#_2-3-登录流程) 2.3 登录流程

 友情提示：

 可以简单阅读下 [《微信官方文档 —— 网页授权》  (opens new window)](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html) 文章。

 ① 访问 `http://127.0.0.1:3000/#/pages/user/info` 地址，触发弹出“登录窗口”，对应前端 `sheep/components/s-auth-modal/s-auth-modal.vue` 组件。如下图所示：

 ![登录弹窗](https://doc.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%99%BB%E5%BD%95/%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.png)

 ② 点击「微信登录」图标，触发微信公众号登录。前端核心实现都在 `sheep/platform/provider/wechat/officialAccount.js` 的 `#login(...)` 方法中。它一共包含 2 个步骤。

 ③ 【第一步】前端调用后端的 AppAuthController 的 `#socialAuthRedirect(...)` 方法，获得微信公众号的登录地址，并进行跳转。效果如下图：

 ![微信公众号的登录地址](https://doc.iocoder.cn/img/%E4%BC%9A%E5%91%98%E6%89%8B%E5%86%8C/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%99%BB%E5%BD%95/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%9A%84%E7%99%BB%E5%BD%95%E5%9C%B0%E5%9D%80.png)

 ps：为了在微信登录成功后，可以回到登陆前的 URL 地址，会将该 URL 存储到 `uni.setStorageSync('returnUrl', location.href)` 中。

 ④ 【第二步】点击「同意」按钮，跳转回前端的 `pages/index/login.vue` 页面，进行 **真正的** 微信登录逻辑。

 此时，前端从 URL 中解析到微信回调提供的 `code` 授权码参数，调用后端的 AppAuthController 的 `#socialLogin(...)` 方法，进行登录逻辑。注意：

 * 情况一：如果该微信用户已经绑定会员用户，则直接进行登录
* 情况二：如果该微信用户没有绑定会员用户，则会自动创建一个会员用户，并进行登录。下次重新登录时，就走【情况一】的逻辑。

 ps：登录成功后，通过 `uni.getStorageSync('returnUrl')` 获得登录前的 URL 地址，进行跳转。

