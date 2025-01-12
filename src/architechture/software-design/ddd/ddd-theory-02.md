---
title: DDD Theory 02
tags:
  - design
  - ddd
categories:
  - design
order: 2
---
# Lý thuyết về DDD 02 - Domain

DDD (Domain-Driven Design, Thiết kế Hướng Domain) là một phương pháp thiết kế phần mềm, được Eric Evans giới thiệu trong cuốn sách cùng tên của ông "Domain-Driven Design: Tackling Complexity in the Heart of Software". Tư tưởng cốt lõi của DDD là tập trung vào Business Domain và business logic trong thiết kế và phát triển các hệ thống phần mềm phức tạp, nhằm đảm bảo phần mềm có thể giải quyết chính xác các vấn đề nghiệp vụ.

### **Khái niệm về Domain**

Trong DDD, Domain là tập hợp kiến thức, business logic, dữ liệu và các quy tắc nghiệp vụ của một business domain cụ thể. Nó là môi trường nghiệp vụ mà phần mềm cần giải quyết, thường được cấu thành bởi một loạt các domain con, mỗi domain con đại diện cho một phần cụ thể trong nghiệp vụ.

### **Đặc điểm của Domain**

1. **Trung tâm nghiệp vụ**: Domain được xây dựng xung quanh các yêu cầu và quy tắc nghiệp vụ, là cốt lõi của thiết kế phần mềm.
2. **Mô hình hóa theo hướng mô hình**: domain model là sự trừu tượng hóa kiến thức nghiệp vụ, được biểu thị qua các khái niệm như domain entity, value object, service, aggregate, v.v.
3. **Ngôn ngữ thống nhất**: Việc xây dựng domain model dựa trên ngôn ngữ phổ biến (Ubiquitous Language), đây là ngôn ngữ mà cả nhóm phát triển và chuyên gia nghiệp vụ cùng sử dụng, đảm bảo sự giao tiếp không bị mơ hồ.
4. **Ranh giới rõ ràng**: domain model xác định các ranh giới rõ ràng, phân chia các Domain con và tổng hợp khác nhau, giúp quản lý sự phức tạp và bảo trì dễ dàng hơn.

### **Công dụng của Domain**

1. **Đóng gói business logic**: domain model đóng gói business logic, giúp quản lý các quy tắc nghiệp vụ và thao tác dữ liệu tập trung, dễ hiểu và bảo trì.
2. **Công cụ giao tiếp**: domain model là ngôn ngữ chung giữa nhóm phát triển và chuyên gia nghiệp vụ, giúp cải thiện hiệu quả giao tiếp và đảm bảo phần mềm phát triển theo sát yêu cầu nghiệp vụ.
3. **Cơ sở của thiết kế phần mềm**: Domain model là nền tảng của thiết kế phần mềm, định hướng cho kiến trúc và việc triển khai phần mềm.

### **Phương pháp triển khai**

1. **Entity**: Đối tượng Domain có định danh duy nhất, đại diện cho thực thể trong nghiệp vụ.
2. **Value Object**: Miêu tả các đặc điểm hoặc khái niệm trong Domain, không có định danh duy nhất, thường là bất biến.
3. **Aggregate**: Một tập hợp các entity và value object có liên quan, cùng nhau tạo thành một đơn vị dữ liệu và quy tắc nghiệp vụ.
4. **Domain Service**: Dịch vụ không trạng thái triển khai business logic cụ thể trong domain model, thường thao tác trên nhiều entity hoặc aggregate.
5. **Domain Event**: Biểu thị các sự kiện nghiệp vụ quan trọng xảy ra trong domain, dùng để tách rời các phần khác nhau của hệ thống.
6. **Repository**: Cung cấp các thao tác lưu trữ cho tổng hợp gốc, như lưu và truy xuất, thường tương tác với cơ sở dữ liệu.
7. **Domain Adapter**: Là ứng dụng của mẫu thiết kế adapter trong DDD, mục đích là để domain model có thể tương tác với các hệ thống hoặc chi tiết kỹ thuật bên ngoài mà không bị ảnh hưởng.
8. **Factory**: Dùng để tạo ra các aggregate hoặc entity phức tạp, đóng gói logic khởi tạo. Ví dụ, dự án OpenAi, dự án Lottery đều sử dụng nhà máy, bao gồm cả việc phát triển chatglm-sdk-java, là mô hình hội thoại sử dụng nhà máy để cung cấp dịch vụ bên ngoài.

Thông qua các phương pháp này, DDD giúp thiết kế phần mềm sát với nhu cầu nghiệp vụ hơn, nâng cao chất lượng và khả năng bảo trì của phần mềm. Nhóm phát triển có thể hiểu rõ hơn về business logic, từ đó thiết kế ra các hệ thống mạnh mẽ và linh hoạt hơn.