---
title: Objects
tags:
  - java
categories:
  - java
order: 4
---
# Objects

Lớp `Objects` trong Java là một lớp tiện ích chứa một loạt các phương thức tĩnh dùng để xử lý đối tượng. Nó nằm trong gói `java.util` và được giới thiệu từ Java 7. Mục đích chính của lớp `Objects` là giảm thiểu rủi ro exception NullPointerException trong mã nguồn, đồng thời cung cấp một số phương thức rất hữu ích cho chúng ta sử dụng.

### Kiểm Tra Đối Tượng Null

Trong Java, mọi thứ đều là đối tượng, vì vậy việc kiểm tra đối tượng có null hay không rất phổ biến. Phương thức `isNull` của `Objects` được dùng để kiểm tra xem đối tượng có null hay không, trong khi phương thức `nonNull` được dùng để kiểm tra đối tượng không null. Ví dụ:

```java
Integer integer = new Integer(1);

if (Objects.isNull(integer)) {
    System.out.println("Đối tượng là null");
}

if (Objects.nonNull(integer)) {
    System.out.println("Đối tượng không phải là null");
}
```

### Ném exception Khi Đối Tượng Null

Nếu chúng ta muốn ném exception con trỏ null khi đối tượng là null, có thể sử dụng phương thức `requireNonNull` của `Objects`. Ví dụ:

```java
Integer integer1 = new Integer(128);

Objects.requireNonNull(integer1);
Objects.requireNonNull(integer1, "Tham số không được null");
Objects.requireNonNull(integer1, () -> "Tham số không được null");
```

Trong ví dụ trên:
- `Objects.requireNonNull(integer1)` kiểm tra xem `integer1` có null không và ném exception nếu null.
- `Objects.requireNonNull(integer1, "Tham số không được null")` kiểm tra và ném exception với thông báo tùy chỉnh nếu `integer1` là null.
- `Objects.requireNonNull(integer1, () -> "Tham số không được null")` kiểm tra và ném exception với thông báo được tạo từ lambda nếu `integer1` là null.

### Kiểm Tra Hai Đối Tượng Có Bằng Nhau Không

Chúng ta thường cần kiểm tra hai đối tượng có bằng nhau không, `Objects` cung cấp phương thức `equals` giúp chúng ta thực hiện điều này một cách rất thuận tiện:

```java
Integer integer1 = new Integer(1);
Integer integer2 = new Integer(1);

System.out.println(Objects.equals(integer1, integer2));
```

Kết quả thực thi:

```java
true
```

Tuy nhiên, sử dụng phương thức này có thể gặp phải một số rắc rối, ví dụ như trong trường hợp sau:

```java
Integer integer1 = new Integer(1);
Long integer2 = new Long(1);

System.out.println(Objects.equals(integer1, integer2));
```

Kết quả thực thi:

```java
false
```

Dù `Objects.equals()` được thiết kế để tránh lỗi bằng cách xử lý việc so sánh với giá trị null mà không ném ra ngoại lệ con trỏ null, điều này không có nghĩa là nó không gặp vấn đề tiềm ẩn. Thực tế, một vấn đề tiềm ẩn của `Objects.equals()` là nó phụ thuộc vào việc triển khai phương thức `equals()` của các đối tượng được so sánh.

Khi lớp của hai đối tượng không triển khai đúng phương thức `equals()`, phương thức `Objects.equals()` có thể cho kết quả không như mong đợi. Ví dụ:

```java
public class ObjectsDemo1 {
    public static void main(String[] args) {
        Person person1 = new Person("abcd", 18);
        Person person2 = new Person("abcd", 18);

        System.out.println(Objects.equals(person1, person2)); // false
    }
}
class Person {
    String name;
    int age;

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

Trong ví dụ trên, chúng ta tạo một lớp tên là `Person` nhưng không ghi đè phương thức `equals()`. Sau đó, chúng ta tạo hai đối tượng `Person` có cùng thuộc tính và sử dụng phương thức `Objects.equals()` để so sánh chúng. Mặc dù hai đối tượng này có cùng thuộc tính, nhưng kết quả lại là `false`. Điều này là do `Objects.equals()` phụ thuộc vào phương thức `equals()` của đối tượng, và trong ví dụ này, lớp `Person` không triển khai đúng phương thức `equals()`, nên phương thức mặc định `equals()` của lớp `Object` được sử dụng, chỉ so sánh địa chỉ tham chiếu của đối tượng.

Để giải quyết vấn đề này, chúng ta cần ghi đè phương thức `equals()` trong lớp `Person`:

```java
@Override
public boolean equals(Object obj) {
    if (this == obj) {
        return true;
    }
    if (obj == null || getClass() != obj.getClass()) {
        return false;
    }
    Person person = (Person) obj;
    return age == person.age && Objects.equals(name, person.name);
}
```

Bây giờ, khi chúng ta sử dụng phương thức `Objects.equals()` để so sánh hai đối tượng `Person` có cùng thuộc tính, kết quả sẽ là `true`, đúng như mong đợi.

### Lấy hashCode của Đối Tượng

Nếu bạn muốn lấy giá trị `hashCode` của một đối tượng nào đó, bạn có thể sử dụng phương thức `hashCode` của `Objects`. Ví dụ:

```java
String str = new String("abcd");
System.out.println(Objects.hashCode(str));
```

Kết quả thực thi:

```java
867758096
```

### So Sánh Hai Đối Tượng

Phương thức `compare()` được sử dụng để so sánh hai đối tượng, thường được dùng trong việc sắp xếp tùy chỉnh. Nó yêu cầu một Comparator làm tham số. Nếu Comparator là null, thứ tự tự nhiên sẽ được sử dụng. Dưới đây là một ví dụ về phương thức `compare()`:

```java
class ObjectsCompareDemo {
    public static void main(String[] args) {
        PersonCompare person1 = new PersonCompare("tom", 30);
        PersonCompare person2 = new PersonCompare("jerry", 25);

        Comparator<PersonCompare> ageComparator = Comparator.comparingInt(p -> p.age);
        int ageComparisonResult = Objects.compare(person1, person2, ageComparator);
        System.out.println("So sánh tuổi: " + ageComparisonResult); // Kết quả：1（表示 age của person1 sau person2）
    }
}

class PersonCompare {
    String name;
    int age;

    PersonCompare(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

### So Sánh Hai Mảng

Phương thức `deepEquals()` được sử dụng để so sánh hai đối tượng loại [mảng](https://javabetter.cn/array/array.html). Khi đối tượng không phải là mảng, hành vi sẽ giống với phương thức `equals()`.

```java
int[] array1 = {1, 2, 3};
int[] array2 = {1, 2, 3};
int[] array3 = {1, 2, 4};

System.out.println(Objects.deepEquals(array1, array2)); // Kết quả：true（vì nội dung của array1 và array2 giống nhau）
System.out.println(Objects.deepEquals(array1, array3)); // Kết quả：false（vì nội dung của array1 và array3 khác nhau）

// Đối với các đối tượng không phải là mảng, deepEquals() hoạt động giống như equals()
String string1 = "hello";
String string2 = "hello";
String string3 = "world";

System.out.println(Objects.deepEquals(string1, string2)); // Kết quả：true（vì string1 và string2 giống nhau）
System.out.println(Objects.deepEquals(string1, string3)); // Kết quả：false（vì string1 và string3 khác nhau）
```

Dưới đây là ví dụ về [mảng hai chiều](/programming/java/array/double-array):

```java
String[][] nestedArray1 = {{"A", "B"}, {"C", "D"}};
String[][] nestedArray2 = {{"A", "B"}, {"C", "D"}};
String[][] nestedArray3 = {{"A", "B"}, {"C", "E"}};

System.out.println(Objects.deepEquals(nestedArray1, nestedArray2)); // Kết quả：true (vì các phần tử của mảng lồng giống nhau)
System.out.println(Objects.deepEquals(nestedArray1, nestedArray3)); // Kết quả：false (vì các phần tử của mảng lồng khác nhau)
```

### Tóm Tắt

Ngoài các phương thức đã đề cập ở trên, Objects còn cung cấp một số phương thức khác như `toString`, bạn có thể thử nếu có hứng thú.

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/common-tool/Objects-83489814-9784-4274-841a-27ee75c046ac.jpg)

Tóm lại, các phương thức mà lớp Objects cung cấp rất hữu ích trong nhiều trường hợp, giúp đơn giản hóa mã nguồn và giảm thiểu khả năng xảy ra lỗi.