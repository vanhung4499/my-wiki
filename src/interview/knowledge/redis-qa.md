---
title: Redis Interview
tags:
  - interview
  - redis
categories:
  - interview
order: 5
---
# Redis: 12 câu hỏi phỏng vấn phổ biến

Redis là một chủ đề không thể tránh khỏi trong các buổi phỏng vấn. Nếu bạn ghi rằng đã sử dụng Redis trong CV của mình, chắc chắn sẽ không thể thoát khỏi những câu hỏi về nó. Hôm nay, chúng ta sẽ mô phỏng cách một nhà tuyển dụng từng bước đánh giá kiến thức của ứng viên về Redis.

Ứng viên: Xin chào, tôi đến để phỏng vấn.

Nhà tuyển dụng: Chào Ứng viên. Tôi đã xem CV của bạn và thấy rằng bạn thành thạo Redis, vậy tôi sẽ hỏi bạn một vài câu hỏi liên quan đến Redis. Đầu tiên, Redis là đơn luồng hay đa luồng?

Ứng viên:

Redis sử dụng mô hình luồng khác nhau ở các phiên bản khác nhau. Trước phiên bản Redis 4.0, nó sử dụng mô hình đơn luồng, nhưng sau phiên bản 4.0, đã thêm hỗ trợ đa luồng.

Trước phiên bản 4.0, mặc dù nói rằng Redis là đơn luồng, nhưng chỉ có nghĩa là các thao tác I/O mạng và các lệnh Set và Get được thực hiện bởi một luồng duy nhất. Tuy nhiên, các chức năng như lưu trữ dữ liệu, đồng bộ hóa cụm vẫn sử dụng các luồng khác.

Sau phiên bản 4.0, thêm hỗ trợ đa luồng chủ yếu ở các chức năng xóa dữ liệu không đồng bộ, ví dụ như unlink key, flushdb async, flushall async, v.v.

Nhà tuyển dụng: Trả lời rất tốt. Vậy tại sao Redis lại chọn sử dụng đơn luồng trước phiên bản 4.0? Và tại sao đơn luồng lại nhanh như vậy?

Ứng viên:

Chọn đơn luồng chủ yếu vì nó đơn giản, không có sự cạnh tranh của các khóa, có thể hoàn thành mọi thao tác mà không cần khóa, không xảy ra tình trạng chết chốt và không tốn chi phí thời gian và hiệu năng do chuyển đổi luồng. Tuy nhiên, đơn luồng không thể tận dụng hết hiệu năng của CPU đa nhân.

Lý do tại sao đơn luồng lại nhanh, tôi nghĩ là do các nguyên nhân sau:

- Phần lớn các thao tác của Redis được thực hiện trong bộ nhớ, và hiệu suất thực thi trong bộ nhớ vốn đã nhanh, với các cấu trúc dữ liệu hiệu quả như bảng băm và bảng nhảy.
- Sử dụng đơn luồng tránh được sự cạnh tranh của đa luồng, tiết kiệm thời gian và hiệu năng do chuyển đổi luồng, và không xảy ra tình trạng chết chốt.
- Sử dụng cơ chế I/O đa đường để xử lý nhiều yêu cầu Socket của khách hàng, vì đây là mô hình I/O không chặn, giúp Redis có thể giao tiếp mạng hiệu quả, và quá trình đọc ghi I/O không bị chặn.

Nhà tuyển dụng: Tốt lắm, vậy Redis làm thế nào để đảm bảo dữ liệu không bị mất?

Ứng viên:

Dữ liệu Redis được lưu trữ trong bộ nhớ, để đảm bảo không bị mất, cần lưu dữ liệu từ bộ nhớ xuống đĩa, để có thể khôi phục lại dữ liệu gốc từ đĩa sau khi khởi động lại máy chủ. Đây là việc lưu trữ dữ liệu của Redis. Redis có ba cách lưu trữ dữ liệu.

**1) Nhật ký AOF (Append Only File, ghi nối thêm vào tệp)**: Ghi lại tất cả các lệnh thao tác và thêm vào tệp dưới dạng văn bản.

**2) Ảnh chụp RDB (Redis DataBase)**: Ghi dữ liệu bộ nhớ vào đĩa dưới dạng nhị phân tại một thời điểm cụ thể.

**3) Lưu trữ hỗn hợp**: Redis 4.0 bổ sung cách lưu trữ hỗn hợp, tích hợp ưu điểm của cả RDB và AOF.

Nhà tuyển dụng: Vậy hãy giải thích nguyên lý của AOF và RDB.

Ứng viên:

AOF sử dụng cách ghi nhật ký sau khi ghi dữ liệu. Redis thực hiện lệnh và ghi dữ liệu vào bộ nhớ trước, sau đó ghi nhật ký vào tệp. AOF ghi lại lệnh thao tác, không phải dữ liệu thực tế. Nếu sử dụng AOF để phục hồi lỗi, cần thực hiện lại toàn bộ nhật ký.

RDB sử dụng cách chụp ảnh bộ nhớ, ghi lại dữ liệu tại một thời điểm cụ thể thay vì lệnh thao tác. Do đó, khi phục hồi lỗi bằng RDB, chỉ cần đọc tệp RDB vào bộ nhớ, giúp phục hồi nhanh chóng.

Nhà tuyển dụng: Bạn vừa đề cập rằng AOF sử dụng cách "ghi nhật ký sau khi ghi dữ liệu", trong khi MySQL chúng ta thường dùng lại sử dụng "ghi nhật ký trước khi ghi dữ liệu". Vậy tại sao Redis lại thực hiện lệnh trước, sau đó mới ghi dữ liệu vào nhật ký?

Ứng viên: Điều này chủ yếu là do Redis không kiểm tra cú pháp lệnh trước khi ghi vào nhật ký, nên chỉ ghi lại các lệnh thực hiện thành công, tránh ghi lại các lệnh sai, và việc ghi nhật ký sau khi thực hiện lệnh không gây chặn các thao tác ghi hiện tại.

Nhà tuyển dụng: Vậy việc ghi nhật ký sau khi thực hiện lệnh có rủi ro gì không?

Ứng viên: Tôi... cái này tôi không biết.

Nhà tuyển dụng:

Được rồi, ghi nhật ký sau khi thực hiện lệnh có hai rủi ro chính:

- **Dữ liệu có thể bị mất**: Nếu Redis vừa thực hiện xong lệnh và gặp sự cố, sẽ có nguy cơ mất lệnh đó.
- **Có thể chặn các thao tác khác**: Nhật ký AOF cũng được thực hiện trong luồng chính, vì vậy khi Redis ghi tệp nhật ký vào đĩa, sẽ chặn các thao tác tiếp theo.

Tôi có một câu hỏi nữa, khi RDB chụp ảnh có chặn luồng không?

Ứng viên: Redis cung cấp hai lệnh để tạo tệp ảnh chụp RDB, là save và bgsave. Lệnh save thực hiện trong luồng chính, sẽ gây chặn. Lệnh bgsave sẽ tạo một tiến trình con để thực hiện việc ghi tệp RDB, tránh chặn luồng chính, đây là cấu hình mặc định của Redis RDB.

Nhà tuyển dụng: Khi tạo ảnh chụp nhanh RDB, dữ liệu có thể bị thay đổi không?

Ứng viên: Lệnh save là đồng bộ và sẽ chặn các lệnh của khách hàng, nhưng khi sử dụng lệnh bgsave, dữ liệu vẫn có thể bị thay đổi.

Nhà tuyển dụng: Vậy Redis giải quyết vấn đề cho phép dữ liệu thay đổi trong khi bgsave tạo ảnh chụp nhanh như thế nào?

Ứng viên: À, cái này tôi không rõ lắm...

Nhà tuyển dụng: 

Điều này chủ yếu được thực hiện thông qua luồng con của bgsave, cụ thể như sau:

- Nếu luồng chính thực hiện thao tác đọc, luồng chính và luồng con bgsave sẽ không ảnh hưởng lẫn nhau.
- Nếu luồng chính thực hiện thao tác ghi, dữ liệu bị thay đổi sẽ được sao chép một bản, sau đó luồng con bgsave sẽ ghi dữ liệu sao chép này vào tệp RDB, trong quá trình này, luồng chính vẫn có thể thay đổi dữ liệu gốc.

Cần lưu ý rằng tần suất thực hiện RDB của Redis rất quan trọng, vì điều này sẽ ảnh hưởng đến tính toàn vẹn của dữ liệu ảnh chụp nhanh cũng như độ ổn định của Redis. Do đó, sau phiên bản Redis 4.0, cơ chế lưu trữ dữ liệu hỗn hợp AOF và RDB đã được thêm vào: ghi dữ liệu vào tệp dưới dạng RDB, sau đó lưu các lệnh thao tác tiếp theo dưới dạng AOF, vừa đảm bảo tốc độ khởi động lại của Redis, vừa giảm thiểu rủi ro mất dữ liệu.

Ứng viên: Học được rồi, học được rồi.

Nhà tuyển dụng: Vậy bạn hãy nói về cách Redis đạt được tính khả dụng cao.

Ứng viên: Redis đạt được tính khả dụng cao chủ yếu bằng ba cách: sao chép master-slave, chế độ Sentinel và cụm Redis.

**1) Sao chép master-slave**

Đồng bộ dữ liệu từ một máy chủ Redis chính sang nhiều máy chủ Redis phụ, tức là mô hình một chính nhiều phụ, tương tự như nguyên lý sao chép master-slave của MySQL.

**2) Chế độ Sentinel**

Khi sử dụng dịch vụ master-slave của Redis, nếu máy chủ master-slave của Redis gặp sự cố, cần phải khôi phục thủ công. Để giải quyết vấn đề này, Redis đã thêm chế độ Sentinel (vì chế độ Sentinel có thể giám sát máy chủ master-slave và cung cấp chức năng khôi phục tự động).

**3) Cụm Redis (Redis Cluster)**

Redis Cluster là một chế độ hoạt động phân tán phi tập trung, được giới thiệu trong phiên bản Redis 3.0. Nó phân phối dữ liệu trên các máy chủ khác nhau để giảm sự phụ thuộc vào một nút chính duy nhất, từ đó cải thiện hiệu suất đọc và ghi của dịch vụ Redis.

Nhà tuyển dụng: Sử dụng chế độ Sentinel, dữ liệu có bản sao đảm bảo tính khả dụng và có Sentinel giám sát, nếu master gặp sự cố sẽ chọn slave làm master. Điều này đã đáp ứng nhu cầu sản xuất của chúng ta. Vậy tại sao cần sử dụng chế độ cụm?

Ứng viên: Chế độ Sentinel thực chất vẫn là chế độ master-slave, trong chế độ master-slave, chúng ta có thể mở rộng khả năng đọc bằng cách thêm các nút slave, nhưng không thể mở rộng khả năng ghi và lưu trữ. Khả năng lưu trữ chỉ có thể đạt đến giới hạn của nút master. Vì vậy, để mở rộng khả năng ghi và lưu trữ, chúng ta cần đưa vào chế độ cụm.

Nhà tuyển dụng: Có nhiều nút master trong cụm, vậy Redis Cluster xác định chọn nút nào để lưu trữ dữ liệu như thế nào?

Ứng viên: Điều này có lẽ sử dụng một thuật toán hash nào đó, nhưng tôi không rõ lắm...

Nhà tuyển dụng: Được rồi, buổi phỏng vấn hôm nay kết thúc tại đây. Bạn về chờ thông báo phỏng vấn của chúng tôi.

Ứng viên: Vâng, cảm ơn nhà tuyển dụng. Bạn có thể cho tôi biết cách Redis Cluster thực hiện lựa chọn nút không?

Nhà tuyển dụng: 

Redis Cluster sử dụng một thuật toán hash nhất quán để thực hiện lựa chọn nút. Redis Cluster chia thành 16384 Slot (vị trí). Mỗi cặp khóa-giá trị được ánh xạ vào một Slot theo khóa của nó, quy trình cụ thể như sau:

1) Theo khóa của cặp khóa-giá trị, tính một giá trị 16 bit theo thuật toán CRC16.
2) Dùng giá trị 16 bit này chia lấy dư với 16384, nhận được số dư từ 0 đến 16383, mỗi số dư đại diện cho một Slot tương ứng.

Mỗi nút Redis chịu trách nhiệm xử lý một phần các Slot. Giả sử có ba nút master ABC, mỗi nút xử lý các Slot như sau:

| Nút | Xử lý Slot |
| --- | --- |
| A | 0-5000 |
| B | 5001-10000 |
| C | 10001-16383 |

Như vậy, cụm Redis thực hiện lựa chọn nút.
