---
title: Fail Fast
tags:
  - java
categories:
  - java
order: 13
---
# Fail Fast

Tại sao sổ tay phát triển Java của Alibaba lại buộc bạn không được xóa các thành phần trong foreach?

### Về khái niệm fail-fast

Để giải thích khái niệm fail-fast, hãy xem qua một đoạn văn bản tiếng Anh như sau:

>In systems design, a fail-fast system is one which immediately reports at its interface any condition that is likely to indicate a failure. Fail-fast systems are usually designed to stop normal operation rather than attempt to continue a possibly flawed process. Such designs often check the system's state at several points in an operation, so any failures can be detected early. The responsibility of a fail-fast module is detecting errors, then letting the next-highest level of the system handle them.

Đoạn văn này nói rõ rằng, fail-fast là một phương pháp thiết kế hệ thống chung, khi phát hiện điều kiện có thể dẫn đến lỗi, hệ thống sẽ ngay lập tức ném ra một ngoại lệ để dừng thực thi và thông báo lỗi cho bên gọi xử lý. Điều này giúp tránh những lỗi nghiêm trọng có thể xảy ra.

```java
public void test(Wanger wanger) {   
    if (wanger == null) {
        throw new RuntimeException("wanger không thể là null");
    }
    
    System.out.println(wanger.toString());
}
```

Khi phát hiện wanger là null, ngoại lệ sẽ được ném ra ngay lập tức, cho phép người gọi phương thức quyết định xử lý trong tình huống này. Dòng code `wanger.toString()` sẽ không được thực thi tiếp tục — điều này giúp tránh các lỗi nghiêm trọng hơn có thể xảy ra.

Nhiều khi, chúng ta có thể coi fail-fast là một cơ chế phát hiện lỗi trong các khung dữ liệu Java nhưng thực tế fail-fast không chỉ đặc thù cho Java collections mà còn là một tiêu chuẩn thiết kế hệ thống phổ biến.

### Về lỗi xóa phần tử trong vòng lặp for-each

Chúng ta đặt fail-fast trong phần khung dữ liệu collection của Java vì vấn đề này dễ tái hiện.

```java
List<String> list = new ArrayList<>();
list.add("a");
list.add("b");
list.add("c");

for (String str : list) {
	if ("a".equals(str)) {
		list.remove(str);
	}
}

System.out.println(list);
```

Đoạn mã này dường như không có vấn đề gì, nhưng khi chạy thì lại bị lỗi.

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/collection/fail-fast-01.png)

Dựa vào thông tin stack trace lỗi, chúng ta có thể xác định đến dòng mã thứ 901 của ArrayList.

```java
final void checkForComodification() {
    if (modCount != expectedModCount)
        throw new ConcurrentModificationException();
}
```

Điều này có nghĩa là, khi thực thi phương thức remove, hàm `checkForComodification` được gọi, nơi mà modCount và expectedModCount được so sánh; nếu chúng không bằng nhau, một ngoại lệ `ConcurrentModificationException` sẽ được ném ra.

Tại sao lại gọi đến hàm `checkForComodification`?

Bởi vì vòng lặp for-each thực chất là một cú pháp đơn giản, bên dưới là sử dụng iterator cùng với vòng lặp while để thực hiện, hãy xem mã bytecode sau khi được dịch ngược.

```java
List<String> list = new ArrayList();
list.add("a");
list.add("b");
list.add("c");
Iterator var2 = list.iterator();

while(var2.hasNext()) {
    String str = (String)var2.next();
    if ("a".equals(str)) {
        list.remove(str);
    }
}

System.out.println(list);
```

Hãy xem phương thức iterator của ArrayList.

```java
public Iterator<E> iterator() {
    return new Itr();
}
```

Lớp nội tại Itr thực hiện Iterator interface, hãy xem nguồn của Itr.

```java
private class Itr implements Iterator<E> {
    int cursor;             // Chỉ số của phần tử tiếp theo
    int lastRet = -1;       // Chỉ số của phần tử trước đó; nếu không có thì là -1
    int expectedModCount = modCount; // Số lần sửa đổi của ArrayList

    Itr() { }  // Constructor

    public boolean hasNext() { // Kiểm tra xem còn phần tử tiếp theo không
        return cursor != size;
    }

    @SuppressWarnings("unchecked")
    public E next() { // Trả về phần tử tiếp theo
        checkForComodification(); // Kiểm tra xem ArrayList có bị sửa đổi không
        int i = cursor; // Chỉ số hiện tại
        Object[] elementData = ArrayList.this.elementData; // Mảng các phần tử trong ArrayList
        if (i >= elementData.length) // Vượt quá giới hạn mảng
            throw new ConcurrentModificationException(); // Ném ngoại lệ
        cursor = i + 1; // Cập nhật chỉ số phần tử tiếp theo
        return (E) elementData[lastRet = i]; // Trả về phần tử tiếp theo
    }
}
```

Có nghĩa là khi gọi `new Itr()`, expectedModCount được gán giá trị là modCount, trong đó modCount là một bộ đếm trong ArrayList, dùng để ghi lại số lần ArrayList đã bị sửa đổi. Các hoạt động sửa đổi ArrayList bao gồm thêm, xóa, đặt giá trị phần tử, v.v. Mỗi lần sửa đổi ArrayList, modCount tăng lên 1.

Khi lặp qua ArrayList, nếu trong quá trình lặp iterator phát hiện rằng giá trị modCount không bằng với expectedModCount của iterator, điều này có nghĩa là ArrayList đã bị sửa đổi, lúc này sẽ ném ra ngoại lệ ConcurrentModificationException. Cơ chế này đảm bảo rằng iterator khi duyệt qua ArrayList sẽ không bỏ sót hoặc lặp lại các phần tử, đồng thời cũng có thể phát hiện ra vấn đề sửa đổi đồng thời trong môi trường đa luồng.

```java
protected transient int modCount = 0;
```

### Phân tích logic thực thi của mã code

Chúng ta tiếp tục định vị vào stack trace lỗi đã báo trước đó. Đây là đoạn mã đã được trình bày trước đó.

```java
List<String> list = new ArrayList<>();
list.add("a");
list.add("b");
list.add("c");

for (String str : list) {
	if ("a".equals(str)) {
		list.remove(str);
	}
}

System.out.println(list);
```

Vì list đã gọi phương thức add 3 lần trước đó.

- Phương thức add gọi phương thức ensureCapacityInternal.
- Phương thức ensureCapacityInternal gọi phương thức ensureExplicitCapacity.
- Trong phương thức ensureExplicitCapacity, `modCount++` được thực hiện.

```java
private void ensureExplicitCapacity(int minCapacity) {
    modCount++;
}
```

Vì vậy, sau ba lần add, giá trị của modCount là 3, khi đó giá trị của expectedModCount sau khi gọi `new Itr()` cũng là 3 (xem lại mã nguồn của Itr như trước).

Tiếp theo là thực thi vòng lặp for-each.

Trong lần lặp đầu tiên, phát hiện rằng "a" bằng với str, do đó thực hiện `list.remove(str)`.

- Phương thức remove gọi phương thức fastRemove.
- Trong phương thức fastRemove, `modCount++` được thực hiện.

```java
private void fastRemove(int index) {
    modCount++;
}
```

Giá trị của modCount bây giờ là 4.

Trong lần lặp thứ hai, phương thức next của Itr được thực thi (`String str = (String) var3.next();`), next sẽ gọi phương thức `checkForComodification`.

```java
final void checkForComodification() {
    if (modCount != expectedModCount)
        throw new ConcurrentModificationException();
}
```

Lúc này, expectedModCount là 3, modCount là 4, vì vậy phải ném ra ngoại lệ ConcurrentModificationException.

Thực tế, trong Hướng dẫn phát triển Java của Alibaba cũng đã đề cập, không nên thực hiện thao tác xóa/thêm phần tử trong vòng lặp for-each. Thay vào đó, hãy sử dụng phương thức remove bằng cách sử dụng Iterator.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240630131008.png)


Nguyên nhân chính là những gì chúng ta đã phân tích ở trên, vì cơ chế bảo vệ fail-fast.

### Làm thế nào để xóa phần tử một cách đúng đắn?

#### **1) Sau remove là break**

```java
List<String> list = new ArrayList<>();
list.add("a");
list.add("b");
list.add("c");

for (String str : list) {
	if ("a".equals(str)) {
		list.remove(str);
		break;
	}
}
```

Sau khi break, vòng lặp sẽ không duyệt tiếp nữa, điều này có nghĩa là phương thức next của Iterator sẽ không được gọi nữa, và vì vậy `checkForComodification` cũng sẽ không được gọi nữa, do đó ngoại lệ sẽ không bị ném ra.

Tuy nhiên, khi có nhiều phần tử trùng lặp trong List cần xóa, cách này không phù hợp.

#### **2) Vòng lặp for**

```java
List<String> list = new ArrayList<>();
list.add("a");
list.add("b");
list.add("c");
for (int i = 0; i < list.size(); i++) {
	String str = list.get(i);
	if ("a".equals(str)) {
		list.remove(str);
	}
}
```

Mặc dù vòng lặp for có thể tránh được cơ chế bảo vệ fail-fast, nghĩa là sau khi xóa phần tử sẽ không ném ra ngoại lệ; nhưng đoạn mã này về mặt nguyên tắc là có vấn đề. Tại sao lại như vậy?

Lần lặp đầu tiên, i là 0, `list.size()` là 3, khi thực hiện xóa vài phương thức sau, i là 1, `list.size()` lại thành 2, bởi vì kích cỡ của list thay đổi sau khi xóa, nghĩa là phần tử "b" đã bị bỏ qua.

Trước khi xóa, `list.get(1)` là "b"; sau khi xóa, `list.get(1)` trở thành "c", và `list.get(0)` là "b".

#### **3) Sử dụng Iterator**

```java
List<String> list = new ArrayList<>();
list.add("a");
list.add("b");
list.add("c");

Iterator<String> itr = list.iterator();

while (itr.hasNext()) {
	String str = itr.next();
	if ("a".equals(str)) {
		itr.remove();
	}
}
```

Tại sao sử dụng phương thức remove của Iterator có thể tránh được cơ chế bảo vệ fail-fast? Hãy xem mã nguồn của remove để hiểu rõ.

```java
public void remove() {
    if (lastRet < 0) // Nếu không có chỉ số của phần tử trả về trước đó, ném ra ngoại lệ
        throw new IllegalStateException();
    checkForComodification(); // Kiểm tra xem ArrayList có bị sửa đổi không

    try {
        ArrayList.this.remove(lastRet); // Xóa phần tử trả về trước đó
        cursor = lastRet; // Cập nhật chỉ số của phần tử tiếp theo
        lastRet = -1; // Xóa chỉ số của phần tử trả về trước đó
        expectedModCount = modCount; // Cập nhật số lần sửa đổi của ArrayList
    } catch (IndexOutOfBoundsException ex) {
        throw new ConcurrentModificationException(); // Ném ra ngoại lệ
    }
}
```

Sau khi xóa, `expectedModCount = modCount` được thực hiện, đảm bảo sự đồng bộ giữa expectedModCount và modCount.

### Tổng kết

Tại sao không thể thực hiện thao tác xóa trong vòng lặp foreach?

Bởi vì vòng lặp foreach được thực hiện dựa trên Iterator của collection, và khi Iterator duyệt qua collection, nó duy trì một thuộc tính expectedModCount để ghi nhận số lần collection đã bị sửa đổi. Nếu thực hiện thao tác xóa trong vòng lặp foreach sẽ làm cho giá trị của thuộc tính expectedModCount không khớp với giá trị thực tế của thuộc tính modCount, dẫn đến việc phương thức hasNext() và next() của Iterator ném ra ngoại lệ ConcurrentModificationException.

Để tránh tình trạng này, nên sử dụng phương thức remove() của Iterator để xóa phần tử, phương thức này sẽ cập nhật trạng thái của Iterator sau khi xóa phần tử, đảm bảo tính đúng đắn của vòng lặp. Nếu cần xóa phần tử trong vòng lặp, nên sử dụng phương thức remove() của Iterator, không nên sử dụng phương thức remove() của collection chính.

Ví dụ như sau:

```java
List<String> list = new ArrayList<>();
list.add("a");
list.add("b");
list.add("c");

Iterator<String> itr = list.iterator();

while (itr.hasNext()) {
	String str = itr.next();
	if ("a".equals(str)) {
		itr.remove();
	}
}
```

Ngoài ra, chúng ta cũng có thể sử dụng phương thức filter() của Stream để lọc các phần tử trong collection và sau đó sử dụng phương thức collect() để thu thập các phần tử đã được lọc vào một collection mới.

```java
List<String> list = new ArrayList<>(Arrays.asList("a", "b", "c"));
list = list.stream().filter(s -> !s.equals("c")).collect(Collectors.toList());
```

Vậy là xong về vấn đề này rồi, hy vọng có thể giúp ích cho bạn.