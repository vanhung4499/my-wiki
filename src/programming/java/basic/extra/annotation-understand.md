---
title: Annotation
tags:
  - java
categories:
  - java
order: 4
---

# Java Annotation

Annotation là một phần rất quan trọng trong Java, nhưng thực tế lại thường bị bỏ qua. Sở dĩ nói như vậy vì chúng ta có xu hướng trở thành người sử dụng annotation nhiều hơn là người tạo ra chúng. Đã từng dùng annotation `@Override` khi ghi đè phương thức chưa?

> Annotation dịch ra tiếng việt là annotation, rất dễ bị nhầm lẫn với comment (cũng nghĩa là annotation nên tôi giữ nguyên tên gọi tiếng anh)

Annotation là một khái niệm được giới thiệu trong Java 1.5, giống như class và interface, nó cũng là một kiểu. Annotation cung cấp một loạt dữ liệu để trang trí mã chương trình (class, phương thức, trường, v.v.), nhưng annotation không phải là một phần của mã được trang trí, nó không ảnh hưởng trực tiếp đến hiệu quả hoạt động của mã, việc thực hiện các thao tác nào là do trình biên dịch quyết định.

Hãy xem một đoạn mã.

```java
public class AutowiredTest {
    @Autowired
    private String name;

    public static void main(String[] args) {
        System.out.println("abc，def");
    }
}
```

Chú ý đến annotation `@Autowired` chưa? Nó vốn dĩ là để cho Spring (sẽ nói sau) tiêm Bean vào, nhưng bây giờ tôi vô tình đặt nó lên trường name, tuy nhiên dự án mà đoạn mã này nằm trong đó không kích hoạt Spring, điều này có nghĩa là annotation `@Autowired` lúc này chỉ là một món trang trí.

Vòng đời của annotation có 3 chiến lược, được định nghĩa trong Enum RetentionPolicy.

1) SOURCE: Hiệu lực trong tệp nguồn, bị trình biên dịch bỏ qua.

2) CLASS: Hiệu lực trong tệp bytecode do trình biên dịch tạo ra, nhưng bị JVM xử lý tệp lớp bỏ qua khi chạy.

3) RUNTIME: Hiệu lực khi chạy. Đây cũng là chiến lược vòng đời được sử dụng nhiều nhất, nó cho phép chương trình truy cập annotation thông qua phản chiếu và thực hiện mã tương ứng theo định nghĩa của annotation.

Mục tiêu của annotation định nghĩa rằng annotation sẽ áp dụng cho mức độ nào của mã Java, một số annotation chỉ áp dụng cho phương thức, một số chỉ áp dụng cho biến thành viên, một số chỉ áp dụng cho lớp, một số thì áp dụng cho tất cả. Đến Java 9, có tổng cộng 11 loại annotation, được định nghĩa trong Enum ElementType.


1) TYPE: Dùng cho lớp, interface, annotation, enum

2) FIELD: Dùng cho trường (biến thành viên của lớp), hoặc hằng số enum

3) METHOD: Dùng cho phương thức

4) PARAMETER: Dùng cho tham số của phương thức thông thường hoặc của hàm tạo

5) CONSTRUCTOR: Dùng cho hàm tạo

6) LOCAL_VARIABLE: Dùng cho biến cục bộ

7) ANNOTATION_TYPE: Dùng cho annotation

8) PACKAGE: Dùng cho gói

9) TYPE_PARAMETER: Dùng cho tham số kiểu

10) TYPE_USE: Dùng cho câu lệnh khai báo, kiểu trong generic hoặc kiểu trong câu lệnh ép kiểu

11) MODULE: Dùng cho module

Mới bắt đầu bạn không thể nhớ hết được!

Nói nhiều cũng không bằng tự mình viết một annotation để trải nghiệm. Viết một annotation như thế nào nhỉ? Viết một annotation cho trường (field), nó dùng để đánh dấu xem trường này có được bao gồm khi đối tượng được tuần tự hóa thành JSON hay không.

Hãy xem đoạn mã dưới đây:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface JsonField {
    public String value() default "";
}
```

1) Vòng đời của annotation JsonField là RUNTIME, tức là có hiệu lực khi chạy.

2) Mục tiêu của annotation JsonField là FIELD, tức là áp dụng cho trường.

3) Tạo annotation cần sử dụng từ khóa `@interface`.

4) Annotation JsonField có một tham số, tên là value, kiểu String, giá trị mặc định là một chuỗi rỗng.

Tại sao tên tham số phải là value? Có ý nghĩa đặc biệt gì không?

“Đương nhiên là có, value cho phép người dùng annotation cung cấp một tham số mà không cần chỉ định tên. Ví dụ, chúng ta có thể sử dụng trên một trường `@JsonField(value = "password")`, hoặc có thể bỏ qua `value =` và chỉ viết `@JsonField("password")`.

Vậy `default ""` có ý nghĩa đặc biệt gì không?

Đương nhiên là có, nó cho phép chúng ta sử dụng `@JsonField` trên một trường mà không cần chỉ định tên và giá trị của tham số.

Vậy `@JsonField` đã được viết xong, có thể sử dụng nó rồi phải không?

Giả sử có một lớp Writer, có 3 trường là age, name và bookName, trong đó 2 trường sau là các trường cần được tuần tự hóa. Có thể sử dụng annotation `@JsonField` như sau:

```java
public class Writer {
    private int age;

    @JsonField("writerName")
    private String name;

    @JsonField
    private String bookName;

    public Writer(int age, String name, String bookName) {
        this.age = age;
        this.name = name;
        this.bookName = bookName;
    }

    // getter / setter

    @Override
    public String toString() {
        return "Writer{" +
                "age=" + age +
                ", name='" + name + '\'' +
                ", bookName='" + bookName + '\'' +
                '}';
    }
}
```

1) Annotation `@JsonField` trên trường name cung cấp một giá trị chuỗi rõ ràng.

2) Annotation `@JsonField` trên trường bookName sử dụng giá trị mặc định.

Tiếp theo, chúng ta sẽ viết lớp JsonSerializer, nội dung như sau:

```java
public class JsonSerializer {
    public static String serialize(Object object) throws IllegalAccessException {
        Class<?> objectClass = object.getClass();
        Map<String, String> jsonElements = new HashMap<>();
        for (Field field : objectClass.getDeclaredFields()) {
            field.setAccessible(true);
            if (field.isAnnotationPresent(JsonField.class)) {
                jsonElements.put(getSerializedKey(field), (String) field.get(object));
            }
        }
        return toJsonString(jsonElements);
    }

    private static String getSerializedKey(Field field) {
        String annotationValue = field.getAnnotation(JsonField.class).value();
        if (annotationValue.isEmpty()) {
            return field.getName();
        } else {
            return annotationValue;
        }
    }

    private static String toJsonString(Map<String, String> jsonMap) {
        String elementsString = jsonMap.entrySet()
                .stream()
                .map(entry -> "\"" + entry.getKey() + "\":\"" + entry.getValue() + "\"")
                .collect(Collectors.joining(","));
        return "{" + elementsString + "}";
    }
}
```

Nội dung của lớp JsonSerializer trông có vẻ nhiều quá bạn không hiểu được.

Đừng lo, tôi sẽ giải thích từng chút một cho bạn.

1) Phương thức `serialize()` được dùng để tuần tự hóa đối tượng, nó nhận một tham số kiểu Object. `objectClass.getDeclaredFields()` sử dụng phương thức phản chiếu (reflect) để lấy tất cả các trường được khai báo của đối tượng, sau đó thực hiện vòng lặp for để duyệt qua. Trong vòng lặp for, đầu tiên, `field.setAccessible(true)` được sử dụng để thiết lập tính truy cập của đối tượng phản chiếu thành true để có thể tuần tự hóa (nếu không có bước này thì các trường private sẽ không thể truy cập được và sẽ ném ra ngoại lệ IllegalAccessException). Sau đó, `isAnnotationPresent()` được dùng để kiểm tra xem trường có được đánh annotation `JsonField` hay không, nếu có, gọi phương thức `getSerializedKey()` và lấy giá trị của trường từ đối tượng, rồi đưa vào jsonElements.

2) Phương thức `getSerializedKey()` được dùng để lấy giá trị của annotation trên trường, nếu giá trị của annotation là trống, thì trả về tên của trường.

3) Phương thức `toJsonString()` sử dụng Stream để trả về chuỗi JSON đã được định dạng. Stream em chưa học đến, nhưng không sao, sau này anh sẽ giảng cho em.

Bây giờ có phải bạn đã hiểu rõ hơn không? 

Tiếp theo, chúng ta sẽ viết một lớp kiểm tra JsonFieldTest.

```java
public class JsonFieldTest {
    public static void main(String[] args) throws IllegalAccessException {
        Writer cmower = new Writer(18, "Hung", "Dev");
        System.out.println(JsonSerializer.serialize(cmower));
    }
}
```

Kết quả đầu ra của chương trình như sau:

```
{"bookName":"Dev","writerName":"Hung"}
```

Từ kết quả có thể thấy:

1) Trường age của lớp Writer không được trang trí bởi annotation `@JsonField`, nên không được tuần tự hóa.

2) Trường name của lớp Writer được trang trí bởi annotation `@JsonField` và được chỉ định rõ ràng với chuỗi “writerName”, nên sau khi tuần tự hóa trở thành writerName.

3) Trường bookName của lớp Writer được trang trí bởi annotation `@JsonField`, nhưng không chỉ định giá trị rõ ràng, nên sau khi tuần tự hóa vẫn là bookName.

Cũng không quá khó phải không? Việc hiểu không quá khó nhưng để dùng thông thạo thì không hề đơn giản.