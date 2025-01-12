---
title: NestJS Practice 3
tags:
  - nestjs
  - framework
categories:
  - nestjs
order: 3
---
  

# NestJS thực chiến 3 - TypeORM

## Lời nói đầu

Bài viết này là phần tiếp theo của bài viết trước [Triển khai đăng nhập và đăng ký](./practical-2). Ban đầu, các nội dung này dự định sẽ được viết trong một bài, nhưng do vấn đề về độ dài nên đã tách ra thành phần này.

Có thể một số bạn nghĩ bài viết chỉ là về thêm, sửa, xóa, nên không có gì đáng chú ý. Nhưng khi hoàn thành xong, mình nhận ra bài viết này đề cập nhiều kiến thức hữu ích, chẳng hạn như thống kê lượng đọc bài viết, xử lý quan hệ một-nhiều giữa bảng phân loại và bảng bài viết, nhiều-nhiều giữa bảng bài viết và bảng thẻ, tải lên tệp, v.v. Ngoài ra, còn có những chi tiết thú vị như cách trích xuất tóm tắt bài viết, chuyển đổi `Markdown` sang `HTML`, tất cả sẽ được giải thích kỹ trong bài viết này.
## Giải thích trước

Nói qua về yêu cầu thiết kế của bài viết: các thông tin cơ bản của bài viết gồm tiêu đề, ảnh bìa, tóm tắt, số lượt đọc, số lượt thích, v.v.; bài viết có phân loại, mỗi bài chỉ được chọn một phân loại; một bài viết có thể chọn nhiều thẻ tag. Trạng thái của bài viết được chia thành nháp và đã xuất bản, đồng thời để phục vụ cho việc hiển thị sau này, bài viết còn có cài đặt dấu hiệu đề xuất.

### Quan hệ giữa các bảng dữ liệu

Trong bài viết trước, đã đề cập rằng khi tạo bảng bằng `TypeORM`, thông qua class được đánh decorator `@Entity()` để ánh xạ thành bảng dữ liệu, vì vậy mối quan hệ giữa các thực thể cũng chính là mối quan hệ giữa các bảng. Tiếp theo, chúng ta sẽ khám phá cách sử dụng `TypeORM` để tạo quan hệ một - một, một - nhiều và nhiều - nhiều.

### Quan hệ một - một

Quan hệ một - một chỉ ra rằng một bản ghi trong bảng này chỉ liên kết với một bản ghi duy nhất trong bảng khác. Ví dụ, bảng người dùng và bảng hồ sơ người dùng, một người dùng chỉ có một hồ sơ. Vậy làm thế nào để thực hiện mối quan hệ một - một giữa bảng `user` và `info` trong `TypeORM`?

```ts
// user.entity.ts
@Entity('user')
export class UserEntity {
   @PrimaryGeneratedColumn()
   id: number;
   
   @Column()
   username: string;
   
   @OneToOne(type => InfoEntity, info => info.user)
   @JoinColumn()
   info: InformationEntity;
}
```

`info` là kiểu `InfoEntity`, nhưng khi lưu vào cơ sở dữ liệu, loại của nó lại là `info.id`. Từ đoạn mã trên, ta có thể thấy rằng mối quan hệ này được trang trí bởi `@OneToOne`, trong đó cần chỉ định loại của thực thể đối diện và khóa ngoại của thực thể đối diện.

> `@JoinColumn` phải ở và chỉ ở một phía của khóa ngoại trong mối quan hệ, bảng mà bạn đặt `@JoinColumn` sẽ chứa một `relation id` và khóa ngoại tới bảng của thực thể đối diện. Lưu ý không thể đặt ở cả hai phía của `entity`.

Hãy xem cách thực hiện thực thể `info`:

```ts
@Entity('info')
export class InfoEntity {
   @PrimaryGeneratedColumn()
   id: number;
   
   @Column()
   idcard: string;

   @Column()
   gender: string;
   
   @OneToOne(type => UserEntity, user => user.info)
   user: UserEntity;
}
```

Hai thực thể trên sẽ ánh xạ ra các bảng dữ liệu sau:

```bash
|                       bảng user                                         |
+--------+--------------+-----+-----------------+----------------------+
| Field  | Type         | Key | Default         | Extra                |
+--------+--------------+-----+-----------------+----------------------+
| id     | int(11)      | PRI | NULL            | auto_increment       |
| name   | varchar(255) |     | NULL            |                      |
| infoId | int(11)      | MUL | NULL            |                      |
+--------+--------------+-----+-----------------+----------------------+

|                       bảng info                                         |
+--------+--------------+-----+-----------------+----------------------+
| Field  | Type         | Key | Default         | Extra                |
+--------+--------------+-----+-----------------+----------------------+
| id     | int(11)      | PRI | NULL            | auto_increment       |
| idcard | varchar(255) |     | NULL            |                      |
| gender | varchar(255) |     | NULL            |                      |
+--------+--------------+-----+-----------------+----------------------+
```

Từ bảng dữ liệu đã sinh ra, ta thấy rằng định dạng `relation id` mặc định là `"xxId"`. Nếu bạn muốn đổi tên trong bảng dữ liệu, có thể sử dụng `@JoinColumn` để cấu hình, sẽ được thực hành trong ví dụ một - nhiều.
### Quan hệ một - nhiều

Trong quan hệ một - nhiều, một bản ghi trong bảng A có thể liên kết với một hoặc nhiều bản ghi trong bảng B. Ví dụ, mỗi loại bài viết có thể có nhiều bài viết, ngược lại một bài viết chỉ thuộc về một loại. Quan hệ giữa bảng bài viết và bảng phân loại này chính là quan hệ một - nhiều.

Hãy xem cách `TypeOrm` thực hiện loại quan hệ này trong mã:

```ts
// category.entity.ts
import { PostEntity } from "../../post/post.entity";

@Entity('category')
export class CategoryEntity {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   name: string;

   @OneToMany(() => PostEntity, post => post.category)
   post: PostEntity[];
}
```

`@OneToMany` được thêm vào thuộc tính `post`, và trong `@OneToMany` chỉ định loại của thực thể đối diện là `PostEntity`. Tiếp theo, định nghĩa thực thể bài viết:

```ts
// posts.entity.ts
...
import { CategoryEntity } from './../category/entities/category.entity';

@Entity('post')
export class PostsEntity {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({ length: 50 })
   title: string;

   // Phân loại
   @Exclude()
   @ManyToOne(() => CategoryEntity, (category) => category.posts)
   @JoinColumn({ name: "category_id" })
   category: CategoryEntity;
}
```

`@JoinColumn` không chỉ định nghĩa bên nào trong quan hệ sẽ chứa cột kết nối với khóa ngoại, mà còn cho phép tùy chỉnh tên cột kết nối và tên cột được tham chiếu. Trong thực thể `entity` của bài viết ở trên, tên cột được tùy chỉnh là `category_id`. Nếu không tùy chỉnh, tên cột mặc định sẽ là `categoryId`.

Khi `TypeORM` xử lý quan hệ “một - nhiều”, khóa chính của bảng “một” sẽ trở thành khóa ngoại của bảng “nhiều”, tức là thuộc tính được trang trí với `@ManyToOne`. Điều này giúp giảm chi phí thao tác dữ liệu khi tạo bảng, tránh dư thừa dữ liệu và nâng cao hiệu suất. Quan hệ thực thể trên sẽ tạo ra các bảng sau:

```bash
|                       bảng category                                       |
+--------+--------------+-----+-----------------+----------------------+
| Field  | Type         | Key | Default         | Extra                |
+--------+--------------+-----+-----------------+----------------------+
| id     | int(11)      | PRI | NULL            | auto_increment       |
| name   | varchar(255) |     | NULL            |                      |
+--------+--------------+-----+-----------------+----------------------+

|                       bảng post                                         |
+-------------+--------------+-----+------------+----------------------+
| Field       | Type         | Key | Default    | Extra                |
+-------------+--------------+-----+------------+----------------------+
| id          | int(11)      | PRI | NULL       | auto_increment       |
| title       | varchar(50)  |     | NULL       |                      |
| category_id | int(11)      |     | NULL       |                      |
+-------------+--------------+-----+------------+----------------------+
```

Tiếp theo, chúng ta sẽ xem xét quan hệ nhiều - nhiều.
### Quan hệ nhiều - nhiều

Trong quan hệ nhiều - nhiều, các bản ghi trong bảng A có thể liên kết với một hoặc nhiều bản ghi trong bảng B và ngược lại. Ví dụ, quan hệ giữa bài viết và thẻ là quan hệ nhiều - nhiều: một bài viết có thể có nhiều thẻ, và một thẻ cũng có thể liên kết với nhiều bài viết.

Hãy xem cách thực hiện loại quan hệ này trong `TypeOrm` qua mã sau:

```ts
// posts.entity.ts
...
import { TagEntity } from './../tag/entities/tag.entity';

@Entity('post')
export class PostsEntity {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({ length: 50 })
   title: string;

   // Thẻ
   @ManyToMany(() => TagEntity, (tag) => tag.posts)
   @JoinTable({
      name: 'post_tag',
      joinColumns: [{ name: 'post_id' }],
      inverseJoinColumns: [{ name: 'tag_id' }],
   })
   tags: TagEntity[];
}
```

Thực thể bảng thẻ:

```ts
// tag.entity.ts
...
import { PostsEntity } from 'src/posts/posts.entity';

@Entity('tag')
export class TagEntity {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({ length: 50 })
   name: string;

   @ManyToMany(() => PostsEntity, (post) => post.tags)
   posts: Array<PostsEntity>;
}
```

`@JoinTable` được sử dụng để mô tả quan hệ “nhiều - nhiều” và xác định cấu trúc của `bảng trung gian`. `Bảng trung gian` là một bảng riêng biệt, tự động tạo ra bởi TypeORM, chứa các cột tham chiếu đến các thực thể liên quan. Cấu hình `joinColumns` và `inverseJoinColumns` cho phép tùy chỉnh tên cột trong `bảng trung gian`.

> Lưu ý: Phiên bản mới sử dụng `joinColumns` và `inverseJoinColumns`, trong khi phiên bản trước đây chỉ sử dụng `joinColumn` (không có `s`).

Quan hệ giữa các thực thể trên sẽ tạo ra các bảng sau:

```bash
|                       bảng post                                      |
+-------------+--------------+-----+------------+----------------------+
| Field       | Type         | Key | Default    | Extra                |
+-------------+--------------+-----+------------+----------------------+
| id          | int(11)      | PRI | NULL       | auto_increment       |
| title       | varchar(50)  |     | NULL       |                      |
| category_id | int(11)      |     | NULL       |                      |
+-------------+--------------+-----+------------+----------------------+

|                       bảng tag                                       |
+-------------+--------------+-----+------------+----------------------+
| Field       | Type         | Key | Default    | Extra                |
+-------------+--------------+-----+------------+----------------------+
| id          | int(11)      | PRI | NULL       | auto_increment       |
| name        | varchar(50)  |     | NULL       |                      |
| category_id | int(11)      |     | NULL       |                      |
+-------------+--------------+-----+------------+----------------------+

|                       bảng post_tag                                  |
+-------------+--------------+-----+------------+----------------------+
| Field       | Type         | Key | Default    | Extra                |
+-------------+--------------+-----+------------+----------------------+
| tag_id      | int(11)      | PRI | NULL       | auto_increment       |
| post_id     | int(11)      |     | NULL       |                      |
+-------------+--------------+-----+------------+----------------------+
```

Dựa vào bảng được tạo trên, có thể thấy rằng cách `TypeORM` xử lý `nhiều - nhiều` là chuyển thành hai quan hệ `một - nhiều`:

- Bảng bài viết (post) với bảng trung gian (post_tag) là một - nhiều
- Bảng thẻ (tag) với bảng trung gian (post_tag) cũng là một - nhiều

### Tóm tắt

Ở phần trước, chúng ta đã tìm hiểu cách TypeORM xử lý các quan hệ một - một, một - nhiều, và nhiều - nhiều. Dưới đây là một số điểm tóm tắt đơn giản:

Các decorator quan hệ:

*   `@OneToOne`: Dùng để mô tả quan hệ một - một
*   `@ManyToOne` và `@OneToMany`: Dùng để mô tả quan hệ một - nhiều, trong đó `OneToMany` luôn là chiều ngược lại và luôn xuất hiện cùng với `ManyToOne`.
*   `@ManyToMany`: Dùng để mô tả quan hệ nhiều - nhiều
*   `@JoinColumn`: Xác định phía nào của quan hệ chứa cột kết nối có khóa ngoại và có thể tùy chỉnh tên của cột kết nối và cột tham chiếu
*   `@JoinTable`: Dùng để mô tả quan hệ “nhiều - nhiều” và xác định cột kết nối của `bảng trung gian`

## Triển khai API Bài viết

Dưới đây là một sơ đồ quan hệ thực thể đơn giản, giúp bạn dễ dàng hiểu các thực thể cần định nghĩa:

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7af6fc8ce84449e9d429453cd8eaa26~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

Từ sơ đồ, có thể thấy rằng chúng ta cần định nghĩa các thực thể người dùng `User`, danh mục `Category`, thẻ `Tag`, và bài viết `Post`, trong đó `User` và `Category` có quan hệ một - nhiều với `Post`, còn `Tag` và `Post` có quan hệ nhiều - nhiều.

Các API cần triển khai:

*   Tạo bài viết
*   Lấy danh sách tất cả bài viết
*   Lấy danh sách bài viết theo danh mục/thẻ/tác giả
*   Phân loại bài viết theo tháng
*   Lấy chi tiết bài viết
*   Cập nhật số lượt xem/lượt thích
*   Tìm kiếm bài viết bằng từ khóa

### Định nghĩa thực thể

Trong bài viết trước, đã thực hiện đăng ký, đăng nhập và định nghĩa thực thể người dùng, nên ở đây sẽ không nhắc lại. Dưới đây là định nghĩa cho thực thể bài viết:

```ts
@Entity('post')
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number; // Đánh dấu là cột chính, giá trị tự động tăng

  // Tiêu đề bài viết
  @Column({ length: 50 })
  title: string;

  // Nội dung markdown
  @Column({ type: 'mediumtext', default: null })
  content: string;

  // Nội dung markdown chuyển sang HTML, tự động sinh
  @Column({ type: 'mediumtext', default: null, name: 'content_html' })
  contentHtml: string;

  // Tóm tắt, tự động sinh
  @Column({ type: 'text', default: null })
  summary: string;

  // Ảnh bìa
  @Column({ default: null, name: 'cover_url' })
  coverUrl: string;

  // Lượt đọc
  @Column({ type: 'int', default: 0 })
  count: number;

  // Lượt thích
  @Column({ type: 'int', default: 0, name: 'like_count' })
  likeCount: number;

  // Đề xuất hiển thị
  @Column({ type: 'tinyint', default: 0, name: 'is_recommend' })
  isRecommend: number;

  // Trạng thái bài viết
  @Column('simple-enum', { enum: ['draft', 'publish'] })
  status: string;

  // Tác giả
  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  // Danh mục
  @Exclude()
  @ManyToOne(() => CategoryEntity, (category) => category.posts)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  // Thẻ
  @ManyToMany(() => TagEntity, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tag',
    joinColumns: [{ name: 'post_id' }],
    inverseJoinColumns: [{ name: 'tag_id' }],
  })
  tags: TagEntity[];

  @Column({ type: 'timestamp', name: 'publish_time', default: null })
  publishTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;
}
```

Các trường dữ liệu bài viết được liệt kê ở đây, trong đó `contentHtml` và `summary` sẽ được tự động sinh dựa trên nội dung bài viết do người dùng cung cấp. Trường `publishTime` chỉ có giá trị khi trạng thái bài viết là `publish`. Các trường này sẽ được xử lý riêng trong quá trình thêm/cập nhật bài viết.
## Thực hiện thêm bài viết mới

Đối với chức năng thêm bài viết mới, chúng ta sẽ phân tách các logic liên quan từng bước như sau:

Trước tiên, không phải ai cũng có quyền tạo bài viết. Người dùng phải đăng nhập để kiểm tra `token`, và chỉ các vai trò `admin` hoặc `root` mới được phép tạo bài viết. Nếu là khách `visitor`, họ sẽ không có quyền tạo.

Tiếp theo, cần kiểm tra các trường thông tin. `title` của bài viết là bắt buộc, nếu không có thì không thể tạo. Đồng thời, tiêu đề bài viết không được trùng lặp, nên cần kiểm tra xem bài viết muốn thêm có tồn tại hay chưa.

Sau đó, chúng ta cần xử lý phần thêm danh mục và thẻ, và cũng cần xác định `status` là bản nháp `draft` hay đã đăng `publish`. Nếu là `publish`, cần đặt `publishTime` thành thời gian hiện tại.

Theo cách đó, chúng ta sẽ thực hiện lần lượt các bước. Đầu tiên, kiểm tra xem người dùng có quyền thêm bài viết hay không.

### Định nghĩa `RoleGuard` cho ủy quyền

Thực chất `ủy quyền` bao gồm hai bước:

*   Xác thực (identification): Kiểm tra người dùng có phải là người hợp lệ không, để xác nhận danh tính người dùng. Bước này không liên quan đến quyền hạn, như ở bài viết trước về [xác thực đăng nhập](https://link.juejin.cn?target=) giúp lấy `token`.
    
*   Ủy quyền (authorization): Người dùng đã được xác thực sẽ có vai trò tương ứng. Các vai trò khác nhau sẽ có quyền hạn khác nhau. Ví dụ, khách chỉ có thể xem và thích bài viết, không thể viết bài.
    

Do đó, chúng ta cần xử lý `ủy quyền` để kiểm tra quyền thực hiện của người dùng. Trong NestJS, có thể sử dụng `Guard` để triển khai.

Guard thực chất là một dạng middleware. Nếu yêu cầu hiện tại không được phép, Guard sẽ chặn yêu cầu và các middleware sau đó sẽ không được gọi.

1. Trong mô-đun `auth`, tạo file `role.guard.ts` để định nghĩa guard kiểm tra xác thực dựa trên vai trò. Middleware cần được sử dụng `@Injectable()` và triển khai interface `canActivate`.

```typescript
// role.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy vai trò từ đường dẫn
    const roles = this.reflector.get('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    // Lấy thông tin người dùng
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      return false;
    }
    // Kiểm tra vai trò của người dùng có trong danh sách yêu cầu không và trả về giá trị boolean
    const hasRoles = roles.some((role) => role === user.role);
    return hasRoles;
  }
}
```

2. Định nghĩa một decorator `@Roles` để thiết lập vai trò cho route:

```typescript
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

3. Sử dụng `RoleGuard` trong controller của route, thiết lập vai trò `admin` và `root` có thể truy cập route bằng decorator `@Roles`:

```typescript
// posts.controller.ts
@ApiOperation({ summary: 'Tạo bài viết' })
@ApiBearerAuth()
@Post()
@Roles('admin', 'root')
@UseGuards(AuthGuard('jwt'), RolesGuard)
async create(@Body() post: CreatePostDto, @Req() req) {
  return await this.postsService.create(req.user, post);
}
```

Phân tích đơn giản mã code trên:

*   Để lấy vai trò có thể truy cập route, sử dụng decorator `@Roles`, hỗ trợ bởi lớp `Reflector` (được cung cấp bởi framework, import từ `@nestjs/core`).
*   Trước khi ủy quyền, cần xác thực `token` trước. Sau khi xác thực, mới thực hiện kiểm tra quyền hạn vai trò.
    *   Có thể lấy `user` từ đối tượng `request`.
    *   Khi sử dụng Guard, thực hiện xác thực trước `@UseGuards(AuthGuard('jwt'), RolesGuard)`.
*   Kiểm tra vai trò của người dùng có nằm trong danh sách vai trò của route yêu cầu:
    *   Nếu có, trả về `true`, cho phép truy cập.
    *   Nếu không, trả về `false`, chặn yêu cầu và đưa ra lỗi `ForbiddenException` (có thể tùy chỉnh thông báo lỗi).

### Triển khai logic nghiệp vụ

```typescript
// posts.service.ts 
async create(user, post: CreatePostDto): Promise<number> {
  const { title } = post;
  
  // Kiểm tra nếu thiếu tiêu đề bài viết
  if (!title) {
    throw new HttpException('Thiếu tiêu đề bài viết', HttpStatus.BAD_REQUEST);
  }
  
  // Kiểm tra nếu bài viết đã tồn tại
  const doc = await this.postsRepository.findOne({
    where: { title },
  });
  if (doc) {
    throw new HttpException('Bài viết đã tồn tại', HttpStatus.BAD_REQUEST);
  }

  let { tag, category = 0, status, isRecommend, coverUrl } = post;

  // Lấy thông tin danh mục dựa trên id
  const categoryDoc = await this.categoryService.findById(category);
  
  // Lấy danh sách thẻ dựa trên id thẻ (ví dụ: '1,2')
  const tags = await this.tagService.findByIds(('' + tag).split(','));
  
  const postParam: Partial<PostsEntity> = {
    ...post,
    isRecommend: isRecommend ? 1 : 0,
    category: categoryDoc,
    tags: tags,
    author: user,
  };

  // Nếu trạng thái là 'publish' thì đặt thời gian phát hành
  if (status === 'publish') {
    Object.assign(postParam, {
      publishTime: new Date(),
    });
  }

  // Tạo bài viết mới trong cơ sở dữ liệu
  const newPost: PostsEntity = await this.postsRepository.create({
    ...postParam,
  });
  const created = await this.postsRepository.save(newPost);
  
  return created.id;
}
```

## Truy vấn liên kết bảng

Lấy ví dụ về việc lấy danh sách tất cả các bài viết, điểm chính của việc triển khai interface này là thực hiện truy vấn liên kết nhiều bảng. Trước tiên, chúng ta cần tìm hiểu cách thực hiện truy vấn liên kết nhiều bảng. Dưới đây là ba cách truy vấn liên kết nhiều bảng mà `TypeORM` cung cấp:

*   Tùy chọn Find
*   Query Builder
*   SQL nguyên bản

### Tùy chọn `find`

Tất cả các phương thức `find` của repository và manager đều chấp nhận các tùy chọn đặc biệt để bạn có thể truy vấn dữ liệu cần thiết:

Truy vấn tất cả các bài viết (không có liên kết bảng):

```typescript
const postRepository = connect.getRepository(PostsEntity)
const result = await postRepository.find()
```

SQL được thực thi sẽ tương tự như sau:

```sql
select * from post
```

Sử dụng `select` để chỉ định các trường muốn truy vấn:

```typescript
const postRepository = connect.getRepository(PostsEntity)
const result = await postRepository.find({ select: ["id", "title"] })
```

SQL được thực thi sẽ tương tự như sau:

```sql
select id, title from post
```

Điều kiện truy vấn được chỉ định thông qua `where`, tại đây sẽ không trình bày từng ví dụ mà sẽ tập trung vào cách thực hiện truy vấn liên kết nhiều bảng bằng `find` thông qua tùy chọn `relations` (yêu cầu có quan hệ khóa ngoại trước đó):

```typescript
const postRepository = connect.getRepository(PostsEntity)
const result = await postRepository.find({ relations: ["author"] })
```

SQL được thực thi sẽ tương tự như sau:

```sql
select a.*, b.* from post as a left join user as b on a.authorId = b.id
```

Ngoài việc sử dụng tùy chọn `find` để thực hiện truy vấn, `TypeORM` còn cung cấp một phương pháp khác là `QueryBuilder`.

### Liên quan đến QueryBuilder

Phương thức `find` rất gọn gàng nhưng không thể đáp ứng được mọi tình huống. `QueryBuilder` là một trong những tính năng mạnh nhất của `TypeORM`, cho phép chúng ta xây dựng các truy vấn SQL với cú pháp thanh lịch và tiện lợi, thực thi và tự động chuyển đổi thành các thực thể.

Có ba cách để tạo `QueryBuilder`:

```typescript
// 1. Sử dụng connection:
import { getConnection } from "typeorm";
const user = await getConnection()
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .where("user.id = :id", { id: 1 })
    .getOne();

// 2. Sử dụng entity manager:
import { getManager } from "typeorm";
const user = await getManager()
    .createQueryBuilder(User, "user")
    .where("user.id = :id", { id: 1 })
    .getOne();

// 3. Sử dụng repository:
import { getRepository } from "typeorm";
const user = await getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne();
```

Trong `QueryBuilder`, phương thức phổ biến để thực hiện truy vấn liên kết bảng là `leftJoinAndSelect`. Cùng xem cách sử dụng:

```typescript
const posts = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags','tag')
      .getMany()
```

Kết quả truy vấn:

```json
[
  {
    "id": 46,
    "title": "文章1",
    "content": "测试文章内容输入....",
    ...
    "tags": [
      {
        "id": 1,
        "name": "vue"
      },
      {
        "id": 9,
        "name": "vuex"
      }
    ]
  }
]
```

Kết quả trên cho thấy `leftJoinAndSelect` đã tự động tải tất cả các thẻ `tags` của bài viết "文章1".

`leftJoinAndSelect` có tham số đầu tiên là quan hệ cần tải, và tham số thứ hai là bí danh cho bảng quan hệ đó. Chúng ta có thể dùng bí danh này ở bất kỳ đâu trong `QueryBuilder`. Ví dụ, để lọc các bài viết có tên thẻ là `node`:

```typescript
const posts = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags','tag')
      .where('tag.name=:name', { name: 'node' })
      .getMany()
```

### Câu lệnh SQL nguyên bản

Sử dụng các kiến thức về `find` và `QueryBuilder`, chúng ta có thể tạo API lấy danh sách bài viết. Ở đây, tôi sử dụng `QueryBuilder`, trong khi mã nguồn còn có phương pháp `find` cho bạn tự khám phá.

```typescript
async findAll(query): Promise<PostsRo> {
    const qb = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.author', 'user')
      .orderBy('post.updateTime', 'DESC');
    qb.where('1 = 1');
    qb.orderBy('post.create_time', 'DESC');
    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));
    let posts = await qb.getMany();
    const result: PostInfoDto[] = posts.map((item) => item.toResponseObject());
    return { list: result, count: count };
}
```

Trong đoạn mã trên, phương thức `toResponseObject` được dùng để định dạng dữ liệu trả về. Phương thức này được định nghĩa trong `posts.entity.ts` để xử lý dữ liệu theo yêu cầu của phía front-end, chẳng hạn như hiển thị tên của nhiều thẻ thay vì cả đối tượng, hoặc làm tương tự với `user` và `category`.

```typescript
// posts.entity.ts
toResponseObject(): PostInfoDto {
    let responseObj: PostInfoDto = {
      ...this,
      isRecommend: this.isRecommend ? true : false,
    };
    if (this.category) {
      responseObj.category = this.category.name;
    }
    if (this.tags && this.tags.length) {
      responseObj.tags = this.tags.map((item) => item.name);
    }
    if (this.author && this.author.id) {
      responseObj.userId = this.author.id;
      responseObj.author = this.author.nickname || this.author.username;
    }
    return responseObj;
}
```

Cuối cùng, dữ liệu sau khi truy vấn sẽ có định dạng gọn gàng hơn:

```json
{
  "data": {
    "list": [
      {
        "id": 47,
        "title": "2323232",
        "content": "string",
        "status": "publish",
        "category": "前端",
        "tags": ["JavaScript", "node"],
        "author": "admin",
        "userId": "d2244619-f6a9-4bb2-b00f-b809eb9a458a"
      }
    ],
    "count": 7
  },
  "code": 0,
  "msg": "请求成功"
}
```

## Lượng xem bài viết

Đối với việc đếm số lần xem bài viết, chúng tôi sử dụng phương pháp là cộng dồn số lượt xem khi lấy chi tiết bài viết. Đầu tiên, cần lưu ý rằng việc thực hiện này chỉ là một giải pháp tạm thời; mặc dù đơn giản, nhưng vẫn có một số vấn đề:

* Khi có nhiều người đọc nội dung cùng lúc, có thể gặp phải vấn đề khóa.
* Khi lưu lượng lớn, việc đồng thời đọc và sửa đổi cùng một dữ liệu sẽ gây áp lực lớn lên cơ sở dữ liệu.
* Cùng một người liên tục truy cập vào trang cũng dễ dàng dẫn đến độ chính xác của dữ liệu không cao.

Để giải quyết những vấn đề nêu trên, có giải pháp có thể sử dụng `redis` để xử lý một cách thuận tiện. Do một số bạn không quen thuộc với `redis`, nên sau này sẽ có một bài viết riêng về `redis` và cách áp dụng trong dự án của chúng tôi.

**Cách thực hiện cộng dồn lượt xem +1**

Trong tệp `posts.service.ts`, mã nghiệp vụ được thực hiện như sau:

```ts
async findById(id): Promise<any> {     
    const qb = this.postsRepository       
        .createQueryBuilder('post')       
        .leftJoinAndSelect('post.category', 'category')       
        .leftJoinAndSelect('post.tags', 'tag')       
        .leftJoinAndSelect('post.author', 'user')       
        .where('post.id=:id')       
        .setParameter('id', id);     

    const result = await qb.getOne();     

    if(!result) throw new HttpException(`id là ${id} không tồn tại`, HttpStatus.BAD_REQUEST);     
    await this.postsRepository.update(id, {count: result.count+1})          

    return result.toResponseObject();   
}
```

## Tải tệp lên COS

Trong định nghĩa thực thể bài viết trước đó có trường ảnh bìa bài viết `coverUrl`. Chúng tôi không tải ảnh bìa trực tiếp lên máy chủ mà sử dụng dịch vụ lưu trữ đối tượng COS của Tencent Cloud.

Chúng ta đều biết cách thực hiện tải tệp lên phía trước, nhưng việc tiết lộ `SecretId` và `SecretKey` trên trang phía trước rất dễ dẫn đến rò rỉ, gây ra rủi ro an ninh nghiêm trọng. Do đó, việc tải tệp lên Tencent Cloud COS nên được thực hiện ở phía sau là hợp lý hơn.

Để tiết kiệm tài nguyên và tái sử dụng tài nguyên, trong quá trình tải lên hình ảnh, chúng tôi sẽ tính toán giá trị MD5 của hình ảnh để so sánh tệp đã tồn tại hay chưa. Nếu tệp đã tồn tại thì không cần tải lên nữa, mà sẽ trả về địa chỉ tệp đã được tìm thấy.

**Quy trình thực hiện tải tệp lên:**

* Đầu tiên, lấy tệp được tải lên.
* Dựa vào phần mở rộng tệp để xác định loại tệp và chỉ định đường dẫn tải lên (tải tệp loại khác nhau vào các thư mục tương ứng).
* Mã hóa MD5 tệp để tạo chuỗi, phục vụ cho việc đặt tên tệp.
* Kiểm tra xem tệp đã tồn tại trong COS hay chưa.
  * Nếu có, nối đường dẫn tệp và trả về.
  * Nếu không, gọi API của Tencent để tải tệp lên COS.
### Tải tệp lên trong Nest.js

Để xử lý việc tải tệp lên, `Nest.js` cung cấp một mô-đun tích hợp dựa trên gói trung gian `multer` cho `Express`. `Multer` xử lý dữ liệu được phát hành theo định dạng `multipart/form-data`, định dạng này chủ yếu được sử dụng để tải tệp lên thông qua yêu cầu HTTP POST.

Chúng ta không cần cài đặt lại `multer`, nhưng để có gợi ý mã tốt hơn và kiểm tra kiểu, tốt nhất là cài đặt gói kiểu:

```css
npm i -D @types/multer
```

Để thực hiện tải lên một tệp, chỉ cần liên kết bộ lọc `FileInterceptor()` với tuyến đường, sau đó sử dụng bộ trang trí `@UploadFile` để trích xuất tệp từ yêu cầu.

```ts
@Post('upload')   
@ApiOperation({ summary: 'Tải lên tệp' })   
@ApiConsumes('multipart/form-data')   
@UseInterceptors(FileInterceptor('file'))   
async uploadFile(@UploadedFile('file') file: Express.Multer.File) {     
    return await this.appService.upload(file);   
}
```

Bằng cách này, chúng ta có thể lấy được tệp đã tải lên. Lúc này, tệp mà chúng ta nhận được như sau:

```arduino
{   
    fieldname: 'file',   
    originalname: '1636192811zfb.jpg',   
    encoding: '7bit',   
    mimetype: 'image/jpeg',   
    buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 01 96 00 00 02 44 08 06 00 00 00 35 e6 02 2f 00 00 00 01 73 52 47 42 00 ae ce 1c e9 00 00 00 04 ... 62223 more bytes>,   
    size: 62273 
}
```

Tuy nhiên, chúng ta muốn xử lý tên tệp và phần mở rộng của tệp một chút, làm thế nào để thực hiện điều này?

Cách thứ nhất: Đưa vào `service` để xử lý, cách này không có gì nhiều để nói thêm.

Hãy nói về một cách khác, đó là cấu hình `multer` với `diskStorage`, để tệp tải lên có phần mở rộng và tên được mã hóa theo MD5.

Mã thực hiện:

```ts
const image = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'webp']; 
const video = ['mp4', 'webm']; 
const audio = ['mp3', 'wav', 'ogg']; 
...   

@UseInterceptors( 
    FileInterceptor('file', {       
        storage: multer.diskStorage({         
            // Cấu hình vị trí lưu trữ tệp sau khi tải lên         
            destination: (req, file, cb) => {           
                // Dựa vào loại tệp đã tải lên, lưu trữ hình ảnh, video, âm thanh và các loại tệp khác vào các thư mục tương ứng           
                const mimeType = file.mimetype.split('/')[1];           
                let temp = 'other';           
                image.filter((item) => item === mimeType).length > 0             
                    ? (temp = 'image')             
                    : '';           
                video.filter((item) => item === mimeType).length > 0             
                    ? (temp = 'video')             
                    : '';           
                audio.filter((item) => item === mimeType).length > 0             
                    ? (temp = 'audio')             
                    : '';           
                const filePath = `${config.fileTempPath}${temp}`;           
                // Kiểm tra xem thư mục đã tồn tại hay chưa, nếu chưa thì tự động tạo           
                if (!fs.existsSync(filePath)) {             
                    fs.mkdirSync(filePath);           
                }           
                return cb(null, `${filePath}`);         
            },         
            // Cấu hình tên tệp         
            filename: async (req, file, cb) => {           
                const index = file.originalname.lastIndexOf('.');           
                const md5File = await getMd5File(file);           
                // Lấy phần mở rộng           
                const ext = file.originalname.substr(index);           
                cb(null, md5File + ext);         
            },       
        }),     
    }), 
)
```

Việc mã hóa MD5 cho tệp được thực hiện như sau, sử dụng `crypto` để thực hiện mã hóa:

```ts
function getMd5File(file) {     
    const buffer = Buffer.from(JSON.stringify(file), 'utf-8')     
    const md5File = crypto           
        .createHash('md5')           
        .update(JSON.stringify(buffer))           
        .digest('hex');           
    return md5File   
}
```

Sau khi nhận được tên tệp được mã hóa bằng MD5, tiếp theo là tích hợp API đối tượng của Tencent Cloud, chủ yếu sử dụng hai API: `Tải lên tệp` và `Lấy đối tượng tệp`.

### Lưu trữ tệp trên Tencent Cloud

Trước tiên, chúng ta cần có tài khoản Tencent Cloud và kích hoạt tính năng lưu trữ đối tượng, sau đó lấy `SecretId` và `SecretKey` của lưu trữ đối tượng.

Đầu tiên, cài đặt SDK phiên bản `Node.js` mà Tencent Cloud cung cấp, đó là `cos-nodejs-sdk-v5`.

```bash
npm install cos-nodejs-sdk-v5 --save
```

Khởi tạo đối tượng `COS`, cần sử dụng `SecretId` và `SecretKey`. Tôi sẽ viết hai biến này trong tệp `.env`:

```typescript
const { env } = process;
const cos = new COS({
    SecretId: env.TXSecretId,
    SecretKey: env.TXSecretKey,
});
```

**Thực hiện tải tệp lên:**

```typescript
async uploadFile(cosName: string, localPath: string): Promise<UploadFileRo> {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: env.Bucket,
            Region: env.Region,
            Key: this.cosPath + cosName, // Địa chỉ ảnh cos
            FilePath: localPath /* bắt buộc, địa chỉ cục bộ */,
            SliceSize: 1024 * 1024 * 2 /* nếu lớn hơn 2MB thì sử dụng tải lên theo phân khúc, không bắt buộc */,
        };
        cos.uploadFile({
                ...params,
                onFileFinish: (err, data, options) => {
                    console.log(options.Key + ' đã ' + (err ? 'thất bại' : 'hoàn thành') + ' khi tải lên');
                }
            },
            (err, data) => {
                // Xóa tệp cục bộ
                fs.unlinkSync(localPath);
                if (err) throw new HttpException(err, 401);
                resolve({
                    url: 'https://' + data.Location,
                    filename: cosName,
                } as UploadFileRo);
            },
        );
    });
}
```

Gọi phương thức `uploadFile` của `cos`, mô tả các tham số:

- **Bucket**: Tên của kho lưu trữ.
- **Region**: Khu vực nơi kho lưu trữ nằm.
- **Key**: Định danh duy nhất của đối tượng trong kho lưu trữ, cần lưu ý bao gồm đường dẫn trong kho lưu trữ, không chỉ là tên tệp.
- **FilePath**: Đường dẫn của tệp được tải lên.
- **SliceSize**: Thiết lập kích thước tải lên theo phân khúc.

Cuối cùng, nhớ xóa các tệp tồn tại trên máy chủ, nếu không, số lượng tệp sẽ tăng lên và chiếm dụng không gian. Cũng có thể tối ưu hóa điều này.

**Lấy đối tượng tệp**

```typescript
async getFile(filename: string, localPath: string): Promise<UploadFileRo> {
    return new Promise((resolve, reject) => {
        cos.getBucket({
                Bucket: env.Bucket,
                Region: env.Region,
                Prefix: this.cosPath + filename
            },
            (err, data) => {
                // Xóa tệp cục bộ
                fs.unlinkSync(localPath);
                if (err) {
                    reject(err);
                    throw new HttpException(err, 401);
                }
                // Tệp đã tồn tại
                if (data.Contents && data.Contents.length > 0) {
                    resolve({ url: this.urlPrefix + this.cosPath + filename })
                } else {
                    resolve({ url: '' });
                }
            }
        );
    });
}
```

Khi lấy được tệp, nối địa chỉ tệp và trả về. Trước đó, chúng ta đã thực hiện tải tệp lên Tencent Cloud và lấy tệp, việc cuối cùng cần làm là xác định thời điểm nào gọi để tải lên.

Đầu tiên, cần gọi phương thức lấy đối tượng tệp `getFile` để kiểm tra xem tệp hiện tại đã tồn tại trong Tencent Cloud COS chưa. Nếu đã tồn tại, trả về kết quả ngay; ngược lại, thực hiện tải lên, thực hiện trong tệp `app.service.ts`:

```typescript
import { CosService, UploadFileRo } from './core/shared-service/cos.service';
@Injectable()
export class AppService {
    constructor(private readonly cosService: CosService) {}
    async upload(file): Promise<UploadFileRo> {
        // Kiểm tra xem tệp có tồn tại hay không
        const existFile = await this.cosService.getFile(file.filename, file.path);
        if (existFile.url) {
            return existFile;
        }
        return await this.cosService.uploadFile(file.filename, file.path);
    }
}
```

Việc tải lên một tệp đơn lên Tencent Cloud đã hoàn thành. Có thể suy nghĩ về cách thực hiện tải lên nhiều tệp~

Về việc thực hiện mô-đun bài viết, có thể sử dụng middleware để tự động tạo tóm tắt bài viết và chuyển đổi `markdown` sang `html`, thực hiện khá đơn giản, không giới thiệu chi tiết vì dài dòng.
## Tóm tắt

Mục tiêu của series Nest.js:

1. Hy vọng giúp các nhà phát triển Node thành thạo trong việc sử dụng framework Nest.js.
2. Giúp các bạn front-end muốn học Node.js có một cách tiếp cận tốt hơn với một framework Node xuất sắc. Series này sẽ được cập nhật liên tục, các bạn quan tâm có thể star để theo dõi, cảm ơn!

Dự kiến các bài viết tiếp theo sắp tới sẽ đi vào chi tiết các kiến thức cốt lõi của Nest.js, kết hợp với `Redis` để giải quyết các vấn đề còn tồn đọng từ các bài viết trước, và sẽ giải thích về ứng dụng nâng cao của thao tác cơ sở dữ liệu.