---
title: Spring Boot + MinIO
tags:
  - java
  - spring-boot
categories:
  - spring-boot
order: 15
---
# Spring Boot + MinIO

> Bài viết này cung cấp một ví dụ mã hoàn chỉnh, có thể xem tại [https://github.com/YunaiV/SpringBoot-Labs](https://github.com/YunaiV/SpringBoot-Labs) trong thư mục [lab-72-minio](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-72-minio).
> 
> Bài viết gốc không dễ dàng, hãy cho một [Star](https://github.com/YunaiV/SpringBoot-Labs/stargazers) nhé, cùng nhau cố gắng nào!

# 1. Giới thiệu về MinIO


![](https://min.io/resources/img/logo.svg)

MinIO là một hệ thống lưu trữ đối tượng hiệu suất cao, tương thích với giao thức S3, được phát triển bằng Go. Nó sử dụng giấy phép nguồn mở GNU AGPL v3, với địa chỉ dự án tại [https://github.com/minio/minio](https://github.com/minio/minio), và trang chủ là [https://min.io](https://min.io).

MinIO phù hợp để lưu trữ lượng lớn dữ liệu phi cấu trúc, chẳng hạn như các tệp phổ biến như hình ảnh, âm thanh, video, dữ liệu sao lưu, container, ảnh máy ảo, v.v. Nó có thể hỗ trợ các tệp từ 1 KB đến 5 TB.

Các công ty như Alibaba, Tencent, Baidu, Huawei, China Mobile, China Unicom và nhiều doanh nghiệp khác trong nước đang sử dụng MinIO, thậm chí một số công ty thương mại còn phát triển thêm MinIO để cung cấp các sản phẩm lưu trữ đám mây thương mại.

> Câu hỏi: Tại sao ngày càng ít người sử dụng FastDFS để triển khai dịch vụ lưu trữ tệp?
> 
> Các lý do bao gồm: triển khai và vận hành phức tạp, không có tài liệu chính thức, thiếu đội ngũ duy trì lâu dài, hiệu suất kém, không cung cấp giải pháp tích hợp Docker & Kubernetes, v.v.

Trong bài viết này, tác giả sẽ hướng dẫn bạn sử dụng MinIO để tự xây dựng một dịch vụ lưu trữ tệp và tải ảnh lên MinIO trong dự án Spring Boot.

# 2. Cài đặt MinIO Server

Vì MinIO được viết bằng Go, nên chỉ cần một chương trình chạy, do đó việc cài đặt và triển khai MinIO rất đơn giản.

Trong tài liệu [https://min.io/download](https://min.io/download), có sáu phương thức cài đặt bao gồm Windows, Linux, MacOS, Docker, Kubernetes và Source.

Sau đây, chúng ta sẽ cài đặt MinIO, bạn có thể chọn phương thức phù hợp với mình.

## 2.1 Cài đặt nhanh

### 2.1.1 Windows

Thực hiện trong [Windows PowerShell](https://docs.microsoft.com/zh-cn/powershell/scripting/windows-powershell/starting-windows-powershell).

```bash
Invoke-WebRequest -Uri "https://dl.min.io/server/minio/release/windows-amd64/minio.exe" -OutFile "C:\\minio.exe" ## Tài nguyên nước ngoài, tải chậm  
setx MINIO_ROOT_USER admin  
setx MINIO_ROOT_PASSWORD password  
C:\\minio.exe server F:\\Data --console-address ":9001" ## F:\\Data là thư mục lưu trữ; --console-address là cổng giao diện UI  
```

### 2.1.2 Linux

```bash
wget https://dl.min.io/server/minio/release/linux-amd64/minio ## Tài nguyên nước ngoài, tải chậm  
chmod +x minio  
MINIO_ROOT_USER=admin MINIO_ROOT_PASSWORD=password ./minio server /Users/yunai/minio --console-address ":9001" ## /Users/yunai/minio là thư mục lưu trữ; --console-address là cổng giao diện UI  
```

## 2.1.3 MacOS

```bash
wget https://dl.min.io/server/minio/release/darwin-amd64/minio ## Tài nguyên nước ngoài, tải chậm  
chmod +x minio  
MINIO_ROOT_USER=admin MINIO_ROOT_PASSWORD=password ./minio server F:\Data --console-address ":9001" ## F:\Data là thư mục lưu trữ; --console-address là cổng giao diện UI  
```

### 2.1.4 Docker

① Windows:

```bash
docker run -p 9000:9000 -p 9001:9001 -e "MINIO_ACCESS_KEY=admin" -e "MINIO_SECRET_KEY=password" minio/minio server /data --console-address ":9001" ## /Users/yunai/minio là thư mục lưu trữ; --console-address là cổng giao diện UI  
```

② Linux hoặc MacOS:

```bash
docker run -p 9000:9000 -p 9001:9001 -e "MINIO_ACCESS_KEY=admin" -e "MINIO_SECRET_KEY=password" minio/minio server /Users/yunai/minio --console-address ":9001" ## /Users/yunai/minio là thư mục lưu trữ; --console-address là cổng giao diện UI  
```

## 2.2 Truy cập giao diện UI

Sử dụng trình duyệt truy cập địa chỉ [http://127.0.0.1:9001](http://127.0.0.1:9001) để vào giao diện UI tích hợp của MinIO.

Nhập tài khoản là admin và mật khẩu là password để đăng nhập thành công vào trang chủ.

![Trang chủ UI](https://static.iocoder.cn/images/Spring-Boot/2022-03-18/01.png)

## 2.3 Tạo mới Bucket

Nhấn vào nút \[Create Bucket\] để tạo một Bucket dùng cho việc tải tệp lên sau này.

![Tạo Bucket](https://static.iocoder.cn/images/Spring-Boot/2022-03-18/02.png)

## 2.4 Thêm quy tắc truy cập readonly

Theo cấu hình mặc định, truy cập vào Bucket cần được cấp quyền. Tuy nhiên, trong một số trường hợp thực tế, chúng ta thường muốn cho phép truy cập trực tiếp, và cần thêm một quy tắc truy cập readonly.

① Nhấn vào biểu tượng \[Configure Bucket\] ở góc phải phía trên, sau đó chọn menu \[Access Rules\].

![Quy tắc truy cập](https://static.iocoder.cn/images/Spring-Boot/2022-03-18/05.png)

② Nhấn nút \[Add Access Rule\] và thêm một quy tắc với Prefix là `/` và Access là `readonly`.

![Thêm quy tắc truy cập](https://static.iocoder.cn/images/Spring-Boot/2022-03-18/06.png)

## 2.5 Tải tệp lên

Nhấn vào nút \[Upload\], chọn \[Upload File\], sau đó chọn một hình ảnh để tải lên.

![Tải tệp lên](https://static.iocoder.cn/images/Spring-Boot/2022-03-18/03.png)

## 2.6 Truy cập tệp

Địa chỉ truy cập tệp có định dạng `<http://127.0.0.1:9000/{bucket}/{name}>`, lưu ý rằng cổng là 9000.

Tệp vừa tải lên có `{bucket}` là yudaoyuanma và `{name}` là 822aebded6e6414e912534c6091771a4.jpg, vì vậy đường dẫn truy cập cuối cùng sẽ là [http://127.0.0.1:9000/yudaoyuanma/822aebded6e6414e912534c6091771a4.jpg](http://127.0.0.1:9000/yudaoyuanma/822aebded6e6414e912534c6091771a4.jpg).

![Truy cập tệp](https://static.iocoder.cn/images/Spring-Boot/2022-03-18/07.png)
# 3\. Công cụ dòng lệnh MinIO Client

MinIO Client (mc) là công cụ dòng lệnh do MinIO cung cấp, được sử dụng để truy cập MinIO Server. Thiết kế các lệnh của nó rất tuyệt vời, tương tự như các lệnh Unix như ls, cat, cp, mirror, diff, find, v.v. Các lệnh chính bao gồm:

- ls: liệt kê các tệp và thư mục  
- mb: tạo một bucket hoặc thư mục  
- cat: hiển thị nội dung của tệp và đối tượng  
- pipe: chuyển hướng một STDIN đến một đối tượng, tệp hoặc STDOUT  
- share: tạo URL để chia sẻ  
- cp: sao chép tệp và đối tượng  
- mirror: tạo bản sao lưu cho bucket và thư mục  
- find: tìm tệp dựa trên tham số  
- diff: so sánh sự khác biệt giữa hai thư mục hoặc bucket  
- rm: xóa tệp và đối tượng  
- events: quản lý thông báo đối tượng  
- watch: theo dõi các sự kiện tệp và đối tượng  
- policy: quản lý chính sách truy cập  
- session: quản lý phiên lưu cho lệnh cp  
- config: quản lý tệp cấu hình mc  
- update: kiểm tra bản cập nhật phần mềm  
- version: hiển thị thông tin phiên bản  

Ví dụ, sử dụng `mc ls` để liệt kê các Bucket:

![mc Ví dụ](https://static.iocoder.cn/images/Spring-Boot/2022-03-18/08.png)

Xem xét rằng bạn có thể không quá quan tâm đến MinIO Client, nên tạm thời mình sẽ không đi sâu vào chi tiết. Nếu quan tâm, bạn có thể tham khảo các tài liệu sau:

- Cài đặt MinIO Client: [https://min.io/download](https://min.io/download)  
- Lệnh MinIO Client: [https://docs.min.io/minio/baremetal/reference/minio-mc.html](https://docs.min.io/minio/baremetal/reference/minio-mc.html)

# 4\. Thực hành Spring Boot

> Mã ví dụ liên quan: [lab-72-minio](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-72-minio) .

Tiếp theo, chúng ta sẽ tạo một dự án Spring Boot mới [lab-72-minio](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-72-minio), để thực hiện chức năng tải lên và xóa tệp.

## 4.1 Thêm phụ thuộc

Trong tệp [`pom.xml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-72-minio/pom.xml), thêm các phụ thuộc liên quan đến MinIO.

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0"  
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">  
    <parent>  
        <groupId>org.springframework.boot</groupId>  
        <artifactId>spring-boot-starter-parent</artifactId>  
        <version>2.6.4</version>  
        <relativePath/> <!-- lookup parent from repository -->  
    </parent>  
    <modelVersion>4.0.0</modelVersion>  
  
    <artifactId>lab-72-minio</artifactId>  
  
    <dependencies>  
        <!-- Tự động cấu hình cho Spring MVC -->  
        <dependency>  
            <groupId>org.springframework.boot</groupId>  
            <artifactId>spring-boot-starter-web</artifactId>  
        </dependency>  
  
        <!-- MinIO Client -->  
        <dependency>  
            <groupId>io.minio</groupId>  
            <artifactId>minio</artifactId>  
            <version>8.2.2</version>  
        </dependency>  
    </dependencies>  
</project>  
```

Lưu ý, nếu bạn thêm phiên bản MinIO quá cao, chẳng hạn như `8.3.7`, sẽ có lỗi xung đột phụ thuộc:

```
2022-03-19 11:29:59.954 ERROR 77692 --- [           main] o.s.b.d.LoggingFailureAnalysisReporter   :   
  
*********************************  
APPLICATION FAILED TO START  
*********************************  
  
Description:  
  
An attempt was made to call a method that does not exist. The attempt was made from the following location:  
  
    io.minio.S3Base.<clinit>(S3Base.java:98)  
  
The following method did not exist:  
  
    okhttp3.RequestBody.create([BLokhttp3/MediaType;)Lokhttp3/RequestBody;  
  
The calling method's class, io.minio.S3Base, was loaded from the following location:  
  
    jar:file:/Users/yunai/.m2/repository/io/minio/minio/8.3.7/minio-8.3.7.jar!/io/minio/S3Base.class  
  
The called method's class, okhttp3.RequestBody, is available from the following locations:  
  
    jar:file:/Users/yunai/.m2/repository/com/squareup/okhttp3/okhttp/3.14.9/okhttp-3.14.9.jar!/okhttp3/RequestBody.class  
  
The called method's class hierarchy was loaded from the following locations:  
  
    okhttp3.RequestBody: file:/Users/yunai/.m2/repository/com/squareup/okhttp3/okhttp/3.14.9/okhttp-3.14.9.jar  
```

**Action:** Điều chỉnh classpath của ứng dụng sao cho chứa các phiên bản tương thích của các lớp `io.minio.S3Base` và `okhttp3.RequestBody`.

## 4.2 Cấu hình MinIO

Tạo lớp cấu hình [MinIOConfiguration](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-72-minio/src/main/java/cn/iocoder/springboot/lab72/config/MinIOConfiguration.java), tạo Bean MinioClient. Mã như sau:

```java
package cn.iocoder.springboot.lab72.config;

import io.minio.MinioClient;
import org.springframework.context.annotation.*;

@Configuration
public class MinIOConfiguration {

    @Bean
    public MinioClient minioClient() {
        // Cấu hình Minio. Trong dự án thực tế, cấu hình này sẽ được định nghĩa trong tệp application.yml
        String endpoint = "http://127.0.0.1:9000";
        String accessKey = "admin";
        String secretKey = "password";

        // Tạo client Minio
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }
}
```

## 4.3 FileController

Tạo lớp [FileController](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-72-minio/src/main/java/cn/iocoder/springboot/lab72/controller/FileController.java), triển khai RESTful API để tải lên và xóa tệp. Mã như sau:

```java
package cn.iocoder.springboot.lab72.controller;

import io.minio.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.util.UUID;

@RestController
@RequestMapping("/file")
public class FileController {

    @Resource
    private MinioClient minioClient;

    // Cấu hình Minio. Trong dự án thực tế, cấu hình này sẽ được định nghĩa trong tệp application.yml
    private String endpoint = "http://127.0.0.1:9000";
    private String bucket = "yudaoyuanma";

    /**
     * Tải lên tệp
     */
    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file) throws Exception {
        // Tải lên
        String path = UUID.randomUUID().toString(); // Tên tệp, sử dụng UUID ngẫu nhiên
        minioClient.putObject(PutObjectArgs.builder()
                .bucket(bucket) // Bucket lưu trữ
                .object(path) // Tên tệp
                .stream(file.getInputStream(), file.getSize(), -1) // Nội dung tệp
                .contentType(file.getContentType()) // Loại tệp
                .build());
        // Ghép đường dẫn
        return String.format("%s/%s/%s", endpoint, bucket, path);
    }

    /**
     * Xóa tệp
     */
    @DeleteMapping("/delete")
    public void delete(@RequestParam("path") String path) throws Exception {
        minioClient.removeObject(RemoveObjectArgs.builder()
                .bucket(bucket) // Bucket lưu trữ
                .object(path) // Tên tệp
                .build());
    }
}
```
## 4.4 MinIOApplication

Tạo lớp khởi động [MinIOApplication](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-72-minio/src/main/java/cn/iocoder/springboot/lab72/MinIOApplication.java). Mã như sau:

```java
package cn.iocoder.springboot.lab72;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MinIOApplication {

    public static void main(String[] args) {
        SpringApplication.run(MinIOApplication.class, args);
    }

}
```

## 4.5 Kiểm thử đơn giản

1. Chạy lớp MinIOApplication để khởi động dự án Spring Boot.

2. Sử dụng Postman để gọi API `/file/upload` và tải lên tệp.

![Tải lên tệp](https://static.iocoder.cn/images/Spring-Boot/2022-03-18/09.png)

Sau khi tải lên thành công, chúng ta nhận được URL để truy cập tệp, có thể dùng trình duyệt để truy cập trực tiếp.

![Truy cập tệp](https://static.iocoder.cn/images/Spring-Boot/2022-03-18/10.png)

Đồng thời trong giao diện quản lý MinIO, cũng có thể thấy tệp đã được tải lên.

![Tệp](https://static.iocoder.cn/images/Spring-Boot/2022-03-18/11.png)

3. Sử dụng Postman để gọi API `/file/delete` và xóa tệp.

![Xóa tệp](https://static.iocoder.cn/images/Spring-Boot/2022-03-18/12.png)

# 666. Tổng kết

Tương lai là sự lặp lại của lịch sử, trong thế giới công nghệ cũng vậy.

- Năm 2009, Oracle mua lại Sun, từ đó sở hữu MySQL; cùng năm đó, cha đẻ của MySQL là Widenius rời Sun và phát hành sản phẩm MariaDB.
- Năm 2011, RedHat mua lại Gluster, từ đó sở hữu GlusterFS; năm 2014, người sáng lập Gluster phát hành sản phẩm Minio.

Cuối cùng, xin giới thiệu mô-đun tệp tin mà mình đã phát triển trong dự án [https://github.com/YunaiV/ruoyi-vue-pro](https://github.com/YunaiV/ruoyi-vue-pro), hỗ trợ nhiều loại bộ nhớ như S3 (MinIO, Alibaba Cloud, Tencent Cloud, Huawei Cloud, Qiniu Cloud, v.v.), đĩa cứng, cơ sở dữ liệu. Nếu bạn quan tâm, hãy xem tài liệu tại [https://doc.iocoder.cn/file](https://doc.iocoder.cn/file).