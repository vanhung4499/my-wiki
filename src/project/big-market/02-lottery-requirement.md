---
title: Lottery Requirement
tags:
  - project
categories:
  - project
order: 4
---
## **I. Yêu cầu của chương này**

Trong phần tài liệu yêu cầu của chương trước, chúng ta đã phân tích quy trình cần thực hiện trong toàn bộ kịch bản tiếp thị, sau đó, trong 17 chương trước, chúng ta đã thiết kế, phát triển và triển khai phần chức năng đầu tiên, cho phép người dùng trải nghiệm quay số trực tuyến.

Trong phòng marketing của công ty, thiết kế hệ thống quay số sẽ có nhiều nhu cầu sử dụng khác nhau, ví dụ như một số bên chỉ cần cung cấp chiến lược thuật toán, còn lại sẽ tự xử lý. Tương tự, cũng có những bên muốn cung cấp toàn bộ chức năng mà không có nhiều yêu cầu cá nhân hóa.

Vì vậy, đối với các nhu cầu khác nhau của từng kịch bản, hệ thống big market sẽ tách rời các quy trình này thành các chức năng riêng lẻ, cho phép các bên ngoài dễ dàng gọi tới các dịch vụ module khác nhau. Điều này cũng tăng cường khả năng tái sử dụng chức năng của mã, dần dần hình thành một nền tảng dịch vụ tiếp thị thống nhất.

Vậy để đáp ứng những nhu cầu nghiệp vụ này, tôi sẽ cùng mọi người dần dần thực hiện các chức năng của từng giai đoạn. Trước đây, chúng ta đã hoàn thành module chiến lược quay số, và trong giai đoạn 2 này, chúng ta sẽ thực hiện giai đoạn hoạt động quay số, sử dụng chiến lược thông qua các hoạt động, đồng thời cung cấp các chức năng quản lý thời hạn, trạng thái, và số lần sử dụng cá nhân.

Thiết kế này cũng nhằm mục đích thuận tiện cho việc mở rộng khả năng người dùng sử dụng điểm để đổi lấy quyền tham gia quay số. Những chức năng này sẽ dần dần được phát triển, và vai trò của bạn giống như một thành viên trong nhóm dự án, được giao nhiệm vụ thực hiện một module (microservice/domain) cụ thể.

Tùy theo quy mô công ty và lượng người dùng mà hệ thống sẽ được chia thành microservices hoặc các module trong một hệ thống. Các module này cũng có thể được thiết kế thành các hệ thống microservice riêng biệt nếu cần.

## **II. Yêu cầu sản phẩm**

Để kích thích hứng thú quay số của người dùng, rèn luyện tư duy người dùng, tăng cường thời gian hoạt động hàng ngày và tỷ lệ chuyển đổi, hệ thống sẽ thêm tính năng mỗi ngày khi vào, người dùng sẽ được tặng N lần quay số miễn phí. Sau khi sử dụng hết N lần miễn phí, người dùng sẽ được hướng dẫn sử dụng điểm để đổi lấy quyền quay số.

Nhưng để trước tiên rèn luyện tư duy quay số của người dùng và củng cố khái niệm miễn phí, trong phần thực hiện này, chúng ta chỉ cung cấp quay số miễn phí để tăng cường động lực chia sẻ của người dùng. 【Sau này, chúng ta có thể phát triển thêm tính năng chia sẻ và đổi điểm để quay số.】

![](https://article-images.zsxq.com/FmOmI_AFEWMGxG6hS2GgoqpMqkzV)

1. Trong yêu cầu này, khi người dùng nhấp vào để tham gia quay số, họ sẽ được tặng ngay số lượt quay số. Cách thể hiện này cũng có thể là nhận lượt quay số thông qua việc nhấp vào đăng nhập, điều này đã được thể hiện trong nhiều sản phẩm internet mà chúng ta đã từng sử dụng.
2. Tất nhiên, quá trình nhận hoạt động này không được người dùng cảm nhận trực tiếp. Trải nghiệm của người dùng chỉ là biết rằng họ đã nhấp vào quay số, và phần còn lại của quy trình sẽ do máy chủ xử lý.

## **III. Quy trình chức năng**

Cùng với sự phát triển từng bước của các giai đoạn trong dự án big market, biểu đồ quy trình chức năng của chúng ta sẽ ngày càng phong phú. Các bạn cũng có thể học hỏi cả về nghiệp vụ và kỹ thuật từ quá trình này từ 0 đến 1.

![](https://article-images.zsxq.com/FhHy9DEqTp-oTFMwGC7At4YMS8D_)

1. Hệ thống quay số trong dự án big market được thiết kế như thế nào? Thực tế, nó được trừu tượng hóa thành một mô hình mua hàng, trong đó chiến lược quay số là một sản phẩm cụ thể. Số lượng sản phẩm có bao nhiêu, người dùng tiêu thụ thế nào, chúng ta trừu tượng hóa thành một quy trình đặt hàng.
2. Trong quy trình này, người dùng đã đặt hàng một hoạt động quay số, hoạt động này sẽ ghi lại khi nào có thể đặt hàng, số lượng quay số sau khi đặt hàng, v.v. Nếu người dùng có các lượt quay số chưa tiêu thụ【chưa quay số】, thì trong lần quay số tiếp theo, lượt quay số chưa tiêu thụ này sẽ được sử dụng trước, tức là tham gia vào quay số.

## **IV. Thiết kế phát triển**

Việc phân tách quy trình nghiệp vụ tương ứng với các module dịch vụ của domain. So với cấu trúc MVC, nó giống như rượu trôi nổi, không phân biệt rõ quy trình nghiệp vụ mà sử dụng nhiều dịch vụ rời rạc để tổ chức quy trình nghiệp vụ. Đây cũng là nhược điểm của MVC, vì thời gian phát triển càng dài, các giao diện càng trở nên lộn xộn, cuối cùng chi phí bảo trì và phát triển sẽ rất cao.

Do đó, hiện tại kiến trúc DDD ngày càng trở nên phổ biến, nhiều công ty như Kuaishou, JD, Alibaba, Meituan, khi tạo ra các dự án mới, sẽ trực tiếp sử dụng kiến trúc DDD. 【Kiến trúc DDD hiện nay đã khác so với vài năm trước, trước đây nó chỉ là lý thuyết, nhưng sau nhiều lần thử nghiệm, nó ngày càng trở nên trưởng thành hơn.】

![](https://article-images.zsxq.com/FjJmxLBt62dwM37n_U7xPVE2uY24)

1. Domain là nơi chứa các chức năng domain được phân tách từ quy trình nghiệp vụ. Ví dụ như module chiến lược quay số lớn đã được thực hiện, sau này cần thêm một module hoạt động dưới module domain.
2. Module hoạt động cần cung cấp các chức năng tham gia hoạt động, lấy ra đơn hoạt động hiện tại của domain, từ đó lấy ID chiến lược quay số. Khi người dùng quay số, họ sẽ nhận được giá trị ID chiến lược này.【Bảng hoạt động sẽ được cấu hình với ID chiến lược, mỗi hoạt động tương ứng với một ID chiến lược.】

![](https://article-images.zsxq.com/Fvbd6MeDmHCpW5rJOJJUkhCyiuTh)

1. Loại sơ đồ UML này có thể được vẽ bằng [draw.io](http://draw.io). Khi vào công ty, bạn thường cần thiết kế sơ đồ này sau khi nhận được yêu cầu, để làm rõ quy trình nghiệp vụ thông qua việc vẽ sơ đồ.
2. Trên cơ sở chiến lược quay số đã được thực hiện trước đó, chúng ta sẽ mở rộng thêm domain hoạt động. domain hoạt động sẽ bao gồm các bảng hoạt động, bảng nhận của người dùng, bảng số lần nhận của người dùng. Sau khi quay số, còn cần ghi lại vào bảng lịch sử quay số của người dùng.

Các chương tiếp theo sẽ tiếp tục phân tích domain, thiết kế bảng dữ liệu, và tiến hành phát triển chức năng theo từng giai đoạn.
