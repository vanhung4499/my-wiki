---
title: Apply Design Patterns
tags:
  - design-pattern
categories:
  - design-pattern
order: 4
---
# Làm thế nào để áp dụng design pattern vào dự án thực tế ?

## I. 🌈 Giới thiệu design pattern

Cái gọi là design pattern là một tập hợp phương pháp đã được người ta sử dụng hoặc xác minh nhiều lần. Từ góc độ trừu tượng hoặc vĩ mô hơn, miễn là phù hợp với tình huống sử dụng và giải quyết vấn đề thực tế, mô hình nên được áp dụng trong cả DD và design pattern.

## 2. Các design pattern thường được sử dụng là gì ? 🤔

- Strategy Pattern
    
- Simple Factory Pattern
    
- Singleton Pattern
    
- Proxy Pattern
    
- Factory Method Pattern
    
- Observer Pattern
    
- Template Method Pattern
    
- Adapter Pattern

## 3. Áp dụng Design pattern đơn giản qua một số ví dụ thực tế

### 3.1. Strategy Pattern

#### **Tình huống** 

Một trung tâm thương mại tổ chức sự kiện, khi khách hàng mua hàng sẽ được giảm giá dựa trên số tiền mua hàng. Ví dụ:

- Mua hàng với số tiền >= 2000 sẽ được giảm 20% (0.8).
- Số tiền mua hàng từ 500 ~ 1000 được giảm 10% (0.9).
- Số tiền mua hàng từ 0 ~ 500 được giảm 5% (0.95).

Tuỳ thuộc vào số tiền mua hàng, sẽ áp dụng các chiến lược tính toán khác nhau.


Đầu tiên, định nghĩa một interface Strategy để biểu thị một chiến lược:

```java
public interface Strategy {
    /**
     * Áp dụng chiến lược
     */
    String strategy();

    /**
     * Logic tính toán
     */
    void algorithm();
}
```

Trong đó, phương thức `strategy` trả về định danh duy nhất của chiến lược hiện tại, và phương thức `algorithm` là logic tính toán cụ thể của chiến lược đó.

Dưới đây là hai lớp triển khai của interface Strategy:

```java
public class ConcreteStrategyA implements Strategy {

    @Override
    public String strategy() {
        return StrategySelector.strategyA.getStrategy();
    }

    @Override
    public void algorithm() {
        System.out.println("Xử lý với strategyA...");
    }
}

public class ConcreteStrategyB implements Strategy {

    @Override
    public String strategy() {
        return StrategySelector.strategyB.getStrategy();
    }

    @Override
    public void algorithm() {
        System.out.println("Xử lý với strategyB...");
    }
}

public class ConcreteStrategyC implements Strategy {

    @Override
    public String strategy() {
        return StrategySelector.strategyC.getStrategy();
    }

    @Override
    public void algorithm() {
        System.out.println("Xử lý với strategyC...");
    }
}
```

Tạo một Enum StrategySelector để lựa chọn chiến lược:

```java
@Getter
public enum StrategySelector {
    strategyA(1, "strategyA"),
    strategyB(2, "strategyB"),
    strategyC(3, "strategyC");

    private Integer code;
    private String strategy;

    StrategySelector(Integer code, String strategy) {
        this.code = code;
        this.strategy = strategy;
    }
}
```

Sau đó, định nghĩa một interface StrategyRunner để biểu thị bộ điều phối chiến lược:

```java
public interface StrategyRunner {
    void execute(String strategy);
}
```

Phương thức `execute` sẽ quyết định thực thi chiến lược nào dựa trên giá trị của `strategy`.

```java
public class StrategyRunnerImpl implements StrategyRunner {

    private static final List<Strategy> STRATEGIES = Arrays.asList(new ConcreteStrategyA(), new ConcreteStrategyB(), new ConcreteStrategyC());
    private static Map<String, Strategy> STRATEGY_MAP = Maps.newHashMap();

    static {
        STRATEGY_MAP = STRATEGIES.stream().collect(Collectors.toMap(Strategy::strategy, s -> s));
    }

    @Override
    public void execute(String strategy) {
        STRATEGY_MAP.get(strategy).algorithm();
    }
}
```

Trong `StrategyRunnerImpl`, định nghĩa một danh sách `STRATEGIES` để lưu trữ tất cả các đối tượng triển khai của Strategy, và một Map `STRATEGY_MAP` để lưu trữ mối quan hệ giữa `strategy` và các đối tượng Strategy. Khối static trong code được dùng để khởi tạo `STRATEGY_MAP` từ danh sách `STRATEGIES`. Như vậy, trong phương thức `execute`, có thể dễ dàng lấy được đối tượng Strategy tương ứng với `strategy` đã chỉ định.

#### Triển khai và áp dụng strategy patten

```java
@Component
public class ConcreteStrategyA implements Strategy {

    @Override
    public String strategy() {
        return StrategySelector.strategyA.getStrategy();
    }

    @Override
    public void algorithm() {
        System.out.println("Xử lý với strategyA...");
    }
}

@Component
public class ConcreteStrategyB implements Strategy {

    @Override
    public String strategy() {
        return StrategySelector.strategyB.getStrategy();
    }

    @Override
    public void algorithm() {
        System.out.println("Xử lý với strategyB...");
    }
}

@Component
public class ConcreteStrategyC implements Strategy {

    @Override
    public String strategy() {
        return StrategySelector.strategyC.getStrategy();
    }

    @Override
    public void algorithm() {
        System.out.println("Xử lý với strategyC...");
    }
}
```

Tiếp theo, định nghĩa một lớp cấu hình `StrategyConfig` để inject một `StrategyRunner` vào container:

```java
@Configuration
public class StrategyConfig {

    @Bean
    public StrategyRunner runner(List<Strategy> strategies) {
        Map<String, Strategy> strategyMap = strategies.stream().collect(Collectors.toMap(Strategy::strategy, s -> s));
        return flag -> strategyMap.get(flag).algorithm();
    }
}
```

Không khó để nhận thấy, phương thức `strategyRunner` có logic gần như hoàn toàn giống với `StrategyRunnerImpl` trước đây, cũng dựa vào một `List<Strategy>` để xây dựng một `Map<String, Strategy>`. Tuy nhiên, danh sách `strategies` ở đây không phải do chúng ta tự tạo ra, mà được truyền vào thông qua tham số phương thức. Vì `strategyRunner` được đánh dấu bằng annotation `@Bean`, danh sách `List<Strategy>` này thực ra được lấy từ container trong quá trình khởi tạo Spring Boot. Do đó, các lớp triển khai Strategy mà chúng ta đã đăng ký trước đó sẽ được inject vào đây.

Nhờ đó, chúng ta không cần phải quan tâm hệ thống có bao nhiêu lớp triển khai Strategy, vì Spring Boot sẽ tự động cấu hình và phát hiện tất cả các lớp triển khai. Chúng ta chỉ cần viết lớp triển khai Strategy của mình, sau đó đăng ký vào container và inject `StrategyRunner` ở bất kỳ nơi nào cần:

```java
@Autowired
private StrategyRunner strategyRunner;
```

Sau đó, chúng ta có thể sử dụng trực tiếp `strategyRunner`:

```java
@RestController
@RequestMapping(value = "/designPatterns")
public class DesignPatternController {

    @Autowired
    private StrategyRunner strategyRunner;

    @GetMapping(value = "/algorithm")
    public void algorithm(@RequestParam("strategy") String strategy) {
        strategyRunner.execute(strategy);
    }
}
```

Khi truy cập vào API, console sẽ xuất ra như sau:

```
Xử lý với strategyA...
```

### 3.2. Simple Factory Pattern

#### Ví dụ tình huống 🌰:

Trong tình huống người dùng thanh toán, hiện tại hỗ trợ thanh toán bằng Alipay và WeChat Pay, và trong tương lai sẽ thêm các phương thức thanh toán như thẻ ngân hàng, UnionPay. Sử dụng mẫu chiến lược, mỗi phương thức thanh toán là một chiến lược, dựa vào loại thanh toán mà người dùng truyền vào, tạo ra các lớp chiến lược khác nhau. Sử dụng mẫu nhà máy, bằng cách đóng gói một lớp xử lý chiến lược `PaymentStrategyHandler`, hệ thống khác có thể gọi chức năng này thông qua một cửa ngõ thống nhất, sử dụng mẫu facade (mặt tiền).

#### 3.2.1 Định nghĩa một lớp chiến lược:

```java
public interface IPayment {

    /**
     * Thanh toán
     *
     * @param paymentBody
     */
    Boolean pay(PaymentBody paymentBody);
}

public class AliPay implements IPayment {
    @Override
    public Boolean pay(PaymentBody paymentBody) {
        System.out.println("Thanh toán bằng Alipay...");
        return Boolean.TRUE;
    }
}

public class WechatPay implements IPayment {
    @Override
    public Boolean pay(PaymentBody paymentBody) {
        System.out.println("Thanh toán bằng WeChat Pay...");
        return Boolean.TRUE;
    }
}

public class UnionPay implements IPayment {
    @Override
    public Boolean pay(PaymentBody paymentBody) {
        System.out.println("Thanh toán bằng UnionPay...");
        return Boolean.TRUE;
    }
}
```

#### 3.2.2 Tạo Strategy Factory

```java
package com.universal.core.designPatterns.factory;

import cn.hutool.core.util.EnumUtil;
import cn.hutool.core.util.ReflectUtil;
import com.universal.core.designPatterns.enums.PayStrategyEnum;
import org.springframework.stereotype.Component;

/**
 * Nhà máy cho các phương thức thanh toán
 */
@Component
public class PaymentFactory {

    public static IPayment getPayStrategy(String type) {
        // 1. Lấy giá trị tương ứng từ kiểu trong enum
        String value = EnumUtil.getFieldBy(PayStrategyEnum::getValue, PayStrategyEnum::getType, type);
        // 2. Sử dụng cơ chế phản chiếu để tạo lớp chiến lược tương ứng
        IPayment payment = ReflectUtil.newInstance(value);
        return payment;
    }
}
```

#### 3.3.3 Định nghĩa enum chiến lược

```java
/**
 * Enum chiến lược thanh toán
 */
@Getter
public enum PayStrategyEnum {

    ZFB("ZFB", "com.universal.core.designPatterns.factory.impl.AliPay"),
    WX("WX", "com.universal.core.designPatterns.factory.impl.WechatPay"),
    UNION("UNION", "com.universal.core.designPatterns.factory.impl.UnionPay");

    String type;
    String value;

    PayStrategyEnum(String type, String value) {
        this.type = type;
        this.value = value;
    }
}
```

#### 3.3.4 Tạo ngữ cảnh chiến lược

```java
@Data
public class PaymentContext {

    @Resource
    private IPayment paymentStrategy;

    public PaymentContext(IPayment paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    public Boolean pay(PaymentBody paymentBody) {
        return this.paymentStrategy.pay(paymentBody);
    }
}
```

#### 3.4.5 Cung cấp cổng truy cập thống nhất

```java
package com.universal.core.designPatterns.factory;

import cn.hutool.core.util.EnumUtil;
import com.universal.core.designPatterns.enums.PayStrategyEnum;
import org.springframework.stereotype.Component;

@Component
public class PaymentStrategyHandler {

    public static Boolean pay(PaymentBody payBody) {
        if (!EnumUtil.contains(PayStrategyEnum.class, payBody.getType())) {
            throw new IllegalArgumentException("Phương thức thanh toán không được hỗ trợ!");
        }
        // 1. Lấy đối tượng chiến lược thanh toán
        IPayment payStrategy = PaymentFactory.getPayStrategy(payBody.getType());
        // 2. Lấy ngữ cảnh chiến lược thanh toán
        PaymentContext paymentContext = new PaymentContext(payStrategy);
        // 3. Thực hiện thanh toán
        return paymentContext.pay(payBody);
    }
}
```

#### 3.4.6 Tạo Controller

```java
@RestController
@RequestMapping(value = "/designPatterns")
public class DesignPatternController {

    @PostMapping("/pay")
    public Boolean pay(@RequestBody PaymentBody paymentBody) {
        return PaymentStrategyHandler.pay(paymentBody);
    }
}
```

Với cấu trúc này, hệ thống khác có thể gọi đến `PaymentStrategyHandler` để xử lý các phương thức thanh toán khác nhau một cách dễ dàng và linh hoạt, đồng thời dễ dàng mở rộng với các phương thức thanh toán mới trong tương lai.

### Singleton Pattern

### 3.3 Mẫu Singleton

Đoạn mã minh họa:

```java
// Singleton kiểu Lazy Initialization (Sử dụng lớp nội bộ tĩnh)
class Singleton {
    // Hàm khởi tạo private để ngăn chặn việc khởi tạo bên ngoài
    private Singleton() {}

    // Viết một lớp nội bộ tĩnh, lớp này chứa một thuộc tính tĩnh Singleton
    private static class SingletonInstance {
        // Khởi tạo đối tượng Singleton duy nhất
        private static final Singleton INSTANCE = new Singleton();
    }

    // Phương thức synchronized để lấy thể hiện Singleton
    public static synchronized Singleton getInstance() {
        return SingletonInstance.INSTANCE;
    }
}
```

### 3.4 Proxy Pattern

Proxy Pattern cung cấp một đại diện để kiểm soát truy cập tới một đối tượng khác.

Proxy Pattern thực tế được ứng dụng rất rộng rãi trong cuộc sống hàng ngày. Ví dụ kinh điển nhất là việc chủ nhà ủy quyền cho trung gian (môi giới) để cho thuê nhà. Bài viết này sẽ giải thích và minh họa bằng mã nguồn cho Proxy Pattern sử dụng ví dụ này.

#### Mã nguồn minh họa

Tạo một lớp Subject:

```java
/**
 * Lớp hoạt động, mục đích là cho thuê nhà
 */
public interface Subject {
    /**
     * Interface thuê nhà
     */
    void rentHouse();
}
```

Định nghĩa một vai trò chủ nhà, lớp hiện thực cho hoạt động:

```java
/**
 * Chủ nhà
 */
public class HouseOwner implements Subject {
    /**
     * Hiện thực phương thức thuê nhà
     */
    @Override
    public void rentHouse() {
        System.out.println("Chủ nhà đã cho thuê nhà thành công...");
    }
}
```

Định nghĩa một đối tượng proxy trung gian:

```java
/**
 * Lớp trung gian đại diện
 *
 * Thông thường, chúng ta không thể liên hệ trực tiếp với chủ nhà, vì vậy cần một lớp đại diện, tức là lớp trung gian.
 */
public class HouseProxy implements Subject {
    private HouseOwner houseOwner = new HouseOwner();

    @Override
    public void rentHouse() {
        System.out.println("Trung gian thu phí môi giới, giúp chủ nhà cho thuê nhà...");
        houseOwner.rentHouse();
    }
}
```

Mô phỏng người dùng tìm trung gian để thuê nhà:

```java
public class Client {
    public static void main(String[] args) {
        // Tạo đối tượng trung gian
        Subject houseProxy = new HouseProxy();
        
        // Người dùng thuê nhà thông qua trung gian
        houseProxy.rentHouse();
    }
}
```

Khi chạy chương trình, kết quả sẽ là:
```
Trung gian thu phí môi giới, giúp chủ nhà cho thuê nhà...
Chủ nhà đã cho thuê nhà thành công...
```

### 3.5 Factory Method Pattern

Ở phần trước, chúng ta đã đề cập đến Simple Factory Pattern. Sự khác biệt giữa Factory Method và Simple Factory nằm ở chỗ Simple Factory có ưu điểm lớn nhất là bao gồm các logic cần thiết để tạo các đối tượng động theo điều kiện lựa chọn của khách hàng, loại bỏ sự phụ thuộc vào các sản phẩm cụ thể từ phía khách hàng.

Factory Method (Phương pháp Nhà máy) định nghĩa một interface để tạo đối tượng, cho phép các lớp con quyết định việc thể hiện lớp nào. Phương pháp này trì hoãn việc thể hiện đối tượng đến các lớp con. Nói cách khác, nó cung cấp một phương pháp ủy quyền logic thể hiện cho các lớp con.

#### Ví dụ mã nguồn:

Định nghĩa lớp nhà máy `NetworkConfigFactoryService`:

```java
package com.universal.core.designPatterns.factoryMethod.factory;

import com.universal.core.designPatterns.factoryMethod.NetworkConfigCrudService;

public interface NetworkConfigFactoryService {
    /**
     * Lấy lớp xử lý logic cụ thể
     * 
     * @param productType
     * @return
     */
    NetworkConfigCrudService getSpecificService(String productType);
}
```

Lớp triển khai của `NetworkConfigFactoryService`:

```java
@Service
public class NetworkConfigFactoryServiceImpl implements NetworkConfigFactoryService {

    private final AServiceImpl aService;
    private final BServiceImpl bService;
    private final CServiceImpl cService;
    private final DServiceImpl dService;

    @Override
    public NetworkConfigCrudService getSpecificService(String productType) {
        NetworkConfigCrudService networkConfigCrudService = null;
        switch(productType) {
            case "A":
                networkConfigCrudService = aService;
                break;
            case "B":
                networkConfigCrudService = bService;
                break;
            case "C":
                networkConfigCrudService = cService;
                break;
            case "D":
                networkConfigCrudService = dService;
                break;
        }
        return networkConfigCrudService;
    }
}
```

Định nghĩa interface hoạt động mạng `NetworkConfigCrudService`:

```java
public interface NetworkConfigCrudService {
    NetworkConfigVO getNetwork(NetworkConfigDTO networkConfigDTO);
}
```

Các lớp triển khai tương ứng với các logic khác nhau là `AServiceImpl`, `BServiceImpl`, `CServiceImpl`, `DServiceImpl`:

```java
@Service
public class AServiceImpl implements NetworkConfigCrudService {
    @Override
    public NetworkConfigVO getNetwork(NetworkConfigDTO networkConfigDTO) {
        return new NetworkConfigVO();
    }
}

@Service
public class BServiceImpl implements NetworkConfigCrudService {
    @Override
    public NetworkConfigVO getNetwork(NetworkConfigDTO networkConfigDTO) {
        return new NetworkConfigVO();
    }
}

@Service
public class CServiceImpl implements NetworkConfigCrudService {
    @Override
    public NetworkConfigVO getNetwork(NetworkConfigDTO networkConfigDTO) {
        return new NetworkConfigVO();
    }
}

@Service
public class DServiceImpl implements NetworkConfigCrudService {
    @Override
    public NetworkConfigVO getNetwork(NetworkConfigDTO networkConfigDTO) {
        return new NetworkConfigVO();
    }
}
```

Lớp điều khiển `NetworkConfigController`:

```java
@RestController
@Slf4j
@RequestMapping(value = "/networkConfig")
public class NetworkConfigController {
    private final NetworkConfigFactoryService factoryService;

    @PostMapping(value = "/getNetworkDetails", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiResult<NetworkConfigVO> getNetworkDetails(@RequestBody NetworkConfigDTO networkConfigDTO) {
        // Lấy lớp xử lý logic AService
        NetworkConfigCrudService aService = factoryService.getSpecificService("A");
        NetworkConfigVO network = aService.getNetwork(networkConfigDTO);
        return ApiResult.success(network);
    }
}
```

### 3.6 Observer Pattern

Observer Pattern định nghĩa sự phụ thuộc một-nhiều giữa các đối tượng. Khi một đối tượng thay đổi trạng thái, tất cả các đối tượng phụ thuộc của nó sẽ nhận được thông báo và tự động cập nhật.

#### Khái niệm ban đầu về Observer Pattern: Báo chí và người đăng ký = Observer Pattern.

**Các điểm chính:**

- Observer Pattern định nghĩa mối quan hệ một-nhiều giữa các đối tượng.
- Chủ đề (Subject) sử dụng một interface chung để cập nhật các Observer.
- Các Observer và Subject được kết hợp với nhau bằng cách gắn kết lỏng lẻo. Subject không biết chi tiết của các Observer, chỉ biết rằng các Observer đã triển khai interface Observer.
- Khi sử dụng mẫu này, bạn có thể đẩy hoặc kéo dữ liệu từ Subject (cách đẩy được coi là chính xác hơn).
- Khi có nhiều Observer, không nên dựa vào thứ tự thông báo cụ thể.
- Java cung cấp nhiều cách triển khai Observer Pattern, bao gồm java.util.Observable, mặc dù cần lưu ý về các vấn đề của việc triển khai Observable này. Nếu cần thiết, có thể tự triển khai Observable của riêng bạn.
- Spring cũng sử dụng Observer Pattern rộng rãi, ví dụ như ListenerEvent để đăng ký và phát hành thông báo.

#### Ví dụ:

Chúng ta sẽ lấy ví dụ về một trạm thời tiết. Thông tin thời tiết biểu thị cho Subject, bảng thông báo thời tiết biểu thị cho các Observer. Khi thời tiết thay đổi (Subject), sẽ thông báo cho tất cả các Observer và gọi phương thức của chúng để xử lý dữ liệu.

Một đối tượng `WeatherData` chịu trách nhiệm theo dõi tình hình thời tiết hiện tại (nhiệt độ, độ ẩm, áp suất). Chúng ta sẽ tạo một ứng dụng có ba bảng thông báo, lần lượt hiển thị tình trạng hiện tại, thống kê thời tiết và dự báo đơn giản. Khi đối tượng `WeatherData` nhận được dữ liệu đo lường mới nhất, ba bảng thông báo phải được cập nhật theo thời gian thực.

**Phân tích đối tượng của ứng dụng giám sát thời tiết:**

Ba phần của hệ thống này là:

- Trạm thời tiết (thiết bị vật lý để lấy dữ liệu thời tiết thực tế)
- Đối tượng `WeatherData` (dữ liệu cuối cùng từ trạm thời tiết và cập nhật bảng thông báo)
- Bảng thông báo (hiển thị tình hình thời tiết hiện tại cho người dùng)

**Triển khai trạm thời tiết:**

*interface Subject:*

```java
interface Subject {
    // Đăng ký Observer
    public void registerObserver(Observer o);

    // Xóa Observer
    public void removeObserver(Observer o);

    // Khi trạng thái của Subject thay đổi, phương thức này sẽ được gọi để thông báo cho tất cả các Observer
    public void notifyObserver();
}
```

*interface Observer:*

```java
interface Observer {
    // Khi giá trị quan sát thay đổi, Subject sẽ truyền các giá trị trạng thái này cho Observer dưới dạng tham số của phương thức
    public void update(float temp, float humidity, float pressure);
}
```

*Interface Display:*

```java
interface Display {
    // Khi cần hiển thị bảng thông báo, gọi phương thức này
    public void display();
}
```

*Triển khai interface Subject trong `WeatherData`:*

```java
class WeatherData implements Subject {
    private ArrayList<Observer> observers;
    private float temperature;
    private float humidity;
    private float pressure;

    public WeatherData() {
        observers = new ArrayList<Observer>();
    }

    @Override
    public void registerObserver(Observer o) {
        observers.add(o);
    }

    @Override
    public void removeObserver(Observer o) {
        int i = observers.indexOf(o);
        if (i >= 0) {
            observers.remove(i);
        }
    }

    @Override
    public void notifyObserver() {
        for (Observer observer : observers) {
            observer.update(temperature, humidity, pressure);
        }
    }

    // Khi nhận được giá trị quan sát mới từ trạm thời tiết, thông báo cho Observer
    public void measurementsChanged() {
        notifyObserver();
    }

    public void setMeasurements(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        measurementsChanged();
    }

    // Các phương thức khác của WeatherData
}
```

*Tạo bảng thông báo:*

```java
class CurrentConditionDisplay implements Observer, Display {
    private float temperature;
    private float humidity;
    private float pressure;
    private Subject weatherData;

    public CurrentConditionDisplay(Subject weatherData) {
        this.weatherData = weatherData;
        weatherData.registerObserver(this);
    }

    @Override
    public void display() {
        System.out.println("Đây là dữ liệu thời tiết cập nhật từ trạm khí tượng...");
    }

    @Override
    public void update(float temp, float humidity, float pressure) {
        this.temperature = temp;
        this.humidity = humidity;
        this.pressure = pressure;
        display();
    }
}
```

*Sử dụng hỗ trợ tích hợp để ghi đè `WeatherData`:*

```java
class WeatherDataTWO extends Observable {
    private float temperature;
    private float humidity;
    private float pressure;

    public WeatherDataTWO() { }

    public void measurementsChanged() {
        // Gọi setChanged() trước khi notifyObservers() để chỉ định trạng thái đã thay đổi
        setChanged();
        // Không truyền đối tượng dữ liệu khi gọi notifyObservers, có nghĩa là phương pháp kéo được sử dụng.
        notifyObservers();
    }

    public void setMeasurements(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        measurementsChanged();
    }

    public float getTemperature() {
        return temperature;
    }

    public float getHumidity() {
        return humidity;
    }

    public float getPressure() {
        return pressure;
    }
}
```

*Sử dụng tích hợp Observer để ghi đè bảng thông báo:*

```java
class CurrentConditionsDisplay implements java.util.Observer, Display {
    Observable observable;
    private float temperature;
    private float humidity;

    public CurrentConditionsDisplay(Observable observable) {
        this.observable = observable;
        observable.addObserver(this);
    }

    @Override
    public void display() {
        System.out.println("Đây là dữ liệu thời tiết cập nhật từ trạm khí tượng...");
    }

    @Override
    public void update(Observable o, Object arg) {
        if (o instanceof WeatherDataTWO) {
            WeatherDataTWO weatherDataTWO = (WeatherDataTWO) o;
            this.temperature = weatherDataTWO.getTemperature();
            this.humidity = weatherDataTWO.getHumidity();
            display();
        }
    }
}
```

### 3.7 Template Method Pattern

Template Method Pattern là một mẫu thiết kế hành vi. Mẫu này được sử dụng để tạo các phương thức rỗng và hoãn một số bước thực hiện cho các lớp con.

Phương thức khuôn mẫu định nghĩa các bước thực hiện của một thuật toán. Nó có thể cung cấp các bước triển khai mặc định có thể sử dụng chung cho tất cả hoặc một phần các lớp con. Hãy cùng xem qua một ví dụ đơn giản để hiểu về mẫu này: giả sử chúng ta muốn cung cấp một thuật toán để xây dựng nhà. Các bước xây dựng nhà gồm: xây dựng móng, xây dựng trụ, xây dựng tường và cửa sổ.

Một điểm quan trọng là chúng ta không thể thay đổi thứ tự thực hiện vì không thể xây cửa sổ trước khi có móng. Trong trường hợp này, chúng ta có thể tạo một phương thức khuôn mẫu để xây nhà với các phương thức khác nhau. Móng nhà cho tất cả các loại nhà đều giống nhau, dù là nhà gỗ, nhà kính hay nhà bê tông.

Chúng ta có thể cung cấp một triển khai cơ bản cho móng nhà, và nếu các lớp con muốn ghi đè phương thức này, họ có thể lựa chọn. Tuy nhiên, trong đa số trường hợp, tất cả các loại nhà đều giống nhau. Để đảm bảo các lớp con không ghi đè phương thức khuôn mẫu, chúng ta nên đánh dấu nó là phương thức cuối cùng (final).

#### Lớp trừu tượng Template Method

Vì chúng ta muốn một số phương thức được các lớp con triển khai, chúng ta phải đặt lớp cơ sở của chúng ta là lớp trừu tượng.

**Định nghĩa lớp trừu tượng `HouseTemplate`**

```java
public abstract class HouseTemplate {

    /**
     * buildHouse() là phương thức khuôn mẫu, định nghĩa thứ tự thực hiện các bước
     * template method, final nên các lớp con không thể ghi đè
     */
    public final void buildHouse() {
        // Xây dựng móng
        buildFoundation();
        // Xây dựng trụ
        buildPillars();
        // Xây dựng tường
        buildWalls();
        // Xây dựng cửa sổ
        buildWindows();
        System.out.println("House is built successfully");
    }

    private void buildFoundation() {
        System.out.println("Building foundation with cement, iron rods and sand");
    }

    /**
     * Các phương thức sẽ được các lớp con triển khai
     */
    public abstract void buildPillars();
    public abstract void buildWalls();

    /**
     * Triển khai mặc định
     */
    private void buildWindows() {
        System.out.println("Building Glass Windows");
    }
}
```

**Nhà gỗ (WoodenHouse)**

```java
package com.universal.core.designPatterns.templateMethod;

/**
 * Nhà gỗ
 */
public class WoodenHouse extends HouseTemplate {
    @Override
    public void buildPillars() {
        System.out.println("Building Pillars With Wood coating...");
    }

    @Override
    public void buildWalls() {
        System.out.println("Building Wooden Walls...");
    }
}
```

**Nhà kính (GlassHouse)**

```java
package com.universal.core.designPatterns.templateMethod;

/**
 * Nhà kính
 */
public class GlassHouse extends HouseTemplate {

    @Override
    public void buildPillars() {
        System.out.println("Building Pillars With Glass coating...");
    }

    @Override
    public void buildWalls() {
        System.out.println("Building Glass Walls...");
    }
}
```

**Nhà bê tông (ConcreteHouse)**

```java
package com.universal.core.designPatterns.templateMethod;

/**
 * Nhà bê tông
 */
public class ConcreteHouse extends HouseTemplate {
    @Override
    public void buildPillars() {
        System.out.println("Building Pillars With Concrete coating...");
    }

    @Override
    public void buildWalls() {
        System.out.println("Building Concrete Walls...");
    }
}
```

**Client xây dựng nhà (HousingClient)**

```java
package com.universal.core.designPatterns.templateMethod;

public class HousingClient {

    public static void main(String[] args) {
        HouseTemplate houseBuilder = new WoodenHouse();
        houseBuilder.buildHouse();

        System.out.println("--------------");

        houseBuilder = new GlassHouse();
        houseBuilder.buildHouse();

        System.out.println("--------------");
        
        houseBuilder = new ConcreteHouse();
        houseBuilder.buildHouse();
    }
}
```

**Kết quả đầu ra:**

```
Building foundation with cement, iron rods and sand
Building Pillars With Wood coating...
Building Wooden Walls...
Building Glass Windows
House is built successfully
--------------
Building foundation with cement, iron rods and sand
Building Pillars With Glass coating...
Building Glass Walls...
Building Glass Windows
House is built successfully
--------------
Building foundation with cement, iron rods and sand
Building Pillars With Concrete coating...
Building Concrete Walls...
Building Glass Windows
House is built successfully

Process finished with exit code 0
```

### 3.8 Adapter Pattern

Adapter Pattern là một mẫu thiết kế cấu trúc. Mẫu này chuyển đổi interface của một lớp thành một interface khác mà các khách hàng mong muốn. Adapter cho phép các lớp vốn không thể tương thích vì khác interface có thể làm việc cùng nhau.

#### Phân Tích Các Vai Trò Trong Mẫu Adapter

- **Interface Mục Tiêu (Target Interface)**: Đây là interface mà khách hàng mong đợi. Mục tiêu có thể là một lớp cụ thể hoặc trừu tượng, hoặc có thể là một interface.
- **Đối Tượng Cần Được Thích Ứng (Source Adaptee)**: Đối tượng này cần được thích ứng để phù hợp với interface mục tiêu.
- **Bộ Thích Ứng (Adapter)**: Đây là lớp bao bọc đối tượng cần thích ứng và chuyển đổi interface của nó thành interface mục tiêu.

#### Ví Dụ Minh Họa

Giả sử bạn dùng macbook chỉ có cổng usb type-c và muốn kết nối mạng bằng cáp mạng. Trong trường hợp này, chúng ta cần một đầu chuyển đổi, hay còn gọi là bộ thích ứng, để có thể kết nối mạng.

**Lớp Thích Ứng**

Đầu tiên, chúng ta có một cáp mạng với chức năng kết nối mạng, nhưng đầu kết nối của nó không tương thích với cổng của máy tính:

```java
// Lớp cần thích ứng: Cáp mạng
public class Adaptee {
    // Chức năng: Kết nối mạng
    public void request() {
        System.out.println("Kết nối cáp mạng để truy cập internet");
    }
}
```

Chúng ta định nghĩa một interface USB, tức là interface mục tiêu:

```java
// interface bộ chuyển đổi
public interface NetToUsb {
    // Chức năng: Xử lý yêu cầu, cáp mạng => USB
    public void handleRequest();
}
```

Định nghĩa một bộ thích ứng kế thừa cáp mạng và triển khai interface USB:

```java
// Bộ thích ứng thực sự, kết nối USB và cáp mạng
public class Adapter extends Adaptee implements NetToUsb {
    @Override
    public void handleRequest() {
        // Có thể kết nối mạng
        super.request();
    }
}
```

Triển khai việc kết nối mạng:

```java
// Lớp khách hàng: Muốn kết nối mạng nhưng không thể trực tiếp
public class Computer {
    // Máy tính cần kết nối với bộ chuyển đổi để có thể kết nối mạng
    public void net(NetToUsb adapter) {
        // Triển khai kết nối mạng: tìm một bộ chuyển đổi
        adapter.handleRequest();
    }

    public static void main(String[] args) {
        // Máy tính, bộ chuyển đổi, cáp mạng
        Computer computer = new Computer(); // Máy tính
        Adapter adapter = new Adapter(); // Bộ chuyển đổi
        computer.net(adapter); // Máy tính kết nối trực tiếp với bộ chuyển đổi
    }
}
```

#### Ứng Adapter Pattern

Một số ví dụ về ứng dụng của Adapter Pattern trong Java:

- `java.util.Arrays#asList()`
- `java.util.Collections#list()`
- `java.util.Collections#enumeration()`
- `javax.xml.bind.annotation.adapters.XMLAdapter`

## 4. Tổng Kết

Mẫu thiết kế (Design pattern) đại diện cho những phương pháp tốt nhất thường được các nhà phát triển phần mềm có kinh nghiệm trong lĩnh vực hướng đối tượng áp dụng. Mẫu thiết kế là các giải pháp chung cho các vấn đề phát sinh trong quá trình phát triển phần mềm.

Những giải pháp này là kết quả của nhiều lần thử và sai của nhiều nhà phát triển phần mềm trong một khoảng thời gian dài. Đối với các chuyên gia phát triển công nghệ cao, việc hiểu về triết lý và cách thực hiện của các mẫu thiết kế là rất quan trọng. Nội dung chia sẻ ở đây kết thúc.