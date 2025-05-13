---
title: Transient
tags:
  - java
categories:
  - java
order: 9
---
# Transient

Bạn rất rành về Java, nhưng nhiều kiến thức cơ bản của Java lại không biết, ví dụ như từ khóa `transient` trước đây chưa từng sử dụng qua nên không biết nó có tác dụng gì. Hôm nay khi đi phỏng vấn ở ngân hàng, nhà tuyển dụng đã hỏi về từ khóa này: "Hãy nói về từ khóa `transient` trong Java đi." Kết quả là bạn hoàn toàn bị bối rối.

Dưới đây là tổng kết của anh ấy sau khi phỏng vấn không thành công, chia sẻ để mọi người cùng học hỏi. Được rồi, không nói nhiều nữa, bắt đầu nào:

### 01. Tác dụng và cách sử dụng của từ khóa transient

Chúng ta biết rằng, một đối tượng chỉ cần triển khai interface [Serializable](Serializbale), thì nó có thể được [serialize](serialize.md).

Trong quá trình phát triển thực tế, chúng ta thường gặp phải vấn đề như vậy: một số trường của lớp cần serialize, trong khi một số trường khác không cần, ví dụ như một số thông tin nhạy cảm của người dùng (như mật khẩu, số thẻ ngân hàng, v.v.). Vì lý do an toàn, không muốn truyền hoặc lưu trữ trên tệp đĩa trong các hoạt động mạng, những trường này có thể được thêm từ khóa `transient`.

Cần lưu ý rằng, các biến thành viên được sửa đổi bởi từ khóa `transient` sẽ được tự động khởi tạo lại giá trị mặc định khi deserialize, ví dụ như các kiểu dữ liệu cơ bản sẽ là 0, các kiểu tham chiếu sẽ là null.

Hãy xem ví dụ:

```java
public class TransientTest {
    public static void main(String[] args) {
        
        User user = new User();
        user.setUsername("Tom");
        user.setPasswd("123456");
        
        System.out.println("read before Serializable: ");
        System.out.println("username: " + user.getUsername());
        System.err.println("password: " + user.getPasswd());
        
        try {
            ObjectOutputStream os = new ObjectOutputStream(
                    new FileOutputStream("user.txt"));
            os.writeObject(user); // Ghi đối tượng User vào tệp
            os.flush();
            os.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            ObjectInputStream is = new ObjectInputStream(new FileInputStream(
                    "user.txt"));
            user = (User) is.readObject(); // Đọc dữ liệu User từ luồng
            is.close();
            
            System.out.println("\nread after Serializable: ");
            System.out.println("username: " + user.getUsername());
            System.err.println("password: " + user.getPasswd());
            
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}

class User implements Serializable {
    private static final long serialVersionUID = 8294180014912103005L;  
    
    private String username;
    private transient String passwd;
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPasswd() {
        return passwd;
    }
    
    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }

}
```

Kết quả đầu ra:

```
read before Serializable:
username: Tom
password: 123456 
read after Serializable:
username: Tom
password: null
```

Trường mật khẩu là null, điều này cho thấy rằng khi deserialize, thông tin này không được lấy từ tệp.

### 02. Tổng kết về cách sử dụng transient

1) Một khi trường được sửa đổi bởi `transient`, biến thành viên sẽ không còn là một phần của đối tượng được lưu trữ, giá trị của biến này không thể truy cập được sau khi serialize.

2) Từ khóa `transient` chỉ có thể sửa đổi trường, không thể sửa đổi phương thức và lớp.

3) Các trường được sửa đổi bởi từ khóa `transient` không thể được serialize, và một biến tĩnh (được sửa đổi bởi từ khóa [static](/programming/java/oo/static)) dù có được sửa đổi bởi `transient` hay không, đều không thể được serialize như đã nói trước đó [ở đây](serializbale).

Hãy xem ví dụ:

```java
public class TransientTest {
    public static void main(String[] args) {
        
        User user = new User();
        user.setUsername("Tom");
        user.setPasswd("123456");
        
        System.out.println("read before Serializable: ");
        System.out.println("username: " + user.getUsername());
        System.err.println("password: " + user.getPasswd());
        
        try {
            ObjectOutputStream os = new ObjectOutputStream(
                    new FileOutputStream("user.txt"));
            os.writeObject(user); // Ghi đối tượng User vào tệp
            os.flush();
            os.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            // Thay đổi giá trị của username trước khi deserialize
            User.username = "Jerry";
            
            ObjectInputStream is = new ObjectInputStream(new FileInputStream(
                    "user.txt"));
            user = (User) is.readObject(); // Đọc dữ liệu User từ luồng
            is.close();
            
            System.out.println("\nread after Serializable: ");
            System.out.println("username: " + user.getUsername());
            System.err.println("password: " + user.getPasswd());
            
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}

class User implements Serializable {
    private static final long serialVersionUID = 8294180014912103005L;  
    
    public static String username;
    private transient String passwd;
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPasswd() {
        return passwd;
    }
    
    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }
}
```

Kết quả đầu ra:

```
read before Serializable:
username: Tom
password: 123456 
read after Serializable:
username: Jerry
password: null
```

Trước khi serialize, trường `username` được sửa đổi bởi `static` có giá trị là Tom, sau đó chúng ta thay đổi giá trị của nó thành Jerry trước khi deserialize. Nếu như trường được sửa đổi bởi `static` có thể giữ được trạng thái, thì sau khi deserialize, nó nên có giá trị là Tom, đúng không?

Nhưng kết quả lại là Jerry, điều này chứng minh cho kết luận trước đó của chúng ta: **Trường được sửa đổi bởi `static` không thể được serialize**.

### 03. Các trường được sửa đổi bởi transient thực sự không thể được serialize?

Hãy suy nghĩ về ví dụ dưới đây:

```java
public class ExternalizableTest implements Externalizable {
    private transient String content = "Đúng vậy, tôi sẽ được serialize, dù tôi có được sửa đổi bởi từ khóa transient hay không";

    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeObject(content);
    }

    @Override
    public void readExternal(ObjectInput in) throws IOException,
            ClassNotFoundException {
        content = (String) in.readObject();
    }

    public static void main(String[] args) throws Exception {
        
        ExternalizableTest et = new ExternalizableTest();
        ObjectOutput out = new ObjectOutputStream(new FileOutputStream(
                new File("test")));
        out.writeObject(et);

        ObjectInput in = new ObjectInputStream(new FileInputStream(new File(
                "test")));
        et = (ExternalizableTest) in.readObject();
        System.out.println(et.content);

        out.close();
        in.close();
    }
}
```

Hãy xem kết quả đầu ra:

```
Đúng vậy, tôi sẽ được serialize, dù tôi có được sửa đổi bởi từ khóa transient hay không
```

Tại sao lại như vậy? Không phải nói rằng các trường được sửa đổi bởi từ khóa transient không thể serialize sao?

Để tôi giải thích. Đó là vì chúng ta đã sử dụng interface Externalizable thay vì interface Serializable. Chúng ta đã đề cập đến kiến thức này trước đây [ở đây](serializbale).

Trong Java, việc serialize đối tượng có thể được triển khai bằng cách triển khai hai interface. Nếu triển khai interface Serializable, tất cả quá trình serialize sẽ tự động diễn ra. Nếu triển khai interface Externalizable, thì cần phải chỉ định các trường cần serialize trong phương thức writeExternal, và việc này không liên quan đến từ khóa transient.

Vì vậy, kết quả đầu ra của ví dụ là nội dung của biến `content`, chứ không phải là `null`.

### 04. Tóm tắt

Từ khóa transient được sử dụng để sửa đổi các biến thành viên của lớp. Khi serialize đối tượng, các biến thành viên được sửa đổi bởi transient sẽ không được serialize và lưu trữ vào tệp. Mục đích của nó là thông báo cho JVM rằng không cần lưu giá trị của biến này khi serialize đối tượng, giúp tránh các vấn đề về bảo mật hoặc hiệu suất. Tuy nhiên, các biến thành viên được sửa đổi bởi transient sẽ được khởi tạo lại với giá trị mặc định khi deserialize (ví dụ: kiểu int sẽ được khởi tạo lại là 0, kiểu tham chiếu sẽ được khởi tạo lại là null), vì vậy cần xử lý thích hợp trong chương trình.

Từ khóa transient và static đều có thể được sử dụng để sửa đổi các biến thành viên của lớp. Trong đó, từ khóa transient chỉ ra rằng biến thành viên này không tham gia vào quá trình serialize và deserialize, còn từ khóa static chỉ ra rằng biến thành viên này thuộc về lớp, không thuộc về đối tượng, vì vậy không cần serialize và deserialize.

Trong interface Serializable và Externalizable, từ khóa transient cũng có hành vi khác nhau. Trong Serializable, nó chỉ ra rằng biến thành viên này không tham gia vào quá trình serialize và deserialize. Trong Externalizable, nó không có tác dụng vì interface Externalizable yêu cầu triển khai các phương thức readExternal và writeExternal, cần triển khai serialize và deserialize bằng tay.