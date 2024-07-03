---
title: Java Method
tags:
  - java
categories:
  - java
order: 4
---
# Java Method


### 01. Phương thức trong Java là gì?

Phương thức trong Java được sử dụng để tăng cường tính tái sử dụng của mã nguồn. Chúng ta chỉ cần viết một lần và có thể sử dụng nhiều lần. Bằng cách thêm hoặc xóa một phần mã trong phương thức, ta có thể nâng cao tính đọc hiểu của toàn bộ mã nguồn.

Phương thức chỉ được thực thi khi được gọi. Phương thức nổi tiếng nhất trong Java là phương thức `main()`, là điểm vào của mọi chương trình.

### 02. Làm thế nào để khai báo một phương thức?

Khai báo của một phương thức phản ánh một số thông tin như quyền truy cập, kiểu trả về, tên phương thức và tham số.

**Quyền truy cập**: Xác định mức độ truy cập của phương thức. Java cung cấp bốn từ khoá quyền truy cập:

- **public**: Phương thức có thể được truy cập từ mọi lớp.
- **private**: Phương thức chỉ có thể được truy cập từ lớp định nghĩa nó.
- **protected**: Phương thức có thể được truy cập từ lớp cùng gói hoặc từ các lớp con trong các gói khác.
- **default**: Nếu một phương thức không có từ khoá quyền truy cập nào, nó chỉ có thể được truy cập từ các lớp trong cùng gói.

**Kiểu trả về**: Loại dữ liệu mà phương thức trả về, có thể là kiểu dữ liệu cơ bản, đối tượng hoặc các cấu trúc dữ liệu. Nếu không cần trả về dữ liệu, sử dụng từ khoá `void`.

**Tên phương thức**: Tên của phương thức nên phản ánh chức năng của nó. Ví dụ, nếu ta muốn tạo một phương thức để trừ hai số, tên phương thức nên là `subtract`.

Tên phương thức nên là một động từ và bắt đầu bằng chữ thường. Nếu tên phương thức có hai từ trở lên, từ đầu tiên nên là động từ, tiếp theo có thể là tính từ hoặc danh từ và được đặt tên theo kiểu chữ hoa đầu từng từ (camel case). Ví dụ:

- Tên phương thức một từ: `sum()`
- Tên phương thức nhiều từ: `stringComparison()`

Một phương thức có thể có cùng tên với một phương thức khác trong cùng một lớp, điều này được gọi là đa nạng phương thức.

**Tham số**: Các tham số được đặt trong dấu ngoặc đơn, nếu có nhiều tham số, chúng được phân cách bằng dấu phẩy. Mỗi tham số bao gồm kiểu dữ liệu và tên tham số. Nếu phương thức không có tham số, dấu ngoặc đơn là trống.

**Chữ ký phương thức**: Mỗi phương thức đều có một chữ ký, bao gồm tên phương thức và các tham số.

**Thân phương thức**: Thân của phương thức nằm trong cặp dấu ngoặc nhọn, chứa mã lệnh để thực hiện một nhiệm vụ cụ thể.

### 03. Các loại phương thức trong Java?

Phương thức trong Java có thể được chia thành hai loại chính: phương thức được định nghĩa sẵn và phương thức người dùng tự định nghĩa.

#### **1) Phương thức được định nghĩa sẵn**

Java cung cấp nhiều phương thức được định nghĩa sẵn để chúng ta có thể gọi và sử dụng, cũng được gọi là phương thức thư viện chuẩn hoặc phương thức tích hợp sẵn. Ví dụ như phương thức `length()`, `equals()`, `compare()` của lớp `String`, và phương thức `println()` mà chúng ta thường sử dụng trong giai đoạn học Java để in thông tin ra màn hình.

```java
public class PredefinedMethodDemo {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

Trong đoạn mã trên, chúng ta sử dụng hai phương thức được định nghĩa sẵn: `main()` là điểm khởi đầu của chương trình và `println()` là một phương thức của lớp `PrintStream`. Những phương thức này đã được định nghĩa trước, do đó chúng ta có thể gọi và sử dụng chúng một cách trực tiếp.

Phương thức `println()` có quyền truy cập là `public`, kiểu trả về là `void`, tên phương thức là `println`, và có tham số `String x`.

Việc có sẵn các phương thức này giúp việc lập trình trở nên đơn giản hơn, chúng ta chỉ cần gọi những phương thức này khi cần thực hiện một số chức năng cụ thể, không cần phải viết lại từ đầu.

Một ưu điểm lớn của Java là các nhà thiết kế JDK đã cung cấp cho chúng ta rất nhiều phương thức thư viện chuẩn, điều này rất thân thiện với những người mới bắt đầu lập trình. Hơn nữa, trên GitHub hoặc các nền tảng khác cũng có rất nhiều thư viện bên thứ ba có thể sử dụng trực tiếp trong môi trường sản xuất, ví dụ như thư viện hutool, các gói của Apache, hay các thư viện do các công ty lớn hàng đầu hoặc các lập trình viên hàng đầu đóng góp như Druid, Gson và nhiều thư viện khác.

Tuy nhiên, nếu bạn muốn từ một lập trình viên mới bắt đầu (thường được gọi là "thợ đụng" vì sử dụng các gói đã có sẵn) tiến lên thành một kỹ sư Java xuất sắc, bạn sẽ cần nghiên cứu sâu hơn vào mã nguồn của các thư viện này và thực hiện tùy biến, ít nhất là có thể tự định nghĩa một số mã nguồn này để có thể sử dụng cho mục đích của mình.
#### **2) Phương thức người dùng tự định nghĩa**

Khi các phương thức được định nghĩa sẵn không đáp ứng được yêu cầu của chúng ta, chúng ta cần tự định nghĩa một số phương thức. Ví dụ như, chúng ta có thể định nghĩa một phương thức để kiểm tra xem một số có phải là số chẵn hay số lẻ như sau:

```java
public class EvenOddDemo {
    public static void main(String[] args) {
        findEvenOdd(10);
        findEvenOdd(11);
    }

    public static void findEvenOdd(int num) {
        if (num % 2 == 0) {
            System.out.println(num + " là số chẵn");
        } else {
            System.out.println(num + " là số lẻ");
        }
    }
}
```

Phương thức có tên là `findEvenOdd`, có quyền truy cập là `public`, là phương thức tĩnh (`static`), kiểu trả về là `void`, và có một tham số kiểu số nguyên (`int num`). Trong phương thức này, chúng ta sử dụng một câu lệnh điều kiện để kiểm tra số `num` là chẵn hay lẻ và in kết quả tương ứng ra màn hình.

Sau khi phương thức được định nghĩa, chúng ta có thể gọi nó trong phương thức `main()` như sau:

```java
findEvenOdd(10);
findEvenOdd(11);
```

Khi một phương thức được đánh dấu bằng từ khóa `static`, đó là một phương thức tĩnh. Nói cách khác, phương thức tĩnh thuộc về lớp, không thuộc về các thể hiện của lớp (không cần phải tạo đối tượng mới bằng `new` để gọi phương thức này, chỉ cần sử dụng tên lớp để gọi).

#### **2）Phương pháp người dùng tự định nghĩa**

Khi các phương pháp được định nghĩa trước không đáp ứng được yêu cầu của chúng ta, chúng ta cần phải tự định nghĩa các phương pháp, ví dụ như việc chúng ta định nghĩa một phương pháp để kiểm tra số là chẵn hay lẻ.

```java
public static void findEvenOdd(int num) {
    if (num % 2 == 0) {
        System.out.println(num + " là số chẵn");
    } else {
        System.out.println(num + " là số lẻ");
    }
}
```

Phương pháp này có tên là `findEvenOdd`, có quyền truy cập là public, và là một phương thức tĩnh (static), có kiểu trả về là void, và có một tham số là một số nguyên (int num). Trong phần thân của phương thức, có một câu lệnh if else để kiểm tra xem số `num` có chia hết cho 2 hay không. Nếu có, nó sẽ in ra rằng số đó là số chẵn, ngược lại sẽ in ra rằng số đó là số lẻ.

Sau khi phương thức được định nghĩa, chúng ta có thể gọi nó như thế nào?

```java
public class EvenOddDemo {
    public static void main(String[] args) {
        findEvenOdd(10);
        findEvenOdd(11);
    }

    public static void findEvenOdd(int num) {
        if (num % 2 == 0) {
            System.out.println(num + " là số chẵn");
        } else {
            System.out.println(num + " là số lẻ");
        }
    }
}
```

Phương thức `main()` là điểm vào của chương trình và cũng là một phương thức tĩnh (static), do đó nó có thể gọi trực tiếp vào phương thức tĩnh `findEvenOdd()`.

Khi một phương thức được đánh dấu bằng từ khóa static, nó là một phương thức tĩnh. Nói cách khác, phương thức tĩnh thuộc về lớp, không thuộc về một thể hiện của lớp (không cần tạo đối tượng mới để gọi nó, có thể gọi trực tiếp thông qua tên lớp).

Đó là cách chúng ta tự định nghĩa và sử dụng phương pháp trong Java để thực hiện các chức năng tùy chỉnh theo yêu cầu của mình.

### 04. Phương thức instance là gì?

Trên Java, các phương thức không được đánh dấu bởi từ khóa `static` được gọi là phương thức thể hiện (instance methods). Để gọi một phương thức instance, bạn cần phải tạo một đối tượng của lớp đó trước, sau đó sử dụng đối tượng đó để gọi phương thức.

#### Ví dụ minh họa:

```java
public class InstanceMethodExample {
    public static void main(String[] args) {
        // Tạo một đối tượng của lớp InstanceMethodExample
        InstanceMethodExample instanceMethodExample = new InstanceMethodExample();
        
        // Gọi phương thức add() của đối tượng instanceMethodExample
        System.out.println(instanceMethodExample.add(1, 2));
    }

    // Định nghĩa phương thức add() là một phương thức thể hiện
    public int add(int a, int b) {
        return a + b;
    }
}
```

Trong ví dụ này, `add()` là một phương thức thể hiện vì nó không được đánh dấu bởi từ khóa `static`. Để gọi `add()`, trước tiên bạn cần phải tạo một đối tượng của lớp `InstanceMethodExample` bằng cách sử dụng `new InstanceMethodExample()`, sau đó mới có thể gọi `instanceMethodExample.add(1, 2)`.

#### Các loại đặc biệt của phương thức instance:

- **Phương thức getter**: Dùng để lấy giá trị của biến private. Thường bắt đầu với "get".
- **Phương thức setter**: Dùng để thiết lập giá trị của biến private. Thường bắt đầu với "set".

#### Ví dụ về sử dụng getter và setter:

```java
/**
 * Đây là một lớp ví dụ về sử dụng getter và setter
 */
public class Person {
    private String name;
    private int age;
    private int sex;

    // Phương thức getter cho biến private 'name'
    public String getName() {
        return name;
    }

    // Phương thức setter cho biến private 'name'
    public void setName(String name) {
        this.name = name;
    }

    // Phương thức getter cho biến private 'age'
    public int getAge() {
        return age;
    }

    // Phương thức setter cho biến private 'age'
    public void setAge(int age) {
        this.age = age;
    }

    // Phương thức getter cho biến private 'sex'
    public int getSex() {
        return sex;
    }

    // Phương thức setter cho biến private 'sex'
    public void setSex(int sex) {
        this.sex = sex;
    }
}
```

Trong ví dụ này, `getName()`, `setName()`, `getAge()`, `setAge()`, `getSex()` và `setSex()` là các phương thức getter và setter. Chúng cho phép truy cập và thiết lập các thuộc tính `name`, `age`, và `sex` của đối tượng `Person`.

Dịch từ tiếng Trung sang tiếng Việt:

### 05. Phương thức tĩnh là gì?

Tương ứng với đó, phương thức được đánh dấu bằng từ khóa `static` được gọi là phương thức tĩnh.

```java
public class StaticMethodExample {
    public static void main(String[] args) {
        System.out.println(add(1,2));
    }

    public static int add(int a, int b) {
        return a + b;
    }
}
```

Trong lớp `StaticMethodExample`, `main` và `add` là các phương thức tĩnh. Khác với `main`, phương thức `main` là điểm vào chương trình. Khi gọi phương thức tĩnh, không cần tạo đối tượng của lớp, bạn có thể gọi phương thức tĩnh trực tiếp. Một số phương thức của lớp công cụ là phương thức tĩnh, ví dụ như thư viện công cụ Hutool, trong đó có rất nhiều phương thức tĩnh có thể gọi trực tiếp.

> Mục tiêu của Hutool là sử dụng một phương thức công cụ thay thế cho đoạn mã phức tạp, từ đó tối đa hóa việc tránh vấn đề "sao chép và dán" mã, hoàn toàn thay đổi cách chúng ta viết mã.

Ví dụ tính toán MD5:

- 👴【Trước đây】Mở công cụ tìm kiếm -> Tìm "mã hóa MD5 Java" -> Mở một bài blog nào đó-> Sao chép và dán -> Sửa đổi để sử dụng
- 👦【Bây giờ】Import Hutool -> SecureUtil.md5()

Sự hiện diện của Hutool là để giảm chi phí tìm kiếm mã, tránh bug do đoạn mã không đồng nhất từ Internet.

### 06. Phương thức trừu tượng là gì?

Phương thức không có thân hàm được gọi là phương thức trừu tượng, thường được khai báo trong lớp trừu tượng. Điều này có nghĩa là nếu một lớp có phương thức trừu tượng, lớp đó phải là lớp trừu tượng. Có thể sử dụng từ khóa `abstract` để tạo phương thức trừu tượng và lớp trừu tượng.

```java
abstract class AbstractDemo {
    abstract void display();
}
```

Khi một lớp kế thừa lớp trừu tượng, nó phải ghi đè phương thức trừu tượng:

```java
public class MyAbstractDemo extends AbstractDemo {
    @Override
    void display() {
        System.out.println("Đã ghi đè phương thức trừu tượng");
    }

    public static void main(String[] args) {
        MyAbstractDemo myAbstractDemo = new MyAbstractDemo();
        myAbstractDemo.display();
    }
}
```

Kết quả đầu ra sẽ là:

```
Đã ghi đè phương thức trừu tượng
```

Về phần phương thức, chúng ta đã nói đủ rồi. Khi đã biết về lớp/biến/phương thức, bạn đã có thể làm một lập trình viên Java cấp nhập môn rồi.
