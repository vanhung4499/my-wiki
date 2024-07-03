---
title: String Equals
tags: ['java']
categories: ['java']
order: 5
---

# Làm thế nào để xác định hai chuỗi có bằng nhau hay không

"Làm thế nào để so sánh hai chuỗi bằng nhau?"

"Vấn đề này trông có vẻ đơn giản, nhưng lại có hơn 3.7 triệu lượt truy cập trên Stack Overflow". "Vấn đề này cũng có thể mở rộng ra thành sự khác biệt giữa `.equals()` và toán tử '==' là gì."

- Toán tử '==' dùng để so sánh địa chỉ của hai đối tượng có bằng nhau hay không.
- Phương thức `.equals()` dùng để so sánh nội dung của hai đối tượng có bằng nhau hay không.

Hãy xem ví dụ sau

```java
String a = new String("c");
String b = new String("c");

System.out.println(a.equals(b)); // true
System.out.println(a == b); // false
```

Trong đoạn mã trên, kết quả của `.equals()` là true, trong khi kết quả của toán tử '==' là false — cái trước chỉ yêu cầu nội dung bằng nhau, cái sau yêu cầu phải là cùng một đối tượng.

"Trước đây đã học rồi, tất cả các lớp trong Java đều mặc định kế thừa lớp Object, lớp này có một phương thức tên là `.equals()`."

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

Phương thức `.equals()` của lớp Object mặc định sử dụng toán tử '==' để so sánh. Nếu lớp con không ghi đè phương thức này, thì toán tử '==' và phương thức `.equals()` sẽ có tác dụng hoàn toàn giống nhau — so sánh địa chỉ bộ nhớ của hai đối tượng có bằng nhau hay không.

Nhưng trong thực tế, có nhiều lớp đã ghi đè phương thức `.equals()` vì việc so sánh địa chỉ bộ nhớ có yêu cầu khá khắt khe, không phù hợp với tất cả các trường hợp thực tế. Lấy lớp String làm ví dụ, khi chúng ta so sánh các chuỗi, chúng ta thực sự chỉ muốn kiểm tra xem nội dung của chúng có bằng nhau hay không, chứ không phải so sánh chúng có phải là cùng một đối tượng hay không.

Hơn nữa, chuỗi còn có khái niệm [bể hằng số chuỗi (string constant pool)](/programming/java/string/constant-pool.html), bản thân nó khuyến khích sử dụng cách tạo đối tượng chuỗi `String s = "abc"` thay vì dùng từ khóa `new`, vì có thể lưu trữ chuỗi trong bể hằng số, tiện lợi cho việc sử dụng lần sau mà không phải mỗi lần `new` là lại cấp phát một vùng nhớ mới trên heap.

Chúng ta hãy xem mã nguồn của phương thức `.equals()` trong lớp String:

```java
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    if (anObject instanceof String) {
        String aString = (String)anObject;
        if (coder() == aString.coder()) {
            return isLatin1() ? StringLatin1.equals(value, aString.value)
                    : StringUTF16.equals(value, aString.value);
        }
    }
    return false;
}
```

Trước tiên, nếu hai đối tượng chuỗi có thể so sánh bằng `==`, thì trả về true ngay lập tức, vì trong trường hợp này, nội dung của chuỗi chắc chắn là bằng nhau. Nếu không, thì so sánh dựa trên mã hóa ký tự, chia thành UTF16 và Latin1, sự khác biệt không lớn, hãy xem xét mã nguồn của Latin1:

```java
@HotSpotIntrinsicCandidate
public static boolean equals(byte[] value, byte[] other) {
    if (value.length == other.length) {
        for (int i = 0; i < value.length; i++) {
            if (value[i] != other[i]) {
                return false;
            }
        }
        return true;
    }
    return false;
}
```

Đây là phiên bản JDK 17, cũng là phiên bản LTS (hỗ trợ dài hạn) mới nhất. Trong phiên bản này, lớp String được triển khai bằng mảng byte, nên khi so sánh nội dung của hai chuỗi, có thể so sánh độ dài của mảng byte trước. Nếu độ dài không bằng nhau thì trả về false ngay lập tức; nếu không, thì duyệt qua mảng byte của hai chuỗi, chỉ cần một byte không bằng nhau, trả về false.

Đây là mã nguồn của phương thức `equals` trong Java 8:

```java
public boolean equals(Object anObject) {
    // Kiểm tra xem có phải cùng một đối tượng hay không
    if (this == anObject) {
        return true;
    }
    // Kiểm tra xem đối tượng có phải là kiểu String hay không
    if (anObject instanceof String) {
        String anotherString = (String)anObject;
        int n = value.length;
        // Kiểm tra xem độ dài của chuỗi có bằng nhau hay không
        if (n == anotherString.value.length) {
            char v1[] = value;
            char v2[] = anotherString.value;
            int i = 0;
            // Kiểm tra từng ký tự có bằng nhau hay không
            while (n-- != 0) {
                if (v1[i] != v2[i])
                    return false;
                i++;
            }
            return true;
        }
    }
    return false;
}
```

JDK 8 dễ hiểu hơn JDK 17 một chút: đầu tiên kiểm tra xem hai đối tượng có phải là cùng một đối tượng không, nếu đúng thì trả về true. Sau đó, kiểm tra xem đối tượng có phải là kiểu String không, nếu không phải thì trả về false. Nếu đối tượng là kiểu String, thì so sánh độ dài của hai chuỗi, nếu độ dài không bằng nhau thì trả về false. Nếu độ dài bằng nhau, thì so sánh từng ký tự một, nếu tất cả các ký tự đều bằng nhau thì trả về true, nếu không thì trả về false.

Hãy trả lời câu hỏi sau:

**Câu hỏi thứ nhất:**

```java
new String("abc").equals("abc")
```

"Kết quả là gì?"

> `.equals()` so sánh nội dung của hai đối tượng chuỗi, vì vậy kết quả là true.

**Câu hỏi thứ hai:**

```java
new String("abc") == "abc"
```

> Toán tử `==` so sánh địa chỉ bộ nhớ của hai đối tượng, bên trái là đối tượng được tạo trên heap, bên phải là đối tượng trong bể hằng số chuỗi. Mặc dù nội dung giống nhau, nhưng địa chỉ bộ nhớ khác nhau, nên kết quả là false.

**Câu hỏi thứ ba:**

```java
new String("abc") == new String("abc")
```

> Đối tượng được tạo bằng `new` chắc chắn có địa chỉ bộ nhớ khác nhau, nên kết quả là false.

**Câu hỏi thứ tư:**

```java
"abc" == "abc"
```

> Trong bể hằng số chuỗi chỉ có một đối tượng với nội dung giống nhau, nên kết quả là true.

**Câu hỏi thứ năm:**

```java
"abc" == "a" + "bc"
```

> Do `a` và `bc` đều nằm trong bể hằng số chuỗi, nên trình biên dịch sẽ tự động tối ưu hóa toán tử `+` thành `abc`, nên kết quả là true.

PS: Để hiểu rõ hơn tại sao, hãy xem bài viết về [String, StringBuilder, StringBuffer](/programming/java/string/builder-buffer.html).

**Câu hỏi thứ sáu:**

```java
new String("abc").intern() == "abc"
```

> `new String("abc")` khi thực thi sẽ tạo đối tượng trong bể hằng số chuỗi trước, sau đó mới tạo đối tượng trên heap; khi gọi phương thức `intern()`, nếu phát hiện trong bể hằng số chuỗi đã có đối tượng `abc`, thì sẽ trả về tham chiếu tới đối tượng trong bể hằng số chuỗi, nên khi so sánh với đối tượng `abc` trong bể hằng số chuỗi, kết quả sẽ là true.

PS: Phương thức [intern](/programming/java/string/intern.html) đã được chúng ta nghiên cứu kỹ trước đây.

Nếu muốn so sánh nội dung của hai đối tượng chuỗi, ngoài phương thức `.equals()`, còn có hai phương án khác:

1) `Objects.equals()`

Phương pháp tĩnh `Objects.equals()` có lợi thế là không cần phải kiểm tra null trước khi gọi.

```java
public static boolean equals(Object a, Object b) {
    return (a == b) || (a != null && a.equals(b));
}
```

Nếu sử dụng trực tiếp `a.equals(b)`, thì cần phải kiểm tra null cho `a` trước khi gọi, nếu không có thể gây ra ngoại lệ NullPointerException. `Objects.equals()` sử dụng tiện lợi hơn vì không gặp phải vấn đề này.

```java
Objects.equals("小萝莉", new String("小" + "萝莉")); // --> true
Objects.equals(null, new String("小" + "萝莉")); // --> false
Objects.equals(null, null); // --> true

String a = null;
a.equals(new String("小" + "萝莉")); // gây ngoại lệ
```

2) Phương thức `.contentEquals()` của lớp String

Phương thức `.contentEquals()` có lợi thế là có thể so sánh chuỗi với bất kỳ dãy ký tự nào (StringBuffer, StringBuilder, String, CharSequence).

```java
public boolean contentEquals(CharSequence cs) {
    // Tham số là một StringBuffer, StringBuilder
    if (cs instanceof AbstractStringBuilder) {
        if (cs instanceof StringBuffer) {
            synchronized(cs) {
                return nonSyncContentEquals((AbstractStringBuilder)cs);
            }
        } else {
            return nonSyncContentEquals((AbstractStringBuilder)cs);
        }
    }
    // Tham số là một String
    if (cs instanceof String) {
        return equals(cs);
    }
    // Tham số là một CharSequence chung
    int n = cs.length();
    if (n != length()) {
        return false;
    }
    byte[] val = this.value;
    if (isLatin1()) {
        for (int i = 0; i < n; i++) {
            if ((val[i] & 0xff) != cs.charAt(i)) {
                return false;
            }
        }
    } else {
        if (!StringUTF16.contentEquals(val, cs, n)) {
            return false;
        }
    }
    return true;
}
```

Từ mã nguồn, có thể thấy rằng nếu `cs` là một StringBuffer, phương thức này sẽ đồng bộ hóa, rất thông minh; nếu là một String, thì thực ra vẫn gọi phương thức `equals()`. Tuy nhiên, điều này cũng có nghĩa là khi sử dụng phương thức này để so sánh, sẽ có nhiều bước hơn, dẫn đến một số mất mát về hiệu suất.

Hãy xem mã nguồn của JDK 8:

```java
public boolean contentEquals(CharSequence cs) {
    // Tham số có thể là bất kỳ triển khai CharSequence nào
    nếu độ dài của `cs` không bằng độ dài của `value`, thì trả về false.
    if (cs.length() != value.length) {
        return false;
    }
    // Tham số là một StringBuffer, StringBuilder hoặc String
    if (cs instanceof AbstractStringBuilder) {
        char v1[] = value;
        char v2[] = ((AbstractStringBuilder)cs).getValue();
        int i = 0;
        int n = value.length;
        while (n-- != 0) {
            if (v1[i] != v2[i])
                return false;
            i++;
        }
        return true;
    }
    // Tham số là một String
    if (cs.equals(this))
        return true;
    // Tham số là một CharSequence không phải String, không phải AbstractStringBuilder
    char v1[] = value;
    int i = 0;
    int n = value.length;
    while (n-- != 0) {
        if (v1[i] != cs.charAt(i))
            return false;
        i++;
    }
    return true;
}
```

Dễ hiểu hơn một chút: đầu tiên kiểm tra xem độ dài của tham số có bằng độ dài của `value` không, nếu không bằng thì trả về false. Nếu tham số là một instance của AbstractStringBuilder, lấy ra mảng `char` của nó và so sánh từng phần tử của hai mảng `char`. Nếu tham số là một instance của String, thì gọi trực tiếp phương thức `equals` để so sánh hai chuỗi. Nếu tham số là một đối tượng thực hiện giao diện CharSequence khác, thì so sánh từng ký tự của hai đối tượng.

Tổng thể thì tôi vẫn thấy `Objects.equals()` là dễ sử dụng nhất.
