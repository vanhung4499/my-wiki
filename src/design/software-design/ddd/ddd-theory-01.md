---
title: DDD Theory 01
tags:
  - design
  - ddd
categories:
  - design
order: 1
---
# Lý thuyết về DDD 01 - Tổng quan

## 0. Tổng quan

DDD là gì? Đây là câu hỏi đầu tiên mà mọi nhà phát triển muốn sử dụng DDD cho dự án của mình gặp phải. Chỉ khi hiểu rõ DDD là gì thì mới có thể bắt tay vào sử dụng được. DDD không phải là một cấu trúc công trình như MVC, cũng không thể đồng nhất trực tiếp với kiến trúc microservices, càng không phải là một mẫu thiết kế.

DDD là viết tắt của Domain-Driven Design (thiết kế hướng miền), một phương pháp phát triển phần mềm chủ yếu được Eric Evans đề xuất lần đầu tiên trong cuốn sách của ông “Domain-Driven Design: Tackling Complexity in the Heart of Software”.

**DDD chủ yếu tập trung vào việc tạo ra các mô hình phần mềm liên quan chặt chẽ đến miền nghiệp vụ, nhằm đảm bảo phần mềm có thể giải quyết chính xác các vấn đề thực tế.**

**Các khái niệm cốt lõi của DDD bao gồm:**

1. **Mô hình miền (Domain Model)**:
    Mô hình miền là sự biểu thị chính xác kiến thức về một miền nghiệp vụ cụ thể, bao gồm các khái niệm như thực thể (Entities), Value Object (Value Objects), dịch vụ (Services), tập hợp (Aggregates), và gốc tập hợp (Aggregate Roots). Mô hình miền là cốt lõi của DDD, phản ánh ngôn ngữ và quyết định của chuyên gia nghiệp vụ.
   
2. **Ngôn ngữ thống nhất (Ubiquitous Language)**:
    Ngôn ngữ thống nhất là ngôn ngữ được sử dụng chung bởi nhóm phát triển và chuyên gia nghiệp vụ, và duy trì nhất quán trong toàn bộ dự án. Ngôn ngữ thống nhất đảm bảo rằng tất cả mọi người đều hiểu các khái niệm nghiệp vụ giống nhau, giảm chi phí giao tiếp và hiểu lầm.

3. **Giới hạn ngữ cảnh (Bounded Context)**:
    Giới hạn ngữ cảnh là ranh giới hệ thống được xác định rõ ràng, trong đó có một tập hợp mô hình và ngôn ngữ thống nhất. Các giới hạn ngữ cảnh khác nhau có thể có các mô hình khác nhau, và chúng tương tác và tích hợp với nhau thông qua ánh xạ ngữ cảnh (Context Mapping).

4. **Tập hợp (Aggregate)**:
    Tập hợp là một tập hợp các đối tượng liên quan, được coi là một đơn vị để sửa đổi dữ liệu. Mỗi tập hợp có một gốc tập hợp, là cổng vào duy nhất cho các đối tượng bên ngoài tương tác với các đối tượng bên trong tập hợp.

5. **Dịch vụ miền (Domain Services)**:
    Khi một số hành vi không tự nhiên thuộc về bất kỳ thực thể hoặc Value Object nào, các hành vi này có thể được định nghĩa là dịch vụ miền. Dịch vụ miền thường biểu thị các hoạt động hoặc business logic trong miền.

6. **Dịch vụ ứng dụng (Application Services)**:
    Dịch vụ ứng dụng là một phần của phần mềm, phối hợp các đối tượng miền để thực hiện nhiệm vụ. Chúng chịu trách nhiệm về quy trình làm việc của ứng dụng, nhưng không chứa các quy tắc hoặc kiến thức nghiệp vụ.

7. **Hạ tầng (Infrastructure)**:
    Hạ tầng bao gồm các thành phần kỹ thuật cung cấp cơ chế lưu trữ cho mô hình miền (như cơ sở dữ liệu), truyền thông tin, cấu hình ứng dụng, v.v.

8. **Sự kiện miền (Domain Events)**:
    Sự kiện miền là các sự kiện nghiệp vụ có ý nghĩa xảy ra trong miền, có thể kích hoạt các phản ứng hoặc quy trình từ các hệ thống con khác.


**Mục tiêu của DDD** là tập trung vào miền cốt lõi của phần mềm, và quản lý sự phức tạp thông qua mô hình miền phong phú, từ đó nâng cao chất lượng và khả năng bảo trì phần mềm. DDD nhấn mạnh sự hợp tác chặt chẽ với chuyên gia nghiệp vụ để đảm bảo rằng giải pháp phần mềm phản ánh chính xác các yêu cầu nghiệp vụ. Thông qua phương pháp này, nhóm phát triển phần mềm có thể tạo ra các hệ thống linh hoạt hơn, mở rộng hơn và liên kết chặt chẽ với nghiệp vụ.

**Các phương pháp thiết kế phần mềm trong DDD:**

Phương pháp thiết kế phần mềm bao gồm các nguyên tắc, khái niệm và thực hành hướng dẫn quy trình phát triển phần mềm. Những phương pháp này thường bao gồm các khái niệm như:

- **Paradigms**
- **Models**
- **Frameworks**
- **Methodologies**

**Các hoạt động chính của thiết kế phần mềm bao gồm:**

- **Modeling**
- **Testing**
- **Engineering)**
- **Development**
- **Deployment**
- **Maintenance**

### **Paradigms**

Paradigms là phong cách hoặc triết lý cơ bản trong thiết kế và phát triển phần mềm. Nó thường định nghĩa các nguyên tắc và mô hình cơ bản của lập trình. Các phạm trù thiết kế phần mềm phổ biến bao gồm:

1. **Lập trình cấu trúc (Structural Programming)**: Nhấn mạnh tầm quan trọng của cấu trúc chương trình, sử dụng các cấu trúc điều khiển như tuần tự, lựa chọn và vòng lặp.
2. **Lập trình hướng đối tượng (OOP - Object Oriented Programming)**: Dựa trên khái niệm đối tượng, kết hợp dữ liệu và các phương pháp xử lý dữ liệu.
3. **Lập trình hàm (Functional Programming)**: Xem việc tính toán như là đánh giá các hàm toán học, tránh thay đổi trạng thái và dữ liệu có thể thay đổi.
4. **Lập trình hướng sự kiện (Event-Driven Programming)**: Tập trung vào các sự kiện, phản hồi các thao tác của người dùng, tin nhắn hoặc các sự kiện khác trong hệ thống.

### **Models**

Mô hình là sự biểu diễn trừu tượng của hệ thống phần mềm, giúp hiểu, thiết kế và kiểm thử hệ thống. Các mô hình thiết kế phần mềm phổ biến bao gồm:

1. **UML (Unified Modeling Language)**: Một tập hợp các ngôn ngữ mô hình hóa đồ họa dùng để mô tả, thiết kế và tài liệu hóa các dự án phần mềm.
2. **Mô hình ER (Entity-Relation)**: Dùng cho thiết kế cơ sở dữ liệu, mô tả các thực thể dữ liệu và mối quan hệ giữa chúng.
3. **Mô hình máy trạng thái**: Mô tả các trạng thái có thể có của hệ thống, các sự kiện và các chuyển đổi khi các sự kiện đó xảy ra.

### **Frameworks**

Framework là một tập hợp các thư viện mã và thành phần được thiết kế trước, cung cấp bộ khung cho việc phát triển phần mềm. Framework thường định nghĩa cấu trúc của ứng dụng, cung cấp một tập hợp các chức năng và mô hình chung để các nhà phát triển có thể tập trung vào việc thực hiện business logic cụ thể. Ví dụ:

1. **Spring Framework**: Một khung lập trình và cấu hình toàn diện cho các ứng dụng Java.
2. **Ruby on Rails**: Một Framework Ruby để phát triển nhanh các ứng dụng web.
3. **Django**: Một Framework web cao cấp cho Python, khuyến khích phát triển nhanh và thiết kế sạch, thực dụng.

### **Methodologies**

Phương pháp luận là một tập hợp các quy tắc và thực hành hướng dẫn quá trình phát triển phần mềm. Nó bao gồm quản lý dự án, quy trình phát triển, sự cộng tác của nhóm, v.v. Các phương pháp phát triển phần mềm phổ biến bao gồm:

1. **Agile**: Một phương pháp phát triển lặp lại và tăng cường, nhấn mạnh sự linh hoạt và hợp tác với khách hàng.
2. **Scrum**: Một Framework Agile để quản lý các dự án phần mềm và sản phẩm phức tạp.
3. **Waterfall**: Một phương pháp phát triển tuyến tính tuần tự, chia dự án thành các giai đoạn khác nhau, mỗi giai đoạn hoàn thành trước khi chuyển sang giai đoạn tiếp theo.

### **Main Activities**

Các hoạt động chính của thiết kế phần mềm bao gồm:

1. **Modeling**: Tạo các mô hình để biểu diễn các khía cạnh khác nhau của hệ thống, như sử dụng sơ đồ UML để mô tả kiến trúc hệ thống.
2. **Testing**: Đảm bảo chất lượng phần mềm, bao gồm kiểm thử đơn vị, kiểm thử tích hợp, kiểm thử hệ thống và kiểm thử chấp nhận.
3. **Engineering**: Áp dụng các nguyên tắc và thực hành kỹ thuật để xây dựng phần mềm, bao gồm phân tích yêu cầu, thiết kế, hiện thực và kiểm thử.
4. **Development**: Viết mã và hiện thực các chức năng, chuyển đổi thiết kế thành sản phẩm phần mềm thực tế.
5. **Deployment**: Phát hành phần mềm vào môi trường sản xuất, làm cho nó sẵn sàng để người dùng sử dụng.
6. **Maintenance**: Cập nhật và cải tiến phần mềm sau khi phát hành, sửa chữa lỗi, nâng cao hiệu suất và khả năng thích ứng.

Mỗi hoạt động là một phần quan trọng của vòng đời phát triển phần mềm, chúng phụ thuộc lẫn nhau và cùng đảm bảo sự thành công của dự án phần mềm.

### **Maintenance**

Bảo trì phần mềm là các hoạt động diễn ra sau khi phần mềm được phát hành, bao gồm các khía cạnh sau:

1. **Sửa lỗi**: Sửa chữa các lỗi hoặc sai sót được phát hiện trong phần mềm.
2. **Bảo trì thích nghi**: Thay đổi phần mềm để thích ứng với sự thay đổi của môi trường, như nâng cấp hệ điều hành, thay thế phần cứng, v.v.
3. **Bảo trì hoàn thiện**: Thêm các tính năng mới hoặc nâng cao hiệu suất để đáp ứng các yêu cầu mới hoặc thay đổi của người dùng.
4. **Bảo trì phòng ngừa**: Cải thiện cấu trúc nội bộ của phần mềm để ngăn ngừa các vấn đề tiềm ẩn, nâng cao khả năng bảo trì và mở rộng của phần mềm.

Bảo trì phần mềm là một quá trình liên tục, đảm bảo phần mềm có thể phục vụ người dùng một cách hiệu quả trong thời gian dài.

## **1.  DDD là gì?**

DDD là gì? Theo một đoạn định nghĩa từ Wikipedia: **["Domain-driven design (DDD) is a major software design approach."](https://en.wikipedia.org/wiki/Domain-driven_design)**, DDD là một phương pháp thiết kế phần mềm. Điều này có nghĩa là DDD là một phương tiện hướng dẫn chúng ta thực hiện thiết kế kỹ thuật phần mềm. Nó cung cấp các kỹ thuật để cắt nhỏ mô hình kỹ thuật, chẳng hạn như: domain, bounded context, entity, value object, aggregate, factory, repository, v.v. Thông qua tư tưởng hướng dẫn của DDD, chúng ta có thể đầu tư nhiều thời gian hơn vào giai đoạn đầu và lập kế hoạch hợp lý cho thiết kế kỹ thuật có thể duy trì và lặp lại được.

Trong DDD, có một bộ công cụ thiết kế kỹ thuật được chia thành hai giai đoạn: thiết kế chiến lược và thiết kế chiến thuật.

1. **Thiết kế chiến lược (Strategic Design)**: chủ yếu để đối phó với các yêu cầu nghiệp vụ phức tạp, thông qua quá trình trừu tượng và phân chia, hợp lý chia nhỏ thành nhiều microservice độc lập để quản lý và kiểm soát. Đánh giá sự hợp lý của việc phân chia dựa trên việc triển khai các yêu cầu khi phát triển, xem liệu mỗi lần triển khai có cần thao tác nhiều microservice hay không. Thiết kế chiến lược như vậy là một thiết kế microservices thất bại. Vì vậy, một số ít các ứng dụng đơn thể quy mô trung bình, bao quanh bởi một hệ sinh thái dịch vụ (ecosystem), có ý nghĩa hơn. **[Bạn thực sự không xây dựng microservices @Justin Etheredge](https://www.simplethread.com/youre-not-actually-building-microservices/)**

2. **Thiết kế chiến thuật (Tactical Design)**: trong phần này, chủ yếu là thảo luận về cách biểu đạt các khái niệm nghiệp vụ dựa trên tư duy hướng đối tượng và sử dụng mô hình miền. Thông thường, trong kiến trúc không thiết kế mô hình miền, mà thường ánh xạ đến kiến trúc ba lớp MVC, mô hình phát triển Service + dữ liệu sẽ làm cho Service trở nên phẳng, số lượng lớn và phát sinh nhiều mã business logic phức tạp. Thêm vào đó, việc tách rời hành vi đối tượng và logic chức năng, phát triển anemic model, dẫn đến việc sử dụng chéo liên tục của các đối tượng hành vi, làm tăng độ phức tạp của hệ thống và khó bảo trì. Vì vậy, trong giai đoạn này, cần thiết kế mỗi mô hình có thể biểu đạt các khái niệm domain và sử dụng entity, aggregate, domain service để triển khai.

## **2. Khái niệm về DDD**

Các khái niệm như Rich Model, những gì được đề cập trong domain này, entity, aggregate và value object có sự khác biệt gì? Những câu hỏi "tại sao" này rất quan trọng trong quá trình thiết kế chiến thuật. Hiểu rõ chúng sẽ giúp bạn thiết kế DDD một cách hiệu quả.

### **2.1. Rich Model**

**Rich Model** đề cập đến việc tích hợp thông tin thuộc tính và logic hành vi của đối tượng vào một lớp. Các phương thức thường được sử dụng như cung cấp xác thực thông tin của đối tượng, tạo khóa bộ nhớ cache và xử lý logic mà không cần gọi interface dịch vụ bên ngoài, tất cả đều nằm trong đối tượng.

![](https://article-images.zsxq.com/FsvPPZ3Fw8G0As-Y0Q5pLNn5Dtvs)  

1. Cách này cho phép khi sử dụng một đối tượng, bạn có thể truy cập một loạt các phương thức do đối tượng cung cấp mà không cần tự xử lý logic tương tự.
2. Tuy nhiên, Rich Model không chỉ giới hạn ở thiết kế một lớp và các phương thức trong một lớp. Nó có thể là cấu trúc của một gói, trong đó bao gồm các thành phần cần thiết để thực hiện dịch vụ trong gói này (model, repository, factory), cũng có thể được coi là Rich Model.
3. Đồng thời, trong một lớp tương tự, bạn có thể cung cấp các lớp bên trong tương ứng, chẳng hạn như xác thực người dùng, bao gồm lớp truyền thông, thẻ xác thực, thẻ ngân hàng, bốn yếu tố, v.v. Tất cả đều được viết dưới dạng các lớp con bên trong lớp người dùng. Điều này giúp mã dễ hiểu hơn và dễ dàng bảo trì, phát triển.

### **2.2. Domain Model**

**Domain Model** là sự trừu tượng và đóng gói các quy tắc, chiến lược và quy trình nghiệp vụ trong một business domain cụ thể. Phương pháp thiết kế chia nhỏ các domain module thông qua mô hình bão, tạo ra các ngữ cảnh ranh giới. Điểm khác biệt lớn nhất là tách các dịch vụ và mô hình dữ liệu ban đầu thành các domain module độc lập có ranh giới. Trong mỗi domain, bạn tạo các đối tượng thuộc về domain đó (entity, aggregate, value object), data access object (DAO), factory, adapter port (cách gọi các interface bên ngoài), v.v.

Bây giờ, có một số khái niệm: domain service, domain object, repository, event message và adapter port. Hãy xem chúng đã phát triển từ anemic model như thế nào và chi tiết từng khái niệm.

  

![](https://article-images.zsxq.com/Fq_zNTXR5LyQnDVs7XwpvzY12O47)


1. Trong phát triển dựa trên service + anemic model, dịch vụ gọi tuần tự từng module chức năng. Các infrastructure này (object, method, interface) gọi lẫn nhau. Điều này do anemic model không thiết kế theo hướng đối tượng và mọi yêu cầu phát triển chỉ là thiết kế chi tiết.
2. Trong Rich Model, chúng ta chia các service thành các domain service, VO, Req, Res thành các domain object, DAO, Redis thành repository, v.v. Ví dụ: trong một dịch vụ tài khoản, các quy trình xác thực tín dụng, mở tài khoản, tăng giảm hạn mức, v.v. mỗi cái là một domain độc lập, trong mỗi domain này, tạo các thông tin cần thiết cho domain đó.
3. Một đặc điểm của domain model là nó chỉ tập trung vào việc thực hiện chức năng nghiệp vụ, không kết nối trực tiếp với bất kỳ interface và dịch vụ bên ngoài nào. Ví dụ: không gọi trực tiếp DAO, không gọi trực tiếp Redis, không kết nối trực tiếp RPC với các microservice khác. Thay vào đó, thông qua repository và adapter port, nó xác định interface với các đối tượng đầu vào và đầu ra, để lớp infrastructure thực hiện các cuộc gọi cụ thể. Bằng cách này, domain chỉ tập trung vào thực hiện nghiệp vụ và đồng thời làm tốt việc bảo mật.

### **2.3. Entity, Aggregate, Value Object**

Trong phát triển theo anemic model, các đối tượng đầu vào và đầu ra của phương thức thường không được chú trọng, và nhiều dịch vụ thường dùng chung một đối tượng VO miễn là mang các thuộc tính cần thiết.  

Nhưng trong thiết kế domain model (DDD), thiết kế domain object là rất hướng đối tượng. Trong toàn bộ quá trình mô hình hóa bão màu sắc, nó cũng được thúc đẩy bởi các domain object.

Entity, Aggregate, Value Object nằm trong các domain object trong mỗi domain và phục vụ cho các domain service. Ba đối tượng này được định nghĩa cụ thể như sau:  

![](https://article-images.zsxq.com/Fj5_7DDMhzbwodONmAab8kkmbp6f)

#### **Entity**

Entity là các đối tượng có định danh duy nhất và có vòng đời kéo dài theo domain service. Các đối tượng PO (Persistent Objects) là các đối tượng nguyên tử không có ngữ nghĩa nghiệp vụ, trong khi entity là các đối tượng có ngữ nghĩa nghiệp vụ và có định danh duy nhất. Ví dụ: đối tượng PO của người dùng sẽ bao gồm các account entity, credit entity, level entity, và cả cart entity khi đặt hàng. Đối tượng này thường là đối tượng đầu vào của các phương thức domain service.

1. Khái niệm: 
	- Entity = Định danh duy nhất + Thuộc tính trạng thái + Hành vi (chức năng), là một khối xây dựng cơ bản trong DDD, đại diện cho các domain object có định danh duy nhất. Entity không chỉ chứa dữ liệu mà còn chứa các hành vi liên quan và định danh của nó không thay đổi trong suốt vòng đời.

2. Đặc điểm:
	   -  **Định danh duy nhất**: Entity có một định danh có thể phân biệt với các entity khác. Định danh này có thể là một ID, một khóa hợp phần hoặc một khóa tự nhiên, điều quan trọng là nó có thể định danh duy nhất cho entity.
	   - **Định danh domain**: Định danh của entity thường xuất phát từ business domain, chẳng hạn như User ID, Order ID, v.v.
	   - **Định danh ủy quyền**: Trong một số trường hợp, định danh của entity có thể được tạo tự động bởi ORM, chẳng hạn như khóa chính tự động tăng trong cơ sở dữ liệu.

3. Mục đích:
	- **Biểu diễn khái niệm nghiệp vụ**: Entity được sử dụng để biểu diễn các khái niệm nghiệp vụ cụ thể trong phần mềm, như user, order, transaction, v.v.
	- **Đóng gói business logic**: Entity không chỉ chứa dữ liệu mà còn đóng gói các quy tắc và business logic, bao gồm việc kiểm tra tính hợp lệ của dữ liệu, thực hiện các quy tắc nghiệp vụ, tính toán giá trị thuộc tính, v.v.
	- **Duy trì tính nhất quán của dữ liệu**: Thực thể chịu trách nhiệm duy trì trạng thái và tính nhất quán của dữ liệu của chính nó.

4. Phương pháp triển khai:
	- **Định nghĩa lớp entity**: Định nghĩa một lớp chứa các thuộc tính, hàm tạo, phương thức, v.v.
	- **Thực hiện định danh duy nhất**: Cung cấp một thuộc tính định danh duy nhất cho lớp entity, chẳng hạn như ID, và đảm bảo rằng định danh này không thay đổi trong vòng đời của thực thể.
	- **Đóng gói hành vi**: Triển khai các phương thức business logic trong lớp entity, các phương thức này có thể thao tác trạng thái của entity và thực hiện các quy tắc nghiệp vụ liên quan.
	- **Sử dụng ORM**: Sử dụng ORM để ánh xạ entity vào bảng cơ sở dữ liệu.
	- **Triển khai domain service**: Đối với các hoạt động liên quan đến nhiều entity hoặc aggregate, có thể triển khai domain service để xử lý các hoạt động này thay vì triển khai trực tiếp trong entity.
	- **Sử dụng domain event**: Khi trạng thái của entity thay đổi, có thể phát hành các domain event để thông báo cho các phần khác của hệ thống thực thi các xử lý tương ứng.

#### **Value Object**

Value Object trong vòng đời của phương thức domain service là đối tượng không thể thay đổi và không có định danh duy nhất. Nó thường được sử dụng cùng với các entity object. Ví dụ, nó có thể cung cấp mô tả giá trị thuộc tính cho các entity object, chẳng hạn như một value object cấp bậc của nhân viên công ty hoặc một đối tượng thông tin địa chỉ giao hàng cấp bốn của một sản phẩm đã đặt hàng. Do đó, khi phát triển Value Object, thường không cung cấp phương thức setter, mà sử dụng hàm tạo hoặc phương thức Builder để khởi tạo đối tượng. Đối tượng này thường không được sử dụng làm đối tượng tham số của phương thức một cách độc lập, nhưng có thể được sử dụng làm đối tượng trả về một cách độc lập.

1. **Khái niệm**: Value Object được tạo thành từ một tập hợp các thuộc tính, chúng mô tả một khái niệm domain. Khác với  Entity, Value Object không cần có định danh duy nhất để phân biệt chúng. Value Object thường không thể thay đổi, nghĩa là sau khi được tạo ra, trạng thái của chúng không nên thay đổi.

2. **Đặc điểm**:
    1. **Tính bất biến (Immutability)**: Value Object sau khi được tạo ra, trạng thái của nó không nên thay đổi. Điều này giúp đảm bảo tính nhất quán của domain model và an toàn luồng.
    2. **Tính đồng nhất (Equality)**: Sự đồng nhất của Value Object không dựa trên định danh hay tham chiếu, mà dựa trên các giá trị thuộc tính của đối tượng. Nếu tất cả các giá trị thuộc tính của hai Value Object bằng nhau, thì hai đối tượng đó được coi là đồng nhất.
    3. **Tính thay thế (Replaceability)**: Vì Value Object là không thể thay đổi, bất kỳ thao tác nào cần thay đổi Value Object sẽ dẫn đến việc tạo ra một phiên bản Value Object mới, thay vì sửa đổi phiên bản hiện tại.
    4. **Chú trọng vào mô tả trạng thái của sự vật**: Value Object thường được sử dụng để mô tả trạng thái của sự vật, chứ không phải là định danh duy nhất của sự vật.
    5. **Tính tái sử dụng (Reusability)**: Value Object có thể được tái sử dụng trong các domain entity khác nhau hoặc các Value Object khác.

3. **Ứng dụng**:
    1. Số tiền và tiền tệ (như giá cả, lương, chi phí, v.v.)
    2. Đo lường và dữ liệu (như trọng lượng, chiều dài, thể tích, v.v.)
    3. Phạm vi hoặc khoảng (như khoảng thời gian, khoảng nhiệt độ, v.v.)
    4. Mô hình toán học phức tạp (như tọa độ, vector, v.v.)
    5. Bất kỳ tập hợp thuộc tính nào khác cần được đóng gói.

4. **Phương pháp triển khai**:
    1. **Định nghĩa lớp bất biến**: Đảm bảo tất cả các thuộc tính của lớp là private và chỉ có thể được thiết lập thông qua hàm tạo.
    2. **Ghi đè phương thức equals và hashCode**: Điều này đảm bảo rằng tính đồng nhất của Value Object dựa trên các giá trị thuộc tính của chúng, chứ không phải tham chiếu đối tượng.
    3. **Cung cấp bộ đọc chỉ đọc**: Chỉ cung cấp các phương thức truy cập giá trị thuộc tính, không cung cấp phương thức sửa đổi giá trị thuộc tính.
    4. **Sử dụng factory method hoặc constructor để tạo phiên bản**: Điều này giúp đảm bảo tính hợp lệ và nhất quán của Value Object.
    5. **Cân nhắc hỗ trợ serialize**: Nếu Value Object cần được truyền qua mạng hoặc lưu trữ vào cơ sở dữ liệu, cần cung cấp hỗ trợ serialize và deserialize.

#### **Aggregate**

Khi bạn thực hiện các thao tác với cơ sở dữ liệu liên quan đến nhiều entity, bạn có thể tạo đối tượng aggregate. Một đối tượng aggregate đại diện cho một giao dịch cơ sở dữ liệu và có tính nhất quán giao dịch. Các entity trong aggregate có thể được tạo ra bởi aggregate và entity này cũng được gọi là aggregate root (đối tượng gốc của tập hợp). Ví dụ, aggregate của một order sẽ bao gồm: đối tượng user entity (người dùng đặt hàng), order entity (đơn hàng), order detail entity (chi tiết đơn hàng) và address value object (địa chỉ giao hàng). Cart entity (giỏ hàng) làm tham số đầu vào sẽ được chuyển đổi thành entity. Tính nhất quán giao dịch bên trong aggregate và tính nhất quán cuối cùng bên ngoài aggregate.

1. **Khái niệm**: Aggregate là một khái niệm quan trọng trong domain model, nó là một tập hợp các đối tượng liên quan có tính kết dính, những đối tượng này cùng làm việc để thực hiện một số quy tắc hoặc thao tác nghiệp vụ nhất định. Aggregate xác định ranh giới của một tập hợp các đối tượng có thể được coi là một đơn vị duy nhất để xử lý.
2. **Đặc điểm**:
    1. **Ranh giới nhất quán**: Aggregate đảm bảo sự thay đổi trạng thái của các đối tượng bên trong nó là nhất quán. Khi thực hiện thao tác trên các đối tượng trong aggregate, các thao tác này phải giữ cho tất cả các đối tượng trong tập hợp có sự nhất quán.
    2. **Aggregate Root**: Mỗi tập hợp có một thực thể gốc (Aggregate Root), nó là điểm truy cập của aggregate. Aggregate Root có một định danh duy nhất toàn cục, các đối tượng khác tương tác với tập hợp thông qua aggregate root.
    3. **Ranh giới giao dịch**: Aggregate cũng xác định ranh giới của giao dịch. Trong aggregate, tất cả các thao tác thay đổi phải là nguyên tử, nghĩa là chúng hoặc thành công hoàn toàn hoặc thất bại hoàn toàn, để đảm bảo tính nhất quán của dữ liệu.

3. **Ứng dụng**:
    1. **Đóng gói business logic**: Aggregate thông qua việc đóng gói các đối tượng và thao tác liên quan, cung cấp một mô hình business logic rõ ràng, giúp việc thực thi và bảo trì các business rule.
    2. **Đảm bảo tính nhất quán**: Aggregate đảm bảo sự nhất quán của trạng thái nội bộ, thông qua việc định rõ ranh giới và quy tắc, aggregate có thể thực thi các quy tắc kinh doanh nội bộ, đảm bảo tính nhất quán của dữ liệu.
    3. **Đơn giản hóa sự phức tạp**: Aggregate thông qua việc tổ chức các đối tượng liên quan, đơn giản hóa sự phức tạp của domain model. Điều này giúp các nhà phát triển dễ dàng hiểu và mở rộng hệ thống.

4. **Phương pháp triển khai**:
    1. **Định nghĩa aggregate root**: Lựa chọn root entity phù hợp là bước đầu tiên để thực hiện tập hợp. Thực thể gốc nên là thực thể có thể đại diện cho toàn bộ tập hợp và có định danh duy nhất.
    2. **Hạn chế đường dẫn truy cập**: Chỉ có thể sửa đổi các đối tượng bên trong aggregate thông qua root entity, không được phép sửa đổi trực tiếp trạng thái của các đối tượng bên trong aggregate, để duy trì ranh giới và tính nhất quán.
    3. **Thiết kế chiến lược giao dịch**: Thực hiện tính nhất quán giao dịch trong aggregate, đảm bảo các thao tác hoặc hoàn thành toàn bộ hoặc quay lại toàn bộ. Đối với tương tác giữa các tập hợp, có thể sử dụng domain event hoặc cơ chế khác để thực hiện tính nhất quán cuối cùng.
    4. **Đóng gói business rule**: Thực hiện các quy tắc và business logic trong aggregate, đảm bảo tất cả các thao tác nghiệp vụ tuân theo các quy tắc này.
    5. **Duy trì tính nhất quán**: Root entity của aggregate thường tương tác với lớp repository để lưu trữ trạng thái của aggregate. Điều này thường liên quan đến ánh xạ Object-Relation (ORM) hoặc các kỹ thuật ánh xạ dữ liệu khác.

### **2.4. Repository và Adapter**

Trong phương pháp thiết kế DDD, tầng domain chỉ quan tâm đến việc thực hiện các domain service. Điều này thể hiện rõ nhất qua thiết kế của repository và adapter. Thông thường, trong thiết kế Service + data model, các dịch vụ ngoài như Redis, RPC, configuration center, v.v., sẽ được đưa vào Service. Nhưng trong DDD, thông qua việc định nghĩa repository và adapter cũng như tầng infrastructure, phần này đã được tách rời.

![](https://article-images.zsxq.com/FvLgpxTQ7zUfH-3FT4PA77wOfalR)

1. **Đặc điểm**:
    1. **Đóng gói các thao tác lưu trữ**: Repository chịu trách nhiệm đóng gói tất cả các thao tác tương tác với nguồn dữ liệu, như các thao tác tạo, đọc, cập nhật và xóa (CRUD). Bằng cách này, mã nguồn của tầng domain có thể tránh được sự phức tạp khi xử lý cơ sở dữ liệu hoặc các cơ chế lưu trữ khác.
    2. **Quản lý tập hợp các đối tượng domain**: Repository thường được coi là tập hợp các đối tượng domain, cung cấp các phương thức truy vấn và lọc các đối tượng này, làm cho việc lấy và quản lý các đối tượng domain trở nên thuận tiện hơn.
    3. **Giao diện trừu tượng**: Repository định nghĩa một giao diện không phụ thuộc vào cơ chế lưu trữ, điều này cho phép mã nguồn của tầng domain có thể chuyển đổi giữa các cơ chế lưu trữ khác nhau mà không cần sửa đổi logic nghiệp vụ.

2. **Ứng dụng**:
    1. **Trừu tượng hóa truy cập dữ liệu**: Repository cung cấp một giao diện truy cập dữ liệu rõ ràng cho tầng domain, giúp các đối tượng domain có thể tập trung vào việc thực hiện logic nghiệp vụ mà không cần quan tâm đến chi tiết truy cập dữ liệu.
    2. **Truy vấn và quản lý đối tượng domain**: Repository làm cho việc truy vấn và quản lý các đối tượng domain trở nên thuận tiện và linh hoạt hơn, hỗ trợ các logic truy vấn phức tạp.
    3. **Phân tách logic nghiệp vụ và lưu trữ dữ liệu**: Thông qua mô hình Repository, logic nghiệp vụ và logic lưu trữ dữ liệu được phân tách, nâng cao tính thuần túy và khả năng kiểm tra của domain model.
    4. **Tối ưu hóa truy cập dữ liệu**: Việc thực hiện Repository có thể bao gồm các chiến lược tối ưu hóa truy cập dữ liệu, như bộ nhớ đệm, thao tác hàng loạt, v.v., để cải thiện hiệu suất của ứng dụng.

3. **Phương pháp thực hiện**:
    1. **Định nghĩa giao diện Repository**: Định nghĩa một hoặc nhiều giao diện Repository trong tầng domain, các giao diện này khai báo các phương thức truy cập dữ liệu cần thiết.
    2. **Thực hiện giao diện Repository**: Thực hiện các giao diện này trong tầng infrastructure hoặc tầng truy cập dữ liệu, việc thực hiện cụ thể có thể sử dụng các khung ORM (Object-Relational Mapping) như MyBatis, Hibernate, hoặc sử dụng trực tiếp API truy cập cơ sở dữ liệu như JDBC.
    3. **Tiêm phụ thuộc**: Sử dụng tiêm phụ thuộc (DI) trong ứng dụng để tiêm các triển khai cụ thể của Repository vào các domain service hoặc dịch vụ ứng dụng cần chúng. Cách làm này giúp tách rời thêm tầng domain và tầng truy cập dữ liệu, đồng thời thuận tiện cho việc kiểm tra đơn vị.
    4. **Sử dụng mẫu quy định (Specification Pattern)**: Đôi khi, để xây dựng các truy vấn phức tạp, có thể kết hợp sử dụng mẫu quy định, đây là một mẫu cho phép đóng gói các quy tắc nghiệp vụ thành các đơn vị logic nghiệp vụ riêng biệt, các đơn vị này có thể được Repository sử dụng để xây dựng truy vấn.

Mô hình Repository là một khái niệm cốt lõi trong DDD (Domain-Driven Design), nó giúp duy trì sự tập trung và rõ ràng của domain model, đồng thời cung cấp các chiến lược truy cập dữ liệu linh hoạt, có thể kiểm tra và bảo trì.

Repository tách rời sử dụng thiết kế đảo ngược phụ thuộc (Dependency Inversion), tất cả các dịch vụ ngoài cần thiết của domain không được đưa trực tiếp vào dịch vụ ngoài mà thông qua việc định nghĩa các interface, để tầng infrastructure thực hiện các interface của tầng domain (repository/adapter).

Tầng infrastructure chịu trách nhiệm kết nối với Database, Cache, Configuration Center, RPC Interface, HTTP, Push MQ, ... và thực hiện các cuộc gọi domain service interface để cung cấp khả năng truy cập dữ liệu cho tầng domain.

Điều này cũng thể hiện rằng, việc triển khai của tầng domain có ý nghĩa nghiệp vụ, còn tầng infrastructure thì không có ý nghĩa nghiệp vụ, tất cả đều là các phương thức nguyên tử. Bằng cách kết hợp các phương thức nguyên tử này để cung cấp hỗ trợ cho ý nghĩa business domain.

### **2.5. Điều phối Domain**

Trong DDD (Domain-Driven Design), mỗi domain là kết quả của việc phân chia các ngữ cảnh có giới hạn độc lập, và để triển khai các chức năng của quy trình nghiệp vụ, cần phải kết nối các domain module khác nhau để cung cấp một dịch vụ hoàn chỉnh từ đầu đến cuối. Do đó, người ta thường nói về tính nhất quán của giao dịch trong domain và tính nhất quán cuối cùng ngoài domain.

Vì các domain module là độc lập, nên chúng có thể được tái sử dụng. Trong các kịch bản và yêu cầu chức năng khác nhau, bạn có thể chọn các domain module khác nhau để lắp ráp, quá trình này giống như xây dựng một tòa nhà từ các khối lego.

Tuy nhiên, cần phải có sự đánh đổi. Nếu dự án không quá lớn và không cần nhiều xử lý điều phối, bạn có thể để tầng kích hoạt tương tác trực tiếp với tầng domain, bỏ qua tầng điều phối, giúp cho mã nguồn trở nên đơn giản và thuận tiện hơn.

### **2.6. Tầng kích hoạt**

Sau khi tất cả các mô hình đã được định nghĩa và liên kết với nhau, bước tiếp theo là sử dụng chúng. Cách sử dụng có thể bao gồm: interface (HTTP/RPC), lắng nghe tin nhắn (message queue), tác vụ định kỳ (cron job), v.v. Những phương pháp này được gọi chung là hành động kích hoạt.

Hành động kích hoạt này sẽ khởi động việc gọi và xử lý chức năng điều phối. Ví dụ: tác vụ định kỳ để tính lãi cho tín dụng, thông báo thành công mở tài khoản và cấp mã giảm giá, cung cấp interface để bên ngoài gọi đến logic cấp tín dụng, v.v. Tất cả đều là các hành động kích hoạt.

## **Tóm tắt**

Phương pháp thiết kế phần mềm là một lĩnh vực phức tạp, liên quan đến nhiều khái niệm và thực hành. Các mô hình cung cấp triết lý thiết kế, các mô hình giúp chúng ta hiểu và trừu tượng hóa hệ thống, các framework cung cấp cấu trúc cơ bản cho phát triển, và các phương pháp luận hướng dẫn quá trình phát triển toàn diện. Các hoạt động chính trong thiết kế phần mềm như mô hình hóa, kiểm thử, kỹ thuật, phát triển, triển khai và bảo trì là các bước quan trọng đảm bảo thành công của dự án phần mềm. Mỗi hoạt động đòi hỏi kiến thức chuyên môn, kỹ năng, cùng với sự hỗ trợ của các công cụ và kỹ thuật tương ứng. Thông qua sự phối hợp của các hoạt động này, các kỹ sư phần mềm có thể cung cấp sản phẩm phần mềm chất lượng cao, đáp ứng nhu cầu của người dùng. 

## Tham khảo

1.  **[https://en.wikipedia.org/wiki/Domain-driven_design](https://en.wikipedia.org/wiki/Domain-driven_design)**
2.  **[https://en.wikipedia.org/wiki/Software_design](https://en.wikipedia.org/wiki/Software_design)**