---
title: Java Thread Must Know
tags:
  - interview
  - java
categories:
  - interview
order: 11
---
# Java Concurrency (Phải học thuộc)

### Mô tả ngắn gọn về Mô hình bộ nhớ Java (JMM)

Mô hình bộ nhớ Java định nghĩa các quy tắc truy cập các biến trong chương trình:

- Tất cả các biến đều được lưu trữ trong bộ nhớ chính và mỗi luồng có bộ nhớ làm việc riêng.
- Bộ nhớ làm việc chứa bản sao của các biến từ bộ nhớ chính mà luồng sử dụng. Mọi thao tác với các biến đều phải thực thi trong bộ nhớ làm việc, không thể đọc hoặc ghi trực tiếp vào bộ nhớ chính.
- Sau khi hoàn thành, bộ nhớ làm việc của luồng sẽ đẩy dữ liệu đã thao tác trở lại bộ nhớ chính thông qua giao thức nhất quán bộ nhớ đệm.

### Mô tả ngắn gọn về as-if-serial

Trình biên dịch sẽ thực hiện sắp xếp lại và tối ưu hóa các lệnh trong chương trình gốc. Tuy nhiên, bất kể sắp xếp lại thế nào, kết quả phải tương ứng với kết quả đầu ra dự kiến của chương trình gốc.

### Mô tả ngắn gọn về tám quy tắc happens-before

- **Quy tắc thứ tự chương trình**: Trong một luồng, các thao tác viết trước sẽ xảy ra trước các thao tác viết sau theo thứ tự mã nguồn.
- **Quy tắc khóa**: Một thao tác unlock xảy ra trước một thao tác lock sau đó trên cùng một khóa.
- **Quy tắc biến volatile**: Việc ghi vào một biến xảy ra trước việc đọc biến đó sau đó.
- **Quy tắc truyền**: Nếu thao tác A xảy ra trước thao tác B và thao tác B xảy ra trước thao tác C, thì có thể suy ra thao tác A xảy ra trước thao tác C.
- **Quy tắc khởi động luồng**: Phương thức start() của đối tượng Thread xảy ra trước mọi hành động của luồng đó.
- **Quy tắc ngắt luồng**: Việc gọi phương thức interrupt() của một luồng xảy ra trước khi mã của luồng đó phát hiện sự kiện ngắt.
- **Quy tắc kết thúc luồng**: Tất cả các thao tác của một luồng xảy ra trước khi phát hiện luồng đó đã kết thúc, chúng ta có thể phát hiện qua phương thức Thread.join() hoặc Thread.isAlive().
- **Quy tắc kết thúc đối tượng**: Hoàn tất khởi tạo một đối tượng xảy ra trước khi phương thức finalize() của nó bắt đầu.

### Sự khác biệt giữa as-if-serial và happens-before

as-if-serial đảm bảo kết quả thực thi của chương trình đơn luồng không thay đổi, happens-before đảm bảo kết quả thực thi đúng của chương trình đa luồng được đồng bộ hóa.

### Mô tả ngắn gọn về thao tác nguyên tử

Một thao tác hoặc một nhóm thao tác, hoặc tất cả đều được thực thi và quá trình thực thi không bị gián đoạn bởi bất kỳ yếu tố nào, hoặc tất cả đều không được thực thi. Đây là thao tác nguyên tử.

### Mô tả ngắn gọn về tính khả kiến của luồng

Tính khả kiến nghĩa là khi một luồng thay đổi biến chia sẻ, các luồng khác có thể biết ngay lập tức về thay đổi này. volatile, synchronized và final đều đảm bảo tính khả kiến.

### Mô tả ngắn gọn về tính tuần tự

Mặc dù đa luồng có sự cạnh tranh và tối ưu hóa lệnh, nhưng trong luồng hiện tại, tất cả các thao tác thực thi đều có thứ tự.

### Mô tả ngắn gọn về từ khóa volatile trong Java

- Đảm bảo tính khả kiến của biến đối với tất cả các luồng. Khi một luồng thay đổi giá trị của biến, giá trị mới có thể được nhận biết ngay lập tức bởi các luồng khác.
- Ngăn cấm sắp xếp lại lệnh. Khi sử dụng biến volatile để thực hiện thao tác ghi, trình biên dịch sẽ chèn một rào chắn bộ nhớ vào dãy lệnh để ngăn cấm các loại bộ xử lý cụ thể thực hiện sắp xếp lại.

### Các cách triển khai luồng trong Java

- Triển khai interface Runnable
- Kế thừa lớp Thread
- triển khai interface Callable

### Mô tả ngắn gọn về trạng thái của luồng trong Java

Trạng thái của luồng bao gồm NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED

- **NEW**: Trạng thái mới, luồng được tạo và chưa bắt đầu, chưa gọi phương thức start.
- **RUNNABLE**: Trạng thái chạy, luồng đang được thực thi trong JVM, nhưng không nhất thiết đang chạy thực sự, có thể đang chờ CPU.
- **BLOCKED**: Trạng thái bị chặn, luồng đang chờ để lấy khóa và khóa chưa được cấp.
- **WAITING**: Trạng thái chờ, phương thức run của luồng thực thi xong Object.wait()/Thread.join() và vào trạng thái này.
- **TIMED_WAITING**: Trạng thái chờ có thời hạn, sau một thời gian nhất định sẽ thoát khỏi trạng thái. Gọi Thread.sleep(long), Object.wait(long), Thread.join(long) sẽ vào trạng thái này. Các tham số này đại diện cho thời gian chờ.
- **TERMINATED**: Trạng thái kết thúc, luồng thực thi xong phương thức run và vào trạng thái này.

### Mô tả ngắn gọn về cách giao tiếp giữa các luồng

- Sử dụng từ khóa volatile để sửa đổi biến, đảm bảo tính khả kiến của biến đối với tất cả các luồng.
- Sử dụng từ khóa synchronized, đảm bảo nhiều luồng chỉ có thể vào phương thức hoặc khối đồng bộ cùng lúc.
- Sử dụng các phương thức wait/notify.
- Giao tiếp qua IO.

### Mô tả ngắn gọn về Thread Pool (Bể Luồng)

Khi không có Thread Pool, việc tạo và hủy nhiều luồng tiêu tốn nhiều tài nguyên. Nếu tái sử dụng các luồng đã tạo sau khi hoàn thành nhiệm vụ hiện tại, có thể giảm thiểu chi phí và kiểm soát số lượng luồng đồng thời tối đa.

Khi Thread Pool tạo luồng, nó sẽ bao bọc luồng thành Worker. Worker sau khi hoàn thành nhiệm vụ sẽ tiếp tục lấy nhiệm vụ từ hàng đợi công việc để thực thi.

Khi phân phối nhiệm vụ cho Thread Pool, có các trường hợp sau:

- Nếu Thread Pool lõi chưa đầy, tạo một luồng mới để thực thi nhiệm vụ.
- Nếu Thread Pool lõi đã đầy, hàng đợi công việc chưa đầy, lưu luồng vào hàng đợi công việc.
- Nếu hàng đợi công việc đã đầy, số lượng luồng nhỏ hơn số luồng tối đa thì tạo một luồng mới để xử lý nhiệm vụ.
- Nếu vượt quá số lượng luồng tối đa, nhiệm vụ sẽ được xử lý theo chiến lược từ chối.

Các tham số của Thread Pool:

- **corePoolSize**: Số lượng luồng lõi thường trực. Nếu vượt quá giá trị này và luồng không hoạt động, nó sẽ bị hủy.
- **maximumPoolSize**: Số lượng luồng tối đa mà Thread Pool có thể chứa.
- **keepAliveTime**: Thời gian giữ lại luồng không hoạt động. Khi luồng không hoạt động đến giá trị này, nó sẽ bị hủy, chỉ giữ lại các luồng lõi để tránh lãng phí tài nguyên bộ nhớ.
- **workQueue**: Hàng đợi công việc.
- **threadFactory**: Nhà máy luồng, dùng để sản xuất các luồng cho nhóm nhiệm vụ tương tự.
- **handler**: Chiến lược từ chối.

Các chiến lược từ chối:

- **AbortPolicy**: Bỏ qua nhiệm vụ và ném ra ngoại lệ.
- **CallerRunsPolicy**: Thử lại việc nộp nhiệm vụ.
- **DiscardOldestPolicy**: Bỏ nhiệm vụ chờ đợi lâu nhất trong hàng đợi và thêm nhiệm vụ hiện tại vào hàng đợi.
- **DiscardPolicy**: Bỏ nhiệm vụ hiện tại nhưng không ném ra ngoại lệ.

### Mô tả ngắn gọn về khung Executor

Khung Executor nhằm tách biệt việc nộp nhiệm vụ và cách thực thi nhiệm vụ. Người dùng không cần phải xem xét việc thiết kế nộp nhiệm vụ từ mã nguồn, chỉ cần gọi phương thức `execute` của các lớp triển khai của khung Executor để nộp nhiệm vụ.

### Mô tả ngắn gọn về kế thừa của Executor

- **Executor**: Một interface định nghĩa một phương thức nhận đối tượng Runnable và thực thi nhiệm vụ.
- **ExecutorService**: interface con của Executor, định nghĩa một phương thức nhận đối tượng Callable và trả về đối tượng Future, đồng thời cung cấp phương thức execute.
- **ScheduledExecutorService**: interface con của ExecutorService, hỗ trợ thực thi nhiệm vụ định kỳ.
- **AbstractExecutorService**: Lớp trừu tượng, cung cấp triển khai mặc định cho các phương thức thực thi của ExecutorService.
- **Executors**: Lớp nhà máy tĩnh, cung cấp một loạt các phương thức nhà máy để tạo Thread Pool.
- **ThreadPoolExecutor**: Kế thừa AbstractExecutorService, dùng để tạo Thread Pool.
- **ForkJoinPool**: Kế thừa AbstractExecutorService, chia nhiệm vụ lớn thành nhiều nhiệm vụ nhỏ để thực thi và tổng hợp kết quả.
- **ScheduledThreadPoolExecutor**: Kế thừa ThreadPoolExecutor, triển khai ScheduledExecutorService, dùng để tạo Thread Pool có nhiệm vụ định kỳ.

### Mô tả ngắn gọn về trạng thái của Thread Pool

- **Running**: Có thể nhận nhiệm vụ mới và xử lý nhiệm vụ trong hàng đợi.
- **Shutdown**: Không nhận nhiệm vụ mới nhưng xử lý các nhiệm vụ tồn đọng, gọi phương thức `shutdown` khi đang ở trạng thái running sẽ chuyển sang trạng thái này.
- **Stop**: Không nhận nhiệm vụ mới và không xử lý các nhiệm vụ tồn đọng, gọi phương thức `shutdownNow` để chuyển sang trạng thái này.
- **Tidying**: Tất cả nhiệm vụ đã kết thúc, số luồng đang hoạt động bằng 0.
- **Terminated**: Thread Pool hoàn toàn kết thúc, gọi phương thức `terminated` ở trạng thái tidying sẽ chuyển sang trạng thái này.

### Mô tả ngắn gọn về các loại Thread Pool

- **newCachedThreadPool**: Bể luồng có thể lưu trữ luồng, có thể thiết lập số lượng luồng tối thiểu và tối đa, luồng không hoạt động trong 1 phút sẽ bị hủy.
- **newFixedThreadPool**: Bể luồng với số lượng luồng làm việc cố định.
- **newSingleThreadExecutor**: Executor với một luồng duy nhất.
- **newScheduledThreadPool**: Bể luồng với số lượng luồng cố định hỗ trợ nhiệm vụ định kỳ.
- **newSingleThreadScheduledExecutor**: Executor với một luồng duy nhất hỗ trợ nhiệm vụ định kỳ.

### Mô tả ngắn gọn về hàng đợi chặn (Blocking Queue)

Hàng đợi chặn là một trong những thành phần cụ thể của mô hình sản xuất-tiêu thụ. Khi hàng đợi chặn rỗng, thao tác lấy phần tử từ hàng đợi sẽ bị chặn. Khi hàng đợi chặn đầy, thao tác thêm phần tử vào hàng đợi sẽ bị chặn. Các triển khai cụ thể bao gồm:

- **ArrayBlockingQueue**: Hàng đợi chặn có giới hạn, được tạo thành từ mảng.
- **LinkedBlockingQueue**: Hàng đợi chặn có giới hạn, được tạo thành từ danh sách liên kết.
- **PriorityBlockingQueue**: Hàng đợi ưu tiên chặn.
- **DelayQueue**: Tạo phần tử có thể được lấy ra khỏi hàng đợi sau một khoảng thời gian nhất định.
- **SynchronousQueue**: Hàng đợi chặn không lưu trữ phần tử, mỗi lần thêm phải chờ thao tác lấy.
- **LinkedTransferQueue**: Giống LinkedBlockingQueue nhưng có thêm phương thức transfer, tức là nếu có người tiêu thụ đang chờ nhận phần tử, có thể ngay lập tức chuyển phần tử từ nhà sản xuất sang người tiêu thụ.
- **LinkedBlockingDeque**: Hàng đợi chặn hai chiều.

### Nói về ThreadLocal

ThreadLocal là biến chia sẻ trong luồng. ThreadLocal có một lớp nội bộ tĩnh là ThreadLocalMap, khóa là đối tượng ThreadLocal, giá trị là đối tượng Entry. ThreadLocalMap là riêng tư cho mỗi luồng.

- **set**: Đặt giá trị cho ThreadLocalMap.
- **get**: Lấy giá trị từ ThreadLocalMap.
- **remove**: Xóa đối tượng kiểu ThreadLocalMap.

Vấn đề: Đối với Thread Pool, vì Thread Pool tái sử dụng các đối tượng Thread, do đó các ThreadLocal gắn với Thread cũng bị tái sử dụng, gây ra một loạt vấn đề.

Ví dụ: rò rỉ bộ nhớ. Do ThreadLocal là tham chiếu yếu, nhưng giá trị của Entry là tham chiếu mạnh, do đó khi ThreadLocal bị thu gom rác, giá trị vẫn không được giải phóng, gây ra rò rỉ bộ nhớ.

### Nói về hiểu biết của bạn về lớp unsafe trong gói Java concurrency

Trong ngôn ngữ Java, không có các thành phần con trỏ trực tiếp, và thường không thể sử dụng offset để thao tác một khối bộ nhớ. Các thao tác này tương đối an toàn (safe).

Java có một lớp gọi là Unsafe, lớp này mang lại cho Java khả năng thao tác không gian bộ nhớ giống như con trỏ trong ngôn ngữ C, đồng thời cũng mang lại các vấn đề về con trỏ. Lớp này có thể được coi là nền tảng cho việc phát triển đa luồng trong Java.

### Khóa lạc quan và thuật toán CAS trong Java

Khóa lạc quan cho rằng xác suất xảy ra xung đột đồng thời là rất thấp, do đó không khóa trong quá trình đọc dữ liệu.

Chỉ khi thực hiện thao tác ghi, mới kiểm tra xem dữ liệu có bị thay đổi bởi các luồng khác không. Nếu có thay đổi, ghi thất bại; nếu không, tiến hành ghi và báo cáo thành công.

Khóa lạc quan thường sử dụng thuật toán Compare And Swap (CAS) để triển khai. Như tên gọi, thuật toán này bao gồm hai thao tác: so sánh (Compare) và hoán đổi (Swap).

### Vấn đề ABA và cách giải quyết

Thuật toán CAS dựa vào giá trị để so sánh. Nếu có hai luồng, một luồng thay đổi giá trị từ A thành B, sau đó từ B quay lại A, khi luồng hiện tại triển khai thuật toán CAS, sẽ dễ dàng nhận định rằng giá trị không thay đổi và nghĩ rằng không có luồng nào khác đã thay đổi dữ liệu.

Gói `java.util.concurrent` cung cấp một lớp AtomicStampedReference, thêm dấu phiên bản vào giá trị để giải quyết vấn đề ABA.

### Các lớp Atomic phổ biến

Trong nhiều trường hợp, chúng ta chỉ cần một giải pháp ++ hoặc -- đơn giản, hiệu quả và an toàn trong môi trường đa luồng. Sử dụng synchronized hoặc lock có thể giải quyết, nhưng chi phí lớn. Lớp Atomic tiện lợi hơn. Dưới đây là các lớp Atomic cơ bản:

- AtomicInteger: Cập nhật số nguyên nguyên tử.
- AtomicLong: Cập nhật số nguyên dài nguyên tử.
- AtomicBoolean: Cập nhật kiểu boolean nguyên tử.

Các lớp mảng Atomic:

- AtomicIntegerArray: Cập nhật nguyên tử các phần tử trong mảng số nguyên.
- AtomicLongArray: Cập nhật nguyên tử các phần tử trong mảng số nguyên dài.
- AtomicReferenceArray: Cập nhật nguyên tử các phần tử trong mảng tham chiếu.

Các lớp tham chiếu Atomic:

- AtomicReference: Cập nhật nguyên tử các tham chiếu.
- AtomicMarkableReference: Cập nhật nguyên tử các tham chiếu có cờ đánh dấu.
- AtomicStampedReference: Cập nhật nguyên tử các tham chiếu có phiên bản.

FieldUpdater:

- AtomicIntegerFieldUpdater: Cập nhật nguyên tử các trường số nguyên.
- AtomicLongFieldUpdater: Cập nhật nguyên tử các trường số nguyên dài.
- AtomicReferenceFieldUpdater: Cập nhật nguyên tử các trường tham chiếu.

### Nguyên lý cơ bản của lớp Atomic

Lấy ví dụ lớp AtomicInteger.

Phương thức getAndIncrement tăng giá trị hiện tại lên 1 một cách nguyên tử. Cách triển khai cụ thể như sau:

- Trong vòng lặp for vô tận, lấy giá trị hiện tại trong AtomicInteger.
- Tăng giá trị hiện tại lên 1.
- Gọi phương thức compareAndSet để cập nhật nguyên tử.
- Kiểm tra giá trị hiện tại có bằng với giá trị mong đợi.
- Nếu bằng, nghĩa là giá trị chưa bị luồng khác thay đổi, cập nhật giá trị mới.
- Nếu không bằng, vòng lặp tiếp tục so sánh lại.

### CountDownLatch

CountDownLatch cho phép một luồng chờ đợi các luồng khác hoàn thành. Được triển khai bằng một bộ đếm, khởi tạo bằng số lượng luồng. Khi một luồng hoàn thành, gọi phương thức countDown để giảm bộ đếm. Khi bộ đếm bằng 0, luồng chờ có thể tiếp tục. CountDownLatch chỉ sử dụng một lần, không reset được.

### CyclicBarrier

CyclicBarrier có chức năng tương tự CountDownLatch, cũng sử dụng bộ đếm để cho phép một luồng chờ các luồng khác hoàn thành. Tuy nhiên, CyclicBarrier có thể tái sử dụng (reset).

### Semaphore

Semaphore, hay còn gọi là cờ hiệu, nhận một giá trị int để đặt số lượng phép cấp phép khả dụng. Sử dụng phương thức acquire để nhận một phép cấp phép, giảm bộ đếm, và release để trả lại phép cấp phép, tăng bộ đếm. Nếu bộ đếm bằng 0, luồng sẽ vào trạng thái chờ.

### Exchanger

Lớp Exchanger cho phép hai luồng trao đổi thông tin. Có thể hiểu Exchanger như một container chứa hai ô. Thông qua phương thức exchange, hai luồng có thể trao đổi dữ liệu. Khi hai luồng đến điểm đồng bộ, thông tin trong hai ô sẽ được hoán đổi và trả về cho các luồng.

### ConcurrentHashMap

Trong JDK7, sử dụng kỹ thuật phân đoạn khóa. Dữ liệu được chia thành các đoạn Segment, mỗi đoạn có một khóa riêng. Khi một luồng giữ khóa của một đoạn, các đoạn khác vẫn có thể được truy cập bởi các luồng khác.

Phương thức get không cần khóa, chỉ khi đọc giá trị trống mới cần khóa. Phương thức put phải khóa, định vị đến Segment và chèn phần tử.

Trong JDK8, cải tiến bằng cách:

- Bỏ cơ chế phân đoạn khóa, sử dụng thuật toán CAS để cập nhật giá trị. Nếu CAS thất bại, sử dụng synchronized để khóa và chèn phần tử.
- Thêm cấu trúc cây đỏ-đen. Khi một slot chứa hơn 8 phần tử và mảng Node lớn hơn 64, chuyển danh sách liên kết thành cây đỏ-đen.
- Tối ưu hóa cách đếm số lượng phần tử trong tập hợp.

### Nguyên lý của từ khóa synchronized

Các đối tượng Java có một monitor liên kết. Khi sử dụng synchronized, JVM sẽ tìm monitor của đối tượng và quyết định khóa hoặc mở khóa dựa trên trạng thái của monitor. Nếu khóa thành công, monitor sẽ không bị các luồng khác lấy đến khi được giải phóng.

Synchronized sau khi biên dịch sẽ tạo ra hai lệnh bytecode monitorenter và monitorexit, để lấy và giải phóng monitor. Hai lệnh này cần một tham chiếu để xác định đối tượng khóa hoặc mở khóa. Với phương thức thông thường, khóa là đối tượng hiện tại; với phương thức tĩnh, khóa là đối tượng Class; với khối mã đồng bộ, khóa là đối tượng trong ngoặc.

Khi triển khai monitorenter, nếu đối tượng không bị khóa hoặc luồng hiện tại đã giữ khóa, tăng bộ đếm khóa lên 1. Khi triển khai monitorexit, giảm bộ đếm khóa đi 1. Khi bộ đếm bằng 0, khóa được giải phóng.

### Cách sử dụng từ khóa synchronized

- Sử dụng để sửa đổi một phương thức thể hiện.
- Sử dụng để sửa đổi một phương thức tĩnh.
- Sử dụng để sửa đổi một khối mã đồng bộ.

### Giới thiệu về Khóa Thiên Vị trong Java

Khóa thiên vị được giới thiệu trong JDK 1.6. Khái niệm này được đưa ra do các nhà phát triển nhận thấy trong hầu hết các trường hợp, khóa không có sự cạnh tranh, và một khóa thường được giữ bởi cùng một luồng. Khóa thiên vị không tự động giải phóng, mỗi khi vào khóa thiên vị, nó sẽ kiểm tra xem tài nguyên có thiên về nó hay không, nếu có thì không cần thực hiện thêm thao tác nào và có thể vào khối đồng bộ ngay lập tức.

Quy trình xin khóa như sau:

- Đầu tiên, kiểm tra xem Mark Word của đối tượng có thuộc chế độ thiên vị hay không, nếu không, chuyển sang kiểm tra khóa nhẹ. Nếu có, tiếp tục bước tiếp theo;
- Kiểm tra ID của luồng yêu cầu khóa hiện tại có trùng với ID của luồng ghi nhận trong khóa thiên vị hay không. Nếu trùng, tiếp tục bước tiếp theo, nếu không, chuyển đến bước 4;
- Kiểm tra có cần thiên vị lại hay không. Nếu không, luồng sẽ nhận được khóa thiên vị ngay;
- Sử dụng thuật toán CAS để thay đổi Mark Word của đối tượng, thay phần ID luồng thành ID của luồng hiện tại. Nếu thành công, khóa thiên vị sẽ được nhận. Nếu thất bại, tức là có sự cạnh tranh từ nhiều luồng, khóa sẽ nâng cấp thành khóa nhẹ.

### Giới thiệu về Khóa Nhẹ

Khóa nhẹ được thiết kế để giảm thiểu tiêu hao hiệu suất gây ra bởi khóa nặng khi không có sự cạnh tranh.

Quy trình xin khóa như sau:

- Nếu đối tượng đồng bộ chưa bị khóa, JVM sẽ tạo một không gian ghi khóa trong khung ngăn xếp của luồng hiện tại, lưu bản sao của Mark Word của đối tượng.
- JVM sử dụng CAS để cố gắng cập nhật Mark Word của đối tượng thành con trỏ chỉ đến không gian ghi khóa.
- Nếu cập nhật thành công, luồng hiện tại sẽ sở hữu khóa, đánh dấu trạng thái khóa là 00, biểu thị trạng thái khóa nhẹ.
- Nếu cập nhật thất bại, nghĩa là ít nhất có một luồng khác cạnh tranh. JVM kiểm tra Mark Word của đối tượng có chỉ đến khung ngăn xếp của luồng hiện tại hay không.
- Nếu có, luồng hiện tại đã sở hữu khóa và tiếp tục vào khối đồng bộ.
- Nếu không, khóa đã bị luồng khác chiếm dụng.
- Nếu có hơn hai luồng cạnh tranh cùng một khóa, khóa nhẹ sẽ không còn hiệu quả, chuyển thành khóa nặng, trạng thái khóa chuyển thành 10, và các luồng chờ khóa phải bị chặn.

### Giới thiệu về Các Chiến Lược Tối Ưu Khóa

Gồm các chiến lược như quay vòng thích ứng, loại bỏ khóa, thô hóa khóa, nâng cấp khóa.

### Giới thiệu về Khóa Quay Vòng trong Java

Khi một luồng thất bại trong việc nhận khóa, có thể không từ bỏ CPU mà liên tục thử lại, gọi là khóa quay vòng.

### Giới thiệu về Khóa Quay Vòng Thích Ứng

Khóa quay vòng thích ứng không đặt số lần quay vòng cố định mà dựa trên thời gian quay vòng trước đó và trạng thái của luồng giữ khóa để quyết định.

### Giới thiệu về Thô Hóa Khóa

Thô hóa khóa là mở rộng phạm vi khóa, tránh việc liên tục khóa và mở khóa.

### Giới thiệu về Loại Bỏ Khóa

Loại bỏ khóa là tối ưu hóa triệt để hơn, trong quá trình biên dịch, trình biên dịch Java quét ngữ cảnh thực thi để loại bỏ những khóa không có khả năng xảy ra cạnh tranh tài nguyên chia sẻ.

### Giới thiệu về Lock và ReentrantLock

interface Lock là interface chính trong gói đồng bộ của Java.

Khóa tái nhập ReentrantLock là triển khai phổ biến nhất của Lock, tương tự synchronized. ReentrantLock mặc định là không công bằng, nhưng có thể chỉ định khóa công bằng qua hàm tạo. Khi sử dụng khóa công bằng, hiệu suất sẽ giảm.

### Giới thiệu về AQS

AQS (AbstractQueuedSynchronizer) là bộ đồng bộ hóa kiểu hàng đợi trừu tượng. AQS đóng gói mỗi luồng yêu cầu tài nguyên chia sẻ thành một nút trong hàng đợi khóa, để quản lý phân phối khóa. AQS là nền tảng xây dựng khóa và các thành phần đồng bộ khác, sử dụng biến `volatile int state` làm tài nguyên chia sẻ. Nếu luồng không nhận được tài nguyên, nó sẽ vào hàng đợi đồng bộ; nếu nhận được, nó sẽ thực thi mã vùng tới hạn và giải phóng tài nguyên khi hoàn tất, thông báo cho các luồng chờ trong hàng đợi đồng bộ.

Lớp con kế thừa đồng bộ hóa và thực hiện các phương thức trừu tượng `getState`, `setState` và `compareAndSetState` để thay đổi trạng thái đồng bộ.

Nguyên lý nhận và giải phóng khóa độc quyền của AQS:

Nhận khóa (acquire):

- Gọi phương thức `tryAcquire` để nhận trạng thái đồng bộ một cách an toàn, nếu thất bại, tạo nút đồng bộ và thêm vào cuối hàng đợi qua phương thức `addWaiter`, sau đó quay vòng.
- Gọi phương thức `acquireQueued` để nút quay vòng nhận trạng thái đồng bộ, nếu không được, luồng sẽ bị chặn.

Giải phóng khóa (release):

- Gọi phương thức `tryRelease` để giải phóng trạng thái đồng bộ.
- Gọi phương thức `unparkSuccessor` để đánh thức nút kế tiếp của nút đầu, cho nút này thử nhận trạng thái đồng bộ.

Nguyên lý nhận và giải phóng khóa chia sẻ của AQS:

Nhận khóa (acquireShared):

- Gọi phương thức `tryAcquireShared` để thử nhận trạng thái đồng bộ, nếu trả về giá trị >= 0, trạng thái đồng bộ sẽ được nhận.
- Giải phóng (releaseShared), và đánh thức các nút chờ tiếp theo.