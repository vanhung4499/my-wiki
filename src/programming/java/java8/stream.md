---
title: Stream
tags:
  - java
categories:
  - java
order: 1
---
# Java Stream

Chỉ từ từ "Stream" này, nghe có vẻ liên quan đến InputStream và OutputStream trong gói java.io phải không? Nhưng thực tế thì không liên quan gì cả. Stream mới của Java 8 được thiết kế để giải phóng năng suất của lập trình viên khi làm việc với các Collection, và phần lớn thành công đó đến từ Lambda Expression cùng ra đời.

Stream là gì?

> Stream giống như một bộ lặp cao cấp, nhưng chỉ có thể lặp qua một lần, giống như dòng sông xuôi về phía đông; trong quá trình lặp qua, thực hiện các thao tác trên các phần tử của dòng, ví dụ như "lọc bỏ các chuỗi có độ dài lớn hơn 10", "lấy ký tự đầu tiên của mỗi chuỗi" và như thế.

Để làm việc với Stream, đầu tiên cần có một nguồn dữ liệu, có thể là mảng hoặc bộ sưu tập. Mỗi lần thực hiện thao tác sẽ trả về một stream mới, thuận tiện cho việc thực hiện chuỗi thao tác, nhưng đối tượng stream gốc vẫn được giữ nguyên.

Các hoạt động trên Stream có thể chia thành hai loại:

1) Thao tác trung gian, có thể có nhiều thao tác, mỗi lần trả về một stream mới để thực hiện chuỗi.

2) Thao tác kết thúc, chỉ có thể có một, mỗi lần thực hiện xong, stream này sẽ bị "dùng sạch", không thể tiếp tục thực hiện thao tác tiếp theo, vì vậy chỉ nên đặt ở cuối cùng.

Hãy xem một ví dụ.

```java
List<String> list = new ArrayList<>();
list.add("one");
list.add("two");
list.add("three");
list.add("three");

long count = list.stream().distinct().count();
System.out.println(count);
```

Phương thức `distinct()` là một thao tác trung gian (loại bỏ các phần tử trùng lặp), nó sẽ trả về một stream mới (không có phần tử chung).

```java
Stream<T> distinct();
```

Phương thức `count()` là một thao tác kết thúc, trả về số lượng phần tử trong stream.

```java
long count();
```

Các thao tác trung gian không thực hiện ngay lập tức, chỉ khi có thao tác kết thúc, stream mới bắt đầu lặp, được sử dụng cho ánh xạ, lọc, v.v. Nói một cách dễ hiểu hơn là thực hiện nhiều thao tác trong một lần lặp, hiệu suất được cải thiện đáng kể.

Lý thuyết đã nói đủ, bây giờ chúng ta sẽ đi vào phần thực hành ngay.

### 01. Tạo stream trong Java

Nếu là mảng, bạn có thể sử dụng `Arrays.stream()` hoặc `Stream.of()` để tạo stream; nếu là một collection, bạn có thể sử dụng phương thức `stream()` trực tiếp, vì phương thức này đã được thêm vào giao diện Collection.

```java
public class CreateStreamDemo {
    public static void main(String[] args) {
        String[] arr = new String[]{"one", "two", "three"};
        Stream<String> stream = Arrays.stream(arr);

        stream = Stream.of("one", "two", "three");

        List<String> list = new ArrayList<>();
        list.add("one");
        list.add("two");
        list.add("three");
        stream = list.stream();
    }
}
```

Nếu bạn xem mã nguồn của Stream, bạn sẽ thấy phương thức `of()` thực tế gọi phương thức `Arrays.stream()` bên trong.

```java
public static<T> Stream<T> of(T... values) {
    return Arrays.stream(values);
}
```

Ngoài ra, bạn có thể sử dụng phương thức `parallelStream()` của bộ sưu tập để tạo stream song song, mặc định sử dụng `ForkJoinPool.commonPool()` làm bộ xử lý stream.

```java
List<Long> aList = new ArrayList<>();
Stream<Long> parallelStream = aList.parallelStream();
```

### 02. Hoạt động trên Stream

Lớp Stream cung cấp nhiều phương thức hữu ích để thực hiện các hoạt động trên luồng. Dưới đây là một số phương thức thường được sử dụng.

#### 1) Lọc (Filter)

Bạn có thể sử dụng phương thức `filter()` để lọc ra các phần tử mà bạn muốn từ luồng.

```java
public class FilterStreamDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("eat");
        list.add("sleep");
        list.add("code");
        list.add("play");
        Stream<String> stream = list.stream().filter(element -> element.contains("ee"));
        stream.forEach(System.out::println);
    }
}
```

Phương thức `filter()` nhận một đối số kiểu Predicate (một giao diện hàm mới được thêm vào từ Java 8, nhận đầu vào và trả về kết quả boolean), cho phép bạn truyền một biểu thức Lambda như `element -> element.contains("ee")` để lọc các chuỗi có chứa từ "ee".

Phương thức `forEach()` nhận một đối số kiểu Consumer (một giao diện hàm mới nhận đầu vào và không có giá trị trả về), và `System.out::println` là cú pháp mới được giới thiệu từ Java 8, tương đương với vòng lặp `for` in ra từng phần tử.

Kết quả của chương trình là:

```
sleep
```

#### 2) Ánh xạ (Map)

Nếu bạn muốn chuyển đổi các phần tử trong một luồng sang các phần tử khác bằng một phương pháp nào đó, bạn có thể sử dụng phương thức `map()`.

```java
public class MapStreamDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("eat");
        list.add("sleep");
        list.add("code");
        list.add("play");
        Stream<Integer> stream = list.stream().map(String::length);
        stream.forEach(System.out::println);
    }
}
```

Phương thức `map()` nhận một đối số kiểu Function (một giao diện hàm mới nhận đầu vào T và trả về kết quả R), ở đây là `String::length` để chuyển đổi từ `Stream<String>` thành `Stream<Integer>` với độ dài của mỗi chuỗi.

Kết quả của chương trình là:

```
3
5
4
4
```

#### 3) Kiểm tra (Match)

Lớp Stream cung cấp ba phương thức để kiểm tra các phần tử:

- `anyMatch()`: Trả về true nếu có ít nhất một phần tử thỏa mãn điều kiện.
- `allMatch()`: Trả về true nếu tất cả các phần tử đều thỏa mãn điều kiện.
- `noneMatch()`: Trả về true nếu không có phần tử nào thỏa mãn điều kiện.

```java
public class MatchStreamDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("eat");
        list.add("sleep");
        list.add("code");
        list.add("play");

        boolean anyMatchFlag = list.stream().anyMatch(element -> element.contains("ee"));
        boolean allMatchFlag = list.stream().allMatch(element -> element.length() > 1);
        boolean noneMatchFlag = list.stream().noneMatch(element -> element.endsWith("abc"));

        System.out.println(anyMatchFlag);
        System.out.println(allMatchFlag);
        System.out.println(noneMatchFlag);
    }
}
```

Vì chuỗi "sleep" bắt có "ee", nên anyMatchFlag sẽ là true; vì độ dài của các chuỗi "eat", "sleep", "code", "play" đều lớn hơn 1, nên allMatchFlag là true; vì không có chuỗi nào kết thúc bằng "abc", nên noneMatchFlag là true.

Kết quả của chương trình là:

```
true
true
true
```

#### 4) Tổng hợp (Reduce)

Phương thức `reduce()` chủ yếu để kết hợp các phần tử trong Stream lại với nhau. Có hai cách sử dụng:

- `Optional<T> reduce(BinaryOperator<T> accumulator)`: Không có giá trị khởi đầu, chỉ có một tham số là quy tắc tính toán, trả về Optional.
- `T reduce(T identity, BinaryOperator<T> accumulator)`: Có giá trị khởi đầu và quy tắc tính toán, hai tham số, trả về cùng loại với giá trị khởi đầu.

Xem ví dụ sau đây.

```java
public class ReduceStreamDemo {
    public static void main(String[] args) {
        Integer[] ints = {0, 1, 2, 3};
        List<Integer> list = Arrays.asList(ints);

        Optional<Integer> optional = list.stream().reduce((a, b) -> a + b);
        Optional<Integer> optional1 = list.stream().reduce(Integer::sum);
        System.out.println(optional.orElse(0));
        System.out.println(optional1.orElse(0));

        int reduce = list.stream().reduce(6, (a, b) -> a + b);
        System.out.println(reduce);
        int reduce1 = list.stream().reduce(6, Integer::sum);
        System.out.println(reduce1);
    }
}
```

Quy tắc tính toán có thể là biểu thức Lambda (như `(a, b) -> a + b`), hoặc `Tên lớp::Tên phương thức` (như `Integer::sum`).

Kết quả của chương trình là:

```java
6
6
12
12
```

Khi không có giá trị khởi đầu, kết quả của việc cộng các phần tử trong list là 6; khi có giá trị khởi đầu là 6, kết quả là 12.

### 03. Chuyển đổi Stream

Nếu bạn có thể chuyển đổi các mảng hoặc collection thành Stream, thì cũng cần có các phương thức tương ứng để chuyển đổi Stream trở lại — phương thức `collect()` làm đáp ứng nhu cầu này.

```java
public class CollectStreamDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("eat");
        list.add("sleep");
        list.add("code");
        list.add("play");

        String[] strArray = list.stream().toArray(String[]::new);
        System.out.println(Arrays.toString(strArray));

        List<Integer> list1 = list.stream().map(String::length).collect(Collectors.toList());
        List<String> list2 = list.stream().collect(Collectors.toCollection(ArrayList::new));
        System.out.println(list1);
        System.out.println(list2);

        String str = list.stream().collect(Collectors.joining(", "));
        System.out.println(str);
    }
}
```

Phương thức `toArray()` có thể chuyển đổi Stream thành mảng, bạn có thể thắc mắc về `String[]::new`, nó là gì? Hãy xem mã nguồn của `toArray()`.

```java
<A> A[] toArray(IntFunction<A[]> generator);
```

Điều này có nghĩa là `String[]::new` là một IntFunction, một hàm có thể tạo ra một mảng mới cần thiết, bạn có thể giải mã mã byte để xem nó thực sự là gì:

```java
String[] strArray = (String[])list.stream().toArray((x$0) -> {
    return new String[x$0];
});
System.out.println(Arrays.toString(strArray));
```

Điều này tương đương với việc trả về một mảng chuỗi có độ dài đã chỉ định.

Khi bạn cần chuyển đổi một bộ sưu tập thành một bộ sưu tập khác theo một quy tắc nào đó, bạn có thể sử dụng `map()` và `collect()` cùng nhau.

```java
List<Integer> list1 = list.stream().map(String::length).collect(Collectors.toList());
```

Sau khi tạo luồng từ phương thức `stream()`, bạn có thể ánh xạ nó thành một luồng mới của độ dài chuỗi bằng `map(String:length)`, và sau đó chuyển đổi nó thành một bộ sưu tập mới bằng phương thức `collect()`.

Collectors là một lớp tiện ích cho việc thu thập, nó bao gồm các triển khai thu thập như `toList()` để thu thập thành một `java.util.List` mới, `toCollection()` để thu thập vào một `java.util.ArrayList` mới, và `joining()` để thu thập vào một chuỗi được phân tách bằng dấu phẩy.

Dưới đây là kết quả của chương trình:

```java
[eat, sleep, code, play]
[3, 5, 4, 4]
[eat, sleep, code, play]
eat, sleep, code, play
```
