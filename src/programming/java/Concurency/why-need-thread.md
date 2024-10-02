---
title: Why Need Thread
tags:
  - java
categories:
  - java
order: 5
---
# Sự khác biệt giữa Tiến trình và Luồng

Sau khi học các chương trước, chúng ta đã có hiểu biết khá đầy đủ về khái niệm và cách sử dụng của luồng. Tiếp theo, chúng ta sẽ phân tích cách mà luồng phát triển từ tiến trình, và sự khác biệt giữa chúng là gì. Hiểu rõ sự khác biệt này rất quan trọng cho việc học tiếp theo, thậm chí có những nhà tuyển dụng cũng thích hỏi câu này.

## Tiến trình

Ban đầu, máy tính chỉ có thể chấp nhận một số lệnh cụ thể. Người dùng nhập một lệnh, máy tính sẽ thực hiện một thao tác. Khi người dùng suy nghĩ hoặc nhập lệnh, máy tính sẽ chờ. Điều này rất kém hiệu quả, và trong nhiều trường hợp, máy tính luôn ở trạng thái chờ.

### Hệ điều hành xử lý theo lô (Batch Operating System)

Sau đó, xuất hiện **hệ điều hành xử lý theo lô**, cho phép người dùng viết hàng loạt các lệnh cần thực hiện, tạo thành một danh sách và đưa vào máy tính để thực thi lần lượt. Người dùng đưa nhiều chương trình cần thực thi lên băng từ, và máy tính sẽ đọc, thực hiện từng chương trình, và ghi kết quả lên một băng từ khác.

Hệ điều hành xử lý theo lô đã tăng hiệu suất của máy tính ở một mức độ nhất định, nhưng vì **phương thức thực thi của nó vẫn là tuần tự, chỉ có một chương trình chạy trong bộ nhớ**. Các chương trình sau phải chờ cho chương trình trước hoàn thành, trong khi chương trình trước có thể bị chặn bởi các hoạt động I/O hoặc mạng, khiến hiệu quả của hệ thống xử lý theo lô cũng không cao.

### Sự xuất hiện của tiến trình

Với nhu cầu ngày càng cao về hiệu năng của máy tính, hệ điều hành xử lý theo lô không thể đáp ứng. Vấn đề chủ yếu là bộ nhớ chỉ có thể chứa một chương trình, vậy có thể chứa nhiều chương trình không? Đây là câu hỏi mà các nhà khoa học phải giải quyết.

Vì vậy, khái niệm tiến trình đã được đề xuất.

Tiến trình là **không gian bộ nhớ được phân bổ cho chương trình ứng dụng, hay chính là chương trình đang chạy**. Các tiến trình hoạt động độc lập với nhau và lưu giữ trạng thái của chương trình ở mọi thời điểm.

> Chương trình: Là một tập hợp các mã lệnh được viết bằng ngôn ngữ lập trình (Java, Python, v.v.) để thực hiện một nhiệm vụ hoặc chức năng nhất định, là một đoạn mã tĩnh.

CPU sử dụng cơ chế chia sẻ thời gian để vận hành các tiến trình. CPU cấp cho mỗi tiến trình một khoảng thời gian gọi là "time slice". Khi "time slice" kết thúc mà tiến trình vẫn chưa hoàn thành, CPU sẽ tạm dừng tiến trình đó và chuyển sang tiến trình khác (quá trình này gọi là chuyển đổi ngữ cảnh). Nếu tiến trình bị chặn hoặc kết thúc trước khi time slice kết thúc, CPU sẽ chuyển ngay lập tức.

> Khi tiến trình bị tạm dừng, nó sẽ lưu lại trạng thái hiện tại (như ID tiến trình, tài nguyên tiến trình đang sử dụng). Khi chuyển lại, hệ thống sẽ phục hồi từ trạng thái đã lưu để tiếp tục thực thi.

Việc sử dụng tiến trình kết hợp với chia sẻ thời gian của CPU giúp hệ điều hành có thể xử lý nhiều tác vụ cùng lúc. Mặc dù từ góc độ vĩ mô, có nhiều tác vụ đang chạy đồng thời, nhưng trên thực tế, với **CPU đơn nhân**, tại một thời điểm chỉ có một tác vụ sử dụng tài nguyên CPU.

### Yêu cầu cao hơn đối với hệ điều hành

Sự xuất hiện của tiến trình đã cải thiện đáng kể hiệu suất của hệ điều hành, nhưng theo thời gian, người ta không còn hài lòng khi một tiến trình chỉ có thể thực hiện một tác vụ trong một thời điểm. Khi một tiến trình có nhiều tác vụ con, việc phải thực hiện từng tác vụ một rất không hiệu quả.

> Ví dụ, khi phần mềm diệt virus kiểm tra máy tính của người dùng, nếu một phần bị mắc kẹt, các phần kiểm tra sau đó cũng sẽ bị ảnh hưởng. Hoặc khi bạn quét virus, bạn không thể sử dụng tính năng dọn rác của phần mềm cho đến khi quét xong, điều này không thể đáp ứng yêu cầu của người dùng.

## Luồng

Vậy có thể cho các tác vụ con chạy đồng thời không? Vì thế, khái niệm luồng được đưa ra, **mỗi luồng sẽ thực hiện một tác vụ con, giúp một tiến trình có thể chứa nhiều luồng, mỗi luồng phụ trách một tác vụ riêng biệt.**

> - Khi sử dụng luồng, mọi thứ trở nên dễ dàng hơn. Khi người dùng sử dụng chức năng quét virus, ta chỉ cần để luồng quét virus thực hiện. Nếu người dùng sử dụng thêm tính năng dọn rác, ta có thể tạm dừng luồng quét virus, để luồng dọn rác chạy trước, sau đó quay lại luồng quét virus.
> - Lưu ý: Cách mà hệ điều hành phân bổ time slice cho mỗi luồng liên quan đến chiến lược điều phối luồng, các bạn có thể tìm hiểu thêm trong tài liệu về **hệ điều hành**.

Tóm lại, tiến trình và luồng đã nâng cao đáng kể hiệu suất của hệ điều hành. **Tiến trình làm cho hệ điều hành có khả năng xử lý đồng thời, và luồng làm cho tiến trình xử lý đồng thời bên trong.**

### Vậy tại sao cần sử dụng luồng thay vì tiến trình?

Mặc dù tiến trình có thể thực hiện đồng thời, nhưng việc sử dụng luồng có những lợi ích sau:

- Giao tiếp giữa các tiến trình phức tạp, trong khi giao tiếp giữa các luồng đơn giản hơn, nhất là khi sử dụng tài nguyên chia sẻ.
- Tiến trình nặng, trong khi luồng nhẹ hơn, giúp hệ thống tiết kiệm tài nguyên.

## Sự khác biệt giữa Tiến trình và Luồng

Tiến trình là một môi trường độc lập, còn luồng là một nhiệm vụ chạy bên trong tiến trình. Sự khác biệt cơ bản là **tiến trình chiếm riêng bộ nhớ và tài nguyên hệ thống, còn luồng chia sẻ tài nguyên với tiến trình**:

- Tiến trình có không gian bộ nhớ riêng, trong khi luồng chia sẻ không gian bộ nhớ của tiến trình. 
- Tiến trình có độ ổn định cao hơn, nếu một luồng gặp sự cố, có thể ảnh hưởng đến toàn bộ chương trình.
- Việc tạo và hủy tiến trình tốn nhiều tài nguyên hơn so với luồng.

Một sự khác biệt quan trọng khác là **tiến trình là đơn vị phân bổ tài nguyên của hệ điều hành, trong khi luồng là đơn vị điều phối của CPU**.

Cuối cùng, **tiến trình giúp hệ điều hành xử lý nhiều nhiệm vụ đồng thời, trong khi luồng giúp các nhiệm vụ bên trong tiến trình xử lý đồng thời**.