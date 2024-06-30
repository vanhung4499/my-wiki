---
title: File Stream
tags:
  - java
categories:
  - java
order: 2
---
# File Stream

Trong các hoạt động IO, việc làm việc với tệp là phần phức tạp nhưng cũng là phần được sử dụng nhiều nhất, hầu hết các dự án của chúng ta đều có một lớp tiện ích gọi là FileUtil hoặc FileUtils.

Lớp `java.io.File` là lớp đặc biệt để thao tác với tệp, chú ý rằng chỉ có thể thao tác với chính tệp, không thể thao tác với nội dung của tệp, để làm việc với nội dung, cần sử dụng luồng vào ra.

Lớp `File` là một biểu diễn trừu tượng của tệp và thư mục, chủ yếu được sử dụng cho các hoạt động như tạo, tìm kiếm và xóa tệp và thư mục.

Làm sao để hiểu hai câu trên? Thực ra rất đơn giản!

Câu đầu tiên nói rằng `File` không liên quan đến stream, lớp `File` không thể đọc và ghi tệp, nghĩa là không thể nhập và xuất dữ liệu!

Câu thứ hai nói rằng `File` có thể đại diện cho `D:\\folder1` và `D:\\folder1\\file.txt`, phần trước là thư mục (Directory) và phần sau là tệp (file), lớp `File` được sử dụng để thao tác với cả hai.

### Các phương thức khởi tạo của lớp File

Trong Java, mọi thứ đều là đối tượng và lớp File cũng không ngoại lệ. Bất kể là đối tượng nào cũng nên bắt đầu từ phương thức khởi tạo của đối tượng đó, vậy nên chúng ta hãy cùng phân tích các phương thức khởi tạo của lớp `File`.

Có ba phương thức khởi tạo thường được sử dụng:

1. `File(String pathname)`: Tạo một đối tượng File mới từ đường dẫn được chỉ định.

2. `File(String parent, String child)`: Tạo một đối tượng File mới từ đường dẫn của thư mục cha (dưới dạng chuỗi) và tên tệp con.

3. `File(File parent, String child)`: Tạo một đối tượng File mới từ thư mục cha (dưới dạng đối tượng File) và tên tệp con.

Để hiểu rõ hơn, hãy xem ví dụ sau đây:

```java
// Đường dẫn tệp tin
String path = "/Users/username/123.txt";
File file1 = new File(path);

// Đường dẫn tệp tin khác
String path2 = "/Users/username/1/2.txt";
File file2 = new File(path2);

// Tạo từ thư mục cha và tên tệp con
String parent = "/Users/username/aaa";
String child = "bbb.txt";
File file3 = new File(parent, child);

// Tạo từ đối tượng thư mục cha và tên tệp con
File parentDir = new File("/Users/username/aaa");
String child2 = "bbb.txt";
File file4 = new File(parentDir, child2);
```

Lưu ý rằng trên macOS, dấu gạch chéo xuôi (`/`) được sử dụng làm ký tự phân cách trong đường dẫn, trong khi trên Windows, dấu gạch chéo ngược (`\`) được sử dụng. Vì vậy, khi xử lý đường dẫn, không nên sử dụng trực tiếp `/` hoặc `\`.

Trong Java, bạn có thể sử dụng `File.separator` để lấy ký tự phân cách đường dẫn, điều này sẽ tự động trả về ký tự phân cách đúng dựa trên hệ điều hành đang sử dụng.

Những điểm cần chú ý về lớp File:

1. Một đối tượng File đại diện cho một tệp hoặc thư mục thực tế trên đĩa cứng.
2. Phương thức khởi tạo của lớp File không kiểm tra xem tệp hoặc thư mục có tồn tại thực sự hay không, vì vậy việc có hay không một tệp hoặc thư mục trong đường dẫn không ảnh hưởng đến việc tạo đối tượng File.

### Các phương thức thông dụng của lớp File

Các phương thức thông dụng của lớp File chủ yếu bao gồm các phương thức để lấy thông tin, lấy đường dẫn tuyệt đối và tương đối, kiểm tra và tạo/xóa tệp tin.

#### **1) Các phương thức để lấy thông tin**

1. `getAbsolutePath()`: Trả về đường dẫn tuyệt đối của đối tượng File.

2. `getPath()`: Trả về đường dẫn của đối tượng File. Kết quả giống như `getAbsolutePath()`.

3. `getName()`: Trả về tên của tệp tin hoặc thư mục.

4. `length()`: Trả về độ dài của tệp tin, tính bằng byte.

Đoạn mã kiểm tra sau đây dùng để thử nghiệm (chú ý thay đổi các đường dẫn theo máy tính của bạn):

```java
File f = new File("/Users/username/aaa/bbb.java");
System.out.println("Đường dẫn tuyệt đối của tệp tin: " + f.getAbsolutePath());
System.out.println("Đường dẫn được tạo: " + f.getPath());
System.out.println("Tên của tệp tin: " + f.getName());
System.out.println("Độ dài của tệp tin: " + f.length() + " byte");

File f2 = new File("/Users/username/aaa");
System.out.println("Đường dẫn tuyệt đối của thư mục: " + f2.getAbsolutePath());
System.out.println("Đường dẫn được tạo: " + f2.getPath());
System.out.println("Tên của thư mục: " + f2.getName());
// Khi đối tượng File đại diện cho một thư mục, phương thức length() không có ý nghĩa
```

#### **2) Đường dẫn tuyệt đối và tương đối**

Đường dẫn tuyệt đối là đường dẫn đầy đủ bắt đầu từ gốc của hệ thống tệp tin, mô tả vị trí chính xác của một tệp tin hoặc thư mục trong hệ thống tệp tin. Trên Windows, đường dẫn tuyệt đối thường bắt đầu với ổ đĩa (ví dụ: "`C:\Program Files\Java\jdk1.8.0_291\bin\java.exe`"). Trên macOS và Linux, đường dẫn tuyệt đối thường bắt đầu với dấu gạch chéo (`/`), ví dụ: "`/usr/local/bin/python3`".

Đường dẫn tương đối là đường dẫn dựa trên thư mục làm việc hiện tại, mô tả mối quan hệ giữa một tệp tin hoặc thư mục và thư mục làm việc hiện tại. Trong Java, đường dẫn tương đối thường được tính từ thư mục chứa chương trình Java hiện tại. Ví dụ: "`config/config.properties`" nếu thư mục làm việc hiện tại là "`/Users/username/project`", thì đường dẫn tương đối sẽ là "`/Users/username/project/config/config.properties`".

Lưu ý:

- Trên hệ điều hành Windows, hệ thống tệp tin mặc định không phân biệt chữ hoa chữ thường, nghĩa là tên tệp và đường dẫn có thể sử dụng cả chữ hoa và chữ thường. Ví dụ: "`C:\Users\username\Documents\example.txt`" và "`C:\Users\Username\Documents\Example.txt`" đều chỉ cùng một tệp. Tuy nhiên, Windows cung cấp một tùy chọn phân biệt chữ hoa chữ thường có thể được kích hoạt khi định dạng ổ đĩa.
- Trên hệ điều hành macOS và Linux (Unix), hệ thống tệp mặc định là phân biệt chữ hoa chữ thường. Ví dụ: Trong macOS, "`/Users/username/Documents/example.txt`" và "`/Users/username/Documents/Example.txt`" là hai tệp khác nhau.

```java
// Ví dụ về đường dẫn tuyệt đối
File absoluteFile = new File("/Users/username/example/test.txt");
System.out.println("Đường dẫn tuyệt đối: " + absoluteFile.getAbsolutePath());

// Ví dụ về đường dẫn tương đối
File relativeFile = new File("example/test.txt");
System.out.println("Đường dẫn tương đối: " + relativeFile.getPath());
```

Thông qua những ví dụ này, bạn có thể hiểu rõ hơn về cách sử dụng các phương thức của lớp `File` trong Java để làm việc với tệp tin và thư mục.

#### **3）Các phương thức để kiểm tra**

1. `exists()` ：Kiểm tra xem tệp tin hoặc thư mục có tồn tại không.

2. `isDirectory()` ：Kiểm tra xem đối tượng có phải là thư mục không.

3. `isFile()` ：Kiểm tra xem đối tượng có phải là tệp tin không.

Đoạn mã minh họa như sau:

```java
File file = new File("/Users/username/example");

// Kiểm tra xem tệp tin hoặc thư mục có tồn tại không
if (file.exists()) {
    System.out.println("Tệp tin hoặc thư mục tồn tại");
} else {
    System.out.println("Tệp tin hoặc thư mục không tồn tại");
}

// Kiểm tra xem đối tượng có phải là thư mục không
if (file.isDirectory()) {
    System.out.println("Đây là một thư mục");
} else {
    System.out.println("Đây không phải là một thư mục");
}

// Kiểm tra xem đối tượng có phải là tệp tin không
if (file.isFile()) {
    System.out.println("Đây là một tệp tin");
} else {
    System.out.println("Đây không phải là một tệp tin");
}
```

#### **4）Các phương thức để tạo và xóa**

- `createNewFile()` ：Nếu tệp tin chưa tồn tại, tạo một tệp tin mới trống và trả về `true`; nếu tệp tin đã tồn tại, không tạo mới và trả về `false`.
- `delete()` ：Xóa tệp tin hoặc thư mục. Nếu là thư mục, chỉ có thể xóa nếu thư mục đó trống.
- `mkdir()` ：Chỉ có thể tạo một thư mục cấp độ một. Nếu thư mục cha không tồn tại, thao tác tạo thất bại. Trả về `true` nếu tạo thành công, trả về `false` nếu thất bại.
- `mkdirs()` ：Có thể tạo nhiều cấp thư mục. Nếu thư mục cha không tồn tại, sẽ được tạo kèm theo. Trả về `true` nếu tạo thành công hoặc thư mục đã tồn tại, trả về `false` nếu thất bại.

**Trong phát triển thường sử dụng** `mkdirs()`.

Đoạn mã thử nghiệm như sau:

```java
// Tạo tệp tin mới
File file = new File("/Users/username/example/test.txt");
if (file.createNewFile()) {
    System.out.println("Tạo tệp tin thành công: " + file.getAbsolutePath());
} else {
    System.out.println("Tạo tệp tin thất bại: " + file.getAbsolutePath());
}

// Xóa tệp tin
if (file.delete()) {
    System.out.println("Xóa tệp tin thành công: " + file.getAbsolutePath());
} else {
    System.out.println("Xóa tệp tin thất bại: " + file.getAbsolutePath());
}

// Tạo nhiều cấp thư mục
File directory = new File("/Users/username/example/subdir1/subdir2");
if (directory.mkdirs()) {
    System.out.println("Tạo thư mục thành công: " + directory.getAbsolutePath());
} else {
    System.out.println("Tạo thư mục thất bại: " + directory.getAbsolutePath());
}
```

#### 5）Duyệt thư mục

- `String[] list()` ：Trả về một mảng String, biểu diễn tất cả các tệp con hoặc thư mục trong thư mục File này.
- `File[] listFiles()` ：Trả về một mảng File, biểu diễn tất cả các tệp con hoặc thư mục trong thư mục File này.

```java
File directory = new File("/Users/itwanger/Documents/Github/paicoding");

// Liệt kê tên các tệp trong thư mục
String[] files = directory.list();
System.out.println("Tên các tệp trong thư mục:");
for (String file : files) {
    System.out.println(file);
}

// Liệt kê các tệp và thư mục con trong thư mục
File[] filesAndDirs = directory.listFiles();
System.out.println("Các tệp và thư mục con trong thư mục:");
for (File fileOrDir : filesAndDirs) {
    if (fileOrDir.isFile()) {
        System.out.println("Tệp tin: " + fileOrDir.getName());
    } else if (fileOrDir.isDirectory()) {
        System.out.println("Thư mục: " + fileOrDir.getName());
    }
}
```

**Lưu ý:** Để sử dụng `listFiles()` để lấy danh sách các tệp hoặc thư mục con của một thư mục cụ thể, hai điều kiện sau phải được đảm bảo:

1. Thư mục đã chỉ định phải tồn tại.
2. Thư mục đã chỉ định phải là một thư mục. Nếu không, có thể dẫn đến ngoại lệ NullPointerException.

#### 6）Duyệt đệ quy

Không cần nói nhiều, hãy xem ngay đoạn mã sau:

```java
public static void main(String[] args) {
    File directory = new File("/Users/hnv99/Documents/Github");

    // Duyệt đệ quy các tệp và thư mục con trong thư mục
    traverseDirectory(directory);
}

public static void traverseDirectory(File directory) {
    // Liệt kê tất cả các tệp và thư mục con trong thư mục
    File[] filesAndDirs = directory.listFiles();

    // Duyệt qua từng tệp và thư mục con
    for (File fileOrDir : filesAndDirs) {
        if (fileOrDir.isFile()) {
            // Nếu là tệp tin, xuất ra tên tệp tin
            System.out.println("Tệp tin: " + fileOrDir.getName());
        } else if (fileOrDir.isDirectory()) {
            // Nếu là thư mục, duyệt đệ quy vào thư mục con
            System.out.println("Thư mục: " + fileOrDir.getName());
            traverseDirectory(fileOrDir);
        }
    }
}
```


### RandomAccessFile

RandomAccessFile là một lớp rất đặc biệt trong Java, nó không chỉ được sử dụng để đọc file mà còn để ghi file. Khác với các lớp IO khác như FileInputStream và FileOutputStream, RandomAccessFile cho phép bạn nhảy đến bất kỳ vị trí nào trong file và bắt đầu đọc hoặc ghi từ đó. Điều này làm cho nó rất phù hợp cho các tình huống cần truy cập dữ liệu ngẫu nhiên trong file, chẳng hạn như hệ thống cơ sở dữ liệu.

Dưới đây là một ví dụ về việc sử dụng RandomAccessFile để ghi và đọc file:

```java
import java.io.IOException;
import java.io.RandomAccessFile;

public class RandomAccessFileDemo {

    public static void main(String[] args) {
        String filePath = "logs/java/abc.txt";

        try {
            // Sử dụng RandomAccessFile để ghi file
            writeToFile(filePath, "Hello, world!");

            // Sử dụng RandomAccessFile để đọc file
            String content = readFromFile(filePath);
            System.out.println("Nội dung file: " + content);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void writeToFile(String filePath, String content) throws IOException {
        try (RandomAccessFile randomAccessFile = new RandomAccessFile(filePath, "rw")) {
            // Di chuyển con trỏ file tới cuối file (để nối thêm nội dung)
            randomAccessFile.seek(randomAccessFile.length());

            // Ghi nội dung
            randomAccessFile.writeUTF(content);
        }
    }

    private static String readFromFile(String filePath) throws IOException {
        StringBuilder content = new StringBuilder();

        try (RandomAccessFile randomAccessFile = new RandomAccessFile(filePath, "r")) {
            // Di chuyển con trỏ file tới đầu file (để đọc từ đầu)
            randomAccessFile.seek(0);

            content.append(randomAccessFile.readUTF());
        }

        return content.toString();
    }
}
```

Để tránh vấn đề lỗi font chữ tiếng Trung, chúng ta sử dụng các phương thức writeUTF và readUTF của RandomAccessFile, các phương thức này xử lý chuỗi sử dụng mã hóa UTF-8. Bạn có thể tự chạy đoạn mã này để trải nghiệm.

Tiếp theo, chúng ta sẽ đi vào chi tiết về các phương thức khởi tạo và các phương thức phổ biến của RandomAccessFile.

#### Các phương thức khởi tạo

RandomAccessFile chủ yếu có hai phương thức khởi tạo:

- `RandomAccessFile(File file, String mode)`：Tạo một instance mới của RandomAccessFile sử dụng file object và mode truy cập cho trước.
- `RandomAccessFile(String name, String mode)`：Tạo một instance mới của RandomAccessFile sử dụng tên file và mode truy cập cho trước.

Giá trị của mode có thể là:

- "r"：Mở file chỉ để đọc. Bất kỳ phương thức ghi nào cũng sẽ dẫn đến IOException.
- "rw"：Mở file để đọc và ghi. Nếu file không tồn tại, nó sẽ được tạo ra.
- "rws"：Mở file để đọc và ghi, yêu cầu mọi cập nhật nội dung hoặc siêu dữ liệu được ghi ngay lập tức xuống thiết bị lưu trữ dưới. Mode này đồng bộ và đảm bảo không mất dữ liệu trong trường hợp hệ thống sập.
- "rwd"：Tương tự như "rws", mở file để đọc và ghi, nhưng yêu cầu chỉ ghi nội dung của file ngay lập tức. Siêu dữ liệu có thể được ghi trễ.

#### Các phương thức chính

- `long getFilePointer()`：Trả về vị trí hiện tại của con trỏ file.
- `long length()`：Trả về độ dài của file.
- `int read()`：Đọc một byte từ file.
- `int read(byte[] b)`：Đọc dữ liệu byte từ file và lưu vào mảng byte chỉ định.
- `int read(byte[] b, int off, int len)`：Đọc dữ liệu byte từ file và lưu vào mảng byte chỉ định, bắt đầu từ vị trí off và tối đa len byte.
- `String readLine()`：Đọc một dòng văn bản từ file.
- `readUTF()`：Đọc một chuỗi mã hóa UTF-8 từ file. Phương thức này trước tiên đọc hai byte cho thông tin độ dài, sau đó đọc dữ liệu byte UTF-8 dựa trên độ dài này và chuyển đổi chúng thành chuỗi Java. Điều này có nghĩa là khi sử dụng readUTF để đọc chuỗi, bạn cần đảm bảo rằng chuỗi trong file đã được ghi bằng writeUTF, để thông tin về độ dài và mã hóa được giữ nguyên.
- `void seek(long pos)`：Di chuyển con trỏ file đến vị trí pos trong file.
- `void write(byte[] b)`：Ghi tất cả byte của mảng byte chỉ định vào file.
- `void write(byte[] b, int off, int len)`：Ghi len byte từ mảng byte chỉ định vào file, bắt đầu từ vị trí off.
- `void write(int b)`：Ghi byte chỉ định vào file.
- `writeUTF(String str)`：Ghi một chuỗi mã hóa UTF-8 vào file. Phương thức này trước tiên ghi hai byte cho độ dài chuỗi UTF-8, sau đó ghi dữ liệu byte UTF-8 của chuỗi. Do đó, khi sử dụng writeUTF để ghi chuỗi, số byte thực tế được ghi sẽ nhiều hơn độ dài byte UTF-8 của chuỗi. Hai byte này được sử dụng để xác định độ dài chuỗi chính xác khi đọc.

Hãy xem thêm ví dụ sau, kết hợp với những gì đã được trình bày, bạn sẽ hoàn toàn nắm vững về RandomAccessFile.

```java
File file = new File("logs/java/abc.txt");

try (RandomAccessFile raf = new RandomAccessFile(file, "rw")) {
    // Ghi vào file
    raf.writeUTF("Hello, world!");

    // Di chuyển con trỏ file về đầu file
    raf.seek(0);

    // Đọc nội dung từ file
    String content = raf.readUTF();
    System.out.println("Nội dung: " + content);

} catch (IOException e) {
    e.printStackTrace();
}
```

Trong ví dụ này, chúng ta đầu tiên tạo một đối tượng file có tên là itwanger.txt. Sau đó, chúng ta sử dụng RandomAccessFile để mở file này ở chế độ đọc ghi.

Tiếp theo, chúng ta sử dụng phương thức writeUTF để ghi chuỗi "Hello, world!" vào file. Sau đó, chúng ta sử dụng seek để di chuyển con trỏ file về đầu file và sử dụng readUTF để đọc nội dung của file. Kết quả đầu ra sẽ là "Hello, world!".

Cuối cùng, chúng ta sử dụng câu lệnh try-with-resources để đảm bảo rằng RandomAccessFile sẽ được đóng đúng cách sau khi hoàn thành các thao tác.

### Apache FileUtils Class

Lớp FileUtils là một lớp trong thư viện Apache Commons IO, cung cấp một số phương thức tiện ích để thao tác với các tệp và thư mục.

#### **1）Sao chép tệp hoặc thư mục:**

```java
File srcFile = new File("đường/dẫn/đến/tệp/nguồn");
File destFile = new File("đường/dẫn/đến/tệp/đích");
// Sao chép tệp
FileUtils.copyFile(srcFile, destFile);
// Sao chép thư mục
FileUtils.copyDirectory(srcFile, destFile);
```

#### **2）Xóa tệp hoặc thư mục:**

```java
File file = new File("đường/dẫn/đến/tệp/hoặc/thư/mục");
// Xóa tệp hoặc thư mục
FileUtils.delete(file);
```

Cần lưu ý rằng, để xóa một thư mục không trống, bạn cần xóa tất cả các tệp và thư mục con trước.

#### **3）Di chuyển tệp hoặc thư mục:**

```java
File srcFile = new File("đường/dẫn/đến/tệp/nguồn");
File destFile = new File("đường/dẫn/đến/tệp/đích");
// Di chuyển tệp hoặc thư mục
FileUtils.moveFile(srcFile, destFile);
```

#### **4）Truy vấn thông tin về tệp hoặc thư mục:**

```java
File file = new File("đường/dẫn/đến/tệp/hoặc/thư/mục");
// Lấy thời gian sửa đổi của tệp hoặc thư mục
Date modifyTime = FileUtils.lastModified(file);
// Lấy kích thước của tệp hoặc thư mục
long size = FileUtils.sizeOf(file);
// Lấy phần mở rộng của tên tệp hoặc thư mục
String extension = FileUtils.getExtension(file.getName());
```

Đó là một số phương thức quan trọng trong lớp FileUtils mà bạn có thể sử dụng để thực hiện các thao tác thường gặp khi làm việc với tệp và thư mục trong Java.

### Lớp FileUtil trong Hutool

Lớp FileUtil là một công cụ thao tác tệp trong gói công cụ [Hutool](https://hutool.cn), cung cấp một loạt các phương thức đơn giản và dễ sử dụng để thực hiện các nhiệm vụ liên quan đến tệp trong Java.

Lớp FileUtil bao gồm các loại công cụ thao tác sau:

- Thao tác với tệp: bao gồm tạo mới, xóa, sao chép, di chuyển, đổi tên thư mục và tệp.
- Kiểm tra tệp: kiểm tra xem tệp hoặc thư mục có trống không, có phải là thư mục, là tệp hay không.
- Đường dẫn tuyệt đối: chuyển đổi tệp từ ClassPath thành tệp đường dẫn tuyệt đối.
- Tên tệp: lấy tên chính của tệp, phần mở rộng của tệp.
- Thao tác đọc: bao gồm đọc đối tượng Reader, đọc các phương thức đa dạng.
- Thao tác ghi: bao gồm lấy Writer, các phương thức ghi đa dạng.

Dưới đây là một số phương thức phổ biến trong lớp FileUtil:

1. **copyFile**: Sao chép tệp. Phương thức này sao chép tệp nguồn đã chỉ định vào tệp đích đã chỉ định.

```java
File dest = FileUtil.file("FileUtilDemo2.java");
FileUtil.copyFile(file, dest);
```

2. **move**: Di chuyển tệp hoặc thư mục. Phương thức này di chuyển tệp hoặc thư mục nguồn đã chỉ định đến tệp hoặc thư mục đích đã chỉ định.

```java
FileUtil.move(file, dest, true);
```

3. **del**: Xóa tệp hoặc thư mục. Phương thức này xóa tệp hoặc thư mục đã chỉ định, nếu không tồn tại thì ném ra ngoại lệ.

```java
FileUtil.del(file);
```

4. **rename**: Đổi tên tệp hoặc thư mục. Phương thức này đổi tên tệp hoặc thư mục đã chỉ định thành tên mới đã chỉ định.

```java
FileUtil.rename(file, "FileUtilDemo3.java", true);
```

5. **readLines**: Đọc từng dòng dữ liệu từ tệp.

```java
FileUtil.readLines(file, "UTF-8").forEach(System.out::println);
```

Hãy khám phá thêm nhiều phương thức hữu ích khác trong mã nguồn của Hutool, đây là những công cụ sẽ giúp nâng cao khả năng lập trình của bạn.
