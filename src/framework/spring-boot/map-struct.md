---
title: MapStruct
tags:
  - java
  - spring-boot
categories:
  - spring-boot
order: 6
---
# Map Struct

> Bài viết này cung cấp ví dụ mã nguồn đầy đủ, có thể xem tại [https://github.com/YunaiV/SpringBoot-Labs](https://github.com/YunaiV/SpringBoot-Labs) trong thư mục [lab-55](https://github.com/YunaiV/SpringBoot-Labs/tree/master/lab-55).
> 
> Sáng tạo không dễ, hãy ủng hộ một cái [Star](https://github.com/YunaiV/SpringBoot-Labs/stargazers) nhé, cùng nhau cố gắng nào!

# 1. Tổng quan

> Lời nhắc hữu ích: MapStruct và Spring Boot không có mối quan hệ trực tiếp, chỉ đơn giản là chúng được đưa vào trong cùng một loạt bài viết.

Để giúp mã nguồn của ứng dụng dễ bảo trì hơn, chúng ta thường chia dự án thành nhiều lớp. Trong [《Hướng dẫn Phát triển Java của Alibaba》](https://github.com/alibaba/p3c/blob/master/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4Java%E5%BC%80%E5%8F%91%E6%89%8B%E5%86%8C%EF%BC%88%E5%8D%8E%E5%B1%B1%E7%89%88%EF%BC%89.pdf), các lớp được khuyến nghị như hình bên dưới:

![Phân lớp ứng dụng](https://static.iocoder.cn/ef0d24cfaecdbe703ad646e09e697454)

Sau khi phân lớp, mỗi lớp sẽ có mô hình lĩnh vực của riêng mình, tức là các loại Bean khác nhau:

* **DO** (Data Object): Tương ứng một-một với cấu trúc bảng cơ sở dữ liệu, dùng để truyền tải dữ liệu từ lớp DAO lên trên.
* **DTO** (Data Transfer Object): Đối tượng truyền dữ liệu, được truyền từ Service hoặc Manager ra ngoài.
* **BO** (Business Object): Đối tượng nghiệp vụ. Được tạo bởi lớp Service, gói ghém các logic nghiệp vụ.
* Và còn nhiều nữa...

Vì vậy, cần thực hiện **chuyển đổi đối tượng**. Ví dụ:

```java
// Truy vấn người dùng từ cơ sở dữ liệu  
UserDO userDO = userMapper.selectBy(id);  

// Chuyển đổi đối tượng  
UserBO userBO = new UserBO();  
userBO.setId(userDO.getId());  
userBO.setUsername(userDO.getUsername());  
// ... Và các thuộc tính khác  
```

Rõ ràng, việc **chuyển đổi thủ công** đối tượng, mặc dù có **hiệu suất thực thi** cao, nhưng **hiệu quả phát triển** rất thấp, và có thể dẫn đến việc thiếu sót. Do đó, chúng ta sẽ sử dụng các framework hoặc công cụ để thực hiện chuyển đổi đối tượng, ví dụ:

> Lời nhắc hữu ích: Nếu bạn quan tâm đến việc so sánh hiệu suất của các công cụ dưới đây, có thể đọc bài viết [Performance of Java Mapping Frameworks](https://www.baeldung.com/java-performance-mapping-frameworks).

* Spring BeanUtils
* Apache BeanUtils
* Dozer
* Orika
* MapStruct
* ModelMapper
* JMapper

Cá nhân mình thích sử dụng [MapStruct](https://mapstruct.org/), bởi vì nó dựa trên [Bộ xử lý chú thích Java JSR 269](https://jcp.org/en/jsr/detail?id=269), **tự động tạo mã chuyển đổi đối tượng**, dễ sử dụng và có hiệu suất tốt. Ví dụ: ![Ví dụ về MapStruct](https://static.iocoder.cn/images/Spring-Boot/2019-02-07/01.png)

* Tạo một interface **Mapper** MapStruct, sau đó định nghĩa một phương thức chuyển đổi, và để MapStruct tự động tạo mã chuyển đổi đối tượng.

Dưới đây là giới thiệu về MapStruct mà bạn có thể tìm hiểu sơ qua:

> MapStruct là một bộ xử lý chú thích Java để tạo các lớp ánh xạ Bean an toàn về kiểu.
> 
> Tất cả những gì bạn cần làm là định nghĩa một interface ánh xạ, khai báo bất kỳ phương thức nào cần ánh xạ. Trong quá trình biên dịch, MapStruct sẽ tạo ra phần thực thi của interface đó. Việc thực thi này sử dụng **các lời gọi phương thức Java thuần túy** để ánh xạ giữa đối tượng nguồn và đối tượng đích, thay vì sử dụng cơ chế phản chiếu Java.
> 
> So với mã ánh xạ thủ công, MapStruct giúp tiết kiệm thời gian bằng cách tạo ra các đoạn mã dài và dễ mắc lỗi. Sau khi thiết lập các phương thức, MapStruct sử dụng các giá trị mặc định hợp lý, nhưng khi cần cấu hình hoặc thực hiện các hành vi đặc biệt thì không còn áp dụng.
> 
> So với các framework ánh xạ động, MapStruct có các ưu điểm:
> 
> * Thực thi nhanh chóng bằng cách sử dụng phương thức Java thuần thay vì cơ chế phản chiếu Java.
> * An toàn về kiểu khi biên dịch: Chỉ có thể ánh xạ các đối tượng và thuộc tính tương ứng với nhau, không thể ánh xạ một thực thể Order sang một DTO Customer, v.v.
> * Nếu không thể ánh xạ một thực thể hoặc thuộc tính, lỗi sẽ được báo cáo ngay trong quá trình biên dịch.

# 2. Bắt đầu nhanh

> Mã nguồn mẫu tương ứng với kho lưu trữ: [`lab-55-mapstruct-demo`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo/) .

Trong phần này, chúng ta sẽ bắt đầu nhanh với MapStruct. Tạo mới dự án [lab-55-mapstruct-demo](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo/) làm ví dụ, cuối cùng sẽ như hình dưới đây:

![Cấu trúc tổng thể dự án](https://static.iocoder.cn/images/Spring-Boot/2019-02-07/11.png)

## 2.1 Thêm dependency

Tạo file [`pom.xml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo/pom.xml), và thêm các dependency liên quan đến MapStruct.

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0"  
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">  
    <parent>  
        <artifactId>lab-55</artifactId>  
        <groupId>cn.iocoder.springboot.labs</groupId>  
        <version>1.0-SNAPSHOT</version>  
    </parent>  
    <modelVersion>4.0.0</modelVersion>  
  
    <artifactId>lab-55-mapstruct-demo</artifactId>  
  
    <properties>  
        <java.version>1.8</java.version>  
        <mapstruct.version>1.3.1.Final</mapstruct.version>  
    </properties>  
  
    <dependencies>  
        <dependency>  
            <groupId>org.mapstruct</groupId>  
            <artifactId>mapstruct</artifactId>  
            <version>${mapstruct.version}</version>  
        </dependency>  
    </dependencies>  
  
    <build>  
        <plugins>  
            <plugin>  
                <groupId>org.apache.maven.plugins</groupId>  
                <artifactId>maven-compiler-plugin</artifactId>  
                <version>3.8.1</version>  
                <configuration>  
                    <source>${java.version}</source>  
                    <target>${java.version}</target>  
                    <annotationProcessorPaths>  
                        <path>  
                            <groupId>org.mapstruct</groupId>  
                            <artifactId>mapstruct-processor</artifactId>  
                            <version>${mapstruct.version}</version>  
                        </path>  
                    </annotationProcessorPaths>  
                </configuration>  
            </plugin>  
        </plugins>  
    </build>  
  
</project>
```

Lưu ý, nhất định phải khai báo `mapstruct-processor` trong plugin `maven-compiler-plugin` để sử dụng làm bộ xử lý chú thích Java JSR 269.

## 2.2 UserDO

Tạo lớp [UserDO](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo/src/main/java/cn/iocoder/springboot/lab55/mapstructdemo/dataobject/UserDO.java). Mã nguồn như sau:

```java
public class UserDO {  
  
    /** Mã người dùng */  
    private Integer id;  
    /** Tên người dùng */  
    private String username;  
    /** Mật khẩu */  
    private String password;  
  
    // ... Bỏ qua các phương thức setter/getter  
}
```


## 2.3 UserBO

Tạo lớp [UserBO](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo/src/main/java/cn/iocoder/springboot/lab55/mapstructdemo/bo/UserBO.java), là lớp BO người dùng. Mã nguồn như sau:

```java
public class UserBO {  
  
    /** Mã người dùng */  
    private Integer id;  
    /** Tên người dùng */  
    private String username;  
    /** Mật khẩu */  
    private String password;  
  
    // ... Bỏ qua các phương thức setter/getter  
}
```

## 2.4 UserConvert

Tạo interface [UserConvert](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo/src/main/java/cn/iocoder/springboot/lab55/mapstructdemo/convert/UserConvert.java), là bộ chuyển đổi các Bean liên quan đến User. Mã nguồn như sau:

```java
@Mapper // <1>  
public interface UserConvert {  
  
    UserConvert INSTANCE = Mappers.getMapper(UserConvert.class); // <2>  
  
    UserBO convert(UserDO userDO);  
  
}
```

Tại `<1>`, thêm chú thích [`@Mapper`](https://github.com/mapstruct/mapstruct/blob/master/core/src/main/java/org/mapstruct/Mapper.java), khai báo rằng đây là một Mapper của MapStruct.

Tại `<2>`, bằng cách gọi phương thức `#getMapper(Class<T> clazz)` từ [Mappers](https://github.com/mapstruct/mapstruct/blob/master/core/src/main/java/org/mapstruct/factory/Mappers.java), chúng ta nhận được đối tượng của lớp hiện thực UserConvert mà MapStruct **tự động tạo ra**.

Tại `<3>`, định nghĩa phương thức `#convert(UserDO userDO)`, khai báo chuyển đổi từ UserDO sang UserBO. Sau đó, mỗi khi chúng ta biên dịch dự án, có thể thấy lớp hiện thực UserConvert tự động tạo ra trong thư mục dưới đây, có thể dùng cho việc Debug:

![Ví dụ mã tự sinh](https://static.iocoder.cn/images/Spring-Boot/2019-02-07/12.png)

## 2.5 UserBOTest

Tạo lớp [UserBOTest](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo/src/main/java/cn/iocoder/springboot/lab55/mapstructdemo/UserBOTest.java) để thực hiện kiểm thử đơn giản. Mã nguồn như sau:

```java
public class UserBOTest {  
  
    public static void main(String[] args) {  
        // Tạo đối tượng UserDO  
        UserDO userDO = new UserDO()  
                .setId(1).setUsername("yudaoyuanma").setPassword("buzhidao");  
        // <X> Thực hiện chuyển đổi  
        UserBO userBO = UserConvert.INSTANCE.convert(userDO);  
        System.out.println(userBO.getId());  
        System.out.println(userBO.getUsername());  
        System.out.println(userBO.getPassword());  
    }  
  
}
```

Mã nguồn chính tại `<X>`, nơi UserConvert chuyển đổi đối tượng UserDO thành UserBO.

Chạy phương thức `#main(String[] args)`, kết quả in ra như sau, đúng như dự kiến:

```
1  
yudaoyuanma  
buzhidao
```

😈 Đến đây, chúng ta đã hoàn thành việc bắt đầu nhanh với MapStruct.

# 3. Tích hợp Lombok

> Mã nguồn ví dụ liên quan: [`lab-55-mapstruct-demo-lombok`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo-lombok/) .

Trong bài viết về [Lombok](./lombok), chúng ta đã học được rằng Lombok có thể giúp chúng ta tự động tạo ra các mã tương đối "thừa", chẳng hạn như các phương thức setter, getter.

Thật tình cờ, mã chuyển đổi đối tượng tự động mà MapStruct tạo ra cũng phụ thuộc vào các phương thức setter và getter, vì vậy khi sử dụng cả hai với nhau, cần phải cấu hình thích hợp. Như hình dưới đây:

![MapStruct + Lombok](https://static.iocoder.cn/images/Spring-Boot/2019-02-07/21.png)

Tiếp theo, chúng ta sẽ sao chép dự án [`lab-55-mapstruct-demo`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo/) từ phần [「2. Hướng dẫn nhanh」](#) thành dự án [`lab-55-mapstruct-demo-lombok`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo-lombok/) và tích hợp Lombok làm ví dụ.

## 3.1 Thêm phụ thuộc

Chỉnh sửa tệp [`pom.xml`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55-mapstruct-demo-lombok/pom.xml), bổ sung các phụ thuộc liên quan đến Lombok.

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0"  
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">  
    <parent>  
        <artifactId>lab-55</artifactId>  
        <groupId>cn.iocoder.springboot.labs</groupId>  
        <version>1.0-SNAPSHOT</version>  
    </parent>  
    <modelVersion>4.0.0</modelVersion>  
  
    <artifactId>lab-55-mapstruct-demo-lombok</artifactId>  
  
    <properties>  
        <java.version>1.8</java.version>  
        <mapstruct.version>1.3.1.Final</mapstruct.version>  
        <lombok.version>1.18.12</lombok.version>  
    </properties>  
  
    <dependencies>  
        <!-- Thêm phụ thuộc mapstruct -->  
        <dependency>  
            <groupId>org.mapstruct</groupId>  
            <artifactId>mapstruct</artifactId>  
            <version>${mapstruct.version}</version>  
        </dependency>  
  
        <!-- Thêm phụ thuộc lombok -->  
        <dependency>  
            <groupId>org.projectlombok</groupId>  
            <artifactId>lombok</artifactId>  
            <version>${lombok.version}</version>  
            <scope>provided</scope>  
        </dependency>  
    </dependencies>  
  
    <build>  
        <plugins>  
            <plugin>  
                <groupId>org.apache.maven.plugins</groupId>  
                <artifactId>maven-compiler-plugin</artifactId>  
                <version>3.8.1</version>  
                <configuration>  
                    <source>${java.version}</source>  
                    <target>${java.version}</target>  
                    <annotationProcessorPaths>  
                        <!-- Thêm mapstruct-processor -->  
                        <path>  
                            <groupId>org.mapstruct</groupId>  
                            <artifactId>mapstruct-processor</artifactId>  
                            <version>${mapstruct.version}</version>  
                        </path>  
                        <!-- Thêm lombok-processor -->  
                        <path>  
                            <groupId>org.projectlombok</groupId>  
                            <artifactId>lombok</artifactId>  
                            <version>${lombok.version}</version>  
                        </path>  
                    </annotationProcessorPaths>  
                </configuration>  
            </plugin>  
        </plugins>  
    </build>  
  
</project>  
```

## 3.2 UserDO

Chỉnh sửa lớp [UserDO](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo-lombok/src/main/java/cn/iocoder/springboot/lab55/mapstructdemo/dataobject/UserDO.java), sử dụng chú thích `@Data` của Lombok để thay thế các phương thức setter, getter. Mã nguồn như sau:

```java
@Data // Thêm mới
@Accessors(chain = true)
public class UserDO {

    /** 用户编号 */
    private Integer id;
    /** 用户名 */
    private String username;
    /** 密码 */
    private String password;

    // ... Xóa các phương thức setter, getter
}
```

## 3.3 UserBO

Chỉnh sửa lớp [UserBO](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo-lombok/src/main/java/cn/iocoder/springboot/lab55/mapstructdemo/bo/UserBO.java), sử dụng chú thích `@Data` của Lombok để thay thế các phương thức setter, getter. Mã nguồn như sau:

```java
@Data // Thêm mới
@Accessors(chain = true)
public class UserBO {

    /** 用户编号 */
    private Integer id;
    /** 用户名 */
    private String username;
    /** 密码 */
    private String password;

    // ... Xóa các phương thức setter, getter
}
```

## 3.4 UserBOTest

Chạy lớp [UserBOTest](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo-lombok/src/main/java/cn/iocoder/springboot/lab55/mapstructdemo/UserBOTest.java), thực thi phương thức `#main(String[] args)`, và kết quả in ra như sau, đúng với mong đợi:

```
1
yudaoyuanma
buzhidao
```

😈 Đến đây, chúng ta đã hoàn tất việc tích hợp MapStruct và Lombok.

# 4. @Mapping

Khi chuyển đổi đối tượng, đôi khi thuộc tính không hoàn toàn giống nhau, ví dụ như tên thuộc tính khác nhau. Trong trường hợp này, chúng ta có thể sử dụng chú thích `@Mapping` do MapStruct cung cấp để cấu hình mối quan hệ ánh xạ tương ứng. Ví dụ dưới đây minh họa cách làm này:

![Ánh xạ](https://static.iocoder.cn/images/Spring-Boot/2019-02-07/31.png)

Dưới đây là ví dụ về việc thêm chú thích `@Mapping` vào dự án [`lab-55-mapstruct-demo`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo/).

## 4.1 UserDetailBO

> Mã nguồn ví dụ tương ứng với kho: [`lab-55-mapstruct-demo`](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo/) .

Tạo lớp [UserDetailBO](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo/src/main/java/cn/iocoder/springboot/lab55/mapstructdemo/bo/UserDetailBO.java) đại diện cho thông tin chi tiết của người dùng. Mã nguồn như sau:

```java
public class UserDetailBO {

    private Integer userId;

    // ... Bỏ qua setter/getter
}
```

## 4.2 UserConvert

Chỉnh sửa lớp [UserConvert](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo/src/main/java/cn/iocoder/springboot/lab55/mapstructdemo/convert/UserConvert.java) để thêm ví dụ sử dụng chú thích `@Mapping`. Mã nguồn như sau:

```java
// UserConvert.java

@Mappings({
        @Mapping(source = "id", target = "userId")
})
UserDetailBO convertDetail(UserDO userDO);
```

Trong đó, thuộc tính `source` của chú thích được thiết lập để ánh xạ từ thuộc tính `id` của `UserDO`, và thuộc tính `target` ánh xạ tới `userId` của `UserDetailBO`.

Chú thích `@Mapping` cũng hỗ trợ chuyển đổi nhiều đối tượng thành một đối tượng, như hình dưới đây:

![Ví dụ phức tạp](https://static.iocoder.cn/images/Spring-Boot/2019-02-07/32.png)

## 4.3 UserDetailBOTest

Tạo lớp [UserDetailBOTest](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-55/lab-55-mapstruct-demo/src/main/java/cn/iocoder/springboot/lab55/mapstructdemo/UserDetailBOTest.java) để thực hiện một số bài kiểm tra đơn giản. Mã nguồn như sau:

```java
public class UserDetailBOTest {

    public static void main(String[] args) {
        // Tạo đối tượng UserDO
        UserDO userDO = new UserDO()
                .setId(1).setUsername("yudaoyuanma").setPassword("buzhidao");
        // Thực hiện chuyển đổi
        UserDetailBO userDetailBO = UserConvert.INSTANCE.convertDetail(userDO);
        System.out.println(userDetailBO.getUserId());
    }

}
```

Phần cốt lõi là đoạn mã `<X>`, trong đó chúng ta sử dụng `UserConvert` để chuyển đổi đối tượng `UserDO` thành `UserDetailBO`.

Kết quả in ra khi chạy phương thức `#main(String[] args)` như sau, đúng với mong đợi:

```
1
```

Tới đây, chúng ta đã hoàn thành việc tìm hiểu chú thích `@Mapping` trong MapStruct. Chú thích `@Mapping` còn có nhiều thuộc tính khác, cung cấp các chức năng rất mạnh mẽ mà các bạn có thể tìm hiểu thêm sau. Ví dụ như thuộc tính `qualifiedByName`, cho phép tùy chỉnh phương thức chuyển đổi, như minh họa dưới đây:

![Ví dụ bổ sung](https://static.iocoder.cn/images/Spring-Boot/2019-02-07/33.png)

# 5. Plugin MapStruct cho IDEA

MapStruct cung cấp một plugin có tên là [IDEA MapStruct Support](https://plugins.jetbrains.com/plugin/10036-mapstruct-support/), giúp chúng ta sử dụng MapStruct trong IDEA dễ dàng hơn, thật tuyệt vời!

![Hỗ trợ MapStruct cho IDEA](https://static.iocoder.cn/images/Spring-Boot/2019-02-07/41.png)

Các tính năng mà plugin cung cấp có thể được xem trong tài liệu chính thức [MapStruct support for IntelliJ IDEA](https://mapstruct.org/news/2017-09-19-announcing-mapstruct-idea/), ví dụ như:

*   Hoàn thành tự động cho thuộc tính và hằng số của Enum:
    ![](https://static.iocoder.cn/26c885d40b45bfb6c0437650fa410bf7.jpg)
*   Chuyển tới định nghĩa từ chú thích:
    ![](https://static.iocoder.cn/7e29e3bb17221bb9f8313585d35c0799.jpg)
*   Tìm kiếm sử dụng:
    ![](https://static.iocoder.cn/97cb2e097633f121c91f0c8f45d48565.jpg)

# 666. Phần quà bất ngờ

Về cơ bản, chúng ta đã học xong những tính năng thông dụng của MapStruct. Nếu muốn tìm hiểu sâu hơn, bạn có thể xem [Tài liệu chính thức của MapStruct](https://mapstruct.org/documentation/stable/reference/html/), nó thực sự **rất mạnh mẽ**!

Ngoài ra, trong dự án mã nguồn mở của YunaiV tại [https://github.com/YunaiV/onemall](https://github.com/YunaiV/onemall), MapStruct đã được sử dụng rộng rãi để thực hiện chuyển đổi đối tượng. Bạn có thể tìm kiếm các lớp kết thúc bằng **Convert** để tham khảo chi tiết.
