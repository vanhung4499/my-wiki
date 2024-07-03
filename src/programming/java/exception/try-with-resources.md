---
title: Try With Resources
tags:
  - java
categories:
  - java
order: 2
---
#  try-with-resources

Trước khi bắt đầu, chúng ta hãy cùng ôn lại một chút về try–catch-finally để làm nền tảng nhé.

```java
public class TrycatchfinallyDecoder {
    public static void main(String[] args) {
        BufferedReader br = null;
        try {
            String path = TrycatchfinallyDecoder.class.getResource("/abc.txt").getFile();
            String decodePath = URLDecoder.decode(path,"utf-8");
            br = new BufferedReader(new FileReader(decodePath));

            String str = null;
            while ((str = br.readLine()) != null) {
                System.out.println(str);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

Trong khối try, chúng ta đọc nội dung từ tệp và in từng dòng ra màn hình điều khiển. Nếu không tìm thấy tệp hoặc xảy ra lỗi đọc/ghi IO, thì lỗi sẽ được bắt trong khối catch và in ra thông tin ngăn xếp lỗi. Cuối cùng, trong khối finally, chúng ta đóng đối tượng BufferedReader, đảm bảo rằng tài nguyên được đóng đúng cách để tránh hậu quả nghiêm trọng về hiệu suất khi tài nguyên không được đóng.

Trước Java 7, try–catch-finally là cách tốt nhất để đảm bảo tài nguyên sẽ được đóng kịp thời, dù chương trình có ném ra exception hay không.

Tuy nhiên, đoạn mã này vẫn có chút cồng kềnh, đặc biệt là phần mã trong khối finally. Hơn nữa, try–catch-finally luôn tiềm ẩn một nguy cơ nghiêm trọng: phương thức `br.readLine()` trong khối try có thể ném ra `IOException`, và phương thức `br.close()` trong khối finally cũng có thể ném ra `IOException`. Nếu không may cả hai nơi đều ném ra IOException, thì việc gỡ lỗi chương trình sẽ trở nên phức tạp hơn, và việc xác định lỗi xảy ra ở đâu sẽ tốn nhiều công sức hơn, điều này là điều mà chúng ta không mong muốn.

Minh họa bằng một ví dụ nhé!

Đầu tiên, chúng ta định nghĩa một lớp như MyfinallyReadLineThrow, nó có hai phương thức, `readLine()` và `close()`, cả hai phương thức đều ném ra exception một cách chủ động.

```java
class MyfinallyReadLineThrow {
    public void close() throws Exception {
        throw new Exception("close");
    }

    public void readLine() throws Exception {
        throw new Exception("readLine");
    }
}
```

Sau đó, trong phương thức `main()` chúng ta sử dụng cách try-catch-finally để gọi các phương thức `readLine()` và `close()` của MyfinallyReadLineThrow.

```java
public class TryfinallyCustomReadLineThrow {
    public static void main(String[] args) throws Exception {
        MyfinallyReadLineThrow myThrow = null;
        try {
            myThrow = new MyfinallyReadLineThrow();
            myThrow.readLine();
        } finally {
            myThrow.close();
        }
    }
}
```

Khi chạy đoạn mã trên, ngăn xếp lỗi sẽ hiển thị như sau:

```
Exception in thread "main" java.lang.Exception: close
	at com.hnv99.dzone.trycatchfinally.MyfinallyOutThrow.close(TryfinallyCustomOutThrow.java:17)
	at com.hnv99.dzone.trycatchfinally.TryfinallyCustomOutThrow.main(TryfinallyCustomOutThrow.java:10)
```

Bạn có thấy vấn đề gì không?

Thông tin exception của phương thức `readLine()` bị thông tin ngăn xếp của phương thức `close()` che mất rồi!

Điều này sẽ khiến chúng ta nhầm tưởng vấn đề cần điều tra là phương thức `close()` thay vì `readLine()` - mặc dù nó cũng là đối tượng cần nghi ngờ.

Nhưng khi có try-with-resources, những vấn đề này được giải quyết triệt để. Điều kiện duy nhất là tài nguyên cần được giải phóng (như BufferedReader) phải triển khai interface AutoCloseable.

```java
try (BufferedReader br = new BufferedReader(new FileReader(decodePath));) {
    String str = null;
    while ((str = br.readLine()) != null) {
        System.out.println(str);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

Khối finally đã biến mất, thay vào đó là việc viết tài nguyên cần giải phóng trong `()` ngay sau try. Nếu có nhiều tài nguyên (như BufferedReader và PrintWriter) cần giải phóng, chúng ta có thể thêm trực tiếp vào trong `()`.

```java
try (BufferedReader br = new BufferedReader(new FileReader(decodePath));
     PrintWriter writer = new PrintWriter(new File(writePath))) {
    String str = null;
    while ((str = br.readLine()) != null) {
        writer.print(str);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

Nếu muốn giải phóng tài nguyên tự định nghĩa, chỉ cần cho nó triển khai interface AutoCloseable và cung cấp phương thức `close()` là được.

```java
public class TrywithresourcesCustom {
    public static void main(String[] args) {
        try (MyResource resource = new MyResource();) {
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class MyResource implements AutoCloseable {
    @Override
    public void close() throws Exception {
        System.out.println("Đóng tài nguyên tự định nghĩa");
    }
}
```

Hãy xem kết quả đầu ra sau khi chạy đoạn mã:

```
Đóng tài nguyên tự định nghĩa
```

Trong `try ()` chỉ new một đối tượng của MyResource, không làm gì khác mà phương thức `close()` đã được gọi rồi!

Bạn biết tại sao không?

Cùng xem bytecode sau khi được dịch ngược:

```java
class MyResource implements AutoCloseable {
    MyResource() {
    }

    public void close() throws Exception {
        System.out.println("Đóng tài nguyên tự định nghĩa");
    }
}

public class TrywithresourcesCustom {
    public TrywithresourcesCustom() {
    }

    public static void main(String[] args) {
        try {
            MyResource resource = new MyResource();
            resource.close();
        } catch (Exception var2) {
            var2.printStackTrace();
        }

    }
}
```

Trình biên dịch tự động thêm mã gọi phương thức `close()` vào trong khối `try-with-resources`.

Tiếp theo, chúng ta sẽ thêm một phương thức `out()` vào trong lớp `MyResourceOut`.

```java
class MyResourceOut implements AutoCloseable {
    @Override
    public void close() throws Exception {
        System.out.println("Đóng tài nguyên tự định nghĩa");
    }

    public void out() throws Exception {
        System.out.println("Trầm Mặc Vương Nhị, một lập trình viên thú vị");
    }
}
```

Lần này, chúng ta sẽ gọi phương thức `out()` trong khối try.

```java
public class TrywithresourcesCustomOut {
    public static void main(String[] args) {
        try (MyResourceOut resource = new MyResourceOut();) {
            resource.out();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

Hãy xem mã bytecode sau khi được dịch ngược lại lần này.

```java
public class TrywithresourcesCustomOut {
    public TrywithresourcesCustomOut() {
    }

    public static void main(String[] args) {
        try {
            MyResourceOut resource = new MyResourceOut();

            try {
                resource.out();
            } catch (Throwable var5) {
                try {
                    resource.close();
                } catch (Throwable var4) {
                    var5.addSuppressed(var4);
                }

                throw var5;
            }

            resource.close();
        } catch (Exception var6) {
            var6.printStackTrace();
        }

    }
}
```

Lần này, khối `catch` tự động gọi `resource.close()`, và có một đoạn mã rất quan trọng `var5.addSuppressed(var4)`.

Vì sao lại cần làm vậy?

Khi một exception được ném ra, có thể có những exception khác bị ức chế bởi exception đó, không thể ném ra bình thường. Khi đó, chúng ta có thể sử dụng phương thức `addSuppressed()` để ghi lại những exception bị ức chế này, sau đó những exception bị ức chế sẽ xuất hiện trong thông tin ngăn xếp của exception được ném ra. Chúng ta có thể sử dụng phương thức `getSuppressed()` để lấy những exception này. Điều này giúp chúng ta không bỏ lỡ bất kỳ exception nào, thuận tiện cho việc gỡ lỗi.

Bạn nhớ ví dụ trước đó không - trong try-catch-finally, thông tin exception của phương thức `readLine()` bị thông tin ngăn xếp của phương thức `close()` che mất. Giờ đây, với try-with-resources, hãy xem liệu phương thức `out()` tương tự có bị `close()` che mất không nhé.

```java
class MyResourceOutThrow implements AutoCloseable {
    @Override
    public void close() throws Exception {
        throw new Exception("close()");
    }

    public void out() throws Exception {
        throw new Exception("out()");
    }
}
```

Gọi hai phương thức này.

```java
public class TrywithresourcesCustomOutThrow {
    public static void main(String[] args) {
        try (MyResourceOutThrow resource = new MyResourceOutThrow();) {
            resource.out();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

Kết quả đầu ra của chương trình như sau.

```
java.lang.Exception: out()
	at com.hnv99.dzone.trycatchfinally.MyResourceOutThrow.out(TrywithresourcesCustomOutThrow.java:20)
	at com.hnv99.dzone.trycatchfinally.TrywithresourcesCustomOutThrow.main(TrywithresourcesCustomOutThrow.java:6)
	Suppressed: java.lang.Exception: close()
		at com.hnv99.dzone.trycatchfinally.MyResourceOutThrow.close(TrywithresourcesCustomOutThrow.java:16)
		at com.hnv99.dzone.trycatchfinally.TrywithresourcesCustomOutThrow.main(TrywithresourcesCustomOutThrow.java:5)
```

Xem này, lần này không còn nữa, thông tin ngăn xếp của `out()` đã được in ra, và thông tin ngăn xếp của phương thức `close()` đã có thêm từ khóa `Suppressed`, rõ ràng dễ thấy.

Bạn có phải cảm thấy try-with-resources hữu dụng hơn không! 

Tổng kết lại nhé, khi xử lý các tài nguyên cần phải đóng, luôn ưu tiên sử dụng try-with-resources thay vì try-catch-finally. Cách đầu tiên giúp mã nguồn trở nên ngắn gọn, rõ ràng hơn, và thông tin exception cũng chính xác hơn.