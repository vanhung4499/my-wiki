---
title: ArrayDeque
tags:
  - java
categories:
  - java
order: 8
---
# ArrayDeque Chi tiết 

Trong Java, có một lớp gọi là **Stack** cho ngăn xếp (stack), nhưng không có lớp gọi là **Queue** (hàng đợi) (chỉ là tên interface), và khác với lớp.

```java
public interface Queue<E> extends Collection<E> {}
```

Khi cần sử dụng ngăn xếp, Java không khuyến khích sử dụng **Stack**, mà thay vào đó nên sử dụng **ArrayDeque** hiệu quả hơn (hàng đợi hai đầu), lý do đã được chúng ta nói đến khi giới thiệu khung Collection lần đầu.

Điều này có nghĩa là, khi cần sử dụng ngăn xếp, hãy ưu tiên **ArrayDeque**.

```java
// Khai báo một ArrayDeque
ArrayDeque<String> stack = new ArrayDeque<>();

// Thêm các phần tử
stack.push("one");
stack.push("two");
stack.push("three");

// Lấy phần tử đầu ngăn xếp
String top = stack.peek();
System.out.println("Phần tử đầu ngăn xếp là: " + top); // three

// Xoá phần tử đầu ngăn xếp
String pop = stack.pop();
System.out.println("Phần tử bị xoá là: " + pop); // three

// Sửa đổi phần tử đầu ngăn xếp
stack.pop();
stack.push("four");
System.out.println("Ngăn xếp sau khi sửa đổi: " + stack); // [four, one]

// Duyệt hàng đợi để tìm kiếm phần tử
Iterator<String> iterator = stack.iterator();
int index = -1;
String target = "two";
while (iterator.hasNext()) {
    String element = iterator.next();
    index++;
    if (element.equals(target)) {
        break;
    }
}

if (index == -1) {
    System.out.println("Phần tử " + target + " không tồn tại trong ngăn xếp");
} else {
    System.out.println("Phần tử " + target + " ở vị trí " + index + " trong ngăn xếp");
}
```

Trong ví dụ trên, chúng ta đã tạo một đối tượng ArrayDeque, sau đó sử dụng phương thức push để thêm ba phần tử vào ngăn xếp. Tiếp theo, sử dụng phương thức peek để lấy phần tử đầu ngăn xếp, sử dụng phương thức pop để xoá phần tử đầu ngăn xếp, sử dụng pop và push để sửa đổi phần tử đầu ngăn xếp, và sử dụng vòng lặp để tìm kiếm vị trí của phần tử trong ngăn xếp.

ArrayDeque cũng triển khai interface Deque (mà cũng triển khai interface Queue).

```java
public class ArrayDeque<E> extends AbstractCollection<E>
                           implements Deque<E>, Cloneable, Serializable
{}
```

Do đó, khi cần sử dụng hàng đợi, bạn cũng có thể chọn ArrayDeque.

```java
ArrayDeque<String> queue = new ArrayDeque<>();

// Thêm các phần tử
queue.offer("one");
queue.offer("two");
queue.offer("three");

// Lấy phần tử đầu hàng đợi
String front = queue.peek();
System.out.println("Phần tử đầu hàng đợi là: " + front); // one

// Xoá phần tử đầu hàng đợi
String poll = queue.poll();
System.out.println("Phần tử bị xoá là: " + poll); // one

// Sửa đổi các phần tử trong hàng đợi
queue.poll();
queue.offer("four");
System.out.println("Hàng đợi sau khi sửa đổi: " + queue); // [three, four]

// Tìm kiếm phần tử
Iterator<String> iterator = queue.iterator();
int index = 0;
while (iterator.hasNext()) {
    String element = iterator.next();
    if (element.equals("two")) {
        System.out.println("Phần tử ở vị trí " + index + " trong hàng đợi"); // 0
        break;
    }
    index++;
}
```

Trong ví dụ trên, chúng ta đã tạo một đối tượng ArrayDeque, sau đó sử dụng phương thức offer để thêm ba phần tử vào hàng đợi. Tiếp theo, sử dụng phương thức peek để lấy phần tử đầu hàng đợi, sử dụng phương thức poll để xoá phần tử đầu hàng đợi, sử dụng poll và offer để sửa đổi các phần tử trong hàng đợi và sử dụng vòng lặp để tìm kiếm vị trí của phần tử trong hàng đợi.

[Chúng ta đã nói](programming/java/collection/overview.md), LinkedList không chỉ là List, mà còn là Queue, và cũng triển khai interface Deque.

```java
public class LinkedList<E>
    extends AbstractSequentialList<E>
    implements List<E>, Deque<E>, Cloneable, java.io.Serializable
{}
```

Do đó, khi cần sử dụng hàng đợi, bạn cũng có thể chọn LinkedList.

```java
// Tạo đối tượng LinkedList
LinkedList<String> queue = new LinkedList<>();

// Thêm các phần tử
queue.offer("one");
queue.offer("two");
queue.offer("three");
System.out.println(queue); // In ra [one, two, three]

// Xoá các phần tử
queue.poll();
System.out.println(queue); // In ra [two, three]

// Sửa đổi các phần tử: Các phần tử trong LinkedList không thể sửa trực tiếp, cần xoá rồi thêm lại
String first = queue.poll();
queue.offer("王大二");
System.out.println(queue); // In ra [three, 王大二]

// Tìm kiếm các phần tử: Phần tử trong LinkedList có thể sử dụng phương thức get() để tìm kiếm
System.out.println(queue.get(0)); // In ra three
System.out.println(queue.contains("one")); // In ra false

// Tìm kiếm các phần tử: Tìm kiếm three bằng cách sử dụng lặp lại
// Lặp lại để duyệt qua từng phần tử và tìm kiếm three
Iterator<String> iterator = queue.iterator();
while (iterator.hasNext()) {
    String element = iterator.next();
    if (element.equals("three")) {
        System.out.println("Đã tìm thấy: " + element);
        break;
    }
}
```

Khi sử dụng LinkedList làm hàng đợi, bạn có thể sử dụng phương thức offer() để thêm phần tử vào cuối hàng đợi, sử dụng phương thức poll() để xoá phần tử từ đầu hàng đợi, sử dụng vòng lặp hoặc phương thức poll() để duyệt qua các phần tử.

## Giải thích về Stack và Queue

Để hiểu về Stack (ngăn xếp) và Queue (hàng đợi), ta cần bắt đầu từ interface **Deque**. **Deque** viết tắt của "double ended queue", có nghĩa là hàng đợi hai đầu, cho phép thực hiện thêm, xóa và truy vấn phần tử ở cả hai đầu, có thể sử dụng như là Stack và Queue.

### Phương thức tương đương giữa Queue và Deque:

| Phương thức của Queue | Phương thức tương đương của Deque | Mô tả                                   |
| ------------ | ----------------------- | -------------------------------------- |
| add(e)       | addLast(e)              | Thêm phần tử vào cuối hàng đợi, nếu thất bại sẽ ném ra ngoại lệ         |
| offer(e)     | offerLast(e)            | Thêm phần tử vào cuối hàng đợi, nếu thất bại sẽ trả về `false`      |
| remove()     | removeFirst()           | Lấy và xóa phần tử ở đầu hàng đợi, nếu thất bại sẽ ném ra ngoại lệ     |
| poll()       | pollFirst()             | Lấy và xóa phần tử ở đầu hàng đợi, nếu thất bại sẽ trả về `null`   |
| element()    | getFirst()              | Lấy phần tử ở đầu hàng đợi nhưng không xóa, nếu thất bại sẽ ném ra ngoại lệ |
| peek()       | peekFirst()             | Lấy phần tử ở đầu hàng đợi nhưng không xóa, nếu thất bại sẽ trả về `null` |

### Phương thức tương đương giữa Stack và Deque:

| Phương thức của Stack | Phương thức tương đương của Deque | Mô tả                                   |
| ------------ | ----------------------- | -------------------------------------- |
| push(e)      | addFirst(e)             | Thêm phần tử vào đỉnh stack, nếu thất bại sẽ ném ra ngoại lệ         |
|  -           | offerFirst(e)           | Thêm phần tử vào đỉnh stack, nếu thất bại sẽ trả về `false`      |
| pop()        | removeFirst()           | Lấy và xóa phần tử ở đỉnh stack, nếu thất bại sẽ ném ra ngoại lệ     |
|  -           | pollFirst()             | Lấy và xóa phần tử ở đỉnh stack, nếu thất bại sẽ trả về `null`   |
| peek()       | getFirst()              | Lấy phần tử ở đỉnh stack nhưng không xóa, nếu thất bại sẽ ném ra ngoại lệ |
|  -           | peekFirst()             | Lấy phần tử ở đỉnh stack nhưng không xóa, nếu thất bại sẽ trả về `null` |

Cả hai bảng trên định nghĩa tổng cộng 12 phương thức của **Deque**.

Thêm, xóa và truy vấn đều có hai tập phương thức tương đương, chức năng giống nhau nhưng xử lý khác nhau khi gặp lỗi.

**Một tập phương thức sẽ ném ra ngoại lệ khi gặp lỗi, tập phương thức khác sẽ trả về giá trị đặc biệt (`false` hoặc `null`)**. Trừ khi một số triển khai hạn chế về dung lượng, thì hầu hết các thao tác thêm vào đều không thất bại.

**Mặc dù interface Deque có đến 12 phương thức, nhưng tất cả đều xoay quanh việc thao tác với hai đầu của container, thêm, xóa hoặc truy vấn**. Hiểu điều này sẽ giúp việc giảng dạy trở nên đơn giản hơn nhiều.

*ArrayDeque* và *LinkedList* là hai triển khai chung của *Deque*. Do Java khuyến khích sử dụng *ArrayDeque* hơn cho cả Stack và Queue, cộng thêm bài trước đã giới thiệu về [LinkedList](https://javabetter.cn/collection/linkedlist.html), bài viết này sẽ tập trung vào triển khai cụ thể của *ArrayDeque*.

Từ tên, có thể thấy *ArrayDeque* sử dụng mảng làm cơ sở, để đảm bảo có thể thêm, xóa các phần tử ở hai đầu mảng, mảng này cũng phải là mảng vòng (*circular array*), có nghĩa là bất kỳ điểm nào trong mảng cũng có thể được coi là điểm bắt đầu hoặc kết thúc.

*ArrayDeque* không an toàn cho luồng (*non-thread-safe*), nghĩa là khi nhiều luồng sử dụng cùng một lúc, cần đồng bộ hóa thủ công; ngoài ra, container này không cho phép chèn phần tử `null`.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240630101619.png)


Trong hình ảnh trên, ta thấy **`head` chỉ đến phần tử đầu tiên hợp lệ ở đầu, `tail` chỉ đến vị trí trống đầu tiên ở cuối**. Vì đây là mảng vòng, nên `head` không nhất thiết phải luôn bằng 0, và `tail` cũng không nhất thiết lớn hơn `head`.

## 3. Phân tích phương thức

### `addFirst()`

Phương thức `addFirst(E e)` có tác dụng chèn một phần tử vào đầu của `Deque`, tức là ngay trước `head`. Miễn là có đủ không gian và chỉ số không vượt quá ranh giới, chỉ cần gán `elements[--head] = e` là được.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240630101855.png)


Trong thực tế, cần xem xét hai vấn đề:

1. **Khả năng có đủ không gian**: Đảm bảo có đủ không gian.
2. **Ranh giới chỉ số**: Đảm bảo chỉ số không vượt quá ranh giới.

Đoạn mã sau đây giải quyết hai vấn đề này một cách hiệu quả:

```java
// addFirst(E e)
public void addFirst(E e) {
    if (e == null) // Không cho phép chèn null
        throw new NullPointerException();
    elements[head = (head - 1) & (elements.length - 1)] = e; // 2. Ranh giới chỉ số
    if (head == tail) // 1. Khả năng có đủ không gian
        doubleCapacity(); // Tăng dung lượng gấp đôi
}
```

Trong mã trên:
- **Vấn đề không gian** được giải quyết sau khi chèn vì `tail` luôn chỉ đến vị trí trống có thể chèn tiếp theo, nghĩa là mảng `elements` luôn có ít nhất một vị trí trống, do đó không cần phải xem xét vấn đề không gian khi chèn phần tử.

Xử lý ranh giới chỉ số khá đơn giản bằng cách sử dụng `head = (head - 1) & (elements.length - 1)`, đoạn mã này tương đương với lấy phần dư và đồng thời giải quyết trường hợp `head` là số âm. Vì `elements.length` phải là bội số của 2, `elements - 1` là toàn bộ các bit thấp bằng `1`, phép `&` với `head - 1` sẽ giúp lấy phần dư, và nếu `head - 1` là số âm (thực ra chỉ có thể là -1), phép tính này tương đương với lấy bù 2 so với `elements.length`.

Tiếp theo, chúng ta sẽ nói về phương thức mở rộng `doubleCapacity()`, nơi logic là yêu cầu một mảng lớn hơn (gấp đôi mảng ban đầu) và sau đó sao chép mảng ban đầu. Quá trình được minh họa như trong hình sau:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240630101938.png)


Trong hình ảnh này, sao chép được thực hiện thành hai lần, lần đầu tiên sao chép các phần tử bên phải của `head`, lần thứ hai sao chép các phần tử bên trái của `head`.

```java
// doubleCapacity()
private void doubleCapacity() {
    assert head == tail;
    int p = head;
    int n = elements.length;
    int r = n - p; // Số lượng phần tử bên phải của head
    int newCapacity = n << 1; // Dung lượng mới gấp đôi
    if (newCapacity < 0)
        throw new IllegalStateException("Xin lỗi, deque quá lớn");
    Object[] a = new Object[newCapacity];
    System.arraycopy(elements, p, a, 0, r); // Sao chép phần bên phải, tương ứng với vùng màu xanh lá cây trong hình
    System.arraycopy(elements, 0, a, r, p); // Sao chép phần bên trái, tương ứng với vùng màu xám trong hình
    elements = (E[]) a;
    head = 0;
    tail = n;
}
```

Phương thức này đầu tiên kiểm tra head và tail có bằng nhau hay không, nếu không thì ném ra ngoại lệ. Sau đó tính toán số lượng phần tử bên phải của head là r, và dung lượng mới `newCapacity` là `n << 1` (tức là gấp đôi dung lượng hiện tại). Nếu `newCapacity` quá lớn thì ném ra ngoại lệ.

Tiếp theo tạo một mảng Object mới là a với dung lượng `newCapacity`, sao chép các phần tử bên phải của head từ ArrayDeque hiện tại sang a (tức là vùng màu xanh lá cây trong hình), sau đó sao chép các phần tử bên trái của head sang a (tức là vùng màu xám trong hình). Cuối cùng thay thế mảng elements bằng a, đặt head là 0 và tail là n (tức là độ dài dung lượng mới). 

Cần chú ý rằng, do mảng elements đã bị thay thế bằng mảng a, do đó sau khi gọi phương thức, mảng elements ban đầu sẽ không còn được tham chiếu và sẽ được bộ thu gom rác thu hồi.

### `addLast()`

Phương thức `addLast(E e)` có tác dụng chèn một phần tử vào cuối của `Deque`, tức là vào vị trí của `tail`. Vì `tail` luôn chỉ đến vị trí trống có thể chèn tiếp theo, nên chỉ cần gán `elements[tail] = e;` là đủ. Sau khi chèn xong, phương thức kiểm tra xem có đủ không gian không. Nếu không đủ, phương thức gọi đến `doubleCapacity()` để tăng dung lượng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240630102034.png)


```java
public void addLast(E e) {
    if (e == null) // Không cho phép chèn null
        throw new NullPointerException();
    elements[tail] = e; // Gán giá trị
    if ((tail = (tail + 1) & (elements.length - 1)) == head) // Xử lý vượt quá chỉ số
        doubleCapacity(); // Tăng dung lượng
}
```

Xử lý vượt quá chỉ số tương tự như đã trình bày trong `addFirst()`, không cần bàn thêm.

### `pollFirst()`

Phương thức `pollFirst()` có tác dụng là xóa và trả về phần tử đầu tiên của `Deque`, nghĩa là phần tử tại vị trí `head`. Nếu `Deque` không rỗng, chỉ cần trả về `elements[head]`, và sau đó xử lý vấn đề chỉ số. Vì `ArrayDeque` không cho phép chứa `null`, nếu `elements[head] == null`, điều đó có nghĩa là `Deque` đã rỗng.

```java
public E pollFirst() {
    E result = elements[head];
    if (result == null) // Giá trị null cho thấy deque đang rỗng
        return null;
    elements[head] = null; // Cho phép GC làm việc
    head = (head + 1) & (elements.length - 1); // Xử lý vượt quá chỉ số
    return result;
}
```

Phương thức này đầu tiên lấy giá trị tại `head` và gán vào `result`. Nếu `result == null`, nghĩa là `Deque` rỗng và phương thức trả về `null`. Nếu không, phương thức gán `null` vào `elements[head]` để cho phép bộ thu gom rác làm việc. Sau đó xử lý vấn đề vượt quá chỉ số tương tự như đã trình bày trước đó.

### `pollLast()`

Phương thức `pollLast()` có tác dụng là xóa và trả về phần tử cuối cùng của `Deque`, tức là phần tử tại vị trí `tail` phía trước.

```java
public E pollLast() {
    int t = (tail - 1) & (elements.length - 1); // Vị trí phía trước của tail là phần tử cuối cùng
    E result = elements[t];
    if (result == null) // Giá trị null cho thấy deque đang rỗng
        return null;
    elements[t] = null; // Cho phép GC làm việc
    tail = t; // Cập nhật tail
    return result;
}
```

### `peekFirst()`

Phương thức `peekFirst()` có tác dụng là trả về phần tử đầu tiên của `Deque` mà không xóa nó, tức là phần tử tại vị trí `head`. Phương thức trực tiếp trả về `elements[head]`.

```java
public E peekFirst() {
    return elements[head]; // elements[head] là null nếu deque rỗng
}
```

### `peekLast()`

Phương thức `peekLast()` có tác dụng là trả về phần tử cuối cùng của `Deque` mà không xóa nó, tức là phần tử tại vị trí phía trước của `tail`.

```java
public E peekLast() {
    return elements[(tail - 1) & (elements.length - 1)];
}
```

## Tổng kết

ArrayDeque là một cài đặt của Java cho cấu trúc dữ liệu hàng đợi hai đầu (deque), được triển khai dựa trên mảng. Dưới đây là một số tình huống mà bạn có thể sử dụng ArrayDeque:

- Quản lý hàng đợi công việc: Sử dụng ArrayDeque để lưu trữ các công việc trong hàng đợi. Thêm công việc mới vào đầu hàng đợi và lấy công việc từ cuối hàng đợi để xử lý, đảm bảo thực hiện công việc theo thứ tự đầu tiên vào thứ tự đầu tiên ra.
- Triển khai ngăn xếp: ArrayDeque có thể được sử dụng như một cách triển khai ngăn xếp, hỗ trợ các hoạt động như push, pop, peek và những hoạt động này hữu ích trong các tình huống cần xử lý theo cơ chế vào sau ra trước.
- Triển khai bộ đệm (cache): Khi cần lưu trữ một số lượng cố định dữ liệu, ArrayDeque là lựa chọn phù hợp. Khi lượng dữ liệu vượt quá dung lượng, bạn có thể xóa dữ liệu cũ nhất từ đầu hàng đợi và thêm dữ liệu mới vào cuối hàng đợi.
- Triển khai bộ xử lý sự kiện: ArrayDeque có thể được sử dụng như một cách triển khai bộ xử lý sự kiện, hỗ trợ lấy sự kiện từ đầu hàng đợi để xử lý và thêm sự kiện mới vào cuối hàng đợi.

ArrayDeque là một cấu trúc dữ liệu linh hoạt, hỗ trợ nhiều phương thức cơ bản như thêm phần tử, xóa phần tử, lấy phần tử đầu tiên và phần tử cuối cùng của hàng đợi. Nó cũng hỗ trợ các hoạt động giống như ngăn xếp như push, pop, peek. Sử dụng ArrayDeque có thể tối ưu hóa hiệu suất truy cập nhờ vào việc sử dụng mảng liên tục để lưu trữ các phần tử, giúp tận dụng cache CPU một cách hiệu quả hơn so với các cài đặt dựa trên danh sách liên kết.

Khi sử dụng ArrayDeque, cần lưu ý rằng việc thực hiện sao chép mảng khi mở rộng dung lượng có thể ảnh hưởng đến hiệu suất. Tuy nhiên, chiến lược mở rộng của ArrayDeque (nhân đôi dung lượng khi đạt đến dung lượng hiện tại) giúp giảm thiểu số lần sao chép mảng và tối ưu hóa hiệu suất và tận dụng không gian.

ArrayDeque là một công cụ mạnh mẽ trong thư viện chuẩn của Java, phù hợp cho nhiều tình huống lưu trữ và xử lý dữ liệu khác nhau.