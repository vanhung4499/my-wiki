---
title: Rules
tags:
  - java
  - microservice
  - gateway
categories:
  - project
order: 2
---
# Tiêu chuẩn mã hoá cần thiết 

Nhiều người tự giễu mình là "lập trình viên", nhưng tôi không nghĩ vậy. Tôi tin rằng chúng ta nên được xem là kỹ sư, vì chúng ta không chỉ đang viết chương trình, mà còn đang xây dựng những tòa nhà chọc trời số.

Kiến trúc là nền móng, ứng dụng là cấu trúc bên trên, và để xây dựng một ngôi nhà tốt, điều quan trọng còn là "kỹ thuật xây tường". Đối với lập trình, tôi cho rằng, một quy tắc mã hóa tốt – "kỹ thuật xây tường" – chính là chìa khóa.

Khi chúng ta phát triển back-end), nếu không có quy tắc nhất định, mỗi người sẽ tạo ra phong cách riêng, dẫn đến giảm tính bảo trì và dễ đọc của mã, đặc biệt là trong quá trình phát triển phối hợp nhóm. Nếu không có một quy chuẩn thống nhất, sẽ làm giảm hiệu suất phát triển và chất lượng mã sẽ không cao.

Thông qua việc thiết lập tiêu chuẩn và quy tắc thống nhất, chúng ta có thể nâng cao hiệu suất hợp tác, với các giao diện và định nghĩa mô-đun rõ ràng, giúp sự hợp tác giữa các nhà phát triển phía trước (front-end) và phía sau (back-end) hay giữa các mô-đun khác nhau trở nên trơn tru và hiệu quả hơn.

Việc thiết lập và tuân thủ các quy tắc phía sau (back-end) là vô cùng quan trọng cho sự thành công của dự án. Nó không chỉ cải thiện **hiệu suất phát triển** và **chất lượng mã**, mà còn tăng cường khả năng bảo trì dự án và hợp tác nhóm. Bằng cách tuân thủ lâu dài các quy trình phát triển chuẩn hóa, chúng ta có thể nâng cao đáng kể chất lượng tổng thể của dự án, giảm chi phí phát triển và bảo trì, đảm bảo tính ổn định và bảo mật của dự án. Thực hành phát triển theo quy chuẩn là một phần không thể thiếu trong bất kỳ đội ngũ phát triển phần mềm thành công nào.

Chương này sẽ giúp mọi người học và tạo ra những quy tắc mã hóa tốt, **nâng cao kỹ năng tự cải thiện**.

---

# 1. Quy định cơ bản

1.1. Đường dẫn chứa mã nguồn (java/vue), công cụ phát triển, jdk, mysql, redis, [rabbitmq](https://so.csdn.net/so/search?q=rabbitmq&spm=1001.2101.3001.7020), nacos và các công cụ khác không được chứa ký tự tiếng Trung, dấu cách hay ký tự đặc biệt.

1.2. Tầm nhìn của hướng dẫn quy tắc này là "Viết code hiệu quả, viết code chất lượng".

1.3. Mọi thông tin môi trường cục bộ như `application-local.yml` không cần phải được nộp lên hệ thống.

---

# 2. Công cụ phát triển

2.1. IntelliJ IDEA (không giới hạn phiên bản)

2.2. Công cụ kết nối dữ liệu: Navicat.

2.3. Công cụ tài liệu API và kiểm thử API: Apifox. Mọi tài liệu API sau khi hệ thống lên sóng đều phải được xuất và lưu trữ.

2.4. Phiên bản JDK thống nhất: JDK8.

2.5. Quản lý phiên bản mã thống nhất sử dụng: Git.

2.6. Kho mã sử dụng GitHub.

---

# 3. Quy tắc Git

## 3.1. Quy tắc cam kết Git

| Chức năng    | Quy tắc commit           | Ví dụ                | Mô tả                              |
| ------------ | ------------------------ | -------------------- | ---------------------------------- |
| Chức năng mới| feat/module_name          | feat/multi_merchant   | Phát triển một chức năng mới       |
| Sửa lỗi      | bugfix/fix_name           | bugfix/user           | Sửa lỗi cho một chức năng cụ thể   |
| Sửa lỗi khẩn cấp| hotfix/fix_name        | hotfix/create_order   | Sửa lỗi nghiêm trọng khẩn cấp      |
| Tối ưu hiệu suất| perf/name              | perf/user_login       | Tối ưu hiệu suất cho một chức năng |
| Điều chỉnh định dạng| style/name         | style/log_print       | Điều chỉnh không ảnh hưởng đến nghiệp vụ |
| Tái cấu trúc | refactor/name             | refactor/user         | Tái cấu trúc một chức năng cụ thể  |
| Kiểm thử     | test/name                | test/user             | Liên quan đến kiểm thử, không thay đổi mã nghiệp vụ |
| Tài liệu và chú thích | docs/name         | docs/user             | Liên quan đến tài liệu và chú thích|
| Cập nhật phụ thuộc | chore/name           | chore/user            | Cập nhật phụ thuộc hoặc cấu hình dự án |

---

## 3.2. Quy tắc tạo nhánh Git

Đối với hệ thống đã phát hành, cần lấy nhánh từ nhánh `prod` hoặc `master`. Đối với hệ thống chưa phát hành, cần lấy nhánh từ nhánh `test` để cập nhật mã mới nhất. Giải thích các nhánh liên quan:

| Nhánh          | Có được bảo vệ không | Giải thích                                 |
| -------------- | -------------------- | ------------------------------------------ |
| test           | Có                   | Nhánh môi trường kiểm thử                  |
| pre            | Có                   | Nhánh môi trường tiền phát hành            |
| prod           | Có                   | Nhánh môi trường sản xuất                  |
| master         | Có                   | Nhánh lưu trữ, đồng bộ mã với nhánh `prod` |
| Các nhánh khác | Không                | Nhánh phát triển                           |

# 4. Thiết kế database

4.1. Cơ sở dữ liệu sử dụng bộ ký tự **utf8mb4** và bắt buộc phải dùng **InnoDB** làm công cụ lưu trữ. Tên cơ sở dữ liệu, tên bảng, tên trường đều phải sử dụng chữ thường hoặc số. Lưu ý không được bắt đầu bằng số, tên cơ sở dữ liệu nên khớp với tên dự án. Tên bảng nên đặt theo định dạng: `b_tên_nghiệp_vụ_mục_đích_bảng`, không sử dụng danh từ số nhiều (không nên dùng **orders**).

4.2. Tránh sử dụng từ viết tắt hoặc rút gọn trong tên bảng, chiều dài không quá 32 ký tự. Bảng và trường phải có chú thích rõ ràng.

4.3. Tên chỉ mục duy nhất phải theo định dạng **uk_field**; chỉ mục thông thường là **idx_field**. Số lượng chỉ mục trong bảng không được vượt quá 6. Chỉ tạo chỉ mục trên các trường có tính lựa chọn cao, không tạo chỉ mục trên các trường như **sex** hoặc **status**.

Phải chỉ định khóa chính cho mọi bảng, và chỉ có một khóa chính duy nhất, với tên **id**.

4.4. Mọi trường nên được thiết lập giá trị mặc định hợp lý dựa trên yêu cầu nghiệp vụ (mặc định là **0**), tránh các trường có giá trị **NULL**. Các kiểu số thập phân nên sử dụng **decimal**, không được dùng **float** hoặc **double**.

4.5. **varchar** là chuỗi có độ dài thay đổi, không phân bổ trước không gian lưu trữ. Độ dài không nên vượt quá 5000 ký tự. Nếu độ dài lớn hơn, nên dùng **text** hoặc tải nội dung lên OSS để tránh ảnh hưởng đến hiệu suất chỉ mục của các trường khác.

4.6. Các trường biểu thị khái niệm có/không nên đặt tên theo định dạng **is_xxx**, kiểu dữ liệu là **unsigned tinyint** (1 biểu thị có, 0 biểu thị không). Ví dụ: **is_open** cho biết có mở hay không.

4.7. Mọi bảng phải có ít nhất 3 trường: **bigint id**, **datetime created_time**, **bigint created_by**. Tùy vào nghiệp vụ có thể thêm hai trường khác: **datetime updated_time**, **bigint updated_by**.

4.8. Các trường thông dụng nên được đặt tên theo ý nghĩa nghiệp vụ, chẳng hạn: **status** (ẩn/hiển thị, có/không, có thể sử dụng/không thể sử dụng); **state** (kích hoạt/tắt); **remark** (ghi chú).

4.9. Trường dữ liệu có thể được dư thừa để tăng hiệu suất truy vấn, nhưng phải đảm bảo tính nhất quán dữ liệu. Các trường dư thừa phải tuân theo quy tắc nhất định.

---

# 5. Truy vấn SQL

5.1. Khi viết câu lệnh **SELECT**, bắt buộc chỉ rõ tên trường, tránh dùng `SELECT *` vì có thể dẫn đến việc tra cứu bảng hoặc làm chỉ mục không hoạt động.

5.2. Tránh sử dụng toán tử **!=** hoặc **<>** trong mệnh đề **WHERE**, vì sẽ khiến bộ máy cơ sở dữ liệu bỏ qua chỉ mục và quét toàn bộ bảng.

5.3. Hạn chế sử dụng điều kiện kiểm tra giá trị **NULL** trong mệnh đề **WHERE**, vì sẽ khiến bộ máy bỏ qua chỉ mục và quét toàn bộ bảng. Nên hạn chế dùng **OR**, vì sẽ khiến chỉ mục không hoạt động, thay vào đó hãy dùng **UNION ALL**.

5.4. Hạn chế sử dụng truy vấn mờ, đặc biệt là truy vấn mờ toàn bộ. Điều kiện **LIKE '%...%'** (truy vấn mờ toàn bộ) sẽ không thể sử dụng chỉ mục, dẫn đến việc quét toàn bộ bảng, hiệu suất rất thấp. Trong trường hợp quy mô dự án lớn, nên cân nhắc sử dụng **Elasticsearch (ES)**.

5.5. Nếu trong mệnh đề **WHERE** có nhiều trường, có thể tạo chỉ mục liên hợp (chỉ mục kết hợp) và tuân theo nguyên tắc "khớp trái". Tránh các truy vấn SQL lớn, thay vào đó nên chia thành nhiều truy vấn nhỏ để tận dụng CPU của máy chủ hợp lý.

5.6. Sử dụng từ khóa **EXPLAIN** để kiểm tra kế hoạch thực hiện truy vấn. **EXPLAIN** có thể kiểm tra việc sử dụng chỉ mục và số hàng được quét. Kết quả thực thi chỉ mục tối ưu nhất là **system** và **cost**.

5.7. Lựa chọn kiểu dữ liệu phù hợp cho từng cột, tránh chuyển đổi kiểu dữ liệu ngầm khi loại của trường cột và tham số đầu vào không giống nhau.

### 6. Phong cách đặt tên

**6.1.** Tên trong code không được bắt đầu hoặc kết thúc bằng dấu gạch dưới hoặc ký hiệu đô la.

**6.2.** Tên trong code nên được đặt theo tiếng Anh.

**6.3.** Tên lớp tuân theo quy tắc CamelCase: `UserManagerServiceImpl` (chữ cái đầu tiên của từ đầu tiên viết hoa).

**6.4.** Tên phương thức tuân theo quy tắc camelCase: `addUserInfo` (chữ cái đầu tiên của từ đầu tiên viết thường).

**6.5.** Tầng Service/Dao:
1. Lấy đối tượng đơn: dùng `get` làm tiền tố → `getUser`
2. Lấy nhiều đối tượng: dùng `list` làm hậu tố → `getUserList`
3. Lấy giá trị thống kê: dùng `count` làm hậu tố → `userCount`
4. Phương thức chèn: dùng `save/insert` làm tiền tố → `insertUser`
5. Phương thức xóa: dùng `remove/delete` làm tiền tố → `deleteUser`
6. Phương thức cập nhật: dùng `update` làm tiền tố → `updateUser`
7. Các phương thức CRUD dựa trên giá trị duy nhất: `getUserById` / `deleteUserById` / `updateUserById`

**6.6.** Tên hằng số toàn bộ viết hoa, cách nhau bằng dấu gạch dưới.

Hằng số có năm cấp độ tái sử dụng:
1. Hằng số chia sẻ giữa các dịch vụ: đặt trong module `lamp-common`, thư mục `constant` (ví dụ: sản phẩm, đơn hàng, thanh toán).
2. Hằng số chia sẻ trong dịch vụ ứng dụng: đặt trong module `lamp-xxx-entity`, thư mục `constant` (ví dụ: controller, biz).
3. Hằng số chia sẻ trong module con: trong thư mục `constant` của module hiện tại (ví dụ: chỉ dùng trong module biz).
4. Hằng số chia sẻ trong gói: đặt trong thư mục `constant` của gói hiện tại.
5. Hằng số trong lớp: khai báo trực tiếp trong lớp với `private static final`.

**6.7.** Tên lớp enum nên thêm hậu tố `Enum`, các thành viên của enum phải viết hoa và cách nhau bằng dấu gạch dưới. Các lớp công cụ phải có hậu tố `Utils`.

**6.8.** Lớp trừu tượng bắt đầu bằng `Abstract` hoặc `Base`, lớp ngoại lệ kết thúc bằng `Exception`, và lớp kiểm thử bắt đầu bằng tên lớp kiểm thử và kết thúc bằng `Test`.

**6.9.** Tránh các viết tắt không chuẩn, ví dụ: `Contribution` không nên viết tắt thành `Cont`. Để đảm bảo tính dễ đọc, sử dụng từ đầy đủ để diễn đạt ý nghĩa. Nếu dùng mẫu thiết kế trong lớp interface, nên biểu thị mẫu thiết kế đó trong tên lớp để cải thiện khả năng đọc.

**6.10.** Comment:
1. Trên tên lớp: thêm mô tả lớp, tác giả (`@author`), thời gian tạo (`@date`).
2. Trên phương thức: mô tả chức năng, mô tả tên trường.
3. Trong phương thức quan trọng: thêm chú thích dòng hoặc khối tại các vị trí thích hợp. Nếu dự án có cấu hình swagger, có thể thay thế chú thích doc trên các trường.

**6.11.** Copy đối tượng: nếu số lượng đối tượng nhỏ hơn 10.000, ưu tiên sử dụng PropertyUtils, BeanUtils, Dozer. Cố gắng sử dụng các tính năng mới của JDK 1.8, chẳng hạn như: Lambda, Stream, Optional.

URL yêu cầu cần thêm `api`, ví dụ: [https://www.kongque.com/api/pay/goPay](https://www.kongque.com/api/pay/goPay). Đối với H5, chỉ cung cấp các trường cần thiết.

**6.12.** Sử dụng các công cụ tốt như Hutool: JsonUtil, StrUtil, MapUtil, DateUtil, CollUtil, v.v.

# 7. Các quy chuẩn phát triển khác

7.1. Khi truyền tham số vào trong các API, trong Mybatis cấm sử dụng `${}` để nối chuỗi SQL nhằm ngăn chặn SQL injection. Trong các API quan trọng, cần kiểm tra tính hợp lệ của tham số yêu cầu theo nghiệp vụ. Mỗi phương thức Java không được phép có quá 100 dòng mã.

7.2. Các API quan trọng phải đảm bảo tính idempotent (không lặp lại) như việc gửi lại đơn hàng, xử lý nhiều lần callback không đồng bộ của thanh toán, v.v. Hạn chế vấn đề phụ thuộc lẫn nhau giữa các module.

7.3. Nếu một dòng mã quá dài, hãy phân tách nó. Nếu một phương thức quá dài, hãy tái cấu trúc phương thức đó. Nếu một lớp quá dài, hãy xem xét việc phân tách. Phương thức có nhiều hơn ba tham số nên đóng gói chúng thành đối tượng.

Xử lý ngoại lệ phương thức:
1. Gọi thanh toán thành công nhưng xử lý nghiệp vụ thất bại.
2. Cơ chế bù đắp.

Khi thiết kế phương thức, cần xem xét cho thiết kế tương lai (mô hình thiết kế), ví dụ như phương thức đăng nhập (đăng nhập bằng tài khoản và mật khẩu, đăng nhập tự động qua ủy quyền), phương thức thanh toán (Alipay, WeChat, ngân hàng công thương, Baofu Pay, v.v.).

Cần kiểm tra và xử lý giá trị `null` cho biến trước khi sử dụng. Những giá trị không thay đổi, nên định nghĩa chúng dưới dạng hằng số.

7.4. Nên sử dụng cấu trúc `if{}else`, tránh sử dụng nhiều câu `if` liên tiếp để kiểm tra điều kiện.

7.5. Hạn chế gọi phương thức truy vấn cơ sở dữ liệu trong vòng lặp, giảm thiểu việc chèn cơ sở dữ liệu trong vòng lặp, có thể sử dụng phương thức chèn hàng loạt.

7.6. Tầng DAO không nên chứa logic nghiệp vụ, nên viết logic trong tầng service. Số tiền nên sử dụng kiểu dữ liệu `BigDecimal`.

7.7. Tránh việc phát minh lại bánh xe, nếu đã có thư viện lớp thực hiện chức năng tương tự, hãy ưu tiên sử dụng phương thức của thư viện đã có. Bởi vì các phương thức của thư viện đã qua kiểm thử từ nhiều người dùng, rất đáng tin cậy.

7.8. Trong môi trường đa luồng, cần chú ý đến tính nguyên tử và khả năng hiển thị của dữ liệu để đảm bảo vấn đề an toàn luồng. Cần thiết lập mức độ log phù hợp để ghi log.

7.9. Quan tâm đến tần suất gọi phương thức, khi viết mỗi phương thức, cần chú ý đến tần suất gọi của nó. Một ngày bao nhiêu lần, một phút bao nhiêu lần, một giây bao nhiêu lần, và đỉnh điểm có thể đạt bao nhiêu? Với những phương thức có tần suất gọi cao, cần cân nhắc các chỉ số về hiệu năng, xem xét việc có gây quá tải cho cơ sở dữ liệu và bộ nhớ cache hay không, cũng như tái cấu trúc mã lặp lại.