---
title: Multi Threading Intro
tags:
  - java
categories:
  - java
order: 1
---

# Giới thiệu về Đa luồng trong Java

Đối với những người mới học Java, nhiều khái niệm về đa luồng nghe có vẻ khó hiểu. Ví dụ:

- Tiến trình, là một gói chương trình đang chạy, là đơn vị cơ bản để hệ thống thực hiện việc điều phối và phân bổ tài nguyên, giúp thực hiện đồng thời của hệ điều hành.
- Luồng, là nhiệm vụ con của tiến trình, là đơn vị cơ bản để CPU điều phối và phân chia, giúp thực hiện đồng thời bên trong tiến trình.

Rất trừu tượng, phải không? Hãy lấy một ví dụ: bạn đang chơi một trận Vương Giả (thật ra mình không chơi đâu ha doge):

- Tiến trình có thể ví như là trận đấu bạn đang chơi.
- Luồng có thể ví như là tướng bạn chọn hoặc những đối tượng trong game như quái rừng, trụ, v.v.

Với ví dụ này, bạn có thể hiểu mối quan hệ giữa tiến trình và luồng. Một tiến trình có thể có nhiều luồng, điều này được gọi là đa luồng. Bây giờ có lẽ bạn đã thấy dễ hiểu hơn rồi, đúng không?

## Tiến trình và Luồng

**❤1. Luồng hoạt động trong tiến trình**

(Một tướng, quái rừng, hoặc lính không thể tự chạy được)

**❤2. Các tiến trình không ảnh hưởng lẫn nhau, kết thúc luồng chính sẽ dẫn đến việc kết thúc tiến trình**

(Hai trận đấu không liên quan và không ảnh hưởng nhau. Nếu nhà chính của bạn bị phá hủy, trận đấu của bạn sẽ kết thúc)

**❤3. Dữ liệu giữa các tiến trình rất khó chia sẻ**

(Hai trận đấu khó có liên hệ với nhau, nhưng trường hợp có liên hệ có thể là bạn gặp lại kẻ thù từ trận trước)

**❤4. Dữ liệu giữa các luồng trong cùng một tiến trình rất dễ chia sẻ**

(Trong cùng một trận đấu, bạn có thể xem trạng thái của mỗi người chơi - sống/chết, và cũng có thể thấy trang bị của họ)

**❤5. Tiến trình có thể giới hạn lượng bộ nhớ sử dụng**

(Phòng chơi giới hạn số người chơi, nếu phòng đầy, người khác sẽ không thể vào trừ khi có ai đó rời khỏi phòng)

## Ba cách tạo luồng

Sau khi hiểu rõ các khái niệm trên, chúng ta sẽ tìm hiểu ba cách để tạo luồng trong Java:

### Kế thừa lớp Thread

♠①: Tạo một lớp kế thừa lớp `Thread` và ghi đè phương thức `run`.

```java
public class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            System.out.println(getName() + ": đã tiêu diệt " + i + " lính");
        }
    }
}
```

Chúng ta sẽ viết một phương thức kiểm tra để xác minh:

```java
// Tạo đối tượng MyThread
MyThread t1 = new MyThread();
MyThread t2 = new MyThread();
MyThread t3 = new MyThread();
// Đặt tên cho các luồng
t1.setName("Lữ Bố");
t2.setName("Lưu Bị");
t3.setName("Arthur");
// Khởi động các luồng
t1.start();
t2.start();
t3.start();
```

### Triển khai interface Runnable

♠②: Tạo một lớp triển khai interface `Runnable` và ghi đè phương thức `run`.

```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            try {
                Thread.sleep(20); // Dừng lại 20ms
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + " đã tiêu diệt: " + i + " lính");
        }
    }
}
```

Chúng ta sẽ viết một phương thức kiểm tra để xác minh:

```java
// Tạo lớp MyRunnable
MyRunnable mr = new MyRunnable();
// Tạo đối tượng Thread và đặt tên luồng
Thread t1 = new Thread(mr, "Trương Phi");
Thread t2 = new Thread(mr, "Điêu Thuyền");
Thread t3 = new Thread(mr, "Lữ Bố");
// Khởi động các luồng
t1.start();
t2.start();
t3.start();
```

### Triển khai interface Callable

♠③: Triển khai interface `Callable` và ghi đè phương thức `call`. Cách này có thể lấy kết quả trả về của nhiệm vụ thông qua `FutureTask`.

```java
public class CallerTask implements Callable<String> {
    public String call() throws Exception {
        return "Hello, tôi đang chạy!";
    }

    public static void main(String[] args) {
        // Tạo nhiệm vụ bất đồng bộ
        FutureTask<String> task = new FutureTask<String>(new CallerTask());
        // Khởi động luồng
        new Thread(task).start();
        try {
            // Đợi thực hiện xong và lấy kết quả trả về
            String result = task.get();
            System.out.println(result);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```

## Một số câu hỏi về luồng

### ❤1. Tại sao cần ghi đè phương thức `run`?

Đó là vì phương thức mặc định `run()` sẽ không thực hiện bất kỳ công việc nào.

Để luồng có thể thực hiện một số tác vụ cụ thể, chúng ta cần cung cấp cách triển khai cho phương thức `run()`, và điều này đòi hỏi chúng ta phải ghi đè phương thức `run()`.

```java
public class MyThread extends Thread {
  public void run() {
    System.out.println("MyThread đang chạy");
  }
}
```

Trong ví dụ này, chúng ta đã ghi đè phương thức `run()` để nó in ra một thông báo. Khi chúng ta tạo và khởi chạy một đối tượng của lớp này, nó sẽ in ra thông báo này.

### ❤2. Phương thức `run` và `start` khác nhau như thế nào?

- `run()` chứa mã mà luồng sẽ thực thi, việc gọi trực tiếp nó giống như gọi một phương thức thông thường.
- `start()` khởi động luồng, sau đó JVM sẽ gọi phương thức `run()` của luồng này.

### ❤3. Giữa việc kế thừa lớp `Thread` và triển khai interface `Runnable` để tạo luồng, cách nào tốt hơn?

Triển khai interface `Runnable` tốt hơn vì hai lý do:

- ♠①: Tránh được giới hạn đơn kế thừa của Java. Java không hỗ trợ đa kế thừa, vì vậy nếu lớp của chúng ta đã kế thừa một lớp khác, thì không thể kế thừa thêm lớp `Thread`.
- ♠②: Phù hợp với tình huống có nhiều đoạn mã giống nhau xử lý chung một tài nguyên. Việc tách biệt luồng, mã và dữ liệu giúp thiết kế hướng đối tượng rõ ràng hơn. interface `Callable` tương tự như `Runnable`, nhưng có thể trả về kết quả.

## Các phương thức khác để kiểm soát luồng

Dưới đây là ba phương thức thường gặp để kiểm soát luồng, chúng ta cùng tìm hiểu.

### 1) `sleep()`

Tạm dừng luồng hiện tại trong một khoảng thời gian được chỉ định tính bằng mili giây, tức là đưa luồng vào trạng thái ngủ.

Cần lưu ý rằng khi sử dụng `sleep`, phải xử lý ngoại lệ.

```java
try {
    Thread.sleep(20); // Tạm dừng 20 mili giây
} catch (InterruptedException e) {
    e.printStackTrace();
}
```

### 2) `join()`

Đợi cho luồng này hoàn thành thì các luồng tiếp theo mới có thể giành quyền thực thi CPU. Khi sử dụng cũng cần bắt ngoại lệ.

```java
// Tạo lớp MyRunnable
MyRunnable mr = new MyRunnable();
// Tạo đối tượng Thread và đặt tên luồng
Thread t1 = new Thread(mr, "Trương Phi");
Thread t2 = new Thread(mr, "Điêu Thuyền");
Thread t3 = new Thread(mr, "Lữ Bố");
// Khởi động luồng
t1.start();
try {
    t1.join(); // Đợi t1 hoàn thành thì t2 và t3 mới có thể giành quyền thực thi
} catch (InterruptedException e) {
    e.printStackTrace();
}
t2.start();
t3.start();
```

### 3) `setDaemon()`

Đánh dấu luồng này là luồng nền (daemon), tức là luồng phục vụ các luồng khác. Ví dụ điển hình là luồng thu gom rác trong Java.

```java
// Tạo lớp MyRunnable
MyRunnable mr = new MyRunnable();
// Tạo đối tượng Thread và đặt tên luồng
Thread t1 = new Thread(mr, "Trương Phi");
Thread t2 = new Thread(mr, "Điêu Thuyền");
Thread t3 = new Thread(mr, "Lữ Bố");

t1.setDaemon(true);
t2.setDaemon(true);

// Khởi động luồng
t1.start();
t2.start();
t3.start();
```

Nếu tất cả các luồng khác đã hoàn thành, phương thức `main()` (luồng chính) cũng kết thúc, JVM sẽ dừng chạy, và luồng nền cũng sẽ ngừng hoạt động.

### 4) `yield()`

Phương thức `yield()` là một phương thức tĩnh dùng để gợi ý luồng hiện tại nhường lại thời gian xử lý cho các luồng khác. Tuy nhiên, đây chỉ là đề xuất, bộ lập lịch luồng có thể bỏ qua. Hành vi cụ thể phụ thuộc vào hệ điều hành và bộ lập lịch của JVM.

```java
class YieldExample {
    public static void main(String[] args) {
        Thread thread1 = new Thread(YieldExample::printNumbers, "Lưu Bị");
        Thread thread2 = new Thread(YieldExample::printNumbers, "Quan Vũ");

        thread1.start();
        thread2.start();
    }

    private static void printNumbers() {
        for (int i = 1; i <= 5; i++) {
            System.out.println(Thread.currentThread().getName() + ": " + i);

            // Khi i là số chẵn, luồng hiện tại sẽ tạm dừng
            if (i % 2 == 0) {
                System.out.println(Thread.currentThread().getName() + " nhường quyền điều khiển...");
                Thread.yield();
            }
        }
    }
}
```

Kết quả bạn hãy tự chạy và xem!

Từ kết quả này, chúng ta thấy rằng ngay cả khi một luồng nhường quyền điều khiển, không phải lúc nào các luồng khác cũng được thực thi.

## Tóm tắt

Bài viết này giới thiệu về các cách tạo luồng trong Java, cũng như các phương thức phổ biến để kiểm soát luồng. Cuối cùng, chúng ta sẽ xem xét vòng đời của luồng qua hình ảnh minh họa dưới đây:

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/wangzhe-thread-04.png)