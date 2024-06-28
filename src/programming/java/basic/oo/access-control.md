---
title: Access Control Keywords
tags:
  - java
categories:
  - java
order: 7
---
# Access Control Keywords

Hãy xem xét hai tình huống sau:

**Tình huống 1:** Kỹ sư A viết một lớp ClassA, nhưng không muốn ClassA được các lớp khác truy cập. Làm thế nào để giải quyết vấn đề này?

**Tình huống 2:** Kỹ sư A viết một lớp ClassA với hai phương thức fun1 và fun2, nhưng muốn chỉ cho phép fun1 có thể truy cập từ bên ngoài. Làm thế nào để giải quyết vấn đề này?

Lúc này, điều khiển quyền truy cập sẽ có tác dụng.

Trong Java, cung cấp bốn loại từ khóa điều khiển quyền truy cập:

- **default** (hoặc quyền truy cập gói): Cho phép truy cập bởi các lớp trong cùng gói.
- **public**: Cho phép truy cập từ bất kỳ nơi nào, không có hạn chế.
- **private**: Chỉ cho phép truy cập bên trong cùng lớp.
- **protected**: Cho phép truy cập bởi các lớp con (subclass) và các lớp trong cùng gói.

Lớp chỉ có thể sử dụng mặc định và public để điều khiển quyền truy cập. Ví dụ:

```java
public class Wanger {}
```

hoặc

```java
class Wanger {}
```

Tuy nhiên, biến và phương thức có thể được điều khiển bởi tất cả các loại từ khóa điều khiển quyền truy cập.

### 1. Class

- **default (Quyền truy cập gói)**: Khi được sử dụng để điều khiển quyền truy cập của một lớp, nghĩa là lớp chỉ có thể được truy cập bởi các lớp khác trong cùng một gói.
- **public**: Khi được sử dụng để điều khiển quyền truy cập của một lớp, nghĩa là lớp có thể được truy cập từ bất kỳ nơi nào trong chương trình.

Ví dụ 1:

Main.java:

```java
package com.hnv99.test1;

public class Main {
	public static void main(String[] args) {

		People people = new People("Tom");
		System.out.println(people.getName());
	}

}
```

People.java:

```java
package com.hnv99.test1;

class People { // default (Quyền truy cập gói)

	private String name = null;

	public People(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
```

Trong đoạn mã này, lớp People được sử dụng với quyền truy cập mặc định (Quyền truy cập gói). Bởi vì lớp People và lớp Main đều nằm trong cùng một gói, nên lớp People có thể được truy cập từ lớp Main.

Ví dụ 2:

People.java:

```java
package com.hnv99.test2;

class People { // default (Quyền truy cập gói)

	private String name = null;

	public People(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
```

Trong trường hợp này, lớp People và lớp Main không cùng nằm trong cùng một gói. 

Thông báo lỗi cho biết lớp People không thể truy cập từ lớp Main vì chúng không nằm trong cùng một gói. Điều này chỉ ra rằng nếu sử dụng quyền truy cập mặc định để điều khiển một lớp, thì lớp đó chỉ có thể được truy cập bởi các lớp khác trong cùng một gói, và không thể từ các gói khác.

Nếu chuyển quyền truy cập của lớp People từ mặc định sang public, thì lớp People sẽ trở nên hiển thị được cho lớp Main.


### 2. Method & Field

- **default (Quyền truy cập gói)**: Khi phương thức hoặc biến của một lớp được sử dụng với quyền truy cập mặc định, nghĩa là chúng chỉ có thể được truy cập bởi các lớp khác trong cùng một gói. Các lớp ở các gói khác không thể truy cập trực tiếp các phương thức hoặc biến này.
  
- **private**: Khi một phương thức hoặc biến của lớp được đánh dấu là private, chỉ có lớp đó chính nó mới có thể truy cập được. Các lớp bên ngoài cũng như các lớp khác không thể truy cập trực tiếp phương thức hoặc biến này.

- **protected**: Khi một phương thức hoặc biến được đánh dấu là protected, thì các lớp trong cùng một gói có thể truy cập được. Đối với các lớp ở các gói khác, chỉ những lớp con của lớp đó mới có thể truy cập được phương thức hoặc biến này thông qua kế thừa.

- **public**: Khi một phương thức hoặc biến được đánh dấu là public, thì phương thức hoặc biến này có thể được truy cập từ bất kỳ đâu trong chương trình.

Ví dụ 3:

Main.java không thay đổi

People.java:

```java
package com.hnv99.test1;

public class People {

	private String name = null;

	public People(String name) {
		this.name = name;
	}

	String getName() {    // deafult (Quyền truy cập gói)
		return name;
	}

	void setName(String name) {   // deafult (Quyền truy cập gói)
		this.name = name;
	}
}
```

Trong trường hợp này, lớp Main và lớp People đều nằm trong cùng một gói (com.hnv99.test1), vì vậy lớp Main có thể truy cập trực tiếp vào các phương thức getName và setName của lớp People.

Tuy nhiên, nếu lớp People và lớp Main không nằm trong cùng một gói:

```java
package com.hnv99.test2;    // Đây là gói khác với lớp Main

public class People {

	private String name = null;

	public People(String name) {
		this.name = name;
	}

	String getName() {    // deafult (Quyền truy cập gói)
		return name;
	}

	void setName(String name) {   // deafult (Quyền truy cập gói)
		this.name = name;
	}
}
```

Trong trường hợp này, lớp Main sẽ không thể truy cập trực tiếp vào các phương thức getName và setName của lớp People do chúng có quyền truy cập mặc định và không nằm trong cùng một gói.

