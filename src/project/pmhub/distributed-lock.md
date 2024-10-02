---
title: Distributed Lock
tags:
  - java
  - microservice
categories:
  - project
order: 5
---
# PmHub - Update process status with Distributed Lock 

Bài viết này sẽ hướng dẫn bạn cách sử dụng Redis để triển khai khóa phân tán đảm bảo cập nhật trạng thái quy trình trong dự án PmHub. **<font style="color:#DF2A3F;">Lưu ý rằng đây là kiến thức quan trọng bắt buộc phải nắm vững!</font>**

::: info
+ Sử dụng **khóa phân tán Redis**, đảm bảo việc cập nhật trạng thái quy trình được thực hiện tuần tự và không bị các thao tác khác can thiệp, bảo vệ quá trình cập nhật trạng thái.
:::
## Khóa là gì? Vấn đề của khóa cục bộ

Khái niệm về khóa trong hệ thống chương trình tương tự như trong thực tế: chúng đều được sử dụng để khóa tài nguyên, ngăn chặn truy cập không đúng cách.

Trước khi tìm hiểu khóa phân tán, chúng ta hãy xem qua vấn đề của khóa cục bộ để dẫn dắt đến nhu cầu sử dụng khóa phân tán.

Giả sử dịch vụ quy trình được triển khai 4 phiên bản, mỗi phiên bản nằm trên các máy chủ khác nhau. Sau khi yêu cầu từ phía người dùng đi qua Nginx và gateway, chúng sẽ được phân phối đến các phiên bản khác nhau. Giả sử rằng hệ thống nhận được 100.000 yêu cầu và mỗi phiên bản xử lý 25.000 yêu cầu.

Trong mỗi phiên bản dịch vụ, giả sử bộ nhớ cache bị mất hiệu lực, khi đó thao tác truy vấn cơ sở dữ liệu sẽ được khóa bằng cách sử dụng cơ chế khóa (synchronized hoặc lock) để bảo vệ tài nguyên luồng của riêng mình và ngăn ngừa tình trạng xuyên thủng bộ nhớ cache.

![pmhub-local-lock.drawio.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/pmhub-local-lock.drawio.png)


Khóa synchronized là một loại khóa được Java cung cấp, nó tạo ra cơ chế khóa giữa các luồng trong một tiến trình JVM đơn lẻ và chỉ phù hợp trong môi trường máy chủ đơn.

Tuy nhiên, trong hệ thống phân tán, synchronized không thể khóa được các dịch vụ trên nhiều node, dẫn đến vấn đề không đồng nhất dữ liệu. Ví dụ: Dịch vụ A cập nhật cache với giá trị `key = 100`, trong khi dịch vụ B không bị ảnh hưởng bởi khóa của dịch vụ A và đồng thời cập nhật cache với giá trị `key = 99`. Kết quả cuối cùng có thể là 99 hoặc 100, nhưng đó là một trạng thái không xác định và không đúng như kỳ vọng.

## Khóa phân tán là gì?

Dựa trên vấn đề của khóa cục bộ, chúng ta cần một loại khóa hỗ trợ môi trường cụm phân tán: Khi truy vấn cơ sở dữ liệu, chỉ một luồng được phép truy cập và các luồng khác phải đợi luồng đầu tiên giải phóng tài nguyên khóa trước khi tiếp tục.

Trong hệ thống phân tán, khóa phân tán đảm bảo rằng chỉ một node có quyền truy cập vào tài nguyên chia sẻ tại một thời điểm, giúp tránh xung đột và đảm bảo tính nhất quán dữ liệu.

**<font style="color:#DF2A3F;">Khóa phân tán là cơ chế kiểm soát việc truy cập tài nguyên chia sẻ trong các hệ thống phân tán, đảm bảo tại mỗi thời điểm chỉ có một tiến trình giữ khóa.</font>**

Từ khóa đơn lẻ trong một tiến trình chuyển sang khóa trên nhiều tiến trình phân tán như hình sau:

![pmhub-distributed-lock.drawio.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/pmhub-distributed-lock.drawio.png)

## Đặc tính của khóa phân tán

+ **Tính loại trừ lẫn nhau** (Mutual exclusivity)
   Đây là đặc tính cơ bản của khóa phân tán: chỉ một node có thể giữ khóa tại một thời điểm. Khi một node lấy được khóa, các node khác không thể lấy được, đảm bảo tính loại trừ giữa các node.

+ **Cơ chế timeout** (Timeout mechanism)
   Khi một yêu cầu lấy được khóa và hoàn thành nhiệm vụ, nó sẽ giải phóng khóa. Tuy nhiên, nếu xảy ra lỗi trong quá trình xử lý, chẳng hạn như lỗi dịch vụ hoặc mạng, khóa có thể không được giải phóng, dẫn đến tình trạng deadlock. Để ngăn chặn deadlock, cần thiết lập thời gian timeout cho khóa, sau khi hết thời gian này, khóa sẽ tự động được giải phóng.

+ **Tự động gia hạn** (Automatic renewal)
   Nếu tác vụ được xử lý mất thời gian dài và vượt quá thời gian timeout của khóa, vấn đề có thể xảy ra khi khóa bị giải phóng trước khi tác vụ hoàn thành, dẫn đến các node khác có thể lấy được khóa và gây ra xung đột tài nguyên. Do đó, cần có cơ chế gia hạn tự động để khóa được gia hạn nếu tác vụ chưa hoàn thành.

Bắt đầu một chuỗi nghe để giám sát các tác vụ thường xuyên. Nếu chuỗi tác vụ giám sát vẫn còn tồn tại, hãy kéo dài thời gian chờ. Khi tác vụ hoàn thành hoặc xảy ra ngoại lệ trong tác vụ, thời gian chờ sẽ không được kéo dài.

## Các phương pháp triển khai khóa phân tán

Khóa phân tán chủ yếu được triển khai theo ba cách:

+ Database
+ Zookeeper
+ Redis

Trong số đó, việc triển khai khóa phân tán bằng Redis là phức tạp nhất nhưng cũng mang lại hiệu suất cao nhất. Có hai cách để thực hiện: một là sử dụng lệnh **SetNX** của Redis, tuy nhiên cách này có thể gây ra vấn đề deadlock (khóa chết), vì vậy **trong môi trường product, phương pháp thứ hai thường được sử dụng, đó là triển khai khóa phân tán với Redisson.**

## Khóa phân tán Redisson

Redisson là một **bộ lưới dữ liệu trong bộ nhớ (In-Memory Data Grid)** được triển khai trên nền tảng Redis cho Java. Redisson không chỉ cung cấp một loạt các đối tượng Java phân tán thường dùng mà còn hỗ trợ nhiều dịch vụ phân tán khác. Redisson được xây dựng trên framework giao tiếp **Netty**, giúp hỗ trợ giao tiếp không đồng bộ và mang lại hiệu suất cao hơn so với Jedis.

Khóa phân tán Redisson có bốn cơ chế bảo vệ:

+ Chống deadlock (khóa chết)
+ Chống xóa nhầm
+ Hỗ trợ tái nhập (reentrant)
+ Tự động gia hạn

Việc sử dụng Redisson để triển khai khóa phân tán Redis hỗ trợ cả chế độ đơn (single) và cụm (cluster).

## Thực chiến dự án

### Quy trình nghiệp vụ

Một hình ảnh thay ngàn lời:

![pmhub-lock-biz-process.drawio.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/pmhub-lock-biz-process.drawio.png)

### Add dependency

```java
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson-spring-boot-starter</artifactId>
    <version>3.16.1</version>
</dependency>
```

### Thêm cấu hình

Thêm cấu hình Redisson cho chế độ đơn vào **pmhub-workflow** trong Nacos:

```java
redisson:
  codec: org.redisson.codec.JsonJacksonCodec
  threads: 4
  netty:
    threads: 4
  single-server-config:
    address: "redis://localhost:6379"
    password: null
    database: 0
```

### RedissonConfig

```java
@Configuration
public class RedissonConfig {
    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer()
                .setAddress("redis://localhost:6379")
                .setDatabase(0);

        return Redisson.create(config);
    }
}
```

### Định nghĩ ILock Object

```java
@AllArgsConstructor
public class ILock implements AutoCloseable {
    /**
     * The held lock object
     */
    @Getter
    private Object lock;
    
    /**
     * The distributed lock interface
     */
    @Getter
    private IDistributedLock distributedLock;

    @Override
    public void close() throws Exception {
        if (Objects.nonNull(lock)) {
            distributedLock.unLock(lock);
        }
    }
}
```

### Định nghĩa IDistributedLock Interface cho khoá phân tán


```java
public interface IDistributedLock {
    /**
     * Acquire the lock, default expiration is 30 seconds, waits indefinitely until the lock is obtained
     *
     * @param key the lock's key
     * @return the lock object
     */
    ILock lock(String key);

    /**
     * Acquire the lock, waits indefinitely until the lock is obtained
     *
     * @param key      the lock's key
     * @param lockTime time the lock will be held before it is automatically released; if lockTime is -1, the lock is held until explicitly unlocked
     * @param unit     the time unit for {@code lockTime}
     * @param fair     whether it is a fair lock
     * @return the lock object
     */
    ILock lock(String key, long lockTime, TimeUnit unit, boolean fair);

    /**
     * Attempts to acquire the lock, times out if not obtained within 30 seconds, default expiration is 30 seconds
     *
     * @param key     the lock's key
     * @param tryTime maximum time to try to acquire the lock
     * @return
     * @throws Exception
     */
    ILock tryLock(String key, long tryTime) throws Exception;

    /**
     * Attempts to acquire the lock, times out if not obtained
     *
     * @param key      the lock's key
     * @param tryTime  maximum time to try to acquire the lock
     * @param lockTime time the lock will be held
     * @param unit     time unit for {@code tryTime @code lockTime}
     * @param fair     whether it is a fair lock
     * @return
     * @throws Exception
     */
    ILock tryLock(String key, long tryTime, long lockTime, TimeUnit unit, boolean fair) throws Exception;

    /**
     * Unlock
     *
     * @param lock
     * @throws Exception
     */
    void unLock(Object lock);

    /**
     * Release the lock
     *
     * @param lock
     * @throws Exception
     */
    default void unLock(ILock lock) {
        if (lock != null) {
            unLock(lock.getLock());
        }
    }
}
```

### IDistributedLock Implementation

```java
@Slf4j
@Component
public class RedissonDistributedLock implements IDistributedLock {

    @Resource
    private RedissonClient redissonClient;
    /**
     * Unified prefix
     */
    @Value("${redisson.lock.prefix:bi:distributed:lock}")
    private String prefix;

    @Override
    public ILock lock(String key) {
        return this.lock(key, 0L, TimeUnit.SECONDS, false);
    }

    @Override
    public ILock lock(String key, long lockTime, TimeUnit unit, boolean fair) {
        RLock lock = getLock(key, fair);
        // Acquire the lock, wait indefinitely, does not support automatic renewal
        if (lockTime > 0L) {
            lock.lock(lockTime, unit);
        } else {
            // Watchdog auto-extension mechanism defaults to 30s renewal, renews every 10 seconds
            lock.lock();
        }
        return new ILock(lock, this);
    }

    @Override
    public ILock tryLock(String key, long tryTime) throws Exception {
        return this.tryLock(key, tryTime, 0L, TimeUnit.SECONDS, false);
    }

    @Override
    public ILock tryLock(String key, long tryTime, long lockTime, TimeUnit unit, boolean fair)
            throws Exception {
        RLock lock = getLock(key, fair);
        boolean lockAcquired;
        // Attempts to acquire the lock, times out if not obtained, does not support auto-renewal
        if (lockTime > 0L) {
            lockAcquired = lock.tryLock(tryTime, lockTime, unit);
        } else {
            // Watchdog auto-extension mechanism renews every 10 seconds, default 30s renewal
            lockAcquired = lock.tryLock(tryTime, unit);
        }
        if (lockAcquired) {
            return new ILock(lock, this);
        }
        return null;
    }

    /**
     * Get the lock
     *
     * @param key
     * @param fair
     * @return
     */
    private RLock getLock(String key, boolean fair) {
        RLock lock;
        String lockKey = prefix + ":" + key;
        if (fair) {
            // Get fair lock
            lock = redissonClient.getFairLock(lockKey);
        } else {
            // Get normal lock
            lock = redissonClient.getLock(lockKey);
        }
        return lock;
    }

    @Override
    public void unLock(Object lock) {
        if (!(lock instanceof RLock)) {
            throw new IllegalArgumentException("Invalid lock object");
        }
        RLock rLock = (RLock) lock;
        if (rLock.isLocked()) {
            try {
                rLock.unlock();
            } catch (IllegalMonitorStateException e) {
                log.error("Error releasing distributed lock", e);
            }
        }
    }
}
```

### Định nghĩa DistributedLock Annotation

```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DistributedLock {
    /**
     * Ensures the uniqueness of the key for the business interface, 
     * otherwise the distributed lock loses its meaning. Lock key
     * Supports SpEL expressions.
     */
    String key();

    /**
     * Ensures the uniqueness of the key for the business interface, 
     * otherwise the distributed lock loses its meaning. Lock key prefix.
     */
    String keyPrefix() default "";

    /**
     * Whether to acquire the lock within the waiting time. 
     * If the lock cannot be acquired within the waiting time, it returns failure.
     */
    boolean tryLock() default false;

    /**
     * Maximum attempt time to acquire the lock. 
     * The system will attempt to acquire the lock for the duration of tryTime.
     * If successful within this time, it returns success; otherwise, 
     * it throws a lock acquisition timeout exception. When tryLock=true, this value must be greater than 0.
     */
    long tryTime() default 0;

    /**
     * Lock time duration after which the lock will be automatically released.
     */
    long lockTime() default 30;

    /**
     * Time unit for tryTime and lockTime.
     */
    TimeUnit unit() default TimeUnit.SECONDS;

    /**
     * Whether it is a fair lock. False: non-fair lock, True: fair lock.
     */
    boolean fair() default false;
}
```

### AOP Aspect Control

```java
@Aspect
@Slf4j
@Component
public class DistributedLockAspect {

    @Resource
    private IDistributedLock distributedLock;

    /**
     * SpEL expression parser
     */
    private SpelExpressionParser spelExpressionParser = new SpelExpressionParser();

    /**
     * Used for obtaining method parameter names
     */
    private DefaultParameterNameDiscoverer nameDiscoverer = new DefaultParameterNameDiscoverer();

    @Pointcut("@annotation(com.laigeoffer.pmhub.base.security.annotation.DistributedLock)")
    public void distributedLock() {
    }

    @Around("distributedLock()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        // Get DistributedLock annotation
        DistributedLock distributedLock = this.getDistributedLock(pjp);
        // Get lockKey
        String lockKey = this.getLockKey(pjp, distributedLock);
        ILock lockObj = null;
        try {
            // Lock. If tryLock = true and tryTime > 0, attempt to acquire the lock, otherwise, a timeout exception occurs.
            if (distributedLock.tryLock()) {
                if (distributedLock.tryTime() <= 0) {
                    throw new UtilException("tryTime must be greater than 0");
                }
                lockObj = this.distributedLock.tryLock(lockKey, distributedLock.tryTime(), distributedLock.lockTime(), distributedLock.unit(), distributedLock.fair());
            } else {
                lockObj = this.distributedLock.lock(lockKey, distributedLock.lockTime(), distributedLock.unit(), distributedLock.fair());
            }

            if (Objects.isNull(lockObj)) {
                throw new UtilException("Duplicate request for method still in process");
            }

            return pjp.proceed();
        } catch (Exception e) {
            throw e;
        } finally {
            // Unlock
            this.unLock(lockObj);
        }
    }

    /**
     * Get DistributedLock annotation from the method
     */
    private DistributedLock getDistributedLock(ProceedingJoinPoint pjp) throws NoSuchMethodException {
        String methodName = pjp.getSignature().getName();
        Class<?> clazz = pjp.getTarget().getClass();
        Class<?>[] paramTypes = ((MethodSignature) pjp.getSignature()).getParameterTypes();
        Method lockMethod = clazz.getMethod(methodName, paramTypes);
        return lockMethod.getAnnotation(DistributedLock.class);
    }

    /**
     * Unlock
     */
    private void unLock(ILock lockObj) {
        if (Objects.isNull(lockObj)) {
            return;
        }

        try {
            this.distributedLock.unLock(lockObj);
        } catch (Exception e) {
            log.error("Exception occurred while unlocking the distributed lock", e);
        }
    }

    /**
     * Get lockKey
     */
    private String getLockKey(ProceedingJoinPoint pjp, DistributedLock distributedLock) {
        String lockKey = distributedLock.key();
        String keyPrefix = distributedLock.keyPrefix();
        if (StringUtils.isBlank(lockKey)) {
            throw new UtilException("Lock key cannot be empty");
        }
        if (lockKey.contains("#")) {
            this.checkSpEL(lockKey);
            MethodSignature methodSignature = (MethodSignature) pjp.getSignature();
            // Get method parameter values
            Object[] args = pjp.getArgs();
            lockKey = getValBySpEL(lockKey, methodSignature, args);
        }
        return StringUtils.isBlank(keyPrefix) ? lockKey : keyPrefix + lockKey;
    }

    /**
     * Parse SpEL expressions
     */
    private String getValBySpEL(String spEL, MethodSignature methodSignature, Object[] args) {
        String[] paramNames = nameDiscoverer.getParameterNames(methodSignature.getMethod());
        if (paramNames == null || paramNames.length < 1) {
            throw new UtilException("Lock key cannot be empty");
        }
        Expression expression = spelExpressionParser.parseExpression(spEL);
        EvaluationContext context = new StandardEvaluationContext();
        for (int i = 0; i < args.length; i++) {
            context.setVariable(paramNames[i], args[i]);
        }
        Object value = expression.getValue(context);
        if (value == null) {
            throw new UtilException("Parameter value cannot be null");
        }
        return value.toString();
    }

    /**
     * Check SpEL expression validity
     */
    private void checkSpEL(String spEL) {
        try {
            ExpressionParser parser = new SpelExpressionParser();
            parser.parseExpression(spEL, new TemplateParserContext());
        } catch (Exception e) {
            log.error("Exception while parsing SpEL expression", e);
            throw new UtilException("Invalid SpEL expression [" + spEL + "]");
        }
    }
}
```

### Định nghĩa Enable Distributed Lock Annotation

```java
/**
 * @author canghe
 * @description EnableDistributedLock meta-annotation to enable distributed lock functionality
 * @create 2024-06-17-10:56
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import({DistributedLockAspect.class})
public @interface EnableDistributedLock {
}
```

### Thực chiến sử dụng
#### 1. Kích hoạt khóa phân tán

```java
@EnableCustomConfig  
@EnablePmFeignClients  
@EnableCustomSwagger2  
@EnableDistributedLock 
@SpringBootApplication  
public class PmHubWorkflowApplication {  
    public static void main(String[] args) {  
        SpringApplication.run(PmHubWorkflowApplication.class, args);  
    }
}
```
#### 2. Thêm annotation vào giao diện cập nhật cài đặt phê duyệt  
Phương thức `updateApprovalSet` của lớp `WfDeployController`

```java
    /**
     * Update approval
     * @param approvalSetDTO
     * @return
     */
    @InnerAuth
    @PostMapping("/updateApprovalSet")
    @DistributedLock(key = "#approvalSetDTO.approved", lockTime = 10L, keyPrefix = "workflow-approve-")
    public R<?> updateApprovalSet(ApprovalSetDTO approvalSetDTO) {
        return R.ok(deployService.updateApprovalSet(approvalSetDTO, ProjectStatusEnum.PROJECT.getStatusName()));
    }
```

Bối cảnh thực tế: Khi cập nhật cài đặt phê duyệt dự án và nhiệm vụ, đảm bảo rằng tại cùng một thời điểm chỉ có một dịch vụ có thể lấy được khóa.

## Câu hỏi phỏng vấn

1. **Khóa phân tán là gì và tại sao cần sử dụng khóa phân tán?**

Khóa phân tán là một cơ chế kiểm soát truy cập tài nguyên chia sẻ giữa các nút trong hệ thống phân tán, nhằm tránh tranh chấp tài nguyên và các vấn đề về đồng thời. Khóa phân tán được sử dụng để đảm bảo rằng trong nhiều tiến trình hoặc dịch vụ, một số đoạn mã quan trọng chỉ được thực thi một cách loại trừ lẫn nhau, đảm bảo tính nhất quán và chính xác của dữ liệu.

**2. Nguyên lý cơ bản của việc triển khai khóa phân tán bằng Redis là gì?**

Sử dụng lệnh `SET key value NX PX timeout`: NX đảm bảo rằng chỉ khi khóa không tồn tại mới có thể thiết lập thành công, PX thiết lập thời gian hết hạn cho khóa để tránh xảy ra deadlock. Điều này đảm bảo rằng tại một thời điểm chỉ có một client có thể lấy được khóa.

**3. Làm thế nào để xử lý vấn đề tái nhập (reentrancy) của khóa phân tán?**

Vấn đề tái nhập đề cập đến việc một luồng đã nắm giữ khóa có thể yêu cầu lại khóa đó. Để giải quyết vấn đề này, có thể lưu thông tin luồng trong giá trị của khóa Redis và mỗi lần khóa lại, sẽ kiểm tra và cập nhật bộ đếm.

Nếu ứng dụng gặp sự cố sau khi lấy được khóa, làm thế nào để đảm bảo khóa cuối cùng sẽ được giải phóng?

Bằng cách thiết lập thời gian hết hạn cho khóa để tránh deadlock, ngay cả khi ứng dụng gặp sự cố, khóa cũng sẽ tự động được giải phóng sau khi thời gian hết hạn. Ngoài ra, có thể sử dụng cơ chế watchdog để gia hạn thời gian hết hạn định kỳ, đảm bảo rằng khóa không bị giải phóng trước khi logic kinh doanh hoàn tất.

**4. Làm thế nào để tối ưu hóa hiệu suất của khóa phân tán Redis?**

Sử dụng script Lua để thực hiện các thao tác khóa và mở khóa, đảm bảo tính nguyên tử của các thao tác này. Sử dụng thư viện Redisson, cung cấp một giải pháp khóa phân tán hiệu quả và mạnh mẽ.

**5. Các phương pháp chính để triển khai khóa phân tán là gì? Sử dụng Redis để thiết kế khóa phân tán như thế nào? Có thể sử dụng Zookeeper để thiết kế khóa phân tán không? Phương pháp nào hiệu quả hơn?**

::: danger
<font style="color:rgb(31, 35, 40);">Thông thường khi đặt câu hỏi, mọi người sẽ hỏi về Zookeeper trước, rồi từ đó chuyển sang các câu hỏi liên quan đến khóa phân tán, vì việc sử dụng khóa phân tán trong phát triển hệ thống phân tán rất phổ biến.</font>
:::

Khóa phân tán có ba cách triển khai chính:

- Cơ sở dữ liệu
- Zookeeper
- Redis

Trong đó, Redis và Zookeeper là phổ biến nhất, hãy so sánh hai phương pháp này:

| Đặc điểm                       | Khóa phân tán Redis                                          | Khóa phân tán Zookeeper                                                |
| ------------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Cách lấy khóa                  | Phải thử liên tục để lấy khóa, tốn hiệu suất                 | Đăng ký bộ lắng khi không lấy được khóa, ít tốn hiệu suất              |
| Cách mở khóa                   | Phải đợi hết thời gian timeout nếu client bị lỗi             | Nếu client bị lỗi, znode tạm thời sẽ tự động xóa, khóa tự động được mở |
| Hiệu suất                      | Tốn nhiều tài nguyên hơn                                     | Tốn ít tài nguyên hơn                                                  |
| Độ phức tạp triển khai         | Đơn giản                                                     | Cần cấu hình và quản lý Zookeeper                                      |
| Đảm bảo tính nhất quán dữ liệu | Cần cấu hình thêm, ví dụ thiết lập timeout và tránh deadlock | Được đảm bảo bởi cơ chế của Zookeeper                                  |
| Ứng dụng phù hợp               | Nhu cầu khóa phân tán đơn giản                               | Nhu cầu khóa phân tán yêu cầu độ tin cậy và nhất quán cao              |
| Cơ chế khóa                    | Dựa trên cặp khóa-giá trị của Redis                          | Dựa trên các znode tạm thời của Zookeeper                              |

