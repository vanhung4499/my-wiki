---
title: Immutable Class
tags:
  - java
categories:
  - java
order: 19
---
# Immutable Class

### 01. Khái niệm về lớp bất biến

Một lớp được xem là bất biến (immutable) nếu đối tượng của nó, sau khi được tạo thông qua constructor, bất biến trạng thái của nó. Tất cả các biến thành viên của lớp này được khởi tạo chỉ trong constructor và không cung cấp bất kỳ phương thức setter nào để bên ngoài có thể thay đổi chúng.

Kể từ khi có đa luồng, năng suất làm việc của các lập trình viên đã được mở rộng đáng kể. Tất cả các lập trình viên đều yêu thích đa luồng, vì nó tận dụng hiệu quả khả năng mạnh mẽ của phần cứng. Tuy nhiên, đồng thời, tất cả các lập trình viên cũng sợ hãi đa luồng, vì một chút bất cẩn, đa luồng có thể làm cho trạng thái của đối tượng trở nên hỗn loạn.

Để đảm bảo tính nguyên tử, tính hiển thị và tính có thứ tự của trạng thái, chúng ta lập trình viên cố gắng hết sức mình. Trong đó, từ khóa `synchronized` là một trong những giải pháp đơn giản và cơ bản nhất.

Nếu một lớp là bất biến, thì trạng thái của đối tượng cũng sẽ bất biến. Điều này có nghĩa là mỗi khi thay đổi trạng thái của đối tượng, chúng ta tạo ra một đối tượng mới để các luồng khác nhau có thể sử dụng, và chúng ta, những lập trình viên, không còn lo lắng về vấn đề đa luồng nữa.

### 02. Các lớp bất biến phổ biến

Khi nhắc đến lớp bất biến, hầu hết các lập trình viên đều nghĩ ngay đến lớp String. Vậy tại sao lớp String lại được thiết kế là bất biến?

#### 1) Yêu cầu của Pool Constants

[String Constant Pool](/programming/java/basic/string/constant-pool) là một khu vực đặc biệt trong bộ nhớ heap của Java. Khi tạo một đối tượng String, nếu chuỗi này chưa tồn tại trong pool hằng số, một đối tượng mới sẽ được tạo ra; nếu đã tồn tại, chỉ có thể tham chiếu đến đối tượng đã có mà không tạo mới, giúp giảm thiểu chi phí bộ nhớ của JVM và tăng hiệu suất.

#### 2) Yêu cầu của hashCode

Do chuỗi là bất biến, hashCode của nó được lưu vào bộ nhớ khi được tạo. Vì vậy, chuỗi rất phù hợp để sử dụng làm giá trị băm (ví dụ như làm khóa trong [HashMap](/programming/java/collection/hashmap)), cho phép nhiều lần gọi hashCode trả về cùng một giá trị, từ đó tăng hiệu suất.

#### 3) Bảo mật đa luồng

Giống như đã đề cập trước đó, nếu trạng thái của đối tượng là có thể thay đổi, trong môi trường đa luồng, kết quả có thể không đoán trước được. Nhưng String là bất biến, nó có thể được chia sẻ an toàn giữa nhiều luồng mà không cần đồng bộ hóa bổ sung.

Do đó, bất kỳ khi nào gọi phương thức của lớp String (như `trim()`, `substring()`, `toLowerCase()`), nó luôn trả về một đối tượng mới mà không ảnh hưởng đến giá trị ban đầu.

```java
String cmower = "abc，def";
cmower.substring(0, 4);
System.out.println(cmower); // abc，def
```

Mặc dù `substring()` đã cắt cmower, nhưng giá trị của cmower không bị thay đổi.

Ngoài lớp String, các lớp bao Integer, Long cũng là các lớp bất biến.

### 03. Lập trình một lớp bất biến từ đầu

Hiểu một lớp bất biến có thể đơn giản, nhưng việc tạo ra một lớp bất biến tùy chỉnh có thể khó khăn hơn nhiều. Tuy nhiên, khả năng vượt qua khó khăn là phẩm chất không thể thiếu của một lập trình viên xuất sắc. Chỉ có khi chúng ta đối mặt với những thử thách khó khăn như vậy, chúng ta mới thực sự có thể nắm vững chúng.

Bây giờ, chúng ta hãy cùng nhau tạo ra một lớp bất biến theo những yêu cầu sau:

**1) Đảm bảo lớp là final**, không cho phép các lớp khác kế thừa nó.

**2) Đảm bảo tất cả các biến thành viên (fields) là final**, điều này có nghĩa là chúng chỉ có thể được khởi tạo trong constructor và không thể được thay đổi sau đó.

**3) Không cung cấp bất kỳ phương thức setter nào**.

**4) Nếu muốn thay đổi trạng thái của đối tượng, phải trả về một đối tượng mới**.

Theo các điều kiện trên, chúng tôi sẽ định nghĩa một lớp Writer đơn giản và bất biến.

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

Lớp Writer được khai báo là final, các biến name và age là final và không có setter method.

Được rồi, nghe nói tác giả này chia sẻ rất nhiều blog và được đông đảo độc giả yêu thích nên có một nhà xuất bản nào đó đã nhờ ông viết một cuốn sách (Sách).

```java
public class Book {
    private String name;
    private int price;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    @Override
    public String toString() {
        return "Book{" +
                "name='" + name + '\'' +
                ", price=" + price +
                '}';
    }
}
```

2 trường, cụ thể là tên và giá, cũng như getter và setter, phương thức `toString()`được ghi đè vào lớp Writer.

```java
public final class Writer {
    private final String name;
    private final int age;
    private final Book book;

    public Writer(String name, int age, Book book) {
        this.name = name;
        this.age = age;
        this.book = book;
    }

    public int getAge() {
        return age;
    }

    public String getName() {
        return name;
    }

    public Book getBook() {
        return book;
    }
}
```

Và Book tham số và phương thức Book getter được thêm vào hàm tạo.

Sau khi hoàn thành công việc, họ hãy tạo một lớp thử nghiệm mới để xem trạng thái của lớp Writer có thực sự bất biến hay không.

```java
public class WriterDemo {
    public static void main(String[] args) {
        Book book = new Book();
        book.setName("ABCD");
        book.setPrice(79);

        Writer writer = new Writer("Hung", 18, book);
        System.out.println("Giá bán: " + writer.getBook());
        writer.getBook().setPrice(59);
        System.out.println("Giá khuyến mãi: " + writer.getBook());
    }
}
```

Kết quả của chương trình như sau:

```java
Giá bán: Book{name='ABCD', price=79}
Giá khuyến mãi: Book{name='ABCD', price=59}
```

Rất tiếc, tính năng bất biến của lớp Writer đã bị hỏng và giá thành đã thay đổi.

Nếu một lớp không thay đổi chứa một đối tượng có thể thay đổi, thì cần đảm bảo rằng phương thức trả về một bản sao của đối tượng có thể thay đổi. Điều này có nghĩa là, phương thức `getBook()` trong lớp Writer cần phải chỉnh sửa như sau:

```java
public Book getBook() {
    Book clone = new Book();
    clone.setPrice(this.book.getPrice());
    clone.setName(this.book.getName());
    return clone;
}
```

Như vậy, sau khi khởi tạo trong phương thức khởi tạo, đối tượng Book sẽ không bao giờ bị thay đổi. Khi chạy `WriterDemo` với sửa đổi này, bạn sẽ thấy rằng giá không còn thay đổi nữa:

```java
Giá bán: Book{name='ABCD', price=79}
Giá khuyến mãi: Book{name='ABCD', price=79}
```