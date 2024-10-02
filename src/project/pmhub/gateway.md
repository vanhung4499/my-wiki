---
title: Gateway
tags:
  - java
  - microservice
  - gateway
categories:
  - project
order: 6
---
# PmHub - Global filter interface & API service call time consumption

Bài viết này sẽ chủ yếu nói về cách triển khai bộ lọc toàn cục tùy chỉnh trong PmHub và cách thực hiện thống kê thời gian xử lý của các API. Chúng ta sẽ đi từ lý thuyết đến thực hành và cuối cùng là phỏng vấn.

> - Tùy chỉnh bộ lọc toàn cục của SpringCloud Gateway, thực hiện việc xác thực thống nhất trên cổng tùy chỉnh và thống kê thời gian gọi API.

# Kiến thức lý thuyết
## Gateway là gì?

Kiến trúc microservices đã trở thành xu hướng chính trong phát triển ứng dụng hiện đại, và đối với chúng ta, đây cũng là một **yếu tố cực kỳ quan trọng** trong phỏng vấn.

Kiến trúc microservices phân chia ứng dụng monolith trước đây thành các dịch vụ nhỏ hơn, mỗi dịch vụ có thể được triển khai, mở rộng và bảo trì độc lập. Tuy nhiên, kiến trúc microservices cũng mang lại một số thách thức, một trong số đó là quản lý giao tiếp giữa các dịch vụ. Lúc này, Gateway cho microservices trở thành một thành phần không thể thiếu.

Gateway cho microservices là một thành phần nằm ở phía trước kiến trúc microservices, nó đóng vai trò là **cổng vào của tất cả các dịch vụ**. Gateway chịu trách nhiệm điều hướng request, cân bằng tải, xác thực bảo mật, kiểm soát lưu lượng, giám sát và ghi nhật ký. Nó giúp tập hợp các dịch vụ thành một API duy nhất, từ đó đơn giản hóa việc giao tiếp giữa client và các dịch vụ.

API Gateway có thể hiểu như là **người bảo vệ** của hệ thống microservices, là một thành phần quan trọng trong kiến trúc microservices, quản lý và điều phối lưu lượng từ các request bên ngoài vào các dịch vụ bên trong. Để dễ hiểu hơn, hãy so sánh với một ví dụ trong đời sống:

Một trung tâm mua sắm lớn (hệ thống microservices) có nhiều cửa hàng khác nhau (các dịch vụ khác nhau), ví dụ như cửa hàng quần áo, nhà hàng, rạp chiếu phim, v.v. Mỗi cửa hàng có **cổng vào riêng biệt**. Điều này giúp mỗi cửa hàng có thể hoạt động độc lập. Tuy nhiên, nếu không có **cổng vào chung** cho khách hàng, việc quản lý sẽ trở nên hỗn loạn.

Ngoài ra, trung tâm mua sắm cần quản lý lượng khách vào từng cửa hàng, chẳng hạn như ngăn chặn tình trạng quá tải tại một cửa hàng hoặc xử lý ưu đãi cho thành viên.

Gateway có thể làm được gì?

- **Reverse Proxy**: Receives client requests and forwards them to the backend service
- **Authentication**: Authentication and permission checks for client requests
- **Flow Control**: Manage and limit request traffic entering the system
- **Circuit breaker**: Temporarily stop request forwarding to this service
- **Authorization** : Verify and check the identity and permissions of client requests

## Các loại Gateway cho microservices phổ biến?

Những giải pháp gateway cho microservices phổ biến bao gồm [Zuul](https://github.com/Netflix/zuul) của Spring Cloud Netflix, [Spring Cloud Gateway](https://docs.spring.io/spring-cloud-gateway/docs/4.0.4/reference/html/), và các gateway khác như [Kong](https://docs.konghq.com/gateway).

Kong Gateway là một gateway API mã nguồn mở nhẹ, phát triển dựa trên OpenResty + Lua, cung cấp nhiều tính năng phong phú và khả năng mở rộng linh hoạt, có thể mở rộng chức năng của Kong thông qua các plugin.

![Giới thiệu từ trang chính thức](https://docs.konghq.com/assets/images/products/konnect/gateway-manager/konnect-control-planes-example.png)

Ưu điểm của Kong Gateway:
+ **Hiệu suất cao**: Kong dựa trên Nginx và OpenResty, có hiệu suất và khả năng mở rộng rất cao, phù hợp với các tình huống xử lý nhiều request đồng thời.
+ **Hệ sinh thái plugin**: Kong cung cấp nhiều plugin, dễ dàng thực hiện xác thực, giới hạn lưu lượng, ghi nhật ký, giám sát, và có thể tự tạo plugin bằng Lua.
+ **Hỗ trợ đa ngôn ngữ**: Kong hỗ trợ nhiều ngôn ngữ lập trình thông qua hệ thống plugin, như Lua, Go, Python, v.v.
+ **Hỗ trợ đa nền tảng**: Kong có thể chạy trên nhiều nền tảng như Kubernetes, Docker, v.v., phù hợp với nhiều môi trường triển khai.
+ **Hỗ trợ doanh nghiệp**: Kong cung cấp phiên bản doanh nghiệp với nhiều tính năng cao cấp và hỗ trợ thương mại, phù hợp với các kịch bản request hỗ trợ cấp doanh nghiệp.

![Từ trang chính thức của Kong](https://docs.konghq.com/assets/images/products/gateway/kong-gateway-features.png)

Tuy nhiên, do Kong có chi phí học tập cao và việc tạo plugin tùy chỉnh phải sử dụng Lua, không thân thiện với Java, nên Kong không phổ biến trong hệ sinh thái Java.

Tiếp theo, trong hệ sinh thái Java, chỉ còn lại hai giải pháp chủ đạo là SpringCloud Gateway và Zuul. Nhưng do phiên bản 2.x của Zuul liên tục trì hoãn việc cập nhật, SpringCloud cuối cùng đã phát triển một gateway mới là SpringCloud Gateway để thay thế Zuul, **vì vậy SpringCloud Gateway là sự thay thế cho phiên bản Zuul 1.x**.

Trong các dự án mới, hãy sử dụng SpringCloud Gateway.

Tiếp theo, chúng ta sẽ đi sâu vào hai gateway chính là SpringCloud Gateway và Zuul.

## So sánh SpringCloud Gateway với Zuul

| Điểm so sánh                 | Spring Cloud Gateway                                                                                                          | Zuul                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Kiến trúc và thiết kế        | Dựa trên Spring 5, Spring Boot 2 và Project Reactor, mô hình lập trình phản ứng                                               | Dựa trên Servlet, mô hình chặn                                                |
| Hiệu suất                    | Độ trễ thấp, thông lượng cao, phù hợp với các kịch bản có nhiều request đồng thời                                             | Hiệu suất kém, có thể gặp nút thắt cổ chai trong các tình huống đồng thời cao |
| Tính năng                    | Định tuyến động, hỗ trợ WebSocket, nhiều nhà máy bộ lọc, tích hợp với Spring Security, giới hạn lưu lượng, thử lại, ngắt mạch | Chức năng định tuyến và lọc cơ bản, hỗ trợ bộ lọc trước và sau                |
| Dễ sử dụng                   | Tích hợp mượt mà với hệ sinh thái Spring, trải nghiệm phát triển nhất quán, tài liệu và cộng đồng hỗ trợ tốt                  | Cấu hình và mở rộng đơn giản, nhưng tính năng hạn chế                         |
| Bảo trì và hỗ trợ cộng đồng  | Được duy trì tích cực bởi VMware, cập nhật thường xuyên, cộng đồng sôi động, tài liệu phong phú                               | Zuul 1 đã bị lưu trữ, Zuul 2 có ít sự hỗ trợ từ cộng đồng                     |
| Plugin và khả năng mở rộng   | Cung cấp nhiều tính năng và plugin tích hợp, khả năng mở rộng tốt                                                             | Hệ sinh thái plugin yếu hơn, khả năng mở rộng chức năng hạn chế               |
| Chi phí học tập              | Cần học mô hình lập trình phản ứng (thử thách cho những người chưa quen)                                                      | Tương đối đơn giản, phù hợp với các dự án nhỏ và vừa                          |
| Tình huống sử dụng điển hình | Ứng dụng doanh nghiệp request hiệu suất cao, đồng thời lớn và nhiều tính năng mở rộng                                         | Các dự án nhỏ và vừa không cần xử lý các tình huống đồng thời cao             |

Mặc dù Zuul 1.x đã bị Gateway thay thế, nhưng chúng ta vẫn cần biết xu hướng phát triển công nghệ và có một cái nhìn tổng quan. Nếu ai đó vẫn đang sử dụng Zuul trong các dự án mới thì khả năng là họ đang gặp vấn đề.

Vì vậy, chúng ta sẽ sử dụng Gateway phổ biến nhất hiện nay. Tương lai không thể đoán trước, nhưng việc theo sát sẽ giúp bạn có được offer và không bị lạc lối trong công nghệ.

## Ba thành phần cốt lõi của Gateway

Theo giới thiệu từ trang chủ, ba thành phần cốt lõi của Spring Cloud Gateway lần lượt là **Route** (Định tuyến), **Predicate** (Mệnh đề) và **Filter** (Bộ lọc), chúng tạo nên các chức năng thiết yếu của Gateway.

> Glossary
>
> - **Route**: The basic building block of the gateway. It is defined by an ID, a destination URI, a collection of predicates, and a collection of filters. A route is matched if the aggregate predicate is true. 
> - **Predicate**: This is a [Java 8 Function Predicate](https://docs.oracle.com/javase/8/docs/api/java/util/function/Predicate.html). The input type is a [Spring Framework `ServerWebExchange`](https://docs.spring.io/spring/docs/5.0.x/javadoc-api/org/springframework/web/server/ServerWebExchange.html). This lets you match on anything from the HTTP request, such as headers or parameters. 
> - **Filter**: These are instances of [`GatewayFilter`](https://github.com/spring-cloud/spring-cloud-gateway/blob/main/spring-cloud-gateway-server/src/main/java/org/springframework/cloud/gateway/filter/GatewayFilter.java) that have been constructed with a specific factory. Here, you can modify requests and responses before or after sending the downstream request.

Frontend web sẽ gửi request, thông qua một số điều kiện khớp, để xác định node dịch vụ thực sự. Trong quá trình chuyển tiếp request này, chúng ta có thể thực hiện một số kiểm soát tinh chỉnh.

Predicate chính là điều kiện khớp của chúng ta.

Filter có thể được hiểu như một bộ chặn mọi chức năng. Khi có hai yếu tố này, cộng với URI mục tiêu, chúng ta có thể thực hiện một định tuyến cụ thể.

### Định tuyến (Route)

Route là module cơ bản để xây dựng API Gateway. Nó bao gồm ID, URI mục tiêu, một loạt các điều kiện (predicates) và các bộ lọc (filters). Nếu các điều kiện này trả về giá trị **true**, thì request sẽ được chuyển đến đường dẫn tương ứng.

Trong PmHub, cấu hình định tuyến của gateway như sau:

```yaml
spring:
  cloud:
    gateway:
      discovery:
        locator:
          lowerCaseServiceId: true
          enabled: true
      routes:
        # Configuration center
        - id: pmhub-auth
          uri: lb://pmhub-auth
          predicates:
            - Path=/auth/**
          filters:
            # Handle authentication code
            - CacheRequestFilter
            # - ValidateCodeFilter
            - StripPrefix=1
        # Code gen
        - id: pmhub-gen
          uri: lb://pmhub-gen
          predicates:
            - Path=/gen/**
          filters:
            - StripPrefix=0
```

Ví dụ, đối với authentication service center, `id` được đặt là `auth`, trùng với tên dịch vụ đã đăng ký trong Nacos. Như vậy, tất cả các request chứa "/auth/**" trong URL sẽ được chuyển tiếp đến authentication service center.

Trong Spring Cloud Gateway, có ba cách để cấu hình URI:

+ **Cấu hình theo websocket**

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: pmhub-api
          uri: ws://localhost:9090/
          predicates:
            - Path=/api/**
```

+ **Cấu hình theo địa chỉ http**

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: pmhub-api
          uri: http://localhost:9090/
          predicates:
            - Path=/api/**
```

+ **Cấu hình theo service configuration center**

Trong PmHub, phương pháp này sử dụng cấu hình qua Nacos.

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: pmhub-api
          uri: lb://ruoyi-api
          predicates:
            - Path=/api/**
```

### Điều kiện (Predicate)

Predicate có thể hiểu là **quy tắc khớp**. Ví dụ, cấu hình trong PmHub với `- Path=/auth/**` nghĩa là tất cả các request có đường dẫn phù hợp với quy tắc này sẽ được chuyển đến dịch vụ tương ứng. Bạn có thể tham khảo mô tả từ [trang chính thức](https://docs.spring.io/spring-cloud-gateway/reference/spring-cloud-gateway/request-predicates-factories.html):

Nói ngắn gọn, Predicate giúp tạo ra một tập hợp các quy tắc khớp để request có thể tìm đúng Route (định tuyến) và được xử lý.

Khi tạo đối tượng Route trong Spring Cloud Gateway, `RoutePredicateFactory` được sử dụng để tạo đối tượng Predicate, và đối tượng Predicate này sẽ được gán cho Route.

- Spring Cloud Gateway bao gồm nhiều Route Predicate Factories được tích hợp sẵn.
- Các Predicate này khớp với các thuộc tính khác nhau của request HTTP.
- Nhiều Route Predicate Factories có thể được kết hợp với nhau bằng logic **and**.

Các lớp chính của Route Predicate Factory được thể hiện như trong hình, bao gồm thời gian (Datetime), địa chỉ từ xa của request, trọng số của định tuyến, request header, địa chỉ Host, phương thức request, đường dẫn và request parameter:

![1716526492684-86556361-5100-4172-946b-e5f825979b3d.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/1716526492684-86556361-5100-4172-946b-e5f825979b3d.png)


Ngoài ra, chúng ta có thể tùy chỉnh các quy tắc định tuyến theo nhu cầu. Dưới đây là một số Predicate thường được sử dụng:

- **Weight - Khớp theo trọng số**

```yaml
spring: 
  application:
    name: pmhub-gateway
  cloud:
    gateway:
      routes:
        - id: pmhub-system-a
          uri: http://localhost:9201/
          predicates:
            - Weight=group1, 8
        - id: pmhub-system-b
          uri: http://localhost:9201/
          predicates:
            - Weight=group1, 2
```

- **Datetime - Khớp request xảy ra sau một thời điểm nhất định**

```yaml
spring: 
  application:
    name: pmhub-gateway
  cloud:
    gateway:
      routes:
        - id: pmhub-system
          uri: http://localhost:9201/
          predicates:
            - After=2021-02-23T14:20:00.000+08:00[Asia/Shanghai]
```

- **Query - Khớp tham số truy vấn**

```yaml
spring: 
  application:
    name: pmhub-gateway
  cloud:
    gateway:
      routes:
        - id: pmhub-system
          uri: http://localhost:9201/
          predicates:
            - Query=username, abc.
```

- **Path - Khớp đường dẫn request**

```yaml
spring: 
  application:
    name: pmhub-gateway
  cloud:
    gateway:
      routes:
        - id: pmhub-system
          uri: http://localhost:9201/
          predicates:
            - Path=/system/**
```

- **Header - Khớp request header, giá trị phù hợp với biểu thức chính quy \d+**

```yaml
spring: 
  application:
    name: pmhub-gateway
  cloud:
    gateway:
      routes:
        - id: pmhub-system
          uri: http://localhost:9201/
          predicates:
            - Header=X-Request-Id, \d+
```

Nếu các mẫu có sẵn không đáp ứng được nhu cầu, bạn có thể **tùy chỉnh quy tắc điều kiện (Predicate)** theo cách đơn giản như sau:

- Kế thừa lớp trừu tượng `AbstractRoutePredicateFactory`.
- Hoặc triển khai `RoutePredicateFactory` interface.
- Tên lớp có thể đặt tùy ý, nhưng phải kết thúc bằng hậu tố `RoutePredicateFactory`.

Ví dụ mã nguồn:

```java
@Component
public class MyRoutePredicateFactory extends AbstractRoutePredicateFactory<MyRoutePredicateFactory.Config>
{
    public MyRoutePredicateFactory()
    {
        super(MyRoutePredicateFactory.Config.class);
    }

    @Validated
    public static class Config{
        @Setter
        @Getter
        @NotEmpty
        private String userType; // Cấp độ người dùng: Kim cương, vàng, bạc
    }

    @Override
    public Predicate<ServerWebExchange> apply(MyRoutePredicateFactory.Config config)
    {
        return new Predicate<ServerWebExchange>()
        {
            @Override
            public boolean test(ServerWebExchange serverWebExchange)
            {
                // Kiểm tra xem tham số userType có đúng với giá trị chỉ định không
                String userType = serverWebExchange.getRequest().getQueryParams().getFirst("userType");

                if (userType == null) return false;

                // So sánh giá trị tham số với dữ liệu cấu hình
                return userType.equals(config.getUserType());
            }
        };
    }
}
```

### Bộ lọc (Filter)

Bộ lọc trong Gateway tương tự như bộ chặn (Interceptor) trong SpringMVC và bộ lọc trong Servlet. Bộ lọc có hai loại chính là "pre" và "post", lần lượt được gọi trước và sau khi request được thực hiện, dùng để thay đổi thông tin request và phản hồi.

Bộ lọc cũng là một trong những câu hỏi phổ biến trong phỏng vấn, chẳng hạn như **ghi lại thống kê số lượng gọi API, giới hạn tốc độ, blacklist và trắng, v.v.**

Trong các cuộc phỏng vấn, đây là một trong những chủ đề được hỏi nhiều nhất, vì vậy bạn cần chú ý 👊.

Bộ lọc trong Gateway tương tự như bộ chặn trong SpringMVC và bộ lọc trong Servlet. "pre" và "post" lần lượt được gọi trước và sau khi request được thực hiện, để thay đổi thông tin request và phản hồi.

Bộ lọc cũng là một trong những kiến thức phổ biến nhất trong phỏng vấn, như ghi lại số lần gọi API, giới hạn tốc độ, blacklist, trắng, v.v.

Theo loại, bộ lọc được chia thành bộ lọc toàn cục, bộ lọc tích hợp đơn lẻ và bộ lọc tùy chỉnh.
#### Bộ lọc toàn cục

Bộ lọc toàn cục áp dụng cho tất cả các Route mà không cần cấu hình riêng lẻ. Chúng ta có thể sử dụng bộ lọc này để thực hiện nhiều request xử lý chung như xác thực quyền hạn, hạn chế truy cập IP, v.v. Hiện tại, Gateway dùng để xác thực tập trung (`AuthFilter.java`) sử dụng bộ lọc toàn cục.

Việc định nghĩa chỉ cần triển khai hai interface `GlobalFilter` và `Ordered`.

Phần triển khai cụ thể trong PmHub sẽ được đề cập ở phần thực chiến bên dưới.

#### Bộ lọc tích hợp đơn lẻ

[Bộ lọc tích hợp đơn lẻ](https://docs.spring.io/spring-cloud-gateway/reference/spring-cloud-gateway/gatewayfilter-factories.html), còn được gọi là bộ lọc của Gateway, chủ yếu được áp dụng cho một Route hoặc một số Route nhất định.

Một số bộ lọc tích hợp phổ biến bao gồm:

- **Chỉ định nội dung request header**

Có thể lọc các request dựa trên request header. Ví dụ, chỉ cho phép các request có header "X-Request-pmhub" hoặc "X-Request-pmhub2".

```java
public class GatewayFilter {
    @GetMapping(value = "/pay/gateway/filter")
    public AjaxResult getGatewayFilter(HttpServletRequest request)
    {
        String result = "";
        Enumeration<String> headers = request.getHeaderNames();
        while(headers.hasMoreElements())
        {
            String headName = headers.nextElement();
            String headValue = request.getHeader(headName);
            System.out.println("Tên request header: " + headName + "\t\t\t" + "Giá trị request header: " + headValue);
            if(headName.equalsIgnoreCase("X-Request-pmhub")
                    || headName.equalsIgnoreCase("X-Request-pmhub2")) {
                result = result + headName + "\t " + headValue + " ";
            }
        }
        return AjaxResult.success("getGatewayFilter Bộ lọc test: " + result + " \t " + DateUtil.now());
    }
}
```

Bạn có thể cấu hình như sau:

```yaml
 predicates:
        - Path=/auth/gateway/info/**              # Điều kiện, đường dẫn khớp với Route

        - id: pmhub_routh3 #pay_routh3
          uri: lb://cloud-pmhub-service                # Route cung cấp dịch vụ sau khi khớp
          predicates:
            - Path=/pay/gateway/filter/**              # Điều kiện, khớp với đường dẫn
          filters:
            - AddRequestHeader=X-Request-pmhub,pmhubValue1  # Thêm request header kv
            - AddRequestHeader=X-Request-pmhub2,pmhubValue2
```

Với cách này, bạn có thể lọc các request dựa trên nội dung header để xử lý xác thực hoặc các trường hợp khác.

- **Chỉ định request parameter**

Bạn có thể lọc các request dựa trên request parameter. Chỉ các request có tham số mới được thực hiện.

```yaml
  predicates:
            - Path=/auth/gateway/filter/**              # Điều kiện, khớp với đường dẫn
          filters:
            - AddRequestParameter=customerId,9527001 # Thêm request parameter: k, v
            - RemoveRequestParameter=customerName   # Xóa tham số URL customerName
```

- **Chỉ định response header**

Có thể thêm response header để hệ thống hoặc ứng dụng web xử lý tương ứng.

```yaml
  predicates:
            - Path=/auth/gateway/filter/**              # Điều kiện, khớp với đường dẫn
          filters:
            - AddResponseHeader=X-Response-pmhub, BlueResponse # Thêm header X-Response-pmhub và giá trị BlueResponse
```

- **Chỉ định tiền tố và đường dẫn**

Bạn có thể lọc và định tuyến lại đường dẫn, cấu hình như sau:

```yaml
  predicates:
            - Path=/auth/gateway/filter/**              # Điều kiện, khớp với đường dẫn
          filters:
            - PrefixPath=/pmhub # http://localhost:6880/pmhub/gateway/filter
            - RedirectTo=302, https://abcdxyzt.com/ # Chuyển hướng đến abcdxyzt.com
```

#### Bộ lọc tùy chỉnh

Câu hỏi phỏng vấn kinh điển: Làm thế nào để thống kê thời gian xử lý khi gọi API? Hãy trình bày ý tưởng thiết kế của bạn?

Chúng ta có thể tận dụng tính năng bộ lọc tùy chỉnh của Gateway để thực hiện chức năng này. Để tạo bộ lọc toàn cục tùy chỉnh, chỉ cần triển khai hai interface `GlobalFilter` và `Ordered`, và trong phương thức `filter`, chúng ta sẽ thống kê thời gian truy cập API. Ví dụ như đoạn mã dưới đây:

```java
return chain.filter(exchange).then(Mono.fromRunnable(() -> {
    Long beginVisitTime = exchange.getAttribute(BEGIN_VISIT_TIME);
    if (beginVisitTime != null) {
        log.info("API Server: " + exchange.getRequest().getURI().getHost());
        log.info("API Gateway: " + exchange.getRequest().getURI().getPort());
        log.info("API URL: " + exchange.getRequest().getURI().getPath());
        log.info("API URL Parameter: " + exchange.getRequest().getURI().getRawQuery());
        log.info("API execution time: " + (System.currentTimeMillis() - beginVisitTime) + "ms");
        log.info("###################################################");
        System.out.println();
    }
}));
```

## Cấu hình giới hạn lưu lượng (Rate limiter)

Giới hạn lưu lượng (rate limiter), như tên gọi, là hạn chế luồng truy cập. Bằng cách thực hiện các biện pháp giới hạn lưu lượng, chúng ta có thể quản lý hiệu quả số lượng yêu cầu mỗi giây (QPS), từ đó bảo vệ hệ thống.

Các thuật toán giới hạn lưu lượng phổ biến bao gồm: **thuật toán bộ đếm**, **thuật toán Leaky Bucket**, và **thuật toán Token Bucket**.

Trong Spring Cloud Gateway, lớp `RequestRateLimiterGatewayFilterFactory` cung cấp tính năng giới hạn lưu lượng dựa trên thuật toán token bucket, kết hợp với Redis và Lua scripts.

1. Thêm các phụ thuộc

```xml
<!-- Phụ thuộc reactive cho spring data redis -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
</dependency>
```

2. Quy tắc giới hạn lưu lượng, dựa trên URI

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    password: 
  cloud:
    gateway:
      routes:
        # system module
        - id: pmhub-system
          uri: lb://pmhub-system
          predicates:
            - Path=/system/**
          filters:
            - StripPrefix=1
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 1 # Tốc độ nạp token mỗi giây
                redis-rate-limiter.burstCapacity: 2 # Tổng dung lượng token bucket
                key-resolver: "#{@pathKeyResolver}" # Sử dụng SpEL để tham chiếu bean theo tên
```

::: tip
Cấu hình `StripPrefix=1` có nghĩa là khi Gateway chuyển tiếp đến module dịch vụ, nó sẽ tự động bỏ tiền tố. Cấu hình này có thể điều chỉnh tùy theo trường hợp cụ thể.
:::

3. Viết lớp cấu hình quy tắc giới hạn lưu lượng theo URI

```java
/**
 * Lớp cấu hình quy tắc giới hạn lưu lượng
 */
@Configuration
public class KeyResolverConfiguration {
    @Bean
    public KeyResolver pathKeyResolver() {
        return exchange -> Mono.just(exchange.getRequest().getURI().getPath());
    }
}
```

4. Kiểm tra dịch vụ để xác minh giới hạn lưu lượng

Khởi động dịch vụ Gateway `PmHubGatewayApplication.java` và dịch vụ hệ thống `PmHubSystemApplication.java`.

Vì dịch vụ Gateway có xác thực quyền truy cập, bạn có thể thiết lập whitelist `/system/**` trong cấu hình Gateway để kiểm tra. Khi gửi nhiều yêu cầu, bạn sẽ thấy trả về HTTP ERROR 429, đồng thời Redis sẽ chứa hai khóa, biểu thị rằng giới hạn lưu lượng đã thành công.

```yaml
request_rate_limiter.{xxx}.timestamp
{xxx}.tokens
```

Bạn cũng có thể cấu hình quy tắc giới hạn lưu lượng khác, như giới hạn theo tham số hoặc theo IP, như sau:

```java
// Giới hạn theo tham số
@Bean
public KeyResolver parameterKeyResolver() {
    return exchange -> Mono.just(exchange.getRequest().getQueryParams().getFirst("userId"));
}

// Giới hạn theo IP
@Bean
public KeyResolver ipKeyResolver() {
	return exchange -> Mono.just(exchange.getRequest().getRemoteAddress().getHostName());
}
```

## Cấu hình blacklist

Như tên gọi, blacklist là những URL bị cấm truy cập. Để thực hiện chức năng này, có thể tạo bộ lọc tùy chỉnh `BlackListUrlFilter` và cấu hình danh sách URL đen `blacklistUrl`. Dĩ nhiên, nếu có nhu cầu khác, bạn cũng có thể triển khai các bộ lọc với quy tắc tùy chỉnh để đáp ứng yêu cầu cụ thể.

Cấu hình bộ lọc blacklist trong pmhub:

```java
/**
 * Bộ lọc blacklist
 */
@Component
public class BlackListUrlFilter extends AbstractGatewayFilterFactory<BlackListUrlFilter.Config> {
    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            String url = exchange.getRequest().getURI().getPath();
            if (config.matchBlacklist(url)) {
                return ServletUtils.webFluxResponseWriter(exchange.getResponse(), "Địa chỉ yêu cầu không được phép truy cập");
            }

            return chain.filter(exchange);
        };
    }

    public BlackListUrlFilter() {
        super(Config.class);
    }

    public static class Config {
        private List<String> blacklistUrl;

        private List<Pattern> blacklistUrlPattern = new ArrayList<>();

        public boolean matchBlacklist(String url) {
            return !blacklistUrlPattern.isEmpty() && blacklistUrlPattern.stream().anyMatch(p -> p.matcher(url).find());
        }

        public List<String> getBlacklistUrl() {
            return blacklistUrl;
        }

        public void setBlacklistUrl(List<String> blacklistUrl) {
            this.blacklistUrl = blacklistUrl;
            this.blacklistUrlPattern.clear();
            this.blacklistUrl.forEach(url -> {
                this.blacklistUrlPattern.add(Pattern.compile(url.replaceAll("\\*\\*", "(.*?)"), Pattern.CASE_INSENSITIVE));
            });
        }
    }
}
```

Về sau, nếu không muốn cho phép truy cập URL nào, chỉ cần **thêm vào blacklist** là xong.

```yaml
spring:
  cloud:
    gateway:
      routes:
        # system module
        - id: pmhub-system
          uri: lb://pmhub-system
          predicates:
            - Path=/system/**
          filters:
            - StripPrefix=0
            - name: BlackListUrlFilter
              args:
                blacklistUrl:
                - /user/list
```

## Cấu hình whitelist

Như tên gọi, whitelist bao gồm các địa chỉ được phép truy cập mà không cần đăng nhập. Ví dụ như các API đăng nhập, đăng ký, và những API không yêu cầu gateway xác thực đều có thể nằm trong whitelist. Nếu yêu thích địa chỉ nào, bạn có thể thêm nó vào đây! ＼（＾ ＾）／. Trong cấu hình `ignore` đặt `whites`, nghĩa là cho phép truy cập ẩn danh.

Chỉ cần thêm đoạn logic sau vào bộ lọc toàn cục:

```java
// Bỏ qua các đường dẫn không cần xác thực
if (StringUtils.matches(url, ignoreWhite.getWhites())) {
    return chain.filter(exchange);
}
```

Cấu hình trong file YAML:

```yaml
# Không xác thực các URL trong whitelist
ignore:
  whites:
    - /auth/logout
    - /auth/login
```

Trên đây là giới thiệu về bộ lọc trong gateway và các chức năng thường dùng. **Áp dụng vào dự án thực tế**, hiểu và sử dụng các khái niệm và phương pháp này không hề khó, thậm chí còn có thể ghi vào CV để gây ấn tượng với nhà tuyển dụng.

# Thực chiến dự án

Tiếp theo, mình sẽ giải thích cụ thể cách thực hiện bộ lọc toàn cục trong PmHub và cách thống kê thời gian gọi API.

## Cách viết bộ lọc toàn cục

+ **Bước 1**: Tạo lớp `AuthFilter`

Trong dịch vụ gateway `pmhub-gateway`, tạo lớp `AuthFilter` trong thư mục `filter` và triển khai các interface `GlobalFilter` và `Ordered`.

```java
@Component  
public class AuthFilter implements GlobalFilter, Ordered {  
    // ...
}
```

`GlobalFilter` là interface bộ lọc toàn cục tích hợp trong gateway, chỉ có một phương thức, do đó, ta chỉ cần triển khai phương thức đó.

`Ordered` là interface trong Spring Framework dùng để xác định thứ tự ưu tiên.

::: info
Trong interface này có hai hằng số là `HIGHEST_PRECEDENCE` và `LOWEST_PRECEDENCE`, lần lượt biểu thị thứ tự ưu tiên cao nhất và thấp nhất. Chức năng chính của interface này là thông qua phương thức `getOrder()` trả về một số nguyên, số này biểu thị mức độ ưu tiên của đối tượng. Trong Spring Framework, nếu một đối tượng triển khai interface `Ordered`, nó sẽ được chỉ định mức độ ưu tiên, và Spring container sẽ quyết định thứ tự tạo và gọi các đối tượng dựa trên mức độ ưu tiên này.
:::

+ **Bước 2**: Triển khai phương thức `filter`

Trong bộ lọc, thực hiện các bước chính sau:

1. Lọc whitelist
2. Xác thực `token`
3. Thiết lập thông tin người dùng cho request
4. Ghi lại thời gian gọi API

Mã nguồn:

```java
@Override
public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    ServerHttpRequest request = exchange.getRequest();
    ServerHttpRequest.Builder mutate = request.mutate();

    String url = request.getURI().getPath();
    // Bỏ qua các đường dẫn không cần xác thực
    if (StringUtils.matches(url, ignoreWhite.getWhites())) {
        return chain.filter(exchange);
    }
    String token = getToken(request);
    if (StringUtils.isEmpty(token)) {
        return unauthorizedResponse(exchange, "Token không được để trống");
    }
    Claims claims = JwtUtils.parseToken(token);
    if (claims == null) {
        return unauthorizedResponse(exchange, "Token đã hết hạn hoặc không hợp lệ!");
    }
    String userkey = JwtUtils.getUserKey(claims);
    boolean islogin = redisService.hasKey(getTokenKey(userkey));
    if (!islogin) {
        return unauthorizedResponse(exchange, "Phiên đăng nhập đã hết hạn");
    }
    String userid = JwtUtils.getUserId(claims);
    String username = JwtUtils.getUserName(claims);
    if (StringUtils.isEmpty(userid) || StringUtils.isEmpty(username)) {
        return unauthorizedResponse(exchange, "Xác thực token thất bại");
    }

    // Thiết lập thông tin người dùng vào request
    addHeader(mutate, SecurityConstants.USER_KEY, userkey);
    addHeader(mutate, SecurityConstants.DETAILS_USER_ID, userid);
    addHeader(mutate, SecurityConstants.DETAILS_USERNAME, username);
    // Xóa thông tin nội bộ để tránh rủi ro bảo mật
    removeHeader(mutate, SecurityConstants.FROM_SOURCE);

    // Ghi lại thời gian bắt đầu gọi API
    exchange.getAttributes().put(BEGIN_VISIT_TIME, System.currentTimeMillis());

    return chain.filter(exchange.mutate().request(mutate.build()).build());
}
```

+ **Bước 3**: Cấu hình `bootstrap.yml`

Cấu hình như sau:

```yaml
# Spring
spring: 
  application:
    # Tên ứng dụng
    name: pmhub-gateway
  profiles:
    # Cấu hình môi trường
    active: dev
```

Như vậy, bộ lọc tùy chỉnh trong gateway PmHub đã được triển khai thành công.

## Cách thống kê thời gian gọi API

Trong PmHub, để thống kê thời gian gọi API, ta thực hiện theo hướng dẫn sau:

```java
// Đầu tiên, ghi lại thời gian bắt đầu truy cập API
exchange.getAttributes().put(BEGIN_VISIT_TIME, System.currentTimeMillis());
```

Đoạn mã này có thể được sử dụng trong **CV** để tăng điểm cộng đáng kể.

Ngoài ra, bạn có thể kết hợp thống kê này với các time slice database, lưu trữ thông tin gọi API trong đó, và tùy chỉnh hiển thị thông tin thời gian.

```java
return chain.filter(exchange).then(Mono.fromRunnable(() -> {
    Long beginVisitTime = exchange.getAttribute(BEGIN_VISIT_TIME);
    if (beginVisitTime != null) {
        log.info("API Server: " + exchange.getRequest().getURI().getHost());
        log.info("API Gateway: " + exchange.getRequest().getURI().getPort());
        log.info("API URL: " + exchange.getRequest().getURI().getPath());
        log.info("API URL Parameter: " + exchange.getRequest().getURI().getRawQuery());
        log.info("API execution time: " + (System.currentTimeMillis() - beginVisitTime) + "ms");
        log.info("###################################################");
        System.out.println();
    }
}));
```

# Dự đoán câu hỏi phỏng vấn

::: warning
Tôi đã đi phỏng vấn nhiều, khi thấy những kỹ thuật này trong dự án của tôi, những câu hỏi sau đây thường được hỏi trong các buổi phỏng vấn.
:::

**1. Gateway là gì, và vai trò của nó trong kiến trúc microservices là gì?**

> Gateway trong kiến trúc microservices là một thành phần ở phía trước các dịch vụ microservices, hoạt động như cửa ngõ cho tất cả các dịch vụ. Nó chịu trách nhiệm định tuyến yêu cầu, cân bằng tải, xác thực bảo mật, kiểm soát lưu lượng, giám sát và ghi nhật ký. Gateway giúp kết hợp nhiều dịch vụ thành một API duy nhất, giúp đơn giản hóa việc giao tiếp giữa client và microservices.

**2. Đã có Nginx, tại sao cần sử dụng SpringCloud Gateway, và sự khác biệt giữa hai cái là gì?**

> Nginx chủ yếu chịu trách nhiệm cân bằng tải ở tầng transport (Layer 4) trong kiến trúc microservices, là gateway tiền xử lý. SpringCloud Gateway gần với phía dịch vụ hơn, thường đóng vai trò làm API Gateway và có thể dễ dàng tùy chỉnh logic để phù hợp với yêu cầu nghiệp vụ, được sử dụng chủ yếu cho cân bằng tải tầng application (Layer 7).
>
> Tuy nhiên, SpringCloud Gateway được viết bằng Java, hiệu suất không thể sánh với Nginx, được viết bằng C++ với khả năng xử lý cao hơn. Do đó, Nginx thường được sử dụng ở phía trước để xử lý lưu lượng lớn trước khi chuyển đến SpringCloud Gateway.
>
> Ngoài chức năng gateway, Nginx cũng thường được dùng làm máy chủ phục vụ tài nguyên tĩnh. Việc kết hợp cả hai thể hiện sự phân tách nhiệm vụ rõ ràng và phản ánh sự phát triển của kiến trúc hệ thống.

**3. Bạn đã viết Global Filter của SpringCloud Gateway như thế nào?**

> Trong dự án PmHub, tôi đã tạo một bộ lọc AuthFilter riêng trong dịch vụ Gateway, triển khai interface GlobalFilter của gateway và tự định nghĩa phương thức `filter`. Trong phương thức này, tôi đã làm các nhiệm vụ như: lọc danh sách trắng, xác thực token và thêm thông tin người dùng vào request header để sử dụng trong các dịch vụ khác. Ngoài ra, tôi còn ghi lại thời gian bắt đầu truy cập để thống kê thời gian gọi API.
>
> AuthFilter cũng triển khai interface Ordered của Spring và trả về giá trị -200 để ưu tiên lọc này được tải trước tiên trong Spring.

**4. Bạn đã thống kê thời gian gọi API như thế nào? Chi tiết thực hiện ra sao?**

> Tôi đã thêm mã để thống kê thời gian truy cập API trong bộ lọc tự định nghĩa của gateway. Sau đó, tôi kết hợp với time slice database để lưu trữ thông tin hoặc sử dụng Spring Boot Actuator và Spring Boot Admin để giám sát dịch vụ chi tiết.

**5. Trong quá trình tự định nghĩa gateway và xác thực, bạn đã gặp những thách thức nào và làm sao bạn giải quyết?**

> 1. **Thách thức về hiệu suất:**
   > Trong môi trường tải cao, logic xác thực của gateway có thể trở thành nút thắt cổ chai, gây ra độ trễ.
   > 
   > **Giải pháp:** Sử dụng cơ chế cache để giảm số lần gọi đến cơ sở dữ liệu hoặc server xác thực, lưu thông tin xác thực của người dùng trong cache trong một khoảng thời gian nhất định.
   
> 2. **Tính mở rộng:**
   > Khi hệ thống mở rộng, có thể sẽ thêm các dịch vụ và phương thức xác thực mới, điều này tạo ra thách thức cho tính mở rộng của hệ thống xác thực.
   > 
   > **Giải pháp:** Tách logic xác thực thành một dịch vụ riêng để dễ dàng mở rộng và bảo trì.
   
> 3. **Ghi nhật ký và giám sát:**
   > Cần ghi lại chi tiết hành vi xác thực của người dùng và giám sát quá trình xác thực để có thể kiểm tra khi có vấn đề xảy ra.
   > 
   > **Giải pháp:** Thêm ghi nhật ký chi tiết cho các bước quan trọng trong quá trình xác thực và triển khai hệ thống giám sát để theo dõi hiệu suất và tỷ lệ lỗi của dịch vụ xác thực theo thời gian thực.