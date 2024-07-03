---
title: Instance Initializer Block
tags:
  - java
categories:
  - java
order: 8
---
# Instance Initializer Block

Khối khởi tạo mã (Instance Initializer Block) được sử dụng để khởi tạo một số biến thành viên. Đối tượng được tạo ra sẽ thực hiện khối khởi tạo mã, còn được gọi là khối khởi tạo, để phân biệt nó với khối khởi tạo tĩnh.

Chúng ta có thể khởi tạo biến thành viên trực tiếp bằng toán tử '=' nhưng khối khởi tạo mã có thể làm nhiều hơn thế, ví dụ như in ra giá trị khởi tạo của biến thành viên.

Hãy xem đoạn mã dưới đây, chúng ta có thể khởi tạo biến thành viên trực tiếp bằng toán tử '='.

```java
class Bike{  
    int speed=100;  
}  
```

Chúng ta có thể thực hiện các hoạt động phức tạp hơn thông qua khối khởi tạo mã, ví dụ như điền giá trị cho collection. Hãy xem đoạn mã dưới đây:

```java
public class Bike {
    List<String> list;

    {
        list = new ArrayList<>();
        list.add("bike1");
        list.add("bike2");
    }

    public static void main(String[] args) {
        System.out.println(new Bike().list);
    }
}
```

"Nếu chỉ sử dụng toán tử '=' thì không thể hoàn thành việc điền giá trị cho bộ sưu tập, đúng không? Khối khởi tạo mã sẽ hoàn thành công việc này."

Quá trình khởi tạo phương thức hay khối khởi tạo mã trước,?

Hãy xem ví dụ dưới đây:

```java
public class Car {
    Car() {
        System.out.println("Phương thức khởi tạo");
    }

    {
        System.out.println("Khối khởi tạo mã");
    }

    public static void main(String[] args) {
        new Car();
    }
}
```

Chúng ta hãy xem kết quả của chương trình để hiểu ngay

```
Khối khởi tạo mã
Phương thức khởi tạo
```

Từ kết quả này, có vẻ như khối khởi tạo mã thực thi sớm hơn.

Khi một đối tượng khởi tạo, thực sự nó trước tiên gọi phương thức khởi tạo mà không có bất kỳ nghi ngờ nào. Tuy nhiên, phương thức khởi tạo đặt khối khởi tạo mã vào đầu các câu lệnh khác trong phương thức khởi tạo, vì vậy chúng ta thấy 'Khối khởi tạo mã' đầu tiên và sau đó là 'Phương thức khởi tạo.'
Đối với khối khởi tạo mã, có ba quy tắc:

- Khối khởi tạo mã được thực thi khi một thể hiện của lớp được tạo.
- Thực tế, khối khởi tạo mã được thực thi trong phương thức khởi tạo, chỉ đặt gần phần đầu.
- Các câu lệnh trong khối khởi tạo mã được thực thi theo thứ tự từ trên xuống dưới.

"Các quy tắc này không cần phải nhớ thuộc lòng từng từ; chỉ cần hiểu chung. Bây giờ chúng ta tiếp tục với đoạn mã sau:

```java
class A {
    A () {
        System.out.println("Phương thức khởi tạo lớp cha");
    }
}
public class B extends A {
    B() {
        System.out.println("Phương thức khởi tạo lớp con");
    }

    {
        System.out.println("Khối khởi tạo mã");
    }

    public static void main(String[] args) {
        new B();
    }
}
```

"Hãy xem kết quả."

```
Phương thức khởi tạo lớp cha
Khối khởi tạo mã
Phương thức khởi tạo lớp con
```

Mặc định, khi phương thức khởi tạo của lớp con thực thi, nó tự động gọi phương thức khởi tạo của lớp cha. Nói cách khác, phương thức khởi tạo thực thi trước và sau đó là khối khởi tạo mã.

“Đây là một ví dụ khẳng định lại quy tắc thứ hai đã đề cập trước đó: Khối khởi tạo mã được thực thi trong phương thức khởi tạo, chỉ là nằm ở phía trước.”

Ngoài việc khởi tạo khối mã này khi khởi tạo một đối tượng, còn có khởi tạo tĩnh, nhưng chúng ta sẽ đề cập đến từ khóa **static** sau này. Hiện tại, chúng ta hãy hiểu về nó một cách chung.

Dưới đây là một ví dụ Java, minh họa cách sử dụng khối khởi tạo thực thể và khối khởi tạo tĩnh:

```java
public class Example {
    // Biến tĩnh
    public static int staticVar = 1;
    // Biến thực thể
    public int instanceVar = 2;

    // Khối khởi tạo tĩnh
    static {
        System.out.println("Thực thi khối khởi tạo tĩnh");
        staticVar = 3;
    }

    // Khối khởi tạo thực thể
    {
        System.out.println("Thực thi khối khởi tạo thực thể");
        instanceVar = 4;
    }

    // Phương thức khởi tạo
    public Example() {
        System.out.println("Thực thi phương thức khởi tạo");
    }

    public static void main(String[] args) {
        System.out.println("Thực thi phương thức main");

        Example e1 = new Example();
        Example e2 = new Example();

        System.out.println("Biến tĩnh của e1: " + e1.staticVar);
        System.out.println("Biến thực thể của e1: " + e1.instanceVar);
        System.out.println("Biến tĩnh của e2: " + e2.staticVar);
        System.out.println("Biến thực thể của e2: " + e2.instanceVar);
    }
}
```

Trong đoạn mã ví dụ này, có một biến tĩnh staticVar và một biến thực thể instanceVar, cùng với một khối khởi tạo tĩnh và một khối khởi tạo thực thể. Trong khối khởi tạo tĩnh, chúng ta in ra một thông báo và thay đổi giá trị của biến tĩnh; trong khối khởi tạo thực thể, chúng ta cũng in ra một thông báo và thay đổi giá trị của biến thực thể.

Hãy xem kết quả thực thi:

```
Thực thi khối khởi tạo tĩnh
Thực thi phương thức main
Thực thi khối khởi tạo thực thể
Thực thi phương thức khởi tạo
Thực thi khối khởi tạo thực thể
Thực thi phương thức khởi tạo
Biến tĩnh của e1: 3
Biến thực thể của e1: 4
Biến tĩnh của e2: 3
Biến thực thể của e2: 4
```

Từ kết quả xuất ra, chúng ta có thể thấy rằng khối khởi tạo tĩnh được thực thi khi lớp được tải, chỉ thực thi một lần và được thực hiện trước khối khởi tạo thực thể và phương thức khởi tạo; khối khởi tạo thực thể được thực thi mỗi khi một đối tượng được tạo ra, trước khi phương thức khởi tạo được thực thi.