---
title: Distributed Transaction
tags:
  - java
  - microservice
categories:
  - project
order: 11
---
# PmHub - Distributed Transaction with Seata

Bài viết này chủ yếu nói về cách sử dụng Seata để đảm bảo tính nhất quán của trạng thái phê duyệt nhiệm vụ trong hệ thống PmHub.

Giao dịch phân tán luôn là một chủ đề phỏng vấn được ưa chuộng, nhưng tôi nhận thấy các hướng dẫn trên mạng thường tập trung nhiều vào lý thuyết mà ít liên kết với các dự án thực tế. Trong khi đó, phỏng vấn thường dựa trên những tình huống thực tiễn để kiểm tra kiến thức của ứng viên. Mục tiêu của chúng ta là kết hợp lý thuyết với thực hành, giúp bạn tránh được nhiều trở ngại.

Thông qua bài viết này, bạn sẽ hiểu rõ về giao dịch phân tán và cách sử dụng nó trong PmHub. Đây sẽ là nền tảng vững chắc từ lý thuyết đến thực hành!

**<font style="color:#DF2A3F;">Bài viết này chứa đầy kiến thức thiết thực và rất quan trọng trong phỏng vấn!</font>**

::: info
+ Để đảm bảo tính nhất quán của trạng thái phê duyệt nhiệm vụ, chúng tôi sử dụng **chế độ AT của giao dịch phân tán Seata**.
:::

## Giao dịch

Chúng ta hãy tưởng tượng một tình huống:

::: info
Giả sử người dùng A chuyển 100 nhân dân tệ cho người dùng B, quy trình này bao gồm các bước sau:

1. Trừ 100 nhân dân tệ từ tài khoản của người dùng A.
2. Cộng 100 nhân dân tệ vào tài khoản của người dùng B.

Hai bước này hoặc phải thực hiện thành công cả hai, hoặc không thực hiện gì. Nếu bước 1 đã trừ 100 nhân dân tệ nhưng xảy ra lỗi khi thực hiện bước 2, chúng ta muốn số tiền trong tài khoản của người dùng A trở về trạng thái ban đầu.
:::

Đây là một ví dụ điển hình về giao dịch. Giao dịch là gì? Nói đơn giản, giao dịch là một tập hợp các thao tác logic, **hoặc tất cả đều thực hiện, hoặc không thực hiện gì cả**.

Dưới đây là một bộ câu hỏi kinh điển để kiểm tra hiểu biết về bốn tính chất của giao dịch, hãy ghi nhớ để chuẩn bị cho phỏng vấn.

::: info
### Bốn tính chất của giao dịch (ACID)

1. **Tính nguyên tử (Atomicity)**:
    - Tất cả các thao tác trong giao dịch hoặc thành công, hoặc thất bại. Ngay cả trong trường hợp hệ thống gặp sự cố, giao dịch vẫn đảm bảo không thực hiện chỉ một phần của thao tác.
    - **Ví dụ**: Trong thao tác chuyển khoản, việc trừ tiền từ tài khoản này và cộng tiền vào tài khoản khác phải thành công hoặc thất bại toàn bộ.
2. **Tính nhất quán (Consistency)**:
    - Trước và sau khi thực hiện giao dịch, cơ sở dữ liệu phải ở trạng thái nhất quán. Mọi giao dịch đều phải đảm bảo cơ sở dữ liệu chuyển từ một trạng thái nhất quán này sang một trạng thái nhất quán khác.
    - **Ví dụ**: Sau khi chuyển khoản, tổng số tiền trong hai tài khoản vẫn phải giữ nguyên.
3. **Tính cách ly (Isolation)**:
    - Các giao dịch đồng thời không được ảnh hưởng lẫn nhau, trạng thái trung gian của một giao dịch không thể bị các giao dịch khác nhìn thấy.
    - **Ví dụ**: Hai thao tác chuyển khoản diễn ra cùng lúc sẽ không ảnh hưởng lẫn nhau, và mỗi thao tác không thấy được trạng thái trung gian của thao tác kia.
4. **Tính bền vững (Durability)**:
    - Một khi giao dịch đã được hoàn thành, kết quả của nó là vĩnh viễn, ngay cả khi hệ thống bị sự cố, kết quả giao dịch cũng không bị mất.
    - **Ví dụ**: Sau khi chuyển khoản thành công, ngay cả khi hệ thống khởi động lại, biến động số tiền trong tài khoản vẫn tồn tại.
:::

## Giao dịch cục bộ

Trong ứng dụng đơn thể, các giao dịch thường là giao dịch cục bộ. Ví dụ, trong Spring Boot, khi thêm annotation @Transactional vào phương thức, chúng ta đang thực hiện một giao dịch cục bộ.

Trong hệ thống đơn thể, một thao tác có thể liên quan đến nhiều bảng, nhưng tất cả đều nằm trong cùng một cơ sở dữ liệu. Ví dụ, trong MySQL, một giao dịch có thể bao gồm nhiều câu lệnh SQL. Tất cả các câu lệnh này hoặc thành công, hoặc thất bại. MySQL hỗ trợ giao dịch qua engine **InnoDB**, trong khi **MyISAM** thì không hỗ trợ giao dịch.

Trong MySQL, giao dịch được quản lý bằng **redo log** và **undo log**. **redo log** giúp phục hồi trước khi giao dịch được cam kết, đảm bảo **tính bền vững**. **undo log** giúp phục hồi sau khi giao dịch được cam kết, đảm bảo **tính nguyên tử**. Dưới đây là một biểu đồ minh họa:

![pmhub-mysql-log.drawio.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/pmhub-mysql-log.drawio.png)


## Giao dịch phân tán

Trong hệ thống phân tán microservice, các hệ thống đơn thể ban đầu được chia nhỏ thành nhiều microservice. Ví dụ, trong PmHub, hệ thống được chia thành dịch vụ hệ thống, dịch vụ dự án, dịch vụ quy trình, v.v. Trong các ứng dụng thực tế, mỗi microservice có thể được triển khai trên các máy khác nhau và cơ sở dữ liệu của chúng cũng được tách biệt. Ví dụ, trong PmHub, dịch vụ pmhub-project sử dụng cơ sở dữ liệu pmhub-project, còn dịch vụ pmhub-workflow sử dụng cơ sở dữ liệu pmhub-workflow.

Trong trường hợp này, một thao tác có thể liên quan đến nhiều máy, nhiều dịch vụ, và nhiều cơ sở dữ liệu. Ví dụ, trong kịch bản thêm nhiệm vụ của PmHub:

![pmhub-add-task.drawio.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/pmhub-add-task.drawio.png)

Vậy làm thế nào để đảm bảo một thao tác **hoặc thực hiện thành công tất cả, hoặc thất bại tất cả**?

Chúng ta cần sử dụng giải pháp giao dịch phân tán. Giao dịch cục bộ giải quyết vấn đề nhất quán dữ liệu của một nguồn dữ liệu duy nhất, còn giao dịch phân tán giải quyết vấn đề nhất quán dữ liệu **đa nguồn**.

## Giải pháp giao dịch phân tán

Việc triển khai giao dịch phân tán chủ yếu có 6 giải pháp sau đây:

+ Giải pháp XA
+ Giải pháp TCC
+ Giải pháp SAGA
+ Bảng tin nhắn cục bộ
+ Giải pháp nhất quán cuối cùng của tin nhắn đáng tin cậy
+ Giải pháp thông báo tối đa

Trong đó, chuẩn XA đã phát triển thành giải pháp 2PC, 3PC không xâm nhập mã nghiệp vụ, còn TCC và SAGA thuộc các giải pháp có sự xâm nhập vào nghiệp vụ, và bảng tin nhắn cục bộ không hỗ trợ hoàn tác.

Mỗi giải pháp có các trường hợp sử dụng khác nhau, bảng dưới đây là so sánh giữa các giải pháp này:

| Giải pháp                                               | Mô tả                                                                                                                                                                                                                | Ưu điểm                                                                               | Nhược điểm                                                                                                         | Trường hợp sử dụng                                                                                     |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Giải pháp XA                                            | Hai giai đoạn xác nhận, sử dụng bộ quản lý giao dịch để điều phối nhiều cơ sở dữ liệu, thích hợp cho các giao dịch phân tán giữa nhiều cơ sở dữ liệu trong ứng dụng                                                  | Tính nhất quán mạnh                                                                   | Hiệu suất thấp, không phù hợp cho các tình huống yêu cầu đồng thời cao                                             | Ứng dụng đơn khối, giao dịch phân tán giữa nhiều cơ sở dữ liệu                                         |
| Giải pháp TCC                                           | Try-Confirm-Cancel, quản lý giao dịch qua ba giai đoạn, giai đoạn Try kiểm tra và dự trữ tài nguyên, giai đoạn Confirm thực hiện hành động, giai đoạn Cancel hoàn tác bồi thường                                     | Tính nhất quán mạnh, phù hợp với quy trình ngắn và tình huống yêu cầu đồng thời cao   | Mã hoàn tác phức tạp, khó bảo trì                                                                                  | Các trường hợp liên quan đến thanh toán, giao dịch tài chính                                           |
| Giải pháp SAGA                                          | Giao dịch hoàn tác, đảm bảo nhất quán cuối cùng thông qua giao dịch cục bộ và hành động hoàn tác, khi một giao dịch thất bại, thực hiện ngược lại các hành động đã thành công để hoàn tác                            | Không cần khóa, hiệu suất cao, các thành viên có thể thực hiện không đồng bộ          | Không đảm bảo tính cách ly của giao dịch                                                                           | Các quy trình nghiệp vụ dài, có sự tham gia của các công ty khác hoặc hệ thống kế thừa                 |
| Bảng tin nhắn cục bộ                                    | Chèn tin nhắn vào bảng tin nhắn trong giao dịch cục bộ và gửi tin nhắn đến MQ, người nhận xử lý tin nhắn trong giao dịch cục bộ và cập nhật trạng thái tin nhắn, nếu thất bại sẽ thử lại theo lịch                   | Đảm bảo tính nhất quán cuối cùng, phù hợp với tình huống yêu cầu đồng thời thấp       | Phụ thuộc nhiều vào bảng tin nhắn trong cơ sở dữ liệu, khả năng mở rộng kém trong tình huống yêu cầu đồng thời cao | Tình huống yêu cầu đồng thời thấp                                                                      |
| Giải pháp nhất quán cuối cùng của tin nhắn đáng tin cậy | Dựa trên MQ để thực hiện giao dịch, gửi tin nhắn dự phòng trước, sau khi thực hiện giao dịch cục bộ sẽ xác nhận hoặc hoàn tác tin nhắn, MQ sẽ kiểm tra trạng thái tin nhắn dự phòng theo lịch và gọi lại để xác nhận | Phù hợp với tình huống yêu cầu đồng thời cao, độ tin cậy cao                          | Xử lý phức tạp, nếu giao dịch của hệ thống B thất bại cần phải thử lại hoặc xử lý thủ công                         | Tình huống yêu cầu đồng thời cao, được sử dụng rộng rãi tại các công ty internet trong nước            |
| Giải pháp thông báo tối đa                              | Hệ thống A gửi tin nhắn đến MQ sau khi hoàn thành giao dịch cục bộ, dịch vụ thông báo tối đa sẽ tiêu thụ tin nhắn và gọi hệ thống B, nếu hệ thống B thất bại thì sẽ thử lại theo lịch, nếu vẫn thất bại sẽ bỏ qua    | Đơn giản, dễ thực hiện, phù hợp với những trường hợp không yêu cầu tính nhất quán cao | Không đảm bảo tính nhất quán tuyệt đối                                                                             | Các tình huống không yêu cầu tính nhất quán cao, chẳng hạn như các thao tác nghiệp vụ không quan trọng |

## Giới thiệu Seata

### Seata là gì?

Seata là một giải pháp giao dịch phân tán mã nguồn mở của Alibaba, là một khung giao dịch tự trị đơn giản và mở rộng được 👍.

+ Địa chỉ trang web chính thức: [https://seata.apache.org](https://seata.apache.org/)
+ Địa chỉ mã nguồn: [https://github.com/apache/incubator-seata](https://github.com/apache/incubator-seata)

Với Seata, chúng ta chỉ cần thêm annotation `@GlobalTransactional` tại những nơi cần sử dụng giao dịch phân tán.

![](https://seata.apache.org/assets/images/solution-1bdadb80e54074aa3088372c17f0244b.png)

### Cơ chế tổng thể

Seata hỗ trợ 3 chế độ: chế độ AT, chế độ TCC và chế độ Saga.

| Chế độ      | Mô tả                                                                                                                                                                                                           | Ưu điểm                                                                                        | Nhược điểm                                                                                                               | Các tình huống phù hợp                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Chế độ AT   | Giao dịch bồi thường tự động, tự động quản lý việc cam kết và rollback giao dịch thông qua proxy, phù hợp cho các tình huống đơn giản                                                                           | Dễ sử dụng, chi phí phát triển thấp, tự động quản lý giao dịch                                 | Phụ thuộc vào hỗ trợ của cơ sở dữ liệu, phù hợp với các tình huống đơn giản, không phù hợp với logic nghiệp vụ phức tạp | Tình huống nghiệp vụ đơn giản, như thao tác bảng đơn, các dịch vụ vi mô nhỏ                                                     |
| Chế độ TCC  | Try-Confirm-Cancel, nhà phát triển tự thực hiện logic nghiệp vụ của ba giai đoạn Try, Confirm và Cancel để đảm bảo tính nhất quán của giao dịch                                                                 | Cung cấp tính nhất quán mạnh, phù hợp cho các tình huống yêu cầu quản lý giao dịch nghiêm ngặt | Thực hiện phức tạp, chi phí phát triển cao, cần tự quản lý các giai đoạn của giao dịch                                   | Tình huống yêu cầu tính nhất quán cao và các thao tác nghiệp vụ ngắn, như hệ thống thanh toán, giao dịch liên quan đến tài chính |
| Chế độ Saga | Giao dịch dài, hoàn thành giao dịch chính thông qua một loạt các giao dịch con, các giao dịch con hoạt động độc lập, nếu một giao dịch con thất bại, sẽ thực hiện rollback các giao dịch đã thành công trước đó | Không cần khóa toàn cục, hiệu suất cao, phù hợp cho các tình huống giao dịch dài               | Cần phát triển logic bồi thường, có thể không đảm bảo tính nhất quán mạnh                                                | Tình huống nghiệp vụ dài, liên quan đến nhiều hệ thống hoặc dịch vụ, như quản lý đơn hàng, quản lý chuỗi cung ứng               |

### Chế độ AT

Chế độ AT thực chất là giao thức 2PC, phù hợp cho hầu hết các tình huống, cấu hình và sử dụng tương đối đơn giản. PmHub sử dụng chế độ AT, dưới đây là một quy trình cụ thể:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240919143501.png)


### Chế độ TCC

Chế độ TCC là chế độ hỗ trợ đưa các giao dịch con tùy chỉnh vào trong việc quản lý giao dịch toàn cục.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240919151242.png)


### Chế độ Saga

Chế độ Saga là giải pháp giao dịch dài do Seata cung cấp. Trong chế độ Saga, mỗi người tham gia trong quy trình nghiệp vụ sẽ thực hiện giao dịch cục bộ của mình. Khi một người tham gia thất bại, hệ thống sẽ thực hiện bồi thường các giao dịch đã thành công trước đó. Dịch vụ giai đoạn một (dịch vụ chính) và dịch vụ giai đoạn hai (dịch vụ bồi thường) đều do các nhà phát triển nghiệp vụ thực hiện.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240919151318.png)


Tiếp theo là phần thực hành giao dịch phân tán với Seata.

## Cài đặt và tải xuống Seata

### Tải xuống

Địa chỉ tải về: [https://seata.apache.org/unversioned/download/seata-server](https://seata.apache.org/unversioned/download/seata-server)

Tải phiên bản mới nhất 2.0.0

### Tạo cơ sở dữ liệu và bảng

Vì Seata sử dụng MySQL làm cơ sở dữ liệu có tính khả dụng cao, nên cần tạo một cơ sở dữ liệu `pmhub-seata` trong MySQL và nhập script cơ sở dữ liệu.

```sql

CREATE DATABASE  `pmhub-seata` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

USE `pmhub-seata`;

-- -------------------------------- The script used when storeMode is 'db' --------------------------------
-- the table to store GlobalSession data
CREATE TABLE IF NOT EXISTS `global_table`
(
    `xid`                       VARCHAR(128) NOT NULL,
    `transaction_id`            BIGINT,
    `status`                    TINYINT      NOT NULL,
    `application_id`            VARCHAR(32),
    `transaction_service_group` VARCHAR(32),
    `transaction_name`          VARCHAR(128),
    `timeout`                   INT,
    `begin_time`                BIGINT,
    `application_data`          VARCHAR(2000),
    `gmt_create`                DATETIME,
    `gmt_modified`              DATETIME,
    PRIMARY KEY (`xid`),
    KEY `idx_status_gmt_modified` (`status` , `gmt_modified`),
    KEY `idx_transaction_id` (`transaction_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- the table to store BranchSession data
CREATE TABLE IF NOT EXISTS `branch_table`
(
    `branch_id`         BIGINT       NOT NULL,
    `xid`               VARCHAR(128) NOT NULL,
    `transaction_id`    BIGINT,
    `resource_group_id` VARCHAR(32),
    `resource_id`       VARCHAR(256),
    `branch_type`       VARCHAR(8),
    `status`            TINYINT,
    `client_id`         VARCHAR(64),
    `application_data`  VARCHAR(2000),
    `gmt_create`        DATETIME(6),
    `gmt_modified`      DATETIME(6),
    PRIMARY KEY (`branch_id`),
    KEY `idx_xid` (`xid`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- the table to store lock data
CREATE TABLE IF NOT EXISTS `lock_table`
(
    `row_key`        VARCHAR(128) NOT NULL,
    `xid`            VARCHAR(128),
    `transaction_id` BIGINT,
    `branch_id`      BIGINT       NOT NULL,
    `resource_id`    VARCHAR(256),
    `table_name`     VARCHAR(32),
    `pk`             VARCHAR(36),
    `status`         TINYINT      NOT NULL DEFAULT '0' COMMENT '0:locked ,1:rollbacking',
    `gmt_create`     DATETIME,
    `gmt_modified`   DATETIME,
    PRIMARY KEY (`row_key`),
    KEY `idx_status` (`status`),
    KEY `idx_branch_id` (`branch_id`),
    KEY `idx_xid` (`xid`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `distributed_lock`
(
    `lock_key`       CHAR(20) NOT NULL,
    `lock_value`     VARCHAR(20) NOT NULL,
    `expire`         BIGINT,
    primary key (`lock_key`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('AsyncCommitting', ' ', 0);
INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('RetryCommitting', ' ', 0);
INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('RetryRollbacking', ' ', 0);
INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('TxTimeoutCheck', ' ', 0);

SET FOREIGN_KEY_CHECKS = 1;
```

### Thay đổi cấu hình

Chủ yếu là thay đổi cổng và cấu hình liên quan đến Nacos. Để tránh việc sửa cấu hình sai, hãy sao lưu cấu hình ban đầu.

Cấu hình như sau:

```yaml
# Cấu hình cổng dịch vụ
server:
  port: 7091

# Tên dịch vụ
spring:
  application:
    name: seata-server

# Cấu hình đăng nhập giao diện quản lý Seata
console:
  user:
    username: seata
    password: seata

# Cấu hình seata-server và đăng ký vào Nacos
seata:
  service:
    vgroup-mapping:
      default_tx_group: default
    disable-global-transaction: true

  config:
    type: nacos
    nacos:
      server-addr: 127.0.0.1:8848
      group: SEATA_GROUP
      username: nacos
      password: nacos

  registry:
    type: nacos
    nacos:
      application: seata-server
      server-addr: 127.0.0.1:8848
      group: SEATA_GROUP
      username: nacos
      password: nacos    

  store:
    mode: db
    db:
      url: jdbc:mysql://localhost:3306/pmhub-seata?characterEncoding=utf8&useSSL=false
      user: root
      password: 123456
```

### Khởi động Seata

Vào thư mục `bin` của Seata và khởi động theo hệ điều hành, ví dụ trên macOS có thể dùng lệnh:

```yaml
sh seata-server.sh
```

Truy cập: [http://localhost:7091/](http://localhost:7091/)

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240919152345.png)

Kiểm tra Nacos để xem Seata đã được khởi động và đăng ký thành công vào Nacos hay chưa.

## PmHub Thực Chiến - Thêm Nhiệm Vụ Quản Lý Giao Dịch

Khi tạo nhiệm vụ dự án, cần thêm hoặc cập nhật cài đặt phê duyệt, điều này yêu cầu gọi các dịch vụ giữa các cơ sở dữ liệu khác nhau và liên quan đến việc chỉnh sửa trên các cơ sở dữ liệu khác nhau trong các microservices khác nhau, do đó cần sử dụng xử lý giao dịch phân tán.

Dưới đây là sơ đồ quy trình cụ thể cho việc thêm nhiệm vụ:

![pmhub-add-task.drawio.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/pmhub-add-task.drawio.png)

### Thêm bảng `undo_log` vào cơ sở dữ liệu nghiệp vụ

Vì ở đây sử dụng chế độ AT của Seata, do đó cần tạo bảng `undo_log` ghi lại nhật ký quay lui trong cơ sở dữ liệu nghiệp vụ, cụ thể là các cơ sở dữ liệu `pmhub-project` và `pmhub-workflow`. Dưới đây là câu lệnh tạo bảng:


```sql
-- for AT mode you must to init this sql for you business database. the seata server not need it.
CREATE TABLE IF NOT EXISTS `undo_log`
(
    `branch_id`     BIGINT       NOT NULL COMMENT 'branch transaction id',
    `xid`           VARCHAR(128) NOT NULL COMMENT 'global transaction id',
    `context`       VARCHAR(128) NOT NULL COMMENT 'undo_log context,such as serialization',
    `rollback_info` LONGBLOB     NOT NULL COMMENT 'rollback info',
    `log_status`    INT(11)      NOT NULL COMMENT '0:normal status,1:defense status',
    `log_created`   DATETIME(6)  NOT NULL COMMENT 'create datetime',
    `log_modified`  DATETIME(6)  NOT NULL COMMENT 'modify datetime',
    UNIQUE KEY `ux_undo_log` (`xid`, `branch_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COMMENT ='AT transaction mode undo table';
ALTER TABLE `undo_log` ADD INDEX `ix_log_created` (`log_created`);
```

::: warning
Lưu ý quan trọng:

Nếu phiên bản của bạn gặp lỗi: "undo_log needs to contain the primary key", bạn cần thêm khóa chính thủ công cho bảng `undo_log`. Bạn cũng có thể sao chép SQL dưới đây để tạo bảng trực tiếp.

:::

```sql
-- for AT mode you must to init this sql for you business database. the seata server not need it.
CREATE TABLE IF NOT EXISTS `undo_log`
(
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `branch_id`     BIGINT       NOT NULL COMMENT 'branch transaction id',
    `xid`           VARCHAR(128) NOT NULL COMMENT 'global transaction id',
    `context`       VARCHAR(128) NOT NULL COMMENT 'undo_log context,such as serialization',
    `rollback_info` LONGBLOB     NOT NULL COMMENT 'rollback info',
    `log_status`    INT(11)      NOT NULL COMMENT '0:normal status,1:defense status',
    `log_created`   DATETIME(6)  NOT NULL COMMENT 'create datetime',
    `log_modified`  DATETIME(6)  NOT NULL COMMENT 'modify datetime',
    PRIMARY KEY (`id`),
    UNIQUE KEY `ux_undo_log` (`xid`, `branch_id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COMMENT ='AT transaction mode undo table';
ALTER TABLE `undo_log` ADD INDEX `ix_log_created` (`log_created`);

-- ----------------------------
-- Records of undo_log
-- ----------------------------
BEGIN;
COMMIT;
```

### Thêm phụ thuộc vào `pmhub-project`:

```xml
<!--Giao dịch phân tán-->
<dependency>
  <groupId>com.laigeoffer.pmhub-cloud</groupId>
  <artifactId>pmhub-base-seata</artifactId>
</dependency>
```

### Thêm cấu hình seata vào tệp cấu hình `pmhub-project-dev.yml`:

```yaml
# Giao dịch phân tán
seata:
  registry:
    type: nacos
    nacos:
      server-addr: 127.0.0.1:8848
      namespace: ""
      group: SEATA_GROUP
      application: seata-server
  tx-service-group: default_tx_group # Nhóm giao dịch, dùng để nhận tên của cụm TC service
  service:
    vgroup-mapping: 
      default_tx_group: default # Mối quan hệ ánh xạ giữa nhóm giao dịch và cụm dịch vụ TC
  data-source-proxy-mode: AT
```

****
### Thêm annotation `@GlobalTransactional` vào interface

```java
@Override
@GlobalTransactional(name = "pmhub-project-addTask", rollbackFor = Exception.class) // giao dịch phân tán seata, chế độ AT
public String add(TaskReqVO taskReqVO) {
    // Kiểm tra xid của giao dịch toàn cục (để dễ dàng theo dõi)
    String xid = RootContext.getXID();
    log.info("---------------Bắt đầu tạo nhiệm vụ: " + "\t" + "xid: " + xid);

    if (ProjectStatusEnum.PAUSE.getStatus().equals(projectTaskMapper.queryProjectStatus(taskReqVO.getProjectId()))) {
        throw new ServiceException("Dự án hiện đang tạm dừng, không thể thêm nhiệm vụ mới");
    }

    // 1. Thêm nhiệm vụ
    ProjectTask projectTask = new ProjectTask();
    if (StringUtils.isNotBlank(taskReqVO.getTaskId())) {
        projectTask.setTaskPid(taskReqVO.getTaskId());
    }
    BeanUtils.copyProperties(taskReqVO, projectTask);
    projectTask.setCreatedBy(SecurityUtils.getUsername());
    projectTask.setCreatedTime(new Date());
    projectTask.setUpdatedBy(SecurityUtils.getUsername());
    projectTask.setUpdatedTime(new Date());
    projectTaskMapper.insert(projectTask);

    // 2. Thêm thành viên nhiệm vụ
    insertMember(projectTask.getId(), 1, SecurityUtils.getUserId());

    // 3. Thêm nhật ký
    saveLog("addTask", projectTask.getId(), taskReqVO.getProjectId(), taskReqVO.getTaskName(), "Tham gia vào nhiệm vụ", null);

    // Thêm người thực hiện nhiệm vụ
    if (taskReqVO.getUserId() != null && !Objects.equals(taskReqVO.getUserId(), SecurityUtils.getUserId())) {
        insertMember(projectTask.getId(), 0, taskReqVO.getUserId());

        // Thêm nhật ký
        saveLog("invitePartakeTask", projectTask.getId(), taskReqVO.getProjectId(), taskReqVO.getTaskName(),
                "Mời " + projectMemberMapper.selectUserById(Collections.singletonList(taskReqVO.getUserId())).get(0).getNickName() + " tham gia vào nhiệm vụ", taskReqVO.getUserId());
    }

    // 4. Nhắc nhở về nhiệm vụ đã được chỉ định
    extracted(taskReqVO.getTaskName(), taskReqVO.getUserId(), SecurityUtils.getUsername(), projectTask.getId());

    // 5. Thêm hoặc cập nhật cài đặt phê duyệt (gọi từ xa đến microservice `pmhub-workflow`)
    ApprovalSetDTO approvalSetDTO = new ApprovalSetDTO(projectTask.getId(), ProjectStatusEnum.TASK.getStatusName(),
            taskReqVO.getApproved(), taskReqVO.getDefinitionId(), taskReqVO.getDeploymentId());
    R<?> result = wfDeployService.insertOrUpdateApprovalSet(approvalSetDTO, SecurityConstants.INNER);

    if (Objects.isNull(result) || Objects.isNull(result.getData())
            || R.fail().equals(result.getData())) {
        throw new ServiceException("Gọi từ xa đến dịch vụ phê duyệt thất bại");
    }
    log.info("---------------Kết thúc tạo nhiệm vụ: " + "\t" + "xid: " + xid);
    return projectTask.getId();
}
```

### Bảng dữ liệu

+ **pmhub_project_task**:

```sql
CREATE TABLE `pmhub_project_task` (
  `id` varchar(64) NOT NULL COMMENT 'Primary key id',
  `created_by` varchar(64) DEFAULT NULL COMMENT 'Creator',
  `created_time` datetime DEFAULT NULL COMMENT 'Creation time',
  `updated_by` varchar(64) DEFAULT NULL COMMENT 'Updater',
  `updated_time` datetime DEFAULT NULL COMMENT 'Update time',
  `task_name` varchar(100) DEFAULT NULL COMMENT 'Task name',
  `project_id` varchar(64) DEFAULT NULL COMMENT 'Project id',
  `task_priority` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Task priority',
  `user_id` bigint(20) NOT NULL COMMENT 'User id',
  `project_stage_id` varchar(64) NOT NULL COMMENT 'Project stage id',
  `description` varchar(500) DEFAULT NULL COMMENT 'Task description',
  `begin_time` datetime DEFAULT NULL COMMENT 'Planned start time',
  `end_time` datetime DEFAULT NULL COMMENT 'Planned end time',
  `close_time` datetime DEFAULT NULL COMMENT 'Deadline',
  `task_pid` varchar(64) DEFAULT NULL COMMENT 'Parent task',
  `assign_to` varchar(64) DEFAULT NULL COMMENT 'Assigned to',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Task status',
  `execute_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Execution status',
  `task_process` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'Task progress',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Deleted or not',
  `deleted_time` datetime DEFAULT NULL,
  `task_flow` varchar(200) DEFAULT NULL COMMENT 'Task flow',
  `task_type_id` varchar(64) DEFAULT NULL COMMENT 'Task type id',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx` (`id`,`project_id`,`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Project-Task table';
```

+ **pmhub_project_member**:

```sql
CREATE TABLE `pmhub_project_member` (
  `id` varchar(64) NOT NULL COMMENT 'Primary key id',
  `pt_id` varchar(64) NOT NULL COMMENT 'Project or task id',
  `user_id` bigint(20) NOT NULL COMMENT 'User id',
  `joined_time` datetime DEFAULT NULL COMMENT 'Join time',
  `created_by` varchar(100) DEFAULT NULL COMMENT 'Creator',
  `created_time` datetime DEFAULT NULL COMMENT 'Creation time',
  `updated_by` varchar(100) DEFAULT NULL COMMENT 'Updater',
  `updated_time` datetime DEFAULT NULL COMMENT 'Update time',
  `type` varchar(32) NOT NULL COMMENT 'Type: project or task',
  `creator` tinyint(1) DEFAULT '0' COMMENT 'Whether the creator',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Project-Task Member';
```

+ **pmhub_project_log**:

```sql
CREATE TABLE `pmhub_project_log` (
  `id` varchar(64) NOT NULL COMMENT 'Primary key id',
  `user_id` bigint(20) NOT NULL COMMENT 'Operator id',
  `type` varchar(16) NOT NULL COMMENT 'Type: project or task',
  `operate_type` varchar(32) NOT NULL COMMENT 'Operation type',
  `content` text COMMENT 'Operation content',
  `remark` varchar(500) DEFAULT NULL COMMENT 'Remarks',
  `pt_id` varchar(64) NOT NULL COMMENT 'Project or task id',
  `to_user_id` bigint(20) DEFAULT NULL,
  `created_by` varchar(64) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_by` varchar(64) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `log_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Activity 2-Deliverable 3-Comment',
  `file_url` varchar(500) DEFAULT NULL COMMENT 'File URL',
  `icon` varchar(20) DEFAULT NULL,
  `project_id` varchar(64) NOT NULL COMMENT 'Project id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Project-Task Log';
```

## PmHub Thực Chiến - Tạo Mới/Cập Nhật Trạng Thái Phê Duyệt

API:

```java
@InnerAuth  
@PostMapping("/updateApprovalSet")  
@DistributedLock(key = "#approvalSetDTO.approved", lockTime = 10L, keyPrefix = "workflow-approve-")  
public R<?> updateApprovalSet(ApprovalSetDTO approvalSetDTO) {  
    return R.ok(deployService.updateApprovalSet(approvalSetDTO, ProjectStatusEnum.PROJECT.getStatusName()));  
}
```

Cụ thể thực hiện mã:

```java
@Override
public boolean insertOrUpdateApprovalSet(String extraId, String type, String approved, String definitionId, String deploymentId) {
    LambdaQueryWrapper<WfApprovalSet> qw = new LambdaQueryWrapper<>();
    qw.eq(WfApprovalSet::getExtraId, extraId).eq(WfApprovalSet::getType, type);
    WfApprovalSet mas = wfApprovalSetMapper.selectOne(qw);
    if (mas != null) {
        mas.setApproved(approved);
        mas.setDefinitionId(definitionId);
        mas.setDeploymentId(deploymentId);
        mas.setUpdatedBy(SecurityUtils.getUsername());
        mas.setUpdatedTime(new Date());
        wfApprovalSetMapper.updateById(mas);
    } else {
        WfApprovalSet wfApprovalSet = new WfApprovalSet();
        wfApprovalSet.setExtraId(extraId);
        wfApprovalSet.setType(type);
        wfApprovalSet.setApproved(approved);
        wfApprovalSet.setDefinitionId(definitionId);
        wfApprovalSet.setDeploymentId(deploymentId);
        wfApprovalSet.setCreatedBy(SecurityUtils.getUsername());
        wfApprovalSet.setCreatedTime(new Date());
        wfApprovalSet.setUpdatedBy(SecurityUtils.getUsername());
        wfApprovalSet.setUpdatedTime(new Date());
        wfApprovalSetMapper.insert(wfApprovalSet);
    }

    return true;
}
```

Liên quan đến cơ sở dữ liệu và bảng:

Cơ sở dữ liệu: pmhub-workflow

Bảng: pmhub_wf_approval_set

```sql
CREATE TABLE `pmhub_wf_approval_set` (
  `id` varchar(32) NOT NULL,
  `type` varchar(32) DEFAULT NULL,
  `approved` varchar(10) DEFAULT NULL,
  `deployment_id` varchar(64) DEFAULT NULL,
  `definition_id` varchar(64) DEFAULT NULL,
  `created_by` varchar(64) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_by` varchar(64) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `extra_id` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Bảng cấu hình trạng thái phê duyệt';
```

Cấu hình thêm cho dịch vụ `pmhub-workflow-dev.yml`:

```yaml
# Cấu hình giao dịch phân tán
seata:
  registry:
    type: nacos
    nacos:
      server-addr: 127.0.0.1:8848
      namespace: ""
      group: SEATA_GROUP
      application: seata-server
  tx-service-group: default_tx_group # Nhóm giao dịch, nhận tên của cụm dịch vụ TC
  service:
    vgroup-mapping: 
      default_tx_group: default # Mối quan hệ ánh xạ giữa nhóm giao dịch và cụm dịch vụ TC
  data-source-proxy-mode: AT
```

## Câu hỏi phỏng vấn
**1. Bạn đã viết về giao dịch phân tán trong CV, bạn đã thực hiện nó như thế nào?**

Đây là một câu hỏi khá rộng, bạn cần phải hiểu rõ cách mà PmHub kết hợp với giao dịch phân tán. Hãy tổ chức ngôn ngữ theo hiểu biết của bạn để trả lời câu hỏi này.

**2. Chế độ Seata-AT của Alibaba làm thế nào để không xâm nhập vào mã nghiệp vụ?**

Sau khi cấu hình kết nối tại phía khách hàng, chế độ Seata-AT sẽ thêm bảng `undo_log` vào cơ sở dữ liệu nghiệp vụ. Chế độ Seata-AT sẽ tự động tạo và quản lý `undo_log` trước và sau khi thực thi phương thức nghiệp vụ, nhằm ghi lại hình ảnh trước và sau của dữ liệu.

Nó thực hiện quản lý giao dịch tự động thông qua proxy, bằng cách cấu hình proxy nguồn dữ liệu của Seata, tất cả các thao tác cơ sở dữ liệu sẽ bị Seata chặn và quản lý giao dịch.

Chế độ Seata-AT thực hiện giao thức hai giai đoạn tự động (2PC), bao gồm giai đoạn chuẩn bị và giai đoạn cam kết/hoàn tác. Khi giao dịch được cam kết, Seata sẽ thực hiện thao tác chuẩn bị (ghi lại `undo_log`), sau đó quyết định cam kết hoặc hoàn tác dựa trên tình trạng của các giao dịch phân nhánh.

::: info
Chế độ Seata-AT thực hiện việc không xâm nhập vào mã nghiệp vụ qua các cách sau:

+ Tự động tạo và quản lý `undo_log`.
+ Chặn các thao tác cơ sở dữ liệu và giao dịch thông qua proxy.
+ Cấu hình đơn giản bằng cách sử dụng annotation để kích hoạt quản lý giao dịch phân tán.
+ Tự động xử lý quá trình cam kết và hoàn tác trong hai giai đoạn.

Nhà phát triển chỉ cần thêm annotation vào phương thức nghiệp vụ mà không cần thay đổi logic nghiệp vụ ban đầu và cách thức thao tác cơ sở dữ liệu, giúp đơn giản hóa rất nhiều việc triển khai giao dịch phân tán.
:::

**Trong giai đoạn đầu, Seata sẽ chặn “SQL nghiệp vụ”**, 

1. Phân tích cú pháp SQL để tìm dữ liệu nghiệp vụ mà “SQL nghiệp vụ” cần cập nhật. Trước khi dữ liệu nghiệp vụ được cập nhật, Seata sẽ lưu lại hình ảnh trước của nó ("before image").

2. Thực thi "SQL nghiệp vụ" để cập nhật dữ liệu nghiệp vụ. Sau khi cập nhật, Seata sẽ lưu lại hình ảnh sau ("after image") và cuối cùng tạo khóa hàng.

Tất cả các thao tác trên đều được hoàn thành trong một giao dịch cơ sở dữ liệu, đảm bảo tính nguyên tử của giai đoạn đầu.

![Seata Giai đoạn 1](https://cdn.nlark.com/yuque/0/2024/png/29495295/1719395526981-e02f9478-7727-42c1-8948-975d261a7553.png)

**Giai đoạn hai khi cam kết thành công:**

::: info
Nếu giai đoạn hai được cam kết thành công,

Vì “SQL nghiệp vụ” đã được cam kết với cơ sở dữ liệu trong giai đoạn đầu, nên khung Seata chỉ cần xóa dữ liệu snapshot và khóa hàng đã lưu trong giai đoạn đầu để hoàn tất việc dọn dẹp dữ liệu.

![Seata Giai đoạn 2](https://cdn.nlark.com/yuque/0/2024/png/29495295/1719395592766-12f22df4-c88d-4495-b3d0-e8fd2c776603.png)

:::

**Giai đoạn hai khi gặp sự cố:**

::: info
Trong trường hợp phải hoàn tác ở giai đoạn hai:

<font style="color:#DF2A3F;">Seata cần phải hoàn tác “SQL nghiệp vụ” đã được thực hiện ở giai đoạn một và khôi phục dữ liệu nghiệp vụ.</font>

Cách hoàn tác là sử dụng “before image” để khôi phục dữ liệu nghiệp vụ. Tuy nhiên, trước khi khôi phục, Seata cần kiểm tra viết bẩn bằng cách so sánh dữ liệu hiện tại trong cơ sở dữ liệu và “after image”.

Nếu hai bản dữ liệu giống nhau, điều đó có nghĩa là không có viết bẩn và có thể khôi phục dữ liệu. <font style="color:#DF2A3F;">Nếu không giống nhau, điều đó có nghĩa là có viết bẩn và cần phải xử lý thủ công.</font>

![Seata Giai đoạn 2 - Hoàn tác](https://cdn.nlark.com/yuque/0/2024/png/29495295/1719395636269-91d4ff83-d0d7-4c05-a3fb-56f209d8d525.png)

:::

**3. Các giải pháp cho giao dịch phân tán là gì?**

Có 6 giải pháp chính để triển khai giao dịch phân tán:

+ Giải pháp XA
+ Giải pháp TCC
+ Giải pháp SAGA
+ Bảng thông điệp cục bộ
+ Giải pháp đảm bảo thông điệp cuối cùng nhất quán
+ Giải pháp thông báo nỗ lực tối đa

Bạn có thể xem thêm tài liệu để hiểu rõ hơn về các giải pháp này.