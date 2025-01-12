---
title: Docker 部署
tags: ['project', 'java', 'spring-boot', 'spring-cloud']
categories: ['project']
order: 183
---
# Docker 部署

本小节，讲解如何将前端 + 后端项目，**使用 Docker 容器**，部署到 dev 开发环境下的一台 Linux 服务器上。如下图所示：

 ![Docker 部署](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Docker%E9%83%A8%E7%BD%B2/%E9%83%A8%E7%BD%B2cloud.png)

 注意：服务器的 IP 地址。

 * 外网 IP：139.9.196.247 或 8.154.33.209
* 内网 IP：192.168.0.213 或 172.26.126.182

 下属所有涉及到 IP 的配置，需要替换成你自己的。

 ## [#](#_1-环境准备) 1. 环境准备

 需要安装如下环境：

 * Docker：容器
* MySQL：数据库
* Redis：缓存
* Nginx：负载均衡
* Nacos：注册/配置中心

 ### [#](#_1-1-安装-docker) 1.1 安装 Docker

 执行如下命令，进行 Docker 的安装。参考自 [https://help.aliyun.com/zh/ecs/use-cases/install-and-use-docker-on-a-linux-ecs-instance  (opens new window)](https://help.aliyun.com/zh/ecs/use-cases/install-and-use-docker-on-a-linux-ecs-instance) 文档。

 
```
# ① 运行以下命令，安装 Docker 存储驱动的依赖包
dnf install -y device-mapper-persistent-data lvm2

# ② 添加稳定的 Docker 软件源
dnf config-manager --add-repo=https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# ③ 检查 Docker 软件源是否已添加
dnf list docker-ce

# ④ 安装 Docker
dnf install -y docker-ce --nobest

# ⑤ 查看 docker 版本信息：返回 Docker version 27.3.1, build ce12230
docker -v

# ⑥ 启动 Docker 守护进程，并设置开机自启动
systemctl start docker
systemctl enable docker

```
补充说明：由于访问 Docker 镜像不稳定，一般建议加速访问！！！

 问题反馈：

 * [https://t.zsxq.com/sfdMJ  (opens new window)](https://t.zsxq.com/sfdMJ)

 可参考加速方式：

 * [DaoCloud / public-image-mirror  (opens new window)](https://github.com/DaoCloud/public-image-mirror)
* [kubesre / docker-registry-mirrors  (opens new window)](https://github.com/kubesre/docker-registry-mirrors)
 ### [#](#_1-2-安装-mysql) 1.2 安装 MySQL

 #### [#](#第一步-安装-mysql-可选) 第一步，安装 MySQL（可选）

 友情提示：使用 Docker 安装 MySQL 是可选步骤，也可以直接安装 MySQL，或者购买 MySQL 云服务。

 ① 执行如下命令，使用 Docker 启动 MySQL 容器。

 
```
docker run -v /work/mysql/:/var/lib/mysql \
-p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 \
--restart=always --name mysql -d m.daocloud.io/docker.io/mysql

```
* 数据库文件，挂载到服务器的的 `/work/mysql/` 目录下
* 端口是 3306，密码是 123456

 ② 执行 `ls /work/mysql` 命令，查看 `/work/mysql/` 目录的数据库文件。

 ![数据库文件](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Docker%E9%83%A8%E7%BD%B2/03.png)

 #### [#](#第二步-导入-sql-脚本) 第二步，导入 SQL 脚本

 创建一个名字为 `ruoyi-vue-pro` 数据库，执行数据库对应的 [`sql`  (opens new window)](https://github.com/YunaiV/ruoyi-vue-pro/tree/master/sql) 目录下的 SQL 文件，进行初始化。

 ![使用 Navicat 导入 SQL 脚本](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Docker%E9%83%A8%E7%BD%B2/02.png)

 ### [#](#_1-3-安装-redis) 1.3 安装 Redis

 友情提示：使用 Docker 安装 Redis 是可选步骤，也可以直接安装 Redis，或者购买 Redis 云服务。

 执行如下命令，使用 Docker 启动 Redis 容器。

 
```
docker run -d --name redis --restart=always -p 6379:6379 m.daocloud.io/docker.io/redis

```
* 端口是 6379，密码未设置

 ### [#](#_1-4-安装-nginx) 1.4 安装 Nginx

 #### [#](#第一步-创建挂载目录) 第一步，创建挂载目录

 Nginx 挂载到服务器的目录：

 * `/work/nginx/conf.d` 用于存放配置文件
* `/work/nginx/html` 用于存放网页文件
* `/work/nginx/logs` 用于存放日志
* `/work/nginx/cert` 用于存放 HTTPS 证书
 创建 `/work/nginx` 目录，并在该目录下新建 `nginx.conf` 文件，避免稍后安装 Nginx 报错。内容如下：

 
```
user  nginx;
worker_processes  1;

events {
    worker_connections  1024;
}

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
#    access_log  /var/log/nginx/access.log  main;

    gzip on;
    gzip_min_length 1k;     # 设置允许压缩的页面最小字节数
    gzip_buffers 4 16k;     # 用来存储 gzip 的压缩结果
    gzip_http_version 1.1;  # 识别 HTTP 协议版本
    gzip_comp_level 2;      # 设置 gzip 的压缩比 1-9。1 压缩比最小但最快，而 9 相反
    gzip_types text/plain application/x-javascript text/css application/xml application/javascript; # 指定压缩类型
    gzip_proxied any;       # 无论后端服务器的 headers 头返回什么信息，都无条件启用压缩

    include /etc/nginx/conf.d/*.conf; ## 加载该目录下的其它 Nginx 配置文件
}

```
#### [#](#启动-nginx) 启动 Nginx

 ① 执行如下命令，使用 Docker 启动 Nginx 容器。

 
```
docker run -d \
--name nginx --restart always \
-p 80:80 -p 443:443 \
-e "TZ=Asia/Shanghai" \
-v /work/nginx/nginx.conf:/etc/nginx/nginx.conf \
-v /work/nginx/conf.d:/etc/nginx/conf.d \
-v /work/nginx/logs:/var/log/nginx \
-v /work/nginx/cert:/etc/nginx/cert \
-v /work/nginx/html:/usr/share/nginx/html \
m.daocloud.io/docker.io/nginx

```
② 执行 `docker ps` 命令，查看到 Nginx 容器的状态是 `UP` 的。

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
db.url.0=jdbc:mysql://172.26.126.182:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
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

 
```
docker run --name nacos-standalone \
-e MODE=standalone \
-v /work/nacos/conf/application.properties:/home/nacos/conf/application.properties \
-p 8848:8848 \
-p 9848:9848 \
-d \
docker.m.daocloud.io/nacos/nacos-server

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

 #### [#](#第四步-构建镜像-gateway-server) 第四步，构建镜像（gateway-server）

 ① 在 `/work/projects/gateway-server` 目录下，新建 Dockerfile 文件，用于制作 `gateway-server` 网关的 Docker 镜像。编写内容如下：

 
```
## AdoptOpenJDK 停止发布 OpenJDK 二进制，而 Eclipse Temurin 是它的延伸，提供更好的稳定性
## 感谢复旦核博士的建议！灰子哥，牛皮！
FROM m.daocloud.io/docker.io/eclipse-temurin:8-jre

## 创建目录，并使用它作为工作目录
RUN mkdir -p /gateway-server
WORKDIR /gateway-server
## 将后端项目的 Jar 文件，复制到镜像中
COPY gateway-server.jar app.jar

## 设置 TZ 时区
## 设置 JAVA_OPTS 环境变量，可通过 docker run -e "JAVA_OPTS=" 进行覆盖
ENV TZ=Asia/Shanghai JAVA_OPTS="-Xms512m -Xmx512m"

## 暴露后端项目的 48080 端口
EXPOSE 48080

## 启动后端项目
ENTRYPOINT java ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom -jar app.jar

```
② 执行如下命令，构建名字为 `gateway-server` 的 Docker 镜像。

 
```
cd /work/projects/gateway-server
docker build -t gateway-server .

```
③ 在 `/work/projects/gateway-server` 目录下，新建 Shell 脚本 `deploy.sh`，使用 Docker 启动后端项目。编写内容如下：

 
```
#!/bin/bash
set -e

## 第一步：删除可能启动的老 gateway-server 容器
echo "开始删除 gateway-server 容器"
docker stop gateway-server || true
docker rm gateway-server || true
echo "完成删除 gateway-server 容器"

## 第二步：启动新的 gateway-server 容器 \
echo "开始启动 gateway-server 容器"
docker run -d \
--name gateway-server \
-p 48080:48080 \
-e "SPRING_PROFILES_ACTIVE=dev" \
-v /work/projects/gateway-server:/root/logs/ \
gateway-server
echo "正在启动 gateway-server 容器中，需要等待 60 秒左右"

```
* 应用日志文件，挂载到服务器的的 `/work/projects/gateway-server` 目录下
* 通过 `SPRING_PROFILES_ACTIVE` 设置为 `dev` 开发环境

 #### [#](#第四步-构建镜像-system-server) 第四步，构建镜像（system-server）

 友情提示：整体和 gateway-server 是一致的，只是一些名字和端口不同。怕你写错了，所以提供了下~

 ① 在 `/work/projects/system-server` 目录下，新建 Dockerfile 文件，用于制作 `system-server` 网关的 Docker 镜像。编写内容如下：

 
```
## AdoptOpenJDK 停止发布 OpenJDK 二进制，而 Eclipse Temurin 是它的延伸，提供更好的稳定性
## 感谢复旦核博士的建议！灰子哥，牛皮！
FROM m.daocloud.io/docker.io/eclipse-temurin:8-jre

## 创建目录，并使用它作为工作目录
RUN mkdir -p /system-server
WORKDIR /system-server
## 将后端项目的 Jar 文件，复制到镜像中
COPY system-server.jar app.jar

## 设置 TZ 时区
## 设置 JAVA_OPTS 环境变量，可通过 docker run -e "JAVA_OPTS=" 进行覆盖
ENV TZ=Asia/Shanghai JAVA_OPTS="-Xms512m -Xmx512m"

## 暴露后端项目的 48081 端口
EXPOSE 48081

## 启动后端项目
ENTRYPOINT java ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom -jar app.jar

```
② 执行如下命令，构建名字为 `system-server` 的 Docker 镜像。

 
```
cd /work/projects/system-server
docker build -t system-server .

```
③ 在 `/work/projects/system-server` 目录下，新建 Shell 脚本 `deploy.sh`，使用 Docker 启动后端项目。编写内容如下：

 
```
#!/bin/bash
set -e

## 第一步：删除可能启动的老 system-server 容器
echo "开始删除 system-server 容器"
docker stop system-server || true
docker rm system-server || true
echo "完成删除 system-server 容器"

## 第二步：启动新的 system-server 容器 \
echo "开始启动 system-server 容器"
docker run -d \
--name system-server \
-p 48081:48081 \
-e "SPRING_PROFILES_ACTIVE=dev" \
-v /work/projects/system-server:/root/logs/ \
--network=host \
system-server
echo "正在启动 system-server 容器中，需要等待 60 秒左右"

```
* 应用日志文件，挂载到服务器的的 `/work/projects/system-server` 目录下
* 通过 `SPRING_PROFILES_ACTIVE` 设置为 `dev` 开发环境

 #### [#](#第四步-构建镜像-infra-server) 第四步，构建镜像（infra-server）

 友情提示：整体和 gateway-server 是一致的，只是一些名字和端口不同。怕你写错了，所以提供了下~

 ① 在 `/work/projects/infra-server` 目录下，新建 Dockerfile 文件，用于制作 `infra-server` 网关的 Docker 镜像。编写内容如下：

 
```
## AdoptOpenJDK 停止发布 OpenJDK 二进制，而 Eclipse Temurin 是它的延伸，提供更好的稳定性
## 感谢复旦核博士的建议！灰子哥，牛皮！
FROM m.daocloud.io/docker.io/eclipse-temurin:8-jre

## 创建目录，并使用它作为工作目录
RUN mkdir -p /infra-server
WORKDIR /infra-server
## 将后端项目的 Jar 文件，复制到镜像中
COPY infra-server.jar app.jar

## 设置 TZ 时区
## 设置 JAVA_OPTS 环境变量，可通过 docker run -e "JAVA_OPTS=" 进行覆盖
ENV TZ=Asia/Shanghai JAVA_OPTS="-Xms512m -Xmx512m"

## 暴露后端项目的 48082 端口
EXPOSE 48082

## 启动后端项目
ENTRYPOINT java ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom -jar app.jar

```
② 执行如下命令，构建名字为 `infra-server` 的 Docker 镜像。

 
```
cd /work/projects/infra-server
docker build -t infra-server .

```
③ 在 `/work/projects/infra-server` 目录下，新建 Shell 脚本 `deploy.sh`，使用 Docker 启动后端项目。编写内容如下：

 
```
#!/bin/bash
set -e

## 第一步：删除可能启动的老 infra-server 容器
echo "开始删除 infra-server 容器"
docker stop infra-server || true
docker rm infra-server || true
echo "完成删除 infra-server 容器"

## 第二步：启动新的 infra-server 容器 \
echo "开始启动 infra-server 容器"
docker run -d \
--name infra-server \
-p 48082:48082 \
-e "SPRING_PROFILES_ACTIVE=dev" \
-v /work/projects/infra-server:/root/logs/ \
--network=host \
infra-server
echo "正在启动 infra-server 容器中，需要等待 60 秒左右"

```
* 应用日志文件，挂载到服务器的的 `/work/projects/infra-server` 目录下
* 通过 `SPRING_PROFILES_ACTIVE` 设置为 `dev` 开发环境

 #### [#](#第五步-启动后端) 第五步，启动后端

 ① 在 `/work/projects/gateway-server` 目录下，执行 `sh deploy.sh` 命令，启动 `gateway-server` 网关。日志如下：

 
```
开始删除 yudao-server 容器
yudao-server
yudao-server
完成删除 yudao-server 容器
开始启动 yudao-server 容器
0dfd3dc409a53ae6b5e7c5662602cf5dcb52fd4d7f673bd74af7d21da8ead9d5
正在启动 yudao-server 容器中，需要等待 60 秒左右

```
之后，执行 `docker logs yudao-server` 命令，查看启动日志。看到如下内容，说明启动完成：

 友情提示：如果日志比较多，可以使用 grep 进行过滤。

 例如说：使用 `docker logs yudao-server | grep 48080`

 
```
2022-04-15 00:34:19.647  INFO 8 --- [main] [TID: N/A] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 48080 (http)

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

 ① 在 `/work/nginx/conf.d` 目录下，创建 `yudao-cloud.conf`，内容如下：

 
```
server {
    listen       80;
    server_name  139.9.196.247; ## 重要！！！修改成你的外网 IP/域名

    location / { ## 前端项目
        root   /usr/share/nginx/html/yudao-admin-ui;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /admin-api/ { ## 后端项目 - 管理后台
        proxy_pass http://192.168.0.213:48080/admin-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /app-api/ { ## 后端项目 - 用户 App
        proxy_pass http://192.168.0.213:48080/app-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

}

```
友情提示：

 `[root]` 指令在本地文件时，要使用 Nginx Docker 容器内的路径，即 `/usr/share/nginx/html/yudao-admin-ui`，否则会报 404 的错误。

 ② 执行 `docker exec nginx nginx -s reload` 命令，重新加载 Nginx 配置。

 友情提示：如果你担心 Nginx 配置不正确，可以执行 docker exec nginx nginx -t 命令。

 ③ 执行 `curl http://192.168.0.213/admin-api/` 命令，成功访问后端项目的内网地址，返回结果如下：

 
```
{"code":401,"data":null,"msg":"账号未登录"}

```
执行 `curl http://139.9.196.247:48080/admin-api/` 命令，成功访问后端项目的外网地址，返回结果一致。

 ④ 请求 [http://139.9.196.247:48080  (opens new window)](http://139.9.196.247:48080) 地址，成功访问前端项目的外网地址，，返回前端界面如下：

 ![前端界面](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Docker%E9%83%A8%E7%BD%B2/06.png)

 ⑤ 如果你使用到 WebSocket 的话，需要额外对 `/infra/ws` 路径进行配置，具体可见 [https://t.zsxq.com/LQEfC  (opens new window)](https://t.zsxq.com/LQEfC) 链接。

 ### [#](#_4-2-方式二-独立域名访问) 4.2 方式二：独立域名访问

 友情提示：在前端项目的编译时，需要把 `VUE\_APP\_BASE\_API` 修改为后端项目对应的域名。

 例如说，这里使用的是 `http://api.iocoder.cn`

 ① 在 `/work/nginx/conf.d` 目录下，创建 `yudao-cloud2.conf`，内容如下：

 
```
server { ## 前端项目
    listen       80;
    server_name  admin.iocoder.cn; ## 重要！！！修改成你的前端域名

    location / { ## 前端项目
        root   /usr/share/nginx/html/yudao-admin-ui;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

}

server { ## 后端项目
    listen       80;
    server_name  api.iocoder.cn; ## 重要！！！修改成你的外网 IP/域名

    ## 不要使用 location / 转发到后端项目，因为 druid、admin 等监控，不需要外网可访问。或者增加 Nginx IP 白名单限制也可以。

    location /admin-api/ { ## 后端项目 - 管理后台
        proxy_pass http://192.168.0.213:48080/admin-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /app-api/ { ## 后端项目 - 用户 App
        proxy_pass http://192.168.0.213:48080/app-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

}

```
② 执行 `docker exec nginx nginx -s reload` 命令，重新加载 Nginx 配置。

 ③ 请求 [http://api.iocoder.cn/admin-api/  (opens new window)](http://api.iocoder.cn/admin-api/) 地址，成功访问后端项目，返回结果如下：

 
```
{"code":401,"data":null,"msg":"账号未登录"}

```
④ 请求 [http://admin.iocoder.cn  (opens new window)](http://admin.iocoder.cn) 地址，成功访问前端项目，返回前端界面如下：

 ![前端界面](https://cloud.iocoder.cn/img/%E8%BF%90%E7%BB%B4%E6%89%8B%E5%86%8C/Linux%E9%83%A8%E7%BD%B2/15.png)

 ## [#](#_666-更多说明) 666. 更多说明

 ① 积木报表菜单，无法访问。参考 [https://t.zsxq.com/vBkup  (opens new window)](https://t.zsxq.com/vBkup) 解决。

