---
title: Redis Advanced Data Types
tags: [redis, nosql]
categories: [redis]
icon: devicon:redis
order: 4
---

# Redis Advanced Data Types

Redis hỗ trợ các kiểu dữ liệu nâng cao như BitMap, HyperLogLog, GEO và Stream. Hiểu được đặc tính của các kiểu dữ liệu này và áp dụng linh hoạt và hiệu quả vào từng kịch bản nghiệp vụ cụ thể là rất quan trọng khi sử dụng Redis để mô hình hóa dữ liệu.

## BitMap

### Giới thiệu về BitMap

BitMap, như tên gọi, là một chuỗi liên tục các số nhị phân (0 và 1) trong đó các phần tử được truy cập bằng các offset. Vì bit là đơn vị nhỏ nhất trong máy tính, việc sử dụng BitMap để lưu trữ có thể **tiết kiệm rất nhiều không gian**, đặc biệt phù hợp cho các kịch bản thống kê nhị phân với tập dữ liệu lớn. Ví dụ, trong một hệ thống nơi mà người dùng được biểu diễn bằng các ID người dùng tăng dần, BitMap có thể lưu trữ hiệu quả trạng thái đăng nhập của từng người dùng. Với BitMap, hệ thống có thể xử lý đến 4 tỷ người dùng (khoảng $$2^{32}$$), chỉ cần 512 MB bộ nhớ để lưu trữ trạng thái đăng nhập.

### Thực hiện BitMap

Trong thực tế, **BitMap không phải là một cấu trúc dữ liệu độc lập mà là một tập hợp các phép toán bit được thực hiện trên chuỗi String**.

Với Redis, các chuỗi là an toàn cho dữ liệu nhị phân và có thể lưu trữ đến 512 MB độ dài. Do đó, BitMap cho phép thiết lập đến $$2^{32}$$ bit khác nhau, giúp quản lý dữ liệu nhị phân quy mô lớn một cách hiệu quả trong Redis, tận dụng khả năng lưu trữ và thao tác tối ưu của nó.

### Các Lệnh BitMap

| Lệnh     | Hành động                                                |
| -------- | -------------------------------------------------------- |
| `SETBIT` | Đặt hoặc xóa bit tại vị trí chỉ định của key            |
| `GETBIT` | Lấy giá trị bit tại vị trí chỉ định của key             |
| `BITOP`  | Thực hiện phép toán bit trên một hoặc nhiều chuỗi       |
| `BITPOS` | Tìm vị trí đầu tiên xuất hiện của giá trị chỉ định trong key |

**Ví dụ về SETBIT và GETBIT**

Giả sử có 1000 cảm biến được đánh số từ 0 đến 999. Bây giờ, muốn nhanh chóng xác định liệu một cảm biến đã thực hiện ping máy chủ trong một giờ nhất định hay không.

```shell
# Cảm biến 123 thực hiện ping máy chủ vào ngày 1 tháng 1 năm 2024 lúc 00:00
> SETBIT pings:2024-01-01-00:00 123 1
(integer) 0
# Kiểm tra xem cảm biến 123 có thực hiện ping trong ngày 1 tháng 1 năm 2024 lúc 00:00 hay không
> GETBIT pings:2024-01-01-00:00 123
1
Còn cảm biến 456 thì sao?
> GETBIT pings:2024-01-01-00:00 456
0
```

**Ví dụ về BITOP**

```shell
# Thực hiện phép toán BITOP giữa các BitMap
# operations là toán tử bit, chỉ liệt kê
  AND - Phép toán AND &
  OR - Phép toán OR |
  XOR - Phép toán XOR ^
  NOT - Phép toán NOT ~
# key1 … keyn: Các key tham gia phép toán, có thể có nhiều key, cách nhau bởi khoảng trắng, chỉ có một key
# Khi BITOP xử lý các chuỗi có độ dài khác nhau, các bit của chuỗi ngắn hơn sẽ bị coi là 0. Trả về kích thước của chuỗi (theo byte) trong destkey bằng với chuỗi dài nhất trong chuỗi đầu vào.
BITOP [operations] [result] [key1] [keyn…]

# Trả về vị trí đầu tiên của value(0/1) xuất hiện trong key
BITPOS [key] [value]
```

### Ứng dụng của BitMap

Loại dữ liệu BitMap rất thích hợp cho các kịch bản thống kê trạng thái hai giá trị, nơi mà các phần tử tập hợp chỉ có thể có giá trị 0 và 1. Trên thực tế, nó rất hiệu quả trong việc tiết kiệm không gian bộ nhớ khi lưu trữ dữ liệu lượng lớn.

#### Thống kê đăng nhập

Trong kịch bản đăng nhập, chúng ta chỉ cần ghi nhận đã đăng nhập (1) hoặc chưa đăng nhập (0), điều này là một ví dụ rõ ràng của trạng thái hai giá trị.

Khi thống kê đăng nhập, mỗi người dùng chỉ cần một bit để biểu thị đăng nhập trong một ngày, 31 bit có thể biểu thị tình trạng đăng nhập trong tháng (giả sử tháng có 31 ngày), và chỉ cần 365 bit để biểu thị đăng nhập trong một năm. Điều này không cần đến các loại tập hợp phức tạp hơn.

Giả sử chúng ta muốn thống kê người dùng có ID 100 đăng nhập trong tháng 6 năm 2022, chúng ta có thể thực hiện các bước sau.

Bước 1, thực hiện lệnh sau để ghi nhận người dùng 100 đã đăng nhập vào ngày 3 tháng 6.

```shell
SETBIT uid:sign:100:202206 2 1
```

Bước 2, kiểm tra xem người dùng 100 đã đăng nhập vào ngày 3 tháng 6 chưa.

```shell
GETBIT uid:sign:100:202206 2
```

Bước 3, thống kê số lần đăng nhập của người dùng trong tháng 6.

```shell
BITCOUNT uid:sign:100:202206
```

Như vậy, chúng ta có thể biết được tình trạng đăng nhập của người dùng trong tháng 6.

> Làm thế nào để thống kê thời gian đăng nhập đầu tiên trong tháng này?

Redis cung cấp lệnh `BITPOS key bitValue [start] [end]`, trả về vị trí offset đầu tiên của giá trị `bitValue` trong BitMap.

Mặc định, lệnh này sẽ kiểm tra toàn bộ bit map, người dùng có thể sử dụng tham số bắt buộc của "start" và "end" để xác định phạm vi kiểm tra. Vì vậy, chúng tôi có thể lấy người dùng ID = 100 thời gian đăng nhập đầu tiên vào tháng 6 năm 2022 bằng cách thực hiện lệnh sau:

```shell
BITPOS uid:sign:100:202206 1
```

Chú ý rằng, vì offset bắt đầu từ 0, chúng ta cần cộng thêm 1 cho giá trị trả về.

#### Xác định trạng thái đăng nhập của người dùng

Bitmap cung cấp các hoạt động `GETBIT` và `SETBIT`, cho phép thao tác đọc và ghi vào vị trí bit của một mảng bit, với offset bắt đầu từ 0.

Chỉ cần một key duy nhất là `login_status` để lưu trữ dữ liệu trạng thái đăng nhập của người dùng, trong đó ID của người dùng được sử dụng làm offset. Khi người dùng đăng nhập, bit tại offset tương ứng được đặt là 1; khi người dùng đăng xuất, bit đó được đặt là 0. Với 50 triệu người dùng, chỉ cần 6 MB không gian lưu trữ.

Ví dụ, để kiểm tra trạng thái đăng nhập của người dùng có ID = 10086:

Bước 1: Đặt bit tại offset 10086 để biểu thị người dùng đã đăng nhập.

```shell
SETBIT login_status 10086 1
```

Bước 2: Kiểm tra xem người dùng có ID = 10086 có đang đăng nhập hay không. Giá trị trả về là 1 nếu đã đăng nhập.

```shell
GETBIT login_status 10086
```

Bước 3: Để đăng xuất người dùng, đặt giá trị tại offset tương ứng là 0.

```shell
SETBIT login_status 10086 0
```

#### Tổng số người dùng liên tục đăng ký 7 ngày

Để đếm tổng số người dùng đã đăng ký liên tục trong 7 ngày, chúng ta sử dụng Bitmap với mỗi ngày là một key và userID là offset. Nếu người dùng đã đăng ký trong ngày đó, chúng ta đặt bit tại offset tương ứng thành 1.

Sau đó, chúng ta thực hiện phép toán "AND" trên 7 Bitmap tương ứng. Nếu bit tại offset của người dùng trong 7 ngày đều là 1, thì người dùng đó đã đăng ký liên tục trong 7 ngày.

Kết quả sẽ được lưu vào một Bitmap mới và chúng ta sử dụng `BITCOUNT` để đếm số lượng bit bằng 1 trong Bitmap mới này, từ đó xác định tổng số người dùng đã đăng ký liên tục trong 7 ngày.

Redis cung cấp lệnh `BITOP operation destkey key [key ...]` để thực hiện các phép toán bit trên một hoặc nhiều key Bitmap.

- `operation` có thể là `and`, `OR`, `NOT`, `XOR`. Khi `BITOP` xử lý các chuỗi có độ dài khác nhau, phần thiếu của chuỗi ngắn hơn sẽ được xem là `0`. Chuỗi key trống cũng được xem là chuỗi chứa `0`.

Ví dụ, để đếm số người dùng đã đăng ký liên tục trong 3 ngày, chúng ta thực hiện phép toán "AND" trên ba Bitmap và lưu kết quả vào `destmap`, sau đó sử dụng `BITCOUNT` để đếm số lượng bit bằng 1:

```shell
# Phép toán AND
BITOP AND destmap bitmap:01 bitmap:02 bitmap:03
# Đếm số lượng bit bằng 1
BITCOUNT destmap
```

Mặc dù có hàng triệu dữ liệu được tạo mỗi ngày, Bitmap vẫn chiếm ít bộ nhớ, khoảng 12 MB (10^8/8/1024/1024) cho mỗi ngày. Với 7 ngày, Bitmap chỉ chiếm khoảng 84 MB bộ nhớ. Chúng ta cũng nên đặt thời gian hết hạn cho Bitmap để Redis tự động xóa các dữ liệu đăng ký hết hạn, giúp tiết kiệm bộ nhớ.

## HyperLogLog

### Giới thiệu về HyperLogLog

HyperLogLog là một kiểu dữ liệu mới trong Redis, được thêm vào từ phiên bản 2.8.9, được sử dụng để ước tính "số lượng phần tử duy nhất" trong một tập hợp, còn được gọi là đếm cardinality. Tuy nhiên, phương pháp này là ước tính dựa trên xác suất và không cho kết quả chính xác, với mức độ sai lệch chuẩn là 0.81%.

HyperLogLog **cung cấp một cách không chính xác để đếm số lượng phần tử duy nhất**.

Ưu điểm của HyperLogLog là khi số lượng phần tử hoặc dung lượng tập hợp rất lớn, bộ nhớ cần thiết để tính cardinality luôn là cố định và rất nhỏ.

Trong Redis, mỗi khóa HyperLogLog chỉ cần sử dụng khoảng 12 KB bộ nhớ để ước tính gần `2^64` phần tử khác nhau. Điều này làm cho HyperLogLog tiết kiệm bộ nhớ hơn đáng kể so với các kiểu dữ liệu Set và Hash, mà càng có nhiều phần tử thì lại càng tiêu tốn nhiều bộ nhớ.

Để so sánh, một ví dụ trong Java: kiểu dữ liệu long chiếm 8 byte. Một byte có 8 bit, do đó kiểu long có thể biểu diễn số tối đa là `2^63-1`. Với `2^64` số lượng phần tử, và giả sử có `2^63-1` phần tử, tổng dung lượng bộ nhớ theo quy tắc `long` và `1k = 1024 bytes` sẽ là `((2^63-1) * 8/1024)K`, một con số rất lớn, vượt xa 12 KB, trong khi HyperLogLog chỉ cần 12 KB để thực hiện công việc tương tự.

Điều này cho thấy HyperLogLog là một công cụ hiệu quả để ước tính số lượng phần tử duy nhất trong các tập dữ liệu lớn mà không cần sử dụng quá nhiều bộ nhớ.

### Triển khai HyperLogLog

Việc triển khai HyperLogLog liên quan đến rất nhiều vấn đề toán học, quá tốn não và tôi không hiểu nó. Nếu bạn muốn biết thêm về nó, bạn có thể xem phần sau: [HyperLogLog](https://en.wikipedia.org/wiki/HyperLogLog)

### Các lệnh HyperLogLog

Redis cung cấp ba lệnh chính để thao tác với HyperLogLog:

1. **PFADD**: Thêm các phần tử vào HyperLogLog.
   ```shell
   PFADD key element [element ...]
   ```
   Ví dụ: `PFADD hll_logins user1 user2 user3`

2. **PFCOUNT**: Đếm số lượng phần tử duy nhất trong HyperLogLog.
   ```shell
   PFCOUNT key [key ...]
   ```
   Ví dụ: `PFCOUNT hll_logins`

3. **PFMERGE**: Hợp nhất nhiều HyperLogLog thành một HyperLogLog mới.
```shell
   PFMERGE destkey sourcekey [sourcekey ...]
```
   Ví dụ: `PFMERGE hll_total hll_logins_1 hll_logins_2 hll_logins_3`

### Ứng dụng của HyperLogLog

#### Đếm số lượng UV trang web hàng triệu người dùng

HyperLogLog trong Redis rất phù hợp để đếm số lượng người dùng duy nhất (UV) của hàng triệu người dùng trang web. Lợi thế của nó là chỉ cần dùng khoảng 12 KB bộ nhớ, có thể tính được gần `2^64` phần tử khác nhau, so với các loại dữ liệu Set và Hash truyền thống cần tiêu tốn nhiều bộ nhớ hơn khi số lượng phần tử tăng lên.

Trong việc đếm số lượng UV, bạn có thể sử dụng lệnh `PFADD` để thêm từng người dùng truy cập vào trang vào HyperLogLog:

```shell
PFADD page1:uv user1 user2 user3 user4 user5
```

Sau đó, bạn có thể sử dụng lệnh `PFCOUNT` để lấy kết quả UV của `page1`, lệnh này trả về kết quả thống kê từ HyperLogLog.

```shell
PFCOUNT page1:uv
```

Tuy nhiên, có một điều cần lưu ý, HyperLogLog thực hiện thống kê dựa trên xác suất, do đó kết quả thống kê có độ sai số nhất định, tỷ lệ sai số chuẩn là 0.81%.

Điều này có nghĩa là kết quả UV bạn tính được bằng HyperLogLog có thể là 1 triệu, nhưng số lượng UV thực tế có thể là 1.01 triệu. Mặc dù tỷ lệ sai số không lớn, nhưng nếu bạn cần kết quả thống kê chính xác hơn thì nên tiếp tục sử dụng các loại dữ liệu Set hoặc Hash.

## GEO

### Giới thiệu về GEO

Redis GEO là một loại dữ liệu mới được giới thiệu từ phiên bản Redis 3.2, chủ yếu được sử dụng để lưu trữ thông tin vị trí địa lý và thực hiện các thao tác trên dữ liệu đã lưu.

Trong cuộc sống hàng ngày, chúng ta ngày càng phụ thuộc vào các ứng dụng dựa trên dịch vụ dựa trên vị trí (Location-Based Service, LBS), như tìm kiếm "nhà hàng gần đây" hoặc gọi xe qua các ứng dụng đặt xe. Các ứng dụng này sử dụng dữ liệu liên quan đến con người hoặc đối tượng, được biểu diễn dưới dạng tập hợp các tọa độ vĩ độ và kinh độ. GEO rất phù hợp với các tình huống yêu cầu dịch vụ LBS.

### Triển khai GEO

GEO trong Redis không thiết kế một cấu trúc dữ liệu mới mà thay vào đó sử dụng kiểu dữ liệu Zset (Sorted Set) đã có sẵn.

GEO sử dụng phương pháp mã hóa GeoHash để chuyển đổi các tọa độ vĩ độ và kinh độ thành điểm số trong Sorted Set. Hai cơ chế chính trong việc triển khai là "chia bản đồ hai chiều thành các khoảng" và "mã hóa các khoảng này". Khi một tập hợp các tọa độ vĩ độ và kinh độ rơi vào một khoảng nào đó, chúng sẽ được biểu diễn bằng giá trị mã hóa của khoảng đó, và giá trị mã hóa này sẽ được sử dụng làm điểm số của các phần tử trong Sorted Set.

Như vậy, chúng ta có thể lưu trữ các tọa độ vĩ độ và kinh độ vào trong Sorted Set và sử dụng tính năng "tìm kiếm theo khoảng có thứ tự dựa trên điểm số" của Sorted Set để thực hiện các yêu cầu "tìm kiếm gần đây" mà dịch vụ dựa trên vị trí (LBS) thường xuyên sử dụng.

### Các lệnh GEO

```shell
# Lưu trữ vị trí địa lý chỉ định, có thể thêm một hoặc nhiều kinh độ (longitude), vĩ độ (latitude), và tên thành viên (member) vào key chỉ định.
GEOADD key longitude latitude member [longitude latitude member ...]

# Trả về vị trí (kinh độ và vĩ độ) của các tên thành viên chỉ định từ key chỉ định, các thành viên không tồn tại trả về nil.
GEOPOS key member [member ...]

# Trả về khoảng cách giữa hai vị trí địa lý chỉ định.
GEODIST key member1 member2 [m|km|ft|mi]

# Dựa trên tọa độ vĩ độ và kinh độ mà người dùng cung cấp, trả về tập hợp các vị trí địa lý nằm trong phạm vi chỉ định.
GEORADIUS key longitude latitude radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key]
```

### Ứng dụng của GEO

#### Gọi xe qua ứng dụng như của Didi

Ví dụ về cách sử dụng lệnh GEOADD và GEORADIUS trong kịch bản gọi xe của Didi.

Giả sử xe có ID là 33, vị trí kinh độ và vĩ độ là (116.034579, 39.030452), chúng ta có thể lưu trữ vị trí hiện tại của xe số ID 33 vào tập hợp GEO bằng cách sau:

```shell
GEOADD cars:locations 116.034579 39.030452 33
```

Khi người dùng muốn tìm xe gần nhất, ứng dụng LBS có thể sử dụng lệnh GEORADIUS.

Ví dụ, khi ứng dụng LBS thực thi lệnh sau đây, Redis sẽ dựa trên thông tin tọa độ vĩ độ và kinh độ (116.054579, 39.030452) được cung cấp, tìm kiếm thông tin xe trong bán kính 5 km tính từ tọa độ này và trả về cho ứng dụng LBS.

```shell
GEORADIUS cars:locations 116.054579 39.030452 5 km ASC COUNT 10
```

## Stream

### Giới thiệu về Stream

Redis Stream là một loại dữ liệu mới được thêm vào từ phiên bản Redis 5.0, được Redis thiết kế đặc biệt cho các hệ thống hàng đợi tin nhắn.

Trước khi có Redis Stream trong Redis 5.0, các cách triển khai hàng đợi tin nhắn đều có những hạn chế riêng, ví dụ như:

- Mô hình publish-subscribe không hỗ trợ lưu trữ vĩnh viễn, do đó không đảm bảo việc lưu trữ tin nhắn một cách đáng tin cậy và không thể đọc các tin nhắn lịch sử cho các khách hàng kết nối lại sau khi mất kết nối.
- Danh sách (List) không thể hỗ trợ tiêu thụ lại (reconsume) các tin nhắn, một khi tin nhắn đã được tiêu thụ thì sẽ bị xóa, và nhà sản xuất (producer) phải tự thực hiện việc tạo ID duy nhất toàn cầu.

Dựa trên các vấn đề này, Redis 5.0 đã ra mắt loại dữ liệu Stream, là tính năng quan trọng nhất của phiên bản này, được thiết kế để hoàn thành hệ thống hàng đợi tin nhắn một cách hoàn hảo. Stream hỗ trợ lưu trữ tin nhắn một cách vĩnh viễn, tự động tạo ID duy nhất toàn cầu, hỗ trợ phương thức xác nhận (ack) tin nhắn, hỗ trợ mô hình nhóm tiêu thụ (consumer group), giúp cho hệ thống hàng đợi tin nhắn trở nên ổn định và tin cậy hơn.

### Các lệnh của Stream

Các lệnh hoạt động với hàng đợi tin nhắn Stream:

- **XADD**: Thêm tin nhắn vào hàng đợi, đảm bảo thứ tự và có thể tự động tạo ID duy nhất toàn cầu.
- **XLEN**: Truy vấn độ dài của hàng đợi tin nhắn.
- **XREAD**: Đọc tin nhắn từ hàng đợi, có thể đọc dữ liệu theo ID.
- **XDEL**: Xóa tin nhắn dựa trên ID của tin nhắn.
- **DEL**: Xóa toàn bộ Stream.
- **XRANGE**: Đọc tin nhắn trong một khoảng cụ thể.
- **XREADGROUP**: Đọc tin nhắn dưới dạng nhóm tiêu thụ.
- **XPENDING** và **XACK**:
  - **XPENDING**: Truy vấn các tin nhắn "đã đọc nhưng chưa được xác nhận" của mỗi nhóm tiêu thụ.
  - **XACK**: Xác nhận rằng việc xử lý tin nhắn đã hoàn thành đối với hàng đợi tin nhắn.

Các lệnh này giúp trong việc quản lý và điều khiển các tin nhắn trong hệ thống hàng đợi Stream của Redis một cách linh hoạt và hiệu quả.

### Ứng dụng Stream

#### Hàng đợi tin nhắn

Nhà sản xuất sử dụng lệnh XADD để chèn một tin nhắn:

```shell
# * biểu thị để Redis tự động tạo một ID duy nhất toàn cầu cho dữ liệu được chèn
# Chèn một tin nhắn vào hàng đợi tin nhắn có tên là mymq, với khóa là name và giá trị là xiaolin
> XADD mymq * name xiaolin
"1654254953808-0"
```

Sau khi chèn thành công, Redis sẽ trả về một ID duy nhất toàn cầu là "1654254953808-0". ID này bao gồm hai phần:

- Phần đầu tiên "1654254953808" là thời gian hiện tại tính bằng mili giây khi dữ liệu được chèn vào;
- Phần thứ hai chỉ ra số thứ tự của tin nhắn trong cùng một mili giây. Ví dụ, "1654254953808-0" biểu thị tin nhắn đầu tiên trong mili giây "1654254953808".

Người tiêu thụ sử dụng lệnh XREAD để đọc tin nhắn từ hàng đợi khi có thể chỉ định một ID tin nhắn và bắt đầu đọc tin nhắn tiếp theo sau ID này (lưu ý là đọc tin nhắn bắt đầu từ ID tin nhắn nhập vào mà không phải là ID đã nhập vào).

```shell
# Bắt đầu đọc tất cả các tin nhắn sau ID "1654254953807-0" (trong ví dụ này là có 1 tin nhắn)
> XREAD STREAMS mymq 1654254953807-0
1) 1) "mymq"
   2) 1) 1) "1654254953808-0"
         2) 1) "name"
            2) "xiaolin"
```

Nếu bạn muốn thực hiện đọc chặn (block-read) khi không có dữ liệu, bạn có thể thiết lập BLOCK khi sử dụng lệnh XREAD, tương tự như hoạt động BRPOP.

Ví dụ, lệnh sau đây thiết lập BLOCK là 10000, đơn vị là mili giây, cho biết rằng XREAD sẽ chặn trong 10000 mili giây (tức là 10 giây) khi đọc tin nhắn mới nhất và sau đó trả về.

```shell
# Ký tự “$” cuối cùng của lệnh biểu thị rằng đang đọc tin nhắn mới nhất
> XREAD BLOCK 10000 STREAMS mymq $
(nil)
(10.00s)
```

Các phương pháp cơ bản của Stream, sử dụng XADD để lưu trữ tin nhắn và XREAD để đọc tin nhắn chặn có thể triển khai một phiên bản đơn giản của hàng đợi tin nhắn, các quy trình tương tác như hình dưới đây:

> Các thao tác này đã được hỗ trợ bởi List, và sau đó chúng ta sẽ xem xét các tính năng đặc biệt của Stream.

Stream có thể sử dụng **XGROUP để tạo nhóm tiêu thụ**, sau đó Stream có thể sử dụng lệnh XREADGROUP để các tiêu thụ trong nhóm đọc tin nhắn.

Tạo hai nhóm tiêu thụ, mỗi nhóm đọc từ hàng đợi tin nhắn mymq, bắt đầu từ tin nhắn đầu tiên:

```shell
# Tạo nhóm tiêu thụ có tên là group1, bắt đầu từ tin nhắn đầu tiên (0-0).
> XGROUP CREATE mymq group1 0-0
OK
# Tạo nhóm tiêu thụ có tên là group2, bắt đầu từ tin nhắn đầu tiên (0-0).
> XGROUP CREATE mymq group2 0-0
OK
```

Lệnh để tiêu thụ consumer1 trong nhóm group1 đọc tất cả các tin nhắn từ hàng đợi tin nhắn mymq như sau:

```shell
# Tham số cuối cùng của lệnh là “>”, chỉ định đọc từ tin nhắn chưa được tiêu thụ đầu tiên.
> XREADGROUP GROUP group1 consumer1 STREAMS mymq >
1) 1) "mymq"
   2) 1) 1) "1654254953808-0"
         2) 1) "name"
            2) "xiaolin"
```

**Một khi một tin nhắn trong hàng đợi tin nhắn đã được tiêu thụ bởi một tiêu thụ trong nhóm, thì không thể tiêu thụ lại bởi các tiêu thụ khác trong cùng một nhóm**, điều này có nghĩa là các tiêu thụ trong cùng một nhóm không thể tiêu thụ cùng một tin nhắn.

Ví dụ, nếu chúng ta thực hiện lại lệnh XREADGROUP đã nêu, kết quả sẽ là giá trị null:

```shell
> XREADGROUP GROUP group1 consumer1 STREAMS mymq >
(nil)
```

Tuy nhiên, **các tiêu thụ trong các nhóm khác nhau có thể tiêu thụ cùng một tin nhắn (với điều kiện rằng các nhóm tiêu thụ đã chỉ định cùng một vị trí bắt đầu đọc tin nhắn)**.

Ví dụ, sau khi tiêu thụ consumer1 trong nhóm group1 đã tiêu thụ tin nhắn với ID 1654254953808-0, consumer1 trong nhóm group2 có thể tiếp tục tiêu thụ tin nhắn:

```shell
> XREADGROUP GROUP group2 consumer1 STREAMS mymq >
1) 1) "mymq"
   2) 1) 1) "1654254953808-0"
         2) 1) "name"
            2) "xiaolin"
```

Vì tôi đã tạo hai nhóm tiêu thụ để đọc từ tin nhắn đầu tiên, bạn có thể thấy rằng tiêu thụ trong nhóm thứ hai vẫn có thể tiêu thụ tin nhắn với ID 1654254953808-0. Do đó, các tiêu thụ trong các nhóm khác nhau có thể tiêu thụ cùng một tin nhắn.

Mục đích của việc sử dụng nhóm tiêu thụ là để các tiêu thụ trong nhóm chia sẻ việc đọc tin nhắn, do đó, thường ta sẽ cho mỗi tiêu thụ đọc một phần tin nhắn để phân phối tải đọc tin nhắn đều đặn giữa các tiêu thụ.

Ví dụ, chúng ta thực hiện các lệnh sau để cho consumer1, 2, 3 trong group2 mỗi người đọc một tin nhắn.

```shell
# Cho consumer1 trong group2 đọc một tin nhắn từ hàng đợi tin nhắn mymq
> XREADGROUP GROUP group2 consumer1 COUNT 1 STREAMS mymq >
1) 1) "mymq"
   2) 1) 1) "1654254953808-0"
         2) 1) "name"
            2) "xiaolin"
# Cho consumer2 trong group2 đọc một tin nhắn từ hàng đợi tin nhắn mymq
> XREADGROUP GROUP group2 consumer2 COUNT 1 STREAMS mymq >
1) 1) "mymq"
   2) 1) 1) "1654256265584-0"
         2) 1) "name"
            2) "xiaolincoding"
# Cho consumer3 trong group2 đọc một tin nhắn từ hàng đợi tin nhắn mymq
> XREADGROUP GROUP group2 consumer3 COUNT 1 STREAMS mymq >
1) 1) "mymq"
   2) 1) 1) "1654256271337-0"
         2) 1) "name"
            2) "Tom"
```

> Dựa trên Stream để triển khai hàng đợi tin nhắn, làm thế nào để đảm bảo rằng người tiêu thụ có thể đọc tin nhắn chưa được xử lý khi gặp sự cố hoặc khởi động lại sau khi bị gián đoạn?

Streams tự động sử dụng danh sách nội bộ (gọi là PENDING List) để lưu trữ tin nhắn mà mỗi tiêu thụ trong nhóm đã đọc, cho đến khi tiêu thụ gửi lệnh XACK cho Streams để thông báo rằng "tin nhắn đã được xử lý xong".

Xác nhận tiêu thụ tăng cường tính tin cậy của tin nhắn. Thông thường, sau khi xử lý công việc, cần thực hiện lệnh XACK để xác nhận rằng tin nhắn đã được xử lý. Toàn bộ quy trình hoạt động được thực hiện như trong hình dưới đây:

Nếu tiêu thụ không xử lý tin nhắn thành công, nó sẽ không gửi lệnh XACK cho Streams, và tin nhắn sẽ tiếp tục được lưu trữ. Khi đó, **tiêu thụ có thể sử dụng lệnh XPENDING để xem các tin nhắn đã được đọc nhưng chưa được xác nhận đã xử lý** sau khi khởi động lại.

Ví dụ, chúng ta sẽ xem xét số lượng các tin nhắn mà từng người tiêu thụ trong group2 đã đọc nhưng chưa xác nhận, các lệnh như sau:

```shell
127.0.0.1:6379> XPENDING mymq group2
1) (integer) 3
2) "1654254953808-0"  # Đại diện cho ID tin nhắn nhỏ nhất mà từng người tiêu thụ trong group2 đã đọc
3) "1654256271337-0"  # Đại diện cho ID tin nhắn lớn nhất mà từng người tiêu thụ trong group2 đã đọc
4) 1) 1) "consumer1"
      2) "1"
   2) 1) "consumer2"
      2) "1"
   3) 1) "consumer3"
      2) "1"
```

Nếu muốn xem những dữ liệu cụ thể nào mà một người tiêu thụ đã đọc, bạn có thể thực thi các lệnh như sau:

```shell
# Xem group2 trong consumer2 đã đọc tin nhắn từ hàng đợi tin nhắn mymq
> XPENDING mymq group2 - + 10 consumer2
1) 1) "1654256265584-0"
   2) "consumer2"
   3) (integer) 410700
   4) (integer) 1
```

Có thể thấy rằng, consumer2 đã đọc ID tin nhắn là 1654256265584-0.

**Một khi tin nhắn 1654256265584-0 đã được consumer2 xử lý, consumer2 có thể sử dụng lệnh XACK để thông báo cho Streams, và sau đó tin nhắn này sẽ được xóa**.

```shell
> XACK mymq group2 1654256265584-0
(integer) 1
```

Khi chúng ta sử dụng lại lệnh XPENDING để xem, chúng ta có thể thấy rằng consumer2 đã không còn tin nhắn nào đã đọc nhưng chưa xác nhận xử lý.

```shell
> XPENDING mymq group2 - + 10 consumer2
(empty array)
```

Tóm lại, đây là cách thực hiện hàng đợi tin nhắn dựa trên Stream, và những điểm cần nhớ:

- Bảo đảm thứ tự tin nhắn: XADD/XREAD
- Đọc chặn: XREAD block
- Xử lý tin nhắn lặp lại: Stream khi sử dụng lệnh XADD sẽ tự động tạo ID duy nhất toàn cầu;
- Độ tin cậy của tin nhắn: Sử dụng PENDING List nội bộ để tự động lưu trữ tin nhắn, sử dụng lệnh XPENDING để xem tin nhắn đã được nhóm tiêu thụ đọc nhưng chưa được xác nhận, tiêu thụ sử dụng lệnh XACK để xác nhận tin nhắn;
- Hỗ trợ tiêu thụ dạng nhóm cho dữ liệu.

> Sự khác biệt giữa hàng đợi tin nhắn dựa trên Stream của Redis và hàng đợi tin nhắn chuyên nghiệp là gì?

Một hệ thống hàng đợi tin nhắn chuyên nghiệp cần đảm bảo hai điều quan trọng:

- Không mất tin nhắn.
- Có thể tích lũy tin nhắn.

_1. Redis Stream có mất tin nhắn không?_

Việc sử dụng một hệ thống hàng đợi tin nhắn chia thành ba phần chính: **nhà sản xuất, hàng đợi tin nhắn (MQ), người tiêu thụ**, vì vậy để đảm bảo tin nhắn không mất có nghĩa là cần đảm bảo không mất dữ liệu ở ba mắt xích này.

Hệ thống hàng đợi tin nhắn Redis Stream có thể đảm bảo không mất dữ liệu ở ba mắt xích này không?

- Nhà sản xuất Redis có mất tin nhắn không? Việc mất tin nhắn của nhà sản xuất Redis phụ thuộc vào cách xử lý các tình huống ngoại lệ của nhà sản xuất. Quá trình từ khi tin nhắn được tạo ra, sau đó gửi đến MQ, chỉ cần nhận được phản hồi xác nhận ack từ MQ (hàng đợi tin nhắn), nghĩa là quá trình gửi thành công. Vì vậy, chỉ cần xử lý giá trị trả về và ngoại lệ, nếu trả về ngoại lệ thì thực hiện gửi lại tin nhắn, giai đoạn này sẽ không bao giờ mất tin nhắn.

- Người tiêu thụ Redis có mất tin nhắn không? Không, vì Redis Stream sử dụng danh sách PENDING trong nội bộ để lưu giữ các tin nhắn mà từng người tiêu thụ trong nhóm đã đọc, nhưng chưa được xác nhận. Người tiêu thụ có thể sử dụng lệnh XPENDING để xem các tin nhắn đã được đọc nhưng chưa được xác nhận xử lý hoàn thành sau khi khởi động lại. Khi hoàn thành logic kinh doanh, người tiêu thụ gửi lệnh xác nhận tiêu thụ XACK, cũng có thể đảm bảo rằng tin nhắn không bị mất.

- Hàng đợi tin nhắn tin nhắn Redis có mất tin nhắn không? Có, Redis trong hai tình huống sau đây, sẽ dẫn đến mất dữ liệu:
   - Cấu hình bền vững AOF mỗi giây ghi đĩa, nhưng quá trình này viết vào đĩa là không đồng bộ, Redis bị ngừng khi có thể mất dữ liệu.
   - Sao chép Master-Slave cũng là bất đồng bộ, có thể gây mất dữ liệu trong quá trình chuyển đổi giữa master và slave.

Có thể thấy rằng, Redis không thể đảm bảo không mất tin nhắn trong giai đoạn trung tâm hàng đợi. Như RabbitMQ hoặc Kafka, các trung tâm hàng đợi chuyên nghiệp như vậy khi triển khai là một cụm, nhà sản xuất khi phát hành tin nhắn, trung tâm hàng đợi thường viết "nhiều nút", nghĩa là có nhiều bản sao, như vậy ngay cả khi một trong số đó lỗi, cũng có thể đảm bảo rằng không có dữ liệu bị mất.

_2. Redis Stream có thể tích lũy tin nhắn không?_

Dữ liệu của Redis được lưu trữ trong bộ nhớ, điều này có nghĩa là khi có sự tích lũy tin nhắn, bộ nhớ của Redis sẽ tăng lên liên tục. Nếu vượt quá giới hạn bộ nhớ của máy, sẽ gặp rủi ro bị OOM (Out of Memory).

Vì vậy, Redis Stream cung cấp tính năng cho phép chỉ định độ dài tối đa của hàng đợi, để tránh tình trạng này xảy ra.

Khi chỉ định độ dài tối đa của hàng đợi, nếu độ dài hàng đợi vượt quá giới hạn, các tin nhắn cũ sẽ bị xóa, chỉ giữ lại các tin nhắn mới có độ dài cố định. Xét về mặt này, khi có sự tích lũy tin nhắn, nếu đã chỉ định độ dài tối đa, Redis Stream vẫn có thể mất tin nhắn.

Tuy nhiên, các hệ thống hàng đợi tin nhắn chuyên nghiệp như Kafka, RabbitMQ lưu trữ dữ liệu trên đĩa cứng, khi có sự tích lũy tin nhắn, chỉ đơn giản là chiếm thêm một ít không gian đĩa cứng.

Do đó, khi sử dụng Redis làm hàng đợi sẽ gặp phải hai vấn đề:

- Redis bản thân có thể mất dữ liệu.
- Khi có sự tích lũy tin nhắn, tài nguyên bộ nhớ sẽ trở nên căng thẳng.

Vì vậy, liệu có thể sử dụng Redis làm hàng đợi tin nhắn hay không, phụ thuộc vào tình huống cụ thể của doanh nghiệp của bạn:

- Nếu tình huống doanh nghiệp của bạn đủ đơn giản, không nhạy cảm với việc mất dữ liệu và xác suất tích lũy tin nhắn khá nhỏ, thì việc sử dụng Redis làm hàng đợi là hoàn toàn có thể.
- Nếu doanh nghiệp của bạn có một lượng lớn tin nhắn, xác suất tích lũy tin nhắn lớn, và không chấp nhận mất dữ liệu, thì nên sử dụng các hệ thống hàng đợi tin nhắn chuyên nghiệp.

**Bổ sung: Tại sao cơ chế xuất bản/đăng ký của Redis không thể được sử dụng như một hàng đợi tin nhắn?**

Cơ chế xuất bản/đăng ký có những nhược điểm sau, tất cả đều liên quan đến việc mất dữ liệu:

1. Cơ chế xuất bản/đăng ký không dựa trên bất kỳ loại dữ liệu nào, do đó không có khả năng "lưu trữ dữ liệu bền vững". Các thao tác liên quan đến cơ chế xuất bản/đăng ký sẽ không được ghi vào RDB và AOF. Khi Redis bị sập và khởi động lại, dữ liệu của cơ chế xuất bản/đăng ký sẽ bị mất hết.
2. Mô hình xuất bản/đăng ký hoạt động theo kiểu "phát sau quên", nếu có người đăng ký nào đó bị ngắt kết nối và kết nối lại, họ sẽ không thể nhận được các tin nhắn lịch sử trước đó.
3. Khi bên tiêu thụ có sự tích lũy tin nhắn, tức là người sản xuất gửi tin nhắn mà người tiêu thụ không thể tiêu thụ kịp, nếu vượt quá 32MB hoặc liên tục duy trì trên 8MB trong vòng 60 giây, kết nối của bên tiêu thụ sẽ bị ngắt tự động. Tham số này được thiết lập trong tệp cấu hình, giá trị mặc định là `client-output-buffer-limit pubsub 32mb 8mb 60`.

Vì vậy, cơ chế xuất bản/đăng ký chỉ thích hợp cho các tình huống truyền thông tức thời, ví dụ như trong trường hợp [xây dựng cụm Sentinel](https://xiaolincoding.com/redis/cluster/sentinel.html#%E5%93%A8%E5%85%B5%E9%9B%86%E7%BE%A4%E6%98%AF%E5%A6%82%E4%BD%95%E7%BB%84%E6%88%90%E7%9A%84) sử dụng cơ chế xuất bản/đăng ký.
