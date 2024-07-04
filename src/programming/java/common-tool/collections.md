---
title: Collections
tags:
  - any
categories:
  - any
order: 5
---
# Collections

Collections là một lớp công cụ do JDK cung cấp, nằm trong gói java.util. Nó cung cấp một loạt các phương thức tĩnh để giúp chúng ta thực hiện các thao tác trên các collection một cách dễ dàng, được coi như là quản gia của framework collection.

Cách sử dụng Collections rất đơn giản. Trong Intellij IDEA, khi bạn gõ `Collections.` thì sẽ thấy tất cả các phương thức mà nó cung cấp. Chỉ cần nhìn qua tên phương thức và các tham số là bạn có thể biết phương thức đó dùng để làm gì.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240704191622.png)

Để tiết kiệm thời gian học tập của bạn, tôi đã phân loại các phương thức này và đưa ra một số ví dụ đơn giản.

### 01. Các Thao Tác Sắp Xếp

- `reverse(List list)`: Đảo ngược thứ tự
- `shuffle(List list)`: Trộn ngẫu nhiên thứ tự
- `sort(List list)`: Sắp xếp theo thứ tự tăng dần tự nhiên
- `sort(List list, Comparator c)`: Sắp xếp theo Comparator tùy chỉnh
- `swap(List list, int i, int j)`: Hoán đổi vị trí của hai phần tử tại vị trí i và j

Ví dụ:

```java
List<String> list = new ArrayList<>();
list.add("one");
list.add("two");
list.add("three");
list.add("four");
list.add("five");

System.out.println("Thứ tự ban đầu: " + list);

// Đảo ngược
Collections.reverse(list);
System.out.println("Sau khi đảo ngược: " + list);

// Trộn ngẫu nhiên
Collections.shuffle(list);
System.out.println("Sau khi trộn: " + list);

// Sắp xếp theo thứ tự tự nhiên
Collections.sort(list);
System.out.println("Sau khi sắp xếp tăng dần: " + list);

// Hoán đổi
Collections.swap(list, 2, 4);
System.out.println("Sau khi hoán đổi: " + list);
```

Kết quả đầu ra:

```
Thứ tự ban đầu: [one, two, three, four, five]
Sau khi đảo ngược: [five, four, three, two, one]
Sau khi trộn: [four, one, five, two, three]
Sau khi sắp xếp tăng dần: [one, two, three, four, five]
Sau khi hoán đổi: [one, two, five, four, three]
```

### 02. Các Thao Tác Tìm Kiếm

- `binarySearch(List list, Object key)`: Tìm kiếm nhị phân, yêu cầu List đã được sắp xếp
- `max(Collection coll)`: Trả về phần tử lớn nhất
- `max(Collection coll, Comparator comp)`: Trả về phần tử lớn nhất dựa trên Comparator tùy chỉnh
- `min(Collection coll)`: Trả về phần tử nhỏ nhất
- `min(Collection coll, Comparator comp)`: Trả về phần tử nhỏ nhất dựa trên Comparator tùy chỉnh
- `fill(List list, Object obj)`: Điền một đối tượng vào tất cả các phần tử trong danh sách
- `frequency(Collection c, Object o)`: Đếm số lần xuất hiện của đối tượng trong collection

Ví dụ:

```java
System.out.println("Phần tử lớn nhất: " + Collections.max(list));
System.out.println("Phần tử nhỏ nhất: " + Collections.min(list));
System.out.println("Số lần xuất hiện: " + Collections.frequency(list, "one"));

// Chưa sắp xếp mà gọi binarySearch, kết quả không xác định
System.out.println("Kết quả tìm kiếm nhị phân trước khi sắp xếp: " + Collections.binarySearch(list, "one"));
Collections.sort(list);
// Sau khi sắp xếp, kết quả tìm kiếm nhị phân chính xác
System.out.println("Kết quả tìm kiếm nhị phân sau khi sắp xếp: " + Collections.binarySearch(list, "one"));

Collections.fill(list, "tom");
System.out.println("Kết quả sau khi điền: " + list);
```

Kết quả đầu ra:

```
Thứ tự ban đầu: [one, two, three, four, five]
Phần tử lớn nhất: five
Phần tử nhỏ nhất: one
Số lần xuất hiện: 1
Kết quả tìm kiếm nhị phân trước khi sắp xếp: -1
Kết quả tìm kiếm nhị phân sau khi sắp xếp: 0
Kết quả sau khi điền: [tom, tom, tom, tom, tom]
```

### 03. Đồng Bộ Hóa

[HashMap không an toàn khi dùng trong đa luồng](/programming/java/collection/hashmap), chúng ta đã nói về điều này trước đây. Thực ra, ArrayList cũng không an toàn khi dùng trong đa luồng và không thể sử dụng trong môi trường đa luồng. Tuy nhiên, lớp công cụ Collections cung cấp một số phương thức synchronizedXxx để trả về một đối tượng được đồng bộ hóa, từ đó giải quyết vấn đề an toàn khi truy cập collection trong đa luồng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240704191648.png)


Sử dụng cũng rất đơn giản:

```java
List<String> synchronizedList = Collections.synchronizedList(list);
```

Nhìn vào mã nguồn của SynchronizedList sẽ hiểu ngay, nó chỉ thêm một lớp khóa bằng từ khóa [synchronized](/programming/java/thread/synchronized-1) vào các phương thức mà thôi.

```java
static class SynchronizedList<E>
    extends SynchronizedCollection<E>
    implements List<E> {
    private static final long serialVersionUID = -7754090372962971524L;

    final List<E> list;

    SynchronizedList(List<E> list) {
        super(list); // Gọi hàm khởi tạo của lớp cha SynchronizedCollection, truyền vào list
        this.list = list; // Khởi tạo biến thành viên list
    }

    // Lấy phần tử tại chỉ mục chỉ định
    public E get(int index) {
        synchronized (mutex) {return list.get(index);} // Thêm khóa, gọi phương thức get của list để lấy phần tử
    }
    
    // Thêm phần tử tại chỉ mục chỉ định
    public void add(int index, E element) {
        synchronized (mutex) {list.add(index, element);} // Thêm khóa, gọi phương thức add của list để thêm phần tử
    }
    
    // Xóa phần tử tại chỉ mục chỉ định
    public E remove(int index) {
        synchronized (mutex) {return list.remove(index);} // Thêm khóa, gọi phương thức remove của list để xóa phần tử
    }
}
```

Như vậy, hiệu suất sẽ tương tự như việc sử dụng trực tiếp từ khóa synchronized trên các phương thức của [Vector, Hashtable](/programming/java/collection/overview) (đã có từ JDK 1.0), nhưng các lớp collection này hầu như đã bị loại bỏ và ít được sử dụng.

```java
public class Vector<E>
    extends AbstractList<E>
    implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{

    // Lấy phần tử tại chỉ mục chỉ định
    public synchronized E get(int index) {
        if (index >= elementCount) // Nếu chỉ mục vượt quá kích thước của danh sách, ném ra ngoại lệ ArrayIndexOutOfBoundsException
            throw new ArrayIndexOutOfBoundsException(index);

        return elementData(index); // Trả về phần tử tại chỉ mục chỉ định
    }

    // Xóa phần tử tại chỉ mục chỉ định
    public synchronized E remove(int index) {
        modCount++; // Đếm số lần sửa đổi, đánh dấu danh sách đã bị thay đổi
        if (index >= elementCount) // Nếu chỉ mục vượt quá kích thước của danh sách, ném ra ngoại lệ ArrayIndexOutOfBoundsException
            throw new ArrayIndexOutOfBoundsException(index);
        E oldValue = elementData(index); // Lấy phần tử tại chỉ mục chỉ định

        int numMoved = elementCount - index - 1; // Tính số phần tử cần di chuyển
        if (numMoved > 0) // Nếu cần di chuyển phần tử
            System.arraycopy(elementData, index+1, elementData, index,
                             numMoved); // Di chuyển các phần tử trong mảng về bên trái một vị trí
        elementData[--elementCount] = null; // Đặt phần tử cuối cùng thành null để chờ thu hồi bộ nhớ

        return oldValue; // Trả về phần tử bị xóa
    }
}
```

Cách đúng đắn là sử dụng các lớp trong gói đồng bộ hóa như [CopyOnWriteArrayList](/programming/java/thread/CopyOnWriteArrayList) và [ConcurrentHashMap](/programming/java/thread/ConcurrentHashMap). Chúng ta sẽ bàn về những vấn đề này khi nói về lập trình đồng bộ hóa.

### 04. Tập Hợp Không Thay Đổi

- `emptyXxx()`：Tạo một tập hợp không thay đổi rỗng.
- `singletonXxx()`：Tạo một tập hợp không thay đổi chỉ chứa một phần tử.
- `unmodifiableXxx()`：Tạo một tập hợp không thay đổi từ tập hợp đã cho.

Ví dụ:

```java
List<String> emptyList = Collections.emptyList();
emptyList.add("Không Rỗng"); // Dòng mã này sẽ gây ra lỗi khi thực thi.
System.out.println(emptyList);
```

Khi thực thi đoạn mã này, sẽ có một ngoại lệ được ném ra:

```
Exception in thread "main" java.lang.UnsupportedOperationException
	at java.util.AbstractList.add(AbstractList.java:148)
	at java.util.AbstractList.add(AbstractList.java:108)
	at com.itwanger.s64.Demo.main(Demo.java:61)
```

Lý do là `Collections.emptyList()` trả về một lớp trong nội bộ của Collections là EmptyList, và EmptyList không override phương thức `add(int index, E element)` của lớp cha AbstractList. Do đó, khi thực thi, nó sẽ ném ra ngoại lệ UnsupportedOperationException vì không hỗ trợ thao tác này.

Điều này được suy ra từ việc phân tích mã nguồn của phương thức add. Ngoài ra, phương thức emptyList là final và EMPTY_LIST được trả về cũng là final, cho thấy rõ rằng emptyList trả về một đối tượng không thay đổi và không thể thực hiện các thao tác thêm, xóa, sửa.

```java
public static final <T> List<T> emptyList() {
    return (List<T>) EMPTY_LIST;
}

public static final List EMPTY_LIST = new EmptyList<>();
```

### 05. Khác

Còn hai phương thức khác thường được sử dụng:

- `addAll(Collection<? super T> c, T... elements)`: Thêm các phần tử vào tập hợp.
- `disjoint(Collection<?> c1, Collection<?> c2)`: Kiểm tra xem hai tập hợp có phần tử chung hay không.

Ví dụ:

```java
List<String> allList = new ArrayList<>();
Collections.addAll(allList, "nine","ten","one");
System.out.println("Sau khi thêm vào allList: " + allList);

System.out.println("Hai tập hợp không có phần tử chung: " + (Collections.disjoint(list, allList) ? "Có" : "Không"));
```

Sau khi thực thi:

```
Danh sách ban đầu: [one, two, three, four, five]
Sau khi thêm vào allList: [nine, ten, one]
Hai tập hợp không có phần tử chung: Không
```

### 06. CollectionUtils: Các lớp tiện ích cho tập hợp từ Spring và Apache

Ngoài các công cụ từ JDK như `Collections`, `CollectionUtils` từ Spring và Apache cũng rất phổ biến.

Hiện tại, phổ biến nhất là `CollectionUtils` trong gói `org.springframework.util` của Spring.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240704192055.png)

Và `CollectionUtils` trong gói `org.apache.commons.collections` của Apache.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240704192106.png)


Các Maven coordinates như sau:

```
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-collections4</artifactId>
    <version>4.4</version>
</dependency>
```

Các phương thức từ Apache nhiều hơn so với Spring, chúng ta sẽ lấy ví dụ với Apache để giới thiệu một số phương thức thông dụng.

#### Kiểm tra tập hợp có rỗng hay không

Sử dụng phương thức `isEmpty` của `CollectionUtils` để dễ dàng kiểm tra tập hợp có rỗng không, và `isNotEmpty` để kiểm tra tập hợp không rỗng.

```java
List<Integer> list = new ArrayList<>();
list.add(2);
list.add(1);
list.add(3);

if (CollectionUtils.isEmpty(list)) {
    System.out.println("Tập hợp rỗng");
}

if (CollectionUtils.isNotEmpty(list)) {
    System.out.println("Tập hợp không rỗng");
}
```

#### Thao tác với hai tập hợp

Đôi khi chúng ta cần thực hiện các thao tác như lấy hợp, giao, hay bù của hai tập hợp đã có.

```java
List<Integer> list1 = new ArrayList<>();
list1.add(2);
list1.add(1);
list1.add(3);

List<Integer> list2 = new ArrayList<>();
list2.add(2);
list2.add(4);

// Lấy hợp của hai tập hợp
Collection<Integer> unionList = CollectionUtils.union(list1, list2);
System.out.println(unionList);

// Lấy giao của hai tập hợp
Collection<Integer> intersectionList = CollectionUtils.intersection(list1, list2);
System.out.println(intersectionList);

// Lấy bù của giao của hai tập hợp
Collection<Integer> disjunctionList = CollectionUtils.disjunction(list1, list2);
System.out.println(disjunctionList);

// Lấy hiệu của hai tập hợp
Collection<Integer> subtractList = CollectionUtils.subtract(list1, list2);
System.out.println(subtractList);
```

Kết quả thực thi:

```java
[1, 2, 3, 4]
[2]
[1, 3, 4]
[1, 3]
```

Thật sự, trong thực tế làm việc, thao tác với hai tập hợp như vậy rất phổ biến, đặc biệt là trong các kịch bản xử lý hàng loạt. Trước đây chúng ta cần phải viết rất nhiều mã, nhưng giờ có thể sử dụng các thư viện có sẵn.

### 07. Tổng Kết

Tổng quan, lớp tiện ích `Collections` là người quản lý lớn của khuôn khổ tập hợp, cung cấp các phương thức rất tiện lợi để chúng ta gọi và dễ dàng để hiểu, không có gì khó khăn, chỉ cần xem chú thích của phương thức là có thể hiểu được nó làm gì.

Tuy nhiên, công cụ đâu đó, cách sử dụng nó lại là vấn đề khác. Khả năng nâng cao kỹ năng lập trình của bạn, phụ thuộc lớn vào việc bạn có khai thác mã nguồn của chúng, xem cách các bậc thầy thiết kế JDK viết mã, học một vài kỹ thuật, trong công việc thực tế, bạn có thể nổi bật nhanh chóng.

Có lẽ những người thiết kế JDK mới là giáo viên tốt nhất trên thế giới này, tài liệu viết rất chi tiết, mã viết rất sáng sủa, hầu như đã đạt đến điểm tối ưu về hiệu suất.

Có thể có người nói rằng, lớp tiện ích không có gì giá trị, chỉ là gọi phương thức thôi, nhưng đó là sai lầm lớn: nếu bạn được yêu cầu viết, liệu bạn có viết được một lớp tiện ích như Collections không?

Đó là câu hỏi mà những người giỏi cần suy nghĩ.