---
title: Print Array
tags: ['java']
categories: ['java']
order: 3
---

# Print Array

### Tại sao không thể in trực tiếp mảng

“Đầu tiên, chúng ta hãy xem tại sao không thể in mảng trực tiếp và nếu in thế nào thì sẽ có vấn đề gì.”

Hãy xem xét ví dụ sau đây.

```
String [] cmowers = {"Hung","Dev","Java"};
System.out.println(cmowers);
```

Kết quả in ra của chương trình là:

```
[Ljava.lang.String;@3d075dc0
```

`[Ljava.lang.String;` chỉ ra tên lớp của mảng chuỗi, và phần sau dấu `@` là mã băm dưới dạng số hexa — kết quả in ra như vậy quá "hóc búa", đa số mọi người không hiểu được! Tại sao lại hiển thị như thế này? Hãy xem phương thức `toString()` của lớp `java.lang.Object` để hiểu rõ hơn.

```java
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

Lần này lại chứng minh rằng, mặc dù mảng không được định nghĩa một cách rõ ràng là một lớp, nhưng nó thực sự là một đối tượng, kế thừa tất cả các phương thức từ lớp cha Object.

“Vậy tại sao mảng không định nghĩa riêng một lớp để biểu diễn như lớp String chẳng hạn?”

"Một lập luận hợp lý là Java đã che giấu điều này. Giả sử thực sự tồn tại một lớp như vậy, gọi là Array.java chẳng hạn, hãy tưởng tượng ra nó, nó sẽ nhất định phải có một bao chứa để lưu trữ từng phần tử của mảng, giống như lớp String vậy."

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];
}
```

“Cuối cùng, cũng phải sử dụng một cấu trúc tương tự như mảng để lưu trữ từng phần tử của mảng phải không?” Thật vậy, việc đó trở nên không cần thiết, thà giữ mảng như là một đối tượng không có hình dạng!”

“Được rồi, thôi không nói về điều này nữa.”

### In mảng Java bằng Stream

“Chúng ta sẽ đi vào xem cách đầu tiên để in mảng, sử dụng phương thức hiện đại hơn là Stream.”

Cách đầu tiên:

```java
Arrays.asList(cmowers).stream().forEach(s -> System.out.println(s));
```

Cách thứ hai:

```java
Stream.of(cmowers).forEach(System.out::println);
```

Cách thứ ba:

```java
Arrays.stream(cmowers).forEach(System.out::println);
```

Kết quả in ra sẽ như sau:

```
Hung
Dev
Java
```

Đúng vậy, ba cách này đều có thể làm việc dễ dàng và có vẻ thời thượng một chút, vì đã sử dụng Stream cùng với [biểu thức lambda](/programming/java/java8/Lambda.html).

### In mảng Java bằng vòng lặp for

"Tất nhiên, bạn cũng có thể sử dụng cách truyền thống hơn là vòng lặp for. Thậm chí cả vòng lặp for-each cũng có thể."

```java
for(int i = 0; i < cmowers.length; i++){
    System.out.println(cmowers[i]);
}

for (String s : cmowers) {
    System.out.println(s);
}
```

### Sử dụng lớp tiện ích Arrays để in mảng Java

"Đối với tôi `Arrays.toString()` là cách tốt nhất để in mảng, không có gì bằng được."

`Arrays.toString()` có thể chuyển đổi mảng của bất kỳ loại nào thành chuỗi, bao gồm cả mảng kiểu cơ sở và mảng tham chiếu. Phương thức này có nhiều phiên bản nạp chồng.

Sử dụng phương thức `Arrays.toString()` để in mảng là cách rất tinh tế, giống như, giống như nụ cười của Mona Lisa.


```java
String [] cmowers = {"Hung","Dev","Java"};
System.out.println(Arrays.toString(cmowers));
```

Kết quả in ra của chương trình là:

```
[Hung, Dev, Java]
```

Định dạng in ra không thể hoàn hảo hơn! Đúng như chúng ta mong đợi: `[]` cho biết đó là một mảng, `,` và khoảng trắng được sử dụng để phân tách các phần tử.

### In mảng hai chiều bằng lớp tiện ích Arrays

"Nếu tôi muốn in một mảng hai chiều thì sao?"

"Có thể sử dụng phương thức `Arrays.deepToString()`."

```java
String[][] deepArray = new String[][] {{"Hung", "Dev"}, {"Java"}};
System.out.println(Arrays.deepToString(deepArray));
```

Kết quả in ra sẽ như sau:

```
[[Hung, Dev], [Java]]
```
