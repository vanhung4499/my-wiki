---
title: Lottery Strategy Rule Chain
tags:
  - project
categories:
  - project
order: 8
---
# Quy tắc lọc xổ sổ

## **I. Yêu cầu của chương này**

Trong thiết kế quy trình của chúng tôi, khi người dùng thực hiện quay thưởng, hệ thống sẽ kiểm tra xem họ có vượt quá N điểm hay không. Nếu vượt quá N điểm, người dùng có thể quay thưởng trong phạm vi giới hạn. Đồng thời, nếu người dùng là thành viên của nhóm "săn thưởng" nằm trong danh sách đen, hệ thống sẽ chỉ trả về ID giải thưởng cố định.

Trong phần hiện thực của chương này, sẽ liên quan đến mô hình quy tắc được định nghĩa bởi nhà máy và chiến lược, đồng thời đáp ứng nhu cầu mở rộng quy tắc trong tương lai. Thêm vào đó, chúng tôi sẽ định nghĩa quy trình cơ bản của việc quay thưởng bằng cách sử dụng mẫu template.

## **II. Thiết kế quy trình**

Trong việc hiện thực quy trình, chúng tôi cần phân tách chức năng của quy tắc và quay thưởng thành hai phần để đảm bảo sự mở rộng và bổ sung chức năng trong tương lai mà không ảnh hưởng đến toàn bộ quy trình.

![](https://article-images.zsxq.com/FjnUs31XtazuiWSDMxdhKNtfTAyZ)


1. Về cơ bản, quy trình được chia thành ba giai đoạn: trước khi quay thưởng, trong quá trình quay thưởng, và sau khi quay thưởng. Trong chương này, chúng ta sẽ xử lý các quy tắc trước khi quay thưởng.
2. Về phân chia dự án, chúng ta cần thêm "rule" để xử lý các quy tắc quay thưởng, và thêm "raffle" để xử lý quá trình quay thưởng.
