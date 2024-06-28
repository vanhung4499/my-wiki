---
title: Redis Event
tags:
  - redis
  - nosql
categories:
  - redis
icon: devicon:redis
order: 8
---
# Redis Event

> Máy chủ Redis là một chương trình điều khiển sự kiện, máy chủ cần xử lý hai loại sự kiện:
>
> - **Sự kiện tệp (file event)** - Máy chủ Redis giao tiếp với các khách hàng hoặc các máy chủ khác thông qua các socket. Sự kiện tệp là một sự trừu tượng của các thao tác trên socket. Giao tiếp giữa máy chủ và khách hàng (hoặc các máy chủ khác) sẽ tạo ra các sự kiện tệp, và máy chủ sẽ hoàn thành một loạt các thao tác giao tiếp mạng bằng cách lắng nghe và xử lý các sự kiện này.
> - **Sự kiện thời gian (time event)** - Máy chủ Redis có một số thao tác cần được thực hiện vào một thời điểm nhất định. Sự kiện thời gian là một sự trừu tượng của các thao tác định kỳ này.

## Sự kiện tệp

Redis đã phát triển bộ xử lý sự kiện mạng của riêng mình dựa trên mô hình Reactor.

- Bộ xử lý sự kiện tệp của Redis sử dụng chương trình I/O đa luồng để lắng nghe đồng thời nhiều socket và liên kết các trình xử lý sự kiện khác nhau cho các socket dựa trên nhiệm vụ hiện tại của socket.
- Khi socket đang được lắng nghe sẵn sàng thực hiện các thao tác kết nối phản hồi, đọc, ghi, hoặc đóng, các sự kiện tệp tương ứng với các thao tác này sẽ được tạo ra. Lúc này, bộ xử lý sự kiện tệp sẽ gọi các trình xử lý sự kiện đã liên kết trước đó với socket để xử lý các sự kiện này.

Mặc dù bộ xử lý sự kiện tệp chạy theo cách đơn luồng, nhưng thông qua việc sử dụng chương trình I/O đa luồng để lắng nghe nhiều socket, bộ xử lý sự kiện tệp đã đạt được mô hình giao tiếp mạng hiệu suất cao.

Bộ xử lý sự kiện tệp bao gồm bốn thành phần: socket, chương trình I/O đa luồng, bộ phân phối sự kiện tệp, và trình xử lý sự kiện.

## Sự kiện thời gian

Sự kiện thời gian được chia thành:

- **Sự kiện định thời**: cho phép một đoạn chương trình được thực thi một lần vào thời điểm được chỉ định.
- **Sự kiện chu kỳ**: cho phép một đoạn chương trình được thực thi định kỳ sau khoảng thời gian được chỉ định.

Redis lưu trữ tất cả các sự kiện thời gian trong một danh sách liên kết không có thứ tự. Mỗi khi bộ xử lý sự kiện thời gian chạy, nó sẽ duyệt qua toàn bộ danh sách để tìm các sự kiện thời gian đã đến hạn và gọi các trình xử lý sự kiện tương ứng.

## Lập lịch và thực thi sự kiện

Máy chủ Redis cần liên tục lắng nghe các sự kiện tệp trên các socket để xử lý các sự kiện tệp đó. Tuy nhiên, không thể chỉ lắng nghe mãi mà không quan tâm đến các sự kiện thời gian, nếu không các sự kiện thời gian sẽ không được thực thi đúng lúc. Do đó, thời gian lắng nghe cần được xác định dựa trên sự kiện thời gian gần nhất so với thời điểm hiện tại.

Việc lập lịch và thực thi sự kiện được quản lý bởi hàm `aeProcessEvents`, với mã giả như sau:

```python
def aeProcessEvents():

    ## Lấy sự kiện thời gian gần nhất so với thời gian hiện tại
    time_event = aeSearchNearestTimer()

    ## Tính toán khoảng thời gian còn lại cho đến khi sự kiện gần nhất xảy ra
    remaind_ms = time_event.when - unix_ts_now()

    ## Nếu sự kiện đã đến hạn, giá trị của remaind_ms có thể âm, đặt nó bằng 0
    if remaind_ms < 0:
        remaind_ms = 0

    ## Tạo timeval dựa trên giá trị remaind_ms
    timeval = create_timeval_with_ms(remaind_ms)

    ## Chặn và chờ đợi sự kiện tệp phát sinh, thời gian chặn tối đa được quyết định bởi timeval
    aeApiPoll(timeval)

    ## Xử lý tất cả các sự kiện tệp đã phát sinh
    procesFileEvents()

    ## Xử lý tất cả các sự kiện thời gian đã đến hạn
    processTimeEvents()
```

Đặt hàm `aeProcessEvents` trong một vòng lặp, cùng với các hàm khởi tạo và dọn dẹp, sẽ tạo thành hàm chính của máy chủ Redis, mã giả như sau:

```python
def main():

    ## Khởi tạo máy chủ
    init_server()

    ## Liên tục xử lý sự kiện cho đến khi máy chủ tắt
    while server_is_not_shutdown():
        aeProcessEvents()

    ## Máy chủ tắt, thực hiện các thao tác dọn dẹp
    clean_server()
```

## Lập lịch và thực thi sự kiện

### Cách thức hoạt động

Máy chủ cần liên tục lắng nghe các sự kiện tệp để xử lý chúng. Tuy nhiên, để đảm bảo các sự kiện thời gian cũng được thực thi đúng lúc, thời gian lắng nghe các sự kiện tệp được xác định dựa trên thời điểm xảy ra sự kiện thời gian gần nhất.

### Quá trình xử lý sự kiện

1. Lấy sự kiện thời gian gần nhất so với thời gian hiện tại.
2. Tính toán khoảng thời gian còn lại cho đến khi sự kiện xảy ra.
3. Nếu sự kiện đã đến hạn, đặt thời gian còn lại bằng 0.
4. Tạo giá trị timeval dựa trên thời gian còn lại.
5. Chặn và chờ đợi sự kiện tệp, thời gian chặn tối đa được quyết định bởi timeval.
6. Xử lý tất cả các sự kiện tệp đã phát sinh.
7. Xử lý tất cả các sự kiện thời gian đã đến hạn.

### Vòng lặp chính của máy chủ

Máy chủ Redis liên tục chạy vòng lặp để xử lý các sự kiện cho đến khi máy chủ tắt. Quy trình bao gồm khởi tạo máy chủ, xử lý sự kiện liên tục và thực hiện các thao tác dọn dẹp khi máy chủ tắt.
