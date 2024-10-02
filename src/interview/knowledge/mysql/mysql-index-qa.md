---
title: MySQL Index Q&A
tags:
  - any
categories:
  - any
order: 4
---
# 15 câu hỏi về MySQL Index 
## 1. Chỉ mục là gì?

![](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/nice-article/weixin-mysqlsylwkz-60177b59-879d-4ee9-9425-e13e79a1eac2.jpg)

*   Chỉ mục là một cấu trúc dữ liệu giúp tăng hiệu suất truy vấn cơ sở dữ liệu. Nó có thể so sánh như mục lục của một cuốn từ điển, giúp bạn nhanh chóng tìm thấy các bản ghi tương ứng.
*   Chỉ mục thường được lưu trữ trong các tệp trên đĩa, chiếm không gian vật lý.
*   Tuy nhiên, việc sử dụng quá nhiều chỉ mục có thể ảnh hưởng đến chức năng chèn và cập nhật của bảng cơ sở dữ liệu.

## 2. Các loại chỉ mục trong MySQL

**Dựa trên cấu trúc dữ liệu**

*   Chỉ mục B+ tree: Tất cả dữ liệu được lưu trữ ở các nút lá, độ phức tạp là `O(logn)`, phù hợp cho các truy vấn phạm vi.
*   Chỉ mục Hash: Phù hợp cho truy vấn giá trị bằng nhau, hiệu suất truy vấn cao, thực hiện ngay lập tức.
*   Chỉ mục toàn văn: Hỗ trợ trong `MyISAM` và `InnoDB`, thường được tạo trên các kiểu văn bản như `char, text, varchar`.
*   Chỉ mục `R-Tree`: Dùng để tạo chỉ mục `SPATIAL` cho dữ liệu `GIS`.

**Dựa trên lưu trữ vật lý**

*   Chỉ mục cụm: Chỉ mục cụm là chỉ mục tạo dựa trên khóa chính, lưu trữ dữ liệu của bảng ở các nút lá (`Innodb`).
*   Chỉ mục không cụm: Chỉ mục không cụm là chỉ mục tạo dựa trên các khóa không phải khóa chính, lưu trữ khóa chính và cột chỉ mục ở các nút lá (`Innodb`).

**Dựa trên logic**

*   Chỉ mục khóa chính: Một loại chỉ mục duy nhất đặc biệt, không cho phép giá trị null.
*   Chỉ mục thông thường: Chỉ mục cơ bản trong `MySQL`, cho phép giá trị null và trùng lặp.
*   Chỉ mục liên kết: Chỉ mục tạo từ nhiều trường, sử dụng nguyên tắc tiền tố trái nhất.
*   Chỉ mục duy nhất: Giá trị trong cột chỉ mục phải là duy nhất, nhưng cho phép giá trị null.
*   Chỉ mục không gian: Hỗ trợ chỉ mục không gian từ `MySQL 5.7`, tuân theo quy tắc mô hình dữ liệu hình học `OpenGIS`.

## 3. Khi nào chỉ mục sẽ bị vô hiệu?

*   Điều kiện truy vấn chứa `or` có thể làm chỉ mục bị vô hiệu.
*   Nếu kiểu dữ liệu của trường là chuỗi, phải dùng dấu ngoặc kép khi `where`, nếu không chỉ mục bị vô hiệu.
*   Ký tự đại diện `like` có thể làm chỉ mục bị vô hiệu.
*   Chỉ mục liên kết, nếu điều kiện truy vấn không phải là cột đầu tiên của chỉ mục liên kết, chỉ mục bị vô hiệu.
*   Sử dụng hàm nội bộ của MySQL trên cột chỉ mục làm chỉ mục bị vô hiệu.
*   Thực hiện toán tử trên cột chỉ mục (như `+`, `-`, `*`, `/`) làm chỉ mục bị vô hiệu.
*   Sử dụng `!=` hoặc `< >`, `not in` trên trường chỉ mục có thể làm chỉ mục bị vô hiệu.
*   Sử dụng `is null`, `is not null` trên trường chỉ mục có thể làm chỉ mục bị vô hiệu.
*   Truy vấn kết nối trái hoặc phải có định dạng mã khác nhau trên trường liên kết có thể làm chỉ mục bị vô hiệu.
*   MySQL ước tính sử dụng quét toàn bộ bảng nhanh hơn so với sử dụng chỉ mục, sẽ không sử dụng chỉ mục.

## 4. Những trường hợp nào không nên tạo chỉ mục?

*   Bảng có ít dữ liệu, không nên thêm chỉ mục.
*   Cập nhật thường xuyên cũng không nên thêm chỉ mục.
*   Các trường có tính phân biệt thấp không nên thêm chỉ mục (như giới tính).
*   Các trường không được sử dụng trong `where`, `group by`, `order by` không cần tạo chỉ mục.
*   Trường hợp đã có chỉ mục dư thừa (ví dụ đã có chỉ mục liên kết `a, b` thì không cần tạo chỉ mục riêng cho `a`).

## 5. Tại sao sử dụng cây B+, tại sao không dùng cây nhị phân?

> Bạn có thể xem xét vấn đề này từ nhiều khía cạnh: truy vấn có nhanh không, hiệu quả có ổn định không, lưu trữ dữ liệu bao nhiêu, và số lần truy vấn trên đĩa. Tại sao không phải là cây nhị phân, tại sao không phải là cây nhị phân cân bằng, tại sao không phải là cây B, mà lại là cây B+?

**Tại sao không phải là cây nhị phân thông thường?**

Nếu cây nhị phân trở thành một danh sách liên kết, tương đương với quét toàn bộ bảng. Cây nhị phân cân bằng so với cây nhị phân tìm kiếm có hiệu quả truy vấn ổn định hơn và tốc độ truy vấn tổng thể cũng nhanh hơn.

**Tại sao không phải là cây nhị phân cân bằng?**

Chúng ta biết rằng truy vấn dữ liệu trong bộ nhớ nhanh hơn nhiều so với trên đĩa. Nếu cây dữ liệu được sử dụng làm chỉ mục, thì mỗi lần truy vấn dữ liệu cần đọc một nút từ đĩa, tương đương với một khối đĩa. Nhưng cây nhị phân cân bằng chỉ lưu trữ một giá trị khóa và dữ liệu trên mỗi nút, nếu là cây B, có thể lưu trữ nhiều dữ liệu nút hơn, độ cao của cây cũng giảm, do đó số lần truy vấn trên đĩa sẽ giảm, hiệu quả truy vấn sẽ nhanh hơn.

**Tại sao không phải là cây B mà lại là cây B+?**

*   Cây B+ không lưu trữ dữ liệu trên các nút không phải lá, chỉ lưu trữ khóa, trong khi cây B lưu trữ cả khóa và dữ liệu. Trong `innodb`, kích thước mặc định của trang là 16KB, nếu không lưu trữ dữ liệu thì sẽ lưu trữ nhiều khóa hơn, tương ứng với bậc của cây (số con của nút) sẽ lớn hơn, cây sẽ ngắn và mập hơn, do đó số lần truy vấn trên đĩa sẽ giảm, hiệu quả truy vấn sẽ nhanh hơn.
*   Tất cả dữ liệu của cây B+ được lưu trữ trên các nút lá và dữ liệu được sắp xếp theo thứ tự, nối với nhau. Do đó, cây B+ làm cho các truy vấn phạm vi, truy vấn sắp xếp, truy vấn nhóm và truy vấn loại bỏ trùng lặp trở nên đơn giản hơn rất nhiều.

## 6. Quá trình tìm kiếm một cây chỉ mục B+ một lần

> Giả sử có cấu trúc bảng sau và đã khởi tạo một số dữ liệu như sau:

```sql
CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `sex` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_age` (`age`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into employee values(100,'Xiao Lun',43,'2021-01-20','0');
insert into employee values(200,'Jun Jie',48,'2021-01-21','0');
insert into employee values(300,'Zi Qi',36,'2020-01-21','1');
insert into employee values(400,'Li Hong',32,'2020-01-21','0');
insert into employee values(500,'Yi Xun',37,'2020-01-21','1');
insert into employee values(600,'Xiao Jun',49,'2021-01-21','0');
insert into employee values(700,'Xiao Yan',28,'2021-01-21','1');
```

Thực hiện câu truy vấn SQL này, cần bao nhiêu lần tìm kiếm cây? Bạn có thể vẽ sơ đồ cấu trúc cây chỉ mục tương ứng không?

```sql
select * from employee where age=32;
```

Thực ra, bạn có thể vẽ sơ đồ cấu trúc chỉ mục của `idx_age` như sau:

![](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/nice-article/weixin-mysqlsylwkz-baca02c4-1ed6-421f-9ad4-e3e63dd58efa.jpg)

Sau đó vẽ sơ đồ cấu trúc chỉ mục chính của `id`, như sau:

![](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/nice-article/weixin-mysqlsylwkz-8bf752f5-772b-4308-b51c-d06406428866.jpg)

Quá trình thực hiện câu lệnh SQL truy vấn này như sau:

* Tìm kiếm trong cây chỉ mục `idx_age`, tải `khối đĩa 1` vào bộ nhớ, do `32 < 43`, tìm kiếm nhánh bên trái và tìm `khối đĩa 2`.
* Tải `khối đĩa 2` vào bộ nhớ, do `32 < 36`, tìm kiếm nhánh bên trái và tìm `khối đĩa 4`.
* Tải `khối đĩa 4` vào bộ nhớ, tiếp tục tìm kiếm trong bộ nhớ và tìm thấy bản ghi `age = 32`, lấy `id = 400`.
* Lấy `id = 400`, quay lại cây chỉ mục chính của `id`.
* Tìm kiếm trong cây chỉ mục chính của `id`, tải `khối đĩa 1` vào bộ nhớ, do `300 < 400 < 500`, chọn nhánh giữa và tìm `khối đĩa 3`.
* Mặc dù tìm thấy `id = 400` trong `khối đĩa 3`, nhưng nó không phải là nút lá, tiếp tục tìm và tìm `khối đĩa 8`.
* Tải `khối đĩa 8` vào bộ nhớ, tìm trong bộ nhớ và tìm thấy bản ghi `id = 400`, lấy dữ liệu dòng `R4`, hoàn thành.

## 7. Quay về bảng là gì? Làm thế nào để giảm quay về bảng?

Khi dữ liệu tìm kiếm không có trong cây chỉ mục, cần quay lại cây chỉ mục chính để lấy, quá trình này được gọi là **quay về bảng**.

Ví dụ trong phần **6**, sử dụng câu truy vấn SQL:

```sql
select * from employee where age=32;
```

Cần truy vấn tất cả các cột dữ liệu, chỉ mục `idx_age` không đáp ứng, cần lấy giá trị `id` chính rồi quay lại cây chỉ mục chính để tìm, quá trình này gọi là quay về bảng.

## 8. Chỉ mục bao phủ là gì?

Nếu câu truy vấn SQL của bạn từ `select *` thành `select id, age`, thực ra là **không cần quay về bảng**. Vì giá trị `id` và `age` đều nằm trong nút lá của cây chỉ mục `idx_age`, điều này liên quan đến kiến thức về chỉ mục bao phủ.

> Chỉ mục bao phủ là khi các cột dữ liệu truy vấn `select` có thể lấy từ chỉ mục mà không cần quay về bảng, nói cách khác, các cột truy vấn phải được chỉ mục bao phủ.

## 9. Nguyên tắc tiền tố trái nhất của chỉ mục là gì?

Nguyên tắc tiền tố trái nhất của chỉ mục có thể là **N cột trái nhất của chỉ mục liên kết**. Ví dụ, bạn tạo một chỉ mục liên kết `(a,b,c)`, thực ra có thể coi là tạo ba chỉ mục `(a)`, `(a,b)`, `(a,b,c)`, tăng khả năng tái sử dụng chỉ mục.

Tất nhiên, tiền tố trái nhất cũng có thể là **M ký tự trái nhất của chỉ mục chuỗi**. Ví dụ, chỉ mục chuỗi của bạn như sau:

![](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/nice-article/weixin-mysqlsylwkz-65c3f954-df70-439b-b0e1-1009007d6560.jpg)

Câu lệnh SQL này: `select * from employee where name like 'Xiao%' order by age desc;` cũng sử dụng được chỉ mục.

![](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/nice-article/weixin-mysqlsylwkz-3c751d80-02df-43cf-acc7-aafdb409811b.jpg)

## 10. Bạn đã hiểu về đẩy xuống chỉ mục chưa? Đẩy xuống chỉ mục là gì?

Cho bạn câu lệnh SQL này:

```sql
select * from employee where name like 'Xiao%' and age=28 and sex='0';
```

Trong đó, `name` và `age` là chỉ mục liên kết (`idx_name_age`).

Nếu là **trước MySQL 5.6**, trong cây chỉ mục `idx_name_age`, tìm tất cả những người có tên bắt đầu bằng `“Xiao”`, lấy `id` chính của họ, sau đó quay về bảng để tìm dữ liệu dòng và so sánh các cột khác như tuổi và giới tính. Như hình:

![](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/nice-article/weixin-mysqlsylwkz-b5ccdd0e-f299-49ac-9176-8e2c475f606f.jpg)

Một số bạn có thể thắc mắc, tại sao sau khi tìm thấy những người có tên chứa `“Xiao”` không xem luôn tuổi `age` rồi quay về bảng, không phải sẽ hiệu quả hơn sao? Vì vậy, `MySQL 5.6` đã giới thiệu **tối ưu hóa đẩy xuống chỉ mục**, có thể kiểm tra trước các cột trong chỉ mục trong quá trình duyệt chỉ mục, lọc trực tiếp các bản ghi không thỏa mãn điều kiện, giảm số lần quay về bảng.

Vì vậy, từ phiên bản MySQL 5.6 trở đi, sau khi tìm thấy những người có tên chứa `“Xiao”`, tiếp tục lọc `age=28`.

![](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/nice-article/weixin-mysqlsylwkz-4b37d45c-b5a2-4ff7-8125-ccd1e89eed42.jpg)

## 11. Làm thế nào để thêm chỉ mục vào bảng lớn

Nếu một bảng có dữ liệu ở mức hàng chục triệu bản ghi trở lên, thì làm thế nào để thêm chỉ mục vào bảng này?

Chúng ta cần biết rằng **khi thêm chỉ mục vào bảng**, **bảng sẽ bị khóa**. Nếu không cẩn thận, có thể gây ra sự cố sản xuất. Có thể tham khảo các phương pháp sau:

1. Tạo một bảng mới `B` có cấu trúc dữ liệu giống bảng gốc `A`.
2. Thêm chỉ mục cần thiết vào bảng mới `B`.
3. Chuyển dữ liệu từ bảng gốc `A` sang bảng mới `B`.
4. `rename` bảng mới `B` thành tên của bảng gốc `A`, và đổi tên bảng gốc `A` sang tên khác.

## 12. Làm thế nào để biết câu lệnh có sử dụng chỉ mục hay không?

Sử dụng `explain` để kiểm tra chiến lược thực thi của SQL, **vậy là bạn sẽ biết có trúng chỉ mục hay không**.

Khi `explain` được sử dụng cùng với `SQL`, MySQL sẽ hiển thị thông tin về chiến lược thực thi câu lệnh từ trình tối ưu hóa.

![](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/nice-article/weixin-mysqlsylwkz-1a294975-c9dd-4077-95fc-2a972911a3ab.jpg)

Nói chung, chúng ta cần chú ý đặc biệt đến `type, rows, filtered, extra, key`.

### 1.2.1 type

`type` biểu thị **loại kết nối**, là một chỉ số quan trọng để xem tình trạng thực hiện chỉ mục. Các loại kết nối từ tốt đến kém là: `system > const > eq_ref > ref > ref_or_null > index_merge > unique_subquery > index_subquery > range > index > ALL`

- system: Loại này yêu cầu trong bảng cơ sở dữ liệu chỉ có một bản ghi, là một trường hợp đặc biệt của `const`, thường thì không xuất hiện.
- const: Có thể tìm thấy dữ liệu thông qua một lần chỉ mục, thường được dùng cho khóa chính hoặc chỉ mục duy nhất, hiệu suất rất cao, tốc độ rất nhanh.
- eq_ref: Thường dùng cho quét khóa chính hoặc chỉ mục duy nhất, thường là sử dụng khóa chính để kết nối truy vấn.
- ref: Thường dùng cho quét chỉ mục không phải khóa chính và chỉ mục duy nhất.
- ref_or_null: Loại kết nối này giống `ref`, khác biệt là `MySQL` sẽ tìm kiếm thêm các bản ghi chứa giá trị `NULL`.
- index_merge: Sử dụng phương pháp tối ưu hợp nhất chỉ mục, truy vấn sử dụng hai chỉ mục trở lên.
- unique_subquery: Tương tự như `eq_ref`, điều kiện sử dụng truy vấn `in` con.
- index_subquery: Khác với `unique_subquery`, dùng cho chỉ mục không duy nhất, có thể trả về giá trị trùng lặp.
- range: Thường dùng cho truy vấn phạm vi, ví dụ: `between ... and` hoặc các thao tác `in`.
- index: Quét toàn bộ chỉ mục.
- ALL: Quét toàn bộ bảng.

### 1.2.2 rows

Cột này biểu thị số hàng MySQL ước tính cần đọc để tìm thấy các bản ghi cần thiết. Đối với bảng InnoDB, con số này là ước tính và không phải luôn chính xác.

### 1.2.3 filtered

Cột này là một giá trị phần trăm, biểu thị tỷ lệ phần trăm các bản ghi trong bảng thỏa mãn điều kiện. Nói đơn giản, cột này biểu thị tỷ lệ các bản ghi thỏa mãn điều kiện sau khi được lọc từ dữ liệu trả về của engine lưu trữ.

### 1.2.4 extra

Cột này chứa thông tin bổ sung về cách MySQL phân tích câu truy vấn, nó thường xuất hiện các giá trị sau:

- Using filesort: Biểu thị việc sắp xếp theo tệp, thường xuất hiện khi chỉ mục sắp xếp không trùng khớp với sắp xếp chỉ định. Thường thấy trong câu lệnh `order by`.
- Using index: Biểu thị có sử dụng chỉ mục phủ.
- Using temporary: Biểu thị có sử dụng bảng tạm, hiệu suất rất kém, cần tối ưu hóa. Thường thấy trong câu lệnh `group by` hoặc `union`.
- Using where: Biểu thị có sử dụng điều kiện `where` để lọc.
- Using index condition: MySQL 5.6 trở lên bổ sung thêm tối ưu hóa đẩy chỉ mục. Lọc dữ liệu tại lớp engine lưu trữ thay vì tại lớp dịch vụ, sử dụng dữ liệu hiện có của chỉ mục để giảm số lần truy cập lại bảng.

### 1.2.5 key

Cột này biểu thị **chỉ mục thực tế được sử dụng**. Thường được xem cùng với cột `possible_keys`.

## 13. Sự khác biệt giữa chỉ mục Hash và B+ cây là gì? Bạn chọn chỉ mục nào khi thiết kế chỉ mục?

- B+ cây có thể thực hiện truy vấn phạm vi, chỉ mục Hash không thể.
- B+ cây hỗ trợ nguyên tắc tiền tố bên trái của chỉ mục liên kết, chỉ mục Hash không hỗ trợ.
- B+ cây hỗ trợ sắp xếp `order by`, chỉ mục Hash không hỗ trợ.
- Chỉ mục Hash hiệu quả hơn B+ cây trong truy vấn giá trị bằng. (Tuy nhiên nếu chỉ mục có nhiều giá trị trùng lặp, xung đột Hash, hiệu suất giảm).
- B+ cây sử dụng `like` để thực hiện truy vấn mờ khi `like` sau (ví dụ `%` ở đầu) có thể tối ưu hóa, chỉ mục Hash không thể thực hiện truy vấn mờ.

## 14. Chỉ mục có những ưu điểm và nhược điểm gì?

**Ưu điểm:**

- Chỉ mục có thể tăng tốc độ truy vấn dữ liệu, giảm thời gian truy vấn.
- Chỉ mục duy nhất có thể đảm bảo tính duy nhất của từng hàng dữ liệu trong bảng cơ sở dữ liệu.

**Nhược điểm:**

- Tạo và duy trì chỉ mục tiêu tốn thời gian.
- Chỉ mục cần không gian vật lý, ngoài không gian dữ liệu của bảng, mỗi chỉ mục còn tiêu tốn một không gian vật lý nhất định.
- Khi thêm, xóa, sửa dữ liệu trong bảng, chỉ mục cũng cần được duy trì động.

## 15. Sự khác biệt giữa chỉ mục tập trung và chỉ mục không tập trung

Chỉ mục tập trung không phải là một loại chỉ mục riêng biệt, mà là một **cách lưu trữ dữ liệu**. Nó biểu thị cấu trúc chỉ mục và dữ liệu được lưu trữ cùng nhau. Chỉ mục không tập trung là **chỉ mục có cấu trúc và dữ liệu được lưu trữ riêng biệt**.

Tiếp theo, chúng ta sẽ nói về các engine lưu trữ khác nhau~

Trong engine lưu trữ `InnoDB` của MySQL, sự khác biệt lớn nhất giữa chỉ mục tập trung và không tập trung là ở nút lá có lưu trữ toàn bộ bản ghi hay không. Nút lá của chỉ mục tập trung lưu trữ toàn bộ bản ghi, trong khi nút lá của chỉ mục không tập trung lưu trữ thông tin khóa chính, **do đó, chỉ mục không tập trung thường cần truy vấn lại bảng**.

- Một bảng chỉ có thể có một chỉ mục tập trung (vì chỉ mục tập trung thường là **chỉ mục khóa chính**), trong khi bảng có thể có nhiều chỉ mục không tập trung.
- Thông thường, chỉ mục tập trung hiệu suất truy vấn cao hơn so với chỉ mục không tập trung vì không cần truy vấn lại bảng.

Trong engine lưu trữ `MyISM`, khóa chính và chỉ mục thường đều là chỉ mục không tập trung, vì dữ liệu và chỉ mục tách biệt, các nút lá đều sử dụng **một địa chỉ để trỏ đến dữ liệu bảng thực sự**.