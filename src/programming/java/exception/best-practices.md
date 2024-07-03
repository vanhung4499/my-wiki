---
title: Exception Handling Best Practices
tags:
  - java
categories:
  - java
order: 3
---
# Exception Handling Best Practices

20 Best Practices Về Xử Lý Exception

### 01. Tránh bắt RuntimeException nếu có thể

Java Development Manual của Alibaba quy định như sau:

> Tránh bắt RuntimeException nếu có thể, chẳng hạn như NullPointerException, IndexOutOfBoundsException, v.v. Nên sử dụng phương pháp kiểm tra trước để ngăn ngừa.

Ví dụ đúng:

```java
if (obj != null) {
  //...
}
```

Ví dụ sai:

```java
try { 
  obj.method(); 
} catch (NullPointerException e) {
  //...
}
```

Vậy nếu có những exception mà không thể kiểm tra trước thì sao?

Thực tế sẽ có những trường hợp như vậy, chẳng hạn như NumberFormatException, mặc dù cũng thuộc RuntimeException nhưng không thể kiểm tra trước, vì vậy vẫn nên sử dụng catch để bắt và xử lý.

### 02. Cố gắng sử dụng try-with-resource để đóng tài nguyên

Khi cần đóng tài nguyên, tránh sử dụng try-catch-finally, và không đóng tài nguyên trực tiếp trong khối try.

Ví dụ sai:

```java
public void doNotCloseResourceInTry() {
    FileInputStream inputStream = null;
    try {
        File file = new File("./tmp.txt");
        inputStream = new FileInputStream(file);
        inputStream.close();
    } catch (FileNotFoundException e) {
        log.error(e);
    } catch (IOException e) {
        log.error(e);
    }
}
```

Tại sao lại như vậy?

Lý do rất đơn giản, vì nếu xảy ra exception trước khi `close()`, tài nguyên sẽ không được đóng. Sử dụng [try-with-resource](https://javabetter.cn/exception/try-with-resources.html) để xử lý là cách tốt nhất.

```java
public void automaticallyCloseResource() {
    File file = new File("./tmp.txt");
    try (FileInputStream inputStream = new FileInputStream(file);) {
    } catch (FileNotFoundException e) {
        log.error(e);
    } catch (IOException e) {
        log.error(e);
    }
}
```

Trừ khi tài nguyên không triển khai interface AutoCloseable. Hãy đóng tài nguyên trong khối finally.

```java
public void closeResourceInFinally() {
    FileInputStream inputStream = null;
    try {
        File file = new File("./tmp.txt");
        inputStream = new FileInputStream(file);
    } catch (FileNotFoundException e) {
        log.error(e);
    } finally {
        if (inputStream != null) {
            try {
                inputStream.close();
            } catch (IOException e) {
                log.error(e);
            }
        }
    }
}
```

### 03. Không bắt Throwable

Throwable là cha của exception và error, nếu bắt Throwable trong khối catch, có thể bắt luôn cả những lỗi vượt quá khả năng xử lý của chương trình.

```java
public void doNotCatchThrowable() {
    try {
    } catch (Throwable t) {
        // Đừng làm thế này
    }
}
```

Tại sao lại như vậy?

Vì có những lỗi không cần chương trình xử lý và chương trình cũng không thể xử lý được, như OutOfMemoryError hoặc StackOverflowError. OutOfMemoryError xảy ra khi Java VM không thể yêu cầu đủ không gian bộ nhớ, còn StackOverflowError xảy ra khi độ sâu của stack mà một thread yêu cầu vượt quá độ sâu tối đa cho phép. Nếu bắt chúng, sẽ che giấu những lỗi nghiêm trọng mà chương trình cần phát hiện.

Ví dụ như một con ngựa chỉ có thể kéo một toa hàng, nếu kéo hai toa có thể sẽ gục ngã, nhưng nếu bắt lỗi, sẽ không phát hiện ra vấn đề.

### 04. Không bỏ qua việc ghi lại thông tin exception

Nhiều khi, do bất cẩn, chúng ta dễ dàng bắt exception mà không ghi lại thông tin exception, dẫn đến việc khi chương trình gặp sự cố thật sự, không có thông tin ghi lại để kiểm tra.

```java
public void doNotIgnoreExceptions() {
    try {
    } catch (NumberFormatException e) {
        // Không ghi lại exception
    }
}
```

Nên ghi lại thông tin lỗi.

```java
public void logAnException() {
    try {
    } catch (NumberFormatException e) {
        log.error("Ôi, lỗi đã xảy ra: " + e);
    }
}
```

### 05. Không ghi lại exception rồi lại ném ra exception

Điều này hoàn toàn thừa thãi và dễ gây ra sự nhầm lẫn về thông tin lỗi.

Ví dụ sai:

```java
try {
} catch (NumberFormatException e) {
    log.error(e);
    throw e;
}
```

Nếu ném ra exception thì hãy ném ra, không cần ghi lại. Ghi lại rồi ném ra cũng giống như thừa thãi.

Ví dụ sai:

```java
public void wrapException(String input) throws MyBusinessException {
    try {
    } catch (NumberFormatException e) {
        throw new MyBusinessException("Thông tin lỗi: ", e);
    }
}
```

Điều này cũng tương tự, đã bắt exception thì không cần ném ra trong chữ ký phương thức.

### 06. Không sử dụng return trong khối finally

Java Development Manual của Alibaba quy định như sau:

> Khi câu lệnh return trong khối try thực thi thành công, sẽ không trả về ngay lập tức, mà sẽ tiếp tục thực thi các câu lệnh trong khối finally. Nếu trong khối finally cũng có câu lệnh return, thì câu lệnh return trong khối try sẽ bị ghi đè.

Ví dụ sai:

```java
private int x = 0;
public int checkReturn() {
    try {
        return ++x;
    } finally {
        return ++x;
    }
}
```

Giá trị của x trả về từ khối try là 1, nhưng đến khối finally lại trả về 2.

### 07. Ném ra các exception kiểm tra cụ thể thay vì Exception

```java
public void foo() throws Exception { // Cách sai
}
```

Nhất định phải tránh xuất hiện đoạn mã như trên, nó phá vỡ mục đích của exception kiểm tra (checked exception). Phương thức được khai báo nên ném ra các exception kiểm tra cụ thể.

Ví dụ, nếu một phương thức có thể ném ra exception SQLException, nên khai báo rõ ràng ném ra SQLException thay vì exception kiểu Exception. Như vậy, các nhà phát triển khác có thể hiểu rõ hơn ý định và cách xử lý exception của mã, và có thể xác định cách xử lý và chiến lược dựa trên định nghĩa và tài liệu của SQLException.

### 08. Bắt các lớp con cụ thể thay vì bắt lớp Exception

```java
try {
   someMethod();
} catch (Exception e) { // Cách sai
   LOGGER.error("method has failed", e);
}
```

Nếu trong khối catch bắt exception kiểu Exception, sẽ bắt tất cả các loại exception, dẫn đến các vấn đề không cần thiết cho chương trình. Cụ thể, nếu bắt exception kiểu Exception, có thể dẫn đến các vấn đề sau:

- Khó nhận diện và định vị exception: Nếu bắt exception kiểu Exception, có thể sẽ bắt những exception không nên được xử lý, dẫn đến việc chương trình khó nhận diện và định vị exception.
- Khó gỡ lỗi và sửa lỗi: Nếu bắt exception kiểu Exception, có thể làm cho việc gỡ lỗi và sửa lỗi trở nên khó khăn hơn, vì không thể xác định loại exception cụ thể và nguyên nhân xảy ra exception.

Dưới đây là một ví dụ để minh họa tại sao nên bắt các lớp con cụ thể thay vì exception kiểu Exception.

Giả sử chúng ta có một phương thức `readFromFile(String filePath)`, dùng để đọc dữ liệu từ một tệp chỉ định. Trong quá trình thực hiện phương thức, có thể xuất hiện hai loại exception: FileNotFoundException và IOException.

Nếu trong phương thức sử dụng khối catch sau để bắt exception:

```java
try {
    // Mã đọc dữ liệu
} catch (Exception e) {
    // Mã xử lý exception
}
```

Cách làm này sẽ bắt tất cả các loại exception, bao gồm cả Checked Exception và Unchecked Exception. Điều này có thể dẫn đến các vấn đề sau:

- Khi xảy ra exception kiểu RuntimeException, cũng sẽ bị bắt, dẫn đến việc che giấu thông tin exception thực sự.
- Khi gỡ lỗi và sửa lỗi, không thể xác định loại exception cụ thể và nguyên nhân xảy ra exception, tăng độ khó khăn trong việc gỡ lỗi và sửa lỗi.
- Khi chương trình chạy, có thể bắt một số exception không cần thiết phải xử lý (như NullPointerException, IllegalArgumentException, v.v.), dẫn đến giảm hiệu suất và ổn định của chương trình.

Do đó, để định vị và xử lý exception tốt hơn, nên bắt các lớp con cụ thể, ví dụ:

```java
try {
    // Mã đọc dữ liệu
} catch (FileNotFoundException e) {
    // Mã xử lý exception tệp không tìm thấy
} catch (IOException e) {
    // Mã xử lý exception đầu vào/đầu ra
}
```

Cách làm này giúp bắt exception chính xác hơn, từ đó cải thiện độ bền vững và ổn định của chương trình.

### 09. Khi tự định nghĩa exception, đừng bỏ qua theo dõi ngăn xếp

```java
catch (NoSuchMethodException e) {
   throw new MyServiceException("Some information: " + e.getMessage());  // Cách sai
}
```

Điều này phá vỡ theo dõi ngăn xếp của exception gốc, cách đúng là:

```java
catch (NoSuchMethodException e) {
   throw new MyServiceException("Some information: ", e);  // Cách đúng
}
```

Ví dụ, dưới đây là một lớp exception tự định nghĩa, nó ghi đè phương thức `printStackTrace()` để in thông tin theo dõi ngăn xếp:

```java
public class MyException extends Exception {
    public MyException(String message, Throwable cause) {
        super(message, cause);
    }

    @Override
    public void printStackTrace() {
        System.err.println("MyException:");
        super.printStackTrace();
    }
}
```

Cách làm này giúp giữ lại thông tin theo dõi ngăn xếp, đồng thời cung cấp thông tin exception tự định nghĩa. Khi ném ra exception MyException, bạn có thể nhận được thông tin theo dõi ngăn xếp đầy đủ, giúp định vị và giải quyết exception tốt hơn.

### 10. Đừng ném ra bất kỳ exception nào trong khối finally

```java
try {
  someMethod();  // Ném ra exceptionOne
} finally {
  cleanUp();    // Nếu finally cũng ném ra exception, thì exceptionOne sẽ bị mất
}
```

Khối finally được sử dụng để định nghĩa một đoạn mã, dù khối try có xuất hiện exception hay không, thì đoạn mã này vẫn sẽ được thực thi. Khối finally thường được dùng để giải phóng tài nguyên, đóng tệp và các thao tác cần thiết khác.

Nếu trong khối finally ném ra exception, có thể dẫn đến việc exception gốc bị che giấu. Ví dụ, trong đoạn mã trên, nếu cleanup ném ra exception, thì exception trong someMethod sẽ bị ghi đè.

### 11. Đừng sử dụng `printStackTrace()` trong môi trường sản xuất

Trong Java, phương thức `printStackTrace()` được sử dụng để xuất thông tin theo dõi ngăn xếp của exception ra luồng lỗi chuẩn. Phương thức này rất hữu ích cho việc gỡ lỗi và sửa lỗi. Tuy nhiên, trong môi trường sản xuất, không nên sử dụng phương thức `printStackTrace()`, vì nó có thể gây ra các vấn đề sau:

- Phương thức `printStackTrace()` sẽ xuất thông tin theo dõi ngăn xếp của exception ra luồng lỗi chuẩn, có thể làm lộ thông tin nhạy cảm như đường dẫn tệp, tên người dùng, mật khẩu, v.v.
- Phương thức `printStackTrace()` sẽ xuất thông tin theo dõi ngăn xếp ra luồng lỗi chuẩn, có thể ảnh hưởng đến hiệu suất và độ ổn định của chương trình. Trong môi trường sản xuất có độ tải cao, lượng lớn thông tin theo dõi ngăn xếp của exception có thể dẫn đến hệ thống bị treo hoặc xuất hiện hành vi không mong muốn.
- Vì môi trường sản xuất thường là hệ thống phức tạp đa luồng, phân tán, thông tin theo dõi ngăn xếp được xuất ra bởi phương thức `printStackTrace()` có thể không đầy đủ hoặc không chính xác.

Trong môi trường sản xuất, nên sử dụng hệ thống nhật ký để ghi lại thông tin exception, ví dụ như [log4j](/tools/log4j.html), [slf4j](/tools/slf4j.html), [logback](/tools/logback.html), v.v. Hệ thống nhật ký có thể ghi lại thông tin exception vào tệp hoặc cơ sở dữ liệu, mà không làm lộ thông tin nhạy cảm và không ảnh hưởng đến hiệu suất và độ ổn định của chương trình. Đồng thời, hệ thống nhật ký cũng cung cấp nhiều chức năng hơn như kiểm soát cấp độ, nhật ký cuộn, thông báo qua email, v.v.

Ví dụ, có thể sử dụng logback để ghi lại thông tin exception như sau:

```java
try {
    // some code
} catch (Exception e) {
    logger.error("An error occurred: ", e);
}
```

### 12. Đối với các exception không định xử lý, chỉ sử dụng try-finally mà không dùng catch

```java
try {
  method1();  // Sẽ gọi Method 2
} finally {
  cleanUp();  // Thực hiện dọn dẹp ở đây
}
```

Nếu method1 đang gọi Method 2, và Method 2 ném ra một exception mà bạn không muốn xử lý trong Method 1, nhưng vẫn muốn thực hiện một số việc dọn dẹp khi xảy ra exception, bạn có thể thực hiện việc dọn dẹp trực tiếp trong khối finally mà không cần sử dụng khối catch.

### 13. Ghi nhớ nguyên tắc "ném sớm, bắt muộn"

"ném sớm, bắt muộn" là một nguyên tắc xử lý exception trong Java. Nguyên tắc này có nghĩa là ném exception càng sớm càng tốt trong mã nguồn để có thể xử lý kịp thời khi xảy ra exception. Đồng thời, cố gắng bắt exception muộn nhất có thể trong khối catch để có được nhiều thông tin ngữ cảnh hơn, từ đó xử lý exception tốt hơn.

Hãy xem một ví dụ về "ném sớm", nếu một phương thức cần truyền tham số và tham số đó phải đáp ứng một số điều kiện nhất định, nếu tham số không thỏa mãn điều kiện, thì nên ném exception ngay lập tức thay vì thực hiện các thao tác khác trong phương thức. Điều này đảm bảo exception được xử lý kịp thời khi xảy ra, tránh các vấn đề nghiêm trọng hơn.

Tiếp theo là một ví dụ về "bắt muộn", nếu một phương thức gọi các phương thức khác và có thể ném ra exception, nếu bắt exception ngay trong phương thức, điều này có thể dẫn đến việc xử lý exception không đầy đủ.

Xem đoạn mã sau:

```java
public class ExceptionDemo1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine();
        try {
            int num = parseInt(str);
            System.out.println("Kết quả chuyển đổi: " + num);
        } catch (NumberFormatException e) {
            System.out.println("Chuyển đổi thất bại: " + e.getMessage());
        }
    }

    public static int parseInt(String str) {
        if (str == null || "".equals(str)) {
            throw new NullPointerException("Chuỗi trống");
        }
        if (!str.matches("\\d+")) {
            throw new NumberFormatException("Chuỗi không phải là số");
        }
        return Integer.parseInt(str);
    }
}
```

Trong ví dụ này, phương thức `parseInt()` được định nghĩa để chuyển đổi chuỗi thành số nguyên. Trong phương thức này, đầu tiên kiểm tra xem chuỗi có trống không, nếu trống thì ném exception NullPointerException ngay lập tức. Sau đó, kiểm tra chuỗi có phải là số không, nếu không phải số thì ném exception NumberFormatException. Cuối cùng, sử dụng phương thức `Integer.parseInt()` để chuyển đổi chuỗi thành số nguyên và trả về.

Trong phương thức `main()` của ví dụ, gọi phương thức `parseInt()` và sử dụng khối try-catch để bắt exception NumberFormatException có thể bị ném ra. Nếu chuyển đổi thành công, in ra kết quả chuyển đổi, nếu không thì in ra thông tin chuyển đổi thất bại.

Ví dụ này áp dụng nguyên tắc "ném sớm, bắt muộn", trong phương thức `parseInt()` ném exception càng sớm càng tốt, trong phương thức `main()` bắt exception càng muộn càng tốt để có được nhiều thông tin ngữ cảnh hơn, từ đó xử lý exception tốt hơn.

Chạy ví dụ này, nếu nhập vào một chuỗi số, có thể thấy kết quả chuyển đổi được in ra. Nếu nhập vào một chuỗi không phải là số, thì thông tin chuyển đổi thất bại sẽ được in ra.

### 14. Chỉ ném ra các exception liên quan đến phương thức

Mối liên quan là rất quan trọng để giữ mã code gọn gàng. Một phương thức cố gắng đọc tệp, nếu ném ra NullPointerException, thì nó sẽ không cung cấp thông tin hữu ích cho người dùng. Thay vào đó, việc bọc exception này trong một exception tùy chỉnh sẽ tốt hơn. Ví dụ, sử dụng NoSuchFileFoundException sẽ hữu ích hơn đối với người dùng của phương thức này.

```java
public class Demo {
    public static void main(String[] args) {
        try {
            int result = divide(10, 0);
            System.out.println("Kết quả là: " + result);
        } catch (ArithmeticException e) {
            System.err.println("Lỗi: " + e.getMessage());
        }
    }

    public static int divide(int a, int b) throws ArithmeticException {
        if (b == 0) {
            throw new ArithmeticException("Chia cho số không");
        }
        return a / b;
    }
}
```

Trong ví dụ này, chỉ có exception ArithmeticException liên quan đến phương thức được ném ra, điều này làm cho mã code trở nên rõ ràng và dễ bảo trì hơn.

### 15. Không được sử dụng exception để điều khiển luồng trong mã code

Sử dụng exception để điều khiển luồng trong mã code sẽ dẫn đến vấn đề về độ đọc được, dễ bảo trì và hiệu suất của mã code.

```java
public class Demo {
    public static void main(String[] args) {
        String input = "1,2,3,a,5";
        String[] values = input.split(",");
        for (String value : values) {
            try {
                int num = Integer.parseInt(value);
                System.out.println(num);
            } catch (NumberFormatException e) {
                System.err.println(value + " không phải là số hợp lệ");
            }
        }
    }
}
```

Mặc dù ví dụ này có thể xử lý các ký tự không phải số trong chuỗi nhập vào một cách chính xác, nhưng việc sử dụng exception để điều khiển luồng làm cho mã code trở nên lộn xộn và khó hiểu. Nên sử dụng các cấu trúc điều khiển khác phù hợp như if, switch, vòng lặp để quản lý luồng của chương trình.

### 16. Xác minh ngay lập tức đầu vào người dùng để bắt lỗi sớm trong xử lý yêu cầu

Ví dụ: Trong kịch bản kinh doanh đăng ký người dùng, nếu thực hiện như sau:

1. Xác minh người dùng
2. Chèn dữ liệu người dùng
3. Xác minh địa chỉ
4. Chèn dữ liệu địa chỉ
5. Nếu có vấn đề, quay lại trạng thái ban đầu

Đây là cách làm không đúng, nó có thể khiến cơ sở dữ liệu ở trạng thái không nhất quán trong nhiều tình huống. Thay vào đó, bạn nên xác minh tất cả nội dung trước khi cập nhật cơ sở dữ liệu. Cách làm đúng là:

1. Xác minh người dùng
2. Xác minh địa chỉ
3. Chèn dữ liệu người dùng
4. Chèn dữ liệu địa chỉ
5. Nếu có vấn đề, quay lại trạng thái ban đầu

Ví dụ, nếu chúng ta sử dụng JDBC để chèn dữ liệu vào cơ sở dữ liệu, thì tốt nhất là validate trước, sau đó insert, thay vì validateUserInput, insertUserData, validateAddressInput, insertAddressData.

```java
Connection conn = null;
try {
    // Kết nối đến cơ sở dữ liệu
    conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/mydatabase", "username", "password");

    // Bắt đầu giao dịch
    conn.setAutoCommit(false);

    // Xác minh đầu vào người dùng
    validateUserInput();

    // Chèn dữ liệu người dùng
    insertUserData(conn);

    // Xác minh đầu vào địa chỉ
    validateAddressInput();

    // Chèn dữ liệu địa chỉ
    insertAddressData(conn);

    // Commit giao dịch nếu mọi thứ thành công
    conn.commit();

} catch (SQLException e) {
    // Quay lại giao dịch nếu có lỗi
    if (conn != null) {
        try {
            conn.rollback();
        } catch (SQLException ex) {
            System.err.println("Lỗi: " + ex.getMessage());
        }
    }
    System.err.println("Lỗi: " + e.getMessage());
} finally {
    // Đóng kết nối cơ sở dữ liệu
    if (conn != null) {
        try {
            conn.close();
        } catch (SQLException e) {
            System.err.println("Lỗi: " + e.getMessage());
        }
    }
}
```

Đây là một ví dụ minh họa về cách xử lý giao dịch trong JDBC, trong đó đầu tiên là xác minh đầu vào trước khi thực hiện các thao tác cơ sở dữ liệu, và quay lại trạng thái ban đầu nếu có lỗi xảy ra.

### 17. Mỗi exception chỉ nên được bao gồm trong một bản ghi nhật ký

Không nên làm như thế này:

```java
log.debug("Using cache sector A");
log.debug("Using retry sector B");
```

Trong môi trường đơn luồng, điều này có vẻ không có vấn đề gì, nhưng trong môi trường đa luồng, hai dòng mã này có thể in ra rất nhiều nội dung khác nhau ở giữa chúng, làm cho việc điều tra vấn đề trở nên rất khó khăn. Thay vào đó, bạn nên làm như sau:

```java
LOGGER.debug("Using cache sector A, using retry sector B");
```

### 18. Truyền tất cả thông tin liên quan tối đa có thể cho exception

Thông tin exception và đám mây của nó là rất quan trọng. Nếu nhật ký của bạn không thể xác định vị trí của exception, thì nó cũng vô dụng.

```java
// Ghi thông báo exception và đám mây
LOGGER.debug("Lỗi khi đọc tập tin", e);
```

Hãy cố gắng truyền cả `String message, Throwable cause` để ghi ra thông tin exception và đám mây.

### 19. Dừng luồng bị gián đoạn

```java
while (true) {
  try {
    Thread.sleep(100000);
  } catch (InterruptedException e) {} // Đừng làm như vậy
  doSomethingCool();
}
```

InterruptedException cho biết rằng bạn nên dừng việc mà chương trình của bạn đang làm, ví dụ như thời gian chờ hoặc đóng một bể luồng.

Nên cố gắng hoàn thành việc đang làm và kết thúc luồng hiện tại đang thực thi thay vì bỏ qua InterruptedException. Chương trình được sửa đổi như sau:

```java
while (true) {
  try {
    Thread.sleep(100000);
  } catch (InterruptedException e) {
    break;
  }
}
doSomethingCool();
```

### 20. Sử dụng phương thức mẫu cho các khối try-catch lặp lại

Các khối catch tương tự không có ích và chỉ làm tăng sự lặp lại của mã. Đối với các vấn đề như vậy, bạn có thể sử dụng phương thức mẫu.

Ví dụ, trong xử lý exception khi đóng kết nối cơ sở dữ liệu.

```java
class DBUtil {
    public static void closeConnection(Connection conn) {
        try {
            conn.close();
        } catch (Exception ex) {
            // Ghi nhật ký exception - Không thể đóng kết nối
        }
    }
}
```

Phương thức này sẽ được sử dụng ở nhiều nơi trong ứng dụng của bạn. Thay vì đặt mã này khắp nơi, bạn nên định nghĩa phương thức như trên, sau đó sử dụng nó như sau:

```java
public void dataAccessCode() {
    Connection conn = null;
    try {
        conn = getConnection();
        // ... Các thao tác truy cập dữ liệu
    } finally {
        DBUtil.closeConnection(conn);
    }
}
```

Về phần thực hành xử lý exception thì đây là 20 điều mình đã nói trên. Trong thực tế, khi làm việc, có thể bạn sẽ gặp phải một số vấn đề khác, nhưng sẽ dễ nhớ hơn nếu bạn tự mình vấp phải chúng.

