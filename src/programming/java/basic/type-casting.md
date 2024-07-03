---
title: Type Casting
tags: ['java']
categories: ['java']
date created: 2024-04-28
date modified: 2024-04-28
order: 3
---

# Chuyển đổi Kiểu Dữ Liệu trong Java

Mục đích của việc chuyển đổi kiểu dữ liệu là đảm bảo rằng trong quá trình tính giá trị biểu thức, các loại dữ liệu khác nhau có thể tương thích với nhau.

## 01. Chuyển Đổi Kiểu Dữ Liệu Tự Động

Chuyển đổi kiểu dữ liệu tự động (còn gọi là việc nâng cấp kiểu dữ liệu tự động) là quá trình mà trình biên dịch Java tự động chuyển đổi một loại dữ liệu cơ bản thành một loại dữ liệu cơ bản khác mà không cần chuyển đổi rõ ràng. Quá trình chuyển đổi này thường xảy ra trong quá trình tính toán biểu thức, khi các loại dữ liệu khác nhau cần phải tương thích với nhau. Chuyển đổi kiểu dữ liệu tự động tuân theo các quy tắc sau:

- Nếu một trong hai toán tử là kiểu double, các toán tử khác sẽ được chuyển đổi thành kiểu double.
- Nếu không, nếu một trong hai toán tử là kiểu float, các toán tử khác sẽ được chuyển đổi thành kiểu float.
- Nếu không, nếu một trong hai toán tử là kiểu long, các toán tử khác sẽ được chuyển đổi thành kiểu long.
- Nếu không, tất cả các toán tử sẽ được chuyển đổi thành kiểu int.

Cần lưu ý rằng, chuyển đổi kiểu dữ liệu tự động chỉ xảy ra giữa các loại dữ liệu tương thích. Ví dụ, chuyển đổi từ kiểu dữ liệu nhỏ hơn (ví dụ: int) sang kiểu dữ liệu lớn hơn (ví dụ: long hoặc double) là an toàn vì kiểu dữ liệu lớn hơn có thể chứa tất cả các giá trị có thể của kiểu dữ liệu nhỏ hơn.

Dưới đây là một ví dụ đơn giản, minh họa cho việc chuyển đổi kiểu dữ liệu tự động:

```java
int intValue = 5;
double doubleValue = 2.5;

// Chuyển đổi kiểu dữ liệu tự động: intValue được chuyển đổi thành kiểu double
double result = intValue * doubleValue;
System.out.println("Kết quả: " + result); // Kết quả: 12.5
```

Trong ví dụ này, chúng ta có một biến kiểu int intValue và một biến kiểu double doubleValue. Khi chúng ta nhân chúng lại với nhau, theo quy tắc chuyển đổi kiểu dữ liệu tự động, intValue sẽ được chuyển đổi thành kiểu double để nhân với doubleValue. Kết quả cuối cùng sẽ là một giá trị kiểu double: 12.5.

Một ví dụ khác, một khách hàng đến siêu thị mua sắm, mua 2 hộp kem đánh răng và 4 hộp giấy lau. Giá kem đánh răng là 10.9 đồng, giá giấy lau là 5.8 đồng, tính tổng giá cả của hàng hóa. Mã code thực hiện như sau:

```java
float price1 = 10.9f; // Định nghĩa giá của kem đánh răng, kiểu dữ liệu float
double price2 = 5.8; // Định nghĩa giá của giấy lau, kiểu dữ liệu double
int num1 = 2; // Định nghĩa số lượng của kem đánh răng, kiểu int
int num2 = 4; // Định nghĩa số lượng của giấy lau
double res = price1 * num1 + price2 * num2; // Tính tổng giá
System.out.println("Tổng cộng thanh toán cho thu ngân là " + res + " đồng"); // Xuất tổng giá
```

Trong đoạn mã trên, trước tiên chúng ta định nghĩa một biến kiểu float để lưu giá của kem đánh răng, sau đó định nghĩa một biến kiểu double để lưu giá của giấy lau, sau đó định nghĩa hai biến kiểu int để lưu số lượng hàng hóa, cuối cùng thực hiện phép nhân và phép cộng để tính tổng giá, kết quả được lưu vào một biến kiểu double để xuất ra.

```
Tổng cộng thanh toán cho thu ngân là 44.99999923706055 đồng
```

Từ kết quả thực thi, chúng ta thấy rằng float, int và double ba loại dữ liệu tham gia tính toán, kết quả cuối cùng được xuất ra là một dữ liệu kiểu double. Quá trình chuyển đổi này thường được gọi là "nâng cấp kiểu tự động trong biểu thức".

Nâng cấp kiểu tự động có lợi ích, nhưng nó cũng có thể gây ra các lỗi biên dịch gây ngạc nhiên. Ví dụ, chương trình dưới đây dường như là đúng nhưng lại gây ra vấn đề:

```java
byte b = 50;

b = b * 2; // Lỗi không phù hợp kiểu: không thể chuyển từ int sang byte
```

Như được minh họa, dòng thứ hai sẽ báo lỗi "Lỗi không phù hợp kiểu: không thể ch

uyển từ int sang byte".

Chương trình này cố gắng lưu một giá trị byte hợp lệ hoàn toàn `50*2` vào một biến byte. Nhưng khi biểu thức được tính toán, các toán hạng được tự động nâng cấp thành kiểu int, và kết quả tính toán cũng được nâng cấp thành kiểu int. Vì vậy, kết quả của biểu thức bây giờ là kiểu int, không thể gán cho một biến byte mà không cần chuyển đổi rõ ràng.

Do đó, cần sử dụng một chuyển đổi kiểu rõ ràng, như:

```java
byte b = 50;
b = (byte)(b*2);
```

Điều này sẽ tạo ra giá trị chính xác 100.

Nhưng nếu mã là như sau:

```java
byte b = 50;
b *= 2;
```

Điều này là vì `b *= 2` tương đương với `b = (byte)(b*2)`, trình biên dịch sẽ tự động thực hiện chuyển đổi kiểu.

Ngoài ra, một [đồng đội](https://javabetter.cn/zhishixingqiu/) trước đó không hiểu rõ mã như thế này:

```java
byte b = 50;
```

Đồng đội cho rằng 50 mặc định là kiểu int, việc chuyển đổi từ kiểu dữ liệu lớn hơn sang kiểu dữ liệu nhỏ hơn có nên cần chuyển đổi mạnh mẽ không?

Câu trả lời của tôi là trình biên dịch tự động thực hiện việc chuyển đổi ẩn. Một giá trị là kiểu int, nhưng giá trị của nó nằm trong phạm vi giá trị của kiểu byte (-127 đến 128), vì vậy trình biên dịch sẽ tự động chuyển đổi kiểu int thành kiểu byte.

Hy vọng mọi người hiểu, chuyển đổi kiểu tự động không chỉ giới hạn trong các kiểu nhỏ hơn sang lớn hơn, mà cũng có thể là lớn hơn sang nhỏ hơn, miễn là giá trị nằm trong phạm vi kiểu nhỏ hơn, trình biên dịch sẽ tự động thực hiện chuyển đổi ẩn.

Lưu ý: kiểu char khá đặc biệt, char tự động chuyển đổi thành int, long, float và double, nhưng byte và short không thể tự động chuyển đổi thành char, và char cũng không thể tự động chuyển đổi thành byte hoặc short.

## 02. Chuyển Đổi Kiểu Dữ Liệu Ép Buộc

Chuyển đổi kiểu dữ liệu ép buộc là quá trình trong Java để chuyển đổi một loại dữ liệu thành một loại dữ liệu khác một cách rõ ràng. Khác với chuyển đổi kiểu dữ liệu tự động, chuyển đổi kiểu dữ liệu ép buộc đòi hỏi người lập trình chỉ định một cách rõ ràng việc chuyển đổi cần thực hiện. Chuyển đổi kiểu dữ liệu ép buộc có thể cần thiết trong các trường hợp sau:

- Chuyển đổi từ loại dữ liệu lớn hơn sang loại dữ liệu nhỏ hơn.
- Chuyển đổi từ số thực sang số nguyên.
- Chuyển đổi từ kiểu ký tự sang kiểu số.

Cần lưu ý rằng, chuyển đổi kiểu dữ liệu ép buộc có thể dẫn đến mất dữ liệu hoặc giảm độ chính xác, vì loại dữ liệu đích có thể không thể chứa tất cả các giá trị có thể của loại dữ liệu nguồn. Do đó, khi thực hiện chuyển đổi kiểu dữ liệu ép buộc, cần đảm bảo rằng giá trị sau khi chuyển đổi vẫn nằm trong phạm vi của loại dữ liệu đích.

```
double -> float -> long -> int -> char -> short -> byte
```

Dưới đây là một ví dụ đơn giản, minh họa cho việc chuyển đổi kiểu dữ liệu ép buộc:

```java
double doubleValue = 42.8;

// Chuyển đổi kiểu dữ liệu ép buộc: chuyển đổi từ kiểu double sang kiểu int
int intValue = (int) doubleValue;
System.out.println("Giá trị số nguyên: " + intValue); // Kết quả: Giá trị số nguyên: 42
```

Trong ví dụ này, chúng ta có một biến kiểu double doubleValue. Chúng ta muốn chuyển đổi nó thành một biến kiểu int intValue. Để làm điều này, chúng ta sử dụng cú pháp ép kiểu rõ ràng, tức là đặt dấu ngoặc của kiểu đích trước biến cần chuyển đổi (ví dụ: (int)).

Cần lưu ý rằng, khi chuyển đổi doubleValue thành kiểu int, phần thập phân sẽ bị cắt bỏ. Do đó, kết quả sẽ là: Giá trị số nguyên: 42. Trong trường hợp này, việc mất độ chính xác là chấp nhận được, nhưng trong các trường hợp khác, chúng ta có thể cần phải xử lý chuyển đổi kiểu dữ liệu một cách cẩn thận hơn để tránh mất dữ liệu.

Một ví dụ khác, một khách hàng đến siêu thị mua sắm, mua 2 hộp kem đánh răng và 4 hộp giấy lau. Giá kem đánh răng là 10.9 đồng, giá giấy lau là 5.8 đồng, tính tổng giá cả của hàng hóa, và sử dụng kiểu dữ liệu int để lưu kết quả. Mã code thực hiện như sau:

```java
float price1 = 10.9f;
double price2 = 5.8;
int num1 = 2;
int num2 = 4;
int res2 = (int) (price1 * num1 + price2 * num2);
System.out.println("Tổng cộng thanh toán cho thu ngân là " + res2 + " đồng");
```

Trong ví dụ trên, có dữ liệu kiểu double, float và int tham gia tính toán, kết quả tính toán mặc định là kiểu double, nhưng kết quả được yêu cầu là kiểu int, vì phạm vi giá trị của kiểu int nhỏ hơn so với kiểu double, vì vậy cần phải thực hiện chuyển đổi kiểu dữ liệu ép buộc.

```
Tổng cộng thanh toán cho thu ngân là 44 đồng
```

## 03. Tóm Tắt

Hãy xem xét kết quả của các biểu thức sau:

```java
int a = 1500000000, b = 1500000000;
int sum = a + b;
long sum1 = a + b;
long sum2 = (long)a + b;
long sum3 = (long)(a + b);
```

"Những kết quả này nên giống nhau phải không? Chúng đều tính a+b mà."

"Không phải, nhìn vào các giá trị của những kết quả này đi.".

```java
-1294967296
-1294967296
3000000000
-1294967296
```

"Có gì sai không? Tại sao kết quả lại khác nhau?" Sơ Ri cảm thấy một chút bối rối.

"Đó là do phạm vi giá trị của kiểu int là `-2147483648~2147483647`, và giá trị của a và b đều là 1500000000, vượt ra ngoài phạm vi kiểu int, vì vậy sẽ xảy ra hiện tượng tràn số."

"Vậy tại sao kết quả của sum2 lại là 3000000000?"

"Đó là vì quá trình tính toán của sum2 là trước tiên chuyển a sang kiểu long (ép buộc kiểu), sau đó cộng với b (chuyển đổi kiểu ngầm định), kết quả ở bên phải cũng là kiểu long, và 3000000000 không vượt ra ngoài phạm vi kiểu long."

- `int sum = a + b`, a và b đều là kiểu int, vì vậy kết quả của a+b cũng là kiểu int, nhưng a+b vượt ra ngoài phạm vi kiểu int, vì vậy xảy ra hiện tượng tràn số.
- `long sum1 = a + b`, a và b đều là kiểu int, do đó kết quả của a+b cũng là kiểu int, nhưng vượt ra ngoài phạm vi của int, vì vậy xảy ra hiện tượng tràn số; nếu tổng a+b không vượt quá phạm vi của int, thực ra kết quả sẽ tự động chuyển đổi sang kiểu long.
- `long sum2 = (long)a + b`, a là kiểu int, nhưng `(long)a` chuyển đổi a sang kiểu long, sau đó cộng với b, lúc này b sẽ tự động tăng lên kiểu long, do đó kết quả bên phải cũng là kiểu long, và 3000000000 không vượt ra ngoài phạm vi kiểu long.
- `long sum3 = (long)(a + b)`, a và b đều là kiểu int, kết quả của a+b cũng là kiểu int, nhưng vượt ra ngoài phạm vi của int, vì vậy xảy ra hiện tượng tràn số; mặc dù có một phép chuyển đổi kiểu long bên ngoài, nhưng trước khi kịp chuyển đổi, kết quả của a+b đã tràn số, vì vậy chuyển đổi cũng vô ích.
