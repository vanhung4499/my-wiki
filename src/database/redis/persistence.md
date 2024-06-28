---
title: Redis Persistence
tags:
  - redis
  - nosql
categories:
  - redis
  - nosql
icon: devicon:redis
date created: 2023-07-24
date modified: 2023-07-24
order: 7
---

# Lưu trữ bền vững trong Redis

> Redis là cơ sở dữ liệu trong bộ nhớ (in-memory). Để đảm bảo dữ liệu không bị mất sau khi xảy ra sự cố, dữ liệu trong bộ nhớ cần phải được lưu vào đĩa cứng.
>
> Redis hỗ trợ hai phương pháp kiên trì: RDB và AOF. Hai phương pháp kiên trì này có thể được sử dụng đồng thời hoặc riêng biệt.

## RDB

### Giới thiệu về RDB

**RDB (Redis Database Backup)** hay còn gọi là "bản snapshot", là quá trình lưu trữ tất cả các cặp khóa-giá trị của cơ sở dữ liệu Redis vào một tệp nhị phân nén gọi là "tệp RDB" vào một thời điểm cụ thể trong quá trình hoạt động.

**Lưu trữ RDB** có thể được thực hiện "thủ công" hoặc "tự động" theo định kỳ.

**Tệp RDB** được tải khi máy chủ Redis được "khởi động" làm việc "tự động".

Với từng loại cặp khóa-giá trị khác nhau, tệp RDB sẽ sử dụng cách lưu trữ khác nhau.

Sau khi tạo tệp RDB, người dùng có thể sao lưu RDB, sao chép RDB sang các máy chủ khác để tạo bản sao của máy chủ có cùng dữ liệu, hoặc sử dụng khi khởi động lại máy chủ. Tóm lại, **RDB thích hợp cho việc "sao lưu lạnh"**.

### Ưu điểm và Nhược điểm của RDB

**Ưu điểm của RDB**

- **Kích thước nhỏ và phù hợp cho việc sao lưu “lạnh”**: Tệp RDB rất gọn nhẹ và thích hợp để sử dụng làm sao lưu định kỳ. Bạn có thể lên lịch sao lưu theo nhu cầu, ví dụ mỗi giờ lưu trữ dữ liệu trong vòng 24 giờ qua, và mỗi ngày lưu trữ dữ liệu trong vòng 30 ngày qua. Như vậy, ngay cả khi xảy ra sự cố, bạn cũng có thể khôi phục dữ liệu thành các phiên bản khác nhau theo nhu cầu.

- **Tối ưu hiệu năng**: Khi tạo tệp RDB, quá trình chỉ yêu cầu tiến trình cha của Redis fork ra một tiến trình con, và toàn bộ công việc sau đó được tiến trình con thực hiện. Tiến trình cha không cần thực hiện thêm thao tác IO nào, do đó phương pháp lưu trữ bằng RDB có thể tối đa hóa hiệu suất của Redis.

- **Phục hồi nhanh chóng với tập dữ liệu lớn**: Khi phục hồi dữ liệu từ RDB, quá trình này thường nhanh hơn so với AOF.

**Nhược điểm của RDB**

- **Rủi ro mất dữ liệu**: Nếu hệ thống gặp sự cố, dữ liệu sau lần tạo bản sao RDB cuối cùng sẽ bị mất đi. Nếu bạn muốn giảm thiểu mất dữ liệu trong trường hợp Redis dừng đột ngột (ví dụ như mất điện), thì phương pháp lưu trữ bằng RDB không phù hợp. Mặc dù bạn có thể cấu hình các điểm lưu trữ khác nhau (ví dụ, mỗi 5 phút và có 100 thao tác ghi vào tập dữ liệu), việc lưu trữ toàn bộ dữ liệu hoàn chỉnh của Redis là một công việc tương đối nặng nề. Thông thường, bạn sẽ thực hiện lưu trữ đầy đủ mỗi 5 phút hoặc lâu hơn, và nếu Redis ngừng hoạt động đột ngột, bạn có thể mất vài phút dữ liệu.

- **Thời gian lưu trữ dài khi tập dữ liệu lớn**: Khi tập dữ liệu lớn, quá trình fork để lưu trữ RDB có thể tốn nhiều thời gian. Điều này có thể dẫn đến việc Redis không thể phản hồi yêu cầu từ người dùng trong vài mili giây. Nếu tập dữ liệu quá lớn và hiệu suất CPU không tốt, tình trạng này có thể kéo dài lên đến 1 giây. AOF cũng cần phải fork, nhưng bạn có thể điều chỉnh tần suất viết lại tệp nhật ký để tăng tính bền bỉ của tập dữ liệu.

### Tạo tệp RDB

Redis cung cấp hai lệnh để tạo tệp RDB: [**`SAVE`**](https://redis.io/commands/save) và [**`BGSAVE`**](https://redis.io/commands/bgsave).

**Lệnh `SAVE`** được thực thi bởi tiến trình máy chủ trực tiếp và sẽ chặn (block) máy chủ cho đến khi tệp RDB được tạo xong. Trong thời gian chặn này, máy chủ sẽ không thể phản hồi bất kỳ yêu cầu lệnh nào khác.

```shell
> SAVE
"OK"
```

**Lệnh `BGSAVE`** khởi động một tiến trình con (fork) để tạo tệp RDB, do đó máy chủ tiếp tục xử lý các yêu cầu lệnh trong khi quá trình tạo tệp RDB diễn ra. Vì vậy, lệnh này không làm chặn máy chủ.

```shell
> BGSAVE
"Background saving started"
```

> 🔔 **【Chú ý】**
>
> `BGSAVE` sử dụng công nghệ sao chép khi ghi (Copy-On-Write, viết khi sao chép).
>
> Trong quá trình thực thi `BGSAVE`, các lệnh `SAVE`, `BGSAVE`, và `BGREWRITEAOF` sẽ bị từ chối để tránh xung đột đua ra giữa `BGSAVE` hiện tại và các hoạt động khác, nhằm tối ưu hóa hiệu suất.

Quá trình tạo tệp RDB được thực hiện bởi hàm `rdb.c/rdbSave` trong mã nguồn Redis.
### Tải tệp RDB

Redis thực hiện việc tải tệp RDB khi máy chủ khởi động mà không cần lệnh đặc biệt để thực hiện điều này.

**Việc tải tệp RDB xảy ra tự động khi máy chủ Redis khởi động**. Trong quá trình này, máy chủ sẽ ở trạng thái chặn (block) cho đến khi quá trình tải RDB hoàn tất.

Quá trình tải RDB được thực hiện bởi hàm `rdb.c/rdbLoad` trong mã nguồn Redis.

> 🔔 **【Chú ý】**
>
> Do tần suất cập nhật của AOF thường cao hơn so với RDB:
>
> - Nếu máy chủ có AOF được kích hoạt, máy chủ sẽ ưu tiên sử dụng AOF để khôi phục dữ liệu.
> - Chỉ khi AOF bị tắt, máy chủ mới sử dụng tệp RDB để khôi phục dữ liệu.

Điều này đảm bảo rằng Redis luôn sử dụng cơ chế lưu trữ phù hợp nhất để đảm bảo an toàn và khôi phục dữ liệu một cách hiệu quả khi khởi động lại.

### Tự động sao lưu định kì

Redis hỗ trợ tự động thực hiện lệnh `BGSAVE` theo khoảng thời gian được cấu hình trong tệp `redis.conf` bằng cách sử dụng tùy chọn `save`. Tùy chọn `save` cho phép thiết lập nhiều điều kiện lưu trữ, và khi bất kỳ điều kiện nào được đáp ứng, máy chủ Redis sẽ thực hiện lệnh `BGSAVE`.

**Ví dụ cấu hình tự động lưu trữ trong `redis.conf`:**

```shell
# Trong vòng 900 giây, ít nhất có 1 lần thay đổi cơ sở dữ liệu
save 900 1
# Trong vòng 300 giây, ít nhất có 10 lần thay đổi cơ sở dữ liệu
save 300 10
# Trong vòng 60 giây, ít nhất có 10000 lần thay đổi cơ sở dữ liệu
save 60 10000
```

Khi bất kỳ điều kiện nào được đáp ứng, Redis sẽ thực hiện lệnh `BGSAVE`.

**Định nghĩa các điều kiện lưu trữ trong `redis.h/redisServer`:**

```c
struct redisServer {
    // Mảng lưu trữ các điều kiện lưu trữ
    struct saveparam *saveparams;

    // Số lần thay đổi cơ sở dữ liệu kể từ lần SAVE cuối cùng
    long long dirty;

    // Thời điểm thực hiện SAVE lần cuối
    time_t lastsave;
}

// Cấu trúc điều kiện lưu trữ của máy chủ (các điều kiện tự động thực hiện BGSAVE)
struct saveparam {
    // Thời gian giới hạn (seconds)
    time_t seconds;

    // Số lần thay đổi
    int changes;
};
```

Mảng `saveparams` trong `redisServer` duy trì các điều kiện lưu trữ tự động.

Mỗi khi thành công thực hiện một lệnh chỉnh sửa, biến `dirty` sẽ tăng lên 1 đơn vị; `lastsave` ghi lại thời điểm lần SAVE cuối cùng được thực hiện. Redis sử dụng hàm `serverCron` để định kỳ kiểm tra xem các điều kiện được cấu hình trong `save` có được đáp ứng không. Nếu đáp ứng, Redis sẽ thực hiện lệnh `BGSAVE`.

### Cấu trúc của tệp RDB

**Tệp RDB là một tệp nhị phân được nén** và được chia thành nhiều phần khác nhau tùy thuộc vào loại dữ liệu (STRING, HASH, LIST, SET, SORTED SET).

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/redis-rdb-structure.png)

Redis cung cấp công cụ `redis-check-dump` để kiểm tra tệp RDB.

### Cấu hình RDB

Mặc định, Redis cấu hình RDB như sau:

```
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir ./
```

Các tùy chọn liên quan đến RDB trong tệp cấu hình `redis.conf` của Redis:

- `save`: Redis sẽ tự động thực hiện lệnh `BGSAVE` theo các điều kiện được cấu hình trong `save`.
- `stop-writes-on-bgsave-error`: Dừng ghi khi có lỗi trong quá trình `BGSAVE`.
- `rdbcompression`: Bật/tắt nén RDB.
- `rdbchecksum`: Kiểm tra dữ liệu RDB.
- `dbfilename`: Tên tệp RDB.
- `dir`: Thư mục lưu trữ tệp RDB và AOF.

## 2. AOF

### Giới thiệu về AOF

`AOF (Append Only File)` là một tệp ghi log mà Redis sử dụng để lưu trữ tất cả các lệnh ghi vào cơ sở dữ liệu. Khi máy chủ khởi động lại, Redis sẽ nạp và thực thi các lệnh từ tệp AOF này để khôi phục dữ liệu gốc. AOF được coi là phương pháp "sao lưu nóng".

AOF có thể được bật bằng cách đặt cấu hình `appendonly yes`.

### Ưu điểm và nhược điểm của AOF

**Ưu điểm của AOF**

- **Giảm thiểu mất mát dữ liệu so với RDB**: Khi hệ thống gặp sự cố, AOF thường mất ít dữ liệu hơn RDB. Bạn có thể cấu hình các chiến lược fsync khác nhau như không có fsync, fsync mỗi giây, hoặc fsync mỗi lần ghi. Với chiến lược mặc định fsync mỗi giây, Redis vẫn duy trì hiệu suất tốt và chỉ mất tối đa 1 giây dữ liệu khi có sự cố.
- **Khả năng sửa chữa tệp AOF**: Tệp AOF là một tệp log chỉ thêm vào (append-only), do đó không cần phải thực hiện seek khi ghi. Ngay cả khi một số lệnh ghi không được hoàn thành do lý do nào đó (ví dụ như không gian ổ đĩa đầy), bạn vẫn có thể sửa chữa vấn đề này bằng công cụ `redis-check-aof`.
- **Nén tệp AOF**: Redis có thể tự động tái viết (rewrite) tệp AOF khi nó trở nên quá lớn. Tệp AOF mới sau khi tái viết chỉ chứa các lệnh tối thiểu cần thiết để khôi phục dữ liệu hiện tại. Quá trình tái viết hoàn toàn an toàn vì Redis vẫn tiếp tục ghi các lệnh vào tệp AOF hiện có trong khi tạo ra tệp AOF mới. Khi tệp AOF mới được tạo xong, Redis sẽ chuyển sang sử dụng tệp AOF mới và tiếp tục ghi vào đó.
- **Dễ đọc và phân tích**: Tệp AOF lưu trữ tất cả các lệnh ghi vào cơ sở dữ liệu theo đúng thứ tự. Do đó, nội dung của tệp AOF rất dễ đọc và phân tích. Bạn có thể dễ dàng xuất tệp AOF hoặc phân tích nó. Ví dụ, nếu bạn vô tình thực hiện lệnh FLUSHALL, nhưng tệp AOF chưa bị tái viết, bạn có thể dừng máy chủ, loại bỏ lệnh FLUSHALL cuối cùng từ tệp AOF và khởi động lại Redis để khôi phục dữ liệu trước khi thực hiện FLUSHALL.

**Nhược điểm của AOF**

- **Kích thước tệp AOF thường lớn hơn RDB**: Đối với cùng một bộ dữ liệu, tệp AOF thường có kích thước lớn hơn tệp RDB.
- **Khôi phục bộ dữ liệu lớn từ AOF có thể chậm hơn RDB**: Tùy thuộc vào chiến lược fsync được sử dụng, AOF có thể chậm hơn so với RDB trong quá trình khôi phục dữ liệu lớn. Tuy nhiên, với fsync mỗi giây, hiệu suất của AOF vẫn rất cao và có thể xứng đáng với tốc độ của RDB. Tuy nhiên, trong các tải ghi lớn, RDB có thể cung cấp thời gian đáp ứng tối đa đáng tin cậy hơn.

### Tạo AOF

**Các yêu cầu lệnh Redis sẽ được lưu vào vùng đệm AOF, sau đó được ghi và đồng bộ hóa định kỳ vào tệp AOF.**

Việc triển khai AOF có thể chia thành ba bước: ghi lệnh (append), ghi tệp và đồng bộ hóa tệp (sync).

- **Ghi lệnh (append)** - Khi chức năng AOF của máy chủ Redis được bật, máy chủ sẽ thêm lệnh ghi sẽ thực thi vào cuối vùng đệm AOF dưới dạng giao thức lệnh Redis.

- **Ghi tệp và đồng bộ hóa tệp**
  - Quá trình sự kiện của máy chủ Redis là một vòng lặp sự kiện, trong đó sự kiện tệp chịu trách nhiệm nhận yêu cầu lệnh từ khách hàng và gửi phản hồi lệnh cho khách hàng. Trong khi đó, sự kiện thời gian chịu trách nhiệm thực hiện các chức năng chạy định kỳ như `serverCron`.
  - Vì máy chủ có thể thực hiện lệnh ghi khi xử lý sự kiện tệp, các lệnh ghi này sẽ được thêm vào vùng đệm AOF. Trước khi kết thúc vòng lặp sự kiện, máy chủ sẽ kiểm tra nội dung vùng đệm AOF dựa trên tùy chọn `appendfsync` để quyết định xem liệu nội dung này có cần được ghi vào và đồng bộ hóa với tệp AOF hay không.

Tùy chọn `appendfsync` quyết định hành vi bền vững của AOF như sau:

- **`always`** - Ghi tất cả nội dung từ vùng đệm AOF vào và đồng bộ hóa với tệp AOF. Phương pháp này đảm bảo an toàn dữ liệu nhất nhưng hiệu suất thấp nhất.
- **`no`** - Ghi tất cả nội dung từ vùng đệm AOF vào tệp AOF nhưng không đồng bộ hóa, thời điểm đồng bộ hóa phụ thuộc vào hệ điều hành. Đây là phương pháp dữ liệu không an toàn nhất, mọi dữ liệu chưa kịp đồng bộ hóa khi gặp sự cố sẽ bị mất.
- **`everysec`** - Tùy chọn mặc định của `appendfsync`. Ghi tất cả nội dung từ vùng đệm AOF vào tệp AOF, và nếu thời gian từ lần đồng bộ hóa AOF trước đó đã quá 1 giây, sẽ tiếp tục đồng bộ hóa. Thao tác này được thực hiện bởi một luồng đặc biệt, đảm bảo hiệu suất đủ tốt và chỉ mất dữ liệu trong vòng một giây nếu có sự cố.

Lựa chọn của `appendfsync` ảnh hưởng đáng kể đến tính bảo mật của chức năng bền vững của AOF và hiệu suất của máy chủ Redis.

### Tải lại AOF

AOF (Append Only File) là một phương pháp lưu trữ dữ liệu trong Redis bằng cách ghi tất cả các lệnh ghi vào một tệp log. Khi máy chủ Redis khởi động lại sau một sự cố hoặc tái khởi động, AOF được sử dụng để tái tạo lại trạng thái cơ sở dữ liệu trước khi máy chủ tắt.

Quá trình tải lại AOF được thực hiện như sau:

1. **Khởi động chương trình tải lại của máy chủ**: Khi Redis bắt đầu, nó khởi động một quy trình đặc biệt để tải lại dữ liệu từ tệp AOF.

2. **Tạo một khách hàng giả**: Do lệnh Redis chỉ có thể thực thi trong ngữ cảnh khách hàng, Redis cần tạo ra một khách hàng giả để thực hiện và thực thi các lệnh trong tệp AOF.

3. **Phân tích và đọc lệnh ghi từ tệp AOF**: Chương trình tải lại sẽ bắt đầu đọc và phân tích các lệnh ghi trong tệp AOF. Mỗi lệnh được lưu trong tệp AOF dưới định dạng giao thức lệnh Redis.

4. **Thực thi lệnh bằng khách hàng giả**: Sau khi phân tích, chương trình tải lại sẽ sử dụng khách hàng giả để thực thi mỗi lệnh ghi từ tệp AOF. Điều này có nghĩa là Redis sẽ thực hiện mọi thay đổi dữ liệu được lưu trong các lệnh ghi này.

5. **Lặp lại quá trình đọc và thực thi lệnh**: Quá trình đọc và thực thi lệnh sẽ tiếp tục cho đến khi tất cả các lệnh ghi từ tệp AOF được xử lý hoàn tất.

6. **Hoàn thành quá trình tải lại**: Sau khi tất cả các lệnh đã được thực thi từ tệp AOF, quá trình tải lại sẽ kết thúc và Redis sẵn sàng hoạt động với dữ liệu được phục hồi từ tệp AOF.

### Viết lại AOF

Dưới sự hoạt động liên tục của Redis, kích thước của tệp AOF cũng sẽ không ngừng tăng lên, điều này gây ra hai vấn đề chính:

- AOF có thể làm đầy không gian lưu trữ trên đĩa.
- Khi Redis khởi động lại, tất cả các lệnh ghi trong tệp AOF phải được thực thi để khôi phục lại tập dữ liệu. Nếu kích thước của AOF quá lớn, thời gian để thực hiện quá trình khôi phục cũng sẽ rất lâu.

Để giải quyết vấn đề về kích thước của tệp AOF phình ra, Redis cung cấp tính năng ghi lại AOF (AOF rewrite) để nén tệp AOF. **Quá trình ghi lại AOF tạo ra một tệp AOF mới, tệp này giữ nguyên trạng thái cơ sở dữ liệu như trong tệp AOF ban đầu, nhưng kích thước nhỏ hơn**.

Quá trình ghi lại AOF không phải là đọc và phân tích nội dung của tệp AOF hiện tại, mà là trực tiếp đọc trạng thái cơ sở dữ liệu hiện tại từ Redis. Nghĩa là từng giá trị hiện tại của các khóa trong cơ sở dữ liệu được đọc và ghi vào tệp mới bằng một lệnh duy nhất, thay thế cho những lệnh có thể đã trùng lặp từ trước.

### AOF Đồng Bộ Hóa Nền

Là một tính năng hỗ trợ, rõ ràng Redis không muốn khi thực hiện việc ghi lại AOF làm ảnh hưởng đến việc nhận các lệnh Redis dịch vụ khác. Do đó, Redis quyết định sử dụng lệnh `BGREWRITEAOF` để tạo một tiến trình con để chịu trách nhiệm tái viết tệp AOF, tương tự như cách làm của `BGSAVE`.

- Khi thực hiện lệnh `BGREWRITEAOF`, máy chủ Redis duy trì một vùng đệm tái viết AOF. Khi tiến trình con tái viết AOF bắt đầu làm việc, Redis sau mỗi lần thực hiện một lệnh ghi, cả hai gửi lệnh này đến vùng đệm ghi AOF và vùng đệm tái viết AOF.
- Vì tiến trình con và tiến trình chính không hoạt động trong cùng một tiến trình, do đó quá trình tái viết AOF không ảnh hưởng đến quá trình ghi và đồng bộ hóa AOF. Khi tiến trình con hoàn thành công việc tạo tệp AOF mới, máy chủ sẽ thêm tất cả nội dung từ vùng đệm tái viết vào cuối tệp AOF mới, đảm bảo rằng trạng thái cơ sở dữ liệu được lưu trữ trong hai tệp AOF cũ và mới là như nhau.

> Quá trình thực hiện lệnh `BGREWRITEAOF` sử dụng kỹ thuật sao chép khi ghi (Copy-On-Write, viết tắt là CoW).

Bạn có thể thiết lập `auto-aof-rewrite-percentage` và `auto-aof-rewrite-min-size` để Redis tự động thực hiện `BGREWRITEAOF` khi đạt điều kiện nhất định.

Ví dụ cấu hình như sau:

```
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

Điều này chỉ ra rằng khi AOF lớn hơn `64MB`, và kích thước AOF lớn hơn ít nhất `100%` so với lần tái viết trước đó, Redis sẽ thực hiện lệnh `BGREWRITEAOF`.

### Cấu hình AOF

Cấu hình mặc định của AOF trong Redis:

```plaintext
appendonly no
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

Các cài đặt mặc định này có thể được điều chỉnh trong tệp cấu hình Redis (`redis.conf`). Dưới đây là các tùy chọn cấu hình AOF và ý nghĩa của chúng:

- **`appendonly`** - Mở tính năng AOF (append-only file). Khi được thiết lập thành `yes`, Redis sẽ bắt đầu ghi lại các câu lệnh vào tệp AOF để bảo vệ dữ liệu khi Redis khởi động lại.

- **`appendfsync`** - Xác định tần suất đồng bộ hóa AOF với đĩa. Các giá trị có thể là:
  - **`always`** - Mỗi lệnh ghi vào Redis sẽ được đồng bộ hóa ngay lập tức với đĩa. Tuy nhiên, điều này có thể làm giảm hiệu suất của Redis do tần suất ghi đĩa cao.
  - **`everysec`** - Redis sẽ đồng bộ hóa AOF với đĩa mỗi giây một lần. Đây là tùy chọn được khuyến khích vì nó cân bằng giữa hiệu suất và an toàn dữ liệu. Khi sử dụng tùy chọn này, Redis sẽ ghi vào AOF một lần mỗi giây, giúp bảo vệ dữ liệu mà không ảnh hưởng quá nhiều đến hiệu suất.
  - **`no`** - Hệ điều hành quyết định khi nào cần đồng bộ hóa với đĩa. Đây là tùy chọn ít an toàn vì dữ liệu có thể bị mất nếu hệ thống gặp sự cố.

- **`no-appendfsync-on-rewrite`** - Khi thực hiện quá trình tái viết AOF, Redis sẽ không đồng bộ hóa AOF với đĩa để tránh làm gián đoạn hoạt động ghi mới. Tùy chọn này giúp duy trì hiệu suất cao trong khi tái viết AOF.

- **`auto-aof-rewrite-percentage`** - Độ lớn tệp AOF hiện tại so với tệp AOF gần nhất sau khi thực hiện tái viết. Nếu tệp AOF hiện tại lớn hơn mức này, Redis sẽ tự động thực hiện tái viết AOF để nén tệp AOF. Giá trị mặc định là 100%, nghĩa là khi tệp AOF hiện tại lớn hơn hoặc bằng tệp tái viết gần đây nhất, Redis sẽ tái viết AOF.

- **`auto-aof-rewrite-min-size`** - Kích thước tối thiểu mà tệp AOF phải đạt được để Redis tự động thực hiện tái viết. Giá trị mặc định là `64mb`, nghĩa là Redis sẽ tự động tái viết AOF nếu kích thước tệp AOF hiện tại lớn hơn hoặc bằng `64MB`.

- **`dir`** - Đường dẫn nơi lưu trữ tệp RDB và AOF.

## 3. RDB vs AOF

> Khi Redis khởi động, nếu cả RDB và AOF đều được kích hoạt, chương trình sẽ ưu tiên sử dụng tập tin AOF để khôi phục tập dữ liệu, vì tập tin AOF thường chứa dữ liệu hoàn chỉnh nhất.

### Lựa chọn cơ chế lưu trữ

- Nếu không quan tâm đến mất dữ liệu, bạn có thể không cần lưu trữ.
- Nếu chấp nhận mất dữ liệu trong vài phút, chỉ cần sử dụng RDB.
- Nếu không thể chấp nhận mất dữ liệu trong vài phút, hãy sử dụng cả RDB và AOF.

Nhiều người dùng chỉ sử dụng AOF cho lưu trữ, nhưng điều này không được khuyến khích vì việc tạo snapshot RDB định kỳ rất thuận tiện cho sao lưu cơ sở dữ liệu và khôi phục nhanh chóng hơn so với AOF. Ngoài ra, việc sử dụng snapshot cũng giúp tránh được những lỗi chương trình của AOF.

### Chuyển từ RDB sang AOF

Trong Redis phiên bản 2.2 trở lên, bạn có thể chuyển từ RDB sang AOF mà không cần khởi động lại Redis:

- Sao lưu tệp dump.rdb mới nhất.
- Đặt sao lưu vào một vị trí an toàn.
- Thực hiện hai lệnh sau:
	- redis-cli config set appendonly yes
	- redis-cli config set save
- Đảm bảo rằng các lệnh ghi sẽ được ghi đúng vào cuối tệp AOF.
- Lệnh đầu tiên được thực hiện để bật chức năng AOF: Redis sẽ chặn cho đến khi tệp AOF ban đầu được tạo xong, sau đó Redis sẽ tiếp tục xử lý các yêu cầu lệnh và bắt đầu ghi các lệnh ghi vào cuối tệp AOF.

Lệnh thứ hai được sử dụng để tắt chức năng snapshot. Bước này là tùy chọn, nếu bạn muốn, bạn cũng có thể sử dụng cả snapshot và AOF cùng một lúc.

> 🔔 Quan trọng: Đừng quên mở chức năng AOF trong `redis.conf`! Nếu không, sau khi khởi động lại máy chủ, các cấu hình được thiết lập trước đó thông qua CONFIG SET sẽ bị mất và chương trình sẽ khởi động máy chủ theo cấu hình ban đầu.

### Tương tác giữa AOF và RDB

Lệnh `BGSAVE` và `BGREWRITEAOF` không thể được thực thi cùng lúc. Điều này nhằm tránh hai tiến trình Redis nền cùng thực hiện nhiều hoạt động I/O trên đĩa cùng một lúc.

Nếu lệnh `BGSAVE` đang được thực thi và người dùng gọi lệnh `BGREWRITEAOF` một cách rõ ràng, máy chủ sẽ trả lời người dùng với trạng thái OK và thông báo rằng `BGREWRITEAOF` đã được đặt lịch để thực thi. Sau khi `BGSAVE` hoàn thành, `BGREWRITEAOF` sẽ bắt đầu chính thức.

### Lưu trữ kết hợp

Redis 4.0 đưa ra **lưu trữ kết hợp AOF và snapshot trong bộ nhớ**, hay còn gọi là lưu trữ kết hợp, để cân bằng tốc độ khởi động lại Redis và giảm rủi ro mất dữ liệu.

Trong lưu trữ kết hợp, trong quá trình tái viết AOF, tiến trình con tái viết sẽ đầu tiên ghi dữ liệu bộ nhớ chia sẻ với tiến trình chính dưới dạng snapshot RDB vào tệp AOF. Sau đó, các lệnh hoạt động được ghi trong bộ đệm tái viết sẽ được ghi vào tệp AOF dưới dạng tăng dần AOF. Khi việc ghi kết thúc, tiến trình chính sẽ thay thế tệp AOF cũ bằng tệp AOF mới có định dạng RDB và AOF.

Nói cách khác, khi sử dụng lưu trữ kết hợp, **phần đầu của tệp AOF là dữ liệu đầy đủ định dạng RDB và phần cuối cùng là dữ liệu tăng dần định dạng AOF**.

## 4. Sao lưu Redis

Đảm bảo rằng dữ liệu Redis được sao lưu đầy đủ là rất quan trọng.

### Lời khuyên về sao lưu

Đề xuất sử dụng RDB để sao lưu dữ liệu Redis.

### Quy trình sao lưu

1. **Thiết lập công việc định kỳ (cron job)**: Tạo một công việc định kỳ, sao lưu một tập tin RDB vào một thư mục mỗi giờ và sao lưu một tập tin RDB vào một thư mục khác mỗi ngày.

2. **Giữ lại sao lưu và thêm dấu thời gian**: Đảm bảo rằng các tập tin sao lưu chứa thông tin về ngày và giờ tương ứng. Khi thực hiện công việc định kỳ, sử dụng lệnh `find` để xóa các bản sao lưu cũ. Ví dụ, có thể giữ lại các bản sao lưu mỗi giờ trong vòng 48 giờ qua và giữ lại các bản sao lưu mỗi ngày trong vòng một đến hai tháng qua.

3. **Sao lưu ngoại tuyến**: Ít nhất mỗi ngày một lần, sao lưu RDB ra khỏi trung tâm dữ liệu hoặc ít nhất là sao lưu ra khỏi máy chủ vật lý đang chạy Redis.

### Sao lưu phòng chống thảm họa

Sao lưu phòng chống thảm họa Redis chủ yếu là sao lưu dữ liệu và truyền sao lưu đó đến nhiều trung tâm dữ liệu bên ngoài khác nhau.

Sao lưu phòng chống thảm họa cho phép dữ liệu vẫn an toàn khi trung tâm dữ liệu chính sản xuất vấn đề nghiêm trọng.
