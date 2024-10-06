---
title: Go Frame Development Process
tags:
  - go-frame
categories:
  - go-frame
order: 2
---
# Quy trình làm việc với Go Frame

## Quy trình phát triển

Tôi đã sắp xếp lại quá trình phát triển phiên bản GoFrame V2 mới nhất:

1. Thiết kế cấu trúc bảng dữ liệu, khởi tạo dự án, sửa đổi file cấu hình
2. Sử dụng `gf gen dao` để tạo dao/do/model tương ứng với các bảng
3. Viết lớp api: xác định cấu trúc dữ liệu phía nghiệp vụ và cung cấp cấu trúc dữ liệu đầu vào/đầu ra của api bên ngoài
4. Viết lớp model: xác định cấu trúc dữ liệu ở phía dữ liệu và cung cấp cấu trúc dữ liệu đầu vào/đầu ra để xử lý dữ liệu nội bộ.
5. Viết lớp logic và tự động tạo mã lớp dịch vụ. (Nó có thể được tạo tự động bằng cách định cấu hình Goland File Watcher hoặc có thể được tạo thủ công thông qua dịch vụ `gf gen`. Nên sử dụng cái trước)
6. Sau khi mã lớp dịch vụ tạo ra phương thức `RegisterXX()`, hãy đăng ký dịch vụ trong module logic tương ứng (mỗi module chỉ cần viết một lần)
7. Viết lớp điều khiển, nhận/phân tích các tham số do người dùng nhập vào và gọi các dịch vụ của lớp dịch vụ.
8. Đăng ký các tuyến đường và hiển thị các giao diện với thế giới bên ngoài. Ví dụ: dự án này là viết tệp cmd.go.
9. Thêm một dòng vào main.go `_ "project-name/internal/logic"` (bạn chỉ cần viết một lần)
10. Thêm một dòng vào main.go `_ "github.com/gogf/gf/contrib/drivers/mysql/v2"` (nếu bạn đang sử dụng mysql; chỉ viết một lần)
