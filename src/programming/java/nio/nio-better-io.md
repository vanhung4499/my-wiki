---
title: NIO better than IO
tags:
  - java
categories:
  - java
order: 1
---
# NIO mạnh hơn IO ở điểm nào?


[IO truyền thống](classification.md) dựa trên byte stream hoặc character stream (như FileInputStream, BufferedReader, v.v.) để thực hiện đọc và ghi file, và sử dụng Socket và ServerSocket để truyền tải mạng.

NIO sử dụng [kênh (Channel) và bộ đệm (Buffer)](/programming/java/nio/buffer-channel) để thực hiện các thao tác file, và sử dụng SocketChannel và ServerSocketChannel để truyền tải mạng.

IO truyền thống áp dụng mô hình chặn, mỗi kết nối cần phải tạo một luồng riêng để xử lý các thao tác đọc ghi. Khi một luồng đang chờ thao tác I/O, nó không thể thực hiện các nhiệm vụ khác. Điều này dẫn đến việc tạo và hủy bỏ nhiều luồng, cùng với việc chuyển đổi ngữ cảnh, làm giảm hiệu suất của hệ thống.

NIO sử dụng mô hình không chặn, cho phép luồng thực hiện các nhiệm vụ khác trong khi chờ I/O. Mô hình này sử dụng bộ chọn (Selector) để giám sát các sự kiện I/O trên nhiều kênh (Channel), đạt được hiệu suất và khả năng mở rộng cao hơn.

### 01. Sự khác biệt giữa NIO và IO truyền thống khi thao tác tệp

Trong JDK 1.4, gói `java.nio.*` giới thiệu thư viện Java I/O mới nhằm **tăng tốc độ**. Thực tế, gói I/O "cũ" đã được **triển khai lại bằng NIO**, cho nên chúng ta có thể **hưởng lợi từ nó mà không cần lập trình NIO một cách rõ ràng**.

- NIO có thể dịch là no-blocking io hoặc new io đều được, cả hai đều có thể hiểu được~

Khi đọc sách "Java Programming Thought", câu "chúng ta có thể hưởng lợi từ nó mà không cần lập trình NIO một cách rõ ràng" đã thu hút sự chú ý của tôi, vì vậy: chúng ta **thử nghiệm** hiệu suất sao chép tệp sử dụng NIO và [IO truyền thống](file.md):

```java
public class SimpleFileTransferTest {

    // Sử dụng phương pháp I/O truyền thống để truyền tệp
    private long transferFile(File source, File des) throws IOException {
        long startTime = System.currentTimeMillis();

        if (!des.exists())
            des.createNewFile();

        // Tạo luồng đầu vào và đầu ra
        BufferedInputStream bis = new BufferedInputStream(new FileInputStream(source));
        BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(des));

        // Sử dụng mảng để truyền dữ liệu
        byte[] bytes = new byte[1024 * 1024];
        int len;
        while ((len = bis.read(bytes)) != -1) {
            bos.write(bytes, 0, len);
        }

        long endTime = System.currentTimeMillis();
        return endTime - startTime;
    }

    // Sử dụng phương pháp NIO để truyền tệp
    private long transferFileWithNIO(File source, File des) throws IOException {
        long startTime = System.currentTimeMillis();

        if (!des.exists())
            des.createNewFile();

        // Tạo đối tượng RandomAccessFile
        RandomAccessFile read = new RandomAccessFile(source, "rw");
        RandomAccessFile write = new RandomAccessFile(des, "rw");

        // Lấy kênh tệp
        FileChannel readChannel = read.getChannel();
        FileChannel writeChannel = write.getChannel();

        // Tạo và sử dụng ByteBuffer để truyền dữ liệu
        ByteBuffer byteBuffer = ByteBuffer.allocate(1024 * 1024);
        while (readChannel.read(byteBuffer) > 0) {
            byteBuffer.flip();
            writeChannel.write(byteBuffer);
            byteBuffer.clear();
        }

        // Đóng kênh tệp
        writeChannel.close();
        readChannel.close();
        long endTime = System.currentTimeMillis();
        return endTime - startTime;
    }

    public static void main(String[] args) throws IOException {
        SimpleFileTransferTest simpleFileTransferTest = new SimpleFileTransferTest();
        File source = new File("[电影天堂www.dygod.cn]猜火车-cd1.rmvb");
        File destination = new File("io.avi");
        File nioFile = new File("nio.avi");

        // So sánh thời gian sao chép tệp sử dụng I/O truyền thống và NIO
        long time = simpleFileTransferTest.transferFile(source, destination);
        System.out.println(time + "：Thời gian byte stream thông thường");

        long timeNio = simpleFileTransferTest.transferFileWithNIO(source, nioFile);
        System.out.println(timeNio + "：Thời gian NIO");
    }
}
```

Trước khi giải thích đoạn mã này, chúng ta đã từng nói về [RandomAccessFile](file.md). FileChannel là một lớp trong thư viện Java NIO (New I/O), cung cấp các thao tác I/O hiệu quả đối với tệp tin, hỗ trợ truy cập ngẫu nhiên vào tệp tin và cho phép đọc ghi dữ liệu ở bất kỳ vị trí nào trong tệp tin.

Khác với RandomAccessFile, FileChannel sử dụng [ByteBuffer (bộ đệm)](/programming/java/nio/buffer-channel) để truyền dữ liệu.

Tuy nhiên, trước khi tôi đưa ra kết luận thực tế, bạn có những nhận định sau đây không?

- Đối với các tệp nhỏ, sự khác biệt về hiệu suất giữa NIO và IO thông thường có thể không rõ rệt lắm, vì tệp nhỏ nên quá trình sao chép diễn ra nhanh chóng.
- Đối với các tệp lớn, hiệu suất sử dụng NIO có thể cao hơn đáng kể so với IO thông thường. Vì NIO sử dụng cơ chế bộ đệm và kênh hiệu quả hơn, nó có thể truyền dữ liệu nhanh hơn trong bộ nhớ.

Tuy nhiên, kết quả thực tế có thể khiến bạn ngạc nhiên:

![](https://cdn.tobebetterjavaer.com/stutymore/why-20230331191748.png)

Khi tệp tin càng lớn, tốc độ của byte stream thông thường (IO truyền thống) lại nhanh hơn (tất nhiên, đây là thử nghiệm cá nhân, có thể không chính xác), vậy NIO còn cần làm gì?

Hơn nữa, chi phí học tập của NIO cũng cao hơn so với IO truyền thống.

Vậy có nghĩa là chúng ta **có thể không cần/ không nên học NIO**?

Câu trả lời là **không**. Thao tác I/O thường xuyên được sử dụng trong **hai tình huống** sau:

- I/O tệp tin
- I/O mạng

Và sự hấp dẫn của NIO chủ yếu là ở **mạng**!

Mục tiêu thiết kế của NIO (New I/O) là giải quyết nhược điểm hiệu suất của I/O truyền thống (BIO, Blocking I/O) khi xử lý nhiều kết nối đồng thời. I/O truyền thống trong giao tiếp mạng chủ yếu sử dụng I/O chặn, chỉ định một luồng cho mỗi kết nối. Khi số lượng kết nối tăng lên, hiệu suất hệ thống sẽ bị ảnh hưởng nghiêm trọng, và tài nguyên luồng trở thành rào cản quan trọng. NIO cung cấp I/O không chặn và nhiều lựa chọn I/O, có thể xử lý nhiều kết nối đồng thời trong một luồng, từ đó cải thiện đáng kể hiệu suất trong truyền thông mạng.

Dưới đây là các lý do mà NIO vượt trội hơn so với I/O truyền thống trong truyền thông mạng:

① NIO hỗ trợ I/O không chặn, điều này có nghĩa là khi thực hiện các thao tác I/O, luồng sẽ không bị chặn lại. Điều này giúp quản lý các kết nối đồng thời một cách hiệu quả trong truyền thông mạng (có thể là hàng ngàn hoặc thậm chí hàng triệu kết nối). Tuy nhiên, trong các hoạt động đọc ghi tệp, ưu điểm này không rõ rệt bằng vì việc đọc ghi tệp thường không đòi hỏi nhiều hoạt động đồng thời.

② NIO hỗ trợ nhiều lựa chọn I/O, điều này có nghĩa là một luồng có thể giám sát đồng thời nhiều kênh (như socket), và xử lý chúng khi có sự kiện I/O (như có thể đọc, có thể ghi) sẵn sàng. Điều này cải thiện đáng kể hiệu suất trong truyền thông mạng, vì một luồng duy nhất có thể quản lý hiệu quả nhiều kết nối đồng thời. Tuy nhiên, trong các hoạt động đọc ghi tệp, ưu điểm này cũng không thể hiện rõ rệt.

③ NIO cung cấp lớp ByteBuffer, có thể quản lý bộ đệm một cách hiệu quả. Điều này quan trọng trong truyền thông mạng, vì dữ liệu thường được truyền đi dưới dạng byte stream. Tuy rằng trong việc đọc ghi tệp, cũng có bộ đệm, nhưng ưu điểm của nó không rõ rệt lắm.


Here's the translation from Chinese to Vietnamese:


Hãy xem sự khác biệt trong mã máy chủ.

IO sử dụng Socket, mã nguồn đơn giản, tôi sẽ không thêm chú thích vì đã học trước đó, có lẽ bạn cũng có thể hiểu, sử dụng vòng lặp while để lắng nghe Socket từ phía máy khách:

```java
public class IOServer {
    public static void main(String[] args) {
        try {
            ServerSocket serverSocket = new ServerSocket(8080);

            while (true) {
                Socket client = serverSocket.accept();
                InputStream in = client.getInputStream();
                OutputStream out = client.getOutputStream();

                byte[] buffer = new byte[1024];
                int bytesRead = in.read(buffer);
                out.write(buffer, 0, bytesRead);

                in.close();
                out.close();
                client.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

NIO, phần này tôi đã thêm chú thích, chủ yếu sử dụng ServerSocketChannel và Selector:

```java
public class NIOServer {
    public static void main(String[] args) {
        try {
            // Tạo ServerSocketChannel
            ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
            // Ràng buộc cổng
            serverSocketChannel.bind(new InetSocketAddress(8081));
            // Thiết lập chế độ không chặn
            serverSocketChannel.configureBlocking(false);

            // Tạo Selector
            Selector selector = Selector.open();
            // Đăng ký ServerSocketChannel với Selector, quan tâm đến sự kiện OP_ACCEPT
            serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);

            // Vòng lặp vô hạn, xử lý sự kiện
            while (true) {
                // Chặn cho đến khi có sự kiện xảy ra
                selector.select();
                // Lấy SelectionKey có sự kiện xảy ra
                Iterator<SelectionKey> iterator = selector.selectedKeys().iterator();
                while (iterator.hasNext()) {
                    SelectionKey key = iterator.next();
                    // Sau khi xử lý xong, loại bỏ khỏi tập selectedKeys
                    iterator.remove();

                    // Kiểm tra loại sự kiện
                    if (key.isAcceptable()) {
                        // Có yêu cầu kết nối mới
                        ServerSocketChannel server = (ServerSocketChannel) key.channel();
                        // Chấp nhận kết nối
                        SocketChannel client = server.accept();
                        // Thiết lập chế độ không chặn
                        client.configureBlocking(false);
                        // Đăng ký SocketChannel mới với Selector, quan tâm đến sự kiện OP_READ
                        client.register(selector, SelectionKey.OP_READ);
                    } else if (key.isReadable()) {
                        // Có dữ liệu có thể đọc
                        SocketChannel client = (SocketChannel) key.channel();
                        // Tạo bộ đệm ByteBuffer
                        ByteBuffer buffer = ByteBuffer.allocate(1024);
                        // Đọc dữ liệu từ SocketChannel và ghi vào ByteBuffer
                        client.read(buffer);
                        // Đảo ngược ByteBuffer để chuẩn bị đọc
                        buffer.flip();
                        // Ghi dữ liệu từ ByteBuffer trở lại SocketChannel
                        client.write(buffer);
                        // Đóng kết nối
                        client.close();
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

Dưới đây là mã nguồn tạo một máy chủ TCP đơn giản dựa trên Java NIO. Nó sử dụng [ServerSocketChannel và Selector (sẽ được giải thích sau)](/programming/java/nio/buffer-channel.html) để thực hiện I/O không chặn và I/O đa kênh. Máy chủ lặp lại lắng nghe sự kiện, khi có yêu cầu kết nối mới, nó sẽ chấp nhận kết nối và đăng ký SocketChannel mới vào Selector, quan tâm đến sự kiện OP_READ. Khi có dữ liệu có thể đọc, nó sẽ đọc dữ liệu từ SocketChannel và ghi vào ByteBuffer, sau đó gửi dữ liệu từ ByteBuffer trở lại SocketChannel.

Đây là giải thích đơn giản về Socket và ServerSocket, cùng với ServerSocketChannel và SocketChannel.

- Socket và ServerSocket là cách lập trình I/O chặn truyền thống, được sử dụng để thiết lập và quản lý kết nối TCP.
  - Socket: Đại diện cho socket của máy khách, chịu trách nhiệm thiết lập kết nối và truyền dữ liệu với máy chủ.
  - ServerSocket: Đại diện cho socket của máy chủ, chịu trách nhiệm lắng nghe yêu cầu kết nối từ máy khách. Khi có yêu cầu kết nối mới, ServerSocket sẽ tạo một Socket mới để giao tiếp với máy khách.

Trong lập trình I/O chặn truyền thống, mỗi kết nối đều cần một luồng riêng để xử lý, điều này dẫn đến vấn đề về hiệu suất trong các tình huống có nhiều kết nối. Điều này sẽ được thấy rõ hơn trong các trường hợp kiểm tra máy khách sắp tới.

Để giải quyết vấn đề hiệu suất trong lập trình I/O chặn truyền thống, Java NIO đã giới thiệu [ServerSocketChannel và SocketChannel](/programming/java/nio/network-connect). Chúng hỗ trợ I/O không chặn, cho phép xử lý nhiều kết nối trong cùng một luồng.

- ServerSocketChannel: Tương tự như ServerSocket, đại diện cho kênh socket máy chủ. Nó lắng nghe yêu cầu kết nối từ máy khách và có thể được thiết lập trong chế độ không chặn, có nghĩa là không chặn luồng khi đang chờ yêu cầu kết nối từ phía máy khách.
- SocketChannel: Tương tự như Socket, đại diện cho kênh socket máy khách. Nó chịu trách nhiệm thiết lập kết nối với máy chủ và truyền dữ liệu. SocketChannel cũng có thể được thiết lập trong chế độ không chặn, không chặn luồng khi đang đọc và ghi dữ liệu.

Tiếp theo là [Selector](/programming/java/nio/buffer-channel), chúng ta sẽ nói chi tiết sau.

Selector là một thành phần chính trong Java NIO, được sử dụng để triển khai [I/O đa kênh](/programming/java/nio/multiplexing). Nó cho phép theo dõi đồng thời nhiều ServerSocketChannel và SocketChannel trong một luồng duy nhất và xác định các sự kiện quan tâm bằng SelectionKey. Khi có sự kiện xảy ra, Selector sẽ thêm SelectionKey tương ứng vào tập các khóa đã chọn. Bằng cách sử dụng Selector, có thể xử lý đồng thời nhiều kết nối trong một luồng duy nhất một cách hiệu quả, đặc biệt là trong các tình huống có nhiều kết nối đồng thời.

Dưới đây là trường hợp kiểm tra máy khách đơn giản:

```java
public class TestClient {
    public static void main(String[] args) throws InterruptedException {
        int clientCount = 10000;
        ExecutorService executorServiceIO = Executors.newFixedThreadPool(10);
        ExecutorService executorServiceNIO = Executors.newFixedThreadPool(10);

        // máy khách sử dụng IO truyền thống
        Runnable ioClient = () -> {
            try {
                Socket socket = new Socket("localhost", 8080);
                OutputStream out = socket.getOutputStream();
                InputStream in = socket.getInputStream();
                out.write("Hello, 沉默王二 IO!".getBytes());
                byte[] buffer = new byte[1024];
                in.read(buffer);
                in.close();
                out.close();
                socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        };

        // máy khách sử dụng NIO
        Runnable nioClient = () -> {
            try {
                SocketChannel socketChannel = SocketChannel.open();
                socketChannel.connect(new InetSocketAddress("localhost", 8081));
                ByteBuffer buffer = ByteBuffer.wrap("Hello, 沉默王二 NIO!".getBytes());
                socketChannel.write(buffer);
                buffer.clear();
                socketChannel.read(buffer);
                socketChannel.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        };

        // Kiểm tra hiệu suất của máy chủ NIO và IO truyền thống
        long startTime, endTime;

        startTime = System.currentTimeMillis();
        for (int i = 0; i < clientCount; i++) {
            executorServiceIO.execute(ioClient);
        }
        executorServiceIO.shutdown();
        executorServiceIO.awaitTermination(1, TimeUnit.MINUTES);
        endTime = System.currentTimeMillis();
        System.out.println("Máy chủ IO truyền thống xử lý " + clientCount + " máy khách trong: " + (endTime - startTime) + "ms");

        startTime = System.currentTimeMillis();
        for (int i = 0; i < clientCount; i++) {
            executorServiceNIO.execute(nioClient);
        }
        executorServiceNIO.shutdown();
        executorServiceNIO.awaitTermination(1, TimeUnit.MINUTES);
        endTime = System.currentTimeMillis();
        System.out.println("Máy chủ NIO xử lý " + clientCount + " máy khách trong: " + (endTime - startTime) + "ms");
    }
}
```

Trong bài kiểm tra hiệu suất đơn giản này, chúng ta sử dụng Thread Pool cố định (10 luồng) để mô phỏng yêu cầu máy khách đồng thời. Chúng ta kiểm tra thời gian máy chủ NIO và máy chủ IO truyền thống mất để xử lý 10000 yêu cầu máy khách. Hãy xem kết quả.

```
Máy chủ IO truyền thống xử lý 10000 máy khách trong: 8432 ms
Máy chủ NIO xử lý 10000 máy khách trong: 3749 ms
```

Có thể thấy, NIO nhanh gấp đôi so với IO truyền thống. Tất nhiên, đây là kết quả trên máy cục bộ của tôi, nếu triển khai máy chủ trong môi trường product, kết quả có thể khác. Tuy nhiên, tôi đã chạy thử nhiều lần trên máy cục bộ và kết quả gần như như vậy.

Điều này cho thấy rằng NIO thực sự có hiệu suất cao hơn trong truyền thông mạng so với IO truyền thống.

### 03. Tổng kết

Nội dung của bài viết tập trung vào sự khác biệt giữa NIO (New IO) và IO truyền thống, bao gồm mô hình IO, hoạt động trên tệp tin và truyền thông mạng.

- IO truyền thống sử dụng mô hình chặn, trong đó luồng không thể thực thi các tác vụ khác trong khi chờ đợi hoạt động IO. NIO sử dụng mô hình không chặn, cho phép luồng thực thi các tác vụ khác trong khi chờ đợi IO. Bằng cách sử dụng Selector để giám sát sự kiện IO trên nhiều kênh (Channel), NIO cải thiện hiệu suất và khả năng mở rộng.
  
- IO truyền thống sử dụng các lớp dựa trên luồng byte hoặc luồng ký tự (như FileInputStream, BufferedReader) để đọc và ghi tệp tin. NIO sử dụng Channel và Buffer để thực hiện các hoạt động tệp tin, tuy nhiên không có nhiều lợi thế về hiệu suất so với IO truyền thống.

- IO truyền thống sử dụng Socket và ServerSocket cho truyền thông mạng, đồng thời gặp phải vấn đề chặn. NIO cung cấp SocketChannel và ServerSocketChannel để hỗ trợ truyền thông mạng không chặn, tăng khả năng xử lý đa nhiệm.

