---
title: this and super
tags:
  - any
categories:
  - any
order: 13
---
# Java this and super

Từ khóa this có nhiều cách sử dụng, trong đó phổ biến nhất là, nó có thể được sử dụng như một biến tham chiếu, chỉ đến đối tượng hiện tại. Ngoài ra, từ khóa this cũng có thể thực hiện các công việc sau đây:

- Gọi phương thức của lớp hiện tại;
- `this()` có thể gọi phương thức khởi tạo của lớp hiện tại;
- this có thể được sử dụng như một đối số để truyền vào phương thức;
- this có thể được sử dụng như một đối số để truyền vào phương thức khởi tạo;
- this có thể được sử dụng như giá trị trả về của phương thức, trả về đối tượng của lớp hiện tại.
### 01. Trỏ đến đối tượng hiện tại

```java
public class WithoutThisStudent {
    String name;
    int age;

    WithoutThisStudent(String name, int age) {
        name = name;
        age = age;
    }

    void out() {
        System.out.println(name+" " + age);
    }

    public static void main(String[] args) {
        WithoutThisStudent s1 = new WithoutThisStudent("Tom", 18);
        WithoutThisStudent s2 = new WithoutThisStudent("Jerry", 16);

        s1.out();
        s2.out();
    }
}
```

Trong ví dụ trên, tên tham số của phương thức khởi tạo và tên biến thành viên giống nhau, do không sử dụng từ khóa this, nên không thể gán giá trị cho biến thành viên.

Hãy xem kết quả của chương trình:

```
null 0
null 0
```

Dựa vào kết quả, ta thấy mặc dù đã truyền tham số khi tạo đối tượng, nhưng biến thành viên không có giá trị. Điều này xảy ra vì nếu không sử dụng từ khóa this trong phương thức khởi tạo, tên và tuổi chỉ đơn giản là tham số của phương thức.

Hãy xem đoạn code sau khi thêm từ khóa this vào.

```java
public class WithThisStudent {
    String name;
    int age;

    WithThisStudent(String name, int age) {
        this.name = name;
        this.age = age;
    }

    void out() {
        System.out.println(name+" " + age);
    }

    public static void main(String[] args) {
        WithThisStudent s1 = new WithThisStudent("Tom", 18);
        WithThisStudent s2 = new WithThisStudent("Jerry", 16);

        s1.out();
        s2.out();
    }
}
```

"Hãy xem lại kết quả của chương trình."

```
Tom 18
Jerry 16
```

Lần này, biến thành viên đã có giá trị. Trong phương thức khởi tạo, `this.xxx` chỉ đến biến thành viên, không phải là tham số của phương thức nữa. Tất nhiên, nếu tên tham số khác tên biến thành viên thì không cần phải sử dụng từ khóa this, nhưng tôi khuyên nên sử dụng từ khóa this để code có ý nghĩa hơn.

### 02. Gọi phương thức của lớp hiện tại

```java
public class InvokeCurrentClassMethod {
    void method1() {}
    void method2() {
        method1();
    }

    public static void main(String[] args) {
        new InvokeCurrentClassMethod().method1();
    }
}
```

Trong đoạn code trên không có từ khóa this phải không?

Tôi nhanh chóng vào thư mục classes và mở file InvokeCurrentClassMethod.class (trong IDEA mặc định sẽ sử dụng FernFlower để mở file bytecode).

```java
public class InvokeCurrentClassMethod {
    public InvokeCurrentClassMethod() {
    }

    void method1() {
    }

    void method2() {
        this.method1();
    }

    public static void main(String[] args) {
        (new InvokeCurrentClassMethod()).method1();
    }
}
```

Chúng ta có thể sử dụng từ khóa `this` trong một lớp để gọi một phương thức khác. Nếu không sử dụng, trình biên dịch sẽ tự động thêm vào cho chúng ta. Trong mã nguồn, `method2()` gọi `method1()` mà không sử dụng từ khóa `this`, nhưng từ mã byte sau khi dịch ngược có thể thấy rõ.

### 03. Gọi phương thức khởi tạo của lớp hiện tại

```java
public class InvokeConstructor {
    InvokeConstructor() {
        System.out.println("hello");
    }

    InvokeConstructor(int count) {
        this();
        System.out.println(count);
    }

    public static void main(String[] args) {
        InvokeConstructor invokeConstructor = new InvokeConstructor(10);
    }
}
```

Trong phương thức khởi tạo có tham số `InvokeConstructor(int count)` này, sử dụng `this()` để gọi phương thức khởi tạo không tham số `InvokeConstructor()`. Với `this()` bạn có thể gọi phương thức khởi tạo của lớp hiện tại — cách khai thác lại phương thức khởi tạo.

Hãy xem kết quả in ra:

```
hello
10
```

Phương thức khởi tạo không tham số đã được gọi, vì vậy chương trình in ra hello.

Cũng có thể trong phương thức khởi tạo không tham số, sử dụng `this()` và truyền tham số để gọi phương thức khởi tạo có tham số. Hãy xem đoạn mã dưới đây:

```java
public class InvokeParamConstructor {
    InvokeParamConstructor() {
        this(10);
        System.out.println("hello");
    }

    InvokeParamConstructor(int count) {
        System.out.println(count);
    }

    public static void main(String[] args) {
        InvokeParamConstructor invokeConstructor = new InvokeParamConstructor();
    }
}
```

"Tiếp tục xem kết quả in ra của chương trình."

```
10
hello
```

> Tuy nhiên, cần lưu ý là `this()` phải được đặt ở dòng đầu tiên của phương thức khởi tạo, nếu không sẽ báo lỗi."

### 04. Sử dụng `this` như là tham số trong phương thức

```java
public class ThisAsParam {
    void method1(ThisAsParam p) {
        System.out.println(p);
    }

    void method2() {
        method1(this);
    }

    public static void main(String[] args) {
        ThisAsParam thisAsParam = new ThisAsParam();
        System.out.println(thisAsParam);
        thisAsParam.method2();
    }
}
```

`this` có thể được sử dụng như một tham số trong phương thức, lúc đó nó chỉ tới đối tượng của lớp hiện tại.

Hãy xem kết quả in ra, bạn sẽ hiểu ngay:

```
com.hnv99.oo.ThisAsParam@77459877
com.hnv99.oo.ThisAsParam@77459877
```

"`method2()` gọi `method1()` và truyền `this` làm đối số, `method1()` sau đó in ra chuỗi đại diện cho đối tượng hiện tại. Trong `main()` cũng in ra chuỗi đại diện cho đối tượng `thisAsParam`. Từ kết quả in ra, bạn có thể thấy rằng hai chuỗi này đều chỉ đến cùng một đối tượng."

### 05. Sử dụng `this` như là tham số trong constructor

```java
public class ThisAsConstrutorParam {
    int count = 10;

    ThisAsConstrutorParam() {
        Data data = new Data(this);
        data.out();
    }

    public static void main(String[] args) {
        new ThisAsConstrutorParam();
    }
}

class Data {
    ThisAsConstrutorParam param;

    Data(ThisAsConstrutorParam param) {
        this.param = param;
    }

    void out() {
        System.out.println(param.count);
    }
}
```

Trong constructor `ThisAsConstrutorParam()`, chúng ta sử dụng `this` như là tham số được truyền cho đối tượng Data, thực ra nó chỉ đến đối tượng được tạo bằng `new ThisAsConstrutorParam()`.

`this` keyword cũng có thể được sử dụng như là tham số truyền vào constructor, nó trỏ đến đối tượng của lớp hiện tại. Khi chúng ta cần sử dụng một đối tượng trong nhiều lớp khác nhau, điều này rất hữu ích.

Hãy nhìn vào kết quả in ra:

```
10
```

### 06. Sử dụng `this` như là giá trị trả về của phương thức

```java
public class ThisAsMethodResult {
    ThisAsMethodResult getThisAsMethodResult() {
        return this;
    }
    
    void out() {
        System.out.println("hello");
    }

    public static void main(String[] args) {
        new ThisAsMethodResult().getThisAsMethodResult().out();
    }
}
```

"Phương thức `getThisAsMethodResult()` trả về `this`, nghĩa là nó trỏ đến đối tượng hiện tại của lớp `ThisAsMethodResult`. Điều này cho phép chúng ta gọi phương thức `out()` một cách trực tiếp sau khi gọi `getThisAsMethodResult()`, tạo thành một chuỗi gọi phương thức liên tiếp, hay còn gọi là chuỗi gọi phương thức."

"Việc sử dụng `this` như là giá trị trả về của phương thức cho phép chúng ta triển khai các chuỗi gọi phương thức một cách thuận tiện và hiệu quả."

### 07. Từ khóa super

Từ khóa super có ba cách sử dụng chính:

- Trỏ tới đối tượng của lớp cha
- Gọi phương thức của lớp cha
- `super()` có thể gọi phương thức khởi tạo của lớp cha.

Thực tế, `super` tương tự như `this` nhưng mục đích sử dụng khác nhau. Mỗi khi tạo một đối tượng của lớp con, cũng sẽ ngầm tạo một đối tượng của lớp cha được tham chiếu bởi từ khóa super.

Nếu lớp cha và lớp con có các trường có cùng tên, từ khóa super có thể sử dụng để truy cập vào các trường đó của lớp cha.

Hãy xem đoạn mã dưới đây:

```java
public class ReferParentField {
    public static void main(String[] args) {
        new Dog().printColor();
    }
}

class Animal {
    String color = "White";
}

class Dog extends Animal {
    String color = "Black";

    void printColor() {
        System.out.println(color);
        System.out.println(super.color);
    }
}
```

"Trong lớp cha Animal có một trường tên là color, trong lớp con Dog cũng có một trường tên là color. Phương thức `printColor()` của lớp con có thể sử dụng từ khóa super để truy cập vào trường color của lớp cha."

"Hãy xem kết quả xuất ra."

```
Back
White
```

Khi tên của phương thức trong lớp con và lớp cha giống nhau, có thể sử dụng từ khóa super để gọi đến phương thức của lớp cha. Nói một cách khác, từ khóa super có thể được sử dụng để truy cập vào phương thức của lớp cha khi đang ghi đè phương thức đó.

```java
public class ReferParentMethod {
    public static void main(String[] args) {
        new Dog().work();
    }
}

class Animal {
    void eat() {
        System.out.println("Ăn...");
    }
}

class Dog extends Animal {
    @Override
    void eat() {
        System.out.println("Ăn...");
    }

    void bark() {
        System.out.println("Sủa sủa sủa...");
    }

    void work() {
        super.eat(); // Gọi phương thức của lớp cha
        bark();
    }
}  
```

Lớp Animal và lớp con Dog đều có một phương thức có tên là `eat()`, và thông qua `super.eat()` có thể truy cập vào phương thức `eat()` của lớp cha.

Hãy xem thêm đoạn mã sau:

```java
public class ReferParentConstructor {
    public static void main(String[] args) {
        new Dog();
    }
}

class Animal {
    Animal(){
        System.out.println("Động vật đã đến");
    }
}

class Dog extends Animal {
    Dog() {
        super();
        System.out.println("Con chó đã đến");
    }
}
```

Trong phương thức khởi tạo của lớp con Dog, dòng code đầu tiên là `super()` để gọi đến phương thức khởi tạo của lớp cha.

Hãy xem kết quả đầu ra:

```
Động vật đã đến
Con chó đã đến
```

Tất nhiên rồi, mặc định thì từ khóa `super()` có thể được bỏ qua, trình biên dịch sẽ tự động gọi phương thức khởi tạo của lớp cha. Nói cách khác, ngay cả khi lớp con không sử dụng `super()` để gọi tường minh đến phương thức khởi tạo của lớp cha, phương thức khởi tạo của lớp cha vẫn sẽ được thực thi trước.

```java
public class ReferParentConstructor {
    public static void main(String[] args) {
        new Dog();
    }
}

class Animal {
    Animal(){
        System.out.println("Động vật đã đến");
    }
}

class Dog extends Animal {
    Dog() {
        System.out.println("Con chó đã đến");
    }
}
```

Kết quả in ra tương tự như trước:

```
Động vật đã đến
Con chó đã đến
```

`super()` cũng có thể được sử dụng để gọi đến phương thức khởi tạo có tham số của lớp cha, điều này giúp tăng tính tái sử dụng của mã nguồn.

```java
class Person {
    int id;
    String name;

    Person(int id, String name) {
        this.id = id;
        this.name = name;
    }
}

class Emp extends Person {
    float salary;

    Emp(int id, String name, float salary) {
        super(id, name);
        this.salary = salary;
    }

    void display() {
        System.out.println(id + " " + name + " " + salary);
    }
}

public class CallParentParamConstrutor {
    public static void main(String[] args) {
        new Emp(1, "Hung", 2000f).display();
    }
}
```

“Lớp Emp kế thừa từ lớp Person, vì vậy nó cũng kế thừa các trường id và name. Khi thêm trường salary vào trong Emp, ta có thể sử dụng `super(id, name)` trong constructor để gọi constructor có tham số của lớp cha.”

“Hãy xem kết quả in ra.”

```
1 Hung 2000.0
```