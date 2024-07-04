---
title: Print Stream
tags:
  - java
categories:
  - java
order: 10
---
# Print Stream

Trong sự nghiệp của tôi, tần suất sử dụng `System.out.println()` có lẽ không kém gì tần suất sử dụng phương thức main. `System.out` trả về một `PrintStream`.

Ngoài ra, còn có một anh em sinh đôi khác là PrintWriter. PrintStream là một lớp con của OutputStream, còn PrintWriter là một lớp con của Writer, tức là một [byte stream](programming/java/io/stream.md) và một [character stream](character).

print stream có các đặc điểm sau:

* Có thể tự động chuyển đổi loại dữ liệu: print stream có thể chuyển đổi các loại dữ liệu khác nhau thành chuỗi và xuất ra dòng đầu ra được chỉ định.
* Có thể tự động thực hiện thao tác xuống dòng: print stream có thể tự động thêm ký tự xuống dòng ở cuối chuỗi xuất ra, tiện lợi cho việc kiểm soát định dạng khi xuất nhiều chuỗi.
* Có thể xuất ra màn hình hoặc tệp tin: print stream có thể xuất dữ liệu ra màn hình hoặc tệp tin, thuận tiện cho việc gỡ lỗi và ghi log (mặc dù trong môi trường sản xuất thì nên sử dụng Logback, ELK, v.v.).

Các phương thức phổ biến của lớp PrintStream bao gồm:

- `print()`: Xuất biểu diễn chuỗi của một đối tượng.
- `println()`: Xuất biểu diễn chuỗi của một đối tượng và thêm một ký tự xuống dòng ở cuối.
- `printf()`: Sử dụng chuỗi định dạng và tham số chỉ định để xuất chuỗi được định dạng.

Hãy xem một ví dụ để trải nghiệm.

```java
PrintStream ps = System.out;
ps.println("Hung");
ps.print("H ");
ps.print("u ");
ps.print("n ");
ps.print("g ");
ps.println();

ps.printf("Name：%s，Age：%d，Score：%f", "Hung", 18, 99.9);
```

Trong ví dụ này, chúng ta tạo một đối tượng PrintStream ps, nó xuất ra màn hình. Chúng ta sử dụng các phương thức print và println của ps để xuất một số chuỗi.

Sử dụng phương thức printf để xuất một chuỗi định dạng, trong đó %s, %d và %.2f lần lượt đại diện cho định dạng chuỗi, số nguyên và số thập phân. Chúng ta sử dụng danh sách tham số phân cách bằng dấu phẩy để chỉ định các giá trị cần xuất.

Hãy nói chi tiết về phương thức printf.

```java
public PrintStream printf(String format, Object... args);
```

Trong đó, tham số format là chuỗi định dạng và tham số args là danh sách các tham số cần xuất. Chuỗi định dạng chứa các ký tự thông thường và các chỉ định chuyển đổi. Các ký tự thông thường là các ký tự không phải chỉ định chuyển đổi, chúng được xuất trực tiếp khi xuất ra. Chỉ định chuyển đổi bao gồm dấu phần trăm (%) và một hoặc nhiều ký tự, được sử dụng để chỉ định định dạng và loại dữ liệu cần xuất.

Dưới đây là các chỉ định chuyển đổi thường dùng trong Java và định dạng đầu ra tương ứng:

- `%s`: Xuất một chuỗi.
- `%d` hoặc `%i`: Xuất một số nguyên hệ thập phân.
- `%x` hoặc `%X`: Xuất một số nguyên hệ thập lục phân, `%x` xuất chữ cái thường, `%X` xuất chữ cái hoa.
- `%f` hoặc `%F`: Xuất một số thập phân.
- `%e` hoặc `%E`: Xuất một số thập phân dạng khoa học, `%e` xuất chữ cái thường e, `%E` xuất chữ cái hoa E.
- `%g` hoặc `%G`: Xuất một số thập phân, tự động chọn định dạng `%f` hoặc `%e/%E` để xuất.
- `%c`: Xuất một ký tự.
- `%b`: Xuất một giá trị boolean.
- `%h`: Xuất một mã băm (hệ thập lục phân).
- `%n`: Ký tự xuống dòng.

Ngoài các chỉ định chuyển đổi, phương thức printf của Java còn hỗ trợ một số chỉ định sửa đổi, dùng để chỉ định độ rộng, độ chính xác, cách căn chỉnh, v.v. của đầu ra.

- Chỉ định độ rộng: Dùng số để chỉ định độ rộng tối thiểu của đầu ra, nếu dữ liệu đầu ra không đủ độ rộng chỉ định thì sẽ thêm khoảng trắng hoặc số không ở bên trái hoặc bên phải.
- Chỉ định độ chính xác: Dùng dấu chấm (.) và số để chỉ định độ chính xác của số thập phân hoặc chuỗi, đối với số thập phân, chỉ định số chữ số sau dấu thập phân, đối với chuỗi, chỉ định số ký tự cần xuất.
- Chỉ định căn chỉnh: Dùng dấu trừ (-) hoặc số không (0) để chỉ định cách căn chỉnh đầu ra, dấu trừ biểu thị căn chỉnh trái, số không biểu thị căn chỉnh phải và thêm số không.

Dưới đây là một số ví dụ:

```java
int num = 123;
System.out.printf("%5d\n", num); // Xuất "  123"
System.out.printf("%-5d\n", num); // Xuất "123  "
System.out.printf("%05d\n", num); // Xuất "00123"

double pi = Math.PI;
System.out.printf("%10.2f\n", pi); // Xuất "      3.14"
System.out.printf("%-10.4f\n", pi); // Xuất "3.1416    "

String name = "Hung";
System.out.printf("%10s\n", name); // Xuất "     Hung"
System.out.printf("%-10s\n", name); // Xuất "Hung     "
```

Cụ thể,

- Chúng ta sử dụng `%5d` để chỉ định số nguyên đầu ra chiếm 5 ký tự độ rộng, phần thiếu sẽ được thêm khoảng trắng ở bên trái.
- Sử dụng `%-5d` để chỉ định số nguyên đầu ra chiếm 5 ký tự độ rộng, phần thiếu sẽ được thêm khoảng trắng ở bên phải.
- Sử dụng `%05d` để chỉ định số nguyên đầu ra chiếm 5 ký tự độ rộng, phần thiếu sẽ được thêm số không ở bên trái.
- Sử dụng `%10.2f` để chỉ định số thập phân đầu ra chiếm 10 ký tự độ rộng, giữ lại 2 chữ số thập phân, phần thiếu sẽ được thêm khoảng trắng ở bên trái.
- Sử dụng `%-10.4f` để chỉ định số thập phân đầu ra chiếm 10 ký tự độ rộng, giữ lại 4 chữ số thập phân, phần thiếu sẽ được thêm khoảng trắng ở bên phải.
- Sử dụng `%10s` để chỉ định chuỗi đầu ra chiếm 10 ký tự độ rộng, phần thiếu sẽ được thêm khoảng trắng ở bên trái.
- Sử dụng `%-10s` để chỉ định chuỗi đầu ra chiếm 10 ký tự độ rộng, phần thiếu sẽ được thêm khoảng trắng ở bên phải.

Tiếp theo, chúng ta hãy xem một ví dụ về PrintWriter:

```java
PrintWriter writer = new PrintWriter(new FileWriter("output.txt"));
writer.println("Hung");
writer.printf("Age: %d.\n", 18);
writer.close();
```

Trước tiên, chúng ta tạo một đối tượng PrintWriter, hàm dựng của nó nhận một đối tượng Writer làm tham số. Ở đây, chúng ta sử dụng FileWriter để tạo một dòng đầu ra tệp và truyền nó vào hàm dựng của PrintWriter. Sau đó, chúng ta sử dụng các phương thức println và printf của PrintWriter để xuất hai dòng nội dung, trong đó phương thức printf có thể nhận chuỗi định dạng. Cuối cùng, chúng ta gọi phương thức close của PrintWriter để đóng dòng đầu ra.

Chúng ta cũng có thể không tạo đối tượng FileWriter, mà chỉ định tên tệp trực tiếp.

```java
PrintWriter pw = new PrintWriter("output.txt");
pw.println("Hung");
pw.printf("Age: %d.\n", 18);
pw.close();
```

Được rồi, về print stream chúng ta nói đến đây thôi, khá đơn giản. Đối với một số quy tắc của printf, khi cần sử dụng thì có thể tra cứu hướng dẫn sử dụng hoặc xem tài liệu API, không cần nhớ hết.
