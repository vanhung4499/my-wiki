---
title: Constructor
tags:
  - java
categories:
  - java
order: 6
---
# Phương thức khởi tạo trong Java

"Trong Java, phương thức khởi tạo là một phương thức đặc biệt, khi một lớp được khởi tạo, nó sẽ gọi phương thức khởi tạo. Chỉ khi phương thức khởi tạo được gọi, đối tượng mới được cấp phát bộ nhớ. Mỗi khi sử dụng từ khóa `new` để tạo đối tượng, phương thức khởi tạo sẽ được gọi ít nhất một lần."

"Nếu em không thấy phương thức khởi tạo trong một lớp, không phải vì nó không tồn tại, mà là do được mặc định, trình biên dịch sẽ cung cấp một phương thức khởi tạo mặc định cho lớp đó. Có nghĩa là, Java có hai loại phương thức khởi tạo: **phương thức khởi tạo không tham số và phương thức khởi tạo có tham số**."

"Lưu ý, sở dĩ gọi nó là phương thức khởi tạo vì khi tạo đối tượng, cần phải thông qua phương thức khởi tạo để khởi tạo giá trị - mô tả trạng thái khởi tạo của đối tượng."

### 01. Quy tắc tạo phương thức khởi tạo

Phương thức khởi tạo phải tuân theo các quy tắc sau:

- Tên của phương thức khởi tạo phải giống với tên của lớp.
- Phương thức khởi tạo không có kiểu trả về, bao gồm cả `void`.
- Phương thức khởi tạo không thể là trừu tượng (abstract), tĩnh (static), cuối cùng (final), hoặc đồng bộ (synchronized).

Phân tích đơn giản về quy tắc cuối cùng:

- Do phương thức khởi tạo không thể được thừa kế bởi các lớp con, nên việc sử dụng từ khóa `final` và `abstract` không có ý nghĩa.
- Phương thức khởi tạo được sử dụng để khởi tạo một đối tượng, nên việc sử dụng từ khóa `static` không có ý nghĩa.
- Nhiều luồng (threads) không đồng thời tạo ra cùng một đối tượng có địa chỉ bộ nhớ giống nhau, nên việc sử dụng từ khóa `synchronized` là không cần thiết.

Cú pháp của phương thức khởi tạo như sau:

```java
class class_name {
    public class_name(){}    // Phương thức khởi tạo không tham số mặc định
    public class_name([paramList]){}    // Phương thức khởi tạo có danh sách tham số
    …
    // Thân lớp
}
```

Đáng lưu ý là nếu bạn dùng từ khóa `void` để khai báo phương thức khởi tạo, mã sẽ không báo lỗi khi biên dịch, nhưng Java sẽ xử lý "phương thức khởi tạo" này như một phương thức thông thường.

```java
public class Demo {
    void Demo(){ }
}
```

`void Demo(){}` nhìn có vẻ giống cách viết phương thức khởi tạo (cùng tên với lớp), nhưng thực ra chỉ là một phương thức thông thường không tuân thủ quy tắc. Tên phương thức có chữ cái đầu viết hoa và thân phương thức rỗng, nó không phải là phương thức khởi tạo không tham số mặc định. Có thể kiểm chứng qua mã bytecode sau khi dịch ngược.

```java
public class Demo {
    public Demo() {
    }

    void Demo() {
    }
}
```

`public Demo() {}` mới thực sự là phương thức khởi tạo không tham số.

Tuy nhiên, bạn có thể sử dụng các từ khóa sửa đổi quyền truy cập (private, protected, public, default) để sửa đổi phương thức khởi tạo, các từ khóa sửa đổi quyền truy cập quyết định cách phương thức khởi tạo được tạo ra.

### 02. Phương thức khởi tạo mặc định

Nếu một phương thức khởi tạo không có bất kỳ tham số nào, thì nó được gọi là phương thức khởi tạo mặc định, hay còn gọi là phương thức khởi tạo không tham số.

```java
public class Bike {
    Bike(){
        System.out.println("Một chiếc xe đạp đã được tạo ra");
    }

    public static void main(String[] args) {
        Bike bike = new Bike();
    }
}
```

Trong ví dụ trên, chúng ta đã tạo một phương thức khởi tạo không tham số cho lớp `Bike`, nó sẽ được gọi khi chúng ta tạo đối tượng.

Kết quả của chương trình như sau:

```
Một chiếc xe đạp đã được tạo ra
```

Thông thường, phương thức khởi tạo không tham số có thể được bỏ qua, lập trình viên không cần phải khai báo tường minh phương thức khởi tạo không tham số, công việc này sẽ được giao cho trình biên dịch.

Mục đích của phương thức khởi tạo mặc định là gì? Tại sao nó lại trống rỗng như vậy?

Mục đích của phương thức khởi tạo mặc định chủ yếu là để cung cấp giá trị mặc định cho các trường của đối tượng. Nhìn vào ví dụ dưới đây bạn sẽ hiểu ngay thôi.

```java
public class Person {
    private String name;
    private int age;

    public static void main(String[] args) {
        Person p = new Person();
        System.out.println("Tên: " + p.name + " Tuổi: " + p.age);
    }
}
```

Kết quả đầu ra như sau:

```
Tên: null Tuổi: 0
```

Trong ví dụ trên, phương thức khởi tạo mặc định đã khởi tạo các giá trị cho `name` và `age`. `name` là kiểu `String` nên giá trị mặc định là `null`, `age` là kiểu `int` nên giá trị mặc định là `0`. Nếu không có phương thức khởi tạo mặc định, công việc này sẽ không thể hoàn thành được.

### 03. Phương thức khởi tạo có tham số

Phương thức khởi tạo có tham số là phương thức khởi tạo nhận các tham số để khởi tạo giá trị cho các thuộc tính của đối tượng. Phương thức khởi tạo có tham số có thể có một hoặc nhiều tham số. Nó cho phép cung cấp các giá trị khác nhau cho các đối tượng khác nhau khi chúng được tạo ra. Tất nhiên, cũng có thể cung cấp các giá trị giống nhau.

```java
public class ParamConstructorPerson {
    private String name;
    private int age;

    public ParamConstructorPerson(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void out() {
        System.out.println("Tên: " + name + " Tuổi: " + age);
    }

    public static void main(String[] args) {
        ParamConstructorPerson p1 = new ParamConstructorPerson("Hung", 18);
        p1.out();

        ParamConstructorPerson p2 = new ParamConstructorPerson("An", 16);
        p2.out();
    }
}
```

Trong ví dụ trên, phương thức khởi tạo có hai tham số (name và age). Điều này cho phép chúng ta gán giá trị trực tiếp cho name và age khi tạo đối tượng.

```java
new ParamConstructorPerson("Hung", 18);
new ParamConstructorPerson("An", 16);
```

Nếu không có phương thức khởi tạo có tham số, chúng ta sẽ cần sử dụng các phương thức setter để gán giá trị cho các thuộc tính.

```java
public class ParamConstructorPerson {
    private String name;
    private int age;

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void out() {
        System.out.println("Tên: " + name + " Tuổi: " + age);
    }

    public static void main(String[] args) {
        ParamConstructorPerson p1 = new ParamConstructorPerson();
        p1.setName("Hung");
        p1.setAge(18);
        p1.out();

        ParamConstructorPerson p2 = new ParamConstructorPerson();
        p2.setName("An");
        p2.setAge(16);
        p2.out();
    }
}
```

Sử dụng phương thức khởi tạo có tham số giúp mã nguồn ngắn gọn hơn và dễ hiểu hơn, đặc biệt khi khởi tạo đối tượng với nhiều thuộc tính.

### 04. Nạp chồng phương thức khởi tạo

Trong Java, phương thức khởi tạo có thể được nạp chồng giống như các phương thức khác, ngoại trừ việc nó không có kiểu trả về. Nạp chồng phương thức khởi tạo cho phép bạn tạo nhiều phiên bản của phương thức khởi tạo với các tham số khác nhau. Trình biên dịch sẽ quyết định phương thức khởi tạo nào được gọi dựa trên số lượng và kiểu của các tham số.

```java
public class OverloadingConstructorPerson {
    private String name;
    private int age;
    private int sex;

    // Phương thức khởi tạo với 3 tham số
    public OverloadingConstructorPerson(String name, int age, int sex) {
        this.name = name;
        this.age = age;
        this.sex = sex;
    }

    // Phương thức khởi tạo với 2 tham số
    public OverloadingConstructorPerson(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void out() {
        System.out.println("Tên: " + name + " Tuổi: " + age + " Giới tính: " + sex);
    }

    public static void main(String[] args) {
        // Gọi phương thức khởi tạo với 3 tham số
        OverloadingConstructorPerson p1 = new OverloadingConstructorPerson("Hung", 18, 1);
        p1.out();

        // Gọi phương thức khởi tạo với 2 tham số
        OverloadingConstructorPerson p2 = new OverloadingConstructorPerson("An", 16);
        p2.out();
    }
}
```

Khi tạo đối tượng, nếu truyền vào ba tham số, phương thức khởi tạo `OverloadingConstructorPerson(String name, int age, int sex)` sẽ được gọi. Nếu truyền vào hai tham số, phương thức khởi tạo `OverloadingConstructorPerson(String name, int age)` sẽ được gọi.

### 05. Sự khác biệt giữa phương thức khởi tạo và phương thức

|                | Constructor                                                                                   | Method                                                                                  |
| -------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Tên            | Phải có tên giống với tên của lớp                                                             | Có thể có bất kỳ tên định danh hợp lệ nào                                               |
| Kiểu trả về    | Không có kiểu trả về                                                                          | Có thể có bất kỳ kiểu trả về nào hợp lệ                                                 |
| Gọi            | Được gọi tự động khi một đối tượng được khởi tạo bằng từ khóa `new`                           | Phải được gọi một cách rõ ràng từ một phương thức khác hoặc từ bên ngoài lớp            |
| Mục đích chính | Được sử dụng để khởi tạo giá trị ban đầu cho các đối tượng                                    | Phương thức thông thường được sử dụng để triển khai các hành động hoặc tính toán cụ thể |
| Nạp chồng      | Có thể được nạp chồng bằng cách cung cấp nhiều phiên bản với các danh sách tham số khác nhau. | Cũng có thể được nạp chồng nhưng phải khác nhau về danh sách tham số hoặc kiểu trả về   |
### 06. Sao chép đối tượng

Để sao chép một đối tượng trong Java, bạn có thể sử dụng ba cách sau đây:

- Thông qua hàm tạo
- Truyền giá trị của đối tượng
- Thông qua phương thức `clone()` của lớp Object
#### 1) Sử dụng phương thức khởi tạo

Bạn có thể tạo một constructor để sao chép các giá trị từ một đối tượng đã có.

```java
public class CopyConstructorPerson {
    private String name;
    private int age;

    // Constructor chính
    public CopyConstructorPerson(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Constructor sao chép
    public CopyConstructorPerson(CopyConstructorPerson person) {
        this.name = person.name;
        this.age = person.age;
    }

    public void out() {
        System.out.println("Họ tên: " + name + ", Tuổi: " + age);
    }

    public static void main(String[] args) {
        CopyConstructorPerson p1 = new CopyConstructorPerson("Hung", 18);
        p1.out();

        CopyConstructorPerson p2 = new CopyConstructorPerson(p1); // Sao chép từ p1
        p2.out();
    }
}
```

Trong ví dụ trên, constructor thứ hai (`CopyConstructorPerson(CopyConstructorPerson person)`) nhận một tham số là một đối tượng `CopyConstructorPerson`, và nó sử dụng các giá trị từ đối tượng này để khởi tạo một đối tượng mới. Khi tạo `p2` từ `p1`, các giá trị của `p1` được sao chép sang `p2`.

#### 2. Sử dụng giá trị của đối tượng

```java
public class CopyValuePerson {
    private String name;
    private int age;

    public CopyValuePerson(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public CopyValuePerson() {
    }

    public void out() {
        System.out.println("Họ tên: " + name + ", Tuổi: " + age);
    }

    public static void main(String[] args) {
        CopyValuePerson p1 = new CopyValuePerson("Hung", 18);
        p1.out();

        CopyValuePerson p2 = new CopyValuePerson();
        p2.name = p1.name; // Sao chép giá trị của p1 sang p2
        p2.age = p1.age;

        p2.out();
    }
}
```

Trong ví dụ này, chúng ta đã sao chép giá trị của `p1` sang `p2` bằng cách gán từng trường dữ liệu của `p1` cho `p2` (`p2.name = p1.name` và `p2.age = p1.age`). Đây là cách đơn giản để sao chép giá trị từ một đối tượng sang một đối tượng khác.

#### 3. Sử dụng phương thức `clone()` của lớp `Object`

```java
public class ClonePerson implements Cloneable {
    private String name;
    private int age;

    public ClonePerson(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public void out() {
        System.out.println("Họ tên: " + name + ", Tuổi: " + age);
    }

    public static void main(String[] args) throws CloneNotSupportedException {
        ClonePerson p1 = new ClonePerson("Hung", 18);
        p1.out();

        ClonePerson p2 = (ClonePerson) p1.clone(); // Sử dụng clone để sao chép đối tượng
        p2.out();
    }
}
```

Trong ví dụ này, lớp `ClonePerson` đã triển khai interface `Cloneable` và viết lại phương thức `clone()`. Phương thức `clone()` sử dụng phương pháp sao chép mặc định của Java để tạo một bản sao của đối tượng. Việc sao chép này sẽ tạo ra một đối tượng mới với các giá trị giống hệt đối tượng gốc.
