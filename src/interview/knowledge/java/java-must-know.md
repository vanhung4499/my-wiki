---
title: Java Basic Must Know
tags:
  - interview
  - java
categories:
  - interview
order: 10
---
# Java Cơ Bản (Phải Học Thuộc) 🍉

### Ngôn ngữ Java có những đặc điểm gì?

- Java là ngôn ngữ hướng đối tượng hoàn toàn. Nó có thể trực tiếp phản ánh các đối tượng trong cuộc sống thực.
- Có tính độc lập nền tảng. Java sử dụng Máy ảo Java (JVM) để chạy mã byte, bất kể là trên Windows, Linux hay MacOS, các chương trình Java sau khi biên dịch có thể chạy trên các nền tảng khác.
- Java là ngôn ngữ biên dịch, trình biên dịch chuyển mã Java thành mã trung gian không phụ thuộc nền tảng, sau đó chạy trên JVM, có tính di động tốt.
- Java cung cấp nhiều thư viện tích hợp sẵn. Ví dụ như hỗ trợ đa luồng, hỗ trợ giao tiếp mạng, và quan trọng nhất là cung cấp cơ chế thu gom rác (garbage collector).
- Java có tính bảo mật và độ tin cậy cao. Java cung cấp cơ chế xử lý ngoại lệ và thu gom rác, loại bỏ các đặc tính con trỏ khó hiểu của C++.

### Sự khác biệt giữa JDK và JRE là gì?

- JDK: Bộ công cụ phát triển Java (Java Development Kit), cung cấp môi trường phát triển và chạy Java.
- JRE: Môi trường chạy Java (Java Runtime Environment), cung cấp môi trường cần thiết để chạy Java.
- JDK bao gồm JRE. Nếu chỉ chạy chương trình Java, chỉ cần cài đặt JRE. Để viết chương trình Java, cần cài đặt JDK.

### Mô tả ngắn gọn các kiểu dữ liệu cơ bản trong Java

- byte: Chiếm 1 byte, phạm vi giá trị từ -128 đến 127.
- short: Chiếm 2 byte, phạm vi giá trị từ -2^15 đến 2^15-1.
- int: Chiếm 4 byte, phạm vi giá trị từ -2^31 đến 2^31-1.
- long: Chiếm 8 byte.
- float: Chiếm 4 byte.
- double: Chiếm 8 byte.
- char: Chiếm 2 byte.
- boolean: Kích thước chiếm dụng tùy thuộc vào việc triển khai JVM.

### Mô tả ngắn gọn về tự động đóng gói và mở gói

Đối với các kiểu dữ liệu cơ bản của Java, đều có một lớp bao bọc tương ứng.

Đóng gói là tự động chuyển đổi kiểu dữ liệu cơ bản thành kiểu bao bọc, như int -> Integer.

Mở gói là tự động chuyển đổi kiểu bao bọc thành kiểu dữ liệu cơ bản, như Integer -> int.

### Mô tả ngắn gọn về các từ khóa truy cập trong Java

- default: Từ khóa truy cập mặc định, có thể nhìn thấy trong cùng một gói.
- private: Có thể nhìn thấy trong cùng một lớp, không thể dùng để sửa đổi lớp.
- protected: Có thể nhìn thấy đối với các lớp trong cùng một gói và tất cả các lớp con, không thể dùng để sửa đổi lớp.
- public: Có thể nhìn thấy đối với tất cả các lớp.

### Thứ tự khởi tạo của phương thức khởi tạo, biến thành viên và biến thành viên tĩnh là gì?

Thứ tự: Biến thành viên tĩnh, biến thành viên, phương thức khởi tạo.

Thứ tự chi tiết: Biến tĩnh của lớp cha, khối mã tĩnh của lớp cha, biến tĩnh của lớp con, khối mã tĩnh của lớp con, biến không tĩnh của lớp cha, khối mã không tĩnh của lớp cha, hàm khởi tạo của lớp cha, biến không tĩnh của lớp con, khối mã không tĩnh của lớp con, hàm khởi tạo của lớp con.

### Thứ tự thực thi của các khối mã trong Java

- Khối mã tĩnh của lớp cha (chỉ thực thi một lần).
- Khối mã tĩnh của lớp con (chỉ thực thi một lần).
- Khối mã khởi tạo của lớp cha.
- Hàm khởi tạo của lớp cha.
- Khối mã khởi tạo của lớp con.
- Hàm khởi tạo của lớp con.
- Khối mã thông thường.

### Ba đặc tính của lập trình hướng đối tượng là gì?

- Kế thừa: Một lớp mới có thể được dẫn xuất từ lớp hiện có, lớp dẫn xuất có thể thừa hưởng các phương thức và biến thể hiện của lớp cơ sở, và lớp dẫn xuất có thể sửa đổi hoặc thêm mới các phương thức để phù hợp hơn với nhu cầu đặc biệt.
- Đóng gói: Biến đổi các đối tượng trong thế giới thực thành lớp, mỗi lớp có thể để dữ liệu và phương thức của mình chỉ được các lớp hoặc đối tượng tin cậy thao tác, và che giấu thông tin đối với các lớp không tin cậy.
- Đa hình: Cho phép các đối tượng khác nhau phản hồi cùng một thông điệp. Các đối tượng khác nhau gọi cùng một phương thức, dù tham số giống nhau, nhưng hành vi cuối cùng sẽ khác nhau.

### Tại sao ngôn ngữ Java không hỗ trợ đa kế thừa?

Để cấu trúc của chương trình rõ ràng hơn và dễ bảo trì. Giả sử ngôn ngữ Java hỗ trợ đa kế thừa, lớp C kế thừa từ lớp A và lớp B, nếu cả lớp A và B đều có phương thức thành viên `f()`, thì khi gọi phương thức `f()` của lớp C sẽ gây ra sự mơ hồ.

Ngôn ngữ Java gián tiếp hỗ trợ đa kế thừa thông qua việc triển khai nhiều interface. interface chỉ chứa định nghĩa phương thức, không có triển khai phương thức, do đó khi lớp C triển khai interface A và interface B, dù cả hai đều có phương thức `f()`, thì vẫn không thể gọi trực tiếp phương thức mà phải triển khai cụ thể phương thức `f()` mới có thể gọi, do đó không gây ra sự mơ hồ.

Đa kế thừa làm cho việc chuyển đổi kiểu dữ liệu và thứ tự gọi phương thức khởi tạo trở nên phức tạp, ảnh hưởng đến hiệu suất.

### Mô tả ngắn gọn về đa hình trong Java

Đa hình trong Java có thể chia thành đa hình thời gian biên dịch và đa hình thời gian chạy.

Đa hình thời gian biên dịch chủ yếu là quá tải phương thức (method overloading), tức là phân biệt các phương thức khác nhau thông qua danh sách tham số.

Đa hình thời gian chạy chủ yếu là khi kế thừa lớp cha và triển khai interface, có thể sử dụng tham chiếu của lớp cha để trỏ đến đối tượng của lớp con.

Đa hình thời gian chạy được triển khai thông qua bảng phương thức. Trong bảng phương thức, đầu tiên là các phương thức của lớp Object, tiếp theo là các phương thức của lớp cha, cuối cùng là các phương thức của lớp đó. Nếu lớp con ghi đè phương thức của lớp cha, thì lớp con và lớp cha sẽ chia sẻ cùng một mục trong bảng phương thức, và đều được coi là phương thức của lớp cha. Do đó có thể triển khai đa hình thời gian chạy.

### Cơ chế đa hình mà Java cung cấp?

Java cung cấp hai cơ chế cho đa hình là quá tải và ghi đè.

Quá tải: Quá tải là khi trong cùng một lớp có nhiều phương thức cùng tên nhưng khác tham số. Trong quá trình biên dịch, có thể xác định được phương thức nào sẽ được gọi.

Ghi đè: Ghi đè là khi lớp dẫn xuất ghi đè phương thức của lớp cơ sở. Sử dụng tham chiếu của lớp cơ sở để trỏ đến đối tượng của lớp dẫn xuất, hoặc biến tham chiếu của interface trỏ đến đối tượng của lớp triển khai interface, trong thời gian chạy, phương thức nào sẽ được gọi được xác định dựa trên đối tượng cụ thể mà biến tham chiếu trỏ đến.

### Sự khác biệt giữa quá tải và ghi đè?

- Ghi đè là mối quan hệ giữa lớp cha và lớp con, là mối quan hệ dọc; quá tải là mối quan hệ giữa các phương thức trong cùng một lớp, là mối quan hệ ngang.
- Ghi đè chỉ có thể xảy ra giữa một phương thức hoặc một cặp phương thức; quá tải là mối quan hệ giữa nhiều phương thức.
- Ghi đè yêu cầu danh sách tham số giống nhau; quá tải yêu cầu danh sách tham số khác nhau.
- Trong ghi đè, phương thức được gọi được xác định dựa trên kiểu của đối tượng; trong quá tải, phương thức được chọn dựa trên danh sách tham số tại thời điểm gọi.
- Phương thức quá tải có thể thay đổi kiểu trả về, phương thức ghi đè không thể thay đổi kiểu trả về.

### Điểm giống và khác nhau giữa interface và lớp trừu tượng?

Điểm giống:

- Đều không thể được khởi tạo trực tiếp.
- Lớp triển khai interface hoặc lớp con của lớp trừu tượng phải triển khai các phương thức tương ứng để có thể khởi tạo.

Điểm khác:

- interface chỉ có định nghĩa phương thức, không có triển khai phương thức, trong khi lớp trừu tượng có thể có cả định nghĩa và triển khai phương thức.
- Từ khóa để triển khai interface là `implements`, từ khóa để kế thừa lớp trừu tượng là `extends`. Một lớp có thể triển khai nhiều interface, nhưng chỉ có thể kế thừa một lớp trừu tượng.
- Khi có mối quan hệ về mặt logic giữa lớp con và lớp cha, nên sử dụng lớp trừu tượng, giúp tích lũy chức năng. Khi không cần có mối quan hệ cụ thể và muốn hỗ trợ hành vi đặc biệt giữa hai hoặc nhiều đối tượng, nên sử dụng interface. Sử dụng interface giúp giảm mức độ gắn kết của hệ thống phần mềm, dễ bảo trì hoặc thêm bớt phương thức sau này.

### Mô tả ngắn gọn sự khác biệt giữa lớp trừu tượng và interface

Lớp trừu tượng: Thể hiện mối quan hệ "is-a", như đối với "man is a person", có thể định nghĩa `person` là lớp trừu tượng.

interface: Thể hiện mối quan hệ "can". Làm mẫu để triển khai. Như interface `fly`, lớp `plane` và lớp `bird` đều có thể triển khai interface này.

Một lớp chỉ có thể kế thừa một lớp trừu tượng, nhưng có thể triển khai nhiều interface.

### Mô tả ngắn gọn về lớp bên trong và chức năng của nó

- Lớp bên trong là thành viên: Là lớp bên trong như một thành viên của lớp bên ngoài. Có thể truy cập các thuộc tính và phương thức của lớp bên ngoài có phạm vi truy cập từ private trở lên. Lớp bên ngoài muốn truy cập các thuộc tính hoặc phương thức của lớp bên trong, phải tạo một đối tượng của lớp bên trong, sau đó truy cập thông qua đối tượng đó. Lớp bên ngoài cũng có thể truy cập các thuộc tính được sửa đổi bằng private của lớp bên trong.
- Lớp bên trong cục bộ: Là lớp bên trong tồn tại trong phương thức. Phạm vi truy cập giống như biến cục bộ, chỉ có thể truy cập các biến final của lớp bên ngoài.
- Lớp bên trong ẩn danh: Chỉ sử dụng một lần, không có tên lớp, chỉ có thể truy cập các biến final của lớp bên ngoài.
- Lớp bên trong tĩnh: Giống như biến tĩnh của lớp. Có thể được khởi tạo mà không cần phụ thuộc vào đối tượng của lớp bên ngoài. Lớp bên trong tĩnh không thể có tên giống với lớp bên ngoài, không thể truy cập các biến thành viên thông thường, chỉ có thể truy cập các thành viên tĩnh và phương thức tĩnh của lớp bên ngoài.

### Tác dụng của từ khóa `static` trong ngôn ngữ Java là gì?

`static` có hai tác dụng chính:

- Phân bổ không gian lưu trữ duy nhất không liên quan đến số lượng đối tượng được tạo ra cho một loại dữ liệu hoặc đối tượng cụ thể.
- Liên kết một phương thức hoặc thuộc tính với lớp thay vì đối tượng, nghĩa là có thể gọi phương thức hoặc sử dụng thuộc tính của lớp mà không cần tạo đối tượng.

Cụ thể, `static` có thể được sử dụng theo 4 cách:

- Sửa đổi biến thành viên: Biến tĩnh được sửa đổi bởi từ khóa `static` chỉ có một bản sao trong bộ nhớ. Khi lớp chứa biến tĩnh được tải, biến tĩnh này sẽ được phân bổ không gian và có thể được sử dụng theo cách "lớp.biến tĩnh" hoặc "đối tượng.biến tĩnh".
- Sửa đổi phương thức thành viên: Phương thức tĩnh được sửa đổi bởi `static` có thể được gọi mà không cần tạo đối tượng. Trong phương thức tĩnh không thể sử dụng từ khóa `this` và `super`, không thể gọi phương thức không tĩnh, chỉ có thể truy cập các thành viên tĩnh và phương thức tĩnh của lớp đó.
- Sửa đổi khối mã: JVM sẽ thực thi khối mã tĩnh khi tải lớp. Khối mã tĩnh thường được sử dụng để khởi tạo các biến tĩnh. Khối mã tĩnh chỉ được thực thi một lần.
- Sửa đổi lớp bên trong: Lớp bên trong tĩnh có thể được khởi tạo mà không cần phụ thuộc vào đối tượng của lớp bên ngoài. Lớp bên trong tĩnh không thể có tên giống với lớp bên ngoài và chỉ có thể truy cập các thành viên tĩnh và phương thức tĩnh của lớp bên ngoài.

### Tại sao lại thiết kế String là không thể thay đổi?

- Tiết kiệm không gian: Các chuỗi hằng được lưu trữ trong bể chuỗi của JVM và có thể được chia sẻ bởi người dùng.
- Tăng hiệu suất: String có thể được chia sẻ bởi các luồng khác nhau và là an toàn với luồng. Trong các thao tác liên quan đến đa luồng không cần thao tác đồng bộ.
- An toàn: String thường được sử dụng cho tên người dùng, mật khẩu, tên tệp, do đó tính không thể thay đổi của nó giúp tránh các thao tác thay đổi độc hại của hacker.

### Mô tả ngắn gọn về String/StringBuffer và StringBuilder

Lớp String sử dụng mảng ký tự được sửa đổi bởi `final` để lưu trữ chuỗi, do đó không thể thay đổi. Nếu muốn sửa đổi đối tượng kiểu String, cần tạo đối tượng mới và lưu cả ký tự cũ và ký tự mới thêm vào.

StringBuilder sử dụng mảng ký tự không được sửa đổi bởi `final`, do đó có thể thay đổi nhưng không an toàn trong môi trường đa luồng.

StringBuffer cũng sử dụng mảng ký tự không được sửa đổi bởi `final`, có thể hiểu là StringBuilder an toàn với môi trường đa luồng.

### Sự khác biệt giữa toán tử so sánh == và phương thức equals?

== so sánh tham chiếu, còn equals so sánh nội dung.

Nếu biến là kiểu dữ liệu cơ bản, == được sử dụng để so sánh giá trị tương ứng. Nếu biến trỏ đến đối tượng, == được sử dụng để so sánh xem hai đối tượng có trỏ đến cùng một vùng nhớ hay không.

equals là một phương thức của lớp Object, mỗi lớp trong Java đều kế thừa từ Object, do đó mỗi đối tượng đều có phương thức equals. Trong lớp Object, phương thức equals so sánh tham chiếu của đối tượng. Tuy nhiên, bằng cách ghi đè phương thức này, có thể so sánh nội dung của đối tượng thay vì tham chiếu.

### Mô tả ngắn gọn về các phương thức thường dùng của lớp Object

- hashCode: Tính mã băm của đối tượng, được sử dụng cho các cấu trúc dữ liệu kiểu map hoặc phương thức equals. Cần đảm bảo rằng một đối tượng khi được gọi nhiều lần phương thức này luôn trả về cùng một giá trị nguyên.
- equals: Xác định hai đối tượng có bằng nhau không. Cần đảm bảo rằng nếu phương thức equals của hai đối tượng trả về true, mã băm của chúng cũng phải giống nhau.
- toString: Trả về chuỗi đại diện cho đối tượng.
- clone: Sao chép sâu một đối tượng.

### Cách khai báo mảng một chiều và mảng hai chiều trong Java?

Cách khai báo mảng một chiều:

```java
type arrayName[]
type[] arrayName
```

Cách khai báo mảng hai chiều:

```java
type arrayName[][]
type[][] arrayName
type[] arrayName[]
```

Trong đó, `type` là kiểu dữ liệu cơ bản hoặc lớp, `arrayName` là tên mảng.

### Mô tả ngắn gọn về các loại ngoại lệ trong Java

Java chia ngoại lệ thành Error (lỗi không thể xử lý bởi chương trình) và Exception (ngoại lệ có thể xử lý bởi chương trình). Cả hai lớp này đều kế thừa từ Throwable.

Error phổ biến như StackOverFlowError, OutOfMemoryError,...

Exception chia thành ngoại lệ runtime và non-runtime. Đối với ngoại lệ runtime, có thể xử lý bằng cách sử dụng try-catch hoặc không. Đối với ngoại lệ non-runtime, bắt buộc phải xử lý, nếu không chương trình sẽ không thể biên dịch.

### Sự khác biệt giữa throw và throws

throw thường được sử dụng trong thân phương thức, do lập trình viên định nghĩa khi xảy ra lỗi trong câu lệnh sẽ chủ động ném ra ngoại lệ.

throws thường được sử dụng trong khai báo phương thức, biểu thị danh sách các ngoại lệ mà phương thức đó có thể ném ra.

### Khối mã finally có luôn luôn được thực thi trong Java không?

Khối mã finally sẽ không được thực thi trong các trường hợp sau:

- Khi chương trình gặp ngoại lệ trước khi vào khối try, chương trình sẽ kết thúc ngay lập tức.
- Khi chương trình cưỡng chế thoát trong khối try, ví dụ như sử dụng System.exit(0), khối mã finally sẽ không được thực thi.

Trong các trường hợp khác, khi try/catch/finally được thực thi, khối try sẽ được thực thi trước. Nếu có ngoại lệ xảy ra, khối catch và finally sẽ xử lý, sau đó chương trình kết thúc. Nếu không có ngoại lệ, sau khi thực thi khối finally, mã tiếp theo sẽ tiếp tục được thực thi. Lưu ý rằng nếu có câu lệnh return trong khối try/catch, khối mã finally sẽ được thực thi trước khi return. Nếu cả ba khối try/catch/finally đều có câu lệnh return, câu lệnh return trong khối finally sẽ ghi đè lên câu lệnh return trong try/catch.

### Sự khác biệt giữa final, finally và finalize là gì?

- final: Được sử dụng để khai báo thuộc tính, phương thức và lớp. Thuộc tính không thể thay đổi, phương thức không thể ghi đè, lớp không thể kế thừa.
- finally: Là một phần của xử lý ngoại lệ, chỉ có thể sử dụng trong khối try/catch. Khối finally đảm bảo rằng mã trong nó luôn được thực thi, thường được sử dụng để giải phóng tài nguyên.
- finalize: Là một phương thức của lớp Object, được gọi khi bộ thu gom rác chuẩn bị giải phóng không gian của đối tượng. Khi bộ thu gom rác chuẩn bị giải phóng đối tượng, nó sẽ gọi phương thức finalize(). Sau đó, khi bộ thu gom rác triển khai hành động thu gom tiếp theo, đối tượng sẽ bị giải phóng bộ nhớ.

### Mô tả ngắn gọn về generics

Generics, hay "tham số hóa kiểu", giải quyết vấn đề không xác định kiểu dữ liệu cụ thể. Có hiệu lực trong giai đoạn biên dịch. Trong quá trình sử dụng generics, kiểu dữ liệu được chỉ định dưới dạng tham số, trong lớp được gọi là lớp generics, trong interface là interface generics, và trong phương thức là phương thức generics.

### Mô tả ngắn gọn về xóa kiểu generics

Trình biên dịch Java tạo bytecode không chứa thông tin về generics. Thông tin về kiểu generics bị xóa trong quá trình biên dịch, quá trình này được gọi là xóa kiểu generics.

### Mô tả ngắn gọn về annotations

Annotations trong Java được sử dụng để cung cấp metadata cho mã Java. Là metadata, annotations không trực tiếp ảnh hưởng đến việc thực thi mã của bạn, nhưng một số loại annotations có thể được sử dụng cho mục đích này.

Chúng có thể được sử dụng để cung cấp thông tin cho trình biên dịch, trong giai đoạn biên dịch để cung cấp thông tin cho phần mềm xử lý liên quan, và trong giai đoạn chạy để triển khai mã tương ứng.

### Mô tả ngắn gọn về Meta-Annotation

Meta-annotation có thể hiểu là annotation của annotation, được sử dụng trong annotation để triển khai các chức năng mong muốn. Cụ thể bao gồm:

- @Retention: Chỉ ra giai đoạn tồn tại của annotation là giữ lại trong mã nguồn, bytecode (tải lớp) hay thời gian chạy (chạy trong JVM).
- @Target: Chỉ ra phạm vi áp dụng của annotation.
- @Documented: Bao gồm các phần tử của annotation vào trong tài liệu Javadoc.
- @Inherited: Một annotation được chú thích bởi @Inherited và được áp dụng lên một lớp cha. Nếu lớp con của nó không được chú thích bởi annotation khác, lớp con đó sẽ kế thừa annotation của lớp cha.
- @Repeatable: Annotation được chú thích bởi meta-annotation này có thể được áp dụng nhiều lần lên cùng một đối tượng, nhưng mỗi lần áp dụng annotation có thể đại diện cho các ý nghĩa khác nhau.

### Mô tả ngắn gọn về đối tượng Class trong Java

Trong Java, đối tượng có thể chia thành đối tượng instance và đối tượng Class. Mỗi lớp đều có một đối tượng Class, chứa thông tin liên quan đến lớp đó.

Các phương pháp để lấy đối tượng Class:

```java
Class.forName(“Tên đầy đủ của lớp”)
đối tượng instance.getClass()
tên lớp.class
```

### Cơ chế phản xạ trong Java là gì?

Cơ chế phản xạ trong Java cho phép trong quá trình chạy chương trình có thể xây dựng đối tượng của bất kỳ lớp nào, lấy các biến thành viên và phương thức của bất kỳ lớp nào, lấy thông tin của lớp mà bất kỳ đối tượng nào thuộc về, và gọi các thuộc tính và phương thức của bất kỳ đối tượng nào. Cơ chế phản xạ cho phép Java có khả năng lấy thông tin chương trình và gọi phương thức đối tượng một cách động. Có thể gọi API phản xạ thông qua các lớp sau:

- Lớp Class: Có thể lấy được thuộc tính và phương thức của lớp
- Lớp Field: Lấy được các biến thành viên của lớp
- Lớp Method: Lấy thông tin các phương thức của lớp
- Lớp Constructor: Lấy thông tin về các phương thức khởi tạo của lớp

### Serialization là gì?

Serialization là quá trình chuyển đối tượng thành chuỗi byte, được sử dụng để giải quyết các vấn đề khi triển khai các thao tác đọc và ghi đối tượng vào luồng dữ liệu. Serialization có thể ghi trạng thái của đối tượng vào luồng để truyền qua mạng, hoặc lưu vào file, cơ sở dữ liệu, và khi cần có thể đọc lại luồng đó và tái cấu trúc thành đối tượng giống hệt.

### Mô tả ngắn gọn về cách triển khai Serialization và Deserialization trong Java

Serialization: Chuyển đổi đối tượng Java thành chuỗi byte, từ đó có thể truyền qua mạng.

Deserialization: Chuyển đổi chuỗi byte thành đối tượng Java.

Cách triển khai: triển khai interface Serializable, hoặc triển khai các phương thức writeExternal() và readExternal() trong interface Externalizable.

### Mô tả ngắn gọn về List trong Java

List là một hàng đợi có thứ tự, trong Java có hai cách triển khai:

- ArrayList: Sử dụng mảng để triển khai, là danh sách không an toàn trong môi trường đa luồng với khả năng thay đổi kích thước. Truy cập ngẫu nhiên nhanh, khi mở rộng danh sách sẽ tạo ra một mảng lớn hơn và sao chép mảng cũ vào mảng mới.
- LinkedList: Bản chất là danh sách liên kết đôi, so với ArrayList, việc chèn và xóa nhanh hơn nhưng truy cập ngẫu nhiên chậm.

### Các cấu trúc dữ liệu an toàn với luồng cơ bản trong Java

- HashTable: Phiên bản an toàn với luồng của bảng băm, hiệu suất thấp.
- ConcurrentHashMap: Phiên bản an toàn với luồng của bảng băm, hiệu suất cao, thay thế HashTable.
- Vector: Phiên bản an toàn với luồng của ArrayList.
- Stack: Phiên bản an toàn với luồng của ngăn xếp.
- BlockingQueue và các lớp con của nó: Phiên bản an toàn với luồng của hàng đợi.

### Mô tả ngắn gọn về Set trong Java

Set là một cấu trúc dữ liệu không cho phép các phần tử trùng lặp và không có thứ tự. Java có ba cách triển khai Set:

- **HashSet**: Được triển khai thông qua HashMap, với key của HashMap là phần tử được lưu trữ trong HashSet, còn value là một hằng số kiểu Object do hệ thống định nghĩa có tên là PRESENT. Khi kiểm tra hai phần tử có giống nhau hay không, trước tiên so sánh hashCode, nếu giống nhau thì tiếp tục sử dụng equals để so sánh, truy vấn có độ phức tạp O(1).

- **LinkedHashSet**: Kế thừa từ HashSet và được triển khai thông qua LinkedHashMap, sử dụng danh sách liên kết đôi để duy trì thứ tự chèn các phần tử.

- **TreeSet**: Được triển khai thông qua TreeMap, cấu trúc dữ liệu nền tảng là cây đỏ-đen, thêm phần tử vào tập hợp theo quy tắc so sánh để đảm bảo rằng tập hợp vẫn được sắp xếp sau khi thêm, truy vấn có độ phức tạp O(logn).

### Mô tả ngắn gọn về HashMap trong Java

Trước JDK8, HashMap được triển khai bằng mảng + danh sách liên kết, từ JDK8 chuyển sang mảng + danh sách liên kết/cây đỏ-đen. Các biến thành viên chính bao gồm mảng table lưu trữ dữ liệu, số lượng phần tử size và hệ số tải loadFactor. Dữ liệu trong HashMap tồn tại dưới dạng cặp khóa-giá trị, giá trị hash của khóa được dùng để tính toán chỉ số của mảng. Nếu hai phần tử có cùng giá trị hash, sẽ xảy ra xung đột hash và chúng sẽ được đưa vào cùng một danh sách liên kết.

Mảng table ghi lại dữ liệu của HashMap, mỗi chỉ số tương ứng với một danh sách liên kết, tất cả các dữ liệu xung đột hash sẽ được lưu trữ trong cùng một danh sách liên kết. Node/Entry bao gồm bốn biến thành viên: key, value, con trỏ next và giá trị hash. Từ JDK8 trở đi, nếu danh sách liên kết vượt quá 8 phần tử sẽ chuyển đổi thành cây đỏ-đen.

Nếu dữ liệu hiện tại/sức chứa tổng > hệ số tải, HashMap sẽ triển khai thao tác mở rộng. Sức chứa mặc định là 16, mở rộng phải là lũy thừa của 2, sức chứa tối đa là 1 << 30, hệ số tải mặc định là 0.75.

### Tại sao HashMap không an toàn trong môi trường đa luồng

Trong JDK1.7, HashMap sử dụng phương pháp thêm đầu để chèn phần tử, do đó trong trường hợp đồng thời sẽ dẫn đến danh sách liên kết vòng và gây ra vòng lặp vô tận.

Mặc dù JDK1.8 sử dụng phương pháp thêm cuối để giải quyết vấn đề này, nhưng thao tác put đồng thời cũng có thể khiến khóa trước bị ghi đè bởi khóa sau.

Do HashMap có cơ chế mở rộng, nên cũng có trường hợp luồng A triển khai mở rộng, luồng B triển khai phương thức get sẽ xảy ra sai sót.

### Mô tả ngắn gọn về TreeMap trong Java

TreeMap là một cấu trúc Map được triển khai dựa trên cây đỏ-đen. Cấu trúc nền tảng là một cây nhị phân cân bằng, vì thời gian phức tạp của việc chèn, xóa, duyệt qua đều là O(logN), nên hiệu suất thấp hơn so với bảng băm. Tuy nhiên, bảng băm không thể cung cấp đầu ra có thứ tự của các cặp khóa-giá trị, trong khi cây đỏ-đen có thể sắp xếp đầu ra theo thứ tự của khóa.

### Điểm chung và khác biệt giữa ArrayList, Vector và LinkedList

- ArrayList, Vector và LinkedList đều là các mảng có thể mở rộng, nghĩa là có thể thay đổi kích thước động.
- ArrayList và Vector được triển khai dựa trên mảng Object[], chúng mở một không gian liên tiếp trong bộ nhớ để lưu trữ, hỗ trợ truy cập bằng chỉ số. Tuy nhiên, khi chèn phần tử có thể cần di chuyển các phần tử trong container, nên hiệu suất chèn thấp. Khi số lượng phần tử vượt quá kích thước khởi tạo, cả ArrayList và Vector đều sẽ mở rộng.
- Vector là an toàn trong môi trường đa luồng, hầu hết các phương thức của nó là trực tiếp hoặc gián tiếp đồng bộ. ArrayList không an toàn trong môi trường đa luồng, các phương thức của nó không có tính đồng bộ. LinkedList cũng không an toàn trong môi trường đa luồng.
- LinkedList sử dụng danh sách liên kết đôi, truy cập dữ liệu theo chỉ số cần duyệt từ đầu, do đó hiệu suất truy cập ngẫu nhiên thấp, nhưng chèn phần tử không cần di chuyển dữ liệu, nên hiệu suất chèn cao.

### Sự khác biệt giữa HashMap và Hashtable

- HashMap là một phiên bản nhẹ của Hashtable, HashMap cho phép khóa và giá trị là null, nhưng chỉ cho phép một khóa là null. Hashtable không cho phép.
- Các phương thức trong Hashtable là an toàn trong môi trường đa luồng, trong khi HashMap không an toàn. Khi truy cập HashMap trong môi trường đa luồng cần cung cấp cơ chế đồng bộ bổ sung.
- Hashtable sử dụng Enumeration để duyệt qua, HashMap sử dụng Iterator để duyệt qua.

### Làm thế nào để quyết định sử dụng HashMap hay TreeMap?

Nếu các thao tác chèn, xóa hoặc định vị một phần tử trong Map thường xuyên, HashMap là lựa chọn tốt hơn. Nếu cần duyệt qua các khóa theo thứ tự, TreeMap là lựa chọn tốt hơn.

### Mối quan hệ giữa equals và hashCode trong HashSet?

Cả equals và hashCode đều được kế thừa từ lớp Object, equals chủ yếu để kiểm tra xem địa chỉ tham chiếu của đối tượng có cùng một địa chỉ không; hashCode theo định nghĩa quy tắc hash sẽ chuyển địa chỉ bộ nhớ của đối tượng thành một mã hash. Các phần tử được lưu trữ trong HashSet không được trùng lặp, chủ yếu thông qua hai phương thức hashCode và equals để xác định xem các đối tượng lưu trữ có giống nhau không:

- Nếu giá trị hashCode của hai đối tượng khác nhau, điều đó có nghĩa là hai đối tượng không giống nhau.
- Nếu giá trị hashCode của hai đối tượng giống nhau, tiếp theo sẽ gọi phương thức equals của đối tượng, nếu kết quả của phương thức equals là true, thì điều đó có nghĩa là hai đối tượng giống nhau, nếu không thì khác nhau.

### Sự khác biệt giữa fail-fast và fail-safe iterator là gì?

- Fail-fast trực tiếp trên container, trong quá trình duyệt, nếu phát hiện dữ liệu trong container bị thay đổi, sẽ ngay lập tức ném ra ngoại lệ ConcurrentModificationException dẫn đến thất bại trong duyệt. Các container thường sử dụng phương pháp fail-fast bao gồm HashMap và ArrayList.
- Fail-safe dựa trên một bản sao của container. Do đó, việc thay đổi nội dung trong container không ảnh hưởng đến quá trình duyệt. Các container thường sử dụng phương pháp fail-safe bao gồm ConcurrentHashMap và CopyOnWriteArrayList.

### Sự khác biệt giữa Collection và Collections?

- Collection là một interface tập hợp, nó cung cấp các phương thức interface chung để thao tác với các đối tượng tập hợp, tất cả các tập hợp đều là con của nó, chẳng hạn như List, Set, v.v.
- Collections là một lớp bao bọc, chứa nhiều phương thức tĩnh, không thể được khởi tạo mà được sử dụng như một lớp công cụ, chẳng hạn như phương thức sắp xếp: Collections.sort(list); phương thức đảo ngược: Collections.reverse(list).