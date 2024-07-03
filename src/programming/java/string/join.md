---
title: Join Strings
tags: ['java']
categories: ['java']
order: 6
---

# Join Strings

### Bản chất của toán tử +

Toán tử + thực ra được Java diễn giải lại khi biên dịch, nói cách khác, toán tử + là một dạng cú pháp ngọt ngào (syntactic sugar) giúp việc nối chuỗi trở nên thuận tiện hơn.

```java
class Demo {
    public static void main(String[] args) {
        String hung = "Hung";
        String dev = "Dev";
        System.out.println(hung + dev);
    }
}
```

Trong môi trường Java 8, khi sử dụng `javap -c Demo.class` để dịch ngược [bytecode](/programming/java/jvm/bytecode.html) (bytecode và javap chúng ta sẽ đề cập chi tiết trong phần JVM, ở đây có thể chỉ cần liếc qua một chút), có thể thấy nội dung sau:

```text
Compiled from "Demo.java"
class Demo {
  Demo();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: ldc           #2                  // String Hung
       2: astore_1
       3: ldc           #3                  // String Dev
       5: astore_2
       6: getstatic     #4                  // Field java/lang/System.out:Ljava/io/PrintStream;
       9: new           #5                  // class java/lang/StringBuilder
      12: dup
      13: invokespecial #6                  // Method java/lang/StringBuilder."<init>":()V
      16: aload_1
      17: invokevirtual #7                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      20: aload_2
      21: invokevirtual #7                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      24: invokevirtual #8                  // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
      27: invokevirtual #9                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      30: return
}
```

"Nếu bạn chưa từng hiểu về [bytecode](/programmin/java/jvm/bytecode) trước đây, có thể sẽ cảm thấy áp lực một chút. Nhưng đừng lo lắng, chúng ta sẽ giải thích một chút và bạn sẽ hiểu ngay."

Dòng số 9 có từ khóa new và kiểu class là `java/lang/StringBuilder`. Điều này có nghĩa là một đối tượng StringBuilder mới được tạo ra.

Rồi nhìn vào dòng số 17, đó là một lệnh invokevirtual, dùng để gọi phương thức của đối tượng, cụ thể là phương thức `append()` của đối tượng StringBuilder.

"Điều này có nghĩa là chuỗi hung ('Hung') đã được thêm vào đối tượng StringBuilder."

"Tiếp tục nhìn xuống, dòng số 21, lại gọi lần nữa phương thức `append()`, có nghĩa là chuỗi dev ('Dev') đã được thêm vào đối tượng StringBuilder."

"Nếu chuyển sang mã Java để biểu diễn, sẽ gần như thế này:

```java
class Demo {
    public static void main(String[] args) {
        String hung = 'Hung';
        String dev = 'Dev';
        System.out.println((new StringBuilder(hung)).append(dev).toString());
    }
}
```

Lúc biên dịch, toán tử '+' được thay thế bằng phương thức `append()` của StringBuilder.

Nhưng đến Java 9 (mặc dù không phải phiên bản hỗ trợ dài hạn, tôi sẽ dùng Java 11 để minh họa), tình hình đã thay đổi một chút, mã bytecode hoàn toàn khác nhau.

"Trong môi trường Java 11, cùng đoạn mã bytecode như sau:

```
Compiled from "Demo.java"
public class com.itdev.thirtyseven.Demo {
  public com.itdev.thirtyseven.Demo();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: ldc           #2                  // String
       2: astore_1
       3: iconst_0
       4: istore_2
       5: iload_2
       6: bipush        10
       8: if_icmpge     41
      11: new           #3                  // class java/lang/String
      14: dup
      15: ldc           #4                  // String Hung
      17: invokespecial #5                  // Method java/lang/String."<init>":(Ljava/lang/String;)V
      20: astore_3
      21: ldc           #6                  // String Dev
      23: astore        4
      25: aload_1
      26: aload_3
      27: aload         4
      29: invokedynamic #7,  0              // InvokeDynamic #0:makeConcatWithConstants:(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
      34: astore_1
      35: iinc          2, 1
      38: goto          5
      41: return
}
```

Chúng ta có một dòng số 29 sử dụng lệnh `invokedynamic`. Lệnh này cho phép mã bytecode quyết định phương thức giải quyết dựa trên mã ứng dụng, được gọi là phương thức Bootstrap Method (BSM). BSM trả về một đối tượng CallSite, liên kết với lệnh `invokedynamic`. Lần thực thi lệnh `invokedynamic` không tạo ra CallSite mới. Điều này biến CallSite thành một bộ giữ MethodHandle, trỏ tới phương thức thực thi thực sự tại điểm gọi - trong trường hợp này là phương thức `StringConcatFactory.makeConcatWithConstants()`.

Tổng kết lại là từ Java 9 trở đi, JDK đã sử dụng một phương pháp khác để động dịch toán tử +, cụ thể cách thực hiện này không còn nhìn thấy trên mức bytecode nữa, vì vậy tôi sẽ tiếp tục giảng giải dựa trên Java 8.

"Ở đây, chúng ta sẽ nói thêm một chút, nếu có đoạn mã như sau:

```java
class StringConcat {
    public static void main(String[] args) {
        int i = 11;
        String s = i + "";
        System.out.println(s);
    }
}
```

Toán tử + làm thế nào để nối chuỗi?

Chúng ta có thể dùng `javap -c StringConcat` để xem mã bytecode:

Ta thấy toán tử + được biên dịch thành phương thức `append()` của `StringBuilder`.

Nhưng nếu đoạn mã là:

```java
class StringConcat1 {
    public static void main(String[] args) {
        String s = 11 + "";
        System.out.println(s);
    }
}
```

Toán tử + làm thế nào để nối chuỗi?

Chúng ta có thể dùng `javap -c StringConcat1` để xem mã bytecode:

StringBuilder không còn nữa? Điều này là tại sao?

Đó là vì cả hai toán hạng của phép nối + là hằng số biên dịch (một là số nguyên chữ số 11, một là chuỗi rỗng ""), vì vậy trình biên dịch có thể thực hiện phép nối chuỗi này ngay trong quá trình biên dịch.

Nghĩa là, phép nối chuỗi 11 + "" đã được tối ưu hóa và xử lý bởi trình biên dịch trong quá trình biên dịch thành hằng số chuỗi "11"."

### Tại sao nên biên dịch thành StringBuilder.append

**Trong vòng lặp, nếu muốn nối chuỗi thì nên sử dụng phương thức `append()` của StringBuilder thay vì toán tử +.** Lý do là nếu sử dụng toán tử + trong vòng lặp, sẽ tạo ra nhiều đối tượng StringBuilder, làm tăng lượng bộ nhớ sử dụng và khiến cho máy ảo Java phải thực hiện thu gom rác liên tục, làm giảm hiệu suất của chương trình."

Cách viết tốt hơn là khởi tạo một đối tượng StringBuilder bên ngoài vòng lặp, sau đó sử dụng phương thức `append()` để thêm các chuỗi trong vòng lặp vào đó:

```java
class Demo {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i < 10; i++) {
            String hung = "Hung";
            String dev = "Dev";
            sb.append(hung);
            sb.append(dev);
        }
        System.out.println(sb);
    }
}
```

Hãy thử một bài kiểm tra nhỏ.

Đoạn mã đầu tiên, sử dụng toán tử + trong vòng lặp:

```java
String result = "";
for (int i = 0; i < 100000; i++) {
    result += "666";
}
```

Đoạn mã thứ hai, khởi tạo StringBuilder bên ngoài vòng lặp và sử dụng `append()` trong vòng lặp:

```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 100000; i++) {
    sb.append("666");
}
```

Đoạn mã đầu tiên mất 6212 mili giây để thực thi, còn đoạn thứ hai chỉ mất dưới 1 mili giây, khác biệt quá lớn!

### Phân tích mã nguồn phương thức `append()` của StringBuilder

Hãy xem mã nguồn của phương thức `append()` trong lớp StringBuilder!

```java
public StringBuilder append(String str) {
    super.append(str);
    return this;
}
```

Ba dòng mã này thực tế không có gì đáng xem. Chúng ta hãy đến xem phương thức `append()` của lớp cha AbstractStringBuilder:

```java
public AbstractStringBuilder append(String str) {
    if (str == null)
        return appendNull();
    int len = str.length();
    ensureCapacityInternal(count + len);
    str.getChars(0, len, value, count);
    count += len;
    return this;
}
```

1) Kiểm tra xem chuỗi cần nối có phải là null hay không. Nếu là null, phương thức sẽ gọi appendNull() để xử lý chuỗi "null". Mã nguồn của phương thức appendNull() như sau:

```java
private AbstractStringBuilder appendNull() {
    int c = count;
    ensureCapacityInternal(c + 4);
    final char[] value = this.value;
    value[c++] = 'n';
    value[c++] = 'u';
    value[c++] = 'l';
    value[c++] = 'l';
    count = c;
    return this;
}
```

2) Lấy độ dài của chuỗi.

3) Mã nguồn của phương thức ensureCapacityInternal() như sau:

```java
private void ensureCapacityInternal(int minimumCapacity) {
    // overflow-conscious code
    if (minimumCapacity - value.length > 0) {
        value = Arrays.copyOf(value,
                newCapacity(minimumCapacity));
    }
}
```

Do chuỗi được triển khai bằng mảng, nên trước tiên cần kiểm tra xem chiều dài của mảng ký tự sau khi nối có vượt quá chiều dài hiện tại hay không. Nếu vượt quá, hàm sẽ mở rộng mảng và sao chép giá trị hiện tại vào mảng mới.

4) Sao chép chuỗi cần nối str vào mảng đích value.

```java
str.getChars(0, len, value, count)
```

5) Cập nhật chiều dài của mảng count.


### String.concat

“Ngoài việc sử dụng toán tử + và phương thức `append()` của StringBuilder, còn có phương pháp nào khác để nối chuỗi không?” Tam Muội hỏi.

“Có chứ, ví dụ như phương thức `concat()` của lớp String, khá giống với phương thức `append()` của lớp StringBuilder.”

```java
String hung = "Hung";
String dev = "Dev";
System.out.println(hung.concat(wanger));
```

Chúng ta có thể xem qua mã nguồn của phương thức `concat()`.

```java
public String concat(String str) {
    int otherLen = str.length();
    if (otherLen == 0) {
        return this;
    }
    int len = value.length;
    char buf[] = Arrays.copyOf(value, len + otherLen);
    str.getChars(buf, len);
    return new String(buf, true);
}
```

1) Nếu độ dài của chuỗi được nối là 0, thì trả về chuỗi trước khi nối.

2) Sao chép mảng ký tự value của chuỗi gốc vào mảng buf.

3) Sao chép chuỗi str vào mảng ký tự buf, và trả về đối tượng chuỗi mới.

Tôi giải thích từng dòng cho Tam Muội.

“So với toán tử +, phương thức `concat()` khi gặp chuỗi là null sẽ ném ra ngoại lệ NullPointerException, trong khi toán tử + sẽ xử lý null như là chuỗi “null”.”

Nếu chuỗi được nối là một chuỗi rỗng (""), thì hiệu suất của concat sẽ cao hơn một chút, vì không cần phải tạo đối tượng `new StringBuilder`.

Nếu có rất nhiều chuỗi cần nối, hiệu suất của `concat()` sẽ giảm, vì số lượng đối tượng chuỗi được tạo ra ngày càng nhiều.

### String.join Nối Chuỗi

String class có một phương thức tĩnh `join()` có thể được sử dụng như sau:

```java
String hung = "Hung";
String dev = "Dev";
String cmower = String.join("", hung, dev);
System.out.println(cmower);
```

Tham số đầu tiên là ký tự nối chuỗi, ví dụ như:

```java
String message = String.join("-", "Hung", "Dev", "Java");
```

Kết quả đầu ra là: `Hung-Dev-Java`.

Hãy xem mã nguồn của phương thức join:

```java
public static String join(CharSequence delimiter, CharSequence... elements) {
    Objects.requireNonNull(delimiter);
    Objects.requireNonNull(elements);
    // Number of elements not likely worth Arrays.stream overhead.
    StringJoiner joiner = new StringJoiner(delimiter);
    for (CharSequence cs: elements) {
        joiner.add(cs);
    }
    return joiner.toString();
}
```

Trong đó, một đối tượng StringJoiner được tạo mới, sau đó các phần tử trong danh sách tham số biến đổi được thêm vào bằng vòng lặp for-each, và cuối cùng gọi phương thức `toString()` để trả về một đối tượng String.

### StringUtils.join của Apache Commons Lang

"Trong công việc thực tế, phương thức `join()` của `org.apache.commons.lang3.StringUtils` cũng thường được sử dụng để nối chuỗi."

```java
String hung = "Hung";
String dev = "Dev";
StringUtils.join(hung, dev);
```

Phương thức này không cần lo lắng về NullPointerException.

```java
StringUtils.join(null)            = null
StringUtils.join([])              = ""
StringUtils.join([null])          = ""
StringUtils.join(["a", "b", "c"]) = "abc"
StringUtils.join([null, "", "a"]) = "a"
```

Hãy xem mã nguồn của phương thức:

```java
public static String join(final Object[] array, String separator, final int startIndex, final int endIndex) {
    if (array == null) {
        return null;
    }
    if (separator == null) {
        separator = EMPTY;
    }

    final StringBuilder buf = new StringBuilder(noOfItems * 16);

    for (int i = startIndex; i < endIndex; i++) {
        if (i > startIndex) {
            buf.append(separator);
        }
        if (array[i] != null) {
            buf.append(array[i]);
        }
    }
    return buf.toString();
}
```

Bên trong vẫn sử dụng StringBuilder.

Về kiến thức nối chuỗi chúng ta dừng lại ở đây nhé. Lưu ý rằng từ Java 9 trở đi, cách xử lý của toán tử + đã thay đổi, và các chỉ thị bytecode cũng khác đi rất nhiều. Khi nào Tam học được về bytecode, ta sẽ thảo luận chi tiết hơn.
