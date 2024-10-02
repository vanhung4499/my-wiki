---
title: Spring Boot Spring Security
tags:
  - java
  - spring-boot
categories:
  - spring-boot
order: 20
---
# Spring Security

Bài viết này cung cấp mã ví dụ hoàn chỉnh, có thể xem tại [https://github.com/YunaiV/SpringBoot-Labs](https://github.com/YunaiV/SpringBoot-Labs) trong thư mục tương ứng [lab-01-spring-security](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-01-spring-security)。

Viết bài gốc không dễ, hãy cho mình một [Star](https://github.com/YunaiV/SpringBoot-Labs/stargazers) nhé, cùng tiến lên nào!

# 1\. Tổng quan

Hầu như trong tất cả các hệ thống phát triển, đều cần thực hiện xác thực (authentication) và cấp quyền (authorization) để đảm bảo tính an toàn của hệ thống. 😈 Vì nhiều bạn có chút nhầm lẫn giữa xác thực và cấp quyền, mình trích dẫn một ví dụ thú vị trên mạng:

> Từ [Sự khác biệt giữa Xác thực (authentication) và Cấp quyền (authorization)](https://www.cnblogs.com/joooy/archive/2010/08/08/1795257.html)
> 
> *   authentication \[ɔ,θɛntɪ'keʃən\] xác thực
> *   authorization \[,ɔθərɪ'zeʃən\] cấp quyền
> 
> Ví dụ về **đi máy bay**:
> 
> *   【Xác thực】Khi bạn muốn lên máy bay, bạn cần xuất trình hộ chiếu và vé máy bay, hộ chiếu là để chứng minh bạn là Trương Tam, đây chính là xác thực.
> *   【Cấp quyền】Còn vé máy bay là để chứng minh bạn Trương Tam đã mua vé và có quyền lên máy bay, đây chính là cấp quyền.
> 
> Ví dụ về **diễn đàn**:
> 
> *   【Xác thực】Khi bạn muốn đăng nhập vào diễn đàn, nhập tên đăng nhập Trương Tam, mật khẩu 1234, mật khẩu đúng chứng tỏ bạn Trương Tam là Trương Tam, đây chính là xác thực.
> *   【Cấp quyền】Sau đó, hệ thống kiểm tra bạn Trương Tam là quản trị viên, do đó có quyền thêm bài hay xóa bài của người khác, đây chính là cấp quyền.

Vậy nên đơn giản mà nói: xác thực giải quyết vấn đề “bạn là ai”, còn cấp quyền giải quyết vấn đề “bạn có thể làm gì”. Ngoài ra, mình cũng đề xuất đọc thêm bài viết [Xác thực, Cấp quyền, Kiểm soát quyền và Quản lý quyền](http://www.iocoder.cn/Fight/user_login_auth_terms/?self) để hiểu rõ chi tiết hơn.

Trong hệ sinh thái Java hiện nay, có hai framework bảo mật [Spring Security](https://spring.io/projects/spring-security) và [Apache Shiro](https://shiro.apache.org/) có thể hoàn thành chức năng xác thực và cấp quyền. Bài viết này, chúng ta sẽ học về Spring Security trước. Trang web chính thức của Spring Security giới thiệu như sau:

> Từ [Trang chủ Spring Security](https://spring.io/projects/spring-security)
> 
> Spring Security là một khung xác thực và kiểm soát truy cập mạnh mẽ và có khả năng tùy chỉnh cao. Nó là tiêu chuẩn mặc định cho việc bảo mật các ứng dụng dựa trên Spring.

> FROM [Trang chủ Spring Security](https://spring.io/projects/spring-security)
> 
> Spring Security is a powerful and highly customizable authentication and access-control framework. It is the de-facto standard for securing Spring-based applications.  
> 
> Spring Security is a framework that focuses on providing both authentication and authorization to Java applications. Like all Spring projects, the real power of Spring Security is found in how easily it can be extended to meet custom requirements  

# 2\. Hướng dẫn nhanh

> Mã ví dụ tương ứng với kho lưu trữ: [lab-01-springsecurity-demo](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-01-spring-security/lab-01-springsecurity-demo).

Trong phần này, chúng ta sẽ tìm hiểu cách sử dụng Spring Security nhanh chóng, để khi truy cập API, người dùng cần phải đăng nhập trước khi có thể truy cập.

## 2.1 Thêm phụ thuộc

Trong tệp [`pom.xml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-01-spring-security/lab-01-springsecurity-demo/pom.xml), thêm các phụ thuộc liên quan.

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0"  
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">  
    <parent>  
        <groupId>org.springframework.boot</groupId>  
        <artifactId>spring-boot-starter-parent</artifactId>  
        <version>2.1.10.RELEASE</version>  
        <relativePath/> <!-- lookup parent from repository -->  
    </parent>  
    <modelVersion>4.0.0</modelVersion>  
  
    <artifactId>lab-01-springsecurity-demo</artifactId>  
  
    <dependencies>  
        <!-- Tự động cấu hình Spring MVC -->  
        <dependency>  
            <groupId>org.springframework.boot</groupId>  
            <artifactId>spring-boot-starter-web</artifactId>  
        </dependency>  
  
        <!-- Tự động cấu hình Spring Security -->  
        <dependency>  
            <groupId>org.springframework.boot</groupId>  
            <artifactId>spring-boot-starter-security</artifactId>  
        </dependency>  
    </dependencies>  
  
</project>  
```

Hãy chú ý kỹ các chú thích mà mình đã thêm vào để hiểu rõ chức năng của từng phụ thuộc nhé.

## 2.2 Application

Tạo lớp [`Application.java`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-01-spring-security/lab-01-springsecurity-demo/src/main/java/cn/iocoder/springboot/lab01/springsecurity/Application.java), chỉ cần cấu hình chú thích `@SpringBootApplication`. Mã như sau:

```java
// Application.java  
  
@SpringBootApplication  
public class Application {  
  
    public static void main(String[] args) {  
        SpringApplication.run(Application.class, args);  
    }  
      
}  
```

## 2.3 Tệp cấu hình

Trong tệp [`application.yml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-01-spring-security/lab-01-springsecurity-demo/src/main/resources/application.yaml), thêm cấu hình Spring Security như sau:

```yaml
spring:  
  # Cấu hình Spring Security, tương ứng với lớp cấu hình SecurityProperties  
  security:  
    # Cấu hình tài khoản và mật khẩu của InMemoryUserDetailsManager mặc định.  
    user:  
      name: user # Tài khoản  
      password: user # Mật khẩu  
      roles: ADMIN # Vai trò sở hữu  
```

* Trong mục cấu hình `spring.security`, thiết lập cấu hình Spring Security, tương ứng với lớp [SecurityProperties](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/security/SecurityProperties.java).
* Mặc định, Spring Boot sẽ sử dụng [UserDetailsServiceAutoConfiguration](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/security/servlet/UserDetailsServiceAutoConfiguration.java) để tạo một Bean **InMemoryUserDetailsManager** trong bộ nhớ, cung cấp thông tin xác thực của người dùng.
    * Ở đây, chúng ta đã **thêm** mục cấu hình `spring.security.user`, UserDetailsServiceAutoConfiguration sẽ tạo một người dùng [User](https://github.com/spring-projects/spring-security/blob/master/core/src/main/java/org/springframework/security/core/userdetails/User.java) dựa trên cấu hình này trong bộ nhớ.
    * Nếu không **thêm** mục cấu hình `spring.security.user`, UserDetailsServiceAutoConfiguration sẽ tự động tạo một người dùng với tên là `"user"` và mật khẩu ngẫu nhiên là UUID trong bộ nhớ.

## 2.4 AdminController

Trong thư mục [`cn.iocoder.springboot.lab01.springsecurity.controller`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-01-spring-security/lab-01-springsecurity-demo/src/main/java/cn/iocoder/springboot/lab01/springsecurity/controller), tạo lớp [AdminController](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-01-spring-security/lab-01-springsecurity-demo/src/main/java/cn/iocoder/springboot/lab01/springsecurity/controller/AdminController.java) để cung cấp API cho quản trị viên. Mã như sau:

```java
// AdminController.java  
  
@RestController  
@RequestMapping("/admin")  
public class AdminController {  
  
    @GetMapping("/demo")  
    public String demo() {  
        return "Trả về ví dụ";  
    }  
  
}  
```

* Tại đây, chúng ta cung cấp một API `"/admin/demo"` để kiểm tra khi chưa đăng nhập sẽ bị chuyển hướng đến trang đăng nhập.

## 2.5 Kiểm tra đơn giản

Chạy phương thức `Application#main(String[] args)` để khởi động dự án.

Sau khi dự án khởi động thành công, truy cập API [http://127.0.0.1:8080/admin/demo](http://127.0.0.1:8080/admin/demo). Vì chưa đăng nhập, Spring Security sẽ chuyển hướng bạn đến trang đăng nhập mặc định. Như hình dưới:  
![Giao diện đăng nhập mặc định](https://static.iocoder.cn/images/Spring-Boot/2020-01-01/01.png)

Vì chúng ta chưa **tùy chỉnh** giao diện đăng nhập nên mặc định sẽ sử dụng lớp [DefaultLoginPageGeneratingFilter](https://github.com/spring-projects/spring-security/blob/master/web/src/main/java/org/springframework/security/web/authentication/ui/DefaultLoginPageGeneratingFilter.java) để tạo trang trên.

Nhập tài khoản và mật khẩu "user/user" mà chúng ta đã cấu hình trong [mục 2.3](#), sau khi đăng nhập thành công, Spring Security sẽ tự động chuyển bạn đến URL mà bạn bị chặn trước đó, đó là [http://127.0.0.1:8080/admin/demo](http://127.0.0.1:8080/admin/demo). Kết quả sẽ như sau:  
![Kết quả trả về của API](https://static.iocoder.cn/images/Spring-Boot/2020-01-01/02.png)

# 3. Sử dụng nâng cao

> Mã nguồn mẫu tương ứng: [lab-01-springsecurity-demo-role](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-01-spring-security/lab-01-springsecurity-demo-role).

Trong phần [「2. Khởi đầu nhanh」](#), chúng ta đã hoàn thành rất **nhanh** việc giới thiệu về Spring Security. Trong phần này, chúng ta sẽ tùy chỉnh cấu hình Spring Security để thực hiện **kiểm soát quyền hạn**.

Để không làm ảnh hưởng đến ví dụ trên, chúng ta tạo một dự án mới [lab-01-springsecurity-demo-role](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-01-spring-security/lab-01-springsecurity-demo-role).

## 3.1 Nhập các phụ thuộc

Giống với [「2.1 Nhập phụ thuộc」](#), tham khảo tệp [`pom.xml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-01-spring-security/lab-01-springsecurity-demo-role/pom.xml).

## 3.2 Ví dụ một

Trong **ví dụ một**, chúng ta sẽ xem cách tùy chỉnh cấu hình Spring Security để thực hiện **kiểm soát quyền hạn**.
### 3.2.1 SecurityConfig

Trong gói [`cn.iocoder.springboot.lab01.springsecurity.config`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-01-spring-security/lab-01-springsecurity-demo-role/src/main/java/cn/iocoder/springboot/lab01/springsecurity/config), tạo lớp cấu hình [SecurityConfig](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-01-spring-security/lab-01-springsecurity-demo-role/src/main/java/cn/iocoder/springboot/lab01/springsecurity/config/SecurityConfig.java), kế thừa lớp trừu tượng [WebSecurityConfigurerAdapter](https://github.com/spring-projects/spring-security/blob/master/config/src/main/java/org/springframework/security/config/annotation/web/configuration/WebSecurityConfigurerAdapter.java), để thực hiện cấu hình tùy chỉnh của Spring Security trong môi trường web. Code như sau:

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    // ...
}
```

- Chúng ta có thể ghi đè các phương thức của WebSecurityConfigurerAdapter để thực hiện cấu hình tùy chỉnh cho Spring Security.

Đầu tiên, chúng ta ghi đè phương thức `#configure(AuthenticationManagerBuilder auth)` để thực hiện trình quản lý xác thực [AuthenticationManager](https://github.com/spring-projects/spring-security/blob/master/core/src/main/java/org/springframework/security/authentication/AuthenticationManager.java). Code như sau:

```java
@Override
protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.
        // <X> Sử dụng InMemoryUserDetailsManager trong bộ nhớ
        inMemoryAuthentication()
        // <Y> Không sử dụng PasswordEncoder mã hóa mật khẩu
        .passwordEncoder(NoOpPasswordEncoder.getInstance())
        // <Z> Cấu hình người dùng admin
        .withUser("admin").password("admin").roles("ADMIN")
        // <Z> Cấu hình người dùng normal
        .and().withUser("normal").password("normal").roles("NORMAL");
}
```

- Ở `<X>`, gọi phương thức `AuthenticationManagerBuilder#inMemoryAuthentication()` để sử dụng đối tượng Bean [InMemoryUserDetailsManager](https://github.com/spring-projects/spring-security/blob/master/core/src/main/java/org/springframework/security/provisioning/InMemoryUserDetailsManager.java) cấp bộ nhớ cung cấp thông tin xác thực người dùng.
    - Spring cung cấp hai triển khai [UserDetailsManager](https://github.com/spring-projects/spring-security/blob/master/core/src/main/java/org/springframework/security/provisioning/UserDetailsManager.java):
        - InMemoryUserDetailsManager, giống như trong phần [「2. Khởi đầu nhanh」](#).
        - JdbcUserDetailsManager, dựa trên **JDBC**.
    - Trong các dự án thực tế, chúng ta thường sử dụng phương thức `AuthenticationManagerBuilder#userDetailsService(userDetailsService)` với lớp triển khai [UserDetailsService](https://github.com/spring-projects/spring-security/blob/master/core/src/main/java/org/springframework/security/core/userdetails/UserDetailsService.java) tùy chỉnh, linh hoạt hơn để đọc thông tin xác thực người dùng.
- Ở `<Y>`, gọi phương thức `AbstractDaoAuthenticationConfigurer#passwordEncoder(passwordEncoder)` để đặt PasswordEncoder.
    - Ở đây, chúng ta sử dụng [NoOpPasswordEncoder](https://github.com/spring-projects/spring-security/blob/master/crypto/src/main/java/org/springframework/security/crypto/password/NoOpPasswordEncoder.java) để không mã hóa mật khẩu. Trong môi trường sản xuất, nên sử dụng [BCryptPasswordEncoder](https://github.com/spring-projects/spring-security/blob/master/crypto/src/main/java/org/springframework/security/crypto/bcrypt/BCryptPasswordEncoder.java).
- Ở `<Z>`, cấu hình hai người dùng "admin/admin" và "normal/normal" tương ứng với các vai trò ADMIN và NORMAL.

Sau đó, chúng ta ghi đè phương thức `#configure(HttpSecurity http)` để cấu hình kiểm soát quyền hạn cho các URL. Code như sau:

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        // <X> Cấu hình quyền hạn cho các URL
        .authorizeRequests()
            .antMatchers("/test/echo").permitAll() // Mọi người dùng có thể truy cập
            .antMatchers("/test/admin").hasRole("ADMIN") // Yêu cầu vai trò ADMIN
            .antMatchers("/test/normal").access("hasRole('ROLE_NORMAL')") // Yêu cầu vai trò NORMAL
            // Yêu cầu xác thực cho mọi yêu cầu khác
            .anyRequest().authenticated()
        .and()
        // <Y> Đặt cấu hình đăng nhập Form
        .formLogin()
            .permitAll() // Mọi người dùng có thể truy cập
        .and()
        // Cấu hình cho việc đăng xuất
        .logout()
            .permitAll(); // Mọi người dùng có thể truy cập
}
```

- Ở `<X>`, gọi phương thức `HttpSecurity#authorizeRequests()` để bắt đầu cấu hình kiểm soát quyền hạn cho các URL. Các phương thức thường được sử dụng:
    - `#permitAll()` cho phép mọi người dùng truy cập.
    - `#authenticated()` chỉ cho phép người dùng đã đăng nhập truy cập.
    - `#hasRole(String role)` chỉ cho phép người dùng có vai trò cụ thể truy cập.
    - `#access(String attribute)` cho phép truy cập nếu biểu thức Spring EL trả về `true`.
- Ở `<Y>`, gọi phương thức `HttpSecurity#formLogin()` để đặt cấu hình đăng nhập Form.
### 3.2.2 TestController

Trong đường dẫn gói [`cn.iocoder.springboot.lab01.springsecurity.controller`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-01-spring-security/lab-01-springsecurity-demo-role/src/main/java/cn/iocoder/springboot/lab01/springsecurity/controller), tạo lớp [TestController](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-01-spring-security/lab-01-springsecurity-demo-role/src/main/java/cn/iocoder/springboot/lab01/springsecurity/controller/TestController.java) để cung cấp các API kiểm tra. Code như sau:

```java
@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/echo")
    public String demo() {
        return "Ví dụ trả về";
    }

    @GetMapping("/home")
    public String home() {
        return "Tôi là trang chủ";
    }

    @GetMapping("/admin")
    public String admin() {
        return "Tôi là quản trị viên";
    }

    @GetMapping("/normal")
    public String normal() {
        return "Tôi là người dùng bình thường";
    }
}
```

- Đối với API `/test/echo`, có thể truy cập trực tiếp, không cần đăng nhập.
- Đối với API `/test/home`, không thể truy cập trực tiếp, yêu cầu đăng nhập.
- Đối với API `/test/admin`, yêu cầu đăng nhập với tài khoản "admin/admin" vì cần quyền ADMIN.
- Đối với API `/test/normal`, yêu cầu đăng nhập với tài khoản "normal/normal" vì cần quyền NORMAL.

Bạn có thể thử nghiệm theo hướng dẫn trên. Ví dụ, sau khi đăng nhập với tài khoản "normal/normal", nếu truy cập API `/test/admin`, sẽ nhận được trang lỗi 403 vì không có quyền truy cập.

## ## 3.3 Ví dụ hai

Trong **ví dụ hai**, chúng ta sẽ xem cách sử dụng các chú thích của Spring Security để thực hiện kiểm soát quyền hạn.

### 3.3.1 SecurityConfig

Chỉnh sửa lớp cấu hình [SecurityConfig](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-01-spring-security/lab-01-springsecurity-demo-role/src/main/java/cn/iocoder/springboot/lab01/springsecurity/config/SecurityConfig.java) để thêm chú thích [`@EnableGlobalMethodSecurity`](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/config/annotation/method/configuration/EnableGlobalMethodSecurity.html), kích hoạt xác thực quyền hạn cho các phương thức được chú thích bằng Spring Security. Mã như sau:

```java
@Configuration  
@EnableGlobalMethodSecurity(prePostEnabled = true)  
public class SecurityConfig extends WebSecurityConfigurerAdapter  
```

### 3.3.2 DemoController

Tại đường dẫn gói [`cn.iocoder.springboot.lab01.springsecurity.controller`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-01-spring-security/lab-01-springsecurity-demo-role/src/main/java/cn/iocoder/springboot/lab01/springsecurity/controller), tạo lớp [DemoController](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-01-spring-security/lab-01-springsecurity-demo-role/src/main/java/cn/iocoder/springboot/lab01/springsecurity/controller/DemoController.java) để cung cấp các API kiểm tra. Mã như sau:

```java
// DemoController.java  
  
@RestController  
@RequestMapping("/demo")  
public class DemoController {  
  
    @PermitAll  
    @GetMapping("/echo")  
    public String demo() {  
        return "Ví dụ trả về";  
    }  
  
    @GetMapping("/home")  
    public String home() {  
        return "Tôi là trang chủ";  
    }  
  
    @PreAuthorize("hasRole('ROLE_ADMIN')")  
    @GetMapping("/admin")  
    public String admin() {  
        return "Tôi là quản trị viên";  
    }  
  
    @PreAuthorize("hasRole('ROLE_NORMAL')")  
    @GetMapping("/normal")  
    public String normal() {  
        return "Tôi là người dùng bình thường";  
    }  
}  
```

*   Mỗi URL trong kiểm tra quyền hạn tương ứng với [「3.2.2 TestController」](#).
    
*   Chú thích [`@PermitAll`](https://github.com/jboss/jboss-annotations-api_spec/blob/master/src/main/java/javax/annotation/security/PermitAll.java) tương đương với phương thức `#permitAll()`, cho phép mọi người dùng truy cập.
    
    > Quan trọng!!! Bởi vì trong [「3.2.1 SecurityConfig」](#) đã cấu hình `.anyRequest().authenticated()`, nên bất kỳ yêu cầu nào, người dùng muốn truy cập đều cần được xác thực. Do đó, ở đây chú thích `@PermitAll` **thực tế là không hiệu lực**.
    > 
    > Điều này có nghĩa là, cấu hình quyền hạn trong Java Config và cấu hình quyền hạn bằng chú thích là **gộp lại** với nhau.
    
*   Chú thích [`@PreAuthorize`](https://github.com/spring-projects/spring-security/blob/master/core/src/main/java/org/springframework/security/access/prepost/PreAuthorize.java) tương đương với phương thức `#access(String attribute)`, cho phép truy cập khi kết quả của biểu thức Spring EL là true.
    

Spring Security còn có các chú thích khác, nhưng ít phổ biến hơn. Bạn có thể xem thêm trong bài viết [《Sự khác biệt: @Secured(), @PreAuthorize() và @RolesAllowed()》](http://www.iocoder.cn/Fight/Differences-secure-preauthorize-and-rolesallowed/?self).

Bạn có thể thực hiện các bài kiểm tra khác nhau theo hướng dẫn trên. Ví dụ, khi đăng nhập bằng tài khoản 「normal/normal」 và cố gắng truy cập API `/test/admin`, sẽ nhận được giao diện 403, không có quyền truy cập~

# 4. Tích hợp Spring Session

Xem bài viết [《芋道 Spring Boot 分布式 Session 入门》](http://www.iocoder.cn/Spring-Boot/Distributed-Session/?self) trong phần [「5. 整合 Spring Security」](#).

# 5. Tích hợp OAuth2

Xem bài viết [Spring Security OAuth2](./oauth2) với nội dung chi tiết.

# 6. Tích hợp JWT

Xem bài viết [SpringBoot + SpringSecurity + JWT + RBAC](http://www.iocoder.cn/Fight/Separate-SpringBoot-SpringSecurity-JWT-RBAC-from-front-and-rear-to-achieve-user-stateless-request-authentication/?self) được viết rất tốt.

# 7. Thực hành dự án

Tôi đã tìm một dự án mã nguồn mở phù hợp, đó là [RuoYi-Vue](https://gitee.com/y_project/RuoYi-Vue). Các lý do chính như sau:

*   Dựa trên Spring Security để thực hiện.
*   Sử dụng mô hình quyền RBAC và hỗ trợ cấu hình quyền động.
*   Dựa trên dịch vụ Redis để lưu trữ thông tin người dùng đã đăng nhập.
*   Tách biệt giữa front-end và back-end. Front-end sử dụng Vue, mà nói chung thì backend sử dụng Vue phổ biến hơn so với React.

Để tiện cho việc thêm chú thích, tôi đã Fork một kho lưu trữ, địa chỉ là [https://github.com/YunaiV/RuoYi-Vue](https://github.com/YunaiV/RuoYi-Vue).

> **Khuyến nghị mạnh mẽ**: Thực hành dự án Spring Security cấp sản xuất, hỗ trợ cả nền tảng quản lý backend và ứng dụng người dùng!
>
> Địa chỉ dự án: [https://github.com/YunaiV/ruoyi-vue-pro](https://github.com/YunaiV/ruoyi-vue-pro)
>
> 🔥 **Khuyến nghị chính thức** 🔥 Phiên bản Pro hoàn toàn mới của RuoYi-Vue, tối ưu và tái cấu trúc tất cả các chức năng. Hệ thống quản lý backend + ứng dụng mini chương trình WeChat được xây dựng trên Spring Boot + MyBatis Plus + Vue & Element, hỗ trợ quyền RBAC động, quyền dữ liệu, đa thuê SaaS, quy trình làm việc Activiti + Flowable, đăng nhập bên thứ ba, thanh toán, tin nhắn, thương mại điện tử và nhiều chức năng khác. **Ngôi sao ⭐️ Star ⭐️ của bạn là động lực cho tác giả!**

Bây giờ, hãy cùng nhau khám phá các chức năng liên quan đến quyền của RuoYi-Vue!

## 7.1 Cấu trúc Bảng

Dựa trên mô hình quyền RBAC, có tổng cộng 5 bảng.

> Nếu chưa hiểu rõ về mô hình quyền RBAC, bạn có thể xem qua bài viết [《到底什么是RBAC权限模型？！》](https://juejin.im/post/5d397e3ff265da1bca522011).
> 
> 😈 Nhân tiện, đề tài tốt nghiệp đại học của tôi vào năm 2011 là xây dựng một trung tâm xác thực thống nhất, sử dụng Spring Security tự phát triển và truyền thông qua HTTP, với mô hình front-end/back-end tách biệt. Front-end sử dụng [ExtJS](https://www.sencha.com/products/extjs/) và back-end tự xây dựng một framework quản lý quyền riêng dựa trên Spring Security.

| Thực thể | Bảng | Mô tả |
| --- | --- | --- |
| SysUser | `sys_user` | Thông tin người dùng |
| SysRole | `sys_role` | Thông tin vai trò |
| SysUserRole | `sys_user_role` | Liên kết giữa người dùng và vai trò |
| SysMenu | `sys_menu` | Quyền truy cập menu |
| SysRoleMenu | `sys_role_menu` | Liên kết giữa vai trò và menu |

Mối quan hệ giữa 5 bảng rất đơn giản:

* Một SysUser có thể sở hữu nhiều SysRole, lưu trữ liên kết qua SysUserRole.
* Một SysRole có thể có nhiều SysMenu, lưu trữ liên kết qua SysRoleMenu.

### 7.1.1 SysUser

[SysUser](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/system/domain/SysUser.java) là lớp thực thể người dùng. Mã nguồn như sau:

```java
public class SysUser extends BaseEntity {  
     
    private static final long serialVersionUID = 1L;  
  
    @Excel(name = "User ID", cellType = ColumnType.NUMERIC, prompt = "User Number")  
    private Long userId;  
  
    @Excel(name = "Department ID", type = Type.IMPORT)  
    private Long deptId;  
  
    @Excel(name = "Login Name")  
    private String userName;  
  
    @Excel(name = "User Name")  
    private String nickName;  
  
    @Excel(name = "User Email")  
    private String email;  
  
    @Excel(name = "Phone Number")  
    private String phonenumber;  
  
    @Excel(name = "User Gender", readConverterExp = "0=Male,1=Female,2=Unknown")  
    private String sex;  
  
    /** User Avatar */  
    private String avatar;  
  
    /** Password */  
    private String password;  
  
    /** Salt Encryption */  
    private String salt;  
  
    @Excel(name = "Account Status", readConverterExp = "0=Active,1=Inactive")  
    private String status;  
  
    /** Deletion Flag (0 means exists, 2 means deleted) */  
    private String delFlag;  
  
    @Excel(name = "Last Login IP", type = Type.EXPORT)  
    private String loginIp;  
  
    @Excel(name = "Last Login Time", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss", type = Type.EXPORT)  
    private Date loginDate;  
  
    @Excels({  
        @Excel(name = "Department Name", targetAttr = "deptName", type = Type.EXPORT),  
        @Excel(name = "Department Leader", targetAttr = "leader", type = Type.EXPORT)  
    })  
    @Transient  
    private SysDept dept;  
  
    /** Role Object */  
    @Transient  
    private List<SysRole> roles;  
  
    /** Role Group */  
    @Transient  
    private Long[] roleIds;  
  
    /** Post Group */  
    @Transient  
    private Long[] postIds;  
      
    // Set/get methods omitted  
}  
```

* Các trường có chú thích `@Transient` là các trường không lưu trữ trong cơ sở dữ liệu. Các thực thể khác cũng tương tự, không cần nhắc lại.
* Mỗi trường đều dễ hiểu, bạn có thể tự tìm hiểu thêm dựa trên chú thích.

SQL tạo bảng tương ứng như sau:

```sql
CREATE TABLE sys_user (  
  user_id           BIGINT(20)      NOT NULL AUTO_INCREMENT COMMENT 'User ID',  
  dept_id           BIGINT(20)      DEFAULT NULL            COMMENT 'Department ID',  
  user_name         VARCHAR(30)     NOT NULL                COMMENT 'Username',  
  nick_name         VARCHAR(30)     NOT NULL                COMMENT 'Nickname',  
  user_type         VARCHAR(2)      DEFAULT '00'            COMMENT 'User Type (00 System User)',  
  email             VARCHAR(50)     DEFAULT ''              COMMENT 'Email',  
  phonenumber       VARCHAR(11)     DEFAULT ''              COMMENT 'Phone Number',  
  sex               CHAR(1)         DEFAULT '0'             COMMENT 'Gender (0 Male, 1 Female, 2 Unknown)',  
  avatar            VARCHAR(100)    DEFAULT ''              COMMENT 'Avatar URL',  
  password          VARCHAR(100)    DEFAULT ''              COMMENT 'Password',  
  status            CHAR(1)         DEFAULT '0'             COMMENT 'Account Status (0 Active, 1 Inactive)',  
  del_flag          CHAR(1)         DEFAULT '0'             COMMENT 'Delete Flag (0 means exists, 2 means deleted)',  
  login_ip          VARCHAR(50)     DEFAULT ''              COMMENT 'Last Login IP',  
  login_date        DATETIME                                COMMENT 'Last Login Time',  
  create_by         VARCHAR(64)     DEFAULT ''              COMMENT 'Created By',  
  create_time       DATETIME                                COMMENT 'Creation Time',  
  update_by         VARCHAR(64)     DEFAULT ''              COMMENT 'Updated By',  
  update_time       DATETIME                                COMMENT 'Update Time',  
  remark            VARCHAR(500)    DEFAULT NULL            COMMENT 'Remarks',  
  PRIMARY KEY (user_id)  
) ENGINE=INNODB AUTO_INCREMENT=100 COMMENT = 'User Information Table';  
```

### 7.1.2 SysRole

[SysRole](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/system/domain/SysRole.java) ，Lớp thực thể vai trò. Mã này như sau:

```java
// SysRole.java

public class SysRole extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @Excel(name = "Role ID", cellType = ColumnType.NUMERIC)
    private Long roleId;

    @Excel(name = "Role Name")
    private String roleName;

    @Excel(name = "Role Permission")
    private String roleKey;

    @Excel(name = "Role Sort")
    private String roleSort;

    @Excel(name = "Data Scope", readConverterExp = "1=All Data Permissions, 2=Custom Data Permissions, 3=Department Data Permissions, 4=Department and Subordinate Data Permissions")
    private String dataScope;

    @Excel(name = "Role Status", readConverterExp = "0=Active,1=Inactive")
    private String status;

    /** Delete Flag (0 means exists, 2 means deleted) */
    private String delFlag;

    /** Flag to indicate if the user has this role, default is false */
    @Transient
    private boolean flag = false;

    /** Menu group */
    @Transient
    private Long[] menuIds;

    /** Department group (Data permissions) */
    @Transient
    private Long[] deptIds;

    // Getter and Setter methods omitted
}
```

* Mỗi field tương đối đơn giản, bạn có thể tự hiểu dựa trên comment.

SQL tạo bảng tương ứng như sau:

```sql
CREATE TABLE sys_role (
  role_id           BIGINT(20)      NOT NULL AUTO_INCREMENT    COMMENT 'Role ID',
  role_name         VARCHAR(30)     NOT NULL                   COMMENT 'Role Name',
  role_key          VARCHAR(100)    NOT NULL                   COMMENT 'Role Permission String',
  role_sort         INT(4)          NOT NULL                   COMMENT 'Display Order',
  data_scope        CHAR(1)         DEFAULT '1'                COMMENT 'Data Scope (1: All Data Permissions, 2: Custom Data Permissions, 3: Department Data Permissions, 4: Department and Subordinate Data Permissions)',
  status            CHAR(1)         NOT NULL                   COMMENT 'Role Status (0 Active, 1 Inactive)',
  del_flag          CHAR(1)         DEFAULT '0'                COMMENT 'Delete Flag (0 means exists, 2 means deleted)',
  create_by         VARCHAR(64)     DEFAULT ''                 COMMENT 'Created By',
  create_time       DATETIME                                   COMMENT 'Creation Time',
  update_by         VARCHAR(64)     DEFAULT ''                 COMMENT 'Updated By',
  update_time       DATETIME                                   COMMENT 'Update Time',
  remark            VARCHAR(500)    DEFAULT NULL               COMMENT 'Remarks',
  PRIMARY KEY (role_id)
) ENGINE=INNODB AUTO_INCREMENT=100 COMMENT = 'Role Information Table';
```

### 7.1.3 SysUserRole

[SysUserRole](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/system/domain/SysUserRole.java) ，Các lớp thực thể liên quan đến người dùng và vai trò. Mã này như sau:

```java
// SysUserRole.java

public class SysUserRole {

    /** User ID */
    private Long userId;

    /** Role ID */
    private Long roleId;

    // Getter and Setter methods omitted
}
```

* Mỗi field tương đối đơn giản, bạn có thể tự hiểu dựa trên comment.
* Thuộc tính `roleKey`, vai trò tương ứng ** chuỗi nhận dạng **, có thể tương ứng với nhiều vai trò ** nhận dạng **, được phân tách bằng dấu phẩy. Ví dụ: `"admin,bình thường"`.

SQL tạo bảng tương ứng như sau:

```java
CREATE TABLE sys_user_role (
  user_id   BIGINT(20) NOT NULL COMMENT 'User ID',
  role_id   BIGINT(20) NOT NULL COMMENT 'Role ID',
  PRIMARY KEY(user_id, role_id)
) ENGINE=INNODB COMMENT = 'User and Role Association Table';
```

### 7.1.4 SysMenu

[SysMenu](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/system/domain/SysMenu.java) là một thực thể quản lý quyền của menu. Mã như sau:

```java
// SysMenu.java

public class SysMenu extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /** Menu ID */
    private Long menuId;

    /** Menu name */
    private String menuName;

    /** Parent menu name */
    private String parentName;

    /** Parent menu ID */
    private Long parentId;

    /** Display order */
    private String orderNum;

    /** Route address */
    private String path;

    /** Component path */
    private String component;

    /** Is it an external link (0: yes, 1: no) */
    private String isFrame;

    /** Menu type (M: directory, C: menu, F: button) */
    private String menuType;

    /** Menu status: 0 visible, 1 hidden */
    private String visible;

    /** Permission string */
    private String perms;

    /** Menu icon */
    private String icon;

    /** Submenu */
    @Transient
    private List<SysMenu> children = new ArrayList<SysMenu>();

    // ...getter/setter methods omitted

}
```

- Cá nhân tôi cảm thấy thực thể này nên đổi tên thành **SysResource** (Tài nguyên hệ thống), vì menu chỉ là một trong số đó.
- Các trường dữ liệu đều đơn giản, bạn có thể hiểu rõ thông qua việc quản lý tài nguyên. Chúng ta hãy tập trung vào một số trường quan trọng:
  - **Thuộc tính `menuType`**: Xác định ba loại khác nhau, trong đó `F` đại diện cho nút, nhằm thực hiện quyền hạn ở mức độ chức năng của trang.
  - **Thuộc tính `perms`**: Chuỗi định danh quyền hạn, thường có định dạng `${module lớn}:${module nhỏ}:{hành động}`. Ví dụ như sau:
    - Truy vấn người dùng: `system:user:query`
    - Thêm mới người dùng: `system:user:add`
    - Chỉnh sửa người dùng: `system:user:edit`
    - Xóa người dùng: `system:user:remove`
    - Xuất người dùng: `system:user:export`
    - Nhập người dùng: `system:user:import`
    - Đặt lại mật khẩu: `system:user:resetPwd`
    
    - Đối với frontend, khi hiển thị các nút, có thể kiểm tra người dùng có quyền tương ứng hay không. Nếu không có, nút đó sẽ bị ẩn. Frontend cũng sẽ yêu cầu một danh sách quyền hạn khi truy cập hệ thống để lưu trữ tạm thời.
    - Đối với backend, mỗi API sẽ được gắn với annotation `@PreAuthorize("@ss.hasPermi('system:user:list')")`. Khi người dùng yêu cầu truy cập, hệ thống sẽ kiểm tra xem họ có quyền truy cập tương ứng không. Nếu không, sẽ ném ngoại lệ quyền truy cập thất bại.

    - Một thuộc tính `perms` có thể liên kết với nhiều định danh quyền hạn, sử dụng dấu phẩy để phân tách. Ví dụ: `"system:user:query,system:user:add"`.

---

Mã SQL tương ứng để tạo bảng:

```sql
CREATE TABLE sys_menu (
  menu_id           BIGINT(20)      NOT NULL AUTO_INCREMENT    COMMENT 'Menu ID',
  menu_name         VARCHAR(50)     NOT NULL                   COMMENT 'Menu Name',
  parent_id         BIGINT(20)      DEFAULT 0                  COMMENT 'Parent Menu ID',
  order_num         INT(4)          DEFAULT 0                  COMMENT 'Display Order',
  path              VARCHAR(200)    DEFAULT ''                 COMMENT 'Route Address',
  component         VARCHAR(255)    DEFAULT NULL               COMMENT 'Component Path',
  is_frame          INT(1)          DEFAULT 1                  COMMENT 'Is it an External Link (0: Yes, 1: No)',
  menu_type         CHAR(1)         DEFAULT ''                 COMMENT 'Menu Type (M: Directory, C: Menu, F: Button)',
  visible           CHAR(1)         DEFAULT 0                  COMMENT 'Menu Status (0: Visible, 1: Hidden)',
  perms             VARCHAR(100)    DEFAULT NULL               COMMENT 'Permission String',
  icon              VARCHAR(100)    DEFAULT '#'                COMMENT 'Menu Icon',
  create_by         VARCHAR(64)     DEFAULT ''                 COMMENT 'Created By',
  create_time       DATETIME                                   COMMENT 'Creation Time',
  update_by         VARCHAR(64)     DEFAULT ''                 COMMENT 'Updated By',
  update_time       DATETIME                                   COMMENT 'Update Time',
  remark            VARCHAR(500)    DEFAULT ''                 COMMENT 'Remark',
  PRIMARY KEY (menu_id)
) ENGINE=INNODB AUTO_INCREMENT=2000 COMMENT = 'Menu Permission Table';
```

Dưới đây là bản dịch sang tiếng Việt:

### 7.1.5 SysRoleMenu

[SysRoleMenu](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/system/domain/SysRoleMenu.java), là một thực thể quyền menu. Mã như sau:

```java
// SysRoleMenu.java

public class SysRoleMenu {

    /** Role ID */
    private Long roleId;

    /** Menu ID */
    private Long menuId;

    // ...omitting getter/setter methods

}
```

* Mỗi trường khá đơn giản, bạn có thể tự hiểu dựa trên chú thích.

Bảng SQL tương ứng để tạo như sau:

```sql
CREATE TABLE sys_role_menu (
  role_id   BIGINT(20) NOT NULL COMMENT 'Role ID',
  menu_id   BIGINT(20) NOT NULL COMMENT 'Menu ID',
  PRIMARY KEY(role_id, menu_id)
) ENGINE=INNODB COMMENT = 'Table Linking Roles and Menus';
```

Here’s the translation into Vietnamese:

## 7.2 SecurityConfig

Trong lớp cấu hình [SecurityConfig](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/framework/config/SecurityConfig.java), kế thừa lớp trừu tượng WebSecurityConfigurerAdapter, thực hiện cấu hình tùy chỉnh Spring Security trong bối cảnh Web. Mã nguồn như sau:

```java
// SecurityConfig.java  

@Configuration  
public class SecurityConfig extends WebSecurityConfigurerAdapter {  
  
    // ...  
  
}  
```

*   Có nhiều phương thức cấu hình liên quan, chúng ta sẽ xem xét từng cái một.

Ghi đè phương thức `#configure(AuthenticationManagerBuilder auth)` để thực hiện quản lý xác thực [AuthenticationManager](https://github.com/spring-projects/spring-security/blob/master/core/src/main/java/org/springframework/security/authentication/AuthenticationManager.java). Mã nguồn như sau:

```java
// SecurityConfig.java  

/**  
 * Logic xác thực người dùng tùy chỉnh  
 */  
@Autowired  
private UserDetailsService userDetailsService;  
  
/**  
 * Interface xác thực danh tính  
 */  
@Override  
protected void configure(AuthenticationManagerBuilder auth) throws Exception {  
    auth.userDetailsService(userDetailsService) // <X>  
            .passwordEncoder(bCryptPasswordEncoder()); // <Y>  
}  
  
/**  
 * Triển khai mã hóa băm
 */  
@Bean  
public BCryptPasswordEncoder bCryptPasswordEncoder() {  
    return new BCryptPasswordEncoder();  
}  
```

*   Tại `<X>`, gọi phương thức `AuthenticationManagerBuilder#userDetailsService(userDetailsService)`, sử dụng triển khai tùy chỉnh của [UserDetailsService](https://github.com/spring-projects/spring-security/blob/master/core/src/main/java/org/springframework/security/core/userdetails/UserDetailsService.java) để đọc thông tin người dùng xác thực một cách **linh hoạt** và **tự do** hơn. Trong phần [「7.3.1 Tải thông tin người dùng」](#), chúng ta sẽ thấy lớp triển khai tùy chỉnh của RuoYi-Vue cho UserDetailsService.
*   Tại `<Y>`, gọi phương thức `AbstractDaoAuthenticationConfigurer#passwordEncoder(passwordEncoder)` để thiết lập PasswordEncoder cho mã hóa mật khẩu. Tại đây, chúng ta sử dụng bCryptPasswordEncoder cho mã hóa băm mạnh.

Ghi đè phương thức `#configure(HttpSecurity httpSecurity)` để cấu hình quyền truy cập URL. Mã nguồn như sau:

```java
// SecurityConfig.java  

/**  
 * Lớp xử lý khi xác thực thất bại  
 */  
@Autowired  
private AuthenticationEntryPointImpl unauthorizedHandler;  
  
/**  
 * Lớp xử lý đăng xuất  
 */  
@Autowired  
private LogoutSuccessHandlerImpl logoutSuccessHandler;  
  
/**  
 * Bộ lọc xác thực token  
 */  
@Autowired  
private JwtAuthenticationTokenFilter authenticationTokenFilter;  
  
@Override  
protected void configure(HttpSecurity httpSecurity) throws Exception {  
    httpSecurity  
            // Vô hiệu hóa CRSF vì không sử dụng phiên  
            .csrf().disable()  
            // <X> Lớp xử lý khi xác thực thất bại  
            .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()  
            // Dựa trên token, do đó không cần phiên  
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()  
            // Lọc yêu cầu  
            .authorizeRequests()  
            // <Y> Đối với đăng nhập /login và mã captcha captchaImage cho phép truy cập ẩn danh  
            .antMatchers("/login", "/captchaImage").anonymous()  
            .antMatchers(  
                    HttpMethod.GET,  
                    "/\*.html",  
                    "/\*\*/\*.html",  
                    "/\*\*/\*.css",  
                    "/\*\*/\*.js"  
            ).permitAll()  
            .antMatchers("/profile/\*\*").anonymous()  
            .antMatchers("/common/download\*\*").anonymous()  
            .antMatchers("/swagger-ui.html").anonymous()  
            .antMatchers("/swagger-resources/\*\*").anonymous()  
            .antMatchers("/webjars/\*\*").anonymous()  
            .antMatchers("/\*/api-docs").anonymous()  
            .antMatchers("/druid/\*\*").anonymous()  
            // Tất cả các yêu cầu khác đều cần xác thực quyền  
            .anyRequest().authenticated()  
            .and()  
            .headers().frameOptions().disable();  
    httpSecurity.logout().logoutUrl("/logout").logoutSuccessHandler(logoutSuccessHandler); // <Z>  
    // <P> Thêm bộ lọc JWT  
    httpSecurity.addFilterBefore(authenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);  
}  
```

*   Đoạn mã khá dài, chúng ta sẽ chọn những điểm quan trọng để xem xét.
*   Tại `<X>`, thiết lập bộ xử lý khi xác thực thất bại là `unauthorizedHandler`. Phân tích chi tiết, xem [「7.6.1 AuthenticationEntryPointImpl」](#).
*   Tại `<Y>`, thiết lập giao diện `/login` cho việc đăng nhập, cho phép truy cập ẩn danh. Như vậy, chúng ta có thể sử dụng giao diện đăng nhập tùy chỉnh. Phân tích chi tiết, xem [「7.3 Giao diện API đăng nhập」](#).
*   Tại `<Z>`, thiết lập bộ xử lý khi đăng xuất thành công là `logoutSuccessHandler`. Phân tích chi tiết, xem [「7.6.3 LogoutSuccessHandlerImpl」](#).
*   Tại `<P>`, thêm bộ lọc xác thực JWT `authenticationTokenFilter`, được sử dụng để xác thực người dùng sau khi đăng nhập bằng tên người dùng và mật khẩu. Phân tích chi tiết, xem [「7.4 JwtAuthenticationTokenFilter」](#).

Ghi đè phương thức `#authenticationManagerBean` để giải quyết vấn đề không thể tiêm trực tiếp AuthenticationManager. Mã nguồn như sau:

```java
// SecurityConfig.java  

@Bean  
@Override  
public AuthenticationManager authenticationManagerBean() throws Exception {  
    return super.authenticationManagerBean();  
}  
```

*   Trên phương thức, đã thêm chú thích `@Bean` để đảm bảo tạo ra AuthenticationManager Bean.

Tiếp theo, chúng ta sẽ xem xét chi tiết logic của từng Bean cấu hình.

Dưới đây là bản dịch sang tiếng Việt của nội dung bạn cung cấp:

## 7.3 API Đăng Nhập

**SysLoginController#login(...)**

Trong [SysLoginController](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/system/controller/SysLoginController.java), định nghĩa interface `/login`, cung cấp chức năng đăng nhập. Mã như sau:

```java
// SysLoginController.java  

@Autowired  
private SysLoginService loginService;  
  
/**  
 * Phương thức đăng nhập  
 *  
 * @param username Tên người dùng  
 * @param password Mật khẩu  
 * @param code Mã xác thực  
 * @param uuid Định danh duy nhất  
 * @return Kết quả  
 */  
@PostMapping("/login")  
public AjaxResult login(String username, String password, String code, String uuid) {  
    AjaxResult ajax = AjaxResult.success();  
    // Tạo token  
    String token = loginService.login(username, password, code, uuid);  
    ajax.put(Constants.TOKEN, token);  
    return ajax;  
}  
```

* Bên trong, sẽ gọi phương thức `loginService#login(username, password, code, uuid)`, sẽ thực hiện xác thực đăng nhập dựa trên tên người dùng và mật khẩu. Khi xác thực thành công, sẽ trả về TOKEN danh tính.

* Sau khi đăng nhập thành công, phản hồi của interface này sẽ như sau:

```json
{  
    "msg": "Success",   
    "code": 200,   
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImJkN2Q4OTZiLTU2NTAtNGIyZS1iNjFjLTc0MjlkYmRkNzA1YyJ9.lkU8ot4GecLHs7VAcRAo1fLMOaFryd4W5Q_a2wzPwcOL0Kiwyd4enpnGd79A_aQczXC-JB8vELNcNn7BrtJn9A"  
}
```

* Tiếp theo, phía frontend khi yêu cầu tới các interface backend, sẽ gửi giá trị `token` này trong header yêu cầu như một dấu hiệu nhận diện người dùng.

**SysLoginService#login(...)**

Trong [`SysLoginService`](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/framework/security/service/SysLoginService.java), định nghĩa phương thức `#login(username, password, code, uuid)`, thực hiện xác thực đăng nhập dựa trên tên người dùng và mật khẩu. Khi xác thực thành công, sẽ trả về TOKEN danh tính. Mã như sau:

```java
// SysLoginService.java  

@Autowired  
private TokenService tokenService;  
  
@Resource  
private AuthenticationManager authenticationManager;  
  
@Autowired  
private RedisCache redisCache;  
  
/**  
 * Xác thực đăng nhập  
 *  
 * @param username Tên người dùng  
 * @param password Mật khẩu  
 * @param code     Mã xác thực  
 * @param uuid     Định danh duy nhất  
 * @return Kết quả  
 */  
public String login(String username, String password, String code, String uuid) {  
    // <1> Xác thực tính chính xác của mã xác thực hình ảnh  
    String verifyKey = Constants.CAPTCHA_CODE_KEY + uuid; // uuid dùng để lấy mã xác thực hình ảnh tương ứng  
    String captcha = redisCache.getCacheObject(verifyKey); // Lấy mã xác thực hình ảnh từ Redis  
    redisCache.deleteObject(verifyKey); // Xóa mã xác thực hình ảnh từ Redis  
    if (captcha == null) { // Mã xác thực hình ảnh không tồn tại  
        AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, MessageUtils.message("user.jcaptcha.error")));  
        throw new CaptchaExpireException();  
    }  
    if (!code.equalsIgnoreCase(captcha)) { // Mã xác thực hình ảnh không chính xác  
        AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, MessageUtils.message("user.jcaptcha.expire")));  
        throw new CaptchaException();  
    }  
    // <2> Xác thực người dùng  
    Authentication authentication;  
    try {  
        // Phương thức này sẽ gọi UserDetailsServiceImpl.loadUserByUsername  
        authentication = authenticationManager  
                .authenticate(new UsernamePasswordAuthenticationToken(username, password));  
    } catch (Exception e) {  
        // <2.1> Nếu xảy ra ngoại lệ, nghĩa là xác thực không thành công, ghi lại nhật ký đăng nhập thất bại  
        if (e instanceof BadCredentialsException) {  
            AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, MessageUtils.message("user.password.not.match")));  
            throw new UserPasswordNotMatchException();  
        } else {  
            AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, e.getMessage()));  
            throw new CustomException(e.getMessage());  
        }  
    }  
    // <2.2> Nếu xác thực thành công, ghi lại nhật ký đăng nhập thành công  
    AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_SUCCESS, MessageUtils.message("user.login.success")));  
    // <3> Tạo Token  
    LoginUser loginUser = (LoginUser) authentication.getPrincipal();  
    return tokenService.createToken(loginUser);  
}  
```

* Tại `<1>`, xác thực tính chính xác của mã xác thực hình ảnh. Mã xác thực này sẽ được lưu trữ trong bộ nhớ cache Redis, sử dụng `uuid` như là định danh tương ứng. Logic tạo mã xác thực, bạn có thể xem trong [CaptchaController](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/common/CaptchaController.java) tại interface `/captchaImage`.
* Tại `<2>`, gọi phương thức `#authenticate(UsernamePasswordAuthenticationToken authentication)` của **AuthenticationManager** trong Spring Security, thực hiện xác thực đăng nhập dựa trên tên người dùng và mật khẩu. Bên trong, nó sẽ gọi phương thức `#loadUserByUsername(String username)` mà chúng ta đã định nghĩa trong UserDetailsServiceImpl để lấy thông tin người dùng tương ứng với tên người dùng đã cho. Phân tích chi tiết, xem [「7.3.1 Tải thông tin người dùng」](#).
    * Tại `<2.1>`, nếu xảy ra ngoại lệ, nghĩa là xác thực **không** thành công, ghi lại nhật ký đăng nhập thất bại tương ứng.
    * Tại `<2.2>`, **không** xảy ra ngoại lệ, nghĩa là xác thực thành công, ghi lại nhật ký đăng nhập thành công tương ứng.
    * Về các nhật ký này, chúng ta sẽ đề cập trong [「7.7 Nhật ký đăng nhập」](#).
* Tại `<3>`, gọi phương thức `#createToken(LoginUser loginUser)` của TokenService, tạo TOKEN xác thực cho người dùng đã xác thực thành công. Như vậy, các yêu cầu tiếp theo của người dùng này sẽ sử dụng TOKEN này như một dấu hiệu nhận diện để thực hiện xác thực.

### 7.3.1 Tải Thông Tin Người Dùng

Trong [UserDetailsServiceImpl](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/framework/security/service/UserDetailsServiceImpl.java), đã thực hiện giao diện Spring Security [UserDetailsService](https://github.com/spring-projects/spring-security/blob/master/core/src/main/java/org/springframework/security/core/userdetails/UserDetailsService.java), cài đặt phương thức `#loadUserByUsername(String username)` được định nghĩa trong giao diện này để lấy thông tin người dùng tương ứng với tên người dùng đã chỉ định. Mã như sau:

```java
// UserDetailsServiceImpl.java  
  
private static final Logger log = LoggerFactory.getLogger(UserDetailsServiceImpl.class);  
  
@Autowired  
private ISysUserService userService;  
  
@Autowired  
private SysPermissionService permissionService;  
  
@Override  
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {  
    // <1> Truy vấn SysUser tương ứng với tên người dùng đã chỉ định  
    SysUser user = userService.selectUserByUserName(username);  
    // <2> Các kiểm tra khác nhau  
    if (StringUtils.isNull(user)) {  
        log.info("Người dùng đăng nhập：{} không tồn tại.", username);  
        throw new UsernameNotFoundException("Người dùng đăng nhập：" + username + " không tồn tại");  
    } else if (UserStatus.DELETED.getCode().equals(user.getDelFlag())) {  
        log.info("Người dùng đăng nhập：{} đã bị xóa.", username);  
        throw new BaseException("Xin lỗi, tài khoản của bạn：" + username + " đã bị xóa");  
    } else if (UserStatus.DISABLE.getCode().equals(user.getStatus())) {  
        log.info("Người dùng đăng nhập：{} đã bị tạm ngưng.", username);  
        throw new BaseException("Xin lỗi, tài khoản của bạn：" + username + " đã tạm ngưng");  
    }  
  
    // <3> Tạo thông tin chi tiết người dùng Spring Security  
    return createLoginUser(user);  
}  
  
public UserDetails createLoginUser(SysUser user) {  
    return new LoginUser(user, permissionService.getMenuPermission(user));  
}  
```

*   Tại `<1>`, gọi phương thức `#selectUserByUserName(String userName)` của ISysUserService để truy vấn SysUser tương ứng với tên người dùng đã chỉ định. Mã như sau:

```java
// SysUserServiceImpl.java  
@Autowired  
private SysUserMapper userMapper;  
  
@Override  
public SysUser selectUserByUserName(String userName) {  
    return userMapper.selectUserByUserName(userName);  
}  
  
// SysUserMapper.XML  
<sql id="selectUserVo">  
    select u.user_id, u.dept_id, u.user_name, u.nick_name, u.email, u.avatar, u.phonenumber, u.password, u.sex, u.status, u.del_flag, u.login_ip, u.login_date, u.create_by, u.create_time, u.remark,  
    d.dept_id, d.parent_id, d.dept_name, d.order_num, d.leader, d.status as dept_status,  
    r.role_id, r.role_name, r.role_key, r.role_sort, r.data_scope, r.status as role_status  
    from sys_user u  
        left join sys_dept d on u.dept_id = d.dept_id  
        left join sys_user_role ur on u.user_id = ur.user_id  
        left join sys_role r on r.role_id = ur.role_id  
</sql>  
  
<select id="selectUserByUserName" parameterType="String" resultMap="SysUserResult">  
    <include refid="selectUserVo"/>  
    where u.user_name = #{userName}  
</select>  
```

*   Thông qua truy vấn bảng `sys_user`, đồng thời kết nối với bảng `sys_dept`, `sys_user_role`, `sys_role`, lấy tất cả thông tin liên quan đến SysUser tương ứng với `username`.
*   Kết quả trả về `SysUserResult` được định nghĩa cụ thể, nhấp vào [cổng chuyển tiếp](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/resources/mybatis/system/SysUserMapper.xml#L7-L46) để xem, thực tế chính là lớp thực thể SysUser.
*   Tại `<2>`, thực hiện các kiểm tra khác nhau. Nếu kiểm tra không thông qua, ném ra ngoại lệ UsernameNotFoundException hoặc BaseException.

*   Tại `<3>`, gọi phương thức `#getMenuPermission(SysUser user)` của SysPermissionService để lấy tập hợp các chuỗi **định danh** quyền SysRoleMenu của người dùng. Mã như sau:

```java
// SysPermissionService.java  
@Autowired  
private ISysMenuService menuService;  
  
public Set<String> getMenuPermission(SysUser user) {  
    Set<String> roles = new HashSet<String>();  
    // Quản trị viên có tất cả quyền  
    if (user.isAdmin()) {  
        roles.add("*:*:*"); // Tất cả các module  
    } else {  
        // Đọc  
        roles.addAll(menuService.selectMenuPermsByUserId(user.getUserId()));  
    }  
    return roles;  
}  
  
// SysMenuServiceImpl.java  
@Autowired  
private SysMenuMapper menuMapper;  
  
@Override  
public Set<String> selectMenuPermsByUserId(Long userId) {  
    // Đọc mảng định danh quyền của SysMenu  
    List<String> perms = menuMapper.selectMenuPermsByUserId(userId);  
    // Từng cái, tách theo “dấu phẩy”  
    Set<String> permsSet = new HashSet<>();  
    for (String perm : perms) {  
        if (StringUtils.isNotEmpty(perm)) {  
            permsSet.addAll(Arrays.asList(perm.trim().split(",")));  
        }  
    }  
    return permsSet;  
}  
  
// SysMenuMapper.xml  
<select id="selectMenuPermsByUserId" parameterType="Long" resultType="String">  
    select distinct m.perms  
    from sys_menu m  
         left join sys_role_menu rm on m.menu_id = rm.menu_id  
         left join sys_user_role ur on rm.role_id = ur.role_id  
    where ur.user_id = #{userId}  
</select>  
```

*   Mặc dù mã rất dài, nhưng các phần cốt lõi không nhiều.
*   Đầu tiên, nếu SysUser là quản trị viên siêu, thì tập hợp định danh quyền của họ là `*:*:*`, chỉ định có thể thực hiện mọi thao tác trên mọi module.
*   Sau đó, truy vấn bảng `sys_menu`, đồng thời kết nối với các bảng `sys_role_menu`, `sys_user_role`, lấy mảng định danh quyền của SysMenu mà SysUser sở hữu, sau đó sử dụng `","` để tách từng định danh quyền tương ứng của SysMenu.

Tại đây, chúng ta thấy kết quả cuối cùng trả về là [LoginUser](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/framework/security/LoginUser.java), thực hiện giao diện Spring Security [UserDetails](https://github.com/spring-projects/spring-security/blob/master/core/src/main/java/org/springframework/security/core/userdetails/UserDetails.java), thông tin chi tiết người dùng tùy chỉnh. Mã như sau:

```java
// LoginUser.java  
  
public class LoginUser implements UserDetails {  
     
    private static final long serialVersionUID = 1L;  
  
    /** Định danh người dùng duy nhất */  
    private String token;  
  
    /** Thời gian đăng nhập */  
    private Long loginTime;  
  
    /** Thời gian hết hạn */  
    private Long expireTime;  
  
    /** Địa chỉ IP đăng nhập */  
    private String ipaddr;  
  
    /** Địa điểm đăng nhập */  
    private String loginLocation;  
  
    /** Loại trình duyệt */  
    private String browser;  
  
    /** Hệ điều hành */  
    private String os;  
  
    /** Danh sách quyền */  
    private Set<String> permissions;  
  
    /** Thông tin người dùng */  
    private SysUser user;  
      
    // ... Bỏ qua các phương thức set/get và các phương thức triển khai khác  
}  
```

### 7.3.2 Tạo Token xác thực

Trong [TokenService](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/framework/security/service/TokenService.java), phương thức `#createToken(LoginUser loginUser)` được định nghĩa để tạo ra Token xác thực cho người dùng đã xác thực thành công. Dưới đây là mã nguồn:

```java
// TokenService.java  
  
/**  
 * Tạo token  
 *  
 * @param loginUser Thông tin người dùng  
 * @return Token  
 */  
public String createToken(LoginUser loginUser) {  
    // <1> Thiết lập mã định danh duy nhất của LoginUser. Lưu ý, biến này tên là token, nhưng thực tế không phải là Token xác thực  
    String token = IdUtils.fastUUID();  
    loginUser.setToken(token);  
    // <2> Thiết lập thông tin liên quan đến thiết bị người dùng bao gồm IP, thành phố, trình duyệt, hệ điều hành  
    setUserAgent(loginUser);  
  
    // <3> Ghi vào bộ nhớ cache  
    refreshToken(loginUser);  
  
    // <4> Tạo JWT Token  
    Map<String, Object> claims = new HashMap<>();  
    claims.put(Constants.LOGIN_USER_KEY, token);  
    return createToken(claims);  
}  
```

* Lưu ý, phương thức này không chỉ tạo ra Token xác thực mà còn lưu trữ thông tin của `LoginUser` vào Redis cache.

* Ở mục `<1>`, thiết lập mã định danh duy nhất cho `LoginUser`, tức là thuộc tính `LoginUser.token`. Lưu ý, biến `token` này không phải là Token xác thực.

* Ở mục `<2>`, phương thức `#setUserAgent(LoginUser loginUser)` được gọi để thiết lập thông tin liên quan đến thiết bị của người dùng, bao gồm IP, thành phố, trình duyệt và hệ điều hành. Dưới đây là mã nguồn:

```java
// TokenService.java  
  
public void setUserAgent(LoginUser loginUser) {  
    UserAgent userAgent = UserAgent.parseUserAgentString(ServletUtils.getRequest().getHeader("User-Agent"));  
    String ip = IpUtils.getIpAddr(ServletUtils.getRequest());  
    loginUser.setIpaddr(ip);  
    loginUser.setLoginLocation(AddressUtils.getRealAddressByIP(ip));  
    loginUser.setBrowser(userAgent.getBrowser().getName());  
    loginUser.setOs(userAgent.getOperatingSystem().getName());  
}
```

* Ở mục `<3>`, phương thức `#refreshToken(LoginUser loginUser)` được gọi để lưu trữ `LoginUser` vào Redis cache. Dưới đây là mã nguồn:

```yaml
// application.yaml  
# Cấu hình token  
token:  
    # Thời gian hiệu lực của token (mặc định 30 phút)  
    expireTime: 30
```

```java
// Constants.java  
/**  
 * Redis key cho người dùng đăng nhập  
 */  
public static final String LOGIN_TOKEN_KEY = "login_tokens:";  
```

```java
// TokenService.java  
// Thời gian hiệu lực của token (mặc định 30 phút)  
@Value("${token.expireTime}")  
private int expireTime;  
  
@Autowired  
private RedisCache redisCache;  
  
public void refreshToken(LoginUser loginUser) {  
    loginUser.setLoginTime(System.currentTimeMillis());  
    loginUser.setExpireTime(loginUser.getLoginTime() + expireTime * MILLIS_MINUTE);  
    // Lưu trữ loginUser vào cache theo uuid  
    String userKey = getTokenKey(loginUser.getToken());  
    redisCache.setCacheObject(userKey, loginUser, expireTime, TimeUnit.MINUTES);  
}  
  
private String getTokenKey(String uuid) {  
    return Constants.LOGIN_TOKEN_KEY + uuid;  
}  
```

* Key của Redis cache có tiền tố là `"login_tokens:"`, và sử dụng mã định danh duy nhất của `LoginUser.token` làm hậu tố.

* Ở mục `<4>`, phương thức `#createToken(Map<String, Object> claims)` được gọi để tạo JWT Token. Dưới đây là mã nguồn:

```yaml
// application.yaml  
# Cấu hình token  
token:  
    # Secret key của token  
    secret: abcdefghijklmnopqrstuvwxyz  
```

```java
// TokenService.java  
// Secret key của token  
@Value("${token.secret}")  
private String secret;  
  
private String createToken(Map<String, Object> claims) {  
    return Jwts.builder()  
            .setClaims(claims)  
            .signWith(SignatureAlgorithm.HS512, secret).compact();  
}  
```

* Ở đây, chúng ta sử dụng thư viện [`jjwt`](https://mvnrepository.com/artifact/io.jsonwebtoken/jjwt).

* **Lưu ý**, không nhầm lẫn giữa JWT Token được tạo ra ở đây và `LoginUser.token`. `LoginUser.token` được thêm vào `claims` và sau đó JWT Token được tạo ra. Vì vậy, chúng ta có thể giải mã JWT Token để lấy `claims`, từ đó lấy được `LoginUser.token`.

* Việc sử dụng `LoginUser.token` thay vì `userId` trong JWT Token giúp tăng cường bảo mật, tránh trường hợp khi secret bị lộ, kẻ xấu có thể tạo token dựa trên `userId` và truy cập dữ liệu của người dùng.

Từ đây, chúng ta đã hoàn thành quy trình xác thực đăng nhập bằng tên người dùng và mật khẩu.

## 7.4 JwtAuthenticationTokenFilter

Trong [JwtAuthenticationTokenFilter](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/framework/security/filter/JwtAuthenticationTokenFilter.java), kế thừa lớp [OncePerRequestFilter](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/filter/OncePerRequestFilter.java), bộ lọc này thực hiện xác thực dựa trên Token. Mã nguồn như sau:

```java
// JwtAuthenticationTokenFilter.java  
  
@Component  
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {  
  
    @Autowired  
    private TokenService tokenService;  
  
    @Override  
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)  
            throws ServletException, IOException {  
        // <1> Lấy LoginUser hiện tại  
        LoginUser loginUser = tokenService.getLoginUser(request);  
        // Nếu tồn tại LoginUser và chưa được xác thực  
        if (StringUtils.isNotNull(loginUser) && StringUtils.isNull(SecurityUtils.getAuthentication())) {  
            // <2> Xác thực tính hợp lệ của Token  
            tokenService.verifyToken(loginUser);  
            // <3> Tạo đối tượng UsernamePasswordAuthenticationToken và thiết lập vào SecurityContextHolder  
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginUser, null, loginUser.getAuthorities());  
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));  
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);  
        }  
        // <4> Tiếp tục bộ lọc  
        chain.doFilter(request, response);  
    }  
}  
```

* Ở mục `<1>`, phương thức `#getLoginUser(request)` của `TokenService` được gọi để lấy `LoginUser` hiện tại. Mã nguồn như sau:

```yaml
// application.yaml  
\# Cấu hình token  
token:  
    # Tên định danh của token  
    header: Authorization  
```

```java
// TokenService.java  
// Tên định danh của token  
@Value("${token.header}")  
private String header;  
  
/**  
 * Lấy thông tin người dùng  
 *  
 * @return Thông tin người dùng  
 */  
public LoginUser getLoginUser(HttpServletRequest request) {  
    // <1.1> Lấy token từ yêu cầu  
    String token = getToken(request);  
    if (StringUtils.isNotEmpty(token)) {  
        // <1.2> Phân tích JWT Token  
        Claims claims = parseToken(token);  
        // <1.3> Lấy LoginUser từ Redis cache  
        String uuid = (String) claims.get(Constants.LOGIN_USER_KEY);  
        String userKey = getTokenKey(uuid);  
        return redisCache.getCacheObject(userKey);  
    }  
    return null;  
}  
  
private String getToken(HttpServletRequest request) {  
    String token = request.getHeader(header);  
    if (StringUtils.isNotEmpty(token) && token.startsWith(Constants.TOKEN_PREFIX)) {  
        token = token.replace(Constants.TOKEN_PREFIX, "");  
    }  
    return token;  
}  
  
private Claims parseToken(String token) {  
    return Jwts.parser()  
            .setSigningKey(secret)  
            .parseClaimsJws(token)  
            .getBody();  
}  
```

* Ở mục `<1.1>`, phương thức `#getToken(request)` được gọi để lấy Token từ tiêu đề yêu cầu `"Authorization"`.
* Ở mục `<1.2>`, phương thức `#parseToken(token)` được gọi để phân tích JWT Token và lấy đối tượng `Claims`, từ đó lấy mã định danh duy nhất của người dùng (`LoginUser.token`).
* Ở mục `<1.3>`, `LoginUser` tương ứng được lấy từ Redis cache.

* Ở mục `<2>`, phương thức `#verifyToken(LoginUser loginUser)` của `TokenService` được gọi để xác thực thời gian hiệu lực của Token. Mã nguồn như sau:

```java
// TokenService.java  
protected static final long MILLIS_SECOND = 1000;  
protected static final long MILLIS_MINUTE = 60 * MILLIS_SECOND;  
private static final Long MILLIS_MINUTE_TEN = 20 * 60 * 1000L;  
  
/**  
 * Xác thực thời gian hiệu lực của Token, nếu còn dưới 20 phút thì tự động làm mới bộ nhớ cache  
 *  
 * @param loginUser Người dùng  
 */  
public void verifyToken(LoginUser loginUser) {  
    long expireTime = loginUser.getExpireTime();  
    long currentTime = System.currentTimeMillis();  
    // Nếu còn dưới 20 phút thì tự động làm mới cache  
    if (expireTime - currentTime <= MILLIS_MINUTE_TEN) {  
        String token = loginUser.getToken();  
        loginUser.setToken(token);  
        refreshToken(loginUser);  
    }  
}  
```

* Thực tế, phương thức này không chỉ xác thực tính hợp lệ của Token mà còn làm mới thời gian hết hạn của `LoginUser` trong bộ nhớ cache.
* Để tránh làm mới cache mỗi khi có yêu cầu, cache chỉ được làm mới khi thời gian hết hạn còn dưới 20 phút.

* Ở mục `<3>`, đối tượng `UsernamePasswordAuthenticationToken` được **tạo thủ công** và thiết lập vào `SecurityContextHolder` bởi vì quá trình xác thực đã hoàn thành thông qua Token.

* Ở mục `<4>`, tiếp tục quá trình xử lý của bộ lọc.

Nói một cách nghiêm túc, RuoYi-Vue không hoàn toàn sử dụng JWT theo kiểu **không trạng thái** mà chỉ sử dụng phương thức tạo JWT Token.

## 7.5 Xác thực quyền

Trong [「3. Sử dụng nâng cao」](#), chúng ta thấy có thể sử dụng annotation `@PreAuthorize` do Spring Security cung cấp, cho phép truy cập khi kết quả của biểu thức Spring EL là `true`, nhờ đó thực hiện xác thực quyền linh hoạt.

Trong RuoYi-Vue, thông qua tính năng của annotation `@PreAuthorize`, phương thức xác thực quyền của [PermissionService](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/framework/security/service/PermissionService.java) được sử dụng. Ví dụ sử dụng như sau:

```java
// SysDictDataController.java  
  
@PreAuthorize("@ss.hasPermi('system:dict:list')")  
@GetMapping("/list")  
```

* Khi yêu cầu tới API `/system/dict/data/list`, phương thức `#hasPermi(String permission)` của `PermissionService` sẽ được gọi để kiểm tra xem người dùng có quyền được chỉ định hay không.
* Tại sao lại có `@ss` ở đây? Trong biểu thức Spring EL, khi gọi một phương thức của Bean được chỉ định, ta sử dụng `@` + tên của Bean. Trong RuoYi-Vue, tên Bean của `PermissionService` được khai báo là `ss`.

### 7.5.1 Kiểm tra xem có quyền hay không

Trong lớp `PermissionService`, phương thức `#hasPermi(String permission)` được định nghĩa để kiểm tra xem người dùng hiện tại có **quyền** được chỉ định hay không. Mã nguồn như sau:

```java
// PermissionService.java  
  
/**  
 * Tất cả các quyền  
 */  
private static final String ALL_PERMISSION = "*:*:*";  
  
@Autowired  
private TokenService tokenService;  
  
/**  
 * Kiểm tra người dùng có quyền cụ thể không  
 *  
 * @param permission Chuỗi quyền  
 * @return Người dùng có quyền hay không  
 */  
public boolean hasPermi(String permission) {  
    // Nếu không thiết lập quyền cần thiết, mặc định không có quyền.  
    if (StringUtils.isEmpty(permission)) {  
        return false;  
    }  
    // Lấy LoginUser hiện tại  
    LoginUser loginUser = tokenService.getLoginUser(ServletUtils.getRequest());  
    // Nếu không tồn tại hoặc không có quyền nào, xác nhận là không có quyền  
    if (StringUtils.isNull(loginUser) || CollectionUtils.isEmpty(loginUser.getPermissions())) {  
        return false;  
    }  
    // Kiểm tra xem có chứa quyền không  
    return hasPermissions(loginUser.getPermissions(), permission);  
}  
  
/**  
 * Kiểm tra xem có chứa quyền hay không  
 *  
 * @param permissions Danh sách quyền  
 * @param permission Chuỗi quyền  
 * @return Người dùng có quyền hay không  
 */  
private boolean hasPermissions(Set<String> permissions, String permission) {  
    return permissions.contains(ALL_PERMISSION) || permissions.contains(StringUtils.trim(permission));  
}  
```

* Đoạn mã này khá đơn giản, bạn có thể hiểu được qua các chú thích mà tác giả đã thêm vào.

Trong `PermissionService`, phương thức `#lacksPermi(String permission)` được định nghĩa để kiểm tra xem người dùng hiện tại **không có** quyền được chỉ định. Mã nguồn như sau:

```java
// PermissionService.java  
  
/**  
 * Kiểm tra người dùng không có quyền, ngược lại với `hasPermi`  
 *  
 * @param permission Chuỗi quyền  
 * @return Người dùng không có quyền hay không  
 */  
public boolean lacksPermi(String permission) {  
    return !hasPermi(permission);  
}  
```

Trong `PermissionService`, phương thức `#hasAnyPermi(String permissions)` được định nghĩa để kiểm tra xem người dùng hiện tại có **bất kỳ** quyền nào trong danh sách quyền được chỉ định. Mã nguồn như sau:

```java
// PermissionService.java  
  
private static final String PERMISSION_DELIMETER = ",";  
  
/**  
 * Kiểm tra người dùng có bất kỳ quyền nào trong danh sách quyền được chỉ định  
 *  
 * @param permissions Danh sách quyền, ngăn cách bởi PERMISSION_DELIMETER  
 * @return Người dùng có bất kỳ quyền nào trong danh sách hay không  
 */  
public boolean hasAnyPermi(String permissions) {  
    // Nếu không thiết lập quyền cần thiết, mặc định không có quyền.  
    if (StringUtils.isEmpty(permissions)) {  
        return false;  
    }  
    // Lấy LoginUser hiện tại  
    LoginUser loginUser = tokenService.getLoginUser(ServletUtils.getRequest());  
    // Nếu không tồn tại hoặc không có quyền nào, xác nhận là không có quyền  
    if (StringUtils.isNull(loginUser) || CollectionUtils.isEmpty(loginUser.getPermissions())) {  
        return false;  
    }  
    // Kiểm tra xem có bất kỳ quyền nào trong danh sách không  
    Set<String> authorities = loginUser.getPermissions();  
    for (String permission : permissions.split(PERMISSION_DELIMETER)) {  
        if (permission != null && hasPermissions(authorities, permission)) {  
            return true;  
        }  
    }  
    return false;  
}  
```

### 7.5.2 Kiểm tra xem có vai trò hay không

Trong lớp `PermissionService`, phương thức `#hasRole(String role)` được định nghĩa để kiểm tra xem người dùng hiện tại có **vai trò** được chỉ định hay không. Mã nguồn như sau:

```java
// PermissionService.java  
  
/**  
 * Kiểm tra người dùng có vai trò cụ thể hay không  
 *  
 * @param role Chuỗi vai trò  
 * @return Người dùng có vai trò hay không  
 */  
public boolean hasRole(String role) {  
    // Nếu không thiết lập vai trò cần thiết, mặc định không có vai trò.  
    if (StringUtils.isEmpty(role)) {  
        return false;  
    }  
    // Lấy LoginUser hiện tại  
    LoginUser loginUser = tokenService.getLoginUser(ServletUtils.getRequest());  
    // Nếu không tồn tại hoặc không có vai trò nào, xác nhận là không có quyền  
    if (StringUtils.isNull(loginUser) || CollectionUtils.isEmpty(loginUser.getUser().getRoles())) {  
        return false;  
    }  
    // Kiểm tra xem có chứa vai trò chỉ định không  
    for (SysRole sysRole : loginUser.getUser().getRoles()) {  
        String roleKey = sysRole.getRoleKey();  
        if (SUPER_ADMIN.contains(roleKey) // Xử lý đặc biệt cho Quản trị viên cao cấp  
                || roleKey.contains(StringUtils.trim(role))) {  
            return true;  
        }  
    }  
    return false;  
}  
```

* Đoạn mã này khá đơn giản, các chú thích đã được tác giả thêm vào để bạn dễ dàng hiểu.

Trong `PermissionService`, phương thức `#lacksRole(String role)` được định nghĩa để kiểm tra xem người dùng hiện tại **không có** vai trò được chỉ định. Mã nguồn như sau:

```java
// PermissionService.java  
  
/**  
 * Kiểm tra người dùng không có vai trò, ngược lại với `hasRole`  
 *  
 * @param role Tên vai trò  
 * @return Người dùng không có vai trò hay không  
 */  
public boolean lacksRole(String role) {  
    return !hasRole(role);  
}  
```

Trong `PermissionService`, phương thức `#hasAnyRoles(String roles)` được định nghĩa để kiểm tra xem người dùng hiện tại có **bất kỳ** vai trò nào trong danh sách vai trò được chỉ định. Mã nguồn như sau:

```java
// PermissionService.java  
  
private static final String ROLE_DELIMETER = ",";  
  
/**  
 * Kiểm tra người dùng có bất kỳ vai trò nào trong danh sách vai trò được chỉ định  
 *  
 * @param roles Danh sách vai trò, ngăn cách bởi ROLE_DELIMETER  
 * @return Người dùng có bất kỳ vai trò nào trong danh sách hay không  
 */  
public boolean hasAnyRoles(String roles) {  
    // Nếu không thiết lập vai trò cần thiết, mặc định không có vai trò.  
    if (StringUtils.isEmpty(roles)) {  
        return false;  
    }  
    // Lấy LoginUser hiện tại  
    LoginUser loginUser = tokenService.getLoginUser(ServletUtils.getRequest());  
    // Nếu không tồn tại hoặc không có vai trò nào, xác nhận là không có quyền  
    if (StringUtils.isNull(loginUser) || CollectionUtils.isEmpty(loginUser.getUser().getRoles())) {  
        return false;  
    }  
    // Kiểm tra xem có chứa bất kỳ vai trò nào trong danh sách không  
    for (String role : roles.split(ROLE_DELIMETER)) {  
        if (hasRole(role)) { // Ở đây có vấn đề nhỏ, sẽ lặp lại việc gọi phương thức hasRole và đọc LoginUser từ Redis nhiều lần  
            return true;  
        }  
    }  
    return false;  
}  
```

## 7.6 Các bộ xử lý khác nhau

Trong Ruoyi-Vue, có nhiều bộ xử lý khác nhau để xử lý các tình huống khác nhau, vì vậy chúng tôi đã tổng hợp trong phần [「7.6 Các bộ xử lý khác nhau」](#) để cùng xem.

### 7.6.1 AuthenticationEntryPointImpl

Trong [AuthenticationEntryPointImpl](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/framework/security/handle/AuthenticationEntryPointImpl.java), giao diện `AuthenticationEntryPoint` của Spring Security được triển khai để xử lý ngoại lệ `AuthenticationException` khi xác thực thất bại. Mã nguồn như sau:

```java
// AuthenticationEntryPointImpl.java  
  
// Lớp xử lý khi xác thực thất bại, trả về không được ủy quyền  
@Component  
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint, Serializable {  
  
    private static final long serialVersionUID = -8970718410437077606L;  
  
    @Override  
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException e) {  
        // Phản hồi khi xác thực không thành công  
        int code = HttpStatus.UNAUTHORIZED;  
        String msg = StringUtils.format("Yêu cầu truy cập：{}，xác thực thất bại，không thể truy cập tài nguyên hệ thống", request.getRequestURI());  
        ServletUtils.renderString(response, JSON.toJSONString(AjaxResult.error(code, msg)));  
    }  
}  
```

* Phản hồi là chuỗi JSON khi xác thực không thành công.

### 7.6.2 GlobalExceptionHandler

Trong [GlobalExceptionHandler](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/framework/web/exception/GlobalExceptionHandler.java), định nghĩa xử lý ngoại lệ cho Spring Security. Mã nguồn như sau:

```java
// GlobalExceptionHandler.java  
  
@RestControllerAdvice  
public class GlobalExceptionHandler {  
  
   @ExceptionHandler(AccessDeniedException.class) // Không có quyền truy cập. Khi sử dụng `@PreAuthorize` để kiểm tra quyền không thành công, sẽ ném ra ngoại lệ AccessDeniedException  
    public AjaxResult handleAuthorizationException(AccessDeniedException e) {  
        log.error(e.getMessage());  
        return AjaxResult.error(HttpStatus.FORBIDDEN, "Không có quyền, vui lòng liên hệ với quản trị viên để được cấp quyền");  
    }  
  
    @ExceptionHandler(AccountExpiredException.class) // Tài khoản đã hết hạn  
    public AjaxResult handleAccountExpiredException(AccountExpiredException e) {  
        log.error(e.getMessage(), e);  
        return AjaxResult.error(e.getMessage());  
    }  
  
    @ExceptionHandler(UsernameNotFoundException.class) // Tên người dùng không tồn tại  
    public AjaxResult handleUsernameNotFoundException(UsernameNotFoundException e) {  
        log.error(e.getMessage(), e);  
        return AjaxResult.error(e.getMessage());  
    }  
  
    // ... Bỏ qua các phương thức xử lý ngoại lệ khác  
}  
```

* Dựa trên `@RestControllerAdvice` + `@ExceptionHandler` do Spring MVC cung cấp, thực hiện xử lý ngoại lệ toàn cục. Nếu bạn chưa hiểu, có thể tham khảo phần [「5. Xử lý ngoại lệ toàn cục」](http://www.iocoder.cn/Spring-Boot/SpringMVC/?self) trong tài liệu [Spring Boot SpringMVC](./springmvc).
### 7.6.3 LogoutSuccessHandlerImpl

Trong [LogoutSuccessHandlerImpl](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/framework/security/handle/LogoutSuccessHandlerImpl.java), giao diện `LogoutSuccessHandler` của Spring Security được triển khai để tùy chỉnh xử lý khi người dùng đăng xuất, chủ động xóa bộ nhớ cache của `LoginUser` trong Redis. Mã nguồn như sau:

```java
// LogoutSuccessHandlerImpl.java  
  
// Lớp xử lý đăng xuất tùy chỉnh, trả về thành công  
@Configuration  
public class LogoutSuccessHandlerImpl implements LogoutSuccessHandler {  
  
    @Autowired  
    private TokenService tokenService;  
  
    /**  
     * Xử lý đăng xuất  
     */  
    @Override  
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {  
        // <1> Lấy `LoginUser` hiện tại  
        LoginUser loginUser = tokenService.getLoginUser(request);  
        // Nếu có đăng nhập  
        if (StringUtils.isNotNull(loginUser)) {  
            String userName = loginUser.getUsername();  
            // <2> Xóa ghi chú bộ nhớ cache của người dùng  
            tokenService.delLoginUser(loginUser.getToken());  
            // <3> Ghi lại nhật ký đăng xuất của người dùng  
            AsyncManager.me().execute(AsyncFactory.recordLogininfor(userName, Constants.LOGOUT, "Đăng xuất thành công"));  
        }  
        // <4> Phản hồi thành công khi đăng xuất  
        ServletUtils.renderString(response, JSON.toJSONString(AjaxResult.error(HttpStatus.SUCCESS, "Đăng xuất thành công")));  
    }  
}  
```

* Tại `<1>`, gọi phương thức `#getLoginUser(request)` của `TokenService` để lấy `LoginUser` hiện tại.

* Tại `<2>`, gọi phương thức `#delLoginUser(String token)` của `TokenService` để xóa bộ nhớ cache của `LoginUser` trong Redis. Mã nguồn như sau:

```java
// TokenService.java  
  
public void delLoginUser(String token) {  
    if (StringUtils.isNotEmpty(token)) {  
        String userKey = getTokenKey(token);  
        // Xóa bộ nhớ cache  
        redisCache.deleteObject(userKey);  
    }  
}  
```

* Tại `<3>`, ghi lại nhật ký thành công của việc đăng xuất.

* Tại `<4>`, phản hồi là chuỗi JSON thành công khi đăng xuất.

## 7.7 Nhật ký đăng nhập

[SysLogininfor](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/monitor/domain/SysLogininfor.java), thực thể nhật ký đăng nhập. Mã như sau:

```java
Here’s the translation from Vietnamese to English:

```java
// SysLogininfor.java  

public class SysLogininfor extends BaseEntity  {  

    private static final long serialVersionUID = 1L;  

    @Excel(name = "Serial Number", cellType = ColumnType.NUMERIC)  
    private Long infoId;  

    @Excel(name = "User Account")  
    private String userName;  

    @Excel(name = "Login Status", readConverterExp = "0=Success,1=Failure")  
    private String status;  

    @Excel(name = "Login Address")  
    private String ipaddr;  

    @Excel(name = "Login Location")  
    private String loginLocation;  

    @Excel(name = "Browser")  
    private String browser;  

    @Excel(name = "Operating System")  
    private String os;  

    @Excel(name = "Message")  
    private String msg;  

    @Excel(name = "Access Time", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")  
    private Date loginTime;  
      
    // ...skip set/get methods  
}  
``````

*   Mỗi trường khá đơn giản, bạn có thể hiểu dựa trên chú thích.

SQL tạo bảng tương ứng như sau:

```sql
create table sys_logininfor (  
  info_id        bigint(20)     not null auto_increment   comment 'Access ID',  
  user_name      varchar(50)    default ''                comment 'User account',  
  ipaddr         varchar(50)    default ''                comment 'Login IP address',  
  login_location varchar(255)   default ''                comment 'Login location',  
  browser        varchar(50)    default ''                comment 'Browser type',  
  os             varchar(50)    default ''                comment 'Operating system',  
  status         char(1)        default '0'               comment 'Login status (0 success 1 failure)',  
  msg            varchar(255)   default ''                comment 'Message',  
  login_time     datetime                                 comment 'Access time',  
  primary key (info_id)  
) engine=innodb auto_increment=100 comment = 'System access record';  
```

Trong RuoYi-Vue, quy trình ghi lại SysLogininfor như sau:

*   Đầu tiên, **thủ công** gọi [`AsyncFactory#recordLogininfor(username, status, message, args)`](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/framework/manager/factory/AsyncFactory.java#L27-L80) để tạo một tác vụ Java [TimerTask](https://github.com/openjdk-mirror/jdk7u-jdk/blob/master/src/share/classes/java/util/TimerTask.java).
*   Sau đó gọi [`AsyncManager#execute(TimerTask task)`](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/framework/manager/AsyncManager.java#L38-L46) để nộp vào luồng tác vụ định kỳ, sau `OPERATE_DELAY_TIME = 10` giây, lưu bản ghi này vào cơ sở dữ liệu.

Lợi ích của điều này là có thể thực hiện việc lưu nhật ký vào cơ sở dữ liệu một cách **bất đồng bộ**, nâng cao hiệu suất của API. Tuy nhiên, thực tế là Spring cung cấp chú thích `@Async`, giúp thực hiện các thao tác bất đồng bộ một cách tiện lợi. Những ai không hiểu có thể tham khảo [《Giới thiệu về tác vụ bất đồng bộ Spring Boot》](http://www.iocoder.cn/Spring-Boot/Async-Job/?self).

Ngoài ra, trong RuoYi-Vue còn định nghĩa [SysOperLog](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/monitor/domain/SysOperLog.java), lớp thực thể nhật ký thao tác. Những ai quan tâm có thể tự xem.
## 7. API lấy thông tin người dùng

Trong [SysLoginController](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/system/controller/SysLoginController.java), định nghĩa giao diện `/getInfo` để lấy thông tin người dùng đã đăng nhập. Mã như sau:

```java
// SysLoginController.java  
  
/**  
 * Lấy thông tin người dùng  
 *  
 * @return Thông tin người dùng  
 */  
@GetMapping("getInfo")  
public AjaxResult getInfo() {  
    // <1> Lấy LoginUser hiện tại  
    LoginUser loginUser = tokenService.getLoginUser(ServletUtils.getRequest());  
    SysUser user = loginUser.getUser();  
    // <2> Tập hợp các vai trò  
    Set<String> roles = permissionService.getRolePermission(user);  
    // <3> Tập hợp các quyền  
    Set<String> permissions = permissionService.getMenuPermission(user);  
    // <4> Trả về kết quả  
    AjaxResult ajax = AjaxResult.success();  
    ajax.put("user", user);  
    ajax.put("roles", roles);  
    ajax.put("permissions", permissions);  
    return ajax;  
}  
```

*   Tại `<1>`, gọi phương thức `#getLoginUser(request)` của TokenService để lấy LoginUser hiện tại.
    
*   Tại `<2>`, gọi phương thức `#getRolePermission(SysUser user)` của PermissionService để lấy tập hợp các **định danh** vai trò mà LoginUser sở hữu. Mã như sau:
    
```java
// SysPermissionService.java  
@Autowired  
private ISysRoleService roleService;  
      
/**  
 * Lấy quyền dữ liệu của vai trò  
 *  
 * @param user Thông tin người dùng  
 * @return Thông tin quyền vai trò  
 */  
public Set<String> getRolePermission(SysUser user) {  
    Set<String> roles = new HashSet<String>();  
    // Quản trị viên có tất cả quyền  
    if (user.isAdmin()) { // Nếu là quản trị viên, thêm vai trò admin  
        roles.add("admin");  
    } else { // Nếu không phải quản trị viên, thực hiện truy vấn  
        roles.addAll(roleService.selectRolePermissionByUserId(user.getUserId()));  
    }  
    return roles;  
}  
      
// SysRoleServiceImpl.java  
      
@Autowired  
private SysRoleMapper roleMapper;  
          
/**  
 * Truy vấn quyền theo ID người dùng  
 *  
 * @param userId ID người dùng  
 * @return Danh sách quyền  
 */  
@Override  
public Set<String> selectRolePermissionByUserId(Long userId) {  
    // Lấy mảng SysRole mà userId sở hữu  
    List<SysRole> perms = roleMapper.selectRolePermissionByUserId(userId);  
    // Duyệt qua mảng SysRole, tạo mảng định danh vai trò  
    Set<String> permsSet = new HashSet<>();  
    for (SysRole perm : perms) {  
        if (StringUtils.isNotNull(perm)) {  
            permsSet.addAll(Arrays.asList(perm.getRoleKey().trim().split(",")));  
        }  
    }  
    return permsSet;  
}  
      
// SysRoleMapper.xml  
<sql id="selectRoleVo">  
    select distinct r.role_id, r.role_name, r.role_key, r.role_sort, r.data_scope,  
        r.status, r.del_flag, r.create_time, r.remark   
    from sys_role r  
        left join sys_user_role ur on ur.role_id = r.role_id  
        left join sys_user u on u.user_id = ur.user_id  
        left join sys_dept d on u.dept_id = d.dept_id  
</sql>  
      
<select id="selectRolePermissionByUserId" parameterType="Long" resultMap="SysRoleResult">  
    <include refid="selectRoleVo"/>  
    WHERE r.del_flag = '0' and ur.user_id = #{userId}  
</select>  
```

*   Thông qua truy vấn bảng `sys_role`, đồng thời kết nối với các bảng `sys_user_role`, `sys_user`, `sys_dept`, sẽ truy vấn một lần tất cả thông tin liên quan đến SysRole tương ứng với `userId`.
*   Để xem định nghĩa cụ thể của kết quả trả về `SysRoleResult`, nhấn vào [đây](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/resources/mybatis/system/SysRoleMapper.xml#L7-L20), thực tế chính là lớp thực thể SysRole.
*   Tại `<3>`, gọi phương thức `#getMenuPermission(SysUser user)` của SysPermissionService để lấy tập hợp các chuỗi **định danh** quyền của SysRoleMenu mà người dùng có.

*   Tại `<4>`, trả về kết quả AjaxResult chứa thông tin người dùng.

Bằng cách gọi giao diện `/getInfo`, phía trước có thể thực hiện kiểm soát quyền ở cấp độ **nút** trên giao diện dựa vào **định danh** vai trò hoặc **định danh** quyền, để hiển thị khi có quyền và ẩn khi không có quyền.

## 7.9 Lấy thông tin định tuyến

Trong [SysLoginController](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/system/controller/SysLoginController.java), định nghĩa giao diện `/getRouters` để lấy thông tin định tuyến. Mã như sau:

```java
// SysLoginController.java  
  
@GetMapping("getRouters")  
public AjaxResult getRouters() {  
    // Lấy LoginUser hiện tại  
    LoginUser loginUser = tokenService.getLoginUser(ServletUtils.getRequest());  
    // Lấy mảng SysMenu của người dùng  
    SysUser user = loginUser.getUser();  
    List<SysMenu> menus = menuService.selectMenuTreeByUserId(user.getUserId());  
    // Xây dựng mảng RouterVo. Có thể sử dụng để xây dựng menu bên trái trong quản lý Vue  
    return AjaxResult.success(menuService.buildMenus(menus));  
}  
```

*   Mã cụ thể rất đơn giản, bạn có thể tự đọc thêm nhé, hehe.

Bằng cách gọi giao diện `/getRouters`, phía trước có thể xây dựng menu bên trái cho quản lý.

## 7.10 Quản lý quyền

Dưới đây là Controller, cung cấp chức năng **quản lý quyền** cho RuoYi-Vue, rất đơn giản, bạn có thể xem qua.

*   Quản lý người dùng [SysUserController](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/system/controller/SysUserController.java): Người dùng là người thao tác hệ thống, chức năng này chủ yếu thực hiện cấu hình người dùng trong hệ thống.
*   Quản lý vai trò [SysRoleController](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/system/controller/SysRoleController.java): Phân phối quyền menu cho vai trò, thiết lập phân chia quyền theo phạm vi dữ liệu theo tổ chức.
*   Quản lý menu [SysMenuController](https://github.com/YunaiV/RuoYi-Vue/blob/master/ruoyi/src/main/java/com/ruoyi/project/system/controller/SysMenuController.java): Cấu hình menu của hệ thống, quyền thao tác, định danh quyền nút, v.v.

## 7.11 Một vài gợi ý nhỏ

Đến đây, chúng ta đã hoàn thành việc giải thích mã nguồn liên quan đến quyền của RuoYi-Vue, hy vọng sẽ có ích cho bạn. Nếu dự án của bạn cần các chức năng liên quan đến quyền, khuyên bạn không nên sao chép trực tiếp mã của RuoYi-Vue, mà hãy thực hiện "tái" hiện lại theo cách hiểu của riêng bạn, **từng chút một**. Trong quá trình này, bạn sẽ có hiểu biết sâu sắc hơn và có thể có một số đổi mới nhỏ của riêng mình.

# 666. Tổng kết

So với những bài viết khác, đây thực sự là một bài viết tâm huyết, bạn có đồng ý không, hehe.

Ở đây tôi cũng muốn giới thiệu một số nội dung hay về RabbitMQ:

*   [《Nguyên lý và phân tích mã nguồn của Spring Security —— Bộ sưu tập chất lượng》](http://www.iocoder.cn/Spring-Security/good-collection/?self)
*   [《Làm thế nào để thiết kế mô-đun quản lý quyền (kèm cấu trúc bảng)？》](http://www.iocoder.cn/Fight/How-to-design-permission-management-module-schedule-structure/?self)

Tuy nhiên, trong dự án thực tế, nhóm chúng tôi đã không sử dụng Spring Security hay Shiro làm khung bảo mật, mà đã tự phát triển một thành phần nhẹ hơn. Lý do chính là sau khi tách biệt front-end và back-end, nhiều chức năng tích hợp sẵn trong Spring Security đã không còn cần thiết, và việc mở rộng một số chức năng cũng không được thuận tiện, có phần “khó khăn”, vì vậy chúng tôi đã chọn phát triển riêng.