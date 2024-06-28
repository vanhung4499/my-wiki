---
title: Redis Pipeline
tags:
  - redis
  - nosql
categories:
  - redis
icon: devicon:redis
order: 14
---
# Redis Pipeline

## Giới thiệu về Pipeline trong Redis

Redis là một dịch vụ TCP dựa trên mô hình Client/Server và giao thức yêu cầu/đáp ứng. Thông thường, quá trình yêu cầu và đáp ứng của mỗi lệnh Redis diễn ra như sau:

- Khách hàng gửi yêu cầu truy vấn đến máy chủ và lắng nghe Socket để nhận phản hồi từ máy chủ (thường là ở chế độ chặn, chờ máy chủ phản hồi).
- Máy chủ xử lý lệnh và gửi kết quả trả về cho khách hàng.

Rõ ràng, nếu mỗi lệnh Redis phải gửi yêu cầu và nhận phản hồi một lần thì sẽ rất không hiệu quả. Do đó, Redis cung cấp một kỹ thuật xử lý hàng loạt, gọi là **Pipeline (Đường ống)**. Nguyên lý hoạt động của Pipeline là:

**Gửi đồng thời nhiều lệnh Redis đến máy chủ, máy chủ xử lý và trả về tất cả kết quả một lần cho khách hàng.** Nhờ vào việc giảm số lần giao tiếp mạng, Pipeline giúp cải thiện đáng kể hiệu suất xử lý.

![Redis Pipeline](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/7268887661/p514690.jpg)


## Giới hạn của Pipeline trong Redis

Khi sử dụng công nghệ Pipeline trong Redis, cần lưu ý những giới hạn sau để tránh gặp phải các vấn đề không mong muốn:

- **Pipeline không đảm bảo tính nguyên tử** - Pipeline chỉ là cách thức cho phép khách hàng gửi nhiều lệnh cùng lúc đến máy chủ, nhưng máy chủ nhận được các lệnh từ Pipeline sẽ phân tích thành từng lệnh riêng lẻ và thực thi chúng theo thứ tự tuần tự. Trong quá trình thực thi, máy chủ có thể thực hiện các lệnh của các khách hàng khác, do đó không thể đảm bảo tính nguyên tử. Để đảm bảo tính nguyên tử, bạn nên sử dụng giao dịch (transaction) hoặc kịch bản Lua.

- **Pipeline không hỗ trợ việc lăn ngược (rollback)** - Pipeline không có tính năng giao dịch, vì vậy nếu các lệnh trong Pipeline có sự phụ thuộc vào nhau, bạn không nên sử dụng Pipeline.

- **Không nên gửi quá nhiều lệnh trong một lần bằng Pipeline** - Khi sử dụng Pipeline để gửi lệnh, Redis Server sẽ đặt một phần yêu cầu vào hàng đợi bộ nhớ đệm và gửi kết quả một lần sau khi thực thi xong. Nếu gửi quá nhiều lệnh, sẽ tốn nhiều bộ nhớ, do đó nên chia thành các lô lệnh hợp lý để xử lý.

- **Pipeline không hỗ trợ truy cập qua nhiều slot** - Do Pipeline không hỗ trợ truy cập qua nhiều slot, nên khi sử dụng Redis Cluster và Pipeline, bạn cần đảm bảo rằng các khóa truy cập đều thuộc cùng một slot.

## Ví dụ pipeline

Các Redis Client chính thống thường hỗ trợ công nghệ pipeline.

Đây là một ví dụ về việc sử dụng pipeline trong Jedis để tương tác với Redis:

```java
public class Demo {

    public static void main(String[] args) {

        String host = "localhost";
        int port = 6379;
        Jedis jedis = new Jedis(host, port);

        String key = "pipeline:test";
        jedis.del(key);

        // -------- Phương thức 1
        method1(jedis, key);

        //-------- Phương thức 2
        method2(jedis, key);
    }

    private static void method2(Jedis jedis, String key) {
        System.out.println("-----Phương thức 2-----");
        jedis.del(key);// Khởi tạo
        Pipeline pipeline = jedis.pipelined();
        // Cần khai báo Response trước
        Response<Long> r1 = pipeline.incr(key);
        System.out.println("Gửi yêu cầu qua Pipeline");
        Response<Long> r2 = pipeline.incr(key);
        System.out.println("Gửi yêu cầu qua Pipeline");
        Response<Long> r3 = pipeline.incr(key);
        System.out.println("Gửi yêu cầu qua Pipeline");
        Response<Long> r4 = pipeline.incr(key);
        System.out.println("Gửi yêu cầu qua Pipeline");
        Response<Long> r5 = pipeline.incr(key);
        System.out.println("Gửi yêu cầu qua Pipeline");
        try {
            // Lúc này chưa bắt đầu nhận phản hồi, vì vậy hoạt động này sẽ bị lỗi
            r1.get();
        } catch (Exception e) {
            System.out.println(" <<< Lỗi Pipeline: Chưa bắt đầu nhận phản hồi  >>> ");
        }
        // Gửi yêu cầu hoàn tất, bắt đầu nhận phản hồi
        System.out.println("Gửi yêu cầu hoàn tất, bắt đầu nhận phản hồi");
        pipeline.sync();
        System.out.println("Phản hồi từ Pipeline: " + r1.get());
        System.out.println("Phản hồi từ Pipeline: " + r2.get());
        System.out.println("Phản hồi từ Pipeline: " + r3.get());
        System.out.println("Phản hồi từ Pipeline: " + r4.get());
        System.out.println("Phản hồi từ Pipeline: " + r5.get());
        jedis.close();
    }

    private static void method1(Jedis jedis, String key) {
        Pipeline pipeline = jedis.pipelined();
        System.out.println("-----Phương thức 1-----");
        for (int i = 0; i < 5; i++) {
            pipeline.incr(key);
            System.out.println("Gửi yêu cầu qua Pipeline");
        }
        // Gửi yêu cầu hoàn tất, bắt đầu nhận phản hồi
        System.out.println("Gửi yêu cầu hoàn tất, bắt đầu nhận phản hồi");
        List<Object> responses = pipeline.syncAndReturnAll();
        if (responses == null || responses.isEmpty()) {
            jedis.close();
            throw new RuntimeException("Lỗi Pipeline: Không nhận được phản hồi");
        }
        for (Object resp : responses) {
            System.out.println("Phản hồi từ Pipeline: " + resp.toString());
        }
        System.out.println();
    }

}
```
