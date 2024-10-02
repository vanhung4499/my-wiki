---
title: Spring Boot Quick Start
tags:
  - java
  - spring-boot
categories:
  - spring-boot
order: 1
---
# Spring Boot Quick Start

::: info
Bài viết này cung cấp ví dụ mã nguồn hoàn chỉnh, có thể xem tại: [https://github.com/YunaiV/SpringBoot-Labs](https://github.com/YunaiV/SpringBoot-Labs)

Hãy đánh giá cho một **Star** cho tác giả!
:::

# 1. Tổng quan

Trước tiên, chúng ta hãy cùng tìm hiểu đơn giản về [Spring Boot](https://spring.io/projects/spring-boot/) là gì? Phần giới thiệu chính thức của nó như sau:

> TRÍCH TỪ [Tài liệu chính thức của Spring Framework](https://spring.io/projects/spring-boot#overview)
>
> **Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can "just run".**
> 
> We take an opinionated view of the Spring platform and third-party libraries so you can get started with minimum fuss. **Most Spring Boot applications need minimal Spring configuration.**
>
> ## Features
>
> - Create stand-alone Spring applications
> - Embed Tomcat, Jetty or Undertow directly (no need to deploy WAR files)
> - Provide opinionated 'starter' dependencies to simplify your build configuration
> - Automatically configure Spring and 3rd party libraries whenever possible
> - Provide production-ready features such as metrics, health checks, and externalized configuration
> - Absolutely no code generation and no requirement for XML configuration

Có phải bạn cảm thấy hơi bối rối? Điểm mấu chốt cần hiểu là hai câu được **in đậm**. Nói một cách đơn giản, bằng cách sử dụng Spring Boot, chúng ta không cần phải thực hiện nhiều cấu hình Spring, chỉ cần một lượng nhỏ hoặc thậm chí là không có cấu hình nào so với Spring.

Có lẽ nói như vậy vẫn hơi trừu tượng, chúng ta hãy trực tiếp bắt tay vào thực hành!

## 2. Quick Start

Trong phần này, chúng ta sẽ xây dựng một dự án mẫu Spring Boot và sử dụng Spring MVC để cung cấp một API HTTP đơn giản.

Trước khi bắt đầu xây dựng dự án mẫu, bạn cần chuẩn bị như sau:

*   JDK 8+

> Note: Phiên bản Spring Boot 2.X yêu cầu phiên bản Java tối thiểu là 8.

*   Maven

> Bài viết này yêu cầu bạn đã có hiểu biết cơ bản về Maven.

*   [IDEA](https://www.jetbrains.com/)

> Công cụ phát triển Java mạnh nhất vũ trụ, không có đối thủ.

### 2.1. Tạo dự án Maven

① Mở IDEA, nhấp vào menu `File` -> `New` -> `Project...` để tạo dự án. Như hình dưới đây:  
![Tạo dự án mới - 01](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/01.jpg)

② Chọn loại `Maven`, nhấp vào nút «Next» để tiếp tục. Nhập `GroupId` và `ArtifactId` của Maven, như hình dưới đây:  
![Tạo dự án mới - 02](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/02.jpg)

③ Nhấp vào nút «Next», tiếp tục đến bước tiếp theo. Như hình dưới đây:  
![Tạo dự án mới - 03](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/03.jpg)

④ Nhấp vào nút «Finish» để hoàn tất việc tạo dự án Maven. Lúc này, dự án sẽ như hình dưới đây:  
![Tạo dự án mới - 04](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/04.jpg)

Cuối cùng, dự án mẫu của chúng ta sẽ như hình dưới đây:  
![Dự án cuối cùng](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/05.jpg)

Dưới đây, chúng ta sẽ cùng xem từng bước một.
Dưới đây là bản dịch tiếng Việt của đoạn văn bạn đã cung cấp:

---

### 2.2. Import dependencies

Trong tệp `pom.xml`, nhập các phụ thuộc liên quan.

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0"  
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">  
    <modelVersion>4.0.0</modelVersion>  
  
    <groupId>cn.iocoder</groupId>  
    <artifactId>demo01</artifactId>  
    <version>1.0-SNAPSHOT</version>  
  
    <!-- Kế thừa cấu hình mặc định từ Spring Boot -->  
    <parent>  
        <groupId>org.springframework.boot</groupId>  
        <artifactId>spring-boot-starter-parent</artifactId>  
        <version>2.2.2.RELEASE</version>  
        <relativePath/> <!-- tìm kiếm cha từ kho lưu trữ -->  
    </parent>  
  
    <dependencies>  
        <!-- Tự động cấu hình cho SpringMVC -->  
        <dependency>  
            <groupId>org.springframework.boot</groupId>  
            <artifactId>spring-boot-starter-web</artifactId>  
        </dependency>  
    </dependencies>  
  
</project>  
```

*   Nhập [`spring-boot-starter-parent`](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-parent) làm POM cha, từ đó kế thừa cấu hình mặc định.

> Note: Xét về việc trong các dự án công ty thông thường đã có POM cha riêng, bạn có thể tham khảo [tài liệu](https://docshome.gitbooks.io/springboot/content/pages/using-spring-boot.html#using-boot-maven-without-a-parent) để điều chỉnh.

*   Nhập phụ thuộc [`spring-boot-starter-web`](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web) để tự động cấu hình cho SpringMVC. Đồng thời, phụ thuộc này cũng tự động giúp chúng ta nhập các phụ thuộc liên quan như SpringMVC.

### 2.3. Tệp cấu hình

Trong dự án Spring Boot, quy ước sử dụng tệp cấu hình `application.yaml` để tùy chỉnh các Bean của cấu hình tự động của Spring Boot.

Trong thư mục `resource`, tạo tệp cấu hình `application.yaml`. Nội dung như sau:

```yaml
server:  
  port: 8080 # Số cổng của Tomcat nhúng. Giá trị mặc định là 8080.  
```

*   Thông qua mục cấu hình `server.port`, thiết lập cổng của Tomcat nhúng sẽ được khởi động sau là cổng 8080.

> Lời khuyên: Về tệp cấu hình, bạn có thể đọc thêm trong bài viết [《Hướng dẫn nhập môn tệp cấu hình Spring Boot》](./config-file/?self).

### 2.4. DemoController

Tạo lớp DemoController, cung cấp một API HTTP đơn giản. Mã như sau:

```java
@RestController  
@RequestMapping("/demo")  
public class DemoController {  
  
    @GetMapping("/echo")  
    public String echo() {  
        return "echo";  
    }  
  
}  
```

*   Đây là một ví dụ tiêu chuẩn về sử dụng SpringMVC, không có gì đặc biệt cả.

### 2.5. Application

Tạo lớp Application, cung cấp lớp khởi động cho ứng dụng Spring Boot. Mã như sau:

```java
@SpringBootApplication  
public class Application {  
  
    public static void main(String[] args) {  
        SpringApplication.run(Application.class, args);  
    }  
  
}  
```

*   Trên lớp, thêm chú thích [`@SpringBootApplication`](https://docshome.gitbooks.io/springboot/content/pages/using-spring-boot.html#using-boot-using-springbootapplication-annotation) để khai báo đây là một ứng dụng Spring Boot. Thông qua chú thích này, ứng dụng sẽ có các chức năng như cấu hình tự động của Spring Boot.
*   Trong phương thức `#main(String[] args)`, chúng ta sử dụng phương thức [`SpringApplication#run(Class<?> primarySource, String... args)`](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot/src/main/java/org/springframework/boot/SpringApplication.java#L1218-L1227) để khởi động ứng dụng Spring Boot.

### 2.6. Kiểm tra đơn giản

① Thực thi phương thức `Application#main(String[] args)` để khởi động dự án mẫu.

Tại đây, chúng ta sẽ thấy rằng không cần triển khai dự án Web lên Tomcat bên ngoài, mà có thể khởi động trực tiếp thông qua phương thức `Application#main(String[] args)` rất tiện lợi. Điều này hoàn toàn phù hợp với mô tả trong tài liệu Spring Boot:

> Sử dụng Spring Boot có thể dễ dàng tạo ra **ứng dụng độc lập có thể chạy trực tiếp**, và đạt tiêu chuẩn sản xuất dựa trên Spring.

② Lúc này, chúng ta có thể thấy trên bảng điều khiển của IDEA hiển thị nhật ký khởi động của Spring Boot như sau:

```sh

// Spring Boot Banner  
  .   \_\_\_\_          \_            \_\_ \_ \_  
 /\\\\ / \_\_\_'\_ \_\_ \_ \_(\_)\_ \_\_  \_\_ \_ \\ \\ \\ \\  
( ( )\\\_\_\_ | '\_ | '\_| | '\_ \\/ \_\` | \\ \\ \\ \\  
 \\\\/  \_\_\_)| |\_)| | | | | || (\_| |  ) ) ) )  
  '  |\_\_\_\_| .\_\_|\_| |\_|\_| |\_\\\_\_, | / / / /  
 =========|\_|==============|\_\_\_/=/\_/\_/\_/  
 :: Spring Boot ::        (v2.2.2.RELEASE)  
  
// 启动 Java 进程使用的 PID 进程号  
2020-02-08 15:38:25.724  INFO 10645 --- \[           main\] cn.iocoder.demo01.Application            : Starting Application on MacBook-Pro-8 with PID 10645 (/Users/yunai/Java/demo01/target/classes started by yunai in /Users/yunai/Java/demo01)  
// Spring Boot Profile mechanism, which can be ignored for the time being.
2020-02-08 15:38:25.727  INFO 10645 --- \[           main\] cn.iocoder.demo01.Application            : No active profile set, falling back to default profiles: default  
// Embedded Tomcat startup
2020-02-08 15:38:26.503  INFO 10645 --- \[           main\] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)  
2020-02-08 15:38:26.510  INFO 10645 --- \[           main\] o.apache.catalina.core.StandardService   : Starting service \[Tomcat\]  
2020-02-08 15:38:26.510  INFO 10645 --- \[           main\] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: \[Apache Tomcat/9.0.29\]  
2020-02-08 15:38:26.561  INFO 10645 --- \[           main\] o.a.c.c.C.\[Tomcat\].\[localhost\].\[/\]       : Initializing Spring embedded WebApplicationContext  
2020-02-08 15:38:26.561  INFO 10645 --- \[           main\] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 799 ms  
2020-02-08 15:38:26.693  INFO 10645 --- \[           main\] o.s.s.concurrent.ThreadPoolTaskExecutor  : Initializing ExecutorService 'applicationTaskExecutor'  
2020-02-08 15:38:26.839  INFO 10645 --- \[           main\] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''  
2020-02-08 15:38:26.842  INFO 10645 --- \[           main\] cn.iocoder.demo01.Application            : Started Application in 1.396 seconds (JVM running for 1.955)  
// SpringMVC DispatcherServlet initialization  
2020-02-08 15:38:44.992  INFO 10645 --- \[nio-8080-exec-1\] o.a.c.c.C.\[Tomcat\].\[localhost\].\[/\]       : Initializing Spring DispatcherServlet 'dispatcherServlet'  
2020-02-08 15:38:44.992  INFO 10645 --- \[nio-8080-exec-1\] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'  
2020-02-08 15:38:44.996  INFO 10645 --- \[nio-8080-exec-1\] o.s.web.servlet.DispatcherServlet        : Completed initialization in 4 ms  
// ... Can be ignored for now  
2020-02-08 15:39:37.113  INFO 10645 --- \[extShutdownHook\] o.s.s.concurrent.ThreadPoolTaskExecutor  : Shutting down ExecutorService 'applicationTaskExecutor'  
```


- Lưu ý, mỗi dòng bắt đầu bằng `//` là chú thích do tôi thêm vào, các bạn hãy đọc kỹ nhé.

Bạn có nhận ra rằng Spring Boot đã tự động cấu hình Logger cho chúng ta không? Điều này thật sự tiện lợi phải không?

③ Sử dụng trình duyệt và truy cập vào [http://127.0.0.1:8080/demo/echo](http://127.0.0.1:8080/demo/echo) để kiểm tra, kết quả trả về là `"echo"`.

Điều này cho thấy rằng, SpringMVC framework cũng đã được Spring Boot tự động cấu hình xong. Đồng thời, máy chủ Tomcat tích hợp bên trong đã hoạt động.

- - -

Đến đây, chúng ta đã hoàn thành phần giới thiệu nhanh về Spring Boot. Tiếp theo, các bạn có thể đọc bài viết [Nhập môn Spring Boot SpringMVC](./springmvc) để học thêm.

Ngoài ra, tính năng tự động cấu hình của Spring Boot là một điều vô cùng tuyệt vời. Bạn nhất định phải đọc bài [Spring Boot Auto Configuration](./autoconfigure). Hiểu rõ cách nó hoạt động. Đừng chỉ dừng lại ở cấp độ nhập môn hoặc chỉ biết sử dụng, mà hãy luôn học hỏi và khám phá sâu hơn.

##  3. Spring Initializr

Chúng ta có thể sử dụng công cụ [Spring Initializr](https://start.spring.io/) để nhanh chóng tạo một dự án Spring Boot. Như hình minh họa dưới đây:  
![Giao diện Spring Initializr](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/11.png)

Bây giờ, chúng ta sẽ sử dụng Spring Initializr để xây dựng một ví dụ.

### 3.1. Tạo dự án

① Sử dụng trình duyệt, mở địa chỉ [https://start.spring.io/](https://start.spring.io/) và cấu hình như hình dưới đây:  
![Cấu hình Spring Initializr](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/12.png)

② Nhấp vào nút "Explore" để duyệt qua dự án được tạo. Như hình dưới đây:  
![Explore](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/13.png)

Thật ấn tượng, bạn có thể duyệt trực tuyến dự án sẽ được tạo.

③ Đóng cửa sổ bật lên, sau đó nhấp vào nút "Generate" để tạo dự án, dự án sẽ được tải xuống dưới dạng tệp nén `.zip`.

### 3.2. Nhập vào IDEA

① Giải nén tệp `.zip`, để chuẩn bị nhập vào IDEA sau này.

② Mở IDEA, nhấp vào menu `File` -> `Project from Existing Sources...` để nhập dự án. Như hình dưới đây:  
![Nhập dự án](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/14.png)

③ Chọn loại `Maven`, sau đó tiếp tục nhấn nút "Next" cho đến khi hoàn tất nhập dự án. Lúc này, dự án sẽ có cấu trúc như hình dưới đây:  
![Cấu trúc dự án](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/15.png)

> Gợi ý: Nếu bạn chọn phiên bản Spring Boot khá mới, bạn có thể phải kiên nhẫn chờ đợi một chút, vì IDEA cần thời gian để Maven tải các phụ thuộc liên quan.

*   Thư mục `resource/static` để chứa các tài nguyên tĩnh. Ví dụ: js, css, hình ảnh, v.v.
*   Thư mục `resource/templates` để chứa các mẫu trang. Ví dụ: [thymeleaf](https://github.com/thymeleaf/thymeleaf), [freemarker](https://github.com/apache/freemarker), v.v.

Tiếp theo, chúng ta sẽ cùng nhau xem từng bước.

### 3.3. Thêm dependency

Trong tệp `pom.xml`, thêm các dependency liên quan.

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">  
    <modelVersion>4.0.0</modelVersion>  
    <parent>  
        <groupId>org.springframework.boot</groupId>  
        <artifactId>spring-boot-starter-parent</artifactId>  
        <version>2.2.4.RELEASE</version>  
        <relativePath/> <!-- lookup parent from repository -->  
    </parent>  
    <groupId>cn.iocoder</groupId>  
    <artifactId>demo02</artifactId>  
    <version>0.0.1-SNAPSHOT</version>  
    <name>demo02</name>  
	<description>Demo project for Spring Boot</description>
  
    <properties>  
        <java.version>1.8</java.version>  
    </properties>  
  
    <dependencies>  
        <dependency>  
            <groupId>org.springframework.boot</groupId>  
            <artifactId>spring-boot-starter-web</artifactId>  
        </dependency>  
  
        <dependency>  
            <groupId>org.springframework.boot</groupId>  
            <artifactId>spring-boot-starter-test</artifactId>  
            <scope>test</scope>  
            <exclusions>  
                <exclusion>  
                    <groupId>org.junit.vintage</groupId>  
                    <artifactId>junit-vintage-engine</artifactId>  
                </exclusion>  
            </exclusions>  
        </dependency>  
    </dependencies>  
  
    <build>  
        <plugins>  
            <plugin>  
                <groupId>org.springframework.boot</groupId>  
                <artifactId>spring-boot-maven-plugin</artifactId>  
            </plugin>  
        </plugins>  
    </build>  
  
</project>  
```

Chúng ta chỉ nói về các điểm khác biệt:

*   Thiết lập thuộc tính `<java.version>` là `1.8`, biểu thị việc sử dụng JDK8.
    
*   Thêm dependency [`spring-boot-starter-test`](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-test) để tự động cấu hình cho việc kiểm thử (Test).

> Note: Nếu bạn quan tâm đến việc kiểm thử đơn vị trong Spring Boot, có thể đọc thêm bài viết [Spring Boot Unit Test](./unit-test).
  
*   Thêm plugin [`spring-boot-maven-plugin`](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-maven-plugin) để đóng gói dự án Spring Boot thành tệp `jar` hoặc `war`.

> Note: Nếu bạn quan tâm đến việc xây dựng dự án Spring Boot, có thể tham khảo bài viết [Spring Boot CD with Jenkins](./jenkins).

### 3.4. Tệp cấu hình

Tệp cấu hình `application.properties` đang để trống.

Lưu ý rằng Spring Boot hỗ trợ các định dạng cấu hình như YAML, PROPERTIES, JSON, v.v.

### 3.5. Demo02Application

Lớp `Demo02Application` cung cấp class khởi động cho ứng dụng Spring Boot. Mã nguồn như sau:

```java
@SpringBootApplication  
public class Demo02Application {  
  
    public static void main(String[] args) {  
        SpringApplication.run(Demo02Application.class, args);  
    }  
  
}  
```

Như thường lệ, ứng dụng Spring Boot sẽ được khởi chạy thông qua phương thức `main(String[] args)`. Phần này mình sẽ không trình diễn nữa, bạn hãy tự tìm hiểu nhé.

### 3.6. Demo02ApplicationTests

Lớp `Demo02ApplicationTests` là lớp kiểm thử đơn vị. Mã nguồn như sau:

```java
@SpringBootTest  
class Demo02ApplicationTests {  
  
    @Test  
    void contextLoads() {  
    }  
  
}  
```

*   Trên lớp, thêm annotation `@SpringBootTest`, khai báo rằng đây là một lớp kiểm thử đơn vị trong môi trường Spring Boot.

Chạy phương thức `#contextLoads()` để thực hiện một lần kiểm thử đơn vị.

# 4\. IDEA x Spring Initializr

IDEA tích hợp sẵn plugin [Spring Boot](https://www.jetbrains.com/help/idea/spring-boot.html), cung cấp tích hợp với Spring Initializr.

> Wizard tạo dự án Spring Boot / Spring Initializr.

Bây giờ, chúng ta sẽ sử dụng plugin này để tạo một dự án Spring Boot.

① Mở IDEA, nhấp vào menu `File` -> `New` -> `Project...` để tạo dự án. Như hình dưới đây:  
![Dự án mới - 01](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/21.jpg)

② Chọn loại `Spring Initializr`, nhấp nút "Next" để chuyển sang bước tiếp theo. Nhập `GroupId` và `ArtifactId` của Maven, như hình dưới:  
![Dự án mới - 02](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/22.jpg)

③ Nhấp nút "Next", chọn những dependency cần thiết, tạm thời ở đây chúng ta chỉ cần dependency Web. Như hình dưới:  
![Dự án mới - 03](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/23.jpg)

④ Nhấp nút "Next", sau đó nhấp nút "Finish" để hoàn thành việc tạo dự án Maven. Lúc này dự án sẽ như hình dưới:  
![Dự án mới - 04](https://static.iocoder.cn/images/Spring-Boot/2019-01-01/24.jpg)

Các bước này giống với phần [3. Spring Initializr](https://start.spring.io/), nên sẽ không nhắc lại nữa.
