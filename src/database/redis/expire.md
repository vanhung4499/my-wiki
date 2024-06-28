---
title: Redis Expire Delete
tags:
  - redis
  - nosql
categories:
  - redis
icon: devicon:redis
order: 6
---

# Redis Expire Delete

### Xóa khi hết hạn trong Redis

Redis cho phép thiết lập thời gian tồn tại (ttl) cho mỗi khóa và tự động xóa khóa khi nó hết hạn.

#### Thiết lập thời gian sống hoặc thời gian hết hạn của khóa

Trong Redis, các lệnh liên quan đến thời gian sống của khóa như sau:

| Lệnh                                                | Mô tả                                    |
| --------------------------------------------------- | ---------------------------------------- |
| [`EXPIRE`](https://redis.io/commands/expire/)       | Thiết lập thời gian sống của khóa, đơn vị là giây |
| [`PEXPIRE`](https://redis.io/commands/pexpire/)     | Thiết lập thời gian sống của khóa, đơn vị là mili giây |
| [`EXPIREAT`](https://redis.io/commands/expireat/)   | Thiết lập thời gian hết hạn của khóa bằng timestamp (giây) |
| [`PEXPIREAT`](https://redis.io/commands/pexpireat/) | Thiết lập thời gian hết hạn của khóa bằng timestamp (mili giây) |
| [`TTL`](https://redis.io/commands/ttl/)             | Trả về thời gian sống còn lại của khóa, đơn vị là giây |
| [`PTTL`](https://redis.io/commands/pttl/)           | Trả về thời gian sống còn lại của khóa, đơn vị là mili giây |
| [`PERSIST`](https://redis.io/commands/persist/)     | Xóa thời gian sống của khóa, làm cho khóa trở thành vĩnh viễn |

**Ví dụ** Thiết lập EXPIRE và sử dụng TTL:

```shell
> set key value
OK
# Thiết lập thời gian sống của khóa là 60 giây
> expire key 60
(integer) 1
# Xem thời gian sống còn lại của khóa
> ttl key
(integer) 58
# Trong vòng 60 giây
> get key
"value"
# Sau 60 giây
> get key
(nil)
```

**Ví dụ** Thiết lập EXPIREAT và sử dụng TTL:

```shell
> set key value
OK
# Thiết lập thời gian hết hạn của khóa là 1692419299 (timestamp)
> expireat key 1692419299
(integer) 1
# Xem thời gian sống còn lại của khóa
> ttl key
(integer) 9948
# Trước thời điểm 1692419299
> get key
"value"
# Sau thời điểm 1692419299
> get key
(nil)
```

Trên đây là cách Redis quản lý thời gian sống và tự động xóa các khóa khi chúng hết hạn. Các lệnh liên quan cho phép bạn kiểm soát hiệu quả thời gian tồn tại của các khóa trong Redis.

#### Cách lưu trữ thời gian hết hạn

Trong Redis, từ điển `expires` của cấu trúc `redisDb` lưu trữ thời gian hết hạn của tất cả các khóa trong cơ sở dữ liệu, được gọi là từ điển hết hạn:

- Khóa trong từ điển hết hạn là một con trỏ, trỏ đến một đối tượng khóa cụ thể.
- Giá trị trong từ điển hết hạn là một số nguyên kiểu `long long`, lưu trữ thời gian hết hạn của khóa - một dấu thời gian Unix với độ chính xác tới mili giây.

```c
typedef struct redisDb {

    // Không gian khóa của cơ sở dữ liệu, lưu trữ tất cả các cặp khóa giá trị trong cơ sở dữ liệu
    dict *dict;

    // Thời gian hết hạn của khóa, từ điển này có khóa là các khóa và giá trị là thời gian hết hạn dưới dạng thời gian Unix
    dict *expires;

    // ...
} redisDb;
```

Dưới đây là một ví dụ về từ điển hết hạn:

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202309171537744.png)

Khi thực thi các lệnh `EXPIRE`, `PEXPIRE`, `EXPIREAT`, `PEXPIREAT`, Redis sẽ chuyển chúng thành dấu thời gian Unix dạng `PEXPIREAT`, sau đó duy trì trong từ điển `expires`.

#### Xác định khóa hết hạn

Quá trình xác định khóa hết hạn trong Redis được thực hiện như sau:

- Kiểm tra xem khóa được chỉ định có tồn tại trong từ điển hết hạn không; nếu tồn tại, lấy thời gian hết hạn của khóa đó.
- Kiểm tra xem thời điểm hiện tại có lớn hơn thời gian hết hạn của khóa không: nếu có, khóa đã hết hạn; ngược lại, khóa chưa hết hạn.

### Chiến lược xóa hết hạn

Trong Redis, có ba chiến lược chính để xóa các khóa hết hạn, mỗi chiến lược đều có ưu điểm và nhược điểm riêng, phù hợp với các tình huống sử dụng khác nhau:

1. **Xóa theo lịch trình**:
   - **Nguyên lý**: Khi đặt thời gian hết hạn cho một khóa, đồng thời tạo một bộ định giờ. Khi thời gian hết hạn đến, bộ định giờ sẽ ngay lập tức xóa khóa đó.
   - **Ưu điểm**: Đảm bảo các khóa hết hạn được xóa nhanh chóng, giải phóng bộ nhớ một cách hiệu quả.
   - **Nhược điểm**: Nếu có quá nhiều khóa hết hạn, có thể tốn nhiều tài nguyên CPU, ảnh hưởng đến khả năng xử lý và thời gian đáp ứng của máy chủ.

2. **Xóa lười biếng**:
   - **Nguyên lý**: Cho phép các khóa hết hạn tồn tại mà không làm gì, nhưng mỗi khi truy cập vào một khóa, Redis sẽ kiểm tra xem khóa đó đã hết hạn chưa. Nếu đã hết hạn, Redis sẽ xóa khóa đó trước khi trả về giá trị.
   - **Ưu điểm**: Tiêu tốn ít tài nguyên CPU nhất có thể. Chương trình chỉ kiểm tra xem khóa có hết hạn khi đọc và ghi, do đó không có chi phí CPU phụ thuộc vào các hoạt động không đọc hoặc ghi.
   - **Nhược điểm**: Có nguy cơ các khóa hết hạn không bao giờ được giải phóng do không được truy cập, gây lãng phí bộ nhớ và có nguy cơ rò rỉ bộ nhớ.

3. **Xóa định kỳ**:
   - **Nguyên lý**: Redis thường xuyên kiểm tra và xóa các khóa hết hạn trong một khoảng thời gian nhất định. Số lượng khóa hết hạn xóa và thời gian giữa các lần kiểm tra được xác định bởi thuật toán của Redis.
   - **Ưu điểm**: Là sự cân bằng giữa hai chiến lược trên. Nếu được thiết lập đúng cách, chiến lược này giảm được tác động của việc xóa hết hạn lên tài nguyên CPU.
   - **Nhược điểm**: Không thể tránh được những vấn đề mà các chiến lược khác gặp phải. Nếu thời gian kiểm tra và xóa không hợp lý, hoặc không đủ thường xuyên, khóa hết hạn có thể vẫn lưu trữ trong bộ nhớ quá lâu.

### Chiến lược xóa hết hạn trong Redis

Redis sử dụng đồng thời hai chiến lược là xóa hết hạn theo hình thức "đúng lúc" (active expiration) và "lười biếng" (lazy expiration), nhằm đạt được sự cân bằng giữa việc sử dụng CPU và quản lý bộ nhớ hiệu quả.

**Chiến lược xóa hết hạn theo định kỳ của Redis** - Được thực hiện bởi hàm `activeExpireCycle` trong tập tin `redis.c`. Mỗi khi Redis thực hiện chu kỳ định kỳ thông qua hàm `serverCron`, `activeExpireCycle` sẽ được gọi. Trong một khoảng thời gian nhất định, hàm này sẽ duyệt qua từng cơ sở dữ liệu và ngẫu nhiên kiểm tra một số khóa trong `expires` dictionary để xác định xem chúng đã hết hạn chưa. Những khóa đã hết hạn sẽ bị xóa khỏi cơ sở dữ liệu.

**Chiến lược xóa hết hạn theo hình thức lười biếng của Redis** - Được thực hiện bởi hàm `expireIfNeeded` trong tập tin `db.c`. Mọi lệnh đọc và ghi đều sẽ gọi hàm `expireIfNeeded` để kiểm tra khóa nhập vào. Nếu khóa đã hết hạn, nó sẽ được xóa ngay lập tức khỏi cơ sở dữ liệu. Nếu chưa hết hạn, không có hành động nào được thực hiện.

### AOF, RDB và sao chép đối với xử lý các khóa hết hạn

- **Tạo tệp RDB** - Khi thực hiện lệnh `SAVE` hoặc `BGSAVE` để tạo tệp RDB mới, tệp RDB này **sẽ không chứa các khóa đã hết hạn**.

- **Nạp tệp RDB** - Trên máy chủ chính, **không có khóa đã hết hạn sẽ được nạp** từ tệp RDB. Tuy nhiên, trên các máy chủ phụ, **các khóa đã hết hạn sẽ được nạp**.

- **Tạo tệp AOF** - Khi một khóa đã hết hạn và được xóa, không ảnh hưởng gì đến tệp AOF hiện tại. Khi một khóa đã hết hạn và được xóa, máy chủ sẽ ghi thêm một lệnh `DEL` vào cuối tệp AOF hiện có, để xóa khóa đã hết hạn này một cách rõ ràng.

- **Tái viết tệp AOF** - Khi thực hiện lệnh `BGREWRITEAOF` để tái viết tệp AOF, tệp AOF mới được tạo ra **sẽ không chứa các khóa đã hết hạn**.

- **Sao chép** - Khi máy chủ chính xóa một khóa đã hết hạn, nó sẽ gửi một lệnh `DEL` tới tất cả các máy chủ phụ, xóa khóa đã hết hạn một cách rõ ràng. Các máy chủ phụ không tự động xóa các khóa đã hết hạn mà chờ máy chủ chính gửi lệnh `DEL`, điều này giúp đảm bảo tính nhất quán dữ liệu giữa các máy chủ chính và phụ.

- Sau khi một lệnh Redis sửa đổi cơ sở dữ liệu, máy chủ sẽ gửi thông báo cơ sở dữ liệu đến khách hàng theo cấu hình.


## Loại bỏ bộ nhớ Redis

### Các điểm chính về loại bỏ bộ nhớ trong Redis

- **Thời gian hết hạn** - Là cơ chế quan trọng để dọn dẹp dữ liệu không hợp lệ định kỳ trong Redis. Trong các lệnh Redis như `EXPIRE`, `EXPIREAT`, `PEXPIRE`, `PEXPIREAT`, `SETEX` và `PSETEX`, người dùng có thể thiết lập thời gian hết hạn cho một cặp key-value. Một khi cặp key-value có thời gian hết hạn thì sẽ tự động xoá đi khi thời gian hết hạn đến.

- **Bộ nhớ tối đa** - Redis cho phép đặt giá trị tối đa cho bộ nhớ thông qua tham số `maxmemory`. Khi bộ nhớ tiếp cận ngưỡng đã đặt, Redis sẽ kích hoạt **chiến lược xoá bộ nhớ**.

- **Chiến lược xoá bộ nhớ** - Là quá trình dọn dẹp một phần bộ nhớ để tối ưu hóa việc sử dụng bộ nhớ, giúp đảm bảo rằng Redis luôn lưu trữ các dữ liệu hot nhất.

- **LRU không chính xác** - Thực tế, thuật toán LRU của Redis không phải là LRU đáng tin cậy. Mặc dù chúng ta sử dụng thuật toán LRU để xoá các key, nhưng những key được xoá không nhất thiết là những key ít được sử dụng nhất.
### Chiến lược Loại bỏ Bộ nhớ trong Redis

Loại bỏ bộ nhớ chỉ là một chức năng do Redis cung cấp. Để hiện thực hóa chức năng này tốt hơn, các chiến lược khác nhau phải được cung cấp cho các tình huống ứng dụng khác nhau. Chiến lược loại bỏ bộ nhớ nói về cách chúng tôi triển khai cụ thể việc loại bỏ bộ nhớ. Chọn không gian như thế nào? Làm thế nào để chọn khóa cần loại bỏ trong không gian khóa?

- **Không bị loại bỏ**
	- **`noeviction`**: Khi sử dụng bộ nhớ đạt đến giới hạn `maxmemory` được cấu hình, Redis sẽ phản hồi với lỗi cho các lệnh yêu cầu thêm bộ nhớ. Đây là chiến lược mặc định và đảm bảo Redis không loại bỏ bất kỳ key nào một cách rõ ràng.

- **Loại bỏ từ Các Key Hết Hạn (Key Tạm Thời)**
	- **`volatile-random`**: Ngẫu nhiên loại bỏ một key từ tập hợp các key có thời gian hết hạn được thiết lập (`expires` dictionary).
	- **`volatile-ttl`**: Loại bỏ key có thời gian hết hạn sớm nhất từ tập hợp các key có thời gian hết hạn được thiết lập.
	- **`volatile-lru`**: Loại bỏ key ít được sử dụng nhất gần đây từ tập hợp các key có thời gian hết hạn được thiết lập.
	- **`volatile-lfu`** (Redis 4.0 thêm mới): Loại bỏ key ít được sử dụng nhất từ tất cả các key có thời gian hết hạn được thiết lập.

- **Loại bỏ từ Tất cả Các Key**
	- **`allkeys-lru`**: Loại bỏ key ít được sử dụng nhất gần đây từ tất cả các key trong Redis.
	- **`allkeys-random`**: Ngẫu nhiên loại bỏ một key từ tất cả các key trong Redis.
	- **`allkeys-lfu`** (Redis 4.0 thêm mới): Loại bỏ key ít được sử dụng nhất từ tất cả các key trong Redis.

### Lựa chọn chiến lược xoá bộ nhớ

- Nếu dữ liệu có phân phối bình thường, có nghĩa là một phần dữ liệu truy cập thường xuyên và một phần ít khi truy cập, bạn nên sử dụng `allkeys-lru` hoặc `allkeys-lfu`.
- Nếu dữ liệu có phân phối đều, có nghĩa là tất cả các dữ liệu đều có tần suất truy cập như nhau, bạn nên sử dụng `allkeys-random`.
- Nếu Redis được sử dụng đồng thời cho cả bộ nhớ cache và lưu trữ bền vững, bạn nên sử dụng `volatile-lru`, `volatile-lfu`, `volatile-random`. Tuy nhiên, trong trường hợp này, bạn cũng có thể triển khai hai cụm Redis để đạt được mục đích tương tự.
- Thiết lập thời gian hết hạn cho các khóa sẽ tiêu tốn nhiều bộ nhớ hơn. Do đó, nếu điều kiện cho phép, nên sử dụng `allkeys-lru` hoặc `allkeys-lfu` để tận dụng bộ nhớ một cách hiệu quả hơn.
