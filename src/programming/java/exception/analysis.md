---
title: Exception Analysis
tags:
  - java
categories:
  - java
order: 1
---
# Exception Handling analysis

### 01. Exception Là Gì

Chỉ khi xử lý đúng các exception, chúng ta mới có thể đảm bảo được độ tin cậy của chương trình, vì vậy việc học về exception là rất cần thiết.

Vậy exception là gì?

Exception (exception) là một sự kiện không xác định làm gián đoạn quá trình thực thi bình thường của chương trình. Khi exception xảy ra, luồng thực thi bình thường của chương trình sẽ bị gián đoạn. Thông thường, chương trình sẽ có nhiều câu lệnh, nếu không có cơ chế xử lý exception, khi một câu lệnh trước gặp exception, các câu lệnh sau sẽ không thể tiếp tục thực thi.

Với cơ chế xử lý exception, chương trình sẽ không bị gián đoạn khi xảy ra exception, chúng ta có thể bắt exception và thay đổi luồng thực thi của chương trình.

Hơn nữa, cơ chế xử lý exception giúp chúng ta cung cấp thông tin cảnh báo thân thiện đến người dùng, thay vì các thông tin exception gốc của chương trình mà người dùng không thể hiểu được.

Tuy nhiên, từ góc nhìn của nhà phát triển, chúng ta muốn thấy thông tin exception gốc, vì điều này giúp chúng ta nhanh chóng tìm ra nguồn gốc của lỗi, còn thông tin exception bị đóng gói quá mức sẽ làm nhiễu tầm nhìn của chúng ta.

Ngôn ngữ Java từ đầu đã cung cấp cơ chế xử lý exception tương đối hoàn thiện, cơ chế này giúp giảm đáng kể ngưỡng viết chương trình đáng tin cậy, đây cũng là một trong những lý do Java trở nên phổ biến.

Vậy những nguyên nhân nào dẫn đến chương trình ném ra exception?

Ví dụ như:

- Chương trình cố gắng mở một tệp không tồn tại;
- Chương trình gặp vấn đề kết nối mạng;
- Người dùng nhập dữ liệu không hợp lệ;
- Chương trình không xử lý trường hợp chia cho 0 khi giải quyết vấn đề toán học;

v.v...

Hãy lấy một nguyên nhân đơn giản nhất.

```java
public class Demo {
    public static void main(String[] args) {
        System.out.println(10 / 0);
    }
}
```

Đoạn mã này khi chạy sẽ ném ra thông tin exception như sau:

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at com.hnv99.ex.Demo.main(Demo.java:8)
```

Bạn thấy không, thông tin exception gốc này rất khó hiểu đối với người dùng, nhưng đối với nhà phát triển như chúng ta, thì quá rõ ràng — rất dễ xác định nguồn gốc của exception.

### 02. Sự Khác Biệt Giữa Exception và Error

Exception và Error, sự khác biệt giữa chúng là gì?

Từ nghĩa của từ, error có nghĩa là lỗi, còn exception có nghĩa là ngoại lệ, mức độ nghiêm trọng của error rõ ràng cao hơn exception.

Từ góc độ chương trình, cũng đúng như vậy.

Error xuất hiện có nghĩa là chương trình gặp phải vấn đề nghiêm trọng, và những vấn đề này không nên được xử lý bởi cơ chế xử lý exception của Java, chương trình nên bị sập ngay lập tức, ví dụ như OutOfMemoryError, lỗi tràn bộ nhớ, điều này có nghĩa là bộ nhớ mà chương trình yêu cầu khi chạy vượt quá bộ nhớ mà hệ thống có thể cung cấp, dẫn đến lỗi, loại lỗi này đối với chương trình là chí mạng.

Exception xuất hiện có nghĩa là chương trình gặp một số vấn đề trong phạm vi có thể kiểm soát, chúng ta nên thực hiện các biện pháp để cứu vãn.

Ví dụ như ArithmeticException đã đề cập trước đó, rõ ràng là do chia cho 0, chúng ta có thể chọn bắt exception và thông báo cho người dùng rằng không nên thực hiện phép chia cho 0, tất nhiên, cách tốt hơn là kiểm tra số chia, nếu là 0 thì không thực hiện phép chia mà thông báo cho người dùng chọn một số khác không để thực hiện phép chia.

### 03. Checked và Unchecked Exception

Exception có thể được chia thành checked và unchecked exception, chúng có gì khác nhau?

Checked exception trong mã nguồn phải được bắt hoặc ném rõ ràng, nếu không trình biên dịch sẽ nhắc bạn thực hiện thao tác tương ứng. Còn unchecked exception là runtime exception, thường có thể được tránh bằng mã hóa, không cần phải bắt hoặc ném rõ ràng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240703210645.png)

Đầu tiên, cả Exception và Error đều kế thừa từ lớp Throwable. Nói cách khác, chỉ có các đối tượng của lớp Throwable (hoặc lớp con của nó) mới có thể được ném ra bằng từ khóa throw hoặc được sử dụng làm tham số của catch.

Một câu hỏi phổ biến trong phỏng vấn là, NoClassDefFoundError và ClassNotFoundException có gì khác nhau?

Cả hai đều do hệ thống không tìm thấy lớp cần tải trong thời gian chạy, nhưng nguyên nhân kích hoạt lại khác nhau.

- NoClassDefFoundError: Lỗi này xảy ra khi chương trình có thể tìm thấy lớp phụ thuộc trong thời gian biên dịch nhưng không thể tìm thấy tệp lớp trong thời gian chạy; nguyên nhân có thể là do thiếu tệp jar hoặc gọi một lớp đã khởi tạo không thành công.
- ClassNotFoundException: exception này được ném ra khi không tìm thấy lớp tương ứng trong quá trình tải động đối tượng Class; nguyên nhân có thể là lớp cần tải không tồn tại hoặc tên lớp bị viết sai.

Tiếp theo, như IOException, ClassNotFoundException, SQLException đều thuộc loại checked exception; còn như RuntimeException và các lớp con như ArithmeticException, ClassCastException, ArrayIndexOutOfBoundsException, NullPointerException, đều thuộc loại unchecked exception.

unchecked exception có thể không cần xử lý rõ ràng trong chương trình, như ArithmeticException đã đề cập trước đó; nhưng checked exception phải được xử lý rõ ràng.

Ví dụ, mã sau:

```java
Class clz = Class.forName("com.hnv99.ex.Demo1");
```

Nếu không xử lý, ví dụ như trong môi trường Intellij IDEA, nó sẽ nhắc bạn rằng dòng mã này có thể ném ra `java.lang.ClassNotFoundException`.

Bạn có thể sử dụng try-catch để bắt exception:

```java
try {
    Class clz = Class.forName("com.hnv99.ex.Demo1");
} catch (ClassNotFoundException e) {
    e.printStackTrace();
}
```

Lưu ý phương thức `printStackTrace()` in ra thông tin ngăn xếp của exception, phương thức này sẽ in thông tin ngăn xếp của exception ra màn hình điều khiển chuẩn, nếu là môi trường kiểm thử thì cách viết này tạm chấp nhận được, nhưng nếu là môi trường sản xuất thì không nên, phải sử dụng khung log để ghi thông tin ngăn xếp của exception vào hệ thống log, nếu không sẽ khó mà theo dõi.

Hoặc sử dụng từ khóa throws trong chữ ký của phương thức để ném exception:

```java
public class Demo1 {
    public static void main(String[] args) throws ClassNotFoundException {
        Class clz = Class.forName("com.hnv99.ex.Demo1");
    }
}
```

Cách làm này có lợi là không cần phải bắt exception, chỉ cần giao cho Java Virtual Machine xử lý; nhưng nhược điểm là không thể xử lý tình huống cụ thể.

Về checked exception, tôi có thấy một bài viết nói rằng checked exception trong Java là không cần thiết, exception này trong giai đoạn biên dịch phải dùng try-catch hoặc throws, nhưng không nhất thiết sẽ xảy ra exception, bạn nghĩ thiết kế như vậy có ý nghĩa không?

Thực ra, checked exception gây tranh cãi trong ngành, nó giả định rằng chúng ta sẽ bắt exception và xử lý tình huống này, nhưng đôi khi, không thể xử lý được. Ví dụ như exception ClassNotFoundException đã đề cập trước đó, giả sử chúng ta đã try-catch nó, nhưng khi exception ClassNotFoundException thực sự xảy ra, chúng ta cũng không thể làm gì nhiều, lại `Class.forName()` một lần nữa?

Ngoài ra, checked exception cũng không tương thích với lập trình hàm, sau này khi em viết code Lambda/Stream, bạn sẽ cảm nhận được sự khó khăn này.

Tuy nhiên, checked exception không phải là hoàn toàn vô dụng, đặc biệt là khi gặp phải các IO hoặc network exception, chẳng hạn như khi thực hiện kết nối Socket, hãy xem đoạn mã sau:

```java
public class Demo2 {
    private String mHost;
    private int mPort;
    private Socket mSocket;
    private final Object mLock = new Object();

    public void run() {
    }

    private void initSocket() {
        while (true) {
            try {
                Socket socket = new Socket(mHost, mPort);
                synchronized (mLock) {
                    mSocket = socket;
                }
                break;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

Khi xảy ra IOException, socket sẽ thử kết nối lại, nếu không sẽ break ra khỏi vòng lặp. Điều này có nghĩa là nếu IOException không phải là checked exception, cách viết này sẽ không rõ ràng, vì IOException không thể được tránh như ArithmeticException bằng cách sử dụng một câu lệnh if để kiểm tra xem số chia có phải là 0 không.

Hoặc nói cách khác, checked exception bắt buộc có thể khiến chúng ta suy nghĩ khi lập trình, làm thế nào để xử lý exception này một cách tốt hơn. Rõ ràng, trong lập trình Socket, chắc chắn sẽ gặp phải IOException, giả sử IOException là unchecked exception, điều này có nghĩa là nhà phát triển có thể không cần quan tâm, bỏ qua, giao cho Java Virtual Machine xử lý, nhưng tôi nghĩ cách làm này không phù hợp.

### 04. Về từ khóa `throw` và `throws`

Sự khác biệt giữa từ khóa `throw` và `throws` là gì?

Từ khóa `throw` được dùng để chủ động ném ra một exception. Thông thường, khi số chia là 0, chương trình sẽ tự động ném ra exception ArithmeticException. Nhưng nếu chúng ta muốn ném ra exception ArithmeticException khi số chia là 1, chúng ta có thể sử dụng từ khóa `throw` để chủ động ném exception.

```java
throw new exception_class("error message");
```

Cú pháp rất đơn giản, từ khóa `throw` đi kèm với từ khóa `new`, kiểu exception và các tham số.

Ví dụ.

```java
public class ThrowDemo {
    static void checkEligibilty(int stuage){
        if(stuage<18) {
            throw new ArithmeticException("Chưa đủ 18 tuổi, không được xem phim");
        } else {
            System.out.println("Hãy thưởng thức bộ phim!!");
        }
    }

    public static void main(String args[]){
        checkEligibilty(10);
        System.out.println("Cuối tuần vui vẻ..");
    }
}
```

Đoạn mã này khi chạy sẽ ném ra lỗi sau:

```
Exception in thread "main" java.lang.ArithmeticException: Chưa đủ 18 tuổi, không được xem phim
    at com.hnv99.ex.ThrowDemo.checkEligibilty(ThrowDemo.java:9)
    at com.hnv99.ex.ThrowDemo.main(ThrowDemo.java:16)
```

Từ khóa `throws` có tác dụng hoàn toàn khác với `throw`. Ở phần trước, chúng ta đã nói về checked exception và unchecked exception, đối với checked exception, nếu bạn không xử lý, trình biên dịch sẽ nhắc bạn.

Phương thức `Class.forName()` khi thực thi có thể gặp exception `java.lang.ClassNotFoundException`, một checked exception, nếu không xử lý, IDE sẽ nhắc bạn, hoặc khai báo trong method signature (`com.hnv99.ex.Demo1`), hoặc đặt trong try-catch.

Vậy khi nào sử dụng `throws` thay vì `try-catch`?

Giả sử có một phương thức `myMethod()` có thể xuất hiện exception ArithmeticException và NullPointerException. Trong trường hợp này, bạn có thể sử dụng `try-catch` để xử lý.

```java
public void myMethod() {
    try {
        // Có thể ném ra exception
    } catch (ArithmeticException e) {
        // exception toán học
    } catch (NullPointerException e) {
        // exception con trỏ null
    }
}
```

Nhưng nếu có nhiều phương thức giống như `myMethod()`, việc thêm `try-catch` cho từng phương thức sẽ rất cồng kềnh. Mã sẽ trở nên dài dòng và khó đọc.

Một giải pháp là sử dụng từ khóa `throws` để khai báo exception có thể ném ra trong method signature, sau đó xử lý tại nơi gọi phương thức bằng `try-catch`.

```java
public static void main(String args[]){
    try {
        myMethod1();
    } catch (ArithmeticException e) {
        // exception toán học
    } catch (NullPointerException e) {
        // exception con trỏ null
    }
}
public static void myMethod1() throws ArithmeticException, NullPointerException{
    // Khai báo exception trong method signature
}
```

Tổng kết lại sự khác biệt giữa `throw` và `throws`:
1) Từ khóa `throws` được dùng để khai báo exception, nó có tác dụng tương tự như `try-catch`; còn từ khóa `throw` được dùng để ném ra exception rõ ràng.

2) Sau từ khóa `throws` là tên của exception; còn sau từ khóa `throw` là đối tượng của exception.

Ví dụ:

```java
throws ArithmeticException;
```

```java
throw new ArithmeticException("Arithmetic Exception");
```

3) Từ khóa `throws` xuất hiện trong method signature, còn từ khóa `throw` xuất hiện trong thân phương thức.

4) Từ khóa `throws` khi khai báo exception có thể kèm nhiều exception, được ngăn cách bằng dấu phẩy; còn từ khóa `throw` mỗi lần chỉ có thể ném ra một exception.

### 05. Về `try-catch-finally`

Từ khóa `try` sẽ đi kèm với một cặp ngoặc nhọn `{}`, chúng ta đặt một số đoạn mã có thể xảy ra exception vào trong ngoặc nhọn này; khối `try` thường sẽ đi kèm với khối `catch`, để xử lý tình huống xảy ra exception; dĩ nhiên, exception không phải lúc nào cũng xảy ra, để đảm bảo rằng dù có xảy ra exception hay không, một số đoạn mã vẫn sẽ được thực thi, chúng ta sẽ kèm theo một khối `finally`.

Cú pháp của khối `try` rất đơn giản:

```java
try{
// Mã có thể xảy ra exception
}
```

Chú ý nhé,  nếu một số đoạn mã chắc chắn sẽ không ném ra exception, thì đừng bao bọc chúng trong khối `try`, vì mã có xử lý exception sẽ tốn thời gian hơn mã không có xử lý exception.

Cú pháp của khối `catch` cũng rất đơn giản:

```java
try{
// Mã có thể xảy ra exception
}catch (exception(type) e(object)){
// Mã xử lý exception
}
```

Một khối `try` có thể kèm theo nhiều khối `catch`, để bắt các loại exception khác nhau và xử lý tương ứng. Khi một dòng mã trong khối `try` xảy ra exception, các dòng mã sau đó sẽ không được thực thi, mà sẽ chuyển đến khối `catch` tương ứng để thực thi.

Nếu một khối `try` kèm theo nhiều khối `catch` liên quan, thì nên đặt các exception cụ thể ở phía trước, các exception chung chung ở phía sau, nếu không trình biên dịch sẽ báo lỗi. Ví dụ:

```java
static void test() {
    int num1, num2;
    try {
        num1 = 0;
        num2 = 62 / num1;
        System.out.println(num2);
        System.out.println("Câu cuối cùng trong khối try");
    } catch (ArithmeticException e) {
        // Chuyển đến đây khi xảy ra lỗi toán học
        System.out.println("Số chia không thể là 0");
    } catch (Exception e) {
        // exception chung có thể bắt tất cả các loại exception, nó nên đặt ở cuối cùng
        System.out.println("Đã xảy ra exception");
    }
    System.out.println("Mã ngoài try-catch.");
}
```

Tại sao không đặt `Exception` trước `ArithmeticException`?

Vì `ArithmeticException` là một lớp con của `Exception`, nó cụ thể hơn, khi thấy exception này chúng ta biết ngay đó là lỗi toán học, còn `Exception` thì chung chung hơn, nó che giấu thông tin cụ thể về exception, khiến việc xác định loại exception gặp khó khăn. Hơn nữa, nếu đặt exception chung chung ở phía trước, có nghĩa là các khối `catch` khác sẽ không bao giờ được thực thi, vì vậy trình biên dịch sẽ báo lỗi.

Thêm một ví dụ:

```java
static void test1() {
    try{
        int arr[] = new int[7];
        arr[4] = 30 / 0;
        System.out.println("Câu cuối cùng trong khối try");
    } catch(ArithmeticException e){
        System.out.println("Số chia phải là 0");
    } catch(ArrayIndexOutOfBoundsException e){
        System.out.println("Truy cập ngoài giới hạn mảng");
    } catch(Exception e){
        System.out.println("Một số exception khác");
    }
    System.out.println("Mã ngoài try-catch");
}
```

Đoạn mã này khi thực thi, khối `catch` đầu tiên sẽ được thực thi vì số chia là 0; tôi sẽ thay đổi đoạn mã một chút.

```java
static void test1 () {
    try{
        int arr[]=new int[7];
        arr[9]=30/1;
        System.out.println("Câu cuối cùng trong khối try");
    } catch(ArithmeticException e){
        System.out.println("Số chia phải là 0");
    } catch(ArrayIndexOutOfBoundsException e){
        System.out.println("Truy cập ngoài giới hạn mảng");
    } catch(Exception e){
        System.out.println("Một số exception khác");
    }
    System.out.println("Mã ngoài try-catch");
}
```

Khối `catch` thứ hai sẽ thực thi vì không xảy ra arithmetic exception, nhưng mảng đã bị truy cập ngoài giới hạn

Sửa lại mã một chút:

```java
static void test1 () {
    try{
        int arr[]=new int[7];
        arr[9]=30/1;
        System.out.println("Câu cuối cùng trong khối try");
    } catch(ArithmeticException | ArrayIndexOutOfBoundsException e){
        System.out.println("Số chia phải là 0");
    }
    System.out.println("Mã ngoài try-catch");
}
```

Khi có nhiều khối `catch`, cũng có thể gộp chúng lại với nhau, sử dụng dấu gạch đứng `|` để ngăn cách.  Như vậy tốt hơn, nhìn gọn gàng hơn.

Cú pháp của khối `finally` cũng không phức tạp.

```java
try {
    // Mã có thể xảy ra exception
}catch {
   // Xử lý exception
}finally {
   // Mã phải được thực thi
}
```

Trước khi có [`try-with-resources`](try-with-resources), khối `finally` thường được dùng để đóng các tài nguyên như socket, kết nối cơ sở dữ liệu, luồng IO, v.v.

```java
OutputStream osf = new FileOutputStream("filename");
OutputStream osb = new BufferedOutputStream(osf);
ObjectOutput op = new ObjectOutputStream(osb);
try {
    output.writeObject(writableObject);
} finally {
    op.close();
}
```

Chú ý, khi sử dụng khối `finally`, cần tuân thủ các quy tắc sau:

- Khối `finally` phải đi kèm với khối `try`, không được sử dụng `finally` một mình. Trình biên dịch cũng không cho phép làm như vậy.
- Khối `finally` không phải là bắt buộc, có khối `try` thì không nhất thiết phải có khối `finally`.
- Nếu mã trong khối `finally` có thể xảy ra exception, cũng nên bao bọc bằng khối `try-catch`.
- Ngay cả khi trong khối `try` có các câu lệnh `return`, `break`, `continue`, khối `finally` vẫn sẽ được thực thi.

Hãy thử xem thì biết ngay:

```java
static int test2 () {
    try {
        return 112;
    } finally {
        System.out.println("Ngay cả khi khối try có return, khối finally vẫn sẽ thực thi");
    }
}
```

Xem kết quả xuất ra:

```
Ngay cả khi khối try có return, khối finally vẫn sẽ thực thi
```

Có trường hợp nào mà khối `finally` không được thực thi không?

Có chứ:

- Gặp phải vòng lặp vô tận.
- Thực thi lệnh `System.exit()`.

Câu lệnh `System.exit()` và câu lệnh `return` khác nhau, cái trước dùng để thoát chương trình, cái sau chỉ quay lại phương thức gọi trước đó.

Xem khai báo của phương thức để hiểu rõ hơn:

```java
public static void exit(int status)
```

Về giá trị của tham số `status` cũng rất dễ hiểu, nếu là thoát do exception, đặt giá trị khác 0, thường dùng 1 để biểu thị; nếu muốn thoát chương trình bình thường, dùng 0 để biểu thị.

### 06. Tóm tắt

Xử lý exception trong Java là một cơ chế quan trọng, giúp chúng ta xử lý các lỗi hoặc exception xảy ra trong quá trình thực thi chương trình.

Exception được chia thành hai loại: Checked Exception và Unchecked Exception, trong đó Checked Exception cần phải được xử lý hoặc khai báo rõ ràng trong mã, còn Unchecked Exception không cần phải được xử lý hoặc khai báo rõ ràng. Xử lý exception thường sử dụng các khối try-catch-finally hoặc sử dụng từ khóa throws để ném exception cho người gọi xử lý.

Dưới đây là một số tóm tắt về xử lý exception trong Java:

- Sử dụng khối try-catch để bắt và xử lý exception, giúp tránh việc chương trình bị sập do exception.
- Có thể sử dụng nhiều khối catch để bắt các loại exception khác nhau và xử lý chúng một cách khác nhau.
- Có thể sử dụng khối finally để thực hiện một số công việc dọn dẹp cần thiết, dù có hay không xảy ra exception.
- Có thể sử dụng từ khóa throw để tự động ném exception, nhằm chỉ rõ một số tình huống exception trong chương trình.
- Có thể sử dụng từ khóa throws để ném exception cho người gọi xử lý, được khai báo trong chữ ký phương thức.
- Checked Exception thường là do các yếu tố bên ngoài gây ra, cần phải được xử lý hoặc khai báo rõ ràng trong mã.
- Unchecked Exception thường là do logic hoặc dữ liệu bất thường bên trong chương trình gây ra, có thể không cần xử lý hoặc xử lý khi cần thiết.
- Khi xử lý exception, nên xử lý theo loại exception cụ thể, chẳng hạn như có thể thử mở lại tệp, thiết lập lại kết nối mạng, v.v.
- Xử lý exception nên dựa vào nhu cầu kinh doanh cụ thể và các nguyên tắc thiết kế, tránh việc bắt và xử lý exception quá mức, từ đó giảm hiệu suất và khả năng bảo trì của chương trình.

