---
title: Java 48 Keywords
tags: ['java']
categories: ['java']
date created: 2024-04-27
date modified: 2024-04-28
order: 1
---

# Java 48 Keywords

> PS: Ở đây chúng ta sẽ tóm tắt theo thứ tự từ điên của các chữ cái đầu để bạn hiểu một cách đơn giản, không nhớ cũng không sao đâu nhé. Các từ khóa này chúng tôi sẽ giải thích chi tiết trong các bài tiếp theo, cho đến khi bạn hiểu được.

## 1. abstract:

Được sử dụng để khai báo lớp trừu tượng, cũng như phương thức trừu tượng.

```java
abstract class Animal {
    abstract void makeSound();

    public void sleep() {
        System.out.println("The animal is sleeping.");
    }
}

class Dog extends Animal {
    void makeSound() {
        System.out.println("The dog barks.");
    }
}
```

Trong ví dụ này, chúng ta tạo ra một lớp trừu tượng có tên là Animal, bao gồm một phương thức trừu tượng `makeSound()` và một phương thức `sleep()`.

## 2. boolean:

boolean là một kiểu dữ liệu cơ bản trong Java, đại diện cho giá trị logic, tức là true (đúng) hoặc false (sai). Kiểu dữ liệu boolean thường được sử dụng trong các điều kiện kiểm tra, kiểm soát vòng lặp và các phép toán logic.

```java
boolean isStudent = true;

if (isStudent) {
    System.out.println("This person is a student.");
} else {
    System.out.println("This person is not a student.");
}
```

Trong ví dụ này, chúng ta định nghĩa một biến boolean: isStudent. Thông qua câu lệnh if, chúng ta có thể thực hiện các hành động khác nhau dựa trên giá trị của biến này.

## 3. break:

break được sử dụng để thoát khỏi cấu trúc vòng lặp (như for, while và do-while) hoặc câu lệnh switch. Khi gặp câu lệnh break, chương trình sẽ ngay lập tức thoát khỏi vòng lặp hoặc câu lệnh switch hiện tại, tiếp tục thực thi mã nguồn nằm ngay sau vòng lặp hoặc câu lệnh switch.

```java
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;
    }
    System.out.println("i: " + i);
}
System.out.println("Loop ended.");
```

Trong ví dụ này, chúng ta sử dụng vòng lặp for để duyệt từ 0 đến 9. Khi i bằng 5, chúng ta sử dụng câu lệnh break để thoát khỏi vòng lặp.

## 4. byte:

byte được sử dụng để đại diện cho một số nguyên có dấu 8 bit (1 byte). Phạm vi giá trị của nó là từ -128 (-2^7) đến 127 (2^7 - 1).

Do byte chiếm ít không gian, nó thường được sử dụng trong xử lý lượng lớn dữ liệu như đọc/ghi tệp, truyền thông qua mạng để tiết kiệm không gian bộ nhớ.

```java
byte minByte = -128;
byte maxByte = 127;
```

Trong ví dụ này, chúng ta khai báo ba biến kiểu byte: minByte, maxByte, và gán giá trị khác nhau cho mỗi biến.

## 5.case:

case thường được sử dụng cùng với câu lệnh switch. Câu lệnh switch cho phép chọn lựa thực thi các khối mã khác nhau dựa trên giá trị của một biến nào đó. Trong câu lệnh switch, case được sử dụng để đánh dấu mỗi giá trị có thể và mã nguồn tương ứng.

Ví dụ sẽ được giải thích trong phần về câu lệnh switch.

## 6. catch：

Được sử dụng để bắt lấy các Exception trong các câu lệnh try. Trong khối try có thể xảy ra các ngoại lệ và trong khối catch có thể bắt lấy các ngoại lệ này và xử lý chúng. Mỗi khối catch có thể có nhiều khối, mỗi khối catch có thể bắt lấy các loại ngoại lệ cụ thể. Trong khối catch, bạn có thể xử lý các ngoại lệ theo cách bạn muốn, ví dụ như xuất thông báo lỗi, ghi nhật ký, phục hồi trạng thái chương trình, v.v.

```java
try {
    int num = Integer.parseInt("abc");
} catch (NumberFormatException e) {
    System.out.println("Invalid number format");
}
```

Chương trình này sử dụng câu lệnh try-catch để bắt lấy ngoại lệ NumberFormatException. Trong khối try, chương trình cố gắng chuyển đổi chuỗi "abc" thành số nguyên, do chuỗi này không phải là định dạng số hợp lệ, nên sẽ ném ra ngoại lệ NumberFormatException. Trong khối catch, ngoại lệ này được bắt lấy và một thông báo lỗi được xuất ra.

## 7. char：

Được sử dụng để khai báo một biến có kiểu ký tự. Biến kiểu char có thể lưu trữ bất kỳ ký tự Unicode nào và có thể sử dụng dấu nháy đơn để bao quanh ký tự.

```java
char c = 'A';
```

Chương trình này tạo ra một biến kiểu char có tên c và gán giá trị là ký tự A in hoa.

## 8. class：

Được sử dụng để khai báo một class.

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void sayHello() {
        System.out.println("Hello, my name is " + name + " and I am " + age + " years old.");
    }
}
```

## 9. continue：

Được sử dụng để tiếp tục vòng lặp tiếp theo, có thể bỏ qua các đoạn mã còn lại trong một điều kiện nhất định.

```java
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue;
    }
    System.out.println(i);
}
```

## 10. default：

Được sử dụng để chỉ định khối mã mặc định trong một câu lệnh switch ngoại trừ các điều kiện case. Chúng ta sẽ thảo luận về điều này trong một ví dụ switch.

## 11. do：

Thường được sử dụng kết hợp với từ khóa while, sau do là thân vòng lặp.

```java
int i = 1;
do {
    System.out.println(i);
    i++;
} while (i <= 10);
```

Vòng lặp do-while tương tự như vòng lặp while, khác biệt ở chỗ vòng lặp do-while sẽ thực hiện các lệnh trong thân vòng lặp trước, sau đó mới kiểm tra điều kiện vòng lặp. Do đó, vòng lặp do-while ít nhất cũng sẽ thực hiện một lần lặp.

## 12. double：

Được sử dụng để khai báo một biến kiểu số thực độ chính xác kép.

```java
double a = 3.14;
double b = 2.0;
double c = a + b;
```

## 13. else：

Được sử dụng để chỉ định nhánh phụ trong câu lệnh if.

```java
int score = 75;
if (score >= 60) {
    System.out.println("Đạt");
} else {
    System.out.println("Trượt");
}
```

## 14. enum：

Được sử dụng để định nghĩa một nhóm hằng số cố định ([enum](https://javabetter.cn/basic-extra-meal/enum.html)).

```java
public enum PlayerType {
    TENNIS,
    FOOTBALL,
    BASKETBALL
}
```

## 15. extends：

Được sử dụng để chỉ ra một lớp được kế thừa từ một lớp hoặc giao diện khác ([kế thừa](https://javabetter.cn/oo/extends-bigsai.html)).

```java
class Animal {
    public void eat() {
        System.out.println("Động vật đang ăn");
    }
}

class Dog extends Animal {
    public void bark() {
        System.out.println("Con chó sủa");
    }
}

public class ExtendsDemo {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.eat();
        dog.bark();
    }
}
```

Trong lớp Animal có một phương thức `eat()`, in ra chuỗi "Động vật đang ăn". Lớp Dog kế thừa từ lớp Animal và định nghĩa một phương thức `bark()`, in ra chuỗi "Con chó sủa".

## 16. final：

Được sử dụng để chỉ ra rằng một biến, phương thức hoặc lớp là cuối cùng, không thể được thay đổi hoặc kế thừa.

①. Biến final: Đại diện cho một hằng số, một khi được gán giá trị, giá trị đó không thể thay đổi. Điều này rất hữu ích khi khai báo các giá trị không thể thay đổi.

```java
final double PI = 3.14159265359;
```

②. Phương thức final: Đại diện cho một phương thức không thể được ghi đè bởi lớp con. Điều này rất hữu ích khi thiết kế lớp để đảm bảo rằng một phương thức sẽ không bị thay đổi bởi lớp con.

```java
class Animal {
    final void makeSound() {
        System.out.println("Động vật phát ra âm thanh.");
    }
}

class Dog extends Animal {
    // Lỗi: Không thể ghi đè phương thức final từ Animal
    // void makeSound() {
    //     System.out.println("Con chó sủa.");
    // }
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.makeSound();
    }
}
```

③. Lớp final: Đại diện cho một lớp không thể được kế thừa. Điều này rất hữu ích khi thiết kế lớp để đảm bảo rằng nó sẽ không được kế thừa bởi các lớp khác. Lớp String là final.

```java
final class Animal {
    void makeSound() {
        System.out.println("Động vật phát ra âm thanh.");
    }
}

// Lỗi: Không thể kế thừa từ lớp final Animal
// class Dog extends Animal {
//     void makeSound() {
//         System.out.println("Con chó sủa.");
//     }
// }

public class Main {
    public static void main(String[] args) {
        Animal animal = new Animal();
        animal.makeSound();
    }
}
```

## 17. finally：

Kết hợp với `try-catch`, biểu thị rằng mã trong khối finally sẽ luôn được thực thi, bất kể có xử lý ngoại lệ hay không.

```java
try {
    int x = 10 / 0;  // Ném ra một ngoại lệ
} catch (Exception e) {
    System.out.println("Đã xảy ra ngoại lệ: " + e.getMessage());
} finally {
    System.out.println("Khối finally được thực thi");
}
```

## 18. float：

Biểu diễn số thực kiểu đơn (single-precision floating point).

```java
float f1 = 3.14f;   // Chú ý phải thêm f sau số để chỉ ra đây là kiểu float
float f2 = 1.23e-4f;   // Biểu diễn số bằng cách sử dụng ký hiệu quy ước của kỹ thuật số học
```

Trong Java, số thực mặc định là kiểu double. Để sử dụng số thực kiểu float, bạn cần thêm f hoặc F sau số để chỉ ra đây là kiểu dữ liệu float. Ngoài ra, bạn cũng có thể sử dụng ký hiệu quy ước của kỹ thuật số học như 1.23e-4 để biểu diễn số thực.

## 19. for：

Dùng để khai báo vòng lặp for, đặc biệt hữu ích khi số lần lặp là cố định.

```java
int[] arr = {1, 2, 3, 4, 5};
for (int i = 0; i < arr.length; i++) {
    System.out.println("arr[" + i + "] = " + arr[i]);
}
```

## 20. if：

Sử dụng để chỉ định điều kiện, nếu điều kiện đúng, thì mã tương ứng sẽ được thực thi.

```java
int n = -3;
if (n > 0) {
    System.out.println(n + " là số dương");
} else if (n < 0) {
    System.out.println(n + " là số âm");
} else {
    System.out.println(n + " là số không");
}
```

## 21. implements：

Được sử dụng để triển khai một interface

Dưới đây là một ví dụ về một lớp triển khai interface Runnable:

```java
public class MyThread implements Runnable {
    public void run() {
        // Mã thực thi của luồng
    }
}
```

## 22. import：

Được sử dụng để nhập các lớp hoặc interface tương ứng. Ví dụ, nếu bạn muốn sử dụng lớp ArrayList trong thư viện chuẩn của Java, bạn có thể viết như sau:

```java
import java.util.ArrayList;
```

## 23. instanceof：

Được sử dụng để kiểm tra một đối tượng có thuộc về một loại (class) cụ thể hay không.

```java
// Ví dụ, giả sử có một lớp Person và một lớp Student, Student kế thừa từ Person, bạn có thể sử dụng toán tử instanceof để kiểm tra xem một đối tượng có phải là một thể hiện của lớp Person hoặc các lớp con của nó không:
Person p = new Student();
if (p instanceof Person) {
    System.out.println("p là một thể hiện của Person");
}
if (p instanceof Student) {
    System.out.println("p là một thể hiện của Student");
}
```

## 24. int：

Được sử dụng để biểu diễn các giá trị số nguyên.

```java
int x;           // Khai báo một biến kiểu int tên là x
x = 10;          // Gán giá trị số nguyên 10 cho biến x
int y = 20;     // Khai báo và khởi tạo một biến kiểu int tên là y, với giá trị là 20
```

## 25. interface：

Được sử dụng để khai báo một interface. Nó sẽ định nghĩa một tập hợp các phương thức (tên phương thức, danh sách tham số và kiểu trả về) mà không có thân phương thức. Các lớp khác có thể thực thi interface này và cung cấp cài đặt cụ thể cho các phương thức.

```java
public interface MyInterface {
    void method1();
    int method2(String param);
}
```

## 26. long：

Được sử dụng để biểu diễn các giá trị số nguyên dài.

```java
long x;           // Khai báo một biến kiểu long tên là x
x = 10000000000L; // Gán giá trị số nguyên dài 10000000000 cho biến x, cần thêm L hoặc l sau số để chỉ ra đây là kiểu long
long y = 20000000000L; // Khai báo và khởi tạo một biến kiểu long tên là y, với giá trị là 20000000000
```

## 27. native：

Được sử dụng để khai báo một phương thức native. Phương thức native là phương thức được khai báo trong mã Java nhưng được cài đặt trong mã native, thường là mã C hoặc C++, và thường được sử dụng để tương tác với hệ điều hành hoặc thư viện native khác.

```java
public native void nativeMethod();
```

## 28. new：

Được sử dụng để tạo một đối tượng mới.

Dưới đây là cú pháp cơ bản để tạo một thể hiện đối tượng bằng từ khóa new:

```java
ClassName obj = new ClassName();
```

Dưới đây là cú pháp cơ bản để tạo một mảng mới bằng từ khóa new:

```java
int[] arr = new int[10];
```

## 29. null：

Nếu một biến là rỗng (không có tham chiếu nào được chỉ định), bạn có thể gán giá trị null cho nó, liên quan mật thiết đến NullPointerException.

```java
String str = null; // Khai báo một tham chiếu chuỗi, khởi tạo là null
MyClass obj = null; // Khai báo một tham chiếu kiểu MyClass, khởi tạo là null
```

## 30. package：

Được sử dụng để khai báo gói (package) chứa các lớp.

```java
package com.example.mypackage;
```

## 31. private：

Một trình điều khiển quyền truy cập, chỉ định rằng phương thức hoặc biến chỉ có thể nhìn thấy bởi lớp hiện tại.

```java
public class MyClass {
    private int x; // Thuộc tính riêng tư x, chỉ có thể truy cập từ bên trong lớp hiện tại

    private void foo() {
        // Phương thức riêng tư foo, chỉ có thể gọi từ bên trong lớp hiện tại
    }
}
```

Trong ví dụ này, lớp MyClass có một thuộc tính riêng tư x và một phương thức riêng tư `foo()`. Những thành viên này chỉ có thể truy cập và gọi từ bên trong lớp MyClass và không thể nhìn thấy từ các lớp khác.

## 32. protected：

Một trình điều khiển quyền truy cập, chỉ định rằng phương thức hoặc biến có thể được truy cập bởi các lớp con và các lớp trong cùng một gói.

```java
package com.example.mypackage;

public class MyBaseClass {
    protected int x; // Thuộc tính được bảo vệ x, có thể truy cập bởi các lớp con và các lớp trong cùng một gói

    protected void foo() {
        // Phương thức được bảo vệ foo, có thể được gọi bởi các lớp con và các lớp trong cùng một gói
    }
}

package com.example.mypackage;

public class MySubClass extends MyBaseClass {
    public void bar() {
        x = 10; // Có thể truy cập vào thuộc tính được bảo vệ x trong MyBaseClass
        foo(); // Có thể gọi phương thức được bảo vệ foo trong MyBaseClass
    }
}
```

Trong ví dụ này, lớp MyBaseClass có một thuộc tính được bảo vệ x và một phương thức được bảo vệ `foo()`. Các thành viên này có thể được truy cập và gọi bởi các lớp con và các lớp trong cùng một gói. Lớp MySubClass kế thừa từ MyBaseClass và có thể truy cập và sử dụng các thành viên được bảo vệ trong MyBaseClass.

## 33. public：

Một trình điều khiển quyền truy cập, chỉ định rằng phương thức hoặc biến có thể được truy cập từ bất kỳ lớp nào.

```java
public class MyClass {
    public int x; // Thuộc tính công cộng x, có thể truy cập từ bất kỳ lớp nào

    public void foo() {
        // Phương thức công cộng foo, có thể gọi từ bất kỳ lớp nào
    }
}
```

Trong ví dụ này, lớp MyClass có một thuộc tính công cộng x và một phương thức công cộng `foo()`. Các thành viên này có thể được truy cập và gọi từ bất kỳ lớp nào, không quan trọng liệu chúng có trong cùng một gói hay không.

## 35. return：

Được sử dụng để trả về một giá trị từ một phương thức hoặc kết thúc thực thi của một phương thức.

```java
public int add(int a, int b) {
    int sum = a + b;
    return sum; // Trả về giá trị của sum và kết thúc thực thi của phương thức
}
```

Ngoài ra, câu lệnh return cũng có thể được sử dụng để kết thúc thực thi của một phương thức sớm. Ví dụ, giả sử chúng ta muốn viết một phương thức để kiểm tra xem một số nguyên có phải là số chẵn hay không:

```java
public static boolean isEven(int number) {
    if (number % 2 == 0) {
        return true;
    }
    return false;
}
```

Trong ví dụ này, chúng ta đã định nghĩa một phương thức có tên là isEven, phương thức này nhận một số nguyên làm đối số. Nếu số đó là số chẵn, chúng ta sử dụng câu lệnh return để trả về true sớm. Nếu không, thực thi sẽ tiếp tục và cuối cùng trả về false.

## 36. short：

Được sử dụng để biểu diễn số nguyên ngắn, chiếm 2 byte (16 bit) trong bộ nhớ.

```java
short x = 10; // Khai báo một biến kiểu short tên là x, gán giá trị là 10
short y = 20; // Khai báo một biến kiểu short tên là y, gán giá trị là 20
```

## 37. static：

Biểu thị rằng biến hoặc phương thức là biến tĩnh hoặc phương thức tĩnh.

```java
public class MyClass {
    public static int x; // Biến tĩnh x, thuộc về thành viên của lớp

    public static void foo() {
        // Phương thức tĩnh foo, thuộc về thành viên của lớp
    }
}
```

Trong ví dụ này, lớp MyClass có một biến tĩnh x và một phương thức tĩnh `foo()`. Những thành viên này thuộc về thành viên của lớp và có thể truy cập thông qua tên của lớp mà không cần tạo đối tượng.

## 38. strictfp：

strict floating-point

strictfp không phổ biến lắm, thường được sử dụng để đánh dấu một phương thức, giới hạn độ chính xác và hành vi làm tròn của các phép tính dấu chấm động. Khi bạn sử dụng strictfp trên một lớp, giao diện hoặc phương thức, tất cả các phép tính dấu chấm động trong phạm vi đó sẽ tuân thủ theo quy định của tiêu chuẩn IEEE 754, để đảm bảo tính nhất quán của các phép tính dấu chấm động trên nhiều nền tảng.

Các nền tảng phần cứng và triển khai JVM khác nhau có thể có sự khác biệt về độ chính xác và hành vi làm tròn của các phép tính dấu chấm động, điều này có thể dẫn đến các kết quả khác nhau khi chạy mã tính toán dấu chấm động giống nhau trên các môi trường khác nhau. Việc sử dụng từ khóa strictfp có thể đảm bảo rằng kết quả của các phép tính dấu chấm động sẽ giống nhau trên tất cả các nền tảng, tránh được sự không nhất quán trong kết quả tính toán.

Tuy nhiên, cần lưu ý rằng việc sử dụng strictfp có thể ảnh hưởng đến hiệu suất, vì có thể cần thêm nhiều phép tính và chuyển đổi để đảm bảo tuân thủ tiêu chuẩn IEEE 754. Do đó, khi sử dụng strictfp, cần cân nhắc sự cân đối giữa độ chính xác và tính nhất quán so với hiệu suất.

```java
public strictfp class MyClass {
    public static void main(String[] args) {
        double a = 0.1;
        double b = 0.2;
        double result = a + b;
        System.out.println("Result: " + result);
    }
}
```

Kết quả:

```
Result: 0.30000000000000004
```

Trong ví dụ này, lớp MyClass được đánh dấu là strictfp, do đó tất cả các phép tính dấu chấm động trong lớp này sẽ tuân thủ theo tiêu chuẩn IEEE 754.

Trên hầu hết các hệ thống hiện đại, việc sử dụng strictfp có thể không tạo ra sự khác biệt đáng kể, vì tất cả đều tuân theo tiêu chuẩn IEEE 754, trừ khi là một số nền tảng phần cứng cũ hơn.

Tiêu chuẩn IEEE 754 (IEEE Standard for Floating-Point Arithmetic) là một tiêu chuẩn quốc tế định nghĩa cách biểu diễn và thực hiện các phép tính dấu chấm động. Tiêu chuẩn này được phát triển bởi Viện Kỹ thuật Điện và Điện tử Quốc tế (IEEE) và được phát hành lần đầu vào năm 1985.

Tiêu chuẩn IEEE 754 chủ yếu định nghĩa các khía cạnh sau:

- Biểu diễn dấu chấm động: Tiêu chuẩn định nghĩa hai định dạng số dấu chấm động, đơn (32 bit) và kép (64 bit). Cả hai định dạng này đều bao gồm dấu, chỉ số và phần đuôi, được sử dụng để biểu diễn kích thước và độ chính xác của số dấu chấm động.
- Làm tròn và các chế độ làm tròn: Tiêu chuẩn định nghĩa nhiều chế độ làm tròn, chẳng hạn như làm tròn đến số gần nhất (Round to Nearest, Ties to Even), làm tròn về số 0 (Round toward Zero), làm tròn về vô cực dương (Round toward +∞) và làm tròn về vô cực âm (Round toward -∞). Các chế độ này chỉ dẫn cách xử lý độ mất mát độ chính xác và lỗi làm tròn trong quá trình tính toán dấu chấm động.
- Giá trị đặc biệt: Tiêu chuẩn định nghĩa một số giá trị dấu chấm động đặc biệt, chẳng hạn như vô cực dương (+∞), vô cực âm (-∞) và không phải số (NaN). Những giá trị đặc biệt này được sử dụng để biểu diễn tràn số, tràn dưới và kết quả không xác định trong các phép tính dấu chấm động.
- Phép tính dấu chấm động: Tiêu chuẩn quy định hành vi và kết quả của các phép tính cơ bản (cộng, trừ, nhân, chia) và phép so sánh (bằng, khác, lớn hơn, nhỏ hơn, lớn hơn hoặc bằng, nhỏ hơn hoặc bằng). Các phép tính này cần tuân theo quy tắc biểu diễn, làm tròn và xử lý giá trị đặc biệt được quy định trong tiêu chuẩn.

Hãy xem một ví dụ:

```java
public class Ieee754Demo {

    public static void main(String[] args) {
        float a = 0.1f;
        float b = 0.2f;
        float c = a + b;

        System.out.println("a = " + a);
        System.out.println("b = " + b);
        System.out.println("c = a + b = " + c);

        double x = 1.0 / 0.0;
        double y = -1.0 / 0.0;
        double z = 0.0 / 0.0;

        System.out.println("x = 1.0 / 0.0 = " + x);
        System.out.println("y = -1.0 / 0.0 = " + y);
        System.out.println("z = 0.0 / 0.0 = " + z);
    }
}
```

Kết quả đầu ra:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240428125225.png)

Chúng ta có thể thấy cách biểu diễn và hoạt động của số dấu chấm động trong tiêu chuẩn IEEE 754:

- Cộng các số dấu chấm động có độ chính xác đơn: biến a và b lưu trữ lần lượt 0,1 và 0,2 và tổng c của chúng bằng 0,3. Do những hạn chế về độ chính xác của cách biểu diễn dấu phẩy động, giá trị thực của c có thể hơi khác so với giá trị lý thuyết.
- Giá trị đặc biệt: Các biến x, y, z lần lượt lưu trữ giá trị dương vô cực (+∞), vô cực âm (-∞) và giá trị không phải số (NaN). Các giá trị đặc biệt này được tạo ra bởi các phép chia và được trả về khi số bị chia bằng 0 hoặc kết quả không thể biểu diễn được.

## 39. super：

Từ khóa `super` được sử dụng để gọi các phương thức hoặc trường từ lớp cha.

```java
class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " is eating.");

    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name); // Gọi constructor của lớp cha
    }

    public void bark() {
        System.out.println(name + " is barking.");

    }

    public void eat() {
        super.eat(); // Gọi phương thức của lớp cha
        System.out.println(name + " is eating bones.");
    }
}
```

## 40. switch：

Lệnh `switch` được sử dụng để chọn một trong nhiều khối mã để thực thi dựa trên giá trị của một biến. Thường được sử dụng cùng với các từ khóa `case` và `default`. Mỗi `case` đại diện cho một giá trị có thể và khối mã tương ứng của nó, trong khi `default` được sử dụng để xử lý các giá trị không được bao gồm trong các điều kiện `case`.

```java
    public static void main(String[] args) {
        int dayOfWeek = 3;

        switch (dayOfWeek) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            case 3:
                System.out.println("Wednesday");
                break;
            case 4:
                System.out.println("Thursday");
                break;
            case 5:
                System.out.println("Friday");
                break;
            case 6:
                System.out.println("Saturday");
                break;
            case 7:
                System.out.println("Sunday");
                break;
            default:
                System.out.println("Invalid day");
                break;
        }
    }
```

Trong ví dụ này, chúng ta xác định một biến số nguyên `dayOfWeek` và gán một giá trị cho nó. Sau đó, chúng ta sử dụng lệnh `switch` để xuất ra ngày của tuần tương ứng dựa trên giá trị của `dayOfWeek`. Mỗi điều kiện `case` đại diện cho một giá trị có thể của `dayOfWeek`, điều này được theo sau bởi mã để thực thi. Lệnh `break` được sử dụng để thoát khỏi lệnh `switch` và tránh thực thi mã trong các điều kiện `case` khác. Nếu giá trị của `dayOfWeek` không phù hợp với bất kỳ điều kiện `case` nào, điều kiện `default` sẽ được thực thi.

## 41. synchronized：

Được sử dụng để chỉ định các phương thức, biến hoặc khối mã đồng thời trong đa luồng.

```java
public class MyClass {
    private int count;

    public synchronized void increment() {
        count++; // Phương thức đồng bộ
    }

    public void doSomething() {
        synchronized(this) { // Khối mã đồng bộ
            // Thực hiện một số hoạt động cần đồng bộ
        }
    }
}
```

## 42. this：

Có thể được sử dụng để tham chiếu đến đối tượng hiện tại trong phương thức hoặc constructor.

```java
public class MyClass {
    private int num;

    public MyClass(int num) {
        this.num = num; // Sử dụng từ khóa this để tham chiếu đến biến thành viên của đối tượng hiện tại
    }

    public void doSomething() {
        System.out.println("Doing something with " + this.num); // Sử dụng từ khóa this để tham chiếu đến biến thành viên của đối tượng hiện tại
    }

    public MyClass getThis() {
        return this; // Trả về đối tượng hiện tại
    }
}
```

Trong ví dụ này, lớp MyClass có một biến thành viên riêng num và định nghĩa một constructor, một phương thức và một phương thức trả về đối tượng hiện tại. Trong constructor, từ khóa this được sử dụng để tham chiếu đến biến thành viên của đối tượng hiện tại và gán giá trị tham số đã được chuyển vào cho biến này. Trong phương thức doSomething(), từ khóa this được sử dụng để tham chiếu đến biến thành viên của đối tượng hiện tại và in ra giá trị của biến này. Trong phương thức getThis(), đối tượng hiện tại được trả về trực tiếp bằng từ khóa this.

## 43. throw：

Ném ra một exception một cách cụ thể.

```java
public class MyClass {
    public void doSomething(int num) throws Exception {
        if (num < 0) {
            throw new Exception("num must be greater than zero"); // Ném ngoại lệ một cách rõ ràng
        }
        // Thực hiện một số hoạt động
    }
}
```

## 44. throws：

Được sử dụng để khai báo ngoại lệ.

```java
public class MyClass {
    public void doSomething(int num) throws Exception {
        if (num < 0) {
            throw new Exception("num must be greater than zero"); // Ném ngoại lệ một cách rõ ràng
        }
        // Thực hiện một số hoạt động
    }
}
```

## 45. transient：

Dùng để đánh dấu các trường không được serialize.

```java
public class MyClass implements Serializable {
    private int id;
    private String name;
    private transient String password;

    public MyClass(int id, String name, String password) {
        this.id = id;
        this.name = name;
        this.password = password;
    }

    // Bỏ qua getter và setter

    @Override
    public String toString() {
        return "MyClass{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
```

Trong ví dụ này, lớp MyClass thực hiện Serializable interface, cho biết các đối tượng của lớp này có thể được serialize. Lớp này có ba trường thành viên, lần lượt là id, name và password. Trong đó, trường password được đánh dấu là transient, điều này có nghĩa là trong quá trình serialize, trường này sẽ bị bỏ qua.

## 46. try：

Dùng để bao quanh các khối mã có thể ném ra ngoại lệ.

```java
try {
    // Mã có thể ném ra ngoại lệ
    int result = 1 / 0;
} catch (Exception e) {
    // Xử lý ngoại lệ
    e.printStackTrace();
}
```

## 47. volatile：

Đảm bảo tính [khả thấy](https://javabetter.cn/thread/volatile.html) của biến mà nó được đánh dấu, có nghĩa là khi một luồng thay đổi giá trị của một biến, giá trị mới là khả thấy ngay lập tức đối với các luồng khác.

```java
public class MyThread extends Thread {
    private volatile boolean running = true;

    @Override
    public void run() {
        while (running) {
            // Mã thực thi của luồng
        }
    }

    public void stopThread() {
        running = false;
    }
}
```

Trong ví dụ này, lớp MyThread kế thừa từ lớp Thread, ghi đè phương thức `run()`. Lớp MyThread có một biến thành viên running, được đánh dấu là volatile, đồng nghĩa với việc biến này là biến dùng chung, có thể được nhiều luồng truy cập cùng lúc. Trong phương thức `run()`, sử dụng vòng lặp while để kiểm tra giá trị của biến running, nếu running là true, thì tiếp tục thực thi mã trong vòng lặp. Trong phương thức `stopThread()`, giá trị của biến running được thiết lập thành false, biểu thị cần dừng luồng.

## 48. while：

Nếu số lần lặp không cố định, khuyến khích sử dụng vòng lặp while.

```java
int i = 0;
while (i < 10) {
    System.out.println(i);
    i++;
}
```

“Vậy là xong rồi, em gái à, về từ khóa trong Java đó thôi đây, chỉ có 48 từ khóa này thôi đó. Đây chỉ là một sơ lược, sau này còn có một số từ khóa đặc biệt sẽ được nói riêng, như static, final và nhiều từ khóa khác nữa. Các từ khóa có liên kết là những từ khóa sẽ được nói chi tiết sau.” Tôi vừa vặn cổ gối cứng lại, tôi nói với em gái.

## 49. goto và const:

"Ngoài những từ khóa này, trong Java còn có hai từ khóa giữ chỗ rất đặc biệt (goto và const), chúng không thể được sử dụng trong chương trình."

"Từ khóa goto trong ngôn ngữ C được gọi là 'lệnh nhảy vô hạn', trong Java, không còn sử dụng lệnh goto nữa, vì lệnh nhảy vô hạn sẽ phá hỏng cấu trúc của chương trình."

Trong Java, thực sự có thể sử dụng nhãn (label) kết hợp với các lệnh break và continue để thực hiện chức năng nhảy tương tự như goto. Dưới đây là một ví dụ đơn giản:

```java
public class LabelDemo {
    public static void main(String[] args) {
        outerLoop:
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (i == 1 && j == 1) {
                    System.out.println("Bỏ qua vòng lặp hiện tại trong outerLoop");
                    continue outerLoop;
                }
                System.out.println("i: " + i + ", j: " + j);
            }
        }
        System.out.println("Kết thúc");
    }
}
```

Trong ví dụ này, chúng ta sử dụng hai vòng lặp lồng nhau. Vòng lặp bên ngoài có một nhãn outerLoop. Khi i bằng 1 và j bằng 1, chúng ta sử dụng lệnh continue outerLoop để bỏ qua vòng lặp bên ngoài hiện tại. Điều này tương tự như hành vi của goto.

Dưới đây là kết quả đầu ra:

```
i: 0, j: 0
i: 0, j: 1
i: 0, j: 2
i: 1, j: 0
Bỏ qua vòng lặp hiện tại trong outerLoop
i: 2, j: 0
i: 2, j: 1
i: 2, j: 2
Kết thúc
```

Mặc dù có thể sử dụng nhãn để thực hiện chức năng nhảy tương tự như goto, nhưng cách sử dụng này vẫn ít được thấy trong Java, vì việc sử dụng quá mức có thể làm cho mã khó hiểu và khó bảo trì. Thông thường, được khuyến khích sử dụng các cấu trúc điều khiển khác (như các câu lệnh if, for và while) để tổ chức mã.

Dưới đây là một ví dụ sử dụng các câu lệnh if và for để thay thế cho nhãn nhảy:

```java
public class IfForDemo {
    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {
            boolean skipIteration = false;
            for (int j = 0; j < 3; j++) {
                if (i == 1 && j == 1) {
                    System.out.println("Bỏ qua vòng lặp hiện tại trong outerLoop");
                    skipIteration = true;
                    break;
                }
                System.out.println("i: " + i + ", j: " + j);
            }
            if (skipIteration) {
                continue;
            }
        }
    }
}
```

Trong ví dụ này, khi i bằng 1 và j bằng 1, chúng ta đặt skipIteration thành true, sau đó sử dụng lệnh break để thoát khỏi vòng lặp bên trong. Trong vòng lặp bên ngoài, chúng ta kiểm tra giá trị của biến skipIteration, nếu là true, thì bỏ qua vòng lặp hiện tại của vòng lặp bên ngoài.

Kết quả đầu ra của ví dụ này giống với ví dụ trước:

```
i: 0, j: 0
i: 0, j: 1
i: 0, j: 2
i: 1, j: 0
Bỏ qua vòng lặp hiện tại trong outerLoop
i: 2, j: 0
i: 2, j: 1
i: 2, j: 2
```

"const trong ngôn ngữ C được sử dụng để khai báo hằng số, trong Java, bạn có thể sử dụng sự kết hợp của ba từ khóa public static final để đạt được tác dụng của một hằng số."

```java
public class Circle {
    public static final double PI = 3.14159;

    public static double calculateArea(double radius) {
        return PI * radius * radius;
    }
}
```

Trong ví dụ này, chúng ta sử dụng kết hợp của từ khóa public static final để định nghĩa một hằng số có tên PI. Bởi vì nó là public, nên các lớp khác có thể truy cập vào hằng số này. Bởi vì nó là static, nên nó liên kết với lớp, chứ không phải là với các thể hiện của lớp. Và bởi vì nó là final, nên giá trị của nó không thể thay đổi.
