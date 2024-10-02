---
title: DDD Theory 06
tags:
  - design
  - ddd
categories:
  - design
order: 6
---
# Lý thuyết về DDD 06 - Event & Message Pub/Sub

**Trong Domain-Driven Design - DDD**, **Domain Event** là một mô hình đại diện cho các sự kiện có ý nghĩa xảy ra trong domain. Những sự kiện này quan trọng đối với doanh nghiệp và thường biểu thị sự thay đổi trong trạng thái của domain. Adapter trong ngữ cảnh này đóng vai trò kết nối các Domain Event với các phần khác của hệ thống hoặc các hệ thống bên ngoài.

## **Khái niệm**

Domain Event là một khái niệm quan trọng trong DDD, đại diện cho một sự kiện có ý nghĩa nghiệp vụ xảy ra trong domain. Những sự kiện này thường được kích hoạt bởi sự thay đổi trạng thái của các domain entity hoặc aggregate root (aggregate root). Domain Event không chỉ là sự thay đổi dữ liệu mà còn mang theo ngữ cảnh và ý định nghiệp vụ.

## **Đặc điểm**

1. **Ý nghĩa rõ ràng**: Domain Event thường có ý nghĩa nghiệp vụ rõ ràng, chẳng hạn như “Người dùng đã đặt hàng”, “Sản phẩm đã được thanh toán”, v.v.
2. **Tính bất biến**: Một khi Domain Event được tạo ra, trạng thái của nó không nên thay đổi. Điều này giúp đảm bảo tính nhất quán và độ tin cậy của sự kiện.
3. **Liên quan đến thời gian**: Domain Event thường bao gồm dấu thời gian khi sự kiện xảy ra, điều này giúp theo dõi thứ tự và dòng thời gian của các sự kiện.
4. **Tính liên kết**: Domain Event có thể liên quan đến các domain entity hoặc aggregate root cụ thể, điều này giúp hoàn thành ngữ cảnh của sự kiện.
5. **Khả năng quan sát**: Domain Event có thể được các phần khác của hệ thống lắng nghe và phản hồi, giúp thực hiện việc tách rời giữa các hệ thống.

## **Mục đích**

1. **Tách rời**: Domain Event có thể giúp tách rời các phần khác nhau của hệ thống nội bộ hoặc liên hệ giữa các hệ thống, vì chúng cung cấp một cơ chế giao tiếp dựa trên sự kiện.
2. **Kích hoạt business logic**: Domain Event có thể kích hoạt việc thực thi các business logic khác, chẳng hạn như đẩy thông báo (ví dụ: phiếu giảm giá đã đến), cập nhật các aggregate root khác hoặc tạo báo cáo dữ liệu luồng.
3. **Theo dõi sự kiện**: Domain Event có thể được sử dụng để thực hiện việc theo dõi sự kiện (Event Sourcing), đây là một phương pháp lưu trữ sự thay đổi trạng thái của hệ thống thông qua việc phát lại các sự kiện để khôi phục trạng thái hệ thống.
4. **Tích hợp**: Domain Event có thể được sử dụng để tích hợp hệ thống với các hệ thống bên ngoài, thông qua việc phát hành sự kiện để thông báo cho các hệ thống bên ngoài về các thay đổi xảy ra trong domain.

## **Triển khai**

### **Domain Layer**

-  **Định nghĩa event interface**: Tạo một hoặc nhiều interface để định nghĩa cấu trúc và hành vi của Domain Event.
- **Tạo lớp Domain Event**: Dựa trên interface đã định nghĩa, triển khai các lớp Domain Event cụ thể, bao gồm các thuộc tính và phương thức cần thiết.
- **Kích hoạt Domain Event**: Tại các vị trí thích hợp trong domain logic, khởi tạo và phát hành Domain Event.

### **Infrastructure Layer**

-  **Triển khai domain interface**: Sử dụng **hàng đợi tin nhắn (Message Queue)** (như RocketMQ hoặc RabbitMQ) để triển khai cơ chế **phát hành (Publish)** và **đăng ký (Subscribe)** Domain Event.

### **Publish/Interface Layer**

-  **Domain Event Message Listener**: Trong các phần khác của hệ thống hoặc trong các hệ thống bên ngoài, lắng nghe Domain Event và thực hiện business logic tương ứng hoặc logic tích hợp dựa trên sự kiện.

## **Ví dụ**

Dưới đây là một đoạn mã Java đơn giản minh họa cách định nghĩa Domain Event, phát hành sự kiện và cách sử dụng Adapter Pattern để truyền sự kiện đến hệ thống hoặc dịch vụ bên ngoài trong kiến trúc DDD.

Đầu tiên, chúng ta định nghĩa một Domain Event interface và một lớp Domain Event cụ thể:

```java
public interface DomainEvent {
    Date occurredOn();
}

public class OrderCreatedEvent implements DomainEvent {
    private final String orderId;
    private final Date occurredOn;

    public OrderCreatedEvent(String orderId) {
        this.orderId = orderId;
        this.occurredOn = new Date();
    }

    @Override
    public Date occurredOn() {
        return this.occurredOn;
    }

    public String getOrderId() {
        return orderId;
    }
}
```

Tiếp theo, chúng ta tạo một interface trình phát hành sự kiện và một triển khai dựa trên hàng đợi tin nhắn:

```java
public interface DomainEventPublisher {
    void publish(DomainEvent event);
}

public class MessageQueueEventPublisher implements DomainEventPublisher {
    // Giả lập một khách hàng hàng đợi tin nhắn
    private final MessageQueueClient messageQueueClient;

    public MessageQueueEventPublisher(MessageQueueClient messageQueueClient) {
        this.messageQueueClient = messageQueueClient;
    }

    @Override
    public void publish(DomainEvent event) {
        // Chuyển đổi Domain Event thành tin nhắn và gửi tới hàng đợi tin nhắn
        messageQueueClient.send(serialize(event));
    }

    private String serialize(DomainEvent event) {
        // Chuyển đổi sự kiện thành JSON hoặc định dạng khác
        // Ở đây đơn giản hóa bằng cách sử dụng toString()
        return event.toString();
    }
}

public class MessageQueueClient {
    public void send(String message) {
        // Logic gửi tin nhắn thực tế
        System.out.println("Message sent to queue: " + message);
    }
}
```

Bây giờ, chúng ta có thể kích hoạt Domain Event trong domain logic:

```java
public class OrderService {
    private final DomainEventPublisher eventPublisher;

    public OrderService(DomainEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    public void createOrder(String orderId) {
        // Logic tạo đơn hàng...

        // Tạo và phát hành sự kiện tạo đơn hàng
        OrderCreatedEvent event = new OrderCreatedEvent(orderId);
        eventPublisher.publish(event);
    }
}
```

Cuối cùng, chúng ta mô phỏng một adapter của hệ thống bên ngoài, nó sẽ lắng nghe các tin nhắn sự kiện trong hàng đợi:

```java
public class ExternalSystemAdapter {
    private final MessageQueueClient messageQueueClient;

    public ExternalSystemAdapter(MessageQueueClient messageQueueClient) {
        this.messageQueueClient = messageQueueClient;
        // Giả sử có một phương thức lắng nghe hàng đợi tin nhắn
        messageQueueClient.onMessage(this::onEventReceived);
    }

    private void onEventReceived(String message) {
        // Xử lý tin nhắn sự kiện nhận được
        System.out.println("External system received event: " + message);
        // Thực hiện logic tương ứng dựa trên loại sự kiện
    }
}
```

Cuối cùng, chúng ta có thể khởi tạo các thành phần này và thực thi business logic trong ứng dụng:

```java
public class Application {
    public static void main(String[] args) {
        MessageQueueClient messageQueueClient = new MessageQueueClient();
        DomainEventPublisher eventPublisher = new MessageQueueEventPublisher(messageQueueClient);
        OrderService orderService = new OrderService(eventPublisher);

        // Khởi tạo adapter của hệ thống bên ngoài
        ExternalSystemAdapter externalSystemAdapter = new ExternalSystemAdapter(messageQueueClient);

        // Thực thi business logic, tạo đơn hàng
        orderService.createOrder("ABC1000900111199");
    }
}
```

Trong ví dụ này, khi **OrderService** tạo một đơn hàng mới, nó sẽ phát hành một sự kiện **OrderCreatedEvent**. **MessageQueueEventPublisher** sẽ nhận sự kiện này và gửi nó đến hàng đợi tin nhắn. **ExternalSystemAdapter** sẽ lắng nghe hàng đợi tin nhắn và thực hiện logic tương ứng khi nhận được tin nhắn sự kiện.

Lưu ý rằng đây là một ví dụ đơn giản hóa nhằm mục đích minh họa. Trong thực tế, bạn cần xử lý các vấn đề phức tạp như kết nối hàng đợi tin nhắn, xử lý lỗi, và serialize/deserialize event.