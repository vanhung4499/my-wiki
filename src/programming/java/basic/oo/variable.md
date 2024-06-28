---
title: Variable Object
tags:
  - java
categories:
  - java
order: 3
---
# Java Variable

Biến trong Java giống như một cái bình chứa, có thể lưu trữ giá trị trong quá trình chương trình chạy. Khi khai báo biến, nó sẽ xác định kiểu dữ dữ liệu tương ứng(Java có hai loại dữ liệu: loại dữ liệu cơ bản và loại dữ liệu tham chiếu). Theo phạm vi hiệu lực, biến có thể được chia thành ba loại: biến cục bộ, biến thành viên và biến tĩnh.

### 01. Biến Cục Bộ

Biến được khai báo trong thân phương thức được gọi là biến cục bộ. Biến này chỉ có thể được sử dụng trong phương thức đó, các phương thức khác trong lớp không biết về biến này. Hãy xem ví dụ dưới đây:

```java
public class LocalVariable {
    public static void main(String[] args) {
        int a = 10;
        int b = 10;
        int c = a + b;
        System.out.println(c);
    }
}
```

Trong đó `a`, `b`, `c` là các biến cục bộ, chúng chỉ có thể được sử dụng trong phương thức `main` hiện tại.

Những điều cần lưu ý khi khai báo biến cục bộ:

- Biến cục bộ được khai báo trong phương thức, hàm tạo hoặc khối lệnh.
- Biến cục bộ được tạo ra khi phương thức, hàm tạo hoặc khối lệnh của chúng được thực thi và bị hủy khi chúng hoàn thành.
- Không thể sử dụng các từ khóa truy cập (access modifiers) cho biến cục bộ.
- Biến cục bộ chỉ có thể nhìn thấy trong phương thức, hàm tạo hoặc khối lệnh mà chúng được khai báo.
- Biến cục bộ được phân bổ trong ngăn xếp.
- Biến cục bộ không có giá trị mặc định, vì vậy phải được khởi tạo trước khi sử dụng.

Ví dụ, với đoạn mã dưới đây, `a`, `b` và `c` là các biến cục bộ chỉ có thể được sử dụng trong phương thức `main`:

```java
public class LocalVariable {
    public static void main(String[] args) {
        int a = 10;
        int b = 10;
        int c = a + b;
        System.out.println(c);
    }
}
```

Những biến này được tạo ra khi phương thức `main` bắt đầu thực thi và bị hủy khi phương thức kết thúc. Nếu bạn cố gắng truy cập vào các biến này từ một phương thức khác, bạn sẽ gặp lỗi biên dịch vì các phương thức khác không biết về sự tồn tại của chúng.

### 02. Biến Thành Viên

Biến được khai báo bên trong lớp nhưng bên ngoài phương thức được gọi là biến thành viên, hoặc biến instance, hoặc trường. Biến này được gọi là biến instance vì nó chỉ có thể được truy cập thông qua một instance (đối tượng) của lớp. Hãy xem ví dụ dưới đây:

```java
public class InstanceVariable {
    int data = 88;
    public static void main(String[] args) {
        InstanceVariable iv = new InstanceVariable();
        System.out.println(iv.data); // 88
    }
}
```

Trong đó `iv` là một biến, nó là một biến kiểu tham chiếu. Từ khóa `new` có thể tạo ra một instance (cũng gọi là đối tượng) của một lớp, sử dụng toán tử "=" để gán giá trị cho biến `iv`, `iv` trở thành tham chiếu đến đối tượng này và thông qua `iv.data` có thể truy cập vào biến thành viên.

Những điều cần lưu ý khi khai báo biến thành viên:

- Biến thành viên được khai báo trong một lớp, nhưng bên ngoài phương thức, hàm tạo và khối lệnh.
- Khi một đối tượng được khởi tạo, giá trị của mỗi biến thành viên được xác định.
- Biến thành viên được tạo ra khi đối tượng được tạo và bị hủy khi đối tượng bị hủy.
- Giá trị của biến thành viên nên được ít nhất một phương thức, hàm tạo hoặc khối lệnh tham chiếu, để bên ngoài có thể lấy thông tin biến instance thông qua các cách này.
- Biến thành viên có thể được khai báo trước hoặc sau khi sử dụng.
- Các từ khóa truy cập (access modifiers) có thể được sử dụng để khai báo biến thành viên.
- Biến thành viên có thể được nhìn thấy bởi các phương thức, hàm tạo hoặc khối lệnh trong lớp. Thông thường, biến thành viên nên được đặt là private. Sử dụng từ khóa truy cập có thể làm cho biến thành viên có thể nhìn thấy bởi các lớp con; biến thành viên có giá trị mặc định. Giá trị mặc định của biến kiểu số là 0, của biến kiểu boolean là false, và của biến kiểu tham chiếu là null. Giá trị của biến có thể được chỉ định khi khai báo hoặc trong hàm tạo.

Ví dụ, với đoạn mã dưới đây, `data` là một biến thành viên của lớp `InstanceVariable`:

```java
public class InstanceVariable {
    int data = 88;
    public static void main(String[] args) {
        InstanceVariable iv = new InstanceVariable();
        System.out.println(iv.data); // 88
    }
}
```

Biến `data` được tạo ra khi đối tượng `InstanceVariable` được khởi tạo và bị hủy khi đối tượng bị hủy. Nếu bạn tạo nhiều đối tượng `InstanceVariable`, mỗi đối tượng sẽ có biến `data` riêng của nó với giá trị 88.

### 03. Biến Tĩnh

Biến được khai báo bằng từ khóa `static` được gọi là biến tĩnh (class variable), nó có thể được truy cập trực tiếp bởi lớp. Hãy xem ví dụ dưới đây:

```java
public class StaticVariable {
    static int data = 99;
    public static void main(String[] args) {
        System.out.println(StaticVariable.data); // 99
    }
}
```

Trong đó, `data` là một biến tĩnh. Nó có thể được truy cập thông qua `className.staticVariable` mà không cần phải tạo một instance của lớp.

Những điều cần lưu ý khi khai báo biến tĩnh:

- Biến tĩnh được khai báo trong lớp với từ khóa `static`, nhưng phải nằm ngoài phương thức, hàm tạo và khối lệnh.
- Bất kể một lớp được tạo ra bao nhiêu đối tượng, lớp chỉ có một bản sao của biến tĩnh.
- Biến tĩnh hiếm khi được sử dụng ngoại trừ khi được khai báo là hằng số.
- Biến tĩnh được lưu trữ trong vùng lưu trữ tĩnh.
- Biến tĩnh được tạo ra khi chương trình bắt đầu và bị hủy khi chương trình kết thúc.
- Biến tĩnh có tính khả kiến tương tự như biến thành viên. Nhưng để biến tĩnh có thể được nhìn thấy bởi người sử dụng lớp, hầu hết các biến tĩnh được khai báo là kiểu `public`.
- Giá trị mặc định của biến tĩnh tương tự như biến instance.
- Biến tĩnh cũng có thể được khởi tạo trong khối lệnh tĩnh.

Ví dụ về biến tĩnh:

```java
public class StaticVariable {
    static int data = 99;
    public static void main(String[] args) {
        System.out.println(StaticVariable.data); // 99
    }
}
```

Trong ví dụ trên, biến `data` là biến tĩnh và có thể được truy cập thông qua `StaticVariable.data` mà không cần tạo instance của `StaticVariable`. Bất kỳ khi nào bạn muốn chia sẻ dữ liệu giữa tất cả các đối tượng của một lớp, bạn nên sử dụng biến tĩnh.

### 04. Hằng Số

Trong Java, có những giá trị không thay đổi trong suốt quá trình chạy của chương trình, những giá trị này được gọi là hằng số - được khai báo bằng từ khóa `final`. Giá trị của hằng số một khi đã được gán thì không thể thay đổi!

Hằng số có hai tác dụng chính trong quá trình chạy chương trình:

- **Đại diện cho các giá trị không đổi**: Dễ dàng chỉnh sửa (ví dụ: giá trị của số Pi, `final double PI = 3.14`)
- **Tăng tính đọc hiểu của chương trình**: (ví dụ: các hằng số UP, DOWN để đại diện cho hướng lên và hướng xuống, `final int UP = 0`)

Java yêu cầu tên hằng số phải được viết hoa. Hãy xem ví dụ dưới đây:

```java
public class FinalVariable {
    final String ABC = "abc";
    static final String DEF = "def";
    public static void main(String[] args) {
        FinalVariable fv = new FinalVariable();
        System.out.println(fv.ABC);
        System.out.println(DEF);
    }
}
```

Trong ví dụ trên, `ABC` là một hằng số của instance, còn `DEF` là một hằng số tĩnh. Hằng số `ABC` được truy cập thông qua một instance của lớp `FinalVariable`, còn `MO` được truy cập trực tiếp thông qua lớp.
