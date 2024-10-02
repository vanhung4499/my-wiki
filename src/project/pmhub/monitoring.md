---
title: Skywalking Monitoring
tags:
  - java
  - microservice
categories:
  - project
order: 7
---
# PmHub - Distributed monitoring & tracing with Skywalking

Bài viết này chủ yếu hướng dẫn cách sử dụng **Skywalking** trong **PmHub** để giám sát hiệu suất và truy vết phân tán. Nội dung sẽ bắt đầu từ những kiến thức cơ bản, đến dự án thực tế và hướng dẫn tích hợp từ 0-1. Bài viết cũng sẽ chỉ ra cách dùng **traceid** để xác định các vấn đề trong chuỗi dịch vụ phân tán. Cuối cùng, sẽ có các câu hỏi giúp bạn **nắm vững cách sử dụng thực tế Skywalking**.

::: info
Đã triển khai Skywalking để giám sát hiệu suất và truy vết phân tán cho PmHub, tích hợp các kênh thông báo qua email, v.v., giúp giảm khoảng 30% thời gian phản hồi của hệ thống, đảm bảo tính ổn định và dễ bảo trì.
:::

## Tổng quan về truy vết chuỗi dịch vụ phân tán

Trong hệ thống microservice, dịch vụ A gọi dịch vụ B, B lại gọi dịch vụ C, và C tiếp tục gọi D, điều này làm chuỗi dịch vụ trở nên rất phức tạp.

Một request từ client sẽ đi qua nhiều node dịch vụ khác nhau trong hệ thống để tạo ra kết quả cuối cùng. Mỗi yêu cầu như vậy sẽ hình thành một chuỗi dịch vụ phân tán phức tạp. Bất kỳ sự chậm trễ hoặc lỗi nào trong một node của chuỗi cũng có thể khiến request cuối cùng thất bại.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240917182929.png)

Trong hệ thống phân tán, cần có một cơ chế chuyên biệt để theo dõi các chuỗi này.

Hiện nay, các công cụ phổ biến cho việc này bao gồm **Sleuth**, **Skywalking**, và **Zipkin**. Tuy nhiên, [Sleuth](https://spring.io/projects/spring-cloud-sleuth) đã thông báo sẽ thay đổi cấu trúc. 😂

> Spring Cloud Sleuth’s last minor version is 3.1. You can check the [3.1.x](https://github.com/spring-cloud/spring-cloud-sleuth/tree/3.1.x) branch for the latest commits. The core of this project got moved to [Micrometer Tracing](https://micrometer.io/docs/tracing) project and the instrumentations will be moved to [Micrometer](https://micrometer.io/) and all respective projects (no longer all instrumentations will be done in a single repository).

Dưới đây là một số giải pháp truy vết chuỗi dịch vụ phân tán đã phát triển trong ngành.

| Tech       | Mô tả                                                                                                                                                                                                                                                                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cat        | Nguồn mở của Dianping, một nền tảng giám sát ứng dụng thời gian thực được phát triển dựa trên Java, bao gồm giám sát ứng dụng thời gian thực và giám sát kinh doanh. Giải pháp tích hợp là triển khai giám sát thông qua các điểm chôn mã, chẳng hạn như bộ chặn, bộ lọc, v.v. Nó rất xâm phạm vào mã và chi phí tích hợp cao. Rủi ro lớn hơn.                                   |
| Zipkin     | Được mã nguồn mở bởi Twitter, hệ thống theo dõi phân tán mã nguồn mở được sử dụng để thu thập dữ liệu thời gian của các dịch vụ nhằm giải quyết vấn đề độ trễ trong kiến ​​trúc microservice, bao gồm: thu thập, lưu trữ, tìm kiếm và hiển thị dữ liệu, kết hợp với spring-cloud-sleuth tương đối đơn giản dễ sử dụng và dễ tích hợp, nhưng chức năng của nó tương đối đơn giản. |
| Pinpoint   | Pinpoint là một công cụ phân tích giám sát ứng dụng và phân tích chuỗi cuộc gọi nguồn mở dựa trên việc tiêm mã byte. Nó được đặc trưng bởi việc hỗ trợ nhiều plug-in khác nhau, các chức năng giao diện người dùng mạnh mẽ và không có sự xâm nhập mã ở đầu truy cập.                                                                                                            |
| Skywalking | SkyWalking là một công cụ phân tích giám sát ứng dụng và phân tích chuỗi cuộc gọi mã nguồn mở của Trung Quốc dựa trên việc tiêm bytecode. Nó có đặc điểm là hỗ trợ nhiều plug-in khác nhau, chức năng giao diện người dùng mạnh mẽ và không có sự xâm nhập mã ở đầu truy cập.                                                                                                    |

## Nguyên lý truy vết chuỗi dịch vụ phân tán

Giả sử một chuỗi dịch vụ microservice có ba thành phần như hình dưới đây: **Service 1** gọi **Service 2**, **Service 2** gọi **Service 3** và **Service 4**.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240917183735.png)

Một chuỗi truy vết sẽ thêm **Trace ID** và **Span ID** vào mỗi lần gọi dịch vụ.

Chuỗi truy vết được xác định duy nhất qua **Trace ID**.

**Span** xác định thông tin về mỗi lần yêu cầu, các **span** được liên kết với nhau qua **Parent ID**. **Span** đại diện cho một lần yêu cầu, và có thể hiểu đơn giản nó là thông tin của một lần gọi.

Một chuỗi truy vết được xác định qua **Trace ID**, mỗi **Span** đại diện cho thông tin của một lần yêu cầu và được liên kết với **Parent ID**.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240917192542.png)

|     |                                                                                                             |
| --- | ----------------------------------------------------------------------------------------------------------- |
| 1   | Nút đầu tiên: Span ID = A, Parent ID = null, Service 1 nhận yêu cầu.                                        |
| 2   | Nút thứ hai: Span ID = B, Parent ID = A, Service 1 gửi yêu cầu tới Service 2 và nhận phản hồi từ Service 2. |
| 3   | Nút thứ ba: Span ID = C, Parent ID = B, quá trình xử lý tại Service 2.                                      |
| 4   | Nút thứ tư: Span ID = D, Parent ID = C, Service 2 gửi yêu cầu đến Service 3 và nhận phản hồi từ Service 3.  |
| 5   | Nút thứ năm: Span ID = E, Parent ID = D, quá trình xử lý tại Service 3.                                     |
| 6   | Nút thứ sáu: Span ID = F, Parent ID = C, Service 3 gửi yêu cầu đến Service 4 và nhận phản hồi từ Service 4. |
| 7   | Nút thứ bảy: Span ID = G, Parent ID = F, quá trình xử lý tại Service 4.                                     |
| 8   | Qua Parent ID, có thể xác định được nút cha, giúp truy vết toàn bộ chuỗi dịch vụ.                           |

### Skywalking là gì?

**Skywalking** là một **khung mã nguồn mở** tuyệt vời, được open source vào năm 2015 và gia nhập Apache Incubator vào năm 2017. Chỉ trong hai năm ngắn ngủi, Skywalking đã được Apache đón nhận, chứng minh sức mạnh của nó. 👍

Skywalking hỗ trợ tích hợp với **Dubbo**, **SpringCloud**, **SpringBoot** mà **không xâm phạm mã**. Nó sử dụng **GRPC** cho giao tiếp, đảm bảo hiệu suất tốt. Skywalking được triển khai dưới dạng Java agent, hỗ trợ cảnh báo, giám sát JVM, và cung cấp các thống kê gọi toàn cục, cùng nhiều tính năng khác. Ngoài ra, cộng đồng phát triển của Skywalking cũng khá sôi động.

Trang web chính thức: [https://skywalking.apache.org/](https://skywalking.apache.org/)  
Mã nguồn mở: [https://github.com/apache/skywalking](https://github.com/apache/skywalking)

### Tại sao chọn Skywalking?

::: info
Skywalking có nhiều ưu điểm so với Zipkin, chẳng hạn như:

- Skywalking sử dụng công nghệ tăng cường bytecode, không xâm phạm mã, trong khi Zipkin có tính xâm phạm cao.
- Skywalking có nhiều tính năng phong phú hơn, các báo cáo thống kê và giao diện người dùng (UI) thân thiện hơn.
:::

### Kiến trúc của Skywalking

Skywalking chủ yếu chia thành hai phần: **máy chủ** và **máy khách**. Máy chủ chạy độc lập, còn máy khách chính là các dịch vụ microservice của bạn. Chỉ cần thêm các gói jar và cấu hình là có thể sử dụng.

![Sơ đồ kiến trúc](https://skywalking.apache.org/images/home/architecture_2160x720.png)

Sơ đồ kiến trúc cụ thể như sau:

![arch](https://skywalking.apache.org/blog/2018-12-12-skywalking-service-mesh-ready/0081Kckwly1gl2ctge1g5j31pc0s8h04.jpg)

Cụ thể, kiến trúc bao gồm bốn phần chính:

1. **Agent**: Thu thập dữ liệu log và gửi tới máy chủ OAP.
2. **OAP Server**: Nhận dữ liệu về truy vết (Tracing) và số liệu (Metric) từ Agent, sau đó phân tích (Analysis Core), lưu trữ vào cơ sở dữ liệu ngoài (Storage), và cung cấp chức năng truy vấn (Query).
3. **UI**: Cung cấp bảng điều khiển web để xem chuỗi dịch vụ, các chỉ số, hiệu suất, v.v.
4. **Storage**: Lưu trữ dữ liệu, hỗ trợ nhiều loại cơ sở dữ liệu khác nhau.

Sau khi hiểu sơ đồ kiến trúc, ta thấy rằng Agent chịu trách nhiệm thu thập log và truyền dữ liệu qua GRPC đến OAP để phân tích và lưu trữ vào cơ sở dữ liệu. Cuối cùng, UI sẽ hiển thị các báo cáo thống kê, quan hệ phụ thuộc dịch vụ và sơ đồ topology.

### Cài đặt máy chủ

Tải xuống tại: [https://skywalking.apache.org/downloads/](https://skywalking.apache.org/downloads/)

Bạn có thể chọn phiên bản mới nhất để tải về, nhưng lưu ý:

::: info
Vì PmHub hiện vẫn sử dụng **JDK 8**, trong khi **Skywalking** yêu cầu JDK 11 trở lên, nên để tránh các vấn đề không tương thích, khuyến nghị sử dụng phiên bản Skywalking thấp hơn. Ở đây, tôi sử dụng **8.3.0**. Sau này, nếu nâng cấp lên phiên bản JDK mới hơn, các vấn đề tương thích sẽ được giải quyết.
:::

::: info
Từ phiên bản **Skywalking 8.7.0** trở đi, mã của agent đã được tách khỏi Skywalking, bạn cần tự tải agent tương ứng từ trang web chính thức: [https://skywalking.apache.org/downloads/](https://skywalking.apache.org/downloads/).

Cách chọn phiên bản agent phù hợp có thể tìm thấy tại: [https://skywalking.apache.org/docs/skywalking-java/v9.0.0/en/setup/service-agent/java-agent/readme/](https://skywalking.apache.org/docs/skywalking-java/v9.0.0/en/setup/service-agent/java-agent/readme/)

Vì phiên bản máy chủ là **9.5.0**, agent tương ứng sẽ là **9.0.0**.
:::

### 1. Sửa cấu hình `config/application.yml`

Đây là tệp cấu hình của dịch vụ OAP, cần chỉnh sửa trung tâm đăng ký thành Nacos.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240917201418.png)


Chỉnh sửa cấu hình Nacos:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240917201438.png)

### 2. Sửa cấu hình `webapp/webapp.yml` (hoặc `application.yml`)

Đây là tệp cấu hình của dịch vụ UI, trong đó có một cấu hình `server.port`, đây là cổng của dịch vụ UI, mặc định là 8080. Hãy thay đổi thành 8888 để tránh xung đột cổng, như sau:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240917201449.png)

Khởi động:

```bash
sh startup.sh 
```

Tắt:

```bash
lsof -i :8888
kill -9 pid
```

Sau khi khởi động hoàn tất và không có lỗi, bạn có thể truy cập bằng trình duyệt qua địa chỉ: [http://localhost:8888/](http://localhost:8888/)

::: warning
Phiên bản mới cần ít nhất JDK 11 hỗ trợ.

Bạn cần quản lý nhiều phiên bản java trên một máy (linux/mac), bạn có thể sử dụng [jenv](https://github.com/jenv/jenv). Hãy tìm hiểu nó!
:::

## Thực chiến dự án
### Cài đặt phía Client

Phía client, tức là cách một microservice tích hợp với Skywalking. Vì Skywalking sử dụng công nghệ tăng cường mã byte, nên nó không xâm nhập mã của microservice. Chỉ cần một microservice bình thường, không cần thêm bất kỳ phụ thuộc nào.

Để truyền dữ liệu, cần sử dụng agent do Skywalking cung cấp. Bạn chỉ cần chỉ định trong tham số khởi động như sau:

```java
-javaagent:/Users/canghe/tools/skywalking/apache-skywalking-apm-bin/agent/skywalking-agent.jar
-Dskywalking.agent.service_name=pmhub-gateway
-Dskywalking.collector.backend_service=127.0.0.1:11800
```

::: info
+ `-javaagent`: Chỉ định đường dẫn đến tệp skywalking-agent.jar trong thư mục agent của Skywalking.
+ `-Dskywalking.agent.service_name`: Chỉ định tên dịch vụ trong Skywalking, thông thường là `spring.application.name` của microservice.
+ `-Dskywalking.collector.backend_service`: Chỉ định địa chỉ của dịch vụ OAP, nếu là local, cổng mặc định của dịch vụ OAP là 11800, vì vậy chỉ cần cấu hình thành `127.0.0.1:11800`.

Lưu ý: Đường dẫn đến tệp jar của agent không được chứa ký tự đặc biệt hoặc khoảng trắng, nếu không sẽ không thể chạy thành công.
:::

Lưu ý: Trong phiên bản mới của IntelliJ IDEA, bạn thêm VM options như sau:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240917212727.png)
![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240917212750.png)

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240917212849.png)

Sau khi cấu hình xong, bạn có thể thấy dịch vụ đã được agent theo dõi.

### Giám sát log

Trong giao diện người dùng của Skywalking có một module dành cho log, được sử dụng để thu thập log từ phía client. Mặc định, không có dữ liệu trong module này, vậy làm thế nào để truyền dữ liệu log vào Skywalking?

Có rất nhiều loại framework log, nổi tiếng như log4j, logback, log4j2. Sau đây là cách cấu hình với logback làm ví dụ.

**Chỉnh sửa mức độ log của agent:**

Để tránh việc in quá nhiều log info trên console, cần thay đổi mức độ log. Tệp cấu hình log của SkyWalking thường nằm trong `agent/config/agent.config`. Tìm và mở tệp này.

Tìm cấu hình sau và đặt mức độ log phù hợp, chẳng hạn như `ERROR` hoặc `WARN`, để giảm lượng log được ghi lại:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240917220047.png)


**Thêm phụ thuộc:**

> **Vì mỗi microservice đều cần dùng đến cấu hình này, nên có thể đặt trong module chung để các dịch vụ khác chỉ cần tham chiếu.**

```java
<!-- Nếu bạn muốn lấy TraceId trong mã dự án, cần thêm phụ thuộc này -->
<dependency>
    <groupId>org.apache.skywalking</groupId>
    <artifactId>apm-toolkit-trace</artifactId>
    <version>8.8.0</version>
</dependency>
<!-- Chức năng tùy chỉnh liên quan, chẳng hạn như thẻ tùy chỉnh -->
<dependency>
    <groupId>org.apache.skywalking</groupId>
    <artifactId>apm-toolkit-opentracing</artifactId>
    <version>8.8.0</version>
</dependency>
<!-- plugin logback ghi log skywalking -->
<dependency>
    <groupId>org.apache.skywalking</groupId>
    <artifactId>apm-toolkit-logback-1.x</artifactId>
    <version>8.8.0</version>
</dependency>
```

**Thêm cấu hình thu thập log vào logback.xml:**

```java
<?xml version="1.0" encoding="UTF-8"?>

<configuration scan="true" scanPeriod="5 seconds">
    <!-- Thu thập log skywalking -->
    <appender name="grpc-log" class="org.apache.skywalking.apm.toolkit.log.logback.v1.x.log.GRPCLogClientAppender">
        <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
            <layout class="org.apache.skywalking.apm.toolkit.log.logback.v1.x.mdc.TraceIdMDCPatternLogbackLayout">
                <Pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%X{tid}] [%thread] %-5level %logger{36} -%msg%n</Pattern>
            </layout>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="grpc-log"/>
    </root>
</configuration>
```

Sau khi cấu hình xong, log sẽ hiển thị trực tiếp trên giao diện người dùng. Bạn có thể nhấp vào các trang như theo dõi chuỗi, phân tích hiệu năng để trải nghiệm công cụ mạnh mẽ này. Ngoài ra, có thể cấu hình cảnh báo tùy chỉnh, liên kết với email, việc này khá dễ dàng.

## Câu hỏi phỏng vấn

Dưới đây là các câu hỏi phỏng vấn phổ biến mà nhà tuyển dụng có thể hỏi liên quan đến Skywalking và dự án PmHub.

**Q:** Hãy giải thích Skywalking là gì? Nó đóng vai trò gì trong giám sát hiệu năng và theo dõi phân tán?

**A:** Skywalking là một hệ thống mã nguồn mở APM (Application Performance Monitoring) và theo dõi phân tán. Nó giúp chúng ta giám sát hiệu năng của hệ thống phân tán, theo dõi toàn bộ chuỗi request, xác định các điểm nghẽn hiệu năng và điểm lỗi.

**Q:** Khi chọn Skywalking làm công cụ giám sát hiệu năng, bạn đã xem xét những công cụ nào khác và tại sao lại chọn Skywalking?

**A:** Chúng tôi đã xem xét Zipkin và Jaeger. Chúng tôi chọn Skywalking vì nó tích hợp cả giám sát hiệu năng và theo dõi phân tán, hỗ trợ nhiều ngôn ngữ và ít xâm phạm vào mã nguồn, phù hợp với dự án của chúng tôi.

**Q:** Bạn đã tích hợp Skywalking để giám sát hiệu năng của PmHub như thế nào? Hãy mô tả quá trình thực hiện.

**A:** Chúng tôi đã tích hợp agent của Skywalking vào PmHub, sử dụng Skywalking OAP để thu thập và lưu trữ dữ liệu. Các chỉ số như thời gian phản hồi, lưu lượng và tỷ lệ lỗi được cấu hình để theo dõi hiệu năng hệ thống.

**Q:** Những chỉ số giám sát nào bạn sử dụng để đánh giá hiệu năng của PmHub?

**A:** Chúng tôi theo dõi thời gian phản hồi, lưu lượng, tỷ lệ lỗi, chuỗi gọi và thời gian truy vấn cơ sở dữ liệu để hiểu rõ tình trạng và các điểm nghẽn hiệu năng.

**Q:** Skywalking đã giúp bạn phân tích và giải quyết vấn đề hiệu năng như thế nào trong theo dõi phân tán?

**A:** Skywalking giúp theo dõi toàn bộ chuỗi gọi của từng yêu cầu, từ đó xác định điểm nghẽn hiệu năng và lỗi. Qua phân tích chuỗi gọi, chúng tôi có thể tìm ra vấn đề ở microservice nào và xử lý nhanh chóng.

**Q:** Bạn có thể kể một ví dụ về việc phát hiện và giải quyết vấn đề hiệu năng thông qua theo dõi phân tán không?

**A:** Chúng tôi phát hiện một yêu cầu có thời gian phản hồi dài bất thường. Qua phân tích chuỗi gọi, chúng tôi nhận thấy vấn đề nằm ở truy vấn cơ sở dữ liệu thiếu chỉ mục. Sau khi tối ưu chỉ mục, hiệu năng truy vấn được cải thiện đáng kể.

Câu hỏi và câu trả lời này giúp đánh giá kinh nghiệm thực tế của ứng viên về tích hợp Skywalking, giám sát hiệu năng, theo dõi phân tán và tối ưu hóa hệ thống.