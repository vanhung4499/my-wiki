---
title: Java instanceOf
tags:
  - java
categories:
  - java
order: 18
---
# Java instanceOf

Cách sử dụng của từ khoá instanceof rất đơn giản:

```java
(object) instanceof (type)
```

Ý nghĩa của nó cũng rất đơn giản, nó được dùng để kiểm tra xem một đối tượng có thuộc về một loại cụ thể không, kết quả trả về là true hoặc false. Trong quá trình giải nén ngược, từ khoá instanceof thường được sử dụng để xác định đối tượng có thuộc về một loại nhất định hay không, nhằm tránh ngoại lệ ClassCastException.

Trước hết, chúng ta tạo một lớp đơn giản Round:

```java
class Round {
}
```

Tiếp theo, chúng ta tạo một lớp mở rộng Ring kế thừa từ Round:

```java
class Ring extends Round {
}
```

Bây giờ, chúng ta có thể sử dụng instanceof để kiểm tra xem đối tượng Ring có thuộc về loại Round không:

```java
Ring ring = new Ring();
System.out.println(ring instanceof Round);
```

Đoạn mã này sẽ in ra true, vì lớp Ring kế thừa từ Round và thỏa mãn quan hệ "là một" (is-a). Từ khoá instanceof dựa trên mối quan hệ kế thừa giữa các lớp và mối quan hệ triển khai giữa lớp và giao diện để thực hiện việc kiểm tra.

Tiếp theo, chúng ta tạo một giao diện Shape:

```java
interface Shape {
}
```

Sau đó, chúng ta tạo lớp Circle, lớp này triển khai giao diện Shape và kế thừa từ Round:

```java
class Circle extends Round implements Shape {
}
```

Nếu một đối tượng được tạo từ lớp Circle, thì kết quả của instanceof chắc chắn là true:

```java
Circle circle = new Circle();
System.out.println(circle instanceof Circle);
```

Ví dụ này rất rõ ràng, chức năng của từ khoá instanceof như vậy, dễ hiểu. Tuy nhiên nếu muốn kiểm tra xem một đối tượng có phải là loại của lớp cha không?

```java
System.out.println(circle instanceof Round);
```

Kết quả ở đây cũng là true, vì lớp Circle là lớp con của Round, vẫn thỏa mãn quan hệ "là một" (is-a). Tiếp theo, nếu muốn kiểm tra xem một đối tượng có triển khai một giao diện nhất định không?

```java
System.out.println(circle instanceof Shape);
```

Kết quả ở đây cũng là true, vì Circle triển khai giao diện Shape, cũng thỏa mãn quan hệ "là một" (is-a).

Để chứng minh điều này, chúng ta sẽ tạo một lớp Triangle, triển khai giao diện Shape nhưng không có mối liên hệ gì đến lớp Circle:

```java
class Triangle implements Shape {
}
```

Khi sử dụng instanceof để so sánh, trình biên dịch sẽ báo lỗi:

```java
System.out.println(circle instanceof Triangle);
```

Thông báo lỗi sẽ như sau:

```
Inconvertible types; cannot cast 'com.itwanger.twentyfour.instanceof1.Circle' to 'com.itwanger.twentyfour.instanceof1.Triangle'
```

Điều này có nghĩa là các loại không thể chuyển đổi, không thể ép kiểu từ Circle sang Triangle bằng instanceof.

Trình biên dịch đã thông minh trước, nó đã cảnh báo rằng Circle không thể chuyển đổi sang Triangle.

Java là một ngôn ngữ lập trình hướng đối tượng, có nghĩa là ngoài các kiểu dữ liệu cơ bản, tất cả các lớp đều ngầm kế thừa từ lớp Object. Do đó, kết quả dưới đây cũng sẽ in ra true:

```java
Thread thread = new Thread();
System.out.println(thread instanceof Object);
```

“Vậy nếu đối tượng là null thì sao nhỉ?” tôi chen ngang vào.

“Đúng là một câu hỏi hay đấy.” Bản thân của toi không thể nhịn được mà ngước lên tưởng vinh ngón tay cái.

```java
System.out.println(null instanceof Object);
```

Chỉ có đối tượng mới có thể có giá trị null, vì vậy trình biên dịch sẽ không báo lỗi, nhưng kết quả của instanceof với null là false. Bởi vì không thể xác định đối tượng null thuộc về lớp nào.

Thường thì, chúng ta sử dụng từ khoá instanceof như sau:

```java
// Đầu tiên kiểm tra kiểu dữ liệu
if (obj instanceof String) {
    // Sau đó ép kiểu
    String s = (String) obj;
    // Và sử dụng
}
```

Đầu tiên sử dụng instanceof để kiểm tra kiểu dữ liệu, sau đó ép kiểu obj sang kiểu dữ liệu mong muốn và sử dụng nó.

Từ JDK 16, instanceof đã hỗ trợ mẫu phù hợp, điều này làm cho việc sử dụng instanceof trở nên thuận tiện hơn:

```java
if (obj instanceof String s) {
    // Nếu kiểu phù hợp, sẽ sử dụng s ngay lập tức
}
```

Bạn có thể đặt một biến ngay trong điều kiện if để xác định kiểu mà không cần phải ép kiểu hoặc khai báo một biến mới.

