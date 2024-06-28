---
title: Java Final
tags:
  - java
categories:
  - java
order: 16
---
# Java Final

### 01. Biến final

Chúng ta bắt đầu với các biến được đánh dấu bằng từ khóa `final`!

Biến được đánh dấu `final` không thể thay đổi giá trị sau khi đã khởi tạo. Hãy xem ví dụ sau.:

```java
final int age = 18;
```

Khi cố gắng thay đổi giá trị của `age` từ 18 thành 30, trình biên dịch sẽ phát sinh lỗi.

Tiếp theo, chúng ta xem đoạn mã này.

```java
public class Pig {
   private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

Đây là một lớp Java thông thường có một trường `name`.

Sau đó, chúng ta tạo một lớp thử nghiệm và khai báo một đối tượng `Pig` được đánh dấu là `final`.

```java
final Pig pig = new Pig();
```

Nếu cố gắng gán lại giá trị cho `pig`, trình biên dịch cũng sẽ báo lỗi.

Tuy nhiên, chúng ta vẫn có thể thay đổi thuộc tính `name` của đối tượng `pig`.

```java
final Pig pig = new Pig();
pig.setName("Trư Bát Giới");
System.out.println(pig.getName()); // In ra: Trư Bát Giới
```

Ngoài ra, các biến thành viên được đánh dấu `final` phải có giá trị mặc định, nếu không, trình biên dịch sẽ cảnh báo về việc chưa khởi tạo.

Khi kết hợp `final` và `static`, các biến thành viên được gọi là hằng số và tên của chúng phải viết hoa toàn bộ.

```java
public class Pig {
   private final int age = 1;
   public static final double PRICE = 36.5;
}
```

Đôi khi, chúng ta sử dụng từ khóa `final` để đánh dấu tham số, điều này có nghĩa là tham số không thể được thay đổi trong thân phương thức.

Xem ví dụ dưới đây.

```java
public class ArgFinalTest {
    public void arg(final int age) {
    }

    public void arg1(final String name) {
    }
}
```

Nếu cố gắng thay đổi tham số, trình biên dịch sẽ báo lỗi.

### 02. Phương thức final

Các phương thức được đánh dấu `final` không thể bị ghi đè (override). Nếu chúng ta thiết kế một lớp và cho rằng một số phương thức không nên bị ghi đè, thì nên khai báo chúng là `final`.

Lớp Thread là một ví dụ, nó không phải là `final`, điều này có nghĩa là chúng ta có thể kế thừa (extend) nó, nhưng phương thức `isAlive()` của nó lại là `final`.

```java
public class Thread implements Runnable {
    public final native boolean isAlive();
}
```

Cần lưu ý rằng phương thức này là một phương thức native, dùng để kiểm tra xem luồng (thread) có đang hoạt động hay không. Vì là phương thức native, do đó việc ghi đè phương thức này không dễ dàng.

Hãy xem đoạn mã này.

```java
public class Actor {
    public final void show() {

    }
}
```

Khi chúng ta cố gắng ghi đè phương thức này, trình biên dịch sẽ báo lỗi.

Một lớp được đánh dấu là final, và một lớp không được đánh dấu final, nhưng tất cả các phương thức của nó đều là final, bạn nghĩ có gì khác biệt giữa hai trường hợp này không?

Tớ nghĩ, điểm khác biệt là lớp đầu tiên không thể bị kế thừa, có nghĩa là các phương thức không thể bị ghi đè; còn lớp thứ hai có thể được kế thừa, và chúng ta có thể thêm các phương thức không phải là final.

### 03. Lớp final

Nếu một lớp được đánh dấu bằng từ khóa `final`, thì nó không thể được mở rộng (extend)...

Đợi đã, anh trai, tớ biết rồi, lớp String là một ví dụ về lớp final. Trước khi tớ nói xong, Ba đã nhanh chóng đưa ra câu trả lời.

Chuẩn không cần chỉnh.

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence,
               Constable, ConstantDesc {}
```

Bạn biết tại sao lớp String lại được thiết kế là final không?

Lý do chủ yếu có ba điều.

- Để thực hiện constant pool cho chuỗi.
- Để đảm bảo tính an toàn khi đa luồng.
- Để bảo toàn tính bất biến của HashCode.

Nếu muốn biết rõ hơn về các lý do này, Ba có thể đọc bài viết mà tớ từng viết.

[Why are Java Strings Immutable?](/programming/java/basic/string/immutable)

Mọi thử nghiệm kế thừa từ một lớp final sẽ dẫn đến lỗi biên dịch. Hãy xem đoạn mã này.

```java
public final class Writer {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

Khi cố gắng kế thừa từ nó, trình biên dịch sẽ cảnh báo lỗi, lớp Writer là final, không thể kế thừa.

Tuy nhiên, khi một lớp được đánh dấu là final, điều đó không có nghĩa là các đối tượng của lớp đó là không thay đổi.

Hãy xem đoạn mã này.

```java
Writer writer = new Writer();
writer.setName("Tom");
System.out.println(writer.getName()); // Tom
```

Giá trị mặc định của trường name trong Writer là null, nhưng chúng ta có thể thay đổi nó thành 'Tom' bằng phương thức setter. Điều này có nghĩa là nếu một lớp chỉ đơn giản là final, thì nó không hẳn là bất biến.

Về lớp không thay đổi (immutable class), chúng ta sẽ nói chi tiết sau.

[Immutable Class](/programming/java/basic/oo/immutable)

Việc thiết kế một lớp là final có lợi cho tính an toàn, nhưng không nên làm điều này với ý định. Vì khi đánh dấu một lớp là final, nó ngụ ý rằng lớp đó không thể kế thừa, điều này sẽ gây khó khăn khi muốn sửa đổi các phương thức của lớp có vấn đề.
