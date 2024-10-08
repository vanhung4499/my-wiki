---
title: NextJS Zero To Hero
tags:
  - nextjs
  - js
  - ts
categories:
  - nextjs
order: 1
---
# NextJS 14 Zero To Hero
# Giới thiệu

Cá nhân tôi thiên về backend developer và không mạnh về frontend, gần đây tôi đang suy nghĩ về việc làm freelancer nên tôi bắt đầu nâng cấp kĩ năng frontend của mình với NextJs (version **14**). Bài viết này do tôi nhanh chóng tổng kết lại quá trình phát triển của mình...

> Do tôi đã có kiến thức nền về frontend cơ bản và JS/TS khá tốt nên tôi học khá nhanh. Nếu bạn vẫn còn chưa tự tin về kĩ năng thì hãy học những điều cơ bản trước!

## Môi trường & Cài đặt

*   Node Environment ( >= 18 )
*   Các công cụ npx, yarn, bun đều có thể sử dụng (tôi cá nhân thích bun2 vì nó nhanh)
*   Khởi tạo dự án next

```sh
bunx create-next-app@latest   
✔ What is your project named? … my-nextjs-app   - Tên thư mục dự án                                                  
✔ Would you like to use TypeScript? … No / Yes  - Sử dụng Typescript                                               
✔ Would you like to use ESLint? … No / Yes      - Sử dụng ESLint                                                   
✔ Would you like to use Tailwind CSS? … No / Yes   - Sử dụng Tailwind                                              
✔ Would you like to use `src/` directory? … No / Yes  - Mặc định không sử dụng thư mục src                         
✔ Would you like to use App Router? (recommended) … No / Yes - Mặc định sử dụng App Router, nếu chọn No, sẽ sử dụng Page Router, đây là cách sử dụng của Next13                                                 
✔ Would you like to customize the default import alias (@/*)? … No / Yes  - Khuyến nghị không sử dụng
```

*   Cấu trúc thư mục dự án

```sh
├── README.md                                                                                         
├── app                     Tương đương với src                                                     
│   ├── favicon.ico                                                                                  
│   ├── globals.css         CSS toàn cục                                                             
│   ├── layout.tsx          Tệp chính của dự án, tương đương với main.js                             
│   └── page.tsx            Tệp trang chủ, truy cập tại /                                            
├── bun.lockb                                                                                        
├── next-env.d.ts                                                                                    
├── next.config.mjs         Tệp cấu hình next                                                        
├── package.json                                                                                     
├── postcss.config.mjs      Tệp cấu hình postcss                                                     
├── public                  Thư mục tệp tĩnh, lưu trữ hình ảnh                                       
│   ├── next.svg                                                                                     
│   └── vercel.svg                                                                                   
├── tailwind.config.ts      Tệp cấu hình tailwindcss                                                 
└── tsconfig.json

```

*   Cài đặt autoprefixer và cấu hình postcss

```sh
bun add autoprefixer -D
```

```ts
// postcss.config.mjs 
/** @type {import('postcss-load-config').Config} */ 
const config = {   
  plugins: {     
    tailwindcss: {},     
    autoprefixer: {}, // Thêm autoprefixer   
  }, 
};      
export default config;
```
Dưới đây là bản dịch sang tiếng Việt của nội dung bạn cung cấp:

# Bắt đầu

## Bắt đầu từ Layout

Tệp 「app/layout.tsx」 là tệp bố cục chính của toàn bộ ứng dụng, tương tự như main.ts hoặc App.tsx trong React. Nó chủ yếu thực hiện các nhiệm vụ sau:

*   Thông tin metadata của dự án
    
*   Tải kiểu dáng toàn cục từ globals.css
    
*   Tải phông chữ từ mạng hoặc cục bộ
    
*   Định nghĩa bố cục cấp cao nhất của ứng dụng
    
*   Hỗ trợ quốc tế hóa (i18n)
    
*   Gói các thư viện thành phần từ bên thứ ba thông qua Provider Wrapper
    

Mỗi thư mục trang cũng có thể định nghĩa tệp bố cục riêng của mình.

「Tóm tắt」：「RootLayout cấp cao nhất áp dụng cho tất cả các trang, mỗi Layout con chỉ áp dụng cho các trang trong thư mục mà nó thuộc về.」

Ví dụ:

| ![Hình ảnh](https://mmbiz.qpic.cn/sz_mmbiz_jpg/YBFV3Da0NwtYoRFA7WlFGRLVXOMskBQjHDxWmL8uVZ1g4YSKoNAjR1po6lnLVGiawBFIAaMt0w998GnxnTdR3nw/640?wx_fmt=other&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1) | ![Hình ảnh](https://mmbiz.qpic.cn/sz_mmbiz_jpg/YBFV3Da0NwtYoRFA7WlFGRLVXOMskBQjFKWqlTZp5fUUgUy8s0ureVl4JMNmlJ6x4XqvdEBluqj1qPOOCE685w/640?wx_fmt=other&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1) |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

![Hình ảnh](https://mmbiz.qpic.cn/sz_mmbiz_jpg/YBFV3Da0NwtYoRFA7WlFGRLVXOMskBQjq5UnDrTNCiak3dmyOaE4dd3dpDnQEOBzY5gTNxrlib6rOW1X0t7jW46w/640?wx_fmt=other&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

```typescript
// app/layout.tsx  
export default function RootLayout({children}: Readonly<{  
    children: React.ReactNode;  
}>) {  
    return (  
        <html lang="en">  
        <body className={inter.className}>  
        {/* header */}  
        <Header/>  
        {/* main content */}  
        {children}  
        </body>  
        </html>  
    );  
}

// app/overview/layout.tsx  
export default function Layout({children,}: Readonly<{  
    children: React.ReactNode;  
}>) {  
    return (  
        <section className="flex mt-4 space-x-6">  
            {/* Nav */}  
            <Nav/>  
            {/* main */}  
            <main className="w-full border border-green-600 p-4">{children}</main>  
        </section>  
    );  
}
```

Dưới đây là bản dịch sang tiếng Việt của nội dung bạn cung cấp:

### Phông chữ

Next.js sử dụng mô-đun `next/font` để tải phông chữ Google, thay vì tải thông qua CSS như trước đây. Điều này giúp Next.js tối ưu hóa việc tải phông chữ.

#### Tại sao cần tối ưu hóa phông chữ?

*   Quá trình trình duyệt tải phông chữ 

```mermaid
flowchart TD

A[Trình duyệt hiển thị trang]
B[Phông chữ thay thế hoặc phông chữ hệ thống]
C[Hiển thị]
D[Tải xuống phông chữ tùy chỉnh]
E[Thực hiện thay thế]
F[Bố trí bù đắp]
A --> B --> C --> D --> E --> F
```

「Khi thay thế phông chữ, có thể xuất hiện sự thay đổi về kích thước, khoảng cách và bố cục, dẫn đến CLS」 (CLS: Là một trong những chỉ số của Google dùng để đánh giá hiệu suất và trải nghiệm người dùng của website, đo lường tính ổn định của bố cục trong quá trình tải trang)

Khi sử dụng mô-đun `next/font`, Next.js sẽ tự động tối ưu hóa phông chữ. Trong quá trình xây dựng dự án, phông chữ sẽ được tải xuống và lưu trữ cùng với các tệp tài nguyên khác, cải thiện hiệu suất truy cập trang.

#### Cách thực hiện

```typescript
import { Inter } from 'next/font/google';

// Tải xuống tập con phông chữ theo nhu cầu, tiết kiệm tài nguyên
export const inter = Inter({ subsets: ['latin'] }); // Bộ ký tự Latin
<body className={inter.className}>{children}</body>
```

## Định tuyến trang

Next.js 14 mặc định sử dụng chế độ App Router.

Khác với chế độ Page Router, trong App Router, bất kỳ thư mục nào có trang có thể truy cập được, 「phải được cố định định nghĩa là page.tsx」, thư mục sẽ đóng vai trò là nội dung, ví dụ:

| Đường dẫn | App Router                  | Page Router                                                  |
| --------- | --------------------------- | ------------------------------------------------------------ |
| /         | app/page.tsx                | pages/index.tsx                                              |
| /about    | app/about/page.tsx          | pages/about/index.tsx                                        |
| /blog/1   | app/blog/[id]/page.tsx      | pages/blog/[id]/index.tsx hoặc pages/blog/[id].tsx           |
| /test/1/a | app/test/[...slug]/page.tsx | pages/test/[...slug]/index.tsx hoặc pages/test/[...slug].tsx |

## Định tuyến API

Khác với chế độ Page Router, trong chế độ App Router, thư mục api phải được đặt trong thư mục app, và 「phải được đặt tên là route.ts」

| Đường dẫn      | App Router                    | Page Router                                                    |
| -------------- | ----------------------------- | -------------------------------------------------------------- |
| /api/product   | app/api/product/route.ts      | pages/api/product/index.ts                                     |
| /api/product/1 | app/api/product/[id]/route.ts | pages/api/product/[id]/index.ts hoặc pages/api/product/[id].ts |
### Xử lý API

#### Chế độ App Router

```ts
export async function GET(request: NextRequest) {
   // Logic lấy dữ liệu
   const data = await ...;
   return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
   const body = await request.json();
   // Logic chèn dữ liệu
   return NextResponse.json({ msg: 'Created success' });
}

export async function DELETE(request: NextRequest) {
   const id = request.nextUrl.searchParams.get('id')!;
   if (!id) {
     return NextResponse.json({ msg: 'Delete Failed' });
   }
   // Logic xóa dữ liệu
   return NextResponse.json({ msg: 'Deleted Success' });
}

export async function PUT(request: NextRequest) {
   const id = request.nextUrl.searchParams.get('id');
   if (!id) {
     return NextResponse.json({ msg: 'Update Failed' });
   }
   // Logic cập nhật dữ liệu
   return NextResponse.json({ msg: 'Updated Success' });
}
```

#### Chế độ Page Router

```ts
function handler(req, res) {
   switch (req.method) {
      case 'GET':
         // ...
      case 'POST':
         // ...
      case 'DELETE':
         // ...
      case 'PUT':
         // ...
      default:
         // ...
   }
}
```
## Mẹo Tạo Thư Mục

Cơ bản, chúng ta sẽ đặt thư mục trang, thư mục API, thư mục thành phần (components), thư viện (lib) và các thư mục khác trong thư mục `app`, để dễ dàng phân biệt giữa thư mục trang và các thư mục khác. Chúng ta có thể sử dụng "thư mục ảo" để đặt tất cả các thư mục trang không phải là trang chính (/) vào thư mục `app/(pages)` dưới đây, điều này sẽ không ảnh hưởng đến việc truy cập đường dẫn. Đặt chúng dưới `(pages)` hoặc trong thư mục `app` sẽ có hiệu quả giống nhau. Việc làm này nhằm làm cho cấu trúc thư mục trở nên rõ ràng hơn. Cấu trúc thư mục `app` như sau:

```sh
├── (pages)                         Thư mục trang
│   ├── about                       /about
│   │   └── page.tsx                // Trang về
│   └── overview                    // Thư mục overview
│       ├── layout.tsx             // Tất cả các trang trong thư mục overview sẽ chia sẻ layout này
│       ├── page1                  /overview/page1
│       │   └── page.tsx           // Trang 1
│       └── page2                  /overview/page2
│           └── page.tsx           // Trang 2
├── api                             Thư mục API
│   └── news                        // Thư mục tin tức
│       ├── [id]                   // Thư mục với ID
│       │   └── route.ts           // Đường dẫn /api/news/123
│       └── route.ts               // Đường dẫn /api/news
├── components                      Thư mục thành phần
├── favicon.ico                     // Biểu tượng trang
├── global-error.tsx               // Trang lỗi cấp cao
├── globals.css                     // CSS toàn cục
├── layout.tsx                      // RootLayout
├── lib                             Thư mục tiện ích
│   └── db.ts                       // Tập tin quản lý cơ sở dữ liệu
├── not-found.tsx                  // Trang 404 cấp cao
├── page.tsx                       // Trang chính (/)
└── types                           Thư mục kiểu TypeScript
    └── news-type.ts               // Kiểu dữ liệu cho tin tức
```
## Hình Ảnh

* Sử dụng mô-đun `next/image`, nó sẽ giúp chúng ta tối ưu hóa hình ảnh.

### Tại sao cần tối ưu hóa hình ảnh?

* Gửi hình ảnh lớn đến màn hình nhỏ, lãng phí băng thông.

* Quá trình tải hình ảnh từ không đến có dễ gây ra CLS (dịch chuyển bố cục).

* Nhiều hình ảnh yêu cầu đồng thời gây cản trở việc hiển thị trang.

### Làm thế nào để thực hiện?

Next.js cung cấp giải pháp tối ưu hóa hình ảnh thông qua thành phần `Image`. Sử dụng thành phần `Image` có bốn lợi ích:

* Tối ưu hóa kích thước hình ảnh: xuất ra định dạng webp.

* Sử dụng kích thước và định dạng phù hợp cho từng thiết bị (khi truy cập trang bằng Chrome, hình ảnh sẽ được chuyển đổi sang định dạng webp).

* Ngăn ngừa CLS (dịch chuyển bố cục tích lũy).

* Tải chậm: hình ảnh chỉ được tải khi nó nằm trong chế độ xem.

* Tùy chỉnh kích thước hình ảnh, width, height; vì đã định nghĩa w và h, nên hình ảnh sẽ có tỷ lệ chiều rộng và chiều cao cố định, ngăn ngừa CLS.

* Next.js sẽ chuyển đổi và lưu vào bộ nhớ cache hình ảnh có kích thước tương ứng dựa trên giá trị `width` và `height` của `Image` khi trang yêu cầu từ Server.

```ts
import Image from 'next/image';

export default function About(props) {
  return (
    <>
      {/* <img
          src={'/img.jpeg'}
          alt="Hình ảnh"
      /> */}
      <Image 
          src={'/img.jpeg'} 
          alt="Hình ảnh" 
          width={100} 
          height={100} 
          placeholder={'Dữ liệu base64 của hình ảnh'} 
      />
      <Image 
          src="/hero-desktop.png" 
          width={1000} 
          height={760} 
          className="hidden md:block" 
          alt="Screenshots of the dashboard project showing desktop version"
      />
      <Image 
          src="/hero-mobile.png" 
          width={560} 
          height={620} 
          className="block md:hidden" // Hình ảnh chỉ được tải xuống và hiển thị khi ở thiết bị di động, thật tuyệt vời 
          alt="Screenshots of the dashboard project showing desktop version"
      />
    </>
  );
}
```

### Yêu cầu hình ảnh từ nguồn bên ngoài với hạn chế truy cập

* Cấu hình trong `next.config.js`.

```ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
};
```
### Xử Lý Lỗi Hình Ảnh

#### Thiết lập width và height là auto

Nếu bạn cùng lúc thêm thuộc tính width và height, trình duyệt sẽ hiển thị cảnh báo: "Hình ảnh với src 'xxxx' có width hoặc height đã được chỉnh sửa, nhưng không có thuộc tính còn lại. Nếu bạn sử dụng CSS để thay đổi kích thước hình ảnh của mình, hãy thêm các thuộc tính 'width: auto' hoặc 'height: auto' để duy trì tỷ lệ khung hình."

**Giải pháp:** Thêm kiểu `width: auto` và `height: auto` vào thành phần Image.

#### Gợi ý tối ưu LCP

"Hình ảnh với src 'xxx' đã được phát hiện là Largest Contentful Paint (LCP). Vui lòng thêm thuộc tính 'priority' nếu hình ảnh này nằm trên vùng nhìn thấy."

Thường xuất hiện với logo trên trang.

LCP là một giá trị thời gian, dùng để đo thời gian trình duyệt của người dùng cần để hiển thị phần tử nội dung lớn nhất trong vùng nhìn thấy. Phần tử nội dung lớn nhất có thể là:

- Phần tử khối chứa văn bản (như tiêu đề hoặc đoạn văn).
- Hình ảnh được thêm vào bằng thẻ HTML `<img>`, thẻ `<image>` trong phần tử SVG, hoặc hình ảnh nền CSS được định nghĩa bằng hàm CSS `url()` (không bao gồm nền gradient).
- Phần tử `<video>` với thuộc tính `poster` (thời gian hiển thị của hình ảnh sử dụng poster).

**Giải pháp:** Thêm thuộc tính `priority` cho thành phần Image.

#### Hình ảnh yêu cầu thất bại, hiển thị một hình ảnh mặc định

* Khi yêu cầu hình ảnh thất bại, chúng ta muốn cung cấp một hình ảnh mặc định, có thể sử dụng `onError` trên thành phần Image, sau đó kết hợp với `useState` để gán lại một hình ảnh mặc định.

* Tuy nhiên, điều này gây ra một vấn đề: `useState` chỉ có thể được sử dụng trong các client component. Chúng ta có thể trừu tượng hóa thành phần Image thành một client component riêng biệt.

```ts
<ImageWithFallback 
    height={200} 
    width={300} 
    src={p.article.image_url || defaultNewsPng} 
    alt="Hình ảnh cho thử nghiệm" 
    fallback={defaultNewsPng} 
/>      

// ImageWithFallback.tsx
'use client';
import { useState } from 'react';
import Image, { ImageProps, StaticImageData } from 'next/image';

type ImageWithFallbackType = ImageProps & {
    fallback: StaticImageData;
};

export function ImageWithFallback({ fallback, src, alt, ...p }: ImageWithFallbackType) {
    const [imgSrc, setImgSrc] = useState(src);
    return (
        <Image
            {...p}
            src={imgSrc}
            alt={alt || 'mô tả mặc định'}
            onError={() => setImgSrc(fallback.src)}
        />
    );
}
```

## Điều hướng Link

Lợi ích của việc sử dụng component Link thay vì thẻ a:

*   Không làm mới toàn bộ trang
    
*   Tự động phân tách mã: dựa trên route sẽ tự động phân tách code (code-splitting)
    
*   Dự đoán trước mã (pre-fetch): trong môi trường production, khi component Link xuất hiện trong khung nhìn của trình duyệt, Next.js sẽ tự động prefetch trang được liên kết qua Link.href
    

### Trạng thái Active

Lưu ý: Chỉ trên client mới có thể biết link nào đang ở trạng thái active, do đó cần thêm 'use client';

```ts
'use client';     
import Link from 'next/link';   
import { usePathname } from 'next/navigation';      
export function Nav() {   
  const pathname = usePathname();   
  return (   
    <ul>   
      <li className={pathname === '/overview/page1' ? 'active' : ''}>page1</li>   
      <li className={pathname === '/overview/page2' ? 'active' : ''}>page2</li>   
    </ul>   
  )   
}
```

## Trang Not Found

Next.js sẽ tự động tạo trang 404, nếu bạn muốn sử dụng trang 404 của riêng mình, cần tuân thủ các nguyên tắc sau:

### Trang 404 toàn cục

Trong thư mục `app`, tạo tệp `not-found.tsx`. Khi truy cập vào route không tồn tại, tự động chuyển hướng đến trang not-found toàn cục.

*   Lưu ý: Tệp `not-found.tsx` toàn cục chỉ có hiệu lực trong thư mục `app`, nếu ở nơi khác sẽ không có hiệu lực.
    
*   /app/not-found.tsx
    

### Trang 404 cục bộ

*   404 cục bộ thường dùng khi không lấy được dữ liệu cần thiết, không phải do trang không tồn tại.
    
*   Trong một thư mục trang cụ thể hoặc layout chia sẻ, tạo tệp `not-found.tsx`.
    
*   Cần kích hoạt thủ công phương thức `notFound` từ `next/navigation`.
    

Ví dụ: `/app/overview/not-found.tsx`. Khi truy cập `/app/overview/page2` và không lấy được dữ liệu từ API, sẽ xuất hiện trang 404 cục bộ.

| ![Image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d607004728f4bf3ae911e3822a4926c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=437&h=251&s=30636&e=png&b=fefefe) | ![Image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abd6ea28a13749f6ac3cf5ab801e1241~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1065&h=208&s=33406&e=png&b=fdfdfd) |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

```ts
// /app/overview/page2.tsx   
import { notFound } from 'next/navigation';      
export default function Page1() {   
  // Giả lập việc lấy dữ liệu   
  const data = null;    
  if (!data) {   
    return notFound();   
  }    
  return <h1>Tôi là page2...</h1>;   
}   
```

## Trang Error

Tùy chỉnh trang lỗi

### Trang Error toàn cục

*   Trang lỗi toàn cục chỉ có hiệu lực trong thư mục `app`, tạo tệp `global-error.tsx`, nếu không sẽ không có hiệu lực.
    
*   Trong môi trường production, có thể thấy trang lỗi toàn cục, còn trong môi trường phát triển sẽ không thấy.
    

```ts
'use client';      
export default function GlobalError({   
  error, reset  
}: {  
  error: Error & { digest?: string };  
  reset: () => void 
}) {   
  return (   
    <html>   
      <body>   
        <h2>Có sự cố xảy ra!</h2>   
        <button onClick={() => reset()}>Thử lại</button>   
      </body>   
    </html>   
  );   
}      
```

### Trang Error cục bộ

*   Trong một trang cụ thể hoặc layout chia sẻ, tạo tệp `error.tsx`.

| ![Image](https://mmbiz.qpic.cn/sz_mmbiz_jpg/YBFV3Da0NwtYoRFA7WlFGRLVXOMskBQjhWyZBicURjWbIyhw5hA4nry85ngiaic4wnSEN6foC7JJoSASlClP8MM0A/640?wx_fmt=other&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1) | ![Image](https://mmbiz.qpic.cn/sz_mmbiz_jpg/YBFV3Da0NwtYoRFA7WlFGRLVXOMskBQj0LrLdJbEVd5IA4Cia8LBZib7icygicibLwEjfOtYt5YM3FhOPuPuRVLBY0A/640?wx_fmt=other&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1) |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

```ts
export default async function Page1() {   
  throw new Error('xxx');    
  return <h1>Tôi là page2...</h1>;   
}   
```

## Loading

Tùy chỉnh loading

### Loading cấp trang

Khi truy cập bất kỳ trang nào trong thư mục có tệp `loading.tsx`, trình duyệt sẽ tự động tải và hiển thị loading trước. Khi trang đã sẵn sàng, loading sẽ ẩn đi và trang sẽ được hiển thị. Tất cả quy trình này đều diễn ra tự động.

「Thực hành tốt nhất:」

*   Loading toàn cục: `app/loading.tsx`
    
*   Loading cục bộ: `app/xxxx/loading.tsx`
    

![Hình ảnh](https://mmbiz.qpic.cn/sz_mmbiz_jpg/YBFV3Da0NwtYoRFA7WlFGRLVXOMskBQjyZop3lnX9PvbeicVxadkww7DLu3NKor2PG7ELUTFmfYDv2mdq1ZLOgA/640?wx_fmt=other&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

#### Cách ly loading

```sh
/app/overview  
  | page1/page.tsx  
  | page2/page.tsx  
  | page.tsx  
  | loading.tsx   Loading cục bộ sẽ áp dụng cho tất cả các trang trong thư mục overview   
```

```sh
/app/overview  
  | page1  
     | page.tsx  
     | loading.tsx  
  | page2/page.tsx  
  | page.tsx   Loading cục bộ chỉ áp dụng cho overview/page1  
```

Giả sử bạn muốn loading cục bộ chỉ áp dụng cho một trang cụ thể mà không áp dụng cho các trang khác trong cùng thư mục, cách thực hiện như thế nào? Giả sử cấu trúc thư mục trang của bạn như sau:

「- Dùng “thư mục ảo” (tên tùy ý, có thể gọi là xxx) để bao bọc phạm vi loading và page.tsx riêng biệt」

```sh
/app/overview  
  |(overview)  
     | loading.tsx  
     | page.tsx  
  | page1/page.tsx  
  | page2/page.tsx   Loading sẽ chỉ áp dụng cho tất cả các trang trong thư mục `overview/(overview)`   
   Tức là khi truy cập `/overview`, chỉ khi đó mới hiển thị loading cục bộ.   
   Còn khi truy cập `/overview/page1` hoặc `/overview/page2`, sẽ quay lại loading toàn cục.   
```

### Loading cấp thành phần

Sử dụng với `Suspense`, được truyền vào dưới dạng fallback

```jsx
<Suspense fallback={<LoadingComp />}>   
   <Comp />  
</Suspense>
```

## SSG và SSR

NextJS 14 mặc định sử dụng SSG. Hãy xem một ví dụ:

```ts
// http://localhost:3000   
import { ArticleApi } from '@/app/api/article-api';      

export default async function Home() {   
  const articles = await ArticleApi.fetchToday();      

  return (   
    <>   
      <section>{new Date().toLocaleTimeString()}</section>   
      <section>{JSON.stringify(articles)}</section>   
    </>   
  );   
}
```

*   Mặc định, sau khi bạn chạy `npm run build` và `npm run start`, dù bạn có làm mới trình duyệt bao nhiêu lần, nội dung vẫn không thay đổi, ngay cả khi có fetch, thời gian hiển thị vẫn không thay đổi.
    

**SSG**: Kết xuất tĩnh, khi dữ liệu được tái tạo trên Server trong quá trình build và triển khai, các trang tĩnh được tạo ra có thể phân phát và lưu trữ trên toàn thế giới.

*   Lợi ích: Truy cập nhanh hơn, giảm tải cho Server, tốt cho SEO.
    
*   Tình huống sử dụng: Dữ liệu không thay đổi hoặc dữ liệu được chia sẻ giữa nhiều trang.
    

**SSR**: Kết xuất động, dữ liệu được lấy lại mỗi lần Server nhận được yêu cầu từ người dùng và trang được tái tạo lại.

*   Lợi ích: Hiển thị dữ liệu theo thời gian thực, dữ liệu cụ thể cho từng người dùng (dùng để phân biệt đối xử), có thể lấy được cookie và tham số URL từ yêu cầu của client.

### Cache

#### Thời gian hiệu lực của SSG

Khi bạn cần thiết lập một thời gian hiệu lực cố định cho SSG, bạn có thể thêm một dòng vào đầu tệp trang:

```ts
export const revalidate = 10; // 10 giây
export default Page() {}
```

Khi thêm dòng mã này vào ví dụ trên -> `npm run build` -> `npm start`, bạn có thể quan sát thấy trong trình duyệt rằng sau mỗi 10 giây làm mới, thời gian mới sẽ thay đổi. Điều này xảy ra vì bạn đã thiết lập `revalidate` cho toàn bộ trang là 10 giây.

Thiết lập thời gian xác thực lại mặc định cho bố cục hoặc trang. Tùy chọn này sẽ không ghi đè lên thiết lập `revalidate` được chỉ định cho từng yêu cầu `fetch`. Nếu được thiết lập, mỗi yêu cầu `fetch` trong trang sẽ có thời gian hiệu lực được thiết lập.

「Lưu ý: `revalidate = 600` là hợp lệ, nhưng `revalidate = 60 * 10` là không hợp lệ」

#### SSR

Thêm một dòng vào đầu tệp trang, đảm bảo rằng mỗi lần truy cập đều là mới nhất:

```ts
export const dynamic = 'force-dynamic';
```

#### Cache độ granularity của fetch

Cache chi tiết, áp dụng cho yêu cầu `fetch`, Next.js 14 mặc định sử dụng:

```ts
fetch('https://...', { cache: 'force-cache' })
```

Chúng ta có thể cấu hình hành vi cache của từng yêu cầu `fetch` một cách riêng biệt. Điều này cho phép bạn kiểm soát hành vi cache một cách chi tiết hơn, chẳng hạn, có thể đặt `revalidate` khác nhau cho từng yêu cầu `fetch`, hoặc một yêu cầu không thay đổi, một yêu cầu có thể thay đổi khi quá thời gian hiệu lực.

##### Thời gian xác thực lại cho fetch là 5 giây

Có thể thêm thuộc tính `next.revalidate` vào `fetch`, thiết lập vòng đời:

```ts
const fetch1 = await (
  await fetch('/api/xxx', {
    next: {
      revalidate: 5, // Thời gian hiệu lực cache cho yêu cầu là 5 giây. Nếu thiết lập là true, có nghĩa là không có cache, sẽ yêu cầu mỗi lần.
    },
  })
).json();
```

###### Trường hợp ngoại lệ

Mặc định, Next.js sẽ tự động cache các giá trị trả về của dữ liệu trên Server trong cache của `fetch`. Điều này có nghĩa là bạn có thể lấy dữ liệu khi tạo hoặc khi yêu cầu, cache dữ liệu và tái sử dụng cho mỗi yêu cầu dữ liệu, thường dùng cho việc truy vấn dữ liệu. Tuy nhiên, có một số trường hợp ngoại lệ mà `fetch` sẽ không cache yêu cầu:

*   Sử dụng trong các thao tác trên Server, Server Action
*   Sử dụng trong các trình xử lý tuyến đường với phương thức `POST`

##### Tắt cache với fetch

Đặt tùy chọn `fetch` là `'no-store'` có nghĩa là lấy dữ liệu một cách động và không lưu cache.

```ts
fetch('https://...', { cache: 'no-store' })
```

##### So sánh no-store và no-cache

Chỉ thị `no-cache` không có nghĩa là hoàn toàn cấm cache. Trên thực tế, nó cho phép cache lưu trữ phản hồi nhưng yêu cầu phải xác thực tính hợp lệ của phản hồi đó trước khi sử dụng.

*   Khi một yêu cầu có chỉ thị `no-cache`, trình duyệt sẽ gửi một yêu cầu điều kiện (ví dụ: sử dụng các header `If-Modified-Since` hoặc `If-None-Match`), hỏi Server xem nội dung cache có còn hợp lệ không. Nếu Server xác nhận nội dung không thay đổi, nó sẽ trả về mã trạng thái 304 (không thay đổi), chỉ định rằng trình duyệt có thể tiếp tục sử dụng phiên bản cache; nếu nội dung đã thay đổi, Server sẽ trả về nội dung mới.

Chỉ thị `no-store` thì hoàn toàn cấm cache.

`no-cache` yêu cầu phải xác thực trước khi sử dụng phản hồi từ cache, trong khi `no-store` thì hoàn toàn cấm lưu trữ phản hồi. `no-cache` có thể vẫn giúp tăng tốc độ tải vì nó cho phép sử dụng cache sau khi xác thực, trong khi `no-store` có thể dẫn đến hiệu suất giảm vì nó buộc phải lấy dữ liệu từ Server mỗi lần.

#### Cache cho API Route

Tại đầu tệp `route.ts`, thêm cấu hình:

```ts
// export const dynamic = 'force-dynamic'
export const revalidate = 1000;

export async function GET(request: Request) {}
```

*   Mặc định, yêu cầu `GET` sẽ được cache, còn yêu cầu `POST` sẽ là động (không cache).

### Cache (Lấy dữ liệu từ Server qua thư viện bên thứ ba)

Nếu bạn đang sử dụng thư viện bên thứ ba không hỗ trợ hoặc không công khai `fetch` (ví dụ, cơ sở dữ liệu, CMS hoặc client ORM), bạn có thể sử dụng tùy chọn cấu hình đoạn API route hoặc `unstable_cache` để thực hiện.

Ví dụ: trên Server, yêu cầu cơ sở dữ liệu

```ts
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  noStore(); // Đánh dấu rõ ràng noStore
  try {
    // Yêu cầu cơ sở dữ liệu
  } catch (error) {}
}
```

```ts
import { getUser } from './data';
import { unstable_cache } from 'next/cache';

const getCachedUser = unstable_cache(
  async (id) => getUser(id),
  ['my-app-user']
);

export default async function Component({ userID }) {
  const user = await getCachedUser(userID);
  ...
}
```

### Cache trong React

Hàm `cache` trong React cũng có thể được sử dụng để ghi nhớ các yêu cầu dữ liệu.

`cache(fn)` sẽ cache kết quả thực thi của fn. Khi gọi lại, có thể lấy kết quả từ cache.

**Tình huống ứng dụng**: Trong cùng một trang, nhiều component đều yêu cầu cùng một API hoặc dữ liệu từ Server. Chúng ta chỉ muốn yêu cầu một lần cho API hoặc dữ liệu đó.

「Câu hỏi: Tình huống ứng dụng ở trên không đúng, nếu mọi người chia sẻ dữ liệu, tại sao không trực tiếp yêu cầu dữ liệu trên component cha, rồi truyền props xuống? Việc sử dụng cache không phải là thừa sao???」

*   Giả sử, các component này là các component độc lập có thể yêu cầu dữ liệu.
    
*   Vậy thì, rõ ràng chúng ta cần cache để lưu trữ kết quả.

**Cách sử dụng?**

*   Bọc hàm yêu cầu dữ liệu từ Server/Client bằng `React.cache`. Nếu nhiều component cùng yêu cầu hàm này, chỉ yêu cầu một lần trên cùng một trang. Xem ví dụ:

```ts
// app/utils.ts
import { cache } from 'react';

const getData = () => new Promise(resolve =>
  setTimeout(() => resolve(new Date().toLocaleTimeString()), 3000)
);

export const getItem = cache(async () => {
  console.log('------ Yêu cầu ------');
  // Mô phỏng yêu cầu cơ sở dữ liệu
  const item = await getData();
  return item;
});
```

```ts
// app/item/[id]/layout.tsx
import { getItem } from './lib/util';

export default async function Home() {
  const time = (await getItem()) as string;
  return ();
}

// app/item/[id]/page.tsx
import { getItem } from './lib/util';

export default async function Page() {
  const time = (await getItem()) as string;
  return ();
}
```

Xem log của Server, nhận thấy rằng mặc dù layout và page đều yêu cầu `getItem`, nhưng `getItem` chỉ thực thi một lần, "Tuyệt vời !!!"

## SSG Tiền render cho trang có tham số động

Sử dụng `generateStaticParams` thay thế cho `getStaticPaths` trong Next.js 13.

```ts
// /product/[id]/page.tsx
export const revalidate = 1000; // 1000 giây

export function generateStaticParams() {
  // return { [propertyName]: value };
  return [1, 2, 3].map(id => {
    id
  });
}

export default async function Page(p: { params: { id: string }}) {
  const data = await getData(p.param.id);
  // return ...
}
```

## Streaming (Render bất đồng bộ)

**Xử lý Stream**: Chia một “khối lớn” dữ liệu thành “nhiều khối nhỏ” để xử lý. Nói một cách đơn giản, Next.js có thể chia một trang thành phần tĩnh và phần động, tránh việc phải chờ tất cả các component được tải hoàn toàn trước khi render, gây ra hiện tượng blocking trang.

**Tình huống ứng dụng**: Stream, thao tác tệp, dữ liệu stream, component render bất đồng bộ.

**Cách sử dụng**: Kể từ React 17, frontend đã hỗ trợ render bất đồng bộ component thông qua `Suspense/lazy`. Bây giờ chúng ta thực hiện thông qua render trên Server.

**Lợi ích**: Có thể xây dựng một trang, với phần tĩnh (các dữ liệu không thay đổi) và phần động (các dữ liệu thay đổi), "Tuyệt vời".

1. Đầu tiên, đặt yêu cầu dữ liệu vào component để yêu cầu độc lập.
    
2. Đảm bảo yêu cầu dữ liệu là động (`no-store`), nếu không, không cần sử dụng Stream, chỉ cần SSG là đủ.
    
3. Nhúng component và bọc bằng `Suspense`.

```ts
// A, B render động bất đồng bộ, C render tĩnh
import { Suspense } from 'react';
import { A } from '@/app/components/A';
import { B } from '@/app/components/B';
import { C } from '@/app/components/C';

export default function Page() {
  return (
      <C />
      <Suspense fallback={<p>Đang tải nội dung...</p>}>
          <A />
      </Suspense>
      <Suspense fallback={<p>Đang tải nội dung...</p>}>
          <B />
      </Suspense>
  );
}
```
## Network Waterfall（Mô hình nước đổ mạng）

`Yêu cầu A --> Yêu cầu B --> Yêu cầu C --> ....`

Đây là mô hình nước đổ mạng. Nếu A, B và C không có mối quan hệ phụ thuộc bắt buộc, thì tất cả các yêu cầu này sẽ phải hoàn thành trước khi có thể kết xuất trang, điều này dẫn đến hiệu suất kém.

**「Bad:」**

```ts
export default async function Page() {
    const data1 = await fetch1();
    const data2 = await fetch2();
    const data3 = await fetch3();
    // return ...;
}
```

**「Good:」**

```ts
export default async function Page() {
    const [data1, data2, data3] = await Promise.all([
        fetch1(),
        fetch2(),
        fetch3()
    ]);
    // return ...
}
```

**「Mặc dù NextJs hỗ trợ yêu cầu dữ liệu từ phía client, nhưng thường không khuyến nghị làm như vậy. Tại sao?」**

* Trong ứng dụng một trang (SPA), một mô hình phổ biến để lấy dữ liệu là hiển thị một dấu hiệu ban đầu và sau đó lấy dữ liệu sau khi component đã được gắn kết (sử dụng `useEffect`). Thật không may, điều này có nghĩa là các component con không thể bắt đầu lấy dữ liệu cho đến khi component cha hoàn tất tải dữ liệu của chính nó, hiện tượng này được gọi là: **"waterfall client-server".**

* Chuyển yêu cầu dữ liệu lên Server đảm bảo rằng các component cần lấy dữ liệu phải là hàm async.

```ts
// 'use client';
export default async function Page() {
    // yêu cầu dữ liệu từ Server
    const data = http/service yêu cầu
    if (!data) return null;

    // yêu cầu từ client
    // useEffect(() => {
    //     // http yêu cầu
    // }, [])

    return <section>{JSON.stringify(data)}</section>;
}
```

### Tóm lại:
- **Mô hình nước đổ** có thể ảnh hưởng tiêu cực đến hiệu suất nếu không được xử lý đúng cách.
- Việc sử dụng `Promise.all()` để song song hóa các yêu cầu có thể cải thiện hiệu suất.
- Hạn chế việc lấy dữ liệu từ client để tránh tình trạng "nước đổ client-server".
## Client Component vs Server Compoennt

「NextJs mặc định xem tất cả các thành phần là `server component`」

* **client component**: Thành phần phía Client, trên đầu thành phần có chỉ thị `'use client'`, người dùng có thể tương tác với trang trên trình duyệt, chẳng hạn như sử dụng `useState`, `useEffect`, `next/navigation`, v.v. 「Nó chạy cả trên Server và trình duyệt, trước là Server, sau là trình duyệt.」
    
* **server component**: Thành phần phía Server, hoàn toàn được kết xuất trên Server, vì vậy không thể thực hiện tương tác với người dùng.

「❌ Nhận thức sai lầm: “Nếu nó là client component, thì nó chỉ chạy trên client.”」

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/mshqAkialV7EDeiaib2FwDbJoWAl5E9EluqYVpMLfWg2b3PF6hb5ykaWDyJ7yfoIqgV2czT3iciaJarXjo43ryzSQvQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

「Nếu thành phần sử dụng `useState`, `useEffect` hoặc thư viện bên thứ ba (để tương tác), nhưng không đánh dấu tệp là `'use client'`, hệ thống sẽ báo lỗi.」

「Nếu bạn đánh dấu một tệp là `'use server'` một cách thủ công (mặc dù NextJs mặc định xem tất cả tệp là chạy trên Server), nhưng nếu client component `'use client'` muốn gọi trực tiếp hàm của Server, chẳng hạn như hành động biểu mẫu, yêu cầu dịch vụ khi nhấp chuột, bạn cần cho trình duyệt biết rằng hàm này đang chạy trên Server.」

Tại sao lại cần làm như vậy???

* Nếu không đánh dấu, thành phần `'use client'` của bạn, khi nhập hàm muốn gọi, trình duyệt sẽ coi nó là thực thi trên trình duyệt, vì vậy sẽ gặp rắc rối.

Có hai cách để đánh dấu:

* **Cách 1**: Đánh dấu hàm tương tác của client component là `'use server'`.

```ts
// server, /app/actions/user.ts
export async function createUser(body) {}
export async function test() {}

// client, /app/user/create/page.tsx
'use client';
import { createUser, test } from '@/app/actions/user';

export default function Page() {
    async function create(formData: FormData) {
        'use server'; // Đánh dấu
        // Gọi dịch vụ Server
        await createUser(formData);
    }

    async function clickHandler() {
        'use server'; // Đánh dấu
        await test();
    }

    return (
        <>
            <form action={create}>...</form>
            <section onClick={clickHandler}>test</section>
        </>
    );
}
```

* **Cách 2**: Đánh dấu trực tiếp ở đầu tệp Server là `'use server'`, điều này cho biết tệp này chạy trên Server, khi client component gọi thì không cần phải đánh dấu `'use server'` trong hàm nữa.

```ts
// server, /app/actions/user.ts
'use server';
export async function createUser(body) {}
export async function test() {}

// client, /app/user/create/page.tsx
'use client';
import { createUser, test } from '@/app/actions/user';

export default function Page() {
    async function create(formData: FormData) {
        // Không cần đánh dấu 'use server' ở đây
        await createUser(formData);
    }

    async function clickHandler() {
        // Không cần đánh dấu 'use server' ở đây
        await test();
    }

    return (
        <>
            <form action={create}>...</form>
            <section onClick={clickHandler}>test</section>
        </>
    );
}
```

### Những lưu ý về use server:

* Khi một tệp được đánh dấu là `'use server'`, thì các hàm export của nó phải là async; không thể export đối tượng, nếu không, khi client component nhập vào, sẽ báo lỗi.

* Tệp "use server" chỉ có thể xuất các hàm async, không tìm thấy đối tượng. Những hàm này cần được định nghĩa là async, vì "use server" đánh dấu chúng là Server Actions và chúng có thể được gọi trực tiếp từ client thông qua yêu cầu mạng.

* Không vấn đề gì khi export type, xem ví dụ dưới đây:

```ts
❌ Báo lỗi, user server chỉ có thể xuất các hàm bất đồng bộ và kiểu, không thể xuất đối tượng
// api/service.ts
'use server';
export const QueryUserSchema = z
    .object({
        name: z.string(),
        age: z.number().optional()
    });

// api/route.ts
import { QueryUserSchema } from './service.ts';
export async function GET(req: NextRequest) {
    const filters =
        getQueryParams<typeof QueryUserSchema._type>(req);
    return NextResponse.json({});
}
```

```ts
✅ Xuất trực tiếp kiểu thì được
// api/service.ts
'use server';
const QueryUserSchema = z
    .object({
        name: z.string(),
        age: z.number().optional()
    });
export type QueryUserParams = typeof
    QueryUserSchema._type;

// api/route.ts
import { QueryUserParams } from './service.ts';
export async function GET(req: NextRequest) {
    const filters =
        getQueryParams<QueryUserParams>(req);
    return NextResponse.json({});
}
```

## Hydration Mismatch

### Phân tích hiện tượng

Kết quả render trên server và trên trình duyệt không nhất quán, dẫn đến việc hydrate của React không khớp.

Khi render ứng dụng, có sự khác biệt giữa cây React được render trước từ server và cây React được render lần đầu tiên trên trình duyệt (quá trình hydrate), khi đó trình duyệt sẽ báo lỗi: 

**Error**: `Text content does not match server-rendered HTML`

**"Hydration"** trong React đề cập đến quá trình mà React gắn các xử lý sự kiện vào HTML đã được render trước từ server và chuyển đổi nó thành một ứng dụng hoàn toàn tương tác.

_Hãy xem một ví dụ:_

```ts
// Randmo 组件  
'use client';
import { useEffect, useState } from 'react';

export default function Random(p: {}) {
  const [value, setValue] = useState(Math.random());
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setValue(Math.random());
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return <>{value}</>;
}

// page.tsx
export default function Page() {
  return (
    <>
      <h1>I am a random</h1>
      <Random />
    </>
  );
}
```

Trình duyệt báo lỗi warning: `Text content did not match. Server: "0.49532635194084684" Client: "0.11063157855511907"`

### Nguyên nhân

❌ **Lỗi do thẻ HTML lồng nhau không đúng, ví dụ như thẻ `<p>`**

* `<p>` lồng trong một thẻ `<p>` khác: `<p><p>111</p></p>`
  
* `<section>` lồng trong thẻ `<p>`: `<p><section>222</section></p>`
  
* Thẻ `<ul>` hoặc `<ol>` lồng trong thẻ `<p>`: `<p><ul></ul></p>`

* Các nội dung tương tác không thể lồng nhau (ví dụ: thẻ `<a>` lồng trong `<a>`, thẻ `<button>` lồng trong `<button>`)

❌ Sử dụng kiểm tra như `typeof window !== 'undefined'` trong logic render.

❌ Sử dụng các API chỉ dành cho trình duyệt, chẳng hạn như API `window` hoặc `localStorage` trong logic render.

❌ Sử dụng API liên quan đến thời gian như `Date()` trong logic render.

❌ Trình duyệt mở rộng chỉnh sửa HTML.

❌ Cấu hình thư viện CSS-in-JS không đúng.

❌ Cấu hình sai HTML response qua Edge/CDN, chẳng hạn như Cloudflare Auto Minify.

❌ iOS cố gắng phát hiện số điện thoại, địa chỉ email và các dữ liệu khác trong nội dung văn bản và chuyển chúng thành liên kết, gây ra lỗi hydrate không khớp.

* Có thể vô hiệu hóa tính năng này bằng thẻ meta sau:

```html
<meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
```

### Giải pháp

#### Sử dụng `useEffect` để chỉ render trên trình duyệt

Hãy để những phần gặp vấn đề chỉ render trên client, vì trong quá trình hydrate của React, `useEffect` được gọi. Điều này cho phép sử dụng các API của trình duyệt như `window` mà không gặp lỗi hydrate mismatch.

```ts
// Randmo 组件
'use client';
import { useEffect, useState } from 'react';

export default function Random(p: {}) {
  const [value, setValue] = useState(Math.random());
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    const intervalId = setInterval(() => {
      setValue(Math.random());
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return <>{isClient ? value : null}</>;
}
```

*Không khuyến nghị cách này vì nó làm tăng độ phức tạp của component.*

#### Khuyến nghị: Vô hiệu hóa SSR cho component cụ thể

1. Đầu tiên, thay đổi cách export component thành `export default`.

2. Sau đó, khi sử dụng component, dùng `next/dynamic` để vô hiệu hóa SSR cho component đó.

```ts
// page.tsx
import dynamic from 'next/dynamic';

const NoSSR = dynamic(() => import('./Random'), { ssr: false }); // ✅

export default function Page() {
  return (
    <section>
      <h1>hy</h1>
      <RandomNoSSR />
    </section>
  );
}
```

#### Sử dụng `suppressHydrationWarning`

Khi không thể tránh khỏi việc nội dung server và client khác nhau, chẳng hạn như với timestamp, bạn có thể bỏ qua cảnh báo hydrate mismatch bằng cách thêm thuộc tính `suppressHydrationWarning={true}` vào phần tử.

Trong ví dụ trên, không cần thay đổi gì khác, chỉ cần thêm thuộc tính `suppressHydrationWarning` vào chỗ không khớp.

```ts
'use client';

export default function Random(p: {}) {
  return <section suppressHydrationWarning>{value}</section>;
}
```

#### Phương án tốt nhất: Phân chia component với dữ liệu ban đầu từ server

Do lỗi hydrate mismatch xảy ra khi render lần đầu trên client không khớp với server, ta có thể giải quyết bằng cách truyền dữ liệu ban đầu từ server cho component client.

`Cách này giữ nguyên quyền lợi của SSR cho component và vẫn giữ khả năng tương tác trên client.`

Chúng ta chia component thành hai phần: component trên server là cha của component trên client. Component cha sẽ SSR và truyền `initialData` cho component con qua props. Component con render dựa trên `initialData`, giải quyết hoàn hảo vấn đề!

```ts
// Client.Random.tsx
'use client';
import { useEffect, useState } from 'react';

export function ClientRandom(p: { initialData: number }) {
  const [value, setValue] = useState(p.initialData);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setValue(Math.random());
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return <section>{value}</section>;
}

// Server.Random.tsx
import { ClientRandom } from './Client.Random';

export function ServerRandom() {
  return <ClientRandom initialData={Math.random()} />;
}

// page.tsx
import { ServerRandom } from './Server.Random';

export default function Page() {
  return (
    <section>
      <h1>hy</h1>
      <ServerRandom />
    </section>
  );
}
```

## SSR/Streaming đồng thời giữ khả năng tương tác phía client

**「Bối cảnh sử dụng:」**

- Thông tin cập nhật thời gian thực, ví dụ như tin tức, cổ phiếu, tiền điện tử, với giả định rằng dữ liệu sẽ tự động cập nhật mỗi phút.

**「Yêu cầu logic:」**

- Sau khi component được mount, thực hiện yêu cầu dữ liệu mỗi phút.
- Tránh lỗi Hydration Mismatch.
- Hỗ trợ Streaming dữ liệu.

**「Giải pháp:」**

- Sử dụng phương án cha con với dữ liệu `initialData`.

**「Mã nguồn đơn giản:」**

```ts
// page.tsx
import { A as AServer } from '@/app/components/A/Server.A';
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      // ...
      <Suspense>
        <AServer />
      </Suspense>
    </>
  );
}

// /components/A/Server.A.tsx
import { A as AClient } from './Client.A';

export async function A() {
  const data = await fetch('/api');
  return <AClient initialData={data} />;
}

// /components/A/Client.A.tsx
'use client';
import { useEffect, useState } from 'react';

export function A(p: { initialData: SomeType }) {
  const [data, setData] = useState<SomeType>(p.initialData);

  const fetchFn = async () => {
    const res = await fetch('/api');
    setData(res);
  };

  useEffect(() => {
    fetchFn();
    const intervalId = setInterval(fetchFn, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <section>{JSON.stringify(data)}</section>;
}
```

## Các cách fetch dữ liệu

Vui lòng xem [NextJs 14 Summarize data fetching architecture4](https://juejin.cn/post/7385061036830031872)

## Form và Server Action

Quy trình cơ bản của biểu mẫu Form: 「Kiểm tra Form phía frontend --> Gửi dữ liệu --> Kiểm tra dữ liệu trên server --> Lưu vào cơ sở dữ liệu」

### Kiến thức cơ bản

Trong các dự án React-SPA, khi gửi biểu mẫu, chúng ta thường sử dụng cách tương tác qua API POST. Bài viết này sẽ không giới thiệu về cách gửi biểu mẫu qua API nữa.

Next.js 14, ngoài việc giữ lại cách tương tác qua API, còn cung cấp chế độ **Server Action**. Server Action là các hàm bất đồng bộ được thực thi trên Server, có thể sử dụng trong các thành phần của server và client để xử lý việc gửi biểu mẫu và thay đổi dữ liệu trong ứng dụng Next.js.

Sử dụng chỉ thị React `"use server"` để định nghĩa các hành động trên server. Có thể đặt chỉ thị này ở đầu hàm `async` để đánh dấu hàm đó là hành động của server, hoặc đặt ở đầu tệp để đánh dấu tất cả các xuất trong tệp đó là hành động của server.

### Ví dụ 1: Cách sử dụng hàm nội tuyến

```ts
// form.tsx
import { createUser } from '@/app/actions/user';

export default function Page() {
  async function create(formData: FormData) {
    'use server'; // Đây là hành động của server
    // Gọi service trên server
    await createUser(formData);
  }

  return (
    <form action={create}>
      <input name="username" />
      <button type="submit">Submit</button>
    </form>
  );
}

// @/app/actions/user.ts
export async function createUser(formData: FormData) {
  const username = formData.get('username');
  // ...
}
```

### Ví dụ 2: Cách sử dụng qua module

```ts
// form.tsx
import { createUser } from '@/app/actions/user';

async function create(formData: FormData) {
  // Gọi service trên server
  await createUser(formData);
}

// @/app/actions/user.ts
'use server';

export async function createUser(formData: FormData) {
  // ...
}
```

### Lưu ý

Biểu mẫu trong **Server Component** và **Client Component** có sự khác biệt trong cách sử dụng.

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/mshqAkialV7EDeiaib2FwDbJoWAl5E9Eluqvb56JW4frSKQ7tDMicj4uCn9tQHgg0BTLVaVcBSibDQAaCOgBYibYpiaWA/640?wx_fmt=png&from=appmsg)

#### So sánh:

- Thành phần server chỉ có thể nhập các hành động sử dụng chỉ thị `"use server"` ở cấp module.
  
- ![Image](https://mmbiz.qpic.cn/sz_mmbiz_jpg/YBFV3Da0NwtYoRFA7WlFGRLVXOMskBQjzj6ZGI9t1ufAIWMId4cK1bEHIASdaOz6KbrwdD7lwxBukjyfsKweZg/640?wx_fmt=other&from=appmsg)
  
- **Khuyến nghị:** Sử dụng Client Component để xử lý biểu mẫu, kiểm tra dữ liệu trên frontend trước khi gửi. Sau đó, gửi dữ liệu lên server để kiểm tra thêm, đảm bảo tính chính xác. 

- Dù là thành phần server hay client, dữ liệu cuối cùng vẫn cần được kiểm tra trên server.

### Tương tác biểu mẫu

#### Không khuyến nghị - Cách 1: useFormState và useFormStatus

Các thành phần phía máy khách kết hợp `ReactDom.useFormState` và `ReactDom.useFormStatus`, Server có thể trả về thông tin lỗi xác thực của biểu mẫu.

Cách này, Server thực hiện xác thực, sau đó phản hồi cho máy khách.

```ts
import { useFormState } from 'react-dom';   
export default function CreatePage() {    
    const { pending } = useFormStatus();    
    return (        
        <form action={formAction}>        
            // ...        
            <button type="submit" disabled={pending}>Gửi</button>        
        </form>    
    );   
}
```

Ví dụ:

```ts
// form.tsx   
'use client';      
import { useFormStatus, useFormState } from 'react-dom';   
import { createUser } from '@/app/actions/user';   
import type { State } from '@/app/actions/user';      

export default function CreatePage() {    
    // Khởi tạo trạng thái biểu mẫu    
    const { pending } = useFormStatus();    
    // Khởi tạo trạng thái biểu mẫu    
    const initialState: State = { errors: {}, message: '' };    
    const [state, dispatch] = useFormState(createUser, initialState);       

    return (        
        <form action={dispatch} className="space-y-4">            
            <section>                
                <input                    
                    type="text"                    
                    name="username"                    
                    placeholder="Vui lòng nhập tên của bạn"                
                />                
                {/* Hiển thị lỗi */}                
                {state.errors?.username && state.errors.username.map((error: string) => (                    
                    <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>                
                ))}            
            </section>            
            <section>                
                <input                    
                    type="password"                    
                    name="password"                    
                    placeholder="Vui lòng nhập mật khẩu của bạn"                
                />                
                {/* Hiển thị lỗi */}                
                {state.errors?.password && state.errors.password.map((error: string) => (                    
                    <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>                
                ))}            
            </section>            
            <button type="submit" disabled={pending}>Gửi</button>        
        </form>    
    );   
}
```

```ts
// /app/actions/user   
'use server';      
import { revalidatePath } from 'next/cache';   
import { redirect } from 'next/navigation';   
import { z } from 'zod';      

export type State = {    
    errors?: {        
        username?: string[];        
        password?: string[];    
    };    
    message?: string;   
};      

const CreateUserSchema = z.object({    
    username: z.string(),    
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),   
});      

export async function createUser(prevState: State, formData: FormData) {    
    const validatedFields = CreateUserSchema.safeParse(formData);       
    console.log(validatedFields?.error?.flatten().fieldErrors, validatedFields.data);       
    if (!validatedFields.success) {        
        return {            
            errors: validatedFields.error.flatten().fieldErrors,            
            message: 'Tạo người dùng thất bại',        
        };    
    }       

    const { data } = validatedFields;       
    console.log(data);       
    // Chèn vào cơ sở dữ liệu...    
    // Sau khi thành công, làm mới bộ nhớ cache và chuyển hướng    
    revalidatePath('/userlist');    
    redirect('/');   
}
```

「Mẹo: Khi gửi biểu mẫu, ngoài việc truyền formData mặc định, có thể thêm tham số bổ sung, ví dụ như thao tác cập nhật, cần có id」

*   Phương thức id được bao gồm trong formData, gửi đến Server.

```ts
// form.tsx   
<input type="hidden" name="id" value={id}      
// action.ts   
export async function updateUser(formData: FormData) {    
    const id = formData.get('id');   
}
```

*   Phương thức actionFn.bind(null, id), id không được bao gồm trong formData, id là tham số đầu tiên của actionFn.

```ts
// form.tsx   
const updateUserWithId = updateUser.bind(null, id);      
<form action={updateUserWithId} />      
// action.ts   
export async function updateUser(id: string, formData: FormData) {}      
// form-2.ts   
const updateUserWithId = updateUser.bind(null, id);   
const [state, dispatch] = useFormState(updateUserWithId, initialState);      
<form action={dispatch} />      
// action.ts   
export async function updateUser(id: string, prevState: any, formData: FormData) {}
```

### Khuyến nghị - react-hook-form + zod + @hookform/resolvers + @hookform/error-message

Sau khi kiểm tra ở phía client thành công --> Gửi biểu mẫu --> Kiểm tra phía server --> Lưu database

##### react-hook-form5

```ts
'use client';      
import { useForm } from 'react-hook-form';   
import { createUser } from '@/app/actions/user';   

export default function App() {    
    const { register, handleSubmit, formState } = useForm({    
        // Nếu đã thiết lập defaultValues, giá trị sẽ được tiêm vào các phần tử biểu mẫu tương ứng, thường dùng cho thao tác cập nhật    
        // defaultValues: {    
        //     name: 'xfz',    
        //     age: 20,    
        // },    
    })    
    // Sử dụng register thay thế cho tên của các phần tử biểu mẫu, và bao bọc actionFn bằng handleSubmit để gửi    
    return (    
        <form onSubmit={handleSubmit(submit)}>    
            <input    
                {...register('name', {    
                    required: 'Trường này là bắt buộc',    
                    minLength: { value: 3, messsage: 'Quá ngắn' },    
                    validate: value => {    
                        if (value === 'f*ck') {    
                            return 'Không dùng từ xấu';    
                        }    
                    },    
                })}    
            />    
            {/* Hiển thị lỗi xác thực */}    
            <span>{formState.errors.name.message}</span>    
            <input    
                type="number"    
                {...register('age', { required: 'Trường này là bắt buộc' })}    
            />    
            <span>{formState.errors.age.message}</span>    
            <button type="submit">Gửi</button>    
        </form>    
    );   
};
```

Dù client đã thực hiện kiểm tra biểu mẫu, server vẫn cần kiểm tra lại. Vẫn sử dụng công cụ zod, đối với lỗi trả về từ server có thể hiển thị bằng toast.

```ts
// @/app/actions/user.ts   
'use server';      
import { z } from 'zod';      

const CreateUserSchema = z.object({    
    name: z    
        .string().min(3, { messsage: 'Quá ngắn' })    
        .refine(value => value !== 'f*ck', { message: 'Không dùng từ xấu' }),    
    age: z.number()   
});      

export type CreateUserSchemaParams = typeof CreateUserSchema._type;      

export async function createUser(body: CreateUserSchemaParams) {    
    try {    
        CreateUserSchema.parse(body);    
        // Chèn vào cơ sở dữ liệu    
        return { data: xxx, success: true };    
    } catch (error) {    
        return {    
            data: null,    
            status: false,    
            status: 500,    
            message: 'Có gì đó không ổn ' + (error as Error).message,    
        };    
    }   
}
```

Mã nguồn trên trang biểu mẫu có hơi lộn xộn, không đủ gọn gàng, phương pháp xác thực biểu mẫu đã được viết ở phần HTML, điều này không thuận tiện cho việc bảo trì. Vậy chúng ta nên giải quyết như thế nào? Theo dõi bài viết...

##### Sử dụng zod trong Component5

Công cụ zod có thể được sử dụng cả ở phía front-end và back-end, điều này rất thuận tiện, giữ cho việc kiểm tra phía trước và phía sau nhất quán, một bộ kiểm tra dùng ở hai nơi, thật tuyệt vời.

Kết hợp với react-hook-form, cần thêm gói @hookform/resolvers. Tôi khuyến nghị mọi người cũng nên thêm @hookform/error-message, một bộ hoàn chỉnh, bắt đầu thôi...

```ts
import { z } from 'zod';   
import { useForm } from 'react-hook-form';   
import { zodResolver } from '@hookform/resolvers/zod';   
import { createUser } from '@/app/actions/user';   
import { useRouter } from 'next/navigation';      

const FormSchema = z.object({    
    name: z    
        .string()    
        .min(3, { message: 'Quá ngắn' })    
        .refine(value => value !== 'f*ck', { message: 'Không dùng từ xấu' }),    
    age: z.number(),   
});      

export default function App() {    
    const { register, handleSubmit, formState: { errors } } = useForm({    
        // Tải sơ đồ ở đây    
        resolver: zodResolver(FormSchema),    
        // Nếu đã thiết lập defaultValues, giá trị sẽ được tiêm vào các phần tử biểu mẫu tương ứng, thường dùng cho thao tác cập nhật    
        // defaultValues: {    
        //     name: 'xfz',    
        //     age: 20,    
        // },    
    });       

    const submit = async (formData: typeof FormSchema._type) {    
        const router = useRouter();       

        try {    
            const { success, message } = await createUser(formData);    
            if (success) {    
                alert('Thành công');    
                router.push('/userlist');    
                router.refresh();    
            } else {    
                alert('Tạo không thành công: ' + message);    
            }    
        } catch (error) {    
            console.error(error?.message ?? error);    
        }    
    };       

    // Sử dụng register thay thế cho tên của các phần tử biểu mẫu, và bao bọc actionFn bằng handleSubmit để gửi    
    return (    
        <form onSubmit={handleSubmit(submit)}>    
            <input {...register('name')} />    
            <span>{errors.name.message}</span>    
            <input type="number" {...register('age')} />    
            <span>{errors.age.message}</span>    
            <button type="submit">Gửi</button>    
        </form>    
    );   
};    
```

Mã nhìn gọn gàng hơn nhiều, tiếp tục tối ưu hóa thông tin lỗi...

##### @hookform/error-message5

Dựa trên ví dụ ở trên, chúng ta có thể đóng gói thông tin lỗi xác thực biểu mẫu thành một thành phần, thuận tiện cho việc sử dụng.

```ts
import { ErrorMessage } from '@hookform/error-message';   
import { FieldErrors } from 'react-hook-form';      

export function FieldError(p: { name: string; errors: FieldErrors }) {    
    return (    
        <section className="text-red-500">    
            <ErrorMessage    
                errors={p.errors}    
                name={p.name}    
            />    
        </section>    
    );   
}   

// <span>{errors.name.message}</span>   
<FieldError name="name" errors={errors} />   
<FieldError name="age" errors={errors} />   
```
Here's the translation into Vietnamese:

## SEO

*   Trong tệp `/app/layout.tsx`, thiết lập metadata cấp cao nhất.
    
*   Trong các trang, cũng có thể thiết lập metadata riêng cho từng trang và gộp chúng với metadata cấp cao nhất.

```ts
// /app/layout.tsx
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Nextjs',
  description: 'Hướng dẫn sử dụng nextjs',
  keywords: ['nextjs14', 'react', 'typescript'],
  // Khi trang được chia sẻ trên các nền tảng xã hội, hình ảnh này sẽ hiển thị
  openGraph: {
    images: '/opengraph-image.png',
  },
  // Địa chỉ này sẽ được sử dụng như một tiền tố cho một số tùy chọn cấu hình
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

// /app/about/page.tsx
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Giới thiệu',
};
```

"Nếu muốn trang SSG với tham số động và metadata động, có thể sử dụng `generateStaticParams`."

## Giải thích tệp .env

Tệp `.env` chứa các biến môi trường mà NextJs sử dụng trong quá trình chạy, bao gồm địa chỉ API, địa chỉ kết nối cơ sở dữ liệu và các thông tin khóa liên quan.

Các biến có tiền tố `NEXT_PUBLIC_` có thể được truy cập từ phía Client, nếu không, chỉ có thể truy cập từ phía Server.

Lưu ý: Khi sử dụng kho chứa không công khai, hãy thêm `.env` vào `.gitignore` để ngăn thông tin nhạy cảm bị gửi lên.

## Cơ sở dữ liệu

Chúng ta có thể tải cơ sở dữ liệu về máy cục bộ hoặc sử dụng trực tiếp "cơ sở dữ liệu đám mây".

"Các loại cơ sở dữ liệu:"

*   MongoDB
    
*   MySql
    
*   Sqlite
    
*   Postgres

"Cơ sở dữ liệu đám mây:"

*   supabase5 - postgres
    
*   MongoDB6 - mongodb
    
*   vercel7 - postgres

### Ví dụ về MongoDB đám mây

1.  Đăng ký trên MongoDB và tạo tên cơ sở dữ liệu.
    
2.  Chỉnh sửa tệp `.env`, thêm địa chỉ MongoDB.

"Lưu ý: Thêm `.env` vào `.gitignore`."

`DATABASE_URL="mongodb+srv://{username}:{password}@cluster0.ugofsmz.mongodb.net/{databaseName}"`

3.  Chạy lệnh `bun add mongoose`.
    
4.  Kết nối cơ sở dữ liệu.

```ts
import mongoose from 'mongoose';

export const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log('DB Connected');
};
```

5.  Tạo model bảng dữ liệu.

```ts
import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
});

// Định nghĩa bảng user
const UserModel = mongoose.models.user || mongoose.model('user', Schema);

export default UserModel;
```

6.  Thao tác với cơ sở dữ liệu.

```ts
/api/route.ts
import { connectDB } from '@/lib/config/db';
import UserModel from '@/lib/models/UserModel';
import { NextRequest, NextResponse } from 'next/server';

const LoadDB = async () => {
    await connectDB();
};

LoadDB();

export async function GET(request: NextRequest) {
    const data = await UserModel.find({});
    return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
    const { name, age } = await request.json();
    await UserModel.create({
        name,
        age,
    });
    return NextResponse.json({ msg: 'Người dùng đã được tạo' });
}

export async function DELETE(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    await UserModel.findByIdAndDelete(id);
    return NextResponse.json({ msg: 'Người dùng đã bị xóa' });
}

export async function PUT(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    const body = await req.json();
    await UserModel.findByIdAndUpdate(id, {
        $set: {
            name: body.name,
            age: body.age,
        },
    });
    return NextResponse.json({ msg: 'Todo đã được cập nhật' });
}
```

Cảm giác thao tác vẫn còn hơi phức tạp, vì vậy tiếp theo, chúng ta sẽ cải tiến kết hợp với Prisma.
### Prisma

Prisma là một trình xây dựng truy vấn an toàn kiểu có thể tự động tạo ra, Prisma ORM cung cấp một API sạch sẽ và an toàn kiểu để thực hiện các truy vấn cơ sở dữ liệu, cho phép các nhà phát triển dễ dàng suy luận về các truy vấn cơ sở dữ liệu mà truy vấn này trả về các đối tượng JavaScript thông thường.

Nếu chúng ta thao tác trực tiếp với cơ sở dữ liệu "quan hệ", đối với tôi, người đã làm việc với Java trong 2 năm, cũng có một số khó khăn, trong khi việc sử dụng Prisma để thao tác với cơ sở dữ liệu thì thật đơn giản và tiện lợi.

「Hiện tại hỗ trợ:」

*   postgres
    
*   mongodb
    
*   mysql
    
*   SQLServer
    
*   ...

「Cài đặt:」

*   `bun add prisma -D`

「Sử dụng:」

「1. Khởi tạo Prisma (chỉ định loại cơ sở dữ liệu)」

*   `bunx prisma init --datasource-provider mongodb`
    
*   Ở đây tôi chọn mongodb, cũng có thể là postgres hoặc các loại khác.
    
*   Nếu không chỉ định loại cơ sở dữ liệu `bunx prisma init`, mặc định sẽ là `postgresql`.
    
*   Tạo tệp prisam/schema.prisma.

```ts
// prisam/schema.prisma   
generator client {  
  provider = "prisma-client-js"   
}      
datasource db {  
  provider = "mongodb" // loại cơ sở dữ liệu  
  url = env("DATABASE_URL") // địa chỉ cơ sở dữ liệu  
}
```

「2. Trong tệp .env, thêm DATABASE_URL (lấy từ Cloud MongoDB)」

`// .env   DATABASE_URL="địa chỉ cơ sở dữ liệu"`

「3. Tạo Model (bảng dữ liệu tương ứng với ORM) trong prisam/schema.prisma」 Mỗi model tương ứng với một bảng.

```ts
// prisam/schema.prisma      
// ...      
model User {  
  # id Int @id @default(autoincrement())    
  id String @id @default(auto()) @map("_id") @db.ObjectId # cách viết cố định cho mongodb  
  email String @unique # duy nhất  
  name String? # có thể để trống  
  posts Post[]   
}  
   
model Post {  
  id String @id @default(auto()) @map("_id") @db.ObjectId  
  title String  
  content String?  
  published Boolean @default(false)  
  author User @relation(fields: [authorId], references: [id])  
  authorId Int  
}  
# Bảng User và Post liên kết với nhau, User.id tương ứng với Post.authorId, có thể thực hiện truy vấn liên kết giữa hai bảng.
```

「4. `bunx prisma generate`」

*   Nó sẽ chạy lệnh `prisma generate` dưới engine (tự động cài đặt gói `@prisma/client` và tạo API Prisma Client tùy chỉnh dựa trên model của bạn).

```sh
# Lưu ý: Lệnh `prisma migrate` chỉ áp dụng cho cơ sở dữ liệu SQL vì chúng có cấu trúc bảng nghiêm ngặt. Ví dụ: postgres, mysql.   
# Tuy nhiên, MongoDB là một cơ sở dữ liệu tài liệu, và dữ liệu ở đây là phi cấu trúc, cần chú ý điều này.  
# Khi thực hiện lần đầu, cần thực hiện lệnh bên dưới.  
bunx prisma migrate dev --name init   # (init là tên cho lần di chuyển này, tương đương với thông tin git commit)  
- prisma migrate di chuyển để tạo bảng cơ sở dữ liệu.  
- Thực hiện bước này, chúng ta vẫn chưa có cơ sở dữ liệu, thực hiện lệnh này sẽ tạo cơ sở dữ liệu mongodb và bảng mặc định là `User` và `Post`.  
- Lệnh này thực hiện ba việc:  
  - Nó tạo một tệp di chuyển SQL mới trong thư mục `prisma/migrations` cho lần di chuyển này.  
  - Nó thực hiện di chuyển SQL trên cơ sở dữ liệu.  
  - Chạy prisma generate trong thư mục /prisma để tạo tệp migration/xxxx_init/migration.sql.  
# Nếu cần thay đổi bảng dữ liệu, ví dụ, thêm một trường job (String) vào bảng User, cần thực hiện lại di chuyển.  
prisma migrate dev --name added_job   # Tạo tệp migrations/xxx_added_job/migration.sql.  
# Để thêm Prisma Migrate vào dự án hiện có:  
1. prisma db pull  
2. Xóa thư mục `prisma/migrations` hiện có.  
3. Tạo thư mục mới `mkdir -p prisma/migrations/0_init`.  
4. bunx prisma migrate diff \  # Tạo di chuyển và lưu vào tệp.  
# Ứng dụng di chuyển ban đầu:  
1. bunx prisma migrate resolve --applied 0_init  
2. prisma migrate deploy  
Phần di chuyển này, tôi vẫn chưa nghiên cứu rõ, có thể xem tài liệu tại https://www.prisma.io/docs/orm/prisma-migrate/getting-started.
```

「5. Thao tác với cơ sở dữ liệu」

```ts
const { PrismaClient } = require('@prisma/client');      
const prisma = new PrismaClient();      
async function main() {  
  // Tạo mới  
  // await prisma.user.createMany([  
  //    { name: '111', email: '111@prisma.io' },  
  //    { name: '222', email: '222@prisma.io' },  
  // ]);  
  // await prisma.user.create({  
  //    data: {  
  //     name: 'Bob',  
  //     email: 'bob@prisma.io',  
  //     posts: {  
  //        create: [  
  //         {  
  //    title: 'Hello World',  
  //    published: true,  
  //         },  
  //         {  
  //    title: 'My second post',  
  //    content: 'This is still a draft',  
  //         },  
  //      ],  
  //     },  
  //   },  
  // });  
  // Cập nhật  
  // await prisma.user.update({  
  //    where: {  
  //    id: '667edacd346db77a9b95dfab',  
  //    },  
  //    data: {  
  //    name: 'hahaha',  
  //    },  
  // });  
  // Xóa  
  // await prisma.user.delete({  
  //    where: {  
  //    id: '667edacd346db77a9b95dfab',  
  //    },  
  // });  
  // Truy vấn  
  const users = await prisma.user.findMany({  
    include: {  
        posts: true,  
    },  
  });  
  console.log(users);  
}  
main()  
  .catch(async e => {  
      console.error(e);  
      process.exit(1);  
  })  
  .finally(async () => {  
      await prisma.$disconnect();  
  });
```

Lần đầu tiên thực hiện, cơ sở dữ liệu chưa có bảng User, khi chèn dữ liệu, nếu không có bảng, sẽ tự động tạo bảng.

「6. `npx prisma studio`」

*   Mở GUI Client Prisma, đã kết nối với cơ sở dữ liệu đám mây từ xa, thuận tiện cho việc truy vấn.

「7. Chỉnh sửa Prisma」

Lấy ví dụ với mongodb, tạo chỉ mục mới và tái tạo Client Prisma, và đẩy lên cơ sở dữ liệu từ xa.

`bunx prisma db push`

*   Tạo chỉ mục mới và tái tạo Client Prisma thì mới có hiệu lực.
### Prisma Sử Dụng Trong Next.js

Sau khi hoàn thành các bước trên, chúng ta có thể thực hiện các thao tác cụ thể trong Next.js.

**1. Tạo lớp công cụ Prisma Client**

```ts
// app/lib/db.ts
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

declare global {
  var DB: undefined | ReturnType<typeof prismaClientSingleton>;
}

const DB = globalThis.DB ?? prismaClientSingleton();

export { DB };

if (process.env.NODE_ENV !== 'production') globalThis.DB = DB;
```

**2. Sử dụng trong dịch vụ / hành động**

`@prisma/client` có thể ánh xạ tốt các kiểu dữ liệu model mà chúng ta đã định nghĩa trong schema, vì vậy chúng ta không cần phải viết lại các kiểu dữ liệu liên quan, điều này giúp chúng ta dễ dàng thiết lập kiểu cho biến.

```ts
'use server';
import { z } from 'zod';
import { DB } from '@/app/lib/db';
// Như bạn thấy, prisma rất tiện lợi, nó tự động ánh xạ kiểu dữ liệu của bảng User
import { User } from '@prisma/client';

const GetUserByIdSchema = z.object({
  id: z.string(),
});

export async function getUserById({ id }: typeof GetUserByIdSchema._type) {
  try {
    const data = await DB.user.findMany({
      where: { id },
    });
    return {
      status: 500,
      data,
      success: true,
      message: 'success',
    };
  } catch (e: unknown) {
    return {
      data: null,
      success: false,
      status: 500,
      message: 'Something went wrong: ' + (e as Error).message,
    };
  }
}

const UserSchema: z.ZodType<Omit<User, 'id'>> = z.object({
  email: z.string(),
  name: z.string().nullable(),
  job: z.string().nullable(),
});

export async function createUser(body: typeof UserSchema._type) {
  try {
    UserSchema.parse(body);
    const result = await DB.user.create({ data: body });
    return {
      status: 500,
      data: result,
      success: true,
      message: 'success',
    };
  } catch (e: unknown) {
    return {
      data: null,
      success: false,
      status: 500,
      message: 'Something went wrong ' + (e as Error).message,
    };
  }
}
```

```ts
// form.tsx
'use client';
import { User } from '@prisma/client';
// ...
// form tạo hoặc cập nhật
export function Form({ user }: { user: User }) {
  // ...
}
```
## Middleware

> ❝
> Middleware là một loại phần mềm nằm giữa hệ thống ứng dụng và phần mềm hệ thống, nó sử dụng các dịch vụ cơ bản (chức năng) mà phần mềm hệ thống cung cấp, kết nối các phần khác nhau của hệ thống ứng dụng trên mạng hoặc các ứng dụng khác nhau, nhằm đạt được mục đích chia sẻ chức năng.
> ❞

### Giới thiệu về Middleware trong Next.js

Trong Next.js, middleware cho phép chạy mã trước khi yêu cầu hoàn tất (trước khi nội dung được lưu vào bộ nhớ cache và các tuyến đường được khớp). Sau đó, dựa trên yêu cầu đầu vào, có thể sửa đổi phản hồi thông qua việc viết lại, chuyển hướng, sửa đổi tiêu đề yêu cầu hoặc phản hồi, hoặc phản hồi trực tiếp.

![Image](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/738ff98c9fe842f190d13087d09dcb0c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=877&h=393&s=44763&e=png&b=ffffff)

Do đó, chúng ta có thể sử dụng middleware để ghi log, kiểm tra quyền truy cập/đăng nhập, v.v.

Trong thư mục gốc của dự án, tạo tệp middleware.ts.

**Lưu ý:** `middleware.ts` phải nằm ở cùng cấp với thư mục `app`, nếu không sẽ không có hiệu lực, _đó là một bài học đau thương, suýt chút nữa đã làm hỏng máy tính của tôi_.

*   **Nếu có thư mục src, thì sử dụng src/middleware.ts**
    
*   **Nếu không có thư mục src, thì sử dụng middleware.ts**

```ts
// middleware.ts
import { NextRequest } from 'next/server';

// Logic xử lý middleware
export default function middleware(req: NextRequest) {
    console.log('I am the middleware');
    return NextResponse.next();
}
```

Khi yêu cầu đến Server, trước tiên dịch vụ sẽ in ra “I am the middleware”, sau đó mới khớp với tuyến đường.

Tuy nhiên, sẽ có rất nhiều log được in ra, vì mỗi yêu cầu đều đi qua middleware, chẳng hạn như hình ảnh, API, hoặc thậm chí là favicon.ico, do đó, chúng ta nên cách ly một số yêu cầu.

Trong middleware, thêm cấu hình để thực hiện việc khớp tài nguyên và xuất ra.

```ts
export default function middleware(req: NextRequest) {
    console.log('I am the middleware');
    if (req.nextUrl.pathname === '/a') {
        // Trong middleware, redirect hoặc rewrite, cần sử dụng đường dẫn tuyệt đối, không thể sử dụng đường dẫn tương đối
        // return NextResponse.redirect('/');
        return NextResponse.redirect(new URL('/', req.url));
    }
}

// Quy tắc khớp middleware, nếu không nằm trong phạm vi này thì sẽ không thực hiện logic middleware
export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

Làm mới trang, lần này cảm thấy dễ chịu hơn nhiều!

### Các trường hợp sử dụng Middleware

*   **Xác thực và Ủy quyền:** Đảm bảo danh tính của người dùng và kiểm tra cookie phiên trước khi cấp quyền truy cập vào các trang hoặc API cụ thể.
    
*   **Chuyển hướng phía Server:** Chuyển hướng người dùng ở cấp độ Server dựa trên các điều kiện cụ thể (ví dụ: cài đặt vùng, vai trò người dùng).
    
*   **Viết lại đường dẫn:** Hỗ trợ A/B testing, triển khai chức năng hoặc các đường dẫn cũ, viết lại đường dẫn đến các API hoặc trang dựa trên thuộc tính yêu cầu.
    
*   **Phát hiện bot:** Bảo vệ tài nguyên của bạn bằng cách phát hiện và chặn lưu lượng bot.
    
*   **Ghi log và phân tích:** Bắt và phân tích dữ liệu yêu cầu trước khi xử lý trang hoặc API để lấy nội dung.
    
*   **Chuyển đổi tính năng:** Kích hoạt hoặc vô hiệu hóa tính năng một cách động để thực hiện việc triển khai hoặc thử nghiệm tính năng một cách liền mạch.
    

### Các trường hợp không phù hợp với Middleware

*   **Lấy dữ liệu và thao tác phức tạp.**
    
*   **Các tác vụ tính toán nặng nề:** Middleware nên nhẹ và nhanh chóng; nếu không, nó có thể dẫn đến độ trễ khi tải trang.
    
*   **Xử lý phiên quy mô lớn:** Mặc dù middleware có thể xử lý các tác vụ phiên cơ bản, nhưng việc xử lý phiên quy mô lớn nên được quản lý bởi các dịch vụ xác thực hoặc bộ xử lý định tuyến chuyên dụng.
    
*   **Không khuyến nghị thực hiện các thao tác cơ sở dữ liệu trực tiếp trong middleware.**


### Cookie, Headers, CORS

#### Cookie

```ts
export default function middleware(req: NextRequest) {
    let cookie = req.cookies.get('xxx');
    console.log(cookie);
    
    const allCookies = req.cookies.getAll();
    console.log(allCookies);
    
    req.cookies.has('xxx'); // => boolean
    req.cookies.delete('xxx');
    
    // Thiết lập cookie trong phản hồi sử dụng API `ResponseCookies`
    const response = NextResponse.next();
    response.cookies.set('vercel', 'fast');
    response.cookies.set({
        name: 'vercel',
        value: 'fast',
        path: '/',
    });
    cookie = response.cookies.get('vercel');
    console.log(cookie);
    
    return response; // Cookie sẽ được thiết lập trong trình duyệt
}
```

#### Headers

```ts
export default function middleware(req: NextRequest) {
    // Nhân bản tiêu đề yêu cầu và thiết lập một tiêu đề mới `x-hello-from-middleware1`
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-hello-from-middleware1', 'hello');
    
    // Có thể thấy `x-hello-from-middleware1` trong yêu cầu api
    // { name: 'x-hello-from-middleware1', value: 'hello' }
    
    // Bạn cũng có thể thiết lập tiêu đề yêu cầu trong NextResponse.rewrite
    const response = NextResponse.next({
        request: {
            // Tiêu đề yêu cầu mới
            headers: requestHeaders,
        },
    });
    
    // Thiết lập một tiêu đề phản hồi mới `x-hello-from-middleware2`
    response.headers.set('x-hello-from-middleware2', 'hello');
    
    return response;
}
```

#### CORS

```ts
import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = ['https://acme.com', 'https://my-app.org'];

const corsOptions = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function middleware(request: NextRequest) {
    // Kiểm tra nguồn gốc từ yêu cầu
    const origin = request.headers.get('origin') ?? '';
    const isAllowedOrigin = allowedOrigins.includes(origin);
    
    // Xử lý các yêu cầu tiền kiểm
    const isPreflight = request.method === 'OPTIONS';
    
    if (isPreflight) {
        const preflightHeaders = {
            ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
            ...corsOptions,
        };
        return NextResponse.json({}, { headers: preflightHeaders });
    }
    
    // Xử lý các yêu cầu đơn giản
    const response = NextResponse.next();
    
    if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin);
    }
    
    Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    
    return response;
}

export const config = {
    matcher: '/api/:path*',
};
```

### waitUntil

Phương thức `waitUntil()` nhận một promise làm tham số và kéo dài thời gian sống của middleware cho đến khi promise được giải quyết. Điều này rất hữu ích cho việc thực hiện công việc ở phía sau, chẳng hạn như ghi log.

```ts
import { NextRequest, NextResponse } from 'next/server';
import type { NextFetchEvent } from 'next/server';

export default function middleware(req: NextRequest, event: NextFetchEvent) {
    event.waitUntil(
        fetch('https://my-analytics-platform.com', {
            method: 'POST',
            body: JSON.stringify({ pathname: req.nextUrl.pathname }),
        })
    );
    return NextResponse.next();
}

export const config = {
    matcher: ['/(api|trpc)(.*)'],
};
```
### Sử dụng nhiều Middleware

Mặc dù mỗi dự án chỉ hỗ trợ một tệp `middleware.ts`, bạn vẫn có thể tổ chức logic middleware theo cách mô-đun. Hãy tách các chức năng middleware thành các tệp `.ts` hoặc `.js` riêng biệt và nhập chúng vào tệp `middleware.ts` chính.

「Ví dụ:」

「1. Tạo thư mục `middlewares` trong thư mục gốc của dự án.」

「2. Tạo một số middleware trong thư mục `/middlewares`.」

```ts
// /middlewares/authMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';
import type { NextFetchEvent } from 'next/server';

export default function auth(req: NextRequest, ev: NextFetchEvent) {
    console.log('------- auth ------');
    const userId = req.cookies.get('userId');
    if (!userId) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
}

// /middlewares/loggerMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';
import type { NextFetchEvent } from 'next/server';

// Mô phỏng API
const analyze = (data: { pathname: string; searchParams: Record<string, string> }) =>
    new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log('---- Record log ----');
            resolve();
        }, 2000);
    });

export default function loggerMiddleware(req: NextRequest, event: NextFetchEvent) {
    const {
        nextUrl: { pathname, searchParams },
    } = req;
    event.waitUntil(
        analyze({
            pathname,
            searchParams: Object.fromEntries(searchParams),
        })
    );
    return NextResponse.next();
}

// /middlewares/testMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';

export default function testMiddleware(req: NextRequest) {
    console.log('------- test ------');
    return NextResponse.next();
}
```

3. **Tạo tệp `middleware.ts` trong thư mục gốc của dự án và tích hợp các middleware trên.**

```ts
// /middleware.ts
import { NextRequest } from 'next/server';
import type { NextFetchEvent } from 'next/server';
import authMiddleware from './middlewares/authMiddleware';
import logMiddleware from './middlewares/loggerMiddleware';
import testMiddleware from './middlewares/testMiddleware';

// Logic xử lý middleware
export default function middleware(req: NextRequest, ev: NextFetchEvent) {
    const { pathname } = new URL(req.url);

    if (pathname.startsWith('/create')) {
        authMiddleware(req, ev);
    }

    if (pathname.startsWith('/api') || pathname.startsWith('/trpc')) {
        logMiddleware(req, ev);
    }

    return testMiddleware(req);
}

export const config = {
    matcher: [
        '/create/:path*', // Khớp với đường dẫn /create
        '/(api|trpc)(.*)', // Khớp với đường dẫn /api
    ],
};
```

Bởi vì tôi muốn sau khi xác thực thì các middleware khác sẽ được thực thi, nên tôi không thêm `return` cho từng middleware. Nếu mỗi middleware có đường dẫn khớp riêng, bạn có thể thêm `return` cho từng middleware.

```ts
if (pathname.startsWith('/create')) {
    return authMiddleware(req, ev);
}

if (pathname.startsWith('/api') || pathname.startsWith('/trpc')) {
    return logMiddleware(req, ev);
}
```

## Xác thực và Ủy quyền

### Hiểu biết về khái niệm

* **Xác thực (Authentication)**: Kiểm tra xem người dùng có đã đăng nhập hay không.
  
* **Ủy quyền (Authorization)**: Kiểm tra xem người dùng có quyền truy cập vào một số tài nguyên hay không.

#### Cookie và Session

**Cookie**: Là thông tin trạng thái mà Server có thể lưu trữ trên thiết bị của người dùng, được lưu trữ trên trình duyệt.

**Session**: Khi người dùng đăng nhập, Server sẽ tạo một phiên và sinh ra một ID phiên duy nhất. ID phiên này sẽ được lưu trữ trong cookie của máy khách. Server thường lưu trữ dữ liệu phiên ở phía backend, chẳng hạn như trong bộ nhớ, cơ sở dữ liệu hoặc các hệ thống lưu trữ khác. Khi máy khách gửi yêu cầu, nó sẽ mang theo cookie, Server dựa vào ID phiên để lấy dữ liệu người dùng tương ứng, từ đó thực hiện xác thực.

#### JWT (JSON Web Token)

JWT là giải pháp xác thực hoàn toàn khác với phiên. Phiên lưu trữ toàn bộ dữ liệu người dùng ở phía Server, trong khi JWT lưu trữ tất cả dữ liệu ở phía máy khách. Để đảm bảo tính bảo mật, nó sẽ được ký, và mỗi lần yêu cầu, các dữ liệu này sẽ được mang theo, backend sẽ giải mã để lấy thông tin danh tính của người dùng. Lợi ích của việc sử dụng JWT là Server không cần lưu trữ bất kỳ dữ liệu phiên nào, giúp dễ dàng mở rộng.

**JWT là chuỗi ngẫu nhiên đã được mã hóa**, nó bao gồm ba phần:

* **Dữ liệu phát hành (Issuer Data)**: Dữ liệu về người phát hành.
  
* **Dữ liệu tùy chỉnh (Custom Data)**: Dữ liệu tùy chỉnh, chẳng hạn như thông tin người dùng.
  
* **Khóa ký bí mật (Secret Signing Key)**: Khóa (lưu trữ ở phía Server, không bao giờ nhìn thấy ở phía máy khách).

#### Phiên so với Token

| **Loại**               | **Phiên (Session)**                                                                                                                                                                                                                                                    | **Token (ví dụ: JWT)**                                                                                                                                                                                                                                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cách lưu trữ**       | Khi người dùng đăng nhập, Server sẽ tạo một phiên và sinh ra một ID phiên duy nhất. ID này sẽ được lưu trữ trong cookie của máy khách. Server thường lưu trữ dữ liệu phiên ở phía backend, chẳng hạn như trong bộ nhớ, cơ sở dữ liệu hoặc các hệ thống lưu trữ khác. | Khi người dùng đăng nhập, Server sẽ sinh ra một token. Token này bao gồm một số dữ liệu người dùng và chữ ký để đảm bảo tính toàn vẹn. Máy khách sẽ lưu trữ token này, chẳng hạn như trong cookie, localStorage hoặc nơi khác. Khi máy khách gửi yêu cầu, nó sẽ gửi token đến Server, Server sẽ xác minh tính hợp lệ của token. |
| **Trạng thái**         | Thông thường là có trạng thái. Điều này có nghĩa là Server cần lưu trữ thông tin về từng phiên.                                                                                                                                                                       | Thông thường là không có trạng thái. Server không cần lưu trữ thông tin về token, vì mỗi yêu cầu sẽ mang theo token, Server chỉ cần xác minh tính hợp lệ của nó.                                                                                                                                                                 |
| **Xuyên miền**         | Cookies theo mặc định không hỗ trợ xuyên miền.                                                                                                                                                                                                                         | Dễ dàng truyền tải giữa các miền khác nhau, vì chúng chỉ là một chuỗi.                                                                                                                                                                                                                                                             |
| **Cách hết hạn**       | Có thể thiết lập thời gian hết hạn cho phiên, sau thời gian này, phiên sẽ không còn hiệu lực.                                                                                                                                                                          | Có thể thiết lập thời gian hết hạn khi sinh token, cũng có thể thiết lập chính sách làm mới cho token.                                                                                                                                                                                                                             |
| **Bảo mật**            | Do ID phiên thường được lưu trữ trong cookie, nó có thể dễ bị tấn công CSRF (Cross-Site Request Forgery).                                                                                                                                                              | Nếu được lưu trữ trong cookie HTTP-only, có thể giảm thiểu rủi ro tấn công XSS (Cross-Site Scripting), nhưng nếu sử dụng không đúng cách, có thể bị lộ trước các cuộc tấn công khác.                                                                                                                                               |
| **Khả năng mở rộng**   | Đối với các ứng dụng lớn, việc quản lý phiên trên Server có thể trở nên phức tạp, đặc biệt trong môi trường cân bằng tải.                                                                                                                                             | Do là không có trạng thái, rất dễ mở rộng, phù hợp với các ứng dụng lớn và phân tán.                                                                                                                                                                                                                                               |
| **Tình huống sử dụng** | Phù hợp với các ứng dụng web truyền thống và đơn nhất.                                                                                                                                                                                                                 | Phù hợp với SPA (Single Page Applications), ứng dụng di động, dịch vụ API và các tình huống xuyên miền.                                                                                                                                                                                                                            |

#### Thư viện và nền tảng xác thực bên thứ ba

* **Auth0**
  
* **Clerk**
  
* **Lucia**
  
* **NextAuth.js**
  
* **...**

### Quy trình xác thực và ủy quyền

Thông qua một ví dụ mô phỏng nhỏ, để làm quen với quy trình xác thực và ủy quyền, không cần quan tâm đến chi tiết mã, có thể chi tiết có chút vấn đề.

「1. Tạo một trang đăng nhập /app/login/page.tsx」

```tsx
import { login } from '@/app/actions/auth';

export default function LoginPage() {
    return (
        <form action={login}>
            <input
                type="email"
                name="email"
                placeholder="Email"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
        </form>
    );
}
```

「2. Viết action login」

Sau khi xác thực thông tin danh tính người dùng thành công, tạo phiên (session) và ghi phiên đó vào trình duyệt của máy khách.

```ts
// @/app/actions/auth.ts
'use server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    try {
        // Kiểm tra tên người dùng + mật khẩu
        // Nếu qua, tạo session và ghi vào trình duyệt
        const expires = +new Date(Date.now() + 60 * 60 * 1000); // Thời gian hiệu lực 1h
        const session = 'test123';
        cookies().set('session', session, { expires, httpOnly: true });
        
        // Trong service, không thể sử dụng NextResponse để thực hiện redirect
        // NextResponse.redirect('/');
        redirect('/');
    } catch (error) {
        throw error;
    }
}
```

「3. Ủy quyền (middleware)」

Thông qua middleware, thực hiện `route guard`.

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
    const { pathname } = new URL(req.url);
    if (pathname.startsWith('/create')) {
        const session = req.cookies.get('session')?.value;
        if (!session) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/create/:path*'],
};
```

* Khi truy cập vào `/create`, nếu chưa đăng nhập (không lấy được session), sẽ được chuyển hướng đến `/login`.

![Image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d7766b731e64d0fb7d39dee9eceea63~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1002&h=729&s=144239&e=png&b=ffffff)

### NextAuth

NextAuth là một thư viện JavaScript mã nguồn mở, cung cấp nhiều phương thức xác thực người dùng khác nhau, có thể được sử dụng để thực hiện đăng nhập và đăng xuất. Một số phương thức phổ biến bao gồm:

- **Xác thực OAuth** (sử dụng đăng nhập với Google, GitHub, LinkedIn, v.v.)
- **Xác thực tên người dùng và mật khẩu**

NextAuth cũng cung cấp các phương thức như `auth`, `signIn`, `signOut`, v.v. để thực hiện xác thực.

Sử dụng cụ thể như sau:

**1. Cài đặt thư viện NextAuth:**

```bash
bun add next-auth@beta
```

**2. Cài đặt biến môi trường duy nhất `AUTH_SECRET` trong .env:**

- Sử dụng lệnh `bunx auth secret` hoặc `openssl rand -base64 32`
- Sao chép chuỗi được tạo ra vào tệp `.env`
- Đây là giá trị ngẫu nhiên dùng để mã hóa token và băm xác minh email.

**3. Tạo trang đăng nhập tại `/app/login/page.tsx`:**

```tsx
'use client';

import { authenticate } from '@/app/actions/authentication';

export default function LoginPage() {
    // ...
    return (
        <form action={authenticate}>...</form>
    );
}
```

**4. Tạo `/app/actions/authentication.ts`:**

```ts
'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        // Sử dụng phương thức đăng nhập "email/password"
        await signIn('credentials', {
            ...formData,
            redirect: true,
            callbackUrl: '/',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
```

**5. Tạo tệp `auth.ts` trong thư mục gốc của dự án và xuất các phương thức `signIn`, `signOut`, v.v.:**

```ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { z } from 'zod';
// import { getUser } from '@/app/service/user';

export const { signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                // Xác thực người dùng qua biểu mẫu
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);
                // Nếu xác thực thành công, lấy thông tin người dùng từ cơ sở dữ liệu
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    // const user = await getUser(email);
                    const user = { userId: '123', email, password: 'xxxxx' };
                    // Nếu người dùng không tồn tại, xác thực thất bại
                    if (!user) return null;
                    // Xác thực mật khẩu
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;
                }
                // Nếu xác thực qua biểu mẫu thất bại
                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
```

**6. Cấu hình auth.config:**

```ts
// auth.config.ts
import { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login', // Cấu hình này: khi xác thực thất bại, sẽ tự động chuyển hướng đến /login
    },
    callbacks: {
        // auth lưu phiên người dùng
        // request phát sinh yêu cầu
        authorized({ auth, request: { nextUrl } }) {
            // Khi chuyển trang, gọi phương thức này, ở đây kiểm tra xem có đăng nhập không
            const isLoggedIn = !!auth?.user;
            if (nextUrl.pathname.startsWith('/create')) {
                return isLoggedIn; // Chuyển hướng người dùng chưa xác thực về trang đăng nhập
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/create', nextUrl));
            }
            return true;
        },
    },
    providers: [], // Thêm các providers với một mảng rỗng tạm thời
} as NextAuthConfig;
```

**7. Thêm `auth.config` vào NextAuth:**

```ts
// auth.ts
import { authConfig } from './auth.config';

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        // ...
    ],
});
```

**8. Trong `middleware.ts`, nhập `auth.config`:**

```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

// Cấu hình khi nào thực hiện kiểm tra middleware
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'], // Loại trừ các địa chỉ này
};
```

**9. Truy cập vào `/create` trong trình duyệt để xem kết quả.**
### Clerk nền tảng đăng nhập bên thứ ba

Clerk cung cấp cho người dùng các dịch vụ xác thực đăng nhập/đăng xuất, đăng ký người dùng, quản lý vai trò người dùng, v.v. Là một nền tảng, nó cung cấp các trang đăng nhập/đăng xuất/đăng ký đẹp mắt, vì vậy phiên người dùng được lưu trữ trên Server của nền tảng này.

Thông qua `@clerk/nextjs`, khi tích hợp vào dịch vụ của chúng tôi, chúng tôi có thể sử dụng các API liên quan để lấy phiên (session) và lưu trữ vào cơ sở dữ liệu của riêng mình để thuận tiện cho việc quản lý.

Các thao tác cụ thể chỉ cần làm theo từng bước trong tài liệu hướng dẫn trên trang web là có thể, khá tiện lợi và đơn giản.

## Quốc tế hóa i18n

Next.js cung cấp khả năng cấu hình nội dung để định tuyến và hiển thị hỗ trợ nhiều ngôn ngữ. Điều này giúp trang web phù hợp với nội dung hiển thị của các khu vực khác nhau.

### next-intl

Lấy ví dụ về next-intl, cấu trúc dự án như sau:

```
├── messages
│   ├── en.json   // Tiếng Anh
│   └── cn.json   // Tiếng Trung
├── next.config.mjs
└── middleware.ts
└── app
    └── [locale]
        ├── layout.tsx
        └── page.tsx
        └── sign-in
            └── page.tsx
        └── sign-up
            └── page.tsx
```

1. Chạy lệnh `bun add next-intl`.

2. Tại thư mục gốc, tạo thư mục `messages` để lưu trữ thông tin nội dung của các ngôn ngữ khác nhau.

3. Trong thư mục `messages`, tạo các tệp thông tin nội dung cho các ngôn ngữ liên quan, mỗi ngôn ngữ sẽ có một tệp tương ứng với nội dung của trang.

```json
// /messages/en.json
{
  "rootLayout": {
    "test": "Test"
  },
  "auth": { // Có thể định nghĩa key theo đường dẫn
    "sign-in": {
      "title": "Sign in!"
    },
    "sign-out": {
      "title": "Sign out!"
    }
  },
  "home": {
    "buttons": {
      "add": "Add",
      "remove": "Remove"
    }
  }
}

// /messages/cn.json
{
  "rootLayout": {
    "test": "测试"
  },
  "auth": { // Có thể định nghĩa key theo đường dẫn
    "sign-in": {
      "title": "登录 !"
    },
    "sign-out": {
      "title": "注销 !"
    }
  },
  "home": {
    "buttons": {
      "add": "添加",
      "remove": "删除"
    }
  }
}
```

4. Cấu hình `next.config.mjs`.

```javascript
/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  reactStrictMode: false,
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
```

5. Tại thư mục gốc, tạo tệp `i18n.ts` để cấu hình thông tin ngôn ngữ.

```javascript
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Có thể nhập từ cấu hình chia sẻ
export const LOCALES = ['en', 'cn'] as const;
export const DEFAULT_LOCALE = 'en';
export type LOCALES_TYPE = (typeof LOCALES)[number];

export default getRequestConfig(async ({ locale }) => {
  // Xác thực rằng tham số `locale` đến là hợp lệ
  if (!LOCALES.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

6. Cấu hình middleware.

```javascript
import createMiddleware from 'next-intl/middleware';
import { LOCALES, DEFAULT_LOCALE } from './i18n';

// Middleware quốc tế hóa
const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

// Các trang không cần kiểm tra xác thực
const publicPages = ['/', '/sign-in', '/sign-up'];

const publicPathnameRegex = RegExp(
  `^(/(${LOCALES.join('|')}))?(${publicPages
    .flatMap((p) => (p === '/' ? ['','/'] : p))
    .join('|')})/?$`,
  'i'
);

export default function middleware(req: NextRequest) {
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
  
  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return // Kiểm tra xác thực
  }
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

7. Di chuyển tất cả nội dung trong app vào `/app/[locale]`.

8. Nhập i18n trong Layout và bao bọc bằng `NextIntlClientProvider`. Các thành phần và con thành phần được bao bọc bởi `NextIntlClientProvider` có thể chia sẻ message.

```javascript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Cung cấp tất cả các message cho client
  const messages = await getMessages({
    locale: params.locale,
  });
  const t = await getTranslations('rootLayout');

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <section>{t('test')}</section>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

* Truy cập `/en/~`, hiển thị `Test`.
  
* Truy cập `/cn/~`, hiển thị `测试`.

9. Thiết lập thông tin nội dung tương ứng với locale trên các trang liên quan.

**Server Component: Sử dụng getTranslations**

```javascript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('home');

  return (
    <section>
      <button>{t('add')}</button>
      <button>{t('remove')}</button>
    </section>
  );
}
```

**Client Component: Sử dụng useTranslations**

```javascript
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('home');

  return (
    <section>
      <button>{t('add')}</button>
      <button>{t('remove')}</button>
    </section>
  );
}
```

10. Thành phần chuyển đổi ngôn ngữ.

```javascript
'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export function ToggleLocale() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = (item: string) =>
    locale !== item && router.replace(`${item}${pathname.split('/' + locale)[1]}`);

  return (
    <ul>
      {['en', 'cn'].map(item => (
        <li
          className={`${locale === item ? 'active' : ''}`}
          onClick={() => toggleLanguage(item)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
```

### Mẹo nhỏ: Thêm gợi ý mã cho useTranslation hoặc getTranslation

```javascript
// global.d.ts
type Messages = typeof import('./messages/en.json');
declare interface IntlMessages extends Messages {}
```
![Image](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e81425517839417d8042951243a5d63d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=857&h=185&s=46011&e=png&b=202020)

## tRPC

tRPC cung cấp các kiểu dữ liệu TypeScript chia sẻ giữa phía trước và phía sau, cho phép xây dựng API an toàn về kiểu dữ liệu, với các gợi ý kiểu trực quan. Điều này giúp trải nghiệm phát triển trở nên mượt mà hơn và nâng cao hiệu suất phát triển cá nhân.

Mặc dù tRPC và REST API đều được sử dụng cho giao tiếp HTTP giữa phía trước và phía sau, nhưng tRPC tiện lợi hơn nhiều so với REST API và thậm chí là GraphQL.

### tRPC so với REST API

**Phương pháp REST API: Giao thức ràng buộc**

1. Cấu hình một địa chỉ yêu cầu cơ bản trên phía khách, chẳng hạn như `my.com/10`.
    
2. Cấu hình các phương thức yêu cầu khác nhau cùng với địa chỉ yêu cầu tương ứng trên phía khách: GET, POST, PUT, DELETE.
    
3. Sau khi phía khách khởi xướng yêu cầu, phía Server sẽ thực hiện các hàm xử lý tương ứng dựa trên địa chỉ yêu cầu và phương thức, sau đó trả lại kết quả cho phía khách.
    
4. Phía trước được viết bằng TypeScript, trong khi phía sau có thể là bất kỳ ngôn ngữ nào.

**Phương pháp tRPC:**

1. Chỉ có một địa chỉ yêu cầu, chẳng hạn như `my.com/10`, không cần nối thêm các địa chỉ con khác cho yêu cầu.
    
2. Viết các hàm xử lý trên phía Server.
    
3. Ở phía khách, chỉ cần gọi hàm bằng tên của nó (cực kỳ tiện lợi).
    
4. Cả phía trước và phía sau đều được viết bằng TypeScript, thích hợp cho các dự án toàn diện.

* **REST API**
    
| Client                    | Server                           |
|-------------------------------|-----------------------------------|
| `axios.get('/api/user')`      | `GET /api/user -> getUsers()`    |
| `axios.post('/api/user')`     | `POST /api/user -> addUser(user)`|
| `axios.put('/api/user')`      | `PUT /api/user -> updateUser(user)` |
| `axios.delete('/api/user')`   | `DELETE /api/user -> deleteUser(id)` |

* **tRPC**
    
| Client                             | Server            |
|----------------------------------------|-------------------|
| `trpcClient.getUsers.query()`         | `-> getUsers()`   |
| `trpcClient.addUser.mutate()`         | `-> addUser(user)`|
| `trpcClient.updateUser.mutate()`      | `-> updateUser(user)` |
| `trpcClient.deleteUser.mutate()`      | `-> deleteUser(id)` |

### Đặc điểm của tRPC

* Không cần phương thức và địa chỉ con, Client có thể gọi trực tiếp hàm của Server (RPC).
    
* Trong cùng một trang, nhiều yêu cầu sẽ được gộp lại thành một yêu cầu.

| ![Image](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa9ef9067d8448cb997e6b0fafe53ca4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=888&h=352&s=80473&e=png&b=1f1f1f) | ![Image](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fa4812f3c2f464a92704a2249fb4dd3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=887&h=128&s=24922&e=png&b=fdfdfd) |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

* Là một mô-đun phía trước, không có phụ thuộc, kích thước nhỏ.
    
* Có thể sử dụng cho cả dự án mới và cũ, phù hợp với nhiều framework phổ biến.

### Hướng dẫn nhanh về tRPC

**Cài đặt môi trường:**

`bun add @trpc/server@next @trpc/client@next`

**Server:**

* Khởi tạo Server tRPC.
    
* Định nghĩa hàm procedure.
    
* Truy vấn: query.
    
* Hoạt động: mutation (thêm, sửa, xóa).
    
* Tổ chức các hàm router (thay thế cho router API).
    
* Bật dịch vụ server để nhận yêu cầu.

```javascript
// /server/index.js
const { initTRPC } = require('@trpc/server');

// Khởi tạo Server tRPC
export const t = initTRPC.create();

/**
 * t.router()
 * t.procedure
 */

// Định nghĩa router
const appRouter = t.router({
    hello: t.procedure.query((params = {}) => {
        // Lấy dữ liệu ...
        const data = 'Hello World';
        return data;
    }),
    // input lấy dữ liệu yêu cầu từ Client, có thể kiểm tra tại đây
    // mutation thao tác dữ liệu
    save: t.procedure.input(val => val).mutation(opt => {
        // Lưu dữ liệu ...
        console.log(opt.input);
        return 'Lưu thành công';
    })
});

/**
 * opt
 *   .ctx // context
 *   .type // 'mutation'
 *   .getRawInput
 *   .meta
 *   .input // Dữ liệu gửi từ Client
 *   .next
 */

// Định nghĩa Server server
const server = createHTTPServer({
    router: appRouter
}).listen(5000, () => {
    console.log('Server đang chạy ...');
});
```

**Client:**

* Tạo Client tRPC.
    
* Cấu hình địa chỉ gọi dịch vụ phía sau.
    
* Gọi hàm từ xa (RPC).

```javascript
// /client/index.js
import { createTRPCClient } from '@trpc/client';

// Tạo Client tRPC
export const trpcClient = createTRPCClient({
    links: [
        // Cấu hình địa chỉ yêu cầu Server
        httpBatchLink({
            url: `http://localhost:5000`
        })
    ]
});

// Sử dụng trpcClient.query(params?) gọi query từ trpcServer
trpcClient.hello.query().then(data => {
    console.log(data); // 'Hello World'
});

// Sử dụng trpcClient.mutate(data?) gọi mutation từ trpcServer
trpcClient.mutate({id: 1, name: 'xfz'}).then(data => {
    console.log(data); // 'Lưu thành công'
});
```

### Sử dụng trong Next.js

**Ý kiến cá nhân**: Ví dụ trên trang web sử dụng `react-query` để giải quyết vấn đề thiếu dữ liệu khi các component React được gắn (thay thế cách gọi dữ liệu khởi tạo bằng `useEffect`). Vì Next.js hỗ trợ SSR và SSG, nên không cần thiết phải sử dụng `react-query`, điều này giúp giảm độ phức tạp của mã.

Trong Next.js, ngoài việc sử dụng `@trpc/server` và `@trpc/client`, còn cần `@trpc/next`, cung cấp các chức năng và công cụ đặc thù cho việc tích hợp tRPC và Next.js.

* **Xử lý API Route**: Giúp thiết lập và xử lý các route tRPC trong dự án trở nên rất đơn giản và trực tiếp.
  
* **Chức năng môi trường cụ thể của Next.js**: Tiện lợi khi sử dụng với tRPC trong trường hợp sử dụng SSR và SSG.
  
* **Giao tiếp giữa client và server đơn giản hóa**.
  
* **Tự động sinh loại**: Tự động sinh định nghĩa loại, đảm bảo tính nhất quán giữa front-end và back-end.

> ❝
> Ví dụ trên trang web sử dụng `@trpc/next` và `react-query`, tôi cảm thấy điều này là không cần thiết.
> ❞

#### 1. Định nghĩa cấu trúc thư mục (theo sở thích cá nhân)

```
├── (pages)                         # Thư mục ảo cho các trang (đường dẫn trang), để phân biệt với các thư mục khác
│   ├── createUser                  # http://localhost:3000/createUser
│   │   └── page.tsx
│   └── ssrTest                     # http://localhost:3000/ssrTest
│       └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx                  # RootLayout
│   ├── page.tsx                    # http://localhost:3000
├── _trpc                           # Thư mục lưu trữ trpcRouter và các công cụ liên quan
│   ├── index.ts                    # Tập tin tổng nhập của trpcRouter, tích hợp các router kinh doanh
│   ├── routers                     # Thư mục phân chia router tRPC
│   │   ├── product.ts              # router kinh doanh 1
│   │   └── user.ts                 # router kinh doanh 2
│   ├── trpcCaller.ts               # Điểm vào router kinh doanh cho component server
│   └── trpcClient.ts               # Điểm vào router kinh doanh cho component client
├── api                             # API route
│   ├── news                        # RESTFUL API cách /api/news
│   │   └── route.ts
│   └── trpc                        # Đường dẫn tRPC
│       └── [...trpc]              # /api/trpc/xxxx
│           └── route.ts
├── lib                             # Thư viện
│   ├── trpc                        # Công cụ tRPC
│   │   ├── context.ts              # Ngữ cảnh tRPC
│   │   └── index.ts                # Khởi tạo tRPC
│   └── utils.ts                    # Tập hợp công cụ
└── types                           # Kiểu
    └── user.ts
    └── product.ts
```

#### 2. Khởi tạo dịch vụ tRPC

* 「Tạo ngữ cảnh tRPC」

```typescript
// app/lib/trpc/context.ts   
import { CreateNextContextOptions } from '@trpc/server/adapters/next'; 

export async function createTRPCContext(opts?: CreateNextContextOptions) {    
    // const session = await getServerSession();        
    // Mô phỏng session    
    const session = { user: { id: 1, name: 'xfz', role: 'admin' } };    
    return { ...(opts || {}), session };   
}      

export type Context = typeof createTRPCContext;   
```

* 「Khởi tạo dịch vụ tRPC (bao gồm Authorize) và xuất các công cụ liên quan」

* Ngữ cảnh

* meta

* Authorize

```typescript
// app/lib/trpc/index.ts   
import { TRPCError, initTRPC } from '@trpc/server';   
import type { Context } from './context';      

// Dữ liệu meta của quy trình, cho phép thêm các thuộc tính meta tùy chọn cho từng quy trình, sẽ có sẵn trong tất cả các tham số của hàm middleware   
// Thường được sử dụng cho xác thực danh tính, phân loại vai trò, v.v.   
interface Meta {    
    authRequired?: boolean; // Có cần xác thực không    
    role?: 'tourist' | 'user' | 'admin'; // Phân loại vai trò người dùng   
}      

const t = initTRPC    
    .context<Context>()    
    .meta<Meta>()    
    .create({        
        defaultMeta: {            
            authRequired: false,            
            role: 'tourist',        
        },    
    });      

export const router = t.router;   
export const middleware = t.middleware;   
export const publicProcedure = t.procedure;   

// Meta: { authRequired: false, role: 'tourist' }      

// Quy trình cần xác thực, thực chất là một middleware   
export const authedProcedure = t.procedure    
    .use(async opts => {        
        const { next, ctx } = opts;        
        if (!ctx.session) {            
            throw new TRPCError({ code: 'UNAUTHORIZED' }); // 401        
        }        
        return next({            
            // Nhìn vào cách mà mẫu dự án create-d3-app viết            
            // Thực sự không cần thiết, vì đã có trong ctx, không cần mở rộng nữa            
            // ctx: {                
            //     session: { ...ctx.session }            
            // }        
        });    
    })    
    .meta({        
        authRequired: true,        
        role: 'user',    
    });   

// Kết hợp Meta Mặc định: { authRequired: true, role: 'user' }      

// Dành riêng cho người dùng admin   
export const adminProcedure = authedProcedure    
    .use(opts => {        
        const { meta, next, ctx } = opts;        
        if (ctx.session.user.role !== meta?.role) {            
            throw new TRPCError({ code: 'FORBIDDEN' }); // 403        
        }        
        return next();    
    })    
    .meta({        
        role: 'admin',    
    });   
    // Kết hợp Meta Mặc định: { authRequired: true, role: 'admin' }      

// Gọi nội bộ từ Server   
// export const createCaller = t.createCaller;   
// createCaller đã bị loại bỏ trong trpc v11   
// @see https://trpc.io/docs/server/server-side-calls#create-caller   
export const createCallerFactory = t.createCallerFactory;   
```

Trong đoạn mã trên, chúng tôi đã sử dụng chức năng meta của tRPC, điều này cá nhân tôi cảm thấy rất tiện lợi. Việc sử dụng meta có hai cách:

「1. Cài đặt trước meta, sau đó thiết lập các quy trình khác nhau theo meta khác nhau, ví dụ chính thức」:
![Image](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7e3b4016ed64868bc0422b98bb9abf1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=438&h=580&s=71763&e=png&b=1b1a1c)

「2. Chỉ thêm meta khi sử dụng quy trình cụ thể, ví dụ trên trang chính thức」:
![Image](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98e4b19e26b745d1bce1d72f9b77ab7e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=608&h=572&s=85440&e=png&b=1b1a1c)

Cá nhân tôi thích cách thứ nhất, tùy thuộc vào nhu cầu kinh doanh để chọn quy trình khác nhau.

#### 3. Tạo `trpcRouter`

Trong phát triển thực tế, chúng ta thường có nhiều giao diện kinh doanh khác nhau, vì vậy việc phân chia các quy trình theo không gian tên khác nhau là rất hữu ích. Cuối cùng, chúng ta sẽ tổng hợp tất cả lại với nhau (tương tự như `vuex`, `redux`).

**Lưu ý về thói quen lập trình tốt, hãy quý trọng!**

* Đầu tiên, chúng ta sẽ tạo hai router cho các nghiệp vụ khác nhau: `user.ts` và `product.ts`.

##### `user.ts`

```typescript
// app/_trpc/routers/user.ts   
import { TRPCError } from '@trpc/server';   
import { publicProcedure, adminProcedure, router, authedProcedure, Meta } from '@/app/lib/trpc';   
import { UserType } from '@/app/types/user';      

export const User = router({    
    getUserList: publicProcedure.query(async opts => {        
        console.log(opts.ctx.session, (opts as any).meta);        
        // { user: { id: 1, name: 'xfz', role: 'admin' } }        
        // { authRequired: false, role: 'tourist' }        

        // Lấy dữ liệu từ cơ sở dữ liệu    
        const users: UserType[] = [        
            { id: 1, name: 'xfz', age: 20, role: 'admin' },        
            { id: 2, name: 'xwb', age: 18, role: 'user' },        
            { id: 3, name: 'zc', age: 22, role: 'user' },        
            { id: 4, name: 'ssb', age: 25, role: 'user' },    
        ];        
        return {            
            status: 200,            
            data: users,            
            message: 'success',        
        };    
    }),    

    // Ở đây sử dụng adminProcedure, chỉ admin mới có thể tạo người dùng    
    createUser: adminProcedure    
        .input(val => val)    
        .mutation(async opt => {        
            console.log(opt.input, opt.ctx.session, (opt as any).meta);        
            // { id: 5, name: 'tmd', age: 100, role: 'user' }        
            // { user: { id: 1, name: 'xfz', role: 'admin' } }        
            // { authRequired: true, role: 'admin' }        

            try {            
                // Chèn dữ liệu vào cơ sở dữ liệu            
                return {                
                    status: 200,                
                    data: null,                
                    message: 'Created Success',            
                };        
            } catch (e: any) {            
                console.error(e.message);            
                throw new TRPCError({                
                    code: 'INTERNAL_SERVER_ERROR',                
                    message: e.message,            
                });        
            }    
        }),    

    updateUser: authedProcedure    
        .input(val => val)    
        .mutation(async opt => {        
            console.log(opt.input);    
        }),   
});  
```

##### `product.ts`

```typescript
// app/_trpc/routers/product.ts   
import { publicProcedure, router } from '@/app/lib/trpc';      

export const Product = router({    
    getAllProducts: publicProcedure.query(async opts => {        
        return {            
            status: 200,            
            data: [],            
            message: 'success',        
        };    
    }),    

    getProductById: publicProcedure.input(val => val).query(async opts => {        
        return {            
            status: 200,            
            data: {},            
            message: 'success',        
        };    
    }),   
});  
```

**Ghi chú:** Vai trò có thể được lấy thông qua `opts.meta` hoặc `opts.ctx`.

Để gọi dịch vụ và truyền tham số, sử dụng `.input(val => val).query | mutation`.

* Bây giờ, chúng ta sẽ nhập hai router trên và kết hợp chúng lại.

##### Kết hợp các router

```typescript
// app/_trpc/index.ts   
import { router } from '@/app/lib/trpc';   
import { User } from './routers/user';   
import { Product } from './routers/product';      

/** 
 * Mỗi router có không gian tên riêng, ở đây User và Product là không gian tên 
 * trpcClient.User.getUserList 
 * trpcClient.Product.getAllProducts 
 */ 
export const trpcRouter = router({    
    User,    
    Product,   
});      

/** 
 * Nếu muốn gộp UserRouter và ProductRouter lại và cùng không gian tên 
 * trpcClient.getUserList 
 * trpcClient.getAllProducts 
 */ 
// export const trpcRouter = t.mergeRouters(User, Product);      

export type TRPCRouter = typeof trpcRouter;   
```

Với đoạn mã này, chúng ta đã thiết lập thành công các router cho từng nghiệp vụ và tổ chức chúng một cách có hệ thống.
#### 4. Tạo `trpcClient`

`trpcClient` được sử dụng trong các thành phần phía khách để gửi yêu cầu, thay thế cho các yêu cầu sử dụng `fetch` hoặc `axios`.

#### Đoạn mã `trpcClient.ts`

```typescript
// app/_trpc/trpcClient.ts   
import { createTRPCClient, httpBatchLink } from '@trpc/client';   
import type { TRPCRouter } from '.';   
import { getBaseUrl } from '@/app/lib/utils';      

export const trpcClient = createTRPCClient<TRPCRouter>({    
    links: [        
        // Thiết lập địa chỉ duy nhất cho yêu cầu trpc, tương ứng với api router        
        httpBatchLink({            
            url: `${getBaseUrl()}/api/trpc`,            
            // http://localhost:3000/api/trpc        
        }),    
    ],  
});  
```

#### Đoạn mã `utils.ts`

```typescript
// app/lib/utils.ts   
export const getBaseUrl = () => {    
    if (typeof window !== 'undefined')        
        // Trình duyệt nên sử dụng đường dẫn tương đối        
        return '';    
    if (process.env.VERCEL_URL)        
        // Tham chiếu cho vercel.com        
        return `https://${process.env.VERCEL_URL}`;    
    if (process.env.RENDER_INTERNAL_HOSTNAME)        
        // Tham chiếu cho render.com        
        return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;    
    // Giả định localhost        
    return `http://localhost:${process.env.PORT ?? 3000}`;  
};  
```

#### 5. Tích hợp `trpcRouter` vào API route của Next.js

* **Đường dẫn**: `app/api/trpc/[...trpc]/route.ts`

* Đường dẫn `/api/trpc` tương ứng với `httpBatchLink` đã thiết lập cho `trpcClient`.

* Ví dụ: khi gọi `trpcClient.User.getUserList.query()`, yêu cầu sẽ được gửi tới:

```
http://localhost:3000/api/trpc/User.getUserList?batch=1&input=%7B%7D
```

Đoạn mã `route.ts`

```typescript
// app/api/trpc/[...trpc]/route.ts   
import { NextRequest } from 'next/server';   
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';   
import { trpcRouter } from '@/app/_trpc';   
import { createTRPCContext } from '@/app/lib/trpc/context';      

function handler(req: NextRequest) {    
    return fetchRequestHandler({        
        // Địa chỉ điểm yêu cầu, tương ứng với thư mục app/api/trpc        
        endpoint: '/api/trpc',        
        req,        
        router: trpcRouter,        
        createContext: createTRPCContext as any,    
    });  
}  

export { handler as GET, handler as POST };  
```

#### 6.1 Gọi trpc từ Client Component

```typescript
// app/(pages)/page.tsx   
'use client';   

import { useEffect, useState } from 'react';   
import { trpcClient } from '@/app/_trpc/trpcClient';   
import { UserType } from '@/app/types/user';      

export default function HomePage() {    
    const [userList, setUserList] = useState<UserType[]>([]);      

    const getUserList = async () => {        
        try {            
            const { data } = await trpcClient.User.getUserList.query();            
            setUserList(data);        
        } catch (e) {            
            console.error(e);        
        }    
    };       

    useEffect(() => {        
        getUserList();    
    }, []);       

    const create = async () => {        
        trpcClient.User.createUser.mutate({            
            id: 5,            
            name: 'tmd',            
            age: 100,            
            role: 'user'        
        });    
    };       

    return (        
        <section>            
            <section>{JSON.stringify(userList)}</section>            
            <button onClick={create}>create</button>            
            <button onClick={update}>update</button>        
        </section>    
    );  
}
```

Truy cập: `http://localhost:3000`

#### 6.2 Kiểm tra dữ liệu đầu vào

Trước tiên, `procedure` lấy tham số cần sử dụng `input`, `input` giống như một middleware, vì vậy cần trả về tham số đã lấy được cho các thao tác sau, như `query` hoặc `mutation`, nếu không `opts.input` sẽ không lấy được dữ liệu.

Gọi

```typescript
await trpcClient.Product.getProductById.query({ id: 1 });
```

 Dịch vụ

```typescript
getProductById: publicProcedure    
    .input(val => {        
        return val; // {id: 1}    
    })    
    .query(async opts => {        
        const { id } = opts.input;    
    });
```

**Sử dụng zod để kiểm tra dữ liệu đầu vào:**

```typescript
getProductById: publicProcedure    
    .input(        
        z.object({            
            id: z.number(),        
        })    
    )    
    .query(async opts => {        
        const { id } = opts.input;    
    });
```

**Nếu cần xử lý dữ liệu đã kiểm tra, làm thế nào?**

Sử dụng `.use(opts => {})` middleware sau `input()` để xử lý.

```typescript
getProductById: publicProcedure    
    .input(        
        z.object({            
            id: z.number(),        
        })    
    )    
    .use(opts => {        
        const { input } = opts;        
        const newInput = { ...input, id: `_id_` + input.id };        
        return opts.next({            
            input: newInput,        
        });    
    })    
    .query(async opts => {        
        console.log(opts.input); // { id: '_id_1' }    
    });
```

#### 7.1 Gọi tRPC từ Server Component

**Kết luận:** Trong Server Component không thể sử dụng `trpcClient` để gọi dịch vụ. 

**Nguyên tắc:** Server Component chỉ cần gọi dịch vụ ở phía Server mà không cần phát sinh yêu cầu HTTP. Nhưng nếu dịch vụ của bạn đã được viết trong tRPC router thì sao?

* Ví dụ, sử dụng `trpcClient` trong Server Component:

```typescript
import { trpcClient } from '@/app/_trpc/trpcClient';      

export default async function Home() {    
    const userList = await trpcClient.User.getUserList.query();       
    return <section>{JSON.stringify(userList)}</section>;   
}
```

* Trong môi trường phát triển, điều này có thể hoạt động, nhưng nếu bạn thay đổi dữ liệu trả về từ backend, nội dung trang sẽ không thay đổi do Next.js 14 mặc định lưu cache GET request. Ngay cả khi thiết lập `dynamic = 'force-dynamic'`, điều này cũng không giúp được gì. 

* Khi chạy `npm run build`, sẽ xảy ra lỗi kết nối đến Server.

Do đó, cần tìm cách gọi tRPC từ bên trong Server Component, và `@trpc/server` cung cấp phương pháp gọi nội bộ.

#### 7.2 Gọi từ phía Server

* Trước v11, bạn có thể sử dụng `t.createCaller` để thực hiện cuộc gọi nội bộ.

* Từ v11 trở đi, `t.createCaller` đã được thay thế bằng `t.createCallerFactory`.

**1. Tạo hàm factory gọi nội bộ `trpcCaller`**

```typescript
// app/lib/trpc/index.ts  
// ....  
export const createCallerFactory = t.createCallerFactory;

// app/_trpc/trpcCaller.ts  
import { createCallerFactory } from '@/app/lib/trpc';   
import { trpcRouter } from '.';      

// Tạo caller dựa trên trpcRouter  
const createCaller = createCallerFactory(trpcRouter);      

export const trpcCaller = createCaller(    
    {        
        session: {            
            user: {                
                id: 1,                
                name: 'xfz',                
                role: 'admin',            
            },        
        }    
    },    
    {        
        onError: opts => {            
            console.error('An error occurred', opts.error);        
        },    
    }  
);
```

**Sử dụng trong Server Component**

```typescript
import { trpcCaller } from '@/app/_trpc/trpcCaller';      

export default async function Home() {    
    const { data } = await trpcCaller.User.getUserList.query();    
    return ...   
}
```

* Bây giờ, khi chạy `npm run build`, sẽ không còn báo lỗi nữa, nhưng trang tạo ra vẫn là SSG.

#### 7.3 SSR

Dựa trên phần Cache đã học trước đó, chỉ cần thiết lập trang với `export const dynamic = 'force-dynamic'` là đủ.

#### 7.4 Cách tiêm session vào `trpcCaller`

Trong phần 7.2, cách chúng ta tiêm session vào `trpcCaller` gặp vấn đề và không thể lấy được session thực. Dưới đây là cách cải tiến cho file `trpcCaller`.

**❌ Tuyệt đối không làm như sau:**

```typescript
const createCaller = createCallerFactory(trpcRouter);      
let trpcCaller = null;      

export const getTrpcCaller = async () => {    
    if (trpcCaller) {        
        return trpcCaller;    
    }    

    // Lấy session    
    // const session = await getServerSession();    
    const session = {        
        user: {            
            id: 1,            
            name: 'xfz',            
            role: 'admin',        
        },    
    };      

    if (!session) {        
        throw new Error('Unauthorized');    
    }      

    trpcCaller = createCaller({ session });    
    return trpcCaller;  
};
```

```typescript
import { getTrpcCaller } from '@/app/_trpc/trpcCaller';      

export const dynamic = 'force-dynamic';      

export default async function Home() {    
    const trpcCaller = await getTrpcCaller();    
    const { data } = await trpcCaller.getTime();       
    return <section>{data}</section>;   
}
```

**Mặc dù đoạn mã trên thành công trong việc tiêm session vào `trpcCaller`, nhưng nó có một số lỗi nghiêm trọng như sau:**

* **Session có thể hết hạn:** Session thường là tạm thời, việc lưu một đối tượng session có thể dẫn đến việc tiếp tục sử dụng session đã hết hạn.
  
* **Môi trường đa người dùng:** Nếu ứng dụng của bạn hoạt động trong môi trường nhiều người dùng, việc lưu một đối tượng session có thể gây ra vấn đề bảo mật, vì các yêu cầu từ người dùng khác nhau có thể chia sẻ cùng một session.

Vì vậy, tốt hơn hết là mỗi khi gọi `getTrpcCaller`, chúng ta nên lấy lại session.

```typescript
export const getTrpcCaller = async () => {    
    // Lấy session    
    // const session = await getServerSession(authOptions);    
    const { session } = await createTRPCContext();       

    if (!session) {        
        throw new Error('Unauthorized');    
    }      

    return createCaller({ session });  
};
```

**Để đảm bảo tính bảo mật và duy nhất, tốt nhất nên lưu trữ session trực tiếp trong cơ sở dữ liệu, tạo một bảng chuyên dụng cho quản lý session. Nếu cảm thấy phiền phức, có thể thêm một trường session vào bảng người dùng.**

#### 8. tRPC Middleware

* tRPC middleware được thực hiện thông qua `procedure.use(middleware)`.
* **Lưu ý:** Middleware cuối cùng phải luôn `return opts.next()`, nếu không, các thao tác phía sau sẽ không thể thực hiện.
* `use()` chỉ có thể được sử dụng trước các query hoặc mutation.
* `procedure.use(middleware) => newProcedure`

##### Pre-Middleware

「Xử lý trước, sau đó thực hiện next()」

```typescript
import { publicProcedure, router } from '@/app/lib/trpc';

export const appRouter = router({
    test: publicProcedure
        .use(opts => {
            // opts: { ctx: { session ...}, next }
            console.log('--- Middleware --- Xử lý trước');
            // Lưu ý: Middleware cuối cùng phải return opts.next()
            return opts.next();
        })
        .query(async opts => {
            console.log('query...');
            return 'test';
        }),
});
```

**Kết quả xuất ra:**
```
--- Middleware --- Xử lý trước
query...
```

_Dựa vào đặc điểm này, có thể thực hiện xác thực danh tính trong middleware trước._

```typescript
t.procedure
    .use(opts => {
        if (!opts.ctx.session?.user) {
            throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return opts.next();
    })
    .query(opts => {});
```

##### Post-Middleware

「Thực hiện next() trước, sau đó xử lý」

```typescript
import { publicProcedure, router } from '@/app/lib/trpc';

export const appRouter = router({
    test: publicProcedure
        .use(opts => {
            const result = await opts.next();
            console.log('--- Middleware --- Xử lý sau');
            return result;
        })
        .use(opts => {
            console.log('--- Middleware --- Xử lý trước');
            return opts.next();
        })
        .query(async opts => {
            console.log('query...');
            return 'test';
        }),
});
```

**Kết quả xuất ra:**
```
--- Middleware --- Xử lý trước
query...
--- Middleware --- Xử lý sau
```

##### Mở rộng ctx

```typescript
export const appRouter = router({
    test: publicProcedure
        .use(opts => {
            console.log('1', opts.ctx);
            return opts.next({
                // Nếu ctx trước đó không có test, nó sẽ thêm test, và chứa tất cả thông tin từ ctx trước đó
                // Nếu ctx trước đó có test, nó sẽ ghi đè test
                ctx: { test: 123 } // Thông tin ctx trước đó sẽ không bị mất, ở đây tương đương với việc merge
            });
        })
        .query(async opts => {
            console.log('2', opts.ctx);
            return 'test';
        }),
});
```

**Kết quả xuất ra:**
```
1, { session: { user: { id: 1, name: 'xfz', role: 'admin' } } }
2, { session: { user: { id: 1, name: 'xfz', role: 'admin' } }, test: 123 }
```

##### Tách Middleware

Trong phát triển thực tế, có thể tách các hàm callback trong `use` ra ngoài để dễ dàng bảo trì mã:

```typescript
import { publicProcedure, router, middleware } from '@/app/lib/trpc';

const mid1 = middleware(async opts => {
    console.log('--- Tách middleware 1 ---');
    return opts.next();
});

const mid2 = middleware(async opts => {
    console.log('--- Tách middleware 2 ---');
    return opts.next();
});

export const appRouter = router({
    test: publicProcedure
        .use(mid1)
        .use(mid2)
        .query(opts => {}),
});
```

##### Kết hợp Middleware

Các middleware trên có thể kết hợp lại và gán cho procedure:

```typescript
import { publicProcedure, router, middleware } from '@/app/lib/trpc';

const mid1 = middleware(async opts => {
    console.log('--- Tách middleware 1 ---');
    return opts.next();
});

const mid2 = middleware(async opts => {
    console.log('--- Tách middleware 2 ---');
    return opts.next();
});

// Kết hợp mid1 và mid2
const mid1And2 = mid1.unstable_pipe(mid2);

export const appRouter = router({
    test: publicProcedure
        //.use(mid1)
        //.use(mid2)
        .use(mid1And2)
        .query(opts => {}),
});
```

##### Mở rộng Kiến thức: Kết hợp Procedure

```typescript
proc1.unstable_concat(proc2) => newProc
```

Với việc sử dụng middleware, bạn có thể tổ chức mã nguồn của mình một cách hiệu quả và tái sử dụng mã với tính linh hoạt cao trong các quy trình tRPC.
#### 9. Bảng mã lỗi tRPC

![Bảng mã lỗi tRPC](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9389450bdd646a28146ebe8d0a09a5e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=841&h=630&s=95420&e=png&b=1c1c1c)

```typescript
import { initTRPC, TRPCError } from '@trpc/server';

const t = initTRPC.create();

const appRouter = t.router({
    hello: t.procedure.query(() => {
        try {
            alert(111);
        } catch (e) {
            console.error(e.message);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: e.message,
                // Tùy chọn
                cause: e,
            });
        }
    }),
});
```

##### In lỗi

![In lỗi](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d77fd01250f74a8bb253ea6b65931e61~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=884&h=186&s=38927&e=png&b=fdfdfd)

#### Tóm tắt

Thông qua những điều đã học ở trên, bạn đã hiểu cách sử dụng tRPC trong NextJs 14. Với việc luyện tập nhiều hơn, tôi tin rằng hiệu suất phát triển của bạn sẽ có sự cải thiện đáng kể. So với REST API, loại thống nhất và cơ chế giao tiếp đơn giản giúp phát triển trở nên thuận tiện hơn.

## Triển khai

Có thể triển khai trên Vercel hoặc Cloudflare, hoặc trên máy chủ đám mây mà bạn đã mua.

**Lưu ý khi triển khai**:

1. Đảm bảo máy chủ có môi trường Node.js.
2. Chuẩn bị DNS (tên miền).
3. Chuẩn bị cơ sở dữ liệu.
4. Cấu hình danh sách trắng kết nối cơ sở dữ liệu trên máy chủ.
5. Nếu triển khai trên máy chủ đám mây, hãy cấu hình biến môi trường (.env).
6. Khi triển khai dự án lần đầu, nếu sử dụng Prisma, cần chạy `prisma generate`.

*   `prisma generate && next build`

## Kết luận

Chẳng mấy chốc, tôi đã viết được nhiều như vậy~

Hy vọng bài viết này sẽ giúp ích cho bạn.

Trong quá trình phát triển dự án thực tế, tôi đã gặp không ít khó khăn, tiêu tốn nhiều thuốc lá, đặc biệt là phần `Server Component` và `Client Component`, đã tốn nhiều thời gian để xem tài liệu và gỡ lỗi, cuối cùng cũng hiểu ra mọi chuyện.

Cuối cùng, NextJs 15 cũng sắp ra mắt, nếu có thời gian, chúng ta sẽ gặp lại nhé!

## Reference

Mẫu NextJS cấp doanh nghiệp t3-app

### Tài liệu tham khảo

\[1\] [NextJs từ nhập môn đến từ bỏ](https://juejin.cn/post/7265210595912581159)

\[2\] [bun](https://bun.sh/)

\[3\] [github.com/vercel/next…](https://github.com/vercel/next.js/tree/canary/examples/with-styled-jsx-scss)

\[4\] \[NextJs 14\] Tóm tắt kiến trúc lấy dữ liệu: [tại đây](https://juejin.cn/post/7385061036830031872)

\[5\] [supabase](https://supabase.com/)

\[6\] [MongoDB](https://www.mongodb.com/atlas)

\[7\] [vercel](https://vercel.com/)

\[8\] [Giải pháp tham khảo](https://reacthustle.com/blog/how-to-chain-multiple-middleware-functions-in-nextjs)

\[9\] [clerk](https://clerk.com/)

\[10\] [my.com](http://my.com/)

\[11\] [my.com](http://my.com/)

\[12\] [localhost:3000](http://localhost:3000/)

\[13\] [t3-app](https://create.t3.gg/)

\[14\] [Mẫu NextJS cấp doanh nghiệp](https://github.com/Blazity/next-enterprise)
