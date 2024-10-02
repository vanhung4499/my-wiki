---
title: Thread Group and Thread Priority
tags:
  - java
categories:
  - java
order: 4
---
# Phần 4: Nhóm luồng và mức độ ưu tiên của luồng

Java cung cấp lớp ThreadGroup để tạo một nhóm luồng có liên quan, giúp việc quản lý nhóm luồng dễ dàng hơn. Mỗi luồng trong Java đều có một mức độ ưu tiên, mức độ này sẽ ảnh hưởng đến thứ tự mà hệ điều hành phân bổ thời gian xử lý cho luồng đó.

Bài viết này sẽ giới thiệu về nhóm luồng và mức độ ưu tiên của luồng.

## Nhóm luồng (ThreadGroup)

Java sử dụng ThreadGroup để đại diện cho nhóm luồng, chúng ta có thể thông qua nhóm luồng để điều khiển các luồng theo nhóm.

Mối quan hệ giữa ThreadGroup và Thread đơn giản và dễ hiểu như tên gọi của chúng. Mỗi Thread bắt buộc phải tồn tại trong một ThreadGroup, và Thread không thể tồn tại độc lập với ThreadGroup. Luồng thực thi phương thức `main()` có tên là main, nếu khi khởi tạo luồng mới không chỉ định rõ ràng nhóm luồng, thì mặc định nhóm luồng của luồng cha (luồng hiện tại đang khởi tạo luồng mới) sẽ được gán cho luồng mới.

Ví dụ mã:

```java
Thread testThread = new Thread(() -> {
    System.out.println("Tên của nhóm luồng testThread hiện tại: " +
            Thread.currentThread().getThreadGroup().getName());
    System.out.println("Tên của luồng testThread: " +
            Thread.currentThread().getName());
});

testThread.start();
System.out.println("Tên của nhóm luồng đang thực thi main: " + Thread.currentThread().getThreadGroup().getName());
System.out.println("Tên của luồng thực thi phương thức main: " + Thread.currentThread().getName());
```

Kết quả đầu ra:

```java
Tên của nhóm luồng đang thực thi main: main
Tên của nhóm luồng testThread hiện tại: main
Tên của luồng testThread: Thread-0
Tên của luồng thực thi phương thức main: main
```

ThreadGroup là một cấu trúc cây **tham chiếu từ trên xuống**, thiết kế này có thể **ngăn chặn luồng "cấp dưới" tham chiếu đến luồng "cấp trên" và ngăn việc giải phóng bộ nhớ (GC) hiệu quả**.

### Các phương thức và cấu trúc dữ liệu thường dùng của ThreadGroup

#### Lấy tên nhóm luồng hiện tại

```java
Thread.currentThread().getThreadGroup().getName()
```

#### Sao chép nhóm luồng

```java
// Lấy nhóm luồng hiện tại
ThreadGroup threadGroup = Thread.currentThread().getThreadGroup();
// Sao chép nhóm luồng vào một mảng luồng (lấy thông tin Thread)
Thread[] threads = new Thread[threadGroup.activeCount()];
threadGroup.enumerate(threads);
```

#### Xử lý ngoại lệ cho nhóm luồng

```java
// Tạo một nhóm luồng và định nghĩa lại ngoại lệ
ThreadGroup group = new ThreadGroup("testGroup") {
    @Override
    public void uncaughtException(Thread t, Throwable e) {
        System.out.println(t.getName() + ": " + e.getMessage());
    }
};

// Kiểm tra ngoại lệ
Thread thread = new Thread(group, () -> {
    // Ném ra ngoại lệ unchecked
    throw new RuntimeException("Kiểm tra ngoại lệ");
});

// Khởi động luồng
thread.start();
```

#### Cấu trúc dữ liệu của ThreadGroup

Nhóm luồng còn có thể chứa các nhóm luồng khác, không chỉ các luồng. Hãy xem các biến thành viên trong mã nguồn của `ThreadGroup`.

```java
public class ThreadGroup implements Thread.UncaughtExceptionHandler {
    private final ThreadGroup parent; // Nhóm ThreadGroup cha
    String name; // Tên của ThreadGroup
    int maxPriority; // Mức độ ưu tiên tối đa
    boolean destroyed; // Đã bị hủy hay chưa
    boolean daemon; // Có phải là luồng daemon không
    boolean vmAllowSuspension; // Có thể bị gián đoạn không

    int nUnstartedThreads = 0; // Số luồng chưa khởi động
    int nthreads; // Số lượng luồng trong ThreadGroup
    Thread threads[]; // Các luồng trong ThreadGroup

    int ngroups; // Số lượng nhóm luồng
    ThreadGroup groups[]; // Mảng các nhóm luồng
}
```

Tiếp theo là các phương thức khởi tạo:

```java
// Phương thức khởi tạo riêng tư
private ThreadGroup() {
    this.name = "system";
    this.maxPriority = Thread.MAX_PRIORITY;
    this.parent = null;
}

// Mặc định nhóm luồng cha của nhóm luồng mới sẽ là nhóm luồng của luồng đang chạy hiện tại.
public ThreadGroup(String name) {
    this(Thread.currentThread().getThreadGroup(), name);
}

// Phương thức khởi tạo
public ThreadGroup(ThreadGroup parent, String name) {
    this(checkParentAccess(parent), parent, name);
}

// Phương thức khởi tạo chính, riêng tư
private ThreadGroup(Void unused, ThreadGroup parent, String name) {
    this.name = name;
    this.maxPriority = parent.maxPriority;
    this.daemon = parent.daemon;
    this.vmAllowSuspension = parent.vmAllowSuspension;
    this.parent = parent;
    parent.add(this);
}
```

Trong phương thức khởi tạo thứ ba, có lời gọi đến phương thức `checkParentAccess`, hãy xem mã nguồn của phương thức này:

```java
// Kiểm tra ThreadGroup cha
private static Void checkParentAccess(ThreadGroup parent) {
    parent.checkAccess();
    return null;
}

// Kiểm tra luồng hiện tại có quyền thay đổi nhóm luồng hay không
public final void checkAccess() {
    SecurityManager security = System.getSecurityManager();
    if (security != null) {
        security.checkAccess(this);
    }
}
```

Điều này liên quan đến lớp `SecurityManager`, là trình quản lý bảo mật của Java, nó cho phép ứng dụng xác định hành động nào có thể không an toàn hoặc nhạy cảm trước khi thực thi và quyết định xem có cho phép thực thi trong ngữ cảnh đó hay không.

Ví dụ như khi thêm thư viện bên thứ ba mà không thể đảm bảo tính bảo mật của nó.

Thực tế, lớp Thread cũng có phương thức `checkAccess`, nhưng mục đích là kiểm tra xem luồng hiện tại có quyền thay đổi luồng được gọi hay không.

Tóm lại, nhóm luồng là một cấu trúc dạng cây, mỗi nhóm luồng có thể chứa nhiều luồng hoặc nhóm luồng khác. Nhóm luồng có thể giúp điều khiển đồng nhất mức độ ưu tiên của luồng và kiểm tra quyền hạn của luồng.

Dưới đây là bản dịch sang tiếng Việt:

## Mức độ ưu tiên của luồng

Mức độ ưu tiên của luồng có thể được chỉ định, phạm vi là từ 1 đến 10. Tuy nhiên, không phải tất cả hệ điều hành đều hỗ trợ phân chia 10 cấp độ ưu tiên (ví dụ: một số hệ điều hành chỉ hỗ trợ 3 cấp độ: thấp, trung bình và cao). Java chỉ cung cấp cho hệ điều hành một **giá trị tham khảo** về mức độ ưu tiên, còn **mức độ ưu tiên thực sự trong hệ điều hành** sẽ do hệ điều hành quyết định.

Mức độ ưu tiên mặc định của luồng Java là 5. Thứ tự thực thi của các luồng được quyết định bởi bộ điều phối luồng, và mức độ ưu tiên sẽ được thiết lập trước khi luồng được gọi.

Thông thường, các luồng có mức độ ưu tiên cao hơn sẽ có **xác suất cao hơn** để được thực thi trước các luồng có mức độ ưu tiên thấp hơn. Phương thức `setPriority()` của lớp `Thread` có thể được sử dụng để thiết lập mức độ ưu tiên của luồng.

```java
Thread a = new Thread();
System.out.println("Tôi là luồng có mức độ ưu tiên mặc định: " + a.getPriority());
Thread b = new Thread();
b.setPriority(10);
System.out.println("Tôi là luồng có mức độ ưu tiên đã được thiết lập: " + b.getPriority());
```

Kết quả:

```java
Tôi là luồng có mức độ ưu tiên mặc định: 5
Tôi là luồng có mức độ ưu tiên đã được thiết lập: 10
```

Vậy nếu có 10 cấp độ để thiết lập mức độ ưu tiên của luồng, liệu chúng ta có thể sử dụng phương pháp này để chỉ định thứ tự thực thi của luồng trong các tình huống thực tế không?

Câu trả lời là: Không!

Mức độ ưu tiên trong Java không thực sự đáng tin cậy. **Mức độ ưu tiên mà chương trình Java thiết lập cho luồng chỉ là một đề xuất cho hệ điều hành, và hệ điều hành không nhất thiết phải chấp nhận. Thứ tự thực thi thực sự sẽ được quyết định bởi thuật toán điều phối luồng của hệ điều hành**.

Hãy kiểm tra điều này qua đoạn mã sau:

```java
static class MyThread extends Thread {
    @Override
    public void run() {
        // In ra tên và mức độ ưu tiên của luồng hiện tại
        System.out.println("MyThread - Tên luồng hiện tại: " + Thread.currentThread().getName()
                + ", Mức độ ưu tiên: " + Thread.currentThread().getPriority());
    }
}

public static void main(String[] args) {
    // Tạo 10 luồng, chạy từ 1 đến 10, mức độ ưu tiên từ 1 đến 10
    for (int i = 1; i <= 10; i++) {
        Thread thread = new MyThread();
        thread.setName("Luồng " + i);
        thread.setPriority(i);
        thread.start();
    }
}
```

Khi chạy chương trình này, đôi khi luồng được thực thi theo đúng mức độ ưu tiên, nhưng đôi khi lại không. Đây là một kết quả đầu ra:

```java
MyThread - Tên luồng hiện tại: Luồng 2, Mức độ ưu tiên: 2
MyThread - Tên luồng hiện tại: Luồng 4, Mức độ ưu tiên: 4
MyThread - Tên luồng hiện tại: Luồng 3, Mức độ ưu tiên: 3
MyThread - Tên luồng hiện tại: Luồng 5, Mức độ ưu tiên: 5
MyThread - Tên luồng hiện tại: Luồng 1, Mức độ ưu tiên: 1
MyThread - Tên luồng hiện tại: Luồng 6, Mức độ ưu tiên: 6
MyThread - Tên luồng hiện tại: Luồng 7, Mức độ ưu tiên: 7
MyThread - Tên luồng hiện tại: Luồng 8, Mức độ ưu tiên: 8
MyThread - Tên luồng hiện tại: Luồng 9, Mức độ ưu tiên: 9
MyThread - Tên luồng hiện tại: Luồng 10, Mức độ ưu tiên: 10
```

Java cung cấp một **bộ điều phối luồng** để theo dõi và kiểm soát các luồng ở trạng thái **RUNNABLE**.

- Chính sách điều phối của các luồng sử dụng phương thức **chiếm dụng** (preemptive), các luồng có mức độ ưu tiên cao sẽ có xác suất thực thi cao hơn các luồng có mức độ ưu tiên thấp.
- Nếu các luồng có mức độ ưu tiên giống nhau, chúng sẽ được thực thi theo nguyên tắc "đến trước được phục vụ trước".
- Mỗi chương trình Java đều có một luồng chính mặc định, đó là luồng được JVM khởi chạy đầu tiên – luồng main.

Có một loại luồng đặc biệt được gọi là **luồng daemon**. Luồng daemon thường có mức độ ưu tiên thấp.

- Nếu một luồng là luồng daemon, thì khi tất cả các luồng không phải daemon kết thúc, luồng daemon này cũng sẽ tự động kết thúc.
- Khi tất cả các luồng không phải daemon kết thúc, luồng daemon sẽ tự động đóng, điều này giúp tránh việc phải đóng các luồng con một cách thủ công.
- Theo mặc định, luồng không phải là luồng daemon, nhưng có thể thiết lập thành luồng daemon thông qua phương thức setDaemon của lớp Thread.

## Mối quan hệ giữa nhóm luồng và mức độ ưu tiên của luồng

Trước đây chúng ta đã đề cập rằng mỗi luồng phải nằm trong một nhóm luồng, vậy khi mức độ ưu tiên của luồng và nhóm luồng không đồng nhất thì sẽ thế nào? Hãy kiểm tra:

```java
 // Tạo một nhóm luồng
ThreadGroup group = new ThreadGroup("testGroup");
// Đặt mức độ ưu tiên của nhóm luồng là 7
group.setMaxPriority(7);
// Tạo một luồng và thêm luồng đó vào nhóm
Thread thread = new Thread(group, "test-thread");
// Cố gắng đặt mức độ ưu tiên của luồng là 10
thread.setPriority(10);
// In ra mức độ ưu tiên của nhóm luồng và của luồng
System.out.println("Mức độ ưu tiên của nhóm luồng là: " + group.getMaxPriority());
System.out.println("Mức độ ưu tiên của luồng là: " + thread.getPriority());
```

Kết quả:

```
Mức độ ưu tiên của nhóm luồng là: 7
Mức độ ưu tiên của luồng là: 7
```

Vì vậy, nếu mức độ ưu tiên của một luồng cao hơn **mức độ ưu tiên tối đa của nhóm luồng**, thì mức độ ưu tiên của luồng đó sẽ không hợp lệ và sẽ được thay thế bằng mức độ ưu tiên tối đa của nhóm luồng.

## Tóm tắt

Java cung cấp lớp ThreadGroup để tạo ra một nhóm luồng có liên quan, giúp quản lý nhóm luồng dễ dàng hơn. Mỗi luồng trong Java có một mức độ ưu tiên và mức độ này sẽ ảnh hưởng đến thứ tự mà hệ điều hành phân bổ thời gian xử lý cho luồng đó.

