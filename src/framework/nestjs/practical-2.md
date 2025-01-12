---
title: NestJS Practice 2
tags:
  - nestjs
  - framework
categories:
  - nestjs
order: 2
---
  

# NestJS thực chiến 2 - Authentication, JWT

## Lời mở đầu

[Trong bài viết trước, chúng ta đã hoàn thành phần thực hành Nest.js, nếu bạn chưa bắt đầu thì hãy đọc nó trước!](./practical-1) ở đây đã giới thiệu cho bạn về `Nest.js`. Tiếp theo, chúng ta sẽ tiếp tục phát triển dựa trên mã trước đó, với hai nhiệm vụ chính: thực hiện đăng ký và đăng nhập cho người dùng.

Trước khi thực hiện đăng nhập và đăng ký, chúng tôi muốn người dùng đăng nhập bằng tài khoản và mật khẩu. Nội dung bài viết sẽ được trình bày như sau:

```mermaid
mindmap
	root(NestJS Authentication)
		Register User
			bcryptjs encrypt password
			compare password method
		Local Authentication
			passport
			local authentication
			jwt generate token
			AuthGuad middleware
			
```

Tiếp theo, chúng ta sẽ bắt đầu từ nội dung chương trước...

Trước đây, chúng ta đã tạo các file một cách tuần tự, nhưng còn một cách nhanh hơn để tạo các file `Controller`, `Service`, `Module` và `DTO`:

```sh
nest g resource user
```

Với cách này, chúng ta đã nhanh chóng tạo ra một module `REST API`, bên trong đã có sẵn mã cho các thao tác `CRUD` đơn giản, thật tuyệt vời! Chúng ta đã có thể hoàn thành một nửa nội dung đã học trong chương trước chỉ bằng một câu lệnh!
## Đăng ký người dùng

Trong chức năng đăng ký, khi người dùng đăng ký thông qua tên người dùng và mật khẩu, chúng ta không thể lưu mật khẩu dưới dạng văn bản rõ ràng trong cơ sở dữ liệu, vì vậy chúng ta sử dụng `bcryptjs` để mã hóa, sau đó lưu vào cơ sở dữ liệu.

Trước khi thực hiện đăng ký, hãy tìm hiểu về giải pháp mã hóa `bcryptjs` và cài đặt gói phụ thuộc:

```bash
npm install bcryptjs
```

`bcryptjs` là một gói mã hóa với `salt` khá tốt trong Node.js, chúng ta sẽ sử dụng hai phương thức để xử lý mã hóa và xác thực mật khẩu:

```javascript
/**
 * Mã hóa - Phương thức đồng bộ
 * bcryptjs.hashSync(data, salt)
 * - data: Dữ liệu cần mã hóa
 * - salt: Muối dùng để băm mật khẩu. Nếu chỉ định là số, sẽ sử dụng số vòng đã chỉ định để tạo muối. Khuyến nghị 10
 */
const hashPassword = bcryptjs.hashSync(password, 10);

/**
 * Xác thực - Sử dụng phương thức đồng bộ
 * bcryptjs.compareSync(data, encrypted)
 * - data: Dữ liệu cần so sánh, sử dụng mật khẩu được truyền từ lúc đăng nhập
 * - encrypted: Dữ liệu cần so sánh, sử dụng mật khẩu đã được mã hóa truy vấn từ cơ sở dữ liệu
 */
const isOk = bcryptjs.compareSync(password, encryptPassword);
```

Tiếp theo, thiết kế thực thể người dùng:

```typescript
// use/entities/user.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 100 })
  username: string; // Tên người dùng

  @Column({ length: 100 })
  nickname: string;  // Biệt danh

  @Column()
  password: string;  // Mật khẩu

  @Column()
  avatar: string;   // Ảnh đại diện

  @Column()
  email: string;

  @Column('simple-enum', { enum: ['root', 'author', 'visitor'] })
  role: string;   // Vai trò người dùng

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert()
  async encryptPwd() {
    this.password = await bcrypt.hashSync(this.password);
  }
}
```

1. Trong việc tạo thực thể `User`, sử dụng `@PrimaryGeneratedColumn('uuid')` để tạo một cột chính `id`, giá trị này sẽ được tự động tạo bằng `uuid`. `Uuid` là một chuỗi duy nhất.
2. Thực hiện **đổi tên từ dạng camelCase sang dạng gạch dưới**; các trường `createTime` và `updateTime` được lưu dưới dạng gạch dưới trong cơ sở dữ liệu, chỉ cần chỉ định thuộc tính `name` trong bộ trang trí `@Column`.
3. Chúng ta đã sử dụng bộ trang trí `@BeforeInsert` để trang trí phương thức `encryptPwd`, cho biết phương thức này sẽ được gọi trước khi dữ liệu được chèn vào, như vậy sẽ đảm bảo rằng mật khẩu được chèn vào cơ sở dữ liệu đều đã được mã hóa.
4. Hệ thống blog được thiết lập với ba vai trò: `root`, `author` và `visitor`. Vai trò `root` có tất cả quyền hạn, `author` có quyền viết bài, và `visitor` chỉ có thể đọc bài viết. Người dùng đăng ký mặc định là `visitor`, tài khoản có quyền `root` có thể thay đổi vai trò của người dùng.

Tiếp theo, thực hiện business logic để đăng ký người dùng.

### Đăng ký người dùng

Thực hiện logic trong `user.service.ts`:

```typescript
import { User } from './entities/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(createUser: CreateUserDto) {
    const { username } = createUser;
    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existUser) {
      throw new HttpException("Tên người dùng đã tồn tại", HttpStatus.BAD_REQUEST);
    }
    const newUser = await this.userRepository.create(createUser);
    return await this.userRepository.save(newUser);
  }
}
```

Tôi nhớ lúc đó, khi viết dữ liệu vào cơ sở dữ liệu, tôi không xem kỹ tài liệu, gọi thẳng `create`, và kết quả là dữ liệu không được chèn vào cơ sở dữ liệu, sau đó phát hiện ra rằng phương thức `save` mới là phương thức thực thi chèn dữ liệu.

```typescript
this.userRepository.create(createUser) // Tương đương với new User(createUser) // Chỉ tạo một đối tượng người dùng mới
```

Đến đây, chúng ta đã hoàn thành business logic để đăng ký người dùng. `Controller` khá đơn giản, các phần logic như đăng nhập sẽ không trình bày mã `Controller` từng phần nữa:

```typescript
// user.controller.ts
@ApiOperation({ summary: 'Đăng ký người dùng' })
@ApiResponse({ status: 201, type: [User] })
@Post('register')
register(@Body() createUser: CreateUserDto) {
  return this.userService.register(createUser);
}
```

Thực thi đoạn mã trên, dữ liệu trả về sẽ như sau:

```json
{
  "data": {
    "username": "admin",
    "password": "$2a$10$vrgqi356K00XY6Q9wrSYyuBpOIVf2E.Vu6Eu.HQcUJP.hDTuclSEW",
    "nickname": null,
    "avatar": null,
    "email": null,
    "id": "5c240dcc-a9b1-4262-8212-d5ceb2815ef8",
    "createTime": "2021-11-16T03:00:16.000Z",
    "updateTime": "2021-11-16T03:00:16.000Z"
  },
  "code": 0,
  "msg": "success"
}
```

Có thể thấy mật khẩu cũng được trả về, và rõ ràng rủi ro của API này là rất lớn, vậy phải xử lý như thế nào? Có thể suy nghĩ một chút...

Từ hai khía cạnh, một là từ tầng dữ liệu, không trả về trường `password` từ cơ sở dữ liệu, cách khác là xử lý dữ liệu khi trả về cho người dùng, không trả về cho frontend. Chúng ta sẽ xem xét hai cách này:

**Cách 1**

Thuộc tính cột do TypeORM cung cấp `select`, **ẩn cột này theo mặc định trong truy vấn**. Nhưng điều này chỉ có thể sử dụng trong truy vấn, ví dụ dữ liệu trả về từ phương thức `save` vẫn sẽ bao gồm `password`.

```typescript
// user.entity.ts
@Column({ select: false }) // Biểu thị cột này bị ẩn
password: string; // Mật khẩu
```

Sử dụng cách này, mã trong `user.service.ts` có thể được sửa đổi như sau:

```typescript
// user.service.ts
async register(createUser: CreateUserDto) {
  ...
  await this.userRepository.save(newUser);
  return await this.userRepository.findOne({ where: { username } });
}
```

**Cách 2**

Sử dụng `class-transformer` cung cấp `Exclude` để tuần tự hóa, loại bỏ trường `password` trong dữ liệu trả về. Đầu tiên, trong `user.entity.ts`, sử dụng bộ trang trí `@Exclude`:

```typescript
// user.entity.ts
import { Exclude } from 'class-transformer';

@Exclude()
@Column()
password: string; // Mật khẩu
```

Sau đó, đánh dấu sử dụng `ClassSerializerInterceptor` ở nơi yêu cầu tương ứng, lúc này, dữ liệu trả về của yêu cầu `POST /api/user/register` sẽ không chứa trường `password`.

```typescript
@UseInterceptors(ClassSerializerInterceptor)
@Post('register')
register(@Body() createUser: CreateUserDto) { ... }
```

Bây giờ, không cần phải sửa đổi logic trong `user.service.ts` như cách 1. Nếu bạn muốn tất cả các yêu cầu trong `Controller` này không bao gồm trường `password`, có thể đánh dấu trực tiếp lớp với `ClassSerializerInterceptor`.

> Thực ra, việc kết hợp cả hai cách này cũng hoàn toàn khả thi.

## Đăng nhập người dùng

Phần đăng nhập người dùng được đề xuất sử dụng hai phương thức, một là xác thực cục bộ (tên người dùng & mật khẩu), hai là sử dụng đăng nhập bằng quét mã QR của WeChat. Hãy cùng xem cách triển khai đăng nhập bằng xác thực cục bộ.

### passport.js

Trước tiên, giới thiệu về một middleware chuyên dụng để xác thực trong Node.js: `Passport.js`. Middleware này chỉ có chức năng đăng nhập, nhưng lại rất mạnh mẽ, hỗ trợ xác thực tài khoản cục bộ và xác thực tài khoản bên thứ ba (OAuth và OpenID, v.v.), hỗ trợ hầu hết các trang web và dịch vụ.

Khái niệm quan trọng nhất trong `passport` là "chiến lược" (strategy). Module `passport` bản thân không thực hiện xác thực, tất cả các phương pháp xác thực đều được đóng gói dưới dạng plugin theo mô hình chiến lược. Khi cần sử dụng loại xác thực nào, chỉ cần thêm nó vào `package.json`. Ở đây, tôi sẽ không trình bày chi tiết về nguyên lý thực hiện của `passport`, nếu bạn quan tâm có thể để lại bình luận, tôi sẽ chuẩn bị một bài viết riêng về các khía cạnh của xác thực đăng nhập (Node.js không chỉ có `passport`, còn nhiều gói khác cũng rất tốt).

### local (Xác thực cục bộ)

Trước tiên, cài đặt các gói phụ thuộc. Như đã đề cập, `passport` bản thân không thực hiện xác thực, vì vậy chúng ta cần ít nhất một chiến lược `passport`. Ở đây, chúng ta sẽ triển khai xác thực cục bộ, nên cần cài đặt `passport-local`:

```bash
npm install @nestjs/passport passport passport-local
npm install @types/passport @types/passport-local
```

Chúng ta cũng cài đặt gói hỗ trợ gợi ý kiểu, vì `passport` là gói JavaScript thuần, không cài cũng không ảnh hưởng đến chương trình, chỉ là khi viết sẽ không có gợi ý mã.

Tạo một module `auth` để xử lý các mã liên quan đến xác thực, các thư mục như `Controller`, `service`, v.v. sẽ không nhắc lại ở đây. Chúng ta cũng cần tạo một file `local.strategy.ts` để viết mã cho chiến lược xác thực cục bộ:

```typescript
// local.strategy.ts
import { compareSync } from 'bcryptjs';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { User } from 'src/user/entities/user.entity';

export class LocalStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username })
      .getOne();
    if (!user) {
      throw new BadRequestException('Tên người dùng không đúng!');
    }
    if (!compareSync(password, user.password)) {
      throw new BadRequestException('Mật khẩu sai!');
    }
    return user;
  }
}
```

Phân tích mã từ trên xuống dưới:

* Đầu tiên, định nghĩa `LocalStorage` kế thừa lớp `PassportStrategy` do `@nestjs/passport` cung cấp, nhận hai tham số:
  * Tham số đầu tiên: Strategy, chiến lược sử dụng, ở đây là `passport-local`.
  * Tham số thứ hai: là tên gọi của chiến lược, mặc định là `local`.
* Tiếp theo, gọi `super` để truyền tham số chiến lược. Nếu chỉ sử dụng `username` và `password`, không cần phải viết, có thể sử dụng mặc định. Nếu xác thực bằng email, có thể truyền tham số là `email` và `usernameField` sẽ tương ứng với giá trị `email`.
* `validate` là phương thức cốt lõi trong `LocalStrategy`, thực hiện việc truy vấn người dùng và so sánh mật khẩu. Vì mật khẩu lưu trữ đã được mã hóa, không thể so sánh trực tiếp tên người dùng và mật khẩu, nên cần truy vấn người dùng theo tên và sau đó so sánh mật khẩu.
  * Lưu ý là cần sử dụng `addSelect` để truy vấn `password`, nếu không sẽ không thể thực hiện so sánh mật khẩu.

Với chiến lược này, giờ đây chúng ta có thể tạo một route `/auth/login` đơn giản và sử dụng `AuthGuard` của `Nest.js` để xác thực. Mở file `app.controller.ts` và thay thế nội dung như sau:

```typescript
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Xác thực')
@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Body() user: LoginDto, @Req() req) {
    return req.user;
  }
}
```

Đồng thời, đừng quên trong `auth.module.ts` cần nhập `PassportModule` và entity `User`, và cung cấp `LocalStorage` để sử dụng chung trong module.

```typescript
// auth.module.ts
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { LocalStorage } from './local.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStorage],
})
```

Dữ liệu trả về từ API như sau, đó có phải là thứ chúng ta cần không?

Trong quá trình phát triển, sau khi đăng nhập thành công, thay vì trả về toàn bộ dữ liệu người dùng, chúng ta nên trả về một mã token để định danh người dùng. Bằng cách này, người dùng sẽ sử dụng mã này để xác nhận danh tính của họ trong các lần truy cập sau.
### Tạo JWT token

Tiếp theo, chúng ta sẽ thực hiện việc tạo một chuỗi `token` sau khi xác thực thành công để trả về. `JWT` là một giải pháp đã được sử dụng rộng rãi để tạo chuỗi `token`. Chuỗi `token` do JWT tạo ra có dạng như sau:

```js
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQyZTZkNjRlLWU1YTAtNDhhYi05ZjU2LWMyMjY3ZjRkZGMyNyIsInVzZXJuYW1lIjoiYWRtaW4xIiwicm9sZSI6InZpc2l0b3IiLCJpYXQiOjE2Mzc1NjMzNjUsImV4cCI6MTYzNzU3Nzc2NX0.NZl4qLA2B4C9qsjMjaXmZoFUyNjt2FH4C-zGSlviiXA
```

Làm thế nào để tạo ra chuỗi này?

![0b2b11f5004500bf93668655f57807b.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfd6ff97b66f4c3081d8a2cb15d97e82~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

Dựa trên hình trên, có thể thấy `JWT token` được tạo thành từ ba phần: header, payload, và signature. Hãy thực hiện từng bước:

```bash
npm install @nestjs/jwt
```

Đầu tiên, đăng ký `JwtModule` trong `auth.module.ts`:

```typescript
import { JwtModule } from '@nestjs/jwt';

const jwtModule = JwtModule.register({
    secret: "test123456",
    signOptions: { expiresIn: '4h' },
});

@Module({
  imports: [
    jwtModule,
  ],
  exports: [jwtModule],
})
```

Trong mã trên, chúng ta đã ghi cố định `secret` trong mã nguồn. Tuy nhiên, trong phát triển thực tế, việc này không được khuyến nghị vì `secret` là thông tin bí mật, giống như cấu hình cơ sở dữ liệu, nên được lấy từ biến môi trường. Nếu `secret` bị lộ, người khác có thể dễ dàng tạo token tương ứng và truy cập vào dữ liệu của bạn. Chúng ta sẽ sử dụng phương pháp lấy không đồng bộ như sau:

```typescript
const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('SECRET', 'test123456'),
      signOptions: { expiresIn: '4h' },
    };
  },
});
```

Đừng quên thêm cấu hình `SECRET` vào tệp `.env`.

Cuối cùng, thực hiện logic trong `auth.service.ts`:

```typescript
// auth.service.ts
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  // Tạo token
  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }

  async login(user: Partial<User>) {
    const token = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    return { token };
  }
}
```

Đến bước này, chúng ta đã sử dụng `passport-local` kết hợp với `jwt` để trả về một `token` cho người dùng. Tiếp theo, khi người dùng gửi yêu cầu kèm theo `token`, chúng ta sẽ xác thực `token` để đảm bảo tính chính xác, chẳng hạn như khi truy vấn thông tin người dùng.

### Triển khai API lấy thông tin người dùng

Để thực hiện xác thực `token`, `passport` cũng cung cấp chiến lược `passport-jwt` giúp triển khai rất thuận tiện. Bắt đầu ngay với đoạn mã dưới đây:

Đầu tiên, cài đặt:

```bash
npm install passport-jwt @types/passport-jwt
```

Chiến lược `jwt` chủ yếu thực hiện theo hai bước:

* Bước 1: Cách lấy `token`
* Bước 2: Lấy thông tin người dùng từ `token`

Xem phần triển khai sau:

```typescript
// jwt.strategy.ts
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';

export class JwtStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET'),
    } as StrategyOptions);
  }

  async validate(user: User) {
    const existUser = await this.authService.getUser(user);
    if (!existUser) {
      throw new UnauthorizedException('token không chính xác');
    }
    return existUser;
  }
}
```

Trong chiến lược trên, `ExtractJwt` cung cấp nhiều cách để lấy `JWT` từ yêu cầu, phổ biến như sau:

* `fromHeader`: Tìm `JWT` trong tiêu đề HTTP của yêu cầu
* `fromBodyField`: Tìm `JWT` trong phần `Body` của yêu cầu
* `fromAuthHeaderAsBearerToken`: Tìm `JWT` trong tiêu đề xác thực có mang theo `Bearer` 

Chúng ta sử dụng `fromAuthHeaderAsBearerToken`, trong phần trình diễn thao tác yêu cầu sau, bạn sẽ thấy rằng tiêu đề yêu cầu cần chứa `Bearer token`, đây cũng là cách mà nhiều hệ thống backend ưa chuộng:

```
'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQyZTZkNjRlLWU1YTAtNDhhYi05ZjU2LWMyMjY3ZjRkZGMyNyIsInVzZXJuYW1lIjoiYWRtaW4xIiwicm9sZSI6InZpc2l0b3IiLCJpYXQiOjE2Mzc1NzUxMzMsImV4cCI6MTYzNzU4OTUzM30._-v8V2YG8hZWpL1Jq3puxBlETeSuWg8DBEPCL2X-h5c'
```

Đừng quên thêm `JwtStorage` vào `auth.module.ts`:

```typescript
import { JwtStorage } from './jwt.strategy';

@Module({
  providers: [AuthService, LocalStorage, JwtStorage],
})
```

Cuối cùng, chỉ cần sử dụng guard xác thực `jwt` trong `Controller`:

```typescript
// user.controller.ts
@ApiOperation({ summary: 'Lấy thông tin người dùng' })
@ApiBearerAuth() // cài đặt token trong tài liệu Swagger
@UseGuards(AuthGuard('jwt'))
@Get()
getUserInfo(@Req() req) {
    return req.user;
}
```

Đến đây, API lấy thông tin người dùng đã hoàn tất. Cuối cùng, để có thể sử dụng `Swagger` để thử nghiệm truyền `bearer token`, bạn cần thêm một `addBearerAuth`:

```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('Quản lý hệ thống')
  .setDescription('Tài liệu API của hệ thống quản lý')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, document);
await app.listen(9080);
```



## Tóm tắt

Bài viết đã triển khai đăng ký, xác thực đăng nhập qua JWT. Nhìn chung, các chức năng này đã hoàn thành, tuy nhiên vẫn còn vấn đề cần lưu ý:

* `token` của đăng nhập xác thực không có thời gian hết hạn, gây ra rủi ro bảo mật lớn;

Vấn đề này đều có thể được giải quyết bằng cách kết hợp với `Redis`. Trong phần hướng dẫn `Redis` sắp tới, sẽ có giải pháp chi tiết cho hai vấn đề này. Các bạn có thể suy nghĩ thêm về điều này.

