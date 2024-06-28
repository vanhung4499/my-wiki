---
title: Inner Class
tags:
  - java
categories:
  - java
order: 11
---
# Java Inner Class

### **1) Member inner class**

Member inner class là loại inner class phổ biến nhất, xin xem đoạn mã dưới đây:

```java
class A {
    int age = 18;
    
    class AA {
        int age = 81;
    }
}
```

Có vẻ như inner class AA giống như một thành viên của A.

```java
public class A {
    int age = 18;
    private String name = "a";
    static double money = 1;

    class AA {
        int age = 81;
        
        public void print() {
            System.out.println(name);
            System.out.println(money);
        }
    }
}
```

Inner class có thể truy cập các thành viên của lớp bên ngoài theo ý muốn, nhưng lớp bên ngoài không dễ dàng truy cập các thành viên của lớp bê n trong, sau đó truy cập nó thông qua đối tượng này:

```java
public class A {
    int age = 18;
    private String name = "a";
    static double money = 1;

    public A () {
        new Wangxiaoer().print();
    }

    class AA {
        int age = 81;

        public void print() {
            System.out.println(name);
            System.out.println(money);
        }
    }
}

```

Điều này có nghĩa là nếu bạn muốn truy cập một lớp thành viên bên trong theo một phương thức tĩnh, trước tiên bạn phải tạo một đối tượng của lớp bên ngoài, vì inner class được gắn với lớp bên ngoài.

```java
public class A {
    int age = 18;
    private String name = "a";
    static double money = 1;

    public A () {
        new AA().print();
    }

    public static void main(String[] args) {
        A a = new A();
        AA aa = a.new aa();
        aa.print();
    }

    class Wangxiaoer {
        int age = 81;

        public void print() {
            System.out.println(name);
            System.out.println(money);
        }
    }
}

```

Phương pháp tạo các inner class này không được sử dụng phổ biến trong quá trình phát triển thực tế, bởi vì các inner class và các lớp bên ngoài được liên kết chặt chẽ với nhau khiến chúng rất bất tiện khi sử dụng.

### **2) Local inner class**

Local inner class là một lớp được xác định theo một phương thức hoặc một phạm vi, do đó vòng đời của inner class c bộ bị giới hạn trong phạm vi đó.

```java
public class A {
    public Wangsan print() {
        class AA extends A{
            private int age = 18;
        }
        return new AA();
    }
}
```

Local inner class giống như một bộ địa phương biến thể như public, protected, private và static.

### **3)  Anonymous inner class**

Các anonymous inner class là những gì chúng tôi thường sử dụng nhiều nhất, đặc biệt là khi bắt đầu luồng tối đa, chúng thường được sử dụng và IDE sẽ tự động tạo cho chúng.

```java
public class ThreadDemo {
    public static void main(String[] args) {
        Thread t = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName());
            }
        });
        t.start();
    }
}
```

Một anonymous inner class giống như một tham số của một phương thức phải viết một hàm tạo đặc biệt cho nó đặt tên đáng tin cậy, chỉ cần vay trực tiếp bên ngoài, thế là `$1`xong.

anonymous inner class là lớp duy nhất không có phương thức khởi tạo. viết hàm tạo cho nó, vì nó giống như một đối tượng được tạo trực tiếp thông qua từ khóa mới.

Không cần bổ sung thêm các phương pháp bổ sung để tạo thuận lợi cho việc phát triển khai thác hoặc viết lại các lợi ích của các phương thức được kế thừa.

### **4) Static inner class**

Các static inner class tương tự như các inner class thành viên, ngoại trừ việc có thêm một từ khóa `static`.

```java
public class A {
    static int age;
    double money;
    
    static class AA {
        public AA (){
            System.out.println(age);
        }
    }
}

```

Từ khóa static có tồn tại nên các static inner class không được phép truy cập các biến và phương thức không tĩnh ở các lớp bên ngoài của tôi.

**Tại sao lại sử dụng inner class?**

Có câu này trong "Think in Java":

> Lý do hấp dẫn nhất để sử dụng các inner class là mỗi inner class có thể tạo ra một cách độc lập việc phát triển khai (của interface), do đó, việc làm lớp bên ngoài có kế hoạch sáng tạo phát triển khai (của interface) hay không ảnh hưởng đến inner class.

Trong chương trình của chúng tôi, đôi khi có một số vấn đề khó giải quyết bằng interface. Khả năng sử dụng các inner class cung cấp để thiết kế nhiều lớp công cụ hoặc tượng tượng để giải quyết các vấn đề cài đặt này . , còn các inner class tạo ra giải pháp tối đa hoàn thiện hơn.

Sử dụng các inner class cũng có thể mang lại cho chúng ta những tính năng sau:

- 1. Các inner class có thể sử dụng nhiều thể hiện, mỗi lớp có thể hiện có trạng thái thông tin riêng và độc lập với thông tin của các đối tượng ngoại lệ khác.
- 2. Trong một lớp bên ngoài, nhiều inner class có thể phát triển cùng một interface theo những cách khác nhau hoặc kế thừa cùng một lớp.
- 3. Thời điểm tạo lớp đối tượng bên trong không phụ thuộc vào việc tạo lớp đối tượng bên ngoài.
- 4. Inner class không có mối quan hệ "is-a" khó hiểu, nó là một thực thể độc lập.
- 5. Inner class cung cấp khả năng đóng gói tốt hơn Ngoại trừ lớp ngoại vi, các lớp khác không thể truy cập được.