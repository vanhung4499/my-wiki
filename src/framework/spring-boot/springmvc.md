---
title: SpringMVC
tags:
  - java
  - spring-boot
categories:
  - spring-boot
order: 7
---
# SpringMVC

---

> Bài viết này cung cấp mã nguồn đầy đủ, bạn có thể xem tại [https://github.com/YunaiV/SpringBoot-Labs](https://github.com/YunaiV/SpringBoot-Labs) trong thư mục [lab-23](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23).
> 
> Việc sáng tạo nội dung không hề dễ dàng, hãy ủng hộ mình bằng cách tặng một [Star](https://github.com/YunaiV/SpringBoot-Labs/stargazers), cùng nhau phát triển nhé!

# 1. Tổng quan

Nếu bạn đã từng làm việc với phát triển Java Web từ sớm, có thể bạn đã biết đến những framework Web MVC dưới đây. Thời kỳ đó là thời đại mà [Struts2](https://struts.apache.org/) và [SpringMVC](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html) cùng nhau thống trị. Thậm chí, khi đi phỏng vấn, một câu hỏi phổ biến là: "Sự khác biệt giữa SpringMVC và Struts2 là gì?"

Hiện nay, SpringMVC gần như đã chiếm lĩnh hoàn toàn vị trí của các framework Web MVC khác, và rất hiếm khi bạn gặp phải một dự án không sử dụng SpringMVC.

> Nếu hiện tại bạn gặp phải một công việc với Struts thì tôi khuyên bạn là hãy bỏ qua nó vì nó đã rất cũ!

So với Struts2, SpringMVC dễ sử dụng hơn và có hiệu suất tốt hơn, với cách triển khai rõ ràng và sáng sủa hơn. Quan trọng hơn cả, SpringMVC có một hệ sinh thái mạnh mẽ và cộng đồng rất sôi động.

Vì đây là một bài viết hướng dẫn tích hợp Spring Boot với SpringMVC, mình sẽ không nói thêm nhiều, mà sẽ đi thẳng vào phần hướng dẫn nhập môn nhanh. Tuy nhiên, cần lưu ý rằng, bạn nên nắm rõ quy trình xử lý yêu cầu của SpringMVC để có thể hiểu thấu đáo cách nó hoạt động.

# 2. Hướng dẫn nhanh

> Mã ví dụ tương ứng với kho lưu trữ: [lab-springmvc-23-01](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-01).

Trong phần này, chúng ta sẽ sử dụng [`spring-boot-starter-web`](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web) để triển khai cấu hình tự động của SpringMVC. Sau đó, thực hiện các API cho việc thêm, xóa, sửa, và xem thông tin người dùng. Danh sách API như sau:

| Phương thức | URL           | Chức năng                             |
| ----------- | ------------- | ------------------------------------- |
| `GET`       | `/users`      | Xem danh sách người dùng              |
| `GET`       | `/users/{id}` | Lấy thông tin người dùng theo ID      |
| `POST`      | `/users`      | Thêm người dùng                       |
| `PUT`       | `/users/{id}` | Cập nhật thông tin người dùng theo ID |
| `DELETE`    | `/users/{id}` | Xóa người dùng theo ID                |

Bây giờ, hãy bắt đầu hành trình khám phá!

## 2.1 Các chú thích (Annotation)

Có thể một số bạn chưa từng sử dụng SpringMVC trước đây, nên trong phần này, chúng ta sẽ giới thiệu các chú thích mà SpringMVC cung cấp.

* `@Controller`
* `@RestController`
* `@RequestMapping`
* `@GetMapping`
* `@PostMapping`
* `@PutMapping`
* `@RequestParam`
* `@PathVariable`

Những bạn đã quen thuộc có thể lướt qua hoặc bỏ qua phần này.

### 2.1.1 @Controller

Chú thích [`@Controller`](https://github.com/spring-projects/spring-framework/blob/master/spring-context/src/main/java/org/springframework/stereotype/Controller.java) được thêm vào lớp, cho biết đây là một đối tượng Controller. Thuộc tính như sau:

* Thuộc tính `name`: tên của đối tượng Controller. Có thể để trống.

Chú thích [`@RestController`](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/bind/annotation/RestController.java) là sự kết hợp giữa `@Controller` và [`@ResponseBody`](https://github.com/ndimiduk/spring-framework/blob/master/org.springframework.web/src/main/java/org/springframework/web/bind/annotation/ResponseBody.java), tự động trả về kết quả của phương thức API dưới dạng JSON/XML mà không cần trình xử lý view.

Hiện nay, kiến trúc phổ biến là kiến trúc **tách biệt front-end và back-end**, trong đó back-end chỉ cung cấp các API và trả về dữ liệu. Vì vậy, 99,99% các dự án đều sử dụng chú thích `@RestController`.

Thường thì API chúng ta cung cấp có phong cách Restful hoặc gần giống Restful. Nếu bạn chưa quen, có thể tham khảo hai bài viết sau:

* [“Thực hành tốt nhất cho RESTful API”](http://www.iocoder.cn/Fight/estful-api-best-practices.html)
* [“Học thiết kế Restful HTTP API từ GitHub”](http://www.iocoder.cn/Fight/Learn-Restful-HTTP-API-design-from-Github)

### 2.1.2 @RequestMapping

Chú thích [`@RequestMapping`](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/bind/annotation/RequestMapping.java) được thêm vào lớp hoặc phương thức để cấu hình thông tin về các API.

Thuộc tính **thường dùng** của `@RequestMapping`:

* `path`: Đường dẫn API. Là một mảng `[]`, có thể chỉ định nhiều đường dẫn.
* `values`: Tương tự như thuộc tính `path`, là một tên khác của nó.
* `method`: Phương thức yêu cầu (GET, POST, PUT, DELETE,...). Là một mảng `[]`, có thể chỉ định nhiều phương thức. Nếu để trống, mặc định sẽ chấp nhận mọi phương thức.

Thuộc tính **ít dùng hơn** của `@RequestMapping`:

* `name`: Tên API. Thường không được điền.
* `params`: Các tham số yêu cầu phải có trong yêu cầu.
* `headers`: Tương tự như `params`, nhưng cho tiêu đề yêu cầu (headers).
* `consumes`: Định nghĩa loại dữ liệu đầu vào (Content-Type).
* `produces`: Định nghĩa loại dữ liệu trả về (Accept).

Spring cung cấp các chú thích ngắn gọn hơn cho mỗi phương thức yêu cầu:

* [`@GetMapping`](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/bind/annotation/GetMapping.java): Tương ứng với yêu cầu GET.
* [`@PostMapping`](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/bind/annotation/PostMapping.java): Tương ứng với yêu cầu POST.
* [`@PutMapping`](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/bind/annotation/PutMapping.java): Tương ứng với yêu cầu PUT.
* [`@DeleteMapping`](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/bind/annotation/DeleteMapping.java): Tương ứng với yêu cầu DELETE.

### 2.1.3 @RequestParam

Chú thích [`@RequestParam`](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/bind/annotation/RequestParam.java) được dùng để ánh xạ tham số yêu cầu từ URL vào phương thức.

Các thuộc tính:

* `name`: Tên tham số yêu cầu.
* `value`: Tên khác của `name`.
* `required`: Có bắt buộc phải truyền tham số hay không. Mặc định là `true`.
* `defaultValue`: Giá trị mặc định nếu tham số không được truyền.

Chú thích [`@PathVariable`](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/bind/annotation/PathVariable.java) dùng để ánh xạ giá trị từ URL vào biến của phương thức.
## 2.2 Thêm phụ thuộc

Trong tệp [`pom.xml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-01/pom.xml), hãy thêm các phụ thuộc cần thiết.

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

    <artifactId>lab-springmvc-23-01</artifactId>

    <dependencies>
        <!-- Tự động cấu hình Spring MVC -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Dễ dàng viết kiểm thử đơn vị -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

    </dependencies>

</project>
```

Mỗi phụ thuộc cụ thể có tác dụng gì, bạn hãy xem kỹ các chú thích mà tác giả đã thêm vào.

## 2.3 Application

Tạo lớp [`Application.java`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-01/src/main/java/cn/iocoder/springboot/lab23/springmvc/Application.java) và cấu hình chú thích `@SpringBootApplication`. Mã như sau:

```java
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

Tạm thời chưa khởi động dự án. Chúng ta sẽ làm điều đó sau khi thêm Controller.

## 2.4 UserController

Trong đường dẫn gói [`cn.iocoder.springboot.lab23.springmvc`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-01/src/main/java/cn/iocoder/springboot/lab23/springmvc/controller/), tạo lớp [UserController](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-01/src/main/java/cn/iocoder/springboot/lab23/springmvc/controller/UserController.java). Mã như sau:

```java
// UserController.java

@RestController
@RequestMapping("/users")
public class UserController {

    /**
     * Truy vấn danh sách người dùng
     *
     * @return danh sách người dùng
     */
    @GetMapping("")
    public List<UserVO> list() {
        // Truy vấn danh sách
        List<UserVO> result = new ArrayList<>();
        result.add(new UserVO().setId(1).setUsername("yudaoyuanma"));
        result.add(new UserVO().setId(2).setUsername("woshiyutou"));
        result.add(new UserVO().setId(3).setUsername("chifanshuijiao"));
        // Trả về danh sách
        return result;
    }

    /**
     * Nhận người dùng theo ID xác định
     *
     * @param id ID người dùng
     * @return người dùng
     */
    @GetMapping("/{id}")
    public UserVO get(@PathVariable("id") Integer id) {
        // Truy vấn và trả về người dùng
        return new UserVO().setId(id).setUsername("username:" + id);
    }

    /**
     * Thêm người dùng
     *
     * @param addDTO thông tin người dùng cần thêm
     * @return ID người dùng đã thêm thành công
     */
    @PostMapping("")
    public Integer add(UserAddDTO addDTO) {
        // Chèn bản ghi người dùng và trả về ID
        Integer returnId = 1;
        // Trả về ID người dùng
        return returnId;
    }

    /**
     * Cập nhật người dùng theo ID xác định
     *
     * @param id ID người dùng
     * @param updateDTO thông tin người dùng cần cập nhật
     * @return trạng thái cập nhật thành công
     */
    @PutMapping("/{id}")
    public Boolean update(@PathVariable("id") Integer id, UserUpdateDTO updateDTO) {
        // Đặt ID vào updateDTO
        updateDTO.setId(id);
        // Cập nhật bản ghi người dùng
        Boolean success = true;
        // Trả về trạng thái cập nhật
        return success;
    }

    /**
     * Xóa người dùng theo ID xác định
     *
     * @param id ID người dùng
     * @return trạng thái xóa thành công
     */
    @DeleteMapping("/{id}")
    public Boolean delete(@PathVariable("id") Integer id) {
        // Xóa bản ghi người dùng
        Boolean success = false;
        // Trả về trạng thái xóa
        return success;
    }

}
```

- Thêm chú thích `@RestController` lên lớp, cho biết rằng sẽ trả về kết quả trực tiếp từ API. Mặc định, JSON được sử dụng làm phương thức tuần tự hóa.
  
- Thêm chú thích `@RequestMapping("/users")` lên lớp, cho biết rằng tất cả các đường dẫn API của UserController đều bắt đầu bằng `/users`.
  
- Phương thức `#list()` truy vấn danh sách người dùng. Yêu cầu tương ứng với `GET /users`, kết quả yêu cầu là:
  
    ```json
    [
        {
            "id": 1,
            "username": "yudaoyuanma"
        },
        {
            "id": 2,
            "username": "woshiyutou"
        },
        {
            "id": 3,
            "username": "chifanshuijiao"
        }
    ]
    ```
  
    * Trong đó, [UserVO](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-01/src/main/java/cn/iocoder/springboot/lab23/springmvc/vo/UserVO.java) là lớp VO trả về cho người dùng.
  
- Phương thức `#get(Integer id)` nhận người dùng theo ID xác định. Yêu cầu tương ứng với `GET /users/{id}` [tham số đường dẫn], kết quả yêu cầu là:
  
    ```json
    {
        "id": 1,
        "username": "username:1"
    }
    ```
  
- Phương thức `#add(UserAddDTO addDTO)` thêm người dùng. Yêu cầu tương ứng với `POST /users`, kết quả yêu cầu là:
  
    ```
    1
    ```
  
    * Bởi vì chúng ta trả về kiểu Integer, không cần phải sử dụng JSON để tuần tự hóa trả về cho các đối tượng không phải POJO.
    * Trong đó, [UserAddDTO](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-01/src/main/java/cn/iocoder/springboot/lab23/springmvc/dto/UserAddDTO.java) là lớp DTO để thêm người dùng.
  
- Phương thức `#update(Integer id, UserUpdateDTO updateDTO)` cập nhật người dùng theo ID xác định. Yêu cầu tương ứng với `PUT /users/{id}` [tham số đường dẫn], kết quả yêu cầu là:
  
    ```
    true
    ```
  
    * Trong đó, [UserUpdateDTO](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-01/src/main/java/cn/iocoder/springboot/lab23/springmvc/dto/UserUpdateDTO.java) là lớp DTO để cập nhật người dùng.
  
- Phương thức `#delete(Integer id)` xóa người dùng theo ID xác định. Yêu cầu tương ứng với `DELETE /users/{id}` [tham số đường dẫn], kết quả yêu cầu là:
  
    ```
    false
    ```

Tất cả các bài kiểm tra trên chắc chắn cần phải thông qua việc chạy ứng dụng, khởi động dự án. Dưới đây là nhật ký khởi động của nó:

```
2019-11-15 18:46:00.671  INFO 99493 --- [           main] c.i.s.lab23.springmvc.Application        : Starting Application on MacBook-Pro-8 with PID 99493 (/Users/yunai/Java/SpringBoot-Labs/lab-23/lab-springmvc-23-01/target/classes started by yunai in /Users/yunai/Java/SpringBoot-Labs)
2019-11-15 18:46:00.673  INFO 99493 --- [           main] c.i.s.lab23.springmvc.Application        : No active profile set, falling back to default profiles: default
2019-11-15 18:46:01.593  INFO 99493 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2019-11-15 18:46:01.613  INFO 99493 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2019-11-15 18:46:01.613  INFO 99493 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.16]
2019-11-15 18:46:01.619  INFO 99493 --- [           main] o.a.catalina.core.AprLifecycleListener   : The APR based Apache Tomcat Native library which allows optimal performance in production environments was not found on the java.library.path: [/Users/yunai/Library/Java/Extensions:/Library/Java/Extensions:/Network/Library/Java/Extensions:/System/Library/Java/Extensions:/usr/lib/java:.]
2019-11-15 18:46:01.684  INFO 99493 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2019-11-15 18:46:01.684  INFO 99493 --- [           main] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 976 ms
2019-11-15 18:46:01.844  INFO 99493 --- [           main] o.s.s.concurrent.ThreadPoolTaskExecutor  : Initializing ExecutorService 'applicationTaskExecutor'
2019-11-15 18:46:01.987  INFO 99493 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2019-11-15 18:46:01.990  INFO 99493 --- [           main] c.i.s.lab23.springmvc.Application        : Started Application in 1.559 seconds (JVM running for 2.146)
```

- Chúng ta có thể thấy, Spring Boot khi khởi động Spring MVC sẽ tự động khởi tạo một Tomcat, lắng nghe các yêu cầu trên cổng 8080.
## 2.5 UserController2

Trong quá trình phát triển dự án hàng ngày, tôi chỉ sử dụng phương thức yêu cầu `GET` và `POST`. Nguyên nhân chính là trong thực tế, vì các tình huống nghiệp vụ tương đối phức tạp, API Restful tiêu chuẩn không thể đáp ứng tất cả các thao tác. Ví dụ, đơn hàng có thể bị người dùng hủy, quản trị viên hủy, thay đổi địa chỉ giao hàng, đánh giá, v.v. Vì vậy, chúng tôi thường cung cấp **API tương tự** Restful hơn.

Đối với tham số đường dẫn `@PathVariable` mà SpringMVC cung cấp, tôi hiện chưa sử dụng trong dự án, lý do chính là:

1. **Khung quyền truy cập được đóng gói**, dựa vào URL làm định danh quyền truy cập, hiện tại không hỗ trợ URL có tham số đường dẫn.
2. **Cảnh báo dựa vào URL**, trong khi URL có tham số đường dẫn, URL "giống nhau" thực chất tương ứng với các URL khác nhau, dẫn đến việc không dễ dàng thực hiện việc cảnh báo số lần yêu cầu sai theo thời gian.
3. URL tham số đường dẫn `@PathVariable` sẽ gây ra một số suy giảm hiệu suất trong SpringMVC. Cụ thể có thể xem bài viết [《SpringMVC RESTful 性能优化》](https://tech.imdada.cn/2015/12/23/springmvc-restful-optimize/).

Vì vậy, chúng tôi tạo lớp [UserController2](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-01/src/main/java/cn/iocoder/springboot/lab23/springmvc/controller/UserController2.java) để sửa đổi API. Mã cuối cùng như sau:

```java
// UserController2.java

@RestController
@RequestMapping("/users2")
public class UserController2 {

    /**
     * Truy vấn danh sách người dùng
     *
     * @return danh sách người dùng
     */
    @GetMapping("/list") // URL thay đổi thành /list
    public List<UserVO> list() {
        // Truy vấn danh sách
        List<UserVO> result = new ArrayList<>();
        result.add(new UserVO().setId(1).setUsername("yudaoyuanma"));
        result.add(new UserVO().setId(2).setUsername("woshiyutou"));
        result.add(new UserVO().setId(3).setUsername("chifanshuijiao"));
        // Trả về danh sách
        return result;
    }

    /**
     * Nhận người dùng theo ID xác định
     *
     * @param id ID người dùng
     * @return người dùng
     */
    @GetMapping("/get") // URL thay đổi thành /get
    public UserVO get(@RequestParam("id") Integer id) {
        // Truy vấn và trả về người dùng
        return new UserVO().setId(id).setUsername(UUID.randomUUID().toString());
    }

    /**
     * Thêm người dùng
     *
     * @param addDTO thông tin người dùng cần thêm
     * @return ID người dùng đã thêm thành công
     */
    @PostMapping("/add") // URL thay đổi thành /add
    public Integer add(UserAddDTO addDTO) {
        // Chèn bản ghi người dùng và trả về ID
        Integer returnId = UUID.randomUUID().hashCode();
        // Trả về ID người dùng
        return returnId;
    }

    /**
     * Cập nhật người dùng theo ID xác định
     *
     * @param updateDTO thông tin người dùng cần cập nhật
     * @return trạng thái cập nhật thành công
     */
    @PostMapping("/update") // URL thay đổi thành /update, RequestMethod thay đổi thành POST
    public Boolean update(UserUpdateDTO updateDTO) {
        // Cập nhật bản ghi người dùng
        Boolean success = true;
        // Trả về trạng thái cập nhật
        return success;
    }

    /**
     * Xóa người dùng theo ID xác định
     *
     * @param id ID người dùng
     * @return trạng thái xóa thành công
     */
    @DeleteMapping("/delete") // URL thay đổi thành /delete, RequestMethod thay đổi thành DELETE
    public Boolean delete(@RequestParam("id") Integer id) {
        // Xóa bản ghi người dùng
        Boolean success = false;
        // Trả về trạng thái xóa
        return success;
    }

}
```

- Mỗi thay đổi ở đây, hãy xem các chú thích mô tả sau chú thích `@XXXMapping`.
# 3. Kiểm Tra API

> Mã mẫu tương ứng với kho lưu trữ: [lab-springmvc-23-01](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-01).

Sau khi phát triển xong API, chúng ta sẽ thực hiện tự kiểm tra API. Thông thường, chúng ta khởi động dự án, sau đó sử dụng [Postman](https://www.getpostman.com/), [curl](https://curl.haxx.se/), hoặc trình duyệt để mô phỏng yêu cầu đến API backend.

Thực tế, SpringMVC cung cấp một framework kiểm thử là [MockMvc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/test/web/servlet/MockMvc.html), giúp chúng ta kiểm thử API một cách nhanh chóng. Dưới đây, chúng ta sẽ thực hiện kiểm thử đơn vị cho các API được cung cấp trong [「2.4 UserController」](#). Nói cách khác, trong phần này, chúng ta sẽ tiếp tục sửa đổi trên nền tảng của ví dụ [lab-springmvc-23-01](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-01).

MockMvc cung cấp khả năng kiểm thử tích hợp và kiểm thử đơn vị, chúng ta sẽ phân chia thành [「3.1 Kiểm thử tích hợp」](#) và [「3.2 Kiểm thử đơn vị」](#) để tìm hiểu. Nếu bạn đọc chưa quen với phần kiểm thử, có thể tham khảo hai bài viết sau:

* [《Một chút về kiểm thử đơn vị trong Java》](http://www.iocoder.cn/Fight/A-little-bit-about-Java-unit-testing/?self)
* [《Nói về kiểm thử đơn vị》](http://www.iocoder.cn/Architecture/talk-about-java-unit-test/?self)
## 3.1 Kiểm Thử Tích Hợp

Tạo lớp kiểm thử [UserControllerTest](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-01/src/test/java/cn/iocoder/springboot/lab23/springmvc/controller/UserControllerTest.java) để kiểm thử từng thao tác đơn giản của UserController. Mã cốt lõi như sau:

```java
// UserControllerTest.java  

@RunWith(SpringRunner.class)  
@SpringBootTest(classes = Application.class)  
@AutoConfigureMockMvc  
public class UserControllerTest {  

    @Autowired  
    private MockMvc mvc;  

    @Test  
    public void testList() throws Exception {  
        // Truy vấn danh sách người dùng  
        ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.get("/users"));  
        // Kiểm tra kết quả  
        resultActions.andExpect(MockMvcResultMatchers.status().isOk()); // Mã trạng thái phản hồi 200  
        resultActions.andExpect(MockMvcResultMatchers.content().json("\[\\n" +  
                "    {\\n" +  
                "        \\"id\\": 1,\\n" +  
                "        \\"username\\": \\"yudaoyuanma\\"\\n" +  
                "    },\\n" +  
                "    {\\n" +  
                "        \\"id\\": 2,\\n" +  
                "        \\"username\\": \\"woshiyutou\\"\\n" +  
                "    },\\n" +  
                "    {\\n" +  
                "        \\"id\\": 3,\\n" +  
                "        \\"username\\": \\"chifanshuijiao\\"\\n" +  
                "    }\\n" +  
                "\]")); // Kết quả phản hồi  
    }  

    @Test  
    public void testGet() throws Exception {  
        // Lấy người dùng với ID chỉ định  
        ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.get("/users/1"));  
        // Kiểm tra kết quả  
        resultActions.andExpect(MockMvcResultMatchers.status().isOk()); // Mã trạng thái phản hồi 200  
        resultActions.andExpect(MockMvcResultMatchers.content().json("{\\n" +  
                "\\"id\\": 1,\\n" +  
                "\\"username\\": \\"username:1\\"\\n" +  
                "}")); // Kết quả phản hồi  
    }  

    @Test  
    public void testAdd() throws Exception {  
        // Thêm người dùng mới  
        ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.post("/users")  
            .param("username", "yudaoyuanma")  
            .param("password", "nicai"));  
        // Kiểm tra kết quả  
        resultActions.andExpect(MockMvcResultMatchers.status().isOk()); // Mã trạng thái phản hồi 200  
        resultActions.andExpect(MockMvcResultMatchers.content().string("1")); // Kết quả phản hồi  
    }  

    @Test  
    public void testUpdate() throws Exception {  
        // Cập nhật người dùng với ID chỉ định  
        ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.put("/users/1")  
                .param("username", "yudaoyuanma")  
                .param("password", "nicai"));  
        // Kiểm tra kết quả  
        resultActions.andExpect(MockMvcResultMatchers.status().isOk()); // Mã trạng thái phản hồi 200  
        resultActions.andExpect(MockMvcResultMatchers.content().string("true")); // Kết quả phản hồi  
    }  

    @Test  
    public void testDelete() throws Exception {  
        // Xóa người dùng với ID chỉ định  
        ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.delete("/users/1"));  
        // Kiểm tra kết quả  
        resultActions.andExpect(MockMvcResultMatchers.status().isOk()); // Mã trạng thái phản hồi 200  
        resultActions.andExpect(MockMvcResultMatchers.content().string("false")); // Kết quả phản hồi  
    }  

}  
```

* Lớp trên, chúng ta đã thêm chú thích `@AutoConfigureMockMvc` để tự động cấu hình đối tượng MockMvc Bean mà chúng ta sẽ tiêm sau này. Trong các bài kiểm thử tiếp theo, chúng ta sẽ thấy rằng tất cả các yêu cầu gọi API backend đều thông qua `mvc`. Mỗi lần gọi API backend, nó sẽ thực thi **logic backend thực sự**. Do đó, toàn bộ logic sẽ sử dụng **kiểm thử tích hợp** và sẽ khởi động một môi trường Spring **thực**.

* Mỗi yêu cầu API đều được xây dựng thông qua [MockMvcRequestBuilders](https://github.com/spring-projects/spring-framework/blob/master/spring-test/src/main/java/org/springframework/test/web/servlet/request/MockMvcRequestBuilders.java). Sau khi hoàn thành việc xây dựng, yêu cầu sẽ được thực hiện thông qua `mvc`, trả về kết quả [ResultActions](https://github.com/spring-projects/spring-framework/blob/master/spring-test/src/main/java/org/springframework/test/web/servlet/ResultActions.java).

* Sau khi thực hiện yêu cầu, chúng ta sẽ gọi phương thức `andExpect(ResultMatcher matcher)` của [ResultActions](https://github.com/spring-projects/spring-framework/blob/master/spring-test/src/main/java/org/springframework/test/web/servlet/ResultActions.java) để thêm dự kiến kết quả, tương đương với việc thực hiện khẳng định. Nếu không khớp với dự kiến, sẽ ném ra ngoại lệ và bài kiểm thử sẽ không thành công.

Ngoài ra, `ResultActions` còn có hai phương thức khác:

* Phương thức `#andDo(ResultHandler handler)`, cho phép thêm bộ xử lý kết quả ResultHandler, chẳng hạn như in kết quả ra bảng điều khiển trong quá trình gỡ lỗi để kiểm tra xem kết quả có đúng hay không.
* Phương thức `#andReturn()`, cuối cùng trả về kết quả [MvcResult](https://github.com/spring-projects/spring-framework/blob/master/spring-test/src/main/java/org/springframework/test/web/servlet/MvcResult.java). Sau đó, bạn có thể viết một số logic tùy chỉnh cho MvcResult.

Ví dụ, chúng ta sẽ sử dụng hai phương thức đã đề cập để bổ sung và sửa đổi phương thức `#testGet()` như sau:

```java
// UserControllerTest.java  

@Test  
public void testGet2() throws Exception {  
    // Lấy người dùng với ID chỉ định  
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.get("/users/1"));  
    // Kiểm tra kết quả  
    resultActions.andExpect(MockMvcResultMatchers.status().isOk()); // Mã trạng thái phản hồi 200  
    resultActions.andExpect(MockMvcResultMatchers.content().json("{\\n" +  
            "\\"id\\": 1,\\n" +  
            "\\"username\\": \\"username:1\\"\\n" +  
            "}")); // Kết quả phản hồi  
  
    // <1> In kết quả  
    resultActions.andDo(MockMvcResultHandlers.print());  
  
    // <2> Lấy MvcResult, thực hiện các logic tùy chỉnh  
    MvcResult mvcResult = resultActions.andReturn();  
    System.out.println("Số lượng bộ lọc: " + mvcResult.getInterceptors().length);  
}  
```


* Tại `<1>`, in thông tin yêu cầu và phản hồi. Đầu ra như sau:

```
    MockHttpServletRequest:  
          HTTP Method = GET  
          Request URI = /users/1  
           Parameters = {}  
              Headers = \[\]  
                 Body = null  
        Session Attrs = {}  
      
    Handler:  
                 Type = cn.iocoder.springboot.lab23.springmvc.controller.UserController  
               Method = public cn.iocoder.springboot.lab23.springmvc.vo.UserVO cn.iocoder.springboot.lab23.springmvc.controller.UserController.get(java.lang.Integer)  
      
    Async:  
        Async started = false  
         Async result = null  
      
    Resolved Exception:  
                 Type = null  
      
    ModelAndView:  
            View name = null  
                 View = null  
                Model = null  
      
    FlashMap:  
           Attributes = null  
      
    MockHttpServletResponse:  
               Status = 200  
        Error message = null  
              Headers = \[Content-Type:"application/json;charset=UTF-8"\]  
         Content type = application/json;charset=UTF-8  
                 Body = {"id":1,"username":"username:1"}  
        Forwarded URL = null  
       Redirected URL = null  
              Cookies = \[\]  
```

* Tại `<2>`, sau khi lấy được MvcResult in ra số lượng thiết bị chặn. Đầu ra như sau:

```
Số lượng bộ lọc: 2  
```   

## 3.2 Kiểm thử Đơn vị

Để trình bày rõ hơn về ví dụ kiểm thử đơn vị trong SpringMVC, chúng ta cần chỉnh sửa mã của `UserController` để nó phụ thuộc vào `UserService`. Các điểm sửa đổi như sau:

* Tại [gói `cn.iocoder.springboot.lab23.springmvc.service`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-01/src/main/java/cn/iocoder/springboot/lab23/springmvc/service), tạo lớp [UserService](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-01/src/main/java/cn/iocoder/springboot/lab23/springmvc/service/UserService.java). Mã như sau:

```java
// UserService.java  

@Service  
public class UserService {  
  
    public UserVO get(Integer id) {  
        return new UserVO().setId(id).setUsername("test");  
    }  
}
```

* Trong lớp [UserController](#), thêm interface `GET /users/v2/{id}` để lấy người dùng theo ID đã cho. Mã như sau:

```java
// UserController.java  

@Autowired  
private UserService userService;  

/**  
 * Lấy người dùng theo ID đã cho  
 *  
 * @param id ID của người dùng  
 * @return Người dùng  
 */  
@GetMapping("/v2/{id}")  
public UserVO get2(@PathVariable("id") Integer id) {  
    return userService.get(id);  
}
```

* Trong mã, chúng ta tiêm đối tượng Bean `userService` từ `UserService`, sau đó trong phương thức interface mới, chúng ta sẽ gọi phương thức `UserService#get(Integer id)` để lấy người dùng theo ID đã cho.

Tạo lớp kiểm thử [UserControllerTest2](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-01/src/test/java/cn/iocoder/springboot/lab23/springmvc/controller/UserControllerTest2.java) để kiểm thử API mới của `UserController`. Mã như sau:

```java
// UserControllerTest2.java  

@RunWith(SpringRunner.class)  
@WebMvcTest(UserController.class)  
public class UserControllerTest2 {  
  
    @Autowired  
    private MockMvc mvc;  
  
    @MockBean  
    private UserService userService;  
  
    @Test  
    public void testGet2() throws Exception {  
        // Mock phương thức get của UserService  
        System.out.println("before mock:" + userService.get(1)); // <1.1>  
        Mockito.when(userService.get(1)).thenReturn(  
                new UserVO().setId(1).setUsername("username:1")); // <1.2>  
        System.out.println("after mock:" + userService.get(1)); // <1.3>  
  
        // Gửi yêu cầu lấy người dùng  
        ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.get("/users/v2/1"));  
        // Kiểm tra kết quả  
        resultActions.andExpect(MockMvcResultMatchers.status().isOk()); // Mã trạng thái phản hồi 200  
        resultActions.andExpect(MockMvcResultMatchers.content().json("{\\n" +  
                "    \\"id\\": 1,\\n" +  
                "    \\"username\\": \\"username:1\\"\\n" +  
                "}")); // Kết quả phản hồi  
    }  
}
```

* Thêm chú thích [`@WebMvcTest`](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-test-autoconfigure/src/main/java/org/springframework/boot/test/autoconfigure/web/servlet/WebMvcTest.java) trên lớp, với `UserController` là đối số, cho biết rằng chúng ta sẽ thực hiện kiểm thử đơn vị trên `UserController`.

* Chú thích `@WebMvcTest` là một chú thích tổ hợp chứa `@AutoConfigureMockMvc`, vì vậy nó sẽ tự động cấu hình đối tượng MockMvc Bean mà chúng ta sẽ tiêm sau này. Trong các bài kiểm thử tiếp theo, chúng ta sẽ thấy rằng tất cả các yêu cầu API backend đều được gọi thông qua `mvc`. **Tuy nhiên**, mỗi lần gọi API backend sẽ **không** thực thi **logic backend thực sự**, mà chỉ thực hiện logic Mock. Điều này có nghĩa là toàn bộ logic sẽ sử dụng **kiểm thử đơn vị**, và **chỉ** khởi động một môi trường Spring **Mock**.

    > **Lưu ý**: Hãy chú ý đến mỗi điểm được **in đậm** ở trên!

* Thuộc tính `userService`, chúng ta thêm chú thích [`@MockBean`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/mock/mockito/MockBean.html), thực tế, đối tượng tiêm ở đây là một đối tượng UserService Mock được tạo ra bằng [Mockito](https://site.mockito.org/). Như hình dưới đây: ![Đối tượng UserService Mock](https://static.iocoder.cn/images/Spring-Boot/2019-11-17/01.png)

    * Trong `UserController`, cũng sẽ tiêm một thuộc tính `UserService`, và đối tượng tiêm này chính là Bean UserService Mock đã được tạo ra.

    * Theo mặc định,
        
    * Tại `<1.1>`, chúng ta gọi phương thức `UserService#get(Integer id)` và in kết quả trả về. Kết quả thực thi như sau:

		```
	    before mock:null  
		```
	        
        * Kết quả trả về là `null`. Lý thuyết mà nói, lúc này đáng lẽ ra phải trả về một đối tượng UserVO với `id = 1`. Thực tế, vì `userService` hiện đang là một đối tượng được Mock thông qua Mockito, nên tất cả các cuộc gọi đến các phương thức của nó sẽ trả về giá trị `null`.
        
    * Tại `<1.2>`, chúng ta sử dụng Mockito để Mock phương thức `#get(Integer id)` của `userService`, khi tham số truyền vào là `id = 1`, phương thức sẽ trả về một đối tượng UserVO với `id = 1` và `username = "username:1"`.
        
    * Tại `<1.3>`, gọi lại phương thức `UserService#get(Integer id)` và in kết quả trả về. Kết quả thực thi như sau:
		```
		after mock:cn.iocoder.springboot.lab23.springmvc.vo.UserVO@23202c31  
		```        
        * Kết quả in ra là đối tượng UserVO mà chúng ta đã Mock trả về.
        
* Cuối cùng, sử dụng `mvc` để thực hiện một cuộc gọi API backend và kiểm tra kết quả có đúng hay không. Nếu thực hiện thành công, bài kiểm thử đơn vị sẽ thông qua.

Có thể bạn chưa quen với kiểm thử đơn vị, bạn có thể tham khảo bài viết [《Testing the Web Layer》](https://spring.io/guides/gs/testing-web/) trong tài liệu chính thức của Spring về lĩnh vực này.

# 4. Global Response

> Mã ví dụ tương ứng với kho lưu trữ: [lab-springmvc-23-02](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02).

Khi chúng ta cung cấp API backend cho frontend, chúng ta cần thông báo cho frontend biết liệu kết quả của cuộc gọi API này có thành công hay không:

* Nếu **thành công**, dữ liệu thành công là gì. Sau đó, frontend sẽ lấy dữ liệu để hiển thị trên trang.
* Nếu **thất bại**, lý do thất bại là gì. Thông thường, frontend sẽ hiển thị lý do này cho người dùng.

Vì vậy, chúng ta cần có một phản hồi đồng nhất, không thể để mỗi API tự định nghĩa phong cách riêng của mình. Thông thường, thông tin phản hồi đồng nhất toàn cầu có thể như sau:

* Khi thành công, trả về **mã trạng thái thành công** + **dữ liệu**.
* Khi thất bại, trả về **mã trạng thái thất bại** + **thông báo lỗi**.

Trong định nghĩa chuẩn của API RESTful, khuyến nghị sử dụng [mã trạng thái phản hồi HTTP](https://zh.wikipedia.org/wiki/HTTP%E7%8A%B6%E6%80%81%E7%A0%81) để trả về mã trạng thái. Tuy nhiên, trong thực tế, chúng ta rất ít khi làm như vậy, chủ yếu vì những lý do sau:

* Mã trạng thái lỗi mà doanh nghiệp trả về rất nhiều, mã trạng thái phản hồi HTTP không thể ánh xạ tốt. Ví dụ như, sự kiện chưa bắt đầu, đơn hàng đã bị hủy, v.v.
* Các nhà phát triển trong nước không hiểu rõ về mã trạng thái phản hồi HTTP, có thể họ chỉ biết một vài mã phổ biến như 200, 403, 404, 500. Điều này lại làm tăng chi phí học tập.

Do đó, trong thực tế, trong các dự án, chúng ta sẽ đặt mã trạng thái vào **nội dung phản hồi** Response Body.

Trong phản hồi đồng nhất toàn cầu, chúng ta ít nhất cần định nghĩa ba trường:

* `code`: Mã trạng thái. Bất kể có thành công hay không, phải trả về trường này.
    
    * Khi thành công, mã trạng thái là 0.
    * Khi thất bại, mã lỗi tương ứng với doanh nghiệp.
    
    > Về phần này, một số đội ngũ thực hành đã thêm trường `success`, thông qua `true` và `false` để biểu thị thành công hay thất bại. Điều này tùy thuộc vào thói quen của từng đội ngũ. Theo quan điểm của tôi, tôi vẫn thích dựa trên quy ước, trả về 0 để biểu thị thành công.
    
* `data`: Dữ liệu. Khi thành công, trả về trường này.
    
* `message`: Thông báo lỗi. Khi thất bại, trả về trường này.
    

Bây giờ, hãy xem hai ví dụ:

```json
// Phản hồi thành công  
{  
    "code": 0,  
    "data": {  
        "id": 1,  
        "username": "yudaoyuanma"  
    }  
}  
  
// Phản hồi thất bại  
{  
    "code": 233666,  
    "message": "Xu Mã quá xấu"  
}  
```

Dưới đây, chúng ta sẽ xem một ví dụ.

> **Lưu ý**: Để không làm hỏng các ví dụ trong [「2. Hướng dẫn Nhanh」](#) và [「3. Kiểm tra API」](#), chúng ta cần thiết lập lại một cái mới.

## 4.1 Nhập Thư Viện

Giống như ở [「2.2 Thêm phụ thuộc」](#).

## 4.2 Ứng Dụng

Giống như ở [「2.3 Application」](#).

## 4.3 CommonResult

Trong gói [`cn.iocoder.springboot.lab23.springmvc.core.vo`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/core/vo), tạo lớp [CommonResult](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/core/vo/CommonResult.java) dùng để trả về đồng nhất toàn cầu. Mã như sau:

```java
// CommonResult.java  

public class CommonResult<T> implements Serializable {  

    public static Integer CODE_SUCCESS = 0;  

    /**  
     * Mã lỗi  
     */  
    private Integer code;  
    /**  
     * Thông báo lỗi  
     */  
    private String message;  
    /**  
     * Dữ liệu trả về  
     */  
    private T data;  

    /**  
     * Chuyển đổi đối tượng result đã truyền vào thành một đối tượng kết quả khác với kiểu tổng quát  
     *  
     * Bởi vì đối tượng CommonResult trả về từ phương thức A không phù hợp để gọi phương thức B, nên cần phải chuyển đổi.  
     *  
     * @param result Đối tượng result đã truyền vào  
     * @param <T> Kiểu trả về  
     * @return Đối tượng CommonResult mới  
     */  
    public static <T> CommonResult<T> error(CommonResult<?> result) {  
        return error(result.getCode(), result.getMessage());  
    }  

    public static <T> CommonResult<T> error(Integer code, String message) {  
        Assert.isTrue(!CODE_SUCCESS.equals(code), "Mã phải là lỗi!");  
        CommonResult<T> result = new CommonResult<>();  
        result.code = code;  
        result.message = message;  
        return result;  
    }  

    public static <T> CommonResult<T> success(T data) {  
        CommonResult<T> result = new CommonResult<>();  
        result.code = CODE_SUCCESS;  
        result.data = data;  
        result.message = "";  
        return result;  
    }  

    @JsonIgnore // Bỏ qua, tránh việc jackson tuần tự hóa cho frontend  
    public boolean isSuccess() { // Dễ dàng kiểm tra xem có thành công hay không  
        return CODE_SUCCESS.equals(code);  
    }  

    @JsonIgnore // Bỏ qua, tránh việc jackson tuần tự hóa cho frontend  
    public boolean isError() { // Dễ dàng kiểm tra xem có thất bại hay không  
        return !isSuccess();  
    }  

    // ... Bỏ qua các phương thức setting/getting/toString  

}  
```

* Mỗi trường, bạn hãy xem các chú thích tương ứng.
Dưới đây là bản dịch sang tiếng Việt cho nội dung mà bạn đã cung cấp:

## 4.4 GlobalResponseBodyHandler

Trong gói [`cn.iocoder.springboot.lab23.springmvc.core.web`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/core/web), tạo lớp [GlobalResponseBodyHandler](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/core/web/GlobalResponseBodyHandler.java) để xử lý phản hồi toàn cầu thống nhất. Mã như sau:

```java
// GlobalResponseBodyHandler.java  

@ControllerAdvice(basePackages = "cn.iocoder.springboot.lab23.springmvc.controller")  
public class GlobalResponseBodyHandler implements ResponseBodyAdvice {  

    @Override  
    public boolean supports(MethodParameter returnType, Class converterType) {  
        return true;  
    }  

    @Override  
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType,  
                                   ServerHttpRequest request, ServerHttpResponse response) {  
        // Nếu đã là kiểu CommonResult, thì trả về trực tiếp  
        if (body instanceof CommonResult) {  
            return body;  
        }  
        // Nếu không, thì bao bọc thành kiểu CommonResult  
        return CommonResult.success(body);  
    }  
}  
```

* Trong SpringMVC, bạn có thể sử dụng thông qua việc thực hiện interface [ResponseBodyAdvice](https://github.com/spring-projects/spring-framework/blob/master/spring-webmvc/src/main/java/org/springframework/web/servlet/mvc/method/annotation/ResponseBodyAdvice.java) và thêm chú thích [`@ControllerAdvice`](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/bind/annotation/ControllerAdvice.java) để chặn các kết quả trả về của Controller. Lưu ý rằng, trong chú thích `@ControllerAdvice`, chúng ta đã thiết lập thuộc tính `basePackages` để **chỉ chặn** gói `"cn.iocoder.springboot.lab23.springmvc.controller"`, tức là các Controller mà chúng ta đã định nghĩa. Tại sao lại như vậy? Bởi vì trong dự án, chúng ta có thể sẽ tích hợp các thư viện như Swagger và cũng sử dụng Controller để cung cấp các API, vì vậy rõ ràng là chúng ta không nên để GlobalResponseBodyHandler chặn các interface này, **dù sao thì chúng cũng không cần chúng ta làm phản hồi toàn cầu đồng nhất cho chúng**.
* Thực hiện phương thức `#supports(MethodParameter returnType, Class converterType)` và trả về `true`. Điều này có nghĩa là chặn tất cả các kết quả trả về của các interface API của Controller.
* Thực hiện phương thức `#beforeBodyWrite(...)`, khi kết quả trả về không phải là kiểu CommonResult, thì bao bọc thành kiểu CommonResult. Có hai điểm cần lưu ý ở đây:
    * Thứ nhất, có thể kết quả trả về của API đã là kiểu CommonResult, vì vậy không cần bao bọc lần hai.
    * Thứ hai, vì API đã trả về kết quả và bị GlobalResponseBodyHandler chặn, **quy ước** là kết quả trả về phải thành công, do đó sử dụng phương thức `CommonResult#success(T data)` để bao bọc thành phản hồi CommonResult **thành công**. Vậy nếu chúng ta muốn API trả về **thất bại** thì sao? Chúng ta **quy ước** rằng trong Controller sẽ ném ra ngoại lệ, điều này chúng ta sẽ thấy trong [「5. Xử Lý Ngoại Lệ Toàn Cầu」](#).
## 4.5 UserController

Trong gói [`cn.iocoder.springboot.lab23.springmvc.controller`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-01/src/main/java/cn/iocoder/springboot/lab23/springmvc/controller/), tạo lớp [UserController](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-01/src/main/java/cn/iocoder/springboot/lab23/springmvc/controller/UserController.java). Mã như sau:

```java
// UserController.java  

@RestController  
@RequestMapping("/users")  
public class UserController {  

    /**
     * Lấy thông tin người dùng theo mã định danh
     * 
     * Cung cấp không sử dụng CommonResult để đóng gói
     * 
     * @param id Mã định danh người dùng
     * @return Thông tin người dùng
     */
    @GetMapping("/get")  
    public UserVO get(@RequestParam("id") Integer id) {  
        // Truy vấn và trả về thông tin người dùng
        return new UserVO().setId(id).setUsername(UUID.randomUUID().toString());  
    }  

    /**
     * Lấy thông tin người dùng theo mã định danh
     * 
     * Cung cấp sử dụng CommonResult để đóng gói
     * 
     * @param id Mã định danh người dùng
     * @return Thông tin người dùng
     */
    @GetMapping("/get2")  
    public CommonResult<UserVO> get2(@RequestParam("id") Integer id) {  
        // Truy vấn người dùng
        UserVO user = new UserVO().setId(id).setUsername(UUID.randomUUID().toString());  
        // Trả về kết quả
        return CommonResult.success(user);  
    }  
}  
```

* Trong phương thức `#get(Integer id)`, kết quả trả về là kiểu `UserVO`. Kết quả này sẽ bị **GlobalResponseBodyHandler** chặn và đóng gói thành kiểu `CommonResult`. Kết quả yêu cầu sẽ như sau:

    ```json
    {
        "code": 0,
        "message": "",
        "data": {
            "id": 10,
            "username": "f0ab9401-062f-4697-bcc9-1dc70c1c1310"
        }
    }
    ```

    * Lý do có `"message": ""` trong kết quả trả về là do SpringMVC sử dụng Jackson để tuần tự hóa. Khi `message = null`, nó sẽ tuần tự hóa thành `"message": ""`. Trong thực tế, điều này không ảnh hưởng đến việc xử lý của phía giao diện người dùng.

* Trong phương thức `#get2(Integer id)`, kết quả trả về là kiểu `CommonResult<UserVO>`. Kết quả này cũng sẽ bị **GlobalResponseBodyHandler** chặn, nhưng **sẽ không** được đóng gói lại lần nữa thành kiểu `CommonResult`.
## 4.6 Một Cuộc Thảo Luận Nhỏ

Cho đến giờ, chúng ta đã hoàn thành ví dụ về **phản hồi thống nhất toàn cục**. Tuy nhiên, tôi muốn đưa ra một câu hỏi thảo luận: **Liệu chúng ta có nên sử dụng cách như GlobalResponseBodyHandler để chặn kết quả trả về của Controller và đưa ra phản hồi thống nhất toàn cục không?**

Chúng ta sẽ thấy rất nhiều bài viết trên mạng cũng sử dụng cách này để thực hiện việc trả về thống nhất toàn cục. Có vẻ như không có vấn đề gì khi áp dụng cách này trong các dự án thực tế, và thực sự, nó có thể được sử dụng mà không gặp khó khăn hay rủi ro nào. Nhưng đây chỉ là một điểm mà tôi (艿艿) băn khoăn. Khi chúng ta sử dụng AOP để **thay đổi loại dữ liệu trả về của một phương thức**, liệu điều này có thực sự phù hợp?

Ý kiến cá nhân của tôi là, **điều này không phù hợp**. Do đó, trong dự án mã nguồn mở [onemall](https://github.com/YunaiV/onemall), tôi **bắt buộc** Controller phải trả về loại `CommonResult`, giống như cách của phương thức `Controller#get2(Integer id)`.

Tuy nhiên, trong các dự án của nhóm tại công ty tôi, chúng tôi vẫn sử dụng cách của **GlobalResponseBodyHandler** để chặn kết quả. Vậy nên, cả hai cách đều có thể sử dụng, tùy thuộc vào quan điểm cá nhân và yêu cầu của từng dự án.

Ngoài ra, `ResponseBodyAdvice` được dùng để cắt ngang nội dung phản hồi (Response Body). Tương tự như vậy, SpringMVC cũng cung cấp [`RequestBodyAdvice`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/mvc/method/annotation/RequestBodyAdvice.html) để cắt ngang nội dung yêu cầu (Request Body). Cách sử dụng rất đơn giản, tương tự với `ResponseBodyAdvice`, nên tôi sẽ không nhắc lại chi tiết ở đây. Tuy nhiên, có vẻ như `ResponseBodyAdvice` không được sử dụng nhiều. Bạn chỉ cần biết rằng có công cụ này, và khi cần thì có thể quay lại tìm hiểu kỹ hơn.

# 5. Xử lý ngoại lệ toàn cục

> Mã nguồn mẫu tương ứng với kho: [lab-springmvc-23-02](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02).

Trong phần [「4. Phản hồi thống nhất toàn cục」](#), chúng ta đã định nghĩa sử dụng CommonResult để phản hồi thống nhất toàn cục và đã thấy ví dụ về phản hồi thành công. Ở phần này, chúng ta sẽ xử lý ngoại lệ toàn cục, cuối cùng cũng sẽ thông qua CommonResult để trả về.

Vậy nên, chúng ta không nói nhiều nữa, cùng xem qua mã mẫu và đi sâu vào chi tiết.

> Lưu ý: Ví dụ này dựa trên nền tảng của phần [「4. Phản hồi thống nhất toàn cục」](#) từ kho [lab-springmvc-23-02](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02).

## 5.1 ServiceExceptionEnum

Trong đường dẫn gói [`cn.iocoder.springboot.lab23.springmvc.constants`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/constants), tạo lớp enum [ServiceExceptionEnum](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/constants/ServiceExceptionEnum.java), liệt kê mã lỗi trong dự án. Mã như sau:

```java
// ServiceExceptionEnum.java  
  
public enum ServiceExceptionEnum {  
  
    // ========== Hệ thống cấp cao ==========  
    SUCCESS(0, "Thành công"),  
    SYS_ERROR(2001001000, "Lỗi phía máy chủ"),  
    MISSING_REQUEST_PARAM_ERROR(2001001001, "Thiếu tham số"),  
  
    // ========== Module người dùng ==========  
    USER_NOT_FOUND(1001002000, "Không tìm thấy người dùng"),  
  
    // ========== Module đơn hàng ==========  
  
    // ========== Module sản phẩm ==========  
    ;  
  
    /**  
     * Mã lỗi  
     */  
    private int code;  
    /**  
     * Thông báo lỗi  
     */  
    private String message;  
  
    ServiceExceptionEnum(int code, String message) {  
        this.code = code;  
        this.message = message;  
    }  
  
    // ... Lược bỏ các phương thức getter  
  
}  
```

*   Vì mã lỗi là toàn cục, tốt nhất là phân chia theo module. Dưới đây là ví dụ từ dự án [onemall](https://github.com/YunaiV/onemall) của tôi:
    
```java
    /**
     * Ngoại lệ dịch vụ
     * 
     * Tham khảo https://www.kancloud.cn/onebase/ob/484204 bài viết
     * 
     * Tổng cộng 10 chữ số, chia làm bốn phần
     * 
     * Phần đầu tiên, 1 chữ số, loại:
     *      1 - Ngoại lệ cấp dịch vụ
     *      2 - Ngoại lệ cấp hệ thống
     * Phần thứ hai, 3 chữ số, loại hệ thống:
     *      001 - Hệ thống người dùng
     *      002 - Hệ thống sản phẩm
     *      003 - Hệ thống đơn hàng
     *      004 - Hệ thống thanh toán
     *      005 - Hệ thống phiếu giảm giá
     *      ... - ...
     * Phần thứ ba, 3 chữ số, module:
     *      Không có quy tắc cố định.
     *      Thông thường, đề nghị mỗi hệ thống có thể có nhiều module, ví dụ với hệ thống người dùng:
     *          001 - Module OAuth2
     *          002 - Module Người dùng
     *          003 - Module Mã xác minh qua di động
     * Phần thứ tư, 3 chữ số, mã lỗi:
     *       Không có quy tắc cố định.
     *       Thường thì, đề nghị mỗi module sẽ tự tăng mã.
     */
```

## 5.2 ServiceException

Chúng ta hãy cùng thảo luận về cách xử lý ngoại lệ logic trong tầng Service. Các ngoại lệ logic ở đây là những tình huống như tên người dùng đã tồn tại, hoặc số lượng hàng trong kho không đủ. Thông thường, có hai phương án phổ biến để xử lý:

*   Đóng gói một lớp ngoại lệ logic thống nhất là **ServiceException**, trong đó có mã lỗi và thông báo lỗi, sau đó sử dụng `throws` để ném ra ngoại lệ.
*   Đóng gói một lớp phản hồi chung là **CommonResult**, trong đó có mã lỗi và thông báo lỗi, sau đó sử dụng `return` để trả về kết quả.

Ban đầu, chúng tôi chọn phương án sử dụng **CommonResult**, nhưng phát hiện ra một số vấn đề sau:

*   Vì Spring sử dụng `@Transactional` để xử lý giao dịch dựa trên cơ chế ngoại lệ, nếu sử dụng **CommonResult** để trả về kết quả, việc rollback giao dịch sẽ trở nên rất phức tạp.
*   Khi gọi các phương thức khác, nếu phương thức đó trả về đối tượng **CommonResult**, chúng ta cần liên tục kiểm tra và xử lý, điều này làm cho mã trở nên phức tạp.

Vì vậy, sau đó chúng tôi đã quyết định sử dụng cách ném ngoại lệ logic bằng **ServiceException**.

Trong đường dẫn gói [`cn.iocoder.springboot.lab23.springmvc.core.exception`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/core/exception), tạo lớp ngoại lệ [ServiceException](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/core/exception/ServiceException.java) kế thừa **RuntimeException**, dùng để định nghĩa ngoại lệ logic. Mã nguồn như sau:

```java
// ServiceException.java  
  
public final class ServiceException extends RuntimeException {  
  
    /**  
     * Mã lỗi  
     */  
    private final Integer code;  
  
    public ServiceException(ServiceExceptionEnum serviceExceptionEnum) {  
        // Sử dụng message từ lớp cha  
        super(serviceExceptionEnum.getMessage());  
        // Gán mã lỗi  
        this.code = serviceExceptionEnum.getCode();  
    }  
  
    // ... Lược bỏ các phương thức getter  
  
}  
```

*   Phương thức khởi tạo nhận tham số **serviceExceptionEnum** để gán mã lỗi và thông báo lỗi. Cách xử lý cụ thể, hãy xem mã nguồn và các chú thích.
## 5.3 GlobalExceptionHandler

Trong đường dẫn gói [`cn.iocoder.springboot.lab23.springmvc.core.web`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/core/web), tạo lớp [GlobalExceptionHandler](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/core/web/GlobalExceptionHandler.java) để xử lý ngoại lệ toàn cục. Mã nguồn như sau:

```java
// GlobalExceptionHandler.java  
  
@ControllerAdvice(basePackages = "cn.iocoder.springboot.lab23.springmvc.controller")  
public class GlobalExceptionHandler {  
  
    private Logger logger = LoggerFactory.getLogger(getClass());  
  
    /**  
     * Xử lý ngoại lệ ServiceException  
     */  
    @ResponseBody  
    @ExceptionHandler(value = ServiceException.class)  
    public CommonResult serviceExceptionHandler(HttpServletRequest req, ServiceException ex) {  
        logger.debug("[serviceExceptionHandler]", ex);  
        // Gói kết quả thành CommonResult  
        return CommonResult.error(ex.getCode(), ex.getMessage());  
    }  
  
    /**  
     * Xử lý ngoại lệ MissingServletRequestParameterException  
     *  
     * Ngoại lệ khi tham số của SpringMVC không đúng  
     */  
    @ResponseBody  
    @ExceptionHandler(value = MissingServletRequestParameterException.class)  
    public CommonResult missingServletRequestParameterExceptionHandler(HttpServletRequest req, MissingServletRequestParameterException ex) {  
        logger.debug("[missingServletRequestParameterExceptionHandler]", ex);  
        // Gói kết quả thành CommonResult  
        return CommonResult.error(ServiceExceptionEnum.MISSING_REQUEST_PARAM_ERROR.getCode(),  
                ServiceExceptionEnum.MISSING_REQUEST_PARAM_ERROR.getMessage());  
    }  
  
    /**  
     * Xử lý các ngoại lệ khác  
     */  
    @ResponseBody  
    @ExceptionHandler(value = Exception.class)  
    public CommonResult exceptionHandler(HttpServletRequest req, Exception e) {  
        // Ghi lại nhật ký lỗi  
        logger.error("[exceptionHandler]", e);  
        // Trả về CommonResult báo lỗi  
        return CommonResult.error(ServiceExceptionEnum.SYS_ERROR.getCode(),  
                ServiceExceptionEnum.SYS_ERROR.getMessage());  
    }  
  
}  
```

*   Trong lớp, thêm annotation `@ControllerAdvice`. Điều này tương tự như [「4.4 GlobalResponseBodyHandler」](#), nhưng chúng ta không cần triển khai giao diện `ResponseBodyAdvice`, vì không cần chặn kết quả trả về để sửa đổi.
*   Chúng ta định nghĩa ba phương thức, mỗi phương thức được gắn với annotation [`@ExceptionHandler`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/ExceptionHandler.html) để xử lý ngoại lệ tương ứng. Đồng thời, cũng thêm annotation `@ResponseBody` để chỉ định rằng kết quả trả về sẽ được sử dụng trực tiếp làm phản hồi API.
*   Phương thức `#serviceExceptionHandler(...)` xử lý ngoại lệ **ServiceException**, xây dựng đối tượng **CommonResult** từ thuộc tính `code` và `message` của ngoại lệ này.
*   Phương thức `#missingServletRequestParameterExceptionHandler(...)` xử lý ngoại lệ **MissingServletRequestParameterException**, xây dựng đối tượng **CommonResult** với mã lỗi là `ServiceExceptionEnum.MISSING_REQUEST_PARAM_ERROR`.
*   Phương thức `#exceptionHandler(...)` xử lý ngoại lệ **Exception**, xây dựng đối tượng **CommonResult** với mã lỗi là `ServiceExceptionEnum.SYS_ERROR`. Đây là phương thức xử lý ngoại lệ "cuối cùng", dùng để xử lý các ngoại lệ khác mà chúng ta không định nghĩa trong **GlobalExceptionHandler**.

**Lưu ý**: Trong phương thức `#exceptionHandler(...)`, chúng ta đã sử dụng **logger** để ghi nhật ký lỗi, điều này giúp dễ dàng kết nối với các dịch vụ nhật ký như **ELK**, từ đó gửi cảnh báo và thông báo để kiểm tra và khắc phục sự cố. Nếu hệ thống của bạn chưa có dịch vụ nhật ký, bạn có thể ghi lại lỗi vào cơ sở dữ liệu cũng là một phương án tốt. Còn đối với hai phương thức còn lại, vì chúng xử lý ngoại lệ liên quan đến logic nghiệp vụ, nên không cần phải ghi nhật ký lỗi.
## 5.4 UserController

Trong lớp [UserController](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/controller/UserController.java), chúng ta thêm hai API để ném ngoại lệ, giúp thử nghiệm tính năng xử lý ngoại lệ toàn cục. Mã nguồn như sau:

```java
// UserController.java  
  
/**  
 * Thử nghiệm ném ngoại lệ NullPointerException  
 */  
@GetMapping("/exception-01")  
public UserVO exception01() {  
    throw new NullPointerException("Không có cá viên chiên");  
}  
  
/**  
 * Thử nghiệm ném ngoại lệ ServiceException  
 */  
@GetMapping("/exception-02")  
public UserVO exception02() {  
    throw new ServiceException(ServiceExceptionEnum.USER_NOT_FOUND);  
}  
```

*   Trong phương thức `#exception01()`, chúng ta ném ngoại lệ **NullPointerException**. Khi đó, ngoại lệ này sẽ được phương thức `GlobalExceptionHandler#exceptionHandler(...)` chặn lại và gói thành đối tượng **CommonResult** để trả về. Kết quả yêu cầu sẽ như sau:
    
    ```json
    {  
        "code": 2001001000,  
        "message": "Dịch vụ xảy ra lỗi",  
        "data": null  
    }
    ```
    
*   Trong phương thức `#exception02()`, chúng ta ném ngoại lệ **ServiceException**. Ngoại lệ này sẽ được phương thức `GlobalExceptionHandler#serviceExceptionHandler(...)` chặn lại và gói thành đối tượng **CommonResult** để trả về. Kết quả yêu cầu sẽ như sau:
    
    ```json
    {  
        "code": 1001002000,  
        "message": "Người dùng không tồn tại",  
        "data": null  
    }
    ```

# 6. Bộ chặn HandlerInterceptor

> Mã ví dụ tương ứng với kho lưu trữ: [lab-springmvc-23-02](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02).

Khi sử dụng SpringMVC, chúng ta có thể sử dụng [HandlerInterceptor](https://github.com/spring-projects/spring-framework/blob/master/spring-webmvc/src/main/java/org/springframework/web/servlet/HandlerInterceptor.java) để can thiệp vào quá trình xử lý yêu cầu của SpringMVC và tùy chỉnh logic trước và sau khi xử lý yêu cầu. Ví dụ như:

* **Bộ chặn nhật ký**: Ghi lại các yêu cầu và phản hồi. Nhờ đó, chúng ta có thể biết được tham số của mỗi yêu cầu, kết quả phản hồi, thời gian thực thi, v.v.
* **Bộ chặn xác thực**: Giải mã thông tin người dùng từ phía trước truyền vào, chẳng hạn như `access_token` để lấy thông tin người dùng hiện tại và lưu vào **ThreadLocal**. Nhờ vậy, các logic sau đó chỉ cần lấy thông tin người dùng qua **ThreadLocal**.
* **Bộ chặn phân quyền**: Dựa vào thông tin phân quyền của mỗi API để xác định xem yêu cầu hiện tại có được phép truy cập hay không. Ví dụ, người dùng đã đăng nhập chưa, có quyền thực hiện thao tác API đó không.
* **Bộ chặn giới hạn tần suất**: Dựa vào cấu hình giới hạn tần suất của mỗi API để xác định xem yêu cầu hiện tại có vượt quá tần suất cho phép không, nhằm tránh các yêu cầu ác ý làm quá tải hệ thống.

Interface `HandlerInterceptor` định nghĩa ba điểm chặn. Mã như sau:

```java
// HandlerInterceptor.java  
  
public interface HandlerInterceptor {  
  
	default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)  
			throws Exception {  
		return true;  
	}  
  
	default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,  
			@Nullable ModelAndView modelAndView) throws Exception {  
	}  
  
	default void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,  
			@Nullable Exception ex) throws Exception {  
	}  
  
}  
```

* Trước tiên, chúng ta cần hiểu một khái niệm. Mỗi yêu cầu API sẽ tương ứng với một **handler**. Như hình minh họa sau:  
  ![](https://static.iocoder.cn/images/Spring-Boot/2019-11-17/02.png)
  
    * Chúng ta có thể thấy rằng yêu cầu `users/exception_03` này có **handler** tương ứng với phương thức `#exception03()` trong `UserController`.
    * Vì vậy, tên của giao diện `HandlerInterceptor` bắt đầu với **Handler**, vì nó là bộ chặn dựa trên Handler.

* Tiếp theo, chúng ta sẽ xem một đoạn mã giả để hiểu rõ cách ba điểm chặn này và quá trình thực thi của `handler`. Mã như sau:

```java
// Mã giả  
Exception ex = null;  
try {  
    // Xử lý trước  
    if (!preHandle(request, response, handler)) {  
        return;  
    }  
  
    // Thực thi xử lý chính của handler, tức là logic của API  
    handler.execute();  
  
    // Xử lý sau  
    postHandle(request, response, handler);  
} catch(Exception exception) {  
    // Nếu xảy ra ngoại lệ, lưu vào biến ex  
    ex = exception;  
} finally {  
    afterCompletion(request, response, handler);  
}  
```

* Dựa trên đoạn mã này, chúng ta có thể hiểu rõ quá trình xử lý yêu cầu.
* Tuy nhiên, đây chỉ là mã giả và chưa tính đến trường hợp có nhiều bộ chặn. Trong các phần sau, chúng ta sẽ cung cấp các ví dụ cụ thể để giải thích rõ ràng hơn về quá trình thực thi.

* Phương thức `#preHandle(...)`: Xử lý logic **trước** khi thực thi `handler`. Nếu trả về `true`, **tiếp tục** thực hiện `handler`; nếu trả về `false`, **dừng** quá trình thực thi.
  
> Ví dụ, kiểm tra xem người dùng đã đăng nhập hay chưa. Nếu chưa, trả về `false` và **dừng** quá trình thực thi.

* Phương thức `#postHandle(...)`: Xử lý logic **sau** khi `handler` đã thực thi.

> Ví dụ, thực hiện một số xử lý trước khi hiển thị giao diện. Tuy nhiên, do hiện tại phần lớn các ứng dụng đều tách biệt giữa frontend và backend, nên điểm chặn này ít được sử dụng hơn.

* Phương thức `#afterCompletion(...)`: Sau khi `handler` và toàn bộ chuỗi **Interceptor** đã hoàn thành quá trình xử lý trước và sau, thực hiện logic **sau khi hoàn thành** yêu cầu. **Lưu ý**, chỉ những `HandlerInterceptor` có phương thức `#preHandle(...)` trả về `true` mới thực thi được `#afterCompletion(...)`, vì chỉ khi đó `HandlerInterceptor` mới được coi là **hoàn thành**.

> Ví dụ, giải phóng tài nguyên. Chẳng hạn, xóa các biến **ThreadLocal** được tạo ra bởi bộ chặn xác thực để tránh memory leak cho yêu cầu tiếp theo sử dụng cùng một thread.
>    
>  Hoặc xử lý ngoại lệ xảy ra trong quá trình thực thi `handler` và ghi lại nhật ký ngoại lệ. Tuy nhiên, hiện nay thường sử dụng [xử lý ngoại lệ toàn cục](#) để xử lý các ngoại lệ, nên ít khi cần làm như vậy.
>    
>  Ngoài ra, có thể ghi lại thời gian kết thúc yêu cầu để tính toán thời gian xử lý của toàn bộ quá trình.

Nhiều `HandlerInterceptor` có thể được kết hợp lại thành một **chuỗi Interceptor**. Quá trình thực thi sẽ diễn ra theo trình tự:

* Đầu tiên, thực thi phương thức `#preHandle(...)` của chuỗi theo thứ tự.
* Tiếp theo, thực thi logic của `handler`.
* Sau đó, thực thi phương thức `#postHandle(...)` của chuỗi theo thứ tự ngược lại.
* Cuối cùng, thực thi phương thức `#afterCompletion(...)` của chuỗi theo thứ tự ngược lại.

Đây là quá trình thực thi trong trường hợp bình thường. Còn trong các trường hợp ngoại lệ thì sao? Ví dụ:

* Một `HandlerInterceptor` trả về `false` trong phương thức `#preHandle(...)`.
* Quá trình thực thi của `handler` ném ra ngoại lệ.
* Một `HandlerInterceptor` ném ra ngoại lệ trong phương thức `#afterCompletion(...)`.
* ...

Đừng lo lắng, chúng ta sẽ đưa ra các ví dụ để giải thích những trường hợp ngoại lệ này. Tiếp theo, chúng ta sẽ khám phá sâu hơn các ví dụ trong phần này.

> Lưu ý: Ví dụ này dựa trên [xử lý ngoại lệ toàn cục](#) của dự án [lab-springmvc-23-02](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02) và tiếp tục được cải tiến.

## 6.1 Tùy chỉnh HandlerInterceptor

Trong đường dẫn gói [`cn.iocoder.springboot.lab23.springmvc.core.interceptor`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/core/interceptor), chúng ta tạo ba bộ chặn `HandlerInterceptor` tùy chỉnh.

### 1. `FirstInterceptor`
Mã nguồn của [FirstInterceptor](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/core/interceptor/FirstInterceptor) như sau:

```java
// FirstInterceptor.java  

public class FirstInterceptor implements HandlerInterceptor {  

    private Logger logger = LoggerFactory.getLogger(getClass());  

    @Override  
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {  
        logger.info("[preHandle][handler({})]", handler);  
        return true;  
    }  

    @Override  
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {  
        logger.info("[postHandle][handler({})]", handler);  
    }  

    @Override  
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {  
        logger.info("[afterCompletion][handler({})]", handler, ex);  
    }  

}
```

* Mỗi phương thức đều ghi lại nhật ký (log).

### 2. `SecondInterceptor`
Mã nguồn của [SecondInterceptor](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/core/interceptor/SecondInterceptor) như sau:

```java
// SecondInterceptor.java  

public class SecondInterceptor implements HandlerInterceptor {  

    private Logger logger = LoggerFactory.getLogger(getClass());  

    @Override  
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {  
        logger.info("[preHandle][handler({})]", handler);  
        return false; // Cố tình trả về false  
    }  

    @Override  
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {  
        logger.info("[postHandle][handler({})]", handler);  
    }  

    @Override  
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {  
        logger.info("[afterCompletion][handler({})]", handler, ex);  
    }  

}
```

* Gần giống với `FirstInterceptor`, khác biệt nằm ở phương thức `#preHandle(...)` trả về `false`.

### 3. `ThirdInterceptor`
Mã nguồn của [ThirdInterceptor](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/core/interceptor/ThirdInterceptor) như sau:

```java
// ThirdInterceptor.java  

public class ThirdInterceptor implements HandlerInterceptor {  

    private Logger logger = LoggerFactory.getLogger(getClass());  

    @Override  
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {  
        logger.info("[preHandle][handler({})]", handler);  
        return true;  
    }  

    @Override  
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {  
        logger.info("[postHandle][handler({})]", handler);  
    }  

    @Override  
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {  
        logger.info("[afterCompletion][handler({})]", handler, ex);  
        throw new RuntimeException("Cố tình ném ra lỗi"); // Cố tình ném ra ngoại lệ  
    }  

}
```

* Gần giống với `FirstInterceptor`, nhưng khác biệt nằm ở phương thức `#afterCompletion(...)` cố tình ném ra ngoại lệ `RuntimeException`.

### Tóm lại
* `FirstInterceptor`: Ghi nhật ký bình thường cho cả ba phương thức `preHandle`, `postHandle` và `afterCompletion`.
* `SecondInterceptor`: Dừng quá trình xử lý (trả về `false`) ngay tại phương thức `preHandle`.
* `ThirdInterceptor`: Ghi nhật ký bình thường nhưng cố tình ném ra ngoại lệ trong phương thức `afterCompletion`. 

Ba bộ chặn này sẽ được sử dụng để minh họa cách mà các `HandlerInterceptor` hoạt động khi được liên kết thành một chuỗi (Chain) và khi gặp các tình huống đặc biệt như dừng hoặc ném ra ngoại lệ.
## 6.2 SpringMVCConfiguration

Trong đường dẫn gói [`cn.iocoder.springboot.lab23.springmvc.config`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/config/), chúng ta tạo lớp cấu hình [SpringMVCConfiguration](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/config/SpringMVCConfiguration.java). Mã nguồn như sau:

```java
// SpringMVCConfiguration.java

@Configuration  
public class SpringMVCConfiguration implements WebMvcConfigurer {  
  
    @Bean  
    public FirstInterceptor firstInterceptor() {  
        return new FirstInterceptor();  
    }  
  
    @Bean  
    public SecondInterceptor secondInterceptor() {  
        return new SecondInterceptor();  
    }  
  
    @Bean  
    public ThirdInterceptor thirdInterceptor() {  
        return new ThirdInterceptor();  
    }  
  
    @Override  
    public void addInterceptors(InterceptorRegistry registry) {  
        // Bộ chặn thứ nhất
        registry.addInterceptor(this.firstInterceptor()).addPathPatterns("/**");  
        // Bộ chặn thứ hai
        registry.addInterceptor(this.secondInterceptor()).addPathPatterns("/users/current_user");  
        // Bộ chặn thứ ba
        registry.addInterceptor(this.thirdInterceptor()).addPathPatterns("/**");  
    }  
  
}  
```

### Giải thích:

* Lớp cấu hình này triển khai interface [WebMvcConfigurer](https://www.jianshu.com/p/52f39b799fbb), cho phép tùy chỉnh cấu hình trong Spring MVC. Lớp này cũng được đánh dấu với chú thích `@Configuration`, để chỉ ra rằng nó là một lớp cấu hình.
  
* Phương thức `#addInterceptors(InterceptorRegistry registry)` dùng để thêm các bộ chặn `HandlerInterceptor` tùy chỉnh vào bảng đăng ký `InterceptorRegistry`. Cụ thể:
  * Bộ chặn `FirstInterceptor` được áp dụng cho tất cả các đường dẫn (`/**`).
  * Bộ chặn `SecondInterceptor` chỉ áp dụng cho đường dẫn `/users/current_user`. Điều này nhằm kiểm tra hành vi khi `SecondInterceptor#preHandle(...)` trả về `false`, làm gián đoạn quá trình xử lý trước khi tiếp tục đến bộ điều khiển.
  * Bộ chặn `ThirdInterceptor` cũng được áp dụng cho tất cả các đường dẫn (`/**`).

### Tổng kết:
- Lớp cấu hình này tạo các bean cho ba bộ chặn `FirstInterceptor`, `SecondInterceptor`, và `ThirdInterceptor`.
- Thông qua việc đăng ký các bộ chặn, Spring MVC sẽ kích hoạt các interceptor tương ứng trên các đường dẫn cụ thể. Ví dụ, với `SecondInterceptor`, nếu người dùng truy cập vào `/users/current_user`, quá trình sẽ bị dừng lại do phương thức `preHandle` trả về `false`.
## 6.3 UserController

Trong phần này, chúng ta sẽ kiểm tra hành vi của chuỗi interceptor (bộ chặn) thông qua các API được cung cấp bởi [UserController](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/controller/UserController.java).

### **① API `/users/do_something`**

```java
// UserController.java  

@GetMapping("/do_something")  
public void doSomething() {  
    logger.info("[doSomething]");  
}  
```

Khi gọi API này, kết quả log sẽ như sau:

```plaintext
// Đầu tiên, theo thứ tự của chuỗi HandlerInterceptor, các phương thức `#preHandle(...)` được thực thi.  
2019-11-17 12:31:38.049  INFO 28157 --- [nio-8080-exec-1] c.i.s.l.s.c.i.FirstInterceptor           : [preHandle][handler(public void cn.iocoder.springboot.lab23.springmvc.controller.UserController.doSomething())]  
2019-11-17 12:31:38.050  INFO 28157 --- [nio-8080-exec-1] c.i.s.l.s.c.i.ThirdInterceptor           : [preHandle][handler(public void cn.iocoder.springboot.lab23.springmvc.controller.UserController.doSomething())]  
  
// Sau đó, xử lý logic của `handler`.  
[doSomething]  
  
// Tiếp theo, theo thứ tự ngược của chuỗi HandlerInterceptor, các phương thức `#postHandle(...)` được thực thi.  
2019-11-17 12:31:38.109  INFO 28157 --- [nio-8080-exec-1] c.i.s.l.s.c.i.ThirdInterceptor           : [postHandle][handler(public void cn.iocoder.springboot.lab23.springmvc.controller.UserController.doSomething())]  
2019-11-17 12:31:38.109  INFO 28157 --- [nio-8080-exec-1] c.i.s.l.s.c.i.FirstInterceptor           : [postHandle][handler(public void cn.iocoder.springboot.lab23.springmvc.controller.UserController.doSomething())]  
  
// Cuối cùng, theo thứ tự ngược của chuỗi HandlerInterceptor, các phương thức `#afterCompletion(...)` được thực thi.  
2019-11-17 12:31:38.109  INFO 28157 --- [nio-8080-exec-1] c.i.s.l.s.c.i.ThirdInterceptor           : [afterCompletion][handler(public void cn.iocoder.springboot.lab23.springmvc.controller.UserController.doSomething())]  
java.lang.RuntimeException: Cố ý ném lỗi

2019-11-17 12:31:38.116  INFO 28157 --- [nio-8080-exec-1] c.i.s.l.s.c.i.FirstInterceptor           : [afterCompletion][handler(public void cn.iocoder.springboot.lab23.springmvc.controller.UserController.doSomething())]  
```

### Giải thích:
- Các interceptor được thực thi theo thứ tự chuỗi `HandlerInterceptor`:
  - `preHandle()` thực thi từ interceptor đầu tiên (`FirstInterceptor`) đến cuối cùng (`ThirdInterceptor`).
  - `postHandle()` và `afterCompletion()` thực thi ngược lại, từ `ThirdInterceptor` về `FirstInterceptor`.
- `SecondInterceptor` không được kích hoạt vì nó chỉ được đăng ký cho đường dẫn `/users/current_user`.
- Mặc dù `ThirdInterceptor` ném ra ngoại lệ trong `afterCompletion()`, nó không ảnh hưởng đến việc thực thi `afterCompletion()` của `FirstInterceptor`.

### **② API `/users/current_user`**

```java
// UserController.java  

@GetMapping("/current_user")  
public UserVO currentUser() {  
    logger.info("[currentUser]");  
    return new UserVO().setId(10).setUsername(UUID.randomUUID().toString());  
}  
```

Khi gọi API này, kết quả log sẽ như sau:

```plaintext
// Đầu tiên, theo thứ tự của chuỗi HandlerInterceptor, các phương thức `#preHandle(...)` được thực thi.  
2019-11-17 12:48:37.357  INFO 28157 --- [nio-8080-exec-5] c.i.s.l.s.c.i.FirstInterceptor           : [preHandle][handler(public cn.iocoder.springboot.lab23.springmvc.vo.UserVO cn.iocoder.springboot.lab23.springmvc.controller.UserController.currentUser())]  
2019-11-17 12:48:37.357  INFO 28157 --- [nio-8080-exec-5] c.i.s.l.s.c.i.SecondInterceptor          : [preHandle][handler(public cn.iocoder.springboot.lab23.springmvc.vo.UserVO cn.iocoder.springboot.lab23.springmvc.controller.UserController.currentUser())]  

// Không có xử lý `handler` do `preHandle()` của SecondInterceptor trả về `false`.

// Chỉ có `afterCompletion()` của FirstInterceptor được thực thi.
2019-11-17 12:48:37.358  INFO 28157 --- [nio-8080-exec-5] c.i.s.l.s.c.i.FirstInterceptor           : [afterCompletion][handler(public cn.iocoder.springboot.lab23.springmvc.vo.UserVO cn.iocoder.springboot.lab23.springmvc.controller.UserController.currentUser())]  
```

### Giải thích:
- Vì `preHandle()` của `SecondInterceptor` trả về `false`, nên `handler` không được thực thi, và do đó, `postHandle()` không được gọi.
- Chỉ có `afterCompletion()` của `FirstInterceptor` được thực thi.

### **③ API `/users/exception-03`**

```java
// UserController.java  

@GetMapping("/exception-03")  
public void exception03() {  
    logger.info("[exception03]");  
    throw new ServiceException(ServiceExceptionEnum.USER_NOT_FOUND);  
}  
```

Khi gọi API này, kết quả log sẽ như sau:

```plaintext
// Đầu tiên, theo thứ tự của chuỗi HandlerInterceptor, các phương thức `#preHandle(...)` được thực thi.  
2019-11-17 12:54:45.029  INFO 28157 --- [nio-8080-exec-7] c.i.s.l.s.c.i.FirstInterceptor           : [preHandle][handler(public void cn.iocoder.springboot.lab23.springmvc.controller.UserController.exception03())]  
2019-11-17 12:54:45.029  INFO 28157 --- [nio-8080-exec-7] c.i.s.l.s.c.i.ThirdInterceptor           : [preHandle][handler(public void cn.iocoder.springboot.lab23.springmvc.controller.UserController.exception03())]  

// Xử lý `handler` ném ra ngoại lệ.
2019-11-17 12:54:45.029  INFO 28157 --- [nio-8080-exec-7] c.i.s.l.s.controller.UserController      : [exception03]  

// Chỉ có `afterCompletion()` được gọi sau khi handler ném ra ngoại lệ.
2019-11-17 12:54:45.036  INFO 28157 --- [nio-8080-exec-7] c.i.s.l.s.c.i.ThirdInterceptor           : [afterCompletion][handler(public void cn.iocoder.springboot.lab23.springmvc.controller.UserController.exception03())]  
2019-11-17 12:54:45.037 ERROR 28157 --- [nio-8080-exec-7] o.s.web.servlet.HandlerExecutionChain    : HandlerInterceptor.afterCompletion threw exception  
java.lang.RuntimeException: Cố ý ném lỗi  
```

### Giải thích:
- Do `handler` ném ra ngoại lệ, nên `postHandle()` không được gọi.
- Chỉ có `afterCompletion()` của các interceptor được thực thi.

## 6.4 Đọc Mở Rộng

Dưới đây, tác giả đã tổng hợp một số lớp triển khai `HandlerInterceptor` cho các tình huống khác nhau, bạn có thể tham khảo tùy theo nhu cầu:

- **Interceptor hạn chế tốc độ**: [《Ngăn chặn API bị spam trong dự án Spring Boot》](http://www.iocoder.cn/Fight/Spring-Boot-project-API-anti-brush-interface/?self)
- **Interceptor ghi nhật ký truy cập**: [`AccessLogInterceptor.java`](https://github.com/YunaiV/onemall/blob/master/common/mall-spring-boot/src/main/java/cn/iocoder/mall/spring/boot/web/interceptor/AccessLogInterceptor.java)
- **Interceptor xác thực và phân quyền người dùng**: [`UserSecurityInterceptor.java`](https://github.com/YunaiV/onemall/blob/master/user/user-sdk/src/main/java/cn/iocoder/mall/user/sdk/interceptor/UserSecurityInterceptor.java)
- **Interceptor xác thực và phân quyền quản trị viên**: [`AdminSecurityInterceptor.java`](https://github.com/YunaiV/onemall/blob/master/system/system-sdk/src/main/java/cn/iocoder/mall/admin/sdk/interceptor/AdminSecurityInterceptor.java)

Nếu bạn có ví dụ về `HandlerInterceptor` cho các tình huống khác, hãy để lại bình luận cho tác giả.

# 7. Servlet, Filter, Listener

Mặc dù trong phần lớn các trường hợp, chúng ta không cần sử dụng trực tiếp các thành phần `java.servlet` trong SpringMVC, nhưng khi làm việc với một số thư viện của bên thứ ba, họ thường cung cấp các thành phần trong `java.servlet`. Nguyên nhân là họ cần cung cấp các thành phần phổ biến và không thể gắn kết quá chặt với SpringMVC.

Ví dụ, khi sử dụng [Shiro](https://shiro.apache.org/) để thực hiện các chức năng xác thực quyền truy cập, chúng ta cần cấu hình `ShiroFilterFactoryBean` mà Shiro cung cấp. Điều này yêu cầu sử dụng các thành phần `Filter` mà Shiro cung cấp, thay vì SpringMVC thuần túy.

Chúng ta có **hai cách** để cấu hình `Servlet`, `Filter`, và `Listener` bằng mã Java:

1. Cấu hình thông qua Bean
2. Cấu hình thông qua Annotation

Dưới đây, chúng ta sẽ cùng tìm hiểu ví dụ của hai cách cấu hình này.

> **Lưu ý**: Ví dụ này được xây dựng dựa trên [lab-springmvc-23-02](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02), tiếp nối từ [Mục 6. Bộ chặn HandlerInterceptor](#).
## 7.1 Cấu hình qua Bean

Trong lớp cấu hình [SpringMVCConfiguration](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/config/SpringMVCConfiguration.java), chúng ta sẽ thêm cấu hình cho ba Bean là Servlet, Filter và Listener. Mã nguồn như sau:

```java
// SpringMVCConfiguration.java  
  
@Bean  
public ServletRegistrationBean testServlet01() {  
    ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean<>(new HttpServlet() {  
  
        @Override  
        protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {  
            logger.info("[doGet][uri: {}]", req.getRequestURI());  
        }  
  
    });  
    servletRegistrationBean.setUrlMappings(Collections.singleton("/test/01"));  
    return servletRegistrationBean;  
}  
  
@Bean  
public FilterRegistrationBean testFilter01() {  
    FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean<>(new Filter() {  
  
        @Override  
        public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {  
            logger.info("[doFilter]");  
            filterChain.doFilter(servletRequest, servletResponse);  
        }  
  
    });  
    filterRegistrationBean.setUrlPatterns(Collections.singleton("/test/*"));  
    return filterRegistrationBean;  
}  
  
@Bean  
public ServletListenerRegistrationBean<?> testListener01() {  
    return new ServletListenerRegistrationBean<>(new ServletContextListener() {  
  
        @Override  
        public void contextInitialized(ServletContextEvent sce) {  
            logger.info("[contextInitialized]");  
        }  
  
        @Override  
        public void contextDestroyed(ServletContextEvent sce) {  
        }  
  
    });  
}  
```

* Trong Spring Boot, đã cung cấp các lớp [ServletRegistrationBean](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot/src/main/java/org/springframework/boot/web/servlet/ServletRegistrationBean.java) để cấu hình Servlet Bean, [FilterRegistrationBean](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot/src/main/java/org/springframework/boot/web/servlet/FilterRegistrationBean.java) để cấu hình Filter Bean và [ServletListenerRegistrationBean](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot/src/main/java/org/springframework/boot/web/servlet/ServletListenerRegistrationBean.java) để cấu hình Listener Bean.
* Ở đây, chúng ta sử dụng lớp nội bộ để ví dụ đơn giản hơn. Tuy nhiên, trong thực tế, hãy định nghĩa các lớp riêng biệt để dễ quản lý hơn.

## 7.2 Cấu hình qua chú thích

Trong các tính năng mới của Servlet 3.0, đã cung cấp ba chú thích là [`@WebServlet`](https://github.com/javaee/servlet-spec/blob/master/src/main/java/javax/servlet/annotation/WebServlet.java)、[`@WebFilter`](https://github.com/javaee/servlet-spec/blob/master/src/main/java/javax/servlet/annotation/WebFilter.java) và [`@WebListener`](https://github.com/javaee/servlet-spec/blob/master/src/main/java/javax/servlet/annotation/WebListener.java) để dễ dàng cấu hình Servlet, Filter và Listener.

Trong Spring Boot, chúng ta chỉ cần thêm chú thích [`@ServletComponentScan`](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot/src/main/java/org/springframework/boot/web/servlet/ServletComponentScan.java) vào lớp Application, để kích hoạt việc quét các chú thích `@WebServlet`, `@WebFilter`, `@WebListener`. Tuy nhiên, cần **lưu ý** rằng điều này chỉ có hiệu lực khi sử dụng Web Server **nhúng**.

Trong gói [`cn.iocoder.springboot.lab23.springmvc.core.servlet`](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/core/servlet), chúng ta đã tạo ba ví dụ. Mã nguồn như sau:

```java
// TestServlet02.java  
@WebServlet(urlPatterns = "/test/02")  
public class TestServlet02 extends HttpServlet {  
  
    private Logger logger = LoggerFactory.getLogger(getClass());  
  
    @Override  
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {  
        logger.info("[doGet][uri: {}]", req.getRequestURI());  
    }  
}  
  
// TestFilter02.java  
@WebFilter("/test/*")  
public class TestFilter02 implements Filter {  
  
    private Logger logger = LoggerFactory.getLogger(getClass());  
  
    @Override  
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {  
        logger.info("[doFilter]");  
        filterChain.doFilter(servletRequest, servletResponse);  
    }  
}  
  
// TestServletContextListener02.java  
@WebListener  
public class TestServletContextListener02 implements ServletContextListener {  
  
    private Logger logger = LoggerFactory.getLogger(getClass());  
  
    @Override  
    public void contextInitialized(ServletContextEvent sce) {  
        logger.info("[contextInitialized]");  
    }  
  
    @Override  
    public void contextDestroyed(ServletContextEvent sce) {  
    }  
}  
```

# 8. CORS (Cross-Origin Resource Sharing)

> Mã ví dụ tương ứng với kho lưu trữ: [lab-springmvc-23-02](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02).

Sau khi tách biệt frontend và backend, chúng ta sẽ gặp phải vấn đề liên quan đến CORS. Ví dụ, frontend nằm ở miền [http://www.iocoder.cn](http://www.iocoder.cn) trong khi API backend ở miền [http://api.iocoder.cn](http://api.iocoder.cn).

Đối với những bạn chưa hiểu rõ về CORS, có thể tham khảo bài viết [Tìm hiểu về CORS](https://www.ruanyifeng.com/blog/2016/04/cors.html) của tác giả Ruanyu. 😈 Tất nhiên, bạn cũng có thể tiếp tục đọc bài viết này.

Có nhiều cách để giải quyết vấn đề CORS, chẳng hạn như cấu hình các tham số xử lý yêu cầu CORS trên Nginx. Hay trong trường hợp có dịch vụ gateway trong dự án, bạn có thể cấu hình đồng nhất. Tuy nhiên, vì bài viết này tập trung vào Spring Boot và Spring MVC, nên chúng ta sẽ chỉ sử dụng Spring MVC để giải quyết vấn đề CORS. Hiện có ba giải pháp:

* **Giải pháp 1**: Sử dụng chú thích [`@CrossOrigin`](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/bind/annotation/CrossOrigin.java) để cấu hình cho từng API.
* **Giải pháp 2**: Sử dụng bảng [`CorsRegistry.java`](https://github.com/spring-projects/spring-framework/blob/master/spring-webmvc/src/main/java/org/springframework/web/servlet/config/annotation/CorsRegistry.java) để đăng ký cho từng API.
* **Giải pháp 3**: Sử dụng **bộ lọc** [`CorsFilter.java`](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/filter/CorsFilter.java) để xử lý các yêu cầu CORS.

Trong đó, giải pháp 1 và giải pháp 2 về bản chất là giống nhau, chỉ khác nhau ở cách cấu hình. Những bạn muốn hiểu nguyên lý bên dưới có thể tham khảo [CorsInterceptor](https://github.com/spring-projects/spring-framework/blob/master/spring-webmvc/src/main/java/org/springframework/web/servlet/handler/AbstractHandlerMapping.java#L561-L582) **bộ lọc**.

> Lưu ý: Ví dụ này được phát triển dựa trên [「7. Servlet, Filter, Listener」](#) trong [lab-springmvc-23-02](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02).
## 8.1 @CrossOrigin

Chú thích `@CrossOrigin` được thêm vào lớp hoặc phương thức để đánh dấu thông tin CORS cho API tương ứng.

Các **thuộc tính thường dùng** của chú thích `@CrossOrigin` như sau:

*   Thuộc tính `origins`: thiết lập nguồn yêu cầu được phép. Đây là một mảng `[]` có thể chứa nhiều nguồn yêu cầu. Giá trị mặc định là `*`.
*   Thuộc tính `value`: giống như thuộc tính `origins`, đây là bí danh của nó.
*   Thuộc tính `allowCredentials`: xác định xem có cho phép yêu cầu từ phía client gửi Cookie hay không. Giá trị mặc định là `false`, không cho phép gửi Cookie.
*   Thuộc tính `maxAge`: thời gian hiệu lực của yêu cầu kiểm tra trước (preflight request) trong đơn vị giây. Giá trị mặc định là 1800 giây.

Các **thuộc tính ít được sử dụng** của chú thích `@CrossOrigin` như sau:

*   Thuộc tính `methods`: thiết lập các phương thức yêu cầu được phép. Đây cũng là một mảng `[]` có thể chứa nhiều phương thức yêu cầu. Giá trị mặc định là `GET + POST`.
*   Thuộc tính `allowedHeaders`: các header yêu cầu được phép. Đây cũng là một mảng `[]` có thể chứa nhiều header. Giá trị mặc định là `*`.
*   Thuộc tính `exposedHeaders`: các header phản hồi được phép. Đây cũng là một mảng `[]` có thể chứa nhiều header. Giá trị mặc định là `*`.

Trong hầu hết các trường hợp, bạn chỉ cần thêm chú thích `@CrossOrigin` lên **mỗi** Controller. Tuy nhiên, nếu một API cụ thể muốn cấu hình tùy chỉnh, bạn có thể thêm chú thích này lên phương thức. Ví dụ như sau:

```java
// TestController.java  

@RestController  
@RequestMapping("/test")  
@CrossOrigin(origins = "*", allowCredentials = "true") // Cho phép tất cả nguồn, cho phép gửi Cookie  
public class TestController {  

    /**  
     * Lấy người dùng theo ID được chỉ định  
     *  
     * @return Người dùng  
     */  
    @GetMapping("/get")  
    @CrossOrigin(allowCredentials = "false") // Cho phép tất cả nguồn, không cho phép gửi Cookie  
    public UserVO get() {  
        return new UserVO().setId(1).setUsername(UUID.randomUUID().toString());  
    }  
}  
```

**Trong hầu hết các trường hợp, bạn chỉ cần thêm `@CrossOrigin(allowCredentials = "true")` lên Controller là đủ.**

**Một số vấn đề cần lưu ý**

Khi frontend sử dụng thư viện mạng tuân thủ tiêu chuẩn CORS, chẳng hạn như thư viện mạng phổ biến trong Vue là [axios](https://github.com/axios/axios), khi gửi [yêu cầu không đơn giản](https://www.ruanyifeng.com/blog/2016/04/cors.html), nó sẽ tự động gửi trước một yêu cầu `OPTIONS` để xác nhận xem server có cho phép yêu cầu như vậy hay không. Do đó, yêu cầu này sẽ được xử lý bởi bộ lọc của Spring MVC.

Lúc này, nếu bộ lọc của chúng ta cho rằng `handler` **chắc chắn** là loại `HandlerMethod`, sẽ dẫn đến lỗi. Chẳng hạn, trong bộ lọc [UserSecurityInterceptor](https://github.com/YunaiV/onemall/blob/master/user/user-sdk/src/main/java/cn/iocoder/mall/user/sdk/interceptor/UserSecurityInterceptor.java), nó sẽ coi `handler` là loại `HandlerMethod` và sau đó lấy thông tin chú thích `@RequiresLogin` để xác định xem có cần đăng nhập hay không. Nhưng thực tế, lúc này `handler` lại là loại [PreFlightHandler](https://github.com/spring-projects/spring-framework/blob/master/spring-webmvc/src/main/java/org/springframework/web/servlet/handler/AbstractHandlerMapping.java#L539-L558), do đó sẽ ném ra ngoại lệ. Như hình dưới đây:

![getCorsHandlerExecutionChain](https://static.iocoder.cn/images/Spring-Boot/2019-11-17/03.png)

Trong trường hợp này, có hai giải pháp:

1. Kiểm tra từng bộ lọc để xác nhận xem có phải phụ thuộc vào logic cho rằng `handler` là `HandlerMethod` hay không và thực hiện sửa chữa.
2. Không sử dụng giải pháp này mà thay vào đó áp dụng [「8.3 CorsFilter」](#) để tránh việc yêu cầu `OPTIONS` đi qua bộ lọc.

Rõ ràng, giải pháp `1)` có chi phí cao hơn một chút, vì vậy trong hầu hết các trường hợp, khuyến nghị sử dụng `2)`. Hiện tại, dự án của tôi cũng áp dụng phương pháp [「8.3 CorsFilter」](#).

😈 Trong bài viết [《【SpringMVC】与权限拦截器冲突导致的 Cors 跨域设置失效问题》](https://segmentfault.com/a/1190000010348077), bạn cũng có thể thấy một nhà phát triển gặp phải vấn đề tương tự.

## 8.2 CorsRegistry

Rõ ràng, việc cấu hình chú thích `@CrossOrigin` trên mỗi Controller là một công việc khá phức tạp. Vì vậy, trong nhiều trường hợp, chúng ta sẽ chọn cấu hình thông qua `CorsRegistry`.

Hãy sửa đổi lớp cấu hình [SpringMVCConfiguration](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/config/SpringMVCConfiguration.java) để thêm cấu hình liên quan đến `CorsRegistry`. Dưới đây là đoạn mã:

```java
// SpringMVCConfiguration.java  

@Override  
public void addCorsMappings(CorsRegistry registry) {  
    // Thêm cấu hình CORS toàn cầu  
    registry.addMapping("/**") // Khớp với tất cả URL, tương đương với cấu hình toàn cầu  
            .allowedOrigins("*") // Cho phép tất cả nguồn yêu cầu  
            .allowCredentials(true) // Cho phép gửi Cookie  
            .allowedMethods("*") // Cho phép tất cả phương thức yêu cầu  
            .allowedHeaders("*") // Cho phép tất cả header yêu cầu  
//            .exposedHeaders("*") // Cho phép tất cả header phản hồi  
            .maxAge(1800L); // Thời gian hiệu lực 1800 giây, tức 2 giờ  
}  
```

- Ở đây, cấu hình đường dẫn khớp là `/**`, cho phép cấu hình CORS toàn cầu.
- Nếu bạn muốn cấu hình CORS cho một đường dẫn cụ thể, có thể sử dụng phương thức `CorsRegistry#addMapping(String pathPattern)` để thêm cấu hình CORS.
- Nếu bạn muốn an toàn hơn, có thể chỉ định các địa chỉ miền frontend cho thuộc tính `origins`.

Phương pháp này cũng sẽ gặp phải những vấn đề tương tự như trong phần [「8.1 @CrossOrigin」](#), vì hai phương pháp này có cách triển khai tương tự. Vì vậy, hãy tiếp tục xem xét phương pháp [「8.3 CorsFilter」](#).
## 8.3 CorsFilter

Trong [Spring Web](https://github.com/spring-projects/spring-framework/tree/master/spring-web), đã cung cấp sẵn bộ lọc `CorsFilter` để xử lý CORS.

Cách cấu hình rất đơn giản. Vì đây là một bộ lọc (Filter), chúng ta có thể sử dụng cách [「7.1 Cấu hình qua Bean」](#) để cấu hình. Do đó, hãy chỉnh sửa lớp cấu hình [SpringMVCConfiguration](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/config/SpringMVCConfiguration.java) để thêm cấu hình liên quan đến `CorsFilter`. Dưới đây là đoạn mã:

```java
// SpringMVCConfiguration.java  

@Bean  
public FilterRegistrationBean<CorsFilter> corsFilter() {  
    // Tạo UrlBasedCorsConfigurationSource, giống như CorsRegistry  
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();  
    // Tạo CorsConfiguration, tương đương với thông tin CorsRegistration  
    CorsConfiguration config = new CorsConfiguration();  
    config.setAllowedOrigins(Collections.singletonList("*")); // Cho phép tất cả nguồn yêu cầu  
    config.setAllowCredentials(true); // Cho phép gửi Cookie  
    config.addAllowedMethod("*"); // Cho phép tất cả phương thức yêu cầu  
    config.setAllowedHeaders(Collections.singletonList("*")); // Cho phép tất cả header yêu cầu  
    // config.setExposedHeaders(Collections.singletonList("*")); // Cho phép tất cả header phản hồi  
    config.setMaxAge(1800L); // Thời gian hiệu lực 1800 giây, tức 2 giờ  
    source.registerCorsConfiguration("/**", config);  
    // Tạo đối tượng FilterRegistrationBean  
    FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(  
            new CorsFilter(source)); // Tạo bộ lọc CorsFilter  
    bean.setOrder(0); // Thiết lập thứ tự. Thứ tự này rất quan trọng, nên hãy đặt ở vị trí đầu tiên  
    return bean;  
}
```

- Tôi đã thêm các chú thích chi tiết, các bạn tự xem nhé. Về hiệu ứng, nó giống như phương pháp [「8.2 CorsRegistry」](#).

Đến đây, chúng ta đã học xong ba cách cấu hình CORS trong SpringMVC. **Kết luận là, nên sử dụng phương pháp [「8.3 CorsFilter」](#)**. 😈 Cảm thấy mình nói hơi nhiều rồi. Cuối cùng, tôi muốn giới thiệu một bài viết mà tôi thấy viết rất hay: [《Spring 里那么多种 CORS 的配置方式，到底有什么区》](https://segmentfault.com/a/1190000019485883).

# 9. HttpMessageConverter chuyển đổi nội dung tin nhắn

> Mã nguồn nằm trong：[lab-springmvc-23-02](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02)。

Trong Spring MVC, chúng ta có thể sử dụng hai chú thích `@RequestBody` và `@ResponseBody` để thực hiện việc **chuyển đổi nội dung yêu cầu thành đối tượng** và **đối tượng thành nội dung phản hồi**. Cơ chế chuyển đổi linh hoạt này được thực hiện bởi `HttpMessageConverter` được giới thiệu trong Spring 3.x, tức là cơ chế chuyển đổi tin nhắn.

Với giải thích như vậy, có lẽ bạn vẫn chưa thực sự thấu hiểu. 😜 Trong ví dụ trên, chúng ta đã thấy rằng khi trả về một đối tượng `UserVO`, nó cuối cùng được xuất ra dưới dạng chuỗi JSON cho phía trước, điều này được thực hiện bởi `MappingJackson2HttpMessageConverter`, bộ chuyển đổi tin nhắn chuyển đổi đối tượng `UserVO` thành chuỗi JSON để trả về phía trước. 😈 Bây giờ bạn đã hiểu hơn một chút chưa?

Trong một số tình huống nghiệp vụ, khi phía trước gửi các tham số đến API backend có thể phức tạp, có thể chúng ta muốn sử dụng định dạng JSON để gửi đến API backend. Lúc này, chúng ta có thể sử dụng bộ chuyển đổi `MappingJackson2HttpMessageConverter` để chuyển đổi chuỗi JSON thành đối tượng tương ứng. 😈 Có phải mọi thứ đã trở nên rõ ràng hơn chưa?

Hãy cùng xem qua giao diện `HttpMessageConverter`, dưới đây là mã nguồn:

```java
// HttpMessageConverter.java  

// Kiểm tra xem có thể đọc loại nội dung mediaType cụ thể, chuyển đổi thành đối tượng clazz hay không  
boolean canRead(Class<?> clazz, @Nullable MediaType mediaType);  
// Đọc nội dung yêu cầu, chuyển đổi thành đối tượng clazz  
T read(Class<? extends T> clazz, HttpInputMessage inputMessage)  
			throws IOException, HttpMessageNotReadableException;  
  
// Kiểm tra xem có thể tuần tự hóa đối tượng clazz thành loại nội dung mediaType hay không  
boolean canWrite(Class<?> clazz, @Nullable MediaType mediaType);  
// Tuần tự hóa đối tượng clazz thành loại nội dung contentType và ghi vào phản hồi.  
void write(T t, @Nullable MediaType contentType, HttpOutputMessage outputMessage)  
			throws IOException, HttpMessageNotWritableException;  
  
// Lấy loại nội dung mà HttpMessageConverter có thể hỗ trợ.  
List<MediaType> getSupportedMediaTypes();  
```

- Trong **yêu cầu**, chúng ta chỉ định loại nội dung của nội dung yêu cầu (Request Body) thông qua tiêu đề `Content-Type`. Khi đó, Spring MVC sẽ kiểm tra mảng **HttpMessageConverter** của mình bằng phương thức `#canRead(clazz, mediaType)` để xác định xem có thể đọc loại nội dung `mediaType` cụ thể hay không, và chuyển đổi thành đối tượng `clazz`. Nếu có thể, nó sẽ gọi phương thức `#read(Class<? extends T> clazz, HttpInputMessage inputMessage)` để đọc nội dung yêu cầu và chuyển đổi thành đối tượng `clazz`.
  
- Trong **phản hồi**, chúng ta chỉ định loại nội dung của nội dung phản hồi (Response Body) thông qua tiêu đề `Accept`. Khi đó, Spring MVC sẽ kiểm tra mảng **HttpMessageConverter** của mình bằng phương thức `#canWrite(clazz, mediaType)` để xác định xem có thể tuần tự hóa đối tượng `clazz` thành loại nội dung `mediaType` hay không. Nếu có thể, nó sẽ gọi phương thức `#write(contentType, outputMessage)` để tuần tự hóa đối tượng `clazz` thành loại nội dung `contentType` và ghi vào phản hồi.

Nếu bạn vẫn chưa hiểu, chúng ta hãy cùng nhau xem xét một ví dụ. Chúng ta sẽ thực hiện một API thêm người dùng, hỗ trợ **định dạng JSON/XML** cho cả việc gửi dữ liệu và phản hồi dữ liệu.

> Lưu ý: Ví dụ này dựa trên nền tảng của [「8. Cors 」](#) trong kho lưu trữ [lab-springmvc-23-02](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02).

## 9.1 Nhập phụ thuộc

Trong tệp [`pom.xml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/pom.xml), **thêm** phụ thuộc [`jackson-dataformat-xml`](https://mvnrepository.com/artifact/com.fasterxml.jackson.dataformat/jackson-dataformat-xml) như sau:

```xml
<!-- Thêm jackson để chuyển đổi sang xml, thực hiện tuần tự hóa đối với XML -->  
<dependency>  
    <groupId>com.fasterxml.jackson.dataformat</groupId>  
    <artifactId>jackson-dataformat-xml</artifactId>  
</dependency>  
```

## 9.2 SpringMVCConfiguration

Sửa đổi lớp cấu hình [SpringMVCConfiguration](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/config/SpringMVCConfiguration.java) để thêm cấu hình liên quan đến `MappingJackson2XmlHttpMessageConverter`, dùng cho bộ chuyển đổi `HttpMessageConverter` định dạng XML. Mã như sau:

```java
// SpringMVCConfiguration.java  

@Override  
public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {  
    // Thêm bộ chuyển đổi tin nhắn XML  
    Jackson2ObjectMapperBuilder xmlBuilder = Jackson2ObjectMapperBuilder.xml();  
    xmlBuilder.indentOutput(true);  
    converters.add(new MappingJackson2XmlHttpMessageConverter(xmlBuilder.build()));  
}  
```

## 9.3 UserController

Trong lớp [UserController](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/controller/UserController.java), chúng ta thêm một API để tạo người dùng, thuận tiện cho việc xử lý yêu cầu và phản hồi định dạng XML/JSON. Mã như sau:

```java
// UserController.java  

@PostMapping(value = "/add",  
        // ↓ Thêm "application/xml", "application/json" cho tiêu đề yêu cầu Content-Type  
        consumes = {MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE},  
        // ↓ Thêm "application/xml", "application/json" cho tiêu đề yêu cầu Accept  
        produces = {MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE}  
)  
public UserVO add(@RequestBody UserVO user) {  
    return user;  
}  
```

### Yêu cầu
- Trong tham số của giao diện, chúng ta đã thêm chú thích `@RequestBody`.
- Thêm thuộc tính `consumes`, tăng cường `"application/xml"`, `"application/json"` cho tiêu đề yêu cầu `Content-Type`.

### Phản hồi
- Bởi vì `UserController` đã thêm chú thích `@RestController`, chúng ta không cần phải thêm chú thích `@ResponseBody` cho API này.
- Thêm thuộc tính `produces`, tăng cường `"application/xml"`, `"application/json"` cho tiêu đề yêu cầu `Accept`.

Sau đây, chúng ta sẽ sử dụng [Postman](https://www.getpostman.com/) để mô phỏng yêu cầu.

**① Yêu cầu định dạng JSON, phản hồi định dạng JSON**

![JSON + JSON](https://static.iocoder.cn/images/Spring-Boot/2019-11-17/04.png)

**② Yêu cầu định dạng XML, phản hồi định dạng XML**

![XML + XML](https://static.iocoder.cn/images/Spring-Boot/2019-11-17/05.png)

**③ Yêu cầu định dạng JSON, phản hồi định dạng XML**

![JSON + XML](https://static.iocoder.cn/images/Spring-Boot/2019-11-17/06.png)

# 10. Tích hợp Fastjson

> Mã ví dụ tương ứng với kho lưu trữ: [lab-springmvc-23-02](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02).

Tham khảo bài viết [《Tích hợp Fastjson trong Spring》](https://github.com/alibaba/fastjson/wiki/%E5%9C%A8-Spring-%E4%B8%AD%E9%9B%86%E6%88%90-Fastjson).

Chúng ta có thể muốn sử dụng Fastjson làm công cụ mặc định cho JSON để nâng cao hiệu suất tuần tự hóa và giải tuần tự hóa JSON. Trong Fastjson, đã có sẵn [FastJsonHttpMessageConverter](https://github.com/alibaba/fastjson/blob/master/src/main/java/com/alibaba/fastjson/support/spring/FastJsonHttpMessageConverter.java), giúp chúng ta thay thế bộ chuyển đổi `HttpMessageConverter` mặc định của SpringMVC.

> Lưu ý: Ví dụ này dựa trên [「8. CORS」](#) của [lab-springmvc-23-02](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-23/lab-springmvc-23-02) để tiếp tục cải tiến.

## 10.1 Nhập phụ thuộc

Trong tệp [`pom.xml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/pom.xml), **thêm** phụ thuộc [`fastjson`](https://mvnrepository.com/artifact/com.alibaba/fastjson) như sau:

```xml
<!-- Thêm Fastjson, thực hiện tuần tự hóa đối với JSON -->  
<dependency>  
    <groupId>com.alibaba</groupId>  
    <artifactId>fastjson</artifactId>  
    <version>1.2.62</version>  
</dependency>  
```

## 10.2 SpringMVCConfiguration

Sửa đổi lớp cấu hình [SpringMVCConfiguration](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/config/SpringMVCConfiguration.java) để thêm cấu hình liên quan đến `FastJsonHttpMessageConverter`. Mã như sau:

```java
// SpringMVCConfiguration.java  

@Override  
public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {  
    // Tạo đối tượng FastJsonHttpMessageConverter  
    FastJsonHttpMessageConverter fastJsonHttpMessageConverter = new FastJsonHttpMessageConverter();  
    // Tùy chỉnh cấu hình FastJson  
    FastJsonConfig fastJsonConfig = new FastJsonConfig();  
    fastJsonConfig.setCharset(Charset.defaultCharset()); // Thiết lập bộ mã ký tự  
    fastJsonConfig.setSerializerFeatures(SerializerFeature.DisableCircularReferenceDetect); // Bỏ qua tham chiếu vòng  
    fastJsonHttpMessageConverter.setFastJsonConfig(fastJsonConfig);  
    // Thiết lập MediaType hỗ trợ  
    fastJsonHttpMessageConverter.setSupportedMediaTypes(Arrays.asList(MediaType.APPLICATION_JSON,  
            MediaType.APPLICATION_JSON_UTF8));  
    // Thêm vào converters  
    converters.add(0, fastJsonHttpMessageConverter); // Lưu ý, thêm vào đầu tiên, đặt trước MappingJackson2XmlHttpMessageConverter  
}  
```

Đến đây, việc tích hợp Fastjson vào SpringMVC đã hoàn tất, rất thuận tiện!

# 666. Tổng kết

Tóm lại, đầy là một bài viết dài nhưng mà nó đầy đủ các kiến thức cơ bản về Spring MVC mà các bạn sẽ phải đối mặt trong các dự án thực tế được tổng hợp đầy đủ và gọn gàng.

Nếu trong bài viết này có gì không chính xác hoặc khiến bạn đọc hiểu lầm, rất mong bạn để lại lời nhắn cho mình.