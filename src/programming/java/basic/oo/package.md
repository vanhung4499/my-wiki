---
title: Package
tags: ['java']
categories: ['java']
order: 2
---

# Java Package

### Về Package

Trong các đoạn mã trước, chúng ta đặt tên cho các lớp và giao diện là `Person`, `Student`, `Hello`, v.v.

Trong phát triển theo nhóm, nếu Tiểu Minh viết một lớp `Person`, Tiểu Hồng cũng viết một lớp `Person`, và bây giờ Tiểu Bạch muốn sử dụng cả `Person` của Tiểu Minh và `Person` của Tiểu Hồng, thì phải làm sao?

Nếu Tiểu Quân viết một lớp `Arrays`, và trùng hợp JDK cũng có sẵn một lớp `Arrays`, thì làm sao để giải quyết xung đột tên lớp?

Trong Java, chúng ta sử dụng `package` để giải quyết xung đột tên.

Java định nghĩa một không gian tên, gọi là gói: `package`. Một lớp luôn thuộc về một gói nào đó, tên lớp (ví dụ `Person`) chỉ là tên viết tắt, tên lớp đầy đủ là `tên_gói.tên_lớp`.

Ví dụ:

Lớp `Person` của Tiểu Minh nằm trong gói `ming`, do đó, tên lớp đầy đủ là `ming.Person`;

Lớp `Person` của Tiểu Hồng nằm trong gói `hong`, do đó, tên lớp đầy đủ là `hong.Person`;

Lớp `Arrays` của Tiểu Quân nằm trong gói `mr.jun`, do đó, tên lớp đầy đủ là `mr.jun.Arrays`;

Lớp `Arrays` của JDK nằm trong gói `java.util`, do đó, tên lớp đầy đủ là `java.util.Arrays`.

Khi định nghĩa `class`, chúng ta cần khai báo trong dòng đầu tiên lớp này thuộc về gói nào.

Tệp `Person.java` của Tiểu Minh:

```java
package ming; // Khai báo gói ming

public class Person {
}
```

Tệp `Arrays.java` của Tiểu Quân:

```java
package mr.jun; // Khai báo gói mr.jun

public class Arrays {
}
```

Khi Java Virtual Machine (JVM) thực thi, JVM chỉ xem tên lớp đầy đủ, do đó, chỉ cần tên gói khác nhau, lớp sẽ khác nhau.

Gói có thể có cấu trúc nhiều tầng, ngăn cách bằng dấu `.`. Ví dụ: `java.util`.

> Lưu ý đặc biệt: Gói không có quan hệ cha con. `java.util` và `java.util.zip` là các gói khác nhau, không có mối quan hệ kế thừa nào.

Lớp không định nghĩa tên gói sẽ sử dụng gói mặc định, rất dễ gây ra xung đột tên, do đó, không khuyến khích không viết tên gói.

Chúng ta cũng cần tổ chức các tệp Java theo cấu trúc gói. Giả sử `package_sample` là thư mục gốc, `src` là thư mục mã nguồn, thì cấu trúc tệp sẽ là:

```ascii
package_sample
└─ src
    ├─ hong
    │  └─ Person.java
    ├─ ming
    │  └─ Person.java
    └─ mr
       └─ jun
          └─ Arrays.java
```

Tức là tất cả các tệp Java phải tuân theo cấu trúc thư mục của gói.

Các tệp `.class` sau khi biên dịch cũng phải được lưu theo cấu trúc gói. Nếu sử dụng IDE, các tệp `.class` sau khi biên dịch sẽ được lưu trong thư mục `bin`, cấu trúc tệp biên dịch sẽ là:

```ascii
package_sample
└─ bin
   ├─ hong
   │  └─ Person.class
   ├─ ming
   │  └─ Person.class
   └─ mr
      └─ jun
         └─ Arrays.class
```

Lệnh biên dịch tương đối phức tạp, chúng ta cần thực hiện lệnh `javac` trong thư mục `src`:

```
javac -d ../bin ming/Person.java hong/Person.java mr/jun/Arrays.java
```

Trong IDE, sẽ tự động biên dịch tất cả mã nguồn Java theo cấu trúc gói, vì vậy không cần lo lắng về các lệnh biên dịch phức tạp khi sử dụng dòng lệnh.

### Phạm vi của Package

Các lớp nằm trong cùng một gói có thể truy cập vào các trường và phương thức có phạm vi gói.

Các trường và phương thức không được sửa đổi bằng `public`, `protected`, hoặc `private` có phạm vi gói. Ví dụ, lớp `Person` được định nghĩa trong gói `hello`:

```java
package hello;

public class Person {
    // Phạm vi gói:
    void hello() {
        System.out.println("Hello!");
    }
}
```

Lớp `Main` cũng được định nghĩa trong gói `hello`, do đó có thể trực tiếp truy cập lớp `Person`:

```java
package hello;

public class Main {
    public static void main(String[] args) {
        Person p = new Person();
        p.hello(); // Có thể gọi, vì Main và Person ở cùng một gói
    }
}
```

Như vậy, các phương thức và trường có phạm vi gói chỉ có thể được truy cập bởi các lớp khác nằm trong cùng một gói. Điều này giúp hạn chế quyền truy cập và bảo vệ các thành phần bên trong của lớp khỏi các lớp khác nằm ngoài gói đó.

### Nhập Package

Trong một `class`, chúng ta thường tham chiếu đến các `class` khác. Ví dụ, lớp `ming.Person` của Tiểu Minh nếu muốn tham chiếu đến lớp `mr.jun.Arrays` của Tiểu Quân, có ba cách viết:

Cách thứ nhất, viết đầy đủ tên lớp, ví dụ:

```java
// Person.java
package ming;

public class Person {
    public void run() {
        mr.jun.Arrays arrays = new mr.jun.Arrays();
    }
}
```

Rõ ràng, mỗi lần viết đầy đủ tên lớp sẽ rất phiền phức.

Do đó, cách thứ hai là sử dụng câu lệnh `import`, nhập lớp `Arrays` của Tiểu Quân, sau đó viết tên lớp đơn giản:

```java
// Person.java
package ming;

// Nhập tên lớp đầy đủ:
import mr.jun.Arrays;

public class Person {
    public void run() {
        Arrays arrays = new Arrays();
    }
}
```

Khi viết `import`, có thể sử dụng `*` để nhập tất cả các `class` trong gói (nhưng không bao gồm các `class` trong gói con):

```java
// Person.java
package ming;

// Nhập tất cả các class trong gói mr.jun:
import mr.jun.*;

public class Person {
    public void run() {
        Arrays arrays = new Arrays();
    }
}
```

Thông thường không khuyến khích cách viết này vì khi nhập nhiều gói, rất khó để biết lớp `Arrays` thuộc gói nào.

Có một cú pháp `import static`, cho phép nhập các trường tĩnh và phương thức tĩnh của một lớp:

```java
package main;

// Nhập tất cả các trường tĩnh và phương thức tĩnh của lớp System:
import static java.lang.System.*;

public class Main {
    public static void main(String[] args) {
        // Tương đương với việc gọi System.out.println(…)
        out.println("Hello, world!");
    }
}
```

`import static` rất ít được sử dụng.

Trình biên dịch Java cuối cùng biên dịch ra tệp `.class` chỉ sử dụng *tên lớp đầy đủ*, do đó, trong mã nguồn, khi trình biên dịch gặp một tên lớp:

- Nếu là tên lớp đầy đủ, nó sẽ tìm lớp đó dựa trên tên đầy đủ.
- Nếu là tên lớp đơn giản, nó sẽ tìm theo thứ tự sau:
  - Tìm trong `package` hiện tại có tồn tại lớp đó không.
  - Tìm trong các gói được `import` có chứa lớp đó không.
  - Tìm trong gói `java.lang` có chứa lớp đó không.

Nếu theo quy tắc trên vẫn không xác định được tên lớp, trình biên dịch sẽ báo lỗi.

Hãy xem một ví dụ:

```java
// Main.java
package test;

import java.text.Format;

public class Main {
    public static void main(String[] args) {
        java.util.List list; // ok, sử dụng tên lớp đầy đủ -> java.util.List
        Format format = null; // ok, sử dụng lớp đã nhập -> java.text.Format
        String s = "hi"; // ok, sử dụng lớp String trong gói java.lang -> java.lang.String
        System.out.println(s); // ok, sử dụng lớp System trong gói java.lang -> java.lang.System
        MessageFormat mf = null; // Lỗi biên dịch: Không tìm thấy MessageFormat: MessageFormat cannot be resolved to a type
    }
}
```

Do đó, khi viết `class`, trình biên dịch sẽ tự động thực hiện hai hành động `import`:

- Mặc định tự động `import` các `class` khác trong `package` hiện tại.
- Mặc định tự động `import java.lang.*`.

> Lưu ý: Gói `java.lang` được tự động nhập, nhưng các gói như `java.lang.reflect` vẫn cần nhập thủ công.

Nếu có hai `class` có tên giống nhau, ví dụ, `mr.jun.Arrays` và `java.util.Arrays`, chỉ có thể `import` một trong hai, lớp còn lại phải viết đầy đủ tên lớp.

### Thực tiễn tốt nhất về Package

Để tránh xung đột tên, chúng ta cần xác định tên gói duy nhất. Cách khuyến nghị là sử dụng tên miền đảo ngược để đảm bảo tính duy nhất. Ví dụ:

- org.apache
- org.apache.commons.log
- com.tobebetterjavaer.sample

Các gói con có thể được đặt tên theo chức năng.

Cần chú ý không đặt tên lớp trùng với các lớp trong gói `java.lang`, cụ thể là các tên sau:

- String
- System
- Runtime
- ...

Cũng cần chú ý không đặt tên trùng với các lớp thông dụng của JDK:

- java.util.List
- java.text.Format
- java.math.BigInteger
- ...

Sử dụng tên miền đảo ngược giúp đảm bảo rằng các gói của bạn sẽ không xung đột với gói của người khác, và đặt tên gói một cách có tổ chức giúp mã nguồn dễ quản lý và duy trì hơn.
