---
title: Comparable vs Comparator
tags:
  - java
categories:
  - java
order: 14
---
# Sự khác biệt giữa Comparable và Comparator

> Khi học về [hàng đợi ưu tiên](priorityqueue) trước đó, chúng ta đã đề cập đến Comparable và Comparator. Bài viết này tiếp tục từ góc nhìn của người phỏng vấn, chúng ta cùng tìm hiểu.

Comparable và Comparator là hai interface trong Java, từ tên của chúng chúng ta có thể hiểu được điều gì đó: hai cách để so sánh hai đối tượng theo một cách nào đó.

Nhưng thực sự thì chúng có khác biệt gì không?

### 01. Comparable

Định nghĩa của interface Comparable rất đơn giản, mã nguồn như sau:

```java
public interface Comparable<T> {
    int compareTo(T t);
}
```

Nếu một lớp implement interface Comparable (chỉ cần làm một việc, là viết lại phương thức `compareTo()`), thì nó có thể sắp xếp các đối tượng được tạo ra từ nó theo quy tắc do chính nó quy định. Dưới đây là một ví dụ.

```java
public class Cmower implements Comparable<Cmower> {
    private int age;
    private String name;

    public Cmower(int age, String name) {
        this.age = age;
        this.name = name;
    }

    @Override
    public int compareTo(Cmower o) {
        return this.age - o.age;
    }

    public static void main(String[] args) {
        Cmower wanger = new Cmower(19, "Tom");
        Cmower wangsan = new Cmower(16, "Jerry");

        if (wanger.compareTo(wangsan) < 0) {
            System.out.println(wanger.getName() + " trẻ tuổi và triển vọng hơn");
        } else {
            System.out.println(wangsan.getName() + " trẻ tuổi và triển vọng hơn");
        }
    }
}
```

Trong ví dụ trên, tôi đã tạo một lớp Cmower, có hai trường: age và name. Lớp Cmower implement interface Comparable và override phương thức `compareTo()`.

Kết quả đầu ra của chương trình là "Jerry trẻ tuổi và triển vọng hơn", vì wangsan nhỏ hơn wanger ba tuổi. Cơ sở cho kết quả này là phương thức `compareTo()`, phương thức này trả về giá trị âm, không hoặc dương, biểu thị rằng đối tượng này nhỏ hơn, bằng hoặc lớn hơn đối tượng được so sánh. Nếu loại đối tượng cụ thể không thể so sánh với đối tượng này, nó sẽ ném ra ngoại lệ ClassCastException (từ khi có [generic](/programming/java/extra/generic), trường hợp này đã ít xảy ra hơn).

### 02. Comparator

Định nghĩa của interface Comparator so với Comparable phức tạp hơn nhiều, tuy nhiên, nó chỉ có hai phương thức cốt lõi. Hãy xem mã nguồn của nó.

```java
public interface Comparator<T> {
    int compare(T o1, T o2);
    boolean equals(Object obj);
}
```

Phương thức đầu tiên `compare(T o1, T o2)` trả về một giá trị có thể là số âm, không hoặc dương, biểu thị rằng đối tượng đầu tiên nhỏ hơn, bằng hoặc lớn hơn đối tượng thứ hai.

Phương thức thứ hai `equals(Object obj)` nhận vào một Object làm đối số và xác định xem đối tượng này có khớp với Comparator không.

Đôi khi, chúng ta muốn giữ nguyên một lớp như ban đầu mà không muốn triển khai interface Comparable, nhưng vẫn cần có cách để so sánh chúng. Đây là lúc Comparator trở nên hữu ích, hãy xem một ví dụ.

#### 1) Lớp Cmower ban đầu.

```java
public class Cmower {
    private int age;
    private String name;

    public Cmower(int age, String name) {
        this.age = age;
        this.name = name;
    }

    // Getters và Setters đã được bỏ qua để đơn giản hóa
}
```

Lớp Cmower có hai trường: age và name, cho phép sắp xếp theo age hoặc name.

#### 2) Triển khai lớp Comparator.

```java
public class CmowerComparator implements Comparator<Cmower> {
    @Override
    public int compare(Cmower o1, Cmower o2) {
        return o1.getAge() - o2.getAge();
    }
}
```

Sắp xếp theo age. Tất nhiên, bạn cũng có thể triển khai một Comparator khác để sắp xếp theo name như sau.

```java
public class CmowerNameComparator implements Comparator<Cmower> {
    @Override
    public int compare(Cmower o1, Cmower o2) {
        return o1.getName().hashCode() - o2.getName().hashCode();
    }
}
```

#### 3) Lớp kiểm tra.

```java
Cmower wanger = new Cmower(19, "Tom");
Cmower wangsan = new Cmower(16, "Jerry");
Cmower wangyi = new Cmower(28, "Snoopy");

List<Cmower> list = new ArrayList<>();
list.add(wanger);
list.add(wangsan);
list.add(wangyi);

list.sort(new CmowerComparator());

for (Cmower c : list) {
    System.out.println(c.getName());
}
```

Tạo ba đối tượng với age và name khác nhau, thêm chúng vào List và sử dụng phương thức `sort()` của List để sắp xếp. Hãy xem kết quả đầu ra.

```
Jerry
Tom
Snoopy
```

Điều này ngụ ý rằng "Jerry" nhỏ hơn "Tom" về tuổi và được sắp xếp đầu tiên; "Snoopy" lớn hơn "Tom" về tuổi và được sắp xếp cuối cùng. Điều này hoàn toàn phù hợp với kỳ vọng của chúng ta.

Nhân cơ hội này, hãy xem mã nguồn của phương thức sort:

```java
public void sort(Comparator<? super E> c) {
    final int expectedModCount = modCount;
    Arrays.sort((E[]) elementData, 0, size, c);
    if (modCount != expectedModCount) {
        throw new ConcurrentModificationException();
    }
    modCount++;
}
```

Có thể thấy rằng tham số là một interface Comparator và sử dụng generic `Comparator<? super E> c`.

### 03. Tôi nên chọn cái nào?

Thông qua hai ví dụ trên, chúng ta có thể so sánh được sự khác biệt giữa Comparable và Comparator:

- Một lớp khi triển khai interface Comparable, có nghĩa là các đối tượng của lớp đó có thể được so sánh trực tiếp (sắp xếp), tuy nhiên cách sắp xếp chỉ có một, khá đơn giản.
- Nếu một lớp muốn giữ nguyên bản sắc mà vẫn cần phải sắp xếp theo các cách khác nhau, có thể tùy biến Comparator (triển khai interface Comparator).
- Interface Comparable thuộc gói `java.lang`, trong khi interface Comparator thuộc gói `java.util`. Chúng không phải là anh em ruột nhưng có thể coi như là anh em họ.

Hãy xem một ví dụ không hợp lý. Tôi muốn từ Lạc Dương đi Bắc Kinh xem Vạn Lý Trường Thành, trải nghiệm cảm giác của các anh hùng, tôi có thể đi máy bay hoặc đi tàu cao tốc; nhưng nếu là Tôn Ngộ Không, hắn chỉ cần đánh một phát rồi đã tới. Điều gì khác biệt giữa tôi và Tôn Ngộ Không?

Tôn Ngộ Không tự triển khai Comparable (thời đại của hắn không có máy bay và tàu cao tốc, không có lựa chọn), trong khi tôi có thể sử dụng Comparator (các phương tiện giao thông hiện đại).

Vậy là đã xong về Comparable và Comparator. Tóm lại, nếu việc sắp xếp đối tượng dựa trên thứ tự tự nhiên, hãy chọn Comparable; nếu cần sắp xếp theo các thuộc tính khác nhau của đối tượng, hãy chọn Comparator.
