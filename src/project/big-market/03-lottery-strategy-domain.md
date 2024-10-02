---
title: Lottery Strategy Domain
tags:
  - project
categories:
  - project
order: 5
---
## **I. Mục tiêu của chương này**

Thông qua việc phân tích các chức năng sản phẩm trong nền tảng big market, chúng ta sẽ thiết kế mô hình chiến lược quay số trúng thưởng và cấu trúc bảng cơ sở dữ liệu. Chiến lược quay số là một chức năng cốt lõi trong quá trình quay số, đặc biệt là trong các chức năng sản phẩm được thể hiện trong khóa học này, cần một cấu trúc bảng dữ liệu tốt hơn để hỗ trợ việc thực hiện mô hình domain.

## **II. Nội dung giải thích**

Phần này sẽ thông qua việc phân tích, phân tách, đưa ra vấn đề và giải quyết vấn đề để cùng nhau làm rõ mô hình chiến lược quay số và thông tin cấu trúc bảng tương ứng.

![](https://article-images.zsxq.com/FrNxfy4C6klISCr8qhjbezVB7Gtn)

1. Phân tích và tách rời toàn bộ các domain cốt lõi của nền tảng big market, phân tích mối quan hệ liên kết giữa các chức năng domain.
2. Tập trung vào mô hình chiến lược quay số, thông qua phân tích chức năng sản phẩm, hoàn thành việc hiểu rõ chức năng domain và thiết kế cấu trúc bảng dữ liệu.

## **III. Hiểu biết về domain**

Tôi đã mở rộng chức năng quay số của toàn bộ nền tảng big market, từ đó hỗ trợ việc thực hiện mở rộng nhiều chức năng khác.

![](https://article-images.zsxq.com/FneS159mh275DXpKFwFuvHQ8AO_t)

1. Đầu tiên, nếu quay số không thêm các biện pháp khác nhau, khả năng thực thi của một cách chơi duy nhất là khá thấp. Vì vậy, ở đây đã thêm các chức năng như: điểm ngẫu nhiên, giá trị may mắn, và mở khóa quay số.
2. Sau đó, kết hợp với các chức năng này, liệt kê 1~9 nội dung mà cần phải xem xét chi tiết khi thiết kế cấu trúc bảng. 【Kèm theo video hướng dẫn thiết kế bảng dữ liệu có thể tham khảo】

## **IV. Bắt đầu chuẩn bị**

### **1. Tạo nhánh mới**

1. Mỗi bài học tạo một nhánh mới, khi học, bạn cũng nên tạo một nhánh. Như vậy, nếu viết sai, bạn có thể quay lại.
2. Sau khi tạo nhánh, có thể sử dụng Ctrl+Shift+K để đẩy nhánh của bạn lên kho.
3. Sau khi hoàn thành phát triển, đảm bảo chức năng được kiểm tra bình thường, bạn có thể hợp nhất nhánh vào nhánh master và đẩy lên một lần nữa. Tức là thao tác Merge trong hình chỉ là nhấp chuột phải vào nhánh của bạn và chọn Merge xxx into master.

### **2. Cài đặt môi trường**

![](https://article-images.zsxq.com/Fv52lC7QlSYU5klSbGXghQw0ifgI)

1. Nếu bạn chưa có môi trường MySQL, có thể sử dụng Docker để cài đặt. Chỉ cần thực hiện như hình là có thể cài đặt, tập lệnh compose này cũng có thể thực thi trên máy chủ.
2. Lưu ý: Máy tính chạy Windows cần cài đặt Docker + Windows WLS2.

## **V. Tạo bảng cơ sở dữ liệu**

#### **3.1 Bảng chiến lược tổng quát**

```sql
-- ----------------------------  
-- Table structure for strategy  
-- ----------------------------  
DROP TABLE IF EXISTS `strategy`;  
CREATE TABLE `strategy` (  
                            `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Auto-increment ID',  
                            `strategy_id` bigint NOT NULL COMMENT 'Lottery strategy ID',  
                            `strategy_desc` varchar(128) NOT NULL COMMENT 'Lottery strategy description',  
                            `rule_models` varchar(256) DEFAULT NULL COMMENT 'Rule models, rules configured models synchronized to this table for easy use',  
                            `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',  
                            `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',  
                            PRIMARY KEY (`id`),  
                            KEY `idx_strategy_id` (`strategy_id`)  
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;  
  
-- ----------------------------  
-- Records of strategy  
-- ----------------------------  
BEGIN;  
INSERT INTO `strategy` (`id`, `strategy_id`, `strategy_desc`, `rule_models`, `create_time`, `update_time`) VALUES (1, 100001, 'Lottery Strategy', 'rule_weight,rule_blacklist', '2023-12-09 09:37:19', '2023-12-09 18:06:34');  
COMMIT;
```

#### **3.2 Bảng chiến lược giải thưởng**

```sql
-- ----------------------------  
-- Table structure for strategy_award  
-- ----------------------------  
DROP TABLE IF EXISTS `strategy_award`;  
CREATE TABLE `strategy_award` (  
                                  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Auto-increment ID',  
                                  `strategy_id` bigint NOT NULL COMMENT 'Lottery strategy ID',  
                                  `award_id` int NOT NULL COMMENT 'Lottery award ID - used internally',  
                                  `award_title` varchar(128) NOT NULL COMMENT 'Lottery award title',  
                                  `award_subtitle` varchar(128) DEFAULT NULL COMMENT 'Lottery award subtitle',  
                                  `award_count` int NOT NULL DEFAULT '0' COMMENT 'Total award stock',  
                                  `award_count_surplus` int NOT NULL DEFAULT '0' COMMENT 'Remaining award stock',  
                                  `award_rate` decimal(6,4) NOT NULL COMMENT 'Award winning probability',  
                                  `rule_models` varchar(256) DEFAULT NULL COMMENT 'Rule models, rules configured models synchronized to this table for easy use',  
                                  `sort` int NOT NULL DEFAULT '0' COMMENT 'Sorting',  
                                  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',  
                                  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Modification time',  
                                  PRIMARY KEY (`id`),  
                                  KEY `idx_strategy_id_award_id` (`strategy_id`,`award_id`)  
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;  
  
-- ----------------------------  
-- Records of strategy_award  
-- ----------------------------  
BEGIN;  
INSERT INTO `strategy_award` (`id`, `strategy_id`, `award_id`, `award_title`, `award_subtitle`, `award_count`, `award_count_surplus`, `award_rate`, `rule_models`, `sort`, `create_time`, `update_time`) VALUES (1, 100001, 101, 'Random Credits', NULL, 80000, 80000, 0.3000, 'rule_random,rule_luck_award', 1, '2023-12-09 09:38:31', '2023-12-23 13:03:15');  
INSERT INTO `strategy_award` (`id`, `strategy_id`, `award_id`, `award_title`, `award_subtitle`, `award_count`, `award_count_surplus`, `award_rate`, `rule_models`, `sort`, `create_time`, `update_time`) VALUES (2, 100001, 102, '5 Uses', NULL, 10000, 10000, 0.2000, 'rule_luck_award', 2, '2023-12-09 09:39:18', '2023-12-23 13:59:56');  
INSERT INTO `strategy_award` (`id`, `strategy_id`, `award_id`, `award_title`, `award_subtitle`, `award_count`, `award_count_surplus`, `award_rate`, `rule_models`, `sort`, `create_time`, `update_time`) VALUES (3, 100001, 103, '10 Uses', NULL, 5000, 5000, 0.2000, 'rule_luck_award', 3, '2023-12-09 09:42:36', '2023-12-23 14:00:00');  
INSERT INTO `strategy_award` (`id`, `strategy_id`, `award_id`, `award_title`, `award_subtitle`, `award_count`, `award_count_surplus`, `award_rate`, `rule_models`, `sort`, `create_time`, `update_time`) VALUES (4, 100001, 104, '20 Uses', NULL, 4000, 4000, 0.1000, 'rule_luck_award', 4, '2023-12-09 09:43:15', '2023-12-23 14:00:10');  
INSERT INTO `strategy_award` (`id`, `strategy_id`, `award_id`, `award_title`, `award_subtitle`, `award_count`, `award_count_surplus`, `award_rate`, `rule_models`, `sort`, `create_time`, `update_time`) VALUES (5, 100001, 105, 'Add GPT-4 Conversation Model', NULL, 600, 600, 0.1000, 'rule_luck_award', 5, '2023-12-09 09:43:47', '2023-12-23 14:00:12');  
INSERT INTO `strategy_award` (`id`, `strategy_id`, `award_id`, `award_title`, `award_subtitle`, `award_count`, `award_count_surplus`, `award_rate`, `rule_models`, `sort`, `create_time`, `update_time`) VALUES (6, 100001, 106, 'Add DALL-E 2 Image Model', NULL, 200, 200, 0.0500, 'rule_luck_award', 6, '2023-12-09 09:44:20', '2023-12-23 14:00:58');  
INSERT INTO `strategy_award` (`id`, `strategy_id`, `award_id`, `award_title`, `award_subtitle`, `award_count`, `award_count_surplus`, `award_rate`, `rule_models`, `sort`, `create_time`, `update_time`) VALUES (7, 100001, 107, 'Add DALL-E 3 Image Model', 'Unlock after 1 lottery draw', 200, 200, 0.0400, 'rule_lock,rule_luck_award', 7, '2023-12-09 09:45:38', '2023-12-23 14:01:02');  
INSERT INTO `strategy_award` (`id`, `strategy_id`, `award_id`, `award_title`, `award_subtitle`, `award_count`, `award_count_surplus`, `award_rate`, `rule_models`, `sort`, `create_time`, `update_time`) VALUES (8, 100001, 108, 'Add 100 Uses', 'Unlock after 2 lottery draws', 199, 199, 0.0099, 'rule_lock,rule_luck_award', 8, '2023-12-09 09:46:02', '2023-12-23 14:05:36');  
INSERT INTO `strategy_award` (`id`, `strategy_id`, `award_id`, `award_title`, `award_subtitle`, `award_count`, `award_count_surplus`, `award_rate`, `rule_models`, `sort`, `create_time`, `update_time`) VALUES (9, 100001, 109, 'Unlock All Models', 'Unlock after 6 lottery draws', 1, 1, 0.0001, 'rule_lock,rule_luck_award', 9, '2023-12-09 09:46:39', '2023-12-09 12:20:50');  
INSERT INTO `strategy_award` (`id`, `strategy_id`, `award_id`, `award_title`, `award_subtitle`, `award_count`, `award_count_surplus`, `award_rate`, `rule_models`, `sort`, `create_time`, `update_time`) VALUES (10, 100002, 101, 'Random Credits', NULL, 1, 1, 0.5000, 'rule_random,rule_luck_award', 1, '2023-12-09 09:46:39', '2023-12-23 14:23:51');  
INSERT INTO `strategy_award` (`id`, `strategy_id`, `award_id`, `award_title`, `award_subtitle`, `award_count`, `award_count_surplus`, `award_rate`, `rule_models`, `sort`, `create_time`, `update_time`) VALUES (11, 100002, 102, '5 Uses', NULL, 1, 1, 0.1000, 'rule_random,rule_luck_award', 2, '2023-12-09 09:46:39', '2023-12-23 14:23:51');  
COMMIT;
```

#### **3.3 Bảng chiến lược quy tắc**

```sql
-- ----------------------------  
-- Table structure for strategy_rule  
-- ----------------------------  
DROP TABLE IF EXISTS `strategy_rule`;  
CREATE TABLE `strategy_rule` (  
                                 `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Auto-increment ID',  
                                 `strategy_id` int NOT NULL COMMENT 'Lottery strategy ID',  
                                 `award_id` int DEFAULT NULL COMMENT 'Lottery prize ID [Not required if rule type is strategy]',  
                                 `rule_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Abstract rule type; 1-Strategy rule, 2-Prize rule',  
                                 `rule_model` varchar(16) NOT NULL COMMENT 'Lottery rule type [rule_random - Random value calculation, rule_lock - Unlock after a certain number of attempts, rule_luck_award - Lucky award (fallback prize)]',  
                                 `rule_value` varchar(64) NOT NULL COMMENT 'Lottery rule value',  
                                 `rule_desc` varchar(128) NOT NULL COMMENT 'Lottery rule description',  
                                 `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',  
                                 `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',  
                                 PRIMARY KEY (`id`),  
                                 KEY `idx_strategy_id_award_id` (`strategy_id`,`award_id`)  
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;  
  
-- ----------------------------  
-- Records of strategy_rule  
-- ----------------------------  
BEGIN;  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (1, 100001, 101, 2, 'rule_random', '1,1000', 'Random points strategy', '2023-12-09 10:05:30', '2023-12-09 12:55:52');  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (2, 100001, 107, 2, 'rule_lock', '1', 'Unlock after 1 attempt', '2023-12-09 10:16:41', '2023-12-09 12:55:53');  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (3, 100001, 108, 2, 'rule_lock', '2', 'Unlock after 2 attempts', '2023-12-09 10:17:43', '2023-12-09 12:55:54');  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (4, 100001, 109, 2, 'rule_lock', '6', 'Unlock after 6 attempts', '2023-12-09 10:17:43', '2023-12-09 12:55:54');  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (5, 100001, 107, 2, 'rule_luck_award', '1,100', 'Fallback prize with random points up to 100', '2023-12-09 10:30:12', '2023-12-09 12:55:55');  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (6, 100001, 108, 2, 'rule_luck_award', '1,100', 'Fallback prize with random points up to 100', '2023-12-09 10:30:43', '2023-12-09 12:55:56');  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (7, 100001, 101, 2, 'rule_luck_award', '1,10', 'Fallback prize with random points up to 10', '2023-12-09 10:30:43', '2023-12-09 12:55:57');  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (8, 100001, 102, 2, 'rule_luck_award', '1,20', 'Fallback prize with random points up to 20', '2023-12-09 10:30:43', '2023-12-09 12:55:57');  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (9, 100001, 103, 2, 'rule_luck_award', '1,30', 'Fallback prize with random points up to 30', '2023-12-09 10:30:43', '2023-12-09 12:55:58');  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (10, 100001, 104, 2, 'rule_luck_award', '1,40', 'Fallback prize with random points up to 40', '2023-12-09 10:30:43', '2023-12-09 12:55:59');  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (11, 100001, 105, 2, 'rule_luck_award', '1,50', 'Fallback prize with random points up to 50', '2023-12-09 10:30:43', '2023-12-09 12:56:00');  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (12, 100001, 106, 2, 'rule_luck_award', '1,60', 'Fallback prize with random points up to 60', '2023-12-09 10:30:43', '2023-12-09 12:56:00');  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (13, 100001, NULL, 1, 'rule_weight', '6000,102,103,104,105,106,107,108,109', 'Consume 6000 points, guaranteed prize range', '2023-12-09 10:30:43', '2023-12-09 12:58:21');  
INSERT INTO `strategy_rule` (`id`, `strategy_id`, `award_id`, `rule_type`, `rule_model`, `rule_value`, `rule_desc`, `create_time`, `update_time`) VALUES (14, 100001, NULL, 1, 'rule_blacklist', '1', 'Blacklist lottery, fallback points', '2023-12-09 12:59:45', '2023-12-09 13:42:23');  
COMMIT;
```

## **VI. Kiểm tra và xác minh**

1. Sau khi tạo bảng dữ liệu xong, hãy xuất câu lệnh tạo bảng và đặt vào thư mục docs/dev-ops/mysql/sql. Lưu ý rằng câu lệnh tạo bảng không bao gồm lệnh tạo cơ sở dữ liệu, bạn có thể thêm nó nếu cần.

```sql
CREATE database if NOT EXISTS `raffle` default character set utf8mb4 collate utf8mb4_0900_ai_ci;

use `raffle`;
```

1. Thử chạy lại cài đặt docker-compose để đảm bảo có thể tự động tạo bảng dữ liệu. Điều này rất hữu ích khi triển khai ứng dụng trên dịch vụ đám mây trong tương lai.

## **VII. Bài tập cho độc giả**

1. Bài tập đơn giản: Hoàn thành nội dung trong phần này, hiểu rõ về domain và các trường của bảng dữ liệu. Ở phần sau, chúng ta sẽ kết hợp bảng dữ liệu để phát triển mã nguồn.
2. Bài tập khó: Hiện tại vẫn thiếu một bảng giải thưởng, độc giả có thể tự thiết kế. Gợi ý: [Thiết kế giải thưởng cần phải xem xét cách tích hợp vào thực tế].