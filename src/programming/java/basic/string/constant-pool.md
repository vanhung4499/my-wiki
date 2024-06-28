---
title: Constant Pool
tags: ['java']
categories: ['java']
order: 3
---

# Java Constant Pool

## Đoạn code `String s = new String("java")` tạo ra bao nhiêu đối tượng?

Khi bạn viết:

```java
String s = new String("java");
```

**Đáp án là hai đối tượng**.

- **Đối tượng 1:** "java" được tạo ra trong string constant pool, nếu nó chưa tồn tại ở đó. Đây là một khu vực đặc biệt trong bộ nhớ, nơi lưu trữ các chuỗi có thể tái sử dụng.

- **Đối tượng 2:** `new String("java")` sẽ tạo ra một đối tượng chuỗi mới trong vùng nhớ heap. Dù chuỗi "java" đã có trong string constant pool, việc sử dụng `new String()` sẽ tạo ra một bản sao mới của chuỗi này trên heap.

### Vì sao lại có string constant pool?

"Vì sao phải tạo ra hằng chuỗi trước khi tạo đối tượng trên heap?" – Đó là một câu hỏi hay!

Java tạo ra hằng chuỗi để cải thiện hiệu suất và giảm thiểu sử dụng bộ nhớ. Khi bạn khởi tạo một chuỗi bằng cách gán `"java"` cho một biến, Java sẽ trước tiên kiểm tra xem có tồn tại trong constant pool không. Nếu có, nó sẽ tái sử dụng chuỗi đó thay vì tạo mới. Điều này giúp tiết kiệm bộ nhớ và làm cho các thao tác so sánh chuỗi nhanh hơn.

### Tại sao không chỉ dùng heap mà không cần string constant pool?

Đúng vậy, nếu chỉ sử dụng heap, chúng ta có thể tiết kiệm một bước. Tuy nhiên, việc sử dụng string constant pool cho phép Java tối ưu hóa nhiều hoạt động xử lý chuỗi. Ví dụ, khi so sánh hai chuỗi (`==` trong Java so sánh tham chiếu), nếu cả hai đều trỏ đến cùng một string constant pool, so sánh sẽ nhanh hơn và đơn giản hơn.

Đó là lý do Java thiết kế như vậy, để đảm bảo hiệu suất và tối ưu hóa trong việc quản lý chuỗi, một trong những thành phần dữ liệu quan trọng nhất trong các ứng dụng Java.

## Tác dụng của string constant pool trong Java

Thường thì, chúng ta sẽ sử dụng dấu ngoặc kép để tạo đối tượng chuỗi trong Java, thay vì sử dụng từ khóa `new`, như ví dụ dưới đây 👇🏻, để tránh việc làm thừa:

```java
String s = "java";
```

Khi thực hiện `String s = "java"` trong Java, máy ảo Java sẽ tìm kiếm xem trong string constant pool có đối tượng chuỗi "java" không. Nếu có, nó sẽ không tạo đối tượng mới mà chỉ đơn giản trả về địa chỉ của đối tượng chuỗi "java" trong string constant pool và gán cho biến s. Nếu không có, nó sẽ tạo mới đối tượng chuỗi "java" trong string constant pool và trả về địa chỉ của nó để gán cho biến s.

Java Virtual Machine (Máy ảo Java) sẽ tạo một đối tượng chuỗi "java" và thêm nó vào string constant pool, đồng thời biến s được lưu trữ trên stack, trỏ đến đối tượng chuỗi "java" trong string constant pool. Bạn thấy không, nó đã giảm bớt một bước và làm cho việc này hiệu quả hơn so với trước đây.

"Với string constant pool, ta có thể tạo đối tượng chuỗi trực tiếp bằng cách sử dụng dấu ngoặc kép, không cần phải sử dụng từ khóa new để tạo đối tượng trên heap"

"Phương thức new luôn tạo một đối tượng, bất kể nội dung của chuỗi đã tồn tại hay chưa, trong khi cách dùng dấu ngoặc kép sẽ tái sử dụng các đối tượng đã tồn tại trong string constant pool."

Hãy xem ví dụ dưới đây:

```java
String s = new String("java");
String s1 = new String("java");
```

Theo phân tích trước đó của chúng ta, hai dòng mã này sẽ tạo ra ba đối tượng: một trong string constant pool và hai trên heap.

Hãy xem ví dụ khác:

```java
String s = "java";
String s1 = "java";
```

Hai dòng mã này chỉ tạo ra một đối tượng, đó là đối tượng trong string constant pool. Như vậy, hiệu suất sẽ được cải thiện!

## Vị trí của string constant pool trong bộ nhớ trong Java

### Java 7 trở về trước

Trước Java 7, string constant pool được lưu trữ trong vùng bộ nhớ Permanent Generation (PermGen). PermGen là một phần của Java Heap, dùng để lưu trữ thông tin lớp, thông tin phương thức, thông tin hằng số và dữ liệu tĩnh khác.

Java Heap là vùng bộ nhớ trong JVM dùng để lưu trữ các thực thể đối tượng và mảng. Tóm lại, PermGen lưu trữ các dữ liệu tĩnh khác so với đối tượng và mảng trong Java Heap.

Khi ta tạo một string constant pool, nó sẽ được lưu trữ trong string constant pool của PermGen. Nếu ta tạo một đối tượng chuỗi thông thường, nó sẽ được lưu trữ trong Java Heap. Nếu nội dung của đối tượng chuỗi đã tồn tại trong string constant pool, thì đối tượng này sẽ trỏ đến string constant pool đó, thay vì tạo một đối tượng chuỗi mới.

### Java 7

Tuy nhiên, từ Java 7 trở đi, kích thước của PermGen là có giới hạn và khó xác định chính xác cho một ứng dụng. Nếu một ứng dụng sử dụng rất nhiều các lớp, phương thức và hằng số, có thể dẫn đến tình trạng thiếu không gian trong PermGen. Khi đó, JVM có thể gây ra lỗi OutOfMemoryError.

Do đó, từ Java 7, để giải quyết vấn đề không gian của PermGen, string constant pool đã được di chuyển từ PermGen sang Java Heap. Thay đổi này cũng nhằm hỗ trợ tốt hơn cho các tính năng runtime của ngôn ngữ động.

### Java 8

Trong Java 8, PermGen đã bị loại bỏ và thay thế bằng Metaspace. Metaspace là một vùng bộ nhớ native (tức là không phải JVM Heap) dùng để lưu trữ thông tin lớp, phương thức, hằng số và dữ liệu tĩnh khác.

Metaspace có một số ưu điểm so với PermGen:
- Không gây ra lỗi OutOfMemoryError do Metaspace có thể điều chỉnh kích thước động.
- Sử dụng bộ nhớ native giúp tránh vấn đề phân mảnh bộ nhớ của Heap.
- Thu gom rác trong Metaspace và Heap là độc lập nhau, giúp tránh tình trạng Full GC do việc tải và giải tải lớp thường xuyên trong quá trình chạy ứng dụng.

Đó là một phần giải thích về vị trí của string constant pool trong bộ nhớ của Java.
