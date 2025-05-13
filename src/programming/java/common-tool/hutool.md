---
title: Hutool
tags:
  - java
categories:
  - java
order: 6
---

# Hutool

Một thành viên trong nhóm đọc giả của tôi đã thốt lên rằng, "Thư viện mã nguồn mở Hutool thật sự tuyệt vời, nó có đầy đủ các công cụ mà chúng ta cần." Thực sự, tôi cũng thường xuyên sử dụng Hutool trong công việc hàng ngày. Nó giúp chúng ta đơn giản hóa từng dòng mã, mang lại sự thanh lịch như ngôn ngữ hàm cho Java, làm cho Java trở nên đẹp hơn.

### 01. Thêm Hutool vào dự án

Dự án Maven chỉ cần thêm dependency sau vào file pom.xml.

```
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.4.3</version>
</dependency>
```

Triết lý thiết kế của Hutool là giảm thiểu các định nghĩa lặp lại, giúp cho gói util trong dự án càng ít càng tốt. Một thư viện tốt có thể giúp tránh được việc "sao chép và dán", từ đó tiết kiệm thời gian của chúng ta trong việc đóng gói các thư viện và phương thức công cụ dùng chung. Đồng thời, một thư viện mã nguồn mở hoàn chỉnh cũng giúp giảm thiểu tối đa các lỗi phát sinh từ việc đóng gói không hoàn thiện.

Như tác giả đã nói trên trang web:

- Trước đây, chúng ta mở công cụ tìm kiếm -> Tìm kiếm "Java MD5 encryption" -> Mở một bài blog -> Sao chép và dán -> Chỉnh sửa một chút để dùng được
- Bây giờ, với Hutool, chỉ cần thêm Hutool -> Gọi trực tiếp `SecureUtil.md5()`

Hutool không chỉ đóng gói các lớp cơ bản của JDK như file, stream, mã hóa và giải mã, mã hóa ký tự, regex, luồng, XML, mà còn cung cấp các thành phần sau:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240704191802.png)


Rất nhiều và rất đầy đủ, vì vậy tôi chỉ chọn một số thành phần mà tôi thích để giới thiệu.

### 02. Chuyển đổi loại dữ liệu

Chuyển đổi loại dữ liệu rất phổ biến trong phát triển Java, đặc biệt là khi lấy tham số từ HttpRequest. Phía trước truyền số nguyên, nhưng phía sau chỉ có thể lấy được chuỗi, sau đó phải gọi phương thức `parseXXX()` để chuyển đổi và phải kiểm tra null, rất phiền phức.

Lớp Convert của Hutool có thể đơn giản hóa việc này, nó có thể chuyển đổi bất kỳ loại dữ liệu nào thành loại chỉ định, tham số thứ hai defaultValue có thể dùng để trả về giá trị mặc định khi chuyển đổi thất bại.

```java
String param = "10";
int paramInt = Convert.toInt(param);
int paramIntDefault = Convert.toInt(param, 0);
```

Chuyển chuỗi thành ngày tháng:

```java
String dateStr = "2020-09-29";
Date date = Convert.toDate(dateStr);
```

Chuyển chuỗi thành Unicode:

```java
String unicodeStr = "Hùng";
String unicode = Convert.strToUnicode(unicodeStr);
```

### 03. Ngày và Thời gian

JDK cung cấp các lớp Date và Calendar nhưng không thực sự tiện lợi. Hutool đã đóng gói lớp DateUtil, giúp việc sử dụng dễ dàng hơn nhiều!

Lấy ngày hiện tại:

```java
Date date = DateUtil.date();
```

`DateUtil.date()` thực chất trả về một đối tượng DateTime, kế thừa từ lớp Date và ghi đè phương thức `toString()`, trả về chuỗi định dạng `yyyy-MM-dd HH:mm:ss`.

Một số bạn có thể muốn biết thời gian tôi viết bài này, đây là kết quả khi in ra:

```
System.out.println(date); // 2024-06-29 04:28:02
```

Chuyển chuỗi thành ngày:

```java
String dateStr = "2020-09-29";
Date date = DateUtil.parse(dateStr);
```

`DateUtil.parse()` sẽ tự động nhận diện một số định dạng phổ biến, ví dụ:

- yyyy-MM-dd HH:mm:ss
- yyyy-MM-dd
- HH:mm:ss
- yyyy-MM-dd HH:mm
- yyyy-MM-dd HH:mm:ss.SSS

Định dạng chênh lệch thời gian:

```java
String dateStr1 = "2020-09-29 22:33:23";
Date date1 = DateUtil.parse(dateStr1);

String dateStr2 = "2020-10-01 23:34:27";
Date date2 = DateUtil.parse(dateStr2);

long betweenDay = DateUtil.between(date1, date2, DateUnit.MS);

// Output: 2 days, 1 hour, 1 minute and 4 seconds
String formatBetween = DateUtil.formatBetween(betweenDay, BetweenFormater.Level.SECOND);
```

Cung hoàng đạo và con giáp:

```java
// Sagittarius
String zodiac = DateUtil.getZodiac(Month.DECEMBER.getValue(), 10);
// Rabbit
String chineseZodiac = DateUtil.getChineseZodiac(1999);
```

### 04. IO liên quan

[IO bao gồm đọc và ghi](/programming/java/io/shangtou.html), ứng dụng chính trong các hoạt động mạng và thao tác file. Thư viện Java nguyên gốc phân biệt giữa [character stream](character.md) và [byte stream](/programming/java/io/stream.html), có rất nhiều loại InputStream và OutputStream, việc sử dụng có thể làm người ta đau đầu.

Hutool đóng gói các công cụ thao tác luồng như IoUtil, công cụ đọc và ghi file FileUtil, công cụ xác định loại file FileTypeUtil, v.v.

```java
BufferedInputStream in = FileUtil.getInputStream("hutool/origin.txt");
BufferedOutputStream out = FileUtil.getOutputStream("hutool/to.txt");
long copySize = IoUtil.copy(in, out, IoUtil.DEFAULT_BUFFER_SIZE);
```

Trong các thao tác IO, việc xử lý file tương đối phức tạp nhưng cũng rất thường gặp, hầu hết các dự án đều có một lớp công cụ gọi là FileUtil hoặc FileUtils. Lớp FileUtil của Hutool bao gồm các thao tác sau:

- Thao tác file: bao gồm tạo mới, xóa, sao chép, di chuyển, đổi tên file và thư mục
- Kiểm tra file: kiểm tra xem file hoặc thư mục có rỗng không, có phải là thư mục hoặc file không
- Đường dẫn tuyệt đối: chuyển đổi file trong ClassPath thành đường dẫn tuyệt đối
- Tên file: lấy tên file chính và phần mở rộng
- Đọc file: bao gồm các thao tác getReader, readXXX
- Ghi file: bao gồm các thao tác getWriter, writeXXX

Nói thêm về classpath.

Trong thực tế lập trình, chúng ta thường cần đọc dữ liệu từ một số file như file cấu hình, file văn bản, hình ảnh, v.v. Những file này thường được đặt ở đâu?

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240704191817.png)


Đặt trong thư mục resources của cấu trúc dự án, khi dự án được biên dịch, chúng sẽ xuất hiện trong thư mục classes. Trên đĩa, nó sẽ trông như thế này:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240704191825.png)


Khi đọc file, tôi không khuyến nghị sử dụng đường dẫn tuyệt đối vì các hệ điều hành khác nhau sẽ có các dấu phân cách đường dẫn khác nhau. Tốt nhất là sử dụng đường dẫn tương đối.

Giả sử có một file tên là origin.txt nằm trong thư mục `src/resources`, đường dẫn sẽ như sau:

```java
FileUtil.getInputStream("origin.txt");
```

Nếu file nằm trong thư mục `src/resources/hutool`, thì đường dẫn sẽ là:

```java
FileUtil.getInputStream("hutool/origin.txt");
```

### 05. Công cụ chuỗi

Lớp công cụ chuỗi của Hutool là StrUtil, tương tự với lớp StringUtils trong Apache Commons Lang. Tác giả cho rằng ưu điểm của Str là ngắn hơn String, mặc dù tôi không thấy vậy. Tuy nhiên, tôi rất thích một trong những phương thức của nó:

```java
String template = "{}, {}";
String str = StrUtil.format(template, "Hung", "Dev");
```

### 06. Công cụ reflect

Cơ chế reflect có thể làm cho Java linh hoạt hơn, do đó trong một số trường hợp, reflect có thể đạt được hiệu quả cao. Hutool đóng gói công cụ reflect ReflectUtil bao gồm:

- Lấy phương thức khởi tạo
- Lấy trường
- Lấy giá trị trường
- Lấy phương thức
- Thực hiện phương thức (phương thức đối tượng và phương thức tĩnh)

```java
package com.ittom.hutool.reflect;

import cn.hutool.core.util.ReflectUtil;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class ReflectDemo {
    private int id;

    public ReflectDemo() {
        System.out.println("Phương thức khởi tạo");
    }

    public void print() {
        System.out.println("Tôi là Tom");
    }

    public static void main(String[] args) throws IllegalAccessException {
        // Tạo đối tượng
        ReflectDemo reflectDemo = ReflectUtil.newInstance(ReflectDemo.class);

        // Lấy phương thức khởi tạo
        Constructor[] constructors = ReflectUtil.getConstructors(ReflectDemo.class);
        for (Constructor constructor : constructors) {
            System.out.println(constructor.getName());
        }

        // Lấy trường
        Field field = ReflectUtil.getField(ReflectDemo.class, "id");
        field.setInt(reflectDemo, 10);
        // Lấy giá trị trường
        System.out.println(ReflectUtil.getFieldValue(reflectDemo, field));

        // Lấy tất cả phương thức
        Method[] methods = ReflectUtil.getMethods(ReflectDemo.class);
        for (Method m : methods) {
            System.out.println(m.getName());
        }

        // Lấy phương thức cụ thể
        Method method = ReflectUtil.getMethod(ReflectDemo.class, "print");
        System.out.println(method.getName());

        // Thực hiện phương thức
        ReflectUtil.invoke(reflectDemo, "print");
    }
}
```

### 07. Công cụ nén

Trong Java, việc nén và giải nén các tệp và thư mục là một việc khá phức tạp. Hutool đóng gói công cụ ZipUtil, tối ưu hóa gói java.util.zip, có thể sử dụng một phương thức để thực hiện việc nén và giải nén, tự động xử lý các vấn đề liên quan đến tệp và thư mục, giúp đơn giản hóa đáng kể độ phức tạp của việc nén và giải nén.

```java
ZipUtil.zip("hutool", "hutool.zip");
File unzip = ZipUtil.unzip("hutool.zip", "hutoolzip");
```

### 08. Công cụ xác thực thẻ căn cước

Hutool đóng gói công cụ IdcardUtil có thể dùng để xác thực thẻ căn cước, hỗ trợ thẻ căn cước 15 số và 18 số của Trung Quốc đại lục, thẻ căn cước 10 số của Hong Kong, Macao và Đài Loan.

```java
String ID_18 = "321083197812162119";
String ID_15 = "150102880730303";

boolean valid = IdcardUtil.isValidCard(ID_18);
boolean valid15 = IdcardUtil.isValidCard(ID_15);
```

### 09. Mở rộng HashMap

HashMap trong Java là kiểu dữ liệu mạnh, nhưng Hutool đóng gói Dict không yêu cầu khắt khe về kiểu dữ liệu của key.

```java
Dict dict = Dict.create()
        .set("age", 18)
        .set("name", "Tom")
        .set("birthday", DateTime.now());

int age = dict.getInt("age");
String name = dict.getStr("name");
```

### 10. In ra console

Trong quá trình mã hóa cục bộ, thường cần sử dụng `System.out` để in kết quả, nhưng thường một số đối tượng phức tạp không hỗ trợ in trực tiếp, chẳng hạn như mảng, cần gọi `Arrays.toString`. Lớp Console của Hutool lấy cảm hứng từ `console.log()` trong JavaScript, làm cho việc in trở nên rất thuận tiện.

```java
public class ConsoleDemo {
    public static void main(String[] args) {
        // In chuỗi
        Console.log("Tom，Dev");

        // In mẫu chuỗi
        Console.log("Tom is {}",13);

        int [] ints = {1,2,3,4};
        // In mảng
        Console.log(ints);
    }
}
```

### 11. Bộ kiểm tra trường

Khi phát triển Web, phía server thường cần kiểm tra dữ liệu từ form gửi đến. Hutool đóng gói Validator có thể thực hiện nhiều điều kiện kiểm tra hiệu quả:

- Có phải email không
- Có phải IP V4, V6 không
- Có phải số điện thoại không
- Và nhiều điều kiện khác

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240704191837.png)

```java
Validator.isEmail("Tom");
Validator.isMobile("botay.com");
```

### 12. Map tìm kiếm hai chiều

[Guava](/programming/java/common-tool/guava) cung cấp một cấu trúc Map đặc biệt, gọi là BiMap, thực hiện chức năng tìm kiếm hai chiều, có thể tìm giá trị bằng key và tìm key bằng giá trị. Hutool cũng cung cấp cấu trúc Map này.

```java
BiMap<String, String> biMap = new BiMap<>(new HashMap<>());
biMap.put("tom", "Tom");
biMap.put("cat", "Cat");

// Lấy giá trị bằng key
biMap.get("tom");
biMap.get("cat");

// Lấy key bằng giá trị
biMap.getKey("Tom");
biMap.getKey("Cat");
```

Trong công việc phát triển thực tế, tôi thường thích sử dụng BiMap của Guava hơn là của Hutool. Tôi đề cập đến điều này vì tôi phát hiện ra một lỗi trong tài liệu trực tuyến của Hutool và đã báo cáo vấn đề.

### 13. Công cụ hình ảnh

ImgUtil của Hutool có thể thực hiện các thao tác như thu nhỏ, cắt, chuyển thành đen trắng và thêm watermark cho hình ảnh.

Thu nhỏ hình ảnh:

```java
ImgUtil.scale(
        FileUtil.file("hutool/cat.jpg"),
        FileUtil.file("hutool/cat_small.jpg"),
        0.5f
);
```

Cắt hình ảnh:

```java
ImgUtil.cut(
        FileUtil.file("hutool/cat.jpg"),
        FileUtil.file("hutool/cat_cut.jpg"),
        new Rectangle(200, 200, 100, 100)
);
```

Thêm watermark:

```java
ImgUtil.pressText(//
        FileUtil.file("hutool/cat.jpg"),
        FileUtil.file("hutool/cat_logo.jpg"),
        "Tom", Color.WHITE,
        new Font("Fira Code", Font.BOLD, 100),
        0,
        0,
        0.8f
);
```

### 14. Tập tin cấu hình

> Như mọi người đã biết, tập tin cấu hình Properties được sử dụng rộng rãi trong Java có một nhược điểm lớn: không hỗ trợ tiếng Trung. Mỗi khi sử dụng, nếu muốn lưu trữ ký tự tiếng Trung, bạn phải sử dụng plugin liên quan đến IDE để chuyển sang ký hiệu Unicode, và loại ký hiệu phản nhân tính này hoàn toàn không thể đọc được trên dòng lệnh.

Do đó, Setting của Hutool ra đời. Ngoài việc tương thích với định dạng tập tin Properties, Setting còn cung cấp một số tính năng đặc biệt bao gồm:

- Hỗ trợ nhiều cách mã hóa
- Hỗ trợ biến
- Hỗ trợ phân nhóm

Đầu tiên, tạo một tập tin cấu hình example.setting với nội dung như sau:

```
name=Tom
age=18
```

Sau đó, đọc và cập nhật tập tin cấu hình:

```java
public class SettingDemo {
    private final static String SETTING = "hutool/example.setting";
    public static void main(String[] args) {
        // Khởi tạo Setting
        Setting setting = new Setting(SETTING);

        // Đọc
        setting.getStr("name", "Tom");

        // Tự động tải khi tập tin cấu hình thay đổi
        setting.autoLoad(true);

        // Thêm cặp key-value bằng mã lệnh
        setting.set("birthday", "2020/02/02");
        setting.store(SETTING);
    }
}
```

### 15. LogFactory

LogFactory của Hutool tương thích với các framework nhật ký lớn và rất dễ sử dụng.

```java
public class LogDemo {
    private static final Log log = LogFactory.get();

    public static void main(String[] args) {
        log.debug("abcd");
    }
}
```

Trước tiên, sử dụng `LogFactory.get()` để tự động nhận diện framework nhật ký đã được tích hợp và tạo đối tượng Log tương ứng, sau đó gọi các phương thức như `debug()` và `info()` để xuất nhật ký.

Nếu không muốn tạo đối tượng Log, bạn có thể sử dụng StaticLog, một lớp nhật ký cung cấp các phương thức tĩnh.

```java
StaticLog.info("Web Server {}.", "TomCat");
```

### 16. Công cụ Cache

CacheUtil là một công cụ tiện ích của Hutool để tạo các đối tượng cache khác nhau:

- **FIFOCache**: Đầu vào đầu ra, các phần tử được thêm vào cache cho đến khi cache đầy, khi đó các đối tượng cache đã hết hạn sẽ được xóa đi, nếu vẫn còn đầy, các phần tử nhập trước sẽ bị xóa đi.

```java
Cache<String, String> fifoCache = CacheUtil.newFIFOCache(3);
fifoCache.put("key1", "one");
fifoCache.put("key2", "two");
fifoCache.put("key3", "three");
fifoCache.put("key4", "four");

// Với kích thước là 3, khi key3 được thêm vào, key1 sẽ bị xóa
String value1 = fifoCache.get("key1");
```

- **LFUCache**: Ít sử dụng nhất, dựa trên số lần sử dụng để xác định liệu đối tượng có nên được giữ trong cache hay không. Khi cache đầy, các đối tượng ít được truy cập nhất sẽ bị xóa đi để nhường chỗ cho các đối tượng mới.

```java
Cache<String, String> lfuCache = CacheUtil.newLFUCache(3);

lfuCache.put("key1", "one");
lfuCache.get("key1"); // Tăng số lần sử dụng
lfuCache.put("key2", "two");
lfuCache.put("key3", "three");
lfuCache.put("key4", "four");

// Với dung lượng cache là 3, khi thêm phần tử thứ 4 vào, phần tử ít được sử dụng nhất (key2, key3) sẽ bị xóa
String value2 = lfuCache.get("key2");
String value3 = lfuCache.get("key3");
```

- **LRUCache**: Sử dụng gần đây nhất, dựa trên thời gian sử dụng để xác định liệu đối tượng có nên được giữ trong cache hay không. Khi cache đầy, các đối tượng không được sử dụng lâu nhất sẽ bị xóa đi.

```java
Cache<String, String> lruCache = CacheUtil.newLRUCache(3);

lruCache.put("key1", "one");
lruCache.put("key2", "two");
lruCache.put("key3", "three");
lruCache.get("key1"); // Gần đây được sử dụng
lruCache.put("key4", "four");

// Với dung lượng cache là 3, khi thêm phần tử thứ 4 vào, phần tử được sử dụng lâu nhất (key2) sẽ bị xóa
String value2 = lruCache.get("key2");
System.out.println(value2);
```

### 17. Mã hóa và Giải mã

Mã hóa được chia thành ba loại:

- **Mã hóa đối xứng (Symmetric)**: Ví dụ: AES, DES, vv.
- **Mã hóa không đối xứng (Asymmetric)**: Ví dụ: RSA, DSA, vv.
- **Mã hóa băm (Digest)**: Ví dụ: MD5, SHA-1, SHA-256, HMAC, vv.

Hutool đã đóng gói các công cụ cho ba trường hợp này:

- Mã hóa đối xứng SymmetricCrypto
- Mã hóa không đối xứng AsymmetricCrypto
- Mã hóa băm Digester

Công cụ nhanh chóng SecureUtil có các phương thức sau:

1) Mã hóa đối xứng

- SecureUtil.aes
- SecureUtil.des

2) Mã hóa không đối xứng

- SecureUtil.rsa
- SecureUtil.dsa

3) Mã hóa băm

- SecureUtil.md5
- SecureUtil.sha1
- SecureUtil.hmac
- SecureUtil.hmacMd5
- SecureUtil.hmacSha1

Hãy xem một ví dụ đơn giản để tham khảo:

```java
public class SecureUtilDemo {
    static AES aes = SecureUtil.aes();
    public static void main(String[] args) {
        String encry = aes.encryptHex("two");
        System.out.println(encry);
        String oo = aes.decryptStr(encry);
        System.out.println(oo);
    }
}
```

### 18. Thư viện khác

Hutool có nhiều thư viện khác nhau, đặc biệt là các thư viện đóng gói lại từ các thư viện của bên thứ ba, chẳng hạn như công cụ email MailUtil, công cụ mã QR QrCodeUtil, công cụ Emoji EmojiUtil, các bạn có thể tham khảo tài liệu chính thức của Hutool: [https://www.hutool.cn/](https://www.hutool.cn/)

Địa chỉ mã nguồn dự án: [https://github.com/looly/hutool](https://github.com/looly/hutool)