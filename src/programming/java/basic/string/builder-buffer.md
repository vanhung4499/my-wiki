---
title: StringBuiler and StringBuffer
tags: ['java']
categories: ['java']
order: 4
---


# StringBuilder và StringBuffer

### Sự khác biệt giữa StringBuffer và StringBuilder

Bởi vì chuỗi là không thay đổi, vì vậy khi làm việc với ghép chuỗi (đặc biệt là sử dụng toán tử `+`), bạn cần phải xem xét vấn đề về hiệu suất, bạn không thể sản xuất quá nhiều đối tượng String mà không cần thiết gây áp lực lên bộ nhớ quý giá.

Do đó, Java đã thiết kế lớp StringBuffer đặc biệt để giải quyết vấn đề này.

```java
public final class StringBuffer extends AbstractStringBuilder implements Serializable, CharSequence {

    public StringBuffer() {
        super(16);
    }

    public synchronized StringBuffer append(String str) {
        super.append(str);
        return this;
    }

    public synchronized String toString() {
        return new String(value, 0, count);
    }

    // Các phương thức khác
}
```

Tuy nhiên, vì các phương thức của StringBuffer đã được đồng bộ hóa bằng từ khóa `synchronized`, chủ yếu là để giải quyết vấn đề an toàn đa luồng, nên nếu không phải là môi trường đa luồng, hiệu suất thực thi sẽ thấp hơn vì đã có sự khóa không cần thiết.

Do đó, Java đã sinh ra "em trai" cho StringBuffer, gọi là StringBuilder, và nói rằng, "Con trai, đừng lo về an toàn đa luồng nữa, chỉ sử dụng trong môi trường đơn luồng thôi, điều này sẽ tăng hiệu suất rất nhiều. Nếu muốn chỉnh sửa chuỗi trong môi trường đa luồng, sau này có thể sử dụng `ThreadLocal` để tránh xung đột đa luồng."

```java
public final class StringBuilder extends AbstractStringBuilder
    implements java.io.Serializable, CharSequence
{
    // ...

    public StringBuilder append(String str) {
        super.append(str);
        return this;
    }

    public String toString() {
        // Tạo một bản sao, không chia sẻ mảng
        return new String(value, 0, count);
    }

    // ...
}
```

Ngoài tên lớp khác nhau, các phương thức của StringBuilder không có từ khóa synchronized và gần như giống hệt với StringBuffer.

Trong thực tế, sử dụng StringBuilder thường xuyên hơn rất nhiều so với StringBuffer, thậm chí có thể nói rằng StringBuilder hoàn toàn thay thế StringBuffer.


### Sử dụng StringBuilder

Trước đó chúng ta đã từng nói đến rằng, Java là một ngôn ngữ lập trình thông dịch, vì vậy khi trình biên dịch gặp phép toán `+`, nó sẽ biên dịch dòng mã `new String("one") + new String("two")` thành đoạn mã sau:

```java
new StringBuilder().append("one").append("two").toString();
```

Quá trình này là một quá trình mà chúng ta không nhìn thấy, nhưng đây chính là sự "thông minh" của Java, nó có thể tối ưu hóa rất nhiều trong quá trình biên dịch, từ đó cả tăng tốc độ phát triển ứng dụng (vì dấu `+` viết dễ hơn nhiều so với việc tạo đối tượng StringBuilder), và không ảnh hưởng đến hiệu suất thực thi của JVM.

Tất nhiên, nếu chúng ta sử dụng `javap` để phân tích ngược bytecode của `new String("one") + new String("two")`, chúng ta cũng có thể nhìn thấy sự xuất hiện của StringBuilder.

> javap và bytecode sẽ được giải thích chi tiết khi chúng ta nói đến JVM, hãy click vào link để tìm hiểu thêm.

```
0: new           #2                  // class java/lang/StringBuilder
3: dup
4: invokespecial #3                  // Method java/lang/StringBuilder."<init>":()V
7: new           #4                  // class java/lang/String
10: dup
11: ldc           #5                  // String one
13: invokespecial #6                  // Method java/lang/String."<init>":(Ljava/lang/String;)V
16: invokevirtual #7                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
19: new           #4                  // class java/lang/String
22: dup
23: ldc           #8                  // String two
25: invokespecial #6                  // Method java/lang/String."<init>":(Ljava/lang/String;)V
28: invokevirtual #7                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
31: invokevirtual #9                  // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
34: areturn
```

Có thể thấy rằng trình biên dịch Java đã chuyển đổi phép nối chuỗi (`+`) thành các cuộc gọi phương thức append của đối tượng StringBuilder, và sau đó gọi phương thức toString của StringBuilder để trả về chuỗi đã được nối.


### Triển khai nội bộ của StringBuilder

Hãy xem xét phương thức toString của StringBuilder:

```java
public String toString() {
    return new String(value, 0, count);
}
```

Trong đó, value là một mảng kiểu char:

```java
/**
 * The value is used for character storage.
 */
char[] value;
```

Khi đối tượng StringBuilder được tạo, một không gian bộ nhớ được cấp phát cho value với dung lượng ban đầu là 16 ký tự.

```java
/**
 * Constructs a string builder with no characters in it and an
 * initial capacity of 16 characters.
 */
public StringBuilder() {
    super(16);
}
```

Khi nối chuỗi, độ dài của mảng value sẽ tăng dần. Do đó, trong triển khai của đối tượng StringBuilder, độ dài của mảng value có thể được mở rộng động, tương tự như ArrayList.

Tiếp tục với phương thức toString của StringBuilder:

```java
public String toString() {
    return new String(value, 0, count);
}
```

value dùng để lưu trữ chuỗi ký tự trong đối tượng StringBuilder. Biến count là một biến kiểu int, biểu thị độ dài của chuỗi ký tự. Phương thức toString() sẽ gọi `new String(value, 0, count)` để tạo một đối tượng chuỗi mới từ count ký tự đầu tiên trong mảng value, và trả về chuỗi đó.

Tiếp tục với phương thức append:

```java
public StringBuilder append(String str) {
    super.append(str);
    return this;
}
```

Thực tế, phương thức `append(String str)` đã được gọi trong lớp AbstractStringBuilder. Trong AbstractStringBuilder, phương thức `append(String str)` kiểm tra xem số ký tự hiện tại trong chuỗi có đủ không. Nếu không đủ, nó sẽ mở rộng bộ nhớ và nối chuỗi đã cho vào cuối chuỗi hiện tại.

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

Phương thức `append(String str)` nối chuỗi đã cho vào chuỗi hiện tại. Nếu chuỗi đã cho là null, nó sẽ nối chuỗi "null"; ngược lại, nó sẽ kiểm tra độ dài của chuỗi đã cho và sau đó dựa vào số lượng ký tự hiện tại trong chuỗi và độ dài của chuỗi đã cho để quyết định xem có cần mở rộng bộ nhớ hay không.

Nếu cần mở rộng bộ nhớ, phương thức sẽ gọi phương thức `ensureCapacityInternal(int minimumCapacity)`. Sau khi mở rộng, nó sẽ sao chép các ký tự của chuỗi đã cho vào cuối chuỗi.

Hãy xem phương thức ensureCapacityInternal:

```java
private void ensureCapacityInternal(int minimumCapacity) {
    // Nếu không đủ, mở rộng bộ nhớ
    if (minimumCapacity - value.length > 0)
        expandCapacity(minimumCapacity);
}

void expandCapacity(int minimumCapacity) {
    // Chiến lược mở rộng: Mới = Cũ * 2 + 2
    int newCapacity = value.length * 2 + 2;
    // Nếu mới < minimumCapacity, mới = minimumCapacity
    if (newCapacity - minimumCapacity < 0)
        newCapacity = minimumCapacity;
    // Nếu mới < 0, mới = Integer.MAX_VALUE
    if (newCapacity < 0) {
        if (minimumCapacity < 0) // overflow
            throw new OutOfMemoryError();
        newCapacity = Integer.MAX_VALUE;
    }
    // Mở rộng bộ nhớ của chuỗi đến kích thước mới
    value = Arrays.copyOf(value, newCapacity);
}
```

Phương thức `ensureCapacityInternal(int minimumCapacity)` đảm bảo rằng dung lượng của chuỗi hiện tại ít nhất là minimumCapacity. Nếu dung lượng hiện tại nhỏ hơn minimumCapacity, nó sẽ cấp phát một mảng nội bộ mới cho chuỗi. Cách tính dung lượng mới như sau:

- Nếu minimumCapacity lớn hơn dung lượng hiện tại, dung lượng mới là gấp đôi dung lượng cũ cộng thêm 2. Lý do thêm 2 là với các chuỗi rất nhỏ (ví dụ như chuỗi rỗng hoặc chỉ có một ký tự), việc chỉ nhân đôi có thể không đủ để chứa nhiều ký tự hơn. 2 đảm bảo rằng ngay cả với dung lượng ban đầu rất nhỏ, việc mở rộng cũng sẽ cho phép thêm ít nhất một vài ký tự mà không cần phải mở rộng thêm lần nữa ngay lập tức.
- Nếu minimumCapacity nhỏ hơn hoặc bằng dung lượng hiện tại, không cần phải mở rộng, chỉ cần trả về đối tượng hiện tại.

Trước khi mở rộng, phương thức `ensureCapacityInternal(int minimumCapacity)` sẽ kiểm tra xem dung lượng hiện tại của chuỗi có đủ không. Nếu không đủ, nó sẽ gọi phương thức `expandCapacity(int minimumCapacity)` để mở rộng. Phương thức `expandCapacity(int minimumCapacity)` trước tiên tính toán dung lượng mới, sau đó sử dụng phương thức `Arrays.copyOf(char[] original, int newLength)` để mở rộng mảng ký tự ban đầu lên dung lượng mới.

### Phương thức reverse của StringBuilder

StringBuilder còn cung cấp một phương thức `reverse` để đảo ngược các ký tự trong chuỗi hiện tại.

```java
public StringBuilder reverse() {
    super.reverse();
    return this;
}
```

Phương thức này gọi đến phương thức `reverse()` của lớp cha AbstractStringBuilder. Dưới đây là phiên bản đã loại bỏ các mã không quan trọng của phương thức này:

```java
public AbstractStringBuilder reverse() {
    int n = count - 1; // Chỉ số của ký tự cuối cùng trong chuỗi
    // Duyệt qua nửa đầu của chuỗi
    for (int j = (n-1) >> 1; j >= 0; j--) {
        int k = n - j; // Tính chỉ số đối xứng với j
        char cj = value[j]; // Lấy ký tự tại vị trí j
        char ck = value[k]; // Lấy ký tự tại vị trí đối xứng k
        value[j] = ck; // Hoán đổi ký tự
        value[k] = cj; // Hoán đổi ký tự
    }
    return this; // Trả về đối tượng StringBuilder sau khi đảo ngược
}
```

1. **Khởi tạo**: `n` là chỉ số của ký tự cuối cùng trong chuỗi.
2. **Đảo ngược chuỗi**:
   - Phương thức sử dụng một vòng lặp `for` để duyệt qua nửa đầu và nửa cuối của chuỗi. Đây là một cách rất hiệu quả vì nó tiết kiệm một nửa thời gian so với việc duyệt từ đầu đến cuối chuỗi. `(n-1) >> 1` là cách viết bằng phép toán bit của `(n-1) / 2`, tức là chỉ số của ký tự cuối cùng trong nửa đầu của chuỗi.
   - Trong mỗi lần lặp, tính toán chỉ số đối xứng với chỉ số hiện tại `j`, và hoán đổi các ký tự tại hai vị trí này.

Bài toán số 7 trên LeetCode, "[007. Integer Reverse](https://leetcode.com/problems/reverse-integer/)", yêu cầu chúng ta đảo ngược một số nguyên. Thực tế, chúng ta có thể sử dụng phương thức `reverse` của StringBuilder để giải quyết bài toán này.
