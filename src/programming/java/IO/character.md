---
title: Character Stream
tags:
  - java
categories:
  - java
order: 4
---
# Character Stream

# 7.4 Character Stream

Câu chuyện về Character Stream Reader và Writer bắt đầu từ biểu đồ quan hệ lớp của chúng, hãy cùng xem biểu đồ.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240630220036.png)


Character Stream là một loại IO Stream dùng để đọc và ghi dữ liệu ký tự. Khác với Byte Stream, Character Stream đọc và ghi dữ liệu theo đơn vị ký tự chứ không phải theo đơn vị byte. Thường được sử dụng để xử lý thông tin văn bản.

Nếu sử dụng Byte Stream để đọc trực tiếp tiếng Việt, có thể gặp phải vấn đề hiển thị ký tự bị lỗi, xem ví dụ dưới đây:

```java
// FileInputStream là character input stream hoạt động trên file
FileInputStream inputStream = new FileInputStream("a.txt");// // Nội dung là "Xin chào các bạn"

int len;
while ((len = inputStream.read()) != -1) {
    System.out.print((char) len);
}
```

Xem kết quả chạy:

```
Xin chÃ o cÃ¡c báº¡n
```
 
Lý do xuất hiện lỗi hiển thị là vì trong Byte Stream, một ký tự thường được tạo thành từ nhiều byte và các mã ký tự khác nhau sử dụng số byte khác nhau. Nếu chúng ta sử dụng mã ký tự không đúng hoặc không xử lý chính xác việc chuyển đổi mã ký tự khi đọc và ghi dữ liệu, sẽ dẫn đến ký tự tiếng Việt bị lỗi hiển thị.

Ví dụ, khi sử dụng mã ký tự mặc định (xem ví dụ trên) để đọc một file văn bản chứa ký tự tiếng Việt, sẽ xuất hiện lỗi hiển thị. Bởi vì mã ký tự mặc định thường là mã ASCII, chỉ có thể biểu diễn ký tự tiếng Anh và không thể giải mã đúng ký tự tiếng Việt.

Vậy làm thế nào để sử dụng Byte Stream để đọc đúng tiếng Việt? Xem ví dụ dưới đây.

```java
try (FileInputStream inputStream = new FileInputStream("a.txt")) {
    byte[] bytes = new byte[1024];
    int len;
    while ((len = inputStream.read(bytes)) != -1) {
        System.out.print(new String(bytes, 0, len));
    }
}
```
 
Tại sao cách này lại hiệu quả?

Bởi vì chúng ta sử dụng lớp String để giải mã. Khi kiểm tra mã nguồn của `new String(byte bytes[], int offset, int length)`, chúng ta có thể thấy phương thức này có chức năng giải mã:

```java
public String(byte bytes[], int offset, int length) {
    checkBounds(bytes, offset, length);
    this.value = StringCoding.decode(bytes, offset, length);
}
```

Khi tiếp tục theo dõi phương thức `StringCoding.decode()`, sẽ thấy nó gọi đến phương thức `defaultCharset()`, và sẽ thấy mã mặc định là `UTF-8`, như sau:

```java
public static Charset defaultCharset() {
    if (defaultCharset == null) {
        synchronized (Charset.class) {
            if (cs != null)
                defaultCharset = cs;
            else
                defaultCharset = forName("UTF-8");
        }
    }
    return defaultCharset;
}
static char[] decode(byte[] ba, int off, int len) {
    String csn = Charset.defaultCharset().name();
    try {
        // use charset name decode() variant which provides caching.
        return decode(csn, ba, off, len);
    } catch (UnsupportedEncodingException x) {
        warnUnsupportedCharset(csn);
    }
}
```

Trong Java, các mã ký tự thông dụng bao gồm ASCII, ISO-8859-1, UTF-8, UTF-16, v.v. Trong đó, ASCII và ISO-8859-1 chỉ có thể biểu diễn một phần ký tự, trong khi UTF-8 và UTF-16 có thể biểu diễn tất cả các ký tự Unicode, bao gồm ký tự tiếng Việt.

Khi chúng ta sử dụng `new String(byte bytes[], int offset, int length)` để chuyển đổi Byte Stream thành chuỗi ký tự, Java sẽ dựa vào quy tắc UTF-8 để giải mã mỗi 3 byte thành một ký tự tiếng Việt, từ đó giải mã chính xác ký tự tiếng Việt.

Mặc dù Byte Stream cũng có thể giải quyết vấn đề lỗi hiển thị ký tự, nhưng không trực tiếp. Do đó, chúng ta có Character Stream, `chuyên dùng để xử lý file văn bản` (âm thanh, hình ảnh, video, v.v. là các file không phải văn bản).

Từ góc độ khác: **Character Stream = Byte Stream + Bảng mã hóa**.

### 01. Character Input Stream (Reader)

`java.io.Reader` là **lớp cha** của **character input stream**, nó định nghĩa một số phương thức chung của character input stream:

- `close()`：Đóng stream này và giải phóng các tài nguyên hệ thống liên quan.
- `read()`：Đọc một ký tự từ input stream.
- `read(char[] cbuf)`：Đọc một số ký tự từ input stream và lưu chúng vào mảng ký tự `cbuf`.

FileReader là lớp con của Reader, được sử dụng để đọc dữ liệu ký tự từ tệp. Các đặc điểm chính của nó như sau:

- Có thể chỉ định đường dẫn tệp cần đọc thông qua hàm tạo.
- Mỗi lần có thể đọc một hoặc nhiều ký tự.
- Có thể đọc các ký tự trong tập ký tự Unicode và thực hiện chuyển đổi tập ký tự thông qua mã hóa ký tự được chỉ định.

#### 1. Hàm tạo của FileReader

- `FileReader(File file)`：Tạo một FileReader mới, tham số là **đối tượng File**.
- `FileReader(String fileName)`：Tạo một FileReader mới, tham số là tên tệp.

Ví dụ mã như sau:

```java
// Tạo đối tượng stream bằng cách sử dụng đối tượng File
File file = new File("a.txt");
FileReader fr = new FileReader(file);

// Tạo đối tượng stream bằng cách sử dụng tên tệp
FileReader fr = new FileReader("b.txt");
```

#### 2. Đọc dữ liệu ký tự với FileReader

① **Đọc ký tự**：Phương thức `read`, mỗi lần có thể đọc một ký tự, trả về ký tự đã đọc (được chuyển thành kiểu int), khi đọc đến cuối tệp sẽ trả về `-1`. Ví dụ mã như sau:

```java
// Tạo đối tượng stream bằng cách sử dụng tên tệp
FileReader fr = new FileReader("abc.txt");
// Định nghĩa biến để lưu dữ liệu
int b;
// Đọc tuần tự
while ((b = fr.read()) != -1) {
    System.out.println((char) b);
}
// Đóng tài nguyên
fr.close();
```

② **Đọc ký tự với độ dài chỉ định**：Phương thức `read(char[] cbuf, int off, int len)` đọc một số ký tự từ input stream và lưu chúng vào mảng ký tự. Trong đó, cbuf biểu thị mảng ký tự để lưu kết quả đọc, off biểu thị vị trí bắt đầu lưu kết quả, len biểu thị số ký tự cần đọc. Ví dụ mã như sau:

```java
File textFile = new File("docs/约定.md");
// Một ví dụ về FileReader
// try-with-resources FileReader
try (FileReader reader = new FileReader(textFile);) {
    // read(char[] cbuf)
    char[] buffer = new char[1024];
    int len;
    while ((len = reader.read(buffer, 0, buffer.length)) != -1) {
        System.out.print(new String(buffer, 0, len));
    }
}
```

Trong ví dụ này, FileReader được sử dụng để đọc dữ liệu ký tự từ tệp và lưu chúng vào một mảng ký tự có kích thước 1024. Mỗi lần đọc len ký tự, sau đó sử dụng phương thức tạo của String để chuyển đổi chúng thành chuỗi và xuất ra.

FileReader đã triển khai interface AutoCloseable, do đó có thể sử dụng câu lệnh try-with-resources để tự động đóng tài nguyên, tránh các thao tác đóng tài nguyên thủ công phức tạp.

### 02. Character Output Stream (Writer)

`java.io.Writer` là **lớp cha** của **character output stream**, nó cho phép ghi thông tin ký tự đã chỉ định vào đích, hãy xem một số phương thức chung mà nó định nghĩa:

- `write(int c)`：Ghi một ký tự.
- `write(char[] cbuf)`：Ghi một mảng ký tự.
- `write(char[] cbuf, int off, int len)`：Ghi một phần của mảng ký tự, off là chỉ số bắt đầu, len là số lượng ký tự.
- `write(String str)`：Ghi một chuỗi.
- `write(String str, int off, int len)`：Ghi một phần của chuỗi, off chỉ vị trí bắt đầu của chuỗi con trong str, len chỉ độ dài của chuỗi con cần ghi.
- `flush()`：Làm mới bộ đệm của stream.
- `close()`：Đóng stream này, nhưng phải làm mới nó trước.

Lớp `java.io.FileWriter` là lớp con của Writer, được sử dụng để ghi các ký tự vào tệp.

#### 1. Hàm tạo của FileWriter

- `FileWriter(File file)`：Tạo một FileWriter mới, tham số là đối tượng File cần ghi.
- `FileWriter(String fileName)`：Tạo một FileWriter mới, tham số là tên của tệp cần ghi.

Ví dụ mã như sau:

```java
// Cách thứ nhất: Tạo đối tượng stream bằng cách sử dụng đối tượng File
File file = new File("a.txt");
FileWriter fw = new FileWriter(file);

// Cách thứ hai: Tạo đối tượng stream bằng cách sử dụng tên tệp
FileWriter fw = new FileWriter("b.txt");
```

#### 2. Ghi dữ liệu bằng FileWriter

① **Ghi ký tự**: Phương thức `write(int b)` cho phép ghi ra một ký tự mỗi lần. Ví dụ mã như sau:

```java
FileWriter fw = null;
try {
    fw = new FileWriter("output.txt");
    fw.write(72); // Ghi mã ASCII của ký tự 'H'
    fw.write(101); // Ghi mã ASCII của ký tự 'e'
    fw.write(108); // Ghi mã ASCII của ký tự 'l'
    fw.write(108); // Ghi mã ASCII của ký tự 'l'
    fw.write(111); // Ghi mã ASCII của ký tự 'o'
} catch (IOException e) {
    e.printStackTrace();
} finally {
    try {
        if (fw != null) {
            fw.close();
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

Trong ví dụ mã này, trước tiên tạo một đối tượng FileWriter `fw` và chỉ định đường dẫn tệp "output.txt" để ghi vào. Sau đó, sử dụng phương thức `fw.write()` để ghi các byte vào tệp, ở đây lần lượt ghi mã ASCII của các ký tự 'H', 'e', 'l', 'l', 'o'. Cuối cùng, trong khối `finally`, đóng đối tượng FileWriter để giải phóng tài nguyên.

Lưu ý rằng khi sử dụng phương thức `write(int b)`, chúng ta đang ghi một byte, không phải một ký tự. Nếu cần ghi ký tự, có thể sử dụng các phương thức `write(char cbuf[])` hoặc `write(String str)`.

② **Ghi mảng ký tự**: Phương thức `write(char[] cbuf)` cho phép ghi mảng ký tự chỉ định vào output stream. Ví dụ mã như sau:

```java
FileWriter fw = null;
try {
    fw = new FileWriter("output.txt");
    char[] chars = {'H', 'e', 'l', 'l', 'o'};
    fw.write(chars); // Ghi mảng ký tự vào tệp
} catch (IOException e) {
    e.printStackTrace();
} finally {
    try {
        if (fw != null) {
            fw.close();
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

③ **Ghi một phần mảng ký tự**: Phương thức `write(char[] cbuf, int off, int len)` cho phép ghi một phần mảng ký tự chỉ định vào output stream. Ví dụ mã như sau (phần lặp lại không viết lại, tham khảo phần trên):

```java
fw = new FileWriter("output.txt");
char[] chars = {'H', 'e', 'l', 'l', 'o', ',', ' ', 'W', 'o', 'r', 'l', 'd', '!'};
fw.write(chars, 0, 5); // Ghi 5 ký tự đầu tiên của mảng ký tự vào tệp
```

Sử dụng phương thức `fw.write()` để ghi 5 ký tự đầu tiên của mảng ký tự vào tệp.

④ **Ghi chuỗi**: Phương thức `write(String str)` cho phép ghi chuỗi chỉ định vào output stream. Ví dụ mã như sau:

```java
fw = new FileWriter("output.txt");
String str = "Hello, World!";
fw.write(str); // Ghi chuỗi vào tệp
```

⑤ **Ghi một phần chuỗi**: Phương thức `write(String str, int off, int len)` cho phép ghi một phần chuỗi chỉ định vào output stream. Ví dụ mã như sau (dạng try-with-resources):

```java
String str = "Hello, World!";
try (FileWriter fw = new FileWriter("output.txt")) {
    fw.write(str, 0, 5); // Ghi 5 ký tự đầu tiên của chuỗi vào tệp
} catch (IOException e) {
    e.printStackTrace();
}
```

>【Lưu ý】Nếu không đóng tài nguyên, dữ liệu chỉ được lưu vào bộ đệm và chưa được lưu vào tệp.

#### 3. Đóng và làm mới (close và flush)

Vì FileWriter có bộ đệm bên trong (ByteBuffer), nếu không đóng output stream, sẽ không thể ghi ký tự vào tệp.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240630221049.png)


Tuy nhiên, nếu đóng stream, sẽ không thể tiếp tục ghi dữ liệu. Nếu muốn ghi dữ liệu mà vẫn có thể tiếp tục sử dụng stream, ta cần phương thức `flush`.

- `flush`: Làm mới bộ đệm, cho phép tiếp tục sử dụng stream.
- `close`: Làm mới bộ đệm trước, sau đó thông báo hệ thống giải phóng tài nguyên. Sau khi gọi, không thể sử dụng lại stream.

Phương thức `flush` khá thú vị, hãy xem đoạn mã sau để hiểu thêm:

```java
// Nguồn, là stream nhập (stream đọc) đọc từ tệp a.txt
FileReader fr = new FileReader("abc.txt");  // Tệp a.txt phải tồn tại, nếu không sẽ ném ra ngoại lệ FileNotFoundException
// Đích, là output stream
FileWriter fw = new FileWriter("b.txt");  // Hệ thống sẽ tự động tạo tệp b.txt vì đây là output stream
int len;
while ((len = fr.read()) != -1) {
    fw.write(len);
}
// Chú ý ở đây không đóng stream bằng phương thức close, trong phát triển không nên làm như vậy, nhưng để hiểu rõ hơn về tác dụng của flush
```

Kết quả chạy chương trình sẽ như thế nào? Đáp án là tệp b.txt vẫn trống, không có gì.

Nguyên nhân đã được đề cập trước đó. **Lập trình là như vậy, không thực hành thì sẽ không bao giờ học được**! Vì vậy, hãy thực hành nhiều hơn.

Thêm ba dòng mã sau vào đoạn mã trên, tệp `b.txt` sẽ được sao chép dữ liệu từ tệp nguồn:

```java
fr.close();
fw.flush();
fw.close();
```

Phương thức `flush()` có nghĩa là làm sạch bộ đệm, được sử dụng để làm sạch stream dữ liệu trong bộ đệm. Khi thực hiện các thao tác stream, dữ liệu được đọc vào bộ nhớ trước, sau đó mới ghi vào tệp.

Bạn có thể thử với ví dụ mã sau:

```java
// Sử dụng tên tệp để tạo đối tượng stream
FileWriter fw = new FileWriter("fw.txt");
// Ghi dữ liệu, sau đó flush
fw.write('a'); // Ghi ký tự đầu tiên
fw.flush();
fw.write('b'); // Tiếp tục ghi ký tự thứ hai, ghi thành công
fw.flush();

// Ghi dữ liệu, sau đó close
fw.write('c'); // Ghi ký tự đầu tiên
fw.close();
fw.write('d'); // Tiếp tục ghi ký tự thứ hai, lỗi java.io.IOException: Stream closed
fw.close();
```

Lưu ý, dù phương thức `flush` đã ghi dữ liệu ra, cuối cùng vẫn cần gọi phương thức `close` để giải phóng tài nguyên hệ thống. Tất nhiên, bạn cũng có thể sử dụng cách try-with-resources.

#### 4. FileWriter viết tiếp và xuống dòng

**Viết tiếp và xuống dòng**: Thao tác tương tự như [FileOutputStream](programming/java/io/stream.md), hãy xem đoạn mã dưới đây:

```java
// Sử dụng tên tệp để tạo đối tượng stream, có thể viết tiếp dữ liệu
FileWriter fw = new FileWriter("fw.txt", true);     
// Ghi chuỗi
fw.write("xin chào");
// Ghi xuống dòng
fw.write("\r\n");
// Ghi chuỗi
fw.write("các bạn");
// Đóng tài nguyên
fw.close();
```

Kết quả đầu ra như sau:

```
xin chào
các bạn
```

#### 5. Sao chép tệp văn bản

Đoạn mã dưới đây thực hiện việc sao chép tệp văn bản:

```java
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class CopyFile {
    public static void main(String[] args) throws IOException {
        // Tạo đối tượng stream đầu vào
        FileReader fr = new FileReader("aa.txt"); // Nếu tệp không tồn tại sẽ ném ra ngoại lệ java.io.FileNotFoundException
        // Tạo đối tượng stream đầu ra
        FileWriter fw = new FileWriter("copyaa.txt");
        /* Các công việc của stream đầu ra:
         * 1. Gọi tài nguyên hệ thống để tạo một tệp
         * 2. Tạo đối tượng stream đầu ra
         * 3. Chỉ định đối tượng stream đầu ra đến tệp        
         */
        // Sao chép tệp văn bản, mỗi lần đọc một ký tự
        copyMethod1(fr, fw);
        // Sao chép tệp văn bản, mỗi lần đọc một mảng ký tự
        copyMethod2(fr, fw);
        
        fr.close();
        fw.close();
    }

    public static void copyMethod1(FileReader fr, FileWriter fw) throws IOException {
        int ch;
        while ((ch = fr.read()) != -1) { // Đọc dữ liệu
            fw.write(ch); // Ghi dữ liệu
        }
        fw.flush();
    }

    public static void copyMethod2(FileReader fr, FileWriter fw) throws IOException {
        char[] chs = new char[1024];
        int len = 0;
        while ((len = fr.read(chs)) != -1) { // Đọc dữ liệu
            fw.write(chs, 0, len); // Ghi dữ liệu
        }
        fw.flush();
    }
}
```