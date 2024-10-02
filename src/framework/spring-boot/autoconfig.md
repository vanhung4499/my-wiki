---
title: Spring Boot Auto Configuration
tags:
  - java
  - spring-boot
categories:
  - spring-boot
order: 2
---
# Spring Boot Auto Configuration

> Bài viết này cung cấp ví dụ mã nguồn hoàn chỉnh, có thể xem tại [https://github.com/YunaiV/SpringBoot-Labs](https://github.com/YunaiV/SpringBoot-Labs) trong thư mục [lab-47](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-47).
> 
> Nội dung gốc không dễ thực hiện, hãy ủng hộ bằng cách nhấn [Star](https://github.com/YunaiV/SpringBoot-Labs/stargazers) nhé, cùng nhau tiến lên nào!

## 1. Tổng quan

> Lời khuyên: Bởi vì bài viết này chia sẻ về nguyên lý của cấu hình tự động Spring Boot, nên yêu cầu người đọc có kinh nghiệm sử dụng Spring Boot. Nếu bạn chưa từng sử dụng Spring Boot, đừng lo lắng, hãy đọc trước hai chương của bài [Spring Boot SpringMVC](./springmvc) để cảm nhận sự hấp dẫn của Spring Boot.

Cấu hình tự động trong Spring Boot, như tên gọi, là mong muốn có thể tự động cấu hình để giải phóng chúng ta khỏi sự phiền phức của việc cấu hình thủ công. Để thực hiện cấu hình tự động, nó cần phải giải quyết ba câu hỏi:

*   Điều kiện **nào** được thỏa mãn?
*   Tạo ra **những** Bean nào?
*   Thuộc tính **gì** của các Bean được tạo?

Hãy cùng xem ví dụ dưới đây để trả lời ba câu hỏi trên. Khi chúng ta thêm phụ thuộc [`spring-boot-starter-web`](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web), nó sẽ tạo ra một Tomcat nhúng ở cổng 8080, đồng thời cho phép tùy chỉnh cổng thông qua cấu hình `server.port` trong tệp cấu hình `application.yaml`. Vậy câu trả lời cho ba câu hỏi là:

> Lưu ý: Để dễ hiểu, các câu trả lời dưới đây chỉ mang tính tạm thời và chưa hoàn toàn chính xác.

*   Điều kiện **nào** được thỏa mãn? Do chúng ta đã thêm phụ thuộc `spring-boot-starter-web`.
*   Tạo ra **những** Bean nào? Tạo ra một Bean Tomcat nhúng và khởi động nó.
*   Thuộc tính của Bean là **gì**? Thông qua cấu hình `server.port` trong tệp `application.yaml`, xác định thuộc tính cổng khởi động của Bean Tomcat với giá trị mặc định là 8080.

Giờ hãy cùng can đảm xem qua lớp [EmbeddedWebServerFactoryCustomizerAutoConfiguration](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/web/embedded/EmbeddedWebServerFactoryCustomizerAutoConfiguration.java), chịu trách nhiệm tạo cấu hình cho các máy chủ web nhúng như Tomcat, Jetty. Mã nguồn như sau:

```java
@Configuration // <1.1>  
@ConditionalOnWebApplication // <2.1>  
@EnableConfigurationProperties(ServerProperties.class) // <3.1>  
public class EmbeddedWebServerFactoryCustomizerAutoConfiguration {  
  
    /**  
     * Cấu hình bên trong nếu Tomcat được sử dụng.  
     */  
    @Configuration // <1.2>  
    @ConditionalOnClass({ Tomcat.class, UpgradeProtocol.class })  
    public static class TomcatWebServerFactoryCustomizerConfiguration {  
  
        @Bean  
        public TomcatWebServerFactoryCustomizer tomcatWebServerFactoryCustomizer(  
                Environment environment, ServerProperties serverProperties) {  
            // <3.2>  
            return new TomcatWebServerFactoryCustomizer(environment, serverProperties);  
        }  
  
    }  
  
    /**  
     * Cấu hình bên trong nếu Jetty được sử dụng.  
     */  
    @Configuration // <1.3>  
    @ConditionalOnClass({ Server.class, Loader.class, WebAppContext.class })  
    public static class JettyWebServerFactoryCustomizerConfiguration {  
  
        @Bean  
        public JettyWebServerFactoryCustomizer jettyWebServerFactoryCustomizer(  
                Environment environment, ServerProperties serverProperties) {  
             // <3.3>  
            return new JettyWebServerFactoryCustomizer(environment, serverProperties);  
        }  
  
    }  
  
    /**  
     * Cấu hình bên trong nếu Undertow được sử dụng.  
     */  
    // ... Bỏ qua mã nguồn của UndertowWebServerFactoryCustomizerConfiguration  
  
    /**  
     * Cấu hình bên trong nếu Netty được sử dụng.  
     */  
    // ... Bỏ qua mã nguồn của NettyWebServerFactoryCustomizerConfiguration  
  
}  
```

Trước khi xem mã nguồn, chúng ta hãy cùng tìm hiểu một chút về [Spring JavaConfig](https://docs.spring.io/spring-javaconfig/docs/1.0.0.M4/reference/html/). Từ Spring 3.0, Spring cung cấp phương thức JavaConfig, cho phép chúng ta sử dụng mã Java để tạo Spring Bean. Ví dụ mã nguồn:

```java
@Configuration  
public class DemoConfiguration {  
  
    @Bean  
    public Object object() {  
        return new Object();  
    }  
  
}  
```

*   Thêm chú thích [`@Configuration`](https://docs.spring.io/spring-javaconfig/docs/1.0.0.M4/reference/html/ch02.html#d0e270) lên **lớp**, để khai báo đây là một lớp cấu hình của Spring.
*   Thêm chú thích [`@Bean`](https://docs.spring.io/spring-javaconfig/docs/1.0.0.M4/reference/html/ch02s02.html) lên **phương thức**, để khai báo phương thức này tạo ra một Spring Bean.

OK, giờ chúng ta quay lại với mã nguồn EmbeddedWebServerFactoryCustomizerAutoConfiguration, chúng ta sẽ chia thành ba phần để giải thích, vừa hay giải quyết ba câu hỏi ở trên:

*   ① Lớp cấu hình
*   ② Chú thích điều kiện
*   ③ Thuộc tính cấu hình

**① Lớp cấu hình**

Tại vị trí `<1.1>`, thêm chú thích `@Configuration` vào lớp, khai báo đây là một **lớp cấu hình**. Vì mục đích của nó là cấu hình tự động, nên tên lớp kết thúc bằng `AutoConfiguration`.

Tại vị trí `<1.2>` và `<1.3>`, lần lượt là các lớp cấu hình được sử dụng để khởi tạo các Bean liên quan đến Tomcat và Jetty.

*   Lớp cấu hình `TomcatWebServerFactoryCustomizerConfiguration` chịu trách nhiệm tạo Bean [TomcatWebServerFactoryCustomizer](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/web/embedded/TomcatWebServerFactoryCustomizer.java), từ đó khởi tạo và chạy Tomcat nhúng.
*   Lớp cấu hình `JettyWebServerFactoryCustomizerConfiguration` chịu trách nhiệm tạo Bean [JettyWebServerFactoryCustomizer](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/web/embedded/JettyWebServerFactoryCustomizer.java), từ đó khởi tạo và chạy Jetty nhúng.

**Vậy, chúng ta có kết luận một: thông qua các lớp cấu hình được chú thích bằng `@Configuration`, có thể giải quyết vấn đề "Tạo ra những Bean nào".**

Thực tế, dự án [spring-boot-autoconfigure](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-autoconfigure) của Spring Boot cung cấp rất nhiều lớp cấu hình tự động cho các framework khác nhau, chúng ta sẽ đi sâu hơn vào [mục "2. Lớp cấu hình tự động"](#) sau.

**② Chú thích điều kiện**

Tại vị trí `<2>`, thêm chú thích điều kiện [`@ConditionalOnWebApplication`](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/condition/ConditionalOnWebApplication.java) vào lớp, đây là một **chú thích điều kiện**, chỉ ra rằng lớp cấu hình hiện tại chỉ có hiệu lực khi dự án hiện tại là một dự án Web. Trong các dự án Spring Boot, loại dự án được chia thành dự án Web (sử dụng SpringMVC hoặc WebFlux) và dự án không phải Web. Nhờ vậy, chúng ta dễ hiểu tại sao lớp cấu hình `EmbeddedWebServerFactoryCustomizerAutoConfiguration` yêu cầu loại dự án phải là Web, chỉ có dự án Web mới cần tạo các máy chủ Web nhúng.

Tại vị trí `<2.1>` và `<2.2>`, thêm chú thích điều kiện [`@ConditionalOnClass`](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/condition/ConditionalOnClass.java) vào lớp, đây là một **chú thích điều kiện**, chỉ ra rằng lớp cấu hình hiện tại chỉ có hiệu lực khi dự án hiện tại có các lớp được chỉ định.

*   Lớp cấu hình `TomcatWebServerFactoryCustomizerConfiguration` yêu cầu có các lớp từ phụ thuộc [`tomcat-embed-core`](https://mvnrepository.com/search?q=tomcat-embed-core) như Tomcat và UpgradeProtocol để có thể tạo máy chủ Tomcat nhúng.
*   Lớp cấu hình `JettyWebServerFactoryCustomizerConfiguration` yêu cầu có các lớp từ phụ thuộc [`jetty-server`](https://mvnrepository.com/artifact/org.eclipse.jetty/jetty-server) như Server, Loader và WebAppContext để có thể tạo máy chủ Jetty nhúng.

**Vậy, chúng ta có kết luận hai: thông qua các chú thích điều kiện, có thể giải quyết vấn đề "Điều kiện nào được thỏa mãn?".**

Thực tế, gói [`condition`](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/condition) của Spring Boot cung cấp rất nhiều chú thích điều kiện, chúng ta sẽ đi sâu hơn vào [mục "2. Chú thích điều kiện"](#) sau.

**③ Thuộc tính cấu hình**

Tại vị trí `<3.1>`, sử dụng chú thích [`@EnableConfigurationProperties`](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot/src/main/java/org/springframework/boot/context/properties/EnableConfigurationProperties.java) để kích hoạt lớp [ServerProperties](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/web/ServerProperties.java) **lớp thuộc tính cấu hình**. Trong Spring Boot, đã định nghĩa chú thích [`@ConfigurationProperties`](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot/src/main/java/org/springframework/boot/context/properties/ConfigurationProperties.java) để khai báo lớp thuộc tính cấu hình, cho phép gán các cấu hình có tiền tố cụ thể vào các trường trong lớp đó. Ví dụ, mã nguồn của `ServerProperties` như sau:

```java
@ConfigurationProperties(prefix = "server", ignoreUnknownFields = true)
public class ServerProperties
        implements EmbeddedServletContainerCustomizer, EnvironmentAware, Ordered {

    /**
     * Cổng HTTP của Server.
     */
    private Integer port;

    /**
     * Đường dẫn ngữ cảnh của ứng dụng.
     */
    private String contextPath;
      
    // ... Bỏ qua các thuộc tính khác
      
}
```

*   Thông qua chú thích `@ConfigurationProperties`, khai báo rằng các cấu hình có tiền tố `server` sẽ được gán vào lớp thuộc tính cấu hình `ServerProperties`.

Tại vị trí `<3.2>` và `<3.3>`, khi tạo các đối tượng `TomcatWebServerFactoryCustomizer` và `JettyWebServerFactoryCustomizer`, đều truyền vào `ServerProperties`, làm cơ sở cho việc tạo các máy chủ Web với các cấu hình tương ứng. Nói cách khác, chúng ta có thể tùy chỉnh cấu hình máy chủ Web bằng cách thay đổi các cấu hình trong tệp cấu hình.

**Vậy, chúng ta có kết luận ba: thông qua các thuộc tính cấu hình, có thể giải quyết vấn đề "Thuộc tính của các Bean được tạo là gì?".**

---

🐶 Tới đây, chúng ta đã hiểu khá rõ cách Spring Boot giải quyết ba vấn đề nêu trên, nhưng vẫn chưa thể hiện được cách thực hiện cấu hình tự động. Ví dụ, khi chúng ta thêm các phụ thuộc như `spring-boot-starter-web`, Spring Boot biết cách quét các lớp cấu hình nào. Tiếp tục hành trình của chúng ta, hãy tiếp tục phân tích kỹ hơn.


## 2. Lớp cấu hình tự động

Trong dự án [spring-boot-autoconfigure](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-autoconfigure) của Spring Boot, có rất nhiều cấu hình tự động cho các framework khác nhau, như hình dưới đây:  
![](https://static.iocoder.cn/images/Spring-Boot/2019-02-01/01.png)

Khi chúng ta khởi động ứng dụng Spring Boot thông qua phương thức [`SpringApplication#run(Class<?> primarySource, String... args)`](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot/src/main/java/org/springframework/boot/SpringApplication.java#L1218-L1227), có một thành phần rất quan trọng là lớp [SpringFactoriesLoader](https://github.com/spring-projects/spring-framework/blob/master/spring-core/src/main/java/org/springframework/core/io/support/SpringFactoriesLoader.java). Lớp này sẽ đọc tệp `spring.factories` trong thư mục `META-INF` để lấy danh sách **các lớp cấu hình tự động của từng framework**.

Chúng ta hãy xem một ví dụ về tệp `spring.factories` trong dự án [spring-boot-autoconfigure](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-autoconfigure) của Spring Boot:  
![](https://static.iocoder.cn/images/Spring-Boot/2019-02-01/02.png)

Như vậy, các lớp cấu hình có chú thích `@Configuration` sẽ **nâng cấp** thành các lớp cấu hình tự động. Khi Spring Boot lấy được các lớp cấu hình tự động này, nó sẽ tự động tạo ra các Bean tương ứng, hoàn thành chức năng cấu hình tự động.

> **Chú thích**: Có một chủ đề khá thú vị liên quan mà bạn có thể tìm hiểu thêm. Thực tế, chúng ta có thể hiểu tệp `spring.factories` như một cơ chế SPI (Service Provider Interface) của Spring Boot. Nếu bạn quan tâm, có thể tham khảo các bài viết sau:
> 
> *   [Cơ chế SPI trong Spring Boot](http://www.iocoder.cn/Fight/SPI-mechanism-in-Spring-Boot/?self)
> *   [Cơ chế SPI trong Java](http://www.iocoder.cn/Fight/xuma/spi/?self)
> *   [Cơ chế SPI trong Dubbo](http://dubbo.apache.org/zh-cn/docs/dev/SPI.html)
> 
> Thực tế, cấu hình tự động chỉ là một trong những điểm mở rộng của Spring Boot dựa trên `spring.factories`, với điểm mở rộng `EnableAutoConfiguration`. Từ hình trên, chúng ta cũng có thể thấy các điểm mở rộng khác như:
> 
> *   ApplicationContextInitializer
> *   ApplicationListener
> *   AutoConfigurationImportListener
> *   AutoConfigurationImportFilter
> *   FailureAnalyzer
> *   TemplateAvailabilityProvider

Vì dự án spring-boot-autoconfigure cung cấp cấu hình tự động cho các framework phổ biến, nên các framework khác cần tự triển khai cấu hình tự động cho mình. Ví dụ, Dubbo cung cấp cấu hình tự động thông qua dự án [dubbo-spring-boot-project](https://github.com/apache/dubbo-spring-boot-project), như hình dưới đây:  
![](https://static.iocoder.cn/images/Spring-Boot/2019-02-01/03.png)

## 3. Chú thích điều kiện

Chú thích điều kiện không phải là tính năng riêng của Spring Boot, mà đã được giới thiệu trong phiên bản Spring 3.1 để đăng ký các Bean khác nhau tùy theo môi trường. Khi đó, chú thích [`@Profile`](https://github.com/spring-projects/spring-framework/blob/master/spring-context/src/main/java/org/springframework/context/annotation/Profile.java) đã ra đời. Dưới đây là một ví dụ:

```java
@Configuration  
public class DataSourceConfiguration {  
  
    @Bean  
    @Profile("DEV")  
    public DataSource devDataSource() {  
        // ... MySQL đơn lẻ
    }  
  
    @Bean  
    @Profile("PROD")  
    public DataSource prodDataSource() {  
        // ... MySQL cụm  
    }  
      
}
```

*   Trong môi trường phát triển, chúng ta đăng ký Bean DataSource cho MySQL đơn lẻ.
*   Trong môi trường sản xuất, chúng ta đăng ký Bean DataSource cho MySQL cụm.

Trong phiên bản Spring 4, chú thích [`@Conditional`](https://github.com/spring-projects/spring-framework/blob/master/spring-context/src/main/java/org/springframework/context/annotation/Conditional.java) đã được giới thiệu, cho phép khai báo các điều kiện khi cấu hình lớp hoặc phương thức Bean. Ví dụ:

```java
@Configuration  
public class TestConfiguration {  
  
    @Bean  
    @Conditional(XXXCondition.class)  
    public Object xxxObject() {  
        return new Object();  
    }  
}
```

*   Trong đó, `XXXCondition` cần được chúng ta tự triển khai giao diện [Condition](https://github.com/spring-projects/spring-framework/blob/master/spring-context/src/main/java/org/springframework/context/annotation/Condition.java) và cung cấp điều kiện cụ thể.

Rõ ràng, chú thích `@Conditional` của Spring 4 không thuận tiện, yêu cầu chúng ta phải tự mở rộng. Vì vậy, Spring Boot đã cải tiến và cung cấp một số chú thích điều kiện phổ biến như sau:

*   `@ConditionalOnBean`: Khi có Bean được chỉ định trong container.
*   `@ConditionalOnMissingBean`: Khi không có Bean được chỉ định trong container.
*   `@ConditionalOnSingleCandidate`: Khi Bean chỉ định là duy nhất, hoặc có nhiều nhưng Bean chỉ định là ưu tiên.
*   `@ConditionalOnClass`: Khi lớp chỉ định có trong classpath.
*   `@ConditionalOnMissingClass`: Khi lớp chỉ định không có trong classpath.
*   `@ConditionalOnProperty`: Khi thuộc tính chỉ định có giá trị cụ thể.
*   `@ConditionalOnResource`: Khi tài nguyên chỉ định có trong classpath.
*   `@ConditionalOnExpression`: Dựa trên biểu thức SpEL làm điều kiện.
*   `@ConditionalOnJava`: Dựa trên phiên bản Java làm điều kiện.
*   `@ConditionalOnJndi`: Khi JNDI tồn tại tại vị trí chỉ định.
*   `@ConditionalOnNotWebApplication`: Khi dự án hiện tại không phải là ứng dụng web.
*   `@ConditionalOnWebApplication`: Khi dự án hiện tại là ứng dụng web.

## 4. Thuộc tính cấu hình

Spring Boot đọc các tệp cấu hình như `application.yaml` hay `application.properties` để tạo các Bean với thuộc tính tùy chỉnh. Thậm chí, có thể kết hợp với chú thích `@ConditionalOnProperty` để ngăn chặn việc tạo Bean.

Thực ra phần này không có nhiều nội dung để chia sẻ, bạn có thể đọc thêm bài viết [Giới thiệu về tệp cấu hình Spring Boot](http://www.iocoder.cn/Spring-Boot/config-file/?self) để hiểu rõ hơn.

## 5. Starter tích hợp

Khi sử dụng Spring Boot, chúng ta không trực tiếp thêm phụ thuộc [`spring-boot-autoconfigure`](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-autoconfigure), mà thay vào đó sử dụng các phụ thuộc Starter tích hợp sẵn trong Spring Boot. Ví dụ, khi muốn sử dụng SpringMVC, chúng ta thêm phụ thuộc [`spring-boot-starter-web`](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web). Tại sao lại như vậy?

Vì các lớp cấu hình tự động của Spring Boot thường có chú thích điều kiện `@ConditionalOnClass`, xác định rằng nếu trong dự án có lớp chỉ định, thì mới tạo Bean tương ứng. Và để có các lớp này, chúng ta cần thêm phụ thuộc vào framework tương ứng.

Do đó, khi thêm phụ thuộc `spring-boot-starter-web`, nó sẽ tự động thêm các phụ thuộc cần thiết, đảm bảo các lớp cấu hình tự động có thể hoạt động và tạo Bean tương ứng. Như hình dưới đây:  
![](https://static.iocoder.cn/images/Spring-Boot/2019-02-01/11.png)

Spring Boot tích hợp rất nhiều Starter, giúp chúng ta dễ dàng thêm các framework khác nhau và cấu hình tự động. Như hình dưới đây:  
![](https://static.iocoder.cn/images/Spring-Boot/2019-02-01/12.png)

## 6. Tự tạo Starter

Trong một số trường hợp, chúng ta cần tự tạo Starter để đạt được mục tiêu tự động cấu hình. Ví dụ:

* Các framework của bên thứ ba không cung cấp Starter, chẳng hạn như [Swagger](https://github.com/swagger-api), [XXL-JOB](https://github.com/xuxueli/xxl-job), v.v.
* Starter tích hợp sẵn của Spring Boot không đáp ứng nhu cầu của chúng ta, chẳng hạn như [`spring-boot-starter-jdbc`](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-jdbc) không cung cấp cấu hình cho nhiều nguồn dữ liệu.
* Khi dự án ngày càng lớn, chúng ta có thể muốn tạo Starter riêng cho nhóm của mình để dễ dàng cấu hình dự án, ví dụ như dự án [csx-bsf-all](https://gitee.com/yhcsx/csx-bsf-all) của Yonghui Caishixian.

Dưới đây, chúng ta sẽ cùng tạo một Starter tùy chỉnh, giúp tự động cấu hình một máy chủ HttpServer tích hợp sẵn của Java [HttpServer](https://docs.oracle.com/javase/8/docs/jre/api/net/httpserver/spec/com/sun/net/httpserver/HttpServer.html). Cấu trúc dự án cuối cùng sẽ như hình sau: 

![Dự án cuối cùng](https://static.iocoder.cn/images/Spring-Boot/2019-02-01/21.png)

Trước khi bắt đầu, chúng ta cần tìm hiểu về quy tắc đặt tên của Spring Boot Starter để làm việc trở nên chuyên nghiệp hơn. Quy tắc đặt tên như sau:

| Tình huống                               | Quy tắc đặt tên                             | Ví dụ                                                                                                                   |
| ---------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Starter tích hợp sẵn** của Spring Boot | `spring-boot-starter-{framework}`           | `spring-boot-starter-web`                                                                                               |
| Starter **tùy chỉnh** của framework      | `{framework}-spring-boot-starter`           | [`mybatis-spring-boot-starter`](https://mvnrepository.com/artifact/org.mybatis.spring.boot/mybatis-spring-boot-starter) |
| Starter **tùy chỉnh** của công ty        | `{company}-spring-boot-starter-{framework}` | Hiện chưa có, đây chỉ là ý tưởng của tôi                                                                                |

### 6.1 Dự án `yunai-server-spring-boot-starter`

Chúng ta sẽ tạo một dự án [`yunai-server-spring-boot-starter`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-47/yunai-server-spring-boot-starter), giúp tự động cấu hình một máy chủ HttpServer tích hợp sẵn trong Java. Vì dự án khá đơn giản nên chúng ta sẽ không tách ra thành hai dự án như `spring-boot-autoconfigure` và `spring-boot-starter-{framework}`.

#### 6.1.1 Thêm phụ thuộc

Trong tệp [`pom.xml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-47/yunai-server-spring-boot-starter/pom.xml), thêm các phụ thuộc cần thiết.

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0"  
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">  
    <parent>  
        <artifactId>lab-47</artifactId>  
        <groupId>cn.iocoder.springboot.labs</groupId>  
        <version>1.0-SNAPSHOT</version>  
    </parent>  
    <modelVersion>4.0.0</modelVersion>  
  
    <artifactId>yunai-server-spring-boot-starter</artifactId>  
  
    <dependencies>  
        <!-- Thêm thư viện Spring Boot Starter cơ bản -->  
        <dependency>  
            <groupId>org.springframework.boot</groupId>  
            <artifactId>spring-boot-starter</artifactId>  
            <version>2.2.2.RELEASE</version>  
        </dependency>  
    </dependencies>  
</project>  
```

#### 6.1.2 Lớp `YunaiServerProperties`

Trong gói [`cn.iocoder.springboot.lab47.yunaiserver.autoconfigure`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-47/yunai-server-spring-boot-starter/src/main/java/cn/iocoder/springboot/lab47/yunaiserver/autoconfigure/), tạo lớp [YunaiServerProperties](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-47/yunai-server-spring-boot-starter/src/main/java/cn/iocoder/springboot/lab47/yunaiserver/autoconfigure/YunaiServerProperties.java) để đọc các thuộc tính cấu hình có tiền tố `yunai.server`. Mã nguồn:

```java
@ConfigurationProperties(prefix = "yunai.server")  
public class YunaiServerProperties {  
  
    /**  
     * Cổng mặc định  
     */  
    private static final Integer DEFAULT_PORT = 8000;  
  
    /**  
     * Cổng  
     */  
    private Integer port = DEFAULT_PORT;  
  
    public static Integer getDefaultPort() {  
        return DEFAULT_PORT;  
    }  
  
    public Integer getPort() {  
        return port;  
    }  
  
    public YunaiServerProperties setPort(Integer port) {  
        this.port = port;  
        return this;  
    }  
}
```

#### 6.1.3 Lớp `YunaiServerAutoConfiguration`

Trong gói [`cn.iocoder.springboot.lab47.yunaiserver.autoconfigure`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-47/yunai-server-spring-boot-starter/src/main/java/cn/iocoder/springboot/lab47/yunaiserver/autoconfigure/), tạo lớp [YunaiServerAutoConfiguration](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-47/yunai-server-spring-boot-starter/src/main/java/cn/iocoder/springboot/lab47/yunaiserver/autoconfigure/YunaiServerAutoConfiguration.java) để tự động cấu hình máy chủ HttpServer khi lớp `com.sun.net.httpserver.HttpServer` có sẵn trong dự án. Mã nguồn:

```java
@Configuration // Khai báo lớp cấu hình  
@EnableConfigurationProperties(YunaiServerProperties.class) // Kích hoạt lớp cấu hình YunaiServerProperties  
public class YunaiServerAutoConfiguration {  
  
    private Logger logger = LoggerFactory.getLogger(YunaiServerAutoConfiguration.class);  
  
    @Bean // Khai báo tạo Bean  
    @ConditionalOnClass(HttpServer.class) // Điều kiện có lớp com.sun.net.httpserver.HttpServer. Lớp này có sẵn trong JDK nên điều kiện này luôn đúng.  
    public HttpServer httpServer(YunaiServerProperties serverProperties) throws IOException {  
        // Tạo đối tượng HttpServer và khởi động  
        HttpServer server = HttpServer.create(new InetSocketAddress(serverProperties.getPort()), 0);  
        server.start();  
        logger.info("[httpServer][Khởi động thành công trên cổng: {}]", serverProperties.getPort());  
  
        // Trả về đối tượng server  
        return server;  
    }  
}
```

#### 6.1.4 Tệp `spring.factories`

Trong thư mục `resources`, tạo thư mục `META-INF`, sau đó tạo tệp [`spring.factories`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-47/yunai-server-spring-boot-starter/src/main/resources/META-INF/spring.factories) trong thư mục này và thêm lớp cấu hình tự động `YunaiServerAutoConfiguration`. Nội dung như sau:

```
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
cn.iocoder.springboot.lab47.yunaiserver.autoconfigure.YunaiServerAutoConfiguration  
```

Đến đây, chúng ta đã hoàn thành một Starter tùy chỉnh. Tiếp theo, chúng ta sẽ thêm vào dự án [6.2 lab-47-demo](#) để thử nghiệm.

### 6.2 Dự án lab-47-demo

Tạo dự án [lab-47-demo](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-47/lab-47-demo/pom.xml) và đưa vào Starter tùy chỉnh của chúng ta.

### 6.2.1 Nhập phụ thuộc

Trong tệp [`pom.xml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-47/lab-47-demo/pom.xml), nhập các phụ thuộc liên quan.

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0"  
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">  
    <parent>  
        <artifactId>lab-47</artifactId>  
        <groupId>cn.iocoder.springboot.labs</groupId>  
        <version>1.0-SNAPSHOT</version>  
    </parent>  
    <modelVersion>4.0.0</modelVersion>  
  
    <artifactId>lab-47-demo</artifactId>  
  
    <dependencies>  
        <!-- Nhập Starter tùy chỉnh -->  
        <dependency>  
            <groupId>cn.iocoder.springboot.labs</groupId>  
            <artifactId>yunai-server-spring-boot-starter</artifactId>  
            <version>1.0-SNAPSHOT</version>  
        </dependency>  
    </dependencies>  
</project>
```

### 6.2.2 Tệp cấu hình

Trong thư mục `resource`, tạo tệp [`application.yaml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-47/lab-47-demo/src/main/resources/application.yaml) để thiết lập thuộc tính `yunai.server.port` nhằm tùy chỉnh cổng HttpServer. Cấu hình như sau:

```yaml
yunai:  
  server:  
    port: 8888 # Cổng HttpServer tùy chỉnh  
```

### 6.2.3 DemoApplication

Tạo lớp [`DemoApplication.java`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-47/lab-47-demo/src/main/java/cn/iocoder/springboot/lab47/demo/DemoApplication.java), chỉ cần cấu hình chú thích `@SpringBootApplication`. Mã như sau:

```java
@SpringBootApplication  
public class DemoApplication {  
    public static void main(String[] args) {  
        SpringApplication.run(DemoApplication.class, args);  
    }  
}
```

### 6.2.4 Kiểm tra đơn giản

Thực hiện phương thức `DemoApplication#main(String[] args)` để khởi động ứng dụng Spring Boot. Log in sẽ hiển thị như sau:

```
2020-02-02 13:03:12.156  INFO 76469 --- [           main] c.i.s.lab47.demo.DemoApplication         : Starting DemoApplication on MacBook-Pro-8 with PID 76469 (/Users/yunai/Java/SpringBoot-Labs/lab-47/lab-47-demo/target/classes started by yunai in /Users/yunai/Java/SpringBoot-Labs)  
2020-02-02 13:03:12.158  INFO 76469 --- [           main] c.i.s.lab47.demo.DemoApplication         : No active profile set, falling back to default profiles: default  
2020-02-02 13:03:12.873  INFO 76469 --- [           main] c.i.s.l.y.a.YunaiServerAutoConfiguration : [httpServer][Khởi động máy chủ thành công, cổng là:8888]  
2020-02-02 13:03:12.927  INFO 76469 --- [           main] c.i.s.lab47.demo.DemoApplication         : Started DemoApplication in 1.053 seconds (JVM running for 1.47)  
```

*   `YunaiServerAutoConfiguration` đã tự động cấu hình thành công bean HttpServer và khởi động máy chủ này trên cổng 8888.

Lúc này, khi chúng ta sử dụng trình duyệt truy cập vào địa chỉ [http://127.0.0.1:8888/](http://127.0.0.1:8888/), kết quả trả về là 404 Not Found vì chúng ta chưa cung cấp Handler tương ứng cho HttpServer.

# 666. Tổng kết

Đến đây, chúng ta đã hoàn thành việc học về nguyên lý tự động cấu hình của Spring Boot.

Trong quá trình hiểu nguyên lý tự động cấu hình của Spring Boot, chúng ta sẽ nhận thấy rằng, dù là lớp cấu hình hay chú thích điều kiện, thực tế Spring đã cung cấp sẵn. Thậm chí, `SpringFactoriesLoader` cũng là một sản phẩm của Spring. Vì vậy, Spring Boot được xây dựng trên nền tảng của Spring, thực hiện một cơ chế khởi động Boot.

Một trong những cốt lõi của Spring là IOC, chịu trách nhiệm quản lý vòng đời của Bean. Còn Spring Boot thì quản lý vòng đời của ứng dụng Java.

*   Trong thời đại của Spring, chúng ta thường sử dụng Tomcat như một container bên ngoài để chạy ứng dụng Java, Spring chỉ là một trong những thành phần.
*   Trong thời đại của Spring Boot, chúng ta sử dụng Spring Boot để quản lý việc chạy ứng dụng Java, trong khi Tomcat nhúng lại trở thành một thành phần trong đó.