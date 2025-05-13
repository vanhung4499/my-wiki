---
title: Scanner
tags:
  - java
categories:
  - java
order: 1
---
# Scanner

Lớp Scanner của Java là một công cụ tiện ích để quét đầu vào từ bàn phím, mặc dù nó cũng có thể quét nội dung của tệp, nhưng chúng ta thường thích nó trong vai trò quét đầu vào từ bàn phím hơn, vì quét tệp có thể được thực hiện thông qua [File Stream](file.md).

Tiếp theo, chúng ta sẽ thảo luận về lớp Scanner thông qua một vài ví dụ đơn giản.

### 01. Quét Đầu Vào Từ Bàn Phím

Thông thường, chúng ta sẽ sử dụng lớp Scanner để quét đầu vào từ bàn phím, đặc biệt đối với những người mới học Java, điều này sẽ rất thú vị vì cuối cùng chúng ta cũng có thể nhận được dữ liệu mà chúng ta muốn nhập vào.

Hãy xem ví dụ dưới đây:

```java
Scanner scanner = new Scanner(System.in); // Tạo đối tượng Scanner, đọc dữ liệu từ đầu vào tiêu chuẩn
System.out.print("Vui lòng nhập một số nguyên: ");
int num = scanner.nextInt(); // Lấy số nguyên người dùng nhập vào
System.out.println("Số nguyên bạn đã nhập là: " + num);
scanner.nextLine(); // Đọc ký tự xuống dòng để tránh ảnh hưởng đến lần đọc tiếp theo
System.out.print("Vui lòng nhập một chuỗi: ");
String str = scanner.nextLine(); // Lấy chuỗi người dùng nhập vào
System.out.println("Chuỗi bạn đã nhập là: " + str);
scanner.close(); // Đóng đối tượng Scanner
```

Chạy chương trình, bạn có thể tương tác với bảng điều khiển, đối với người mới học, điều này sẽ khá thú vị.

Trong đó, System.in trả về một [Input Byte Stream](/programming/java/io/stream.html) InputStream, tương ứng với System.out.

#### 1. `nextLine`

Phương thức `nextLine()` sẽ quét các ký tự trong luồng đầu vào cho đến khi gặp ký tự xuống dòng `\n`, sau đó trả về nội dung của dòng đó dưới dạng một chuỗi. Đồng thời, `nextLine()` sẽ di chuyển vị trí của đối tượng Scanner đến đầu dòng tiếp theo để chuẩn bị cho lần đọc tiếp theo.

```java
Scanner scanner = new Scanner(System.in); // Tạo đối tượng Scanner, đọc dữ liệu từ đầu vào tiêu chuẩn
System.out.println("Vui lòng nhập nhiều dòng văn bản, kết thúc bằng một dòng trống:");
StringBuilder sb = new StringBuilder(); // Tạo đối tượng StringBuilder để lưu trữ văn bản được đọc
String line = scanner.nextLine(); // Đọc dòng đầu tiên từ luồng đầu vào
while (!line.isEmpty()) { // Nếu dòng đọc được không rỗng, tiếp tục đọc dòng tiếp theo
    sb.append(line).append("\n"); // Thêm nội dung của dòng hiện tại vào đối tượng StringBuilder và xuống dòng
    line = scanner.nextLine(); // Đọc dòng tiếp theo
}
System.out.println("Văn bản bạn đã nhập là:\n" + sb.toString()); // In ra văn bản đã đọc
scanner.close(); // Đóng đối tượng Scanner
```

#### 2. `nextInt`

`nextInt()` dùng để đọc số nguyên tiếp theo từ luồng đầu vào và trả về giá trị đó. Nếu trong luồng đầu vào không có số nguyên, hoặc không phải là số nguyên, sẽ ném ra ngoại lệ InputMismatchException.
#### 3. Các Phương Thức Khác

Ngoài hai phương thức thường dùng ở trên, lớp Scanner còn có một số phương thức khác:

- `boolean hasNext()`: Kiểm tra xem luồng đầu vào có phần tử tiếp theo không.
- `boolean hasNextLine()`: Kiểm tra xem luồng đầu vào có dòng tiếp theo không.
- `String next()`: Đọc phần tử tiếp theo trong luồng đầu vào (sử dụng dấu phân cách mặc định, thường là dấu cách hoặc ký tự xuống dòng).
- `double nextDouble()`: Đọc số thực tiếp theo trong luồng đầu vào.

Dưới đây là một ví dụ demo.

```java
Scanner scanner = new Scanner(System.in); // Tạo đối tượng Scanner, đọc dữ liệu từ đầu vào tiêu chuẩn
System.out.print("Vui lòng nhập một số nguyên: ");
if (scanner.hasNextInt()) { // Kiểm tra xem luồng đầu vào có số nguyên tiếp theo không
    int num = scanner.nextInt(); // Đọc số nguyên tiếp theo từ luồng đầu vào
    System.out.println("Số nguyên bạn đã nhập là: " + num);
} else {
    System.out.println("Không phải là số nguyên!");
}
scanner.nextLine(); // Đọc ký tự xuống dòng từ luồng đầu vào

System.out.print("Vui lòng nhập nhiều từ, cách nhau bằng dấu cách: ");
while (scanner.hasNext()) { // Kiểm tra xem luồng đầu vào có phần tử tiếp theo không
    String word = scanner.next(); // Đọc từ tiếp theo từ luồng đầu vào
    System.out.println("Từ bạn đã nhập là: " + word);
}
scanner.nextLine(); // Đọc ký tự xuống dòng từ luồng đầu vào

System.out.print("Vui lòng nhập một số thực: ");
if (scanner.hasNextDouble()) { // Kiểm tra xem luồng đầu vào có số thực tiếp theo không
    double num = scanner.nextDouble(); // Đọc số thực tiếp theo từ luồng đầu vào
    System.out.println("Số thực bạn đã nhập là: " + num);
} else {
    System.out.println("Không phải là số thực!");
}
scanner.nextLine(); // Đọc ký tự xuống dòng từ luồng đầu vào

System.out.print("Vui lòng nhập một chuỗi: ");
if (scanner.hasNextLine()) { // Kiểm tra xem luồng đầu vào có dòng tiếp theo không
    String line = scanner.nextLine(); // Đọc dòng tiếp theo từ luồng đầu vào
    System.out.println("Chuỗi bạn đã nhập là: " + line);
} else {
    System.out.println("Không phải là chuỗi!");
}
scanner.close(); // Đóng đối tượng Scanner
```

### 02. Quét Tập Tin

Tất nhiên, Scanner cũng có thể được sử dụng để quét tập tin, và cách thực hiện cũng rất đơn giản. Dưới đây là ví dụ mã:

```java
try {
    // Tạo đối tượng File, đại diện cho tập tin cần quét
    File file = new File("docs/abcd.md");
    Scanner scanner = new Scanner(file); // Tạo đối tượng Scanner, đọc dữ liệu từ tập tin
    while (scanner.hasNextLine()) { // Kiểm tra tập tin có dòng tiếp theo hay không
        String line = scanner.nextLine(); // Đọc dòng tiếp theo từ tập tin
        System.out.println(line); // In ra dòng đã đọc
    }
    scanner.close(); // Đóng đối tượng Scanner
} catch (FileNotFoundException e) {
    System.out.println("Tập tin không tồn tại!");
}
```

Trong ví dụ trên, đầu tiên chúng ta tạo một đối tượng File, đại diện cho tập tin cần quét. Sau đó, chúng ta sử dụng phương thức khởi tạo của lớp Scanner để tạo đối tượng Scanner, truyền tập tin vào làm tham số cho phương thức khởi tạo. Trong vòng lặp while, chúng ta sử dụng phương thức `hasNextLine()` để kiểm tra xem tập tin có dòng tiếp theo không, nếu có, sử dụng phương thức `nextLine()` để đọc chuỗi của dòng đó và sử dụng phương thức `println()` để in ra. Cuối cùng, trước khi kết thúc chương trình, chúng ta sử dụng phương thức `close()` để đóng đối tượng Scanner.

Ngoài việc sử dụng vòng lặp + nextLine, chúng ta còn có thể sử dụng phương thức `useDelimiter` để đặt dấu kết thúc tập tin là `\Z` để đọc toàn bộ tập tin.

```java
// Tạo đối tượng File, đại diện cho tập tin cần quét
Scanner scanner = new Scanner(new File("docs/abcd.md")); // Tạo đối tượng Scanner, đọc dữ liệu từ tập tin
scanner.useDelimiter("\\Z"); // Đặt dấu phân cách là kết thúc tập tin
if (scanner.hasNext()) { // Kiểm tra tập tin có dòng tiếp theo hay không
    String content = scanner.next(); // Đọc dòng tiếp theo từ tập tin
    System.out.println(content); // In ra dòng đã đọc
}
scanner.close(); // Đóng đối tượng Scanner
```

Trong biểu thức chính quy, `\Z` biểu thị kết thúc của đầu vào, tức là dấu kết thúc tập tin. Trong lớp Scanner, chúng ta có thể sử dụng `\Z` làm dấu phân cách để đọc toàn bộ nội dung của tập tin.

### 03. Tìm Kiếm Mục Khớp

Ngoài việc quét đầu vào từ bàn phím và tập tin như đã đề cập ở trên, Scanner còn cung cấp bốn phương thức khác bắt đầu với find để tìm kiếm mục khớp:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240704192731.png)


Hãy xem ví dụ dưới đây:

```java
String input = "good good study, day day up.";
Scanner scanner = new Scanner(input);
String result;

// Sử dụng phương thức findInLine() để tìm kiếm từ trong chuỗi
result = scanner.findInLine("study");
System.out.println("findInLine(): " + result); // In ra "study"

// Sử dụng phương thức findWithinHorizon() để tìm kiếm từ trong chuỗi
scanner = new Scanner(input);
result = scanner.findWithinHorizon("study", 20);
System.out.println("findWithinHorizon(): " + result); // In ra "study"

scanner.close(); // Đóng đối tượng Scanner
```

Trong ví dụ trên, đầu tiên chúng ta tạo một chuỗi input, đại diện cho văn bản cần tìm kiếm. Sau đó, chúng ta sử dụng phương thức khởi tạo của lớp Scanner để tạo đối tượng Scanner và truyền input vào làm luồng đầu vào. Tiếp theo, chúng ta sử dụng phương thức `findInLine()` và `findWithinHorizon()` để tìm kiếm từ "study" trong chuỗi. Trong đó, phương thức `findInLine()` tìm kiếm mục khớp trong dòng hiện tại, còn phương thức `findWithinHorizon()` tìm kiếm mục khớp trong phạm vi giới hạn được chỉ định. Trong ví dụ này, chúng ta giới hạn phạm vi tìm kiếm là 20 ký tự đầu tiên.

Cần lưu ý rằng, phương thức `findInLine()` và `findWithinHorizon()` đều trả về mục khớp tìm được. Nếu không tìm thấy mục khớp, sẽ trả về null. Ngoài ra, phương thức `findInLine()` và `findWithinHorizon()` đều bỏ qua dấu phân cách mặc định, vì vậy cần sử dụng biểu thức chính quy để chỉ định mẫu tìm kiếm. Trong ví dụ này, chúng ta sử dụng chuỗi "study" làm mẫu tìm kiếm.

Tất nhiên, chúng ta cũng có thể sử dụng biểu thức chính quy, ví dụ như chúng ta cần tìm từ khóa openjdk trong tập tin dưới đây.

```md
## jdk install

### ubuntu

`apt install openjdk-8-jdk`

### centos

`yum install openjdk-8-jdk`

```

Mã có thể viết như sau:

```java
// Tạo đối tượng File, đại diện cho tập tin cần quét
Scanner scanner = new Scanner(new File("docs/abcd.md")); // Tạo đối tượng Scanner, đọc dữ liệu từ tập tin
Pattern pattern = Pattern.compile("op..jdk");
String result;
while ((result = scanner.findWithinHorizon(pattern, 0)) != null) {
    System.out.println("findWithinHorizon(): " + result);
}
```

Chúng ta sử dụng biểu thức chính quy pattern để biểu diễn từ khóa `openjdk`, trong đó `op..jdk` có `.` biểu thị bất kỳ ký tự nào. Bạn có thể tìm hiểu thêm về biểu thức chính quy để biết thêm chi tiết.

Sau đó, chúng ta sử dụng vòng lặp while để tìm tất cả các mục `openjdk` trong tập tin, trong đó tham số thứ hai của phương thức findWithinHorizon nếu là 0 sẽ biểu thị bỏ qua giới hạn. Nếu không tìm thấy, sẽ trả về null.

Vì trong tập tin có hai từ khóa openjdk, nên kết quả đầu ra sẽ như sau:

```text
findWithinHorizon(): openjdk
findWithinHorizon(): openjdk
```

### 04. Tóm Tắt

Tóm lại, lớp Scanner là một công cụ mạnh mẽ để xử lý đầu vào, không chỉ có thể quét đầu vào từ bàn phím mà còn có thể quét tập tin và cung cấp nhiều phương thức để đọc các loại dữ liệu khác nhau như `next()`, `nextInt()`, `nextLine()`, `nextDouble()`.

Ngoài ra, còn có thể sử dụng phương thức `useDelimiter()` để đặt dấu phân cách, sử dụng `findInLine()`, `findWithinHorizon()` để tìm kiếm mục khớp, v.v.