---
title: DDD Theory 05
tags:
  - design
  - ddd
categories:
  - design
order: 5
---
# Lý thuyết về DDD 05 - Port & Adapter

Trong ngữ cảnh của Thiết kế theo hướng miền (DDD), Adapter Pattern đóng vai trò vô cùng quan trọng. Adapter cho phép chuyển đổi các interface không tương thích thành một interface mong muốn khác, từ đó giúp các lớp vốn không thể hoạt động cùng nhau do không tương thích interface có thể phối hợp với nhau. Trong DDD, các Adapter thường được kết hợp với khái niệm Port để tạo thành kiến trúc "Ports and Adapters", còn được gọi là "Hexagonal Architecture". Phong cách kiến trúc này nhằm mục đích tách biệt logic cốt lõi của ứng dụng khỏi sự tương tác với bên ngoài.

## **Khái niệm**

Port (Cổng) trong kiến trúc này đại diện cho một điểm đầu vào hoặc đầu ra của ứng dụng. Nó định nghĩa một interface tương tác với bên ngoài nhưng không quan tâm đến chi tiết triển khai cụ thể. Cổng có thể là Driving Ports (cổng điều khiển, thường là cổng đầu vào) hoặc Driven Ports (cổng bị điều khiển, thường là cổng đầu ra).

## **Đặc điểm**

1. **Tính trừu tượng**: Port cung cấp mô tả trừu tượng về hành vi dịch vụ, xác định rõ chức năng của dịch vụ và sự phụ thuộc bên ngoài.
2. **Tính độc lập**: Port độc lập với triển khai cụ thể, cho phép thay thế hoặc mở rộng linh hoạt việc triển khai dịch vụ.
3. **Tính linh hoạt**: Có thể cung cấp các Adapter khác nhau cho cùng một cổng để phù hợp với các môi trường hoạt động hoặc yêu cầu khác nhau.

## **Ứng dụng**


1. **Định nghĩa tiêu chuẩn**: Port và Adapter định nghĩa hành vi chuẩn của dịch vụ và sự phụ thuộc bên ngoài, tăng tính đọc và bảo trì của mã nguồn.
2. **Cô lập thay đổi**: Khi hệ thống bên ngoài thay đổi, chỉ cần thay đổi hoặc thay thế Adapter mà không cần thay đổi core business logic. 
3. **Hỗ trợ kiểm thử**: Có thể sử dụng các Adapter mô phỏng để kiểm thử logic cốt lõi mà không phụ thuộc vào hệ thống thực tế bên ngoài.

## **Triển khai**

Việc triển khai kiến trúc Port và Adapter thường bao gồm các bước sau:

1. **Định nghĩa Port**: Định nghĩa các interface rõ ràng trong domain layer, đại diện cho các điểm tương tác của ứng dụng với thế giới bên ngoài.
2. **Tạo Adapter**: Triển khai Adapter trong infrastructure layer hoặc application layer, những Adapter này chịu trách nhiệm chuyển đổi các thao tác trừu tượng của Port thành các lệnh gọi cụ thể bên ngoài.
3. **Đảo ngược sự phụ thuộc**: Logic cốt lõi của ứng dụng phụ thuộc vào port interface, chứ không phải vào việc triển khai cụ thể của Adapter. Điều này cho phép Adapter có thể thay thế bất cứ lúc nào mà không ảnh hưởng đến logic cốt lõi.
4. **Cấu hình và kết nối**: Khi ứng dụng khởi động, kết nối Adapter với các Port tương ứng theo yêu cầu.

Thông qua cách tiếp cận này, Adapter Pattern trong DDD giúp xây dựng một hệ thống linh hoạt, dễ bảo trì và dễ kiểm thử.

## **Ví dụ**

Dưới đây là một ví dụ Java đơn giản, minh họa cách triển khai Adapter Pattern trong kiến trúc DDD. Trong ví dụ này, chúng ta sẽ tạo một hệ thống thanh toán đơn giản, bao gồm một cổng thanh toán (payment port) và một bộ chuyển đổi (adapter) chịu trách nhiệm gọi interface của dịch vụ thanh toán bên ngoài (3rd service).

Trước tiên, chúng ta định nghĩa một cổng thanh toán (Port), đây là một interface mô tả các thao tác mà dịch vụ thanh toán cần cung cấp:

```java
public interface PaymentPort {
    boolean processPayment(double amount);
}
```

Tiếp theo, chúng ta tạo một bộ chuyển đổi, nó sẽ triển khai cổng thanh toán và chịu trách nhiệm gọi interface của dịch vụ thanh toán bên ngoài:

```java
public class ExternalPaymentService {
    public boolean makePayment(double amount) {
        // Đây là logic cụ thể để gọi dịch vụ thanh toán bên ngoài
        System.out.println("Gọi dịch vụ thanh toán bên ngoài với số tiền: " + amount);
        // Giả sử thanh toán luôn thành công
        return true;
    }
}

public class PaymentAdapter implements PaymentPort {
    private ExternalPaymentService externalPaymentService;

    public PaymentAdapter(ExternalPaymentService externalPaymentService) {
        this.externalPaymentService = externalPaymentService;
    }

    @Override
    public boolean processPayment(double amount) {
        // Gọi interface của dịch vụ thanh toán bên ngoài
        return externalPaymentService.makePayment(amount);
    }
}
```

Bây giờ, chúng ta có thể sử dụng cổng thanh toán trong logic cốt lõi của ứng dụng mà không phụ thuộc vào triển khai cụ thể của adapter. Như vậy, nếu trong tương lai cần thay thế dịch vụ thanh toán bên ngoài, chúng ta chỉ cần cung cấp một triển khai adapter mới là đủ:

```java
public class PaymentService {
    private PaymentPort paymentPort;

    public PaymentService(PaymentPort paymentPort) {
        this.paymentPort = paymentPort;
    }

    public void processUserPayment(double amount) {
        if (paymentPort.processPayment(amount)) {
            System.out.println("Thanh toán đã được xử lý thành công.");
        } else {
            System.out.println("Thanh toán thất bại.");
        }
    }
}
```

Cuối cùng, chúng ta lắp ráp các thành phần này trong giai đoạn khởi động hoặc cấu hình của ứng dụng:

```java
public class Application {
    public static void main(String[] args) {
        // Tạo một instance của dịch vụ thanh toán bên ngoài
        ExternalPaymentService externalPaymentService = new ExternalPaymentService();
        // Tạo một instance của adapter, truyền vào dịch vụ thanh toán bên ngoài
        PaymentAdapter paymentAdapter = new PaymentAdapter(externalPaymentService);
        // Tạo một instance của dịch vụ thanh toán, truyền vào adapter
        PaymentService paymentService = new PaymentService(paymentAdapter);

        // Xử lý thanh toán cho người dùng
        paymentService.processUserPayment(100.0);
    }
}
```

Trong ví dụ này, **PaymentAdapter** chịu trách nhiệm gọi interface thanh toán bên ngoài **ExternalPaymentService.makePayment**. **PaymentService** sử dụng interface **PaymentPort** để tương tác với thế giới bên ngoài, từ đó đạt được sự tách biệt giữa logic miền và dịch vụ bên ngoài. Nếu cần thay đổi nhà cung cấp dịch vụ thanh toán, chúng ta chỉ cần triển khai một **PaymentAdapter** mới mà không cần sửa đổi mã của **PaymentService**.