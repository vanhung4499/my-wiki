---
title: Array
tags: ['java']
categories: ['java']
order: 1
---


# Array

“Hãy nhìn vào mã nguồn của ArrayList để rõ hơn.” Hãy mở Intellij IDEA và tìm đến mã nguồn của ArrayList.

```java
/**
 * The array buffer into which the elements of the ArrayList are stored.
 * The capacity of the ArrayList is the length of this array buffer. Any
 * empty ArrayList with elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA
 * will be expanded to DEFAULT_CAPACITY when the first element is added.
 */
transient Object[] elementData; // non-private to simplify nested class access

/**
 * The size of the ArrayList (the number of elements it contains).
 *
 * @serial
 */
private int size;
```

"`Object[] elementData` chính là array."

Array hay mảng là một đối tượng, nó chứa một tập hợp số lượng cố định các phần tử, và các phần tử này có cùng kiểu. Mảng sẽ đặt các phần tử theo chỉ mục, có nghĩa là chúng ta có thể truy cập các phần tử này thông qua chỉ mục. Trong Java, chỉ mục bắt đầu từ 0.

Tại sao chỉ mục lại bắt đầu từ 0?

Java được xây dựng dựa trên ngôn ngữ C/C++, mà trong ngôn ngữ C, chỉ mục bắt đầu từ 0, vì vậy Java kế thừa thói quen tốt đẹp này (tôi nghĩ vậy). Ngôn ngữ C có một khái niệm rất quan trọng, gọi là con trỏ, thực tế nó là một độ lệch, khoảng cách từ vị trí bắt đầu, phần tử đầu tiên ở vị trí bắt đầu, độ lệch của nó là 0, do đó chỉ mục là 0.

Bên cạnh đó, còn có một lý do khác. Các tài nguyên máy tính thời kỳ đầu khá khan hiếm, chỉ mục bắt đầu từ 0 so với chỉ mục bắt đầu từ 1 thì hiệu quả biên dịch cao hơn.

Chúng ta có thể hiểu mảng như những ô được sắp xếp gọn gàng, mỗi ô chứa một phần tử.

Kiểu của các phần tử trong mảng có thể là kiểu dữ liệu nguyên thuỷ (ví dụ như int, double) hoặc là kiểu dữ liệu tham chiếu (ví dụ như String), bao gồm cả kiểu tự định nghĩa.

### Khai báo và khởi tạo mảng

Có hai cách để khai báo mảng.

Hãy xem cách đầu tiên:

```java
int[] anArray;
```

Tiếp theo là cách thứ hai:

```java
int anOtherArray[];
```

Sự khác biệt nằm ở vị trí của dấu ngoặc vuông, là theo sau từ khóa kiểu dữ liệu hay theo sau tên biến. Cách đầu tiên được sử dụng nhiều hơn, ví dụ như trong mã nguồn của ArrayList cũng sử dụng cách đầu tiên.

Tương tự, cách khởi tạo mảng cũng có nhiều loại, phổ biến nhất là:

```java
int[] anArray = new int[10];
```

Dòng mã trên sử dụng từ khóa `new`, điều này có nghĩa là mảng thực sự là một đối tượng, chỉ có việc tạo đối tượng mới sử dụng từ khóa `new`, [kiểu dữ liệu cơ bản](/programming/java/basic/basic-data-type) thì không (các kiểu gói của dữ liệu cơ bản có thể sử dụng `new`, vì kiểu gói là đối tượng). Sau đó, chúng ta cần chỉ định độ dài của mảng trong dấu ngoặc vuông.

Lúc này, mỗi phần tử trong mảng sẽ được khởi tạo với giá trị mặc định, kiểu `int` sẽ là 0, kiểu `Object` sẽ là null. Các kiểu dữ liệu khác nhau có giá trị mặc định khác nhau, bạn có thể tham khảo [bài viết trước](/programming/java/basic/basic-data-type).

Ngoài ra, còn có thể sử dụng dấu ngoặc nhọn để trực tiếp khởi tạo các phần tử trong mảng:

```java
int anOtherArray[] = new int[] {1, 2, 3, 4, 5};
```

Lúc này, các phần tử của mảng lần lượt là 1, 2, 3, 4, 5, chỉ số lần lượt là 0, 1, 2, 3, 4 và độ dài là 5.

### Các thao tác thường dùng với mảng

"Làm sao để truy cập mảng?"

Như đã đề cập trước đó, có thể truy cập các phần tử của mảng thông qua chỉ mục, như sau:

```java
anArray[0] = 10;
```

Tên biến, cộng với dấu ngoặc vuông, cộng với chỉ mục của phần tử, có thể truy cập mảng và sử dụng toán tử “=” để gán giá trị cho phần tử.

Nếu giá trị của chỉ mục vượt quá giới hạn của mảng, sẽ ném ra ngoại lệ `ArrayIndexOutOfBoundException`. Vì chỉ mục của mảng bắt đầu từ 0 nên chỉ mục tối đa là `length - 1`. Đừng sử dụng chỉ mục vượt quá phạm vi này để truy cập mảng, nếu không sẽ ném ra ngoại lệ truy cập ngoài mảng.

Ví dụ, nếu bạn khai báo một mảng có kích thước 10 và dùng chỉ mục 10 để truy cập mảng, sẽ ném ra ngoại lệ này. Vì chỉ mục của mảng bắt đầu từ 0, nên chỉ mục của phần tử cuối cùng của mảng là `length - 1`, tức là 9.

Khi mảng có rất nhiều phần tử, việc truy cập từng phần tử một sẽ rất vất vả, do đó cần sử dụng cách duyệt mảng.

Cách thứ nhất, sử dụng vòng lặp for:

```java
int anOtherArray[] = new int[] {1, 2, 3, 4, 5};
for (int i = 0; i < anOtherArray.length; i++) {
    System.out.println(anOtherArray[i]);
}
```

Sử dụng thuộc tính `length` để lấy độ dài của mảng, sau đó duyệt từ 0, sẽ lấy được tất cả các phần tử của mảng.

Cách thứ hai, sử dụng vòng lặp for-each:

```java
for (int element : anOtherArray) {
    System.out.println(element);
}
```

Nếu không cần quan tâm đến chỉ mục (có nghĩa là không cần thay đổi phần tử nào của mảng), sử dụng vòng lặp for-each sẽ đơn giản hơn. Tất nhiên, cũng có thể sử dụng vòng lặp while và do-while.

### Tham số biến đổi và mảng

Trong Java, tham số biến đổi được sử dụng để truyền một số lượng tham số tùy ý vào phương thức. Hãy xem phương thức `varargsMethod()`:

```java
void varargsMethod(String... varargs) {}
```

Phương thức này có thể nhận bất kỳ số lượng tham số chuỗi nào, có thể là 0 hoặc N tham số. Bản chất, tham số biến đổi được triển khai thông qua mảng. Để chứng minh điều này, chúng ta có thể xem mã bytecode sau khi được dịch ngược:

```java
public class VarargsDemo
{

    public VarargsDemo()
    {
    }

    transient void varargsMethod(String as[])
    {
    }
}
```

Vì vậy, chúng ta thực chất có thể truyền trực tiếp mảng làm tham số cho phương thức này:

```java
VarargsDemo demo = new VarargsDemo();
String[] anArray = new String[] {"Hung", "Dev"};
demo.varargsMethod(anArray);
```

Cũng có thể truyền trực tiếp nhiều chuỗi, cách nhau bởi dấu phẩy:

```java
demo.varargsMethod("Hung", "Dev");
```

### Array và List

Trong Java, Array và List có mối quan hệ rất mật thiết. List bao gói nhiều phương thức hữu ích, giúp chúng ta thao tác với tập hợp dễ dàng hơn. Nếu thao tác trực tiếp với mảng, sẽ có nhiều bất tiện vì array không cung cấp các phương thức đã được bao gói sẵn. Vì vậy, đôi khi chúng ta cần chuyển mảng thành List.

> List sẽ được giới thiệu chi tiết trong phần [ArrayList](/programmin/java/collection/arraylist). Ở đây chúng ta sẽ làm quen trước để tiện cho việc ôn lại sau này.

Cách nguyên thủy nhất là duyệt qua mảng, từng phần tử một và thêm vào List.

```java
int[] anArray = new int[] {1, 2, 3, 4, 5};

List<Integer> aList = new ArrayList<>();
for (int element : anArray) {
    aList.add(element);
}
```

Cách tinh tế hơn là sử dụng phương thức `asList()` của lớp [Arrays](https://javabetter.cn/common-tool/arrays.html) (bấm vào liên kết để biết thêm chi tiết):

```java
List<Integer> aList = Arrays.asList(anArray);
```

Tuy nhiên, cần lưu ý rằng tham số của `Arrays.asList` phải là mảng Integer, trong khi `anArray` hiện tại là kiểu `int`.

Có thể viết như sau:

```java
List<Integer> aList1 = Arrays.asList(1, 2, 3, 4, 5);
```

Hoặc dùng cách khác:

```java
List<Integer> aList = Arrays.stream(anArray).boxed().collect(Collectors.toList());
```

Điều này liên quan đến khái niệm [Stream trong Java](/programming/java/java8/stream.html), bấm vào liên kết để tìm hiểu thêm.

Một điều cần chú ý nữa là phương thức `Arrays.asList` trả về một ArrayList nhưng không phải là `java.util.ArrayList`, mà thực ra là một lớp bên trong của Arrays:

```java
private static class ArrayList<E> extends AbstractList<E>
        implements RandomAccess, java.io.Serializable{}
```

Nếu cần thêm hoặc xóa phần tử, bạn cần chuyển đổi nó thành `java.util.ArrayList`.

```java
new ArrayList<>(Arrays.asList(anArray));
```

Java 8 giới thiệu khái niệm [Stream](/programming/java/java8/stream.html), có nghĩa là chúng ta cũng có thể chuyển mảng thành Stream để thao tác.

```java
String[] anArray = new String[] {"Hung", "Dev", "Java"};
Stream<String> aStream = Arrays.stream(anArray);
```

### Sắp xếp và tìm kiếm

Nếu muốn sắp xếp mảng, bạn có thể sử dụng phương thức `sort()` của lớp Arrays.

- Các kiểu dữ liệu cơ bản sẽ được sắp xếp theo thứ tự tăng dần.
- Các đối tượng đã triển khai interface Comparable sẽ được sắp xếp theo phương thức `compareTo()` của chúng.

Hãy xem ví dụ đầu tiên:

```java
int[] anArray = new int[] {5, 2, 1, 4, 8};
Arrays.sort(anArray);
```

Kết quả sau khi sắp xếp:

```java
[1, 2, 4, 5, 8]
```

Hãy xem ví dụ thứ hai:

```java
String[] yetAnotherArray = new String[] {"A", "E", "Z", "B", "C"};
Arrays.sort(yetAnotherArray, 1, 3, Comparator.comparing(String::toString).reversed());
```

Chỉ sắp xếp các phần tử từ vị trí 1 đến 3 theo thứ tự ngược lại, kết quả sẽ là:

```
[A, Z, E, B, C]
```

Đôi khi, chúng ta cần tìm một phần tử cụ thể trong mảng. Cách trực tiếp nhất là duyệt qua mảng:

```java
int[] anArray = new int[] {5, 2, 1, 4, 8};
for (int i = 0; i < anArray.length; i++) {
    if (anArray[i] == 4) {
        System.out.println("Tìm thấy tại vị trí " + i);
        break;
    }
}
```

Ví dụ trên tìm kiếm phần tử 4 trong mảng và thoát khỏi vòng lặp khi tìm thấy bằng từ khóa `break`.

Nếu mảng đã được sắp xếp trước, bạn có thể sử dụng phương pháp tìm kiếm nhị phân, hiệu quả sẽ cao hơn. Phương thức `Arrays.binarySearch()` cho phép bạn làm điều này, nó cần truyền vào một mảng và phần tử cần tìm.

```java
int[] anArray = new int[] {1, 2, 3, 4, 5};
int index = Arrays.binarySearch(anArray, 4);
```

Bên cạnh mảng một chiều, còn có [mảng hai chiều](/programming/java/array/double-array), bạn có thể nghiên cứu thêm. Ví dụ, dùng mảng hai chiều để in ra tam giác Pascal


### Lỗi vượt quá giới hạn mảng

Khi thao tác với mảng, một trong những lỗi phổ biến nhất mà chúng ta có thể gặp phải là lỗi vượt quá giới hạn mảng, hay còn gọi là ngoại lệ `ArrayIndexOutOfBoundsException`【[ngoại lệ](https://javabetter.cn/exception/gailan.html)】.

```java
int[] anArray = new int[] {1, 2, 3, 4, 5};
System.out.println(anArray[5]);
```

Đoạn mã trên sẽ ném ra ngoại lệ vượt quá giới hạn mảng bởi vì chỉ số của mảng bắt đầu từ 0, do đó chỉ số lớn nhất sẽ là `length - 1`, tức là 4. Khi chúng ta sử dụng chỉ số 5, nó sẽ gây ra ngoại lệ.

Vì vậy, trước khi thao tác với mảng, cần chú ý đến phạm vi của chỉ số.
