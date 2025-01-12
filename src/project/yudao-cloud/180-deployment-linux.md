---
title: Linux 部署
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 182
---
# Linux 部署

本小节，讲解如何将前端 + 后端项目，**使用 Shell 脚本**，部署到 dev 开发环境下的一台 Linux 服务器上。如下图所示：

 ![Linux 部署](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/%E9%83%A8%E7%BD%B2cloud.png)

 ## [#](#_1-环境准备) 1. 环境准备

 需要安装如下环境：

 * MySQL：数据库
* Redis：缓存
* JDK：后端运行环境
* Nginx：负载均衡
* Nacos：注册/配置中心

 ### [#](#_1-1-安装-mysql) 1.1 安装 MySQL

 需要安装 MySQL，并导入 SQL 脚本。

 #### [#](#第一步-安装-mysql-可选) 第一步，安装 MySQL（可选）

 友情提示：安装 MySQL 是可选步骤，也可以购买 MySQL 云服务。

 ① 执行如下命令，进行 MySQL 的安装。

 
```
## ① 在 CentOS 9 下，安装 MySQL 8.4 版本的软件源 https://dev.mysql.com/downloads/repo/yum/
rpm -Uvh https://repo.mysql.com//mysql84-community-release-el9-1.noarch.rpm

## ② 安装 MySQL Server 8.4 版本
yum install mysql-server --nogpgcheck

## ③ 查看 MySQL 的安装版本。结果是 /usr/sbin/mysqld  Ver 8.4.2 for Linux on x86_64 (MySQL Community Server - GPL)
mysqld --version

```
② 修改 `/etc/my.cnf` 文件，在文末加上 `lower_case_table_names=1` 配置，执行 `systemctl restart mysqld` 命令重启。

 踩坑提示：

 为什么 MySQL 启动后，后续无法修改 `lower_case_table_names=1` 呢？

 原因和解决，参考 [https://www.cnblogs.com/niceyoo/p/11545196.html  (opens new window)](https://www.cnblogs.com/niceyoo/p/11545196.html) 博客！

 ③ 执行 `grep password /var/log/mysqld.log` 命令，获得 MySQL 临时密码。

 
```
2024-09-26T01:51:44.277843Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: iLXXg3.tje;8

```
④ 执行如下命令，修改 MySQL 的密码，设置允许远程连接。

 
```
## ① 连接 MySQL Server 服务，并输入临时密码
mysql -uroot -p

## ② 修改密码，3WLiVUBEwTbvAfsh. 可改成你想要的密码
alter user 'root'@'localhost' identified by '3WLiVUBEwTbvAfsh.';

## ③ 设置允许远程连接
use mysql;
update user set host = '%' where user = 'root';
FLUSH PRIVILEGES;

```
#### [#](#第二步-导入-sql-脚本) 第二步，导入 SQL 脚本

 创建一个名字为 `ruoyi-vue-pro` 数据库，执行数据库对应的 [`sql`  (opens new window)](https://github.com/YunaiV/ruoyi-vue-pro/tree/master/sql) 目录下的 SQL 文件，进行初始化。

 ![使用 Navicat 导入 SQL 脚本](https://cloud.iocoder.cn/img/Docker%E9%83%A8%E7%BD%B2/02.png)

 ### [#](#_1-2-安装-redis) 1.2 安装 Redis

 友情提示：安装 Redis 是可选步骤，也可以购买 Redis 云服务。

 执行如下命令，进行 Redis 的安装。

 
```
## ① 安装 Redis
yum install redis 

## ② 查看 Redis 的安装版本。结果是 Redis server v=6.2.7 sha=00000000:0 malloc=jemalloc-5.1.0 bits=64 build=ec192bdd77ecd321
redis-server --version

## ④ 启动 Redis 服务
systemctl restart redis

```
* 端口是 6379，密码未设置

 ### [#](#_1-3-安装-jdk) 1.3 安装 JDK

 执行 `yum install -y java-1.8.0-openjdk` 命令，安装 OpenJDK **8**。

 友情提示：如果已经安装 JDK，可不安装。建议使用的 JDK 版本为 8、11、17 这三个。

 ### [#](#_1-4-安装-nginx) 1.4 安装 Nginx

 参考 [Nginx 官方文档  (opens new window)](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)，安装 Nginx 服务。命令如下：

 
```
## 添加 yum 源
yum install epel-release
yum update
## 安装 nginx
yum install nginx
## 启动 nginx 
nginx

```
Nginx 默认配置文件是 `/etc/nginx/nginx.conf`。

 ### [#](#_1-5-安装-nacos) 1.5 安装 Nacos

 参考文档：

 * [《Nacos 官方文档 —— 单机部署模式》  (opens new window)](https://nacos.io/docs/latest/manual/admin/deployment/deployment-standalone/)
* [《Nacos 官方文档 —— 权限认证》  (opens new window)](https://nacos.io/zh-cn/docs/v2/guide/user/auth.html)
* [《用户博客 —— Nacos开启鉴权配置》  (opens new window)](https://www.cnblogs.com/shigzh/p/17954917)
 #### [#](#第一步-下载编译后压缩包) 第一步，下载编译后压缩包

 ① 新建 `/work` 目录，再从 [最新稳定版本  (opens new window)](https://github.com/alibaba/nacos/releases) 下载 `nacos-server-$version.zip` 包。

 ② 执行 `unzip nacos-server-$version.zip` 解压缩，它最终在 `/work/nacos/` 目录如下

 ![Nacos 目录](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/Nacos%E7%9B%AE%E5%BD%95.png)

 #### [#](#第二步-修改配置) 第二步，修改配置

 修改 `conf/application.properties` 配置文件，主要是修改数据库、认证相关的配置。如下所示：

 
```
### 数据库配置（直接添加）
spring.datasource.platform=mysql
db.num=1
db.url.0=jdbc:mysql://8.149.143.162:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user=root
db.password=3WLiVUBEwTbvAfsh.

### 认证配置（需要检索到对应的配置项，进行修改）
nacos.core.auth.enabled=true
# 自定义用于生成 JWT 令牌的密钥，注意：原始密钥长度不得低于 32 字符，且一定要进行 Base64 编码，否则无法启动节点
nacos.core.auth.plugin.nacos.token.secret.key=RTF0SE41WFRDbEQybXN0SXBibmhQQjZ5bWpUWG9Bc1Y=
# 配置自定义身份识别的 key 和 value，这两个属性是 auth 的白名单，用于标识来自其它服务器的请求。具体实现见 com.alibaba.nacos.core.auth.AuthFilter
nacos.core.auth.server.identity.key=admin
nacos.core.auth.server.identity.value=admin

```
① `db.url.0`、`db.user`、`db.password` 修改为你的 MySQL 数据库地址、用户名、密码。

 同时，需要使用 Navicat 把 `conf/mysql-schema.sql` 导入到 MySQL 数据库中。

 ② `nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.key` 可以使用随机的字符串。

 `nacos.core.auth.plugin.nacos.token.secret.key` 可以随机一个 32 位的字符串，然后使用 [Base64  (opens new window)](https://tool.oschina.net/encrypt?type=3) 编码。

 #### [#](#第三步-启动-nacos) 第三步，启动 Nacos

 ① 重要！需要设置下 `JAVA_HOME`，否则会出现类似 [《When using open jdk to log in to nacos it failed》  (opens new window)](https://github.com/alibaba/nacos/issues/711)！！！例如说：

 
```
## 补充提示：OpenJDK 安装在 /usr/lib/jvm/ 目录下
export JAVA_HOME=/usr/lib/jvm/jre-1.8.0

```
② 执行 `sh bin/startup.sh -m standalone` 命令，启动 Nacos 服务。可以通过 `logs/start.out` 查看启动成功日志。

 
```
2024-09-26 23:07:25,444 INFO Tomcat started on port(s): 8848 (http) with context path '/nacos'

```
#### [#](#第四步-新建-dev-空间) 第四步，新建 dev 空间

 ① 访问 Nacos 控制台，地址是 `http://${服务器 IP}:8848/nacos`。默认账号密码都是 nacos，即可登录。

 ② 在 [命名空间] 菜单下，新建一个名字为 `dev` 的命名空间。如下图所示：

 ![新建 dev 空间](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/Nacos%E6%96%B0%E5%BB%BA%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4.png)

 ## [#](#_2-部署后端服务) 2. 部署后端服务

 本小节，我们来部署后端相关的服务，最小化的部署包括：

 * `gateway-server` 网关
* `system-server` 服务
* `infra-server` 服务

 其它的 `xxx-server` 服务的部署，和 `system-server`、`infra-server` 服务的部署类似，这里不再赘述。

 #### [#](#第一步-修改配置) 第一步，修改配置

 ① `gateway-server` 网关，dev 开发环境对应的是 [`application-dev.yaml`  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/resources/application-dev.yaml#L3-L14) 配置文件，主要是修改 Nacos 为你的地址。如下图所示：

 ![ 配置文件](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6gateway.png)

 ② `system-server` 服务，dev 开发环境对应的是 [`application-dev.yaml`  (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-biz/src/main/resources/application-dev.yaml#L57-L73) 配置文件，主要是修改 Nacos、MySQL、Redis 为你的地址。如下图所示：

 ![ 配置文件](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6system.png)

 ③ `infra-server` 服务，操作同 `system-server` 服务，不重复赘述。

 #### [#](#第二步-编译后端) 第二步，编译后端

 在项目的根目录下，执行 `mvn clean package -Dmaven.test.skip=true` 命令，编译后端项目，构建出它的 Jar 包。如下图所示：

 ![编译后端](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/%E7%BC%96%E8%AF%91%E5%90%8E%E7%AB%AF%E9%A1%B9%E7%9B%AEcloud.png)

 疑问：-Dmaven.test.skip=true 是什么意思？

 跳过单元测试的执行。如果你项目的单元测试写的不错，建议使用 `mvn clean package` 命令，执行单元测试，保证交付的质量。

 #### [#](#第三步-上传-jar-包) 第三步，上传 Jar 包

 ![上传 Jar 包](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/%E4%B8%8A%E4%BC%A0jar%E5%8C%85cloud.png)

 ① 在 Linux 服务器上创建 `/work/projects/gateway-server` 目录，使用 `scp` 命令或者 FTP 工具，将 `yudao-gateway.jar` 上传到该目录下，并重名为 `gateway-server.jar`。

 ② 在 Linux 服务器上创建 `/work/projects/system-server` 目录，使用 `scp` 命令或者 FTP 工具，将 `yudao-module-system-biz.jar` 上传到该目录下，并重名为 `system-server.jar`。

 ③ 在 Linux 服务器上创建 `/work/projects/infra-server` 目录，使用 `scp` 命令或者 FTP 工具，将 `yudao-module-infra-biz.jar` 上传到该目录下，并重名为 `infra-server.jar`。

 #### [#](#第四步-编写脚本) 第四步，编写脚本

 ① 在 `/work/projects/gateway-server` 目录下，新建 Shell 脚本 `deploy.sh`，用于启动 `gateway-server` 网关。编写内容如下：

 
```
#!/bin/bash
set -e

DATE=$(date +%Y%m%d%H%M)
# 基础路径
BASE_PATH=/work/projects/gateway-server
# 服务名称。同时约定部署服务的 jar 包名字也为它。
SERVER_NAME=gateway-server
# 环境
PROFILES_ACTIVE=dev

# heapError 存放路径
HEAP_ERROR_PATH=$BASE_PATH/heapError
# JVM 参数
JAVA_OPS="-Xms512m -Xmx512m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=$HEAP_ERROR_PATH"

# SkyWalking Agent 配置
#export SW_AGENT_NAME=$SERVER_NAME
#export SW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.0.84:11800
#export SW_GRPC_LOG_SERVER_HOST=192.168.0.84
#export SW_AGENT_TRACE_IGNORE_PATH="Redisson/PING,/actuator/**,/admin/**"
#export JAVA_AGENT=-javaagent:/work/skywalking/apache-skywalking-apm-bin/agent/skywalking-agent.jar

# 停止：优雅关闭之前已经启动的服务
function stop() {
    echo "[stop] 开始停止 $BASE_PATH/$SERVER_NAME"
    PID=$(ps -ef | grep $BASE_PATH/$SERVER_NAME | grep -v "grep" | awk '{print $2}')
    # 如果 Java 服务启动中，则进行关闭
    if [ -n "$PID" ]; then
        # 正常关闭
        echo "[stop] $BASE_PATH/$SERVER_NAME 运行中，开始 kill [$PID]"
        kill -15 $PID
        # 等待最大 120 秒，直到关闭完成。
        for ((i = 0; i < 120; i++))
            do
                sleep 1
                PID=$(ps -ef | grep $BASE_PATH/$SERVER_NAME | grep -v "grep" | awk '{print $2}')
                if [ -n "$PID" ]; then
                    echo -e ".\c"
                else
                    echo '[stop] 停止 $BASE_PATH/$SERVER_NAME 成功'
                    break
                fi
		    done

        # 如果正常关闭失败，那么进行强制 kill -9 进行关闭
        if [ -n "$PID" ]; then
            echo "[stop] $BASE_PATH/$SERVER_NAME 失败，强制 kill -9 $PID"
            kill -9 $PID
        fi
    # 如果 Java 服务未启动，则无需关闭
    else
        echo "[stop] $BASE_PATH/$SERVER_NAME 未启动，无需停止"
    fi
}

# 启动：启动后端项目
function start() {
    # 开启启动前，打印启动参数
    echo "[start] 开始启动 $BASE_PATH/$SERVER_NAME"
    echo "[start] JAVA_OPS: $JAVA_OPS"
    echo "[start] JAVA_AGENT: $JAVA_AGENT"
    echo "[start] PROFILES: $PROFILES_ACTIVE"

    # 开始启动
    nohup java -server $JAVA_OPS $JAVA_AGENT -jar $BASE_PATH/$SERVER_NAME.jar --spring.profiles.active=$PROFILES_ACTIVE > nohup.out 2>&1 &
    echo "[start] 启动 $BASE_PATH/$SERVER_NAME 完成"
}

# 部署
function deploy() {
    cd $BASE_PATH
    # 第一步：停止 Java 服务
    stop
    # 第二步：启动 Java 服务
    start
}

deploy

```
友情提示：

 脚本的详细讲解，可见 [《芋道 Jenkins 极简入门 》  (opens new window)](https://www.iocoder.cn/Jenkins/install/?yudao) 的「2.3 远程服务器配置 」小节。

 如果你想要修改脚本，主要关注 `BASE_PATH`、`PROFILES_ACTIVE`、`JAVA_OPS` 三个参数。如下图所示：

 ![可修改参数](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/05.png)

 ② 在 `/work/projects/system-server` 目录下，新建 Shell 脚本 `deploy.sh`，用于启动 `system-server` 服务。

 只是把 `BASE_PATH` 和 `SERVER_NAME` 修改为 `system-server` 即可。

 ③ 在 `/work/projects/infra-server` 目录下，新建 Shell 脚本 `deploy.sh`，用于启动 `infra-server` 服务。

 只是把 `BASE_PATH` 和 `SERVER_NAME` 修改为 `infra-server` 即可。

 #### [#](#第五步-启动后端) 第五步，启动后端

 ① 在 `/work/projects/gateway-server` 目录下，执行 `sh deploy.sh` 命令，启动 `gateway-server` 网关。日志如下：

 
```
[stop] 开始停止 /work/projects/gateway-server/gateway-server
[stop] /work/projects/gateway-server/gateway-server 未启动，无需停止
[start] 开始启动 /work/projects/gateway-server/gateway-server
[start] JAVA_OPS: -Xms512m -Xmx512m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/work/projects/gateway-server/heapError
[start] JAVA_AGENT:
[start] PROFILES: dev
[start] 启动 /work/projects/gateway-server/gateway-server 完成

```
之后，执行 `tail -f nohup.out` 命令，查看启动日志。看到如下内容，说明启动完成：

 
```
2022-04-13 00:06:20.049  INFO 1395 --- [main] [TID: N/A] c.i.yudao.server.YudaoServerApplication  : Started YudaoServerApplication in 35.315 seconds (JVM running for 36.282)

```
然后，打开 Nacos 控制台，查看服务是否注册成功。如下图所示：

 ![Nacos 服务注册](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/%E5%90%8E%E7%AB%AF%E5%90%AF%E5%8A%A8cloud-gateway.png)

 ② 在 `/work/projects/system-server` 目录下，执行 `sh deploy.sh` 命令，启动 `system-server` 服务。后续情况同 `gateway-server` 网关。

 ③ 在 `/work/projects/infra-server` 目录下，执行 `sh deploy.sh` 命令，启动 `infra-server` 服务。后续情况同 `gateway-server` 网关。

 ## [#](#_3-部署前端) 3. 部署前端

 项目的管理后台有 3 个版本（只需要看你的版本即可）：

 * `yudao-ui-admin-vue3`：基于 Vue3 + element-plus
* `yudao-ui-admin-vben`：基于 Vue3 + vben(ant-design-vue)
* `yudao-ui-admin-vue2`：基于 Vue2 + element-ui

 注意，前端无法直接启动，而是需要通过 Nginx 转发读取前端构建出来的静态文件，最终都放在服务器上的 `/work/projects/yudao-ui-admin` 目录下。

 ### [#](#_3-1-yudao-ui-admin-vue3) 3.1 yudao-ui-admin-vue3

 基于 Vue3 + element-plus

 #### [#](#第一步-修改配置-2) 第一步，修改配置

 前端 dev 开发环境对应的是 [`.env.dev`  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue3/blob/master/.env.dev#L6-L7) 配置文件，主要是修改 `VITE_BASE_URL` 为你的后端项目的访问地址。如下图所示：

 ![ 配置文件](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/ep-env.png)

 #### [#](#第二步-编译前端) 第二步，编译前端

 在前端项目的根目录下，执行 `npm run build:dev` 命令，编译前端项目，构建出它的 `dist` 文件，里面是 HTML、CSS、JavaScript 等静态文件。如下图所示：

 ![编译前端](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/ep-%E7%BC%96%E8%AF%91.png)

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

 在 Linux 服务器上创建 `/work/projects/yudao-ui-admin` 目录，使用 `scp` 命令或者 FTP 工具，将 `dist` 上传到该目录下。如下图所示：

 ![上传  文件](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/ep-dist.png)

 ### [#](#_3-2-yudao-ui-admin-vben) 3.2 yudao-ui-admin-vben

 基于 Vue3 + vben(ant-design-vue)

 #### [#](#第一步-修改配置-3) 第一步，修改配置

 前端 production 开发环境对应的是 [`.env.production`  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vben/blob/master/.env.production#L15-L21) 配置文件，主要是修改 `VITE_GLOB_BASE_URL`、`VITE_GLOB_API_URL` 为你的后端项目的访问地址。如下图所示：

 ![ 配置文件](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/vben-env.png)

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

 ![编译前端](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/vben-%E7%BC%96%E8%AF%91.png)

 #### [#](#第三步-上传-dist-文件-2) 第三步，上传 `dist` 文件

 在 Linux 服务器上创建 `/work/projects/yudao-ui-admin` 目录，使用 `scp` 命令或者 FTP 工具，将 `dist` 上传到该目录下。如下图所示：

 ![上传  文件](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/vben-dist.png)

 ### [#](#_4-3-yudao-ui-admin-vue2) 4.3 yudao-ui-admin-vue2

 基于 Vue2 + element-ui

 #### [#](#第一步-修改配置-4) 第一步，修改配置

 前端 dev 开发环境对应的是 [`.env.dev`  (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue2/blob/master/.env.dev) 配置文件，主要是修改 `VUE_APP_BASE_API` 为你的后端项目的访问地址。如下图所示：

 ![ 配置文件](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/eu-env.png)

 #### [#](#第二步-编译前端-3) 第二步，编译前端

 在前端项目的根目录下，执行 `npm run build:dev` 命令，编译前端项目，构建出它的 `dist` 文件，里面是 HTML、CSS、JavaScript 等静态文件。如下图所示：

 ![编译前端](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/eu-%E7%BC%96%E8%AF%91.png)

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

 ![ 参数](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/eu-mode.png)

 #### [#](#第三步-上传-dist-文件-3) 第三步，上传 `dist` 文件

 在 Linux 服务器上创建 `/work/projects/yudao-ui-admin` 目录，使用 `scp` 命令或者 FTP 工具，将 `dist` 上传到该目录下。如下图所示：

 ![上传  文件](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/eu-dist.png)

 ## [#](#_4-配置-nginx-转发) 4. 配置 Nginx 转发

 两种 Nginx 的配置，分别满足服务器 IP、独立域名的不同场景。

 ### [#](#_4-1-方式一-服务器-ip-访问) 4.1 方式一：服务器 IP 访问

 ① 修改 Nginx 配置，内容如下：

 
```
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    gzip on;
    gzip_min_length 1k;     # 设置允许压缩的页面最小字节数
    gzip_buffers 4 16k;     # 用来存储 gzip 的压缩结果
    gzip_http_version 1.1;  # 识别 HTTP 协议版本
    gzip_comp_level 2;      # 设置 gzip 的压缩比 1-9。1 压缩比最小但最快，而 9 相反
    gzip_types gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; # 指定压缩类型
    gzip_proxied any;       # 无论后端服务器的 headers 头返回什么信息，都无条件启用压缩

    server {
        listen       80;
        server_name  192.168.225.2; ## 重要！！！修改成你的外网 IP/域名

        location / { ## 前端项目
            root   /work/projects/yudao-ui-admin;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
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

    }

}

```
② 执行 `nginx -s reload` 命令，重新加载 Nginx 配置。

 ③ 请求 [http://192.168.225.2/admin-api/  (opens new window)](http://192.168.225.2/admin-api/) 地址，成功访问后端项目，返回结果如下：

 
```
{"code":401,"data":null,"msg":"账号未登录"}

```
④ 请求 [http://192.168.225.2  (opens new window)](http://192.168.225.2) 地址，成功访问前端项目，返回前端界面如下：

 ![前端界面](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/14.png)

 ⑤ 如果你使用到 WebSocket 的话，需要额外对 `/infra/ws` 路径进行配置，具体可见 [https://t.zsxq.com/LQEfC  (opens new window)](https://t.zsxq.com/LQEfC) 链接。

 ### [#](#_4-2-方式二-独立域名访问) 4.2 方式二：独立域名访问

 友情提示：在前端项目的编译时，需要把 `VUE\_APP\_BASE\_API` 修改为后端项目对应的域名。

 例如说，这里使用的是 `http://api.iocoder.cn`

 ① 修改 Nginx 配置，内容如下：

 
```
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    gzip on;
    gzip_min_length 1k;     # 设置允许压缩的页面最小字节数
    gzip_buffers 4 16k;     # 用来存储 gzip 的压缩结果
    gzip_http_version 1.1;  # 识别 HTTP 协议版本
    gzip_comp_level 2;      # 设置 gzip 的压缩比 1-9。1 压缩比最小但最快，而 9 相反
    gzip_types text/plain application/x-javascript text/css application/xml application/javascript; # 指定压缩类型
    gzip_proxied any;       # 无论后端服务器的 headers 头返回什么信息，都无条件启用压缩

    server { ## 前端项目
        listen       80;
        server_name  admin.iocoder.cn; ## 重要！！！修改成你的前端域名

        location / { ## 前端项目
            root   /work/projects/yudao-ui-admin;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

    }

    server { ## 后端项目
        listen       80;
        server_name  api.iocoder.cn; ## 重要！！！修改成你的外网 IP/域名

        ## 不要使用 location / 转发到后端项目，因为 druid、admin 等监控，不需要外网可访问。或者增加 Nginx IP 白名单限制也可以。

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

    }
}

```
② 执行 `nginx -s reload` 命令，重新加载 Nginx 配置。

 ③ 请求 [http://api.iocoder.cn/admin-api/  (opens new window)](http://api.iocoder.cn/admin-api/) 地址，成功访问后端项目，返回结果如下：

 
```
{"code":401,"data":null,"msg":"账号未登录"}

```
④ 请求 [http://admin.iocoder.cn  (opens new window)](http://admin.iocoder.cn) 地址，成功访问前端项目，返回前端界面如下：

 ![前端界面](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/15.png)

 ## [#](#_666-更多说明) 666. 更多说明

 ① 积木报表菜单，无法访问。参考 [https://t.zsxq.com/vBkup  (opens new window)](https://t.zsxq.com/vBkup) 解决。
