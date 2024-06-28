---
title: Why String is Immutable?
tags: ['java']
categories: ['java']
order: 2
---

Đoạn văn bạn cung cấp đã được dịch sang tiếng Việt như sau:

---

# Tại sao String là bất biến?

Chuỗi (String) có lẽ là loại tham chiếu phổ biến nhất được sử dụng trong Java, do đó những người thiết kế lớp String có thể nói là đã cố gắng rất nhiều.

Ví dụ, tính bất biến của chuỗi.

- Lớp String được khai báo bằng từ khóa final, vì vậy nó không có lớp con, điều này có nghĩa là không có lớp con nào có thể ghi đè các phương thức của nó, thay đổi hành vi của nó.
- Dữ liệu của lớp String được lưu trữ trong mảng `char[]`, và mảng này cũng được khai báo bằng từ khóa final, điều này có nghĩa là đối tượng String không thể thay đổi, chỉ cần khởi tạo một lần, giá trị sẽ được xác định.

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];
}
```

"Anh ơi, tại sao lại thiết kế như vậy?" Em gái có chút không hiểu.

"Anh sẽ giải thích đơn giản trước, em gái, cố gắng hiểu điều đó là tốt nhất, không hiểu sau này anh sẽ giải thích chi tiết hơn."

Thứ nhất, điều này có thể đảm bảo tính an toàn của đối tượng String, tránh bị thay đổi, đặc biệt là những thông tin nhạy cảm như mật khẩu thường được lưu trữ dưới dạng chuỗi.

Dưới đây là một ví dụ đơn giản trong Java, minh họa tính không thay đổi của chuỗi làm thế nào giúp bảo vệ tính bảo mật của đối tượng String. Trong ví dụ này, chúng ta tạo ra một lớp User đơn giản, sử dụng trường kiểu String để lưu trữ tên người dùng và mật khẩu. Đồng thời, chúng ta sử dụng một phương thức tĩnh `getUserCredentials` để lấy thông tin đăng nhập từ bên ngoài.

public class StringSecurityExample {
    public static void main(String[] args) {
        String username = "vanhung4499";
        String password = "123456";
        User user = new User(username, password);

        // Lấy thông tin đăng nhập từ user
        String[] credentials = getUserCredentials(user);

        // Cố gắng thay đổi chuỗi username và password từ mảng credentials
        credentials[0] = "vanhung4499";
        credentials[1] = "612311";

        // In ra username và password ban đầu từ đối tượng User
        System.out.println("Original username: " + user.getUsername());
        System.out.println("Original password: " + user.getPassword());
    }

    public static String[] getUserCredentials(User user) {
        String[] credentials = new String[2];
        credentials[0] = user.getUsername();
        credentials[1] = user.getPassword();
        return credentials;
    }
}

Trong ví dụ này, mặc dù chúng ta đã cố gắng sửa đổi mảng chuỗi được trả về từ `getUserCredentials` (tức là tên người dùng và mật khẩu), nhưng tên người dùng và mật khẩu trong đối tượng User ban đầu vẫn giữ nguyên. Điều này chứng tỏ tính không thay đổi của chuỗi giúp bảo vệ an toàn cho đối tượng String.

Thứ hai, nó đảm bảo rằng giá trị băm (hash value) không thay đổi thường xuyên. Vì phải thường xuyên sử dụng như là khóa trong bảng băm, nếu giá trị này thay đổi thường xuyên thì hiệu suất của bảng băm sẽ giảm đi đáng kể.

Trong lớp String, giá trị băm được lưu vào bộ nhớ cache từ lần tính toán đầu tiên. Điều này giúp cải thiện hiệu suất của các cấu trúc dữ liệu như bảng băm. Dưới đây là một ví dụ đơn giản, giải thích cơ chế lưu trữ giá trị băm của chuỗi:

```java
String text1 = "vanhung4499";
String text2 = "vanhung4499";

// Tính giá trị băm của chuỗi text1 lần đầu, lúc này giá trị sẽ được tính toán và lưu vào bộ nhớ cache
int hashCode1 = text1.hashCode();
System.out.println("Giá trị băm lần đầu của text1: " + hashCode1);

// Tính lại giá trị băm của text1, lúc này sẽ trả về giá trị băm đã được lưu trong cache
int hashCode1Cached = text1.hashCode();
System.out.println("Tính toán lại: " + hashCode1Cached);

// Tính giá trị băm của text2, vì text1 và text2 đều trỏ vào cùng một đối tượng chuỗi trong bảng hằng chuỗi,
// vì thế giá trị băm sẽ được lấy từ cache
int hashCode2 = text2.hashCode();
System.out.println("text2 sử dụng trực tiếp cache: " + hashCode2);
```

Trong ví dụ này, chúng ta tạo hai chuỗi text1 và text2 có cùng nội dung. Khi tính giá trị băm của text1 lần đầu tiên, nó sẽ tính toán và lưu vào bộ nhớ cache. Khi tính toán lại giá trị băm của text1 hoặc của text2 có cùng nội dung, giá trị băm sẽ được trả về từ bộ nhớ cache mà không cần tính toán lại.

Do tính không thay đổi của chuỗi, giá trị băm của chuỗi được tính một lần khi chuỗi được tạo ra và không thay đổi sau đó. Điều này giúp cải thiện hiệu suất của các cấu trúc dữ liệu như bảng băm. Nếu chuỗi là có thể thay đổi, mỗi lần thay đổi sẽ cần phải tính toán lại giá trị băm, điều này sẽ làm giảm hiệu suất.

Thứ ba, tính không thay đổi của chuỗi cũng cho phép thực hiện bảng hằng chuỗi (string constant pool). Java sẽ lưu trữ các chuỗi có cùng nội dung trong bảng hằng chuỗi. Điều này cho phép các biến chuỗi có cùng nội dung chỉ định đến cùng một đối tượng chuỗi, tiết kiệm không gian bộ nhớ.

"Vì tính bất biến của chuỗi, một số phương thức trong lớp String cuối cùng cũng trả về một đối tượng chuỗi mới."

"Ví dụ như phương thức `substring()`."

```java
public String substring(int beginIndex) {
    if (beginIndex < 0) {
        throw new StringIndexOutOfBoundsException(beginIndex);
    }
    int subLen = value.length - beginIndex;
    if (subLen < 0) {
        throw new StringIndexOutOfBoundsException(subLen);
    }
    return (beginIndex == 0) ? this : new String(value, beginIndex, subLen);
}
```

Phương thức `substring()` được sử dụng để cắt chuỗi và cuối cùng trả về một đối tượng chuỗi mới được tạo ra.

"Và phương thức `concat()`."

```java
public String concat(String str) {
    int olen = str.length();
    if (olen == 0) {
        return this;
    }
    if (coder() == str.coder()) {
        byte[] val = this.value;
        byte[] oval = str.value;
        int len = val.length + oval.length;
        byte[] buf = Arrays.copyOf(val, len);
        System.arraycopy(oval, 0, buf, val.length, oval.length);
        return new String(buf, coder);
    }
    int len = length();
    byte[] buf = StringUTF16.newBytesFor(len + olen);
    getBytes(buf, 0, UTF16);
    str.getBytes(buf, len, UTF16);
    return new String(buf, UTF16);
}
```

Phương thức `concat()` được sử dụng để nối chuỗi và dù mã hóa có khớp hay không, nó cũng trả về một đối tượng chuỗi mới.

"Phương thức `replace()` cũng hoạt động tương tự, ba em có thể tự xem mã nguồn một lát, nó cũng trả về một đối tượng chuỗi mới."

"Điều này có nghĩa là, cho dù là cắt, nối hoặc thay thế, không phải là thao tác trên đối tượng chuỗi ban đầu, mà là tạo ra một đối tượng chuỗi mới. Nghĩa là, sau khi các thao tác này được thực hiện, **đối tượng chuỗi ban đầu không thay đổi**."

"Một khi đối tượng String đã được tạo ra, nó sẽ không thay đổi, bất kỳ sửa đổi nào trên đối tượng String cũng không ảnh hưởng đến đối tượng chuỗi ban đầu, mà sẽ tạo ra một đối tượng chuỗi mới."
