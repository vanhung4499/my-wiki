---
title: Raffle Probability Strategy
tags:
  - project
categories:
  - project
order: 7
---
# Thuật toán xổ số
## **I. Mục Tiêu Của Chương Này**

Bắt đầu từ chương này, chúng ta sẽ tiến hành phát triển các yêu cầu thực tế. Đầu tiên, chúng ta sẽ lập ra quy trình kinh doanh, sau đó liên tục triển khai các chức năng của từng module trong quy trình này. Điều này bao gồm việc triển khai chiến lược rút thăm trúng thưởng, trong đó sẽ cần sử dụng đến truy vấn cơ sở dữ liệu, tính toán giá trị chiến lược và lưu trữ dữ liệu trên Redis Map. Trong quá trình này, cách thức triển khai phát triển theo kiến trúc phân lớp DDD cũng sẽ được thể hiện.

**Lưu ý**: Về kiến thức thuật toán rút thăm trúng thưởng.

Có hai loại thuật toán rút thăm: một là đổi không gian lấy thời gian, hai là đổi thời gian lấy không gian. Trong các phương án, đổi không gian lấy thời gian có nghĩa là tính toán trước phân bố xác suất rút thăm và lưu trữ trên bộ nhớ nội bộ (guava) hoặc Redis, sau đó khi rút thăm, giá trị ngẫu nhiên được tạo ra sẽ xác định kết quả trong không gian này với độ phức tạp là O(1).

Tuy nhiên, cần lưu ý rằng, bộ nhớ nội bộ nhanh hơn, còn Redis thì chậm hơn một chút nhưng có thể giải quyết vấn đề lưu trữ phân tán. Bộ nhớ nội bộ cần các máy phân tán khác nhau duy trì việc cập nhật dữ liệu đồng bộ, điều này yêu cầu phải có trung tâm cấu hình và các phương pháp kiểm tra định kỳ để xử lý việc tải dữ liệu vào bộ nhớ trước khi ứng dụng khởi động hoặc trong quá trình chạy, khi có thêm hoặc thay đổi hoạt động.

Loại còn lại là đổi thời gian lấy không gian, tức là việc tính toán rút thăm có thể được thực hiện khi giá trị ngẫu nhiên được tạo ra, sau đó so sánh với phạm vi xác suất trong vòng lặp. Phương pháp này thích hợp cho những trường hợp cần không gian lớn để lưu trữ xác suất rút thăm, không hiệu quả khi sử dụng các phương pháp khác. Trong chương trình, có thể đặt điều kiện rằng khi tổng giá trị xác suất vượt quá 1 triệu, thì không lưu trữ mà chuyển sang so sánh vòng lặp. Tuy nhiên, mọi phương pháp đều phải phù hợp với yêu cầu thực tế.

## **II. Giới Thiệu Yêu Cầu**

### **1. Quy Trình**

Dưới góc nhìn của người dùng, chúng ta sẽ lập ra toàn bộ quy trình. 【Như hình】

![](https://article-images.zsxq.com/FhiurFVHAoOjhR0p7WD39A-HHr4i)

Quá trình này bao gồm: chiến lược xổ số, giải thưởng chiến lược, quy tắc chiến lược, và phát hành giải thưởng. Khi xem hình này, bạn có thể kết hợp với bảng cơ sở dữ liệu để suy nghĩ. Trong phần này, chúng ta sẽ triển khai chiến lược rút thăm để sử dụng trong các lần rút thăm sau này.

### **2. Mô Tả Thuật Toán**

Có hai phương pháp triển khai thuật toán xổ số:

![](https://article-images.zsxq.com/FiJ42JDXPmkMSc19DG1TPl317JXP)

1.  Dựa trên giá trị xác suất, bạn có thể tạo ra các phạm vi cộng dồn. Ví dụ, A chiếm 10 đơn vị, phạm vi của B sẽ là từ 10+40 đến 50 đơn vị. Khi thực hiện rút thăm, giá trị ngẫu nhiên sẽ được so sánh với các phạm vi này.
2.  Cách khác là lưu trữ vào Map, đổi không gian lấy thời gian. Khi rút thăm, giá trị ngẫu nhiên sẽ được sử dụng làm chỉ số để lấy kết quả giải thưởng tương ứng. Trong phần này, chúng ta sẽ triển khai phương pháp thứ hai.

## **III. Triển Khai Chức Năng**

### **1. Cấu Trúc Dự Án**

![](https://article-images.zsxq.com/FqGV0Npd5NzBLARGf0OQRB671ub2)

1.  Trong phần này, cần mở rộng thêm cấu hình Redis, thao tác trên bảng cơ sở dữ liệu, và triển khai lớp lưu trữ để xử lý việc gọi dữ liệu.
2.  Redis cần cho phần này đã được cài đặt bằng Docker trong thư mục `doc/dev-ops/environment`.

### **2. Cài Đặt Môi Trường**

\# Lệnh thực thi `docker-compose up -d`

```yaml
version: '3.9'

services:
  mysql:
    image: mysql:8.0.32
    container_name: mysql
    command: --default-authentication-plugin=mysql_native_password
    restart: always
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: 123456
    networks:
      - my-network
    ports:
      - "13306:3306"
    volumes:
      - ./mysql/sql:/docker-entrypoint-initdb.d
    healthcheck:
      test: [ "CMD", "mysqladmin" ,"ping", "-h", "localhost" ]
      interval: 5s
      timeout: 10s
      retries: 10
      start_period: 15s
    volumes_from:
      - mysql-job-dbdata

  mysql-job-dbdata:
    image: alpine:3.18.2
    container_name: mysql-job-dbdata
    volumes:
      - /var/lib/mysql

  phpmyadmin:
    image: phpmyadmin:5.2.1
    container_name: phpmyadmin
    hostname: phpmyadmin
    ports:
      - 8899:80
    environment:
      - PMA_HOST=mysql
      - PMA_PORT=3306
      - MYSQL_ROOT_PASSWORD: 123456
    networks:
      - my-network

  redis:
    image: redis:7.2.0
    container_name: redis
    restart: always
    hostname: redis
    privileged: true
    ports:
      - 16379:6379
    volumes:
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    networks:
      - my-network
    healthcheck:
      test: [ "CMD", "redis-cli", "ping" ]
      interval: 10s
      timeout: 5s
      retries: 3

  redis-admin:
    image: spryker/redis-commander:0.8.0
    container_name: redis-admin
    hostname: redis-commander
    restart: always
    ports:
      - 8081:8081
    environment:
      - REDIS_HOSTS=local:redis:6379
      - HTTP_USER=admin
      - HTTP_PASSWORD=admin
    networks:
      - my-network

networks:
  my-network:
    driver: bridge
```

![](https://article-images.zsxq.com/FpgBx5UYU70XNXailuuh6j_GG0ot)

1.  Lưu ý: Khi thực thi script cài đặt, hãy chú ý các tập tin cấu hình tương ứng. Nếu bạn cài đặt trên server cloud, nhớ tải các tập tin qua FTP.
2.  Bạn có thể sử dụng giao diện quản lý Portainer để xóa bỏ MySQL đã cài đặt trước đó và cài đặt lại theo script này, đồng thời cài đặt cả Redis.

### **3. Logic Cốt Lõi**

**Mã nguồn**: [cn.bugstack.domain.strategy.service.armory.StrategyArmory](http://cn.bugstack.domain.strategy.service.armory.StrategyArmory)

```java
@Slf4j
@Service
public class StrategyArmory implements IStrategyArmory {

  @Resource
  private IStrategyRepository repository;

  @Override
  public boolean assembleLotteryStrategy(Long strategyId) {
    // 1. Truy vấn cấu hình chiến lược
    List<StrategyAwardEntity> strategyAwardEntities = repository.queryStrategyAwardList(strategyId);

    // 2. Lấy giá trị xác suất nhỏ nhất
    BigDecimal minAwardRate = strategyAwardEntities.stream()
        .map(StrategyAwardEntity::getAwardRate)
        .min(BigDecimal::compareTo)
        .orElse(BigDecimal.ZERO);

    // 3. Lấy tổng giá trị xác suất
    BigDecimal totalAwardRate = strategyAwardEntities.stream()
        .map(StrategyAwardEntity::getAwardRate)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    // 4. Dùng 1% 0.0001 để lấy phạm vi xác suất
    BigDecimal rateRange = totalAwardRate.divide(minAwardRate, 0, RoundingMode.CEILING);

    // 5. Tạo bảng tra cứu xác suất chiến lược
    List<Integer> strategyAwardSearchRateTables = new ArrayList<>(rateRange.intValue());
    for (StrategyAwardEntity strategyAward : strategyAwardEntities) {
      Integer awardId = strategyAward.getAwardId();
      BigDecimal awardRate = strategyAward.getAwardRate();
      for (int i = 0; i < rateRange.multiply(awardRate).setScale(0, RoundingMode.CEILING).intValue(); i++) {
        strategyAwardSearchRateTables.add(awardId);
      }
    }

   

 // 6. Lưu trữ Redis, đổi không gian lấy thời gian
    String redisKey = String.format("lottery_strategy_rate:%s", strategyId);
    repository.saveLotteryStrategyRedis(redisKey, strategyAwardSearchRateTables);
    log.info("Tạo bảng tra cứu xác suất chiến lược thành công，strategyId：{}", strategyId);
    return true;
  }

  @Override
  public Long drawAwardByRate(Long strategyId) {
    // 1. Truy vấn bảng tra cứu xác suất chiến lược
    String redisKey = String.format("lottery_strategy_rate:%s", strategyId);
    List<Integer> strategyAwardSearchRateTables = repository.queryStrategyAwardRedis(redisKey);
    if (strategyAwardSearchRateTables.isEmpty()) return null;

    // 2. Lấy ngẫu nhiên
    int random = ThreadLocalRandom.current().nextInt(strategyAwardSearchRateTables.size());
    return strategyAwardSearchRateTables.get(random).longValue();
  }

}
```

**Kho chứa chiến lược (Strategy Armory), chịu trách nhiệm khởi tạo tính toán chiến lược:**

1. Truy vấn cấu hình chiến lược
2. Lấy giá trị xác suất nhỏ nhất
3. Lấy tổng giá trị xác suất
4. Sử dụng giá trị 1% 0.0001 để tạo ra phạm vi xác suất, bao gồm các mức phần trăm, phần nghìn, phần vạn
5. Tạo bảng tra cứu xác suất cho các phần thưởng trong chiến lược (ở đây đề cập đến việc lưu trữ các phần thưởng tương ứng trong danh sách, phần thưởng càng có nhiều vị trí chiếm dụng thì xác suất càng cao)
6. Thực hiện thao tác trộn thứ tự các phần thưởng đã lưu trữ để tránh việc các số ngẫu nhiên sinh ra luôn trùng với các phần thưởng cố định ở đầu danh sách.
7. Tạo ra tập hợp Map, trong đó key là giá trị xác suất. Thông qua xác suất để lấy được ID phần thưởng tương ứng
8. Lưu trữ vào Redis

**Lưu ý**: Ở đây, `IStrategyRepository` được triển khai bởi tầng kho chứa dữ liệu.

## **IV. Kiểm tra và xác nhận**

Trước khi kiểm tra, cần hoàn thành cài đặt môi trường Docker và đảm bảo rằng MySQL và Redis có thể sử dụng bình thường.

**📢 Lưu ý**: Trong bảng dữ liệu của chương này, chiến lược có ID 100001 có phạm vi xác suất rất lớn, với giá trị nhỏ nhất là 0.0001 (sau dấu thập phân bốn chữ số), điều này sẽ tạo ra một tập hợp dữ liệu map rất lớn (chuyển đổi sang số nguyên). Nếu cấu hình máy tính thấp, có thể chạy không hiệu quả (cũng có thể điều chỉnh cấu hình JVM), bạn có thể thử với chiến lược 100002 hoặc điều chỉnh xác suất của 100001 từ giá trị bốn chữ số 0.0001 thành 0.001 hoặc 0.01. Hãy nhớ rằng tổng xác suất trong chương này phải bằng 1 (trong các chương sau, thuật toán mới sẽ không yêu cầu tổng xác suất bằng 1).

### **1. Lắp ráp chiến lược**

```java
/**
* ID chiến lược: 100001L, 100002L - Lắp ráp khi tạo bảng chiến lược và lưu trữ vào Redis Map
*/
@Test
public void test_strategyArmory() {
    boolean success = strategyArmory.assembleLotteryStrategy(100002L);
    log.info("Kết quả kiểm tra: {}", success);
}
```

1. Địa chỉ: **[http://0.0.0.0:8081/](http://0.0.0.0:8081/)**
2. Bước này dùng để lắp ráp dữ liệu vào Redis, sau khi hoàn thành, bạn có thể truy cập giao diện quản lý Redis để kiểm tra.

### **2. Thực hiện rút thăm**

```java
/**
* Lấy ngẫu nhiên ID phần thưởng từ chiến lược đã lắp ráp
*/
@Test
public void test_getAssembleRandomVal() {
    log.info("Kết quả kiểm tra: {} - ID phần thưởng", strategyArmory.getRandomAwardId(100002L));
}
```

**23-12-23.16:53:43.798 [main] INFO StrategyTest** - **Kết quả kiểm tra: 101 - ID phần thưởng**

## **V. Bài tập cho độc giả**

1. Bài tập đơn giản: Hoàn thành nội dung chương này, hiểu rõ trách nhiệm của các module trong phân lớp DDD và thiết kế, triển khai thuật toán trong chương này.
2. Bài tập nâng cao: Có thể suy nghĩ về các phương thức triển khai thuật toán rút thăm khác và viết mã triển khai. Giá trị xác suất trong chương này có sai số, đã được sửa đổi trong các chương sau từ chương 7 trở đi. Nhánh code tại: [https://gitcode.net/KnowledgePlanet/big-market/big-market/-/tree/240121-xfg-strategy-fix](https://gitcode.net/KnowledgePlanet/big-market/big-market/-/tree/240121-xfg-strategy-fix) "Khuyến nghị tự kiểm tra và so sánh mã nguồn trước khi tham khảo nhánh này".