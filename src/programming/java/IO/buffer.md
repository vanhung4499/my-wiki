---
title: Buffered Stream
tags:
  - java
categories:
  - java
order: 5
---
# Buffered Stream

Các buffered stream của Java là một loại bao bọc cho các byte stream và character stream, bằng cách mở một bộ đệm trong bộ nhớ để tăng hiệu suất của các thao tác I/O. Java sử dụng `BufferedInputStream` và `BufferedOutputStream` để thực hiện đệm byte stream, và `BufferedReader` và `BufferedWriter` để thực hiện đệm character stream.

Nguyên lý hoạt động của buffered stream là ghi dữ liệu vào bộ đệm trước, khi bộ đệm đầy thì ghi dữ liệu vào tệp hoặc output stream một lần, hoặc khi bộ đệm trống thì đọc một lượng dữ liệu nhất định từ tệp hoặc input stream một lần. Điều này giúp giảm số lần thao tác I/O của hệ thống, tăng hiệu suất I/O của hệ thống, từ đó tăng hiệu suất chạy của chương trình.

### 01. Buffered byte stream

`BufferedInputStream` và `BufferedOutputStream` thuộc loại buffered stream byte, củng cố các byte stream `InputStream` và `OutputStream`. Về các byte stream, chúng ta đã thảo luận chi tiết trước đó, bạn có thể [nhấp vào liên kết này](https://javabetter.cn/io/stream.html) để ôn lại.

#### 1. Phương thức khởi tạo

*   `BufferedInputStream(InputStream in)` : Tạo một buffered stream đầu vào mới, chú ý rằng tham số là loại **InputStream**.
*   `BufferedOutputStream(OutputStream out)` : Tạo một buffered stream đầu ra mới, chú ý rằng tham số là loại **OutputStream**.

Ví dụ mã như sau:

```java
// Tạo buffered stream đầu vào byte, đầu tiên khai báo byte stream
FileInputStream fis = new FileInputStream("b.txt");
BufferedInputStream bis = new BufferedInputStream(fis);

// Tạo buffered stream đầu vào byte (một bước)
BufferedInputStream bis = new BufferedInputStream(new FileInputStream("b.txt"));

// Tạo buffered stream đầu ra byte (một bước)
BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("b.txt"));
```

#### 2. Hiệu quả của buffered stream

Chúng ta sẽ kiểm tra hiệu quả của buffered stream bằng cách sao chép một tệp lớn hơn 370MB. Để so sánh, trước tiên chúng ta sẽ thực hiện bằng cách sử dụng stream cơ bản, mã như sau:

```java
// Ghi lại thời gian bắt đầu
long start = System.currentTimeMillis();
// Tạo đối tượng stream
try (FileInputStream fis = new FileInputStream("py.mp4"); // Tệp exe đủ lớn
     FileOutputStream fos = new FileOutputStream("copyPy.mp4")) {
    // Đọc và ghi dữ liệu
    int b;
    while ((b = fis.read()) != -1) {
        fos.write(b);
    }
}
// Ghi lại thời gian kết thúc
long end = System.currentTimeMillis();
System.out.println("Thời gian sao chép bằng stream cơ bản: " + (end - start) + " mili giây");
```

Xin lỗi, máy của tôi khá yếu, sau 10 phút vẫn đang sao chép. Hãy chuyển sang thử buffered stream, mã như sau:

```java
// Ghi lại thời gian bắt đầu
long start = System.currentTimeMillis();
// Tạo đối tượng stream
try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream("py.mp4"));
     BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("copyPy.mp4"))) {
    // Đọc và ghi dữ liệu
    int b;
    while ((b = bis.read()) != -1) {
        bos.write(b);
    }
}
// Ghi lại thời gian kết thúc
long end = System.currentTimeMillis();
System.out.println("Thời gian sao chép bằng buffered stream: " + (end - start) + " mili giây");
```

Chỉ cần 8016 mili giây. Làm thế nào để nhanh hơn nữa?

Chúng ta có thể sử dụng cách đọc và ghi bằng mảng, như đã thảo luận trước đó, mã như sau:

```java
// Ghi lại thời gian bắt đầu
long start = System.currentTimeMillis();
// Tạo đối tượng stream
try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream("py.mp4"));
     BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("copyPy.mp4"))) {
    // Đọc và ghi dữ liệu
    int len;
    byte[] bytes = new byte[8 * 1024];
    while ((len = bis.read(bytes)) != -1) {
        bos.write(bytes, 0, len);
    }
}
// Ghi lại thời gian kết thúc
long end = System.currentTimeMillis();
System.out.println("Thời gian sao chép bằng buffered stream sử dụng mảng: " + (end - start) + " mili giây");
```

Bây giờ thì nhanh hơn nhiều, chỉ cần 521 mili giây.

#### 3. Tại sao buffered stream lại nhanh như vậy?

Java IO truyền thống là chế độ chặn, hoạt động của nó là "đọc/ghi, chờ, đọc/ghi, chờ...". buffered stream giải quyết vấn đề này bằng cách **đọc và ghi nhiều hơn trong một lần, giảm tần suất đọc và ghi, sử dụng không gian để đổi lấy thời gian**.

- **Giảm số lần gọi hệ thống**: Khi sử dụng buffered stream, dữ liệu không được ghi trực tiếp vào đĩa hoặc output stream, mà trước tiên được ghi vào bộ đệm. Khi bộ đệm đầy, dữ liệu mới được ghi một lần vào đĩa hoặc output stream. Điều này giúp giảm số lần gọi hệ thống, do đó nâng cao hiệu quả hoạt động I/O.
- **Giảm số lần đọc và ghi đĩa**: Khi cần đọc dữ liệu, buffered stream sẽ đọc từ bộ đệm trước. Nếu bộ đệm không đủ dữ liệu, buffered stream sẽ đọc một lượng lớn dữ liệu từ đĩa hoặc input stream một lần. Tương tự, khi cần ghi dữ liệu, buffered stream sẽ ghi vào bộ đệm trước. Nếu bộ đệm đầy, dữ liệu trong bộ đệm sẽ được ghi vào đĩa hoặc output stream một lần. Điều này giúp giảm số lần đọc và ghi đĩa, do đó nâng cao hiệu quả hoạt động I/O.
- **Nâng cao hiệu quả truyền dữ liệu**: Khi sử dụng buffered stream, dữ liệu được truyền theo khối, giảm số lần truyền dữ liệu, do đó nâng cao hiệu quả truyền dữ liệu.

Hãy xem phương thức `read` của `BufferedInputStream`:

```java
public synchronized int read() throws IOException {
    if (pos >= count) {     // Nếu vị trí hiện tại đã đến cuối bộ đệm
        fill();             // Điền đầy bộ đệm
        if (pos >= count)   // Nếu sau khi điền đầy vẫn đến cuối bộ đệm, nghĩa là đã đọc xong
            return -1;      // Trả về -1 để biểu thị đã đọc xong
    }
    return getBufIfOpen()[pos++] & 0xff; // Trả về byte tại vị trí hiện tại và tăng vị trí lên 1
}
```

Đoạn mã này có hai phần chính:

- `fill()`: Phương thức này sẽ điền đầy bộ đệm `buf`.
- `getBufIfOpen()[pos++] & 0xff`: Trả về byte tại vị trí đọc hiện tại `pos` (phương thức `getBufIfOpen()` trả về mảng `buffer`, là kiểu `byte`), và thực hiện phép toán `AND` với `0xff`. Mục đích là để xử lý byte `b` như một byte không dấu, vì kiểu `byte` trong Java có dấu. Phép toán `AND` với `0xff` sẽ chuyển đổi byte này thành byte không dấu, với phạm vi từ 0 đến 255.

>Xử lý `byte & 0xFF` sẽ được giải thích chi tiết sau.

Tiếp theo, hãy xem phương thức `read` của `FileInputStream`:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240630225343.png)


Trong đoạn mã này, phương thức `read0()` là một native-method, được thực hiện bởi hệ điều hành và không phải bằng Java. Trên các hệ điều hành khác nhau, phương thức `read0()` có thể được thực hiện khác nhau, nhưng chức năng của chúng là giống nhau, dùng để **đọc một byte**.

Tiếp theo, hãy xem phương thức `write(byte b[], int off, int len)` của `BufferedOutputStream`:

```java
public synchronized void write(byte b[], int off, int len) throws IOException {
    if (len >= buf.length) {    // Nếu số byte ghi lớn hơn hoặc bằng độ dài bộ đệm
        /* Nếu độ dài yêu cầu vượt quá kích thước của bộ đệm đầu ra,
           trước tiên sẽ làm trống bộ đệm, sau đó trực tiếp ghi dữ liệu.
           Điều này có thể tránh vấn đề xâu chuỗi bộ đệm. */
        flushBuffer();          // Trước tiên làm trống bộ đệm
        out.write(b, off, len); // Trực tiếp ghi dữ liệu vào output stream
        return;
    }
    if (len > buf.length - count) { // Nếu số byte ghi lớn hơn không gian trống
        flushBuffer();              // Trước tiên làm trống bộ đệm
    }
    System.arraycopy(b, off, buf, count, len); // Sao chép dữ liệu vào bộ đệm
    count += len;                             // Cập nhật bộ đếm
}
```

Trước tiên, phương thức này sẽ kiểm tra nếu số byte ghi lớn hơn hoặc bằng độ dài bộ đệm. Nếu đúng, trước tiên nó sẽ làm trống bộ đệm, sau đó trực tiếp ghi dữ liệu vào output stream. Điều này nhằm tránh vấn đề xâu chuỗi bộ đệm, nghĩa là khi kích thước bộ đệm không đủ để chứa dữ liệu cần ghi, có thể gây ra làm trống bộ đệm liên tiếp, dẫn đến giảm hiệu suất.

>Vấn đề xâu chuỗi (Cascade Problem) là hiện tượng khi một tập hợp các buffered stream có kích thước bộ đệm không đủ để chứa dữ liệu cần ghi, dẫn đến dữ liệu bị phân chia thành nhiều phần và ghi vào các bộ đệm khác nhau, cuối cùng cần phải làm trống từng bộ đệm một, từ đó gây giảm hiệu suất.

Tiếp theo, nếu số byte ghi nhỏ hơn độ dài bộ đệm, nó sẽ kiểm tra không gian còn lại của bộ đệm có đủ để chứa dữ liệu cần ghi hay không. Nếu không đủ, nó sẽ làm trống bộ đệm. Sau đó, nó sẽ sử dụng phương thức `System.arraycopy()` để sao chép dữ liệu vào bộ đệm và cập nhật bộ đếm `count`.

Cuối cùng, nếu số byte ghi nhỏ hơn độ dài bộ đệm và bộ đệm vẫn còn không gian trống, nó sẽ trực tiếp sao chép dữ liệu vào bộ đệm và cập nhật bộ đếm `count`.

Điều này có nghĩa là chỉ khi `buf` đầy, nó mới làm trống bộ đệm (flush) và ghi dữ liệu vào đĩa, mặc định mỗi lần ghi 8192 byte.

```java
public BufferedOutputStream(OutputStream out) {
    this(out, 8192);
}
```

Nếu `buf` chưa đầy, nó sẽ tiếp tục ghi vào `buf`.

So sánh với phương thức `write` của `FileOutputStream`, cũng là phương thức gốc và mỗi lần chỉ có thể ghi một byte.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240630225438.png)

Khi sử dụng `BufferedOutputStream` và `BufferedInputStream` cùng nhau, số lần đọc và ghi sẽ giảm đáng kể, đặc biệt khi sử dụng `byte[] bytes = new byte[8*1024]`, tương đương với việc bộ đệm có dung lượng 8 x 1024 byte, thì hiệu quả đọc và ghi sẽ tăng lên rất nhiều.

#### 4. `byte & 0xFF`

Kiểu byte thường được sử dụng để lưu trữ dữ liệu nhị phân, ví dụ như đọc và ghi vào tệp, truyền dữ liệu qua mạng, v.v. Trong những tình huống này, biến kiểu byte có thể được sử dụng để lưu trữ từng byte trong stream dữ liệu để thực hiện các thao tác đọc và ghi.

Kiểu byte là có dấu, có nghĩa là giá trị của nó nằm trong phạm vi từ -128 đến 127. Nếu chúng ta muốn có được một giá trị byte không dấu, chúng ta cần sử dụng `byte & 0xFF` để chuyển đổi.

Điều này là bởi vì 0xFF là một số nguyên không dấu, biểu diễn nhị phân của nó là 11111111. Khi một giá trị kiểu byte được thực hiện phép AND với 0xFF, nó sẽ chuyển đổi giá trị kiểu byte đó thành một số nguyên không dấu, nằm trong phạm vi từ 0 đến 255.

0xFF là một số thập lục phân, tương đương với nhị phân 11111111. Toán tử & có ý nghĩa là: nếu hai bit tương ứng là 1, thì bit kết quả là 1, ngược lại là 0; vì vậy khi thực hiện phép AND với 0xFF, byte sẽ được giữ nguyên và chuyển đổi thành một số nguyên trong khoảng từ 0 đến 255.

Ví dụ, nếu chúng ta có một biến kiểu byte là b, với giá trị là -1, thì kết quả của b & 0xFF là 255. Điều này cho phép chuyển đổi một giá trị kiểu byte có dấu thành một số nguyên không dấu.

Phép toán AND là một phương pháp tính toán dữ liệu nhị phân, trong đó nếu cả hai bit tương ứng đều là 1 thì kết quả là 1, ngược lại là 0. Trong quá trình tính toán `getBufIfOpen()[pos++] & 0xff`, byte có 8 bit, 0xFF là 255 trong hệ thập lục phân, biểu diễn là số nguyên, có 32 bit.

Nếu `getBufIfOpen()[pos++]` là -118, thì biểu diễn gốc của nó là

```
00000000 00000000 00000000 10001010
```

Biểu diễn đảo của nó là

```
11111111 11111111 11111111 11110101
```

Biểu diễn bù của nó là

```
11111111 11111111 11111111 11110110
```

0XFF là 255 biểu diễn trong hệ thập lục phân là 255, biểu diễn gốc, đảo, bù là như nhau, dữ liệu hai, byte 255 chính byte cùng.


① Dạng gốc

Dạng gốc là việc thêm dấu chữ số vào giá trị tuyệt đối, tức là sử dụng dấu đầu tiên để biểu thị dấu, các bit còn lại biểu thị giá trị. Ví dụ nếu là số nhị phân 8 bit:

```
[+1] gốc = 0000 0001

[-1] gốc = 1000 0001
```

Dấu đầu tiên là dấu chữ số. Vì dấu đầu tiên là dấu chữ số, nên phạm vi giá trị của số nhị phân 8 bit là:

```
[1111 1111 , 0111 1111]
```

tức là

```
[-127 , 127]
```

② Dạng đảo

Phương pháp biểu thị của dạng đảo là:

- Dạng đảo của số dương là chính nó
- Dạng đảo của số âm là dựa trên dạng gốc của nó, giữ nguyên dấu chữ số, các bit còn lại đảo ngược.

Ví dụ:

```
[+1] = [00000001] gốc = [00000001] đảo

[-1] = [10000001] gốc = [11111110] đảo
```

Có thể thấy nếu một dạng đảo biểu thị là số âm, thì não không thể trực quan nhận ra giá trị của nó. Thông thường cần chuyển đổi sang dạng gốc trước khi tính toán.

③ Dạng bù

Phương pháp biểu thị của dạng bù là:

- Dạng bù của số dương là chính nó
- Dạng bù của số âm là dựa trên dạng gốc của nó, giữ nguyên dấu chữ số, các bit còn lại đảo ngược, sau đó +1. (tức là cộng thêm một)

```
[+1] = [00000001] gốc = [00000001] đảo = [00000001] bù

[-1] = [10000001] gốc = [11111110] đảo = [11111111] bù
```

Đối với số âm, phương pháp biểu thị bù cũng là một cách mà não không thể trực quan nhận ra giá trị của nó. Thông thường cũng cần chuyển đổi sang dạng gốc trước khi tính toán.

Từ những điều trên có thể thấy:

- Đối với số dương: dạng gốc, đảo, bù đều giống nhau
- Đối với số âm: dạng gốc, đảo, bù đều khác nhau

### 02. Buffered character stream

Lớp BufferedReader kế thừa từ lớp Reader và cung cấp một số phương thức tiện ích, ví dụ như phương thức `readLine()` có thể đọc một dòng dữ liệu một lần, thay vì đọc từng ký tự một.

Lớp BufferedWriter kế thừa từ lớp Writer và cung cấp một số phương thức tiện ích, ví dụ như phương thức `newLine()` có thể ghi một dấu phân tách dòng cụ thể cho hệ thống.

#### 1. Phương thức khởi tạo

- `BufferedReader(Reader in)` ：Tạo một buffered input stream mới, lưu ý loại tham số là **Reader**.
- `BufferedWriter(Writer out)`： Tạo một buffered output stream mới, lưu ý loại tham số là **Writer**.

Mã ví dụ như sau:

```java
// Tạo input stream ký tự đệm
BufferedReader br = new BufferedReader(new FileReader("b.txt"));
// Tạo output stream ký tự đệm
BufferedWriter bw = new BufferedWriter(new FileWriter("b.txt"));
```

#### 2. Phương thức đặc thù của buffered character stream

Các phương thức cơ bản của buffered character stream và cách gọi tương tự như [character stream](character.md), ở đây không nhắc lại. Chúng ta sẽ xem xét các phương thức **đặc thù** của buffered character stream.

- BufferedReader：`String readLine()`: **Đọc một dòng dữ liệu**, đọc đến cuối cùng sẽ trả về null.
- BufferedWriter：`newLine()`: **Xuống dòng**, hệ thống xác định ký tự xuống dòng.

Ví dụ về phương thức `readLine()`:

```java
// Tạo đối tượng stream
BufferedReader br = new BufferedReader(new FileReader("a.txt"));
// Định nghĩa chuỗi để lưu trữ dòng văn bản đã đọc
String line  = null;
// Đọc lặp, đọc đến cuối cùng sẽ trả về null
while ((line = br.readLine()) != null) {
    System.out.print(line);
    System.out.println("------");
}
// Giải phóng tài nguyên
br.close();
```

Tiếp theo là ví dụ về phương thức `newLine()`:

```java
// Tạo đối tượng stream
BufferedWriter bw = new BufferedWriter(new FileWriter("b.txt"));
// Ghi dữ liệu
bw.write("Chén");
// Ghi xuống dòng mới
bw.newLine();
bw.write("Mặc");
bw.newLine();
bw.write("Vương");
bw.newLine();
bw.write("Nhị");
bw.newLine();
// Giải phóng tài nguyên
bw.close();
```
