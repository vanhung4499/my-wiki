---
title: Spring Boot
icon: devicon:spring
tags: ['spring-boot']
categories: ['spring-boot']
---
# Spring Boot Framework Guide

::: info
Series hướng dẫn Spring Boot!
Cung cấp các kiến thức cốt lõi để bạn có thể nhanh chóng sử dụng trong thực tế!
:::

::: info
Series hướng dẫn này được dịch và chỉnh sửa lại sang tiếng việt, phục vụ cho việc học tập của tôi và bạn bè!
Nguồn từ [https://www.iocoder.cn/](https://www.iocoder.cn/), một tác giả Trung quốc. Hướng dẫn này rất trực quan dễ hiểu so và không dài dòng như các hướng dẫn tiếng anh khác.
:::

## Giới thiệu

Hướng dẫn chuyên sâu về Spring Boot phiên bản 2.X.

Hiện nay có rất nhiều bài viết hướng dẫn về Spring Boot trên thị trường, nhưng các bài viết chuyên sâu lại rất ít. Đối với nhiều nhà phát triển, việc nhập môn chính là mức độ hiểu biết cuối cùng về một công nghệ, một phần do các nhà phát triển “hơi lười”, một phần khác do các tác giả viết bài nhập môn về Spring Boot quá cơ bản, hoặc không đủ toàn diện hoặc không có hệ thống!

Vì thế, tôi viết chuyên mục này về Spring Boot, một hướng dẫn nhập môn chuyên sâu và toàn diện về Spring Boot 2.X.

Khi dạy bạn cách viết nhanh các API SpringMVC, tôi cũng muốn bạn biết thêm về các chức năng như trả về toàn cục (Global Response), xử lý ngoại lệ toàn cục (Global Exception Handler), request interceptor (trình chặn request), xử lý CORS, v.v. Khi dạy bạn cách gửi và tiêu thụ nhanh các message từ MQ, tôi cũng muốn bạn biết thêm về các đặc điểm khác của MQ như tiêu thụ theo cụm, tiêu thụ phát sóng, tin nhắn theo thứ tự, tin nhắn hẹn giờ, tin nhắn giao dịch, thử tiêu thụ lại, v.v. Khi dạy bạn cách viết nhanh nhiệm vụ Job, tôi cũng muốn bạn biết thêm về Quartz, Quartz cluster, XXL-JOB và nhiều nền tảng lập lịch được sử dụng trong thực tế!

...

Hãy trở thành một **Engineer**!

## Basic

- [Spring Boot Quick Start](./quick-start) ✅ 🚀
- [Spring Boot Auto Configuration](./autoconfig) ✅ 🚀
- [Spring Boot Jar](./jar) ❌
- [Spring Boot Debug](./debug) ❌

## Develop Tools

- [dev tools](./dev-tools) ❌
- [Lombok](./lombok) ✅ 🚀
- [Map Struct](./map-struct) ✅ 🚀

## Web

- [Spring Boot SpringMVC](./springmvc) ✅ 🚀
- [Spring Boot WebFlux](./webflux) ❌
- [Spring Boot Distributed Session](./distributed-session) ❌
- [Spring Boot Swagger](./swagger) ❌
- [Spring Boot Validation](./validation) ✅ 🚀
- [Spring Boot WebSocket](./websocket) ❌
- [Performance Test](./benchmark) ❌
- [IDEA HTTP Client](./idea-http-client) ❌

## RPC

- [Spring Boot Netty](./netty) ❌
- [Spring Boot Dubbo](./dubbo) ❌
- [Spring Boot Feign](./feign) ❌
- [Spring Boot gRPC](./grpc) ❌

## Storage

- [Spring Boot + MinIO](./minio) ✅ 🚀

## Data Access

### Relation Database

- [Spring Boot Datasource Pool](./ds-pool) ❌ 🚀
- [Spring Boot MyBatis](./mybatis) ❌ 🚀
- [Spring Boot JPA](./jpa) ❌
- [Spring Boot JDBC Template](./jdbc-template) ❌
- [Spring Boot Dynamic Datasource](./dynamic-ds) ❌ 🚀
- [Spring Boot Sharding Datasource](./sharding) ❌ 
- [Spring Boot Database Version Control](./db-version) ❌ 

### NoSQL

- [Spring Boot Redis](./redis) ❌ 🚀
- [Spring Boot Cache](./cache) ❌ 🚀
- [Spring Boot MongoDB](./mongodb) ❌ 🚀
- [Spring Boot ElasticSearch](./es) ❌ 🚀

## Transaction

- [Spring Boot Seata](./seata) ❌

## Security

- [Spring Boot + Spring Security](./spring-security) ✅ 🚀

### OAuth2

- [Spring Security OAuth2](./oauth2) ❌ 🚀
- [Spring Security OAuth2 Store](./oauth2-store) ❌ 🚀
- [Spring Security OAuth2 SSO](./oauth2-sso) ❌ 🚀

## Message Queue

- [Spring Boot RocketMQ](./rocketmq) ❌ 🚀
- [Spring Boot RabbitMQ](./rabbitmq) ❌ 🚀
- [Spring Boot Kafka](./kafka) ❌ 🚀
- [Spring Boot Event](./event) ❌ 🚀

## Job Scheduling

- [Spring Boot Job](./job) ❌ 🚀
- [Spring Boot Async Job](./async-job) ❌

## Monitoring

- [Spring Boot Admin](./sb-admin)
- [Spring Boot Prometheus + Grafana](./prometheus+grafana)

## Logging

- [Spring Boot Logging](./logging)
- [Spring Boot ELK](./elk)

## Tracing

- [Spring Boot Skywalking](./skywalking)