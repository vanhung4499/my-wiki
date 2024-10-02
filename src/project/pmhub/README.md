---
title: PMHub
icon: devicon:spring
tags:
  - project
  - microservices
categories:
  - project
dir:
  order: 3
---
# PMHub Overview

Bạn có thể cảm thấy kiến trúc hệ thống dường như khá xa vời, đó là việc mà kiến trúc sư cần quan tâm, còn bạn chỉ cần làm tốt công việc CRUD của mình là đủ.

Trước đây, tôi cũng có suy nghĩ giống như bạn, nhưng thời thế đã thay đổi. Cạnh tranh ngày càng khốc liệt là một mặt, quan trọng hơn là yêu cầu về năng lực **cần được nâng cao hơn nữa**.

Bài viết này sẽ giúp mọi người nhanh chóng hiểu rõ **kiến trúc và các chức năng** của PmHub, sau đó sẽ thực hiện chia sẻ kinh nghiệm thực tiễn về **việc lựa chọn kiến trúc cho PmHub**.

## Giới thiệu

PmHub là một giải pháp quản lý dự án thông minh!

## Kiến trúc PmHub

### Phiên bản monolithic

Phiên bản đơn thể sử dụng kiến trúc thiết kế SOA phân chia gói truyền thống, tức là các nghiệp vụ khác nhau được đặt trong các gói khác nhau, và tách ra các thành phần chung cũng như các thành phần ở tầng khung hệ thống để phân chia vào các gói riêng.

```bash
pmhub
├── pmhub-admin -- Core configuration, such as: internationalization, MyBatis, logging, Swagger, and configuration files
├── pmhub-common -- General components are placed in this module, including common methods, annotations, configurations, constants, model conversion, exceptions, filters, and global prevention of XSS script attacks
├── pmhub-workflow -- Workflow management module, includes workflow classification, form design, workflow design, and deployment management
├── pmhub-framework -- Framework-related functionalities are in this module, such as multi-datasource configuration, rate limiting, MyBatisPlus, Redis, connection pool configuration, etc.
├── pmhub-generator -- Controllers and configurations related to code generation
├── pmhub-oa -- Enterprise WeChat integration and third-party OA system integration, unified login authentication center
├── pmhub-project -- Involves project management, task management, project settings, task flow, etc.
├── pmhub-quartz -- Scheduled task dispatch center
├── pmhub-system -- Corresponding system management module, including user management, role management, log management, etc.
├── pmhub-ui -- Front-end project source code

```

---

Với những ai đã có kiến thức sâu về backend, phiên bản monolithic của PmHub có thể giúp bạn làm quen nhanh chóng, chỉ cần một phương thức "run" là có thể chạy ngay.

Do đó, tôi sẽ tập trung nhiều hơn vào phiên bản microservices.

### Phiên bản microservices

Biểu đồ kiến trúc hệ thống dưới đây sẽ giúp bạn nhanh chóng hiểu được tổ chức kiến trúc của dự án PmHub, từ giao diện người dùng đến gateway, từ ứng dụng dịch vụ đến dịch vụ cơ bản, từ công nghệ lưu trữ đến triển khai vận hành.

![pmhub.drawio.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/pmhub.drawio.png)

---

Biểu đồ lựa chọn kiến trúc dưới đây sẽ giúp bạn nhanh chóng nắm được các lựa chọn công nghệ của dự án PmHub.

![PmHub Architecture.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/PmHub%20Architecture.png)

---

Biểu đồ kiến trúc kỹ thuật dưới đây sẽ giúp bạn nhanh chóng hiểu được kiến trúc kỹ thuật của dự án PmHub và mối quan hệ tương tác giữa các mô-đun.

![pmhub-modules.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/pmhub-modules.png)




---

Bạn cũng có thể tải mã nguồn để xem chi tiết mã.

Cấu trúc mã nguồn như sau:

```plain
com.laigeoffer.pmhub     
├── pmhub-ui              // Front-end framework [1024]
├── pmhub-gateway         // Gateway module [6880]
├── pmhub-auth            // Authentication center [6800]
├── pmhub-api             // API module
│       └── pmhub-api-system                          // System API
│       └── pmhub-api-workflow                        // Workflow API
├── pmhub-base          // Common module
│       └── pmhub-base-core                           // Core module components
│       └── pmhub-base-datasource                     // Multi-datasource component
│       └── pmhub-base-seata                          // Distributed transaction component
│       └── pmhub-base-security                       // Security module component
│       └── pmhub-base-swagger                        // System interface component
│       └── pmhub-base-notice                         // Notification component
├── pmhub-modules         // Business modules
│       └── pmhub-system                              // System module [6801]
│       └── pmhub-gen                                 // Code generation [6802]
│       └── pmhub-job                                 // Scheduled tasks [6803]
│       └── pmhub-project                             // Project service [6806]
│       └── pmhub-workflow                            // Workflow service [6808]
├── pmhub-monitor                                    // Monitoring center [6888]                 
├──pom.xml                                            // Common dependencies
```

## PmHub - Xem trước các chức năng

PmHub là một bộ dự án cấp doanh nghiệp hoàn chỉnh với rất nhiều tính năng. Dưới đây là một số trang thường dùng, và còn rất nhiều tính năng khác đang chờ bạn khám phá.

1) Trang thống kê dữ liệu trang chủ
2) Trang quản lý dự án
3) Trang chi tiết dự án
4) Quản lý nhiệm vụ và chi tiết
5) Trang thiết kế biểu mẫu
6) Trang thiết kế quy trình

Chức năng nghiệp vụ cụ thể vui lòng tham khảo hình ảnh bên dưới.
---

![PmHub Business.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/PmHub%20Business.png)


## Kiến trúc kỹ thuật giao diện người dùng

Danh sách các công nghệ frontend được sử dụng trong dịch vụ:

|     | Công nghệ    | Tên        | Phiên bản | Trang web                                                            |
| --- | ------------ | ---------- | --------- | -------------------------------------------------------------------- |
| 1   | JS Framework | Vuejs      | 2.6.12    | [https://vuejs.org](https://vuejs.org)                               |
| 2   | UI Library   | element-ui | 2.15.10   | [https://element.eleme.io/#/en-US](https://element.eleme.io/#/en-US) |
| 3   | Ajax Request | Axios      | 0.24.0    | [https://axios-http.com/](https://axios-http.com/)                   |
| 4   | Router       | Vue-router | 3.4.9     | [https://router.vuejs.org/](https://router.vuejs.org/)               |
| 5   | CLI          | Vue-cli    | 5.0.8     | [https://cli.vuejs.org/](https://cli.vuejs.org/)                     |

---