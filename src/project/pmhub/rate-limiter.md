---
title: Rate Limiter
tags:
  - java
  - microservice
categories:
  - project
order: 8
---
# PmHub - Rate Limiter By Redis + Lua

Bài viết này chủ yếu nói về cách triển khai rate limiter dựa trên thuật toán đếm (counter) thông qua Redis và Lua script trong PmHub. Đầu tiên sẽ giới thiệu một số kiến thức cơ bản về giới hạn tốc độ và Redis, sau đó sẽ có dự án thực chiến cụ thể, kèm theo các câu hỏi phỏng vấn để bạn có thể nhanh chóng nắm vững.

::: info
+ Thông qua việc kết hợp Redis và Lua script, đã triển khai thành công phương pháp **rate limiter** dựa trên thuật toán bộ đếm.
:::

## Tầm quan trọng của rate limiter

Để bảo vệ các dịch vụ có lưu lượng truy cập cao và đảm bảo tính ổn định, có ba phương pháp chính: **bộ nhớ đệm (cache), hạ cấp (degrade) và giới hạn tốc độ (rate limiter)**.

+ **Bộ nhớ đệm**: Bộ nhớ đệm là một kỹ thuật cải thiện hiệu suất đọc dữ liệu. Bằng cách lưu trữ dữ liệu thường xuyên truy cập trong bộ nhớ, có thể giảm số lượng truy vấn tới cơ sở dữ liệu hoặc các hệ thống lưu trữ khác, từ đó tăng tốc độ phản hồi của hệ thống. Bộ nhớ đệm có thể được áp dụng trên nhiều lớp, chẳng hạn như bộ nhớ đệm trình duyệt, bộ nhớ đệm CDN, bộ nhớ đệm proxy ngược và bộ nhớ đệm ứng dụng.

+ **Hạ cấp**: Khi hệ thống chịu áp lực quá lớn hoặc một số dịch vụ không khả dụng, hạ cấp có thể tạm thời tắt một số dịch vụ không quan trọng để đảm bảo các dịch vụ cốt lõi vẫn hoạt động bình thường. Hạ cấp có thể được thực hiện ở nhiều lớp, chẳng hạn như hạ cấp trang, chức năng hoặc dịch vụ.

+ **Giới hạn tốc độ**: Giới hạn tốc độ là một kỹ thuật kiểm soát tốc độ xử lý yêu cầu của hệ thống để ngăn ngừa tình trạng quá tải. Có thể triển khai rate limiter bằng nhiều thuật toán khác nhau, như thuật toán Token Bucket hoặc thuật toán Leaky Bucket.

Ba phương pháp này có đặc điểm riêng, thường được kết hợp sử dụng để đạt hiệu quả tối ưu. Ví dụ, có thể sử dụng bộ nhớ đệm để giảm tải cơ sở dữ liệu, hạ cấp để ứng phó với lỗi hệ thống và giới hạn tốc độ để ngăn chặn quá tải. Khi thiết kế hệ thống có tải cao, cần sử dụng các kỹ thuật này một cách hợp lý dựa trên nhu cầu cụ thể của hệ thống. Bây giờ, chúng ta sẽ tập trung vào giới hạn tốc độ.

**Hãy tưởng tượng bạn mở một nhà hàng rất nổi tiếng, mỗi ngày có rất nhiều khách đến ăn, nhưng số lượng chỗ ngồi và nhân viên phục vụ có hạn. Để đảm bảo mọi khách hàng đều được phục vụ tốt, bạn cần kiểm soát số lượng người dùng đang ăn trong nhà hàng cùng một lúc. Đây chính là giới hạn tốc độ.**

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240918113131.png)

**Rate Limiter** là một kỹ thuật nhằm hạn chế số lượng yêu cầu mà một hệ thống hoặc dịch vụ có thể xử lý trong một khoảng thời gian nhất định, để đảm bảo hệ thống vẫn hoạt động bình thường và không bị quá tải.

Trong giới hạn tốc độ, có 2 khái niệm cần hiểu:

1. **Ngưỡng (Threshold)**:  
	Ngưỡng là số lượng yêu cầu tối đa được cho phép trong một khoảng thời gian. Ví dụ: nếu giới hạn số lượng yêu cầu mỗi giây (QPS) là 500, điều này có nghĩa là hệ thống chỉ có thể xử lý tối đa 500 yêu cầu trong 1 giây. Bằng cách đặt ngưỡng này, có thể kiểm soát tải trọng hệ thống và ngăn ngừa các sự cố do xử lý quá nhiều yêu cầu.
   
2. **Chiến lược từ chối**:  
	Chiến lược từ chối là cách hệ thống xử lý các yêu cầu vượt quá ngưỡng đã đặt. Các chiến lược từ chối phổ biến bao gồm:
   - **Từ chối trực tiếp**: Hệ thống sẽ từ chối ngay lập tức các yêu cầu vượt quá ngưỡng mà không xử lý.
   - **Xếp hàng chờ**: Đưa các yêu cầu vượt quá ngưỡng vào hàng đợi và xử lý theo một quy tắc nhất định.

Bằng cách chọn chiến lược từ chối phù hợp, có thể đảm bảo sự ổn định của hệ thống trong khi giảm thiểu tác động đến trải nghiệm người dùng.

Giả sử nhà hàng của bạn có 10 bàn, mỗi bàn có thể chứa 4 người. Ngưỡng bạn đặt ra là tối đa 40 khách hàng mỗi giờ (tức là tổng số ghế của 10 bàn). Nếu vượt quá số lượng này, bạn có hai cách xử lý:

+ **Từ chối trực tiếp**: Thông báo cho khách hàng biết hiện không thể phục vụ và yêu cầu họ quay lại sau.
+ **Xếp hàng chờ**: Yêu cầu khách hàng đợi bên ngoài nhà hàng và sẽ cho vào khi có bàn trống.

Thông qua cách này, bạn có thể đảm bảo mọi khách hàng đều nhận được dịch vụ tốt mà không ảnh hưởng đến chất lượng dịch vụ do quá tải.

Giới hạn tốc độ là một phương pháp kỹ thuật quan trọng để kiểm soát số lượng yêu cầu xử lý, đảm bảo hệ thống vẫn ổn định trong điều kiện tải cao. Dựa trên nhu cầu cụ thể, giới hạn tốc độ có thể được chia thành giới hạn tốc độ đơn lẻ và phân tán. Các thuật toán khác nhau (như fixed window, sliding window, leaky bucket, counter và token bucket) có thể được áp dụng vào các trường hợp khác nhau của giới hạn tốc độ.

![pmhub-rate-limiter.drawio.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/pmhub-rate-limiter.drawio.png)

Hiện tại có hai phương án giới hạn tốc độ phổ biến:

+ **Giới hạn tốc độ ở lớp cổng (Gateway)**. Áp dụng các quy tắc giới hạn tốc độ cho tất cả lưu lượng tại điểm đầu vào.
+ **Giới hạn tốc độ ở lớp trung gian**. Lưu thông tin giới hạn tốc độ trong một môi trường phân tán, chẳng hạn như Redis. Mỗi thành phần có thể lấy số liệu thống kê về lưu lượng tại thời điểm hiện tại từ đây để quyết định có chấp nhận hay từ chối yêu cầu.

Trong hệ thống tổng thể, chúng tôi áp dụng phương pháp giới hạn tốc độ bằng Gateway kết hợp với Sentinel. Tuy nhiên, do tính chất đặc biệt của api đăng nhập, nơi nó có thể bỏ qua logic xác thực của cổng và dễ bị tấn công, chúng tôi đã thêm một phương pháp giới hạn tốc độ tùy chỉnh bằng Redis+Lua cho api đăng nhập.

## Thuật toán giới hạn tốc độ phổ biến

Dưới đây là bảng so sánh các thuật toán giới hạn tốc độ phổ biến:

| Thuật toán                                   | Nguyên lý                                                                                                   | Ưu điểm                                                                                      | Nhược điểm                                |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Thuật toán đếm (Counter)                     | Đếm số lượng yêu cầu trong một cửa sổ thời gian cố định, nếu vượt ngưỡng thì từ chối yêu cầu                | Dễ thực hiện, phù hợp với kiểm soát lưu lượng trong cửa sổ thời gian cố định                 | Không xử lý được lưu lượng đột ngột       |
| Thuật toán đếm cửa sổ trượt (Sliding Window) | Chia cửa sổ thời gian cố định thành nhiều cửa sổ nhỏ, đếm tổng số yêu cầu thông qua các cửa sổ trượt        | Xử lý lưu lượng mượt mà hơn, hiệu quả hơn so với cửa sổ cố định                              | Độ phức tạp cao                           |
| Thuật toán xô rò rỉ (Leaky Bucket)           | Yêu cầu đi vào xô, xô rò rỉ với tốc độ cố định, yêu cầu mới sẽ bị loại bỏ nếu xô đầy                        | Xử lý lưu lượng đột ngột mượt mà, kiểm soát chặt chẽ tốc độ xử lý yêu cầu                    | Có thể làm tăng độ trễ yêu cầu            |
| Thuật toán xô token (Token Bucket)           | Hệ thống tạo token với tốc độ cố định, yêu cầu tiêu tốn token, nếu không có token thì từ chối hoặc xếp hàng | Cho phép xử lý lưu lượng đột ngột, có thể kiểm soát tốc độ xử lý trong dài hạn               | Thực hiện phức tạp hơn, cần quản lý token |
| Kết hợp xô rò rỉ và xô token                 | Kết hợp cả hai để kiểm soát tốc độ trung bình và xử lý lưu lượng đột ngột                                   | Tận dụng ưu điểm của cả hai, vừa xử lý lưu lượng mượt mà vừa đáp ứng được lưu lượng đột ngột | Độ phức tạp cao                           |

### **Thuật toán đếm**

Cách thực hiện: Kiểm soát số lượng yêu cầu trong một đơn vị thời gian. Đoạn mã Java như sau:

```java
import java.util.concurrent.atomic.AtomicInteger;

public class Counter {
    private final int limit = 10; // Giới hạn số lượng yêu cầu tối đa
    private final long timeout = 1000; // Đơn vị thời gian (ms)
    private long time;
    private AtomicInteger reqCount = new AtomicInteger(0);

    public boolean limit() {
        long now = System.currentTimeMillis();
        if (now < time + timeout) {
            reqCount.addAndGet(1);
            return reqCount.get() <= limit;
        } else {
            time = now;
            reqCount = new AtomicInteger(0);
            return true;
        }
    }
}
```

### **Thuật toán cửa sổ trượt**

Cách thực hiện: Cửa sổ trượt là cải tiến của thuật toán đếm, thêm vào một đơn vị đo độ mịn thời gian, chia nhỏ một phút thành nhiều phần (6 phần, mỗi phần 10 giây). Dưới đây là đoạn mã Java để thực hiện:

```java
package com.example.demo1.service;

import java.util.Iterator;
import java.util.Random;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.stream.IntStream;

public class TimeWindow {
    private ConcurrentLinkedQueue<Long> queue = new ConcurrentLinkedQueue<Long>(); // Hàng đợi để lưu thời gian yêu cầu

    private int seconds; // Khoảng thời gian (giây)
    private int max; // Giới hạn tối đa yêu cầu

    public TimeWindow(int max, int seconds) {
        this.seconds = seconds;
        this.max = max;

        // Luồng vĩnh viễn để dọn dẹp các yêu cầu cũ
        new Thread(() -> {
            while (true) {
                try {
                    Thread.sleep((seconds - 1) * 1000L);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                clean();
            }
        }).start();
    }

    public static void main(String[] args) throws Exception {
        final TimeWindow timeWindow = new TimeWindow(10, 1); // Giới hạn 10 yêu cầu trong 1 giây

        // Tạo 3 luồng để kiểm tra
        IntStream.range(0, 3).forEach((i) -> {
            new Thread(() -> {
                while (true) {
                    try {
                        Thread.sleep(new Random().nextInt(20) * 100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    timeWindow.take();
                }
            }).start();
        });
    }

    // Lấy token và thêm thời gian vào hàng đợi
    public void take() {
        long start = System.currentTimeMillis();
        try {
            int size = sizeOfValid();
            if (size > max) {
                System.err.println("Quá giới hạn");
            }
            synchronized (queue) {
                if (sizeOfValid() > max) {
                    System.err.println("Quá giới hạn, queue có " + queue.size() + " yêu cầu, tối đa là " + max);
                }
                this.queue.offer(System.currentTimeMillis());
            }
            System.out.println("Queue có " + queue.size() + " yêu cầu, tối đa là " + max);
        }
    }

    // Tính số lượng yêu cầu hợp lệ trong thời gian giới hạn
    public int sizeOfValid() {
        Iterator<Long> it = queue.iterator();
        Long ms = System.currentTimeMillis() - seconds * 1000;
        int count = 0;
        while (it.hasNext()) {
            long t = it.next();
            if (t > ms) {
                count++;
            }
        }
        return count;
    }

    // Dọn dẹp các yêu cầu đã quá thời gian giới hạn
    public void clean() {
        Long c = System.currentTimeMillis() - seconds * 1000;
        Long tl;
        while ((tl = queue.peek()) != null && tl < c) {
            System.out.println("Dọn dẹp dữ liệu");
            queue.poll();
        }
    }
}
```

+ **Thuật toán xô rò rỉ (Leaky Bucket)**

Cách thực hiện: Đặt một xô với dung lượng cố định, có nước chảy vào và chảy ra. Lượng nước chảy vào không đoán trước được, nhưng chúng ta có thể kiểm soát tốc độ chảy ra.

```java
public class LeakBucket {
    /**
     * Thời gian
     */
    private long time;
    /**
     * Tổng dung lượng
     */
    private Double total;
    /**
     * Tốc độ nước chảy ra
     */
    private Double rate;
    /**
     * Dung lượng hiện tại
     */
    private Double nowSize;

    public boolean limit() {
        long now = System.currentTimeMillis();
        nowSize = Math.max(0, (nowSize - (now - time) * rate));
        time = now;
        if ((nowSize + 1) < total) {
            nowSize++;
            return true;
        } else {
            return false;
        }
    }
}
```

+ **Token Bucket (Thuật toán xô token)**

Cách thực hiện: Đặt một xô với dung lượng cố định, token được thêm vào xô với tốc độ cố định. Khi xô đầy, token không được thêm vào nữa. Mỗi yêu cầu sẽ lấy một token từ xô, nếu xô không còn token thì yêu cầu sẽ bị từ chối.

```java
public class TokenBucket {
    /**
     * Thời gian
     */
    private long time;
    /**
     * Tổng dung lượng
     */
    private Double total;
    /**
     * Tốc độ thêm token
     */
    private Double rate;
    /**
     * Dung lượng hiện tại
     */
    private Double nowSize;

    public boolean limit() {
        long now = System.currentTimeMillis();
        nowSize = Math.min(total, nowSize + (now - time) * rate);
        time = now;
        if (nowSize < 1) {
            // Xô không còn token
            return false;
        } else {
            // Xô có token
            nowSize -= 1;
            return true;
        }
    }
}
```

::: success
Spring Cloud Gateway cung cấp bộ lọc `RequestRateLimiterGatewayFilterFactory`, sử dụng Redis và Lua script để triển khai thuật toán token bucket.
:::

## Giới thiệu về Redis và Lua Script

**Redis:**

::: info
Redis chủ yếu được sử dụng làm bộ nhớ đệm, hỗ trợ nhiều cấu trúc dữ liệu khác nhau như chuỗi (String), băm (Hash), danh sách (List), tập hợp (Set), tập hợp có thứ tự (Sorted Set), bitmap, HyperLogLog và chỉ mục không gian địa lý (Geospatial).
:::

**Lua Script:**

**Lua** là một ngôn ngữ kịch bản nhẹ, nhúng thường được sử dụng trong phát triển trò chơi, lập trình kịch bản và các hệ thống nhúng. Từ phiên bản Redis 2.6, Lua script được hỗ trợ và có thể thực thi bằng lệnh `EVAL`. Việc sử dụng Lua script giúp thực hiện các thao tác nguyên tử, tránh những bước phức tạp trong nhiều thao tác.

Lua script và thủ tục lưu trữ của cơ sở dữ liệu MySQL có điểm tương đồng, cả hai đều thực hiện một nhóm lệnh và tất cả các lệnh phải thành công hoàn toàn hoặc thất bại, từ đó đảm bảo tính nguyên tử. Lua script có thể được hiểu như **một khối mã có logic nghiệp vụ**.

![pmhub-lua.drawio.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/pmhub-lua.drawio.png)

### Kết hợp Redis và Lua Script

Việc sử dụng Lua script trong Redis mang lại nhiều lợi ích:

+ **Tính nguyên tử**: Lua script trong Redis được thực thi nguyên tử, nghĩa là trong quá trình chạy script sẽ không có lệnh nào khác chèn vào thực thi, đảm bảo tính nguyên tử.
+ **Giảm chi phí mạng**: Bằng cách gói gọn nhiều lệnh Redis trong một Lua script, có thể giảm số lần giao tiếp giữa client và server, cải thiện hiệu suất.
+ **Thao tác phức tạp**: Có thể thực hiện các thao tác logic phức tạp trong script, trong khi việc thực hiện những thao tác này bằng lệnh Redis gốc có thể phức tạp.

### Ví dụ Lua Script

Dưới đây là một ví dụ đơn giản về Lua script để tăng giá trị của một khóa lên 1 và trả về giá trị mới:

```lua
-- Lua Script: Tăng giá trị của khóa lên 1
local current = redis.call("GET", KEYS[1])
if not current then
    current = 0
else
    current = tonumber(current)
end
current = current + 1
redis.call("SET", KEYS[1], current)
return current
```

Có thể thực thi script này trong Redis bằng lệnh `EVAL`:

```shell
EVAL "local current = redis.call('GET', KEYS[1]) if not current then current = 0 else current = tonumber(current) end current = current + 1 redis.call('SET', KEYS[1], current) return current" 1 mykey
```

### Các trường hợp sử dụng phổ biến

1. **Khóa phân tán**: Sử dụng Lua script để thực hiện khóa phân tán, đảm bảo tính nguyên tử cho thao tác khóa.
2. **Giới hạn lưu lượng bằng bộ đếm**: Sử dụng Lua script để thực hiện giới hạn lưu lượng với bộ đếm chính xác, tránh các vấn đề về đồng thời.
3. **Giao dịch phức tạp**: Xử lý các giao dịch nhiều bước trong Lua script để đảm bảo tính toàn vẹn của thao tác.

> **Lưu ý**: Trong PmHub, Lua script được sử dụng cho tính năng giới hạn lưu lượng bằng bộ đếm.

## Thực Chiến Dự Án

Trong **PmHub**, Redis hạn chế lưu lượng chủ yếu là để bổ sung cho hạn chế lưu lượng tại gateway. Đối với các tình huống truy cập quá thường xuyên hoặc có khả năng bỏ qua xác thực của gateway, có thể thêm logic hạn chế lưu lượng tùy chỉnh bằng Redis. Dưới đây là cách dự án được triển khai, giúp bạn nắm vững kiến thức này!
### 1. Định nghĩa cấu hình Rate Limiter

Cấu hình giới hạn lưu lượng được tiêm vào trong `RedisConfig`.

```java
@Bean
public DefaultRedisScript<Long> limitScript() {
    DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>();
    redisScript.setScriptText(limitScriptText());
    redisScript.setResultType(Long.class);
    return redisScript;
}

/**
 * Rate limiter script
 */
private String limitScriptText() {
    return "local key = KEYS[1]\n" +
           "local count = tonumber(ARGV[1])\n" +
           "local time = tonumber(ARGV[2])\n" +
           "local current = redis.call('get', key);\n" +
           "if current and tonumber(current) > count then\n" +
           "    return tonumber(current);\n" +
           "end\n" +
           "current = redis.call('incr', key)\n" +
           "if tonumber(current) == 1 then\n" +
           "    redis.call('expire', key, time)\n" +
           "end\n" +
           "return tonumber(current);";
}
```

::: info
Kịch bản này kiểm tra và tăng giá trị của khóa được chỉ định, đồng thời thiết lập thời gian hết hạn khi lần đầu tiên giá trị được tăng, thực hiện giới hạn số lượng yêu cầu trong khoảng thời gian xác định.
:::

### 2. Rate Limiter annotation

Annotation `RateLimiter`, giúp dễ dàng thêm giới hạn lưu lượng vào các phương thức cần thiết.

```java
/**
 * Rate limiter annotation
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RateLimiter {
    /**
     * Khóa giới hạn
     */
    String key() default CacheConstants.RATE_LIMIT_KEY;

    /**
     * Thời gian giới hạn, tính bằng giây
     */
    int time() default 60;

    /**
     * Số lần giới hạn
     */
    int count() default 100;

    /**
     * Loại giới hạn
     */
    LimitType limitType() default LimitType.DEFAULT;
}
```

### 3. Logic AOP xử lý rate limiter

Lớp kiểm soát AOP tùy chỉnh, xử lý logic giới hạn lưu lượng và thông báo giảm tải.

```java
/**
 * Rate Limiting Handling
 *
 * @author canghe
 */
@Aspect
@Component
public class RateLimiterAspect {
    private static final Logger log = LoggerFactory.getLogger(RateLimiterAspect.class);

    private RedisTemplate<Object, Object> redisTemplate;

    private RedisScript<Long> limitScript;

    @Autowired
    public void setRedisTemplate1(RedisTemplate<Object, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Autowired
    public void setLimitScript(RedisScript<Long> limitScript) {
        this.limitScript = limitScript;
    }

    @Before("@annotation(rateLimiter)")
    public void doBefore(JoinPoint point, RateLimiter rateLimiter) throws Throwable {
        int time = rateLimiter.time();
        int count = rateLimiter.count();

        String combineKey = getCombineKey(rateLimiter, point);
        List<Object> keys = Collections.singletonList(combineKey);
        try {
            Long number = redisTemplate.execute(limitScript, keys, count, time);
            if (StringUtils.isNull(number) || number.intValue() > count) {
                throw new ServiceException("Too many requests, please try again later");
            }
            log.info("Limiting requests '{}', current requests '{}', cache key '{}'", count, number.intValue(), combineKey);
        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Server rate limit exception, please try again later");
        }
    }

    public String getCombineKey(RateLimiter rateLimiter, JoinPoint point) {
        StringBuffer stringBuffer = new StringBuffer(rateLimiter.key());
        if (rateLimiter.limitType() == LimitType.IP) {
            stringBuffer.append(IpUtils.getIpAddr(ServletUtils.getRequest())).append("-");
        }
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();
        Class<?> targetClass = method.getDeclaringClass();
        stringBuffer.append(targetClass.getName()).append("-").append(method.getName());
        return stringBuffer.toString();
    }
}

```

Do lớp này được định nghĩa trong gói chung `core`, nên cần thêm thủ công để Spring quản lý.


### 4. Các trường hợp sử dụng cụ thể về rate limiter

Trong PmHub, api đăng nhập đã được thêm một lớp phòng thủ thứ hai. Biện pháp giới hạn tốc độ tùy chỉnh đã đảm bảo hiệu quả sự an toàn của hệ thống. Bởi vì giao diện đăng nhập có thể trực tiếp lấy được token của người dùng, nên nó rất quan trọng và chúng ta không muốn lượng truy cập quá lớn gây tê liệt hệ thống.

Cách sử dụng rất đơn giản, chỉ cần một chú thích, tự tùy chỉnh thời gian và số lần truy cập cho phép. Sau đó, chúng ta sẽ kiểm tra khả năng chịu tải trong các tình huống thực tế để hiểu rõ hơn về cơ chế giới hạn tốc độ.

```java
/**
     * Login endpoint. Since the login interface doesn't have a token, 
     * it bypasses gateway authentication, and the security level is extremely high.
     * Custom Redis rate-limiting logic is required here.
     * Configured to allow only 10 accesses within 30 seconds.
     * @param form
     * @return
     */
@RateLimiter(key = "rate_limit:login", time = 30, count = 10)
@PostMapping("login")
public AjaxResult login(@RequestBody LoginBody form) {
    AjaxResult ajax = success();
    // User login
    LoginUser userInfo = sysLoginService.login(form.getUsername(), form.getPassword());
    // Get login token
    String token = tokenService.createToken(userInfo);
    ajax.put(Constants.TOKEN, token);
    return ajax;
}
```

Tiếp theo, chúng ta sẽ đi vào kiểm tra khả năng chịu tải trong các tình huống thực tế.

### Cài đặt và tải xuống JMeter

Trong phần dưới đây, chúng ta sẽ sử dụng công cụ JMeter để mô phỏng việc kiểm tra tải bằng cách gửi một lượng lớn yêu cầu đồng thời.

> JMeter là một dự án của Apache, được sử dụng như một công cụ kiểm tra tải để phân tích và đo lường hiệu suất của nhiều loại dịch vụ khác nhau, tập trung vào ứng dụng web. JMeter có thể được sử dụng để kiểm tra các kết nối JDBC, FTP, LDAP, dịch vụ web, JMS, HTTP, kết nối TCP chung và quy trình hệ điều hành.

Link tải xuống: [Link tải JMeter](https://jmeter.apache.org/download_jmeter.cgi)

Chúng ta sẽ chọn gói nén dạng nhị phân, sau khi tải về, hãy giải nén.

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718761115760-d208910b-a0fd-4ea7-bc1a-1bc538df0ca7.png)

## Kiểm tra

### Khởi động JMeter

Đi vào thư mục `bin` của JMeter, chạy tệp `jmeter.sh` (nếu là Windows thì chạy `jmeter.bat`).

```java
sh jmeter.sh
```

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718761251006-98756f00-01e0-4bd8-8520-4a0e520a5f26.png)

Giao diện sau khi mở:

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718761442718-9c75e5a4-9d56-4c5e-8368-c512c8c81d78.png)

### Kiểm tra đơn giản

Để giúp bạn hiểu rõ hơn về quy trình kiểm tra tải với JMeter, chúng ta đã thêm một giao diện thử nghiệm trong module `pmhub-auth` dưới `LoginController`.

```java
 @RateLimiter(key = "limitTest", time = 10, count = 2)
    @PostMapping(value = "/limitTest")
    public Long limitTest() {
        System.out.println("limitTest");
        return 1L;
    }
```

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718761505775-56269f4b-027e-482e-89b9-726607d05834.png)

Thiết lập gửi 10 yêu cầu trong 1 giây

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718761671080-3ec96ee9-5e5b-421c-9f3b-f1d6be148f94.png)

Thêm yêu cầu HTTP:

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718761884672-95902a15-2a29-421d-b4c5-c85599af6b06.png)

Sau khi thiết lập xong, nhấp vào "Start":

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718762478546-e31c55a5-f147-442c-8a88-6991e009b7d8.png)

Lưu trước khi bắt đầu

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718762540461-5d1c27b0-9142-446b-8354-1a0991613796.png)

Kiểm tra thành công, chứng tỏ JMeter đã có thể hoạt động.

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718762584826-1c175e7d-af7d-43eb-a5c4-75fc86e84bf4.png)

Xem cây kết quả

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718763081478-6647353f-548c-4063-bd1d-4072af3c9977.png)

Có thể thấy thông tin kết quả yêu cầu.

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718763432480-1a26c4fb-6188-4603-bcc8-71072164cf6f.png)

### Mô phỏng kiểm tra tải giao diện

Thiết lập nhóm luồng để gửi 10 yêu cầu trong 1 giây

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718763488211-8a2df158-09d7-4934-bc66-0c457b58e793.png)

Cấu hình giới hạn tốc độ, giới hạn 2 yêu cầu trong 10 giây.

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718763528245-d7ca2843-856a-4f7d-84dd-52924fdd97ff.png)

Gửi yêu cầu

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718763619096-5e2b98e5-5e60-4aca-bcc1-bb11be0fc782.png)

Xem nhật ký:

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718763636485-62758eb3-8553-447d-9bbd-e219360a0e38.png)

Cho thấy cấu hình giới hạn tốc độ đã thành công. Yêu cầu đã đi thẳng vào phương thức giới hạn tốc độ của chúng ta.

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718763708848-8f6758e8-f031-4c1d-9395-d4feaa7cfe26.png)

### Giới hạn tốc độ thực trong api đăng nhập

Trong api đăng nhập, chúng ta đã cấu hình giới hạn tốc độ với chú thích.

Cấu hình này cho phép tối đa 10 lần truy cập trong 30 giây.

```java
    /**
     * API đăng nhập, vì giao diện này không có token nên không qua xác thực gateway và có mức độ bảo mật rất cao.
     * Cần phải tùy chỉnh logic giới hạn tốc độ với Redis.
     * Cấu hình này cho phép tối đa 10 lần truy cập trong 30 giây.
     * @param form
     * @return
     */
    @RateLimiter(key = "rate_limit:login", time = 30, count = 10)
    @PostMapping("login")
    public AjaxResult login(@RequestBody LoginBody form) {
        AjaxResult ajax = success();
        // Người dùng đăng nhập
        LoginUser userInfo = sysLoginService.login(form.getUsername(), form.getPassword());
        // Lấy token đăng nhập
        String token = tokenService.createToken(userInfo);
        ajax.put(Constants.TOKEN, token);
        return ajax;
    }
```

### Thực hiện kiểm tra tải:

Gửi yêu cầu POST với tham số là JSON. Các bước thực hiện:

1. Thêm phần tử cấu hình

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718765417469-c1b10f65-db25-46aa-8e97-a3c159bae6ed.png)

Mở "HTTP Header Manager", nhấp vào "Add", trong mục Name nhập "Content-Type", và trong mục Value nhập "application/json".

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718765488132-e7fdcae3-4f5f-4e12-90a5-57ae3333c8a1.png)

2. Yêu cầu định dạng JSON.

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718765559615-1abc3cfd-423b-4d1a-a09f-83eb2bafa72a.png)

+ **Tình huống bình thường**: Gửi 9 yêu cầu trong 1 giây, không vượt quá giới hạn.

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718765670890-2ba2de7e-c724-4527-8ea0-405b8b17d910.png)

Xem dữ liệu trả về từ JMeter, không có vấn đề gì.

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718765790613-7341257d-d29e-45af-9da4-5613922c2752.png)

Xem nhật ký trong bảng điều khiển, không có lỗi, đúng với 9 yêu cầu.

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718765830761-8fff359e-64a6-41cb-b773-4222c7f46649.png)

+ **Tình huống bất thường**: Gửi 11 yêu cầu trong 1 giây, vượt quá giới hạn.

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718765862909-3324b3bf-e633-4c36-af8e-3a516c9ef3ae.png)

Yêu cầu thứ 11 thất bại.

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718765934834-c64791bf-019a-4fcf-b079-d3f9ca395701.png)

Bảng điều khiển cũng ném ngoại lệ:

![](https://cdn.nlark.com/yuque/0/2024/png/29495295/1718765946608-7e2f4ab1-19fb-4d2c-a758-7dc7a91cbbef.png)

Điều này cho thấy giới hạn tốc độ đã đạt được mục tiêu. YYDS!!!

## Câu hỏi phỏng vấn

**Phỏng vấn viên**: Giới hạn lưu lượng (rate limiting) là gì? Trong những trường hợp nào cần sử dụng giới hạn lưu lượng?

**Tôi**: Giới hạn lưu lượng là một phương pháp kiểm soát số lượng yêu cầu được gửi đến hệ thống nhằm ngăn ngừa tình trạng quá tải và đảm bảo tính ổn định của dịch vụ. Trong các tình huống có lượng truy cập cao như sự kiện flash sale hoặc các hoạt động mua sắm đông đúc, chúng ta cần áp dụng giới hạn lưu lượng để tránh làm sập hệ thống bởi số lượng yêu cầu đột ngột tăng cao.

**Phỏng vấn viên**: Những thuật toán giới hạn lưu lượng phổ biến là gì?

**Tôi**: Vui lòng tham khảo phần thứ hai để có câu trả lời chi tiết.

**Phỏng vấn viên**: Bạn có thể giới thiệu ngắn gọn về nguyên lý cơ bản của thuật toán bộ đếm (Counter Algorithm) không?

**Tôi**: Nguyên lý cơ bản của thuật toán bộ đếm là đếm số lượng yêu cầu trong một khung thời gian cố định. Nếu số lượng yêu cầu vượt quá ngưỡng đã đặt, hệ thống sẽ từ chối các yêu cầu tiếp theo. Khung thời gian này có thể là 1 giây, 1 phút, v.v.

**Phỏng vấn viên**: Tại sao lại chọn Redis để thực hiện giới hạn lưu lượng? So với các phương pháp khác thì có ưu điểm gì?

**Tôi**: Redis có hiệu suất cao và hoạt động đơn luồng, có khả năng xử lý số lượng lớn yêu cầu đồng thời. Redis cung cấp các cấu trúc dữ liệu phong phú và hỗ trợ các thao tác nguyên tử, giúp triển khai thuật toán giới hạn lưu lượng trở nên đơn giản và hiệu quả hơn. So với các phương pháp khác, Redis dễ dàng mở rộng trong môi trường phân tán và đảm bảo tính nhất quán của dữ liệu.

**Phỏng vấn viên**: Bạn đã triển khai thuật toán giới hạn lưu lượng với bộ đếm trong Redis như thế nào? Bạn có thể mô tả chi tiết quy trình thực hiện không?

**Tôi**: Tôi đã sử dụng annotation + AOP (lập trình hướng khía cạnh) + Lua script. Để giải thích bằng cách dễ hiểu hơn, tôi đã áp dụng nó vào một tình huống thực tế là thêm giới hạn lưu lượng cho api đăng nhập.

**Phỏng vấn viên**: Bạn xử lý các yêu cầu đồng thời như thế nào? Trong trường hợp có số lượng yêu cầu lớn, liệu chiến lược giới hạn lưu lượng vẫn còn hiệu quả không?

**Tôi**: Chúng tôi sử dụng đặc tính đơn luồng của Redis và tính nguyên tử của Lua script để xử lý các yêu cầu đồng thời, đảm bảo độ chính xác của bộ đếm. Trong các tình huống có lượng yêu cầu cao, chiến lược giới hạn lưu lượng vẫn hiệu quả nhờ vào hiệu suất cao của Redis và các thao tác nguyên tử của Lua script, cho phép đối phó với một lượng lớn yêu cầu.

**Phỏng vấn viên**: Bạn đã thực hiện kiểm tra tải (stress testing) chưa? Bạn đã kiểm tra như thế nào?

**Tôi**: Bạn có thể thực hiện thử nghiệm tải bằng cách làm theo hướng dẫn trong phần này, sau đó giải thích lại quá trình kiểm tra một cách đơn giản.

**Phỏng vấn viên**: Khi bộ đếm giới hạn lưu lượng đạt đến giới hạn, bạn xử lý các yêu cầu của người dùng như thế nào? Có giải pháp thay thế không?

**Tôi**: Khi bộ đếm đạt đến giới hạn, chúng tôi sẽ từ chối các yêu cầu tiếp theo và trả về một thông báo lỗi thân thiện. Đồng thời, chúng tôi sẽ ghi lại những yêu cầu bị từ chối để phân tích và điều chỉnh chiến lược giới hạn lưu lượng trong tương lai.

