---
title: Redis In Action
tags: [db, redis, nosql]
categories: [db, redis, nosql]
icon: devicon:redis
date created: 2023-07-24
date modified: 2023-07-24
---

# Redis in action


> Redis có thể được áp dụng trong nhiều tình huống, dưới đây là một số tình huống sử dụng phổ biến.

## Bộ nhớ đệm

Bộ nhớ đệm là kịch bản ứng dụng phổ biến nhất của Redis.

Redis có nhiều loại dữ liệu và lệnh hoạt động phong phú, đồng thời có các tính năng hiệu suất cao và tính sẵn sàng cao, khiến nó rất phù hợp cho bộ nhớ đệm phân tán.

> Nguyên tắc cơ bản của việc sử dụng cache, vui lòng tham khảo phần [**Nguyên tắc cơ bản của cache**]().

## BitMap và BloomFilter

Redis không chỉ hỗ trợ 5 loại dữ liệu cơ bản mà còn có BitMap và BloomFilter (bộ lọc Bloom, có thể được hỗ trợ thông qua Redis Module).

BitMap và BloomFilter đều có thể giải quyết vấn đề xuyên thấu bộ nhớ đệm. Điểm quan trọng là: lọc ra các dữ liệu không thể tồn tại.

> Vấn đề cache penetration có thể được tìm hiểu tại: [**Nguyên tắc cơ bản của cache**]

### BitMap

- BitMap thích hợp cho các tập dữ liệu nhỏ.
- Dùng để hiệu quả đánh dấu sự tồn tại của các dữ liệu, từ đó giúp loại bỏ các truy vấn không cần thiết.

### BloomFilter

- BloomFilter thích hợp cho các tập dữ liệu lớn.
- Sử dụng để kiểm tra xem một phần tử có tồn tại trong tập dữ liệu hay không, mà không cần phải lấy toàn bộ dữ liệu từ bộ nhớ đệm.

## Khóa phân tán (Distributed Lock)

Sử dụng Redis như một khóa phân tán có những điểm cơ bản sau:

- **Sự độc quyền**: Sử dụng `setnx` để chiếm giữ khóa.
- **Tránh không giải phóng khóa mãi mãi**: Sử dụng `expire` để đặt thời gian hết hạn, tránh tình trạng giữ khóa mãi mãi gây tắc nghẽn.
- **Tính nguyên tử**: `setnx` và `expire` phải được thực hiện như một lệnh nguyên tử, tránh tình trạng chiếm giữ khóa xong máy chủ bị sập mà không kịp đặt expire, dẫn đến không giải phóng khóa.

> Để biết thêm về các cách triển khai khóa phân tán và chi tiết, vui lòng tham khảo: [**Nguyên tắc cơ bản của khóa phân tán**]()

## keys và scan

Sử dụng lệnh `keys` để quét danh sách các key theo một mẫu nhất định.

Nếu Redis đó đang phục vụ dịch vụ trực tuyến, việc sử dụng lệnh `keys` sẽ gặp vấn đề:

Đầu tiên, Redis là hệ thống đơn luồng. Lệnh `keys` sẽ gây chặn luồng một khoảng thời gian, dẫn đến dừng dịch vụ trực tuyến cho đến khi lệnh được thực thi xong.

Trong trường hợp này, có thể sử dụng lệnh `scan`. Lệnh `scan` cho phép trích xuất danh sách các key theo mẫu mà không chặn luồng. Tuy nhiên, có thể xảy ra sự trùng lặp nhất định, và cần thực hiện loại bỏ trùng lặp ở phía máy khách, tuy nhiên tổng thời gian thực hiện có thể dài hơn so với việc sử dụng trực tiếp lệnh `keys`.

Tuy nhiên, các lệnh duyệt tăng dần cũng không phải là không có điểm yếu: ví dụ, lệnh `SMEMBERS` có thể trả về tất cả các phần tử hiện có trong tập hợp, nhưng đối với các lệnh duyệt tăng dần như `SCAN`, do quá trình duyệt tăng dần có thể sửa đổi các key, nên chỉ có thể đảm bảo giới hạn đối với các phần tử được trả về.

## Xử lý các Key lớn trong Redis

### Key lớn Redis là gì?

Key lớn trong Redis không chỉ đơn thuần là giá trị của key lớn mà là giá trị mà key đó đang lưu trữ.

Thường thì hai trường hợp sau được gọi là "Key lớn":

- Giá trị của kiểu String lớn hơn 10 KB;
- Số lượng phần tử trong các kiểu Hash, List, Set, ZSet lớn hơn 5000 phần tử

### Key lớn có thể gây ra vấn đề gì?

Key lớn có thể gây ra các vấn đề sau đây:

- **Chặn thời gian chờ của khách hàng**: Do Redis xử lý các lệnh theo luồng đơn, các thao tác với key lớn có thể tốn nhiều thời gian, làm cho Redis bị chặn và khách hàng không nhận được phản hồi trong một thời gian dài.
- **Gây ra nghẽn mạng**: Việc truy xuất key lớn tạo ra lưu lượng mạng lớn. Ví dụ, nếu một key có kích thước là 1 MB và có 1000 lần truy cập mỗi giây, điều này có thể tạo ra 1000 MB lưu lượng mạng mỗi giây, gây khó khăn cho máy chủ có card mạng gigabit.
- **Chặn luồng làm việc**: Xóa một key lớn có thể chặn luồng làm việc, không cho phép xử lý các lệnh tiếp theo.
- **Phân phối bộ nhớ không đồng đều**: Trong mô hình cụm, nếu một số node Redis chứa các key lớn, chúng có thể chiếm nhiều bộ nhớ hơn và tạo ra một số lượng truy vấn mỗi giây (QPS) lớn hơn.

### Làm thế nào để tìm kiếm các Key lớn?

**_1. Sử dụng redis-cli --bigkeys để tìm kiếm các key lớn_**

Bạn có thể sử dụng lệnh `redis-cli --bigkeys` để tìm kiếm các key lớn trong Redis:

```shell
redis-cli -h 127.0.0.1 -p 6379 -a "password" -- bigkeys
```

Lưu ý khi sử dụng:

- Nên thực hiện lệnh này trên các node slave thay vì node master. Việc thực hiện trên node master có thể gây ra sự chậm trễ.
- Nếu không có node slave, bạn nên chọn thời điểm thấp điểm của tải hoạt động của Redis để thực hiện quét, nhằm tránh ảnh hưởng đến hoạt động bình thường của hệ thống. Hoặc bạn có thể sử dụng tham số `-i` để điều chỉnh khoảng thời gian quét và tránh giảm hiệu suất trong thời gian dài.

**Nhược điểm của phương pháp này:**

- Phương pháp này chỉ trả về key lớn nhất trong mỗi loại, không phải là danh sách các key lớn nhất.
- Đối với các loại tập hợp, phương pháp này chỉ thống kê số lượng các phần tử trong tập hợp, không phải dung lượng thực tế chiếm giữ. Điều này có nghĩa là một tập hợp có nhiều phần tử không nhất thiết phải chiếm nhiều bộ nhớ nếu mỗi phần tử có dung lượng nhỏ.

**_2. Sử dụng lệnh SCAN để tìm kiếm các key lớn_**

Bạn có thể sử dụng lệnh SCAN để quét toàn bộ cơ sở dữ liệu Redis và sau đó sử dụng lệnh TYPE để lấy loại của từng key được trả về.

Đối với các key là kiểu String, bạn có thể sử dụng lệnh STRLEN để lấy độ dài của chuỗi, tức là số byte chiếm giữ trong bộ nhớ.

Đối với các kiểu tập hợp, có hai cách để biết được kích thước bộ nhớ mà chúng chiếm giữ:

- Nếu bạn có thể biết trước kích thước trung bình của các phần tử trong tập hợp từ lớp kinh doanh, bạn có thể sử dụng các lệnh sau để lấy số lượng các phần tử trong tập hợp và sau đó nhân với kích thước trung bình của từng phần tử: Lệnh LLEN cho List, HLEN cho Hash, SCARD cho Set và ZCARD cho Sorted Set.

- Nếu bạn không thể biết trước kích thước các phần tử trong tập hợp, bạn có thể sử dụng lệnh MEMORY USAGE (yêu cầu Redis phiên bản 4.0 trở lên) để truy vấn kích thước bộ nhớ mà một key đang chiếm giữ.

**_3. Sử dụng công cụ RdbTools để tìm kiếm các key lớn_**

Bạn có thể sử dụng công cụ RdbTools, một công cụ mã nguồn mở của bên thứ ba, để phân tích các tập tin chụp Redis (RDB) và tìm kiếm các key lớn trong đó.

Ví dụ, bạn có thể sử dụng lệnh sau để xuất các key có kích thước lớn hơn 10 KB vào một tệp bảng:

```shell
rdb dump.rdb -c memory --bytes 10240 -f redis.csv
```


### Làm thế nào để xóa key lớn?

Quá trình xóa key trong Redis thực chất là giải phóng không gian bộ nhớ mà key đó đang chiếm dụng. Tuy nhiên, việc giải phóng bộ nhớ chỉ là bước đầu tiên. Để quản lý không gian bộ nhớ một cách hiệu quả hơn, khi ứng dụng giải phóng bộ nhớ, hệ điều hành cần phải chèn các khối bộ nhớ được giải phóng vào một danh sách liên kết các khối bộ nhớ trống, để sau này có thể quản lý và phân bổ lại. Quá trình này mất một khoảng thời gian nhất định và có thể làm chặn ứng dụng hiện tại đang giải phóng bộ nhớ.

Do đó, nếu giải phóng một lượng lớn bộ nhớ cùng một lúc, thời gian thực hiện các thao tác trên danh sách khối bộ nhớ trống sẽ tăng lên. Điều này có thể dẫn đến chặn trong quá trình chính của Redis. Nếu quá trình chính bị chặn, các yêu cầu khác có thể gặp phải vấn đề vượt thời gian, dẫn đến tình trạng kết nối Redis bị tiêu tốn hết và gây ra các vấn đề khác.

Vì vậy, khi thực hiện hành động xóa key lớn trong Redis, chúng ta cần phải cẩn thận. Dưới đây là hai phương pháp để làm điều này:

- Xóa key theo từng đợt (phân lô xóa)
- Xóa key bất đồng bộ (Redis phiên bản 4.0 trở lên)

#### Xoá theo đợt

**1. Xóa Hash lớn:**
   - Sử dụng lệnh `hscan` để lấy 100 trường (fields) mỗi lần.
   - Sau đó sử dụng lệnh `hdel` để xóa từng trường một.

```python
import redis

def del_large_hash():
    r = redis.StrictRedis(host='redis-host1', port=6379)
    large_hash_key = "xxx"  # Tên key hash lớn cần xóa
    cursor = '0'
    while cursor != 0:
        cursor, data = r.hscan(large_hash_key, cursor=cursor, count=100)
        for field, value in data.items():
            r.hdel(large_hash_key, field)
```

**2. Xóa List lớn:**
   - Sử dụng lệnh `ltrim` để mỗi lần chỉ giữ lại một phần nhỏ của list.

```python
import redis

def del_large_list():
    r = redis.StrictRedis(host='redis-host1', port=6379)
    large_list_key = 'xxx'  # Tên key list lớn cần xóa
    while r.llen(large_list_key) > 0:
        r.ltrim(large_list_key, 0, -101)  # Chỉ giữ lại 100 phần tử cuối cùng của list
```

**3. Xóa Set lớn:**
   - Sử dụng lệnh `sscan` để quét từng phần tử của set (100 phần tử mỗi lần).
   - Sử dụng lệnh `srem` để xóa từng phần tử một.

```python
import redis

def del_large_set():
    r = redis.StrictRedis(host='redis-host1', port=6379)
    large_set_key = 'xxx'   # Tên key set lớn cần xóa
    cursor = '0'
    while cursor != 0:
        cursor, data = r.sscan(large_set_key, cursor=cursor, count=100)
        for member in data:
            r.srem(large_set_key, member)
```

**4. Xóa Sorted Set lớn:**
   - Sử dụng lệnh `zremrangebyrank` để xóa một lượng phần tử hàng đầu của Sorted Set.

```python
import redis

def del_large_sortedset():
    r = redis.StrictRedis(host='redis-host1', port=6379)
    large_sortedset_key = 'xxx'  # Tên key Sorted Set lớn cần xóa
    while r.zcard(large_sortedset_key) > 0:
        r.zremrangebyrank(large_sortedset_key, 0, 99)  # Xóa 100 phần tử đầu tiên của Sorted Set
```

#### Xoá bất đồng bộ

Từ phiên bản Redis 4.0 trở đi, bạn có thể sử dụng **xóa bất đồng bộ** bằng cách sử dụng lệnh **unlink** thay vì **del** để xóa các key.

Khi đó, Redis sẽ đưa key này vào một luồng bất đồng bộ để thực hiện xóa, điều này giúp tránh chặn luồng chính.

Ngoài việc sử dụng lệnh unlink để thực hiện xóa bất đồng bộ, bạn cũng có thể cấu hình tham số để tự động thực hiện xóa bất đồng bộ trong một số trường hợp cụ thể.

Có tổng cộng 4 cài đặt mặc định như sau:

```text
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del
noslave-lazy-flush no
```

- **lazyfree-lazy-eviction**: Được sử dụng để xác định liệu Redis có nên kích hoạt cơ chế xóa lười biếng khi bộ nhớ vượt quá giới hạn maxmemory hay không.

- **lazyfree-lazy-expire**: Xác định liệu Redis có nên kích hoạt cơ chế xóa lười biếng cho các key hết hạn không.

- **lazyfree-lazy-server-del**: Một số lệnh khi xử lý các key đã tồn tại, ví dụ như lệnh rename, nếu key đích đã tồn tại thì Redis sẽ trước tiên xóa key đích này. Nếu key này là một big key, việc xóa có thể gây ra vấn đề chặn. Cài đặt này xác định liệu Redis có nên kích hoạt cơ chế xóa lười biếng trong trường hợp này hay không.

- **noslave-lazy-flush**: Đối với slave (nút con), khi nó tải tệp RDB của master thì trước đó nó sẽ thực hiện lệnh flushall để xóa dữ liệu của nó. Cài đặt này xác định liệu Redis có nên kích hoạt cơ chế xóa lười biếng trong trường hợp này hay không.

Đề xuất nên kích hoạt các cài đặt như lazyfree-lazy-eviction, lazyfree-lazy-expire, lazyfree-lazy-server-del để cải thiện hiệu suất thực thi của luồng chính trong Redis.
