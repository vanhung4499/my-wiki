---
title: Persistence Data Class
tags:
  - project
categories:
  - project
order: 6
---
# Persistence Data Class

### **I. Mục Tiêu Của Chương Này**

Trong chương này, chúng ta sẽ thực hiện các bảng dữ liệu đã phân tích và thiết kế ở các phần trước vào trong dự án để kết nối với cơ sở dữ liệu. Ngoài ra, phần này cũng sẽ bao gồm các thao tác như pull branch, merge branch, và push branch lên repo. Trong quá trình học, bạn cũng sẽ tích lũy được những kỹ năng này.

### **II. Nội Dung Giải Thích**

Trong phần này, tôi sẽ hướng dẫn bạn thực hiện các thao tác cơ bản của phần phát triển ORM, đồng thời hướng dẫn bạn cách kéo nhánh, gộp nhánh và đẩy thay đổi lên.

![](https://article-images.zsxq.com/FoAUdxRgRkskO6q39s6V3eA8-EGF)

1.  Kéo nhánh là một thao tác rất quan trọng, đừng bao giờ làm việc trực tiếp trên nhánh `master` cho đến khi hoàn tất. Đặc biệt là nhiều người, khi viết code, một chức năng đã được kiểm tra và chạy đúng, nhưng sau khi phát triển các quy trình tiếp theo, mã không chạy được nữa. Và không biết lỗi xuất phát từ đâu.
2.  Việc viết các đối tượng lưu trữ và tệp mapper XML sẽ có một số mẹo sử dụng trên IDE. Hơn nữa, trong các công ty lớn, họ không khuyến khích phát triển thông qua mã tự động sinh ra, vì mã tự động thường chứa nhiều đoạn mã không cần thiết. Đôi khi, một số thao tác SQL quá chung chung cũng không tốt, dễ gây ra sự cố.

### **III. Thao Tác Với Nhánh**

#### **1. Pull Branch**

![](https://article-images.zsxq.com/FjjBkYlF2b32myK9BXEdp_8nbtmj)


Khi bạn học qua từng chương, bạn có thể tự tạo một nhánh tương ứng.

#### **2. Push Code**

![](https://article-images.zsxq.com/Fo_t7Wt9WX066luLKfcNjOgso4Bn)


Sử dụng phím tắt `Ctrl+K` hoặc `Ctrl + Shift + K` để đẩy/đẩy thay đổi mã lên. Lúc này bạn có thể đẩy nhánh của mình lên kho lưu trữ.

#### **3. Merge Branch**

![](https://article-images.zsxq.com/Fp4BXlXQVHFF4UiGikWRGBBnz3D-)

Khi bạn hoàn thành mã phát triển, bạn có thể nhấp chuột phải vào nhánh và gộp mã vào nhánh `master`. Sau đó, từ nhánh `master`, đẩy mã lên kho lưu trữ. Lưu ý rằng trước khi gộp nhánh vào `master`, bạn cần đẩy nhánh phát triển của mình lên kho lưu trữ trước.

### **IV. Phát Triển Mã**

![](https://article-images.zsxq.com/FtSG3DfQvGhiak2gspMzSbIAO2iX)

Video trong phần này sẽ hướng dẫn bạn cách viết một phần của tầng lưu trữ. Trong quá trình thao tác, bạn sẽ sử dụng một số phím tắt trên IDE, đồng thời học cách sử dụng chúng. Nếu bạn đã có kinh nghiệm, bạn có thể tự mình thao tác hoàn toàn.

### **V. Kiểm Tra và Xác Minh**

#### **1. Thông Tin Môi Trường**

1.  Đã cài đặt MySQL và đã nhập các bảng dữ liệu vào cơ sở dữ liệu. Kịch bản trong `docs/dev-ops/mysql/sql/raffle.sql` nếu bạn không sử dụng Docker thì có thể nhập trực tiếp.
2.  Đảm bảo rằng trong cấu hình của dự án `application-dev.yml`, bạn đã sửa đổi các tham số kết nối MySQL. Dự án mặc định sử dụng MySQL 8.0, nếu là phiên bản 5.x, hãy nhớ sửa đổi thông tin trong tệp pom theo hướng dẫn trong video.

#### **2. Kiểm Tra Chức Năng**

```java
@Slf4j

@RunWith(SpringRunner.class)

@SpringBootTest

public class AwardDaoTest {

  @Resource
  private IAwardDao awardDao;

  @Test
  public void test_queryAwardList() {
    List<Award> awards = awardDao.queryAwardList();
    log.info("Kết quả kiểm tra: {}", JSON.toJSONString(awards));
  }
}
```

**Kết quả kiểm tra:**

```
23-12-16.13:40:37.777 [main ] INFO AwardDaoTest - Kết quả kiểm tra: [{"awardConfig":"1,100","awardDesc":"Điểm người dùng [ưu tiên phạm vi quy tắc rõ ràng, nếu không thì sử dụng cấu hình]","awardId":101,"awardKey":"user_credit_random"},{"awardConfig":"5","awardDesc":"Tăng số lần sử dụng OpenAI","awardId":102,"awardKey":"openai_use_count"},{"awardConfig":"10","awardDesc":"Tăng số lần sử dụng OpenAI","awardId":103,"awardKey":"openai_use_count"},{"awardConfig":"20","awardDesc":"Tăng số lần sử dụng OpenAI","awardId":104,"awardKey":"openai_use_count"},{"awardConfig":"gpt-4","awardDesc":"Tăng mô hình OpenAI","awardId":105,"awardKey":"openai_model"},{"awardConfig":"dall-e-2","awardDesc":"Tăng mô hình OpenAI","awardId":106,"awardKey":"openai_model"},{"awardConfig":"dall-e-3","awardDesc":"Tăng mô hình OpenAI","awardId":107,"awardKey":"openai_model"},{"awardConfig":"100","awardDesc":"Tăng số lần sử dụng OpenAI","awardId":108,"awardKey":"openai_use_count"},{"awardConfig":"gpt-4,dall-e-2,dall-e-3","awardDesc":"Tăng mô hình OpenAI","awardId":109,"awardKey":"openai_model"}]
```

### **VI. Bài Tập Cho Độc Giả**

1.  **Bài Tập Đơn Giản:** Hoàn thành nội dung của phần này và thử viết và kiểm tra các câu lệnh hoặc bảng khác.
2.  **Bài Tập Khó:** Trong domain, gọi các thao tác cơ sở dữ liệu từ tầng cơ bản và viết các trường hợp kiểm tra tương ứng để hoàn thành kiểm tra.
