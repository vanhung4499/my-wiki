---
title: Java 14 Features
tags:
  - java
categories:
  - java
order: 4
---
# Các Tính Năng Mới của Java 14

Java 14 đã giới thiệu các tính năng mới như Record, pattern matching với instanceof, và chính thức hóa biểu thức switch từ Java 12. Hãy cùng chúng ta tìm hiểu qua các tính năng này.

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy8xMTc5Mzg5LTA2N2E2NGZiZWY3OTU0MTAucG5n?x-oss-process=image/format,png)

### 01. `instanceof`

Theo thứ tự các tính năng mới, chúng ta sẽ bắt đầu với `instanceof`. Cách sử dụng `instanceof` cũ như sau:

```java
public class OldInstanceOf {
    public static void main(String[] args) {
        Object str = "Java 14，真香";
        if (str instanceof String) {
            String s = (String) str;
            System.out.println(s.length());
        }
    }
}
```

Bạn cần sử dụng `instanceof` để kiểm tra xem kiểu của `str` có phải là `String` hay không (bước đầu tiên), sau đó trong câu lệnh `if` bạn phải ép kiểu `str` thành `String` (bước thứ hai) và phải khai báo một biến mới để lưu giá trị sau khi ép kiểu (bước thứ ba).

Ba bước này không phải là quá nhiều, nhưng vẫn cảm thấy có thể có cú pháp tốt hơn. Và đúng vậy, Java 14 đã nghĩ đến điều này.

```java
public class NewInstanceOf {
    public static void main(String[] args) {
        Object str = "Java 14，真香";
        if (str instanceof String s) {
            System.out.println(s.length());
        }
    }
}
```

Bạn có thể trực tiếp thêm một biến vào trong điều kiện `if` khi kiểm tra kiểu, không cần phải ép kiểu và khai báo biến mới nữa. Thật là ngắn gọn, phải không? Tuy nhiên, `instanceof` với pattern matching trong Java 14 chỉ là phiên bản xem trước và không được bật mặc định, do đó đoạn mã này sẽ gặp lỗi biên dịch (Java 14 không hỗ trợ `instanceof` với pattern matching).

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy8xMTc5Mzg5LTg1MTQ4YWI3MjI2ZmM4ZTUucG5n?x-oss-process=image/format,png)

Vậy làm thế nào để giải quyết vấn đề này? Bạn cần phải cấu hình lại phiên bản ngôn ngữ trong dự án của mình.

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy8xMTc5Mzg5LTdhMzE3MDYwNjk5NTJmMDgucG5n?x-oss-process=image/format,png)

Sau khi thiết lập xong, lỗi biên dịch sẽ biến mất. Kết quả chương trình như sau:

```
10
```

Rất tốt, thật tuyệt vời. Bạn có muốn biết trình biên dịch Java đã làm gì ở phía sau không? Hãy xem mã bytecode sau khi dịch ngược.

```java
public class NewInstanceOf {
    public NewInstanceOf() {
    }

    public static void main(String[] args) {
        Object str = "Java 14，真香";
        String s;
        if (str instanceof String && (s = (String) str) == (String) str) {
            System.out.println(s.length());
        }
    }
}
```

Trước khi kiểm tra điều kiện trong `if`, trình biên dịch đã khai báo biến `s`, sau đó trong điều kiện `if` nó thực hiện ép kiểu `s = (String) str` và kiểm tra xem `s` và `str` có bằng nhau hay không. Đây thực sự là một tính năng tốt giúp tăng năng suất của lập trình viên, rất hy vọng tính năng này sẽ được chính thức hóa trong phiên bản tiếp theo.

### 02. `Records`

Trong bài viết trước, tôi đã nói về [tính bất biến của lớp](/programming/extra/immutable), nó được định nghĩa như sau:

```java
public final class Writer {
    private final String name;
    private final int age;

    public Writer(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public int getAge() {
        return age;
    }

    public String getName() {
        return name;
    }
}
```

Đối với `Records`, một Record đại diện cho một trạng thái bất biến. Mặc dù nó sẽ cung cấp các phương thức như `equals()`, `hashCode()`, `toString()`, constructor, và các getter của trường, nhưng nó không thay thế lớp đối tượng có thể thay đổi (không có setter), cũng như các tính năng do Lombok cung cấp.

Hãy dùng `Records` để thay thế lớp `Writer` ở trên:

```java
public record Writer(String name, int age) { }
```

Bạn thấy đấy, chỉ cần một dòng mã là đủ. Quan trọng là nó có nhiều tính năng hơn so với mã trước đó. Hãy xem mã bytecode sau khi dịch ngược:

```java
public final class Writer extends java.lang.Record {
    private final java.lang.String name;
    private final int age;

    public Writer(java.lang.String name, int age) { /* compiled code */ }

    public java.lang.String toString() { /* compiled code */ }

    public final int hashCode() { /* compiled code */ }

    public final boolean equals(java.lang.Object o) { /* compiled code */ }

    public java.lang.String name() { /* compiled code */ }

    public int age() { /* compiled code */ }
}
```

Lớp là `final`, các trường là `private final`, constructor có hai tham số, các phương thức `toString()`, `hashCode()`, `equals()` cũng có, phương thức getter cũng có, chỉ khác là không có tiền tố `get`. Nhưng không có phương thức setter, tức là `Records` thực sự dành cho các đối tượng bất biến - đã được xác minh. Vậy sử dụng `Records` như thế nào?

```java
public class WriterDemo {
    public static void main(String[] args) {
        Writer writer = new Writer("Tom", 18);
        System.out.println("toString: " + writer);
        System.out.println("hashCode: " + writer.hashCode());
        System.out.println("name: " + writer.name());
        System.out.println("age: " + writer.age());

        Writer writer1 = new Writer("Tom", 18);
        System.out.println("equals: " + (writer.equals(writer1)));
    }
}
```

Kết quả chương trình như sau:

```
toString: Writer[name=Tom, age=18]
hashCode: 1130697218
name: Tom
age: 18
equals: true
```

Rất tốt, thật tuyệt vời. Sau này việc định nghĩa các lớp bất biến sẽ đơn giản hơn rất nhiều, rất mong rằng tính năng này sẽ được chính thức hóa trong phiên bản tiếp theo.

### 03. Biểu thức `switch`

Về biểu thức `switch`, tôi đã giải thích chi tiết trong một bài viết trước đây, bạn có thể nhấp vào [liên kết này](https://mp.weixin.qq.com/s/1BDDLDSKDGwQAfIFMyySdg) để xem lại. Hai tuần trôi qua, biểu thức `switch` cuối cùng đã được chính thức công nhận, chúc mừng chúc mừng.

Nhớ khi đăng bài viết này lên Juejin, tôi đã bị rất nhiều người chỉ trích vô lý, họ nói: “Cứ tưởng có kỹ thuật gì mới, không ngờ lại dùng Java 13, mà chúng tôi vẫn đang dừng ở Java 8!”. Đây rõ ràng là một thái độ bảo thủ, rất đáng tránh, lập trình viên không nên như vậy. Một lý do đơn giản là, Java 6 cũng từng rất kinh điển, nhưng không phải đã bị Java 8 thay thế sao? Theo thời gian, Java 8 sớm muộn cũng sẽ bị thay thế bởi các phiên bản mới và cải tiến hơn - luôn cần phải tiến bộ.

Về biểu thức `switch`, tôi sẽ đơn giản đưa ra một ví dụ để bạn xem:

```java
public class SwitchDemo {
    enum PlayerTypes {
        TENNIS,
        FOOTBALL,
        BASKETBALL,
        PINGPANG,
        UNKNOWN
    }

    public static void main(String[] args) {
        System.out.println(createPlayer(PlayerTypes.BASKETBALL));
    }

    private static String createPlayer(PlayerTypes playerType) {
        return switch (playerType) {
            case TENNIS -> "Vận động viên quần vợt Federer";
            case FOOTBALL -> "Cầu thủ bóng đá Ronaldo";
            case BASKETBALL -> "Cầu thủ bóng rổ LeBron James";
            case PINGPANG -> "Vận động viên bóng bàn Ma Long";
            case UNKNOWN -> throw new IllegalArgumentException("Không xác định");
        };
    }
}
```

Ngoài việc có thể sử dụng cú pháp mới `->`, nó còn có thể được sử dụng như một kết quả trả về, thật tuyệt vời.

### 04. Text Blocks

Trước khi khối văn bản (Text Blocks) xuất hiện, nếu chúng ta cần nối chuỗi nhiều dòng, chúng ta phải sử dụng rất nhiều dấu ngoặc kép và dấu cộng, trông như một mớ hỗn độn và rất không thẩm mỹ. Nếu tình cờ phải nối các văn bản định dạng HTML (SQL nguyên bản cũng vậy), chúng ta còn phải sắp xếp bằng khoảng trắng và sử dụng ký tự thoát dòng `\n` để xuống dòng, những công việc rườm rà này thực sự là một thảm họa đối với một lập trình viên.

```java
public class OldTextBlock {
    public static void main(String[] args) {
        String html = "<html>\n" +
                "    <body>\n" +
                "        <p>Hello, world</p>\n" +
                "    </body>\n" +
                "</html>\n";
        System.out.println(html);
    }
}
```

Java 14 thì hoàn toàn khác:

```java
public class NewTextBlock {
    public static void main(String[] args) {
        String html = """
              <html>
                  <body>
                      <p>Hello, world</p>
                  </body>
              </html>
              """;
        System.out.println(html);
    }
}
```

Dấu ngoặc kép, dấu cộng, ký tự thoát dòng thừa thãi, tất cả đều biến mất. Chỉ cần ba dấu ngoặc kép ở đầu và cuối là đủ. Tôi chỉ có thể nói, tuyệt vời, nó thực sự tuyệt vời!