---
title: String Source Code
tags: ['java']
categories: ['java']
order: 1
---

# String Source Code

Hãy xem source code của class `String` trong Java:

### Khai báo lớp String

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
}
```

“Đầu tiên, lớp String là **final**, có nghĩa là nó không thể được kế thừa bởi lớp con. Những kiến thức này chúng ta sẽ tìm hiểu khi học về lập trình hướng đối tượng.”

“Thứ hai, lớp String triển khai interface Serializable, điều này có nghĩa là nó có thể được tuần tự hóa (chúng ta sẽ đề cập đến sau).”

“Thứ ba, lớp String triển khai interface Comparable, điều này có nghĩa là tốt nhất là không nên sử dụng '==' để so sánh hai chuỗi có bằng nhau hay không, thay vào đó nên sử dụng phương thức `compareTo()`.”

Bởi vì '==' được sử dụng để so sánh địa chỉ của hai đối tượng, điều này sẽ được thảo luận chi tiết khi nói về so sánh chuỗi. Nếu chỉ muốn so sánh nội dung của chuỗi, bạn có thể sử dụng phương thức equals của lớp String, mã nguồn và chú thích được hiển thị như sau:

```java
public boolean equals(Object anObject) {
    // Kiểm tra xem đây có phải là cùng một đối tượng không, nếu đúng thì trả về true
    if (this == anObject) {
        return true;
    }
    // Kiểm tra xem anObject có phải là một thể hiện của lớp String hay không
    if (anObject instanceof String) {
        String anotherString = (String) anObject; // Ép kiểu anObject thành kiểu String
        int n = value.length; // Lấy độ dài của chuỗi hiện tại
        // Kiểm tra xem hai chuỗi có cùng độ dài không
        if (n == anotherString.value.length) {
            char v1[] = value; // Mảng ký tự của chuỗi hiện tại
            char v2[] = anotherString.value; // Mảng ký tự của chuỗi khác
            int i = 0; // Chỉ số để duyệt qua từng ký tự trong mảng
            // Duyệt qua và so sánh từng ký tự của hai chuỗi
            while (n-- != 0) {
                // Nếu có bất kỳ vị trí nào ký tự khác nhau, trả về false
                if (v1[i] != v2[i])
                    return false;
                i++;
            }
            // Nếu tất cả các ký tự đều giống nhau, trả về true
            return true;
        }
    }
    // Nếu anObject không phải là kiểu String hoặc độ dài không bằng nhau, trả về false
    return false;
}
```

“Thứ tư, [String và StringBuffer, StringBuilder](/programming/java/string/builder-buffer.html) đều thực thi giao diện CharSequence, vì vậy chúng là những người anh em gần gũi nhau. Bởi vì String là không thay đổi, vì vậy khi cần ghép chuỗi, bạn có thể xem xét hai người anh em tốt hơn là StringBuffer và StringBuilder, vì chúng là có thể thay đổi.”

### Tại sao String sau này được tối ưu hóa từ mảng char sang mảng byte

```java
private final char value[];
```

“Thứ năm, trước Java 9, String được triển khai bằng mảng char, sau đó chuyển sang triển khai bằng mảng byte và thêm trường coder để biểu diễn mã hóa. Lợi ích của việc này là trong các chương trình chủ yếu sử dụng ký tự Latin1, String có thể giảm một nửa lượng bộ nhớ chiếm dụng. Tuy nhiên, không có bữa trưa miễn phí trên thế giới này, cải tiến này mang lại sự tiết kiệm bộ nhớ đồng thời đưa vào chi phí kiểm tra mã hóa.”

> Latin1 (Latin-1) là một bộ ký tự đơn byte (tức là mỗi ký tự chỉ sử dụng một byte cho mã hóa), cũng được gọi là ISO-8859-1 (Tiêu chuẩn quốc tế 8859-1), bao gồm tất cả các ký tự được sử dụng trong ngôn ngữ Tây Âu như tiếng Anh, Pháp, Đức, Tây Ban Nha, Bồ Đào Nha, Ý và các ngôn ngữ khác. Trong mã hóa Latin1, mỗi ký tự sử dụng một byte 8-bit, có thể biểu diễn 256 ký tự khác nhau, bao gồm toàn bộ bộ ký tự ASCII từ 0x00 đến 0x7F và các ký tự đặc biệt của các ngôn ngữ Tây Âu như é, ü, ñ và những ký tự khác.

Dưới đây là mã nguồn của lớp String trong JDK 11, chú ý sự khác biệt so với JDK 8.

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    @Stable
    private final byte[] value;
    private final byte coder;
    private int hash;
}
```

Chuyển từ `char[]` sang `byte[]` chủ yếu là để tiết kiệm không gian bộ nhớ của chuỗi. Việc giảm bộ nhớ chiếm dụng mang lại lợi ích là giảm số lần thu gom rác (GC).

> GC, hay thu gom rác, được đề cập trong JVM.

Trước hết, trong JVM, mỗi ký tự loại `char` chiếm 2 byte và sử dụng mã hóa UTF-8, giá trị nằm trong khoảng '\u0000' (0) đến '\uffff' (65,535) (bao gồm cả hai giới hạn).

Tuy nhiên, sử dụng `char[]` để đại diện cho String dẫn đến việc ngay cả khi mỗi ký tự chỉ cần 1 byte để biểu diễn, vẫn phải sử dụng 2 byte.

Từ JDK 9 trở đi, để giảm tài nguyên, String được triển khai bằng `byte[]` và thêm trường `coder` để xác định mã hóa (Latin-1 hoặc UTF-16). Mã hóa Latin-1 tiết kiệm không gian hơn UTF-8, đặc biệt là đối với các chuỗi chứa chủ yếu các ký tự Latin.

```java
/**
 * The identifier of the encoding used to encode the bytes in
 * {@code value}. The supported values in this implementation are
 *
 * LATIN1
 * UTF16
 *
 * @implNote This field is trusted by the VM, and is a subject to
 * constant folding if String instance is constant. Overwriting this
 * field after construction will cause problems.
 */
private final byte coder;
```

Java sẽ tự động đặt mã hóa thành mã hóa tương ứng dựa trên nội dung của chuỗi, Latin-1 hoặc UTF16.

Nói cách khác, từ `char[]` thành `byte[]`, tiếng Việt là hai byte và tiếng Anh thuần túy là một byte. Trước đó, tiếng Việt là hai byte và tiếng Anh cũng là hai byte .

Trong UTF-8, các ký tự 0-127 được biểu thị bằng 1 byte, sử dụng cùng mã hóa như ASCII. Chỉ các ký tự có số từ 128 trở lên mới được biểu thị bằng 2, 3 hoặc 4 byte.

Nếu chỉ có một byte thì bit cao nhất là 0;
Nếu có nhiều byte thì byte đầu tiên bắt đầu từ bit cao nhất và nếu có nhiều bit liên tiếp có giá trị 1 thì sử dụng nhiều byte để mã hóa và các byte còn lại bắt đầu bằng 10.

Những biểu hiện cụ thể là:

- 0xxxxxxx: 1 byte;
- 110xxxxx 10xxxxxx: Dạng mã hóa 2 byte (hai số 1 đầu tiên);
- 1110xxxx 10xxxxxx 10xxxxxx: dạng mã hóa 3 byte (bắt đầu bằng ba số 1);
- 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx: dạng mã hóa 4 byte (bắt đầu bằng 4 số 1).

Nói cách khác, UTF-8 có độ dài thay đổi, điều này rất bất tiện đối với một lớp như String với các phương thức truy cập ngẫu nhiên. Cái gọi là truy cập ngẫu nhiên là phương thức charAt và subString. Nếu bạn chỉ định một số theo ý muốn, String phải có khả năng đưa ra kết quả. Nếu bộ nhớ mà mỗi ký tự trong chuỗi chiếm giữ có độ dài thay đổi thì khi thực hiện truy cập ngẫu nhiên, bạn cần đếm độ dài của từng ký tự ngay từ đầu để tìm được ký tự mình muốn.

Sau đó, bạn có thể hỏi, UTF-16 cũng có độ dài thay đổi phải không? Một ký tự cũng có thể chiếm 4 byte?

Thật vậy, UTF-16 sử dụng 2 hoặc 4 byte để lưu trữ ký tự.

- Đối với các ký tự Unicode trong khoảng từ 0 đến FFFF, UTF-16 sử dụng 2 byte để lưu trữ.
- Đối với các ký tự có số Unicode trong khoảng 10000 - 10FFFF, UTF-16 sử dụng 4 byte để lưu trữ, cụ thể: tất cả các bit của số ký tự được chia thành hai phần và các bit cao hơn được sử dụng với giá trị nằm trong khoảng 2-byte lưu trữ giữa D800-DBFF, các bit thấp hơn (các bit còn lại) được lưu trữ trong byte kép có giá trị trong khoảng DC00-DFFF.

Tuy nhiên, trong Java, mỗi ký tự (char) là 2 byte và các đối tượng String được lưu trữ dưới dạng cặp char. Tất cả các hoạt động trên String, chẳng hạn như `charAt`, `substring`, thậm chí cả `length`, đều được thực hiện dựa trên số lượng các char trong Java.

Do đó, UTF-16 trong thế giới Java có thể xem như là một loại mã hóa có độ dài cố định.


### Phương thức hashCode của lớp String

"Thứ sáu, mỗi chuỗi đều có một giá trị băm (hash value), khá có thể cao là không trùng lặp, do đó String rất thích hợp để sử dụng làm khóa trong HashMap (chúng ta sẽ thảo luận về điều này chi tiết sau)."

Hãy cùng nhìn vào phương thức hashCode của lớp String.

```java
private int hash; // Biến cache để lưu giá trị băm của chuỗi

public int hashCode() {
    int h = hash; // Lấy giá trị băm từ cache
    // Nếu giá trị băm chưa được tính toán (tức là bằng 0) và chuỗi không rỗng, thì tính toán giá trị băm
    if (h == 0 && value.length > 0) {
        char val[] = value; // Lấy mảng ký tự của chuỗi

        // Tính toán giá trị băm bằng cách lặp qua từng ký tự của chuỗi
        for (int i = 0; i < value.length; i++) {
            h = 31 * h + val[i]; // Sử dụng số 31 làm hệ số nhân
        }
        hash = h; // Lưu giá trị băm đã tính vào biến cache
    }
    return h; // Trả về giá trị băm
}
```

Phương thức hashCode đầu tiên kiểm tra xem giá trị băm đã được tính toán chưa. Nếu đã có, nó trả về giá trị băm từ cache. Ngược lại, nó tính toán giá trị băm bằng cách lặp qua từng ký tự của chuỗi và sử dụng một phép nhân và cộng hợp lý.

Cách tính toán này được gọi là "Phương pháp băm nhân 31". Sau khi tính toán xong, kết quả được lưu trữ trong biến thành viên `hash` để sử dụng cho các lần gọi hashCode sau này mà không cần tính toán lại. Đây là một dạng tối ưu hóa được gọi là "tính toán lười biếng".

Phương pháp "Phương pháp băm nhân 31" là một thuật toán băm chuỗi đơn giản nhưng hiệu quả thường được sử dụng để băm các chuỗi. Ý tưởng cơ bản là nhân từng ký tự của chuỗi với một số nguyên tố nguyên 31 và lũy thừa và cộng chúng lại để có được giá trị băm. Cụ thể, nếu chuỗi được biểu thị là s và có độ dài là n, công thức tính giá trị băm H(s) sẽ là:

```java
H(s) = (s[0] * 31^(n-1)) + (s[1] * 31^(n-2)) + ... + (s[n-1] * 31^0)
```

Ở đây, s[i] đại diện cho giá trị mã ASCII của ký tự thứ i trong chuỗi, và `^` biểu thị cho phép mũ.

Lợi ích của phương pháp "Phương pháp băm nhân 31" bao gồm tính đơn giản, tốc độ tính toán nhanh và phân phối giá trị băm khá đồng đều trong các bảng băm.

Bạn có thể mô phỏng phương thức hashCode của String bằng cách sử dụng phương pháp sau:

```java
public class HashCodeExample {
    public static void main(String[] args) {
        String text = "Hung Nguyen";
        int hashCode = computeHashCode(text);
        System.out.println("Giá trị băm của chuỗi \"" + text + "\" là: " + hashCode);

        System.out.println("Giá trị băm của String: " + text.hashCode());
    }

    public static int computeHashCode(String text) {
        int h = 0;
        for (int i = 0; i < text.length(); i++) {
            h = 31 * h + text.charAt(i);
        }
        return h;
    }
}
```

Hãy xem kết quả:

```
Giá trị băm của chuỗi "Hung Nguyen" là: 782735712
Giá trị băm của String: 782735712
```

Như bạn có thể thấy, kết quả là giống nhau. Bạn đã học được điều gì mới không?

### Phương thức substring của lớp String

Trong lớp String, có một phương thức phổ biến là substring, được sử dụng để cắt lát chuỗi, hãy cùng nhìn vào mã nguồn của nó.

```java
public String substring(int beginIndex) {
    // Kiểm tra xem chỉ số bắt đầu có nhỏ hơn 0 hay không, nếu có, ném ra ngoại lệ StringIndexOutOfBoundsException
    if (beginIndex < 0) {
        throw new StringIndexOutOfBoundsException(beginIndex);
    }
    // Tính toán độ dài của chuỗi con
    int subLen = value.length - beginIndex;
    // Kiểm tra xem độ dài chuỗi con có là số âm hay không, nếu có, ném ra ngoại lệ StringIndexOutOfBoundsException
    if (subLen < 0) {
        throw new StringIndexOutOfBoundsException(subLen);
    }
    // Nếu chỉ số bắt đầu là 0, tức là chuỗi con giống với chuỗi gốc, trả về chuỗi gốc; ngược lại, tạo và trả về một chuỗi mới
    return (beginIndex == 0) ? this : new String(value, beginIndex, subLen);
}
```

Phương thức substring đầu tiên kiểm tra tính hợp lệ của tham số đầu vào. Nếu tham số không hợp lệ, nó sẽ ném ra ngoại lệ StringIndexOutOfBoundsException (chúng ta sẽ thảo luận chi tiết về ngoại lệ này sau). Tiếp theo, phương thức tính toán độ dài của chuỗi con dựa trên chỉ số bắt đầu. Nếu độ dài của chuỗi con là số âm, nó cũng sẽ ném ra ngoại lệ StringIndexOutOfBoundsException.

Nếu beginIndex là 0, điều đó có nghĩa là chuỗi con là giống với chuỗi gốc, phương thức sẽ trả về chuỗi gốc. Ngược lại, nó sẽ tạo ra và trả về một đối tượng chuỗi mới từ mảng ký tự `value` (mảng ký tự của chuỗi gốc), bắt đầu từ chỉ số `beginIndex` và có độ dài `subLen`.

Dưới đây là một vài ví dụ về việc sử dụng phương thức substring:

① Lấy một đoạn con chuỗi từ vị trí đầu đến vị trí cuối:

```java
String str = "Hello, world!";
String subStr = str.substring(7, 12);  // Lấy từ ký tự thứ 7 (bao gồm) đến ký tự thứ 12 (không bao gồm)
System.out.println(subStr);  // Kết quả là "world"
```

② Lấy tiền tố hoặc hậu tố của chuỗi:

```java
String str = "Hello, world!";
String prefix = str.substring(0, 5);  // Lấy 5 ký tự đầu tiên, tức là "Hello"
String suffix = str.substring(7);     // Lấy từ ký tự thứ 7 đến hết chuỗi, tức là "world!"
```

③ Xử lý khoảng trắng và dấu phân cách trong chuỗi:

```java
String str = "   Hello,   world!  ";
String trimmed = str.trim();                  // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
String[] words = trimmed.split("\\s+");       // Tách chuỗi thành mảng các từ dựa trên khoảng trắng
String firstWord = words[0].substring(0, 1);  // Lấy ký tự đầu tiên của từ đầu tiên
System.out.println(firstWord);                // Kết quả là "H"
```

④ Xử lý số và ký tự đặc biệt trong chuỗi:

```java
String str = "1234-5678-9012-3456";
String[] parts = str.split("-");             // Tách chuỗi thành 4 phần dựa trên dấu gạch ngang
String last4Digits = parts[3].substring(1);  // Lấy 3 chữ số cuối của phần cuối cùng
System.out.println(last4Digits);             // Kết quả là "456"
```

Tóm lại, phương thức substring cho phép bạn linh hoạt cắt lát chuỗi dựa trên nhu cầu, làm cho việc xử lý chuỗi trở nên tiện lợi hơn nhiều.

### Phương thức indexOf của lớp String

Phương thức `indexOf` trong lớp String được sử dụng để tìm kiếm vị trí đầu tiên của một chuỗi con trong chuỗi gốc và trả về chỉ số của vị trí đó. Dưới đây là mã nguồn của phương thức này:

```java
/*
 * Tìm kiếm mảng ký tự target trong mảng ký tự source,
 * bắt đầu từ vị trí fromIndex của mảng source.
 * sourceOffset và sourceCount xác định phạm vi tìm kiếm trong mảng source,
 * targetOffset và targetCount xác định phạm vi tìm kiếm trong mảng target.
 * Nếu tìm thấy chuỗi target trong mảng source, trả về chỉ số bắt đầu của nó trong mảng source (bắt đầu từ 0),
 * nếu không tìm thấy, trả về -1.
 */
static int indexOf(char[] source, int sourceOffset, int sourceCount,
        char[] target, int targetOffset, int targetCount,
        int fromIndex) {
    // Nếu vị trí bắt đầu tìm kiếm đã vượt quá phạm vi của mảng source, trả về -1 (nếu mảng target rỗng, trả về sourceCount)
    if (fromIndex >= sourceCount) {
        return (targetCount == 0 ? sourceCount : -1);
    }
    // Nếu vị trí bắt đầu tìm kiếm nhỏ hơn 0, thì bắt đầu từ vị trí 0
    if (fromIndex < 0) {
        fromIndex = 0;
    }
    // Nếu mảng target rỗng, trả về vị trí bắt đầu tìm kiếm
    if (targetCount == 0) {
        return fromIndex;
    }

    // Lấy ký tự đầu tiên của mảng target để tìm kiếm
    char first = target[targetOffset];
    // Tính chỉ số tối đa trong mảng source để tìm kiếm
    int max = sourceOffset + (sourceCount - targetCount);

    // Duyệt từng vị trí trong mảng source để tìm chuỗi target
    for (int i = sourceOffset + fromIndex; i <= max; i++) {
        // Tìm ký tự đầu tiên của mảng target trong mảng source
        if (source[i] != first) {
            while (++i <= max && source[i] != first);
        }

        // Nếu đã tìm thấy ký tự đầu tiên của mảng target trong mảng source
        if (i <= max) {
            int j = i + 1;
            int end = j + targetCount - 1;
            // Kiểm tra xem các ký tự còn lại của mảng target có khớp với mảng source không
            for (int k = targetOffset + 1; j < end && source[j] == target[k]; j++, k++);

            // Nếu tất cả các ký tự của mảng target khớp với mảng source, trả về chỉ số bắt đầu của chuỗi target trong mảng source
            if (j == end) {
                return i - sourceOffset;
            }
        }
    }
    // Không tìm thấy chuỗi target trong mảng source, trả về -1
    return -1;
}
```

Đây là các ví dụ và giải thích về phương thức `indexOf`:

### Ví dụ 1: Tìm vị trí của chuỗi con
```java
String str = "Hello, world!";
int index = str.indexOf("world");  // Tìm vị trí xuất hiện đầu tiên của chuỗi "world" trong str
System.out.println(index);        // In ra 7
```
Trong ví dụ này, chúng ta tìm vị trí đầu tiên mà chuỗi `"world"` xuất hiện trong `str`, kết quả là `7`, vì `"world"` bắt đầu từ vị trí `7` trong chuỗi `"Hello, world!"`.

### Ví dụ 2: Tìm vị trí của một ký tự trong chuỗi
```java
String str = "Hello, world!";
int index = str.indexOf(",");     // Tìm vị trí xuất hiện đầu tiên của dấu phẩy trong str
System.out.println(index);        // In ra 5
```
Ở đây chúng ta tìm vị trí đầu tiên mà dấu phẩy `,` xuất hiện trong chuỗi `"Hello, world!"`, kết quả là `5`, vì dấu phẩy nằm ở vị trí thứ `5` trong chuỗi.

### Ví dụ 3: Tìm vị trí của chuỗi con từ một vị trí nhất định
```java
String str = "Hello, world!";
int index = str.indexOf("l", 3);  // Tìm vị trí xuất hiện đầu tiên của chuỗi "l" từ vị trí 3 trong str
System.out.println(index);        // In ra 3
```
Ở ví dụ này, chúng ta tìm vị trí đầu tiên mà chuỗi `"l"` xuất hiện từ vị trí `3` trong chuỗi `"Hello, world!"`, kết quả là `3`, vì chuỗi `"l"` đầu tiên xuất hiện ở vị trí `3` trong chuỗi.

### Ví dụ 4: Tìm vị trí của nhiều chuỗi con
```java
String str = "Hello, world!";
int index1 = str.indexOf("o");    // Tìm vị trí xuất hiện đầu tiên của chuỗi "o" trong str
int index2 = str.indexOf("o", 5); // Tìm vị trí xuất hiện đầu tiên của chuỗi "o" từ vị trí 5 trong str
System.out.println(index1);       // In ra 4
System.out.println(index2);       // In ra 8
```
Trong ví dụ này, chúng ta tìm vị trí đầu tiên mà chuỗi `"o"` xuất hiện trong chuỗi `"Hello, world!"`, kết quả là `4`. Sau đó, chúng ta tìm vị trí đầu tiên mà chuỗi `"o"` xuất hiện từ vị trí `5` trong chuỗi `"Hello, world!"`, kết quả là `8`.

Dưới đây là phiên bản dịch từ tiếng Trung sang tiếng Việt của đoạn văn bạn đã cung cấp:

---

### Các phương thức khác của lớp String

1. Ví dụ như `length()` được sử dụng để trả về độ dài của chuỗi.

2. Ví dụ như `isEmpty()` được sử dụng để kiểm tra xem chuỗi có rỗng không.

3. Ví dụ như `charAt()` được sử dụng để trả về ký tự tại chỉ số được chỉ định.

4. Ví dụ như `valueOf()` được sử dụng để chuyển đổi các kiểu dữ liệu khác thành chuỗi.

```java
String str = String.valueOf(123);  // Chuyển đổi số nguyên 123 thành chuỗi
```

Phía sau phương thức `valueOf`, thực tế là gọi phương thức `toString` của lớp bao bọc. Ví dụ, chuyển đổi số nguyên thành chuỗi gọi phương thức `toString` của lớp `Integer`.

```java
public static String valueOf(int i) {
    return Integer.toString(i);
}
```

Và phương thức `toString` của lớp `Integer` sau đó gọi phương thức tĩnh `toString`.

```java
public static String toString(int i) {
    // Giá trị nhỏ nhất trả về "-2147483648"
    if (i == Integer.MIN_VALUE)
        return "-2147483648";
    // Độ dài của số nguyên, độ dài của số âm giảm đi 1
    int size = (i < 0) ? stringSize(-i) + 1 : stringSize(i);
    // Sao chép số nguyên vào mảng ký tự
    char[] buf = new char[size];
    // Quá trình sao chép cụ thể
    getChars(i, size, buf);
    // Trả về chuỗi bằng cách tạo mới từ mảng ký tự
    return new String(buf, true);
}
```

Về phương thức `getChars`, đây là quá trình sao chép số nguyên vào mảng ký tự, chi tiết này sẽ không mở rộng ở đây.

5. Ví dụ như `getBytes()` được sử dụng để trả về mảng byte của chuỗi, có thể chỉ định mã hóa, ví dụ như:

```java
String text = "Hùng";
System.out.println(Arrays.toString(text.getBytes(StandardCharsets.UTF_8)));
```

6. Ví dụ như `trim()` được sử dụng để loại bỏ các ký tự khoảng trắng ở hai đầu chuỗi, xem mã nguồn:

```java
public String trim() {
    int len = value.length;
    int st = 0;
    char[] val = value;    /* Tránh opcode getfield */

    while ((st < len) && (val[st] <= ' ')) {
        st++;
    }
    while ((st < len) && (val[len - 1] <= ' ')) {
        len--;
    }
    return ((st > 0) || (len < value.length)) ? substring(st, len) : this;
}
```

Ví dụ: `"  java   ".trim()` sẽ trả về "java".

Ngoài ra, còn có các phương thức như [split](/programming/java/string/split), [equals](/programming/java/string/equals), [join](/programming/java/string/join) và nhiều phương thức khác, chúng ta sẽ cụ thể hơn trong các bài viết sau.
