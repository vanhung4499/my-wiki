---
title: Degrade with OpenFeign & Sentinel
tags:
  - java
  - microservice
categories:
  - project
order: 10
---
# PmHub - Degrade with OpenFeign & Sentinel

Bài viết này chủ yếu nói về cách tích hợp OpenFeign và Sentinel trong PmHub để thực hiện dịch vụ **fallback** tùy chỉnh khi hạ cấp dịch vụ, cũng như cách sử dụng Sentinel và Gateway để giới hạn tốc độ trên cổng.

::: info
+ Tích hợp OpenFeign và Sentinel để thực hiện **hạ cấp dịch vụ** thông qua fallback tùy chỉnh, giúp giảm tải cho dịch vụ. Tích hợp Sentinel và Gateway để giới hạn lưu lượng trên cổng.
:::

## Cắt giảm dịch vụ khi quá tải

### Tổng quan

Ngoài việc kiểm soát lưu lượng, việc cắt giảm và hạ cấp các tài nguyên không ổn định trong chuỗi gọi cũng là một biện pháp quan trọng để đảm bảo tính khả dụng cao. Một dịch vụ thường xuyên gọi các module khác, có thể là một dịch vụ từ xa, cơ sở dữ liệu hoặc API của bên thứ ba. Ví dụ, khi thực hiện thanh toán, có thể cần gọi API do UnionPay cung cấp từ xa; hoặc khi tra cứu giá sản phẩm, có thể cần thực hiện truy vấn cơ sở dữ liệu. Tuy nhiên, tính ổn định của các dịch vụ phụ thuộc này không được đảm bảo. Nếu dịch vụ phụ thuộc gặp vấn đề không ổn định, thời gian phản hồi của yêu cầu sẽ kéo dài, gây ra tình trạng dồn ứ các luồng và cuối cùng có thể làm cạn kiệt thread pool của dịch vụ chính, khiến dịch vụ không khả dụng.

![image.png](https://user-images.githubusercontent.com/9434884/62410811-cd871680-b61d-11e9-9df7-3ee41c618644.png)

Kiến trúc microservice hiện đại đều là hệ thống phân tán, bao gồm rất nhiều dịch vụ khác nhau. Các dịch vụ này gọi lẫn nhau, tạo thành chuỗi gọi phức tạp. Các vấn đề như trên có thể phóng đại trong chuỗi gọi này. Một điểm không ổn định trong chuỗi có thể gây ra phản ứng dây chuyền, làm cho toàn bộ chuỗi không khả dụng. Do đó, chúng ta cần cắt giảm và hạ cấp các dịch vụ phụ thuộc yếu để tạm thời ngắt kết nối các gọi không ổn định, ngăn ngừa sự bất ổn cục bộ gây ra "hiệu ứng tuyết lở" cho toàn hệ thống. Việc cắt giảm và hạ cấp này thường được cấu hình ở phía khách hàng (đầu gọi).

### Cắt giảm và hạ cấp trong Sentinel

Những ai quen thuộc với microservice đều biết rằng trước đây, Hystrix là thành phần phổ biến để cắt giảm và hạ cấp dịch vụ. Tuy nhiên, Netflix đã thông báo vào cuối năm 2018 rằng họ sẽ không tiếp tục phát triển Hystrix và dự án này sẽ chuyển sang chế độ bảo trì. Vì vậy, **Sentinel**, một sản phẩm mã nguồn mở của Alibaba, đã trở thành giải pháp thay thế phổ biến.

::: info
Tất nhiên, Resilience4J cũng là một sản phẩm thay thế được đề xuất chính thức cho Hystrix. Nó nhẹ, đơn giản, và tài liệu rất rõ ràng, phong phú.
:::

> Vì vậy, những ai vẫn còn dạy bạn Hystrix có lẽ chưa nắm bắt được xu hướng công nghệ mới.

Sentinel là một thành phần quản lý lưu lượng hướng đến kiến trúc dịch vụ phân tán, không đồng nhất và đa ngôn ngữ. Nó chủ yếu tập trung vào lưu lượng, từ điều khiển lưu lượng, định hình lưu lượng, cắt giảm và hạ cấp dịch vụ, bảo vệ quá tải thích ứng hệ thống, đến bảo vệ lưu lượng điểm nóng, giúp các nhà phát triển đảm bảo tính ổn định của microservice.

Những ai đã tìm hiểu về lịch sử của Sentinel chắc chắn sẽ cảm thấy ngưỡng mộ. Một framework phổ biến và cộng đồng phát triển mạnh mẽ không thể chỉ đạt được trong một sớm một chiều, mà đó là kết quả của sự phát triển liên tục.

### Nguyên lý Sentinel

Trong Sentinel, mọi tài nguyên đều tương ứng với một tên tài nguyên và một **Entry**. Entry có thể được tạo tự động thông qua việc thích ứng với các framework chính hoặc tạo rõ ràng thông qua annotation hoặc gọi API. Mỗi khi một Entry được tạo, một chuỗi chức năng (slot chain) cũng sẽ được tạo.

Tổng thể kiến trúc như sau:

![image.png](https://user-images.githubusercontent.com/9434884/69955207-1e5d3c00-1538-11ea-9ab2-297efff32809.png)

Sentinel mở rộng ProcessorSlot như là một interface SPI (phiên bản trước 1.7.2 thì SlotChainBuilder là SPI), giúp Slot Chain có khả năng mở rộng. Bạn có thể tự thêm các slot tùy chỉnh và sắp xếp thứ tự giữa chúng, từ đó thêm các chức năng tùy chỉnh cho Sentinel.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240918203157.png)

## Tải và cài đặt Sentinel

::: info
**<font style="color:rgb(133, 133, 133);">Lưu ý: Để khởi động bảng điều khiển Sentinel, yêu cầu JDK phiên bản từ 1.8 trở lên.</font>
:::

Địa chỉ tải xuống: [https://github.com/alibaba/Sentinel/releases](https://github.com/alibaba/Sentinel/releases)  
Tài liệu: [https://sentinelguard.io/en-us/docs/introduction.html](https://sentinelguard.io/en-us/docs/introduction.html)

> Tôi sử dụng phiên bản 1.8.7. Bạn có thể tải theo nhu cầu của mình, nhưng nên tải phiên bản phát hành ổn định.

Sentinel thực chất là một tệp jar, vì vậy chúng ta có thể chạy trực tiếp bằng lệnh Java, nhưng hãy đảm bảo cổng 8080 không bị chiếm dụng. Bạn có thể kiểm tra xem cổng có bị chiếm dụng không.

```java
lsof -i :8080
```

Chạy lệnh khởi động:

```java
java -jar sentinel-dashboard-1.8.7.jar
```

Truy cập giao diện quản lý, nhập địa chỉ: [http://localhost:8080/](http://localhost:8080/)

Tên đăng nhập và mật khẩu mặc định đều là: sentinel

## Sử dụng Sentinel - Kết hợp Gateway và Sentinel để giới hạn lưu lượng truy cập Gateway

> Ở đây sẽ lấy ví dụ về việc tích hợp module gateway của PmHub, các module khác cũng có thể tham khảo cách này. 🔔

Sentinel hỗ trợ giới hạn lưu lượng truy cập đối với các API Gateway chính như Spring Cloud Gateway, Zuul.

![Sơ đồ kiến trúc tích hợp Gateway của Sentinel (trang chính)](https://user-images.githubusercontent.com/9434884/70883552-4ce61700-200e-11ea-8324-e803d0753a20.png)

Kể từ phiên bản 1.6.0, Sentinel đã cung cấp mô-đun tương thích với Spring Cloud Gateway, cho phép giới hạn lưu lượng truy cập theo hai cấp độ tài nguyên:

- **Cấp độ route**: Tức là các mục route được cấu hình trong tệp cấu hình Spring, với tên tài nguyên là `routeId` tương ứng.
- **Cấp độ API tùy chỉnh**: Người dùng có thể sử dụng API của Sentinel để tùy chỉnh các nhóm API.

Trong PmHub, chủ yếu sử dụng cấp độ route, tức là tên của các microservice tương ứng. Dưới đây là các bước cụ thể, hiểu rõ chúng, bạn sẽ nắm vững hơn.

### Thêm các dependency

```xml
<!-- Phụ thuộc chính của SpringCloud Alibaba Sentinel -->
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>

<!-- Phụ thuộc của SpringCloud Alibaba Sentinel Gateway, không cần nếu không sử dụng gateway -->
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-alibaba-sentinel-gateway</artifactId>
</dependency>

<!-- Sentinel Datasource Nacos dùng để lưu trữ dữ liệu vĩnh viễn -->
<dependency>
  <groupId>com.alibaba.csp</groupId>
  <artifactId>sentinel-datasource-nacos</artifactId>
</dependency>
```

### Chỉnh sửa tệp `yml`

```yaml
spring: 
 cloud: 
   sentinel:
      # Tắt lazy loading của bảng điều khiển
      eager: true
      transport:
        # Cấu hình địa chỉ dịch vụ bảng điều khiển
        dashboard: 127.0.0.1:8080
        # Mặc định là cổng 8719, nếu bị chiếm dụng sẽ tự động tìm cổng trống từ 8719 trở lên
        port: 8719
      # Cấu hình lưu trữ Nacos
      datasource:
        ds1:
          nacos:
            server-addr: 127.0.0.1:8848
            dataId: sentinel-pmhub-gateway
            groupId: DEFAULT_GROUP
            data-type: json
            rule-type: gw-flow
```

### Cấu hình lưu trữ Nacos

Mặc định, cấu hình của Sentinel được lưu trữ trong bộ nhớ, nếu dịch vụ bị khởi động lại, các quy tắc đã được cấu hình sẽ bị mất. Để ngăn chặn điều này, cần cấu hình lưu trữ dữ liệu. Trong PmHub, Nacos đã được cấu hình để lưu trữ dữ liệu vào cơ sở dữ liệu MySQL.

Chỉ cần đưa cấu hình của Sentinel vào Nacos để quản lý tập trung. Trong bước trước, đã cấu hình lưu trữ, bạn có thể thấy tệp `sentinel-pmhub-gateway`. Tệp mặc định đã được cấu hình sẵn, bạn có thể mở Nacos để xem.

Đây chủ yếu là cấu hình quy tắc kiểm soát lưu lượng, dùng để giới hạn lưu lượng truy cập tại gateway.

### Xem bảng điều khiển Sentinel

Khởi động dịch vụ gateway và mở bảng điều khiển.

![Bảng điều khiển Sentinel](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718927860066-b10632b1-ad29-4e48-8f84-3c4db5a27471.png)

### Giới thiệu về quy tắc kiểm soát lưu lượng

Sentinel có thể kiểm soát lưu lượng, chủ yếu giám sát **QPS (số lượng truy vấn mỗi giây) hoặc số lượng luồng đồng thời**. Nếu các chỉ số đạt đến ngưỡng đã định, lưu lượng sẽ bị kiểm soát để tránh tình trạng dịch vụ bị sụp đổ do lưu lượng truy cập cao đột ngột, từ đó đảm bảo tính ổn định của hệ thống. Ở đây lấy ví dụ về quy tắc kiểm soát lưu lượng của gateway pmhub-gateway, các tham số được mô tả dưới đây:

![Quy tắc kiểm soát lưu lượng của Gateway](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718929039666-f0de17a3-66dd-447f-9382-6329a6737b7e.png)

| Tên tham số             | Ví dụ giá trị                      | Giải thích                                                                                                                 |
| ----------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Loại API                | Route ID / Nhóm API                | Chỉ định loại API mà quy tắc giới hạn áp dụng, có thể là Route ID hoặc nhóm API.                                           |
| Tên API                 | pmhub-system                       | Tên cụ thể của API bị giới hạn lưu lượng.                                                                                  |
| Theo thuộc tính yêu cầu | Hộp kiểm                           | Có giới hạn lưu lượng theo thuộc tính yêu cầu như địa chỉ IP, danh tính người dùng hay không.                              |
| Loại ngưỡng             | QPS / Số lượng luồng               | Loại giới hạn lưu lượng, có thể là QPS hoặc số lượng luồng đồng thời.                                                      |
| Ngưỡng QPS              | 1000                               | Số lượng yêu cầu tối đa được phép trong mỗi giây. Nếu vượt qua giá trị này, giới hạn lưu lượng sẽ được kích hoạt.          |
| Khoảng thời gian        | 1                                  | Khoảng thời gian giới hạn lưu lượng, như 1 giây hoặc 1 phút.                                                               |
| Cách kiểm soát          | Thất bại nhanh / Xếp hàng đồng đều | Khi đạt đến ngưỡng giới hạn, hệ thống sẽ từ chối yêu cầu ngay lập tức hoặc xếp hàng để xử lý yêu cầu.                      |
| Burst size              | 0                                  | Số lượng yêu cầu cho phép vượt qua giới hạn trong một thời gian ngắn. Giá trị 0 nghĩa là không cho phép lưu lượng bùng nổ. |

Nếu loại ngưỡng là QPS, khi số lượng yêu cầu QPS đạt ngưỡng, hệ thống sẽ thực hiện giới hạn lưu lượng. Nếu loại ngưỡng là số lượng luồng, hệ thống sẽ giới hạn lưu lượng khi số luồng đồng thời đạt ngưỡng.

Trong cấu hình của `pmhub-system`, giá trị 1000 đại diện cho việc mỗi giây chỉ có thể xử lý tối đa 1000 yêu cầu.

## Tích hợp OpenFeign và Sentinel để thực hiện fallback tùy chỉnh khi hạ cấp dịch vụ
### Annotation `@SentinelResource`

annotation `@SentinelResource` là một annotation bảo vệ tài nguyên của Sentinel, dùng để chỉ định tài nguyên được bảo vệ và thực hiện các chức năng như kiểm soát lưu lượng, cắt giảm hoặc hạ cấp dịch vụ.

Nói cách khác, nó được thêm vào các API để thực hiện các chức năng kiểm soát lưu lượng, cắt giảm, và hạ cấp dịch vụ cho từng API. Trong PmHub, API lấy thông tin người dùng trong dịch vụ hệ thống có sử dụng annotation `@SentinelResource` và đã cấu hình quy tắc kiểm soát lưu lượng, bao gồm thông báo giới hạn lưu lượng tùy chỉnh và trả về fallback khi có lỗi.

Dưới đây là quy trình tương tác dịch vụ liên quan đến API đăng nhập:

![pmhub-login-flow.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/pmhub-login-flow.png)


Thêm annotation này vào API sẽ cho phép thực hiện thông báo giới hạn lưu lượng tùy chỉnh và trả về fallback khi có lỗi.

![Minh họa](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718934610770-55fa2bc1-99e6-4eef-9c13-4fabe5a486bb.png)

### Giải thích nghiệp vụ

Fallback khi hạ cấp dịch vụ có nghĩa là khi một microservice gặp sự cố, người dùng sẽ nhận được thông báo về tình trạng hạ cấp, chẳng hạn như: “Dịch vụ đang bận, vui lòng thử lại sau!” Điều này nhằm tránh người dùng tiếp tục gửi yêu cầu và làm tăng gánh nặng cho microservice.

Trong ví dụ trên, fallback được thêm trực tiếp vào phương thức `@SentinelResource` của API, nhưng với các phương thức khác nhau khi gọi qua Feign, nếu thêm một phương thức fallback cho mỗi API thì mã sẽ trở nên phức tạp và khó quản lý.

### PmHub Thực Chiến

Một phương pháp hiệu quả là: cấu hình thống nhất bằng thuộc tính `fallback`, tất cả các phương thức trong interface Feign đều sẽ thực hiện hạ cấp dịch vụ thông qua một phương thức chung, chỉ cần cấu hình một lần là xong.

Vậy làm sao để định nghĩa `fallback` này?

Trong PmHub, cách làm là thế này: Đối với quá trình đăng nhập, dịch vụ xác thực không thể trực tiếp gọi đến giao diện người dùng của dịch vụ hệ thống (nếu gọi trực tiếp thì sẽ không an toàn). Vì vậy, một gói chung đã được tách ra và tất cả các giao diện người dùng được đặt trong đó. Thông qua việc gọi bằng Feign, phía gọi sẽ không nhận biết được điều này. Do đó, chúng ta thực hiện hạ cấp dịch vụ chung trong module `pmhub-api`. Dưới đây là quy trình cụ thể:

![pmhub-login-degrade.drawio.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/pmhub-login-degrade.drawio.png)

Trong lớp `UserFeignService`, chỉ cần thêm thuộc tính `fallbackFactory` tùy chỉnh vào chú thích `@FeignClient` là có thể đạt được chức năng mà chúng ta mong muốn. Dưới đây là mã cụ thể.

**UserFeignService:**

```java
@FeignClient(contextId = "userFeignService", value = ServiceNameConstants.SYSTEM_SERVICE, fallbackFactory = UserFeginFallbackFactory.class)
public interface UserFeignService {

    /**
     * Get the current user information based on the username.
     */
    @GetMapping("/system/user/info/{username}")
    R<LoginUser> info(@PathVariable("username") String username, @RequestHeader(SecurityConstants.FROM_SOURCE) String source);

    /**
     * Register user information.
     *
     * @param sysUser User information
     * @param source Request source
     * @return Result
     */
    @PostMapping("/system/user/register")
    R<Boolean> registerUserInfo(@RequestBody SysUser sysUser, @RequestHeader(SecurityConstants.FROM_SOURCE) String source);
}
```

**Xử lý hạ cấp dịch vụ trong `UserFeginFallbackFactory`:**

```java
@Component
public class UserFeginFallbackFactory implements FallbackFactory<UserFeignService> {
    private static final Logger log = LoggerFactory.getLogger(UserFeginFallbackFactory.class);

    @Override
    public UserFeignService create(Throwable throwable) {
        log.error("User service call failed: {}", throwable.getMessage());
        return new UserFeignService() {

            @Override
            public R<LoginUser> info(String username, String source) {
                return R.fail("Failed to retrieve user: " + throwable.getMessage());
            }

            @Override
            public R<Boolean> registerUserInfo(SysUser sysUser, String source) {
                return R.fail("Failed to register user: " + throwable.getMessage());
            }

        };
    }
}
```

Như vậy, chúng ta đã hoàn thành tích hợp OpenFeign và Sentinel để thực hiện hạ cấp dịch vụ fallback tùy chỉnh. Hiểu lý thuyết là một chuyện, nhưng thao tác thực tế không quá phức tạp. 

## Câu hỏi phỏng vấn

**Người phỏng vấn: Hãy giải thích khái niệm cache xuyên thấu, cache bị phá vỡ và cache tuyết lở là gì? Làm thế nào để giải quyết?**

Tôi: Cache xuyên thấu đơn giản là khi một số lượng lớn các request có key không hợp lệ, không tồn tại trong cache hoặc trong cơ sở dữ liệu. Điều này dẫn đến việc các request trực tiếp truy cập cơ sở dữ liệu, không qua lớp cache, gây ra áp lực lớn lên cơ sở dữ liệu và có thể làm hệ thống sập do quá tải request.
**Người phỏng vấn: Hãy giải thích về hiện tượng dịch vụ bị tuyết lở?**

Tôi: Khi nhiều microservices gọi nhau, giả sử microservice A gọi microservice B và C, trong khi B và C lại gọi các microservice khác, điều này được gọi là hiện tượng “phân tán” (fan-out). Nếu một microservice trong chuỗi này có thời gian phản hồi quá lâu hoặc không khả dụng, điều này sẽ chiếm dụng ngày càng nhiều tài nguyên hệ thống của microservice A, dẫn đến sụp đổ hệ thống, hay còn gọi là "hiệu ứng tuyết lở". Đối với các ứng dụng có lưu lượng truy cập cao, việc một dịch vụ phụ thuộc vào backend duy nhất có thể khiến toàn bộ tài nguyên trên các máy chủ bị quá tải trong vài giây. Tệ hơn là việc này còn có thể gây ra sự tăng độ trễ giữa các dịch vụ, làm tắc nghẽn hàng đợi, hết tài nguyên hệ thống như luồng và gây ra các lỗi nối tiếp trên toàn hệ thống. Điều này đòi hỏi việc cách ly và quản lý lỗi cũng như độ trễ để một lỗi đơn lẻ không ảnh hưởng đến toàn bộ ứng dụng hay hệ thống.

Do đó, thường khi phát hiện một instance trong một module gặp sự cố, module đó vẫn sẽ tiếp tục nhận lưu lượng và tiếp tục gọi các module khác, dẫn đến lỗi dây chuyền, hay còn gọi là tuyết lở. Trong kiến trúc phân tán phức tạp, các ứng dụng có hàng chục sự phụ thuộc, và chắc chắn tại một số thời điểm sẽ có những sự cố không thể tránh khỏi.

**Người phỏng vấn: Hãy nói về hạ cấp dịch vụ (service degradation)?**

Tôi: Hạ cấp dịch vụ, nói đơn giản là một giải pháp dự phòng khi dịch vụ không thể thực hiện quy trình gọi thông thường, hệ thống sẽ sử dụng phương án dự phòng mặc định để trả về dữ liệu.

Ví dụ, trong trang chi tiết sản phẩm, thông tin mô tả sản phẩm thường được hiển thị. Nếu hệ thống trang chi tiết sản phẩm gặp sự cố và không thể gọi dữ liệu, hệ thống sẽ lấy thông tin sản phẩm từ bộ nhớ đệm và trả lại cho giao diện người dùng.

**Người phỏng vấn: Hãy nói về dịch vụ ngắt mạch (service circuit breaker)?**

Tôi: Trong hệ thống phân tán và microservices, khi dịch vụ phía dưới gặp phải áp lực quá lớn dẫn đến phản hồi chậm hoặc thất bại liên tục, dịch vụ phía trên sẽ tạm thời ngắt kết nối với dịch vụ phía dưới để đảm bảo tính khả dụng của toàn hệ thống. Cách này được gọi là ngắt mạch. Tương tự như cầu chì, khi đạt tới giới hạn dịch vụ, hệ thống sẽ từ chối truy cập, sau đó sử dụng phương pháp hạ cấp dịch vụ và trả về thông báo thân thiện.

Ngắt mạch thường có ba trạng thái: đóng, mở và bán ngắt mạch.

- Trạng thái đóng (cầu chì hoạt động bình thường): Khi hệ thống hoạt động ổn định, không có lỗi xảy ra, dịch vụ phía trên gọi dịch vụ phía dưới mà không gặp hạn chế nào.
- Trạng thái mở (cầu chì bị ngắt): Dịch vụ phía trên không gọi dịch vụ phía dưới nữa mà trả về phương thức dự phòng đã được định trước.
- Trạng thái bán ngắt mạch: Khi ở trạng thái mở, dịch vụ phía trên sẽ thử khôi phục kết nối với dịch vụ phía dưới theo một số quy tắc. Trong lúc này, dịch vụ phía trên sẽ giới hạn lưu lượng gọi dịch vụ phía dưới và giám sát tỷ lệ thành công. Nếu tỷ lệ thành công đạt yêu cầu, hệ thống sẽ trở lại trạng thái đóng. Nếu không đạt, nó sẽ quay lại trạng thái mở.

**Người phỏng vấn: Hãy nói về giới hạn lưu lượng dịch vụ (rate limit)?**

Tôi: Giới hạn lưu lượng là cách hạn chế số lượng yêu cầu truy cập vào hệ thống nhằm ngăn chặn tình trạng quá tải và gây sập hệ thống. Mục tiêu chính là bảo vệ các nút dịch vụ hoặc các nút dữ liệu phía sau, tránh việc lưu lượng đột ngột quá lớn dẫn đến sự cố không thể sử dụng. Giới hạn lưu lượng cũng giúp làm mượt các yêu cầu, ví dụ như trong trường hợp bán hàng flash với lưu lượng truy cập cao, hệ thống sẽ tổ chức hàng đợi để xử lý các yêu cầu một cách có trật tự.

Có hai loại thuật toán giới hạn lưu lượng chính: đếm tổng số yêu cầu hoặc giới hạn theo cửa sổ thời gian (thường là 1 giây). Thuật toán bucket token và bucket leak là những ví dụ của giới hạn lưu lượng theo cửa sổ thời gian.

**Người phỏng vấn: Hãy nói về cách cô lập dịch vụ?**

Tôi: Cô lập dịch vụ tương tự như việc phân chia hệ thống theo chiều dọc, hệ thống sẽ được chia thành nhiều module dịch vụ riêng biệt theo các quy tắc nhất định. Mỗi module dịch vụ hoạt động độc lập, không phụ thuộc lẫn nhau. Nếu một module gặp sự cố, ảnh hưởng của sự cố đó sẽ bị giới hạn trong module cụ thể đó và không lan sang các dịch vụ khác, đảm bảo không gây ảnh hưởng nghiêm trọng đến toàn bộ hệ thống.

Các phương pháp cách ly dịch vụ phổ biến trong ngành internet bao gồm cách ly bằng thread pool và cách ly bằng semaphore.

**Người phỏng vấn: Hãy giải thích về dịch vụ quá thời gian (timeout)?**

Tôi: Sau khi hệ thống chuyển sang kiến trúc phân tán và microservices, hệ thống được chia thành nhiều dịch vụ nhỏ và các dịch vụ này sẽ gọi lẫn nhau, tạo thành chuỗi gọi dịch vụ.

Trong chuỗi gọi dịch vụ, dịch vụ gọi đến một dịch vụ khác được coi là dịch vụ phía trên, trong khi dịch vụ cung cấp interface cho dịch vụ khác gọi là dịch vụ phía dưới. Dịch vụ quá thời gian xảy ra khi dịch vụ phía trên gọi dịch vụ phía dưới nhưng không nhận được phản hồi trong khoảng thời gian tối đa được thiết lập. Khi đó, hệ thống sẽ ngắt kết nối giữa hai dịch vụ để giải phóng tài nguyên.

**Người phỏng vấn: Sentinel là gì và nó giải quyết vấn đề gì?**

Tôi: Sentinel là một thành phần quản lý lưu lượng trong hệ thống phân tán được phát triển bởi Alibaba, dùng để bảo vệ sự ổn định của dịch vụ. Nó thông qua việc giám sát thời gian thực, ngắt mạch, hạ cấp, giới hạn lưu lượng, và bảo vệ tải hệ thống để ngăn chặn các vấn đề như lưu lượng đột ngột hoặc sự không ổn định từ các phụ thuộc bên ngoài gây ra sự cố dịch vụ, đảm bảo tính khả dụng và ổn định của hệ thống.

**Người phỏng vấn: Làm thế nào để tích hợp OpenFeign với Sentinel? Các bước cụ thể là gì?**

Tôi: Theo dự án PmHub, hãy tự sắp xếp câu trả lời và giải thích.

**Người phỏng vấn: Trong dự án của bạn, làm thế nào để thực hiện dịch vụ hạ cấp tùy chỉnh với fallback?**

Tôi: Theo dự án PmHub, hãy tự sắp xếp câu trả lời và giải thích.

**Người phỏng vấn: Bạn đã gặp những thách thức nào trong quá trình triển khai và bạn đã giải quyết chúng như thế nào?**

Tôi: Các vấn đề như xung đột phụ thuộc hoặc không tương thích phiên bản khi tích hợp. Tôi đã giải quyết bằng cách tham khảo tài liệu chính thức và các nguồn tài nguyên từ cộng đồng để điều chỉnh phiên bản phụ thuộc.

Việc thiết kế và triển khai logic hạ cấp cũng cần đảm bảo rằng phản hồi sau khi hạ cấp vẫn đáp ứng yêu cầu kinh doanh. Tôi đã làm điều này bằng cách thảo luận với bên kinh doanh để làm rõ yêu cầu về logic hạ cấp và tiến hành kiểm thử đầy đủ.

Ngoài ra, tôi cũng đã điều chỉnh và tối ưu hóa các quy tắc giới hạn lưu lượng để tránh ảnh hưởng tới các yêu cầu hợp lệ, thông qua giám sát thời gian thực và phân tích nhật ký, dần dần tối ưu hóa chiến lược giới hạn lưu lượng.

