---
title: Arrays
tags:
  - java
categories:
  - java
order: 2
---
# Arrays

Lớp công cụ chuyên dùng cho mảng mà chúng ta đang nói đến là lớp `java.util.Arrays`. Hầu hết các thao tác phổ biến trên mảng đều được cung cấp dưới dạng các phương thức tĩnh của lớp này. Vì bản thân mảng để hoàn thành các thao tác này vẫn khá phức tạp, nên có lớp này để bọc lại thì tiện lợi hơn nhiều.

```java
package java.util;
/**
 * @auther Josh Bloch
 * @auther Neal Gafter
 * @auther John Rose
 * @since  1.2
 */
public class Arrays {}
```

Cụ thể, các thao tác trên mảng có thể chia thành 9 loại sau.

- Tạo mảng
- So sánh mảng
- Sắp xếp mảng
- Tìm kiếm trong mảng
- Chuyển mảng thành stream
- In mảng
- Chuyển mảng thành List
- setAll (chưa nghĩ ra tên tiếng Việt)
- parallelPrefix (chưa nghĩ ra tên tiếng Việt)

### 01. Tạo Mảng

Sử dụng lớp `Arrays` để tạo mảng có thể thông qua ba phương thức sau:

- `copyOf`: Sao chép mảng được chỉ định, cắt bớt hoặc điền bằng `null`.
- `copyOfRange`: Sao chép mảng trong phạm vi được chỉ định vào một mảng mới.
- `fill`: Điền vào mảng.

#### 1) `copyOf`

Hãy xem ví dụ sau:

```java
String[] intro = new String[] { "a", "b", "c", "d" };
String[] revised = Arrays.copyOf(intro, 3);
String[] expanded = Arrays.copyOf(intro, 5);
System.out.println(Arrays.toString(revised));
System.out.println(Arrays.toString(expanded));
```

`revised` và `expanded` là các mảng mới được sao chép, có độ dài lần lượt là 3 và 5, trong khi mảng gốc có độ dài là 4. Xem kết quả đầu ra:

```
[a, b, c]
[a, b, c, d, null]
```

Thấy không? `revised` đã cắt bỏ phần tử cuối cùng vì độ dài là 3, còn `expanded` được điền thêm một giá trị `null` vì độ dài là 5.

Phương thức `grow()` trong mã nguồn của `ArrayList` (cấu trúc dữ liệu nội bộ sử dụng mảng) cũng gọi phương thức `copyOf()`. Khi kích thước ban đầu của `ArrayList` không đáp ứng được sự tăng trưởng của phần tử, nó sẽ mở rộng:

```java
private Object[] grow(int minCapacity) {
    return elementData = Arrays.copyOf(elementData, newCapacity(minCapacity));
}
```

#### 2) `copyOfRange`

Hãy xem ví dụ sau:

```java
String[] intro = new String[] { "a", "b", "c", "d" };
String[] abridgement = Arrays.copyOfRange(intro, 0, 3);
System.out.println(Arrays.toString(abridgement));
```

Phương thức `copyOfRange()` cần ba tham số, tham số đầu tiên là mảng được chỉ định, tham số thứ hai là vị trí bắt đầu (bao gồm), tham số thứ ba là vị trí kết thúc (không bao gồm). Xem kết quả đầu ra:

```java
[a, b, c]
```

Vị trí 0 là "a", vị trí 3 là "d", tức là đã cắt từ vị trí 0 (bao gồm) đến vị trí 3 (không bao gồm) của các phần tử mảng. Vậy nếu chỉ số vượt quá độ dài của mảng thì sao?

```java
String[] abridgementExpanded = Arrays.copyOfRange(intro, 0, 6);
System.out.println(Arrays.toString(abridgementExpanded));
```

Vị trí kết thúc là 6, vượt quá độ dài của mảng gốc là 4. Xem kết quả đầu ra:

```
[a, b, c, d, null, null]
```

Vẫn sử dụng `null` để điền vào.

Tại sao phải làm như vậy?

Tôi nghĩ là nhà thiết kế của `Arrays` đã tính đến vấn đề vượt quá chỉ số của mảng, nếu không mỗi lần gọi lớp `Arrays` đều phải kiểm tra độ dài rất nhiều lần, rất phiền phức.

#### 3) `fill`

Hãy xem ví dụ sau:

```java
String[] stutter = new String[4];
Arrays.fill(stutter, "abcd");
System.out.println(Arrays.toString(stutter));
```

Sử dụng từ khóa `new` để tạo một mảng có độ dài là 4, sau đó sử dụng phương thức `fill()` để điền tất cả 4 vị trí bằng "abcd". Xem kết quả đầu ra:

```
[abcd, abcd, abcd, abcd]
```

Nếu muốn một mảng có các phần tử giống hệt nhau, phương thức `fill()` sẽ rất hữu ích.

### 02. So Sánh Mảng

Phương thức `equals()` của lớp `Arrays` dùng để xác định xem hai mảng có bằng nhau hay không. Hãy xem ví dụ dưới đây:

```java
String[] intro = new String[] { "a", "b", "c", "d" };
boolean result = Arrays.equals(new String[] { "a", "b", "c", "d" }, intro);
System.out.println(result);
boolean result1 = Arrays.equals(new String[] { "a", "b", "c", "e" }, intro);
System.out.println(result1);
```

Kết quả đầu ra như sau:

```
true
false
```

Mảng được chỉ định là "abcd", mảng so sánh là "abcd" và "abce", do đó `result` là `true`, còn `result1` là `false`.

Hãy xem qua mã nguồn của phương thức `equals()`:

```java
public static boolean equals(Object[] a, Object[] a2) {
    if (a == a2)
        return true;
    if (a == null || a2 == null)
        return false;

    int length = a.length;
    if (a2.length != length)
        return false;

    for (int i = 0; i < length; i++) {
        if (!Objects.equals(a[i], a2[i]))
            return false;
    }

    return true;
}
```

Vì mảng là một đối tượng, nên trước tiên sử dụng toán tử `==` để kiểm tra. Nếu không bằng nhau, tiếp tục kiểm tra xem có null hay không, nếu một trong hai mảng là null, trả về false. Sau đó kiểm tra độ dài, nếu không bằng nhau, trả về false. Nếu bằng nhau, lần lượt gọi `Objects.equals()` để so sánh các phần tử ở vị trí tương ứng.

Đoạn mã này rất nghiêm ngặt, đúng không? Đây chính là ý nghĩa của việc học mã nguồn, vừa có thể ngưỡng mộ vừa có thể học hỏi tư duy mã hóa rõ ràng của tác giả mã nguồn.

Ngoài phương thức `equals()`, còn có một mẹo khác để xác định hai mảng có bằng nhau hay không, mặc dù có thể không chính xác hoàn toàn. Đó là phương thức `Arrays.hashCode()`. Hãy xem qua mã nguồn của phương thức này:

```java
public static int hashCode(Object a[]) {
    if (a == null)
        return 0;

    int result = 1;

    for (Object element : a)
        result = 31 * result + (element == null ? 0 : element.hashCode());

    return result;
}
``` 

Thuật toán băm vốn dĩ rất nghiêm ngặt, vì vậy nếu hai mảng có giá trị băm bằng nhau, thì gần như có thể xác định hai mảng đó bằng nhau.

```java
String[] intro = new String[] { "a", "b", "c", "d" };

System.out.println(Arrays.hashCode(intro));
System.out.println(Arrays.hashCode(new String[] { "a", "b", "c", "d" }));
```

Kết quả đầu ra như sau:

```
3910595
3910595
```

Hai mảng có giá trị băm bằng nhau, vì các phần tử giống nhau. Tuy nhiên, cách này không hoàn toàn chính xác, nên ưu tiên sử dụng phương thức `Objects.equals()`. Khi chúng ta muốn nhanh chóng xác định hai mảng có bằng nhau hay không, có thể so sánh hashCode để xác nhận - một cách làm có lợi và rủi ro cao!

### 03. Sắp Xếp Mảng

Phương thức `sort()` của lớp `Arrays` dùng để sắp xếp mảng. Hãy xem ví dụ dưới đây:

```java
String[] intro1 = new String[] { "a", "b", "c", "d" };
String[] sorted = Arrays.copyOf(intro1, 4);
Arrays.sort(sorted);
System.out.println(Arrays.toString(sorted));
```

Do việc sắp xếp sẽ thay đổi mảng gốc, nên chúng ta sử dụng phương thức `copyOf()` để sao chép một bản mới. Kết quả đầu ra như sau:

```
[a, b, c, d]
```

Có thể thấy, việc sắp xếp dựa trên thứ tự tăng dần của ký tự đầu tiên. Các kiểu dữ liệu cơ bản được sắp xếp theo thuật toán QuickSort hai trục, còn các kiểu dữ liệu tham chiếu được sắp xếp theo thuật toán TimSort, sử dụng kỹ thuật trong "Sắp xếp lạc quan và độ phức tạp lý thuyết thông tin" của Peter McIlroy.

### 04. Tìm Kiếm Trong Mảng

Sau khi sắp xếp mảng, có thể sử dụng phương thức `binarySearch()` của lớp `Arrays` để tìm kiếm nhị phân. Nếu không sắp xếp, chỉ có thể tìm kiếm tuyến tính, hiệu suất sẽ thấp hơn nhiều.

```java
String[] intro1 = new String[] { "a", "b", "c", "d" };
String[] sorted = Arrays.copyOf(intro1, 4);
Arrays.sort(sorted);
int exact = Arrays.binarySearch(sorted, "c");
System.out.println(exact);
int caseInsensitive = Arrays.binarySearch(sorted, "C", String::compareToIgnoreCase);
System.out.println(caseInsensitive);
```

Phương thức `binarySearch()` có thể thực hiện tìm kiếm chính xác hoặc tìm kiếm không phân biệt chữ hoa chữ thường. Kết quả đầu ra như sau:

```
3
3
```

Kết quả sắp xếp là `[a, b, c, d]`, nên chỉ số tìm kiếm được là 3.

"Tam Muội, nhớ là sau này nếu muốn tìm kiếm phần tử trong mảng hoặc tập hợp, nên sắp xếp trước rồi sử dụng tìm kiếm nhị phân để tăng hiệu quả."

Tam Muội gật đầu tỏ vẻ hiểu.

### 05. Chuyển Mảng Thành Stream

Stream là gì vậy?

Stream trong tiếng Anh có nghĩa là dòng chảy. Nó có thể giúp tăng năng suất của lập trình viên Java rất nhiều, cho phép viết mã hiệu quả, sạch sẽ và ngắn gọn. Phong cách này coi tập hợp cần xử lý như một dòng chảy qua các ống dẫn, chúng ta có thể xử lý dòng chảy này trong ống dẫn, ví dụ như lọc, sắp xếp, v.v. [Cách sử dụng Stream cụ thể](/programming/java/java8/stream), chúng ta sẽ để lại sau để nói chi tiết, bây giờ bạn chỉ cần có một ấn tượng chung là được.

Phương thức `stream()` của lớp `Arrays` có thể chuyển đổi mảng thành stream:

```java
String[] intro = new String[] { "a", "b", "c", "d" };
System.out.println(Arrays.stream(intro).count());
```

Cũng có thể chỉ định chỉ số bắt đầu và kết thúc cho phương thức `stream()`:

```java
System.out.println(Arrays.stream(intro, 1, 2).count());
```

Nếu phạm vi chỉ số sai, ví dụ từ 2 đến 1, chương trình sẽ ném ngoại lệ ArrayIndexOutOfBoundsException:

```
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: origin(2) > fence(1)
	at java.base/java.util.Spliterators.checkFromToBounds(Spliterators.java:387)
```


### 06. In Mảng

Vì mảng là một đối tượng, nếu bạn sử dụng trực tiếp `System.out.println`, kết quả sẽ như sau:

```
[Ljava.lang.String;@3d075dc0
```

[Cách in mảng tốt nhất](/programming/java/array/print.html) là sử dụng `Arrays.toString()`, thực ra đã được đề cập trước đây. Hãy xem qua mã nguồn của phương thức này:

```java
public static String toString(Object[] a) {
    if (a == null)
        return "null";

    int iMax = a.length - 1;
    if (iMax == -1)
        return "[]";

    StringBuilder b = new StringBuilder();
    b.append('[');
    for (int i = 0; ; i++) {
        b.append(String.valueOf(a[i]));
        if (i == iMax)
            return b.append(']').toString();
        b.append(", ");
    }
}
```

- Đầu tiên, kiểm tra null, nếu đúng, trả về chuỗi `null`;
- Lấy độ dài của mảng, nếu độ dài của mảng là 0 (tương đương với length - 1 bằng -1), trả về dấu ngoặc vuông `[]`, biểu thị mảng rỗng;
- Nếu mảng không phải là null và độ dài không phải là 0, khai báo đối tượng StringBuilder, sau đó thêm dấu bắt đầu của mảng `[`, tiếp theo duyệt qua mảng và thêm từng phần tử vào; một mẹo nhỏ là, khi gặp phần tử cuối cùng (i == iMax), không thêm dấu phẩy và khoảng trắng “, ” mà thêm dấu kết thúc của mảng `]`.

Vì sao khi kiểm tra độ dài của mảng là 0 lại so sánh với -1 sau khi trừ 1? Tại sao không so sánh trực tiếp với 0?

Thực ra là có liên quan đến việc kiểm tra `i == iMax` khi duyệt mảng, nếu không, phải dùng `i == iMax -1` để kiểm tra liệu đã đến phần tử cuối cùng của mảng hay chưa.

### 07. Chuyển Mảng Thành List

Dù mảng rất mạnh mẽ, nhưng các phương thức tiện ích mà nó có thể thực hiện lại rất ít, chẳng hạn như kiểm tra xem mảng có chứa một giá trị nào đó hay không. Nếu có thể chuyển đổi thành List, mọi thứ sẽ đơn giản hơn nhiều, vì trong [List](/programming/java/collection/overview) của Java có rất nhiều phương thức tiện dụng.

```java
String[] intro = new String[] { "a", "b", "c", "d" };
List<String> rets = Arrays.asList(intro);
System.out.println(rets.contains("d"));
```

Tuy nhiên, cần lưu ý rằng, `Arrays.asList()` trả về `java.util.Arrays.ArrayList`, không phải là [`java.util.ArrayList`](/programming/java/collection/arraylist), độ dài của nó cố định, không thể xóa hoặc thêm phần tử.

```java
rets.add("e");
rets.remove("d");
```

Điều này cần chú ý khi viết mã, nếu không sẽ ném ra ngoại lệ khi thực hiện hai phương thức này:

```
Exception in thread "main" java.lang.UnsupportedOperationException
	at java.base/java.util.AbstractList.add(AbstractList.java:153)
	at java.base/java.util.AbstractList.add(AbstractList.java:111)
```

Nếu muốn thao tác các phần tử, cần chuyển đổi thêm một bước nữa, chuyển thành `java.util.ArrayList` thực sự:

```java
List<String> rets1 = new ArrayList<>(Arrays.asList(intro));
rets1.add("e");
rets1.remove("d");
```

### 08. setAll

Java 8 đã bổ sung phương thức `setAll()`, nó cung cấp một điểm vào [lập trình hàm](/programming/java/java8/lambda), có thể dùng để điền giá trị cho các phần tử của mảng:

```java
int[] array = new int[10];
Arrays.setAll(array, i -> i * 10);
System.out.println(Arrays.toString(array));
```

i tương đương với chỉ số của mảng, giá trị bắt đầu từ 0 và kết thúc ở 9, do đó `i * 10` có nghĩa là giá trị bắt đầu từ 0 * 10 đến 9 * 10. Hãy xem kết quả đầu ra:

```
[0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
```

Phương thức này có thể dùng để điền các phần tử mới dựa trên mảng gốc.

### 09. `parallelPrefix`

Phương thức `parallelPrefix()` giống với phương thức `setAll()`, đều được cung cấp sau Java 8, và cung cấp một điểm vào cho lập trình hàm. Nó duyệt qua các phần tử trong mảng, thực hiện thao tác giữa phần tử ở vị trí chỉ mục hiện tại với các phần tử trước đó, rồi ghi đè kết quả của thao tác vào vị trí chỉ mục hiện tại.

```java
int[] arr = new int[] { 1, 2, 3, 4 };
Arrays.parallelPrefix(arr, (left, right) -> left + right);
System.out.println(Arrays.toString(arr));
```

Đoạn mã trên có một biểu thức Lambda (`(left, right) -> left + right`), có nghĩa là gì? Đoạn mã này tương đương với:

```java
int[] arr = new int[] { 1, 2, 3, 4 };
Arrays.parallelPrefix(arr, (left, right) -> {
    System.out.println(left + "，" + right);
    return left + right;
});
System.out.println(Arrays.toString(arr));
```

Hãy xem kết quả đầu ra để hiểu rõ hơn:

```text
1，2
3，3
6，4
[1, 3, 6, 10]
```

Có nghĩa là, biểu thức Lambda đã được thực thi ba lần:

- Lần đầu tiên, cộng 1 và 2, kết quả là 3, thay thế vị trí chỉ mục 1.
- Lần thứ hai, cộng 3 và 3, kết quả là 6, nghĩa là kết quả lần đầu tiên cộng với phần tử ở chỉ mục 2.
- Lần thứ ba, cộng 6 và 4, kết quả là 10, nghĩa là kết quả lần thứ hai cộng với phần tử ở chỉ mục 3.
