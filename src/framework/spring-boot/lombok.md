---
title: Lombok
tags:
  - java
  - spring-boot
categories:
  - spring-boot
order: 5
---
# Lombok

> Bài viết này cung cấp mã nguồn hoàn chỉnh, có thể xem tại thư mục [lab-49](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-49) trên [https://github.com/YunaiV/SpringBoot-Labs](https://github.com/YunaiV/SpringBoot-Labs).
> 
> Việc sáng tác không dễ dàng, hãy cho một chút yêu thương bằng cách [Star](https://github.com/YunaiV/SpringBoot-Labs/stargazers) nhé, cùng nhau tiến lên nào!

## 1. Tổng Quan

[Lombok](https://github.com/rzwitserloot/lombok) là một công cụ Java, thông qua việc sử dụng các chú thích mà nó định nghĩa, tự động sinh ra mã nguồn dư thừa phổ biến, nâng cao hiệu suất phát triển.

Ví dụ, trên lớp [POJO](https://baike.baidu.com/item/POJO) Java, thêm các chú thích `@Setter` và `@Getter` sẽ tự động sinh ra mã cho các phương thức set, get. Ví dụ như sau:

```java
// Mã nguồn UserDO.java mà chúng ta viết
@Setter
@Getter
public class UserDO {  
    private String username;  
    private String password;  
}
```

```java
// Mã nguồn thực tế được sinh ra (phân tích ngược UserDO.class)
public class UserDO {  
    private String username;  
    private String password;  

    public UserDO() {  
    }  

    public void setUsername(final String username) {  
        this.username = username;  
    }  

    public void setPassword(final String password) {  
        this.password = password;  
    }  

    public String getUsername() {  
        return this.username;  
    }  

    public String getPassword() {  
        return this.password;  
    }  
}  
```

*   Thật sự rất tiện lợi, phải không nào? Hehe~

## 2. Nguyên Lý Thực Hiện

Nguyên lý thực hiện của Lombok dựa trên quy chuẩn [JSR269 (Pluggable Annotation Processing API)](https://jcp.org/en/jsr/detail?id=269), tự định nghĩa bộ xử lý chú thích biên dịch, được sử dụng để quét các lớp sử dụng chú thích được định nghĩa bởi Lombok trong giai đoạn biên dịch Javac, tiến hành sinh mã tùy chỉnh.

Nếu bạn muốn tìm hiểu sâu hơn, có thể đọc các bài viết sau:

*   [《Bộ xử lý chú thích có tác dụng gì?》](http://www.iocoder.cn/Fight/What-does-the-annotation-handler-do/?self)
*   [《API chú thích plugin JSR269》](https://blog.whatakitty.com/JSR269%E6%8F%92%E4%BB%B6%E5%8C%96%E6%B3%A8%E8%A7%A3API.html)

## 3. Cài Đặt Lombok

Trong IDEA, đã cung cấp [plugin IntelliJ Lombok](https://plugins.jetbrains.com/plugin/6317-lombok) để tiện lợi cho việc sử dụng Lombok. Cách cài đặt rất đơn giản, chỉ cần tìm kiếm từ khóa Lombok trong chức năng Plugins của IDEA. Như hình dưới đây:  
![Cài đặt plugin Lombok](https://static.iocoder.cn/images/Spring-Boot/2019-02-04/01.png)

Sau khi cài đặt hoàn tất, cần khởi động lại IDEA để plugin có hiệu lực. Khi plugin đã hoạt động, chúng ta có thể tìm thấy chức năng Lombok trong cài đặt của IDEA. Như hình dưới đây:  
![Cài đặt Lombok](https://static.iocoder.cn/images/Spring-Boot/2019-02-04/02.png)
## 4. Thiết lập dự án mẫu

Có thể bạn sẽ thắc mắc tại sao chúng ta lại viết về Lombok trong chuyên mục này?! Thực sự thì Lombok không chỉ phù hợp với các dự án Spring Boot. Lý do viết ở đây chủ yếu là tôi muốn viết một bài về Lombok nhưng không biết để ở đâu, vì vậy tôi quyết định để ở đây.

> Đây là tuổi trẻ của tôi không biết để đâu, bỗng chốc đã 30 tuổi rồi~

Ngoài ra, tôi thấy trong công cụ [Spring Initializr](https://start.spring.io/) có lựa chọn phụ thuộc vào Lombok, liệu điều này có nghĩa là Spring cũng khuyến nghị chúng ta sử dụng nó không? Như hình dưới đây:  
![Spring Initializr](https://static.iocoder.cn/images/Spring-Boot/2019-02-04/03.png)

Trong tệp `pom` của dự án Maven, chúng ta chỉ cần thêm phụ thuộc vào [`lombok`](https://mvnrepository.com/artifact/org.projectlombok/lombok) là có thể sử dụng Lombok. Mã như sau:

```xml
<!-- Thêm phụ thuộc Lombok -->
<dependency>  
    <groupId>org.projectlombok</groupId>  
    <artifactId>lombok</artifactId>  
    <optional>true</optional>  
</dependency>  
```

Dự án mẫu cụ thể sẽ là một dự án bình thường, tôi sẽ không lặp lại nữa. Tất cả mã nguồn ví dụ trong bài viết này sẽ được lưu trong dự án [lab-49-lombok-demo](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-49/lab-49-lombok-demo/) .

## 5. Tổng hợp chú thích của Lombok

Lombok có rất nhiều chú thích, hãy cùng xem từng cái.

- [`@Getter`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/Getter.java): Thêm vào **lớp** hoặc **thuộc tính**, tự động sinh ra phương thức get tương ứng.

- [`@Setter`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/Setting.java): Thêm vào **lớp** hoặc **thuộc tính**, tự động sinh ra phương thức set tương ứng.

- [`@ToString`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/ToString.java): Thêm vào **lớp**, tự động sinh ra phương thức toString.

- [`@EqualsAndHashCode`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/EqualsAndHashCode.java): Thêm vào **lớp**, tự động sinh ra phương thức equals và hashCode.

- Chú thích `@AllArgsConstructor`, `@RequiredArgsConstructor`, `@NoArgsConstructor`: Thêm vào **lớp**, tự động sinh ra phương thức khởi tạo tương ứng với các tham số.

- [`@Data`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/Data.java): Thêm vào **lớp**, là sự kết hợp của 5 chú thích Lombok.

    * Tự động thêm `@Getter`, `@ToString`, `@EqualsAndHashCode` cho tất cả thuộc tính.
    * Thêm `@Setter` cho thuộc tính không được đánh dấu là `final`.
    * Thêm `@RequiredArgsConstructor` cho thuộc tính được đánh dấu là `final`.

- Chú thích `@Value`: Thêm vào **lớp**, tương tự như `@Data` nhưng tất cả thuộc tính sẽ mặc định được định nghĩa là `private final`, do đó sẽ không sinh ra phương thức set.

- Các chú thích như [`@CommonsLog`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/extern/apachecommons/CommonsLog.java), [`@Flogger`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/extern/flogger/Flogger.java), [`@Log`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/extern/java/Log.java), [`@JBossLog`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/extern/jbosslog/JBossLog.java), [@Log4j](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/extern/log4j/Log4j.java), [@Log4j2](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/extern/log4j/Log4j2.java), [@Slf4j](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/Slf4j.java), [@Slf4jX](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/Slf4jX.java): Thêm vào **lớp**, tự động thêm hỗ trợ ghi log cho lớp.

- Chú thích `@NonNull`: Thêm vào **tham số phương thức** hoặc **thuộc tính lớp**, tự động sinh kiểm tra giá trị `null`. Nếu giá trị là `null`, nó sẽ ném ra ngoại lệ NullPointerException.

- Chú thích `@Cleanup`: Thêm vào **biến cục bộ** trong phương thức, tự động gọi phương thức `#close()` khi kết thúc phạm vi, để giải phóng tài nguyên, ví dụ khi sử dụng trong thao tác luồng IO của Java.

- Chú thích `@Builder`: Thêm vào **lớp**, tạo ra một lớp nội bộ theo mô hình Builder cho lớp đó.

- Chú thích `@Synchronized`: Thêm vào **phương thức**, để thêm khóa đồng bộ.

- Chú thích `@SneakyThrows`: Thêm vào **phương thức**, để thêm khối mã `try catch`.

- Chú thích `@Accessors`: Thêm vào **phương thức** hoặc **thuộc tính**, và thiết lập `chain = true`, để thực hiện lập trình theo chuỗi.

Dưới đây, chúng ta sẽ sử dụng các chú thích phổ biến `@Data`, `@Slf4j`, và `@NonNull` trong dự án ví dụ Spring Boot.

## 6. Chú thích @Data

Chú thích [`@Data`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/Data.java) thêm vào **lớp**, là sự kết hợp của 5 chú thích Lombok.

* Tự động thêm `@Getter`, `@ToString`, `@EqualsAndHashCode` cho tất cả thuộc tính.
* Thêm `@Setter` cho thuộc tính không được đánh dấu là `final`.
* Thêm `@RequiredArgsConstructor` cho thuộc tính được đánh dấu là `final`.

Tạo lớp ví dụ [UserDO01](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-49/lab-49-lombok-demo/src/main/java/cn/iocoder/springboot/lab49/lombokdemo/dataobject/UserDO01.java) để minh họa việc sử dụng chú thích `@Data`. Như hình dưới đây:  
![@Data 示例](https://static.iocoder.cn/images/Spring-Boot/2019-02-04/11.png)

> Ghi chú: Các lớp được sinh ra cần biên dịch lại dự án một cách thủ công để thấy các lớp tương ứng, sau đó tiến hành phân tích ngược.

Tuy nhiên, cần lưu ý rằng nếu lớp sử dụng chú thích `@Data` kế thừa các thuộc tính từ lớp cha khác, thì nên thêm các chú thích `@ToString(callSuper = true)` và `@EqualsAndHashCode(callSuper = true)`.

* Bởi vì theo mặc định, chú thích `@Data` sẽ không xử lý các thuộc tính của lớp cha. Do đó, chúng ta cần sử dụng thuộc tính `callSuper = true` để chỉ định cần gọi các phương thức tương ứng từ lớp cha.
* Tình huống này rất phổ biến, chẳng hạn như trong các lớp thực thể, chúng ta có thể khai báo một lớp cha trừu tượng `AbstractEntity`, và lớp này có một thuộc tính `id`.
# 7. @Slf4j Annotation

[`@Slf4j`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/Slf4j.java) là một chú thích được thêm vào **lớp** nhằm tạo ra một thuộc tính Logger **tĩnh** cho Slf4j trong lớp đó.

Ví dụ về lớp [UserService](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-49/lab-49-lombok-demo/src/main/java/cn/iocoder/springboot/lab49/lombokdemo/service/UserService.java) được tạo ra để minh họa việc sử dụng chú thích `@Slf4j`. Như hình bên dưới: ![@Slf4j Ví dụ](https://static.iocoder.cn/images/Spring-Boot/2019-02-04/21.png)

Lombok cũng cung cấp các chú thích khác như [`@CommonsLog`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/extern/apachecommons/CommonsLog.java), [`@Flogger`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/extern/flogger/Flogger.java), [`@Log`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/extern/java/Log.java), [`@JBossLog`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/extern/jbosslog/JBossLog.java), [`@Log4j`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/extern/log4j/Log4j.java), [`@Log4j2`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/extern/log4j/Log4j2.java), và [`@Slf4jX`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/Slf4jX.java), hỗ trợ các thành phần Logger khác nhau. Vì Spring Boot sử dụng framework façade ghi log Slf4j, nên trong hầu hết các trường hợp, chúng ta đều sử dụng chú thích `@Slf4j`.

> **Lời nhắc hữu ích:** Nếu bạn quan tâm đến việc sử dụng các thành phần ghi log trong Spring Boot, bạn có thể đọc bài viết [“Giới thiệu về Tích hợp Ghi log trong Spring Boot”](http://www.iocoder.cn/Spring-Boot/Logging/?self).

# 8. @NonNull Annotation

Chú thích [`@NonNull`](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/NonNull.java) được thêm vào **tham số phương thức** hoặc **thuộc tính lớp** để tự động sinh ra kiểm tra tham số `null`. Nếu giá trị là `null`, một ngoại lệ `NullPointerException` sẽ được ném ra.

Ví dụ về lớp [UserService01](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-49/lab-49-lombok-demo/src/main/java/cn/iocoder/springboot/lab49/lombokdemo/service/UserService01.java) được tạo ra để minh họa việc sử dụng chú thích `@NonNull`. Như hình bên dưới: ![@NonNull Ví dụ](https://static.iocoder.cn/images/Spring-Boot/2019-02-04/41.png)

# 666. Tổng kết

Đến đây, chúng ta đã hoàn thành việc học về Lombok. Nếu bạn chưa sử dụng nó trong dự án của mình, hãy xem xét việc thử nghiệm. Hehe, tôi thấy rằng Lombok đã được sử dụng trong hơn 370.000 dự án mã nguồn mở trên GitHub. Như hình bên dưới: ![Kho lưu trữ Lombok](https://static.iocoder.cn/images/Spring-Boot/2019-02-04/31.png)
