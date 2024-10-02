---
title: Raffle Strategy Rule Weight
tags:
  - project
categories:
  - project
order: 8
---
# Sác xuất trong chiến lược xổ số

## **I. Yêu cầu của chương này**

Trong phân hệ rút thăm của nền tảng tiếp thị lớn, cần đáp ứng yêu cầu rằng sau khi người dùng rút thăm N điểm, phạm vi giải thưởng có thể trúng phải được thiết lập. Nói cách khác, nếu bạn đã tiêu tốn tổng cộng 6000 điểm để rút thăm, thì trong lần rút thăm tiếp theo, phạm vi giải thưởng sẽ được xác định trước, không cho phép người dùng nhận được giải thưởng có giá trị thấp hơn. Do đó, khi thiết kế và thực hiện hệ thống, chúng ta cần xử lý việc cài đặt các quy tắc trọng số khác nhau.

## **II. Thiết kế quy trình**

Trong quá trình thực hiện, chúng ta cần kết hợp lắp ráp xác suất tổng thể từ phần trước, tiến hành phân tách thành lắp ráp và sử dụng theo nguyên tắc đơn lẻ của giao diện. Sau đó, trong giao diện lắp ráp, tái cấu trúc các thao tác lắp ráp để đáp ứng việc xử lý lắp ráp cho các chiến lược trọng số. — Tại đây, các phương thức được bổ sung vào đối tượng thực thể.

![](https://article-images.zsxq.com/FuevrtGsf5ERuujYm9ncJHMMNoL9)

1. Thu thập và sắp xếp quy trình thiết kế hệ thống, thực hiện xử lý lắp ráp trước cho các quy tắc rút thăm có trọng số sẽ được sử dụng sau này.
2. Tất cả dữ liệu lắp ráp sẽ được lưu trữ trong cấu trúc dữ liệu Redis Map. Chiến lược lắp ráp trọng số là sự kết hợp giữa ID chiến lược và giá trị trọng số.
3. Khi người dùng thực hiện rút thăm từ nhà máy lắp ráp, họ có thể rút thăm bằng cách sử dụng ID chiến lược hoặc kết hợp giữa ID chiến lược và giá trị trọng số.

## **III. Thực hiện chức năng**

### **1. Cấu trúc dự án**

![](https://article-images.zsxq.com/FmvyNh6Gw67qZTL_Rpl06wQfcAvj)

1. Đầu tiên, tách giao diện lắp ráp thành hai phần: giao diện lắp ráp và giao diện điều phối. Điều này giúp duy trì nguyên tắc đơn lẻ của giao diện và tránh việc phía sử dụng gọi các thao tác lắp ráp. Lắp ráp là thao tác được khởi tạo khi tạo hoặc kiểm tra hoạt động.
2. Phần này sẽ bổ sung các chức năng thuộc về thực thể vào đối tượng thực thể, giúp mã nguồn sạch hơn và thể hiện vai trò của đối tượng thực thể.

### **2. Thực hiện lắp ráp**

Lắp ráp từ việc lắp ráp toàn bộ chiến lược ban đầu mở rộng để hỗ trợ lắp ráp trọng số.

**Mã nguồn:** [cn.bugstack.domain.strategy.service.armory.StrategyArmoryDispatch](http://cn.bugstack.domain.strategy.service.armory.StrategyArmoryDispatch)

```java
@Override
public boolean assembleLotteryStrategy(Long strategyId) {
    // 1. Truy vấn cấu hình chiến lược
    List<StrategyAwardEntity> strategyAwardEntities = repository.queryStrategyAwardList(strategyId);
    assembleLotteryStrategy(String.valueOf(strategyId), strategyAwardEntities);

    // 2. Cấu hình chiến lược trọng số - áp dụng cho cấu hình quy tắc rule_weight
    StrategyEntity strategyEntity = repository.queryStrategyEntityByStrategyId(strategyId);
    String ruleWeight = strategyEntity.getRuleWeight();
    if (null == ruleWeight) return true;

    StrategyRuleEntity strategyRuleEntity = repository.queryStrategyRule(strategyId, ruleWeight);
    if (null == strategyRuleEntity) {
        throw new AppException(ResponseCode.STRATEGY_RULE_WEIGHT_IS_NULL.getCode(), ResponseCode.STRATEGY_RULE_WEIGHT_IS_NULL.getInfo());
    }

    Map<String, List<Integer>> ruleWeightValueMap = strategyRuleEntity.getRuleWeightValues();
    Set<String> keys = ruleWeightValueMap.keySet();

    for (String key : keys) {
        List<Integer> ruleWeightValues = ruleWeightValueMap.get(key);
        ArrayList<StrategyAwardEntity> strategyAwardEntitiesClone = new ArrayList<>(strategyAwardEntities);
        strategyAwardEntitiesClone.removeIf(entity -> !ruleWeightValues.contains(entity.getAwardId()));
        assembleLotteryStrategy(String.valueOf(strategyId).concat("_").concat(key), strategyAwardEntitiesClone);
    }

    return true;
}
```

![](https://article-images.zsxq.com/FvApq9uRi_T0NAJfXes9F3Vptw_4)

1. Như hình, đối với **[Phần 3: Xử lý lắp ráp xác suất chiến lược](https://t.zsxq.com/153HMmsaI)**, phần này đã tái cấu trúc mã nguồn của StrategyArmoryDispatch#assembleLotteryStrategy để hỗ trợ lắp ráp chiến lược có trọng số.
2. Lắp ráp chiến lược có trọng số đọc các giá trị cấu hình trọng số từ bảng cơ sở dữ liệu tương ứng với chiến lược: 4000:102,103,104,105, 5000:102,103,104,105,106,107, 6000:102,103,104,105,106,107,108,109. Tách các cấu hình này thành ba nhóm 4000, 5000, 6000, mỗi nhóm cấu hình chứa ID giải thưởng cần tạo ra giá trị xác suất rút thăm.
3. Cuối cùng, người dùng có thể rút thăm bằng cách sử dụng kết hợp ID chiến lược và giá trị trọng số. — Bạn có thể xem chi tiết trong bài kiểm tra đơn vị StrategyTest#test_getRandomAwardId_ruleWeightValue.

### **3. Đối tượng thực thể**

Trong quá trình lắp ráp rút thăm có trọng số, cần bổ sung phương thức tương ứng vào đối tượng thực thể, để tập hợp phương thức thuộc về thực thể với đối tượng thực thể, đồng thời tập trung hành vi và logic vào một đối tượng.

**Mã nguồn:** [org.apache.commons.lang3.StringUtils.StrategyEntity](http://org.apache.commons.lang3.StringUtils.StrategyEntity)

```java
public class StrategyEntity {

    /** ID chiến lược rút thăm */
    private Long strategyId;

    /** Mô tả chiến lược rút thăm */
    private String strategyDesc;

    /** Mô hình quy tắc rút thăm rule_weight, rule_blacklist */
    private String ruleModels;

    public String[] ruleModels() {
        if (StringUtils.isBlank(ruleModels)) return null;
        return ruleModels.split(Constants.SPLIT);
    }

    public String getRuleWeight() {
        String[] ruleModels = this.ruleModels();
        for (String ruleModel : ruleModels) {
            if ("rule_weight".equals(ruleModel)) return ruleModel;
        }
        return null;
    }
}
```

**Mã nguồn:** [org.apache.commons.lang3.StringUtils.StrategyRuleEntity](http://org.apache.commons.lang3.StringUtils.StrategyRuleEntity)

```java
public class StrategyRuleEntity {

    /** ID chiến lược rút thăm */
    private Long strategyId;

    /** ID giải thưởng rút thăm [nếu loại quy tắc là chiến lược, không cần ID giải thưởng] */
    private Integer awardId;

    /** Loại quy tắc trừu tượng; 1- Quy tắc chiến lược, 2- Quy tắc giải thưởng */
    private Integer ruleType;

    /** Loại quy tắc rút thăm [rule_random - Tính toán giá trị ngẫu nhiên, rule_lock - Giải khóa sau vài lần rút thăm, rule_luck_award - Giải thưởng may mắn (giải thưởng dự phòng)] */
    private String ruleModel;

    /** Tỷ lệ quy tắc rút thăm */
    private String ruleValue;

    /** Mô tả quy tắc rút thăm */
    private String ruleDesc;

    /**
     * Lấy giá trị trọng số
     * Dữ liệu mẫu: 4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108,109
     */
    public Map<String, List<Integer>> getRuleWeightValues() {
        if (!"rule_weight".equals(ruleModel)) return null;

        String[] ruleValueGroups = ruleValue.split(Constants.SPACE);
        Map<String, List<Integer>> resultMap = new HashMap<>();

        for (String ruleValueGroup : ruleValueGroups) {
            if (ruleValueGroup == null || ruleValueGroup.isEmpty()) {
                return resultMap;
            }

            String[] parts = ruleValueGroup.split(Constants.COLON);
            if (parts.length != 2) {
                throw new IllegalArgumentException("Đầu vào định dạng không hợp lệ cho rule_weight: " + ruleValueGroup);
            }

            String[] valueStrings = parts[1].split(Constants.SPLIT);
            List<Integer> values = new ArrayList<>();
            for (String valueString : valueStrings) {
                values.add(Integer.parseInt(valueString));
            }

            resultMap.put(ruleValueGroup, values);
        }

        return resultMap;
    }
}
```

Để đơn giản hóa việc gọi hàm, ngoài các phương thức thuộc về thực thể, bạn cũng có thể mở rộng thêm một số chức năng khác. Điều này giúp quy trình trở nên đơn giản hơn.

## **IV. Kiểm tra và xác nhận**

1. Trước khi kiểm tra, hãy cài đặt môi trường Docker và đảm bảo rằng MySQL và Redis hoạt động bình thường.
2. Nếu xảy ra lỗi **java.lang.OutOfMemoryError: GC overhead limit exceeded** trong quá trình lắp ráp 100001, bạn

 có thể thêm tham số vào JVM để khắc phục.

**Kiểm tra đơn vị:** [cn.bugstack.middleware.lottery.test.infrastructure.LotteryContextTest](http://cn.bugstack.middleware.lottery.test.infrastructure.LotteryContextTest)

**Lưu ý:** Đối với việc phát triển và kiểm tra, có thể sử dụng các công cụ như JUnit hoặc TestNG để thực hiện các kiểm tra đơn vị nhằm xác nhận tính chính xác của chức năng.