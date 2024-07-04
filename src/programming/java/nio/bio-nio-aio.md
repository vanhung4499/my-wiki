---
title: BIO vs NIO vs AIO
tags:
  - java
categories:
  - java
order: 2
---
# Sự khác biệt giữa BIO, NIO và AIO

> Trong phần trước, chúng ta đã tìm hiểu [sự khác biệt giữa NIO và IO truyền thống](nio-better-io). Bài viết này sẽ giải thích sự khác biệt giữa BIO, NIO và AIO, những khái niệm này thường dễ bị nhầm lẫn đối với người mới học, vì vậy chúng ta sẽ cố gắng giải thích một cách đơn giản, phù hợp để nói với người nghe 👂.

Vào một buổi chiều cuối tuần, khi tôi đang thực hiện cuộc phỏng vấn qua điện thoại tại nhà, tôi đã hỏi một số câu hỏi về IO với ứng viên, bao gồm các câu hỏi về BIO, NIO và AIO là gì? Sự khác biệt giữa ba loại này là gì? Làm thế nào để sử dụng chúng một cách cụ thể? Tuy nhiên, câu trả lời của ứng viên không hài lòng. Vì vậy, tôi đã viết trong đánh giá phỏng vấn rằng: "Sự hiểu biết về IO trong Java của bạn còn chưa đủ sâu". Vào lúc này, người yêu của tôi đã vô tình nhìn thấy điều này.
### Java IO và sự khác biệt giữa BIO, NIO

IO, thường viết tắt là I/O, là viết tắt của Input/Output, có nghĩa là đầu vào/vào ra. Thông thường nó ám chỉ quá trình đưa dữ liệu giữa bộ nhớ nội (bộ nhớ) và bộ nhớ ngoài (ổ đĩa cứng, ổ USB và các thiết bị phụ khác).

Đầu vào là tín hiệu hoặc dữ liệu mà hệ thống nhận được, đầu ra là tín hiệu hoặc dữ liệu mà nó gửi đi.

Trong Java, có một loạt các API được cung cấp cho nhà phát triển để đọc và ghi dữ liệu bên ngoài hoặc tệp tin. Chúng ta gọi những API này là Java IO.

IO là một trong những khái niệm quan trọng và khó của Java, chủ yếu là do với sự phát triển của Java, hiện tại có ba loại IO cùng tồn tại. Chúng ta gọi chúng là BIO, NIO và AIO.

BIO đầy đủ là Block-IO, là một mô hình giao tiếp đồng bộ và chặn. Đây là một cách tiếp cận giao tiếp truyền thống, mô hình đơn giản, dễ sử dụng. Tuy nhiên, nó có khả năng xử lý song song thấp, mất thời gian giao tiếp và phụ thuộc vào tốc độ mạng.

[Java NIO](nio-better-io), toàn tên là Non-Block IO, là một tính năng tối ưu hóa hiệu suất dành cho truyền thông mạng trong Java SE từ phiên bản 1.4 trở lên. Đây là một mô hình giao tiếp đồng bộ không chặn.

NIO và IO truyền thống có cùng mục đích và mục đích, sự khác biệt quan trọng nhất giữa chúng là cách dữ liệu được đóng gói và chuyển tải. IO truyền thống xử lý dữ liệu theo luồng, trong khi NIO xử lý dữ liệu theo khối.

Hệ thống IO hướng luồng xử lý dữ liệu một lần một byte. Một dòng đầu vào tạo ra một byte dữ liệu, một dòng đầu ra tiêu thụ một byte dữ liệu.

Hệ thống IO hướng khối xử lý dữ liệu dưới dạng khối. Mỗi hoạt động tạo ra hoặc tiêu thụ một khối dữ liệu trong một bước. Xử lý dữ liệu theo khối nhanh hơn nhiều so với xử lý dữ liệu theo byte. Tuy nhiên, hệ thống IO hướng khối thiếu một số tính năng tinh tế và đơn giản của hệ thống IO hướng luồng.

Java AIO, toàn tên là Asynchronous IO, là một mô hình giao tiếp không đồng bộ không chặn.

Ngoài ra, trên nền tảng NIO, AIO đã giới thiệu khái niệm các kênh bất đồng bộ mới, và cung cấp cài đặt kênh tập tin bất đồng bộ và kênh ổ đĩa bất đồng bộ.

### Ba loại IO khác nhau

Đầu tiên, chúng ta sẽ đặt lại điểm nổi bật từ một góc độ tổng quan:

**BIO (Blocking I/O):** Chế độ I/O đồng bộ chặn.

**NIO (New I/O):** Chế độ đồng bộ không chặn.

**AIO (Asynchronous I/O):** Mô hình I/O không đồng bộ không chặn.

- **Chế độ đồng bộ chặn:** Trong chế độ này, chúng ta bắt đầu nấu nước và ngồi trước ấm để chờ nước sôi.

- **Chế độ đồng bộ không chặn:** Trái lại, chúng ta cũng bắt đầu nấu nước, nhưng sau đó rời khỏi bếp và quay lại xem ti vi mỗi vài phút để kiểm tra nước có sôi chưa.

- **Mô hình I/O không đồng bộ không chặn:** Trong chế độ này, chúng ta cũng bắt đầu nấu nước, nhưng không ngồi trước ấm chờ đợi, cũng không phải quay lại xem. Thay vào đó, khi nước sôi, nó sẽ tự động thông báo cho chúng ta trong khi chúng ta đang xem ti vi.

**Chặn vs Không chặn:** Người có ngồi trước ấm chờ đợi hay không.

**Đồng bộ vs Bất đồng bộ:** Ấm có thông báo cho người khi nước sôi hay không.

#### Các trường hợp sử dụng

- Phương pháp BIO thích hợp cho kiến trúc có số lượng kết nối nhỏ và cố định, yêu cầu tài nguyên máy chủ cao và giới hạn đồng thời trong ứng dụng, là lựa chọn duy nhất trước JDK1.4, nhưng chương trình đơn giản và dễ hiểu.

- Phương pháp NIO thích hợp cho kiến trúc có số lượng kết nối nhiều và kết nối ngắn (hoạt động nhẹ), chẳng hạn như máy chủ trò chuyện, giới hạn đồng thời trong ứng dụng, lập trình phức tạp hơn, hỗ trợ từ JDK1.4 trở đi.

- Phương pháp AIO thích hợp cho kiến trúc có số lượng kết nối nhiều và kết nối dài (hoạt động nặng), chẳng hạn như máy chủ album ảnh, sử dụng đầy đủ các hoạt động bất đồng bộ từ hệ điều hành, lập trình phức tạp hơn, hỗ trợ từ JDK7 trở đi.
#### Cách sử dụng 

Sử dụng BIO để thực hiện việc đọc và ghi tập tin.

```java
public class BioFileDemo {
    public static void main(String[] args) {
        BioFileDemo demo = new BioFileDemo();
        demo.writeFile();
        demo.readFile();
    }

    // Sử dụng BIO để ghi vào tập tin
    public void writeFile() {
        String filename = "logs/abc.txt";
        try {
            FileWriter fileWriter = new FileWriter(filename);
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

            bufferedWriter.write("abcdefgh");
            bufferedWriter.newLine();

            System.out.println("Đã ghi vào tập tin");
            bufferedWriter.close();
            fileWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Sử dụng BIO để đọc tập tin
    public void readFile() {
        String filename = "logs/abc.txt";
        try {
            FileReader fileReader = new FileReader(filename);
            BufferedReader bufferedReader = new BufferedReader(fileReader);

            String line;
            while ((line = bufferedReader.readLine()) != null) {
                System.out.println("Nội dung đã đọc: " + line);
            }

            bufferedReader.close();
            fileReader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

Đoạn mã này mô tả cách sử dụng Input/Output (I/O) chặn truyền thống (BIO) trong Java để thực hiện các thao tác đọc và ghi tập tin. Trong phương thức `writeFile()`, chúng ta sử dụng FileWriter để tạo đối tượng và sử dụng BufferedWriter để ghi dữ liệu vào tập tin. Sau đó, sử dụng `bufferedWriter.write()` để viết chuỗi vào tập tin và `bufferedWriter.newLine()` để thêm dấu xuống dòng. Cuối cùng, đóng BufferedWriter và FileWriter. Trong phương thức `readFile()`, chúng ta sử dụng FileReader để đọc tập tin và BufferedReader để đọc dữ liệu từ tập tin. Vòng lặp `while` được sử dụng để đọc từng dòng của tập tin cho đến khi đọc hết. Cuối cùng, đóng BufferedReader và FileReader để giải phóng tài nguyên.

Đây là mã ví dụ về cách sử dụng NIO:

```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.EnumSet;

public class NioFileDemo {
    public static void main(String[] args) {
        NioFileDemo demo = new NioFileDemo();
        demo.writeFile();
        demo.readFile();
    }

    // Sử dụng NIO để ghi vào tập tin
    public void writeFile() {
        Path path = Paths.get("logs/abc.txt");
        try {
            FileChannel fileChannel = FileChannel.open(path, EnumSet.of(StandardOpenOption.CREATE, StandardOpenOption.WRITE));

            ByteBuffer buffer = StandardCharsets.UTF_8.encode("abcdefgh");
            fileChannel.write(buffer);

            System.out.println("Đã ghi vào tập tin");
            fileChannel.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Sử dụng NIO để đọc tập tin
    public void readFile() {
        Path path = Paths.get("logs/abc.txt");
        try {
            FileChannel fileChannel = FileChannel.open(path, StandardOpenOption.READ);
            ByteBuffer buffer = ByteBuffer.allocate(1024);

            int bytesRead = fileChannel.read(buffer);
            while (bytesRead != -1) {
                buffer.flip();
                System.out.println("Nội dung đã đọc: " + StandardCharsets.UTF_8.decode(buffer));
                buffer.clear();
                bytesRead = fileChannel.read(buffer);
            }

            fileChannel.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

Trong ví dụ này, chúng ta sử dụng `FileChannel` của NIO để thực hiện các thao tác đọc và ghi file. Trong phương thức `writeFile()`, chúng ta mở `FileChannel` để tạo và ghi vào tập tin, sau đó sử dụng `ByteBuffer` để mã hóa chuỗi thành UTF-8 và ghi vào tập tin. Trong phương thức `readFile()`, chúng ta mở `FileChannel` để đọc từ tập tin và sử dụng `ByteBuffer` để lưu trữ dữ liệu đọc được. Vòng lặp sẽ đọc và giải mã từng phần dữ liệu từ `ByteBuffer` và in ra màn hình cho đến khi đọc hết file. Cuối cùng, ta đóng `FileChannel` để giải phóng tài nguyên.

Đây là mã Java sử dụng AsynchronousFileChannel để thực hiện việc đọc và ghi file một cách bất đồng bộ. Dưới đây là bản dịch tiếng Việt của mã này:

```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousFileChannel;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.concurrent.CompletionHandler;
import java.util.concurrent.Future;

public class AioDemo {

    public static void main(String[] args) {
        AioDemo demo = new AioDemo();
        demo.writeFile();
        demo.readFile();
    }

    // Ghi file bằng AsynchronousFileChannel
    public void writeFile() {
        Path path = Paths.get("logs/abc.txt");
        try {
            AsynchronousFileChannel fileChannel = AsynchronousFileChannel.open(path, StandardOpenOption.WRITE, StandardOpenOption.CREATE);

            ByteBuffer buffer = StandardCharsets.UTF_8.encode("abcdefgh");
            Future<Integer> result = fileChannel.write(buffer, 0);
            result.get();

            System.out.println("Đã ghi file thành công");
            fileChannel.close();
        } catch (IOException | InterruptedException | java.util.concurrent.ExecutionException e) {
            e.printStackTrace();
        }
    }

    // Đọc file bằng AsynchronousFileChannel
    public void readFile() {
        Path path = Paths.get("logs/abc.txt");
        try {
            AsynchronousFileChannel fileChannel = AsynchronousFileChannel.open(path, StandardOpenOption.READ);
            ByteBuffer buffer = ByteBuffer.allocate(1024);

            fileChannel.read(buffer, 0, buffer, new CompletionHandler<Integer, ByteBuffer>() {
                @Override
                public void completed(Integer result, ByteBuffer attachment) {
                    attachment.flip();
                    System.out.println("Nội dung đọc được: " + StandardCharsets.UTF_8.decode(attachment));
                    attachment.clear();
                    try {
                        fileChannel.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void failed(Throwable exc, ByteBuffer attachment) {
                    System.out.println("Đọc file thất bại");
                    exc.printStackTrace();
                }
            });

            Thread.sleep(1000);

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

Đây là một ví dụ về lớp AioDemo, bao gồm hai phương thức: `writeFile()` và `readFile()`. Cả hai phương thức này sử dụng AsynchronousFileChannel để thực hiện việc ghi và đọc file bất đồng bộ. Các comment đã được cập nhật để giải thích ý nghĩa cụ thể của mã.

### Tóm tắt

BIO (Blocking I/O): Sử dụng mô hình I/O chặn, luồng bị chặn khi thực hiện hoạt động I/O, không thể xử lý các nhiệm vụ khác, phù hợp với các kịch bản có số lượng kết nối ít và ổn định.

NIO (New I/O hoặc Non-blocking I/O): Sử dụng mô hình I/O không chặn, luồng có thể thực thi các nhiệm vụ khác trong khi chờ đợi I/O, sử dụng Selector để giám sát sự kiện trên nhiều Channel, nâng cao hiệu suất và khả năng mở rộng, phù hợp với các kịch bản có tải cao.

AIO (Asynchronous I/O): Sử dụng mô hình I/O bất đồng bộ, luồng trả về ngay sau khi gửi yêu cầu I/O, thông báo cho luồng thông qua hàm gọi lại khi hoàn thành hoạt động I/O, nâng cao khả năng xử lý song song, phù hợp với các kịch bản có lưu lượng cao.