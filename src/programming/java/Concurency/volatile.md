---
title: Volatile
tags:
  - java
categories:
  - java
order: 11
---
# Từ khóa **volatile**

Khi nói về những vấn đề mà lập trình đồng thời mang lại, chúng ta đã đề cập đến tính khả kiến và tính nguyên tử. Bây giờ tôi có thể nói rõ hơn: **volatile** đảm bảo tính khả kiến nhưng không đảm bảo tính nguyên tử.

- Khi ghi vào một biến volatile, [JMM](jmm.md) sẽ ép buộc biến đó trong bộ nhớ cục bộ của luồng hiện tại được đẩy vào bộ nhớ chính.
- Việc ghi này sẽ làm cho bộ đệm của các biến volatile trong các luồng khác trở nên vô hiệu.

## volatile ngăn cản việc sắp xếp lại lệnh

Khi nói về [JMM](jmm.md), chúng ta đã nhắc đến việc sắp xếp lại lệnh, và tôi tin rằng mọi người vẫn nhớ quy tắc cần tuân thủ khi sắp xếp lại lệnh:

- Không thể sắp xếp lại các thao tác có phụ thuộc dữ liệu. Ví dụ: `a=1; b=a;` thì thao tác thứ hai phụ thuộc vào thao tác thứ nhất, do đó chúng không thể bị sắp xếp lại khi biên dịch hoặc trong khi thực thi trên CPU.
- Sắp xếp lại nhằm tối ưu hóa hiệu suất, nhưng bất kể cách sắp xếp lại thế nào, kết quả thực thi trong môi trường đơn luồng không được thay đổi. Ví dụ: `a=1; b=2; c=a+b;` vì không có phụ thuộc dữ liệu giữa thao tác `a=1` và `b=2`, nên có thể sắp xếp lại, nhưng thao tác `c=a+b` sẽ không bị sắp xếp lại vì cần đảm bảo kết quả cuối cùng là `c=a+b=3`.

Sử dụng từ khóa **volatile** để sửa đổi biến chia sẻ có thể ngăn việc sắp xếp lại lệnh. Làm thế nào để điều này xảy ra?

Khi chúng ta dùng **volatile** để sửa đổi một biến, mô hình bộ nhớ Java sẽ thêm các rào cản bộ nhớ (là các lệnh CPU để ngăn cản việc sắp xếp lại) để đảm bảo hai điều sau:

- **Rào cản ghi (Write Barrier)**: Khi một biến volatile được ghi, rào cản ghi đảm bảo rằng tất cả các thao tác ghi trước đó sẽ được đẩy vào bộ nhớ chính trước khi ghi vào biến volatile.
- **Rào cản đọc (Read Barrier)**: Khi đọc một biến volatile, rào cản đọc đảm bảo rằng tất cả các thao tác đọc sau đó sẽ đọc từ bộ nhớ chính.

Nói cách khác:

- Khi chương trình thực hiện thao tác đọc hoặc ghi trên một biến volatile, các thay đổi trước đó chắc chắn đã được thực hiện, và kết quả của chúng có thể thấy được với các thao tác sau đó; các thao tác phía sau chắc chắn chưa được thực hiện.
- Khi tối ưu hóa lệnh, không thể thực hiện các lệnh trước biến volatile sau nó, và không thể thực hiện các lệnh sau biến volatile trước nó.

Vậy có nghĩa là, khi thực thi biến **volatile**, tất cả các lệnh trước nó phải được thực thi xong, và các lệnh sau nó chưa được thực thi. Kết quả của các lệnh trước cũng sẽ khả kiến với biến **volatile** và các lệnh sau.

Hãy xem ví dụ sau khi chưa sử dụng **volatile**:

```java
class ReorderExample {
  int a = 0;
  boolean flag = false;
  public void writer() {
      a = 1;                 //1
      flag = true;           //2
  }
  public void reader() {
      if (flag) {             //3
          int i = a * a;      //4
          System.out.println(i);
      }
  }
}
```

Do ảnh hưởng của sắp xếp lại lệnh, kết quả đầu ra cuối cùng có thể là 0. Sắp xếp lại lệnh được giải thích trong [bài viết về JMM](jmm.md). Nếu sử dụng **volatile**, hãy xem lại mã sau:

```java
class ReorderExample {
  int a = 0;
  boolean volatile flag = false;
  public void writer() {
      a = 1;                 //1
      flag = true;           //2
  }
  public void reader() {
      if (flag) {             //3
          int i = a * a;      //4
          System.out.println(i);
      }
  }
}
```

Lúc này, **volatile** sẽ ngăn cản việc sắp xếp lại lệnh, dựa trên mối quan hệ **happens-before** (được giải thích trong [bài trước](jmm.md)):

1. Theo quy tắc thứ tự chương trình, thao tác 1 xảy ra trước thao tác 2; thao tác 3 xảy ra trước thao tác 4.
2. Theo quy tắc volatile, thao tác 2 xảy ra trước thao tác 3.
3. Theo tính chất bắc cầu của quy tắc happens-before, thao tác 1 xảy ra trước thao tác 4.

Biểu đồ dưới đây minh họa cho mối quan hệ **happens-before**:

![Happens-before](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/volatile-f4de7989-672e-43d6-906b-feffe4fb0a9c.jpg)

Trong hình trên, mỗi mũi tên liên kết hai điểm đại diện cho một mối quan hệ happens-before:

- Mũi tên đen biểu thị quy tắc thứ tự chương trình.
- Mũi tên cam biểu thị quy tắc volatile.
- Mũi tên xanh biểu thị sự kết hợp các quy tắc này và đảm bảo tính happens-before.

Ở đây, sau khi luồng A ghi một biến **volatile**, luồng B đọc cùng biến **volatile**. Tất cả các biến chia sẻ mà luồng A có thể thấy trước khi ghi biến **volatile**, sẽ trở nên khả kiến ngay lập tức đối với luồng B sau khi đọc biến **volatile**.

## Trường hợp không thể áp dụng volatile

Dưới đây là ví dụ về việc tăng biến số:

```java
public class volatileTest {
    public volatile int inc = 0;
    public void increase() {
        inc++;
    }
    public static void main(String[] args) {
        final volatileTest test = new volatileTest();
        for(int i=0;i<10;i++){
            new Thread(){
                public void run() {
                    for(int j=0;j<1000;j++)
                        test.increase();
                };
            }.start();
        }
        while(Thread.activeCount()>1)  // Đảm bảo tất cả các luồng trước đó đều đã thực thi
            Thread.yield();
        System.out.println("Kết quả inc: " + test.inc);
    }
}
```

Kết quả kiểm tra:

```
Kết quả inc: 8182
```

"Tại sao vậy?"

"Vì phép tính `inc++` không phải là một thao tác nguyên tử (như anh đã nói [trong phần trước](/thread-problems)), nó gồm ba bước: đọc giá trị, tăng giá trị, và gán lại, vì vậy kết quả không thể đạt 10.000."

Vậy giải pháp là gì?

01. Sử dụng từ khóa [synchronized](synchronized-1.md) (phần sau sẽ được giải thích chi tiết) để đồng bộ hóa việc tăng giá trị `inc++`:

```java
public class volatileTest1 {
    public int inc = 0;
    public synchronized void increase() {
        inc++;
    }
    public static void main(String[] args) {
        final volatileTest1 test = new volatileTest1();
        for(int i=0;i<10;i++){
            new Thread(){
                public void run() {
                    for(int j=0;j<1000;j++)
                        test.increase();
                };
            }.start();
        }
        while(Thread.activeCount()>1)  // Đảm bảo tất cả các luồng trước đó đều đã thực thi
            Thread.yield();
        System.out.println("Thêm synchronized, kết quả inc: " + test.inc);
    }
}
```

02. Sử dụng Lock, với khóa tái nhập ReentrantLock để khóa việc tăng giá trị `inc++` (sẽ được giải thích chi tiết sau):

```java
public class volatileTest2 {
    public int inc = 0;
    Lock lock = new ReentrantLock();
    public void increase() {
        lock.lock();
        inc++;
        lock.unlock();
    }
    public static void main(String[] args) {
        final volatileTest2 test = new volatileTest2();
        for(int i=0;i<10;i++){
            new Thread(){
                public void run() {
                    for(int j=0;j<1000;j++)
                        test.increase();
                };
            }.start();
        }
        while(Thread.activeCount()>1)  // Đảm bảo tất cả các luồng trước đó đều đã thực thi
            Thread.yield();
        System.out.println("Thêm lock, kết quả inc: " + test.inc);
    }
}
```

03. Sử dụng lớp nguyên tử [AtomicInteger](https://javabetter.cn/thread/atomic.html) (sẽ được giải thích chi tiết sau) để thực hiện việc tăng giá trị:

```java
public class volatileTest3 {
    public AtomicInteger inc = new AtomicInteger();
    public void increase() {
        inc.getAndIncrement();
    }
    public static void main(String[] args) {
        final volatileTest3 test = new volatileTest3();
        for(int i=0;i<10;i++){
            new Thread(){
                public void run() {
                    for(int j=0;j<1000;j++)
                        test.increase();
                };
            }.start();
        }
        while(Thread.activeCount()>1)  // Đảm bảo tất cả các luồng trước đó đều đã thực thi
            Thread.yield();
        System.out.println("Thêm AtomicInteger, kết quả inc: " + test.inc);
    }
}
```

Kết quả của cả ba phương pháp đều là 1000, như sau:

```
Thêm synchronized, kết quả inc: 1000
Thêm lock, kết quả inc: 1000
Thêm AtomicInteger, kết quả inc: 1000
```

## volatile trong việc triển khai mô hình Singleton với khóa kép

Dưới đây là một ví dụ về việc sử dụng “khóa kép” (double-checked locking) để triển khai mô hình Singleton (Singleton Pattern).

```java
public class Penguin {
    private static volatile Penguin m_penguin = null;

    // Một biến thành viên money
    private int money = 10000;

    // Tránh việc khởi tạo đối tượng bằng new, nên constructor cần là public hoặc private
    private Penguin() {}

    public void beating() {
        System.out.println("Đánh đập: " + money);
    }

    public static Penguin getInstance() {
        if (m_penguin == null) {
            synchronized (Penguin.class) {
                if (m_penguin == null) {
                    m_penguin = new Penguin();
                }
            }
        }
        return m_penguin;
    }
}
```

Trong ví dụ này, lớp Penguin chỉ được khởi tạo một lần duy nhất. Hãy cùng xem giải thích mã:

- Một biến volatile kiểu Penguin có tên `m_penguin` được khai báo, đây là biến tĩnh của lớp, dùng để lưu trữ duy nhất một đối tượng Penguin.
- Phương thức khởi tạo `Penguin()` được khai báo là `private`, nhằm ngăn chặn việc khởi tạo Penguin từ bên ngoài bằng từ khóa `new`, đảm bảo chỉ có thể lấy được thông qua phương thức `getInstance()`.
- Phương thức `getInstance()` là phương thức tĩnh công khai để lấy đối tượng duy nhất của lớp Penguin.
- Lần kiểm tra đầu tiên `if (null == m_penguin)` kiểm tra xem đối tượng Penguin đã được tạo chưa. Nếu chưa, sẽ đi vào khối mã đồng bộ.
- Khối mã `synchronized(Penguin.class)` khóa trên đối tượng `Class` của lớp, đảm bảo rằng trong môi trường đa luồng, chỉ có một luồng duy nhất có thể vào khối mã đồng bộ. Trong khối đồng bộ này, lại kiểm tra lần nữa xem đối tượng Penguin đã tồn tại chưa, nếu chưa thì tạo đối tượng mới. Đây chính là “khóa kép”.
- Cuối cùng, trả về `m_penguin`, tức là đối tượng duy nhất của lớp Penguin.

Trong đó, sử dụng từ khóa `volatile` nhằm ngăn chặn việc `m_penguin = new Penguin()` bị tối ưu hóa bởi lệnh sắp xếp lại (instruction reordering). Bởi vì trên thực tế, dòng lệnh `new Penguin()` bao gồm ba bước nhỏ:

- Bước 1: Phân bổ bộ nhớ cho đối tượng Penguin, mã giả là `memory = allocate()`.
- Bước 2: Gọi phương thức khởi tạo của Penguin để khởi tạo các biến thành viên của đối tượng, mã giả là `ctorInstance(memory)`.
- Bước 3: Gán địa chỉ bộ nhớ cho biến `m_penguin`, khiến nó tham chiếu đến đối tượng mới tạo, mã giả là `instance = memory`.

Nếu không sử dụng từ khóa `volatile`, JVM có thể sắp xếp lại các bước này theo thứ tự:

- Phân bổ bộ nhớ cho đối tượng Penguin.
- Gán đối tượng cho tham chiếu `m_penguin`.
- Gọi phương thức khởi tạo để khởi tạo các biến thành viên.

Việc sắp xếp lại này có thể khiến tham chiếu `m_penguin` được thiết lập trước khi đối tượng Penguin được khởi tạo đầy đủ, dẫn đến việc các luồng khác có thể truy cập đối tượng chưa hoàn chỉnh này. Cụ thể, nếu một luồng thực hiện bước 2 và thiết lập tham chiếu `m_penguin` nhưng chưa hoàn thành việc khởi tạo đối tượng, luồng khác có thể thấy một đối tượng Penguin “chưa hoàn chỉnh”.

Giả sử có hai luồng A và B cùng thực hiện phương thức `getInstance()`:

```java
public static Penguin getInstance() {
    if (m_penguin == null) {
        synchronized (Penguin.class) {
            if (m_penguin == null) {
                m_penguin = new Penguin();
            }
        }
    }
    return m_penguin;
}
```

- Luồng A thực hiện `if (m_penguin == null)`, kiểm tra là true, vào khối mã đồng bộ.
- Luồng B cũng thực hiện `if (m_penguin == null)`, kiểm tra là true, và cũng vào khối mã đồng bộ.

Nếu luồng A thực hiện `m_penguin = new Penguin()` với việc sắp xếp lại lệnh:

- Luồng A phân bổ bộ nhớ và thiết lập tham chiếu, nhưng chưa gọi phương thức khởi tạo.
- Luồng B thấy rằng `m_penguin != null`, trả về một đối tượng Penguin chưa hoàn chỉnh.

Điều này có thể dẫn đến việc luồng B nhận được một đối tượng không hoàn chỉnh, gây ra ngoại lệ NullPointer hoặc các vấn đề khác.

Vì vậy, chúng ta cần thêm từ khóa `volatile` cho biến `m_penguin` để ngăn chặn việc sắp xếp lại lệnh, đảm bảo rằng đối tượng được khởi tạo hoàn chỉnh trước khi được gán cho `m_penguin`.

## Kết luận

`volatile` có thể đảm bảo tính khả kiến giữa các luồng và cung cấp một mức độ trật tự nhất định, nhưng không đảm bảo tính nguyên tử. Ở cấp độ JVM, `volatile` được thực hiện thông qua “hàng rào bộ nhớ” (memory barriers).

Khi quan sát mã lắp ráp được tạo ra với và không có từ khóa `volatile`, ta sẽ thấy khi thêm từ khóa `volatile`, sẽ có thêm một lệnh `lock` được tiền tố. Lệnh `lock` thực chất là một hàng rào bộ nhớ, cung cấp ba chức năng:

- Nó đảm bảo rằng khi sắp xếp lại lệnh, không lệnh nào sau hàng rào có thể được đưa lên trước, và không lệnh nào trước hàng rào có thể bị đưa xuống sau; tức là, khi lệnh hàng rào bộ nhớ được thực thi, tất cả các thao tác trước đó đã hoàn thành.
- Nó bắt buộc ghi các thay đổi vào bộ nhớ đệm ngay lập tức vào bộ nhớ chính.
- Nếu đó là thao tác ghi, nó sẽ khiến các dòng bộ nhớ đệm tương ứng trong CPU khác trở nên không hợp lệ.

Cuối cùng, chúng ta đã học về những trường hợp mà `volatile` không thể áp dụng, các giải pháp thay thế và lý do tại sao cần sử dụng `volatile` trong mô hình Singleton với khóa kép.