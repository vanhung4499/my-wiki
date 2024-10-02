---
title: Thread State and Method
tags:
  - java
categories:
  - java
order: 6
---
# 6 trạng thái của luồng trong Java

Trước tiên, chúng ta hãy xem xét sự chuyển đổi trạng thái của luồng trong hệ điều hành. Trong hệ điều hành, luồng được coi là một tiến trình nhẹ (lightweight process), vì vậy **trạng thái của luồng thực tế giống với trạng thái của tiến trình**.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240924125347.png)

Các trạng thái chính của luồng trong hệ điều hành gồm:

- Trạng thái sẵn sàng (ready): Luồng đang chờ được sử dụng CPU, sau khi bộ lập lịch gọi sẽ chuyển sang trạng thái running.
- Trạng thái đang chạy (running): Luồng đang sử dụng CPU.
- Trạng thái chờ (waiting): Luồng đang đợi một sự kiện hoặc tài nguyên khác (như I/O).

Bây giờ, hãy xem 6 trạng thái của luồng trong Java:

```java
// Mã nguồn của Thread.State
public enum State {
    NEW,
    RUNNABLE,
    BLOCKED,
    WAITING,
    TIMED_WAITING,
    TERMINATED;
}
```

## NEW

Luồng ở trạng thái NEW chưa được khởi chạy. Ở đây, "chưa khởi chạy" nghĩa là chưa gọi phương thức `start()` của đối tượng Thread.

```java
private void testStateNew() {
    Thread thread = new Thread(() -> {});
    System.out.println(thread.getState()); // In ra NEW
}
```

Như bạn thấy, chỉ tạo một luồng nhưng chưa gọi phương thức start, do đó luồng vẫn ở trạng thái NEW.

### Hai câu hỏi liên quan đến phương thức start

1. Có thể gọi phương thức start nhiều lần trên cùng một luồng không?
2. Nếu một luồng đã hoàn thành (ở trạng thái TERMINATED), liệu có thể gọi phương thức start lần nữa không?

Để phân tích hai câu hỏi này, chúng ta hãy xem mã nguồn của `start()`:

```java
// Sử dụng từ khóa synchronized để đảm bảo phương thức này an toàn trong luồng
public synchronized void start() {
    // threadStatus != 0 nghĩa là luồng này đã được khởi chạy hoặc đã kết thúc
    // Nếu cố gắng khởi chạy lại luồng, sẽ ném ra ngoại lệ IllegalThreadStateException
    if (threadStatus != 0)
        throw new IllegalThreadStateException();

    // Thêm luồng này vào nhóm luồng hiện tại
    group.add(this);

    // Khai báo biến để ghi nhận việc khởi chạy luồng thành công
    boolean started = false;
    try {
        // Sử dụng phương thức native để khởi chạy luồng này
        start0();
        // Nếu không có ngoại lệ, biến started sẽ được gán giá trị true, nghĩa là luồng đã khởi chạy thành công
        started = true;
    } finally {
        // Trong khối finally, dù có ngoại lệ trong try hay không, khối này vẫn được thực thi
        try {
            // Nếu luồng không khởi chạy thành công, xóa luồng khỏi nhóm
            if (!started) {
                group.threadStartFailed(this);
            }
        } catch (Throwable ignore) {
            // Bỏ qua mọi ngoại lệ xảy ra trong tiến trình xóa luồng
        }
    }
}
```

Như bạn thấy, bên trong phương thức `start()`, có một biến `threadStatus`. Nếu biến này khác 0, việc gọi `start()` sẽ ném ra ngoại lệ.

Tiếp theo, hãy xem xét phương thức [native](https://javabetter.cn/oo/native-method.html) `start0()`. Phương thức này không xử lý **threadStatus**. Vậy chúng ta hãy kiểm tra `threadStatus` thông qua debug:

```java
@Test
public void testStartMethod() {
    Thread thread = new Thread(() -> {});
    thread.start(); // Lần gọi đầu tiên
    thread.start(); // Lần gọi thứ hai
}
```

Trong lần gọi đầu tiên của phương thức start, threadStatus có giá trị 0. Trong lần gọi thứ hai, threadStatus không còn bằng 0 nữa.

Hãy xem mã nguồn để kiểm tra trạng thái hiện tại của luồng:

```java
// Mã nguồn của Thread.getState:
public State getState() {
    // Lấy trạng thái hiện tại của luồng
    return sun.misc.VM.toThreadState(threadStatus);
}

// Mã nguồn của sun.misc.VM:
// Nếu giá trị trạng thái của luồng và 4 không bằng 0, luồng đang ở trạng thái RUNNABLE.
// Nếu giá trị trạng thái của luồng và 1024 không bằng 0, luồng đang ở trạng thái BLOCKED.
// Nếu giá trị trạng thái của luồng và 16 không bằng 0, luồng đang ở trạng thái WAITING.
// Nếu giá trị trạng thái của luồng và 32 không bằng 0, luồng đang ở trạng thái TIMED_WAITING.
// Nếu giá trị trạng thái của luồng và 2 không bằng 0, luồng đang ở trạng thái TERMINATED.
// Cuối cùng, nếu giá trị trạng thái của luồng và 1 bằng 0, luồng đang ở trạng thái NEW; ngược lại, luồng ở trạng thái RUNNABLE.
public static State toThreadState(int var0) {
    if ((var0 & 4) != 0) {
        return State.RUNNABLE;
    } else if ((var0 & 1024) != 0) {
        return State.BLOCKED;
    } else if ((var0 & 16) != 0) {
        return State.WAITING;
    } else if ((var0 & 32) != 0) {
        return State.TIMED_WAITING;
    } else if ((var0 & 2) != 0) {
        return State.TERMINATED;
    } else {
        return (var0 & 1) == 0 ? State.NEW : State.RUNNABLE;
    }
}
```

Quay lại hai câu hỏi đã đặt ra:

1. Có thể gọi phương thức start nhiều lần trên cùng một luồng không?
2. Nếu một luồng đã hoàn thành (ở trạng thái TERMINATED), liệu có thể gọi lại phương thức start không?

Kết hợp với mã nguồn ở trên, câu trả lời là:

1. Không thể. Sau khi gọi phương thức start, giá trị của `threadStatus` sẽ thay đổi (`threadStatus != 0`), và việc gọi start lần nữa sẽ ném ra ngoại lệ IllegalThreadStateException.
2. Giá trị của `threadStatus` là 2 đại diện cho trạng thái TERMINATED, do đó không thể khởi chạy lại luồng.

## RUNNABLE

Trạng thái RUNNABLE thể hiện rằng luồng hiện đang chạy. Luồng ở trạng thái RUNNABLE đang chạy trong máy ảo Java (JVM), nhưng cũng có thể đang đợi CPU phân bổ tài nguyên.

Hãy xem định nghĩa về trạng thái RUNNABLE trong mã nguồn của Thread:

```java
/**
 * Trạng thái của luồng RUNNABLE. Một luồng ở trạng thái runnable
 * đang thực thi trong máy ảo Java nhưng cũng có thể đang đợi
 * tài nguyên khác từ hệ điều hành như bộ xử lý.
 */
```

Ý nghĩa của đoạn này mọi người có lẽ đều hiểu rõ, nếu chưa thì có thể dịch lại (thực ra ở trên đã được dịch rồi).

Điều này có nghĩa là trạng thái **RUNNABLE** của luồng Java thực ra bao gồm cả hai trạng thái **ready** và **running** của luồng trong hệ điều hành.

## BLOCKED

Trạng thái BLOCKED là trạng thái bị chặn. Luồng ở trạng thái BLOCKED đang chờ giải phóng [khóa](https://javabetter.cn/thread/lock.html) để có thể vào khu vực đồng bộ hóa.

Chúng ta hãy lấy ví dụ về trạng thái BLOCKED trong cuộc sống:

Giả sử hôm nay sau giờ làm bạn định đi ăn tại căng tin. Khi đến quầy ăn duy nhất của căng tin, bạn thấy có một người đứng trước quầy. Lúc này bạn phải đợi người đó rời khỏi quầy thì mới có thể đến lượt mình.

Giả sử bạn là luồng t2, và người đứng trước bạn là luồng t1. Lúc này t1 đang chiếm giữ khóa (quầy ăn duy nhất), còn bạn t2 đang chờ khóa được giải phóng, do đó bạn đang ở trạng thái BLOCKED.

## WAITING

Trạng thái WAITING là trạng thái đợi. Luồng ở trạng thái WAITING cần được luồng khác đánh thức mới có thể chuyển sang trạng thái RUNNABLE.

Gọi một trong ba phương thức dưới đây sẽ đưa luồng vào trạng thái WAITING:

- `Object.wait()`: Đưa luồng hiện tại vào trạng thái chờ cho đến khi có luồng khác đánh thức nó;
- `Thread.join()`: Chờ một luồng khác hoàn thành, phương thức này gọi ngầm phương thức wait của Object;
- `LockSupport.park()`: Tạm dừng luồng hiện tại cho đến khi nhận được quyền tiếp tục hoặc bị đánh thức. [LockSupport](https://javabetter.cn/thread/LockSupport.html) sẽ được giải thích chi tiết sau.

Chúng ta tiếp tục sử dụng ví dụ ở trên để giải thích trạng thái WAITING:

Sau vài phút chờ đợi, cuối cùng cũng đến lượt bạn. Đột nhiên một quản lý “không hiểu chuyện” xuất hiện. Khi thấy quản lý đến, bạn linh cảm điều không tốt, và đúng là quản lý đến để tìm bạn.

Quản lý kéo bạn ra một góc, yêu cầu bạn hoãn ăn để ông ấy hỏi về dự án chuẩn bị báo cáo. Dù trong lòng bạn không muốn, nhưng vẫn phải rời khỏi quầy ăn.

Lúc này, giả sử bạn vẫn là luồng t2 và quản lý là luồng t1. Mặc dù bạn đã chiếm được khóa (quầy ăn), khi người quản lý “không mời mà đến” này xuất hiện, bạn vẫn phải nhường lại khóa. Lúc này, trạng thái của bạn t2 là WAITING. Quản lý t1 chiếm giữ khóa và chuyển sang trạng thái RUNNABLE.

Nếu quản lý t1 không tự đánh thức bạn t2 (bằng notify, notifyAll...), thì bạn t2 sẽ phải đợi mãi.

## TIMED_WAITING

Trạng thái chờ có thời hạn. Luồng chờ trong một khoảng thời gian cụ thể, sau khi hết thời gian sẽ tự động được đánh thức.

Gọi các phương thức dưới đây sẽ đưa luồng vào trạng thái chờ có thời hạn:

- `Thread.sleep(long millis)`: Đưa luồng hiện tại vào trạng thái ngủ trong thời gian chỉ định;
- `Object.wait(long timeout)`: Luồng nghỉ trong một thời gian nhất định, có thể được đánh thức bằng `notify()` hoặc `notifyAll()` trong thời gian chờ;
- `Thread.join(long millis)`: Chờ luồng hiện tại hoàn thành trong tối đa thời gian millis, nếu millis là 0 thì sẽ chờ vô hạn;
- `LockSupport.parkNanos(long nanos)`: Tạm dừng luồng trong thời gian cụ thể trừ khi được cấp phép tiếp tục; LockSupport sẽ được giải thích sau;
- `LockSupport.parkUntil(long deadline)`: Tương tự, dừng luồng trong thời gian chỉ định.

Chúng ta tiếp tục ví dụ để giải thích trạng thái TIMED_WAITING:

Ngày hôm sau, đến trưa bạn lại đi ăn và đứng trước quầy. Bất ngờ bạn nhớ ra đồng nghiệp bảo bạn đợi anh ấy mười phút để sửa lỗi bug.

Bạn đồng ý chờ, nhưng sau mười phút vẫn không thấy anh ấy đến. Bạn nghĩ mình đã đợi lâu quá rồi và quyết định đi ăn trước.

Lúc này, bạn là luồng t1 và đồng nghiệp sửa bug là luồng t2. t2 bảo t1 đợi trong thời gian nhất định, và t1 trong thời gian chờ đó thuộc trạng thái TIMED_WAITING.

Sau khi t1 chờ 10 phút, luồng sẽ tự động thức dậy và có quyền tranh giành khóa.

## TERMINATED

Trạng thái TERMINATED là trạng thái kết thúc. Lúc này luồng đã hoàn thành việc thực thi.

## Chuyển đổi trạng thái của luồng

Dựa trên các trạng thái luồng đã giới thiệu ở trên, chúng ta có sơ đồ **chuyển đổi trạng thái của luồng** sau:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240924125546.png)

### Chuyển đổi trạng thái giữa BLOCKED và RUNNABLE

Như đã nói ở trên, luồng ở trạng thái BLOCKED đang chờ giải phóng khóa. Giả sử có hai luồng a và b, luồng a giành được khóa trước và chưa giải phóng, lúc này luồng b sẽ ở trạng thái BLOCKED. Hãy xem một ví dụ:

```java
@Test
public void blockedTest() {
    Thread a = new Thread(new Runnable() {
        @Override
        public void run() {
            testMethod();
        }
    }, "a");

    Thread b = new Thread(new Runnable() {
        @Override
        public void run() {
            testMethod();
        }
    }, "b");

    a.start();
    b.start();

    System.out.println(a.getName() + ":" + a.getState()); // In ra trạng thái của a?
    System.out.println(b.getName() + ":" + b.getState()); // In ra trạng thái của b?
}

// Phương thức đồng bộ tranh chấp khóa
private synchronized void testMethod() {
    try {
        Thread.sleep(2000L);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}
```

Thoạt nhìn, có thể mọi người nghĩ rằng luồng a sẽ gọi phương thức đồng bộ trước, và vì phương thức đồng bộ gọi `Thread.sleep()`, nên chắc chắn sẽ in ra trạng thái TIMED_WAITING. Còn luồng b do đang chờ luồng a giải phóng khóa, chắc chắn sẽ in ra trạng thái BLOCKED.

Nhưng thực tế không hẳn như vậy. Có hai điểm cần chú ý:

- Thứ nhất, **trong phương thức `blockedTest()` còn có một luồng main**.
- Thứ hai, **sau khi khởi động luồng, việc thực thi phương thức run cũng cần một khoảng thời gian nhất định**.

Luồng main trong phương thức test chỉ đảm bảo rằng hai luồng a và b gọi phương thức start (chuyển sang trạng thái RUNNABLE). Nếu CPU có hiệu suất cao, có thể chưa kịp đến lúc hai luồng bắt đầu tranh chấp khóa, trạng thái của chúng đã được in ra (RUNNABLE).

Tất nhiên, nếu CPU có hiệu suất thấp hơn, có thể một trong các luồng sẽ in ra trạng thái BLOCKED (lúc này hai luồng đã bắt đầu tranh chấp khóa).

Dưới đây là kết quả sau vài lần thực thi:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240924130902.png)

Lúc này bạn có thể hỏi: Nếu tôi muốn in ra trạng thái BLOCKED thì phải làm sao?

Trạng thái BLOCKED chỉ xuất hiện khi hai luồng tranh chấp khóa. Vì vậy, chúng ta chỉ cần xử lý luồng main trong phương thức test bằng cách cho nó "nghỉ một chút" bằng cách gọi phương thức `Thread.sleep()`.

Điều cần chú ý là thời gian nghỉ của luồng main phải đảm bảo nằm trong khoảng thời gian hai luồng tranh chấp khóa, đừng để khóa được giải phóng rồi mới bắt đầu tranh chấp, lúc đó sẽ không thể thấy trạng thái BLOCKED.

Chúng ta sẽ thay đổi một chút phương thức blockedTest:

```java
public void blockedTest() throws InterruptedException {
    ······
    a.start();
    Thread.sleep(1000L); // Chú ý luồng main nghỉ 1000ms, trong khi testMethod() nghỉ 2000ms
    b.start();
    System.out.println(a.getName() + ":" + a.getState()); // In ra trạng thái của a?
    System.out.println(b.getName() + ":" + b.getState()); // In ra trạng thái của b?
}
```

Kết quả chạy như sau:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240924130921.png)

Trong ví dụ này, quá trình chuyển đổi trạng thái của hai luồng như sau:

- Trạng thái của a: RUNNABLE (`a.start()`) -> TIMED_WAITING (`Thread.sleep()`) -> RUNNABLE (sau khi `sleep()` kết thúc) -> _BLOCKED (không giành được khóa)_ -> TERMINATED
- Trạng thái của b: RUNNABLE (`b.start()`) -> _BLOCKED (không giành được khóa)_ -> TERMINATED

Trạng thái in nghiêng là các trạng thái có thể xảy ra. Bạn có thể thử nhiều lần trên máy tính của mình để xem kết quả. Tương tự, kết quả đầu ra ở đây cũng có thể thay đổi tùy trường hợp.

### Chuyển đổi trạng thái giữa WAITING và RUNNABLE

Theo sơ đồ chuyển đổi, có 3 phương thức có thể làm cho luồng chuyển từ trạng thái RUNNABLE sang WAITING. Chúng ta sẽ tập trung giới thiệu về **Object.wait()** và **Thread.join()**.

#### Object.wait()

Trước khi gọi phương thức `wait()`, luồng phải nắm giữ khóa của đối tượng.

Khi luồng gọi phương thức `wait()`, nó sẽ giải phóng khóa hiện tại và chờ cho đến khi có luồng khác gọi phương thức `notify()` hoặc `notifyAll()` để đánh thức luồng đang chờ.

Cần lưu ý rằng, khi một luồng khác gọi phương thức `notify()`, nó chỉ đánh thức một luồng duy nhất đang chờ khóa. Nếu có nhiều luồng đang chờ, không nhất thiết là luồng đã gọi phương thức `wait()` trước đó sẽ được đánh thức.

Tương tự, khi gọi phương thức `notifyAll()` để đánh thức tất cả các luồng đang chờ khóa, cũng không đảm bảo rằng luồng vừa từ bỏ khóa sẽ ngay lập tức được cấp thời gian thực thi. Việc này phụ thuộc vào sự điều phối của hệ thống.

#### Thread.join()

Khi gọi phương thức `join()`, nó sẽ chờ cho đến khi luồng này hoàn thành (chuyển sang trạng thái TERMINATED).

Chúng ta sẽ thay đổi cách khởi động luồng trong ví dụ trên:

```java
public void blockedTest() {
    ······
    a.start();
    a.join();
    b.start();
    System.out.println(a.getName() + ":" + a.getState()); // In ra TERMINATED
    System.out.println(b.getName() + ":" + b.getState());
}
```

Nếu không gọi phương thức join, luồng main sẽ tiếp tục thực thi mà không quan tâm luồng a đã hoàn thành hay chưa.

Sau khi luồng a được khởi động, nó gọi ngay phương thức join. Lúc này, luồng main sẽ chờ cho đến khi luồng a hoàn thành, vì vậy trạng thái của luồng a chắc chắn sẽ là **TERMINATED**.

Còn trạng thái của luồng b có thể là RUNNABLE (chưa vào phương thức đồng bộ) hoặc TIMED_WAITING (đã vào phương thức đồng bộ).

### Chuyển đổi trạng thái giữa TIMED_WAITING và RUNNABLE

TIMED_WAITING tương tự như WAITING, chỉ khác là TIMED_WAITING có thời gian chờ cụ thể.

#### Thread.sleep(long)

Phương thức `sleep(long)` làm cho luồng hiện tại ngủ trong một khoảng thời gian xác định. Cần lưu ý rằng “ngủ” ở đây chỉ tạm thời ngừng thực thi luồng, chứ không giải phóng khóa. Khi hết thời gian, luồng sẽ quay lại trạng thái RUNNABLE.

#### Object.wait(long)

Phương thức `wait(long)` làm cho luồng chuyển sang trạng thái TIMED_WAITING. Giống với phương thức `wait()` không có tham số, luồng có thể được đánh thức bởi luồng khác gọi phương thức `notify()` hoặc `notifyAll()`.

Điểm khác biệt là phương thức `wait(long)` có tham số thời gian. Ngay cả khi không có luồng nào đánh thức, sau khi thời gian long đã chỉ định kết thúc, luồng sẽ tự động được đánh thức và có thể giành lại khóa.

#### Thread.join(long)

Phương thức `join(long)` làm cho luồng hiện tại đợi một khoảng thời gian xác định và đưa luồng vào trạng thái TIMED_WAITING.

Chúng ta sẽ thay đổi ví dụ trên:

```java
public void blockedTest() {
    ······
    a.start();
    a.join(1000L);
    b.start();
    System.out.println(a.getName() + ":" + a.getState()); // In ra TIMED_WAITING
    System.out.println(b.getName() + ":" + b.getState());
}
```

Khi gọi `a.join(1000L)`, thời gian chỉ định nhỏ hơn thời gian sleep của luồng a, vì vậy trạng thái của luồng a sẽ là TIMED_WAITING.

Trạng thái của luồng b vẫn không cố định (RUNNABLE hoặc BLOCKED).

### Ngắt luồng

Trong một số trường hợp, sau khi khởi động luồng, chúng ta có thể nhận thấy không cần thiết cho luồng tiếp tục thực thi, và cần ngắt luồng. Hiện tại, Java không có phương pháp an toàn nào để dừng luồng trực tiếp, nhưng Java cung cấp cơ chế ngắt luồng để xử lý những tình huống cần ngắt luồng.

Cơ chế ngắt luồng là một cơ chế hợp tác. Cần lưu ý rằng, thao tác ngắt luồng không trực tiếp kết thúc luồng ngay lập tức mà thông báo cho luồng bị ngắt tự xử lý.

Dưới đây là một số phương thức liên quan đến cơ chế ngắt luồng trong lớp Thread:

- `Thread.interrupt()` – Ngắt luồng. Phương thức này không ngay lập tức dừng luồng mà chỉ đặt trạng thái ngắt của luồng thành true (mặc định là false);
- `Thread.isInterrupted()` – Kiểm tra xem luồng hiện tại có bị ngắt không.
- `Thread.interrupted()` – Kiểm tra xem luồng hiện tại có bị ngắt không, và khác với `isInterrupted()`, phương thức này sẽ xóa trạng thái ngắt nếu phát hiện luồng bị ngắt.

Trong cơ chế ngắt luồng, khi luồng khác yêu cầu ngắt một luồng, trạng thái ngắt của luồng đó được đặt thành true. Tuy nhiên, luồng bị yêu cầu ngắt sẽ tự quyết định cách xử lý yêu cầu này: nó có thể ngừng tại một điểm thích hợp hoặc tiếp tục thực thi mà không xử lý yêu cầu ngắt.

## Tóm tắt

Bài viết này đã phân tích chi tiết 6 trạng thái của luồng trong Java – New (mới), Runnable (đang chạy), Blocked (bị khóa), Waiting (đang chờ), Timed Waiting (chờ có thời gian) và Terminated (kết thúc), cũng như quá trình chuyển đổi giữa các trạng thái này.