---
title: Redis Transaction
tags:
  - redis
  - nosql
categories:
  - redis
icon: devicon:redis
order: 13
---
# Redis Transaction

> **Redis chỉ hỗ trợ giao dịch "không nghiêm ngặt"**. Gọi là "không nghiêm ngặt" vì: Giao dịch Redis đảm bảo "tất cả các lệnh sẽ được thực thi"; nhưng, giao dịch Redis "không hỗ trợ việc quay lui".

# Redis Giao dịch

> **Redis chỉ hỗ trợ giao dịch "không nghiêm ngặt"**. Gọi là "không nghiêm ngặt" vì: Giao dịch Redis đảm bảo "tất cả các lệnh sẽ được thực thi"; nhưng, giao dịch Redis "không hỗ trợ việc quay lui".
>
> Từ khóa: `giao dịch`, `ACID`, `MULTI`, `EXEC`, `DISCARD`, `WATCH`

## Giới thiệu về Giao dịch Redis

### ACID là gì?

ACID là bốn yếu tố cơ bản để đảm bảo việc thực thi đúng các giao dịch trong cơ sở dữ liệu.

- **Tính nguyên tử (Atomicity)**
  - Giao dịch được xem là đơn vị nhỏ nhất không thể chia cắt, các thao tác trong giao dịch **hoặc tất cả đều được cam kết thành công, hoặc tất cả đều thất bại và quay lui**.
  - Việc quay lui có thể được thực hiện thông qua nhật ký, nhật ký ghi lại các thao tác sửa đổi mà giao dịch đã thực hiện, trong quá trình quay lui sẽ thực hiện ngược các thao tác sửa đổi này.
- **Tính nhất quán (Consistency)**
  - Cơ sở dữ liệu giữ trạng thái nhất quán trước và sau khi giao dịch thực hiện.
  - Trong trạng thái nhất quán, kết quả đọc dữ liệu của tất cả các giao dịch đối với một dữ liệu là giống nhau.
- **Tính cô lập (Isolation)**
  - Các sửa đổi do một giao dịch thực hiện trước khi được cam kết cuối cùng là không nhìn thấy đối với các giao dịch khác.
- **Tính bền vững (Durability)**
  - Một khi giao dịch đã được cam kết, các sửa đổi sẽ được lưu giữ mãi mãi trong cơ sở dữ liệu. Ngay cả khi hệ thống gặp sự cố, kết quả thực hiện của giao dịch cũng không bị mất.
  - Có thể thực hiện thông qua việc sao lưu và khôi phục cơ sở dữ liệu, trong trường hợp hệ thống gặp sự cố, sử dụng cơ sở dữ liệu sao lưu để khôi phục dữ liệu.

**Một hệ thống cơ sở dữ liệu hỗ trợ giao dịch phải có bốn đặc tính này, nếu không trong quá trình xử lý giao dịch không thể đảm bảo tính đúng đắn của dữ liệu, quá trình giao dịch có thể không đạt được mục tiêu.**

- Chỉ khi đáp ứng tính nhất quán, kết quả thực hiện của giao dịch mới là đúng.
- Trong trường hợp không có đồng thời, giao dịch thực hiện tuần tự, tính cô lập chắc chắn sẽ được đảm bảo. Lúc này chỉ cần đảm bảo tính nguyên tử, nhất định sẽ đảm bảo tính nhất quán.
- Trong trường hợp đồng thời, nhiều giao dịch thực hiện song song, giao dịch không chỉ phải đảm bảo tính nguyên tử, mà còn phải đảm bảo tính cô lập để đảm bảo tính nhất quán.
- Đảm bảo tính bền vững của giao dịch để đối phó với các tình huống hệ thống gặp sự cố.

![ACID](https://raw.githubusercontent.com/vanhung4499/images/master/snap/acid.png)

### Đặc tính của Giao dịch Redis

Giao dịch Redis luôn hỗ trợ tính nguyên tử, tính nhất quán và tính cô lập của ACID. Khi máy chủ chạy ở chế độ lưu trữ bền vững AOF và giá trị của tùy chọn `appendfsync` là `always`, giao dịch cũng có tính bền vững.

Tuy nhiên, cần lưu ý rằng: **Redis chỉ hỗ trợ giao dịch "không nghiêm ngặt"**. "Không nghiêm ngặt" ở đây thực chất là chỉ giao dịch Redis chỉ có thể đảm bảo một phần tính nguyên tử của ACID.

- **Giao dịch Redis đảm bảo tất cả các lệnh được thực thi** - Nhiều lệnh trong giao dịch Redis sẽ được đóng gói vào hàng đợi giao dịch, sau đó thực hiện theo thứ tự vào trước ra trước (FIFO). Giao dịch sẽ không bị gián đoạn trong quá trình thực hiện, khi tất cả các lệnh trong hàng đợi giao dịch đã được thực hiện xong, giao dịch mới kết thúc.
- **Giao dịch Redis không hỗ trợ quay lui** - Nếu lệnh thực hiện thất bại sẽ không quay lui mà sẽ tiếp tục thực hiện.

Theo tài liệu chính thức của Redis về đặc tính giao dịch (transaction features documentation), lý do không hỗ trợ quay lui là:

- Lệnh Redis chỉ thất bại do lỗi cú pháp, hoặc lệnh được sử dụng trên loại khóa không đúng.
- Vì không cần hỗ trợ quay lui, nội bộ của Redis có thể giữ đơn giản và nhanh chóng.


## Ứng dụng Transaction trong Redis

Các lệnh [`MULTI`](https://redis.io/commands/multi), [`EXEC`](https://redis.io/commands/exec), [`DISCARD`](https://redis.io/commands/discard), và [`WATCH`](https://redis.io/commands/watch) liên quan đến giao dịch trong Redis.

Giao dịch cho phép thực thi nhiều lệnh cùng một lúc và có hai cam kết quan trọng sau đây:

- **Giao dịch là một hoạt động đơn lẻ độc lập:** Tất cả các lệnh trong giao dịch sẽ được thực thi tuần tự theo thứ tự. Trong quá trình thực thi giao dịch, không có lệnh từ các khách hàng khác có thể làm gián đoạn.

- **Giao dịch là một hoạt động nguyên tử:** Tất cả các lệnh trong giao dịch sẽ được thực thi hoàn toàn hoặc không thực thi gì cả.

### MULTI

**Lệnh [`MULTI`](https://redis.io/commands/multi) được sử dụng để bắt đầu một giao dịch và luôn luôn trả về OK.**

Sau khi gọi lệnh `MULTI`, khách hàng có thể tiếp tục gửi bất kỳ số lượng lệnh nào đến máy chủ, các lệnh này sẽ không được thực thi ngay lập tức mà sẽ được đưa vào một hàng đợi. Khi lệnh `EXEC` được gọi, tất cả các lệnh trong hàng đợi sẽ được thực thi.

Dưới đây là một ví dụ về giao dịch, trong đó tăng giá trị của hai khóa `foo` và `bar`:

```redis
> MULTI
OK
> INCR foo
QUEUED
> INCR bar
QUEUED
> EXEC
1) (integer) 1
2) (integer) 1
```

### EXEC

**Lệnh [`EXEC`](https://redis.io/commands/exec) được sử dụng để kích hoạt và thực thi tất cả các lệnh trong giao dịch.**

- Nếu khách hàng đã sử dụng lệnh `MULTI` để bắt đầu một giao dịch nhưng bị ngắt kết nối trước khi gọi `EXEC`, thì tất cả các lệnh trong giao dịch sẽ không được thực thi.
- Ngược lại, nếu khách hàng thành công trong việc thực thi lệnh `EXEC` sau khi bắt đầu giao dịch bằng `MULTI`, thì tất cả các lệnh trong giao dịch sẽ được thực thi.

Các hoạt động trong `MULTI` và `EXEC` sẽ được gửi đến máy chủ một lần duy nhất thay vì từng lần gửi lệnh riêng lẻ, điều này được gọi là "đường ống lệnh" (pipeline), giúp giảm thiểu số lần giao tiếp mạng giữa khách hàng và máy chủ, từ đó cải thiện hiệu suất.

### DISCARD

**Khi thực thi lệnh [`DISCARD`](https://redis.io/commands/discard), giao dịch sẽ bị hủy bỏ, hàng đợi giao dịch sẽ được xóa và khách hàng sẽ thoát khỏi trạng thái giao dịch.**

Ví dụ:

```redis
> SET foo 1
OK
> MULTI
OK
> INCR foo
QUEUED
> DISCARD
OK
> GET foo
"1"
```

### WATCH

**Lệnh [`WATCH`](https://redis.io/commands/watch) trong Redis cung cấp hành vi "check-and-set" (CAS) cho giao dịch.**

Khi một hoặc nhiều khóa được `WATCH`, Redis sẽ theo dõi những khóa này và phát hiện xem chúng có bị thay đổi không. Nếu ít nhất một khóa đã được theo dõi bị thay đổi trước khi `EXEC` được thực thi, toàn bộ giao dịch sẽ bị hủy bỏ và `EXEC` sẽ trả về `nil-reply` để báo hiệu rằng giao dịch đã thất bại.

```redis
WATCH mykey
val = GET mykey
val = val + 1
MULTI
SET mykey $val
EXEC
```

Trong đoạn mã trên, nếu sau khi thực hiện `WATCH` và trước khi thực thi `EXEC`, có một khách hàng khác thay đổi giá trị của `mykey`, thì giao dịch của khách hàng hiện tại sẽ thất bại. Trong trường hợp này, chương trình có thể cần thử lại hoạt động này, cho đến khi không có xung đột nào xảy ra.

Cơ chế khóa này được gọi là khóa lạc quan (optimistic locking), là một cơ chế khóa mạnh mẽ vì hầu hết các trường hợp, các khách hàng khác nhau sẽ truy cập vào các khóa khác nhau, do đó ít xảy ra xung đột.

**Chú ý:**
- `WATCH` làm cho `EXEC` chỉ thực thi nếu tất cả các khóa đã theo dõi không bị thay đổi.
- `WATCH` có thể được gọi nhiều lần. Việc theo dõi các khóa bắt đầu từ khi `WATCH` được thực thi cho đến khi `EXEC` được gọi.
- Khi `EXEC` được gọi, việc theo dõi các khóa sẽ bị hủy bỏ, dù giao dịch có thành công hay không. Ngoài ra, khi một khách hàng bị ngắt kết nối, việc theo dõi các khóa cũng sẽ bị hủy bỏ.

**Hủy WATCH:**
- Sử dụng lệnh `UNWATCH` không có tham số để hủy bỏ theo dõi tất cả các khóa. Điều này có thể hữu ích khi một giao dịch cần hủy bỏ ngay lập tức và chờ giao dịch thử lại sau.

**Sử dụng WATCH để tạo hành động nguyên tử:**
- `WATCH` có thể được sử dụng để tạo các hành động nguyên tử mà Redis không hỗ trợ sẵn.
- Ví dụ, đoạn mã sau triển khai lệnh `ZPOP` tùy chỉnh để loại bỏ phần tử có giá trị (score) nhỏ nhất trong một tập hợp có thứ tự:

```redis
WATCH zset
element = ZRANGE zset 0 0
MULTI
ZREM zset element
EXEC
```
