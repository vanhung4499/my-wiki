---
title: Validation
tags:
  - java
  - spring-boot
categories:
  - spring-boot
order: 11
---
# Spring Boot Validation

- - -

> Bài viết này cung cấp mã nguồn đầy đủ, có thể xem tại [https://github.com/YunaiV/SpringBoot-Labs](https://github.com/YunaiV/SpringBoot-Labs) trong thư mục [lab-22](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22).
> 
> Việc viết nội dung gốc không hề dễ dàng, hãy cho mình một [Star](https://github.com/YunaiV/SpringBoot-Labs/stargazers) nhé, cùng nhau phát triển nào!

# 1. Tổng Quan

> Khi nghĩ về tiêu đề, mình đã rất phân vân liệu nên gọi là **kiểm tra dữ liệu** hay **kiểm tra tham số**. 
> 
> Cuối cùng, mình chọn **kiểm tra tham số** vì nó gần gũi hơn với hiểu biết của chúng ta. Thực tế, cách gọi chính xác hơn vẫn là **kiểm tra dữ liệu**.
> 
> Đầu bài, mình đã lảm nhảm một số điều không quan trọng, những ai không thích có thể bỏ qua [「3. Hướng Dẫn Nhanh」](#).

Khi chúng ta muốn cung cấp API đáng tin cậy, việc kiểm tra các tham số là **không thể thiếu** để đảm bảo rằng dữ liệu cuối cùng được nhập vào cơ sở dữ liệu là chính xác. Ví dụ, khi người dùng đăng ký, hệ thống sẽ kiểm tra tính hợp lệ của số điện thoại và đảm bảo mật khẩu không phải là mật khẩu yếu.

Thật tiếc, khi mở dự án của mình ra, ta sẽ phát hiện ra rằng có rất nhiều API mà chúng ta không thêm kiểm tra tham số tương ứng, mà để việc này cho phía gọi (chẳng hạn như phía frontend) hoàn thành. 😈 Thậm chí, trong các dự án phát triển backend mà mình đã tham gia, có người còn cho rằng đây là việc của frontend, thật đáng tiếc!

Thế giới không an toàn như chúng ta tưởng, có thể sẽ có "hacker" vượt qua trình duyệt, trực tiếp sử dụng công cụ HTTP, mô phỏng yêu cầu gửi các tham số không hợp lệ tới API backend để đạt được mục đích "không thể tiết lộ" của họ.

Hoặc là có thể, một lập trình viên frontend vô tình quên thực hiện một số kiểm tra tham số khi gọi API, dẫn đến việc người dùng gửi một lượng lớn dữ liệu không chính xác tới API backend, và những dữ liệu này **được** lưu vào cơ sở dữ liệu. Khi đó, bạn sẽ đổ lỗi cho lập trình viên frontend, hay sẽ chửi bới cô kiểm thử vì không làm tốt công việc của mình?

Mình tin rằng, nhiều khi không phải là chúng ta không muốn thêm kiểm tra, mà là không có một cách thống nhất và thuận tiện để nhanh chóng thêm chức năng kiểm tra tham số. Dù sao, so với các thao tác CRUD nhàm chán, việc này còn nhàm chán hơn. Ví dụ, chỉ cần nói đến API đăng ký người dùng, kiểm tra số điện thoại và mật khẩu hai tham số này có thể tiêu tốn của bạn đến gần 10 dòng mã. Chưa kể đến, các API trong quản lý backend tạo sản phẩm có rất nhiều tham số.

😈 Hầu hết các khó khăn mà chúng ta gặp phải trên thế giới đều đã có giải pháp, đặc biệt là trong phát triển phần mềm. Thực tế, Java đã đưa ra tiêu chuẩn [Bean Validation](https://beanvalidation.org/specification/) từ năm 2009 và đã trải qua ba lần chuẩn hóa JSR303, JSR349, JSR380, phát triển lên phiên bản **2.0**.

> FROM [https://beanvalidation.org/specification/](https://beanvalidation.org/specification/)
> 
> **Bean Validation 1.0** ：Bean Validation 1.0 (JSR [303](https://www.jcp.org/en/jsr/detail?id=303)) was the first version of Java's standard for object validation. It was released in 2009 and is part of Java EE 6. You can learn more about Bean Validation 1.0 [here](https://beanvalidation.org/1.0/) (specification text, API docs etc).
> 
> **Bean Validation 1.1** ：Bean Validation 1.1 ([JSR 349](https://www.jcp.org/en/jsr/detail?id=349)) was finished in 2013 and is part of Java EE 7. Its main contributions are method-level validation, integration with CDI, group conversion and some more. You can learn more about Bean Validation 1.1 [here](https://beanvalidation.org/1.1/) (specification text, full change log, API docs etc).
> 
> **Bean Validation 2.0** ：Bean Validation 2.0 ([JSR 380](https://www.jcp.org/en/jsr/detail?id=380)) was finished in August 2017.
> 
> It's part of Java EE 8 (but can of course be used with plain Java SE as the previous releases).
> 
> You can learn more about Bean Validation 2.0 [here](https://beanvalidation.org/2.0/) (specification text, full change log, API docs etc).

Bean Validation và JPA mà chúng ta đã học trước đây đều giống nhau ở chỗ chỉ cung cấp các tiêu chuẩn mà không cung cấp các triển khai cụ thể.

> **Note**: Đối với những ai chưa biết về JPA, có thể tham khảo bài viết [Spring Boot JPA](./jpa).

* Trong [Bean Validation API](https://mvnrepository.com/artifact/javax.validation/validation-api), đã định nghĩa các interface liên quan đến Bean Validation nhưng không có triển khai cụ thể.
* Trong gói [`javax.validation.constraints`](https://github.com/eclipse-ee4j/beanvalidation-api/tree/master/src/main/java/javax/validation/constraints), đã định nghĩa một loạt các chú thích kiểm tra. Ví dụ như, [`@NotNull`](https://github.com/eclipse-ee4j/beanvalidation-api/blob/master/src/main/java/javax/validation/constraints/NotNull.java), [`@NotEmpty`](https://github.com/eclipse-ee4j/beanvalidation-api/blob/master/src/main/java/javax/validation/constraints/NotEmpty.java).

Các framework chính để thực hiện tiêu chuẩn kiểm tra dữ liệu Bean Validation bao gồm:

* **[Hibernate Validator](https://hibernate.org/validator/)**

    > Đừng nghĩ rằng Hibernate chỉ là một framework ORM; đó chỉ là những gì [Hibernate ORM](https://hibernate.org/orm) cung cấp.
    > 
    > Hibernate thực sự mang slogan “Everything data”, nó còn cung cấp các giải pháp như [Hibernate Search](https://hibernate.org/) và [Hibernate OGM](https://hibernate.org/ogm) nữa. 😈
    > 
    > Vậy nên, bạn gái cũng là dữ liệu, chỉ cần `new` một cái là đủ, không cần phải tìm kiếm.

**Trong hầu hết các trường hợp, có lẽ là 99.99%, chúng ta sẽ sử dụng Hibernate Validator.**

Tuy nhiên, trong các dự án sử dụng Spring, do [Spring Validation](https://github.com/spring-projects/spring-framework/tree/master/spring-context/src/main/java/org/springframework/validation) cung cấp hỗ trợ đóng gói sẵn cho Bean Validation, nên chúng ta có thể sử dụng chú thích [`@Validated`](https://github.com/spring-projects/spring-framework/blob/master/spring-context/src/main/java/org/springframework/validation/annotation/Validated.java) để thực hiện **kiểm tra khai báo** mà không cần gọi trực tiếp các phương thức API do Bean Validation cung cấp. Về nguyên lý thực hiện, điều này cũng dựa trên việc chặn AOP của Spring để thực hiện các thao tác liên quan đến kiểm tra.

> **Lưu ý:** Điều này tương tự như Spring Transaction, thông qua chú thích `@Transactional` để thực hiện giao dịch khai báo.

Cuối cùng, trong Spring Validation, vẫn gọi các framework thực hiện Bean Validation khác nhau, ví dụ như Hibernate Validator.

Bây giờ, hãy cùng nhau khám phá cách thực hiện kiểm tra tham số trong Spring Boot.

# 2\. Chú Thích

Trước khi bắt đầu, hãy cùng tìm hiểu về các chú thích mà bài viết này sẽ đề cập đến.

## 2.1 Chú Thích Ràng Buộc Được Định Nghĩa Bởi Bean Validation

Trong gói [`javax.validation.constraints`](https://github.com/eclipse-ee4j/beanvalidation-api/tree/master/src/main/java/javax/validation/constraints), có một loạt các chú thích ràng buộc (constraint annotations) được định nghĩa. Dưới đây là danh sách nhanh chóng:

> Tham khảo bài viết [《JSR 303 - Giới Thiệu và Thực Hành Tốt Nhất Về Bean Validation》](https://www.ibm.com/developerworks/cn/java/j-lo-jsr303/index.html).

Tổng cộng có 22 chú thích, chúng ta sẽ điểm qua nhanh.

### Kiểm Tra Rỗng và Không Rỗng

* `@NotBlank`: Chỉ áp dụng cho chuỗi không được là `null` và chiều dài của chuỗi sau khi gọi `#trim()` phải lớn hơn 0.
* `@NotEmpty`: Số lượng phần tử của tập hợp không được là 0, tức là tập hợp không rỗng. Cũng có thể áp dụng cho chuỗi không được là `null`.
* `@NotNull`: Không được là `null`.
* `@Null`: Phải là `null`.

### Kiểm Tra Số

* `@DecimalMax(value)`: Phần tử được chú thích phải là một số và giá trị của nó phải nhỏ hơn hoặc bằng giá trị tối đa chỉ định.
* `@DecimalMin(value)`: Phần tử được chú thích phải là một số và giá trị của nó phải lớn hơn hoặc bằng giá trị tối thiểu chỉ định.
* `@Digits(integer, fraction)`: Phần tử được chú thích phải là một số và giá trị của nó phải trong phạm vi chấp nhận.
* `@Positive`: Kiểm tra số dương.
* `@PositiveOrZero`: Kiểm tra số dương hoặc 0.
* `@Max(value)`: Giá trị của trường này chỉ được nhỏ hơn hoặc bằng giá trị chỉ định.
* `@Min(value)`: Giá trị của trường này chỉ được lớn hơn hoặc bằng giá trị chỉ định.
* `@Negative`: Kiểm tra số âm.
* `@NegativeOrZero`: Kiểm tra số âm hoặc 0.

### Kiểm Tra Giá Trị Boolean

* `@AssertFalse`: Phần tử được chú thích phải là `true`.
* `@AssertTrue`: Phần tử được chú thích phải là `false`.

### Kiểm Tra Độ Dài

* `@Size(max, min)`: Kiểm tra kích thước của trường này có nằm trong khoảng giữa `min` và `max` hay không, có thể áp dụng cho chuỗi, mảng, tập hợp, Map, v.v.

### Kiểm Tra Ngày

* `@Future`: Phần tử được chú thích phải là một ngày trong tương lai.
* `@FutureOrPresent`: Kiểm tra ngày có phải là ngày trong tương lai hoặc hiện tại không.
* `@Past`: Kiểm tra ngày của trường này có phải là ngày trong quá khứ không.
* `@PastOrPresent`: Kiểm tra ngày có phải là ngày trong quá khứ hoặc hiện tại không.

### Kiểm Tra Khác

* `@Email`: Phần tử được chú thích phải là một địa chỉ email hợp lệ.
* `@Pattern(value)`: Phần tử được chú thích phải phù hợp với biểu thức chính quy chỉ định.

## 2.2 Các Chú Thích Ràng Buộc Bổ Sung Từ Hibernate Validator

Trong gói [`org.hibernate.validator.constraints`](https://github.com/hibernate/hibernate-validator/tree/master/engine/src/main/java/org/hibernate/validator/constraints), có một loạt các chú thích ràng buộc (constraint annotations) bổ sung được định nghĩa. Dưới đây là một số chú thích quan trọng:

* `@Range(min=, max=)`: Phần tử được chú thích phải nằm trong một phạm vi hợp lý.
* `@Length(min=, max=)`: Kích thước của chuỗi được chú thích phải nằm trong phạm vi chỉ định.
* `@URL(protocol=,host=,port=,regexp=,flags=)`: Chuỗi được chú thích phải là một URL hợp lệ.
* `@SafeHtml`: Kiểm tra xem HTML gửi lên có an toàn không, ví dụ như không được chứa script JavaScript.
* ... và nhiều chú thích khác nữa.

## 2.3 @Valid và @Validated

Chú thích [`@Valid`](https://docs.oracle.com/javaee/7/api/javax/validation/Valid.html) được định nghĩa bởi Bean Validation, có thể được thêm vào các phương thức thông thường, phương thức khởi tạo, tham số phương thức, giá trị trả về và biến thành viên, cho biết rằng chúng cần được kiểm tra ràng buộc.

Chú thích [`@Validated`](https://github.com/spring-projects/spring-framework/blob/master/spring-context/src/main/java/org/springframework/validation/annotation/Validated.java) được định nghĩa bởi Spring Validation, có thể được thêm vào lớp, tham số phương thức và phương thức thông thường, cho biết rằng chúng cần được kiểm tra ràng buộc. Đồng thời, `@Validated` có thuộc tính `value`, hỗ trợ kiểm tra theo nhóm. Các thuộc tính như sau:

```java
// Validated.java
Class<?>[] value() default {};
```

Đối với những bạn mới học, rất dễ bị nhầm lẫn giữa chú thích `@Valid` và `@Validated`.

**① Kiểm Tra Khai Báo**

Spring Validation **chỉ** sử dụng chú thích `@Validated` để thực hiện kiểm tra khai báo.

**② Kiểm Tra Theo Nhóm**

Chú thích `@Valid` do Bean Validation cung cấp không có thuộc tính kiểm tra theo nhóm, vì vậy không thể cung cấp kiểm tra theo nhóm. Trong trường hợp này, chỉ có thể sử dụng chú thích `@Validated`.

**③ Kiểm Tra Lồng Nhau**

Chú thích `@Valid` có thêm khả năng kiểm tra thành viên biến. Điều này có nghĩa là, khi có các đối tượng lồng nhau, chỉ có thể sử dụng chú thích `@Valid`. Ví dụ:

```java
// User.java
public class User {  
    private String id;  
  
    @Valid  
    private UserProfile profile;  
}  
  
// UserProfile.java  
public class UserProfile {  
    @NotBlank  
    private String nickname;  
}  
```

* Nếu không thêm chú thích `@Valid` vào thuộc tính `User.profile`, thì thuộc tính `UserProfile.nickname` sẽ không được kiểm tra.

Chú thích `@Valid` cũng có thể được sử dụng cho các phương thức khởi tạo và giá trị trả về. Do đó, trong những trường hợp cần thiết, chỉ có thể sử dụng chú thích `@Valid`.

**🔥 Tóm Tắt**

Trong hầu hết các trường hợp, chúng ta có thể sử dụng chú thích `@Validated`.

Trong trường hợp kiểm tra lồng nhau, chúng ta sẽ sử dụng chú thích `@Valid` cho các thuộc tính thành viên.

# 3. Quick Start

> Mã ví dụ tương ứng với kho lưu trữ: [lab-22-validation-01](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01).

Trong phần này, chúng ta sẽ thực hiện việc kiểm tra tham số của API trong Controller của SpringMVC trong Spring Boot.

Ngoài ra, vì chúng ta cũng sẽ cần kiểm tra tham số trong Service, nên chúng tôi sẽ cung cấp ví dụ cho điều đó.

## 3.1 Nhập phụ thuộc

Trong tệp [`pom.xml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/pom.xml), chúng ta sẽ thêm các thư viện cần thiết cho dự án.

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0"  
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">  
    <parent>  
        <groupId>org.springframework.boot</groupId>  
        <artifactId>spring-boot-starter-parent</artifactId>  
        <version>2.1.3.RELEASE</version>  
        <relativePath/> <!-- lookup parent from repository -->  
    </parent>  
    <modelVersion>4.0.0</modelVersion>  
  
    <artifactId>lab-22-validation-01</artifactId>  
  
    <dependencies>  
        <!-- Thực hiện cấu hình tự động cho Spring MVC -->  
        <dependency>  
            <groupId>org.springframework.boot</groupId>  
            <artifactId>spring-boot-starter-web</artifactId>  
        </dependency>  
  
        <!-- Đảm bảo các gói liên quan đến Spring AOP -->  
        <dependency>  
            <groupId>org.springframework</groupId>  
            <artifactId>spring-aspects</artifactId>  
        </dependency>  
  
        <!-- Thuận tiện cho việc viết kiểm thử đơn vị sau này -->  
        <dependency>  
            <groupId>org.springframework.boot</groupId>  
            <artifactId>spring-boot-starter-test</artifactId>  
            <scope>test</scope>  
        </dependency>  
    </dependencies>  
</project>  
```

- Bạn nên xem kỹ các chú thích mà tác giả đã thêm để hiểu rõ chức năng của từng thư viện.
- Thư viện [`spring-boot-starter-web`](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web) đã tự động nhập thư viện [`hibernate-validator`](https://mvnrepository.com/artifact/org.hibernate.validator/hibernate-validator), vì vậy ví dụ này sử dụng Hibernate Validator như là khung thực hiện cho Bean Validation.

Trong hệ thống Spring Boot, cũng có thư viện [`spring-boot-starter-validation`](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-validation). Tuy nhiên, trong ví dụ này, chúng ta không nhập thư viện đó. Tại sao? Vì thư viện này chủ yếu cũng chỉ để nhập thư viện `hibernate-validator`, mà thư viện này đã được nhập trong `spring-boot-starter-web`, nên không cần phải nhập lại.
## 3.2 Application

Tạo lớp [`Application.java`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/Application.java) và cấu hình chú thích `@SpringBootApplication`. Mã nguồn như sau:

```java
@SpringBootApplication  
@EnableAspectJAutoProxy(exposeProxy = true) // http://www.voidcn.com/article/p-zddcuyii-bpt.html  
public class Application {  
  
    public static void main(String[] args) {  
        SpringApplication.run(Application.class, args);  
    }  
}  
```

- Chúng ta thêm chú thích `@EnableAspectJAutoProxy`, với tham số `exposeProxy = true`, để Spring AOP có thể thiết lập đối tượng proxy hiện tại vào [AopContext](https://github.com/spring-projects/spring-framework/blob/master/spring-aop/src/main/java/org/springframework/aop/framework/AopContext.java). Chúng ta sẽ thấy công dụng của nó trong các phần sau. Nếu bạn muốn tìm hiểu trước, có thể tham khảo bài viết [《Spring AOP 通过获取代理对象实现事务切换》](http://www.voidcn.com/article/p-zddcuyii-bpt.html).

Hiện tại chưa khởi động dự án. Hãy chờ cho đến khi chúng ta thêm Controller.

## 3.3 UserAddDTO

Trong thư mục [`cn.iocoder.springboot.lab22.validation.dto`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/dto), tạo lớp [UserAddDTO](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/dto/UserAddDTO.java) để thêm thông tin người dùng. Mã nguồn như sau:

```java
// UserAddDTO.java  

public class UserAddDTO {  
  
    /**  
     * Tài khoản  
     */  
    @NotEmpty(message = "Tài khoản không được để trống")  
    @Length(min = 5, max = 16, message = "Độ dài tài khoản phải từ 5-16 ký tự")  
    @Pattern(regexp = "^[A-Za-z0-9]+$", message = "Định dạng tài khoản chỉ chứa số và chữ cái")  
    private String username;  

    /**  
     * Mật khẩu  
     */  
    @NotEmpty(message = "Mật khẩu không được để trống")  
    @Length(min = 4, max = 16, message = "Độ dài mật khẩu phải từ 4-16 ký tự")  
    private String password;  
      
    // ... Bỏ qua phương thức setter/getter  
}  
```

Mỗi trường dữ liệu có các chú thích ràng buộc, bạn nên chú ý để hiểu rõ cách hoạt động của chúng.
## 3.4 UserController

Trong thư mục [`cn.iocoder.springboot.lab22.validation.controller`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/controller), tạo lớp [UserController](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/controller/UserController.java) để cung cấp API cho người dùng. Mã nguồn như sau:

```java
// UserController.java  

@RestController  
@RequestMapping("/users")  
@Validated  
public class UserController {  
  
    private Logger logger = LoggerFactory.getLogger(getClass());  
  
    @GetMapping("/get")  
    public void get(@RequestParam("id") @Min(value = 1L, message = "Mã số phải lớn hơn 0") Integer id) {  
        logger.info("[get][id: {}]", id);  
    }  
  
    @PostMapping("/add")  
    public void add(@Valid UserAddDTO addDTO) {  
        logger.info("[add][addDTO: {}]", addDTO);  
    }  
}  
```

- Trong lớp này, chúng ta thêm chú thích `@Validated`, cho biết rằng tất cả các API của `UserController` đều cần thực hiện kiểm tra tham số.

- Đối với phương thức `#get(id)`, chúng ta đã thêm chú thích `@Min` cho tham số `id`, yêu cầu rằng `id` phải lớn hơn 0. Nếu kiểm tra không thành công, ví dụ lỗi sẽ như hình sau:  
![Không qua ví dụ 1](https://static.iocoder.cn/images/Spring-Boot/2019-11-19/01.jpg)

- Đối với phương thức `#add(addDTO)`, chúng ta đã thêm chú thích `@Valid` cho tham số `addDTO`, để thực hiện kiểm tra tham số này. Nếu kiểm tra không thành công, ví dụ lỗi sẽ như hình sau:  
![Không qua ví dụ 2](https://static.iocoder.cn/images/Spring-Boot/2019-11-19/02.jpg)

    - Trường `errors` chứa **mảng** chi tiết lỗi tham số. Mỗi phần tử trong mảng tương ứng với một chi tiết lỗi tham số. Ở đây, `username` vi phạm độ dài không thoả mãn `[5, 16]`.

Chúng ta đã thành công chạy ví dụ, nhưng có một số điểm khác biệt mà chúng ta cần hiểu.

> **Chú thích**: Giải thích có thể hơi dài, nhưng hãy kiên nhẫn nhé.

**Điểm thứ nhất**, tại phương thức `#get(id)`, chúng ta không cần thêm chú thích `@Valid` cho `id`, trong khi phương thức `#add(addDTO)` thì có. Tại sao lại có sự khác biệt này?

Vì `UserController` đã sử dụng chú thích `@Validated`, Spring Validation sẽ sử dụng AOP để cắt lớp và kiểm tra tham số. Bộ lọc cắt lớp này sử dụng [MethodValidationInterceptor](https://github.com/spring-projects/spring-framework/blob/master/spring-context/src/main/java/org/springframework/validation/beanvalidation/MethodValidationInterceptor.java).

- Đối với phương thức `#get(id)`, tham số `id` là **phẳng**, vì vậy không cần thêm chú thích `@Valid`.
- Đối với phương thức `#add(addDTO)`, tham số `addDTO` thực sự giống như **kiểm tra lồng nhau**, vì các tham số cần kiểm tra đều nằm trong `addDTO`, do đó cần thêm chú thích `@Valid`.

**Điểm thứ hai**, kết quả trả về của phương thức `#get(id)` là `status = 500`, trong khi phương thức `#add(addDTO)` là `status = 400`.

- Đối với phương thức `#get(id)`, trong bộ lọc MethodValidationInterceptor, khi phát hiện tham số không chính xác, sẽ ném ra ngoại lệ [ConstraintViolationException](https://github.com/eclipse-ee4j/beanvalidation-api/blob/master/src/main/java/javax/validation/ConstraintViolationException.java).
- Đối với phương thức `#add(addDTO)`, vì `addDTO` là một đối tượng POJO, nó sẽ đi qua cơ chế [DataBinder](https://docs.spring.io/spring/docs/3.2.x/spring-framework-reference/html/validation.html#validation-binder) của SpringMVC, gọi phương thức `DataBinder#validate(Object... validationHints)` để thực hiện kiểm tra. Khi kiểm tra không thành công, sẽ ném ra ngoại lệ [BindException](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/validation/BindException.html).

Trong SpringMVC, mặc định sử dụng [DefaultHandlerExceptionResolver](https://hyrepo.com/tech/spring-mvc-error-handling/) để xử lý ngoại lệ.

- Đối với ngoại lệ `BindException`, nó sẽ được xử lý thành mã trạng thái 400.
- Đối với ngoại lệ `ConstraintViolationException`, không có xử lý đặc biệt, vì vậy sẽ xử lý thành mã trạng thái 500.

Chúng ta hãy đặt một câu hỏi: Nếu phương thức `#add(addDTO)` có tham số chính xác, sau khi hoàn tất kiểm tra tham số trong DataBinder, có phải sẽ kiểm tra một lần nữa thông qua bộ lọc MethodValidationInterceptor không? Hãy suy nghĩ trong 100 mili giây...

Câu trả lời là có. Điều này sẽ dẫn đến lãng phí tài nguyên. Do đó, nếu trong lớp Controller chỉ có các phương thức kiểm tra lồng nhau như `#add(addDTO)`, thì tôi có thể không thêm chú thích `@Validated` vào lớp Controller. Như vậy, chỉ sử dụng DataBinder để kiểm tra tham số.

**Điểm thứ ba**, cho dù là phương thức `#get(id)` hay `#add(addDTO)`, thông báo trả về đều rất không thân thiện, vậy chúng ta nên làm gì?

Có thể tham khảo [《芋道 Spring Boot SpringMVC 入门》](http://www.iocoder.cn/Spring-Boot/SpringMVC/?self) về [「5. 全局异常处理」](#) để sử dụng chú thích `@ExceptionHandler`, thực hiện xử lý ngoại lệ tùy chỉnh. Chúng ta sẽ cung cấp ví dụ cụ thể trong phần [4\. Xử lý ngoại lệ kiểm tra](#) của bài viết này.
## 3.5 UserService

So với việc thêm kiểm tra tham số trong Controller, việc thực hiện kiểm tra tham số trong Service sẽ an toàn và đáng tin cậy hơn. Theo ý kiến cá nhân của tôi, kiểm tra tham số trong Controller có thể không cần thiết, **nhưng kiểm tra tham số trong Service thì nhất định phải có**.

Trong thư mục [`cn.iocoder.springboot.lab22.validation.service`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/service), tạo lớp [UserService](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/service/UserService.java) để cung cấp logic Service cho người dùng. Mã nguồn như sau:

```java
// UserService.java  

@Service  
@Validated  
public class UserService {  
  
    private Logger logger = LoggerFactory.getLogger(getClass());  
  
    public void get(@Min(value = 1L, message = "Mã số phải lớn hơn 0") Integer id) {  
        logger.info("[get][id: {}]", id);  
    }  
  
    public void add(@Valid UserAddDTO addDTO) {  
        logger.info("[add][addDTO: {}]", addDTO);  
    }  
  
    public void add01(UserAddDTO addDTO) {  
        this.add(addDTO);  
    }  
  
    public void add02(UserAddDTO addDTO) {  
        self().add(addDTO);  
    }  
  
    private UserService self() {  
        return (UserService) AopContext.currentProxy();  
    }  
}  
```

- Phương thức trong lớp này giống như trong `UserController`, bao gồm các chú thích tương tự.
- Chúng ta thêm các phương thức `#add01(addDTO)` và `#add02(addDTO)` để minh họa cho việc gọi phương thức bên trong.

Tạo lớp kiểm thử [UserServiceTest](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/test/java/cn/iocoder/springboot/lab22/validation/service/UserServiceTest.java) để kiểm tra từng thao tác đơn giản của `UserService`. Mã nguồn như sau:

```java
// UserServiceTest.java  

@RunWith(SpringRunner.class)  
@SpringBootTest(classes = Application.class)  
public class UserServiceTest {  
  
    @Autowired  
    private UserService userService;  
  
    @Test  
    public void testGet() {  
        userService.get(-1);  
    }  
  
    @Test  
    public void testAdd() {  
        UserAddDTO addDTO = new UserAddDTO();  
        userService.add(addDTO);  
    }  
  
    @Test  
    public void testAdd01() {  
        UserAddDTO addDTO = new UserAddDTO();  
        userService.add01(addDTO);  
    }  
  
    @Test  
    public void testAdd02() {  
        UserAddDTO addDTO = new UserAddDTO();  
        userService.add02(addDTO);  
    }  
}  
```

**① Phương thức `#testGet()`**

Khi thực hiện, sẽ ném ra ngoại lệ `ConstraintViolationException`. Nhật ký như sau:

```
javax.validation.ConstraintViolationException: get.id: Mã số phải lớn hơn 0  
  
	at org.springframework.validation.beanvalidation.MethodValidationInterceptor.invoke(MethodValidationInterceptor.java:116)  
```

- Kết quả này như mong đợi.

**② Phương thức `#testAdd()`**

Khi thực hiện, sẽ ném ra ngoại lệ `ConstraintViolationException`. Nhật ký như sau:

```
javax.validation.ConstraintViolationException: add.addDTO.username: Tài khoản không được để trống, add.addDTO.password: Mật khẩu không được để trống  
  
	at org.springframework.validation.beanvalidation.MethodValidationInterceptor.invoke(MethodValidationInterceptor.java:116)  
```

- Kết quả này cũng như mong đợi. Khác với việc gọi phương thức `UserController#add(addDTO)`, ở đây được bộ lọc MethodValidationInterceptor chặn lại để kiểm tra tham số, thay vì cơ chế DataBinder.

**③ Phương thức `#testAdd01()`**

Khi thực hiện, sẽ kết thúc bình thường. Bởi vì khi gọi `this.add(addDTO)`, `this` không phải là đối tượng proxy của Spring AOP, nên sẽ không bị bộ lọc MethodValidationInterceptor chặn lại.

**④ Phương thức `#testAdd02()`**

Khi thực hiện, sẽ ném ra ngoại lệ `IllegalStateException`. Nhật ký như sau:

```
java.lang.IllegalStateException: Không thể tìm thấy proxy hiện tại: Đặt thuộc tính 'exposeProxy' của Advised thành 'true' để làm cho nó khả dụng.  
  
	at org.springframework.aop.framework.AopContext.currentProxy(AopContext.java:69)  
```

- Theo lý thuyết, vì chúng ta đã cấu hình chú thích `@EnableAspectJAutoProxy(exposeProxy = true)`, trong khi AOP của Spring chặn, thông qua việc gọi phương thức `AopContext.currentProxy()`, chúng ta có thể lấy được đối tượng proxy hiện tại. Tuy nhiên, ở đây ném ra ngoại lệ `IllegalStateException`.
- Rõ ràng, ở đây không có đối tượng proxy hiện tại được thiết lập trong AopContext, vì vậy ném ra ngoại lệ `IllegalStateException`. Hiện tại, tôi nghi ngờ đây có thể là một BUG. 😈 Tạm thời tôi không có tâm trạng để debug, hehe.

# 4. Xử lý ngoại lệ xác thực

> Mã mẫu tương ứng với kho lưu trữ: [lab-22-validation-01](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01).

Trong phần [「3. Hướng dẫn nhanh」](#), chúng ta có thể thấy rằng nếu trực tiếp trả về kết quả xác thực cho phía trước, khả năng đọc hiểu của nội dung thông báo sẽ khá kém, vì vậy chúng ta cần xử lý các ngoại lệ phát sinh từ việc xác thực.

Trong phần [「5. Xử lý ngoại lệ toàn cục」](http://www.iocoder.cn/Spring-Boot/SpringMVC/?self) của [《Hướng dẫn Spring Boot SpringMVC》](#), chúng ta đã sử dụng chú thích `@ExceptionHandler` để thực hiện việc xử lý ngoại lệ tùy chỉnh. Do đó, trong phần này, chúng ta sẽ tiếp tục xử lý ngoại lệ xác thực trong ví dụ [lab-22-validation-01](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01) ở phần [「3. Hướng dẫn nhanh」](#).

## 4.1 Sao chép và dán

Đầu tiên, chúng ta sẽ sao chép tất cả các lớp cần thiết từ phần [「5. Xử lý ngoại lệ toàn cục」](http://www.iocoder.cn/Spring-Boot/SpringMVC/?self) của [《Hướng dẫn Spring Boot SpringMVC》](#).

*   Trong gói [`cn.iocoder.springboot.lab22.validation.constants`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/constants), sao chép lớp [ServiceExceptionEnum](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/constants/ServiceExceptionEnum.java).
*   Trong gói [`cn.iocoder.springboot.lab22.validation.core.exception`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/exception), sao chép lớp [ServiceException](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/exception/ServiceException.java).
*   Trong gói [`cn.iocoder.springboot.lab22.validation.core.vo`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/vo), sao chép lớp [CommonResult](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/vo/CommonResult.java).
*   Trong gói [`cn.iocoder.springboot.lab22.validation.core.web`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/web), sao chép các lớp [GlobalExceptionHandler](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/web/GlobalExceptionHandler.java) và [GlobalResponseBodyHandler](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/web/GlobalResponseBodyHandler.java).

## 4.2 ServiceExceptionEnum

Chỉnh sửa lớp liệt kê [ServiceExceptionEnum](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/constants/ServiceExceptionEnum.java) để thêm mã lỗi cho các tham số xác thực không hợp lệ. Mã như sau:

```java
// ServiceExceptionEnum.java

INVALID_REQUEST_PARAM_ERROR(2001001002, "Tham số yêu cầu không hợp lệ"),
```
## 4.3 GlobalExceptionHandler

Chỉnh sửa lớp [GlobalExceptionHandler](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/web/GlobalExceptionHandler.java) để thêm phương thức `#constraintViolationExceptionHandler(...)`, xử lý ngoại lệ `ConstraintViolationException`. Mã như sau:

```java
// GlobalExceptionHandler.java

@ResponseBody  
@ExceptionHandler(value = ConstraintViolationException.class)  
public CommonResult constraintViolationExceptionHandler(HttpServletRequest req, ConstraintViolationException ex) {  
    logger.debug("[constraintViolationExceptionHandler]", ex);  
    // Ghép lỗi  
    StringBuilder detailMessage = new StringBuilder();  
    for (ConstraintViolation<?> constraintViolation : ex.getConstraintViolations()) {  
        // Sử dụng ; để phân cách nhiều lỗi  
        if (detailMessage.length() > 0) {  
            detailMessage.append(";");  
        }  
        // Ghép nội dung vào trong đó  
        detailMessage.append(constraintViolation.getMessage());  
    }  
    // Đóng gói kết quả CommonResult  
    return CommonResult.error(ServiceExceptionEnum.INVALID_REQUEST_PARAM_ERROR.getCode(),  
            ServiceExceptionEnum.INVALID_REQUEST_PARAM_ERROR.getMessage() + ":" + detailMessage.toString());  
}  
```

*   Ghép các thông báo lỗi của từng ràng buộc lại với nhau, sử dụng `;` để phân cách.
*   Gửi lại yêu cầu đến API tương ứng với `UserController#get(id)`, kết quả phản hồi như sau: ![constraintViolationExceptionHandler](https://static.iocoder.cn/images/Spring-Boot/2019-11-19/03.png)

Tiếp theo, chỉnh sửa lớp [GlobalExceptionHandler](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/web/GlobalExceptionHandler.java) để thêm phương thức `#bindExceptionHandler(...)`, xử lý ngoại lệ `BindException`. Mã như sau:

```java
// GlobalExceptionHandler.java  

@ResponseBody  
@ExceptionHandler(value = BindException.class)  
public CommonResult bindExceptionHandler(HttpServletRequest req, BindException ex) {  
    logger.debug("[bindExceptionHandler]", ex);  
    // Ghép lỗi  
    StringBuilder detailMessage = new StringBuilder();  
    for (ObjectError objectError : ex.getAllErrors()) {  
        // Sử dụng ; để phân cách nhiều lỗi  
        if (detailMessage.length() > 0) {  
            detailMessage.append(";");  
        }  
        // Ghép nội dung vào trong đó  
        detailMessage.append(objectError.getDefaultMessage());  
    }  
    // Đóng gói kết quả CommonResult  
    return CommonResult.error(ServiceExceptionEnum.INVALID_REQUEST_PARAM_ERROR.getCode(),  
            ServiceExceptionEnum.INVALID_REQUEST_PARAM_ERROR.getMessage() + ":" + detailMessage.toString());  
}  
```

*   Ghép các thông báo lỗi của từng ràng buộc lại với nhau, sử dụng `;` để phân cách.
*   Gửi lại yêu cầu đến API tương ứng với `UserController#add(addDTO)`, kết quả phản hồi như sau: ![bindExceptionHandler](https://static.iocoder.cn/images/Spring-Boot/2019-11-19/04.png)
# 5\. Tùy Chỉnh Ràng Buộc

> Mã ví dụ tương ứng với kho lưu trữ: [lab-22-validation-01](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01).

Trong hầu hết các dự án, các ràng buộc được định nghĩa bởi Bean Validation hoặc các ràng buộc bổ sung của Hibernate Validator thường không đáp ứng được các tình huống kinh doanh phức tạp của chúng ta. Do đó, chúng ta cần phải tùy chỉnh ràng buộc.

Việc phát triển ràng buộc tùy chỉnh chỉ cần **hai bước**: 1) viết **chú thích** cho ràng buộc tùy chỉnh; 2) viết **bộ kiểm tra tùy chỉnh** `ConstraintValidator`.

Dưới đây, hãy cùng thực hiện một ràng buộc tùy chỉnh để kiểm tra rằng các tham số phải nằm trong phạm vi của các giá trị enum.

## 5.1 IntArrayValuable

Tại đường dẫn gói [`cn.iocoder.springboot.lab22.validation.core.validator`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/validator), tạo interface `IntArrayValuable` để trả về mảng giá trị. Mã như sau:

```java
// IntArrayValuable.java  

public interface IntArrayValuable {  
  
    /**  
     * @return mảng int  
     */  
    int[] array();  
}  
```

Vì một lớp enum không thể biết chính xác các giá trị của nó, nên chúng ta sẽ yêu cầu lớp enum đó triển khai interface này và trả về tất cả các giá trị enum mà nó có.

## 5.2 GenderEnum

Tại đường dẫn gói [`cn.iocoder.springboot.lab22.validation.constants`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/constants), tạo lớp enum [GenderEnum](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/constants/GenderEnum.java) để đại diện cho giới tính. Mã như sau:

```java
// GenderEnum.java  
  
public enum GenderEnum implements IntArrayValuable {  
  
    MALE(1, "男"),  
    FEMALE(2, "女");  
  
    /**  
     * Mảng giá trị  
     */  
    public static final int[] ARRAYS = Arrays.stream(values()).mapToInt(GenderEnum::getValue).toArray();  
  
    /**  
     * Giá trị giới tính  
     */  
    private final Integer value;  
    /**  
     * Tên giới tính  
     */  
    private final String name;  
  
    GenderEnum(Integer value, String name) {  
        this.value = value;  
        this.name = name;  
    }  
  
    public Integer getValue() {  
        return value;  
    }  
  
    public String getName() {  
        return name;  
    }  
  
    @Override  
    public int[] array() {  
        return ARRAYS;  
    }  
}  
```

*   Triển khai interface `IntArrayValuable`, trả về mảng giá trị `ARRAYS`.
## 5.3 @InEnum

Tại đường dẫn gói [`cn.iocoder.springboot.lab22.validation.core.validator`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/validator), tạo **annotation** [`@InEnum`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/validator/InEnum.java) để định nghĩa ràng buộc tùy chỉnh. Mã như sau:

```java
// InEnum.java  
  
@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})  
@Retention(RetentionPolicy.RUNTIME)  
@Documented  
@Constraint(validatedBy = InEnumValidator.class)  
public @interface InEnum {  
  
    /**  
     * @return Lớp thực hiện interface IntArrayValuable  
     */  
    Class<? extends IntArrayValuable> value();  
  
    /**  
     * @return Nội dung thông báo  
     */  
    String message() default "Phải nằm trong phạm vi được chỉ định {value}";  
  
    /**  
     * @return Nhóm  
     */  
    Class<?>[] groups() default {};  
  
    /**  
     * @return Mảng Payload  
     */  
    Class<? extends Payload>[] payload() default {};  
  
    /**  
     * Định nghĩa nhiều ràng buộc {@code @InEnum} trên cùng một phần tử.  
     */  
    @Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})  
    @Retention(RetentionPolicy.RUNTIME)  
    @Documented  
    @interface List {  
  
        InEnum[] value();  
    }  
}  
```

*   Thêm annotation `@Constraint(validatedBy = InEnumValidator.class)` lên lớp để chỉ định **validator tùy chỉnh** sẽ được sử dụng.
*   Thuộc tính `value()` chỉ định lớp thực hiện interface `IntArrayValuable`. Điều này cho phép chúng ta lấy mảng giá trị cần kiểm tra từ tham số.
*   Thuộc tính `message()` để thiết lập nội dung thông báo. Mặc định là `"Phải nằm trong phạm vi được chỉ định {value}"`.
*   Các thuộc tính khác có thể sao chép và dán mà không cần phải hiểu sâu, vì có thể bỏ qua.
## 5.4 InEnumValidator

Tại đường dẫn gói [`cn.iocoder.springboot.lab22.validation.core.validator`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/validator), tạo **validator** [InEnumValidator](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/core/validator/InEnumValidator.java) cho ràng buộc tùy chỉnh. Mã như sau:

```java
// InEnumValidator.java  
  
public class InEnumValidator implements ConstraintValidator<InEnum, Integer> {  
  
    /**  
     * Mảng giá trị  
     */  
    private Set<Integer> values;  
  
    @Override  
    public void initialize(InEnum annotation) {  
        IntArrayValuable[] values = annotation.value().getEnumConstants();  
        if (values.length == 0) {  
            this.values = Collections.emptySet();  
        } else {  
            this.values = Arrays.stream(values[0].array()).boxed().collect(Collectors.toSet());  
        }  
    }  
  
    @Override  
    public boolean isValid(Integer value, ConstraintValidatorContext context) {  
        // <2.1> Kiểm tra hợp lệ  
        if (values.contains(value)) {  
            return true;  
        }  
        // <2.2.1> Kiểm tra không hợp lệ, tạo thông báo tùy chỉnh (vì giá trị của enum không thể lấy trực tiếp từ annotation)  
        context.disableDefaultConstraintViolation(); // Vô hiệu hóa giá trị mặc định của message  
        context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate()  
                .replaceAll("\\{value}", values.toString())).addConstraintViolation(); // Thêm lại thông báo lỗi tùy chỉnh  
        return false; // <2.2.2>  
    }  
}  
```

### Giải thích mã

1. **Implement ConstraintValidator**: 
    - interface `ConstraintValidator` được triển khai với hai tham số kiểu:
        - Tham số đầu tiên là `A extends Annotation`, dùng để chỉ định annotation tùy chỉnh là `@InEnum`.
        - Tham số thứ hai là `T`, dùng để chỉ định kiểu giá trị tham số là `Integer`.

2. **Initialize Method**:
    - Phương thức `initialize(annotation)` được thực hiện để lấy thuộc tính `values()` từ annotation `@InEnum`.
    - Giá trị này được lưu vào thuộc tính `values` dưới dạng một tập hợp.

3. **isValid Method**:
    - Phương thức `isValid(value, context)` được sử dụng để kiểm tra giá trị tham số có nằm trong mảng giá trị đã xác định hay không.
        - `<2.1>`: Nếu giá trị tham số nằm trong tập hợp `values`, trả về `true`, tức là kiểm tra hợp lệ.
        - `<2.2.1>`: Nếu không hợp lệ, vô hiệu hóa thông báo mặc định và tạo thông báo tùy chỉnh để hiển thị, thay thế `{value}` bằng danh sách các giá trị hợp lệ.
        - `<2.2.2>`: Trả về `false` để chỉ ra rằng kiểm tra không hợp lệ.

Với mã này, bạn đã hoàn thành việc tạo ra một ràng buộc tùy chỉnh cho việc kiểm tra xem một giá trị có nằm trong một tập hợp các giá trị từ enum hay không. Tiếp theo, bạn có thể thực hiện các bài kiểm tra để xác minh tính chính xác của ràng buộc này.
## 5.5 UserUpdateGenderDTO

Tại đường dẫn gói [`cn.iocoder.springboot.lab22.validation.dto`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/dto), tạo lớp [UserUpdateGenderDTO](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/dto/UserUpdateGenderDTO.java) cho việc cập nhật giới tính của người dùng (DTO). Mã như sau:

```java
// UserUpdateGenderDTO.java  
  
public class UserUpdateGenderDTO {  
  
    /**  
     * Mã người dùng  
     */  
    @NotNull(message = "ID người dùng không được để trống")  
    private Integer id;  
  
    /**  
     * Giới tính  
     */  
    @NotNull(message = "Giới tính không được để trống")  
    @InEnum(value = GenderEnum.class, message = "Giới tính phải là {value}")  
    private Integer gender;  
      
    // ... Bỏ qua các phương thức set/get  
}  
```

### Giải thích mã

1. **User ID**:
    - Trường `id` được đánh dấu với annotation `@NotNull`, yêu cầu rằng mã người dùng không được null và nếu null sẽ trả về thông báo "ID người dùng không được để trống".

2. **Giới Tính**:
    - Trường `gender` cũng được đánh dấu với annotation `@NotNull`, yêu cầu rằng giới tính không được null. 
    - Annotation `@InEnum(value = GenderEnum.class, message = "Giới tính phải là {value}")` được sử dụng để đảm bảo rằng giá trị của giới tính phải nằm trong phạm vi các giá trị của `GenderEnum`. Nếu không, thông báo lỗi sẽ trả về với định dạng "Giới tính phải là {value}", trong đó `{value}` sẽ được thay thế bằng các giá trị hợp lệ.

## 5.6 UserController

Tiếp theo, bạn sẽ chỉnh sửa lớp [UserController](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/controller/UserController.java) để thêm API cho việc cập nhật giới tính. Mã như sau:

```java
// UserController.java  
  
@PostMapping("/update_gender")  
public void updateGender(@Valid UserUpdateGenderDTO updateGenderDTO) {  
    logger.info("[updateGender][updateGenderDTO: {}]", updateGenderDTO);  
}  
```

### Giải thích mã

- Phương thức `updateGender` được đánh dấu với annotation `@PostMapping("/update_gender")`, định nghĩa API cho việc cập nhật giới tính.
- Annotation `@Valid` được sử dụng để kích hoạt xác thực cho đối tượng `UserUpdateGenderDTO`. Nếu đối tượng này không hợp lệ (ví dụ: `gender` là null hoặc không nằm trong `GenderEnum`), Spring sẽ tự động trả về một phản hồi lỗi với thông báo thích hợp.

### Kiểm tra

Khi bạn gửi một yêu cầu đến API này với `gender` có giá trị là null, hệ thống sẽ phản hồi với thông báo lỗi tương ứng. Kết quả sẽ giống như hình dưới đây:

![响应结果](https://static.iocoder.cn/images/Spring-Boot/2019-11-19/05.png)

Kết quả cho thấy rằng vì giá trị `gender` không hợp lệ, hệ thống đã trả về thông báo `"Giới tính phải là [1, 2]"`, thông báo này cho biết rằng giới tính phải là một trong các giá trị hợp lệ.

# 6. Kiểm tra theo nhóm

> Mã ví dụ tương ứng với kho lưu trữ: [lab-22-validation-01](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01).

Trong một số tình huống kinh doanh, chúng ta cần sử dụng kiểm tra **theo nhóm**, tức là đối với cùng một đối tượng Bean, dựa trên nhóm kiểm tra mà sử dụng các quy tắc kiểm tra khác nhau. Hơi hơi, có vẻ như chúng ta tạm thời không có yêu cầu nào trong lĩnh vực này. Thậm chí nếu có, thì cũng là tách biệt thành các lớp Bean khác nhau. Tất nhiên, với tư cách là một bài viết nhập môn, mình vẫn sẽ cung cấp một ví dụ về kiểm tra theo nhóm.

## 6.1 UserUpdateStatusDTO

Tại đường dẫn gói [`cn.iocoder.springboot.lab22.validation.dto`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/dto), tạo lớp [UserUpdateStatusDTO](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/dto/UserUpdateStatusDTO.java) cho việc cập nhật trạng thái người dùng (DTO). Mã như sau:

```java
// UserUpdateStatusDTO.java  
  
public class UserUpdateStatusDTO {  
  
    /**  
     * Nhóm 01, yêu cầu trạng thái phải là true  
     */  
    public interface Group01 {}  
  
    /**  
     * Nhóm 02, yêu cầu trạng thái phải là false  
     */  
    public interface Group02 {}  
      
    /**  
     * Trạng thái  
     */  
    @AssertTrue(message = "状态必须为 true", groups = Group01.class)  
    @AssertFalse(message = "状态必须为 false", groups = Group02.class)  
    private Boolean status;  
  
    // ... Bỏ qua các phương thức set/get  
}  
```

### Giải thích mã

- Tạo các interface `Group01` và `Group02` như hai nhóm kiểm tra. Không nhất thiết phải định nghĩa chúng trong lớp `UserUpdateStatusDTO`, ở đây chỉ để thuận tiện.
- Trường `status`, trong nhóm kiểm tra `Group01`, phải là `true`; trong nhóm kiểm tra `Group02`, phải là `false`.
## 6.2 UserController

Chỉnh sửa lớp [UserController](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/controller/UserController.java) để thêm hai API cho việc cập nhật trạng thái. Mã như sau:

```java
// UserController.java  
  
@PostMapping("/update_status_true")  
public void updateStatusTrue(@Validated(UserUpdateStatusDTO.Group01.class) UserUpdateStatusDTO updateStatusDTO) {  
    logger.info("[updateStatusTrue][updateStatusDTO: {}]", updateStatusDTO);  
}  
  
@PostMapping("/update_status_false")  
public void updateStatusFalse(@Validated(UserUpdateStatusDTO.Group02.class) UserUpdateStatusDTO updateStatusDTO) {  
    logger.info("[updateStatusFalse][updateStatusDTO: {}]", updateStatusDTO);  
}  
```

### Giải thích mã

- Đối với phương thức `#updateStatusTrue(updateStatusDTO)`, chúng ta đã thêm chú thích `@Validated` vào tham số `updateStatusDTO`, và thiết lập nhóm kiểm tra là `Group01`. Ví dụ về việc kiểm tra không thành công như hình dưới:  
  ![Ví dụ không thành công 1](https://static.iocoder.cn/images/Spring-Boot/2019-11-19/06.jpg)
  
- Đối với phương thức `#updateStatusFalse(updateStatusDTO)`, chúng ta cũng đã thêm chú thích `@Validated` vào tham số `updateStatusDTO`, và thiết lập nhóm kiểm tra là `Group02`. Ví dụ về việc kiểm tra không thành công như hình dưới:  
  ![Ví dụ không thành công 2](https://static.iocoder.cn/images/Spring-Boot/2019-11-19/07.jpg)

Do đó, khi sử dụng kiểm tra theo nhóm, điều cốt yếu là thêm chú thích `@Validated` và thiết lập nhóm kiểm tra tương ứng.

# 7. Kiểm Tra Thủ Công

> Mã ví dụ tương ứng với kho lưu trữ: [lab-22-validation-01](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01).

Trong các ví dụ trên, chúng ta chủ yếu sử dụng các chú thích khai báo của Spring Validation. Tuy nhiên, trong một số tình huống kinh doanh, chúng ta có thể cần sử dụng API Bean Validation để thực hiện kiểm tra tham số một cách thủ công.

Chỉnh sửa lớp thử nghiệm [UserServiceTest](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/test/java/cn/iocoder/springboot/lab22/validation/service/UserServiceTest.java) để thêm ví dụ về kiểm tra tham số thủ công. Mã như sau:

```java
// UserServiceTest.java  

@Autowired // <1.1>  
private Validator validator;  
  
@Test  
public void testValidator() {  
    // In ra, xem loại của validator // <1.2>  
    System.out.println(validator);  
  
    // Tạo đối tượng UserAddDTO // <2>  
    UserAddDTO addDTO = new UserAddDTO();  
    // Kiểm tra // <3>  
    Set<ConstraintViolation<UserAddDTO>> result = validator.validate(addDTO);  
    // In ra kết quả kiểm tra // <4>  
    for (ConstraintViolation<UserAddDTO> constraintViolation : result) {  
        // Thuộc tính: thông báo  
        System.out.println(constraintViolation.getPropertyPath() + ": " + constraintViolation.getMessage());  
    }  
}  
```

### Giải thích mã

- Tại `<1.1>`, tiêm đối tượng `Validator` vào. 

- Tại `<1.2>`, in ra loại của `validator`. Kết quả xuất ra như sau:
  
  `org.springframework.validation.beanvalidation.LocalValidatorFactoryBean@48c3205a`
  
  - Loại của `validator` là [LocalValidatorFactoryBean](https://github.com/spring-projects/spring-framework/blob/master/spring-context/src/main/java/org/springframework/validation/beanvalidation/LocalValidatorFactoryBean.java). LocalValidatorFactoryBean cung cấp hỗ trợ cho JSR-303 và JSR-349, đồng thời tương thích với Hibernate Validator.
  - Trong hệ thống Spring Boot, sử dụng [ValidationAutoConfiguration](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/validation/ValidationAutoConfiguration.java) để tự động cấu hình, mặc định tạo LocalValidatorFactoryBean làm Bean Validator.

- Tại `<2>`, tạo đối tượng `UserAddDTO`, tức là [「3.3 UserAddDTO」](#), đã thêm các chú thích ràng buộc tương ứng.

- Tại `<3>`, gọi phương thức `Validator#validate(T object, Class<?>... groups)` để thực hiện kiểm tra tham số.

- Tại `<4>`, in ra kết quả kiểm tra. Kết quả xuất ra như sau:
  
  `username: 登录账号不能为空`  
  `password: 密码不能为空`
  
  - Nếu kiểm tra thành công, thì tập hợp `Set<ConstraintViolation<?>>` trả về sẽ rỗng.
# 8. Quốc Tế Hóa i18n

> Mã ví dụ tương ứng với kho lưu trữ: [lab-22-validation-01](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01).

Trong một số dự án, chúng ta sẽ có nhu cầu về quốc tế hóa, đặc biệt là khi chúng ta làm dịch vụ SASS cho thị trường B2B. Vì vậy, khi sử dụng Bean Validator để kiểm tra tham số, chúng ta cũng cần cung cấp thông báo lỗi được quốc tế hóa.

Tin vui là Hibernate Validator đã tích hợp sẵn hỗ trợ cho quốc tế hóa, vì vậy chúng ta chỉ cần cấu hình đơn giản là có thể thực hiện thông báo lỗi quốc tế hóa.

## 8.1 Tập Tin Cấu Hình Ứng Dụng

Trong thư mục [`resources`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/resources), tạo tập tin cấu hình [`application.yaml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/resources/application.yaml) với cấu hình như sau:

```yaml
spring:  
  # Cấu hình thông điệp i18, tương ứng với lớp cấu hình MessageSourceProperties  
  messages:  
    basename: i18n/messages # Tên cơ bản của đường dẫn tập tin  
    encoding: UTF-8 # Sử dụng mã hóa UTF-8  
```

Sau đó, trong thư mục [`resources/i18n`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/resources/i18n), tạo các tập tin messages cho các ngôn ngữ khác nhau như sau:

* [`messages.properties`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/resources/i18n/messages.properties): Tập tin cấu hình i18 mặc định.
  
  ```
  UserUpdateDTO.id.NotNull=用户编号不能为空
  ```

* [`messages_en.properties`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/resources/i18n/messages_en.properties): Tập tin cấu hình i18 bằng tiếng Anh.
  
  ```
  UserUpdateDTO.id.NotNull=userId cannot be empty
  ```

* [`messages_ja.properties`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-22/lab-22-validation-01/src/main/resources/i18n/messages_ja.properties): Tập tin cấu hình i18 bằng tiếng Nhật.
  
  ```
  UserUpdateDTO.id.NotNull=ユーザー番号は空にできません
  ```

## 8.2 Cấu Hình Validation

Trong thư mục [`cn.iocoder.springboot.lab22.validation.config`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/config), tạo lớp cấu hình `ValidationConfiguration` để tạo một đối tượng `Validator Bean` hỗ trợ quốc tế hóa i18n. Mã như sau:

```java
// ValidationConfiguration.java  

@Configuration  
public class ValidationConfiguration {  

    /**  
     * Tham khảo {@link ValidationAutoConfiguration#defaultValidator()} để xây dựng Validator Bean  
     *  
     * @return Đối tượng Validator  
     */  
    @Bean  
    public Validator validator(MessageSource messageSource) {  
        // Tạo đối tượng LocalValidatorFactoryBean  
        LocalValidatorFactoryBean validator = ValidationAutoConfiguration.defaultValidator();  
        // Thiết lập thuộc tính messageSource để thực hiện i18n  
        validator.setValidationMessageSource(messageSource);  
        // Trả về  
        return validator;  
    }  
}  
```

## 8.3 UserUpdateDTO

Trong thư mục [`cn.iocoder.springboot.lab22.validation.dto`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/dto), tạo lớp [UserUpdateDTO](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/dto/UserUpdateDTO.java) để cập nhật thông tin người dùng DTO. Mã như sau:

```java
// UserUpdateDTO.java  

public class UserUpdateDTO {  

    /**  
     * Mã người dùng  
     */  
    @NotNull(message = "{UserUpdateDTO.id.NotNull}")  
    private Integer id;  

    // ... Bỏ qua các phương thức get/set  
}  
```

* Khác với việc thiết lập thuộc tính `message` của các chú thích ràng buộc mà chúng ta đã thấy ở trên, ở đây chúng ta sử dụng dấu `{}` như là một ký hiệu chiếm chỗ.
## 8.4 UserController

Chỉnh sửa lớp [UserController](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-22/lab-22-validation-01/src/main/java/cn/iocoder/springboot/lab22/validation/controller/UserController.java) để thêm API cập nhật người dùng. Mã như sau:

```java
// UserController.java  

@PostMapping("/update")  
public void update(@Valid UserUpdateDTO updateDTO) {  
    logger.info("\[update\]\[updateDTO: {}\]", updateDTO);  
}  
```

Dưới đây, chúng ta sẽ thực hiện kiểm tra API. Có một điều cần lưu ý, SpringMVC sử dụng tiêu đề yêu cầu `Accept-Language` để thực hiện quốc tế hóa i18n.

* Trường hợp `Accept-Language = zh`, kết quả phản hồi như sau: ![](https://static.iocoder.cn/images/Spring-Boot/2019-11-19/08.jpg)
* Trường hợp `Accept-Language = en`, kết quả phản hồi như sau: ![](https://static.iocoder.cn/images/Spring-Boot/2019-11-19/09.jpg)
* Trường hợp `Accept-Language = ja`, kết quả phản hồi như sau: ![](https://static.iocoder.cn/images/Spring-Boot/2019-11-19/10.jpg)

Đến đây, quá trình quốc tế hóa i18n cho Validator của chúng ta đã hoàn thành.

Tuy nhiên, những người bạn cẩn thận sẽ nhận thấy rằng `"请求参数不合法"` (Yêu cầu tham số không hợp lệ) vẫn chưa được xử lý quốc tế hóa. Đúng vậy~ Trên thực tế, quốc tế hóa là một công việc lớn, liên quan đến nhiều khía cạnh. Ví dụ như, quốc tế hóa thông tin trong bảng nghiệp vụ, sản phẩm hỗ trợ nhiều ngôn ngữ như tiếng Trung, tiếng Anh, tiếng Hàn, v.v. 😈 Gần đây, tôi đang có một dự án mới cần thực hiện quốc tế hóa, nếu bạn nào có nhu cầu trong lĩnh vực này, có thể cùng nhau trao đổi thêm nhé.

# 666. Tổng kết

Hy vọng sau khi đọc xong bài viết này, các bạn có thể thoải mái và thanh lịch hơn trong việc hoàn thành các yêu cầu kiểm tra tham số. 😈

Tất nhiên, có một điểm cần lưu ý, Bean Validation chủ yếu thực hiện việc kiểm tra tham số không trạng thái. Làm thế nào để hiểu điều này?

* Ví dụ, các kích thước như độ dài tham số, v.v., là **phù hợp** để thực hiện thông qua Bean Validation.
* Ví dụ, việc kiểm tra tính duy nhất của tên người dùng, v.v., phụ thuộc vào nguồn dữ liệu bên ngoài, là **không phù hợp** để thực hiện thông qua Bean Validation.

Tất nhiên, nếu bạn có ý kiến khác, hãy để lại bình luận để thảo luận.

Do giới hạn về dung lượng, tôi đã lười biếng một chút, còn một số nội dung thực sự có thể bổ sung:

* [《Intro to Apache BVal》](https://www.baeldung.com/apache-bval) sử dụng Apache BVal để thực hiện kiểm tra tham số.
* [《使用 Spring 的 Validator 接口进行校验》](http://www.shouce.ren/api/spring2.5/ch05s02.html) thông qua việc triển khai interface Validator để cung cấp bộ kiểm tra tham số cho đối tượng Bean tương ứng.