---
title: Abstraction
tags:
  - java
categories:
  - java
order: 9
---
# Java Abstraction 

### 01. Định nghĩa lớp trừu tượng

Để định nghĩa một lớp trừu tượng trong Java, chúng ta cần sử dụng từ khóa `abstract`, đặt trước từ khóa `class`, như ví dụ dưới đây.

```java
abstract class AbstractPlayer {
}
```

Về việc đặt tên cho lớp trừu tượng, "Tên của lớp trừu tượng nên bắt đầu bằng từ khóa Abstract hoặc Base", đây là một quy tắc nên tuân thủ, để thực sự phản ánh ý nghĩa của nó.

### 02. Đặc điểm của lớp trừu tượng

Lớp trừu tượng không thể được khởi tạo bằng cách sử dụng từ khóa `new`. Nếu cố gắng khởi tạo một đối tượng từ lớp trừu tượng bằng cách sử dụng `new`, trình biên dịch sẽ báo lỗi và thông báo "Lớp là trừu tượng và không thể khởi tạo".

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/object-class/abstract-01.png)

Mặc dù lớp trừu tượng không thể được khởi tạo, nhưng nó có thể có các lớp con. Lớp con được kế thừa từ lớp trừu tượng bằng từ khóa `extends`, như ví dụ dưới đây.

```java
public class BasketballPlayer extends AbstractPlayer {
}
```

Nếu một lớp định nghĩa một hoặc nhiều phương thức trừu tượng, thì lớp đó phải là một lớp trừu tượng.

Khi chúng ta cố gắng định nghĩa một phương thức trừu tượng trong một lớp thông thường, trình biên dịch sẽ có hai lỗi. Lỗi đầu tiên ở mức lớp, thông báo "Lớp này phải được định nghĩa bằng từ khóa `abstract`", như trong hình dưới đây.

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/object-class/abstract-02.png)

Lỗi thứ hai xảy ra khi cố gắng định nghĩa một phương thức trừu tượng, thông báo "Phương thức trừu tượng nằm trong lớp không phải là trừu tượng", như trong hình dưới đây.

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/object-class/abstract-03.png)

Trong lớp trừu tượng, chúng ta có thể định nghĩa cả phương thức trừu tượng và phương thức thông thường, như ví dụ dưới đây:

```java
public abstract class AbstractPlayer {
    abstract void play();
    
    public void sleep() {
        System.out.println("Cầu thủ cũng cần phải nghỉ ngơi thay vì vượt quá giới hạn");
    }
}
```

Lớp trừu tượng có một phương thức `play()` là trừu tượng và một phương thức `sleep()` là thông thường.

Lớp con được kế thừa từ lớp trừu tượng phải triển khai các phương thức trừu tượng được định nghĩa trong lớp cha. Ví dụ, lớp trừu tượng `AbstractPlayer` định nghĩa phương thức `play()`, do đó lớp con `BasketballPlayer` phải triển khai phương thức này.

```java
public class BasketballPlayer extends AbstractPlayer {
    @Override
    void play() {
        System.out.println("Tôi là Wilt Chamberlain, đã từng ghi được 100 điểm trong một trận đấu bóng rổ");
    }
}
```

Nếu không triển khai, trình biên dịch sẽ báo lỗi "Lớp con phải triển khai các phương thức trừu tượng", như trong hình dưới đây.

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/object-class/abstract-04.png)

### 3. Kịch bản ứng dụng của lớp trừu tượng

Đây là một số tình huống cụ thể mà chúng ta có thể áp dụng lớp trừu tượng trong Java:

#### **01) Tình huống thứ nhất**

Khi chúng ta muốn nhiều lớp con có thể chia sẻ các phương thức chung, ta có thể sử dụng lớp trừu tượng. Ví dụ, chúng ta định nghĩa một lớp trừu tượng `AbstractPlayer`, trong đó có một phương thức thông thường là `sleep()`, biểu thị rằng tất cả các vận động viên đều cần phải nghỉ ngơi.

```java
abstract class AbstractPlayer {
    public void sleep() {
        System.out.println("Vận động viên cần phải nghỉ ngơi, không chỉ là thách thức giới hạn.");
    }
}
```

Lớp con `BasketballPlayer` kế thừa từ lớp `AbstractPlayer`:

```java
class BasketballPlayer extends AbstractPlayer {
}
```

Do đó, lớp `BasketballPlayer` kế thừa phương thức `sleep()`. Chúng ta có thể khởi tạo đối tượng `BasketballPlayer` và gọi phương thức `sleep()`:

```java
BasketballPlayer basketballPlayer = new BasketballPlayer();
basketballPlayer.sleep(); // Kết quả: Vận động viên cần phải nghỉ ngơi, không chỉ là thách thức giới hạn.
```

Tương tự, lớp con `FootballPlayer` cũng kế thừa từ lớp `AbstractPlayer`:

```java
class FootballPlayer extends AbstractPlayer {
}
```

Lớp `FootballPlayer` cũng kế thừa phương thức `sleep()`, và đối tượng của nó cũng có thể gọi phương thức `sleep()`:

```java
FootballPlayer footballPlayer = new FootballPlayer();
footballPlayer.sleep(); // Kết quả: Vận động viên cần phải nghỉ ngơi, không chỉ là thách thức giới hạn.
```

Bằng cách này, chúng ta thực hiện được việc tái sử dụng mã, tránh việc lặp lại việc viết lại các phương thức `sleep()` trong mỗi lớp con khác nhau.

#### **02) Tình huống thứ hai**

Khi chúng ta cần định nghĩa một API trong lớp trừu tượng và yêu cầu các lớp con kế thừa triển khai, chúng ta có thể sử dụng lớp trừu tượng. Ví dụ, lớp trừu tượng `AbstractPlayer` định nghĩa một phương thức trừu tượng `play()`, biểu thị rằng tất cả các vận động viên có thể tham gia một hoạt động thể thao nào đó, nhưng mỗi loại vận động viên có cách thực hiện khác nhau, ví dụ như người chơi bóng rổ chơi bóng rổ và người chơi bóng đá chơi bóng đá.

```java
abstract class AbstractPlayer {
    abstract void play();
}
```

Lớp `BasketballPlayer` kế thừa từ lớp `AbstractPlayer` và triển khai phương thức `play()` của riêng mình.

```java
public class BasketballPlayer extends AbstractPlayer {
    @Override
    void play() {
        System.out.println("Tôi là Michael Jordan, tôi đã ghi được hơn 100 điểm trong một trận đấu bóng rổ.");
    }
}
```

Lớp `FootballPlayer` cũng kế thừa từ `AbstractPlayer` và triển khai phương thức `play()` của riêng mình.

```java
public class FootballPlayer extends AbstractPlayer {
    @Override
    void play() {
        System.out.println("Tôi là Cristiano Ronaldo, tôi có thể nhảy đầu dứt điểm ở bất kỳ chiều cao nào.");
    }
}
```

Để minh họa thêm tính năng của lớp trừu tượng, chúng ta có thể xem xét một ví dụ cụ thể.

Giả sử bây giờ có một tệp văn bản với nội dung đơn giản, chỉ có một từ "Hello World", và chúng ta cần một lớp đọc để đọc nội dung từ tệp này và có thể làm cho nó thành chữ hoa hoặc chữ thường.

Lúc này, tốt nhất là định nghĩa một lớp trừu tượng `BaseFileReader` như sau:

```java
/**
 * Lớp trừu tượng, định nghĩa một khuôn khổ cơ bản để đọc tệp, trong đó mapFileLine là một phương thức trừu tượng, chi tiết triển khai cần phải được lớp con thực hiện
 */
abstract class BaseFileReader {
    protected Path filePath; // Định nghĩa một đối tượng Path được bảo vệ, biểu thị đường dẫn của tệp được đọc

    /**
     * Phương thức tạo, chuyển đường dẫn của tệp để đọc vào
     * @param filePath Đường dẫn của tệp để đọc
     */
    protected BaseFileReader(Path filePath) {
        this.filePath = filePath;
    }

    /**
     * Phương thức đọc tệp, trả về một danh sách chuỗi
     * @return Danh sách chuỗi biểu thị nội dung của tệp
     * @throws IOException Nếu có lỗi khi đọc tệp, ném ngoại lệ này
     */
    public List<String> readFile() throws IOException {
        return Files.lines(filePath) // Sử dụng phương thức lines của lớp Files, đọc từng dòng của tệp
                .map(this::mapFileLine) // Áp dụng phương thức mapFileLine cho mỗi dòng, chuyển đổi nó thành định dạng mong muốn
                .collect(Collectors.toList()); // Thu thập mỗi dòng đã xử lý vào một danh sách chuỗi và trả về
    }

    /**
     * Phương thức trừu tượng, các lớp con cần phải triển khai phương thức này, chuyển đổi mỗi dòng của tệp thành định dạng mong muốn
     * @param line Mỗi dòng của tệp
     * @return Chuỗi đã chuyển đổi
     */
    protected abstract String mapFileLine(String line);
}
```

- `filePath` là đường dẫn của tệp, được bảo vệ và có thể truy cập từ các lớp con khi cần thiết.

- Phương thức `readFile()` đọc tệp và trong thân phương thức nó gọi phương thức trừu tượng `mapFileLine()` - phương thức này sẽ được các lớp con kế thừa để triển khai các phương thức đọc chữ hoa và chữ thường khác nhau.

Bạn có thể triển khai các lớp con `LowercaseFileReader` và `UppercaseFileReader` như sau:

```java
class LowercaseFileReader extends BaseFileReader {
    protected LowercaseFileReader(Path filePath) {
        super(filePath);
    }

    @Override
    protected String mapFileLine(String line) {
        return line.toLowerCase();
    }
}
```

```java
class UppercaseFileReader extends BaseFileReader {
    protected UppercaseFileReader(Path filePath) {
        super(filePath);
    }

    @Override
    protected String mapFileLine(String line) {
        return line.toUpperCase();
    }
}
```

Mỗi lớp con chỉ cần tập trung vào cách thực hiện cụ thể của nó, `LowercaseFileReader` đọc nội dung tệp với chữ thường, `UppercaseFileReader` đọc nội dung tệp với chữ hoa.

Hãy xem lớp thử nghiệm `FileReaderTest` như sau:

```java
public class FileReaderTest {
    public static void main(String[] args) throws URISyntaxException, IOException {
        URL location = FileReaderTest.class.getClassLoader().getResource("helloworld.txt");
        Path path = Paths.get(location.toURI());
        BaseFileReader lowercaseFileReader = new LowercaseFileReader(path);
        BaseFileReader uppercaseFileReader = new UppercaseFileReader(path);
        System.out.println(lowercaseFileReader.readFile());
        System.out.println(uppercaseFileReader.readFile());
    }
}
```

Tạo một tệp văn bản đơn giản trong thư mục `resource` của dự án với tên `helloworld.txt`, với nội dung "Hello World". Vị trí cụ thể của tệp được hiển thị như hình sau, sử dụng môi trường phát triển tích hợp Intellij IDEA của tôi.

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/object-class/abstract-05.png)

Chúng tôi có thể lấy đường dẫn URI của tệp từ `ClassLoader.getResource()` và sau đó lấy nội dung văn bản.

Kết quả xuất ra như sau:

```
[hello world]
[HELLO WORLD]
```

### 04. Tổng kết về lớp trừu tượng

Được rồi, chúng ta hãy tổng kết lại về lớp trừu tượng một cách đơn giản:

- **1. Không thể khởi tạo một đối tượng từ lớp trừu tượng.**
- **2. Lớp trừu tượng phải có ít nhất một phương thức trừu tượng; nếu không, lớp đó không có ý nghĩa gì.**
- **3. Phương thức trừu tượng trong lớp trừu tượng không có thân hàm.**
- **4. Các lớp con của lớp trừu tượng phải cung cấp triển khai cụ thể cho các phương thức trừu tượng của lớp cha, trừ khi lớp con đó cũng là lớp trừu tượng.**


