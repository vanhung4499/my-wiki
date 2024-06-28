---
title: OOP
tags:
  - java
categories:
  - java
order: 1
---

# Java Object Oriented Programming

### 01. Hướng thủ tục và hướng đối tượng

OOP là gì?

OOP, hay Object Oriented Programming, là một mô hình lập trình, ngược lại với phương pháp lập trình hướng thủ tục. Để hiểu được nó, ta phải hiểu trước khái niệm lập trình hướng đối tượng, và để hiểu được lập trình hướng đối tượng, ta cần phải hiểu lập trình hướng thủ tục, bởi vì ban đầu không có ngôn ngữ lập trình hướng đối tượng, mọi thứ đều là hướng thủ tục.

Hãy xem qua một ví dụ đơn giản để phân biệt giữa lập trình hướng thủ tục và hướng đối tượng.

Một ngày nọ, bạn muốn ăn một tô súp nhỏ, làm sao để làm điều này? Có hai lựa chọn:

1) Tự mua nguyên liệu, như đậu phụ, thịt, tỏi tây, v.v., tự tay nấu.

2) Đi đến nhà hàng và chỉ cần gọi với chủ quán, "Một tô súp nhỏ, với!"

Lựa chọn đầu tiên là lập trình hướng thủ tục, còn lựa chọn thứ hai là lập trình hướng đối tượng.

Hướng thủ tục có những nhược điểm gì? Giả sử bạn đã mua nguyên liệu cho một tô súp nhỏ, nhưng cuối cùng lại muốn ăn gà rán. Bạn có phải đi mua lại nguyên liệu không?

Hướng đối tượng có những ưu điểm gì? Giả sử bạn không muốn ăn súp nhỏ nữa, bạn chỉ cần nói với chủ hàng, "Nếu chưa nấu tô súp nhỏ của tôi, hãy đổi sang gà rán!"

Lập trình hướng thủ tục là tuần tự, từng bước một, hoàn thành bước trước khi tiếp tục bước sau.

Lập trình hướng đối tượng là tách biệt thành từng module, tôi làm của tôi, bạn làm của bạn. Nếu tôi cần điều gì từ bạn, tôi chỉ cần thông báo. Tôi không cần biết bạn làm việc như thế nào, chỉ cần xem kết quả.

Tuy nhiên, nếu đi sâu vào, cách tiếp cận hướng đối tượng thực chất là lập trình hướng thủ tục, nhưng nó đã được trừu tượng hóa, đóng gói vào các lớp, để dễ dàng gọi.

### 02. Lớp (Class)

Các đối tượng có thể là bất kỳ vật thể hiện thực nào, ví dụ như một con lợn mồi đơn lẻ; hoặc có thể là bất kỳ đối tượng ảo nào trong tưởng tượng, như Sun Wukong có thể biến 72 hình.

Trong Java, các đối tượng này được định nghĩa thông qua các lớp (class), mô tả trạng thái của chúng bằng các trường dữ liệu, ví dụ như màu lông của con lợn có phải là màu sắc hay họa tiết; và mô tả hành vi của chúng bằng các phương thức, ví dụ như con lợn có thể ăn và ngủ.

Hãy xem một ví dụ đơn giản về cách định nghĩa một lớp.

```java
/**
 * Tìm kiếm WeChat "Hung" và trả lời Java
 *
 * @author Hung
 * @date 2020/11/19
 */
public class Person {
    private String name;
    private int age;
    private int sex;

    private void eat() {
    }

    private void sleep() {
    }

    private void dadoudou() {
    }
}
```

Một lớp có thể bao gồm:

- Trường (Field)
- Phương thức (Method)
- Phương thức khởi tạo (Constructor)

Trong lớp Person, có 3 trường là name, age và sex, chúng cũng được gọi là biến thành viên - tức là nằm trong lớp nhưng bên ngoài các phương thức.

Biến thành viên đôi khi được gọi là biến thể hiện, chúng không chiếm bộ nhớ khi biên dịch, mà chỉ lấy bộ nhớ khi chạy, có nghĩa là chỉ khi đối tượng được khởi tạo (`new Person()`) thì các trường mới có bộ nhớ, và đây cũng là lý do vì sao chúng được gọi là biến "thể hiện".

Có 3 phương thức là `eat()`, `sleep()` và `dadoudou()`, đại diện cho những hành động mà đối tượng Person có thể thực hiện, như ăn, ngủ và đùa giỡn.

Bạn có muốn hỏi là "tại sao không có phương thức khởi tạo (constructor) không?" Đúng vậy, trong tệp nguồn lớp Person (.java) không thấy, nhưng trong tệp bytecode đã được dịch ngược (.class) thì lại có thể thấy.

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.hnv99.twentythree;

public class Person {
    private String name;
    private int age;
    private int sex;

    public Person() {
    }

    private void eat() {
    }

    private void sleep() {
    }

    private void dadoudou() {
    }
}
```

`public Person(){}` chính là phương thức khởi tạo mặc định, vì nó là phương thức khởi tạo trống (không có nội dung trong thân phương thức), nên có thể bỏ qua. Java rất thông minh ở chỗ này, những thứ cứng nhắc không cần thiết để lập trình viên thêm vào, nó đã tự động làm điều đó.

### 03. Tạo một đối tượng mới

Khi tạo đối tượng trong Java, chúng ta sử dụng từ khóa `new`.

```java
Person person = new Person();
```

Dòng code này tạo ra một đối tượng của lớp `Person`. Tất cả các **đối tượng** được tạo ra sẽ được **cấp phát không gian trong bộ nhớ Heap**.

Khi tạo đối tượng, chúng ta cần một phương thức `main()` làm điểm khởi đầu. `main()` có thể nằm trong cùng lớp hiện tại, hoặc trong một lớp khác.

Cách 1: `main()` nằm trực tiếp trong lớp `Person`.

```java
public class Person {
    private String name;
    private int age;
    private int sex;

    private void eat() {}
    private void sleep() {}
    private void dadoudou() {}

    public static void main(String[] args) {
        Person person = new Person();
        System.out.println(person.name);
        System.out.println(person.age);
        System.out.println(person.sex);
    }
}
```

Kết quả in ra là:

```
null
0
0
```

Cách 2: `main()` không nằm trong lớp `Person`, mà là trong một lớp khác.

Trong thực tế, chúng ta thường không tạo và sử dụng đối tượng trực tiếp trong cùng lớp như ví dụ trên, mà là trong một lớp sử dụng đối tượng, ví dụ như trong lớp `PersonTest`.

Bạn có thể đặt lớp `PersonTest` và `Person` trong hai tệp riêng biệt, hoặc trong cùng một tệp (với tên `PersonTest.java`) như dưới đây.

```java
public class PersonTest {
    public static void main(String[] args) {
        Person person = new Person();
    }
}

class Person {
    private String name;
    private int age;
    private int sex;

    private void eat() {}
    private void sleep() {}
    private void dadoudou() {}
}
```

Đối tượng `Person` được tạo và sử dụng trong lớp `PersonTest`.

### 04. Khởi tạo đối tượng

Trong các ví dụ trước đó, kết quả xuất ra là:

```
null
0
0
```

Điều này xảy ra vì đối tượng `Person` chưa được khởi tạo, do đó các giá trị của các trường (fields) là mặc định: `null` cho `String` và `0` cho `int`.

Để khởi tạo đối tượng `Person` và thiết lập các giá trị cho các trường, chúng ta có thể làm như sau:

#### Cách 1: Sử dụng biến tham chiếu của đối tượng.

```java
public class Person {
    private String name;
    private int age;
    private int sex;

    public static void main(String[] args) {
        Person person = new Person();
        person.name = "Hung";
        person.age = 18;
        person.sex = 1;

        System.out.println(person.name);
        System.out.println(person.age);
        System.out.println(person.sex);
    }
}
```

Biến `person` được gọi là biến tham chiếu của đối tượng `Person`.

Thực hiện thông qua biến tham chiếu của đối tượng, chúng ta có thể trực tiếp khởi tạo các trường (field) của đối tượng (`person.name = "Hung"`). Do đó, đoạn mã trên sẽ xuất ra kết quả như sau:

```
Hung
18
1
```

#### Cách 2: Khởi tạo thông qua phương thức

Trong Java, bạn cũng có thể sử dụng phương thức để khởi tạo các giá trị cho đối tượng. Dưới đây là một ví dụ minh họa:

```java
public class Person {
    private String name;
    private int age;
    private int sex;

    // Phương thức khởi tạo thông qua đối số
    public void initialize(String n, int a, int s) {
        name = n;
        age = a;
        sex = s;
    }

    public static void main(String[] args) {
        Person person = new Person();
        person.initialize("Hung", 18, 1);

        System.out.println(person.name);
        System.out.println(person.age);
        System.out.println(person.sex);
    }
}
```

#### Cách 3: Khởi tạo thông qua constructor

```java
public class Person {
    private String name;
    private int age;
    private int sex;

    // Constructor để khởi tạo đối tượng Person với các tham số tương ứng
    public Person(String name, int age, int sex) {
        this.name = name;
        this.age = age;
        this.sex = sex;
    }

    public static void main(String[] args) {
        // Tạo một đối tượng Person bằng cách gọi constructor
        Person person = new Person("Hung", 18, 1);

        // In ra các giá trị của các trường của đối tượng person
        System.out.println(person.name);
        System.out.println(person.age);
        System.out.println(person.sex);
    }
}
```

Đây là phương thức khởi tạo chuẩn mực nhất để tạo đối tượng trong Java, trực tiếp truyền các tham số vào khi khởi tạo.

#### Thêm một vài kiến thức: Đối tượng vô danh (Anonymous Object)

```java
new Person();
```

Đối tượng vô danh có nghĩa là không có biến tham chiếu, chỉ có thể sử dụng nó một lần khi tạo ra.

```java
new Person().initialize("Hung", 18, 1);
```

Có thể trực tiếp gọi phương thức thông qua đối tượng vô danh này:

- Đây là một cách tiếp cận để gọi các phương thức mà không cần lưu đối tượng vào biến tham chiếu.

### 05. Về lớp Object

Trong Java, thuật ngữ "mọi thứ đều là đối tượng" thường được nhắc đến, trong đó "mọi thứ" đề cập đến tất cả các lớp trong Java, và tất cả các lớp này đều là lớp con của lớp Object.

Lớp Object cung cấp chủ yếu 11 phương thức, có thể chia thành sáu loại chính như sau:

#### So sánh đối tượng:

① `public native int hashCode()`: Là một phương thức native, dùng để trả về mã băm của đối tượng.

```java
public native int hashCode();
```

Theo quy ước, hai đối tượng bằng nhau phải có cùng mã băm. Nếu ghi đè phương thức equals, bạn cũng nên ghi đè phương thức hashCode. Bạn có thể sử dụng phương thức Objects.hash() để sinh mã băm.

```java
public int hashCode() {
    return Objects.hash(name, age);
}
```

② `public boolean equals(Object obj)`: Dùng để so sánh hai đối tượng xem chúng có cùng địa chỉ bộ nhớ hay không.

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

Nếu bạn muốn so sánh giá trị của hai đối tượng, bạn cần phải ghi đè phương thức này. Ví dụ, trong lớp Person, chúng ta có thể chỉ định rằng nếu hai người có cùng tên và tuổi thì chúng là cùng một người, và ghi đè phương thức equals như sau:

```java
class Person1 {
    private String name;
    private int age;

    // Các phương thức getter và setter được bỏ qua

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof Person1) {
            Person1 p = (Person1) obj;
            return this.name.equals(p.getName()) && this.age == p.getAge();
        }
        return false;
    }
}
```

#### Sao chép đối tượng:

`protected native Object clone() throws CloneNotSupportedException`: Là một phương thức native, trả về một bản sao của đối tượng này. Mặc định, nó chỉ thực hiện sao chép nông, và lớp phải triển khai interface Cloneable.

Lớp Object không tự động triển khai interface Cloneable, do đó, nếu không ghi đè phương thức clone và cố gắng gọi phương thức này, sẽ xảy ra ngoại lệ CloneNotSupportedException.

#### Chuyển đổi đối tượng sang chuỗi:

`public String toString()`: Trả về một biểu diễn chuỗi của đối tượng. Mặc định, nó trả về tên lớp kèm với mã băm của đối tượng dưới dạng hệ thập lục phân, nhưng thường sẽ được ghi đè để trả về thông tin có ý nghĩa hơn.

```java
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

Ví dụ, với một lớp Person, chúng ta có thể ghi đè phương thức toString để trả về một chuỗi có ý nghĩa hơn:

```java
public String toString() {
    return "Person{" +
            "name='" + name + '\'' +
            ", age=" + age +
            '}';
}
```

Dĩ nhiên, công việc này có thể được giao cho IDE, ví dụ như IntelliJ IDEA, bằng cách nhấp chuột phải chọn Generate, sau đó chọn phương thức toString, IDE sẽ tự động tạo phương thức toString cho bạn.

Ngoài ra, bạn cũng có thể sử dụng Lombok với annotation @Data, nó sẽ tự động tạo phương thức toString.

Mảng cũng là một đối tượng, do đó, khi in mảng, chúng ta thường thấy các chuỗi như `[I@1b6d3586`, đây là mã băm của mảng int đó.

#### Lập lịch đa luồng:

Mỗi đối tượng đều có thể gọi các phương thức wait/notify của lớp Object để thực hiện cơ chế chờ/thông báo. Chúng ta hãy viết một ví dụ:

```java
public class WaitNotifyDemo {
    public static void main(String[] args) {
        Object lock = new Object();
        new Thread(() -> {
            synchronized (lock) {
                System.out.println("Thread 1: Tôi sẽ chờ");
                try {
                    lock.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("Thread 1: Tôi đã được đánh thức");
            }
        }).start();
        new Thread(() -> {
            synchronized (lock) {
                System.out.println("Thread 2: Tôi sẽ đánh thức");
                lock.notify();
                System.out.println("Thread 2: Tôi đã đánh thức xong");
            }
        }).start();
    }
}
```

Giải thích:

- Thread 1 thực thi trước, nó gọi phương thức `lock.wait()`, sau đó vào trạng thái chờ.
- Thread 2 thực thi sau, nó gọi phương thức `lock.notify()`, sau đó Thread 1 được đánh thức.

Các phương thức liên quan đến wait/notify:

1. `public final void wait() throws InterruptedException`: Gọi phương thức này sẽ khiến luồng hiện tại chờ, cho đến khi một luồng khác gọi phương thức `notify()` hoặc `notifyAll()` trên đối tượng này.

2. `public final native void notify()`: Đánh thức một luồng duy nhất đang chờ trên bộ giám sát của đối tượng này. Nếu có nhiều luồng đang chờ, chọn một luồng để đánh thức.

3. `public final native void notifyAll()`: Đánh thức tất cả các luồng đang chờ trên bộ giám sát của đối tượng này.

4. `public final native void wait(long timeout) throws InterruptedException`: Chờ trong khoảng thời gian timeout mili giây, nếu không được đánh thức trong khoảng thời gian đó, sẽ tự động đánh thức.

5. `public final void wait(long timeout, int nanos) throws InterruptedException`: Chờ trong khoảng thời gian chính xác hơn, bao gồm timeout mili giây và nanos nano giây, nếu không được đánh thức trong khoảng thời gian đó, sẽ tự động đánh thức.

#### Phản chiếu:

`public final native Class<?> getClass()`：Được sử dụng để lấy thông tin lớp của đối tượng, chẳng hạn như tên lớp. Ví dụ:

```java
public class GetClassDemo {
    public static void main(String[] args) {
        Person p = new Person();
        Class<? extends Person> aClass = p.getClass();
        System.out.println(aClass.getName());
    }
}
```

Kết quả in ra:

```
com.hnv99.Person
```

#### Thu gom rác:

`protected void finalize() throws Throwable`：Phương thức này được gọi khi bộ thu gom rác quyết định thu gom bộ nhớ của đối tượng. Nó được sử dụng để dọn dẹp tài nguyên, nhưng Java không khuyến khích sử dụng phương thức này vì tính không dự đoán được và có thể gây ra vấn đề. Từ Java 9 trở đi, phương thức này đã bị loại bỏ.


### 06. Một số kiến ​​thức nhỏ về đối tượng

#### 1) Sự trừu tượng của đối tượng

Tất cả các ngôn ngữ lập trình đều là một dạng trừu tượng, có thể nói rằng khả năng giải quyết các vấn đề phức tạp phụ thuộc vào loại và chất lượng của trừu tượng.

Smalltalk là ngôn ngữ hướng đối tượng đầu tiên thành công trong lịch sử, cũng là nguồn cảm hứng cho Java. Nó có 5 đặc điểm cơ bản:

- Mọi thứ đều là đối tượng.
- Một chương trình thực tế là nhiều đối tượng gửi tin nhắn cho nhau để nói cho nhau biết nên làm gì.
- Bằng cách kết hợp, bạn có thể đóng gói nhiều đối tượng thành các đối tượng cơ bản hơn.
- Đối tượng được khởi tạo bằng cách sử dụng lớp.
- Các đối tượng cùng loại có thể nhận được các tin nhắn tương tự nhau.

Tóm lại trong một câu:

> Trạng thái + hành vi + định danh = đối tượng, mỗi đối tượng trong bộ nhớ sẽ có một địa chỉ duy nhất.

#### 2) Đối tượng có interface

Tất cả các đối tượng đều có thể được phân loại vào một loại và các đối tượng cùng loại có những hành vi và đặc điểm chung. Trong Java, từ khóa class được sử dụng để định nghĩa một loại.

Tạo ra các kiểu dữ liệu trừu tượng là một khái niệm cơ bản trong lập trình hướng đối tượng. Bạn có thể tạo ra một biến kiểu một loại nhất định, gọi là đối tượng hoặc thể hiện trong Java, và sau đó bạn có thể thao tác với những biến này, gọi là gửi tin nhắn hoặc yêu cầu trong Java, và cuối cùng là các đối tượng quyết định làm thế nào.

Lớp mô tả một tập hợp các đối tượng có các đặc điểm và hành vi giống nhau. Từ khái niệm rộng hơn, lớp thực tế chính là một kiểu dữ liệu do người dùng định nghĩa.

Khi đã tạo một lớp, bạn có thể sử dụng nó để tạo ra bất kỳ số lượng đối tượng nào. Một trong những thách thức lớn nhất trong ngôn ngữ lập trình hướng đối tượng là cách chuyển đổi các yếu tố thực/vi tưởng thành các đối tượng trong Java.

Các đối tượng có thể nhận được yêu cầu nào dựa trên các interface của nó. Cụ thể là cách triển khai nó, sẽ được thực hiện bởi phương pháp triển khai của nó

#### 3) Các từ khóa điều khiển quyền truy cập

Người tạo lớp đôi khi còn được gọi là nhà cung cấp API, tương ứng với đó, người dùng lớp được gọi là người gọi API.

JDK cung cấp cho chúng ta cài đặt cơ bản của Java, tác giả JDK cũng là nhà cung cấp API cơ bản (Doug Lea, tác giả phần đa luồng của Java, là một trong những danh nhân được các lập trình viên Java tôn kính), chúng ta những người sử dụng ngôn ngữ Java, nói đơn giản là người gọi JDK.

Tất nhiên, nếu chúng ta cũng cung cấp lớp mới cho người gọi khác, chúng ta cũng trở thành người tạo mới.

Khi tạo mới lớp API, chỉ tiết lộ interface cần thiết và giấu tất cả thông tin không cần thiết khác, lý do là nếu thông tin này không có thể nhìn thấy đối với người gọi, người tạo có thể sửa đổi nó theo ý muốn mà không cần phải lo lắng về ảnh hưởng đến người gọi.

Ở đây, chúng ta phải nói về từ khóa điều khiển quyền truy cập của Java (access control).

Chức năng đầu tiên của từ khóa điều khiển quyền truy cập là ngăn người gọi lớp tiếp cận những thứ bên trong mà họ không nên tiếp cận; chức năng thứ hai là cho phép người tạo lớp dễ dàng sửa đổi cơ chế bên trong mà không sợ ảnh hưởng đến việc sử dụng của người gọi.

- public
- private
- protected

Còn một từ khóa điều khiển quyền truy cập "mặc định", không có từ khóa, được sử dụng để truy cập các lớp trong cùng một gói.

#### 4) Tổ hợp

Chúng ta có thể sử dụng một lớp đã tạo thành biến thành viên của một lớp khác, sử dụng lớp đã có để tạo thành một lớp mới, được gọi là "tái sử dụng", mối quan hệ mà tổ hợp đại diện là mối quan hệ has-a.

#### 5) Kế thừa

Kế thừa là một khái niệm rất quan trọng trong Java, lớp con kế thừa từ lớp cha, do đó có các phương thức và trường được bảo vệ và công cộng trong lớp cha, đồng thời lớp con cũng có thể mở rộng các phương thức và trường riêng của mình, cũng như có thể ghi đè các phương thức được kế thừa.

Một ví dụ phổ biến là hình dạng có thể có các lớp con như hình tròn, hình vuông, tam giác, chúng có interface cơ bản như nhau, ví dụ như có một phương thức `draw()`, các lớp con có thể kế thừa phương thức này để triển khai phương thức vẽ riêng của chúng.

Nếu lớp con chỉ đơn giản là ghi đè phương thức của lớp cha, thì mối quan hệ giữa chúng là is-a; nhưng nếu lớp con có thêm phương thức mới, thì mối quan hệ giữa chúng là is-like-a.

#### 6) Đa hình

Ví dụ có một lớp cha Shape:

```java
public class Shape {
    public void draw() {
        System.out.println("Hình dạng");
    }
}
```

Lớp con Circle:

```java
public class Circle extends Shape {
    @Override
    public void draw() {
        System.out.println("Hình tròn");
    }
}
```

Lớp con Line:

```java
public class Line extends Shape {
    @Override
    public void draw() {
        System.out.println("Đường thẳng");
    }
}
```

Lớp thử nghiệm:

```java
public class Test {
    public static void main(String[] args) {
        Shape shape1 = new Line();
        shape1.draw();
        Shape shape2 = new Circle();
        shape2.draw();
    }
}
```

Kết quả khi chạy:

```
Đường thẳng
Hình tròn
```

Trong lớp thử nghiệm, biến shape1 có kiểu là Shape và shape2 cũng có kiểu là Shape, nhưng sau khi gọi phương thức `draw()`, phương thức `draw()` của các lớp con Line và Circle lại được gọi tự động. Điều này là do đâu?

Đó chính là đa hình trong Java.

Đa hình cho phép một đối tượng có thể xử lý các hành vi khác nhau tùy theo loại đối tượng mà nó đang tham chiếu đến. Trong ví dụ này, biến shape1 và shape2, mặc dù được khai báo là Shape, nhưng thực tế nó có thể tham chiếu đến các đối tượng của lớp con Line và Circle. Khi gọi phương thức `draw()`, Java tự động phân biệt và gọi đúng phương thức của đối tượng thực tế mà biến đó đang tham chiếu đến.

Đa hình là một trong những tính chất quan trọng của lập trình hướng đối tượng, nó giúp tăng tính linh hoạt và tái sử dụng trong mã nguồn của bạn.
