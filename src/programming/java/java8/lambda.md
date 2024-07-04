---
title: Lambda
tags:
  - java
categories:
  - java
order: 3
---
# Hiểu Rõ Về Lambda Expression

### 01. Sơ Lược Về Lambda

Biểu thức Lambda mô tả một khối mã (hay còn gọi là phương thức ẩn danh), có thể được truyền làm tham số cho các phương thức khởi tạo hoặc phương thức thông thường để thực thi sau đó. Hãy xem đoạn mã dưới đây:

```java
() -> System.out.println("Tom")
```

Hãy giải thích từ trái sang phải, `()` là danh sách tham số của biểu thức Lambda (trong trường hợp này không có tham số), `->` biểu thị đoạn mã này là biểu thức Lambda (tức là khi thấy `->` chúng ta biết đây là Lambda), và `System.out.println("Tom")` là mã sẽ được thực thi, nghĩa là sẽ in ra "Tom" vào luồng đầu ra chuẩn.

Những ai có nền tảng Java cơ bản hẳn không lạ gì với interface Runnable, đây là một interface nền tảng của đa luồng, được định nghĩa như sau:

```java
@FunctionalInterface
public interface Runnable
{
   public abstract void run();
}
```

Interface Runnable rất đơn giản, chỉ có một phương thức trừu tượng `run()`; những người cẩn thận sẽ nhận thấy một chú thích lạ `@FunctionalInterface`, chú thích này có ý nghĩa gì?

Tôi đã xem mã nguồn của nó và thấy có đoạn chú thích như sau:

>Note that instances of functional interfaces can be created with lambda expressions, method references, or constructor references.

Ý chính là, các thể hiện của interface chức năng được đánh dấu bằng `@FunctionalInterface` có thể được tạo ra bằng biểu thức Lambda, tham chiếu phương thức hoặc tham chiếu cấu trúc.

Thực tế thì sao?

Trước đây, khi tạo và khởi động một luồng, chúng ta làm như sau:

```java
public class LambdaTest {
    public static void main(String[] args) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("Tom");
            }
        }).start();
    }
}
```

Còn với biểu thức Lambda? Chúng ta chỉ cần làm như sau:

```java
public class LambdaTest {
    public static void main(String[] args) {
        new Thread(() -> System.out.println("Tom")).start();
    }
}
```

Có phải rất tuyệt không! So với lớp ẩn danh, biểu thức Lambda không chỉ dễ hiểu hơn mà còn đơn giản hóa đáng kể lượng mã cần viết.

### 02. Cú Pháp Lambda

Mỗi biểu thức Lambda tuân theo các quy tắc sau:

```
( danh sách-tham số ) -> { biểu-thức-hoặc-các-câu-lệnh }
```

`()` chứa `danh sách-tham số` là các tham số được ngăn cách bởi dấu phẩy. Bạn có thể chỉ định loại tham số hoặc không (trình biên dịch sẽ suy luận dựa trên ngữ cảnh). Sau Java 11, bạn cũng có thể sử dụng từ khóa `var` như loại tham số, tương tự như JavaScript.

`->` là ký hiệu của Lambda, giống như khi thấy một chỉ thị hoàng gia thì biết đó là của vua.

`{}` chứa `biểu-thức-hoặc-các-câu-lệnh` là phần thân của Lambda, có thể là một dòng lệnh hoặc nhiều dòng.

Có nhiều việc có thể làm với biểu thức Lambda, ví dụ như:

1) Gán giá trị cho biến, như sau:

```java
Runnable r = () -> { System.out.println("沉默王二"); };
r.run();
```

2) Làm kết quả trả về, như sau:

```java
static FileFilter getFilter(String ext) {
    return (pathname) -> pathname.toString().endsWith(ext);
}
```

3) Làm phần tử của mảng, như sau:

```java
final PathMatcher matchers[] = {
        (path) -> path.toString().endsWith("txt"),
        (path) -> path.toString().endsWith("java")
};
```

4) Làm tham số của phương thức hoặc phương thức khởi tạo, như sau:

```java
new Thread(() -> System.out.println("沉默王二")).start();
```

Cần chú ý đến phạm vi hoạt động của biểu thức Lambda.

```java
public static void main(String[] args) {

    int limit = 10;
    Runnable r = () -> {
        int limit = 5;
        for (int i = 0; i < limit; i++)
            System.out.println(i);
    };
}
```

Đoạn mã trên sẽ báo lỗi khi biên dịch: biến limit đã được định nghĩa trước.

Giống như lớp ẩn danh, không nên thay đổi biến cục bộ trong phương thức ở phần thân biểu thức Lambda, nếu không biên dịch sẽ không thành công: biến sử dụng trong biểu thức Lambda phải là `final`.

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/java8/Lambda-3.jpg)

Nguyên nhân của vấn đề này là do quy tắc Java quy định:

> Bất kỳ biến cục bộ, tham số hình thức hoặc tham số ngoại lệ nào được sử dụng nhưng không được khai báo trong biểu thức lambda
phải được khai báo là final hoặc effectively final [(§4.12.4)](http://docs.oracle.com/javase/specs/jls/se8/html/jls-4.html#jls-4.12.4),
nếu không sẽ xảy ra lỗi biên dịch khi cố gắng sử dụng.

Ý chính là, các biến được sử dụng trong biểu thức Lambda nhưng không khai báo trong biểu thức đó phải được khai báo là final hoặc effectively final, nếu không sẽ xảy ra lỗi biên dịch.

Về sự khác biệt giữa final và effectively final, có thể có một số bạn chưa rõ, tôi sẽ giải thích thêm.

```java
final int a;
a = 1;
// a = 2; // a là final, nên không thể gán giá trị lại

int b;
b = 1;
// b sau đó không thay đổi nữa
// b là effectively final

int c;
c = 1;
// c ban đầu được gán giá trị 1, sau đó gán lại giá trị 2
c = 2;
// c không phải là effectively final
```

Hiểu sự khác biệt giữa final và effectively final, chúng ta biết rằng nếu khai báo limit là final, thì không thể thay đổi giá trị của biến đó trong biểu thức Lambda. Vậy có giải pháp nào để vừa không bị cảnh báo khi biên dịch, vừa có thể thay đổi giá trị của biến không?

Sau khi suy nghĩ và thử nghiệm, tôi đã tìm ra 3 giải pháp khả thi:

1) Khai báo biến limit là static.

2) Khai báo biến limit là AtomicInteger.

3) Sử dụng mảng.

Sau đây là chi tiết từng giải pháp.

#### 01) Khai báo biến limit là static

Để khai báo biến limit là static, ta cần đặt biến limit bên ngoài phương thức `main()` vì bản thân phương thức `main()` là static. Ví dụ mã đầy đủ như sau:

```java
public class ModifyVariable2StaticInsideLambda {
    static int limit = 10;
    public static void main(String[] args) {
        Runnable r = () -> {
            limit = 5;
            for (int i = 0; i < limit; i++) {
                System.out.println(i);
            }
        };
        new Thread(r).start();
    }
}
```

Hãy xem kết quả đầu ra của chương trình:

```
0
1
2
3
4
```

OK, giải pháp này là khả thi.

#### 02) Khai báo biến limit là AtomicInteger

AtomicInteger có thể đảm bảo việc thay đổi giá trị int là nguyên tử, có thể sử dụng phương thức `set()` để đặt một giá trị int mới và phương thức `get()` để lấy giá trị int hiện tại.

```java
public class ModifyVariable2AtomicInsideLambda {
    public static void main(String[] args) {
        final AtomicInteger limit = new AtomicInteger(10);
        Runnable r = () -> {
            limit.set(5);
            for (int i = 0; i < limit.get(); i++) {
                System.out.println(i);
            }
        };
        new Thread(r).start();
    }
}
```

Hãy xem kết quả đầu ra của chương trình:

```
0
1
2
3
4
```

OK, giải pháp này cũng khả thi.

#### 03) Sử dụng mảng

Cách sử dụng mảng có một chút lừa dối, khi khai báo mảng ta đặt là final, nhưng khi thay đổi giá trị int thì ta thay đổi một phần tử của mảng.

```java
public class ModifyVariable2ArrayInsideLambda {
    public static void main(String[] args) {
        final int [] limits = {10};
        Runnable r = () -> {
            limits[0] = 5;
            for (int i = 0; i < limits[0]; i++) {
                System.out.println(i);
            }
        };
        new Thread(r).start();
    }
}
```

Hãy xem kết quả đầu ra của chương trình:

```
0
1
2
3
4
```

OK, giải pháp này cũng khả thi.

### 03. Lambda và từ khóa this

Biểu thức Lambda không tạo ra phạm vi mới, điều này khác với lớp ẩn danh. Nói cách khác, từ khóa this trong thân biểu thức Lambda giống với thể hiện của lớp mà nó đang nằm trong đó.

Hãy xem ví dụ sau:

```java
public class LamadaTest {
    public static void main(String[] args) {
        new LamadaTest().work();
    }

    public void work() {
        System.out.printf("this = %s%n", this);

        Runnable r = new Runnable()
        {
            @Override
            public void run()
            {
                System.out.printf("this = %s%n", this);
            }
        };
        new Thread(r).start();
        new Thread(() -> System.out.printf("this = %s%n", this)).start();
    }
}
```

Gợi ý: `%s` đại diện cho chuỗi tại vị trí hiện tại, `%n` đại diện cho ký tự xuống dòng, cũng có thể dùng `\n` thay thế, nhưng `%n` là đa nền tảng.

Mã trong phương thức `work()` có thể chia thành 3 phần:

1. Từ khóa this độc lập

```java
System.out.printf("this = %s%n", this);
```

Trong đó, this là đối tượng LamadaTest được tạo thông qua từ khóa new trong phương thức `main()` — `new LamadaTest()`.

2. Từ khóa this trong lớp ẩn danh

```java
Runnable r = new Runnable()
{
    @Override
    public void run()
    {
        System.out.printf("this = %s%n", this);
    }
};
```

Trong đó, this là đối tượng Runnable được tạo trong phương thức `work()` thông qua từ khóa new — `new Runnable(){...}`.

3. Từ khóa this trong biểu thức Lambda

Trong đó, từ khóa this giống với phần 1.

Chúng ta hãy xem kết quả đầu ra của chương trình:

```java
this = com.cmower.java_demo.journal.LamadaTest@3feba861
this = com.cmower.java_demo.journal.LamadaTest$1@64f033cb
this = com.cmower.java_demo.journal.LamadaTest@3feba861
```

Phù hợp với phân tích của chúng ta.
### 04. Cuối cùng

Mặc dù biểu thức Lambda đã làm rất nhiều điều đáng kinh ngạc trong việc đơn giản hóa lập trình Java, nhưng trong một số trường hợp, sử dụng không đúng cách vẫn có thể dẫn đến sự lộn xộn không cần thiết, vì vậy mọi người hãy cẩn thận khi sử dụng.