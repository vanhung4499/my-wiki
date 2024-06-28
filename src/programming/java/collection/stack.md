---
title: Java Stack
tags:
  - java
categories:
  - java
order: 4
---
# Ngăn xếp (Stack)

Thực tế mà nói, lớp Stack trong Java không phổ biến trong ứng dụng, nhưng cấu trúc dữ liệu ngăn xếp lại rất quan trọng trong toàn hệ thống máy tính. Vì vậy, chúng ta hãy tìm hiểu về nó trong [Collection Overview](/programming/java/collection/overview).

### Cấu trúc dữ liệu ngăn xếp

Ngăn xếp (Stack), tôi thực sự không thích vì dễ gây nhầm lẫn với stack (vùng nhớ), đặc biệt đối với người mới, thật là một điều khó chịu.

Ngăn xếp là một cấu trúc dữ liệu rất hữu ích, giống như một chồng đĩa, đĩa đầu tiên được đặt dưới cùng, đĩa thứ hai được đặt lên trên đĩa đầu tiên, đĩa thứ ba được đặt lên đĩa thứ hai, và đĩa cuối cùng được đặt lên cùng cấp đĩa thứ hai.
![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/202406212357467.png)

Với chồng đĩa này, chúng ta có thể làm hai việc:

- Đặt một đĩa mới lên trên cùng.
- Lấy đi đĩa trên cùng.

Cả hai việc này đều rất dễ thực hiện, nhưng nếu muốn lấy đĩa từ giữa hoặc từ đáy, thì thật là khó khăn. Nếu muốn lấy đĩa từ đáy cần phải lấy hết tất cả các đĩa trên đầu, như thế được gọi là LIFO - "Last In First Out" - cái gì mới cuối cùng được đưa vào là cái đầu tiên bị lấy ra.

Với cấu trúc dữ liệu ngăn xếp này, nó có hai hành động phổ biến:

- push, có nghĩa là "đẩy vào" trong tiếng Việt, tôi thích cách diễn đạt này. Khi chúng ta muốn đặt một phần tử vào đỉnh của ngăn xếp, hành động này được gọi là push.
- pop, tôi cũng thích gọi là "lấy ra", có một sự hiệu ứng động họa rất mạnh, có phải không? Khi chúng ta muốn loại bỏ một phần tử từ ngăn xếp, hành động này được gọi là pop.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/202406212357430.png)
Trong hình trên, phần tử 3 được đặt vào cuối cùng nhưng lại được lấy ra đầu tiên - theo nguyên tắc LIFO.

Sau khi hiểu được các hoạt động cơ bản của ngăn xếp, chúng ta cần suy nghĩ sâu hơn về cách ngăn xếp hoạt động. Nói cách khác, để ngăn xếp này hoạt động theo cách của nó, nó cần những gì?

1) Ngăn xếp cần có một con trỏ, chúng ta gọi là `TOP`, để chỉ đến phần tử đầu tiên ở đỉnh ngăn xếp.

2) Khi chúng ta khởi tạo một ngăn xếp, chúng ta đặt giá trị của `TOP` là `-1`, điều này cho phép chúng ta kiểm tra xem ngăn xếp có trống không bằng cách sử dụng `TOP == -1`.

3) Khi chúng ta muốn nhấn một phần tử vào ngăn xếp, chúng ta tăng giá trị của `TOP` lên 1, sau đó đặt phần tử mới được nhấn vào `TOP`.

4) Khi chúng ta muốn lấy ra một phần tử từ ngăn xếp, chúng ta giảm giá trị của `TOP` đi 1, sau đó lấy phần tử ở đỉnh ngăn xếp.

5) Khi chúng ta nhấn một phần tử vào, chúng ta cần kiểm tra xem ngăn xếp đã đầy chưa. Nghĩa là, cần có một phương thức `isFull()` để kiểm tra.

6) Khi chúng ta muốn lấy ra một phần tử, chúng ta cũng cần kiểm tra xem ngăn xếp có trống không. Nghĩa là, cần có một phương thức `isEmpty()` để kiểm tra.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/202406212358997.png)
Khi ngăn xếp rỗng, `TOP` bằng -1; khi đặt phần tử 1 vào ngăn xếp, `stack[0]` là 1, `TOP` tăng lên 1 trở thành 0; khi đặt phần tử 2 vào ngăn xếp, `stack[1]` là 2, `TOP` tăng lên 1 trở thành 1; khi đặt phần tử 3 vào ngăn xếp, `stack[2]` là 3, `TOP` tăng lên 1 trở thành 2; khi lấy phần tử 3 ra khỏi ngăn xếp, trả về phần tử `stack[2]`, `TOP` giảm xuống 1 trở thành 1.

### Tự xây dựng ngăn xếp

Giả sử các phần tử trong ngăn xếp là kiểu int, chúng ta có thể tự xây dựng một ngăn xếp đơn giản nhất bằng ngôn ngữ Java. Ngăn xếp này sẽ có 3 trường:

- `int arr[]`: Mảng kiểu int để lưu trữ dữ liệu.
- `int top`: Một chỉ số kiểu int để đánh dấu đỉnh của ngăn xếp.
- `int capacity`: Dung lượng của ngăn xếp.

```java
class Stack {
    private int arr[];
    private int top;
    private int capacity;

    // Khởi tạo ngăn xếp
    Stack(int size) {
        arr = new int[size];
        capacity = size;
        top = -1;
    }

    // Thêm phần tử vào ngăn xếp
    public void push(int x) {
        if (isFull()) {
            System.out.println("Ngăn xếp đầy\nChương trình kết thúc\n");
            System.exit(1);
        }
        
        System.out.println("Đẩy " + x);
        arr[++top] = x;
    }

    // Lấy phần tử từ ngăn xếp
    public int pop() {
        if (isEmpty()) {
            System.out.println("Ngăn xếp trống");
            System.exit(1);
        }
        return arr[top--];
    }

    // Trả về kích thước của ngăn xếp
    public int size() {
        return top + 1;
    }

    // Kiểm tra xem ngăn xếp có rỗng không
    public boolean isEmpty() {
        return top == -1;
    }

    // Kiểm tra xem ngăn xếp đã đầy chưa
    public boolean isFull() {
        return top == capacity - 1;
    }

    // In ra các phần tử trong ngăn xếp
    public void printStack() {
        for (int i = 0; i <= top; i++) {
            System.out.println(arr[i]);
        }
    }

    // Hàm main để kiểm tra
    public static void main(String[] args) {
        Stack stack = new Stack(5);

        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.push(4);

        stack.pop();
        System.out.println("\nSau khi pop");

        stack.printStack();
    }
}
```

Kết quả in ra sẽ như sau:

```
Đẩy 1
Đẩy 2
Đẩy 3
Đẩy 4

Sau khi pop
1
2
3
```

Vì chúng ta sử dụng một mảng để triển khai ngăn xếp, nên thời gian thực thi của các phương thức `push` và `pop` là `O(1)`.

Mặc dù ngăn xếp là một cấu trúc dữ liệu rất đơn giản và dễ triển khai như trên, nhưng lại rất mạnh mẽ và có thể áp dụng trong nhiều tình huống khác nhau như:

1. **Đảo ngược một chuỗi ký tự**: Do ngăn xếp là LIFO, nên việc đảo ngược một chuỗi ký tự rất dễ dàng. Chỉ cần đưa các ký tự theo thứ tự thông thường vào ngăn xếp, sau đó lấy ra theo thứ tự ngược lại.

2. **Sử dụng trong máy tính**: Khi thực hiện một biểu thức phức tạp như `2 + 5 / 3 * (6 - 2)`, cần sử dụng ngăn xếp để chứa các số và toán tử, sau đó thực hiện tính toán theo mức độ ưu tiên.

3. **Sử dụng trong trình duyệt**: Nút quay lại của trình duyệt sẽ đưa các URL đã truy cập vào một ngăn xếp. Mỗi khi truy cập một trang mới, URL mới sẽ được đưa vào đầu ngăn xếp; khi người dùng chọn quay lại, URL mới nhất sẽ được loại bỏ và URL trước đó sẽ được truy cập lại.

Như vậy, dù là một cấu trúc dữ liệu đơn giản nhưng ngăn xếp có thể áp dụng rộng rãi và mang lại nhiều lợi ích trong lập trình.

### Lớp Stack

Trong Java, lớp `java.util.Stack` đã cung cấp sẵn một cài đặt cho cấu trúc dữ liệu ngăn xếp. Lớp này kế thừa từ `Vector` và là một cấu trúc dữ liệu an toàn cho luồng (thread-safe), tương tự như `StringBuffer`, nhưng dễ hiểu hơn một chút.

Đầu tiên, chúng ta xem qua một ví dụ đơn giản về cách sử dụng lớp `Stack`:

```java
Stack<String> stack = new Stack<>();
stack.push("Hung Dev");
stack.push("Hung Nguyen");
stack.push("A programmer with a truly interesting article");

System.out.println(stack);
```

Lớp `Stack` không phức tạp, chỉ có một vài phương thức quan trọng như `push`, `pop`, `peek`, `empty`, `search` và một số phương thức khác.

Chúng ta hãy xem mã nguồn của phương thức `push`:

```java
public E push(E item) {
    addElement(item);
    return item;
}
```

Mặc dù phương thức `push` không có từ khoá `synchronized`, nhưng nó gọi phương thức `addElement` của lớp `Vector`, phương thức này đã có từ khoá `synchronized`.

```java
public synchronized void addElement(E obj) {
    modCount++;
    ensureCapacityHelper(elementCount + 1);
    elementData[elementCount++] = obj;
}
```

Tiếp theo, chúng ta xem mã nguồn của phương thức `pop`:

```java
public synchronized E pop() {
    E obj;
    int len = size();

    obj = peek();
    removeElementAt(len - 1);

    return obj;
}
```

Phương thức này có từ khoá `synchronized`, và nó trước tiên gọi phương thức `peek` để lấy phần tử ở đỉnh ngăn xếp:

```java
public synchronized E peek() {
    int len = size();

    if (len == 0)
        throw new EmptyStackException();
    return elementAt(len - 1);
}
```

Sau đó, nó gọi phương thức `removeElementAt` của lớp `Vector` để loại bỏ phần tử đỉnh của ngăn xếp.

Lưu ý rằng nếu phương thức `pop` không loại bỏ phần tử đỉnh của ngăn xếp, nó sẽ sử dụng `System.arraycopy` để sao chép các phần tử của mảng, vì ngăn xếp dưới cùng là một mảng.

```java
public class Vector<E>
    extends AbstractList<E>
    implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{
    protected Object[] elementData;
    protected int elementCount;
    protected int capacityIncrement;
}
```

Lớp `Vector` chứa các trường dữ liệu cần thiết để quản lý mảng các phần tử.

Tóm lại, lớp `Stack` trong Java là một cài đặt sẵn của cấu trúc dữ liệu ngăn xếp, được xây dựng trên lớp `Vector` và có sẵn các phương thức để thao tác với ngăn xếp một cách dễ dàng và an toàn.

