---
title: 宝塔部署
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 180
---
# 宝塔部署

本小节，讲解如何将前端 + 后端项目，**使用 [宝塔  (opens new window)](https://www.bt.cn/u/Nm1mHQ)**，部署到 dev 开发环境下的一台 Linux 服务器上。如下图所示：

 ![Linux 部署](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/01.png)

 友情提示：

 本文的部署过程，本质和 [Linux 部署](/deployment-linux) 一样，只是使用了宝塔面板，简化了一些操作。

 另外，如果你在部署过程中碰到问题，也可以参考 [https://articles.zsxq.com/id\_xu72z2zjekbx.html  (opens new window)](https://articles.zsxq.com/id_xu72z2zjekbx.html) 文章，来自球友的宝塔部署。

 ## [#](#_1-环境准备) 1. 环境准备

 需要安装如下环境：

 * 宝塔：运维面板
* MySQL：数据库
* Redis：缓存
* JDK：后端运行环境
* Nginx：负载均衡

 ### [#](#_1-0-安装宝塔) 1.0 安装宝塔

 ① 访问 [宝塔  (opens new window)](https://www.bt.cn/u/Nm1mHQ) 官网，注册账号。因为登录后，需要绑定宝塔账号。

 ② 访问 [https://www.bt.cn/new/download.html  (opens new window)](https://www.bt.cn/new/download.html) 地址，选择你的系统版本，下载对应的安装包。

 这里，我们使用 Centos 9，所以只需要执行如下命令：

 
```
url=https://download.bt.cn/install/install_lts.sh;if [ -f /usr/bin/curl ];then curl -sSO $url;else wget -O install_lts.sh $url;fi;bash install_lts.sh ed8484bec

```
整个安装过程预计需要 5 分钟左右，成功后可见如下日志：

 
```
========================面板账户登录信息==========================

 【云服务器】请在安全组放行 23471 端口
 外网面板地址: https://8.149.143.162:23471/06777072
 内网面板地址: https://172.26.126.181:23471/06777072
 username: pru5q1ad
 password: 6fc718b8

```
③ 访问面板地址，使用上面的 `username`、`password` 登录。注意，第一次登录，需要绑定宝塔账号。

 ![宝塔首页](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/%E5%AE%9D%E5%A1%94%E9%A6%96%E9%A1%B5.png)

 ### [#](#_1-1-安装-mysql) 1.1 安装 MySQL

 需要安装 MySQL，并导入 SQL 脚本。

 #### [#](#第一步-安装-mysql) 第一步，安装 MySQL

 友情提示：安装 MySQL 是可选步骤，也可以购买 MySQL 云服务。

 在宝塔首页，点击左侧的 [数据库] 菜单，选择 [MySQL] 选项，之后点击 [安装mysql环境] 选项。

 再之后，选择 [mysql 8.4.0] 版本，点击 [极速安装] 按钮。如下图所示：

 ![安装 MySQL](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/mysql%E5%AE%89%E8%A3%85.png)

 #### [#](#第二步-导入-sql-脚本) 第二步，导入 SQL 脚本

 ① 点击 [添加数据库] 按钮，创建一个名字为 `ruoyi-vue-pro` 数据库，。如下图所示：

 ![新建数据库](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/mysql%E6%96%B0%E5%BB%BA%E6%95%B0%E6%8D%AE%E5%BA%93.png)

 ② 点击 [导入] 按钮，再点击 [从本地上传] 按钮，执行数据库对应的 [`sql`  (opens new window)](https://github.com/YunaiV/ruoyi-vue-pro/tree/master/sql) 目录下的 SQL 文件，进行初始化。如下图所示：

 ![导入 SQL](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/mysql%E5%AF%BC%E5%85%A5%E6%95%B0%E6%8D%AE.png)

 疑问：如何使用本地 Navicat 连接该 MySQL？

 参考 [https://www.bt.cn/bbs/thread-179-1-1.html  (opens new window)](https://www.bt.cn/bbs/thread-179-1-1.html) 文档。

 当然，如果使用阿里云等云服务，相关的 3306 端口也需要放行。

 ### [#](#_1-2-安装-redis) 1.2 安装 Redis

 友情提示：安装 Redis 是可选步骤，也可以购买 Redis 云服务。

 在宝塔首页，点击左侧的 [数据库] 菜单，选择 [Redis] 选项，之后点击 [安装Redis环境] 选项。

 再之后，选择 [redis 7.2.4] 版本，点击 [立即安装] 按钮。如下图所示：

 ![安装 Redis](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/redis%E5%AE%89%E8%A3%85.png)

 ### [#](#_1-3-安装-jdk) 1.3 安装 JDK

 在宝塔首页，点击左侧的 [网站] 菜单，之后选择 [Java 项目] 选项。

 再之后，点击 [Java环境管理] 按钮，选择 [jdk1.8.0\_371] 版本，点击 [安装] 按钮。如下图所示：

 ![安装 JDK](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/jdk%E5%AE%89%E8%A3%85.png)

 友情提示：如果已经安装 JDK，可不安装。建议使用的 JDK 版本为 8、11、17 这三个。

 ### [#](#_1-4-安装-nginx) 1.4 安装 Nginx

 在宝塔首页，点击左侧的 [网站] 菜单，之后选择 [反向代理] 选项。

 再之后，点击 [安装Nginx] 按钮，选择 [nginx 1.24.0] 版本，点击 [极速安装] 按钮。如下图所示：

 ![安装 Nginx](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/nginx%E5%AE%89%E8%A3%85.png)

 ## [#](#_2-部署后端服务) 2. 部署后端服务

 #### [#](#第一步-修改配置) 第一步，修改配置

 后端 dev 开发环境对应的是 [`application-dev.yaml`  (opens new window)](https://github.com/YunaiV/ruoyi-vue-pro/blob/master/yudao-server/src/main/resources/application-dev.yaml) 配置文件，主要是修改 MySQL 和 Redis 为你的地址。如下图所示：

 ![ 配置文件](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/03.png)

 #### [#](#第二步-编译后端) 第二步，编译后端

 在项目的根目录下，执行 `mvn clean package -Dmaven.test.skip=true` 命令，编译后端项目，构建出它的 Jar 包。如下图所示：

 ![编译后端](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/02.png)

 疑问：-Dmaven.test.skip=true 是什么意思？

 跳过单元测试的执行。如果你项目的单元测试写的不错，建议使用 `mvn clean package` 命令，执行单元测试，保证交付的质量。

 #### [#](#第三步-上传-jar-包) 第三步，上传 Jar 包

 在宝塔首页，点击左侧的 [文件] 菜单， 在 `/www/wwwroot` 目录下，创建一个名字为 `yudao-server` 的目录。

 之后，将 `yudao-server.jar` 上传到该目录下。如下图所示：

 ![上传 Jar 包](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/server%E4%B8%8A%E4%BC%A0jar%E5%8C%85.png)

 疑问：如果构建 War 包，部署到 Tomcat 下？

 并不推荐采用 War 包部署到 Tomcat 下。如果真的需要，可以参考 [《Deploy a Spring Boot WAR into a Tomcat Server》  (opens new window)](https://www.baeldung.com/spring-boot-war-tomcat-deploy) 文章。

 #### [#](#第四步-启动后端) 第四步，启动后端

 ① 在宝塔首页，点击左侧的 [网站] 菜单，之后选择 [Java项目] 选项。

 再之后，点击 [添加Java项目] 按钮，选择该上传的 `yudao-server` 包，并在“项目启动命令”补充 `--spring.profiles.active=dev` 参数。如下图所示：

 ![添加 Java 项目](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/server%E6%B7%BB%E5%8A%A0%E9%A1%B9%E7%9B%AE.png)

 ② 后续，可以点击该项目的 [设置] 按钮，进行日志管理、性能监控、负载状态、配置文件等等。如下图所示：

 ![Java 项目设置](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/server%E6%97%A5%E5%BF%97%E7%AE%A1%E7%90%86.png)

 ## [#](#_3-部署前端) 3. 部署前端

 项目的管理后台有 3 个版本（只需要看你的版本即可）：

 * `yudao-ui-admin-vue3`：基于 Vue3 + element-plus
* `yudao-ui-admin-vben`：基于 Vue3 + vben(ant-design-vue)
* `yudao-ui-admin-vue2`：基于 Vue2 + element-ui

 注意，前端无法直接启动，而是需要通过 Nginx 转发读取前端构建出来的静态文件，最终都放在服务器上的 `/www/wwwroot/yudao-ui-admin` 目录下。

 ### [#](#_3-1-yudao-ui-admin-vue3) 3.1 yudao-ui-admin-vue3

 基于 Vue3 + element-plus

 #### [#](#第一步-修改配置-2) 第一步，修改配置

 前端 dev 开发环境对应的是 [`.env.dev`  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue3/blob/master/.env.dev#L6-L7) 配置文件，主要是修改 `VITE_BASE_URL` 为你的后端项目的访问地址。如下图所示：

 ![ 配置文件](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/ep-env.png)

 #### [#](#第二步-编译前端) 第二步，编译前端

 在前端项目的根目录下，执行 `npm run build:dev` 命令，编译前端项目，构建出它的 `dist` 文件，里面是 HTML、CSS、JavaScript 等静态文件。如下图所示：

 ![编译前端](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/ep-%E7%BC%96%E8%AF%91.png)

 如下想要打包其它环境，可使用如下命令：

 
```
npm run build:prod ## 打包 prod 生产环境
npm run build:stage ## 打包 stage 预发布环境

```
如果是在服务器上构建，并且出现卡死的情况，可以参考 [https://gitee.com/yudaocode/yudao-ui-admin-vue3/issues/IAU0T3  (opens new window)](https://gitee.com/yudaocode/yudao-ui-admin-vue3/issues/IAU0T3) 解决

 其它高级参数说明【可暂时不看】：

 ① `VITE_PUBLIC_PATH`：前端打包的路径（静态资源的基础路径），一般默认为 `/` 即可。目前有两种用法：

 第一种，可用于二级目录部署。例如说，`VITE_PUBLIC_PATH` 设置为 `/demo` 。然后 Nginx 配置时，需要特殊注意，如下所示：

 
```
        location /demo { # 注意点 1：不需要 / 结尾
            # 注意点 2：二级路由时需要使用别名 alias，不用 root
            alias   /work/projects/yudao-ui-admin/; # 注意点 3：需要 / 结尾
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

```
第二种，可用于七牛等 CDN 服务，读取前端的静态文件，提升访问速度，建议 prod 生产环境使用。例如说，我们演示环境的 `VITE_PUBLIC_PATH` 是 `http://static-vue3.yudao.iocoder.cn/` 。

 具体操作，可参考文章的 [《Vue 项目使用七牛云 CDN 存放静态资源》  (opens new window)](https://blog.csdn.net/weixin_71403100/article/details/132037721) 的「二、实现方式 」部分，只是最终的“修改 index.html 中静态资源引用”，变成 `PUBLIC_PATH` 修改即可。

 #### [#](#第三步-上传-dist-文件) 第三步，上传 `dist` 文件

 ① 选中本地的 `dist` 内的所有文件，进行压缩。（注意，不是压缩 `dist` 文件夹，而是选中它里面所有的内容！！！）

 ② 在宝塔首页，点击左侧的 [文件] 菜单， 在 `/www/wwwroot` 目录下，创建一个名字为 `yudao-ui-admin` 的目录。

 之后，上传 `dist.zip` 到该目录下，并进行解压。最终如下图所示：

 ![上传  文件](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/ep-dist.png)

 ### [#](#_3-2-yudao-ui-admin-vben) 3.2 yudao-ui-admin-vben

 基于 Vue3 + vben(ant-design-vue)

 #### [#](#第一步-修改配置-3) 第一步，修改配置

 前端 production 开发环境对应的是 [`.env.production`  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vben/blob/master/.env.production#L15-L21) 配置文件，主要是修改 `VITE_GLOB_BASE_URL`、`VITE_GLOB_API_URL` 为你的后端项目的访问地址。如下图所示：

 ![ 配置文件](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/vben-env.png)

 其它高级参数说明【可暂时不看】：

 ① `VITE_PUBLIC_PATH`：前端打包的路径（静态资源的基础路径），一般默认为 `/` 即可。目前有两种用法：

 第一种，可用于二级目录部署。例如说，`VITE_PUBLIC_PATH` 设置为 `/demo` 。然后 Nginx 配置时，需要特殊注意，如下所示：

 
```
        location /demo { # 注意点 1：不需要 / 结尾
            # 注意点 2：二级路由时需要使用别名 alias，不用 root
            alias   /work/projects/yudao-ui-admin/; # 注意点 3：需要 / 结尾
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

```
第二种，可用于七牛等 CDN 服务，读取前端的静态文件，提升访问速度，建议 prod 生产环境使用。例如说，我们演示环境的 `VITE_PUBLIC_PATH` 是 `http://static-vue3.yudao.iocoder.cn/` 。

 具体操作，可参考文章的 [《Vue 项目使用七牛云 CDN 存放静态资源》  (opens new window)](https://blog.csdn.net/weixin_71403100/article/details/132037721) 的「二、实现方式 」部分，只是最终的“修改 index.html 中静态资源引用”，变成 `PUBLIC_PATH` 修改即可。

 #### [#](#第二步-编译前端-2) 第二步，编译前端

 在前端项目的根目录下，执行 `npm run build` 命令，编译前端项目，构建出它的 `dist` 文件，里面是 HTML、CSS、JavaScript 等静态文件。如下图所示：

 ![编译前端](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/vben-%E7%BC%96%E8%AF%91.png)

 #### [#](#第三步-上传-dist-文件-2) 第三步，上传 `dist` 文件

 ① 选中本地的 `dist` 内的所有文件，进行压缩。（注意，不是压缩 `dist` 文件夹，而是选中它里面所有的内容！！！）

 ② 在宝塔首页，点击左侧的 [文件] 菜单， 在 `/www/wwwroot` 目录下，创建一个名字为 `yudao-ui-admin` 的目录。

 之后，上传 `dist.zip` 到该目录下，并进行解压。最终如下图所示：

 ![上传  文件](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/vben-dist.png)

 ### [#](#_3-3-yudao-ui-admin-vue2) 3.3 yudao-ui-admin-vue2

 基于 Vue2 + element-ui

 #### [#](#第一步-修改配置-4) 第一步，修改配置

 前端 dev 开发环境对应的是 [`.env.dev`  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue2/blob/master/.env.dev) 配置文件，主要是修改 `VUE_APP_BASE_API` 为你的后端项目的访问地址。如下图所示：

 ![ 配置文件](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/eu-env.png)

 #### [#](#第二步-编译前端-3) 第二步，编译前端

 在前端项目的根目录下，执行 `npm run build:dev` 命令，编译前端项目，构建出它的 `dist` 文件，里面是 HTML、CSS、JavaScript 等静态文件。如下图所示：

 ![编译前端](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/eu-%E7%BC%96%E8%AF%91.png)

 如下想要打包其它环境，可使用如下命令：

 
```
npm run build:prod ## 打包 prod 生产环境
npm run build:stage ## 打包 stage 预发布环境

```
其它高级参数说明【可暂时不看】：

 ① `PUBLIC_PATH`：可用于七牛等 CDN 服务，读取前端的静态文件，提升访问速度，建议 prod 生产环境使用。示例如下：

 可参考文章的 [《Vue 项目使用七牛云 CDN 存放静态资源》  (opens new window)](https://blog.csdn.net/weixin_71403100/article/details/132037721) 的「二、实现方式 」部分，只是最终的“修改 index.html 中静态资源引用”，变成 `PUBLIC_PATH` 修改即可。

 ② `VUE_APP_APP_NAME`：二级部署路径，默认为 `/` 根目录，一般不用修改。

 ③ `mode`：前端路由的模式，默认采用 `history` 路由，一般不用修改。可以通过修改 [`router/index.js`  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue2/blob/master/src/router/index.js#L173-L178) 来设置为 `hash` 路由，示例如下：

 ![ 参数](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/eu-mode.png)

 #### [#](#第三步-上传-dist-文件-3) 第三步，上传 `dist` 文件

 ① 选中本地的 `dist` 内的所有文件，进行压缩。（注意，不是压缩 `dist` 文件夹，而是选中它里面所有的内容！！！）

 ② 在宝塔首页，点击左侧的 [文件] 菜单， 在 `/www/wwwroot` 目录下，创建一个名字为 `yudao-ui-admin` 的目录。

 之后，上传 `dist.zip` 到该目录下，并进行解压。最终如下图所示：

 ![上传  文件](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/eu-dist.png)

 ## [#](#_4-部署-nginx-转发) 4. 部署 Nginx 转发

 两种 Nginx 的配置，分别满足服务器 IP、独立域名的不同场景。

 ### [#](#_4-1-服务器-ip-场景) 4.1 服务器 IP 场景

 #### [#](#第一步-配置前端转发) 第一步，配置前端转发

 在宝塔首页，点击左侧的 [网站] 菜单，之后选择 [HTML项目] 选项。

 之后，点击 [添加HTML项目] 按钮，填写备注为 `yudao-ui-admin`，并在“根目录”选择 `/www/wwwroot/yudao-ui-admin` 目录。如下图所示：

 ![添加 HTML 项目](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/nginx-ip-%E5%89%8D%E7%AB%AF.png)

 #### [#](#第二步-配置后端转发) 第二步，配置后端转发

 点击该项目的 [设置] 按钮，选中 [伪静态] 选项，进行后端的转发配置。如下图所示：

 疑问：为什么要在 HTML 项目下配置后端转发？

 因为前端和后端共享了同一个 IP 地址，导致它在宝塔进行 Nginx 配置转发时，`server_name` 冲突了！！！

 另外，下面有个 `try_files` 配置，是为了解决前端刷新 404 问题，参考自 [《Vue 项目使用宝塔面板部署刷新 404 问题》  (opens new window)](https://blog.csdn.net/ITMyFavorite/article/details/136175136) 文章。

 ![后端转发](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/nginx-ip-%E5%90%8E%E7%AB%AF.png)

 
```
# 请将伪静态规则或自定义NGINX配置填写到此处
location / { 
  try_files $uri $uri/ /index.html; ## 重要！！！解决前端刷新 404 问题
}

location /admin-api/ { ## 后端项目 - 管理后台
    proxy_pass http://localhost:48080/admin-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

location /app-api/ { ## 后端项目 - 用户 App
    proxy_pass http://localhost:48080/app-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

```
#### [#](#第三步-简单测试) 第三步，简单测试

 ① 请求 [http://192.168.225.2/admin-api/  (opens new window)](http://192.168.225.2/admin-api/) 地址，成功访问后端项目，返回结果如下：

 
```
{"code":401,"data":null,"msg":"账号未登录"}

```
② 请求 [http://192.168.225.2  (opens new window)](http://192.168.225.2) 地址，成功访问前端项目，返回前端界面如下：

 ![前端界面](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/14.png)

 ③ 如果你使用到 WebSocket 的话，需要额外对 `/infra/ws` 路径进行配置，具体可见 [https://t.zsxq.com/LQEfC  (opens new window)](https://t.zsxq.com/LQEfC) 链接。

 ### [#](#_4-2-独立域名场景) 4.2 独立域名场景

 友情提示：在前端项目的编译时，需要把 `VUE\_APP\_BASE\_API` 修改为后端项目对应的域名。

 例如说，这里使用的是 `http://api.iocoder.cn`

 #### [#](#第一步-配置前端转发-2) 第一步，配置前端转发

 ① 在宝塔首页，点击左侧的 [网站] 菜单，之后选择 [HTML项目] 选项。

 之后，点击 [添加HTML项目] 按钮，填写备注为 `yudao-ui-admin`，并在“根目录”选择 `/www/wwwroot/yudao-ui-admin` 目录。如下图所示：

 ![添加 HTML 项目](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/nginx-domain-%E5%89%8D%E7%AB%AF.png)

 ② 点击该项目的 [设置] 按钮，选中 [伪静态] 选项，进行 `try_files` 的转发配置。如下图所示：

 
```
# 请将伪静态规则或自定义NGINX配置填写到此处
location / { 
  try_files $uri $uri/ /index.html; ## 重要！！！解决前端刷新 404 问题
}

```
![前端转发](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/nginx-domain-%E5%89%8D%E7%AB%AF2.png)

 #### [#](#第二步-配置后端转发-2) 第二步，配置后端转发

 ① 点击 Java 项目的 [设置] 按钮，选中 [域名管理] 选项，在“域名”输入后端的域名，如 `api.iocoder.cn`。如下图所示：

 ![域名管理](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/nginx-domain-%E5%90%8E%E7%AB%AF.png)

 ② 选中 [外网访问] 选项，把“外网映射”选上。如下图所示：

 ![外网映射](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/nginx-domain-%E5%90%8E%E7%AB%AF2.png)

 ③ 选中 [配置文件] 选项，选择 [伪静态配置文件] 选项，进行后端的转发配置。如下图所示：

 ![后端转发](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/%E5%AE%9D%E5%A1%94%E9%83%A8%E7%BD%B2/nginx-domain-%E5%90%8E%E7%AB%AF3.png)

 
```
# 请将伪静态规则或自定义NGINX配置填写到此处
location /admin-api/ { ## 后端项目 - 管理后台
    proxy_pass http://127.0.0.1:48080/admin-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

location /app-api/ { ## 后端项目 - 用户 App
    proxy_pass http://127.0.0.1:48080/app-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

```
#### [#](#第三步-简单测试-2) 第三步，简单测试

 ① 请求 [http://api.iocoder.cn/admin-api/  (opens new window)](http://api.iocoder.cn/admin-api/) 地址，成功访问后端项目，返回结果如下：

 
```
{"code":401,"data":null,"msg":"账号未登录"}

```
② 请求 [http://admin.iocoder.cn  (opens new window)](http://admin.iocoder.cn) 地址，成功访问前端项目，返回前端界面如下：

 ![前端界面](https://doc.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/15.png)

 ## [#](#_666-更多说明) 666. 更多说明

 ① 积木报表菜单，无法访问。参考 [https://t.zsxq.com/vBkup  (opens new window)](https://t.zsxq.com/vBkup) 解决。

