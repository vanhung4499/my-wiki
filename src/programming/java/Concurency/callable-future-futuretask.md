---
title: Callable Future FutureTask
tags:
  - java
categories:
  - java
order: 2
---
# Lấy kết quả thực thi của luồng

Ở phần trước, chúng ta đã nói về 3 cách tạo luồng, bao gồm kế thừa trực tiếp từ lớp `Thread`, triển khai interface `Runnable`, và triển khai interface `Callable`.

Hai cách đầu tiên có một nhược điểm chung: sau khi thực hiện xong nhiệm vụ, chúng ta không thể lấy được kết quả.

Nếu cần lấy kết quả thực thi, ta phải sử dụng biến chia sẻ hoặc giao tiếp giữa các luồng, nhưng cách này khá phức tạp.

Java 1.5 đã cung cấp các lớp `Callable`, `Future`, và `FutureTask`, cho phép lấy kết quả sau khi nhiệm vụ hoàn thành. Hôm nay, chúng ta sẽ tìm hiểu chi tiết về chúng.

## `Runnable` không có giá trị trả về

Do phương thức `run()` của `Runnable` có giá trị trả về là `void`:

```java
public interface Runnable {
    public abstract void run();
}
```

Vì vậy, sau khi thực hiện nhiệm vụ xong, không thể trả về bất kỳ kết quả nào.

## `Callable` có giá trị trả về

`Callable` nằm trong gói `java.util.concurrent` và cũng là một interface. Nó định nghĩa một phương thức `call()`:

```java
public interface Callable<V> {
    V call() throws Exception;
}
```

Có thể thấy, phương thức `call()` trả về một kiểu dữ liệu `V` generic.

Vậy làm thế nào để sử dụng `Callable`?

Thông thường, chúng ta sử dụng nó kết hợp với ExecutorService (sẽ được giải thích chi tiết hơn khi nói về thread pool). ExecutorService là một interface nằm trong gói `java.util.concurrent`, là một thành phần cốt lõi của Java thread pool dùng để thực hiện nhiệm vụ bất đồng bộ. Nó cung cấp một số phương thức quan trọng để quản lý luồng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240924124051.png)

Dưới đây là ví dụ sử dụng phương thức `submit` của `ExecutorService`:

```java
// Tạo một thread pool chứa 5 luồng
ExecutorService executorService = Executors.newFixedThreadPool(5);

// Tạo một nhiệm vụ Callable
Callable<String> task = new Callable<String>() {
    public String call() {
        return "Hello from " + Thread.currentThread().getName();
    }
};

// Nộp nhiệm vụ vào ExecutorService để thực hiện và nhận về đối tượng Future
Future[] futures = new Future[10];
for (int i = 0; i < 10; i++) {
    futures[i] = executorService.submit(task);
}

// Lấy kết quả của nhiệm vụ thông qua đối tượng Future
for (int i = 0; i < 10; i++) {
    System.out.println(futures[i].get());
}

// Đóng ExecutorService, ngừng nhận nhiệm vụ mới, chờ hoàn thành tất cả các nhiệm vụ đã nộp
executorService.shutdown();
```

Chúng ta sử dụng lớp tiện ích Executors để tạo `ExecutorService`, sau đó nộp nhiệm vụ `Callable` và sử dụng `Future` để lấy kết quả thực thi.

Để so sánh, hãy xem cách sử dụng `Runnable`:

```java
// Tạo một thread pool chứa 5 luồng
ExecutorService executorService = Executors.newFixedThreadPool(5);

// Tạo một nhiệm vụ Runnable
Runnable task = new Runnable() {
    public void run() {
        System.out.println("Hello từ " + Thread.currentThread().getName());
    }
};

// Nộp nhiệm vụ vào ExecutorService để thực hiện
for (int i = 0; i < 10; i++) {
    executorService.submit(task);
}

// Đóng ExecutorService, ngừng nhận nhiệm vụ mới, chờ hoàn thành tất cả các nhiệm vụ đã nộp
executorService.shutdown();
```

Có thể thấy, cách sử dụng `Runnable` đơn giản hơn so với `Callable`, nhưng `Callable` có thể lấy kết quả thực thi, điều mà `Runnable` không thể làm được.

## Kết quả tính toán bất đồng bộ với interface `Future`

Trong ví dụ trên, chúng ta sử dụng `Future` để lấy kết quả thực thi của nhiệm vụ `Callable`. Vậy `Future` là gì?

`Future` nằm trong gói `java.util.concurrent`, và là một interface:

```java
public interface Future<V> {
    boolean cancel(boolean mayInterruptIfRunning);
    boolean isCancelled();
    boolean isDone();
    V get() throws InterruptedException, ExecutionException;
    V get(long timeout, TimeUnit unit)
        throws InterruptedException, ExecutionException, TimeoutException;
}
```

Interface này định nghĩa 5 phương thức:

- Phương thức `cancel()` dùng để hủy nhiệm vụ. Nếu hủy thành công, trả về `true`; nếu hủy thất bại, trả về `false`. Tham số `mayInterruptIfRunning` cho biết có cho phép hủy nhiệm vụ đang chạy mà chưa hoàn thành không. Nếu nhiệm vụ đã hoàn thành, phương thức sẽ luôn trả về `false`.
- Phương thức `isCancelled()` cho biết nhiệm vụ có bị hủy thành công không. Nếu nhiệm vụ bị hủy thành công trước khi hoàn thành, trả về `true`.
- Phương thức `isDone()` cho biết nhiệm vụ đã hoàn thành chưa. Nếu đã hoàn thành, trả về `true`.
- Phương thức `get()` dùng để lấy kết quả thực thi. Phương thức này sẽ bị chặn cho đến khi nhiệm vụ hoàn thành và trả về kết quả.
- Phương thức `get(long timeout, TimeUnit unit)` dùng để lấy kết quả trong thời gian giới hạn. Nếu hết thời gian mà vẫn chưa có kết quả, trả về `null`.

Tóm lại, `Future` cung cấp 3 chức năng:

1) Xác định nhiệm vụ đã hoàn thành hay chưa;
2) Có thể ngắt nhiệm vụ;
3) Có thể lấy kết quả thực thi của nhiệm vụ.

Do `Future` chỉ là một interface, nếu chúng ta sử dụng `new` để tạo đối tượng trực tiếp thì trình biên dịch sẽ cảnh báo ⚠️, đề nghị sử dụng `FutureTask`.

Thực tế, `FutureTask` là một lớp duy nhất triển khai `Future`. Trong ví dụ trên, phương thức `executorService.submit()` trả về chính là `FutureTask`. Chúng ta có thể quan sát điều này bằng cách sử dụng chế độ debug.

Dưới đây là bản dịch sang tiếng Việt:

## Lớp triển khai FutureTask cho kết quả tính toán bất đồng bộ

Hãy cùng xem qua cách triển khai của `FutureTask`:

```java
public class FutureTask<V> implements RunnableFuture<V>
```

Lớp `FutureTask` triển khai giao diện `RunnableFuture`. Bây giờ, hãy xem giao diện `RunnableFuture`:

```java
public interface RunnableFuture<V> extends Runnable, Future<V> {
    void run();
}
```

Có thể thấy `RunnableFuture` kế thừa từ giao diện `Runnable` và `Future`, trong khi `FutureTask` triển khai giao diện `RunnableFuture`. Vì vậy, nó vừa có thể được thực thi bởi một luồng dưới dạng `Runnable`, vừa có thể sử dụng để lấy kết quả trả về từ `Callable` dưới dạng `Future`.

`FutureTask` cung cấp 2 constructor:

```java
public FutureTask(Callable<V> callable) {
}
public FutureTask(Runnable runnable, V result) {
}
```

Khi cần thực hiện một tính toán bất đồng bộ và lấy kết quả ở một thời điểm sau đó, chúng ta có thể sử dụng `FutureTask`. Hãy xem qua ví dụ sau:

```java
// Tạo một thread pool với kích thước cố định
ExecutorService executorService = Executors.newFixedThreadPool(3);

// Tạo một loạt Callable
Callable<Integer>[] tasks = new Callable[5];
for (int i = 0; i < tasks.length; i++) {
    final int index = i;
    tasks[i] = new Callable<Integer>() {
        @Override
        public Integer call() throws Exception {
            TimeUnit.SECONDS.sleep(index + 1);
            return (index + 1) * 100;
        }
    };
}

// Gói Callable thành FutureTask và nộp vào thread pool
FutureTask<Integer>[] futureTasks = new FutureTask[tasks.length];
for (int i = 0; i < tasks.length; i++) {
    futureTasks[i] = new FutureTask<>(tasks[i]);
    executorService.submit(futureTasks[i]);
}

// Lấy kết quả của các nhiệm vụ
for (int i = 0; i < futureTasks.length; i++) {
    System.out.println("Kết quả của nhiệm vụ " + (i + 1) + ": " + futureTasks[i].get());
}

// Đóng thread pool
executorService.shutdown();
```

Hãy xem kết quả đầu ra:

```
Kết quả của nhiệm vụ 1: 100
Kết quả của nhiệm vụ 2: 200
Kết quả của nhiệm vụ 3: 300
Kết quả của nhiệm vụ 4: 400
Kết quả của nhiệm vụ 5: 500
```

## Tóm tắt

Bài viết này đã giải thích chi tiết cách sử dụng `Callable`, `Future`, và `FutureTask` trong Java để lấy kết quả thực thi từ các luồng đa nhiệm.