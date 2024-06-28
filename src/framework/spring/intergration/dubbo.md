---
title: Spring Intergate Dubbo
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-08-11
date modified: 2024-02-22
---

# Tích hợp Dubbo với ZooKeeper

## ZooKeeper

ZooKeeper có thể được sử dụng như một trung tâm đăng ký cho Dubbo.

Dubbo không thực hiện bất kỳ sửa đổi nào đối với máy chủ Zookeeper, chỉ cần cài đặt máy chủ Zookeeper gốc. Tất cả logic trung tâm đăng ký được thích ứng khi gọi khách hàng Zookeeper.

**Cài đặt**

Truy cập [Trang phát hành ZooKeeper](http://zookeeper.apache.org/releases.html) và tải phiên bản phù hợp, sau đó giải nén vào máy cục bộ.

**Cấu hình**

```
vi conf/zoo.cfg
```

Nếu không cần thiết lập cụm, nội dung của `zoo.cfg` sẽ như sau [2](https://dubbo.gitbooks.io/dubbo-admin-book/content/install/zookeeper.html#fn_2):

```
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/home/dubbo/zookeeper-3.3.3/data
clientPort=2181
```

Nếu cần thiết lập cụm, nội dung của `zoo.cfg` sẽ như sau [3](https://dubbo.gitbooks.io/dubbo-admin-book/content/install/zookeeper.html#fn_3):

```
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/home/dubbo/zookeeper-3.3.3/data
clientPort=2181
server.1=10.20.153.10:2555:3555
server.2=10.20.153.11:2555:3555

```

Sau đó, đặt tệp `myid` trong thư mục data [4](https://dubbo.gitbooks.io/dubbo-admin-book/content/install/zookeeper.html#fn_4):

```
mkdir data
vi myid

```

Tệp `myid` xác định id của máy chủ, tương ứng với số sau `server.` trong `zoo.cfg`. Nội dung của máy chủ đầu tiên là 1, của máy chủ thứ hai là 2, ví dụ:

```
1

```

**Khởi động**

Trên Linux, chạy `bin/zkServer.sh`; trên Windows, chạy `bin/zkServer.cmd` để khởi động ZooKeeper.

**Dòng lệnh**

```
telnet 127.0.0.1 2181
dump
```

Hoặc:

```
echo dump | nc 127.0.0.1 2181
```

Sử dụng:

```
dubbo.registry.address=zookeeper://10.20.153.10:2181?backup=10.20.153.11:2181

```

Hoặc:

```
<dubbo:registry protocol="zookeeper" address="10.20.153.10:2181,10.20.153.11:2181" />

```

> 1. ZooKeeper là một dự án con của Apache Hadoop, có độ tin cậy tương đối cao, được khuyến nghị sử dụng trong môi trường sản xuất.
> 2. Thay đổi thư mục data thành thư mục thực tế của bạn.
> 3. Thay đổi thư mục data và địa chỉ server thành thông tin máy chủ triển khai thực tế của bạn.
> 4. `dataDir` trong `zoo.cfg` ở trên.
> 5. [http://zookeeper.apache.org/doc/r3.3.3/zookeeperAdmin.html](http://zookeeper.apache.org/doc/r3.3.3/zookeeperAdmin.html)

## Dubbo

Dubbo sử dụng cách cấu hình hoàn toàn bằng Spring, tích hợp một cách minh bạch vào ứng dụng, không có bất kỳ sự xâm nhập API nào vào ứng dụng, chỉ cần sử dụng Spring để tải cấu hình Dubbo là đủ. Dubbo dựa trên mở rộng Schema của Spring để tải.

Nếu bạn không muốn sử dụng cấu hình Spring, bạn có thể gọi thông qua [API](https://dubbo.gitbooks.io/configuration/api.md).

## Nhà cung cấp dịch vụ

Để biết thêm chi tiết về quy trình cài đặt đầy đủ, vui lòng xem: [Cài đặt nhà cung cấp ví dụ](https://dubbo.gitbooks.io/dubbo-admin-book/install/provider-demo.html)

### Định nghĩa interface dịch vụ

DemoService.java [1](https://dubbo.gitbooks.io/dubbo-user-book/quick-start.html#fn_1):

```java
package com.alibaba.dubbo.demo;

public interface DemoService {
    String sayHello(String name);
}
```

### Triển khai interface trên phía nhà cung cấp

DemoServiceImpl.java [2](https://dubbo.gitbooks.io/dubbo-user-book/quick-start.html#fn_2):

```java
package com.alibaba.dubbo.demo.provider;

import com.alibaba.dubbo.demo.DemoService;

public class DemoServiceImpl implements DemoService {
    public String sayHello(String name) {
        return "Hello " + name;
    }
}
```

### Sử dụng Spring để khai báo và tiết lộ dịch vụ

provider.xml:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:dubbo="http://code.alibabatech.com/schema/dubbo"
    xsi:schemaLocation="http://www.springframework.org/schema/beans        http://www.springframework.org/schema/beans/spring-beans.xsd        http://code.alibabatech.com/schema/dubbo        http://code.alibabatech.com/schema/dubbo/dubbo.xsd">

    <!-- Thông tin ứng dụng nhà cung cấp, được sử dụng để tính toán các phụ thuộc -->
    <dubbo:application name="hello-world-app"  />

    <!-- Sử dụng địa chỉ đăng ký trung tâm thông qua multicast -->
    <dubbo:registry address="multicast://224.5.6.7:1234" />

    <!-- Tiết lộ dịch vụ trên cổng 20880 bằng giao thức Dubbo -->
    <dubbo:protocol name="dubbo" port="20880" />

    <!-- Khai báo interface dịch vụ cần tiết lộ -->
    <dubbo:service interface="com.alibaba.dubbo.demo.DemoService" ref="demoService" />

    <!-- Triển khai dịch vụ giống như bean cục bộ -->
    <bean id="demoService" class="com.alibaba.dubbo.demo.provider.DemoServiceImpl" />
</beans>
```

Nếu sử dụng ZooKeeper làm trung tâm đăng ký, bạn có thể thay đổi dubbo:registry thành zookeeper://127.0.0.1:2181

### Tải cấu hình Spring

Provider.java:

```java
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Provider {
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"http://10.20.160.198/wiki/display/dubbo/provider.xml"});
        context.start();
        System.in.read(); // Nhấn bất kỳ phím nào để thoát
    }
}
```

## Người tiêu thụ dịch vụ

Để biết thêm chi tiết về quy trình cài đặt đầy đủ, vui lòng xem: [Cài đặt người tiêu thụ mẫu](https://dubbo.gitbooks.io/dubbo-admin-book/install/consumer-demo.html)

### Tham chiếu dịch vụ từ xa bằng cấu hình Spring

consumer.xml:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:dubbo="http://code.alibabatech.com/schema/dubbo"
    xsi:schemaLocation="http://www.springframework.org/schema/beans        http://www.springframework.org/schema/beans/spring-beans.xsd        http://code.alibabatech.com/schema/dubbo        http://code.alibabatech.com/schema/dubbo/dubbo.xsd">

    <!-- Tên ứng dụng người tiêu dùng, được sử dụng để tính toán các phụ thuộc, không phải là điều kiện khớp, không nên giống nhà cung cấp -->
    <dubbo:application name="consumer-of-helloworld-app"  />

    <!-- Sử dụng địa chỉ đăng ký trung tâm thông qua multicast -->
    <dubbo:registry address="multicast://224.5.6.7:1234" />

    <!-- Tạo proxy dịch vụ từ xa, có thể sử dụng demoService như một bean cục bộ -->
    <dubbo:reference id="demoService" interface="com.alibaba.dubbo.demo.DemoService" />
</beans>
```

Nếu sử dụng ZooKeeper làm trung tâm đăng ký, bạn có thể thay đổi dubbo:registry thành zookeeper://127.0.0.1:2181

### Tải cấu hình Spring và gọi dịch vụ từ xa

Consumer.java [3](https://dubbo.gitbooks.io/dubbo-user-book/quick-start.html#fn_3):

```java
import org.springframework.context.support.ClassPathXmlApplicationContext;
import com.alibaba.dubbo.demo.DemoService;

public class Consumer {
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"http://10.20.160.198/wiki/display/dubbo/consumer.xml"});
        context.start();
        DemoService demoService = (DemoService)context.getBean("demoService"); // Lấy proxy dịch vụ từ xa
        String hello = demoService.sayHello("world"); // Gọi phương thức từ xa
        System.out.println( hello ); // Hiển thị kết quả gọi
    }
}
```

> 1. Interface này cần được đóng gói riêng, được chia sẻ giữa nhà cung cấp và người tiêu thụ
> 2. Ẩn triển khai của nhà cung cấp dịch vụ
> 3. Cũng có thể sử dụng IOC để tiêm vào

## FAQ

Đề nghị sử dụng phiên bản zookeeper đăng ký trung tâm khách hàng `dubbo-2.3.3` trở lên.

## Tài liệu tham khảo

**Dubbo**

[Github](https://github.com/alibaba/dubbo) | [Hướng dẫn sử dụng](https://dubbo.gitbooks.io/dubbo-user-book/content/) | [Hướng dẫn phát triển](https://dubbo.gitbooks.io/dubbo-dev-book/content/) | [Hướng dẫn quản trị](https://dubbo.gitbooks.io/dubbo-admin-book/content/)

**ZooKeeper**

[Trang chủ](http://zookeeper.apache.org/) | [Tài liệu chính thức](http://zookeeper.apache.org/doc/trunk/)
