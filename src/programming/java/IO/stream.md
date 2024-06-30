---
title: Byte Stream
tags:
  - java
categories:
  - java
order: 3
---
# Byte Stream

Chúng ta cần phải nhấn mạnh rằng dữ liệu của mọi tệp (văn bản, video, hình ảnh) đều được lưu trữ dưới dạng nhị phân và được truyền tải dưới dạng nhị phân. Do đó, byte stream có thể truyền tải dữ liệu của bất kỳ loại tệp nào.

### Byte Output Stream (OutputStream)

`java.io.OutputStream` là lớp cha của **byte output stream**, chúng ta hãy xem một số phương thức chung mà nó định nghĩa:

1. `close()` : Đóng output stream này và giải phóng tài nguyên hệ thống liên quan đến stream này.

2. `flush()` : Xả output stream này và buộc các byte trong bộ đệm được ghi vào đích.

3. `write(byte[] b)` : Ghi b.length byte từ mảng byte đã cho vào output stream này.

4. `write(byte[] b, int off, int len)` : Ghi len byte từ mảng byte đã cho vào output stream này, bắt đầu từ vị trí offset off.

### Lớp FileOutputStream

`OutputStream` có nhiều lớp con, và chúng ta sẽ bắt đầu với một trong những lớp con đơn giản nhất là `FileOutputStream`. Như tên gọi, đây là một output stream tệp được sử dụng để ghi dữ liệu vào tệp.

#### **1) Các phương thức khởi tạo của FileOutputStream**

1. Sử dụng tên tệp để tạo đối tượng FileOutputStream.

```java
String fileName = "example.txt";
FileOutputStream fos = new FileOutputStream(fileName);
```

Đoạn mã trên tạo một đối tượng FileOutputStream với tên tệp là "example.txt". **Nếu tệp không tồn tại, nó sẽ tạo một tệp mới; nếu tệp đã tồn tại, nó sẽ ghi đè lên tệp hiện có**.

2. Sử dụng đối tượng File để tạo đối tượng FileOutputStream.

```java
File file = new File("example.txt");
FileOutputStream fos = new FileOutputStream(file);
```

Ví dụ về việc sử dụng FileOutputStream:

```java
FileOutputStream fos = null;
try {
  fos = new FileOutputStream("example.txt");
  fos.write("Tom".getBytes());
} catch (IOException e) {
  e.printStackTrace();
} finally {
  if (fos != null) {
    try {
      fos.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
```

Đoạn mã trên tạo một đối tượng FileOutputStream, ghi chuỗi "Tom" vào tệp "example.txt", và cuối cùng đóng output stream.

#### **2) Ghi dữ liệu byte với FileOutputStream**

Để ghi dữ liệu byte với FileOutputStream, chúng ta sử dụng chủ yếu các phương thức sau:

```java
write(int b)
write(byte[] b)
write(byte[] b, int off, int len)  // Ghi từ vị trí `off`, `len` byte
```

① **Ghi một byte**: Phương thức `write(int b)` ghi từng byte một, ví dụ như sau:

```java
// Tạo stream với tên file
FileOutputStream fos = new FileOutputStream("fos.txt");     
// Ghi dữ liệu
fos.write(97); // Byte thứ nhất
fos.write(98); // Byte thứ hai
fos.write(99); // Byte thứ ba
// Đóng stream
fos.close();
```

Ký tự 'a' có [giá trị ASCII](https://javabetter.cn/basic-extra-meal/java-unicode.html) là 97, 'b' là 98, 'c' là 99. Do đó, đoạn mã trên có thể được viết lại như sau:

```java
// Tạo stream với tên file
FileOutputStream fos = new FileOutputStream("fos.txt");     
// Ghi dữ liệu
fos.write('a'); // Byte thứ nhất
fos.write('b'); // Byte thứ hai
fos.write('c'); // Byte thứ ba
// Đóng stream
fos.close();
```

Phương thức `write(int b)` ghi từng byte một, với tham số `b` là giá trị nguyên của byte cần ghi. Mỗi byte chỉ có 8 bit, do đó giá trị của `b` phải nằm trong khoảng từ 0 đến 255. Giá trị ngoài khoảng này sẽ bị cắt bỏ. Ví dụ, nếu `b` là -1, nó sẽ bị cắt thành 255; nếu `b` là 256, nó sẽ bị cắt thành 0.

Khi ghi `b` vào output stream, phương thức `write(int b)` chỉ ghi 8 bit thấp của `b`, bỏ qua 24 bit cao. Điều này là do trong Java, các kiểu số nguyên (bao gồm byte, short, int, long) được biểu diễn dưới dạng bù hai nhị phân trong bộ nhớ. Khi chuyển một giá trị số nguyên cho phương thức `write(int b)`, phương thức này chỉ giữ lại 8 bit thấp của biểu diễn bù hai nhị phân, bỏ qua 24 bit cao.

Ví dụ, nếu giá trị cần ghi là 0x12345678, biểu diễn bù hai nhị phân là 0001 0010 0011 0100 0101 0110 0111 1000. Khi sử dụng phương thức `write(int b)` để ghi giá trị này, chỉ có 8 bit thấp 0111 1000 được ghi ra, bỏ qua 24 bit cao 0001 0010 0011 0100 0101 0110. Điều này là lý do tại sao 24 bit cao của tham số `b` bị bỏ qua.

0111 1000 là số nhị phân 8 bit, tương đương với số thập phân là 120, tương ứng với ký tự ASCII là "x". Trong bảng mã ASCII, giá trị ASCII thập phân của ký tự "x" là 120. Do đó, nếu sử dụng phương thức `write(int b)` để ghi một giá trị byte là 0x78 (tức là 120 thập phân), kết quả sẽ là ký tự "x".

Hãy xem ví dụ sau:

```java
FileOutputStream fos = null;
try {
    fos = new FileOutputStream("example.txt");

    fos.write(120);
    fos.write('x');
    fos.write(0x12345678);
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (fos != null) {
        try {
            fos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

Hãy xem kết quả:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240630181913.png)


Thật là có 3 ký tự 'x'.

② **Ghi một mảng byte**: Phương thức `write(byte[] b)` cho phép ghi toàn bộ mảng byte, ví dụ:

```java
// Tạo stream với tên file
FileOutputStream fos = new FileOutputStream("fos.txt");     
// Chuyển đổi chuỗi thành mảng byte
byte[] b = "Tom".getBytes();
// Ghi dữ liệu từ mảng byte
fos.write(b);
// Đóng stream
fos.close();
```

③ **Ghi một phần mảng byte chỉ định**: Phương thức `write(byte[] b, int off, int len)` cho phép ghi một phần mảng byte từ vị trí chỉ định, ví dụ:

```java
// Tạo stream với tên file
FileOutputStream fos = new FileOutputStream("fos.txt");     
// Chuyển đổi chuỗi thành mảng byte
byte[] b = "abcde".getBytes();
// Ghi 2 byte bắt đầu từ chỉ số 2 (tức là "cd")
fos.write(b, 2, 2);
// Đóng stream
fos.close();
```

#### **3) FileOutputStream thực hiện thêm dữ liệu, xuống dòng**

Trong các ví dụ mã trên, mỗi lần chạy chương trình sẽ tạo một đối tượng stream mới, dẫn đến dữ liệu trong tệp cũng bị xóa đi. Nếu muốn giữ lại dữ liệu hiện có trong tệp và tiếp tục **thêm dữ liệu mới**, chúng ta phải làm thế nào? Và làm thế nào để thực hiện **xuống dòng**?

Thực tế, điều này rất đơn giản.

Chúng ta học hai phương thức khác của `FileOutputStream`, như sau:

1. Sử dụng tên tệp và cờ thêm để tạo đối tượng FileOutputStream

```java
String fileName = "example.txt";
boolean append = true;
FileOutputStream fos = new FileOutputStream(fileName, append);
```

Đoạn mã trên sử dụng tên tệp "example.txt" và cờ thêm để tạo đối tượng FileOutputStream, thêm dữ liệu vào cuối tệp. Nếu tệp không tồn tại, nó sẽ tạo một tệp mới; nếu tệp đã tồn tại, nó sẽ thêm dữ liệu vào cuối tệp.

2. Sử dụng đối tượng tệp và cờ thêm để tạo đối tượng FileOutputStream

```java
File file = new File("example.txt");
boolean append = true;
FileOutputStream fos = new FileOutputStream(file, append);
```

Đoạn mã trên sử dụng đối tượng tệp và cờ thêm để tạo đối tượng FileOutputStream, thêm dữ liệu vào cuối tệp.

Cả hai phương thức khởi tạo này đều yêu cầu một giá trị boolean trong tham số thứ hai, `true` có nghĩa là thêm dữ liệu, `false` có nghĩa là không thêm (tức là xóa dữ liệu hiện có).

Để thực hiện thêm dữ liệu, bạn có thể sử dụng mã như sau:

```java
// Tạo stream với tên tệp
FileOutputStream fos = new FileOutputStream("fos.txt", true);     
// Chuyển đổi chuỗi thành mảng byte
byte[] b = "abcde".getBytes();
// Ghi dữ liệu từ mảng byte, sẽ thêm vào cuối tệp vì đã sử dụng cờ thêm
fos.write(b);
// Đóng stream
fos.close();
```

Chạy mã nhiều lần, bạn sẽ thấy dữ liệu được thêm vào liên tục.

Trong hệ điều hành Windows, ký tự xuống dòng là `\r\n`, mã trong mã là:

```java
String filename = "example.txt";
FileOutputStream fos = new FileOutputStream(filename, true);  // Chế độ thêm
String content = "Tom\r\n";  // Sử dụng kết hợp dấu xuống dòng và thêm dấu xuống dòng
fos.write(content.getBytes());
fos.close();
```

Trong macOS, ký tự xuống dòng là `\n`, mã trong mã là:

```java
String filename = "example.txt";
FileOutputStream fos = new FileOutputStream(filename, true);  // Chế độ thêm
String content = "Tom\n";  // Chỉ sử dụng dấu xuống dòng
fos.write(content.getBytes());
fos.close();
```

Nói thêm về ký tự xuống dòng và dấu xuống dòng.

Ký tự xuống dòng (`\r`) và dấu xuống dòng (`\n`) là các ký tự điều khiển phổ biến trên máy tính, dùng để chỉ định kết thúc dòng hoặc thực hiện việc xuống dòng. Cách sử dụng chúng có thể khác nhau trong các hệ điều hành và ngôn ngữ lập trình khác nhau.

Trên hệ điều hành Windows, thường sử dụng kết hợp dấu xuống dòng và dấu xuống dòng (`\r\n`) để kết thúc mỗi dòng. Trong tệp văn bản, mỗi dòng sẽ kết thúc bằng một kết hợp này. Điều này là do các máy in và thiết bị đầu cuối từng sử dụng kết hợp này để kết thúc dòng và thực hiện xuống dòng. Trên Windows, các công cụ chỉnh sửa văn bản và terminal cũng hỗ trợ sử dụng kết hợp dấu xuống dòng và dấu xuống dòng để kết thúc mỗi dòng.

Trong macOS và Linux, thường chỉ sử dụng dấu xuống dòng (`\n`) để kết thúc mỗi dòng. Trong tệp văn bản, mỗi dòng sẽ chỉ kết thúc bằng một dấu xuống dòng. Điều này là do các thiết bị đầu cuối Unix ban đầu chỉ cần dùng dấu xuống dòng để kết thúc dòng và thực hiện xuống dòng. Trên macOS và Linux, các công cụ chỉnh sửa văn bản và terminal cũng hỗ trợ việc sử dụng dấu xuống dòng để kết thúc mỗi dòng.

Trong các ngôn ngữ lập trình, thường cũng sử dụng dấu xuống dòng và dấu xuống dòng để thực hiện các hoạt động trên chuỗi. Ví dụ, trong Java, dấu xuống dòng có thể được biểu thị bằng "`\r`", và dấu xuống dòng có thể được biểu thị bằng "`\n`". Khi sử dụng input stream và xuất để đọc và ghi tệp, cũng cần chú ý đến cách sử dụng dấu xuống dòng và dấu xuống dòng và sự khác biệt giữa các hệ điều hành.

### Byte Input Stream (InputStream)

`java.io.InputStream` là lớp **cha** của **byte input stream**, chúng ta hãy xem qua một số phương thức chung của nó:

1. `close()` : Đóng input stream này và giải phóng tài nguyên hệ thống liên quan đến stream này.

2. `int read()` : Đọc byte tiếp theo từ input stream.

3. `read(byte[] b)` : Phương thức này trả về giá trị int biểu thị số byte đã đọc được, trả về số byte đã đọc nếu có, nếu không đọc được gì thì trả về -1.

### Lớp FileInputStream

InputStream có nhiều lớp con, chúng ta sẽ bắt đầu với lớp con đơn giản nhất là FileInputStream. Tên gợi ý rằng đây là input stream từ file, dùng để đọc dữ liệu từ file.

#### 1) Các phương thức khởi tạo của FileInputStream

1. `FileInputStream(String name)`: Tạo một đối tượng FileInputStream và mở file có tên được chỉ định để đọc. Tên file được chỉ định bởi tham số `name`. Nếu file không tồn tại, sẽ ném ra ngoại lệ FileNotFoundException.

2. `FileInputStream(File file)`: Tạo một đối tượng FileInputStream và mở file được biểu diễn bởi đối tượng File chỉ định để đọc.

Ví dụ mã như sau:

```java
// Tạo một đối tượng FileInputStream
FileInputStream fis = new FileInputStream("test.txt");

// Đọc nội dung của file
int data;
while ((data = fis.read()) != -1) {
    System.out.print((char) data);
}

// Đóng input stream
fis.close();
```

#### 2) Đọc dữ liệu byte bằng FileInputStream

① Đọc byte: Phương thức `read()` sẽ đọc một byte và trả về giá trị nguyên của byte đó. Nếu đã đọc đến cuối file, sẽ trả về -1. Nếu xảy ra lỗi trong quá trình đọc, sẽ ném ra ngoại lệ IOException.

Ví dụ mã như sau:

```java
// Tạo một đối tượng FileInputStream
FileInputStream fis = new FileInputStream("test.txt");

// Đọc nội dung của file
int data;
while ((data = fis.read()) != -1) {
    System.out.print((char) data);
}

// Đóng input stream
fis.close();
```

② Đọc bằng mảng byte: Phương thức `read(byte[] b)` sẽ đọc tối đa `b.length` byte từ stream và lưu chúng vào mảng đệm `b`.

Ví dụ mã như sau:

```java
// Tạo một đối tượng FileInputStream
FileInputStream fis = new FileInputStream("test.txt");

// Đọc nội dung của file vào mảng đệm
byte[] buffer = new byte[1024];
int count;
while ((count = fis.read(buffer)) != -1) {
    System.out.println(new String(buffer, 0, count));
}

// Đóng input stream
fis.close();
```

#### 3) Sao chép ảnh bằng byte stream FileInputStream

Nguyên lý rất đơn giản, là đọc thông tin ảnh vào byte stream nhập, sau đó dùng byte stream xuất để ghi vào file mới.

Ví dụ mã như sau:

```java
// Tạo một đối tượng FileInputStream để đọc file ảnh gốc
FileInputStream fis = new FileInputStream("original.jpg");

// Tạo một đối tượng FileOutputStream để ghi file ảnh sao chép
FileOutputStream fos = new FileOutputStream("copy.jpg");

// Tạo một mảng đệm để lưu trữ dữ liệu được đọc
byte[] buffer = new byte[1024];
int count;

// Đọc file ảnh gốc và ghi dữ liệu vào file ảnh sao chép
while ((count = fis.read(buffer)) != -1) {
    fos.write(buffer, 0, count);
}

// Đóng input stream và output stream
fis.close();
fos.close();
```

Mã trên tạo một FileInputStream để đọc file ảnh gốc và FileOutputStream để ghi dữ liệu vào file ảnh sao chép. Sau đó, sử dụng vòng lặp while để từng bước đọc byte từ file gốc và ghi vào file sao chép. Cuối cùng, đóng cả FileInputStream và FileOutputStream để giải phóng tài nguyên.

### Tóm tắt

InputStream là lớp trừu tượng của byte input stream, định nghĩa các phương thức để đọc dữ liệu byte như `read()`, `read(byte[] b)`, `read(byte[] b, int off, int len)` và nhiều phương thức khác. OutputStream là lớp trừu tượng của byte output stream, định nghĩa các phương thức để ghi dữ liệu byte như `write(int b)`, `write(byte[] b)`, `write(byte[] b, int off, int len)` và các phương thức khác. Cả hai lớp trừu tượng này là cơ sở của byte stream.

FileInputStream là lớp để đọc dữ liệu byte từ file, kế thừa từ InputStream. FileOutputStream là lớp để ghi dữ liệu byte vào file, kế thừa từ OutputStream. Cả hai lớp này là hai trong những lớp thực hiện phổ biến nhất của byte stream.