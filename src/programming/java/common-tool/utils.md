---
title: Other Utils
tags:
  - java
categories:
  - java
order: 8
---
### Other Utils

Ngoài các lớp tiện ích của Java như [Arrays](/programming/java/common-tool/arrays), [Objects](/programming/java/common-tool/objects), [Collections](/programming/java/common-tool/collections), [Scanner](/programming/java/common-tool/scanner) đã được đề cập trước đó, còn có một số lớp tiện ích của bên thứ ba như [Hutool](/programming/java/common-tool/hutool), [Guava](/programming/java/common-tool/guava), và những cái khác như IpUtil, CollectionUtils, StringUtils, MDC, ClassUtils, BeanUtils, ReflectionUtils vv., có thể giúp cải thiện đáng kể hiệu suất sản xuất của chúng ta.

Tất nhiên, nếu bạn có thể xem xét mã nguồn của chúng, nâng cao kỹ năng kỹ thuật sẽ rất hữu ích.

### IpUtil: Lấy địa chỉ IP của máy local

Việc lấy địa chỉ IP của máy local là một yêu cầu khá phổ biến, ví dụ như trong cảnh báo doanh nghiệp, có thể kèm theo địa chỉ IP của máy gặp vấn đề để dễ dàng nhìn vào nhật ký và định vị vấn đề. Vậy làm thế nào để lấy địa chỉ IP của máy tính?

#### 1. Phương pháp cơ bản

Để lấy địa chỉ IP của máy tính, nếu bạn đã hiểu về lớp `InetAddress`, việc viết một công cụ đơn giản như sau dễ dàng:

```java
public static String getLocalIP() {
    try {
        return InetAddress.getLocalHost().getHostAddress();
    } catch (UnknownHostException e) {
        throw new RuntimeException(e);
    }
}
```

Việc triển khai trên không có vấn đề gì.

#### 2. Phiên bản nâng cao

Để lấy địa chỉ IPv4, bạn có thể thực hiện một số thay đổi nhỏ trong mã nguồn:

```java
public static String getLocalIpByNetcard() {
    try {
        // Lặp qua tất cả các interface mạng
        for (Enumeration<NetworkInterface> e = NetworkInterface.getNetworkInterfaces(); e.hasMoreElements(); ) {
            // Lấy interface mạng hiện tại
            NetworkInterface item = e.nextElement();

            // Lặp qua tất cả các địa chỉ của interface mạng hiện tại
            for (InterfaceAddress address : item.getInterfaceAddresses()) {
                // Bỏ qua địa chỉ vòng lặp và các interface mạng chưa kích hoạt
                if (item.isLoopback() || !item.isUp()) {
                    continue;
                }

                // Nếu địa chỉ hiện tại là địa chỉ IPv4, trả về địa chỉ dưới dạng chuỗi
                if (address.getAddress() instanceof Inet4Address) {
                    Inet4Address inet4Address = (Inet4Address) address.getAddress();
                    return inet4Address.getHostAddress();
                }
            }
        }

        // Nếu không tìm thấy địa chỉ IPv4 nào thích hợp, trả về địa chỉ localhost
        return InetAddress.getLocalHost().getHostAddress();
    } catch (SocketException | UnknownHostException e) {
        // Ném ra ngoại lệ chạy khi xảy ra lỗi
        throw new RuntimeException(e);
    }
}
```

Lưu ý rằng đoạn mã này chỉ trả về địa chỉ IPv4 của máy local và chỉ trả về địa chỉ đầu tiên phù hợp. Nếu máy local có nhiều interface mạng hoặc mỗi interface có nhiều địa chỉ, có thể không trả về địa chỉ mong muốn. Ngoài ra, nếu không tìm thấy bất kỳ địa chỉ IPv4 nào, nó sẽ trả về địa chỉ localhost.

#### 3. Lớp tiện ích hoàn chỉnh

```java
import java.net.*;
import java.util.Enumeration;

public class IPUtil {
    public static final String DEFAULT_IP = "127.0.0.1";

    /**
     * Trả về địa chỉ IPv4 của máy local dựa trên địa chỉ mạng đầu tiên
     *
     * @return Địa chỉ IPv4 nội bộ đầu tiên phù hợp
     */
    public static String getLocalIpByNetcard() {
        try {
            // Lặp qua tất cả các interface mạng
            for (Enumeration<NetworkInterface> e = NetworkInterface.getNetworkInterfaces(); e.hasMoreElements(); ) {
                // Lấy interface mạng hiện tại
                NetworkInterface item = e.nextElement();

                // Lặp qua tất cả các địa chỉ của interface mạng hiện tại
                for (InterfaceAddress address : item.getInterfaceAddresses()) {
                    // Bỏ qua địa chỉ vòng lặp và các interface mạng chưa kích hoạt
                    if (item.isLoopback() || !item.isUp()) {
                        continue;
                    }
                    // Nếu địa chỉ hiện tại là địa chỉ IPv4, trả về địa chỉ dưới dạng chuỗi
                    if (address.getAddress() instanceof Inet4Address) {
                        Inet4Address inet4Address = (Inet4Address) address.getAddress();
                        return inet4Address.getHostAddress();
                    }
                }
            }
            // Nếu không tìm thấy địa chỉ IPv4 phù hợp, trả về địa chỉ localhost
            return InetAddress.getLocalHost().getHostAddress();
        } catch (SocketException | UnknownHostException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Lấy địa chỉ IP của máy local
     *
     * @return Địa chỉ IP của máy local
     */
    public static String getLocalIP() {
        try {
            return InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            throw new RuntimeException(e);
        }
    }
}
```

Lớp IPUtil có định nghĩa hai phương thức: `getLocalIpByNetcard()` và `getLocalIP()`. Phương thức đầu tiên là để lấy địa chỉ IPv4 nội bộ của máy local, tránh việc trả về 127.0.0.1. Phương thức thứ hai là để lấy địa chỉ IP của máy local, nếu máy local có nhiều địa chỉ IP, có thể trả về bất kỳ địa chỉ nào trong số đó.

### MDC: Một công cụ lưu truyền tham số an toàn cho luồng

`MDC` là một lớp trong gói [`org.slf4j`], viết tắt của Mapped Diagnostic Context, có thể coi là một bộ chứa an toàn cho các nhật ký chẩn đoán được lưu trữ trong luồng.

MDC sử dụng [`ThreadLocal`](/programming/java/thread/ThreadLocal.html) để lưu trữ dữ liệu ở cấp độ luồng.

Chúng ta có thể sử dụng nó để truyền tham số. Ví dụ, trong một kịch bản như sau: khi sử dụng `RestTemplate` để gọi một API từ xa, đôi khi cần truyền một số thông tin trong `header`, ví dụ như traceId, source và còn nữa, để có thể liên kết toàn bộ chuỗi yêu cầu một cách hoàn chỉnh khi xem nhật ký và nhanh chóng định vị vấn đề.

Kịch bản kinh doanh này có thể được thực hiện thông qua giao diện `ClientHttpRequestInterceptor`, cụ thể như sau:

Bước đầu tiên, định nghĩa một bộ lọc `LogFilter` để chặn tất cả các yêu cầu gọi API và thiết lập traceId trong MDC:

```java
public class LogFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        MdcUtil.add(UUID.randomUUID().toString());
        System.out.println("Ghi nhật ký yêu cầu");
        chain.doFilter(request, response);
        System.out.println("Ghi nhật ký phản hồi");
    }

    // Các phương thức khác của Filter không được hiển thị để ngắn gọn
}
```

Bước thứ hai, triển khai `ClientHttpRequestInterceptor` để lấy traceId hiện tại từ MDC và thiết lập nó vào header của yêu cầu:

```java
public class RestTemplateInterceptor implements ClientHttpRequestInterceptor {
    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        request.getHeaders().set("traceId", MdcUtil.get());
        return execution.execute(request, body);
    }
}
```

Bước thứ ba, định nghĩa một lớp cấu hình để cấu hình `RestTemplateInterceptor` đã định nghĩa:

```java
@Configuration
public class RestTemplateConfiguration {
    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setInterceptors(Collections.singletonList(restTemplateInterceptor()));
        return restTemplate;
    }

    @Bean
    public RestTemplateInterceptor restTemplateInterceptor() {
        return new RestTemplateInterceptor();
    }
}
```

Trong đó, `MdcUtil` thực chất là một lớp sử dụng công cụ MDC để lưu trữ và truy xuất traceId trong `ThreadLocal`:

```java
public class MdcUtil {
    private static final String TRACE_ID = "TRACE_ID";

    public static String get() {
        return MDC.get(TRACE_ID);
    }

    public static void add(String value) {
        MDC.put(TRACE_ID, value);
    }
}
```

Trong ví dụ này, chúng ta không thể thấy cụ thể nơi `add` phương thức của lớp MdcUtil được gọi, thường thì chúng ta sẽ tạo traceId trước khi thực hiện phương thức của giao diện, thêm nó vào MDC bằng cách gọi `add` phương thức của lớp MdcUtil, sau đó ở các nơi khác của cùng một yêu cầu, chúng ta có thể lấy được traceId này thông qua `get` phương thức của lớp MdcUtil.

Việc sử dụng MDC để lưu trữ các tham số như traceId trong suốt quá trình của yêu cầu là vì, khi yêu cầu của người dùng đến máy chủ ứng dụng, Tomcat sẽ cấp phát một luồng từ bể luồng để xử lý yêu cầu này.

Do đó, các tham số được lưu trữ trong MDC, trong ThreadLocal, cũng chỉ thuộc về luồng đó, vì vậy không có vấn đề về an toàn luồng.

### ClassUtils

`ClassUtils` là một lớp trong gói `org.springframework.util` của Spring, nó cung cấp nhiều chức năng hữu ích liên quan đến lớp và đối tượng.

#### Lấy tất cả các interface của đối tượng

Nếu bạn muốn lấy tất cả các interface của một đối tượng, bạn có thể sử dụng phương thức `getAllInterfaces` của `ClassUtils`. Ví dụ:

```java
Class<?>[] allInterfaces = ClassUtils.getAllInterfaces(new User());
```

#### Lấy tên gói của một lớp

Nếu bạn muốn lấy tên gói của một lớp, bạn có thể sử dụng phương thức `getPackageName` của `ClassUtils`. Ví dụ:

```java
String packageName = ClassUtils.getPackageName(User.class);
System.out.println(packageName);
```

#### Kiểm tra xem một lớp có phải là lớp nội bộ không

Nếu bạn muốn kiểm tra xem một lớp có phải là lớp nội bộ không, bạn có thể sử dụng phương thức `isInnerClass` của `ClassUtils`. Ví dụ:

```java
System.out.println(ClassUtils.isInnerClass(User.class));
```

#### Kiểm tra xem một đối tượng có phải là đối tượng proxy không

Nếu bạn muốn kiểm tra xem một đối tượng có phải là đối tượng proxy không, bạn có thể sử dụng phương thức `isCglibProxy` của `ClassUtils`. Ví dụ:

```java
System.out.println(ClassUtils.isCglibProxy(new User()));
```

`ClassUtils` còn rất nhiều phương thức hữu ích khác đang chờ bạn khám phá. Nếu bạn quan tâm, bạn có thể tìm hiểu thêm về chúng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240704192914.png)

### BeanUtils

Spring cung cấp cho chúng ta một công cụ tiện ích cho các JavaBean, nằm trong gói `org.springframework.beans`, được gọi là `BeanUtils`.

Hãy cùng nhau khám phá những điều bất ngờ mà công cụ này có thể mang lại.

#### Sao chép các thuộc tính của đối tượng

Đôi khi bạn có nhu cầu sao chép tất cả các thuộc tính của một đối tượng sang một đối tượng khác. Khi đó bạn có thể sử dụng phương thức `copyProperties` của `BeanUtils`. Ví dụ:

```java
User user1 = new User();
user1.setId(1L);
user1.setName("Tom");
user1.setAddress("NY");

User user2 = new User();
BeanUtils.copyProperties(user1, user2);
System.out.println(user2);
```

#### Instantiate một lớp cụ thể

Nếu bạn muốn khởi tạo một đối tượng của một lớp bằng phản chiếu, bạn có thể sử dụng phương thức `instantiateClass` của `BeanUtils`. Ví dụ:

```java
User user = BeanUtils.instantiateClass(User.class);
System.out.println(user);
```

#### Lấy phương thức cụ thể của một lớp

Nếu bạn muốn lấy một phương thức cụ thể của một lớp, bạn có thể sử dụng phương thức `findDeclaredMethod` của `BeanUtils`. Ví dụ:

```java
Method declaredMethod = BeanUtils.findDeclaredMethod(User.class, "getId");
System.out.println(declaredMethod.getName());
```

#### Lấy tham số của một phương thức cụ thể

Nếu bạn muốn lấy các tham số của một phương thức, bạn có thể sử dụng phương thức `findPropertyForMethod` của `BeanUtils`. Ví dụ:

```java
Method declaredMethod = BeanUtils.findDeclaredMethod(User.class, "getId");
PropertyDescriptor propertyForMethod = BeanUtils.findPropertyForMethod(declaredMethod);
System.out.println(propertyForMethod.getName());
```

Nếu bạn quan tâm đến `BeanUtils`, bạn có thể tìm hiểu thêm về nó trong những nội dung dưới đây:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240704192949.png)


### ReflectionUtils

Đôi khi, chúng ta cần sử dụng tính năng `phản xạ` trong dự án. Nếu sử dụng các phương pháp cơ bản để phát triển, mã sẽ rất dài và phức tạp, yêu cầu xử lý nhiều ngoại lệ và vấn đề quyền truy cập.

Tin vui là Spring cung cấp cho chúng ta một công cụ tiện ích `ReflectionUtils`, nằm trong gói `org.springframework.util`.

#### Lấy phương thức

Nếu bạn muốn lấy một phương thức cụ thể của một lớp, bạn có thể sử dụng phương thức `findMethod` của lớp `ReflectionUtils`. Ví dụ:

```java
Method method = ReflectionUtils.findMethod(User.class, "getId");
```

#### Lấy trường

Nếu bạn muốn lấy một trường cụ thể của một lớp, bạn có thể sử dụng phương thức `findField` của lớp `ReflectionUtils`. Ví dụ:

```java
Field field = ReflectionUtils.findField(User.class, "id");
```

#### Thực thi phương thức

Nếu bạn muốn gọi một phương thức thông qua phản xạ và truyền tham số, bạn có thể sử dụng phương thức `invokeMethod` của lớp `ReflectionUtils`. Ví dụ:

```java
ReflectionUtils.invokeMethod(method, springContextsUtil.getBean(beanName), param);
```

#### Kiểm tra xem trường có phải là hằng số

Nếu bạn muốn kiểm tra xem một trường có phải là hằng số không, bạn có thể sử dụng phương thức `isPublicStaticFinal` của lớp `ReflectionUtils`. Ví dụ:

```java
Field field = ReflectionUtils.findField(User.class, "id");
System.out.println(ReflectionUtils.isPublicStaticFinal(field));
```

#### Kiểm tra xem phương thức có phải là phương thức equals

Nếu bạn muốn kiểm tra xem một phương thức có phải là phương thức equals không, bạn có thể sử dụng phương thức `isEqualsMethod` của lớp `ReflectionUtils`. Ví dụ:

```java
Method method = ReflectionUtils.findMethod(User.class, "getId");
System.out.println(ReflectionUtils.isEqualsMethod(method));
```

Lớp này còn có nhiều phương thức thú vị khác. Nếu bạn quan tâm, có thể tìm hiểu thêm trong các nội dung dưới đây:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240704193001.png)


