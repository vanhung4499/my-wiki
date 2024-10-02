---
title: TransmittableThreadLocal
tags:
  - java
  - microservice
categories:
  - project
order: 4
---
# PmHub - Save user information with TransmittableThreadLocal

::: info
+ Dựa trên **TransmittableThreadLocal (TTL)** để tùy chỉnh trình chặn request header, đóng gói dữ liệu header vào biến luồng để dễ dàng truy xuất, giảm số lần truy vấn cơ sở dữ liệu về thông tin người dùng, đồng thời xác minh và tự động làm mới thời gian hiệu lực của người dùng hiện tại.
:::

# Kiến thức lý thuyết

**TransmittableThreadLocal (TTL)** là phiên bản nâng cao của ThreadLocal, vì vậy để hiểu TTL, trước tiên cần ôn lại kiến thức cơ bản về ThreadLocal.

## Giới thiệu ThreadLocal
### ThreadLocal là gì?

**ThreadLocal** là một lớp trong gói **lang** của Java, được sử dụng để giải quyết vấn đề **<font style="color:#DF2A3F;">đồng thời khi chia sẻ biến</font>** giữa nhiều luồng. Chia sẻ biến nghĩa là cùng một biến có thể được gán các giá trị khác nhau trong các luồng khác nhau.

ThreadLocal duy trì **bản sao biến riêng biệt** cho mỗi luồng trong môi trường đa luồng, cho phép mỗi luồng có bản sao dữ liệu của riêng mình, tránh xung đột khi nhiều luồng cùng truy cập vào một biến.

![20200930144753491.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200930144753491.png)

### Sự khác biệt giữa ThreadLocal và Synchronized?

**Synchronized** dựa trên cơ chế khóa, được sử dụng để kiểm soát việc truy cập vào tài nguyên chia sẻ, đảm bảo tính nhất quán và an toàn của dữ liệu giữa các luồng, bằng cách cho phép các luồng truy cập một cách tuần tự.

**Synchronized dùng thời gian để đổi lấy không gian bằng cách xếp hàng các luồng để truy cập, trong khi ThreadLocal dùng không gian để đổi lấy thời gian bằng cách cung cấp một bản sao biến cho mỗi luồng, từ đó đạt được cách ly giữa các luồng.** (Bạn có thể nói trực tiếp điều này với người phỏng vấn 👊).

### Các trường hợp sử dụng ThreadLocal

**ThreadLocal** chủ yếu được sử dụng để thực hiện việc cách ly dữ liệu giữa các luồng. Dưới đây là một số trường hợp sử dụng phổ biến:

**1. Thông tin phiên người dùng**

Trong các ứng dụng web, mỗi yêu cầu thường được xử lý trong một luồng riêng biệt. Bạn có thể sử dụng ThreadLocal để lưu trữ thông tin phiên của mỗi người dùng, tránh sự nhầm lẫn dữ liệu giữa các luồng yêu cầu khác nhau.

```java
public class UserContext {
    private static ThreadLocal<String> userHolder = ThreadLocal.withInitial(() -> null);

    public static void setUser(String user) {
        userHolder.set(user);
    }

    public static String getUser() {
        return userHolder.get();
    }

    public static void clear() {
        userHolder.remove();
    }
}

// Sử dụng trong một luồng xử lý yêu cầu
UserContext.setUser("UserA");
String currentUser = UserContext.getUser();
System.out.println("Người dùng hiện tại: " + currentUser);
UserContext.clear();
```

**2. Quản lý kết nối cơ sở dữ liệu**

Lưu trữ kết nối cơ sở dữ liệu trong luồng, để mỗi luồng có một thể hiện kết nối cơ sở dữ liệu riêng, tránh vấn đề chia sẻ kết nối và cải thiện hiệu suất.

```java
public class ConnectionManager {
    private static ThreadLocal<Connection> connectionHolder = ThreadLocal.withInitial(() -> {
        try {
            return DriverManager.getConnection("jdbc:your_database_url");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    });

    public static Connection getConnection() {
        return connectionHolder.get();
    }

    public static void closeConnection() throws SQLException {
        connectionHolder.get().close();
        connectionHolder.remove();
    }
}

// Sử dụng trong một luồng
Connection connection = ConnectionManager.getConnection();
// Thực hiện thao tác với cơ sở dữ liệu
ConnectionManager.closeConnection();
```

**3. Công cụ định dạng**

Ví dụ như `SimpleDateFormat` không an toàn khi sử dụng trong đa luồng, bạn có thể sử dụng `ThreadLocal` để cung cấp một thể hiện `SimpleDateFormat` độc lập cho mỗi luồng, tránh vấn đề an toàn luồng.

```java
public class DateFormatter {
    private static ThreadLocal<SimpleDateFormat> dateFormatHolder = ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));

    public static String format(Date date) {
        return dateFormatHolder.get().format(date);
    }
}

// Sử dụng trong một luồng
String formattedDate = DateFormatter.format(new Date());
System.out.println("Ngày định dạng: " + formattedDate);
```

**4. Truyền thông tin ngữ cảnh nhật ký**

Trong ghi nhật ký, bạn có thể sử dụng `ThreadLocal` để lưu trữ một số thông tin ngữ cảnh (như  request ID, user ID, v.v.), để có thể chia sẻ thông tin ngữ cảnh này trong các ghi nhật ký khác nhau.

```java
public class LogContext {
    private static ThreadLocal<String> requestIdHolder = ThreadLocal.withInitial(() -> null);

    public static void setRequestId(String requestId) {
        requestIdHolder.set(requestId);
    }

    public static String getRequestId() {
        return requestIdHolder.get();
    }

    public static void clear() {
        requestIdHolder.remove();
    }
}

// Sử dụng trong một luồng xử lý yêu cầu
LogContext.setRequestId("123456");
String requestId = LogContext.getRequestId();
System.out.println("Request ID: " + requestId);
LogContext.clear();
```

## Nguyên lý của ThreadLocal

### Cấu trúc nội bộ của ThreadLocal

`ThreadLocal` là một lớp generic, mục đích chính của nó là cung cấp một container để lưu trữ các biến cục bộ theo từng luồng. Mỗi luồng có một đối tượng `ThreadLocalMap`, có thể được sử dụng để lưu trữ tất cả các đối tượng `ThreadLocal` và giá trị tương ứng của chúng trong luồng đó.

Việc triển khai nội bộ của `ThreadLocal` rất đơn giản, chủ yếu là ba phương thức sau:

+ `get()`: Lấy `ThreadLocalMap` của luồng hiện tại, nếu tìm thấy giá trị tương ứng với key (hiện tại là `ThreadLocal`) thì trả về giá trị đó. Nếu `ThreadLocalMap` trống hoặc không tìm thấy giá trị, thì trả về giá trị mặc định.
+ `set(T value)`: Lấy luồng hiện tại, lấy `ThreadLocalMap` của luồng (nếu không có thì tạo một `map` mới), sau đó thiết lập `ThreadLocal` hiện tại là key và `value` là giá trị vào trong `map`.
+ `initialValue`: Giá trị khởi tạo, có thể được kế thừa, thiết lập giá trị mặc định khi khởi tạo.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240917004006.png)

### Cấu trúc cơ bản của ThreadLocalMap

Bao gồm 2 thành phần:

1. Lớp nội bộ tĩnh `ThreadLocal`.
2. Key là đối tượng `ThreadLocal` với kiểu tham chiếu yếu, mục đích là để gỡ rối mối quan hệ giữa vòng đời của đối tượng `ThreadLocal` và vòng đời của luồng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240917004109.png)


## Giới thiệu về TransmittableThreadLocal (TTL)

### TTL là gì?

TransmittableThreadLocal (TTL) là một thư viện mã nguồn mở do Alibaba phát triển, nhằm giải quyết vấn đề **không thể truyền thông tin ngữ cảnh từ luồng cha đến luồng con** khi sử dụng ThreadLocal trong Java với các khung đa luồng hoặc các công cụ như Executors, ForkJoinPool, v.v. TTL mở rộng InheritableThreadLocal để cho phép truyền thông tin ngữ cảnh qua các luồng trong pool.

> Địa chỉ mã nguồn mở của TTL: [https://github.com/alibaba/transmittable-thread-local](https://github.com/alibaba/transmittable-thread-local)

Toàn bộ thư viện TransmittableThreadLocal có chức năng cốt lõi rất nhỏ gọn (~1000 dòng mã), bao gồm API người dùng, wrapper cho ExecutorService/ForkJoinPool/TimerTask và các API tích hợp cho framework/middleware. 👍

### Nguyên lý hoạt động của TTL

Trong lập trình đa luồng Java, ThreadLocal thường được dùng để lưu trữ biến cục bộ của luồng. Tuy nhiên, khi sử dụng thread pool, các luồng có thể được tái sử dụng, dẫn đến việc các biến ThreadLocal không được truyền đúng cách giữa các luồng cha và con, gây ra mất dữ liệu hoặc không nhất quán dữ liệu. Mặc dù InheritableThreadLocal có thể truyền biến của luồng cha cho luồng con, nhưng vẫn không giải quyết được vấn đề tái sử dụng luồng trong môi trường thread pool.

Nguyên lý hoạt động chính của TTL bao gồm ba bước:

+ **Sao chép ngữ cảnh**: Khi nhiệm vụ được nộp, TTL sẽ sao chép ngữ cảnh của luồng hiện tại vào nhiệm vụ.
+ **Thiết lập ngữ cảnh trước khi thực hiện nhiệm vụ**: Trước khi nhiệm vụ được thực hiện, TTL sẽ thiết lập ngữ cảnh đã sao chép vào luồng hiện tại.
+ **Dọn dẹp ngữ cảnh sau khi thực hiện nhiệm vụ**: Sau khi nhiệm vụ hoàn tất, TTL sẽ dọn dẹp ngữ cảnh trong luồng để tránh rò rỉ bộ nhớ.

Dưới đây là hình minh họa rõ ràng về nguyên lý hoạt động của TTL:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240917004325.png)

### Các trường hợp sử dụng chính của TTL

Các tình huống cần sử dụng ThreadLocal chính là các tình huống tiềm năng cần TransmittableThreadLocal, nếu công việc của bạn yêu cầu “truyền giá trị ThreadLocal khi sử dụng các thành phần thực thi có thể tái sử dụng luồng như thread pool”, thì đó là mục tiêu của TransmittableThreadLocal.

+ **Theo dõi phân tán**: Truyền ID theo dõi trong hệ thống phân tán để dễ dàng liên kết log và xử lý sự cố.
+ **Quản lý giao dịch**: Truyền ngữ cảnh giao dịch trong các giao dịch phân tán để đảm bảo tính nhất quán của giao dịch.
+ **Truyền thông tin ngữ cảnh**: Truyền thông tin về phiên người dùng, ngữ cảnh yêu cầu, v.v., trong môi trường đa luồng.

##  Ưu điểm của TTL so với ThreadLocal

Dưới đây là so sánh ưu điểm giữa TTL (TransmittableThreadLocal) và ThreadLocal:

| Đặc điểm                      | ThreadLocal                                                                             | TTL (TransmittableThreadLocal)                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Truyền thông tin ngữ cảnh** | Chỉ lưu trữ trong luồng hiện tại, không thể truyền qua luồng khác                       | Có thể truyền thông tin ngữ cảnh trong các khung đa luồng và các công cụ quản lý luồng                |
| **Hỗ trợ tái sử dụng luồng**  | Khi luồng được tái sử dụng trong thread pool, không đảm bảo tính nhất quán của biến      | Hỗ trợ tái sử dụng luồng, đảm bảo rằng biến được truyền và giữ nhất quán giữa các tác vụ              |
| **Không xâm lấn**             | Cần quản lý việc thiết lập và xóa biến thủ công, dễ xảy ra lỗi                          | Thay thế ThreadLocal là có thể tự động quản lý việc truyền và xóa ngữ cảnh                            |
| **Dễ tích hợp**               | Phù hợp với môi trường luồng đơn giản                                                   | Có thể tích hợp liền mạch với nhiều loại thread pool và khung đa luồng                                 |
| **Tình huống sử dụng**        | Phù hợp với môi trường đơn luồng hoặc không cần truyền thông tin ngữ cảnh qua các luồng | Phù hợp với môi trường đa luồng phức tạp, đặc biệt là khi cần truyền thông tin ngữ cảnh qua các luồng |

Những lợi thế này khiến TTL trở nên thực tiễn hơn trong các môi trường đa luồng phức tạp, đặc biệt là trong các tình huống cần truyền thông tin ngữ cảnh qua các luồng, chẳng hạn như ID theo dõi trong hệ thống phân tán, thông tin phiên người dùng, v.v.

## Thực Hành Dự Án

Đã nói nhiều về lý thuyết cơ bản, hy vọng các bạn có thể hiểu rõ, tiếp theo chúng ta sẽ đi vào phần thực hành, trong PmHub, làm thế nào để sử dụng TransmittableThreadLocal (TTL) để lưu trữ dữ liệu người dùng và truyền giữa các luồng.

::: info
Tình huống yêu cầu:

Trong kiến trúc vi dịch vụ, tôi muốn lưu trữ thông tin người dùng sau khi đăng nhập vào biến ngữ cảnh và truyền qua các luồng.

:::

@startuml

autonumber

actor "User" as User
participant "Browser" as Browser #red
participant "Nginx Server" as Nginx #orange
participant "Gateway" as Gateway #green
participant "Header Interceptor" as HeaderInterceptor
participant "Auth Center" as Auth
participant "User Service" as UserService
participant "Project Service" as ProjectService

group User Login
activate User

User -> Browser: Enter URL to log in to PmHub
activate Browser

Browser -> Nginx: Request to server
note right of Nginx: Load balancing
activate Nginx

Nginx -> Gateway: Forward request to Gateway
note right of Gateway: Gateway forwards service request
activate Gateway

Gateway -> Auth: User login request
activate Auth

Auth -> UserService: Query user information
activate UserService

UserService -> Auth: Return user information
deactivate UserService

Auth -> Browser: Return login status and token
deactivate Auth

Browser --> User: Redirect to homepage after successful login
deactivate Browser

end group

group Access After Login

User -> Browser: Access PmHub
activate Browser

Browser -> Nginx: Request to server
note right of Nginx: Load balancing

Nginx -> Gateway: Forward request to Gateway
Gateway -> Gateway: AuthFilter for gateway authentication
Gateway -> Gateway: AuthFilter for interface time statistics
Gateway -> Gateway: AuthFilter sets user information to request header
note right of Gateway: Gateway forwards service request

Gateway -> HeaderInterceptor: Enter custom request header interceptor
activate HeaderInterceptor
HeaderInterceptor -> HeaderInterceptor: Store user information from request header\n<font color="red">in TTL</font>

HeaderInterceptor -> ProjectService: Request to project service
activate ProjectService
ProjectService -> ProjectService: Project service accesses\nuser information directly from <font color="red">context TTL</font>
ProjectService -> ProjectService: Project service queries\ncurrent user's project information
HeaderInterceptor -> HeaderInterceptor: Clean up user information in <font color="red">TTL</font>
ProjectService -> Browser: Return user's project information
deactivate HeaderInterceptor
deactivate ProjectService

Browser --> User: Display user's project information page
deactivate User
deactivate Browser
deactivate Nginx
deactivate Gateway

end group

@enduml

Sau khi người dùng đăng nhập, hệ thống sẽ trả về một token. Các yêu cầu sau đó sẽ mang theo token này, và token chứa thông tin của người dùng. Tất cả các yêu cầu sẽ đi qua bộ lọc AuthFilter của gateway đầu tiên. Trong bộ lọc, thông tin người dùng sẽ được đưa vào header của yêu cầu. Sau khi yêu cầu đi qua gateway, nó sẽ đến bộ lọc header tùy chỉnh HeaderInterceptor. Trong bộ lọc này, thông tin người dùng từ header sẽ được đưa vào TTL, vì vậy các dịch vụ trên chuỗi có thể trực tiếp lấy thông tin người dùng từ TTL.

Trên đây là quy trình thực hiện. Bạn cần phải tự làm quen với nó, nắm rõ và có thể giải thích được thì mới coi là đã hiểu. Dưới đây là mã nguồn thực tế:

**AuthFilter:**

```java
/**
 * Gateway Authentication Filter
 */
@Component
public class AuthFilter implements GlobalFilter, Ordered {
    private static final Logger log = LoggerFactory.getLogger(AuthFilter.class);

    private static final String BEGIN_VISIT_TIME = "begin_visit_time"; // Start visit time

    // URIs to be excluded from filtering, add in nacos
    @Autowired
    private IgnoreWhiteProperties ignoreWhite;

    @Autowired
    private RedisService redisService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpRequest.Builder mutate = request.mutate();

        String url = request.getURI().getPath();
        // Skip paths that do not require validation
        if (StringUtils.matches(url, ignoreWhite.getWhites())) {
            return chain.filter(exchange);
        }
        String token = getToken(request);
        if (StringUtils.isEmpty(token)) {
            return unauthorizedResponse(exchange, "Token cannot be empty");
        }
        Claims claims = JwtUtils.parseToken(token);
        if (claims == null) {
            return unauthorizedResponse(exchange, "Token is expired or invalid!");
        }
        String userkey = JwtUtils.getUserKey(claims);
        boolean islogin = redisService.hasKey(getTokenKey(userkey));
        if (!islogin) {
            return unauthorizedResponse(exchange, "Login status has expired");
        }
        String userid = JwtUtils.getUserId(claims);
        String username = JwtUtils.getUserName(claims);
        if (StringUtils.isEmpty(userid) || StringUtils.isEmpty(username)) {
            return unauthorizedResponse(exchange, "Token validation failed");
        }

        // Set user information to the request
        addHeader(mutate, SecurityConstants.USER_KEY, userkey);
        addHeader(mutate, SecurityConstants.DETAILS_USER_ID, userid);
        addHeader(mutate, SecurityConstants.DETAILS_USERNAME, username);
        // Clear internal request source parameters (to prevent security risks)
        removeHeader(mutate, SecurityConstants.FROM_SOURCE);

        // Record the start time of the request
        exchange.getAttributes().put(BEGIN_VISIT_TIME, System.currentTimeMillis());

        return chain.filter(exchange.mutate().request(mutate.build()).build());
    }

    private void addHeader(ServerHttpRequest.Builder mutate, String name, Object value) {
        if (value == null) {
            return;
        }
        String valueStr = value.toString();
        String valueEncode = ServletUtils.urlEncode(valueStr);
        mutate.header(name, valueEncode);
    }

    private void removeHeader(ServerHttpRequest.Builder mutate, String name) {
        mutate.headers(httpHeaders -> httpHeaders.remove(name)).build();
    }

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String msg) {
        log.error("[Authentication Error Handling] Request Path: {}", exchange.getRequest().getPath());
        return ServletUtils.webFluxResponseWriter(exchange.getResponse(), msg, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Get cache key
     */
    private String getTokenKey(String token) {
        return CacheConstants.LOGIN_TOKEN_KEY + token;
    }

    /**
     * Get token from request
     */
    private String getToken(ServerHttpRequest request) {
        String token = request.getHeaders().getFirst(TokenConstants.AUTHENTICATION);
        // If a token prefix is set, remove it
        if (StringUtils.isNotEmpty(token) && token.startsWith(TokenConstants.PREFIX)) {
            token = token.replaceFirst(TokenConstants.PREFIX, StringUtils.EMPTY);
        }
        return token;
    }

    @Override
    public int getOrder() {
        return -200;
    }
}
```

**HeaderInterceptor:**

```java
/**
 * Custom header interceptor to encapsulate Header data into thread variables for easy access
 * Note: This interceptor will also validate and automatically refresh the current user's validity period
 * 
 * @author canghe
 */
public class HeaderInterceptor implements AsyncHandlerInterceptor {

    // Set of paths that do not require login
    private static final Set<String> EXEMPTED_PATHS = new HashSet<>();

    static {
        // Add paths that do not require login here
        EXEMPTED_PATHS.add("/system/user/getInfo");
        EXEMPTED_PATHS.add("/project/statistics");
        EXEMPTED_PATHS.add("/project/doing");
        EXEMPTED_PATHS.add("/project/queryMyTaskList");
        EXEMPTED_PATHS.add("/project/select");
        EXEMPTED_PATHS.add("/system/menu/getRouters");
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        SecurityContextHolder.setUserId(ServletUtils.getHeader(request, SecurityConstants.DETAILS_USER_ID));
        SecurityContextHolder.setUserName(ServletUtils.getHeader(request, SecurityConstants.DETAILS_USERNAME));
        SecurityContextHolder.setUserKey(ServletUtils.getHeader(request, SecurityConstants.USER_KEY));

        String token = SecurityUtils.getToken();
        if (StringUtils.isNotEmpty(token)) {
            LoginUser loginUser = AuthUtil.getLoginUser(token);
            if (StringUtils.isNotNull(loginUser)) {
                AuthUtil.verifyLoginUserExpire(loginUser);
                SecurityContextHolder.set(SecurityConstants.LOGIN_USER, loginUser);
            }
        } else {
            // Display for non-login scenario
            // Check if the request path matches specific paths
            String requestURI = request.getRequestURI();
            if (isExemptedPath(requestURI)) {
                // Create a default LoginUser object
                LoginUser defaultLoginUser = createDefaultLoginUser();
                SecurityContextHolder.set(SecurityConstants.LOGIN_USER, defaultLoginUser);
            }
        }
        return true;
    }

    // Determine if the request path matches specific paths
    private boolean isExemptedPath(String requestURI) {
        // Adjust the path matching logic as needed
        return EXEMPTED_PATHS.stream().anyMatch(requestURI::startsWith);
    }

    // Create a default LoginUser object
    private LoginUser createDefaultLoginUser() {
        LoginUser defaultLoginUser = new LoginUser();
        defaultLoginUser.setUserId(173L);  // Set default user ID
        defaultLoginUser.setUsername(Constants.DEMO_ACCOUNT);  // Set default username

        SysUser demoSysUser = new SysUser();
        demoSysUser.setUserId(173L);
        demoSysUser.setUserName(Constants.DEMO_ACCOUNT);
        demoSysUser.setDeptId(100L);
        demoSysUser.setStatus("0");

        defaultLoginUser.setUser(demoSysUser);
        // Set other necessary default properties
        return defaultLoginUser;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        SecurityContextHolder.remove();
    }
}
```

# Các câu hỏi phỏng vấn dự đoán

:::  info
Dưới đây là các câu hỏi phỏng vấn có thể gây khó khăn mà bạn có thể gặp phải.
:::

### Các câu hỏi đào sâu:

1. **TransmittableThreadLocal (TTL) là gì và mục đích chính của nó là gì?**
2. **TTL có những ưu điểm gì so với ThreadLocal tiêu chuẩn?**
3. **Trong dự án của bạn, TTL đã giải quyết những vấn đề cụ thể nào?**
4. **TTL duy trì thông tin ngữ cảnh như thế nào trong môi trường thread pool?**
5. **Bạn đã gặp phải những vấn đề gì khi sử dụng TTL? Bạn đã giải quyết chúng như thế nào?**
6. **TTL có ảnh hưởng đến hiệu suất không? Nếu có, bạn đã tối ưu hóa hiệu suất như thế nào?**
7. **Bạn có cân nhắc các giải pháp khác không? Tại sao bạn chọn TTL?**
8. **Làm thế nào để triển khai TTL để lưu trữ dữ liệu người dùng? Hãy mô tả chi tiết các bước thực hiện.**
9. **TTL xử lý tình huống đồng thời như thế nào? Bạn đã gặp vấn đề về an toàn luồng chưa?**
10. **Nguyên nhân thực sự của rò rỉ bộ nhớ với ThreadLocal là gì?**
11. **Sự khác biệt giữa rò rỉ bộ nhớ và tràn bộ nhớ là gì?**
12. **ThreadLocalMap giải quyết xung đột như thế nào?**

### Ví dụ về đối thoại:

**Nhà tuyển dụng:** Chào mừng bạn đến phỏng vấn. Hãy giới thiệu ngắn gọn về bối cảnh và trách nhiệm chính khi sử dụng TransmittableThreadLocal (TTL) để lưu trữ dữ liệu người dùng trong dự án của bạn.

**Ứng viên:** Tại PmHub, vì cần phải truyền thông tin ngữ cảnh người dùng giữa các hệ thống vi dịch vụ, chúng tôi đã chọn sử dụng TTL để thực hiện chức năng này. Tôi chủ yếu phụ trách việc đưa TTL vào sử dụng và triển khai cụ thể, bao gồm việc truyền thông tin ngữ cảnh và lưu trữ dữ liệu người dùng.

**Nhà tuyển dụng:** Bạn có thể giải thích chi tiết TTL là gì không? Nó khác gì so với ThreadLocal tiêu chuẩn?

**Ứng viên:** TTL là phiên bản nâng cao của ThreadLocal, chủ yếu được thiết kế để giải quyết vấn đề không thể truyền thông tin ngữ cảnh giữa các luồng cha và con trong các khung đa luồng như thread pool. Khác với ThreadLocal tiêu chuẩn, TTL cho phép các luồng con kế thừa các biến ThreadLocal từ luồng cha.

**Nhà tuyển dụng:** Bạn đã đề cập đến ThreadLocal. Bạn có thể mô tả cấu trúc nội bộ của nó không?

**Ứng viên:** Trong ThreadLocal, mỗi luồng duy trì một ThreadLocalMap. Map này được quản lý bởi ThreadLocal, với các khóa là các đối tượng ThreadLocal và các giá trị là các bản sao biến. Map chủ yếu cung cấp các phương thức `set` và `get`.

**Nhà tuyển dụng:** Bạn có hiểu cấu trúc cơ bản của ThreadLocalMap không?

**Ứng viên:** ThreadLocalMap là lớp nội bộ tĩnh của ThreadLocal, với các khóa là tham chiếu yếu đến các đối tượng ThreadLocal. Thiết kế này nhằm tách biệt vòng đời của các đối tượng ThreadLocal khỏi vòng đời của các luồng.

**Nhà tuyển dụng:** Bạn đã nói rằng các khóa trong ThreadLocalMap sử dụng tham chiếu yếu. Điều này có thể gây ra vấn đề gì?

**Ứng viên:** Việc sử dụng tham chiếu yếu cho các khóa trong ThreadLocalMap có thể dẫn đến rò rỉ bộ nhớ.

**Nhà tuyển dụng:** Rò rỉ bộ nhớ là gì? Nó khác gì so với tràn bộ nhớ?

**Ứng viên:** Rò rỉ bộ nhớ xảy ra khi các đối tượng không còn sử dụng được không thể được GC thu hồi và tiếp tục chiếm bộ nhớ, dẫn đến lãng phí không gian và cuối cùng có thể gây ra tràn bộ nhớ. Tràn bộ nhớ xảy ra khi chương trình yêu cầu bộ nhớ mà không còn đủ không gian, dẫn đến lỗi `OutOfMemoryError`.

**Nhà tuyển dụng:** OK, bạn có biết nguyên nhân thực sự của việc rò rỉ bộ nhớ với ThreadLocal là gì không?

**Ứng viên:** Thứ nhất, nếu không xóa các đối tượng Entry thủ công, bạn có thể gọi phương thức `remove` của ThreadLocal sau khi sử dụng để xóa Entry tương ứng và tránh rò rỉ bộ nhớ. Thứ hai, việc sử dụng ThreadLocal cần được dọn dẹp khi luồng kết thúc.

Nguyên nhân gốc rễ là vòng đời của ThreadLocalMap và luồng là như nhau.

**Nhà tuyển dụng:** OK, bạn có biết ThreadLocalMap giải quyết xung đột hash như thế nào không?

**Ứng viên:** Nếu có xung đột hash, chỉ số trong mảng sẽ được tăng lên 1. Nếu xung đột vẫn còn, tính toán tiếp cho đến khi vượt quá chỉ số mảng, lúc này sẽ quay lại bắt đầu, tương tự như một mảng vòng tròn.

**Nhà tuyển dụng:** Bạn có thể mô tả chi tiết các bước triển khai TTL để lưu trữ dữ liệu người dùng không?

**Ứng viên:** Sau khi người dùng đăng nhập, một mã thông báo sẽ được trả về và các yêu cầu sau đó sẽ mang theo mã thông báo này. Mã thông báo chứa thông tin người dùng. Tất cả các yêu cầu đầu tiên đi qua bộ lọc AuthFilter của gateway, trong bộ lọc này, thông tin người dùng được đặt vào tiêu đề yêu cầu. Sau khi đi qua gateway, các yêu cầu đến bộ lọc tiêu đề HeaderInterceptor tùy chỉnh, nơi thông tin người dùng từ tiêu đề yêu cầu được đưa vào TTL. Như vậy, các dịch vụ trên chuỗi có thể trực tiếp lấy thông tin người dùng từ TTL.

**Nhà tuyển dụng:** TTL có ảnh hưởng đến hiệu suất không? Bạn đã tối ưu hóa hiệu suất như thế nào?

**Ứng viên:** Việc sử dụng TTL thực sự có một số chi phí hiệu suất, đặc biệt trong các kịch bản tạo và hủy luồng thường xuyên. Để tối ưu hóa hiệu suất, chúng tôi đã giảm thiểu số lần tạo và hủy luồng và theo dõi việc sử dụng TTL để đảm bảo không gây ra rò rỉ bộ nhớ hoặc tắc nghẽn hiệu suất.

**Nhà tuyển dụng:** Trong dự án của bạn, bạn đã gặp phải vấn đề rò rỉ bộ nhớ do TTL gây ra chưa? Nếu có, bạn đã giải quyết như thế nào?

**Ứng viên:** Có, chúng tôi đã gặp phải một vấn đề rò rỉ bộ nhớ do sử dụng TTL không đúng cách. Nguyên nhân là một số luồng chạy lâu dài không dọn dẹp các biến ThreadLocal mà chúng giữ. Để giải quyết vấn đề này, chúng tôi đã đảm bảo dọn dẹp các biến ThreadLocal liên quan sau mỗi yêu cầu trong phương thức `afterCompletion` của HeaderInterceptor. Chúng tôi cũng thêm cơ chế kiểm tra và dọn dẹp định kỳ để ngăn ngừa rò rỉ bộ nhớ.

**Nhà tuyển dụng:** Khi sử dụng TTL, bạn đã gặp phải vấn đề đồng thời chưa? Nếu có, bạn đã xử lý như thế nào?

**Ứng viên:** Khi sử dụng TTL, vì mỗi luồng có một thể hiện biến ThreadLocal riêng biệt, nên vấn đề đồng thời thường không xảy ra. Tuy nhiên, chúng tôi đã gặp phải tình trạng giá trị TTL bị sửa đổi sai trong các tình huống đồng thời cao. Để giải quyết vấn đề này, chúng tôi đã thêm cơ chế đồng bộ hóa trong các đoạn mã quan trọng và sử dụng các tập hợp an toàn luồng để lưu trữ dữ liệu chia sẻ, nhằm tránh việc sửa đổi đồng thời.

**Nhà tuyển dụng:** Bạn có thể nêu một số ví dụ cụ thể về các tình huống sử dụng TTL trong dự án của bạn không?

**Ứng viên:** Tất nhiên. Trong dự án của chúng tôi, có một tình huống là ghi lại nhật ký hoạt động sau khi người dùng đăng nhập. Bằng cách sử dụng TTL, chúng tôi có thể lấy thông tin chi tiết của người dùng khi ghi nhật ký đồng thời, đảm bảo tính chính xác của nhật ký. Một ví dụ khác là quản lý giao dịch phân tán, thông qua TTL để truyền bối cảnh giao dịch, đảm bảo tính nhất quán của giao dịch giữa các dịch vụ. Thêm vào đó, trong một số tình huống cần truyền dữ liệu qua các luồng, như xác thực người dùng trong các tác vụ bất đồng bộ, chúng tôi cũng sử dụng TTL để truyền và lưu trữ dữ liệu người dùng.