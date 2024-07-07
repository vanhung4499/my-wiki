---
title: 达梦数据库专属
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 17
---
# 达梦数据库专属

## [#](#_1-dm-数据库的安装) 1. DM 数据库的安装

 可以使用 Windows 或 Docker 等多种方式。

 注意，目前我们使用的是 DM 8.0 的版本。

 ### [#](#_1-1-windows-方式) 1.1 Windows 方式

 参考 [官方文档](https://eco.dameng.com/document/dm/zh-cn/start/install-dm-windows-prepare.html)

 ① 下载 Windows 版本(20230928)：[https://download.dameng.com/eco/adapter/DM8/202310/dm8\_20230928\_x86\_win\_64.zip](https://download.dameng.com/eco/adapter/DM8/202310/dm8_20230928_x86_win_64.zip)

 ② 傻瓜式安装、数据库实例化，一路下去就好，不用修改任何参数。

 ### [#](#_1-2-docker-方式) 1.2 Docker 方式

 参考 [官方文档](https://eco.dameng.com/document/dm/zh-cn/start/dm-install-docker.html)

 ① 下载 Docker 镜像 (版本: 20230808)：[https://download.dameng.com/eco/dm8/dm8\_20230808\_rev197096\_x86\_rh6\_64\_single.tar](https://download.dameng.com/eco/dm8/dm8_20230808_rev197096_x86_rh6_64_single.tar)

 ② 执行如下脚本，启动 Docker 服务：


```
docker load -i dm8_20230808_rev197096_x86_rh6_64_single.tar

docker run -d -p 5236:5236 \
    --restart=unless-stopped \
    --name dm8_test \
    --privileged=true \
    -e PAGE_SIZE=16 \
    -e LD_LIBRARY_PATH=/opt/dmdbms/binn \
    -e EXTENT_SIZE=32 \
    -e BLANK_PAD_MODE=1 \
    -e LOG_SIZE=1024 \
    -e UNICODE_FLAG=1 \
    -e LENGTH_IN_CHAR=1 \
    -e INSTANCE_NAME=dm8_test \
    -v $PWD/dm8_test:/opt/dmdbms/data \
    dm8_single:dm8_20230808_rev197096_x86_rh6_64

```
备注：可以尝试使用大小写不敏感配置 `-e CASE_SENSITIVE=N`。需要停止并删除容器后，删除 `dm8_test` 目录，重新`docker run`。

 ## [#](#_2-数据库导入) 2. 数据库导入

 使用 [DM 管理工具](https://eco.dameng.com/document/dm/zh-cn/start/tool-dm-manager.html) 进行数据的导入。如果你不是很了解，已可以看看文档：

 * [《达梦数据库（二）DM Manager 管理工具》](https://www.modb.pro/db/432934)
* [《达梦数据库导入 SQL》](https://blog.51cto.com/u_16213594/7289559)

 具体步骤如下：

 ① 使用 DM 管理工具，新建一个名字为 `RUOYI_VUE_PRO` 的 schema 模式。如下图所示：

 ![新建模式](https://doc.iocoder.cn/img/%E8%BE%BE%E6%A2%A6%E6%95%B0%E6%8D%AE%E5%BA%93/%E6%96%B0%E5%BB%BA%E6%A8%A1%E5%BC%8F.png)

 为什么名字是 RUOYI\_VUE\_PRO 呢？

 因为稍后使用的 `sql/dm/ruoyi-vue-pro-dm8.sql` 文件，使用的 schema 是它噢。后续跑通了，你可以按照自己的修改。

 ② 点击 DM 管理工具的 [执行 -> 执行脚本] 菜单，选中项目中的 `sql/dm/ruoyi-vue-pro-dm8.sql` 文件，之后点击 [绿色箭头] 进行执行即可。

 ## [#](#_3-项目启动) 3. 项目启动

 ① 修改 `yudao-spring-boot-starter-mybatis` 模块的 `pom.xml` 文件，将 DM 依赖的 `DmJdbcDriver18` 的 `optional` 移除。如下图所示：

 ![数据库依赖](https://doc.iocoder.cn/img/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8/%E6%95%B0%E6%8D%AE%E5%BA%93%E4%BE%9D%E8%B5%96.png)

 注意，需要使用 IDEA 刷新下 Maven 的依赖。

 ② 修改 `application-local.yaml` 配置文件，将数据库的 `url`、`username`、`password` 修改为 DM 数据库。例如说：

 ![数据库连接配置](https://doc.iocoder.cn/img/%E8%BE%BE%E6%A2%A6%E6%95%B0%E6%8D%AE%E5%BA%93/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%BF%9E%E6%8E%A5%E9%85%8D%E7%BD%AE.png)

 ③ 后续启动项目，就可以了。

 ### [#](#_4-补充说明) 4. 补充说明

 ① [《详解 DM 数据库字符串大小写敏感》](https://eco.dameng.com/community/article/df11811a02de8e923c2e57ef6597bc62)

 ② 工作流的适配，可参考 [《Flowable6.8(6.x 版本通用)整合集成达梦 8 数据库(DM8)详解，解决自动生成表时 dmn 相关表语法报错问题》](https://blog.csdn.net/TangBoBoa/article/details/130392495)。

 短期内暂时没时间适配，欢迎你搞了之后，pull request 贡献给项目，从而帮助到更多人！
