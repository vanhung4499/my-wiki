---
title: Data Types
tags: ['java']
categories: ['java']
date created: 2024-04-28
date modified: 2024-04-28
order: 2
---

# Các Kiểu Dữ Liệu trong Java

"Java là một ngôn ngữ lập trình có kiểu tĩnh, điều này có nghĩa là tất cả các biến phải được khai báo trước khi sử dụng, tức là phải xác định kiểu và tên biến trước."

Trong Java, có hai loại kiểu dữ liệu:

1. **Kiểu dữ liệu cơ bản**.

Kiểu dữ liệu cơ bản là nền tảng cho việc xử lý dữ liệu trong Java, bao gồm boolean, char, byte, short, int, long, float và double, tổng cộng 8 loại.

2. **Kiểu dữ liệu tham chiếu**.

Ngoài các kiểu dữ liệu cơ bản, các loại khác được gọi là kiểu tham chiếu. Các loại thông thường bao gồm mảng, lớp (class) và interface (interface) (trỏ vào các đối tượng của lớp thực thi interface).

[[Java OOP Variable|Biến]] có thể được chia thành ba loại: biến cục bộ, biến thành viên và biến tĩnh.

Khi biến là biến cục bộ, nó phải được khởi tạo trước khi sử dụng, nếu không, trình biên dịch sẽ không cho phép bạn sử dụng nó. Ví dụ với kiểu int, hãy xem hình bên dưới.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240428140047.png)

Khi biến là biến thành viên hoặc biến tĩnh, bạn có thể không cần phải khởi tạo, chúng sẽ có giá trị mặc định, vẫn lấy kiểu int làm ví dụ, hãy xem code sau:

```java
public class LocalVar {
    private int a;
    static int b;

    public static void main(String[] args) {
        LocalVar lv = new LocalVar();
        System.out.println(lv.a);
        System.out.println(b);
    }
}
```

Kết quả đầu ra là:

```
0
0
```

Như bạn thấy, giá trị mặc định của kiểu int khi là biến thành viên hoặc biến tĩnh là 0. Mỗi kiểu dữ liệu cơ bản có giá trị mặc định và kích thước khác nhau, hãy xem bảng dưới đây:

| Kiểu dữ liệu | Giá trị mặc định | Kích thước |
| ------------ | ---------------- | ---------- |
| boolean      | false            | 1 bit      |
| char         | '\u0000'         | 2 byte     |
| byte         | 0                | 1 byte     |
| short        | 0                | 2 byte     |
| int          | 0                | 4 byte     |
| long         | 0L               | 8 byte     |
| float        | 0.0f             | 4 byte     |
| double       | 0.0              | 8 byte     |

## 01. Bit và Byte

Có lẽ bạn sẽ hỏi, "Bit và Byte là gì vậy?"

Bạn đã nghe về Bitcoin chưa? Và Byte Dance? Những tên này không phải là ngẫu nhiên, chúng thực sự liên quan đến bit và byte.

### 1) Bit

Bit là đơn vị lưu trữ cơ bản nhất của công nghệ thông tin, rất nhỏ, nhưng Bitcoin nổi tiếng đã được đặt tên dựa trên nó, viết tắt của nó là chữ "b" viết thường.

Mọi người đều biết rằng máy tính lưu trữ dữ liệu dưới dạng nhị phân, một chữ số nhị phân, hoặc một bit, có thể là 0 hoặc 1.

#### 2) Byte

Thường thì, một ký tự tiếng Anh tương đương với một byte, và một ký tự tiếng Trung tương đương với hai byte. Mối quan hệ giữa byte và bit là: 1 byte = 8 bit.

Các đơn vị lớn hơn là KB, không phải là 1000 byte, vì máy tính chỉ nhận dạng nhị phân, do đó là 2 mũ 10, tức là 1024 byte.

(Cuối cùng bạn đã biết mối quan hệ giữa 1024 và các lập trình viên chưa? Chắc chắn là có!)

## 02. Kiểu Dữ Liệu Cơ Bản

### 1) Boolean

Boolean (boolean) chỉ dùng để lưu trữ hai giá trị: true và false, tương ứng với đúng và sai, thường được sử dụng để kiểm tra điều kiện. Ví dụ mã:

```java
boolean hasMoney = true;
boolean hasGirlFriend = false;
```

### 2) Byte

Một byte có thể biểu diễn 2^8 = 256 giá trị khác nhau. Vì byte có dấu, giá trị của nó có thể là số âm hoặc số dương, phạm vi giá trị là từ -128 đến 127 (bao gồm cả -128 và 127).

Trong truyền dữ liệu qua mạng, đọc/ghi tập tin lớn, byte thường được sử dụng để tiết kiệm không gian. Ví dụ mã:

```java
byte b; // Khai báo một biến kiểu byte
b = 10; // Gán giá trị 10 cho biến b
byte c = -100; // Khai báo và khởi tạo một biến kiểu byte, gán giá trị -100 cho nó
```

### 3) Short

Phạm vi giá trị của short là từ -32,768 đến 32,767, bao gồm cả 32,767. Ví dụ mã:

```java
short s; // Khai báo một biến kiểu short
s = 1000; // Gán giá trị 1000 cho biến s
short t = -2000; // Khai báo và khởi tạo một biến kiểu short, gán giá trị -2000 cho nó
```

Trong thực tế, short ít được sử dụng, có thể sử dụng kiểu int cho các số nguyên.

### 4) Int

Phạm vi giá trị của int là từ -2,147,483,648 (-2^31) đến 2,147,483,647 (2^31 -1). Nếu không có yêu cầu đặc biệt, số nguyên sẽ sử dụng kiểu int. Ví dụ mã:

```java
int i; // Khai báo một biến kiểu int
i = 1000000; // Gán giá trị 1000000 cho biến i
int j = -2000000; // Khai báo và khởi tạo một biến kiểu int, gán giá trị -2000000 cho nó
```

Tại sao phạm vi giá trị của số nguyên có dấu 32 bit là từ -2^31 đến 2^31 - 1?

Điều này là do một bit được sử dụng để biểu thị dấu (dương hoặc âm), các bit còn lại trong 31 bit còn lại được sử dụng để biểu diễn giá trị số, điều này có nghĩa là phạm vi giá trị là từ -2,147,483,648 (tức là -2^31) đến 2,147,483,647 (tức là 2^31 - 1).

Trong hệ thống nhị phân, mỗi bit có thể biểu diễn hai trạng thái là 0 và 1. Đối với số nguyên có dấu 32 bit, bỏ qua bit dấu, từ phải sang trái, mỗi bit biểu diễn lần lượt 2^0, 2^1, 2^2, …, 2^30, số nhị phân này được chuyển đổi sang hệ thập phân là 2^0 + 2^1 + 2^2 + … + 2^30, tức là 2,147,483,647.

### 5) Long

Phạm vi giá trị của long là từ -9,223,372,036,854,775,808 (-2^63) đến 9,223,372,036,854,775,807 (2^63 -1) (bao gồm cả hai giá trị đó). Nếu không đủ lưu trữ với kiểu int, bạn có thể sử dụng kiểu long. Ví dụ mã:

```java
long l; // Khai báo một biến kiểu long
l = 100000000000L; // Gán giá trị 100000000000L cho biến l (lưu ý phải thêm hậu tố L)
long m = -20000000000L; // Khai báo và khởi tạo một biến kiểu long, gán giá trị -20000000000L cho nó
```

Để phân biệt với kiểu int, biến kiểu long khi khai báo phải kết thúc bằng chữ “L” hoa. Không sử dụng chữ “l” thường, bởi vì “l” thường bị nhầm lẫn với số “1”.

### 6) Float

Float là số thực đơn (có độ chính xác khoảng 6 đến 7 chữ số), chiếm 32 bit (4 byte), tuân theo tiêu chuẩn IEEE 754 (tiêu chuẩn phép toán số học nhị phân), với phạm vi giá trị từ 1.4E-45 đến 3.4E+38. Float không phù hợp cho việc lưu trữ số liệu chính xác, như tiền bạc. Ví dụ mã:

```java
float f; // Khai báo một biến kiểu float
f = 3.14159f; // Gán giá trị 3.14159f cho biến f (lưu ý phải thêm hậu tố f)
float g = -2.71828f; // Khai báo và khởi tạo một biến kiểu float, gán giá trị -2.71828f cho nó
```

Để phân biệt với double, biến kiểu float khi khai báo phải kết thúc bằng chữ “f” thường. Không cần sử dụng chữ “F” viết hoa, vì chữ “f” thường dễ phân biệt hơn.

### 7) Double

Double là số thực đôi (có độ chính xác khoảng 15 đến 17 chữ số), chiếm 64 bit (8 byte), cũng tuân theo tiêu chuẩn IEEE 754, với phạm vi giá trị từ khoảng ±4.9E-324 đến ±1.7976931348623157E308. Double cũng không phù hợp cho việc lưu trữ số liệu chính xác, như tiền bạc.

Ví dụ mã:

```java
double myDouble = 3.141592653589793;
```

Trong các kịch bản tính toán tài chính hoặc cần tính toán số thập phân chính xác, bạn có thể sử dụng lớp [[Java BigDecimal BigInteger|BigDecimal]] để tránh lỗi làm tròn số thực. BigDecimal có thể biểu diễn một số thực bất kỳ với độ chính xác hoàn toàn chính xác.

> Trong thực tế, nếu số tiền không quá lớn (ví dụ, giữa 0.01 đồng, tức là một xu), thì khuyến nghị nhân 100 để chuyển thành số nguyên để xử lý.

### 8) Char

Char được sử dụng để biểu diễn ký tự Unicode, chiếm 16 bit (2 byte) của không gian lưu trữ, với phạm vi giá trị từ 0 đến 65,535.

Ví dụ mã:

```java
char chuA = 'A'; // Đặt ký tự trong dấu nháy đơn.
```

Lưu ý rằng ký tự được đặt trong dấu nháy đơn (''), không phải dấu nháy kép (""). Điều này là do [[Java String Constant Pool|dấu nháy kép đại diện cho chuỗi văn bản]].

## 03. Single-Precision và Double-Precision

Single-precision (đơn chính xác) và double-precision (đôi chính xác) là hai phương pháp biểu diễn số thực với độ chính xác khác nhau.

Single-precision có định dạng như sau: 1 bit cho dấu, 8 bit cho số mũ, 23 bit cho phần thập phân.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240428144429.png)

Single-precision thường chiếm 32 bit (4 byte) trong không gian lưu trữ. Phạm vi giá trị khoảng từ ±1.4E-45 đến ±3.4028235E38, độ chính xác khoảng từ 6 đến 9 chữ số có nghĩa.

Double-precision có định dạng như sau: 1 bit cho dấu, 11 bit cho số mũ, 52 bit cho phần thập phân.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240428144451.png)

Double-precision thường chiếm 64 bit (8 byte) trong không gian lưu trữ, phạm vi giá trị khoảng từ ±4.9E-324 đến ±1.7976931348623157E308, độ chính xác khoảng từ 15 đến 17 chữ số có nghĩa.

Độ chính xác tính toán phụ thuộc vào số lượng bit cho phần thập phân (phần mantissa). Nếu có nhiều bit cho phần thập phân, số có thể biểu diễn sẽ lớn hơn, do đó độ chính xác tính toán cũng sẽ cao hơn.

Một số được hình thành từ một số lượng digit nhất định, trong đó digit ảnh hưởng đến độ chính xác của đo lường được gọi là các digit có nghĩa, hoặc còn gọi là digit hiệu quả. Digit hiệu quả được xác định như sau:

- Các số không đều luôn là digit hiệu quả.
- Các số không nằm giữa hai số không luôn là digit hiệu quả.
- Đối với số thập phân, các số không ở phía trước của số không đầu tiên không có ý nghĩa.
- Đối với số nguyên, các số không ở phía sau của số không cuối cùng không có ý nghĩa.

Dưới đây là một số ví dụ để minh họa cách xác định digit hiệu quả:

- 1234: 4 digit hiệu quả (tất cả các số không đều là số khác không)
- 1002: 4 digit hiệu quả (số không nằm giữa hai số không)
- 0.00234: 3 digit hiệu quả (hai số không ở phía trước không có ý nghĩa)
- 1200: 2 digit hiệu quả (hai số không ở phía sau không có ý nghĩa)

Dưới đây là bản dịch tiếp theo về cách chuyển đổi giữa kiểu int và char trong Java:

---

## 04. Chuyển đổi giữa int và char

Chuyển đổi giữa int và char là khá đặc biệt và bạn sẽ gặp phải thường xuyên trong quá trình học.

1) Bạn có thể chuyển đổi kiểu số nguyên int thành ký tự char bằng [[Java Type Cast|ép kiểu]]

```java
int value_int = 65;
char value_char  = (char) value_int;
System.out.println(value_char);
```

Đầu ra là `A` (giá trị [[Java Unicode|ASCII tương ứng]] có thể biểu diễn bằng số nguyên 65).

2) Bạn có thể sử dụng phương thức `Character.forDigit()` để chuyển đổi số nguyên int thành ký tự char, với radix là cơ số, 10 cho hệ thập phân và 16 cho hệ thập lục phân.

```java
int radix = 10;
int value_int = 6;
char value_char = Character.forDigit(value_int , radix);
System.out.println(value_char );
```

Character là lớp bao bọc cho char. Chúng ta sẽ nói về điều này sau.

3) Bạn có thể sử dụng phương thức `toString()` của lớp bao bọc Integer của int + phương thức `charAt()` của String để chuyển đổi.

```java
int value_int = 1;
char value_char = Integer.toString(value_int).charAt(0);
System.out.println(value_char );
```

4) Chuyển đổi từ char thành int

Tất nhiên, nếu chỉ là chuyển đổi đơn giản từ char sang int, bạn có thể gán trực tiếp.

```java
int a = 'a';
```

Bởi vì đã có [[Java Type Cast|ép kiểu tự động]], chúng ta sẽ nói về nó chi tiết sau.

Tuy nhiên, nếu ký tự đó là một số, phương pháp này sẽ không hoạt động.

```java
int a = '1';
```

Kết quả sẽ là 49, không phải là 1. Bởi vì ký tự '1' trong bảng mã ASCII có giá trị là 49.

Vậy làm thế nào để chuyển đổi ký tự '1' thành số 1?

Bạn có thể sử dụng phương thức `Character.getNumericValue()`.

```java
int a = Character.getNumericValue('1');
```

Kết quả sẽ là 1.

Ngoài ra, bạn cũng có thể sử dụng phương thức `Character.digit()`.

```java
int a = Character.digit('1', 10);
```

Kết quả sẽ là 1.

Vì hai phương thức này có cách thức triển khai khá tương tự, bạn có thể tìm hiểu mã nguồn của chúng.

Cuối cùng, có một cách rõ ràng hơn, đó là sử dụng phép trừ `- '0'`.

```java
int a = '1' - '0';
```

Kết quả sẽ là 1. Điều này là do trong bảng mã ASCII và Unicode (Java sử dụng Unicode), các ký tự số từ '0' đến '9' là liên tục và giá trị mã của chúng tăng dần.

Ký tự '0' có giá trị mã là 48, ký tự '1' có giá trị mã là 49, và tiếp tục như vậy. Khi trừ giá trị mã của ký tự '0' (48) khỏi giá trị mã của ký tự được xác định (ví dụ '5'), bạn sẽ nhận được giá trị số mà ký tự đó biểu diễn. Ví dụ, đối với ký tự '5', giá trị mã của nó là 53. 53 - 48 là 5, đây chính là giá trị số mà ký tự '5' biểu diễn.

## 05. Wrapper Type

Wrapper Type là một loại đặc biệt trong Java, được sử dụng để chuyển đổi các kiểu dữ liệu cơ bản (như int, float, char, v.v.) thành các [[Java OOP Object Class|Wrapper Type]].

Java cung cấp các loại wrapper sau, tương ứng một cách một một với các kiểu dữ liệu cơ bản:

- Byte (tương ứng với byte)
- Short (tương ứng với short)
- Integer (tương ứng với int)
- Long (tương ứng với long)
- Float (tương ứng với float)
- Double (tương ứng với double)
- Character (tương ứng với char)
- Boolean (tương ứng với boolean)

Các loại wrapper cho phép chúng ta sử dụng các phương thức hữu ích của các kiểu dữ liệu cơ bản và tương thích với các tình huống cần sử dụng kiểu đối tượng. Ví dụ, chúng ta có thể sử dụng phương thức parseInt của lớp Integer để chuyển đổi chuỗi thành số nguyên, hoặc sử dụng phương thức isDigit của lớp Character để kiểm tra xem ký tự có phải là số không, cùng với phương thức Character.forDigit() đã được đề cập trước đó.

Dưới đây là một ví dụ đơn giản, minh họa cách sử dụng các loại wrapper:

```java
// Sử dụng loại wrapper Integer
Integer integerValue = new Integer(42);
System.out.println("Giá trị số nguyên: " + integerValue);

// Chuyển đổi chuỗi thành số nguyên
String numberString = "123";
int parsedNumber = Integer.parseInt(numberString);
System.out.println("Giá trị số nguyên: " + parsedNumber);

// Sử dụng loại wrapper Character
Character charValue = new Character('A');
System.out.println("Ký tự: " + charValue);

// Kiểm tra xem ký tự có phải là số không
char testChar = '9';
if (Character.isDigit(testChar)) {
    System.out.println("Ký tự là một số.");
}
```

Trong ví dụ trên, chúng ta tạo một đối tượng kiểu Integer có tên integerValue và gán cho nó giá trị là 42. Sau đó, chúng ta in giá trị này ra màn hình.

Chúng ta có một chuỗi chứa số numberString. Chúng ta sử dụng phương thức Integer.parseInt() để chuyển đổi nó thành một số nguyên parsedNumber. Sau đó, chúng ta in giá trị chuyển đổi ra màn hình.

Ví dụ như `parseInt()` được sử dụng để chuyển đổi chuỗi thành số nguyên, đây cũng là một phương thức rất phổ biến, đặc biệt là khi cần chuyển đổi "chuỗi số" thành số nguyên.

```java
String text = "123";
int number = Integer.parseInt(text);
System.out.println(number);
```

Bạn có thể xem mã nguồn của `parseInt()` như sau:

```java
public static int parseInt(String s, int radix) throws NumberFormatException {
    // Nếu chuỗi là null hoặc hệ cơ số không nằm trong phạm vi hợp lệ, ném NumberFormatException
    if (s == null || radix < Character.MIN_RADIX || radix > Character.MAX_RADIX) {
        throw new NumberFormatException();
    }

    int result = 0; // Biến để lưu kết quả phân tích
    boolean negative = false; // Đánh dấu xem số có là âm hay không
    int i = 0, len = s.length(); // i là chỉ mục ký tự, len là độ dài chuỗi
    int limit = -Integer.MAX_VALUE; // Giới hạn kiểm tra tràn số

    if (len > 0) {
        char firstChar = s.charAt(0); // Lấy ký tự đầu tiên của chuỗi
        if (firstChar == '-') { // Nếu là dấu trừ
            negative = true; // Đặt cờ số âm
            limit = Integer.MIN_VALUE; // Đặt giới hạn tràn số là giá trị nhỏ nhất của Integer
            i++;
        } else if (firstChar == '+') { // Nếu là dấu cộng
            i++; // Chỉ bỏ qua, không làm thêm việc gì
        }

        int multmin = limit / radix; // Tính giá trị ranh giới kiểm tra tràn số
        while (i < len) {
            // Chuyển ký tự thành giá trị số tương ứng
            int digit = Character.digit(s.charAt(i++), radix);
            if (digit < 0 || result < multmin || result * radix < limit + digit) {
                // Nếu ký tự không phải là số hợp lệ hoặc kết quả tràn số, ném NumberFormatException
                throw new NumberFormatException();
            }
            // Tích luỹ kết quả
            result = result * radix - digit;
        }
    } else {
        // Nếu chuỗi là rỗng, ném NumberFormatException
        throw new NumberFormatException();
    }

    // Trả về kết quả cuối cùng dựa trên dấu
    return negative ? result : -result;
}

```

Chỉ cần giải thích ngắn gọn:

1. **Kiểm tra giá trị null**: Đầu tiên kiểm tra xem chuỗi nhập vào có phải là `null` không. Nếu có, ném ra ngoại lệ `NumberFormatException`.

2. **Xử lý dấu**: Kiểm tra ký tự đầu tiên của chuỗi để xác định dấu của số (dương hoặc âm). Nếu chuỗi bắt đầu bằng "-" thì số là số âm, bắt đầu bằng "+" hoặc số là số dương.

3. **Chuyển đổi số**: Duyệt qua từng ký tự trong chuỗi và chuyển đổi ký tự thành số tương ứng. Điều này được thực hiện bằng cách trừ đi giá trị ASCII của ký tự '0'.

4. **Tính toán kết quả**: Tính toán giá trị số cuối cùng. Điều này được thực hiện bằng cách nhân mỗi số với trọng số của nó (10 mũ số lượng chữ số) và cộng vào kết quả.

5. **Kiểm tra tràn số**: Trong quá trình chuyển đổi, mã kiểm tra xem có nguy cơ tràn số không. Nếu phát hiện tràn số, sẽ ném ra `NumberFormatException`.

6. **Trả về kết quả**: Trả về kết quả cuối cùng dựa trên dấu của số.

Đoạn mã này rất hữu ích cho việc học bài [8. String to Integer (atoi)](https://leetcode.com/problems/string-to-integer-atoi/) trên LeetCode.

Chúng ta có một biến ký tự là `testChar`, và gán giá trị cho nó là ký tự '9'. Chúng ta sử dụng phương thức `Character.isDigit()` để kiểm tra xem `testChar` có phải là ký tự số không. Nếu là ký tự số, chúng ta sẽ in ra một thông điệp trên console.

Từ Java 5 trở đi, cơ chế tự động đóng gói và tự động mở gói cho phép chúng ta chuyển đổi giữa các kiểu dữ liệu cơ bản và kiểu bọc tự động mà không cần gọi phương thức tạo hoặc phương thức chuyển đổi một cách rõ ràng (link bên trong sẽ giải thích chi tiết).

```java
Integer integerValue = 42; // Tự động đóng gói, tương đương với new Integer(42)
int primitiveValue = integerValue; // Tự động mở gói, tương đương với integerValue.intValue()
```

## 06. Kiểu dữ liệu tham chiếu

Trong Java, các kiểu dữ liệu cơ bản khi được sử dụng làm biến thành viên và biến tĩnh có giá trị mặc định, và tương tự như vậy, kiểu dữ liệu tham chiếu cũng có giá trị mặc định (sau khi học về mảng & chuỗi, và lập trình hướng đối tượng sẽ hiểu rõ hơn, nhưng ở đây chúng ta sẽ đi qua một cách đơn giản trước).

[[Java String Immutable|String]] là kiểu dữ liệu tham chiếu điển hình nhất, vì vậy chúng ta sẽ lấy lớp String làm ví dụ, xem đoạn mã dưới đây:

```java
public class LocalRef {
    private String a;
    static String b;

    public static void main(String[] args) {
        LocalRef lv = new LocalRef();
        System.out.println(lv.a);
        System.out.println(b);
    }
}
```

Kết quả xuất ra như sau:

```
null
null
```

null là một sự tồn tại rất kỳ diệu trong Java, bạn sẽ gặp nó nhiều trong sự nghiệp lập trình của bạn, đặc biệt là với lỗi "null pointer exception" khó chịu, cũng gọi là `NullPointerException`.

Nói cách khác, giá trị mặc định của kiểu dữ liệu tham chiếu là null, bao gồm cả mảng và interface.

Vậy bạn có thắc mắc tại sao [[Java Array In Depth|Array]] và [[Java OOP Interface|Interface]] cũng là kiểu dữ liệu tham chiếu chứ?

Đầu tiên, hãy xem xét mảng:

```java
int [] arrays = {1,2,3};
System.out.println(arrays);
```

arrays là một mảng kiểu int, phải không? Kết quả in ra như sau:

```
[I@2d209079
```

Trong đó, `[I` biểu thị cho mảng kiểu int, và sau dấu `@` là giá trị hash mã hexadecima—đây là cách in ra khá "máy móc", đối với phần lớn mọi người không dễ hiểu! Tại sao lại hiển thị như vậy? Hãy xem xét phương thức `toString()` của lớp `java.lang.Object` để hiểu rõ hơn.

Mặc dù mảng không được định nghĩa một cách rõ ràng như một lớp, nhưng nó thực sự là một đối tượng, kế thừa tất cả các phương thức từ lớp cha Object. Vậy tại sao mảng không được định nghĩa riêng một lớp để biểu diễn như chuỗi String chẳng hạn?

Một giải thích hợp lý là Java đã giấu nó đi. Nếu thực sự tồn tại một Array.java, chúng ta cũng có thể tưởng tượng ra dạng thực sự của nó, nó sẽ phải định nghĩa một bộ chứa để lưu trữ các phần tử của mảng, giống như lớp String vậy.

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];
}
```

Tiếp theo, hãy xem xét về interface:

```java
List<String> list = new ArrayList<>();
System.out.println(list);
```

[List](https://javabetter.cn/collection/gailan.html) là một interface rất điển hình:

```java
public interface List<E> extends Collection<E> {}
```

Trong khi [ArrayList](https://javabetter.cn/collection/arraylist.html) là một trong các lớp thực hiện interface List:

```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{}
```

Đối với biến tham chiếu của kiểu interface, bạn không thể trực tiếp tạo một đối tượng mới:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/nine-07.png)

Bạn chỉ có thể tạo một đối tượng của lớp triển khai interface đó - và vì vậy, interface cũng là một loại dữ liệu tham chiếu.

Hãy xem xét sự khác biệt lớn nhất giữa kiểu dữ liệu cơ bản và kiểu dữ liệu tham chiếu:

Kiểu dữ liệu cơ bản:

- 1. Tên biến trỏ đến một giá trị cụ thể.
- 2. Kiểu dữ liệu cơ bản được lưu trữ trên stack.

Kiểu dữ liệu tham chiếu:

- 1. Tên biến trỏ đến địa chỉ bộ nhớ của đối tượng, trên stack.
- 2. Đối tượng mà địa chỉ bộ nhớ trỏ đến được lưu trữ trên heap.

### 07. Stack và Heap

Khi đọc đoạn này, có lẽ bạn sẽ lại hỏi, “Stack là gì, Heap là gì?”

Heap là không gian được cấp phát trong bộ nhớ khi chương trình đang chạy (có thể hiểu là quá trình động); hãy nhớ rằng, không phải là trong quá trình biên dịch; do đó, đối tượng trong Java được đặt ở đây, điều này có lợi ích là:

> Khi cần một đối tượng, chỉ cần viết một dòng mã bằng từ khóa new, khi thực thi dòng mã này, không gian sẽ tự động được cấp phát trong vùng nhớ "heap" —— điều này rất linh hoạt.

Stack, có thể liên kết trực tiếp với bộ xử lý (CPU, cũng chính là não), do đó tốc độ truy cập nhanh hơn. Vì tốc độ truy cập nhanh, phải tận dụng tốt nhé! Java đặt tham chiếu của đối tượng vào Stack. Tại sao vậy? Bởi vì tần suất sử dụng tham chiếu cao chứ?

Không, bởi vì khi biên dịch chương trình Java, phải rõ ràng biết về tuổi thọ của những thứ được lưu trữ trong stack, nếu không sẽ không thể giải phóng bộ nhớ cũ để cấp phát không gian mới để lưu trữ tham chiếu —— không gian chỉ có giới hạn đấy, dòng sóng trước phải làm cho dòng sóng sau bị đánh bại trên bãi biển đấy.

Hãy sử dụng hình ảnh để biểu diễn, bên trái là stack, bên phải là heap.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240428154208.png)

Ở đây, tôi sẽ bổ sung thêm một số kiến thức bổ sung, nếu bạn có thể hiểu, hãy tiếp tục tiếp thu, nếu không, bạn có thể đi học phần tiếp theo trước, sau này có thể quay lại bổ sung, không sao cả. Học tập là như vậy, có thể bỏ qua, có thể ôn lại.

### Ví dụ.

```java
String a = new String("Hello")
```

Đoạn mã này sẽ tạo một đối tượng chuỗi "Hello" trong heap trước, sau đó đặt tham chiếu của đối tượng vào biến a trong stack. Điều này cũng liên quan đến [[Java String Constant Pool|hằng số chuỗi]], chúng ta sẽ nói sau.

Vậy đối với một đoạn mã như thế này, cả kiểu dữ liệu cơ bản và kiểu dữ liệu tham chiếu đều được lưu trữ như thế nào trong heap và stack?

```java
public void test()
{
    int i = 4;
    int y = 2;
    Object o1 = new Object();
}
```

Tôi sẽ vẽ một biểu đồ để minh họa.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/basic-data-type-3d5b3e40-1abb-4624-8282-b83e58388825.png)

### 08. Tóm tắt

Trong bài viết này, chúng ta đã chi tiết khám phá về các loại dữ liệu trong Java, bao gồm bit và byte, kiểu dữ liệu cơ bản, số đơn và số kép, chuyển đổi giữa int và char, kiểu wrapper, kiểu dữ liệu tham chiếu và mô hình bộ nhớ heap và stack. Thông qua việc đọc bài viết này, bạn sẽ hiểu rõ về các khái niệm và cách sử dụng các loại dữ liệu trong Java, từ đó đặt nền móng vững chắc cho việc lập trình Java.
