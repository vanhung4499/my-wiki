---
title: Varables
tags:
  - java
categories:
  - java
order: 5
---
Đây là phần dịch tiếp của đoạn văn bạn cung cấp:

# Varables

Tham số biến đổi (Varables) được giới thiệu vào từ Java 1.5, cho phép phương thức chấp nhận một số lượng bất kỳ các giá trị cùng loại (`is-a`) làm tham số. Có thể như ví dụ dưới đây:

```java
public static void main(String[] args) {
    print("a");
    print("a", "b");
    print("a", "b", "c");
    print("a", "b", "c", "d");
}

public static void print(String... strs) {
    for (String s : strs)
        System.out.print(s);
    System.out.println();
}
```

Phương thức tĩnh `print()` sử dụng tham số biến, do đó `print("a")`, `print("a", "b")`, thậm chí cả 3, 4 hay nhiều hơn chuỗi đều có thể được chuyển vào phương thức `print()`.

Ý nghĩa của nó là nên tránh sử dụng tham số biến nếu có thể. Nếu phải sử dụng, tham số biến phải đặt ở vị trí cuối cùng trong danh sách tham số. Vì chỉ có giới hạn hẹp, nó chỉ có thể ở cuối cùng (hãy cẩn thận, hãy cẩn thận). Nếu tham số biến không ở cuối cùng, IDE sẽ hiển thị cảnh báo tương ứng.

Tham số biến dường như giống như là một đường nét lỗi thời, nó ẩn chứa điều gì đó? Hãy cùng khám phá, trên con đường đi tìm sự thật, chúng ta phải kiên trì.

Thực ra cũng rất đơn giản. **Khi sử dụng tham số biến đổi, thực tế là trước tiên tạo một mảng, kích thước của mảng là số lượng tham số biến, sau đó đưa các tham số vào mảng và sau đó chuyển mảng đó cho phương thức được gọi**.

Đó là lý do tại sao có thể sử dụng mảng làm tham số để gọi phương thức có tham số biến đổi. Mã như sau:

```java
public static void main(String[] args) {
    print(new String[]{"a"});
    print(new String[]{"a", "b"});
    print(new String[]{"a", "b", "c"});
    print(new String[]{"a", "b", "c", "d"});
}

public static void print(String... strs) {
    for (String s : strs)
        System.out.print(s);
    System.out.println();
}
```

"Khi nào chúng ta thường sử dụng đối số biến đổi?"

Tham số biến đổi, như tên gọi đã cho thấy, được sử dụng khi một phương thức cần xử lý một số lượng tùy ý các đối tượng cùng loại. Java cung cấp một ví dụ tốt với phương thức `format()` của lớp `String`, như dưới đây.

```java
System.out.println(String.format("Tuổi là: %d", 18));
System.out.println(String.format("Tuổi là: %d, Tên là: %s", 18, "abcd"));
```

`%d` được sử dụng để định dạng số nguyên dưới dạng số thập phân, và `%s` được sử dụng để đầu ra chuỗi.

Nếu không sử dụng đối số biến đổi, các tham số cần định dạng sẽ phải được nối với nhau bằng toán tử "+" và điều này có thể gây rối loạn.

```java
public static void main(String[] args) {
    print(null);
}

public static void print(String... strs) {
    for (String a : strs)
        System.out.print(a);
    System.out.println();
}

public static void print(Integer... ints) {
    for (Integer i : ints)
        System.out.print(i);
    System.out.println();
}
```

Lúc này, trình biên dịch hoàn toàn không biết nên gọi phương thức `print()` nào, `print(String... strs)` hay `print(Integer... ints)`, đều không rõ ràng.

Nếu thật sự cần phải nạp chồng các phương thức có tham số biến, bạn phải chỉ rõ khi gọi phương thức, không để trình biên dịch phải đoán.

```java
public static void main(String[] args) {
    String[] strs = null;
    print(strs);

    Integer[] ints = null;
    print(ints);
}

public static void print(String... strs) {
}

public static void print(Integer... ints) {
}
```

Đoạn mã trên sẽ biên dịch thành công. Vì trình biên dịch biết liệu tham số là kiểu String hay kiểu Integer, tuy nhiên để tránh ngoại lệ `NullPointerException` khi chạy, bạn nên kiểm tra và xử lý chuỗi hoặc mảng số nguyên bên trong hai phương thức `print()`.
