---
title: DDD
tags:
  - project
categories:
  - project
order: 2
---
# Kiến trúc: DDD Thiết kế hướng miền, Chiến lược, Chiến thuật, Chiến dịch, Hướng dẫn triển khai.

> Tích lũy, chia sẻ, phát triển, để bản thân và người khác đều nhận được lợi ích! 😄


👨🏻‍💻 Sau kỳ nghỉ 5.1 với nhiều công việc cường độ cao, cuối cùng tôi đã hoàn thành giai đoạn thứ hai của dự án [《Dự án Tiếp thị Lớn》](https://bugstack.cn/md/project/big-market/big-market.html) và đưa nó lên mạng. Địa chỉ trải nghiệm: [https://gaga.plus](https://gaga.plus). Với sự triển khai dự án này, cuối cùng tôi cũng có thể cung cấp cho mọi người một bộ hướng dẫn triển khai DDD hoàn chỉnh, bao gồm: chiến lược, chiến thuật, chiến dịch, những việc cần làm ở từng giai đoạn và cách thực hiện mô hình cơn bão và mô hình bốn màu. Với tài liệu này làm tham khảo, ngay cả người mới cũng có thể phát triển dự án DDD một cách rõ ràng!

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-01.png" width="550px">
</div>

**Tôi luôn nói rằng, cần thực hành trước, sau đó mới đến lý thuyết!**

Lập trình là một domain cần thực hành trước, sau đó mới hiểu lý thuyết. Bởi vì tất cả các lý thuyết đều được trừu tượng hóa từ kết quả thực hành. Nếu bạn bắt đầu bằng cách sử dụng lý thuyết để đẩy ngược kết quả, đó không phải là điều dễ dàng. Giống như nhiều bài viết về DDD thường dùng một lý thuyết để giảng giải một lý thuyết khác, điều này khiến nhiều người mới không thực hành không hiểu gì cả. Cuối cùng, họ cảm thấy DDD quá khó!

Tiếp theo, tôi sẽ dẫn bạn qua quá trình `đánh giá thiết kế phát triển`, giải thích toàn bộ quá trình triển khai dự án DDD.

## 1. Chiến lược, Chiến thuật, Chiến dịch

Trước hết, DDD là một phương pháp thiết kế phần mềm. [Domain-driven design (DDD) is a major software design approach.](https://en.wikipedia.org/wiki/Domain-driven_design) Theo Wikipedia. Phương pháp thiết kế phần mềm bao gồm: hệ hình, mô hình, khung công tác, phương pháp luận. Các hoạt động chính bao gồm mô hình hóa, kiểm thử, kỹ thuật, phát triển, triển khai, bảo trì. Thông tin này được lấy từ mục [thiết kế phần mềm](https://en.wikipedia.org/wiki/Software_design) của Wikipedia.

Trong thiết kế hướng miền DDD, thường đề cập đến `chiến lược (strategy)`, `chiến thuật (tactics)`, và một phần nhỏ sẽ nói về `chiến dịch (campaign)`. Ba từ này chủ yếu nói về những việc cần làm ở các giai đoạn phát triển khác nhau:

- Chiến lược - Mô hình hóa; phân chia miền, ranh giới ngữ cảnh, miền cốt lõi
- Chiến thuật - Kiến trúc; cấu trúc dự án, đối tượng miền, dịch vụ miền, sự kiện miền
- Chiến dịch - Mã hóa; nguyên tắc thiết kế, mẫu thiết kế

Thiết kế chiến lược, chiến thuật và chiến dịch của DDD bổ trợ lẫn nhau. Chiến lược cung cấp mô hình hệ thống như một hướng dẫn vĩ mô, chiến thuật bao gồm N chiến dịch, cả hai tập trung vào việc thực hiện cụ thể và triển khai mã.

Wikipedia có rất nhiều tài liệu tốt về DDD, trong đó có một tài liệu về cơn bão sự kiện, giải thích các bước thực hiện mô hình cơn bão trong thiết kế chiến lược.

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-03.png" width="650px">
</div>

> Với sự hiểu biết cơ bản này, chúng ta hãy tìm hiểu từng bước thiết kế hệ thống theo hướng miền từ yêu cầu đến thiết kế thông qua dự án "Big Market".

## 2. Yêu cầu Sản phẩm

### 1. Yêu cầu Sản phẩm

Như hình dưới, đây là yêu cầu cho một kịch bản trò chơi rút thăm trúng thưởng phức tạp trong tiếp thị, bao gồm; `Cấu hình hoạt động`, `Đăng nhập & Thưởng`, `Tài khoản hoạt động`, `Chiến lược rút thăm "chuỗi trách nhiệm + cây quy tắc"`, `Khấu trừ kho`, `Rút thăm bậc thang sau N lần rút thăm`, và v.v. Đối với hệ thống phức tạp như vậy, rất thích hợp sử dụng DDD để triển khai.

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-02.png" width="550px">
</div>

Phân tích yêu cầu:

1. Xác suất tổng hợp lại, tổng cộng là 1 hoặc tính bằng điểm số, phạm vi xác suất đến phần nghìn.
2. Rút thăm bao gồm số lần rút thăm miễn phí + người dùng tiêu điểm cá nhân để rút thăm.
3. Hoạt động rút thăm có thể phân bổ số lần rút thăm cho người dùng, thông qua việc nhấp vào đăng nhập để phát hành.
4. Cấu hình mở rộng hoạt động quản lý tiêu thụ kho của người dùng, cung cấp bảng cấu hình riêng biệt cho các loại kho khác nhau: kho tổng hợp của người dùng, kho hàng ngày của người dùng.
5. Một số quy tắc rút thăm yêu cầu rút thăm n lần mới mở khóa, sau đó mới có cơ hội rút thăm.
6. Sau khi hoàn thành rút thăm, tăng (giá trị may mắn / giá trị điểm / số lần rút thăm) ghi chép, để người dùng nhận được phần thưởng.
7. Phần thưởng kết nối, điểm số của chính hệ thống nội bộ, phần thưởng hệ thống.
8. Điểm số ngẫu nhiên, phát điểm cho bạn.
9. Người dùng trong danh sách đen rút thăm sẽ được nhận phần thưởng cố định.

### 2. Quy trình nghiệp vụ

Theo yêu cầu sản phẩm, trong tài liệu PRD của sản phẩm sẽ có sơ đồ quy trình nghiệp vụ. Sơ đồ quy trình của sản phẩm sẽ thô hơn, cần thiết kế cụ thể dựa trên tài liệu PRD của sản phẩm trong giai đoạn phát triển.

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-04.png" width="650px">
</div>

- Người quản lý sản phẩm sẽ giới thiệu chi tiết về quy trình chức năng của toàn bộ hệ thống và tài liệu API cần kết nối.
- Như trên là quy trình từ hành trình của người dùng, từ việc nhấp vào đăng nhập để nhận hạn mức tài khoản hoạt động, đến một loạt các bước rút thăm, chiến lược rút thăm, kết quả trúng thưởng và phân phát phần thưởng.

## 3. Kiến trúc Hệ thống

Nếu lần đầu tiên tiếp nhận một hệ thống mới, cần thiết kế kiến trúc hệ thống, là kiến trúc đơn thể hay kiến trúc phân tán, và các ngăn xếp kỹ thuật sẽ sử dụng. Tốt nhất là cung cấp các ví dụ triển khai liên quan và khung DDD. —— Không có những thứ này, chỉ nói lý thuyết và bảo đội ngũ dùng DDD để viết mã thì đúng là chuyện hoang đường! *Bạn còn chưa viết được mã DDD, làm sao mà anh em 👬🏻 sao chép được!*

### 1. Kiến trúc Phân tán

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-05.png" width="750px">
</div>

### 2. Công nghệ Phân tán

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-06.png" width="750px">
</div>

## 4. Thiết kế Chiến lược

Nhiều bạn đã nói rằng không biết bắt đầu DDD từ đâu, chủ yếu là khi nhận được một yêu cầu, không biết bắt đầu từ đâu và không biết làm thế nào để tạo ra các mô hình domain. Tốt, lần này mình sẽ cung cấp một ví dụ hoàn chỉnh, chỉ cho bạn cách bắt đầu.

### 1. Biểu đồ Use Case

Vẽ biểu đồ use case của hệ thống dựa trên yêu cầu nghiệp vụ;

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-07.png" width="650px">
</div>

- Biểu đồ use case là hình thức thể hiện đơn giản nhất của sự tương tác giữa người dùng và hệ thống, thể hiện mối quan hệ giữa người dùng và các use case liên quan. Thông qua biểu đồ use case, mọi người có thể biết được các loại người dùng khác nhau và use case của hệ thống. Biểu đồ use case cũng thường được sử dụng cùng với các biểu đồ khác.
- Biểu đồ use case có thể được coi là câu chuyện người dùng, một thuật ngữ thường dùng trong phát triển phần mềm và quản lý dự án. Nội dung chính là viết các câu đơn giản bằng ngôn ngữ hàng ngày hoặc ngôn ngữ nghiệp vụ để mô tả chức năng. Câu chuyện người dùng phản ánh nhu cầu và định hướng của khách hàng, thể hiện trách nhiệm công việc, phạm vi và nhiệm vụ cần thực hiện của đối tượng trong tổ chức. Câu chuyện người dùng được sử dụng trong phát triển agile để định nghĩa các chức năng hệ thống cần cung cấp và quản lý yêu cầu.
- Mặc dù use case có thể liên quan đến nhiều chi tiết và khả năng khác nhau, biểu đồ use case có thể giúp người hiểu được tổng quan hệ thống một cách dễ dàng. Nó cung cấp một hình ảnh đơn giản hóa về “hệ thống làm gì”, được gọi là "bản vẽ kiến trúc hệ thống".

### 2. Định nghĩa Event Storming

Trước khi sử dụng DDD để mô hình hóa hệ thống, mọi người cần hiểu các phương pháp vận hành của DDD để hiểu rõ hoạt động nghiệp vụ như sản phẩm, phát triển, kiểm thử và vận hành có thể cùng nhau mô hình hóa hệ thống bằng một ngôn ngữ chung.

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-08.png" width="950px">
</div>

- Màu xanh - Command, là hành động người dùng khởi tạo, ví dụ: bắt đầu đăng nhập, bắt đầu rút thăm, xem hạn mức.
- Màu vàng - Domain Event, mô tả ở thì quá khứ, ví dụ: hoàn thành đăng nhập, hoàn thành rút thăm, phát thưởng hoàn tất. Nó mô tả trạng thái cuối cùng cần đạt được trong domain này.
- Màu hồng - External System, như hệ thống của bạn cần gọi các API bên ngoài để hoàn thành quy trình.
- Màu đỏ - Business Policy, kết nối command với domain event, thực hiện quy trình nghiệp vụ. Một số kịch bản đơn giản chỉ cần command đến domain event.
- Màu xanh lá cây - Read Model, mô hình chỉ đọc, thực hiện các hành động đọc dữ liệu, không thực hiện thao tác ghi.
- Màu nâu - Domain Object, mỗi command đều có một domain object tương ứng.

**👩🏻‍🏫 Chú ý** Tổng kết, hình minh họa ở góc dưới bên trái là một người dùng, thông qua một command, sử dụng domain object, hoàn thành 2 domain event và gọi 1 lần giao diện bên ngoài. Trong quá trình mô hình hóa DDD, chúng ta tìm kiếm các điểm nút này.

### 3. Tìm kiếm domain event

Tiếp theo, chúng ta dành nhiều thời gian để khám phá các domain event. Đây là quá trình brainstorm của nhóm để tránh bỏ sót các điểm nút quy trình.

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-09.png" width="950px">
</div>

- Dựa trên tài liệu PRD của sản phẩm, họp để xác định các domain event. Hầu hết các domain event có thể nghĩ ra bởi một người, nhưng một số cảnh nhỏ và các sự kiện có thể phát sinh trong tương lai có thể không được bao quát hết. Vì vậy cần thảo luận với sản phẩm, kiểm thử và kiến trúc sư của nhóm.
- Như trong hình, quá trình rút thăm lớn bao gồm các sự kiện liệt kê. Trong giai đoạn liệt kê này, không quan trọng định dạng. Mọi người có thể chuẩn bị giấy ghi chú màu vàng, nghĩ đến sự kiện nào thì dán lên bảng đen, chỉ cần liệt kê hết. —— Thực tế trong DDD, cũng sử dụng giấy ghi chú dán lên bảng đen, nên sử dụng các màu khác nhau để phân biệt.

### 4. Xác định Vai trò và Domain Object

Sau khi xác định được các domain event, tiếp theo là kết nối các domain event bằng các command và điền vào các domain object cần thiết. Các bạn mới có thể xử lý riêng từng phần, như thêm command vào domain event, thực hiện người dùng và Domain Object, cuối cùng kết nối quy trình. Giống như minh họa trong phần `Định nghĩa Event Storming`.

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-10.png" width="950px">
</div>

- Đầu tiên, thông qua hành động của người dùng, tức là command, kết nối với domain event tương ứng. Đối với quy trình phức tạp, cung cấp quy trình nghiệp vụ màu đỏ.
- Sau đó, thêm domain object cho command, mỗi domain đóng vai trò quan trọng trong toàn bộ quy trình.

### 5. Phân chia Ranh giới domain

Sau khi nhận dạng các vai trò của domain trong quy trình, việc phân chia ranh giới domain trở nên dễ dàng. Đầu tiên, khoanh vùng ranh giới domain trên sơ đồ Event Storming, sau đó cung cấp phân chia domain riêng.

#### 5.1 Khoanh vùng domain

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-11.png" width="950px">
</div>

#### 5.2 Ranh giới domain

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-12.png" width="500px">
</div>

- Đến bước này, chúng ta đã có thể phân chia ranh giới domain DDD cho toàn bộ dự án. Tiếp theo là thiết kế chi tiết từng Domain Object và quy trình.

### 6. Thiết kế Chi tiết Phát triển

#### 6.1 Đối tượng Thực thể

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-13.png" width="550px">
</div>

- Bạn cần thiết kế chi tiết các trường của từng Domain Object. Và phân chia mối quan hệ ngữ cảnh của chúng. Thông thường trong công ty, phần thiết kế này hoàn thành, người khác có thể đối chiếu để phát triển mã.

#### 6.2 Thiết kế Quy trình

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-14.png" width="900px">
</div>

- Thiết kế quy trình chi tiết hơn. Mỗi bước gọi đến hệ thống nào, API nào, thực hiện hành động gì đều được mô tả chi tiết.

## Năm, Thực hiện Dự án

Sau khi hoàn thành thiết kế chiến lược DDD và phân chia ranh giới domain. Tiếp theo là thực hiện chiến thuật và chiến dịch, tức là thực hiện mã hóa trong dự án. Nhưng bạn phải hiểu nguyên tắc thiết kế và mô hình thiết kế, nếu không sẽ không viết được mã tốt.

<div align="center">
    <img src="https://bugstack.cn/images/article/project/big-market/roadmap-ddd-stc-15.png" width="500px">
</div>

- Thực hiện dự án là mã hóa trong cấu trúc khung xác định. Có thể là kiến trúc hành tây, kiến trúc sạch, kiến trúc kim cương, và v.v. Nội dung này có thể được rèn luyện thông qua các dự án thực chiến để đạt được kỹ năng mã hóa.