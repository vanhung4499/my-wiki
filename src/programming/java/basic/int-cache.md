---
title: Int Cache
tags: ['java']
categories: ['java']
date created: 2024-04-28
date modified: 2024-04-28
order: 4
---

# Java Cache Pool

"Hôm nay chúng ta sẽ bổ sung một chút kiến thức nhỏ: Cache Pool cơ bản trong Java," tôi nói với em gái sau khi uống một ngụm trà cây đào, "Tôi sẽ hỏi em một câu hỏi nhé: Sự khác biệt giữa `new Integer(18)` và `Integer.valueOf(18)` là gì?"

"Chúng không giống nhau sao?

"Chúng khác nhau đấy,"

- `new Integer(18)` mỗi lần đều tạo một đối tượng mới;
- `Integer.valueOf(18)` sẽ sử dụng đối tượng từ cache pool, các lần gọi sau chỉ lấy tham chiếu của cùng một đối tượng.

Hãy xem đoạn mã dưới đây:

```java
Integer x = new Integer(18);
Integer y = new Integer(18);
System.out.println(x == y);

Integer z = Integer.valueOf(18);
Integer k = Integer.valueOf(18);
System.out.println(z == k);

Integer m = Integer.valueOf(300);
Integer p = Integer.valueOf(300);
System.out.println(m == p);
```

```java
false
true
false
```

"Đoạn đầu tiên là false, tôi hiểu nguyên nhân, vì `new` tạo ra hai đối tượng khác nhau, địa chỉ khác nhau". "Còn đoạn thứ hai và thứ ba, tôi nghĩ cả hai đều nên là true, tại sao đoạn thứ ba lại xuất ra false?"

"Thực ra lý do cũng đơn giản,"

Ngoại trừ Float và Double, các lớp bao gồm các kiểu dữ liệu cơ bản khác (Byte, Short, Integer, Long, Character, Boolean) đều có Constant Pool.

- Byte: -128~127, tất cả các giá trị byte
- Short: -128~127
- Long: -128~127
- Character: \u0000 - \u007F
- Boolean: true và false

Ví dụ với Integer, trong nội bộ lớp Integer có 256 giá trị Integer được bảo trì trong pool, khi sử dụng giá trị trong khoảng -128~127, nó sẽ trả về tham chiếu của dữ liệu hằng số trong pool, thay vì tạo ra một đối tượng mới, và khi vượt qua phạm vi này, nó sẽ tạo ra một đối tượng mới.

Hãy xem mã nguồn của phương thức valueOf:

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

Hãy xem mã nguồn của lớp IntegerCache, một lớp nội tĩnh (static inner class):

```java
private static class IntegerCache {
    static final int low = -128;
    static final int high;
    static final Integer cache[];

    static {
        // high value may be configured by property
        int h = 127;
        String integerCacheHighPropValue =
                sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
        if (integerCacheHighPropValue != null) {
            try {
                int i = parseInt(integerCacheHighPropValue);
                i = Math.max(i, 127);
                // Maximum array size is Integer.MAX_VALUE
                h = Math.min(i, Integer.MAX_VALUE - (-low) -1);
            } catch( NumberFormatException nfe) {
                // If the property cannot be parsed into an int, ignore it.
            }
        }
        high = h;

        cache = new Integer[(high - low) + 1];
        int j = low;
        for(int k = 0; k < cache.length; k++)
            cache[k] = new Integer(j++);

        // range [-128, 127] must be interned (JLS7 5.1.7)
        assert Integer.IntegerCache.high >= 127;
    }

    private IntegerCache() {}
}
```

Giải thích chi tiết: Khi chúng ta sử dụng phương thức `Integer.valueOf()` để lấy đối tượng số nguyên, nó sẽ kiểm tra xem số nguyên đó có trong IntegerCache không. Nếu có, nó sẽ trả về đối tượng từ pool, ngược lại sẽ tạo một đối tượng mới và lưu vào pool.

Cần lưu ý rằng, nếu sử dụng `new Integer()` để tạo đối tượng, ngay cả khi giá trị nằm trong phạm vi từ -128 đến 127, cũng sẽ không được lưu vào pool, mỗi lần đều tạo ra một đối tượng mới. Do đó, khuyến nghị sử dụng phương thức `Integer.valueOf()` để lấy đối tượng số nguyên.

Khi học về từ khóa static, bạn sẽ được giải thích chi tiết về khối mã tĩnh (static block). Tạm thời, nhớ rằng, khối mã tĩnh thường được sử dụng để khởi tạo một số biến tĩnh, nó sẽ được thực thi trước phương thức main().

Trong khối mã tĩnh, low là -128, tức là giá trị nhỏ nhất trong pool; high mặc định là 127, tức là giá trị lớn nhất trong pool, tổng cộng có 256 giá trị.

*Bạn có thể cấu hình kích thước pool khi JVM khởi động bằng cách sử dụng `-XX:AutoBoxCacheMax=NNN`, tuy nhiên, không thể là vô hạn, tối đa chỉ được `Integer.MAX_VALUE -129`.*

Sau đó, khởi tạo kích thước mảng cache, sau đó duyệt và điền giá trị, bắt đầu từ chỉ số 0.

"Đoạn mã này không khó hiểu, nhưng điều khó hiểu là `assert Integer.IntegerCache.high >= 127;`, dòng mã này là làm gì vậy?"

assert là một từ khóa trong Java, ý nghĩa là khẳng định, được sử dụng để dễ dàng kiểm tra và gỡ lỗi chương trình, không phải là một phần của chương trình đã được phát hành.

Mặc định, assert được tắt, bạn có thể bật nó bằng cách thêm tham số `-ea` khi chạy chương trình Java từ dòng lệnh.

Hãy xem đoạn mã sau.

```java
public class AssertTest {
    public static void main(String[] args) {
        int high = 126;
        assert high >= 127;
    }
}
```

Giả sử kích thước pool được cấu hình thủ công là 126, rõ ràng không phù hợp với giá trị kỳ vọng của pool là 127, kết quả sẽ ra sao?

Hãy mở terminal trong Intellij IDEA và di chuyển vào thư mục classes, sau đó thực thi:

```
 /usr/libexec/java_home -v 1.8 --exec java -ea com.hnv99.s51.AssertTest
```

*Tôi đang sử dụng môi trường macOS, đã cài đặt nhiều phiên bản JDK, lệnh này cho phép chuyển đổi sang JDK 8.*

Hoặc bạn có thể thực thi trực tiếp mà không cần chỉ định phiên bản Java (kèm theo tham số `-ea`):

```
java -ea com.hnv99.s51.AssertTest
```

Báo lỗi như sau

```
Exception in thread "main" java.lang.AssertionError
        at com.hnv99.s51.AssertTest.main(AssertTest.java:9)
```

"Đúng rồi, vì 126 nhỏ hơn 127."

Trong Java, đối với một số loại dữ liệu cơ bản (như Integer, Long, Boolean và nhiều hơn nữa), Java sẽ tạo một số đối tượng phổ biến khi chương trình khởi động và lưu trữ chúng trong bộ nhớ, nhằm tăng hiệu suất của chương trình và tiết kiệm chi phí bộ nhớ. Những đối tượng phổ biến này được lưu trữ trong một phạm vi cố định, và các giá trị vượt quá phạm vi này sẽ được tạo ra lại thành đối tượng mới.

Sử dụng pool dữ liệu cơ bản có thể tăng hiệu suất và tiết kiệm chi phí bộ nhớ của chương trình, nhưng cần lưu ý rằng, trong một số tình huống kinh doanh cụ thể, việc sử dụng pool có thể gây ra một số vấn đề, ví dụ như các đối tượng trong pool được sửa đổi bởi các luồng khác nhau đồng thời, dẫn đến lỗi dữ liệu và các vấn đề khác. Do đó, trong quá trình phát triển thực tế, cần phải xem xét theo yêu cầu cụ thể của nghiệp vụ để quyết định liệu có nên sử dụng constant pool hay không.
