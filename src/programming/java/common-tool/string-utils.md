---
title: StringUtils
tags:
  - java
categories:
  - java
order: 3
---

# Apache StringUtils

`Chuỗi` ([String](/programming/java/string/immutable)) trong công việc hàng ngày của chúng ta được sử dụng rất, rất nhiều.

Trong mã nguồn của chúng ta, thường xuyên cần phải kiểm tra chuỗi rỗng, cắt chuỗi, chuyển đổi chữ hoa, chữ thường, [phân tách chuỗi](/programming/java/string/split), [so sánh chuỗi](/programming/java/string/equals), loại bỏ khoảng trắng thừa, [nối chuỗi](/programming/java/string/join), sử dụng biểu thức chính quy, v.v.

Nếu chỉ sử dụng các phương thức được cung cấp bởi lớp String, chúng ta sẽ cần viết thêm rất nhiều mã phụ, nếu không dễ gây ra các ngoại lệ khác nhau.

Bây giờ có một tin tốt là: lớp tiện ích `StringUtils` trong gói `org.apache.commons.lang3` cung cấp cho chúng ta rất nhiều lựa chọn phong phú.

Cấu hình Maven:

```
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.12.0</version>
</dependency>
```

StringUtils cung cấp rất nhiều phương thức hữu ích, có khoảng bốn đến năm trang như hình dưới đây, tôi chỉ chụp hai trang, thực sự là quá nhiều.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240704192812.png)


Tiếp theo, chúng ta sẽ lấy một số phương thức thường dùng để minh họa.

### Kiểm Tra Chuỗi Rỗng

Thực tế, chuỗi rỗng không chỉ là null, mà còn có "", " ", "null", v.v., nhiều trường hợp khác nhau.

StringUtils cung cấp cho chúng ta nhiều phương thức tĩnh để kiểm tra chuỗi rỗng, ví dụ:

```java
String str1 = null;
String str2 = "";
String str3 = " ";
String str4 = "abc";
System.out.println(StringUtils.isEmpty(str1));
System.out.println(StringUtils.isEmpty(str2));
System.out.println(StringUtils.isEmpty(str3));
System.out.println(StringUtils.isEmpty(str4));
System.out.println("=====");
System.out.println(StringUtils.isNotEmpty(str1));
System.out.println(StringUtils.isNotEmpty(str2));
System.out.println(StringUtils.isNotEmpty(str3));
System.out.println(StringUtils.isNotEmpty(str4));
System.out.println("=====");
System.out.println(StringUtils.isBlank(str1));
System.out.println(StringUtils.isBlank(str2));
System.out.println(StringUtils.isBlank(str3));
System.out.println(StringUtils.isBlank(str4));
System.out.println("=====");
System.out.println(StringUtils.isNotBlank(str1));
System.out.println(StringUtils.isNotBlank(str2));
System.out.println(StringUtils.isNotBlank(str3));
System.out.println(StringUtils.isNotBlank(str4));
```

Kết quả thực thi:

```java
true
true
false
false
=====
false
false
true
true
=====
true
true
true
false
=====
false
false
false
true
```

Trong ví dụ: `isEmpty`, `isNotEmpty`, `isBlank` và `isNotBlank`, bạn có thể sử dụng 4 phương thức kiểm tra chuỗi rỗng này tùy theo tình huống thực tế.

Ưu tiên sử dụng các phương thức `isBlank` và `isNotBlank` vì chúng cũng sẽ xem xét chuỗi `" "`.

### Phân Tách Chuỗi

Phân tách chuỗi là một nhu cầu phổ biến. Nếu sử dụng trực tiếp phương thức split của lớp String, có thể gặp phải ngoại lệ con trỏ null.

```java
String str1 = null;
System.out.println(StringUtils.split(str1, ","));
System.out.println(str1.split(","));
```

Kết quả thực thi:

```java
null
Exception in thread "main" java.lang.NullPointerException
\tat com.sue.jump.service.test1.UtilTest.main(UtilTest.java:21)
```

Sử dụng phương thức split của StringUtils sẽ trả về null, trong khi sử dụng phương thức split của String sẽ báo lỗi ngoại lệ con trỏ null.

### Kiểm Tra Chuỗi Có Phải Là Số Thuần

Cho một chuỗi, để kiểm tra nó có phải là số thuần hay không, có thể sử dụng phương thức `isNumeric`. Ví dụ:

```java
String str1 = "123";
String str2 = "123q";
String str3 = "0.33";
System.out.println(StringUtils.isNumeric(str1));
System.out.println(StringUtils.isNumeric(str2));
System.out.println(StringUtils.isNumeric(str3));
```

Kết quả thực thi:

```java
true
false
false
```

### Nối Các Phần Tử Của Một Tập Hợp Thành Chuỗi

Đôi khi, chúng ta cần nối nội dung của một tập hợp thành một chuỗi rồi xuất ra, lúc này có thể sử dụng phương thức `join`. Ví dụ:

```java
List<String> list = Lists.newArrayList("a", "b", "c");
List<Integer> list2 = Lists.newArrayList(1, 2, 3);
System.out.println(StringUtils.join(list, ","));
System.out.println(StringUtils.join(list2, " "));
```

Kết quả thực thi:

```java
a,b,c
1 2 3
```

### Các Phương Thức Khác

Dưới đây là một số phương thức khác, bạn có thể tự nghiên cứu thêm.

- `trim(String str)`：Loại bỏ khoảng trắng ở đầu và cuối chuỗi.
- `trimToEmpty(String str)`：Loại bỏ khoảng trắng ở đầu và cuối chuỗi, nếu chuỗi là null, trả về chuỗi rỗng.
- `trimToNull(String str)`：Loại bỏ khoảng trắng ở đầu và cuối chuỗi, nếu kết quả là chuỗi rỗng, trả về null.
- `equals(String str1, String str2)`：So sánh hai chuỗi có bằng nhau hay không.
- `equalsIgnoreCase(String str1, String str2)`：So sánh hai chuỗi có bằng nhau hay không, không phân biệt chữ hoa và chữ thường.
- `startsWith(String str, String prefix)`：Kiểm tra chuỗi có bắt đầu bằng tiền tố được chỉ định hay không.
- `endsWith(String str, String suffix)`：Kiểm tra chuỗi có kết thúc bằng hậu tố được chỉ định hay không.
- `contains(String str, CharSequence seq)`：Kiểm tra chuỗi có chứa chuỗi con được chỉ định hay không.
- `indexOf(String str, CharSequence seq)`：Trả về chỉ mục của chuỗi con được chỉ định xuất hiện đầu tiên trong chuỗi, nếu không tìm thấy, trả về -1.
- `lastIndexOf(String str, CharSequence seq)`：Trả về chỉ mục của chuỗi con được chỉ định xuất hiện lần cuối cùng trong chuỗi, nếu không tìm thấy, trả về -1.
- `substring(String str, int start, int end)`：Cắt chuỗi con từ vị trí bắt đầu đến vị trí kết thúc chỉ định.
- `replace(String str, String searchString, String replacement)`：Thay thế tất cả các xuất hiện của chuỗi tìm kiếm trong chuỗi bằng chuỗi thay thế được chỉ định.
- `replaceAll(String str, String regex, String replacement)`：Sử dụng biểu thức chính quy để thay thế tất cả các phần khớp trong chuỗi.
- `join(Iterable<?> iterable, String separator)`：Sử dụng dấu phân cách được chỉ định để nối các phần tử trong đối tượng có thể lặp lại thành một chuỗi.
- `split(String str, String separator)`：Sử dụng dấu phân cách được chỉ định để phân tách chuỗi thành một mảng chuỗi.
- `capitalize(String str)`：Chuyển ký tự đầu tiên của chuỗi thành chữ hoa.
- `uncapitalize(String str)`：Chuyển ký tự đầu tiên của chuỗi thành chữ thường.
