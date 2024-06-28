---
title: Redis Publish and Subcribe
tags:
  - redis
  - nosql
categories:
  - redis
icon: devicon:redis
order: 12
---
# Redis Pub/Sub

> Redis Pub/Sub (Phát hành/Đăng ký) là một mô hình truyền thông tin: người gửi (pub) gửi thông báo, người nhận (sub) nhận thông báo. Khách hàng Redis có thể đăng ký bất kỳ số lượng kênh nào.
>
> Redis có hai chế độ phát hành/đăng ký:
>
> - Phát hành/đăng ký dựa trên kênh (Channel-based)
> - Phát hành/đăng ký dựa trên mẫu (Pattern-based)

## Mô hình quan sát viên

Redis Pub/Sub áp dụng mô hình thiết kế kinh điển "mô hình quan sát viên" trong thiết kế phần mềm.

**Mô hình quan sát viên** (Observer) là một mô hình thiết kế hành vi, cho phép bạn định nghĩa một cơ chế đăng ký để thông báo cho nhiều đối tượng khác khi có sự kiện xảy ra với đối tượng được quan sát.

- Mô hình này được sử dụng khi thay đổi trạng thái của một đối tượng cần thay đổi các đối tượng khác, hoặc các đối tượng thực tế chưa biết trước hoặc thay đổi động.
- Mô hình này có thể được sử dụng khi một số đối tượng trong ứng dụng phải quan sát các đối tượng khác, nhưng chỉ trong một thời gian giới hạn hoặc trong những tình huống cụ thể.

![Mô hình quan sát viên](https://d1.awsstatic.com/product-marketing/Messaging/sns_img_topic.e024462ec88e79ed63d690a2eed6e050e33fb36f.png)

## Chế độ đăng ký của Redis

Redis có hai chế độ phát hành/đăng ký:

1. **Phát hành/Đăng ký dựa trên kênh (Channel-based Pub/Sub)**

Trạng thái máy chủ trong Redis lưu giữ mối quan hệ đăng ký của tất cả các kênh trong từ điển `pubsub_channels`: Lệnh `SUBSCRIBE` chịu trách nhiệm liên kết khách hàng với kênh đã đăng ký trong từ điển này, và lệnh `UNSUBSCRIBE` thì chịu trách nhiệm hủy liên kết giữa khách hàng và kênh đã hủy đăng ký.

### Ví dụ: Đăng ký kênh cụ thể

Mở khách hàng thứ nhất và thực hiện các lệnh sau:

```shell
> SUBSCRIBE first second
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "first"
3) (integer) 1
1) "subscribe"
2) "second"
3) (integer) 2
```

Mở khách hàng thứ hai và thực hiện lệnh sau:

```shell
> PUBLISH second Hello
1) "1"
```

Lúc này, khách hàng thứ nhất sẽ nhận được thông báo sau:

```shell
1) "message"
2) "second"
3) "Hello"
```

2. **Phát hành/Đăng ký dựa trên mẫu (Pattern-based Pub/Sub)**

Trạng thái máy chủ trong Redis lưu giữ mối quan hệ đăng ký của tất cả các mẫu trong danh sách `pubsub_patterns`: Lệnh `PSUBSCRIBE` chịu trách nhiệm ghi lại khách hàng và mẫu đã đăng ký trong danh sách này, và lệnh `PUNSUBSCRIBE` thì chịu trách nhiệm loại bỏ ghi chép của khách hàng và mẫu đã hủy đăng ký khỏi danh sách.

### Ví dụ: Đăng ký các kênh phù hợp với mẫu cụ thể

Mở khách hàng thứ nhất và thực hiện các lệnh sau:

```shell
> PSUBSCRIBE news.*
Reading messages... (press Ctrl-C to quit)
1) "psubscribe"
2) "news.*"
3) (integer) 1
```

Mở khách hàng thứ hai và thực hiện lệnh sau:

```shell
> PUBLISH news.A Hello
1) "1"
```

Mở khách hàng thứ ba và thực hiện lệnh sau:

```shell
> PUBLISH news.B World
1) "1"
```

Lúc này, khách hàng thứ nhất sẽ nhận được các thông báo sau:

```shell
1) "pmessage"
2) "news.*"
3) "news.A"
4) "Hello"
1) "pmessage"
2) "news.*"
3) "news.B"
4) "World"
```

## Các lệnh Phát hành/Đăng ký

Redis cung cấp các lệnh sau liên quan đến phát hành/đăng ký:

| Lệnh                                                     | Mô tả                       |
| -------------------------------------------------------- | --------------------------- |
| [`SUBSCRIBE`](https://redis.io/commands/subscribe/)      | Đăng ký kênh cụ thể          |
| [`UNSUBSCRIBE`](https://redis.io/commands/unsubscribe)   | Hủy đăng ký kênh cụ thể      |
| [`PSUBSCRIBE`](https://redis.io/commands/psubscribe)     | Đăng ký các kênh phù hợp với mẫu cụ thể |
| [`PUNSUBSCRIBE`](https://redis.io/commands/punsubscribe) | Hủy đăng ký các kênh phù hợp với mẫu cụ thể |
| [`PUBLISH`](https://redis.io/commands/publish/)          | Gửi thông báo đến kênh cụ thể |
| [`PUBSUB`](https://redis.io/commands/pubsub/)            | Xem trạng thái phát hành/đăng ký |

### Mô tả chi tiết các lệnh

1. **`SUBSCRIBE`**: Đăng ký một hoặc nhiều kênh cụ thể để nhận thông báo.

    ```shell
    SUBSCRIBE channel1 channel2
    ```

2. **`UNSUBSCRIBE`**: Hủy đăng ký một hoặc nhiều kênh cụ thể.

    ```shell
    UNSUBSCRIBE channel1 channel2
    ```

3. **`PSUBSCRIBE`**: Đăng ký các kênh phù hợp với một hoặc nhiều mẫu cụ thể. Mẫu có thể chứa các ký tự đại diện như `*`.

    ```shell
    PSUBSCRIBE news.*
    ```

4. **`PUNSUBSCRIBE`**: Hủy đăng ký các kênh phù hợp với một hoặc nhiều mẫu cụ thể.

    ```shell
    PUNSUBSCRIBE news.*
    ```

5. **`PUBLISH`**: Gửi một thông báo đến một kênh cụ thể. Nếu có bất kỳ khách hàng nào đã đăng ký kênh này, họ sẽ nhận được thông báo.

    ```shell
    PUBLISH channel1 "Hello World"
    ```

6. **`PUBSUB`**: Cung cấp thông tin về hệ thống phát hành/đăng ký. Có thể sử dụng các đối số để xem các kênh đang được đăng ký, các mẫu đang được đăng ký, hoặc các khách hàng đang kết nối.

    ```shell
    PUBSUB CHANNELS  # Xem danh sách các kênh đang được đăng ký
    PUBSUB NUMSUB    # Xem số lượng khách hàng đang đăng ký trên mỗi kênh
    PUBSUB NUMPAT    # Xem số lượng mẫu đang được đăng ký
    ```

### Ví dụ sử dụng các lệnh

Mở một cửa sổ khách hàng thứ nhất và thực hiện các lệnh sau:

```shell
> SUBSCRIBE mychannel
Reading messages... (press Ctrl-C to quit)
```

Mở một cửa sổ khách hàng thứ hai và thực hiện lệnh sau:

```shell
> PUBLISH mychannel "Hello, Redis!"
```

Khách hàng thứ nhất sẽ nhận được thông báo:

```shell
1) "message"
2) "mychannel"
3) "Hello, Redis!"
```
