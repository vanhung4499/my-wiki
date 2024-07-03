---
title: Double Array
tags: ['java']
categories: ['java']
order: 2
---

# 2D Array

### 01. Mảng hai chiều là gì

Mảng hai chiều là một loại dữ liệu có thể lưu trữ dữ liệu theo nhiều hàng và nhiều cột. Nó bao gồm một loạt các hàng và cột, mỗi phần tử có thể được truy cập thông qua chỉ số hàng và chỉ số cột. Ví dụ, một mảng hai chiều 3 hàng 4 cột có thể được biểu diễn như sau:

```java
array = [
  [a, b, c, d],
  [e, f, g, h],
  [i, j, k, l]
]
```

Trong ví dụ này, hàng thứ nhất có 4 phần tử, hàng thứ hai có 4 phần tử, hàng thứ ba có 4 phần tử, mỗi phần tử có một chỉ số hàng và một chỉ số cột. Ví dụ, phần tử `array[1][2]` là phần tử ở hàng thứ 2 cột thứ 3, có giá trị là g.

Sử dụng mảng hai chiều có thể lưu trữ và xử lý hiệu quả dữ liệu bảng, như ma trận, hình ảnh, bản đồ, v.v.

### 02. Tạo mảng hai chiều

Để tạo mảng hai chiều trong Java, bạn phải xác định loại dữ liệu sẽ lưu trữ trong mảng, sau đó là hai cặp ngoặc vuông và tên mảng.

Cú pháp như sau:

```txt
data_type[][] array_name;
```

Hãy xem một ví dụ mã.

```java
int[][] oddNumbers = { {1, 3, 5, 7}, {9, 11, 13, 15} };
```

Trong ví dụ này, chúng ta đã tạo một mảng hai chiều với hai hàng và bốn cột. Mỗi phần tử trong mảng này đều là một số nguyên (`int`).

### 03、Truy cập vào các phần tử của mảng hai chiều

Chúng ta có thể sử dụng hai dấu ngoặc vuông để truy cập vào các phần tử trong mảng hai chiều.

Dấu ngoặc vuông đầu tiên chỉ ra mảng mà chúng ta muốn truy cập phần tử từ đó, và dấu ngoặc vuông thứ hai chỉ ra chỉ số của phần tử mà chúng ta muốn truy cập.

Hãy xem qua một ví dụ để làm rõ hơn:

```java
int[][] oddNumbers = { {1, 3, 5, 7}, {9, 11, 13, 15} };

System.out.println(oddNumbers[0][0]);
// 1
```

Trong ví dụ trên, mảng `oddNumbers` bao gồm hai mảng con — `{1, 3, 5, 7}` và `{9, 11, 13, 15}`.

Mảng đầu tiên — `{1, 3, 5, 7}` — được biểu diễn bằng chỉ số 0.

Mảng thứ hai — `{9, 11, 13, 15}` — được biểu diễn bằng chỉ số 1.

Mảng đầu tiên là 0, thứ hai là 1, và tiếp theo là 2, và cứ như vậy.

Do đó, để truy cập vào phần tử đầu tiên của mảng đầu tiên, chúng ta sẽ sử dụng chỉ số 0 cho dấu ngoặc vuông đầu tiên. Vì chúng ta đang cố gắng truy cập vào phần tử đầu tiên của mảng, chúng ta sẽ sử dụng chỉ số của nó, tức là 0: `oddNumbers[0][0]`.

Hãy đi sâu vào điều này hơn.

Đây là mã để truy cập vào phần tử: `oddNumbers[?][?]`.

Tôi đã thêm dấu hỏi vào trong hai dấu ngoặc vuông — điền dần lên khi tiến hành.

Giả sử chúng ta muốn truy cập vào phần tử thứ hai của mảng thứ hai, mã của chúng ta sẽ như sau: `oddNumbers[1][?]`.

Bây giờ chúng ta muốn thử truy cập vào một trong các phần tử của mảng thứ hai (`{9, 11, 13, 15}`). Tương tự như mảng một chiều, mỗi phần tử trong mảng hai chiều cũng có một chỉ số bắt đầu từ 0.

Vì vậy, để truy cập vào phần tử thứ ba là `13`, chúng ta sẽ chuyển chỉ số của nó cho dấu ngoặc vuông thứ hai: `oddNumbers[1][2]`.

Hãy xem ví dụ sau đây:

```java
int[][] oddNumbers = { {1, 3, 5, 7}, {9, 11, 13, 15}, {17, 19, 21, 23} };
```

Mục tiêu của chúng ta là truy cập vào phần tử `21` trong mảng thứ ba. Cách truy cập vẫn sử dụng dấu hỏi để chỉ ra: `oddNumbers[?][?]`.

Đầu tiên, chúng ta sẽ gán giá trị cho dấu hỏi đầu tiên để chỉ mảng cụ thể mà chúng ta muốn truy cập.

Mảng 0 => `{1, 3, 5, 7}`

Mảng 1 => `{9, 11, 13, 15}`

Mảng 2 => `{17, 19, 21, 23}`

Số mà chúng ta muốn tìm trong mảng thứ ba, vì vậy là: `oddNumbers[2][?]`.

Dấu hỏi thứ hai sẽ chỉ đến phần tử mà chúng ta muốn truy cập. Để làm được điều này, chúng ta phải chỉ ra chỉ số của phần tử. Dưới đây là chỉ số trong mảng:

17 => Chỉ số 0

19 => Chỉ số 1

21 => Chỉ số 2

23 => Chỉ số 3

Chỉ số của 21 là 2, vì vậy chúng ta có thể thêm nó vào dấu ngoặc vuông thứ hai: `oddNumbers[2][2]`. Khi bạn in nó ra màn hình điều này, bạn sẽ in ra 21.

Mã sau đây là:

```java
int[][] oddNumbers = { {1, 3, 5, 7}, {9, 11, 13, 15}, {17, 19, 21, 23} };

System.out.println(oddNumbers[2][2]);
// 21
```

Bạn có thể sử dụng vòng lặp lồng nhau để duyệt qua tất cả các phần tử trong mảng hai chiều. Đây là một ví dụ:

```java
int[][] oddNumbers = { {1, 3, 5, 7}, {9, 11, 13, 15}, {17, 19, 21, 23} };

for(int i = 0; i < oddNumbers.length; i++){
    for(int j = 0; j < oddNumbers[i].length; j++){
        System.out.println(oddNumbers[i][j]);
    }
}

// 1
// 3
// 5
// 7
// 9
// 11
// 13
// 15
// 17
// 19
// 21
// 23
```

Mã trên sẽ in ra tất cả các phần tử trong mảng `oddNumbers`.


### 04. In tam giác Pascal bằng mảng hai chiều


```java
import java.util.Scanner;

public class PascalTriangle {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.print("Nhập số hàng cần in: ");
        int n = input.nextInt();
        printYangHuiTriangle(n);
    }

    public static void printPascaTriangle(int n) {
        int[][] triangle = new int[n][n];

        for (int i = 0; i < n; i++) {
            // Các số đầu và cuối mỗi hàng đều là 1
            triangle[i][0] = 1;
            triangle[i][i] = 1;

            for (int j = 1; j < i; j++) {
                // Các số còn lại là tổng của hai số phía trên nó
                triangle[i][j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
            }
        }

        // In tam giác Pascal
        for (int i = 0; i < n; i++) {
            for (int j = 0; j <= i; j++) {
                System.out.print(triangle[i][j] + " ");
            }
            System.out.println();
        }
    }
}
```

```
Nhập số hàng cần in: 6
1
1 1
1 2 1
1 3 3 1
1 4 6 4 1
1 5 10 10 5 1
```
