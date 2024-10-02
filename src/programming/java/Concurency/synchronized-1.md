---
title: Synchronized
tags:
  - java
categories:
  - java
order: 12
---
# Từ khóa synchronized

Trong Java, từ khóa `synchronized` đảm bảo rằng tại cùng một thời điểm, chỉ có một luồng (thread) có thể thực thi một phương thức hoặc đoạn mã nhất định (chủ yếu là các thao tác liên quan đến dữ liệu chia sẻ trong phương thức hoặc đoạn mã đó). Chúng ta cũng cần lưu ý rằng `synchronized` còn có một vai trò quan trọng khác: nó đảm bảo sự thay đổi của một luồng (chủ yếu là sự thay đổi của dữ liệu chia sẻ) có thể được các luồng khác nhìn thấy (đảm bảo tính khả biến, hoàn toàn có thể thay thế tính năng của từ khóa [volatile](./volatile)).

Từ khóa `synchronized` chủ yếu có 3 cách sử dụng sau:

- Đồng bộ phương thức: Khóa đối tượng hiện tại (this), trước khi vào mã đồng bộ phải nhận được khóa của đối tượng hiện tại.
- Đồng bộ phương thức tĩnh: Khóa lớp hiện tại (khóa là đối tượng Class), trước khi vào mã đồng bộ phải nhận được khóa của lớp hiện tại.
- Đồng bộ khối mã: Khóa một đối tượng nhất định, trước khi vào khối mã đồng bộ phải nhận được khóa của đối tượng được chỉ định.

## Đồng bộ phương thức bằng synchronized

Bằng cách thêm từ khóa `synchronized` vào khai báo phương thức, chúng ta có thể đảm bảo rằng tại bất kỳ thời điểm nào, chỉ có một luồng có thể thực thi phương thức đó.

Xem đoạn mã sau:

```java
public class AccountingSync implements Runnable {
    // Tài nguyên chia sẻ (tài nguyên cần được bảo vệ)
    static int i = 0;
    // Phương thức synchronized đồng bộ
    public synchronized void increase() {
        i ++;
    }
    @Override
    public void run() {
        for(int j=0;j<1000000;j++){
            increase();
        }
    }
    public static void main(String args[]) throws InterruptedException {
        AccountingSync instance = new AccountingSync();
        Thread t1 = new Thread(instance);
        Thread t2 = new Thread(instance);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println("static, i output:" + i);
    }
}
```

Kết quả đầu ra:

```
/**
 * Kết quả đầu ra:
 * static, i output: 2000000
 */
```

Nếu không thêm `synchronized` vào phương thức `increase()`, vì thao tác `i++` không mang tính nguyên tử, nên kết quả cuối cùng sẽ nhỏ hơn 2.000.000. Giải thích chi tiết về vấn đề này có thể tham khảo bài viết về từ khóa [volatile](./volatile.html).

> Lưu ý: Một đối tượng chỉ có một khóa. Khi một luồng nắm giữ khóa của đối tượng, các luồng khác không thể nhận được khóa của đối tượng đó, do đó không thể truy cập các phương thức `synchronized` khác của đối tượng. Tuy nhiên, các luồng khác vẫn có thể truy cập các phương thức không sử dụng từ khóa `synchronized`.

Tuy nhiên, nếu một luồng A cần truy cập vào phương thức synchronized của đối tượng `obj1`, trong khi một luồng B truy cập vào phương thức synchronized của đối tượng `obj2`, điều này được phép vì hai đối tượng có các khóa khác nhau.

Ví dụ:

```java
public class AccountingSyncBad implements Runnable {
    // Tài nguyên chia sẻ (tài nguyên cần được bảo vệ)
    static int i = 0;
    // Phương thức synchronized đồng bộ
    public synchronized void increase() {
        i ++;
    }

    @Override
    public void run() {
        for(int j=0;j<1000000;j++){
            increase();
        }
    }

    public static void main(String args[]) throws InterruptedException {
        // Tạo hai đối tượng AccountingSyncBad
        Thread t1 = new Thread(new AccountingSyncBad());
        Thread t2 = new Thread(new AccountingSyncBad());
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println("static, i output:" + i);
    }
}
```

Kết quả đầu ra:

```
/**
 * Kết quả đầu ra:
 * static, i output: 1224617
 */
```

Khác biệt so với ví dụ trước, chúng ta tạo hai đối tượng `AccountingSyncBad`, sau đó khởi chạy hai luồng để thực hiện thao tác trên biến chia sẻ `i`. Kết quả nhận được là 1.224.617, không phải là 2.000.000 như mong đợi.

Nguyên nhân là do mỗi đối tượng có một khóa riêng, nên các luồng t1 và t2 đã sử dụng hai khóa khác nhau, khiến cho tính an toàn luồng (thread safety) không được đảm bảo.

> Mỗi đối tượng có một khóa riêng, các đối tượng khác nhau sẽ không ảnh hưởng đến khóa của nhau.

Cách giải quyết vấn đề này là sử dụng từ khóa `synchronized` cho phương thức tĩnh, khi đó khóa sẽ là khóa của lớp, và vì lớp chỉ có một, khóa sẽ là duy nhất cho tất cả các đối tượng của lớp.

## Đồng bộ phương thức tĩnh bằng synchronized

Khi `synchronized` được sử dụng cho một phương thức tĩnh, khóa sẽ là khóa của đối tượng `Class` hiện tại, không phải là khóa của một đối tượng cụ thể nào. Khóa của `Class` không ảnh hưởng đến khóa của các đối tượng và ngược lại.

Do các biến tĩnh không thuộc về bất kỳ đối tượng cụ thể nào, nên sử dụng khóa `Class` có thể kiểm soát việc truy cập đồng thời vào các biến tĩnh.

Lưu ý rằng nếu một luồng A gọi một phương thức synchronized không tĩnh của đối tượng, và một luồng B gọi phương thức synchronized tĩnh của lớp, sẽ không có sự xung đột vì chúng sử dụng hai khóa khác nhau.

Xem ví dụ sau:

```java
public class AccountingSyncClass implements Runnable {
    static int i = 0;
    /**
     * Phương thức synchronized tĩnh, khóa là đối tượng class của AccountingSyncClass
     */
    public static synchronized void increase() {
        i++;
    }
    // Phương thức không tĩnh, khóa sẽ khác nên không có sự xung đột
    public synchronized void increase4Obj() {
        i++;
    }
    @Override
    public void run() {
        for(int j=0;j<1000000;j++){
            increase();
        }
    }
    public static void main(String[] args) throws InterruptedException {
        // Tạo đối tượng mới
        Thread t1=new Thread(new AccountingSyncClass());
        Thread t2=new Thread(new AccountingSyncClass());
        // Khởi chạy luồng
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(i);
    }
}
/**
 * Kết quả đầu ra:
 * 2000000
 */
```

Trong ví dụ này, phương thức `increase()` là một phương thức tĩnh được đồng bộ, và khóa của nó là đối tượng `Class` của lớp.

## Khối mã đồng bộ hóa với từ khóa synchronized

Trong một số trường hợp, khi chúng ta viết các phương thức có khối lượng mã lớn và có một số thao tác tiêu tốn thời gian, nhưng chỉ có một phần nhỏ cần được đồng bộ hóa, việc đồng bộ hóa toàn bộ phương thức có thể không mang lại hiệu quả. Lúc này, chúng ta có thể sử dụng cách đồng bộ hóa từng khối mã nhỏ bằng từ khóa synchronized để bao bọc các phần mã cần đồng bộ.

Ví dụ:

```java
public class AccountingSync2 implements Runnable {
    static AccountingSync2 instance = new AccountingSync2();  // Sử dụng mô hình Singleton

    static int i = 0;

    @Override
    public void run() {
        // Bỏ qua các thao tác tốn thời gian khác....
        // Sử dụng khối mã đồng bộ hóa cho biến i, đối tượng khóa là instance
        synchronized(instance) {
            for(int j = 0; j < 1000000; j++) {
                i++;
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(instance);
        Thread t2 = new Thread(instance);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(i);
    }
}
```

Kết quả đầu ra:

```
/**
 * Kết quả:
 * 2000000
 */
```

Chúng ta đã sử dụng từ khóa `synchronized` để bao bọc khối mã với một đối tượng cụ thể `instance`, tức là đối tượng hiện tại sẽ là đối tượng bị khóa. Khi một luồng vào khối mã được bao bọc bởi từ khóa `synchronized`, luồng này sẽ yêu cầu khóa của đối tượng `instance`. Nếu có một luồng khác đã nắm giữ khóa của đối tượng này, luồng mới phải chờ đợi, điều này đảm bảo chỉ có một luồng thực hiện thao tác `i++` tại một thời điểm.

Ngoài việc sử dụng `instance` làm đối tượng khóa, chúng ta cũng có thể sử dụng đối tượng `this` (đại diện cho thể hiện hiện tại) hoặc đối tượng `Class` của lớp hiện tại để làm đối tượng khóa, như trong các đoạn mã sau:

```java
// this, khóa đối tượng hiện tại
synchronized(this) {
    for(int j = 0; j < 1000000; j++) {
        i++;
    }
}
// Khóa đối tượng Class
synchronized(AccountingSync.class) {
    for(int j = 0; j < 1000000; j++) {
        i++;
    }
}
```

## synchronized và quy tắc happens-before

Chúng ta đã đề cập đến việc sắp xếp lại lệnh khi nói về [JMM](./jmm), và bây giờ sẽ kết hợp từ khóa `synchronized` để giải thích thêm.

Xem đoạn mã dưới đây:

```java
class MonitorExample {
    int a = 0;
    public synchronized void writer() {  //1
        a++;                             //2
    }                                    //3
    public synchronized void reader() {  //4
        int i = a;                       //5
        //……
    }                                    //6
}
```

Giả sử luồng A thực hiện phương thức `writer()` và sau đó luồng B thực hiện phương thức `reader()`. Dựa theo quy tắc happens-before, quá trình này sẽ bao gồm các quan hệ happens-before sau:

- Theo quy tắc thứ tự chương trình, 1 happens-before 2, 2 happens-before 3; 4 happens-before 5, và 5 happens-before 6.
- Theo quy tắc khóa đồng bộ, 3 happens-before 4.
- Theo quy tắc truyền của happens-before, 2 happens-before 5.

> Trong mô hình bộ nhớ của Java, quy tắc khóa đồng bộ là một quy tắc happens-before, quy định rằng thao tác giải phóng khóa happens-before thao tác lấy khóa tiếp theo. Nói cách khác, khi một luồng giải phóng một khóa, tất cả các thay đổi trước đó của luồng đó sẽ trở nên có thể nhìn thấy được với bất kỳ luồng nào tiếp theo lấy khóa đó.

Hình dưới đây minh họa mối quan hệ happens-before trong quá trình này:

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/synchronized-1-f4430c27-5a0e-49c1-bac5-fe8562b0cdc5.jpg)

Trong hình, mỗi mũi tên đen đại diện cho một quan hệ happens-before theo quy tắc thứ tự chương trình, mũi tên cam biểu thị quan hệ theo quy tắc khóa đồng bộ, và mũi tên xanh biểu thị việc kết hợp các quy tắc để đảm bảo happens-before.

Hình minh họa rằng sau khi luồng A giải phóng khóa, luồng B tiếp theo lấy cùng một khóa. Vì vậy, thao tác `a++` trong phương thức `writer()` và việc đọc biến `a` trong phương thức `reader()` có quan hệ happens-before, đảm bảo rằng kết quả và sự thay đổi trong bộ nhớ là có thể nhìn thấy.

## synchronized là một loại khóa tái nhập

Về mặt thiết kế, khi một luồng cố gắng truy cập tài nguyên mà bị khóa bởi luồng khác, nó sẽ ở trạng thái chờ. Tuy nhiên, nếu luồng đó đã nắm giữ khóa và yêu cầu lại tài nguyên, yêu cầu này sẽ thành công – điều này được gọi là "khóa tái nhập".

`synchronized` là một loại khóa tái nhập, vì vậy một luồng có thể gọi phương thức `synchronized` khác của cùng một đối tượng trong khi đã giữ khóa của nó. Ví dụ:

```java
public class AccountingSync implements Runnable{
    static AccountingSync instance = new AccountingSync();
    static int i = 0;
    static int j = 0;

    @Override
    public void run() {
        for(int j = 0; j < 1000000; j++) {
            synchronized(this) {
                i++;
                increase(); // Tính tái nhập của synchronized
            }
        }
    }

    public synchronized void increase() {
        j++;
    }

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(instance);
        Thread t2 = new Thread(instance);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(i);
    }
}
```

Trong ví dụ trên, cả hai phương thức `synchronized(this)` và phương thức `synchronized increase` đều sử dụng cùng một khóa, vì vậy chúng có thể thực hiện an toàn trong một môi trường đa luồng.

## Tổng kết

Hãy ghi nhớ ba cách sử dụng từ khóa synchronized, cách phân tích tình huống sắp xếp lại lệnh, và tính tái nhập của nó. Việc đồng bộ hóa sẽ có một chút chi phí về hiệu năng, vì vậy cần sử dụng hợp lý, tránh việc đồng bộ hóa toàn bộ phương thức mà nên đồng bộ hóa ở mức nhỏ nhất có thể.