---
title: DDD Theory 07
tags:
  - design
  - ddd
categories:
  - design
order: 7
---
# Lý thuyết về DDD 07 - Domain Service

## **1. Khái niệm**

Trong ngữ cảnh của Domain-Driven Design (DDD), Domain Service là một dịch vụ đóng gói các thao tác đặc thù của domain. Đây là một phương tiện để triển khai business logic trong domain model, đặc biệt là khi những logic này không phù hợp để thuộc về bất kỳ một Entity hoặc Value Object. Domain Service thường được sử dụng để triển khai các hành vi bao trùm nhiều entity hoặc value object, hoặc những thao tác không phù hợp để đặt trong một entity duy nhất.

## **2. Đặc điểm**

1. **Đóng gói domain logic**: Domain Service đóng gói business logic đặc thù của domain, thường liên quan đến sự tương tác giữa nhiều domain object. Việc đóng gói này giúp duy trì sự đơn nhiệm và rõ ràng trong vai trò của các entity và value object.
2. **Không trạng thái**: Domain Service thường không có trạng thái, chúng không lưu trữ dữ liệu nghiệp vụ mà thay vào đó là thao tác trên các domain object để hoàn thành business logic. Điều này giúp dịch vụ trở nên tái sử dụng và dễ kiểm thử.
3. **Tính độc lập**: Domain Service thường không liên quan đến entity hoặc value object cụ thể, chúng cung cấp một cách độc lập để triển khai các quy tắc nghiệp vụ mà không phụ thuộc vào các phần khác của domain model.
4. **Tính tái sử dụng**: Domain Service có thể được tái sử dụng trong các yêu cầu ứng dụng khác nhau, chẳng hạn như phối hợp dịch vụ ứng dụng hoặc xử lý sự kiện miền.
5. **Interface rõ ràng**: Interface của Domain Service nên phản ánh rõ ràng khả năng nghiệp vụ mà nó cung cấp, các tham số và giá trị trả về nên là các domain object hoặc kiểu dữ liệu cơ bản.

## **3. Mục đích sử dụng**

1. Khi một thao tác không thuộc về bất kỳ entity hoặc value object nào.
2. Khi một thao tác cần phối hợp nhiều entity hoặc value object.
3. Khi triển khai một quy tắc nghiệp vụ cần truy cập vào infrastructure layer (như cơ sở dữ liệu, dịch vụ bên ngoài), có thể sử dụng Domain Service để trừu tượng hóa những thao tác này, giữ cho domain model thuần túy.

## **4. Phương pháp triển khai**


### **4.1. Nguyên tắc thiết kế và mô hình**

Bằng cách sử dụng các nguyên tắc thiết kế (như nguyên tắc đơn nhiệm (Single Responsibility Principle), nguyên tắc mở/đóng (Open-Close Principle)) và các design pattern (như Factory, Strategy, Template, Composite, Chain of Responsibility) để giải quyết các logic chức năng, có thể tăng tính linh hoạt và dễ bảo trì của Domain Service.

### **4.2. Phân tách chức năng**

Không nên chỉ định nghĩa một service interface duy nhất rồi viết tất cả logic trong lớp triển khai. Thay vào đó, nên phân tách chức năng thành các gói con để giữ cho trách nhiệm của Domain Service rõ ràng và dễ dàng quản lý.

### **4.3. Trừu tượng hóa phụ thuộc**

Domain Service nên phụ thuộc vào sự trừu tượng hóa thay vì phụ thuộc vào các triển khai cụ thể. Điều này có nghĩa là Domain Service nên tương tác với các tài nguyên bên ngoài (như cơ sở dữ liệu, API bên ngoài) thông qua Interface, thay vì phụ thuộc trực tiếp vào các triển khai cụ thể. Điều này giúp tăng khả năng kiểm thử và tính linh hoạt của Domain Service.

### **4.4. Phối hợp và dàn xếp**

Domain Service có thể cần phối hợp với các Domain Service khác hoặc dịch vụ ứng dụng để hoàn thành các thao tác nghiệp vụ phức tạp. Trong trường hợp này, nên thiết kế cơ chế phối hợp và dàn xếp rõ ràng để đảm bảo tính chính xác và nhất quán của business logic.

Thông qua các khái niệm, đặc điểm, mục đích sử dụng và phương pháp triển khai trên, Domain Service đóng vai trò quan trọng trong kiến trúc DDD, là thành phần chính để triển khai domain logic và duy trì tính toàn vẹn của domain model.

## **5. Gợi ý thực hành cho Domain Service**


Trong thực tiễn, thiết kế và triển khai Domain Service nên tuân theo các gợi ý sau:

### **5.1. Nhận diện Domain Service**

Khi thiết kế domain model, nên nhận diện những hành vi không thuộc về bất kỳ entity hoặc value object nào, và trừu tượng hóa những hành vi này thành Domain Service. Điều này thường liên quan đến việc hiểu sâu và phân tích các quy tắc nghiệp vụ.

### **5.2. Ranh giới rõ ràng**

Đảm bảo trách nhiệm của Domain Service rõ ràng. Domain Service không nên trở thành một tập hợp lộn xộn với quá nhiều trách nhiệm. Mỗi Domain Service nên tập trung vào một khả năng nghiệp vụ cụ thể hoặc một nhóm hành vi liên quan chặt chẽ.

### **5.3. Sử dụng Dependency Injection**

Sử dụng Dependency Injection (DI) để quản lý các mối quan hệ phụ thuộc của Domain Service. Điều này giúp duy trì khả năng kiểm thử của Domain Service và dễ dàng tích hợp nó với các thành phần khác.

### **5.4. Quản lý giao dịch**

Mặc dù Domain Service không quản lý trực tiếp các giao dịch, nhưng chúng có thể tham gia vào các thao tác mang tính giao dịch. Trong trường hợp này, cần đảm bảo rằng các thao tác của Domain Service có thể phối hợp với cơ chế quản lý giao dịch bên ngoài (như các giao dịch trong dịch vụ ứng dụng).

### **5.5. Kiểm thử và xác minh**

Domain Service cần được kiểm thử đầy đủ thông qua các bài unit test và integration test. Điều này giúp xác minh rằng hành vi của Domain Service đúng với mong đợi và đảm bảo rằng khi tái cấu trúc hoặc mở rộng, không làm phá vỡ các chức năng hiện có.

### **5.6. Tài liệu và bảo trì**

Viết tài liệu rõ ràng cho Domain Service, mô tả trách nhiệm, cách sử dụng và sự tương tác của nó với các thành phần khác trong domain model. Điều này giúp cho các thành viên mới trong nhóm dễ dàng hiểu và bảo trì Domain Service.

## **6. Kết luận**

Domain Service trong kiến trúc DDD là thành phần quan trọng để triển khai domain logic. Chúng cung cấp một phương thức để đóng gói các quy tắc nghiệp vụ và phối hợp hành vi của các domain object, đồng thời giữ cho domain model rõ ràng và tập trung. Bằng cách tuân theo các nguyên tắc và thực hành tốt nhất của DDD, Domain Service có thể hỗ trợ hiệu quả việc triển khai business logic phức tạp và thúc đẩy khả năng bảo trì cũng như mở rộng của hệ thống phần mềm.

## **7. Ví dụ**

Dưới đây là một ví dụ đơn giản bằng Java, minh họa cách triển khai Domain Service trong DDD. Giả sử chúng ta có một ứng dụng ngân hàng, trong đó bao gồm  Account Entity (Tài khoản) và Transfer Domain Service (Chuyển tiền).

Trước tiên, chúng ta định nghĩa account entity:

```java
public class Account {
    private String id;
    private BigDecimal balance;

    public Account(String id, BigDecimal balance) {
        this.id = id;
        this.balance = balance;
    }

    public String getId() {
        return id;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void debit(BigDecimal amount) {
        if (balance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Số dư không đủ");
        }
        balance = balance.subtract(amount);
    }

    public void credit(BigDecimal amount) {
        balance = balance.add(amount);
    }
}
```

Tiếp theo, chúng ta định nghĩa Transfer Domain Service:

```java
public class TransferService {
    private final AccountRepository accountRepository;

    public TransferService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public void transfer(String fromAccountId, String toAccountId, BigDecimal amount) {
        Account fromAccount = accountRepository.findById(fromAccountId);
        Account toAccount = accountRepository.findById(toAccountId);

        if (fromAccount == null || toAccount == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }

        fromAccount.debit(amount);
        toAccount.credit(amount);

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
    }
}
```

Sau đó, chúng ta định nghĩa Account Repository Interface:

```java
public interface AccountRepository {
    Account findById(String id);
    void save(Account account);
}
```

Cuối cùng, chúng ta có thể sử dụng Transfer Service trong Application Service Layer:

```java
public class BankingApplicationService {
    private final TransferService transferService;

    public BankingApplicationService(TransferService transferService) {
        this.transferService = transferService;
    }

    public void handleTransferRequest(String fromAccountId, String toAccountId, BigDecimal amount) {
        // Tại đây, bạn có thể thêm các logic bổ sung như xác thực, kiểm tra quyền, quản lý giao dịch, v.v.
        transferService.transfer(fromAccountId, toAccountId, amount);
    }
}
```

Trong ứng dụng thực tế, việc triển khai `AccountRepository` sẽ tương tác với cơ sở dữ liệu, `TransferService` có thể liên quan đến các quy tắc nghiệp vụ phức tạp hơn, và `BankingApplicationService` sẽ xử lý các mối quan tâm liên quan đến giao dịch và bảo mật giữa các Domain Service.

Lưu ý rằng, ví dụ này đã được đơn giản hóa cho mục đích minh họa. Trong hệ thống thực tế, bạn cần xem xét quản lý giao dịch, xử lý lỗi, ghi log, bảo mật, và các vấn đề khác. Ngoài ra, việc tiêm phụ thuộc (Dependency Injection) thường do các framework như Spring xử lý, thay vì tạo các dịch vụ thủ công.