---
title: Synchronized States
tags:
  - java
categories:
  - java
order: 13
---
# Bốn trạng thái của synchronized

Trong bài trước, chúng ta đã tìm hiểu về cách sử dụng cơ bản của từ khóa synchronized. Nó có thể được sử dụng để đồng bộ hóa phương thức và khối mã. Vậy `synchronized` thực sự khóa cái gì? Khi phiên bản JDK nâng cấp, `synchronized` đã có những thay đổi gì? Liệu có đúng không rằng "hiệu suất của synchronized rất kém"?

Tôi nghĩ đây là câu hỏi mà nhiều bạn quan tâm.

Điều đầu tiên cần làm rõ là: **Khóa trong Java đa luồng đều dựa trên đối tượng**, mỗi đối tượng trong Java đều có thể làm khóa.

Một điểm nữa cần chú ý là, cái mà chúng ta thường nghe là **khóa lớp** thực chất cũng là khóa đối tượng, như đã nói ở [bài trước](./synchronized-1.html), chắc hẳn nhiều bạn đã nhận ra.

Hãy nói thêm một chút về điều này. Đối tượng `Class` là một đối tượng đặc biệt trong Java, đại diện cho các lớp và giao diện trong chương trình. Mỗi kiểu trong Java (bao gồm lớp, giao diện, mảng và kiểu nguyên thủy) đều có một đối tượng `Class` duy nhất trong JVM tương ứng với nó. Đối tượng `Class` này được tạo ra khi JVM tải lớp, và quá trình này được thực hiện tự động bởi JVM.

Đối tượng `Class` chứa nhiều thông tin liên quan đến lớp, chẳng hạn như tên lớp, lớp cha, các giao diện mà lớp thực hiện, các phương thức, trường của lớp,... Những thông tin này thường được gọi là "metadata" (siêu dữ liệu).

Chúng ta có thể sử dụng đối tượng `Class` để lấy siêu dữ liệu của lớp, thậm chí có thể tạo động các phiên bản của lớp, gọi phương thức của lớp, truy cập vào các trường của lớp, v.v. Đây chính là cơ chế phản xạ của Java (Reflection).

Vì vậy, cái gọi là khóa lớp thực chất là khóa đối tượng `Class`.

## Cách sử dụng cơ bản của khóa

Từ khóa `synchronized` có nghĩa là "đồng bộ hóa".

Chúng ta thường sử dụng từ khóa `synchronized` để khóa một đoạn mã hoặc một phương thức. Như đã đề cập trong [bài trước](./synchronized-1.html), chúng ta hãy điểm qua nhanh lại, vì `synchronized` rất quan trọng và thường được hỏi trong các cuộc phỏng vấn cũng như khi lập trình. Nó thường có ba hình thức sau:

```java
// Từ khóa trong phương thức instance, khóa là đối tượng hiện tại
public synchronized void instanceLock() {
    // code
}

// Từ khóa trong phương thức static, khóa là đối tượng Class hiện tại
public static synchronized void classLock() {
    // code
}

// Từ khóa trong khối mã, khóa là đối tượng bên trong dấu ngoặc
public void blockLock() {
    Object o = new Object();
    synchronized (o) {
        // code
    }
}
```

Ở đây, khái niệm critical section được giới thiệu. critical section là một khu vực mã mà chỉ một luồng có thể thực thi tại một thời điểm. Trong các ví dụ trên, nếu từ khóa `synchronized` được sử dụng trong phương thức, thì critical section chính là toàn bộ phương thức. Nếu nó là một khối mã `synchronized`, thì critical section chỉ là khu vực mã bên trong khối mã đó.

Nhìn vào các ví dụ trên, chúng ta có thể thấy hai cách viết sau thực chất có tác dụng tương đương:

```java
// Từ khóa trong phương thức instance, khóa là đối tượng hiện tại
public synchronized void instanceLock() {
    // code
}

// Từ khóa trong khối mã, khóa là đối tượng hiện tại
public void blockLock() {
    synchronized (this) {
        // code
    }
}
```

Tương tự, hai phương thức dưới đây cũng có tác dụng tương đương:

```java
// Từ khóa trong phương thức static, khóa là đối tượng Class hiện tại
public static synchronized void classLock() {
    // code
}

// Từ khóa trong khối mã, khóa là đối tượng Class hiện tại
public void blockLock() {
    synchronized (this.getClass()) {
        // code
    }
}
```

## Bốn trạng thái của khóa và hạ cấp khóa

Trước JDK 1.6, tất cả các khóa đều là "khóa nặng" vì sử dụng khóa của hệ điều hành, khi một luồng giữ khóa thì các luồng khác cố gắng truy cập vào khối `synchronized` sẽ bị chặn cho đến khi khóa được giải phóng. Điều này liên quan đến việc chuyển đổi ngữ cảnh luồng và chuyển đổi giữa người dùng và chế độ lõi của hệ điều hành, dẫn đến hiệu suất thấp.

Đây là lý do tại sao nhiều lập trình viên nghĩ rằng hiệu suất của `synchronized` rất kém.

Để giảm thiểu chi phí hiệu suất khi lấy và giải phóng khóa, JDK 1.6 đã giới thiệu khái niệm "khóa thiên vị" và "khóa nhẹ", làm cho `synchronized` có một bước cải tiến lớn về hiệu suất. Kể từ JDK 1.6 trở đi, một đối tượng thực sự có bốn trạng thái khóa, xếp theo thứ tự từ thấp đến cao như sau:

1. Trạng thái không khóa
2. Trạng thái khóa thiên vị
3. Trạng thái khóa nhẹ
4. Trạng thái khóa nặng

Không khóa nghĩa là không có bất kỳ khóa nào trên tài nguyên, bất kỳ luồng nào cũng có thể cố gắng sửa đổi nó, điều này rất dễ hiểu.

Các loại khóa này có thể nâng cấp dần dần tùy theo mức độ cạnh tranh, quá trình nâng cấp khóa rất dễ xảy ra, nhưng việc hạ cấp khóa lại ít xảy ra hơn. Hạ cấp khóa thường xảy ra trong quá trình [Stop The World](../jvm/gc) (một khái niệm quan trọng trong thu gom rác của Java, chúng ta sẽ đề cập sâu hơn trong phần JVM), khi JVM vào điểm an toàn và kiểm tra xem có khóa nào không được sử dụng để thực hiện hạ cấp.

Về hạ cấp khóa, có một điều cần làm rõ:

Khác với phần lớn các bài viết cho rằng không thể hạ cấp khóa, thực tế là HotSpot JVM hỗ trợ hạ cấp khóa. Trong [bài đăng này](https://openjdk.org/jeps/8183909), có một luận điểm quan trọng mà bài viết đưa ra, do tác giả nổi tiếng R-Giải trình bày.

> In its current implementation, monitor deflation is performed during every STW pause, while all Java threads are waiting at a safepoint. We have seen safepoint cleanup stalls up to 200ms on monitor-heavy-applications。

Điều này có nghĩa rằng hạ cấp khóa nặng xảy ra trong giai đoạn STW, và chỉ áp dụng cho các đối tượng chỉ có thể được truy cập bởi VMThread mà không có JavaThread nào khác truy cập.

So sánh ưu nhược điểm của các loại khóa:

| Loại khóa  | Ưu điểm                                                   | Nhược điểm                                        | Tình huống sử dụng                          |
| ---------  | ----------------------------------------------------------| ------------------------------------------------ | ------------------------------------------ |
| Khóa thiên vị  | Việc lấy và thả khóa không tốn nhiều tài nguyên, gần như không khác so với việc thực hiện phương thức không đồng bộ. | Nếu có sự cạnh tranh giữa các luồng, sẽ có chi phí hủy bỏ khóa. | Dùng trong tình huống chỉ có một luồng truy cập khối đồng bộ. |
| Khóa nhẹ      | Các luồng cạnh tranh không bị chặn, giúp cải thiện tốc độ phản hồi của chương trình. | Nếu không lấy được khóa, các luồng quay vòng sẽ tiêu tốn CPU. | Ưu tiên tốc độ phản hồi. Khối đồng bộ thực thi nhanh. |
| Khóa nặng      | Luồng cạnh tranh không quay vòng, không tiêu tốn CPU. | Các luồng bị chặn, tốc độ phản hồi chậm.          | Ưu tiên thông lượng. Khối đồng bộ thực thi lâu dài. |

## Khóa của đối tượng được lưu ở đâu?

Như đã nói ở phần trước, khóa trong Java đều dựa trên đối tượng.

Đầu tiên, hãy xem khóa của một đối tượng được lưu trữ ở đâu.

Mỗi đối tượng Java đều có một "tiêu đề đối tượng" (object header). Nếu là loại không phải mảng, đầu đối tượng chiếm 2 word; nếu là mảng, nó chiếm 3 word. Trong bộ xử lý 32-bit, một word là 32 bit; trong JVM 64-bit, một word là 64 bit. Nội dung của đầu đối tượng như sau:

| Chiều dài | Nội dung  | Mô tả            |
| --------- | --------- | ---------------- |
| 32/64 bit | Mark Word | Lưu trữ hashCode của đối tượng hoặc thông tin về khóa |
| 32/64 bit  | Class Metadata Address    | Con trỏ đến dữ liệu loại của đối tượng |
| 32/64 bit  | Array length             | Độ dài của mảng (nếu là mảng)     |

Hãy cùng xem định dạng của `Mark Word`:

| Trạng thái khóa  | 29 bit hoặc 61 bit         | 1 bit Khóa thiên vị? | 2 bit Trạng thái khóa |
| ---------------  | --------------------------| -------------------- | --------------------  |
| Không khóa       |                            | 0                    | 01                     |
| Khóa thiên vị     | ID của luồng               | 1                    | 01                     |
| Khóa nhẹ         | Con trỏ tới bản ghi khóa trong ngăn xếp | Bit này không dùng để đánh dấu khóa thiên vị | 00  |
| Khóa nặng        | Con trỏ tới khóa nặng       | Bit này không dùng để đánh dấu khóa thiên vị | 10   |
| Đánh dấu GC       |                            | Bit này không dùng để đánh dấu khóa thiên vị | 11   |

Khi trạng thái của đối tượng là khóa thiên vị, `Mark Word` lưu trữ ID của luồng đang sở hữu khóa; khi là khóa nhẹ, `Mark Word` lưu trữ con trỏ tới `Lock Record` trong ngăn xếp của luồng; khi là khóa nặng, `Mark Word` là con trỏ tới đối tượng monitor (giám sát) trong bộ nhớ heap.

> Trong Java, "monitor" là một công cụ đồng bộ hóa được sử dụng để bảo vệ dữ liệu chia sẻ, tránh việc truy cập không đồng bộ của nhiều luồng gây ra sự không nhất quán trong dữ liệu. Mỗi đối tượng trong Java đều có một monitor tích hợp sẵn.

Monitor bao gồm hai phần quan trọng, một là khóa, và phần còn lại là cơ chế chờ/thông báo, được thực hiện thông qua các phương thức `wait()`, `notify()`, `notifyAll()` của lớp `Object` (chúng ta sẽ tìm hiểu chi tiết khi nói về [Condition](./condition.html) và [mô hình sản xuất-tiêu thụ](./producer-consumer)).

Bây giờ, chúng ta sẽ lần lượt giới thiệu các loại khóa này và cách chúng được nâng cấp.

Dưới đây là bản dịch tiếng Việt của đoạn văn bạn cung cấp:

## Khoá thiên vị

Tác giả của Hotspot đã nhận thấy rằng trong hầu hết các trường hợp, **khóa không chỉ không có sự cạnh tranh giữa các luồng, mà còn luôn được cùng một luồng nắm giữ nhiều lần**, vì vậy đã giới thiệu khoá thiên vị.

khoá thiên vị sẽ thiên về luồng đầu tiên truy cập khóa; nếu trong quá trình chạy tiếp theo, khóa đó không bị truy cập bởi các luồng khác, thì luồng nắm giữ khoá thiên vị sẽ không cần kích hoạt đồng bộ hóa. Nói cách khác, **khoá thiên vị trong trường hợp không có cạnh tranh tài nguyên đã loại bỏ câu lệnh đồng bộ hóa**, không cần thực hiện thao tác [CAS](./cas) (sẽ được nói chi tiết hơn sau, nhấn vào liên kết để đến). Điều này đã cải thiện hiệu suất chạy của chương trình một cách đáng kể.

Nói đơn giản, đó là việc thiết lập một biến cho khóa. Nếu biến này là true, nghĩa là không có cạnh tranh tài nguyên, thì không cần thực hiện các quy trình khóa/mở khóa. Nếu biến này là false, nghĩa là có luồng khác đang cạnh tranh tài nguyên, thì sẽ chuyển sang quy trình sau.

### Nguyên lý thực hiện khoá thiên vị

Khi một luồng lần đầu tiên vào khối đồng bộ, nó sẽ lưu trữ ThreadId thiên về khóa trong đầu đối tượng và bản ghi khóa trong khung ngăn xếp. Khi lần sau luồng này vào khối đồng bộ này, nó sẽ kiểm tra xem ThreadId trong Mark Word của khóa có phải là ID của chính nó hay không.

Nếu đúng, điều đó có nghĩa là luồng này đã nắm giữ khóa, và sau đó luồng này không cần thực hiện thao tác CAS để khóa và mở khóa khi vào và ra khỏi khối đồng bộ; nếu không, điều đó có nghĩa là có một luồng khác đang cạnh tranh khoá thiên vị này. Lúc này, nó sẽ cố gắng sử dụng CAS để thay thế ThreadId trong Mark Word bằng ID của luồng mới. Lúc này, sẽ có hai trường hợp xảy ra:

- Thành công, có nghĩa là luồng trước đó không còn tồn tại, ThreadId trong Mark Word sẽ là ID của luồng mới, khóa sẽ không được nâng cấp, vẫn là khoá thiên vị.
- Thất bại, có nghĩa là luồng trước đó vẫn tồn tại, vì vậy sẽ tạm dừng luồng trước đó, đặt cờ hiệu khoá thiên vị thành 0 và đặt cờ khóa thành 00, nâng cấp thành khóa nhẹ, sẽ cạnh tranh khóa theo cách của khóa nhẹ.

[CAS: So sánh và Hoán đổi](./cas) sẽ được nói chi tiết hơn sau, nhưng ở đây chỉ cần biết sơ lược.

CAS có nghĩa là so sánh và thiết lập, được sử dụng để cung cấp thao tác nguyên tử ở cấp độ phần cứng. Trong một số kiến trúc bộ xử lý (như x86), việc so sánh và hoán đổi được thực hiện thông qua lệnh CMPXCHG (Compare and Exchange), một lệnh nguyên tử, thông qua việc so sánh xem có khớp với giá trị đã cho hay không; nếu có thì sẽ sửa đổi, nếu không khớp thì sẽ không sửa đổi.

Quá trình cạnh tranh khoá thiên vị của các luồng như sau:

![](https://cdn.tobebetterjavaer.com/stutymore/synchronized-20230728110319.png)

Hình ảnh trên liên quan đến con trỏ bản ghi khóa trỏ đến bản ghi khóa gần nhất trong ngăn xếp hiện tại, khóa nhẹ được thực hiện theo kiểu phục vụ theo thứ tự đến.

### Hủy bỏ khoá thiên vị

khoá thiên vị sử dụng một **cơ chế giải phóng khóa khi có sự cạnh tranh xảy ra**, vì vậy khi các luồng khác cố gắng cạnh tranh khoá thiên vị, thì luồng đang giữ khoá thiên vị mới giải phóng khóa.

Khi khoá thiên vị nâng cấp thành khóa nhẹ, sẽ tạm dừng luồng đang nắm giữ khoá thiên vị và thiết lập lại cờ khoá thiên vị. Quá trình này nhìn có vẻ đơn giản, nhưng thực tế tiêu tốn chi phí rất lớn, quá trình tổng quát như sau:

1. Tại một điểm an toàn (tại thời điểm này không có mã byte nào đang thực thi), tạm dừng luồng đang nắm giữ khóa.
2. Duyệt qua ngăn xếp luồng, nếu có bản ghi khóa, cần sửa chữa bản ghi khóa và Mark Word để chúng trở thành trạng thái không khóa.
3. Đánh thức luồng đã bị tạm dừng và nâng cấp khóa hiện tại thành khóa nhẹ.

Vì vậy, nếu trong ứng dụng của bạn, tất cả các khóa thường ở trong trạng thái cạnh tranh, thì khoá thiên vị sẽ trở thành một gánh nặng. Trong trường hợp này, chúng ta có thể tắt tính năng khoá thiên vị mặc định ngay từ đầu:

```java
-XX:UseBiasedLocking=false
```

Hình ảnh dưới đây tóm tắt việc nhận và hủy bỏ khoá thiên vị:

![](https://cdn.tobebetterjavaer.com/stutymore/synchronized-20230728112620.png)

## Khóa nhẹ

Khi nhiều luồng nhận cùng một khóa tại các thời điểm khác nhau, tức là không có sự cạnh tranh khóa, cũng không có luồng nào bị chặn. Để xử lý tình huống này, JVM áp dụng khóa nhẹ nhằm tránh việc chặn và đánh thức luồng.

JVM sẽ tạo ra một không gian để lưu trữ bản ghi khóa cho mỗi luồng trong khung ngăn xếp của luồng hiện tại, chúng ta gọi là Displaced Mark Word. Nếu một luồng khi nhận khóa thấy đó là khóa nhẹ, nó sẽ sao chép Mark Word của khóa vào Displaced Mark Word của chính nó.

Sau đó, luồng sẽ cố gắng sử dụng CAS để thay thế Mark Word của khóa bằng con trỏ trỏ đến bản ghi khóa. Nếu thành công, luồng hiện tại sẽ nắm giữ khóa; nếu thất bại, điều đó có nghĩa là Mark Word đã được thay thế bằng bản ghi khóa của luồng khác, tức là luồng hiện tại đang cạnh tranh khóa với luồng khác, và sẽ cố gắng sử dụng vòng lặp để nhận khóa.

> Vòng lặp: liên tục cố gắng để nhận khóa, thường được thực hiện bằng vòng lặp.

Vòng lặp tiêu tốn CPU, nếu không thể nhận khóa liên tục, thì luồng đó sẽ ở trong trạng thái vòng lặp, lãng phí tài nguyên CPU. Cách đơn giản nhất để giải quyết vấn đề này là chỉ định số lần vòng lặp, ví dụ như cho nó lặp lại 10 lần, nếu vẫn không nhận được khóa, thì sẽ chuyển vào trạng thái bị chặn.

Tuy nhiên, JDK đã áp dụng một cách tiếp cận thông minh hơn—vòng lặp thích ứng, đơn giản mà nói, nếu luồng đã thành công trong vòng lặp, số lần vòng lặp tiếp theo sẽ nhiều hơn; nếu vòng lặp thất bại, số lần vòng lặp sẽ giảm đi.

Vòng lặp cũng không phải diễn ra mãi mãi. Nếu sau một mức độ nhất định (liên quan đến JVM và hệ điều hành), mà vẫn không thể nhận khóa, được gọi là vòng lặp thất bại, thì luồng đó sẽ bị chặn. Đồng thời, khóa này sẽ **nâng cấp thành khóa nặng**.

### Giải phóng khóa nhẹ

Khi giải phóng khóa, luồng hiện tại sẽ sử dụng thao tác CAS để sao chép nội dung của Displaced Mark Word trở lại Mark Word của khóa. Nếu không xảy ra cạnh tranh, thì thao tác sao chép này sẽ thành công. Nếu có luồng khác đã nhiều lần vòng lặp và dẫn đến việc khóa nhẹ nâng cấp thành khóa nặng, thì thao tác CAS sẽ thất bại. Lúc này, khóa sẽ được giải phóng và đánh thức luồng đã bị chặn.

Một hình ảnh minh họa quá trình khóa và giải phóng khóa:

![](https://cdn.tobebetterjavaer.com/stutymore/synchronized-20230728114101.png)

## Khóa nặng

Khóa nặng phụ thuộc vào mutex (khóa tương hỗ, được sử dụng để đảm bảo rằng tại bất kỳ thời điểm nào, chỉ có một luồng có thể thực thi một đoạn mã cụ thể) của hệ điều hành để thực hiện, và việc chuyển đổi trạng thái giữa các luồng trong hệ điều hành cần một khoảng thời gian tương đối dài, vì vậy khóa nặng có hiệu suất rất thấp, nhưng luồng bị chặn sẽ không tiêu tốn CPU.

Như đã nói trước đó, mỗi đối tượng có thể được coi là một khóa. Khi nhiều luồng đồng thời yêu cầu khóa của một đối tượng nào đó, khóa đối tượng sẽ thiết lập một số trạng thái để phân biệt các luồng yêu cầu:

- Contention List: Tất cả các luồng yêu cầu khóa sẽ được đưa vào hàng đợi cạnh tranh này trước tiên.
- Entry List：Các luồng đủ điều kiện trở thành ứng cử viên từ Connection List sẽ được chuyển vào Entry List.
- Wait Set: Những luồng bị chặn vì gọi phương thức wait sẽ được đặt vào Wait Set.
- OnDeck: Mỗi thời điểm chỉ có một luồng đang cạnh tranh khóa, luồng đó được gọi là OnDeck.
- Owner: Luồng đã nhận khóa được gọi là Owner.
- !Owner: Luồng đã giải phóng khóa.

Khi một luồng cố gắng nhận khóa, nếu khóa đó đã bị chiếm, luồng đó sẽ được bao gói thành một đối tượng `ObjectWaiter` và chèn vào đầu danh sách Cạnh tranh, sau đó gọi phương thức `park` để tạm dừng luồng hiện tại.

Khi luồng giải phóng khóa, nó sẽ chọn một luồng từ Danh sách Cạnh tranh hoặc Danh sách Nhập để đánh thức, luồng được chọn gọi là `Heir presumptive` (người thừa kế giả định), người thừa kế giả định sẽ được đánh thức và sẽ cố gắng nhận khóa, nhưng `synchronized` là không công bằng, vì vậy người thừa kế giả định không nhất thiết phải nhận được khóa.

Điều này là bởi vì đối với khóa nặng, nếu luồng cố gắng nhận khóa mà thất bại, nó sẽ trực tiếp vào trạng thái bị chặn, chờ đợi sự điều phối của hệ điều hành.

Nếu luồng đã nhận khóa gọi phương thức `Object.wait`, thì sẽ đặt luồng đó vào Wait Set. Khi được `Object.notify` đánh thức, luồng sẽ được di chuyển từ Wait Set đến Danh sách Cạnh tranh hoặc Danh sách Nhập. Cần lưu ý rằng khi gọi phương thức `wait` hoặc `notify` của một đối tượng khóa, **nếu trạng thái hiện tại của khóa là khoá thiên vị hoặc khóa nhẹ thì sẽ nâng cấp thành khóa nặng**.

## Quy trình nâng cấp khóa

Mỗi luồng khi chuẩn bị nhận tài nguyên chia sẻ sẽ thực hiện các bước sau:

1. Bước đầu tiên, kiểm tra xem Mark Word có chứa ThreadId của chính mình không, nếu có, điều đó có nghĩa là luồng hiện tại đang ở trạng thái "khoá thiên vị".

2. Bước thứ hai, nếu Mark Word không phải là ThreadId của chính mình, khóa sẽ được nâng cấp. Lúc này, sẽ sử dụng CAS để thực hiện việc chuyển đổi. Luồng mới sẽ thông báo cho luồng trước đó tạm dừng theo ThreadId hiện có trong Mark Word, luồng trước đó sẽ đặt nội dung của Mark Word thành rỗng.

3. Bước thứ ba, cả hai luồng sẽ sao chép HashCode của đối tượng khóa vào không gian bản ghi khóa mà họ mới tạo ra, sau đó bắt đầu cạnh tranh Mark Word bằng cách sửa đổi nội dung của Mark Word của đối tượng khóa thành địa chỉ của không gian bản ghi mà họ vừa tạo.

4. Bước thứ tư, luồng nào thực hiện thành công CAS trong bước ba sẽ nhận được tài nguyên; luồng thất bại sẽ vào trạng thái vòng lặp.

5. Bước thứ năm, luồng trong quá trình vòng lặp, nếu thành công nhận được tài nguyên (tức là luồng trước đó đã hoàn thành và giải phóng tài nguyên chia sẻ), thì trạng thái sẽ vẫn ở trạng thái khóa nhẹ. Nếu vòng lặp thất bại.

6. Bước thứ sáu, sẽ vào trạng thái khóa nặng, lúc này, luồng trong trạng thái vòng lặp sẽ bị chặn, chờ luồng trước đó thực hiện xong và đánh thức mình.

## Tóm tắt

- Mỗi đối tượng trong Java đều có thể hoạt động như một khóa, và các khóa trong Java đều dựa trên đối tượng.
- Từ khóa synchronized có thể được sử dụng để sửa đổi phương thức và khối mã, đảm bảo rằng tại cùng một thời điểm chỉ có một luồng thực thi đoạn mã đó.
- Từ khóa synchronized khi sửa đổi phương thức sẽ khóa đối tượng hiện tại; khi sửa đổi phương thức tĩnh, khóa sẽ là đối tượng Class hiện tại; khi sửa đổi khối mã, khóa sẽ là đối tượng trong dấu ngoặc đơn.
- Java 6 đã giới thiệu "khoá thiên vị" và "khóa nhẹ" để giảm thiểu chi phí hiệu suất do việc nhận và giải phóng khóa. Trước Java 6, tất cả các khóa đều là "khóa nặng". Do đó, trong Java 6 và sau đó, mỗi đối tượng thực sự có bốn trạng thái khóa, từ thấp đến cao: trạng thái không khóa, trạng thái khoá thiên vị, trạng thái khóa nhẹ và trạng thái khóa nặng.
- khoá thiên vị thiên về luồng đầu tiên truy cập khóa; nếu trong quá trình chạy tiếp theo, khóa đó không bị truy cập bởi các luồng khác, thì luồng nắm giữ khoá thiên vị sẽ không bao giờ cần kích hoạt đồng bộ hóa. Nói cách khác, khoá thiên vị trong trường hợp không có cạnh tranh tài nguyên đã loại bỏ câu lệnh đồng bộ hóa, không cần thực hiện cả thao tác CAS, và cải thiện hiệu suất chạy của chương trình.
- Khóa nhẹ được thực hiện thông qua thao tác CAS và vòng lặp; nếu vòng lặp thất bại, khóa sẽ nâng cấp thành khóa nặng.
- Khóa nặng phụ thuộc vào mutex của hệ điều hành để thực hiện, và việc chuyển đổi trạng thái giữa các luồng trong hệ điều hành cần một khoảng thời gian tương đối dài, vì vậy khóa nặng có hiệu suất rất thấp, nhưng luồng bị chặn sẽ không tiêu tốn CPU.