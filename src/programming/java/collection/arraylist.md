---
title: Java ArrayList
tags:
  - java
categories:
  - java
order: 2
---

# Chi Tiết về ArrayList (Kèm Mã Nguồn)



ArrayList có thể được coi là một trong những lớp phổ biến nhất trong khung làm việc tập hợp, có thể so sánh với HashMap.

Từ tên gọi, có thể thấy rằng ArrayList triển khai interface List và được triển khai dựa trên mảng.

Kích thước của mảng là cố định, một khi đã được chỉ định khi tạo, thì không thể thay đổi được nữa. Điều này có nghĩa là, nếu mảng đã đầy, bạn sẽ không thể thêm bất kỳ phần tử nào nữa. ArrayList đã thực hiện cơ chế tự động mở rộng dựa trên mảng và cung cấp các phương thức được định nghĩa trước phong phú hơn so với mảng (bao gồm các thao tác thêm, xóa, sửa, truy vấn), rất linh hoạt.

Ngôn ngữ lập trình Java khác với các ngôn ngữ lập trình khác như C ở điểm này. Nếu bạn sử dụng C, bạn sẽ phải tự tay triển khai ArrayList của mình vì thư viện chuẩn không có sẵn.

### 01. Tạo ArrayList

**Làm thế nào để tạo một ArrayList**?

```java
ArrayList<String> alist = new ArrayList<String>();
```

Có thể tạo một ArrayList kiểu chuỗi bằng câu lệnh trên (sử dụng dấu ngoặc nhọn để giới hạn kiểu phần tử trong ArrayList, nếu bạn cố gắng thêm phần tử của kiểu khác, sẽ gây ra lỗi biên dịch), cách viết đơn giản hơn như sau:

```java
List<String> alist = new ArrayList<>();
```

Vì ArrayList triển khai interface List, nên biến alist có thể có kiểu List, dấu ngoặc nhọn sau từ khóa new không cần chỉ định kiểu phần tử vì trình biên dịch có thể suy luận từ kiểu trong dấu ngoặc nhọn phía trước.

Lúc này sẽ gọi phương thức khởi tạo không tham số (xem mã dưới đây) để tạo một mảng rỗng, giá trị của hằng số DEFAULTCAPACITY_EMPTY_ELEMENTDATA là `{}`.

```java
public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}
```

Nếu bạn chắc chắn về số lượng phần tử trong ArrayList, bạn có thể chỉ định kích thước ban đầu khi tạo.

```java
List<String> alist = new ArrayList<>(20);
```

Làm như vậy có lợi ích là có thể tránh việc mở rộng không cần thiết khi thêm phần tử mới.

### 02. Thêm phần tử vào ArrayList

Làm thế nào để thêm một phần tử vào ArrayList**?

Có thể thêm phần tử vào ArrayList bằng phương thức `add()`.

```java
alist.add("Hung");
```

Chúng ta hãy cùng xem mã nguồn của phương thức `add` để xem nó thực hiện những thao tác nào. Quá trình này cũng giúp chúng ta học hỏi cách viết mã một cách tinh tế từ tác giả mã nguồn của Java (một lập trình viên bậc thầy).

Trước hết, tôi sẽ đưa ra một kết luận như một gợi ý:

```
Sơ đồ quá trình ngăn xếp:
add(element)
└── if (size == elementData.length) // Kiểm tra xem có cần mở rộng không
    ├── grow(minCapacity) // Mở rộng
    │   └── newCapacity = oldCapacity + (oldCapacity >> 1) // Tính toán dung lượng mảng mới
    │   └── Arrays.copyOf(elementData, newCapacity) // Tạo mảng mới
    ├── elementData[size++] = element; // Thêm phần tử mới
    └── return true; // Thêm thành công
```

Hãy cùng xem chi tiết, đầu tiên là mã nguồn của phương thức `add()` (đã được thêm chú thích chi tiết):

```java
/**
 * Thêm phần tử được chỉ định vào cuối ArrayList
 * @param e Phần tử cần thêm
 * @return Trả về true nếu thêm thành công
 */
public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Đảm bảo ArrayList có đủ chỗ chứa phần tử mới
    elementData[size++] = e; // Thêm phần tử được chỉ định vào cuối ArrayList
    return true;
}
```

Tham số e là phần tử cần thêm, lúc này giá trị là "Hung", size là độ dài của ArrayList, lúc này là 0.

Tiếp tục, hãy xem phương thức `ensureCapacityInternal()`:

```java
/**
 * Đảm bảo ArrayList có đủ chỗ chứa phần tử có dung lượng được chỉ định
 * @param minCapacity Giá trị nhỏ nhất của dung lượng được chỉ định
 */
private void ensureCapacityInternal(int minCapacity) {
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) { // Nếu elementData vẫn là mảng rỗng mặc định
        minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity); // Sử dụng giá trị lớn hơn giữa DEFAULT_CAPACITY và minCapacity
    }

    ensureExplicitCapacity(minCapacity); // Đảm bảo dung lượng có thể chứa các phần tử có dung lượng được chỉ định
}
```

Lúc này:

- Tham số minCapacity là 1 (giá trị size+1 truyền vào)
- elementData là mảng chứa các phần tử của ArrayList, như đã đề cập trước đó, lúc này là `{}`.
- DEFAULTCAPACITY_EMPTY_ELEMENTDATA cũng là `{}`.

Vì vậy, điều kiện if là đúng, câu lệnh if `minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity)` sẽ được thực hiện.

DEFAULT_CAPACITY là 10 (xem mã dưới đây), nên sau khi thực hiện câu lệnh này, minCapacity là 10. Phương thức `Math.max()` trả về giá trị lớn hơn trong hai giá trị được truyền vào.

```java
private static final int DEFAULT_CAPACITY = 10;
```

Tiếp theo, thực hiện phương thức `ensureExplicitCapacity()` và xem mã nguồn:

```java
/**
 * Kiểm tra và đảm bảo dung lượng của tập hợp đủ, nếu cần thì tăng dung lượng của tập hợp.
 *
 * @param minCapacity Dung lượng tối thiểu cần thiết
 */
private void ensureExplicitCapacity(int minCapacity) {
    // Kiểm tra xem có vượt quá kích thước mảng không, đảm bảo không tràn
    if (minCapacity - elementData.length > 0)
        // Nếu cần tăng dung lượng, gọi phương thức grow
        grow(minCapacity);
}
```

Lúc này:

- Tham số minCapacity là 10
- elementData.length là 0 (mảng rỗng)

Vì vậy 10-0 > 0, điều kiện if là đúng, đi vào câu lệnh if thực hiện phương thức `grow()`, hãy xem mã nguồn:

```java
/**
 * Phương thức mở rộng ArrayList, đảm bảo có thể chứa các phần tử có dung lượng được chỉ định
 * @param minCapacity Giá trị nhỏ nhất của dung lượng được chỉ định
 */
private void grow(int minCapacity) {
    // Kiểm tra xem có gây tràn không, oldCapacity là độ dài hiện tại của mảng
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1); // Mở rộng lên 1.5 lần dung lượng hiện tại
    if (newCapacity - minCapacity < 0) // Nếu vẫn nhỏ hơn dung lượng được chỉ định
        newCapacity = minCapacity; // Mở rộng trực tiếp đến dung lượng được chỉ định
    if (newCapacity - MAX_ARRAY_SIZE > 0) // Nếu vượt quá kích thước mảng tối đa
        newCapacity = hugeCapacity(minCapacity); // Mở rộng đến kích thước mảng tối đa
    // Sao chép mảng hiện tại vào một mảng mới với độ dài là newCapacity
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

Lúc này:

- Tham số minCapacity là 10
- Biến oldCapacity là 0

Vì vậy, newCapacity cũng là 0, `newCapacity - minCapacity` bằng -10 nhỏ hơn 0, điều kiện if đầu tiên là đúng, thực hiện câu lệnh `newCapacity = minCapacity`, sau đó newCapacity là 10.

Tiếp theo, thực hiện câu lệnh `elementData = Arrays.copyOf(elementData, newCapacity)`, nghĩa là mảng được mở rộng lần đầu tiên với độ dài là 10.

Quay lại phương thức `add()`:

```java
public boolean add(E e) {
    ensureCapacityInternal(size + 1);
    elementData[size++] = e;
    return true;
}
```

Thực hiện câu lệnh `elementData[size++] = e`.

Lúc này:

- size là 0
- e là "Hung"

Vì vậy, phần tử đầu tiên của mảng (chỉ số là 0) được gán giá trị "Hung", sau đó trả về true, hoàn thành lần thực thi đầu tiên của phương thức add.

PS: Trong quá trình add, có một toán tử dịch phải `>>` thường làm người mới cảm thấy bối rối, nhân dịp này giải thích thêm một chút.

ArrayList sẽ mở rộng lần đầu tiên sau khi thực hiện lệnh add, mở rộng thành 10, vậy lần mở rộng thứ hai của ArrayList sẽ xảy ra khi nào?

Câu trả lời là khi thêm phần tử thứ 11, mọi người có thể thử phân tích quá trình này.

### 03. Toán tử dịch phải

OldCapacity bằng 10, biểu thức `oldCapacity >> 1` bằng bao nhiêu?

"`>>` là toán tử dịch phải, `oldCapacity >> 1` tương đương với oldCapacity chia cho 2. Trong máy tính, mọi thứ được lưu trữ dưới dạng nhị phân, 10 trong nhị phân là 1010, cũng chính là `0*2^0 + 1*2^1 + 0*2^2 + 1*2^3` = 0 + 2 + 0 + 8 = 10."

Hãy bắt đầu với khái niệm giá trị vị trí.

Chúng ta thường sử dụng số thập phân, chẳng hạn như 39, không chỉ đơn giản là số 3 và 9, mà 3 đại diện cho `3*10 = 30`, 9 đại diện cho `9*1 = 9`, số 10 nhân với 3 và số 1 nhân với 9 chính là **giá trị vị trí**. Vị trí khác nhau, giá trị vị trí cũng khác nhau, vị trí đầu tiên là 10^0 (tức là `10^0=1`), vị trí thứ hai là 10^1 (tức là `10^1=10`), vị trí thứ ba là 10^2 (tức là `10^2=100`), từ phải sang trái.

Khái niệm giá trị vị trí cũng áp dụng cho nhị phân, vị trí đầu tiên là 2^0 (tức là `2^0=1`), vị trí thứ hai là 2^1 (tức là `2^1=2`), vị trí thứ ba là 2^2 (tức là `2^2=4`), vị trí thứ tư là 2^3 (tức là `2^3=8`).

Trong thập phân, 10 là cơ số, trong nhị phân, 2 là cơ số.

10 trong hệ thập phân được biểu diễn là `0*10^0 + 1*10^1` = 0 + 10 = 10.

10 trong hệ nhị phân là 1010, tức là `0*2^0 + 1*2^1 + 0*2^2 + 1*2^3` = 0 + 2 + 0 + 8 = 10.

Tiếp theo là **toán tử dịch**, dịch có thể là dịch trái và dịch phải, trong Java, toán tử dịch trái là `<<`, toán tử dịch phải là `>>`.

Hãy lấy `oldCapacity >> 1` làm ví dụ, `>>` bên trái là giá trị cần dịch, trong trường hợp này là 10, tức là nhị phân `1010`; `>>` bên phải là số lượng bit cần dịch, trong trường hợp này là 1.

Dịch 1010 sang phải một vị trí là 101, vị trí cao nhất được bổ sung 0, tức là 0101.

"Tại sao không bổ sung 1?"

"Vì đây là dịch phải số học, và số dương, nên vị trí cao nhất được bổ sung 0; nếu là số âm, cần bổ sung 1. 0101 trong hệ thập phân chính là `1*2^0 + 0*2^1 + 1*2^2 + 0*2^3` = 1 + 0 + 4 + 0 = 5, nếu dịch thêm vài số, bạn sẽ thấy rằng, dịch phải 1 vị trí tương đương với giá trị ban đầu chia cho 2, dịch phải 2 vị trí tương đương với giá trị ban đầu chia cho 4, và tương tự."

Nói cách khác, kích thước của ArrayList sẽ mở rộng thành kích thước ban đầu + kích thước ban đầu chia cho 2, tức là 1.5 lần.

### 04. Thêm phần tử vào vị trí chỉ định trong ArrayList

Ngoài phương thức `add(E e)`, còn có thể thêm phần tử vào vị trí chỉ định trong ArrayList bằng phương thức `add(int index, E element)`:

```java
alist.add(0, "Hung");
```

Dưới đây là mã nguồn của phương thức `add(int index, E element)`:

```java
/**
 * Chèn một phần tử vào vị trí chỉ định.
 *
 * @param index   Vị trí chèn phần tử
 * @param element Phần tử cần chèn
 * @throws IndexOutOfBoundsException Nếu chỉ số vượt quá giới hạn, ngoại lệ này sẽ được ném ra
 */
public void add(int index, E element) {
    rangeCheckForAdd(index); // Kiểm tra xem chỉ số có vượt quá giới hạn hay không

    ensureCapacityInternal(size + 1);  // Đảm bảo dung lượng đủ, nếu cần sẽ mở rộng
    System.arraycopy(elementData, index, elementData, index + 1,
            size - index); // Di chuyển các phần tử từ vị trí index và sau đó sang phải một vị trí
    elementData[index] = element; // Chèn phần tử vào vị trí chỉ định
    size++; // Tăng số lượng phần tử lên một
}
```

Phương thức `add(int index, E element)` sẽ gọi một phương thức quan trọng `System.arraycopy()`, thực hiện việc sao chép mảng (di chuyển các phần tử từ vị trí chỉ định trở đi sang phải một vị trí).

Hãy cùng xem xét chi tiết.

Đây là cú pháp của `arraycopy()`:

```java
System.arraycopy(Object src, int srcPos, Object dest, int destPos, int length);
```

Trong phương thức `ArrayList.add(int index, E element)`, cách sử dụng cụ thể như sau:

```java
System.arraycopy(elementData, index, elementData, index + 1, size - index);
```

- `elementData`: là mảng nguồn, tức là mảng chứa các phần tử trong ArrayList.
- `index`: là vị trí bắt đầu sao chép trong mảng nguồn, tức là vị trí cần di chuyển các phần tử từ đó trở đi sang phải một vị trí.
- `elementData`: là mảng đích, tức là mảng chứa các phần tử trong ArrayList.
- `index + 1`: là vị trí bắt đầu sao chép trong mảng đích, tức là vị trí sau khi di chuyển các phần tử từ đó sang phải một vị trí.
- `size - index`: là số lượng phần tử cần sao chép, tức là số lượng phần tử từ vị trí `index` đến phần tử cuối cùng.

Các phần tử từ vị trí chỉ định trở đi được di chuyển sang phải một vị trí, sau đó phần tử mới được chèn vào vị trí chỉ định.

Qua ví dụ này, bạn đã hiểu cách thức hoạt động của phương thức `add(int index, E element)` và cách mà `System.arraycopy()` di chuyển các phần tử trong mảng. Nếu có bất kỳ thắc mắc nào, hãy để lại câu hỏi nhé!

### 05. Cập nhật phần tử trong ArrayList

Làm thế nào để **cập nhật phần tử trong ArrayList**?

Có thể sử dụng phương thức `set()` để thay đổi phần tử trong ArrayList, cần cung cấp chỉ số và phần tử mới.

```java
alist.set(0, "Zero");
```

Giả sử phần tử ở vị trí 0 ban đầu là "One", bây giờ có thể cập nhật nó thành "Zero".

Hãy xem mã nguồn của phương thức `set()`:

```java
/**
 * Thay thế phần tử tại vị trí chỉ định bằng phần tử chỉ định.
 *
 * @param index   Chỉ số của phần tử cần thay thế
 * @param element Phần tử sẽ được lưu trữ tại vị trí chỉ định
 * @return Phần tử trước đó tại vị trí chỉ định
 * @throws IndexOutOfBoundsException Nếu chỉ số vượt quá giới hạn, ngoại lệ này sẽ được ném ra
 */
public E set(int index, E element) {
    rangeCheck(index); // Kiểm tra xem chỉ số có vượt quá giới hạn hay không

    E oldValue = elementData(index); // Lấy phần tử cũ tại vị trí chỉ định
    elementData[index] = element; // Thay thế phần tử mới tại vị trí chỉ định
    return oldValue; // Trả về phần tử cũ
}
```

Phương thức này sẽ kiểm tra xem chỉ số có vượt quá giới hạn hay không, sau đó thay thế phần tử cũ bằng phần tử mới và trả về phần tử cũ.

Trong phương thức `set()`, `rangeCheck(index)` sẽ được gọi để kiểm tra xem chỉ số có hợp lệ hay không:

```java
/**
 * Kiểm tra chỉ số, nếu vượt quá giới hạn sẽ ném ra ngoại lệ.
 *
 * @param index Chỉ số cần kiểm tra
 * @throws IndexOutOfBoundsException Nếu chỉ số vượt quá giới hạn, ngoại lệ này sẽ được ném ra
 */
private void rangeCheck(int index) {
    if (index >= size)
        throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
}
```

Nếu chỉ số vượt quá kích thước hiện tại của ArrayList, sẽ ném ra ngoại lệ `IndexOutOfBoundsException`.

Ví dụ, nếu ArrayList `alist` chứa các phần tử sau:

```java
ArrayList<String> alist = new ArrayList<>(Arrays.asList("One", "Two", "Three"));
```

Khi gọi `alist.set(0, "Zero")`, quá trình diễn ra như sau:

1. Gọi `rangeCheck(0)` để kiểm tra chỉ số 0 có hợp lệ không.
2. Lấy phần tử cũ tại chỉ số 0, "One".
3. Thay thế phần tử tại chỉ số 0 bằng "Zero".
4. Trả về phần tử cũ "One".

Sau khi cập nhật, ArrayList `alist` sẽ chứa các phần tử sau:

```java
["Zero", "Two", "Three"]
```

Đây là cách cập nhật phần tử trong ArrayList bằng phương thức `set()`. Nếu bạn có thắc mắc nào, hãy để lại câu hỏi nhé!

### 06. Xóa phần tử trong ArrayList

Làm thế nào để **xóa phần tử trong ArrayList**?

Có thể sử dụng phương thức `remove(int index)` để xóa phần tử tại chỉ số cụ thể, và `remove(Object o)` để xóa phần tử có giá trị cụ thể.

```java
alist.remove(1);
alist.remove("Three");
```

Hãy xem mã nguồn của phương thức `remove(int index)`:

```java
/**
 * Xóa phần tử tại vị trí chỉ định.
 *
 * @param index Chỉ số của phần tử cần xóa
 * @return Phần tử trước đó tại vị trí chỉ định
 * @throws IndexOutOfBoundsException Nếu chỉ số vượt quá giới hạn, ngoại lệ này sẽ được ném ra
 */
public E remove(int index) {
    rangeCheck(index); // Kiểm tra xem chỉ số có vượt quá giới hạn hay không

    E oldValue = elementData(index); // Lấy phần tử cũ tại vị trí chỉ định

    int numMoved = size - index - 1; // Tính toán số phần tử cần di chuyển
    if (numMoved > 0) // Nếu cần di chuyển phần tử, sử dụng phương thức System.arraycopy
        System.arraycopy(elementData, index + 1, elementData, index, numMoved);
    elementData[--size] = null; // Đặt phần tử cuối cùng trong mảng thành null để cho GC thu hồi bộ nhớ

    return oldValue; // Trả về phần tử đã bị xóa
}
```

Khi xóa phần tử trong ArrayList, cần di chuyển các phần tử sau vị trí xóa lên trước một vị trí để lấp chỗ trống. Nếu cần di chuyển phần tử, sử dụng phương thức `System.arraycopy`. Cuối cùng, đặt phần tử cuối cùng trong mảng thành null để cho garbage collector thu hồi bộ nhớ.

Hãy xem mã nguồn của phương thức `remove(Object o)`:

```java
/**
 * Xóa lần xuất hiện đầu tiên của phần tử chỉ định trong danh sách (nếu có).
 *
 * @param o Phần tử cần xóa
 * @return Nếu danh sách chứa phần tử chỉ định, trả về true; ngược lại trả về false
 */
public boolean remove(Object o) {
    if (o == null) { // Nếu phần tử cần xóa là null
        for (int index = 0; index < size; index++) // Duyệt qua danh sách
            if (elementData[index] == null) { // Nếu tìm thấy phần tử null
                fastRemove(index); // Gọi phương thức fastRemove để xóa nhanh
                return true; // Trả về true, biểu thị đã xóa thành công
            }
    } else { // Nếu phần tử cần xóa không phải là null
        for (int index = 0; index < size; index++) // Duyệt qua danh sách
            if (o.equals(elementData[index])) { // Nếu tìm thấy phần tử cần xóa
                fastRemove(index); // Gọi phương thức fastRemove để xóa nhanh
                return true; // Trả về true, biểu thị đã xóa thành công
            }
    }
    return false; // Nếu không tìm thấy phần tử cần xóa, trả về false
}
```

Phương thức này duyệt qua danh sách để tìm phần tử cần xóa. Nếu phần tử cần xóa là null, sử dụng toán tử `==` để so sánh; nếu không, sử dụng phương thức `equals()`. Sau đó, gọi phương thức `fastRemove()` để xóa phần tử.

**Lưu ý:**
- Nếu có các phần tử trùng lặp, chỉ phần tử xuất hiện đầu tiên sẽ bị xóa.
- Để biết thêm về cách so sánh hai chuỗi trong Java, tham khảo [Java String Equals](/programming/java/string/equals).

Tiếp tục, hãy xem mã nguồn của phương thức `fastRemove()`:

```java
/**
 * Xóa nhanh phần tử tại vị trí chỉ định.
 *
 * @param index Chỉ số của phần tử cần xóa
 */
private void fastRemove(int index) {
    int numMoved = size - index - 1; // Tính toán số phần tử cần di chuyển
    if (numMoved > 0) // Nếu cần di chuyển phần tử, sử dụng phương thức System.arraycopy
        System.arraycopy(elementData, index + 1, elementData, index, numMoved);
    elementData[--size] = null; // Đặt phần tử cuối cùng trong mảng thành null để cho GC thu hồi bộ nhớ
}
```

Phương thức này cũng sử dụng `System.arraycopy()` để di chuyển các phần tử trong mảng.

### 07. Tìm kiếm phần tử trong ArrayList

Làm thế nào để **tìm kiếm phần tử trong ArrayList**?

Nếu muốn tìm kiếm phần tử theo thứ tự từ đầu đến cuối, có thể sử dụng phương thức `indexOf()`; nếu muốn tìm kiếm theo thứ tự ngược lại, có thể sử dụng phương thức `lastIndexOf()`.

```java
alist.indexOf("Two");
alist.lastIndexOf("Two");
```

Hãy xem mã nguồn của phương thức `indexOf()`:

```java
/**
 * Trả về vị trí xuất hiện đầu tiên của phần tử chỉ định trong danh sách.
 * Nếu danh sách không chứa phần tử đó, trả về -1.
 *
 * @param o Phần tử cần tìm kiếm
 * @return Vị trí xuất hiện đầu tiên của phần tử chỉ định; nếu danh sách không chứa phần tử đó, trả về -1
 */
public int indexOf(Object o) {
    if (o == null) { // Nếu phần tử cần tìm kiếm là null
        for (int i = 0; i < size; i++) // Duyệt qua danh sách
            if (elementData[i] == null) // Nếu tìm thấy phần tử null
                return i; // Trả về chỉ số của phần tử
    } else { // Nếu phần tử cần tìm kiếm không phải là null
        for (int i = 0; i < size; i++) // Duyệt qua danh sách
            if (o.equals(elementData[i])) // Nếu tìm thấy phần tử cần tìm
                return i; // Trả về chỉ số của phần tử
    }
    return -1; // Nếu không tìm thấy phần tử, trả về -1
}
```

Nếu phần tử cần tìm là null, sử dụng toán tử `==` để so sánh; nếu không, sử dụng phương thức `equals()`.

Phương thức `lastIndexOf()` tương tự như `indexOf()`, nhưng duyệt qua danh sách từ cuối lên đầu:

```java
/**
 * Trả về vị trí xuất hiện cuối cùng của phần tử chỉ định trong danh sách.
 * Nếu danh sách không chứa phần tử đó, trả về -1.
 *
 * @param o Phần tử cần tìm kiếm
 * @return Vị trí xuất hiện cuối cùng của phần tử chỉ định; nếu danh sách không chứa phần tử đó, trả về -1
 */
public int lastIndexOf(Object o) {
    if (o == null) { // Nếu phần tử cần tìm kiếm là null
        for (int i = size - 1; i >= 0; i--) // Duyệt qua danh sách từ cuối lên đầu
            if (elementData[i] == null) // Nếu tìm thấy phần tử null
                return i; // Trả về chỉ số của phần tử
    } else { // Nếu phần tử cần tìm kiếm không phải là null
        for (int i = size - 1; i >= 0; i--) // Duyệt qua danh sách từ cuối lên đầu
            if (o.equals(elementData[i])) // Nếu tìm thấy phần tử cần tìm
                return i; // Trả về chỉ số của phần tử
    }
    return -1; // Nếu không tìm thấy phần tử, trả về -1
}
```

Phương thức `contains()` có thể kiểm tra xem ArrayList có chứa phần tử nào đó hay không, nội bộ của phương thức này sử dụng `indexOf()`:

```java
public boolean contains(Object o) {
    return indexOf(o) >= 0;
}
```

Phương thức `contains()` trả về `true` nếu phần tử xuất hiện trong danh sách và `false` nếu không tìm thấy phần tử đó.

Vậy là, với `indexOf()` và `lastIndexOf()`, em có thể dễ dàng tìm kiếm phần tử trong ArrayList theo thứ tự mong muốn, và `contains()` giúp kiểm tra nhanh xem phần tử có tồn tại hay không.

### 08. Phương pháp tìm kiếm nhị phân

Nếu các phần tử trong `ArrayList` đã được sắp xếp, bạn có thể sử dụng phương pháp tìm kiếm nhị phân để tìm kiếm một cách hiệu quả hơn.

Phương thức `sort()` của lớp [`Collections`](/programming/java/common-tool/collections) cho phép sắp xếp `ArrayList`, phương thức này sẽ sắp xếp các phần tử kiểu `String` theo thứ tự từ điển. Nếu là các kiểu dữ liệu tùy chỉnh, bạn có thể chỉ định một `Comparator` để sắp xếp.

Dưới đây là một ví dụ đơn giản, các chi tiết sẽ được giải thích kỹ hơn ở phần sau:

```java
List<String> copy = new ArrayList<>(alist);
copy.add("a");
copy.add("c");
copy.add("b");
copy.add("d");

Collections.sort(copy);
System.out.println(copy);
```

Kết quả đầu ra sau khi sắp xếp là:

```
[a, b, c, d]
```

Sau khi sắp xếp, bạn có thể sử dụng tìm kiếm nhị phân để tìm kiếm các phần tử:

```java
int index = Collections.binarySearch(copy, "b");
```

### 09. Độ phức tạp thời gian khi thêm, xóa, sửa và truy vấn trong ArrayList

Cuối cùng, chúng ta sẽ đơn giản tổng kết về độ phức tạp thời gian của các thao tác cơ bản trên ArrayList, để sau này có thể so sánh với LinkedList.

#### 1) Truy vấn (Query)

Độ phức tạp thời gian: O(1)

ArrayList sử dụng một mảng để lưu trữ các phần tử bên trong, do đó có thể truy cập trực tiếp vào phần tử bằng chỉ số.

```java
/**
 * Trả về phần tử tại vị trí chỉ định trong danh sách.
 *
 * @param index Chỉ số của phần tử cần trả về
 * @return Phần tử tại vị trí chỉ định trong danh sách
 * @throws IndexOutOfBoundsException Nếu chỉ số vượt ra ngoài phạm vi (index < 0 hoặc index >= size())
 */
public E get(int index) {
    rangeCheck(index); // Kiểm tra xem chỉ số có hợp lệ không
    return elementData(index); // Gọi phương thức elementData để lấy phần tử
}

/**
 * Trả về phần tử tại vị trí chỉ định trong danh sách.
 * Phương thức này không kiểm tra ranh giới, chỉ nên được gọi bởi các phương thức nội bộ và vòng lặp.
 *
 * @param index Chỉ số của phần tử cần trả về
 * @return Phần tử tại vị trí chỉ định trong danh sách
 */
E elementData(int index) {
    return (E) elementData[index]; // Trả về phần tử tại vị trí chỉ định trong mảng
}
```

#### 2) Chèn (Insert)

Độ phức tạp thời gian khi chèn một phần tử (thực hiện bằng phương thức `add()`):

- Trường hợp tốt nhất: O(1) - khi chèn vào cuối danh sách.
- Trường hợp xấu nhất: O(n) - khi chèn vào giữa hoặc đầu danh sách, vì phải di chuyển các phần tử phía sau một vị trí.

#### 3) Xóa (Delete)

Độ phức tạp thời gian khi xóa một phần tử (thực hiện bằng phương thức `remove(Object)`):

- Trường hợp tốt nhất: O(1) - khi xóa phần tử ở cuối danh sách.
- Trường hợp xấu nhất: O(n) - khi xóa phần tử ở giữa hoặc đầu danh sách, vì phải di chuyển các phần tử phía sau một vị trí.

```java
/**
 * Xóa phần tử tại vị trí chỉ định trong danh sách.
 *
 * @param index Chỉ số của phần tử cần xóa
 * @return Phần tử đã bị xóa ở vị trí chỉ định
 * @throws IndexOutOfBoundsException Nếu chỉ số vượt ra ngoài phạm vi (index < 0 hoặc index >= size())
 */
public E remove(int index) {
    rangeCheck(index); // Kiểm tra xem chỉ số có hợp lệ không

    E oldValue = elementData(index); // Lấy phần tử cần xóa

    int numMoved = size - index - 1; // Số lượng phần tử cần di chuyển
    if (numMoved > 0) // Nếu cần di chuyển các phần tử
        System.arraycopy(elementData, index + 1, elementData, index, numMoved);

    elementData[--size] = null; // Đặt phần tử cuối cùng trong mảng là null để GC có thể thu dọn

    return oldValue; // Trả về phần tử đã bị xóa
}
```

#### 4) Sửa đổi (Update)

Độ phức tạp thời gian khi sửa đổi một phần tử (thực hiện bằng phương thức `set()`):

- Độ phức tạp: O(1)

```java
/**
 * Thay thế phần tử tại vị trí chỉ định trong danh sách bằng một phần tử mới.
 *
 * @param index Chỉ số của phần tử cần thay thế
 * @param element Phần tử mới cần đặt vào danh sách
 * @return Phần tử cũ ở vị trí chỉ định
 * @throws IndexOutOfBoundsException Nếu chỉ số vượt ra ngoài phạm vi (index < 0 hoặc index >= size())
 */
public E set(int index, E element) {
    rangeCheck(index); // Kiểm tra xem chỉ số có hợp lệ không

    E oldValue = elementData(index); // Lấy phần tử cũ tại vị trí chỉ định
    elementData[index] = element; // Đặt phần tử mới vào vị trí chỉ định

    return oldValue; // Trả về phần tử cũ tại vị trí chỉ định
}
```

Đây là những điều cơ bản về độ phức tạp thời gian của các thao tác trên ArrayList. Điều này giúp bạn hiểu rõ hơn về hiệu suất của ArrayList so với LinkedList trong các tình huống khác nhau.

### 10. Tổng kết

ArrayList, nếu phải có một tên tiếng Việt, thì có thể gọi là "Mảng Động", tức là một mảng có thể mở rộng, có thể điều chỉnh kích thước. Mảng động khắc phục được những hạn chế của mảng tĩnh, trong đó dung lượng là cố định và chỉ có thể chỉ định vào lúc tạo ra lần đầu. Mảng động sẽ tự động điều chỉnh kích thước khi số lượng phần tử tăng lên, phù hợp hơn với các yêu cầu phát triển thực tế.

Khi học về khung dữ liệu (collection framework), ArrayList là bài học đầu tiên và cũng là một trong những bài học quan trọng để các bạn mới tiến bộ hơn. Để hoàn toàn nắm được ArrayList, việc hiểu cơ chế mở rộng (resizing) là điều cần thiết, cũng là một chủ đề thường được kiểm tra trong phỏng vấn.

Để hiểu rõ cơ chế mở rộng, bạn cần phải đọc mã nguồn (source code), và khi đó bạn sẽ gặp phải `oldCapacity >> 1`. Một số người học mới có thể bỏ qua điều này, mặc dù điều này không ảnh hưởng đến việc học toàn diện, nhưng họ đã bỏ lỡ một cơ hội để nâng cao trình độ.

Làm thế nào máy tính biểu diễn số thập phân bên trong của nó, và những gì xảy ra khi dịch chuyển sang phải (right shift), nếu bạn cố gắng nghiên cứu kỹ, bạn sẽ phát hiện ra, "Ồ, cái này thật thú vị nhỉ?"
