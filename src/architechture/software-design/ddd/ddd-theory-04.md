---
title: DDD Theory 04
tags:
  - design
  - ddd
categories:
  - design
order: 4
---
# Lý thuyết về DDD 04 - Repository

**Repository** là một mẫu thiết kế dùng để đóng gói logic truy cập dữ liệu, giúp domain layer có thể truy cập vào aggregate root hoặc entity thông qua một interface đơn giản và nhất quán. Điểm mấu chốt của mẫu này là cung cấp một interface trừu tượng để domain layer có thể tương tác với data storage layer mà không cần biết chi tiết cụ thể phía sau.

## **Đặc điểm**

1. **Đóng gói các thao tác lưu trữ**: Repository chịu trách nhiệm đóng gói tất cả các thao tác tương tác với nguồn dữ liệu, như tạo, đọc, cập nhật và xóa (CRUD). Bằng cách này, domain layer có thể tránh được sự phức tạp khi xử lý cơ sở dữ liệu hoặc các cơ chế lưu trữ khác.
2. **Quản lý tập hợp domain object**: Repository thường được coi là tập hợp của các domain object, cung cấp các phương thức truy vấn và lọc các đối tượng này, giúp việc truy xuất và quản lý các domain object trở nên dễ dàng hơn.
3. **Abstract Interface**: Repository định nghĩa một interface không phụ thuộc vào cơ chế lưu trữ, giúp mã của domain layer có thể chuyển đổi giữa các cơ chế lưu trữ khác nhau mà không cần thay đổi business logic.

## **Mục đích**

1. **Trừu tượng hóa truy cập dữ liệu**: Repository cung cấp một interface truy cập dữ liệu rõ ràng cho domain layer, giúp các domain object có thể tập trung vào việc thực hiện business logic thay vì các chi tiết truy cập dữ liệu.
2. **Truy vấn và quản lý domain object**: Repository giúp việc truy vấn và quản lý các domain object trở nên thuận tiện và linh hoạt hơn, hỗ trợ logic truy vấn phức tạp.
3. **Tách biệt business logic và lưu trữ dữ liệu**: Thông qua Repository, business logic và logic lưu trữ dữ liệu được tách biệt, nâng cao tính trong suốt và khả năng kiểm thử của domain model.
4. **Tối ưu hóa truy cập dữ liệu**: Repository có thể bao gồm các chiến lược tối ưu hóa truy cập dữ liệu như bộ nhớ đệm, xử lý theo lô, v.v., để nâng cao hiệu suất của ứng dụng.

## **Cách thức thực hiện**

Trong thực tế, Repository thường được thực hiện thông qua các cách sau:

1. **Định nghĩa interface Repository**: Định nghĩa một hoặc nhiều interface Repository trong domain layer, các interface này khai báo các phương thức truy cập dữ liệu cần thiết.
2. **Thực hiện interface Repository**: Thực hiện các interface này ở tầng cơ sở hạ tầng hoặc tầng truy cập dữ liệu, có thể sử dụng các khung ORM (Object-Relational Mapping) như MyBatis, Hibernate, hoặc trực tiếp sử dụng API truy cập cơ sở dữ liệu như JDBC.
3. **Tiêm phụ thuộc**: Sử dụng cơ chế tiêm phụ thuộc (DI) để tiêm các hiện thực cụ thể của Repository vào các domain service hoặc application service cần chúng. Cách làm này giúp tách biệt hơn nữa domain layer và lớp truy cập dữ liệu, đồng thời thuận tiện cho việc kiểm thử đơn vị.
4. **Sử dụng mẫu đặc tả (Specification Pattern)**: Đôi khi, để xây dựng các truy vấn phức tạp, có thể kết hợp sử dụng mẫu đặc tả, một mẫu cho phép đóng gói các quy tắc nghiệp vụ thành các đơn vị logic riêng lẻ, có thể được Repository sử dụng để xây dựng truy vấn.

Tóm lại, Repository là một khái niệm cốt lõi trong DDD (Domain-Driven Design), giúp duy trì sự tập trung và rõ ràng của mô hình miền, đồng thời cung cấp chiến lược truy cập dữ liệu linh hoạt, có thể kiểm thử và dễ bảo trì.


## **Ví dụ**

Dưới đây là một ví dụ đơn giản bằng Java, minh họa cách thực hiện Repository Pattern trong kiến trúc DDD. Trong ví dụ này, chúng ta sẽ tạo một hệ thống quản lý người dùng đơn giản, bao gồm user entity và user repository interface, cùng với một bản triển khai repository dựa trên bộ nhớ.

Trước tiên, chúng ta định nghĩa một user entity:

```java
public class User {
    private Long id;
    private String username;
    private String email;

    // Bỏ qua getter, setter
}
```

Tiếp theo, chúng ta định nghĩa user repository interface:

```java
public interface UserRepository {
    User findById(Long id);
    List<User> findAll();
    void save(User user);
    void delete(User user);
}
```

Sau đó, chúng ta cung cấp một bản triển khai repository dựa trên bộ nhớ:

```java
public class InMemoryUserRepository implements UserRepository {
    private Map<Long, User> database = new HashMap<>();
    private AtomicLong idGenerator = new AtomicLong();

    @Override
    public User findById(Long id) {
        return database.get(id);
    }

    @Override
    public List<User> findAll() {
        return new ArrayList<>(database.values());
    }

    @Override
    public void save(User user) {
        if (user.getId() == null) {
            user.setId(idGenerator.incrementAndGet());
        }
        database.put(user.getId(), user);
    }

    @Override
    public void delete(User user) {
        database.remove(user.getId());
    }
}
```

Cuối cùng, chúng ta có thể sử dụng repository này trong application service:

```java
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id);
    }

    public void createUser(String username, String email) {
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
        userRepository.save(newUser);
    }

    // Các phương thức business logic khác...
}
```

Trong ứng dụng thực tế, chúng ta thường sử dụng các framework (như Spring) để tự động inject repository implementation. Ở đây để đơn giản, chúng ta có thể tự tạo các phiên bản service và repository:

```java
public class Application {
    public static void main(String[] args) {
        UserRepository userRepository = new InMemoryUserRepository();
        UserService userService = new UserService(userRepository);

        userService.createUser("tom", "tom@gmail.com");
        User user = userService.getUserById(1L);
        System.out.println("User found: " + user.getUsername());
    }
}
```

Ví dụ này minh họa cấu trúc cơ bản và cách sử dụng của Repository Pattern. Trong các dự án thực tế, bản triển khai repository có thể kết nối đến cơ sở dữ liệu và sử dụng các ORM framework để xử lý chi tiết về lưu trữ dữ liệu. Ngoài ra, repository interface có thể chứa các phương thức truy vấn phức tạp hơn để hỗ trợ các yêu cầu nghiệp vụ khác nhau.