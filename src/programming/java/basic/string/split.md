---
title: Split String
tags: ['java']
categories: ['java']
order: 7
---

Đoạn văn bạn cung cấp đang mô tả về việc cách phân tách một chuỗi ký tự trong Java dựa trên một ký tự phân tách nhất định. Dưới đây là phiên bản dịch sang tiếng Việt của đoạn văn này:

---

Bạn thấy việc phân tách chuỗi không có gì đặc biệt, chỉ cần dùng phương thức `split()` của lớp String là được!

Nếu bạn thực sự nghĩ như vậy, thì phải chú ý rằng, chuyện này không đơn giản như vậy đâu.

Giả sử bây giờ có một chuỗi ký tự như thế này "abc，def", cần phân tách dựa trên dấu phẩy, điều này có nghĩa là chuỗi đầu tiên sẽ là "abc", và chuỗi thứ hai sẽ là "def".

Trước khi phân tách, cần phải kiểm tra chuỗi ký tự này có chứa dấu phẩy không, nếu không thì nên ném ra ngoại lệ.

```java
public class Test {
    public static void main(String[] args) {
        String cmower = "abc，def";
        if (cmower.contains("，")) {
            String [] parts = cmower.split("，");
            System.out.println("Phần thứ nhất：" + parts[0] +" Phần thứ hai：" + parts[1]);
        } else {
            throw new IllegalArgumentException("Chuỗi hiện tại không chứa dấu phẩy");
        }
    }
}
```

"Bạn thấy đoạn mã này khá chặt chẽ phải không?"

```
Phần thứ nhất：abc Phần thứ hai：def
```

"Đúng như kỳ vọng."

"Điều quan trọng nhất là chuỗi là cố định, và ký tự phân tách là cố định. Nếu không, sẽ gặp rắc rối." - Tôi nói, "Có khoảng 12 loại ký tự đặc biệt trong tiếng Anh. Nếu thay thế ký tự phân tách bằng những ký tự đặc biệt này trong đoạn mã trên, khi chạy chương trình sẽ gặp lỗi như đã đề cập."


在 tiếp nối với câu chuyện, đây là phiên bản dịch tiếng Việt của đoạn văn bạn cung cấp:

---

"Ngược dấu gạch chéo `\` (ArrayIndexOutOfBoundsException)"
"Ký hiệu `^` (Giống như trên)"
"Ký hiệu `S` (Tương tự)"
"Chấm `.` (Giống như trên)"
"Dấu thẳng đứng `|` (bình thường, không có lỗi)"
"Dấu chấm hỏi `?` (PatternSyntaxException)"
"Dấu sao `*` (Giống như trên)"
"Dấu cộng `+` (Giống như trên)"
"Dấu ngoặc tròn trái hoặc ngoặc tròn phải `()` (Giống như trên)"
"Dấu ngoặc vuông trái hoặc ngoặc vuông phải `[]` (Giống như trên)"
"Dấu ngoặc nhọn trái hoặc ngoặc nhọn phải `{}` (Giống như trên)"

Vậy khi gặp những ký tự đặc biệt này thì phải làm sao?

Dùng biểu thức chính quy (Regex). Biểu thức chính quy là một chuỗi văn bản đặc biệt gồm chữ cái và ký hiệu, dùng để tìm kiếm các đoạn văn thoả mãn định dạng mà bạn mong muốn từ văn bản.

Giờ hãy dùng dấu chấm `.` để thay thế cho dấu phẩy.

```java
String cmower = "abc.def";
if (cmower.contains(".")) {
    String [] parts = cmower.split("\\.");
    System.out.println("Phần thứ nhất：" + parts[0] +" Phần thứ hai：" + parts[1]);
}
```

Vì dấu chấm tiếng Anh thuộc loại ký tự đặc biệt, khi sử dụng phương thức `split()` thì cần phải dùng biểu thức chính quy `\\.` thay vì `.` trực tiếp.

> Vì sao lại dùng hai dấu gạch chéo?
>
> Vì dấu gạch chéo chính nó cũng là một ký tự đặc biệt, cần phải sử dụng dấu gạch chéo để thoát ra.


"Tất nhiên, bạn cũng có thể sử dụng `[.]` để bao quanh dấu chấm tiếng Anh '.' trong một biểu thức chính quy, `[.]` là một biểu thức chính quy dùng để phù hợp với bất kỳ ký tự nào nằm trong ngoặc vuông."

```java
cmower.split("[.]");
```

"Ngoài ra, bạn cũng có thể sử dụng phương thức `quote()` của lớp Pattern để bao quanh dấu chấm tiếng Anh '.'. Phương thức này sẽ trả về một chuỗi được bao quanh bởi `\Q\E`."

"Hãy xem ví dụ:"

```java
String [] parts = cmower.split(Pattern.quote("."));
```

"Khi đối số của phương thức `split()` là một biểu thức chính quy, phương thức sẽ thực hiện dòng mã sau:"

```java
return Pattern.compile(regex).split(this, limit);
```

"Điều này có nghĩa là bạn có thêm lựa chọn mới để phân tách chuỗi, có thể không cần sử dụng phương thức `split()` của lớp String, mà sử dụng trực tiếp như sau."

```java
public class TestPatternSplit {
    private static Pattern twopart = Pattern.compile("\\.");

    public static void main(String[] args) {
        String [] parts = twopart.split("abc.def");
        System.out.println("Phần thứ nhất：" + parts[0] +" Phần thứ hai：" + parts[1]);
    }
}
```

Vì sao lại khai báo biểu thức Pattern là static?

Vì mẫu là cố định, sử dụng tính năng biên dịch trước static có thể cải thiện hiệu suất của chương trình. Ngoài ra, bạn cũng có thể sử dụng Pattern kết hợp với lớp Matcher để phân tách chuỗi, điều này giúp bạn áp dụng các ràng buộc nghiêm ngặt hơn lên chuỗi cần phân tách, hãy xem đoạn mã ví dụ sau.

```java
public class TestPatternMatch {
    /**
     * Sử dụng tính năng biên dịch trước để cải thiện hiệu suất
     */
    private static Pattern twopart = Pattern.compile("(.+)\\.(.+)");

    public static void main(String[] args) {
        checkString("abc.def");
        checkString("abc.");
        checkString(".def");
    }

    private static void checkString(String str) {
        Matcher m = twopart.matcher(str);
        if (m.matches()) {
            System.out.println("Phần thứ nhất：" + m.group(1) + " Phần thứ hai：" + m.group(2));
        } else {
            System.out.println("Không phù hợp");
        }
    }
}
```

"Biểu thức chính quy `(.+)\\.(.+)` có ý nghĩa là, không chỉ phân tách chuỗi theo cách của dấu chấm tiếng Anh, mà còn yêu cầu phần trước và sau dấu chấm tiếng Anh phải có nội dung."


Hãy xem kết quả xuất ra của chương trình:

```java
Phần thứ nhất：abc Phần thứ hai：def
Không phù hợp
Không phù hợp
```

Tuy nhiên, khi sử dụng Matcher để khớp một số chuỗi đơn giản, tốn nhiều tài nguyên hơn một chút so với sử dụng `split()` của lớp String, vẫn là lựa chọn hàng đầu vì phương thức này còn có một số tính năng đặc biệt. Ví dụ, nếu bạn muốn bao gồm dấu phân tách trong phần đầu của chuỗi sau khi phân tách, bạn có thể làm như sau:

```java
String cmower = "abc，def";
if (cmower.contains("，")) {
    String [] parts = cmower.split("(?<=，)");
    System.out.println("Phần thứ nhất：" + parts[0] +" Phần thứ hai：" + parts[1]);
}
```

Kết quả xuất ra của chương trình như sau:

```
Phần thứ nhất：abc， Phần thứ hai：def
```

Ở đây, dấu `(?<=，)` là một biểu thức chính quy đặc biệt, sử dụng dấu `?<=` để khớp với vị trí sau dấu phẩy "，" mà không tiêu tốn dấu phẩy đó trong kết quả phân tách.

Bạn có thể thấy rằng dấu phân cách "，" được bao quanh trong phần đầu. Nếu bạn muốn nó được bao quanh trong phần thứ hai, bạn có thể làm như sau:

```java
String [] parts = cmower.split("(?=，)");
```

`?<=` và `?=` là gì vậy?

Thực ra đó là mô hình khẳng định trong biểu thức chính quy.

"Phương thức `split()` có thể nhận hai đối số, đối số đầu tiên là dấu phân cách, và đối số thứ hai là số lượng chuỗi cần phân tách." Tôi nói.

```java
String cmower = "abcd，def，xyz";
if (cmower.contains("，")) {
    String [] parts = cmower.split("，", 2);
    System.out.println("Phần thứ nhất：" + parts[0] +" Phần thứ hai：" + parts[1]);
}
```


Điều này có nghĩa là khi bạn truyền hai đối số, nó sẽ sử dụng phương thức `substring()` để cắt chuỗi, vì vậy nó sẽ không phân tách chuỗi sau dấu phân cách thứ hai nữa.

Hãy xem kết quả xuất ra của chương trình:

```
Phần thứ nhất：abc Phần thứ hai：def，xyz
```

Thực tế trong công việc thường xuyên sử dụng phân tách chuỗi. Các front-end developer thường sẽ truyền một chuỗi dài đến backend theo các quy tắc nhất định, và backend sẽ cần phân tách chuỗi đó và xử lý.
