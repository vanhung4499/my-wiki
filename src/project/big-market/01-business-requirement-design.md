---
title: Business Requirement Design
tags:
  - project
categories:
  - project
order: 3
---
# Phần 1: Thiết kế yêu cầu của các kịch bản tiếp thị

## **I. Nhu cầu của chương này**

Giới thiệu vai trò của nền tảng tiếp thị lớn, viết thiết kế tài liệu yêu cầu cho các hoạt động tiếp thị ứng dụng mô hình lớn của OpenAi. Lưu ý rằng, ứng dụng mô hình lớn của OpenAi là một phần nhỏ trong hệ thống, sau này chúng ta sẽ sử dụng dự án này làm nền tảng để mở rộng các hệ thống sản phẩm kinh doanh khác nhau. Tạo ra một dòng sản phẩm hoàn chỉnh.

Ứng dụng mô hình lớn của OpenAi là dịch vụ cơ bản được xây dựng để hỗ trợ các dự án khác, và nền tảng tiếp thị không chỉ có thể được sử dụng cho dự án này, mà còn cho nhiều dự án khác. Ví dụ như: cắt một dao trên Pinduoduo, chia sẻ nhóm để rút thăm trúng thưởng trên Double 11 của thương mại điện tử, nhận phiếu thưởng khi bạn bè giúp đỡ trong việc đi lại, v.v., đều là các sản phẩm trong kịch bản tiếp thị. Vì vậy, dự án này cũng kết hợp với những nhu cầu thực tế và dự án thực tế của công ty để giúp mọi người học tập.

## **II. Tổng quan sản phẩm**

**Tổng quan:** Phân tích các điểm chức năng mà người dùng cần trong kịch bản kinh doanh của OpenAi, bao gồm: các mô hình có thể sử dụng, vai trò, thanh toán, và đặt các chức năng cụ thể này làm điểm tiếp thị. Cuối cùng, người dùng có thể nhận điểm ngẫu nhiên, thẻ trải nghiệm, thẻ mô hình, số lần quy đổi, v.v. thông qua quay số trúng thưởng.

![](https://article-images.zsxq.com/Fr-YKqgqkSonIhsk8YU-VXEfsQDX)

Hình ảnh này thể hiện domain bao gồm: tài khoản, quay số, giải thưởng. Ba domain này có tính tái sử dụng rất cao, có thể phân chia thành 3 hệ thống microservices để phát triển theo kịch bản. Tuy nhiên, để mọi người dễ dàng học tập, chúng ta sẽ bắt đầu với các domain khác nhau trong một hệ thống, sau đó sẽ giải thích cách phân tách hệ thống microservices của nền tảng tiếp thị lớn.

## **III. Hình thái sản phẩm**

![](https://article-images.zsxq.com/Fqus3LIrFJ24W9qq7roecqxO7DAd)

Trong kịch bản sử dụng ứng dụng mô hình lớn của OpenAi, thêm module quay số (raffle) để tăng cường sự gắn bó và tương tác của người dùng.

1. Người dùng có thể nhận được điểm tương ứng khi tiêu dùng hoặc chat với model ai.
2. Sau đó, người dùng có thể sử dụng điểm này để tham gia quay số, nếu không có điểm, mỗi ngày vẫn có một lần quay số miễn phí, tăng cường sự sử dụng của người dùng.

## **IV. Quy trình yêu cầu**

![raffle-requirement-design.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/raffle-requirement-design.png)


Đây là thiết kế quy trình yêu cầu tương ứng với hình thái sản phẩm:

1. Tạo một tài khoản tiếp thị cho người dùng, lưu trữ dữ liệu điểm của người dùng. Điểm có thể được sử dụng để tiêu dùng trong quay số.
2. Dịch vụ hoàn trả điểm dựa trên dữ liệu hành vi của người dùng, như đối thoại, nạp tiền, v.v., để tăng cường các loại điểm.
3. Quay số có thể nhận được: điểm, thẻ trải nghiệm (mở tài khoản OpenAi), tăng số lượng mô hình và số lần trong tài khoản.

Vì vậy, nền tảng tiếp thị này có thể giúp kích hoạt nhiều hơn người dùng trong kịch bản kinh doanh hiện tại của OpenAi.