---
title: Java Static
tags:
  - java
categories:
  - java
order: 14
---
# Java Static

`static` là một từ khóa trong Java khá khó hiểu, cũng là một trong những điểm kiến thức mà các nhà phỏng vấn của các công ty lớn thích hỏi.

Chức năng của từ khóa `static` có thể được mô tả bằng một câu: '**Thuận tiện để gọi mà không cần tạo đối tượng**, bao gồm cả biến và phương thức'. Nghĩa là chỉ cần lớp đã được tải, có thể truy cập thông qua tên lớp. Static có thể được sử dụng để sửa đổi biến thành viên của lớp và các phương thức thành viên. Chúng ta sẽ từng bước xem qua từng trường hợp.

### 01. Biến tĩnh

Nếu khi khai báo biến sử dụng từ khóa `static`, thì biến đó được gọi là biến tĩnh. Biến tĩnh chỉ nhận một lần không gian bộ nhớ khi lớp được tải, điều này giúp biến tĩnh tiết kiệm rất nhiều không gian bộ nhớ.

Hãy xem xét một lớp Sinh viên như sau.

```java
public class Student {
    String name;
    int age;
    String school = "Đại học Khoa học tự nhiên";
}
```

Hãy giả sử Đại học Khoa học tự nhiên nhận 10,000 sinh viên mới, khi tạo 10,000 đối tượng Sinh viên, tất cả các trường (tên, tuổi và trường học) đều chiếm một phần bộ nhớ. Tên và tuổi của sinh viên khác nhau, nhưng đều thuộc về Đại học Khoa học tự nhiên. Nếu mỗi khi tạo một đối tượng, trường học này chiếm một phần bộ nhớ, thì sẽ rất lãng phí, phải không?

Vì vậy, tốt nhất là đặt trường `school` này là biến tĩnh (`static`), điều này sẽ chỉ chiếm một phần bộ nhớ, thay vì 10,000 phần.

```java
public class Student {
    String name;
    int age;
    static String school = "Đại học Khoa học tự nhiên";

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public static void main(String[] args) {
        Student s1 = new Student("Nguyen Van A", 18);
        Student s2 = new Student("Nguyen Van B", 16);
    }
}
```

"Xem, em. Hai biến tham chiếu `s1` và `s2` này được lưu trữ trong stack, đối tượng "Nguyen Van A" + 18 và "Nguyen Van B" + 16 được lưu trữ trong heap, biến tĩnh `school` được lưu trữ trong khu vực tĩnh."

Giờ chúng ta hãy xem đoạn mã dưới đây:

```java
public class Counter {
    int count = 0;

    Counter() {
        count++;
        System.out.println(count);
    }

    public static void main(String args[]) {
        Counter c1 = new Counter();
        Counter c2 = new Counter();
        Counter c3 = new Counter();
    }
}
```

Chúng ta tạo một biến thành viên `count` và tăng nó lên trong hàm tạo. Vì biến thành viên sẽ chiếm không gian bộ nhớ khi tạo đối tượng, vì vậy mỗi đối tượng sẽ có một bản sao của `count`, giá trị của `count` sẽ không tăng khi số lượng đối tượng tăng lên.

Chạy chương trình trên:

```
1
1
1
```

Mỗi khi tạo một đối tượng Counter, giá trị `count` sẽ tăng từ 0 lên 1. Hãy nghĩ xem, nếu `count` là biến tĩnh thì sao?

```java
public class StaticCounter {
    static int count = 0;

    StaticCounter() {
        count++;
        System.out.println(count);
    }

    public static void main(String args[]) {
        StaticCounter c1 = new StaticCounter();
        StaticCounter c2 = new StaticCounter();
        StaticCounter c3 = new StaticCounter();
    }
}
```

Hãy xem kết quả xuất ra:

```
1
2
3
```

Giải thích đơn giản là, vì biến tĩnh chỉ nhận một lần không gian bộ nhớ, nên bất kỳ đối tượng nào thay đổi nó cũng được lưu giữ. Vì vậy, mỗi khi tạo một đối tượng, giá trị của `count` sẽ tăng lên 1, vì thế kết quả cuối cùng là 3. Đó là sự khác biệt giữa biến tĩnh và biến thành viên.

Ngoài ra, cần lưu ý rằng, vì biến tĩnh thuộc về một lớp, vì vậy không nên truy cập thông qua tham chiếu đối tượng, mà nên truy cập trực tiếp thông qua tên lớp, nếu không, trình biên dịch sẽ cảnh báo.

### 02. Phương thức tĩnh

Nếu một phương thức được thêm từ khóa `static`, thì nó là một phương thức tĩnh.

Phương thức tĩnh có những đặc điểm sau đây:

- Phương thức tĩnh thuộc về lớp đó chứ không phải đối tượng của lớp đó.
- Khi gọi phương thức tĩnh không cần phải tạo đối tượng của lớp đó.
- Phương thức tĩnh có thể truy cập vào các biến tĩnh.

Tiếp tục với đoạn mã sau đây:

```java
public class StaticMethodStudent {
    String name;
    int age;
    static String school = "Đại học Khoa học tự nhiên";

    public StaticMethodStudent(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    static void change() {
        school = "Đại học Công nghệ thông tin";
    }
    
    void out() {
        System.out.println(name + " " + age + " " + school);
    }

    public static void main(String[] args) {
        StaticMethodStudent.change();
        
        StaticMethodStudent s1 = new StaticMethodStudent("Nguyễn Văn A", 18);
        StaticMethodStudent s2 = new StaticMethodStudent("Nguyễn Văn B", 16);
        
        s1.out();
        s2.out();
    }
}
```

Chú ý, em. Phương thức `change()` là một phương thức tĩnh, vì vậy nó có thể truy cập trực tiếp vào biến tĩnh `school` và thay đổi giá trị của nó thành 'Đại học Công nghệ thông tin'; và có thể gọi `change()` trực tiếp thông qua tên lớp như `StaticMethodStudent.change()` như thế.

Chúng ta hãy xem kết quả của chương trình:

```
Nguyễn Văn A 18 Đại học Công nghệ thông tin
Nguyễn Văn B 16 Đại học Công nghệ thông tin
```

> Cần lưu ý rằng, phương thức tĩnh không thể truy cập vào biến không phải tĩnh và gọi phương thức không phải tĩnh. 

Tại sao phương thức `main` lại là tĩnh?

Nếu phương thức `main` không phải là tĩnh, điều đó có nghĩa là máy ảo Java cần phải tạo một đối tượng trước khi gọi phương thức `main`, nhưng phương thức `main` là điểm vào của chương trình, việc tạo một đối tượng thêm là vô cùng lãng phí.

Lớp `java.lang.Math` có hầu hết các phương thức đều là tĩnh, có thể gọi trực tiếp qua tên lớp mà không cần tạo đối tượng.

### 03. Khối mã tĩnh

Hãy xem đoạn mã dưới đây:

```java
public class StaticBlock {
    static {
        System.out.println("Khối mã tĩnh");
    }

    public static void main(String[] args) {
        System.out.println("Phương thức main");
    }
}
```

Khối mã tĩnh thường được sử dụng để khởi tạo một số biến tĩnh, nó được thực thi trước phương thức `main()`.

Chúng ta hãy xem kết quả của chương trình:

```
Khối mã tĩnh
Phương thức main
```

Nếu không có phương thức `main()`, một lớp Java có thể chạy thành công không?

Java 1.6 có thể, nhưng từ Java 7 trở đi thì không thể nữa.

```java
public class StaticBlockNoMain {
    static {
        System.out.println("Khối mã tĩnh, không có main");
    }
}
```

Khi thực hiện `java StaticBlockNoMain` trong dòng lệnh, sẽ có lỗi `NoClassDefFoundError` được ném.

Hãy xem ví dụ sau đây:

```java
public class StaticBlockDemo {
    public static List<String> writes = new ArrayList<>();

    static {
        writes.add("Nguyễn Văn A");
        writes.add("Nguyễn Văn B");
        writes.add("Nguyễn Văn C");

        System.out.println("Khối mã thứ nhất");
    }

    static {
        writes.add("Nguyễn Văn E");
        writes.add("Nguyễn Văn F");

        System.out.println("Khối mã thứ hai");
    }
}
```

`writes` là một ArrayList tĩnh, vì vậy không thể khởi tạo khi khai báo, nên cần phải khởi tạo trong khối mã tĩnh.

Khối mã tĩnh rất hữu ích khi khởi tạo tập hợp như vậy. Trong phát triển dự án thực tế, thường sử dụng khối mã tĩnh để tải tệp cấu hình vào bộ nhớ.

Dưới đây là bản dịch của đoạn văn về lớp nội tĩnh (static inner class) trong Java:

---

### 04. Lớp nội tĩnh (Static Inner Class)

`static` còn có một tính năng không thường được sử dụng - đó là lớp nội tĩnh.

Trong Java, chúng ta có thể khai báo một lớp nội tĩnh trong một lớp khác, đây là một cách hữu hiệu để chỉ sử dụng biến tại một nơi duy nhất, giúp mã nguồn trở nên rõ ràng và dễ đọc hơn.

Có bốn loại lớp nội bộ phổ biến: lớp nội bộ thành viên, lớp nội bộ cục bộ, lớp nội bộ vô danh và lớp nội tĩnh, nhưng vì hạn chế về chiều dài, ba loại đầu tiên không nằm trong phạm vi thảo luận của chúng ta lần này, chúng ta sẽ nói về nó sau.

Hãy xem ví dụ dưới đây:

```java
public class Singleton {
    private Singleton() {}

    private static class SingletonHolder {
        public static final Singleton instance = new Singleton();
    }

    public static Singleton getInstance() {
        return SingletonHolder.instance;
    }
}
```


Mã này trông khá tinh tế!

Mã này sẽ thường được sử dụng khi tạo đối tượng Singleton trong tương lai.

Khi lần đầu tiên tải lớp Singleton, `instance` không được khởi tạo, chỉ khi gọi phương thức `getInstance()`, máy ảo Java mới bắt đầu tải SingletonHolder và khởi tạo `instance`. Điều này không chỉ đảm bảo an toàn đối với luồng mà còn đảm bảo sự duy nhất của lớp Singleton. Tuy nhiên, có một cách thực hiện Singleton một cách tinh tế hơn là sử dụng enum, tôi sẽ nói sau!

Cần lưu ý rằng: 
- Thứ nhất, lớp nội tĩnh không thể truy cập vào tất cả các biến thành viên của lớp bên ngoài.
- Thứ hai, lớp nội tĩnh có thể truy cập vào tất cả các biến tĩnh của lớp bên ngoài, bao gồm cả biến tĩnh riêng tư.
- Thứ ba, lớp bên ngoài không thể được khai báo là static.
