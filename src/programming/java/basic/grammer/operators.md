---
title: Operators
tags: ['java']
categories: ['java']
date created: 2024-04-28
date modified: 2024-04-28
order: 5
---

# Các toán tử trong Java

## 01. Toán tử số học

Toán tử số học không chỉ bao gồm cộng, trừ, nhân, chia thông thường, mà còn có một toán tử lấy phần dư, được sử dụng để lấy phần dư của phép chia, hãy xem mã nguồn dưới đây để cảm nhận.

```java
int a = 10;
int b = 5;

System.out.println(a + b);//15
System.out.println(a - b);//5
System.out.println(a * b);//50
System.out.println(a / b);//2
System.out.println(a % b);//0

b = 3;
System.out.println(a + b);//13
System.out.println(a - b);//7
System.out.println(a * b);//30
System.out.println(a / b);//3
System.out.println(a % b);//1
```

Đối với người mới học, phép cộng (+), trừ (-), nhân (*) dễ hiểu, nhưng phép chia (/) và lấy phần dư (%) có thể gây một chút nhầm lẫn. Trong ý thức của người ta, 10/3 không chia hết, kết quả nên là 3.333333…, không phải là 3. Tương tự, phần dư cũng không nên là 1. Tại sao lại như vậy?

Bởi vì số trong chương trình có thể chia thành hai loại, một loại là số nguyên, một loại là số dấu chấm động (float, double) (các bạn không hiểu có thể quay lại xem [[Java Data Types]]), kết quả của phép toán giữa các số nguyên là số nguyên, không phải là số dấu chấm động. Nếu không, sẽ là số dấu chấm động.

```java
int a = 10;
float c = 3.0f;
double d = 3.0;
System.out.println(a / c); // 3.3333333
System.out.println(a / d); // 3.3333333333333335
System.out.println(a % c); // 1.0
System.out.println(a % d); // 1.0
```

Cần lưu ý rằng, khi số dấu chấm động chia cho 0, kết quả là Infinity hoặc NaN.

```java
System.out.println(10.0 / 0.0); // Infinity
System.out.println(0.0 / 0.0); // NaN
```

Infinity có nghĩa là vô cùng lớn, NaN có nghĩa là Đây không phải là một số (Not a Number).

Khi số nguyên chia cho 0 (`10 / 0`), một [[Java Exception Guide|ngoại lệ]]được ném:

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at com.itwanger.eleven.ArithmeticOperator.main(ArithmeticOperator.java:32)
```

Vì vậy, khi thực hiện phép chia số nguyên, cần kiểm tra trước xem mẫu số có phải là 0 không, để tránh ngoại lệ.

Trong toán tử số học còn có hai loại đặc biệt khác, toán tử tăng lên (++), và toán tử giảm đi (--), chúng cũng được gọi là toán tử một ngôi, chỉ có một toán hạng.

```java
int x = 10;
System.out.println(x++);//10 (11)
System.out.println(++x);//12
System.out.println(x--);//12 (11)
System.out.println(--x);//10
```

Toán tử một ngôi có thể đặt trước hoặc sau số, đặt trước gọi là tăng trước (giảm trước), đặt sau gọi là tăng sau (giảm sau).

Tăng trước và tăng sau là khác biệt, với biểu thức `int y = ++x` (x = 10), nó có thể chia thành `x = x+1 = 11; y = x = 11`, vì vậy kết quả của biểu thức là `x = 11, y = 11`. Với biểu thức

 `int y = x++` (x = 10), nó có thể chia thành `y = x = 10; x = x+1 = 11`, vì vậy kết quả của biểu thức là `x = 11, y = 10`.

```java
int x = 10;
int y = ++x;
System.out.println(y + " " + x);// 11 11

x = 10;
y = x++;
System.out.println(y + " " + x);// 10 11
```

Với toán tử giảm trước và giảm sau, bạn có thể tự thử một lần.

## 02. Toán tử quan hệ

Toán tử quan hệ được sử dụng để so sánh hai toán hạng và trả về kết quả là true hoặc false.

Hãy xem ví dụ sau:

```java
int a = 10, b = 20;
System.out.println(a == b); // false
System.out.println(a != b); // true
System.out.println(a > b); // false
System.out.println(a < b); // true
System.out.println(a >= b); // false
System.out.println(a <= b); // true
```

Trong ví dụ trên, chúng ta so sánh giá trị của hai biến `a` và `b` sử dụng các toán tử quan hệ và in ra kết quả.

## 03. Toán tử bit

Trước khi học về toán tử bit, cần phải hiểu về hệ nhị phân, vì toán tử bit không thao tác trên giá trị số nguyên (int, long, short, char, byte) mà là trên biểu diễn nhị phân của giá trị số nguyên.

```java
System.out.println(Integer.toBinaryString(60)); // 111100
System.out.println(Integer.toBinaryString(13)); // 1101
```

Từ kết quả đầu ra của chương trình, chúng ta có thể thấy rằng số nhị phân của 60 là 0011 1100 (điền thêm 0 đến 8 bit), và số nhị phân của 13 là 0000 1101.

> PS: Hệ thống đếm nhị phân hiện đại được thiết kế bởi Gottfried Wilhelm Leibniz vào năm 1679. Leibniz là một nhà triết học, toán học, một hiếm hoi trong lịch sử.

Hãy xem ví dụ sau:

```java
int a = 60, b = 13;
System.out.println("Nhị phân của a: " + Integer.toBinaryString(a)); // 111100
System.out.println("Nhị phân của b: " + Integer.toBinaryString(b)); // 1101

int c = a & b;
System.out.println("a & b: " + c + ", nhị phân: " + Integer.toBinaryString(c));

c = a | b;
System.out.println("a | b: " + c + ", nhị phân: " + Integer.toBinaryString(c));

c = a ^ b;
System.out.println("a ^ b: " + c + ", nhị phân: " + Integer.toBinaryString(c));

c = ~a;
System.out.println("~a: " + c + ", nhị phân: " + Integer.toBinaryString(c));

c = a << 2;
System.out.println("a << 2: " + c + ", nhị phân: " + Integer.toBinaryString(c));

c = a >> 2;
System.out.println("a >> 2: " + c + ", nhị phân: " + Integer.toBinaryString(c));

c = a >>> 2;
System.out.println("a >>> 2: " + c + ", nhị phân: " + Integer.toBinaryString(c));
```

Đối với người mới bắt đầu, các toán tử bitwise không tính toán kết quả một cách trực quan, không giống như phép cộng, phép trừ, phép nhân và phép chia. Bởi vì những gì chúng ta xử lý hàng ngày là số thập phân nên khi thực hiện các phép toán trên bit, chúng ta cần chuyển nó sang nhị phân trước rồi tính kết quả.

Theo quan điểm này, người mới bắt đầu hiếm khi sử dụng các thao tác bit khi viết code. Đối với các chuyên gia lập trình, để cải thiện hiệu suất của chương trình, các thao tác bit được sử dụng ở một số nơi. Ví dụ: khi HashMap tính giá trị băm:

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

Nếu bạn không hiểu chút nào về hoạt động của bit thì sẽ rất khó gặp được mã nguồn như vậy. Vì vậy, mặc dù các thao tác trên bit hiếm khi được sử dụng nhưng bạn vẫn cần hiểu rõ về chúng.

1) Toán tử di chuyển bit sang trái:

```java
System.out.println(10<<2);//10*2^2=10*4=40
System.out.println(10<<3);//10*2^3=10*8=80
System.out.println(20<<2);//20*2^2=20*4=80
System.out.println(15<<4);//15*2^4=15*16=240
```

`10<<2` tương đương với 10 nhân với 2 mũ 2; `10<<3` tương đương với 10 nhân với 2 mũ 3.

2) Toán tử di chuyển bit sang phải:

```java
System.out.println(10>>2);//10/2^2=10/4=2
System.out.println(20>>2);//20/2^2=20/4=5
System.out.println(20>>3);//20/2^3=20/8=2
```

`10>>2` tương đương với 10 chia cho 2 mũ 2; `20>>2` tương đương với 20 chia cho 2 mũ 2.

## 04. Toán tử logic

Toán tử logic "và" (&&): Kết quả là true nếu tất cả các điều kiện là true, ngược lại kết quả là false.

Toán tử logic "hoặc" (||): Kết quả là true nếu ít nhất một điều kiện là true, ngược lại kết quả là false.

```java
int a=10;
int b=5;
int c=20;
System.out.println(a<b&&a<c);//false && true = false

System.out.println(a>b||a<c);//true || true = true
```

Toán tử logic "NOT" (!): Được sử dụng để đảo ngược kết quả của điều kiện, nếu điều kiện là true thì kết quả là false và ngược lại.

Toán tử logic "AND" (&): Ít khi sử dụng vì nó sẽ kiểm tra cả hai điều kiện dù điều kiện đầu tiên là true hay false.

Toán tử logic "OR" (|): Cũng sẽ kiểm tra cả hai điều kiện.

Tóm lại, & và | không hiệu quả như && và ||, nhưng cú pháp sử dụng tương tự:

```java
int a=10;
int b=5;
int c=20;
System.out.println(a<b&a<c);//false & true = false

System.out.println(a>b|a<c);//true | true = true
```

## 05. Toán tử gán

Toán tử gán có lẽ là một trong những toán tử được sử dụng thường xuyên nhất trong Java, nó được sử dụng để gán giá trị bên phải của toán tử cho biến bên trái. Hãy xem ví dụ sau:

```java
int a=10;
int b=20;
a+=4;//a=a+4 (a=10+4)
b-=4;//b=b-4 (b=20-4)
System.out.println(a);
System.out.println(b);
```

Tuy nhiên, khi thực hiện việc gán giá trị số, cần phải cẩn thận một chút, ví dụ như trường hợp sau:

```java
short a = 10;
short b = 10;
//a+=b;//a=a+b internally so fine
a = a + b;
System.out.println(a);
```

Lý do trình biên dịch cảnh báo lỗi là vì biểu thức toán hạng bên phải của dấu = mặc định là kiểu int, khi bên trái là kiểu short cần phải thực hiện chuyển đổi kiểu ép buộc.

```java
short a = 10;
short b = 10;
//a+=b;//a=a+b internally so fine
a = (short)(a + b);
System.out.println(a);
```

Ngoài ra, còn có vấn đề về ranh giới, ví dụ, khi nhân hai số nguyên lớn rất lớn, kết quả có thể vượt quá phạm vi của kiểu int:

```java
int a = Integer.MAX_VALUE;
int b = 10000;
int c = a * b;
System.out.println(c); // -10000
```

Kết quả của chương trình là -10000, điều này rõ ràng không phải là kết quả mong muốn, mặc dù có thể giải quyết bằng cách ép kiểu sang long cho biểu thức bên phải:

```java
int a = Integer.MAX_VALUE;
int b = 10000;
long c = (long)a * b;
System.out.println(c); // 21474836470000
```

Tuy nhiên, hãy cố gắng tránh làm như vậy, khi kết quả rất lớn, hãy sử dụng kiểu tương ứng từ trước để gán giá trị.

```java
long a = Integer.MAX_VALUE - 1;
long b = 10000;
long c = a * b;
System.out.println(c); // 21474836460000
```

## 06. Toán tử ba ngôi

Toán tử ba ngôi được sử dụng để thay thế cho câu lệnh if-else, có thể hoàn thành điều kiện kiểm tra chỉ trong một dòng code. Hãy xem ví dụ sau:

```java
int a=2;
int b=5;
int min=(a<b)?a:b;
System.out.println(min);
```

Nếu điều kiện trước dấu `?` là true, thì kết quả sẽ là giá trị trước dấu `:`, ngược lại sẽ là giá trị sau dấu `:`.
