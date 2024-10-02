---
title: DDD Theory 03
tags:
  - design
  - ddd
categories:
  - design
order: 3
---
# Lý thuyết về DDD 03 - Entity, Aggregate, VO

Trong thiết kế hướng miền (Domain-Driven Design, DDD), Domain Model là một trong những khái niệm cốt lõi. Domain model là sự trừu tượng hóa của business domain trong thế giới thực, bao gồm các khái niệm như Aggregate, Entities, Value Objects và nhiều khái niệm khác.

## **Aggregate Object**

Aggregate là một tập hợp các đối tượng liên quan, cùng nhau tạo thành một đơn vị duy nhất.

### **Khái niệm**

Aggregate là một khái niệm quan trọng trong domain model. Nó là một tập hợp các đối tượng có tính liên kết chặt chẽ, cùng làm việc để thực hiện một số quy tắc hoặc thao tác nghiệp vụ nhất định. Aggregate định nghĩa các ranh giới của một tập hợp đối tượng, các đối tượng này có thể được xử lý như một đơn vị duy nhất.

**Quan trọng: Đảm bảo tính nhất quán trong phạm vi Aggregate, tính nhất quán cuối cùng ngoài Aggregate.**

### **Đặc điểm**

1. **Ranh giới nhất quán**: Aggregate đảm bảo sự thay đổi trạng thái của các đối tượng bên trong là nhất quán. Khi thực hiện các thao tác trên các đối tượng bên trong Aggregate, các thao tác này phải duy trì tính nhất quán cho tất cả các đối tượng bên trong Aggregate.
2. **Root Entity**: Mỗi Aggregate có một root entity (Aggregate Root), nó là điểm vào của Aggregate. Root entity có một định danh duy nhất toàn cục, các đối tượng khác tương tác với Aggregate thông qua root entity.
3. **Ranh giới giao dịch**: Aggregate cũng định nghĩa ranh giới giao dịch. Bên trong Aggregate, tất cả các thao tác thay đổi phải là nguyên tử, tức là chúng phải hoặc thành công hoàn toàn hoặc thất bại hoàn toàn để đảm bảo tính nhất quán dữ liệu.

### **Ứng dụng**

1. **Đóng gói logic nghiệp vụ**: Aggregate đóng gói các đối tượng và thao tác liên quan, cung cấp một mô hình logic nghiệp vụ rõ ràng, giúp việc thực thi và duy trì các quy tắc nghiệp vụ dễ dàng hơn.
2. **Đảm bảo tính nhất quán**: Aggregate đảm bảo tính nhất quán của trạng thái nội bộ bằng cách định nghĩa các ranh giới và quy tắc rõ ràng, giúp duy trì dữ liệu một cách nhất quán.
3. **Đơn giản hóa sự phức tạp**: Aggregate tổ chức các đối tượng liên quan, đơn giản hóa sự phức tạp của domain model. Điều này giúp các nhà phát triển dễ dàng hiểu và mở rộng hệ thống.


### **Phương pháp triển khai**

1. **Định nghĩa Aggregate Root**: Bước đầu tiên trong việc thực hiện Aggregate là chọn Aggregate Root phù hợp. Aggregate Root nên là entity có thể đại diện cho toàn bộ Aggregate và có định danh duy nhất.
2. **Hạn chế đường dẫn truy cập**: Chỉ cho phép thay đổi các đối tượng bên trong Aggregate thông qua Aggregate Root, không cho phép thay đổi trực tiếp trạng thái của các đối tượng bên trong Aggregate để duy trì ranh giới và tính nhất quán.
3. **Thiết kế chiến lược giao dịch**: Đảm bảo tính nhất quán trong phạm vi Aggregate, đảm bảo các thao tác phải hoàn thành toàn bộ hoặc quay lại toàn bộ. Đối với tương tác giữa các Aggregate, có thể sử dụng domain event hoặc các cơ chế khác để đảm bảo tính nhất quán cuối cùng.
4. **Đóng gói quy tắc nghiệp vụ**: Thực hiện các quy tắc và logic nghiệp vụ bên trong Aggregate, đảm bảo tất cả các thao tác nghiệp vụ đều tuân thủ các quy tắc này.
5. **Lưu trữ**: Aggregate Root thường tương tác với lớp lưu trữ dữ liệu để lưu trữ trạng thái của Aggregate. Điều này thường liên quan đến ánh xạ Object-Relation (ORM) hoặc các kỹ thuật ánh xạ dữ liệu khác.

Thông qua các phương thức này, mô hình Aggregate trong DDD có thể giúp các nhà phát triển xây dựng hệ thống phần mềm vừa phù hợp với nhu cầu nghiệp vụ, vừa có thiết kế kiến trúc tốt.

Dưới đây là một ví dụ mã Java đơn giản, minh họa cách thực hiện một Aggregate trong DDD. Trong ví dụ này, chúng ta sẽ tạo một hệ thống đặt hàng đơn giản, bao gồm Order Aggregate và OrderItem như là entity nội bộ. Aggregate Root Order sẽ đóng gói tất cả các quy tắc nghiệp vụ và thực hiện tất cả các tương tác thông qua Aggregate Root.

Đầu tiên, chúng ta định nghĩa lớp cơ sở cho entity và value object:

```java
// Lớp cơ sở cho entity
public abstract class BaseEntity {
    protected Long id;
    
    public Long getId() {
        return id;
    }
}

// Lớp cơ sở cho value object
public abstract class ValueObject {
    // Value object thường không thể thay đổi, do đó không có phương thức setter
}
```

Tiếp theo, chúng ta định nghĩa OrderItem như là một entity:

```java
public class OrderItem extends BaseEntity {
    private String productName;
    private int quantity;
    private double price;
    
    public OrderItem(String productName, int quantity, double price) {
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
    }
    
    public double getTotalPrice() {
        return quantity * price;
    }
    
    // Bỏ qua các phương thức getter và setter
}
```

Sau đó, chúng ta định nghĩa Aggregate Root Order:

```java
import java.util.ArrayList;
import java.util.List;

public class OrderAggregate extends BaseEntity {
    private List<OrderItem> orderItems;
    private String customerName;
    private boolean isPaid;
    
    public OrderAggregate(String customerName) {
        this.customerName = customerName;
        this.orderItems = new ArrayList<>();
        this.isPaid = false;
    }
    
    public void addItem(OrderItem item) {
        // Quy tắc nghiệp vụ: chỉ có thể thêm item khi đơn hàng chưa được thanh toán
        if (!isPaid) {
            orderItems.add(item);
        } else {
            throw new IllegalStateException("Không thể thêm item vào đơn hàng đã thanh toán.");
        }
    }
    
    public double getTotalAmount() {
        return orderItems.stream().mapToDouble(OrderItem::getTotalPrice).sum();
    }
    
    public void markAsPaid() {
        // Quy tắc nghiệp vụ: tổng số tiền đơn hàng phải lớn hơn 0 mới có thể đánh dấu là đã thanh toán
        if (getTotalAmount() > 0) {
            isPaid = true;
        } else {
            throw new IllegalStateException("Tổng số tiền đơn hàng phải lớn hơn 0 để đánh dấu đã thanh toán.");
        }
    }
    
    // Bỏ qua các phương thức getter và setter
}
```

Cuối cùng, chúng ta có thể tạo một đơn hàng và thêm một số mục đơn hàng:

```java
public class OrderDemo {
    public static void main(String[] args) {
        // Tạo Aggregate đơn hàng
        OrderAggregate orderAggregate = new OrderAggregate("Hung");
        
        // Thêm các mục đơn hàng
        orderAggregate.addItem(new OrderItem("Điện thoại", 1, 1000.00));
        orderAggregate.addItem(new OrderItem("Cáp dữ liệu", 2, 25.00));
        
        // Lấy tổng số tiền đơn hàng
        System.out.println("Tổng số tiền: " + orderAggregate.getTotalAmount());
        
        // Đánh dấu đơn hàng là đã thanh toán
        orderAggregate.markAsPaid();
    }
}
```

Trong ví dụ này, chúng ta đã minh họa cách định nghĩa Aggregate Root và Entity trong DDD, cũng như cách đóng gói các quy tắc nghiệp vụ. Aggregate Root Order đảm bảo tính nhất quán của các OrderItem và chỉ cho phép thay đổi trạng thái đơn hàng thông qua Aggregate Root. Ví dụ này cũng cho thấy cách thực hiện tính nhất quán trong giao dịch trong phạm vi Aggregate, chẳng hạn như chỉ có thể thêm hàng khi đơn hàng chưa được thanh toán và đơn hàng phải có tổng số tiền lớn hơn 0 mới có thể đánh dấu là đã thanh toán.

## **Entity**

Entity (Thực thể) trong thiết kế hướng miền (Domain-Driven Design, DDD) là một khái niệm cốt lõi, dùng để biểu thị các đối tượng miền có định danh duy nhất. Dưới đây là mô tả chi tiết về entity:

### **Khái niệm**

Entity = Định danh duy nhất + Thuộc tính trạng thái + Hành động (chức năng), là một khối xây dựng cơ bản trong DDD, đại diện cho các đối tượng miền có định danh duy nhất. Entity không chỉ chứa dữ liệu (thuộc tính trạng thái) mà còn bao gồm các hành động liên quan (chức năng) và định danh của nó không thay đổi trong suốt vòng đời của entity.

### **Đặc điểm**

1. **Định danh duy nhất**: Entity có một định danh để phân biệt với các entity khác. Định danh này có thể là một ID, một khóa hợp nhất hoặc một khóa tự nhiên, điều quan trọng là nó có thể định danh duy nhất một entity cụ thể.
2. **Định danh miền**: Định danh của entity thường xuất phát từ business domain, ví dụ như ID người dùng, ID đơn hàng, v.v. Những định danh này có ý nghĩa đặc biệt trong nghiệp vụ và là duy nhất trong hệ thống.
3. **Định danh uỷ nhiệm**: Trong một số trường hợp, định danh của entity có thể được tự động tạo bởi ORM Framework (Object-Relational Mapping), như khóa chính tự động tăng trong cơ sở dữ liệu. Định danh này tuy có thể định danh duy nhất entity nhưng không xuất phát trực tiếp từ business domain.

### **Mục đích**

1. **Biểu thị khái niệm nghiệp vụ**: Entity được dùng để biểu thị các khái niệm nghiệp vụ cụ thể trong phần mềm, như người dùng, đơn hàng, giao dịch, v.v. Thông qua các thuộc tính và hành động của entity, có thể mô tả đặc điểm và khả năng của các đối tượng nghiệp vụ này.
2. **Đóng gói business logic**: Entity không chỉ mang dữ liệu mà còn đóng gói các quy tắc và logic nghiệp vụ. Những logic này bao gồm việc xác thực tính hợp lệ của dữ liệu, thực thi các quy tắc nghiệp vụ, tính toán giá trị thuộc tính, v.v. Mục đích của việc này là đảm bảo sự tập trung và nhất quán của logic nghiệp vụ.
3. **Duy trì tính nhất quán dữ liệu**: entity chịu trách nhiệm duy trì trạng thái và tính nhất quán của dữ liệu của mình. Nó đảm bảo rằng các thuộc tính và mối quan hệ liên quan của nó luôn đúng và đầy đủ, từ đó tránh được sự không nhất quán của dữ liệu.

### **Phương pháp triển khai**

Khi triển khai entity, thường sẽ áp dụng các phương pháp sau:

1. **Định nghĩa lớp entity**: Định nghĩa một lớp trong mã nguồn chứa các thuộc tính, hàm khởi tạo, phương thức của entity.
2. **Triển khai định danh duy nhất**: Cung cấp cho lớp thực thể một thuộc tính định danh duy nhất, như ID, và đảm bảo định danh này không thay đổi trong suốt vòng đời của thực thể.
3. **Đóng gói hành vi**: Triển khai các phương thức logic nghiệp vụ trong lớp thực thể, các phương thức này có thể thao tác lên trạng thái của thực thể và thực thi các quy tắc nghiệp vụ liên quan.
4. **Sử dụng ORM framework**: Sử dụng các framework ORM để ánh xạ entity đến bảng cơ sở dữ liệu, giúp đơn giản hóa các thao tác lưu trữ dữ liệu.
5. **Triển khai domain service**: Đối với các thao tác liên quan đến nhiều entity hoặc nhiều aggregate, có thể triển khai các domain service để xử lý, thay vì triển khai trực tiếp trong entity.
6. **Sử dụng domain event**: Khi trạng thái của entity thay đổi, có thể phát hành các domain event để thông báo cho các phần khác của hệ thống thực hiện xử lý tương ứng.  

Thông qua các phương thức này, entity trong kiến trúc DDD đóng vai trò quan trọng, không chỉ đại diện cho khái niệm nghiệp vụ mà còn đóng gói logic nghiệp vụ và đảm bảo tính nhất quán dữ liệu thông qua định danh duy nhất.

Dưới đây là một ví dụ Java đơn giản, minh họa cách triển khai một entity trong thiết kế hướng domain (DDD). Chúng ta sẽ tạo một User entity, đại diện cho một người dùng, có ID người dùng duy nhất, tên và địa chỉ email, và có thể thực hiện một số hành vi cơ bản.

  

```java
import java.util.Objects;
import java.util.UUID;

// UserEntity entity lớp
public class UserEntity {
    // Định danh duy nhất của entity
    private final UUID id;
    // Thuộc tính trạng thái của người dùng
    private String name;
    private String email;

    // Hàm khởi tạo, dùng để tạo entity
    public UserEntity(UUID id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
        // Có thể thêm validation logic ở đây để đảm bảo entity được tạo hợp lệ
    }

    // Phương thức hành vi của entity, ví dụ cập nhật tên người dùng
    public void updateName(String newName) {
        // Có thể thêm quy tắc nghiệp vụ ở đây, ví dụ xác thực định dạng tên
        this.name = newName;
    }

    // Phương thức hành vi của entity, ví dụ cập nhật địa chỉ email của người dùng
    public void updateEmail(String newEmail) {
        // Có thể thêm quy tắc nghiệp vụ ở đây, ví dụ xác thực định dạng email
        this.email = newEmail;
    }

    // Phương thức Getter
    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    // Phương thức equals và hashCode của entity, dựa trên định danh duy nhất
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserEntity user = (UserEntity) o;
        return id.equals(user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // Phương thức toString, dùng để in thông tin entity
    @Override
    public String toString() {
        return "UserEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}

// Ví dụ sử dụng entity
public class UserEntityDemo {
    public static void main(String[] args) {
        // Tạo một entity người dùng mới
        UserEntity user = new UserEntity(UUID.randomUUID(), "Tom", "tom@gmail.com");

        // In thông tin người dùng
        System.out.println(user);

        // Cập nhật tên người dùng
        user.updateName("Tom Cat");

        // In thông tin người dùng sau khi cập nhật
        System.out.println(user);

        // Cập nhật địa chỉ email người dùng
        user.updateEmail("tom_cat@gmail.com");

        // In thông tin người dùng sau khi cập nhật
        System.out.println(user);
    }
}
```

Trong ví dụ này, lớp `UserEntity` đại diện cho thực thể người dùng. Entity có một định danh duy nhất `id`, định danh này không thay đổi trong suốt vòng đời của entity. `name` và `email` là các thuộc tính trạng thái của người dùng. `updateName` và `updateEmail` là các phương thức hành vi đóng gói logic nghiệp vụ. Các phương thức `equals` và `hashCode` dựa trên định danh duy nhất để đảm bảo so sánh và băm đúng. Lớp `UserEntityDemo` minh họa cách tạo và sử dụng thực thể `UserEntity`.

## **Value Object**

Trong thiết kế hướng miền (Domain-Driven Design, DDD), Value Object là một khái niệm cốt lõi, được sử dụng để đóng gói và biểu diễn các khái niệm trong miền. Đặc điểm của chúng là mô tả các thuộc tính hoặc số đo trong miền, nhưng không có định danh duy nhất.

Value Object = Value + Object, được sử dụng để mô tả giá trị của các thuộc tính của đối tượng, biểu thị thông tin giá trị cố định không thay đổi.

### **Khái niệm**

Value Object được tạo thành từ một tập hợp các thuộc tính, chúng cùng nhau mô tả một khái niệm trong miền. Khác với thực thể (Entity), Value Object không cần có định danh duy nhất để phân biệt chúng. Value Object thường là bất biến, tức là một khi được tạo ra, trạng thái của chúng không nên thay đổi.

### **Đặc điểm**

1.  **Tính bất biến (Immutability)**: Value Object một khi đã được tạo ra, trạng thái của nó không nên thay đổi. Điều này giúp đảm bảo tính nhất quán của mô hình miền và an toàn trong lập trình đa luồng.
2.  **Tính tương đương (Equality)**: Tính tương đương của Value Object không dựa trên định danh hay tham chiếu, mà dựa trên giá trị của các thuộc tính. Nếu tất cả các thuộc tính của hai Value Object đều giống nhau, thì hai đối tượng này được coi là tương đương.
3.  **Tính thay thế (Replaceability)**: Vì Value Object là bất biến, bất kỳ thao tác nào cần thay đổi giá trị của đối tượng sẽ dẫn đến việc tạo ra một thể hiện Value Object mới, thay vì thay đổi thể hiện hiện tại.
4.  **Tập trung vào mô tả trạng thái của sự vật**: Value Object thường được sử dụng để mô tả trạng thái của sự vật, thay vì định danh duy nhất của sự vật đó.
5.  **Tính tái sử dụng (Reusability)**: Value Object có thể được tái sử dụng trong các thực thể miền khác nhau hoặc các Value Object khác.

### **Mục đích**

Value Object được sử dụng rất rộng rãi, chúng có thể được sử dụng để biểu diễn:

1.  Số tiền và tiền tệ (như giá cả, lương, chi phí, v.v.)
2.  Số đo và dữ liệu (như trọng lượng, chiều dài, thể tích, v.v.)
3.  Phạm vi hoặc khoảng cách (như khoảng thời gian, khoảng nhiệt độ, v.v.)
4.  Mô hình toán học phức tạp (như tọa độ, vector, v.v.)
5.  Bất kỳ tập hợp thuộc tính nào khác cần được đóng gói

### **Phương pháp triển khai**

Khi triển khai Value Object, thường tuân theo các bước sau:

1.  **Định nghĩa lớp bất biến**: Đảm bảo tất cả các thuộc tính của lớp đều là private và chỉ có thể được thiết lập thông qua hàm tạo.
2.  **Ghi đè các phương thức equals và hashCode**: Điều này giúp đảm bảo tính tương đương của Value Object dựa trên giá trị của các thuộc tính, không phải tham chiếu của đối tượng.
3.  **Cung cấp các phương thức truy cập chỉ đọc**: Chỉ cung cấp các phương thức để lấy giá trị của thuộc tính, không cung cấp các phương thức để thay đổi giá trị của thuộc tính.
4.  **Sử dụng factory method hoặc constructor để tạo instance**: Điều này giúp đảm bảo tính hợp lệ và nhất quán của Value Object.
5.  **Xem xét hỗ trợ serialize: Nếu Value Object cần được truyền qua mạng hoặc lưu trữ vào cơ sở dữ liệu, cần cung cấp hỗ trợ serialize và deserialize.
### **Ví dụ**

Lấy ví dụ về trạng thái đơn hàng, chúng ta có thể định nghĩa một Value Object để biểu diễn các trạng thái khác nhau:

```java
public enum OrderStatusVO {
    PLACED(0, "Đặt hàng"),
    PAID(1, "Thanh toán"),
    COMPLETED(2, "Hoàn thành"),
    CANCELLED(3, "Hủy đơn");

    private final int code;
    private final String description;

    OrderStatusVO(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    // Lấy trạng thái đơn hàng dựa trên code
    public static OrderStatusVO fromCode(int code) {
        for (OrderStatusVO status : OrderStatusVO.values()) {
            if (status.getCode() == code) {
                return status;
            }
        }
        throw new IllegalArgumentException("Mã không hợp lệ cho trạng thái đơn hàng: " + code);
    }
}
```

Trong ví dụ này, `OrderStatusVO` là một Value Object kiểu enum, nó đóng gói mã và mô tả của trạng thái đơn hàng. Nó là bất biến và cung cấp tính tương đương dựa trên giá trị thuộc tính. Bằng cách định nghĩa một enum, chúng ta có thể đảm bảo giá trị của trạng thái đơn hàng được giới hạn và mỗi trạng thái đều có ý nghĩa rõ ràng.

Trong cơ sở dữ liệu, trạng thái đơn hàng có thể được lưu trữ dưới dạng số nguyên (ví dụ, 0 biểu thị đặt hàng, 1 biểu thị thanh toán, v.v.). Trong ứng dụng, chúng ta có thể sử dụng enum `OrderStatusVO` để đảm bảo rằng chúng ta đang sử dụng các giá trị an toàn theo kiểu trong mã, thay vì các số nguyên đơn thuần. Điều này giúp giảm thiểu lỗi và nâng cao khả năng đọc và bảo trì mã.

Khi cần lưu trữ trạng thái đơn hàng vào cơ sở dữ liệu, chúng ta có thể lưu trữ giá trị mã của enum. Khi đọc trạng thái đơn hàng từ cơ sở dữ liệu, chúng ta có thể sử dụng phương thức `fromCode` để chuyển đổi giá trị số nguyên trở lại enum `OrderStatusVO`, nhờ đó chúng ta có thể sử dụng loại enum phong phú trong mã thay vì số nguyên đơn giản.

Value Object cũng có thể được sử dụng để biểu diễn các cấu trúc phức tạp hơn, chẳng hạn như một địa chỉ:

```java
public final class AddressVO {
    private final String street;
    private final String city;
    private final String zipCode;
    private final String country;

    public AddressVO(String street, String city, String zipCode, String country) {
        // Có thể thêm logic kiểm tra tính hợp lệ của địa chỉ ở đây
        this.street = street;
        this.city = city;
        this.zipCode = zipCode;
        this.country = country;
    }

    // Truy cập chỉ đọc
    public String getStreet() {
        return street;
    }

    public String getCity() {
        return city;
    }

    public String getZipCode() {
        return zipCode;
    }

    public String getCountry() {
        return country;
    }

    // Ghi đè phương thức equals và hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AddressVO address = (AddressVO) o;
        return street.equals(address.street) &&
                city.equals(address.city) &&
                zipCode.equals(address.zipCode) &&
                country.equals(address.country);
    }

    @Override
    public int hashCode() {
        return Objects.hash(street, city, zipCode, country);
    }
}
```

Trong ví dụ này, `AddressVO` là một Value Object bất biến, nó đóng gói tất cả các phần của một địa chỉ. Nó cung cấp các phương thức truy cập chỉ đọc và ghi đè các phương thức `equals` và `hashCode` để đảm bảo tính tương đương dựa trên giá trị thuộc tính. Thiết kế như vậy giúp đảm bảo tính nhất quán của địa chỉ và có thể được tái sử dụng giữa các thực thể khác nhau, chẳng hạn như người dùng và cửa hàng đều có thể có địa chỉ.

Tóm lại, Value Object là công cụ quan trọng trong DDD để đóng gói các khái niệm domain. Chúng giúp xây dựng một mô hình domain rõ ràng, nhất quán và dễ bảo trì thông qua tính bất biến, tính tương đương dựa trên thuộc tính và tính thay thế.