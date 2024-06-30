---
title: TreeMap
tags:
  - java
categories:
  - java
order: 7
---
# TreeMap chi tiết (kèm mã nguồn)

Trong bài viết [LinkedHashMap](linkedhashmap) trước đó đã đề cập rằng HashMap không có thứ tự, vì vậy đã có LinkedHashMap. Sau khi thêm danh sách liên kết hai chiều, có thể duy trì thứ tự chèn và thứ tự truy cập của các phần tử. Vậy còn TreeMap thì sao?

TreeMap được triển khai bằng cây đỏ-đen, có thể duy trì thứ tự tự nhiên của các phần tử hoặc thứ tự tùy chỉnh đã triển khai interface Comparator.

Có thể một số bạn không hiểu về cây đỏ-đen, tôi sẽ giới thiệu qua:

> Cây đỏ-đen (tiếng Anh: Red–black tree) là một loại cây tìm kiếm nhị phân tự cân bằng (Binary Search Tree), có cấu trúc phức tạp nhưng lại có hiệu suất tốt, hoàn thành các thao tác tìm kiếm, chèn và xóa với độ phức tạp thời gian là log(n).

Cây tìm kiếm nhị phân là một cấu trúc cây phổ biến, mỗi nút của nó đều chứa một cặp khóa-giá trị. Các nút của cây con bên trái có giá trị khóa nhỏ hơn giá trị khóa của nút đó, các nút của cây con bên phải có giá trị khóa lớn hơn giá trị khóa của nút đó. Đặc tính này làm cho cây tìm kiếm nhị phân rất phù hợp để thực hiện các thao tác tìm kiếm và sắp xếp dữ liệu.

Dưới đây là một hình vẽ đơn giản, mô tả cấu trúc của một cây tìm kiếm nhị phân:

```
        8
      /   \
     3     10
    / \      \
   1   6     14
      / \    /
     4   7  13
```

Trong cây tìm kiếm nhị phân trên, nút gốc là 8, các nút của cây con bên trái bao gồm 3, 1, 6, 4 và 7, các nút của cây con bên phải bao gồm 10, 14 và 13.

- 3 < 8 < 10
- 1 < 3 < 6
- 4 < 6 < 7
- 10 < 14
- 13 < 14

Đây là một cây tìm kiếm nhị phân điển hình:

- 1) Tất cả các nút trên cây con bên trái có giá trị nhỏ hơn hoặc bằng giá trị của nút gốc của chúng.
- 2) Tất cả các nút trên cây con bên phải có giá trị lớn hơn hoặc bằng giá trị của nút gốc của chúng.
- 3) Cả cây con bên trái và cây con bên phải đều là cây tìm kiếm nhị phân.

Cây tìm kiếm nhị phân rất phù hợp cho việc tìm kiếm dữ liệu. Bắt đầu từ nút gốc, nếu giá trị khóa của nút hiện tại bằng với giá trị khóa cần tìm, thì việc tìm kiếm thành công; nếu giá trị khóa cần tìm nhỏ hơn giá trị khóa của nút hiện tại, tiếp tục duyệt cây con bên trái; nếu giá trị khóa cần tìm lớn hơn giá trị khóa của nút hiện tại, tiếp tục duyệt cây con bên phải. Nếu duyệt đến nút lá mà vẫn không tìm thấy, thì việc tìm kiếm thất bại.

Thao tác chèn cũng rất đơn giản. Bắt đầu từ nút gốc, nếu giá trị khóa cần chèn nhỏ hơn giá trị khóa của nút hiện tại, thì chèn nó vào cây con bên trái; nếu giá trị khóa cần chèn lớn hơn giá trị khóa của nút hiện tại, thì chèn nó vào cây con bên phải. Nếu giá trị khóa cần chèn đã tồn tại trong cây, thì cập nhật giá trị của nút đó.

Thao tác xóa phức tạp hơn một chút, cần xem xét nhiều tình huống, bao gồm việc nút cần xóa là nút lá, nút cần xóa chỉ có một cây con, nút cần xóa có hai cây con, v.v.

Tóm lại, cây tìm kiếm nhị phân là một cấu trúc dữ liệu rất phổ biến, giúp chúng ta thực hiện các thao tác tìm kiếm, sắp xếp và xóa dữ liệu.

Bạn đã hiểu cây tìm kiếm nhị phân rồi chứ?

Tuy nhiên, cây tìm kiếm nhị phân có một nhược điểm rõ ràng là dễ trở thành cây lệch, tức là một bên nhiều hơn, một bên ít hơn, ví dụ như thế này:

```
        6
      /   \
     4     8
    /     / \
   3     7   9
  /
 1
```

Trong cây tìm kiếm nhị phân không cân bằng trên, cây con bên trái cao hơn cây con bên phải. Nút gốc là 6, các nút của cây con bên trái bao gồm 4, 3 và 1, các nút của cây con bên phải bao gồm 8, 7 và 9.

Do cây con bên trái cao hơn cây con bên phải, cây tìm kiếm nhị phân không cân bằng này có thể làm giảm hiệu suất của các thao tác tìm kiếm, chèn và xóa.

Đây là một trường hợp cực đoan hơn:

```
    1
     \
      2
       \
        3
         \
          4
           \
            5
             \
              6
```

Trong cây tìm kiếm nhị phân cực kỳ không cân bằng này, tất cả các nút chỉ có một cây con bên phải, nút gốc là 1, các nút của cây con bên phải bao gồm 2, 3, 4, 5 và 6.

Cây tìm kiếm nhị phân cực kỳ không cân bằng này sẽ làm giảm đáng kể hiệu suất của các thao tác tìm kiếm, chèn và xóa, vì mỗi thao tác chỉ có thể thực hiện trên cây con bên phải, còn cây con bên trái hầu như không được sử dụng.

Hiệu suất tìm kiếm sẽ giảm từ $O(log(n))$ xuống $O(n)$ (nhấn vào [đây](/dsa/intro/complexity) để tìm hiểu về độ phức tạp thời gian), đúng không?

Chúng ta cần phải cân bằng nó, đúng không? Do đó, có cây nhị phân cân bằng, trong đó độ chênh lệch chiều cao giữa hai cây con không vượt quá 1, như hình dưới đây:

```
        8
      /   \
     4     12
    / \    / \
   2   6  10  14
      / \    / \
     5   7  13  15
```

Nút gốc là 8, các nút của cây con bên trái bao gồm 4, 2, 6, 5 và 7, các nút của cây con bên phải bao gồm 12, 10, 14, 13 và 15. Cây con bên trái và cây con bên phải có độ chênh lệch chiều cao không vượt quá 1, do đó, đây là một cây tìm kiếm nhị phân cân bằng.

Cây nhị phân cân bằng giống như một cái cân cây, trọng lượng của hai bên trái và phải phải cân bằng càng tốt. Khi chúng ta chèn một nút vào cây nhị phân cân bằng, cây sẽ tự động điều chỉnh vị trí của các nút để đảm bảo độ chênh lệch chiều cao giữa hai bên không vượt quá 1. Tương tự, khi chúng ta xóa một nút, cây nhị phân cân bằng cũng sẽ tự động điều chỉnh vị trí của các nút để đảm bảo độ chênh lệch chiều cao giữa hai bên không vượt quá 1.

Các cây nhị phân cân bằng phổ biến bao gồm cây AVL, cây đỏ-đen, v.v., chúng đều sử dụng các thao tác xoay để điều chỉnh sự cân bằng của cây, làm cho độ cao của cây con bên trái và bên phải càng gần nhau càng tốt.

Sơ đồ cây AVL:

```
           8
         /   \
        4     12
       / \   /  \
      2   6 10  14
         / \
        5   7
```

Cây AVL là một cây tìm kiếm nhị phân có độ cân bằng cao, yêu cầu độ chênh lệch chiều cao giữa cây con bên trái và bên phải không vượt quá 1. Do độ cân bằng cao, cây AVL cần thực hiện nhiều thao tác xoay hơn khi chèn và xóa để duy trì cân bằng, nhưng lại có hiệu suất cao trong thao tác tìm kiếm. Cây AVL thích hợp cho các tình huống có nhiều thao tác đọc.

Ví dụ, đối với một tình huống cần thực hiện nhiều thao tác tìm kiếm, như cây từ điển, bảng băm, v.v., có thể sử dụng cây AVL để tối ưu hóa. Ngoài ra, cây AVL cũng thích hợp cho các tình huống cần đảm bảo dữ liệu có thứ tự, như chỉ mục trong cơ sở dữ liệu.

Cây AVL được đề xuất bởi hai nhà khoa học máy tính Liên Xô, Adelson-Velskii và Landis, vào năm 1962. Do đó, cây AVL được đặt tên theo chữ cái đầu

 của tên hai người họ.

Phát minh cây AVL đã có ảnh hưởng quan trọng đối với sự phát triển của khoa học máy tính, không chỉ cung cấp nền tảng cho các cây nhị phân cân bằng sau này, mà còn cung cấp gợi ý cho các cấu trúc dữ liệu và thuật toán khác.

Sơ đồ cây đỏ-đen (R là Red "đỏ", B là Black "đen"):

```
           8B
         /   \
        4R    12R
       / \   /  \
      2B 6B 10B 14B
         / \
        5R 7R
```

Cây đỏ-đen, như tên gọi, là cây nhị phân cân bằng có các nút màu đỏ hoặc màu đen, duy trì sự cân bằng của cây bằng cách sử dụng các hạn chế màu sắc, yêu cầu số lượng nút đen trên bất kỳ đường nào là như nhau, đồng thời cần thỏa mãn một số điều kiện cụ thể khác, chẳng hạn như nút đỏ phải có nút cha là nút đen, v.v.

- 1) Mỗi nút chỉ có thể là màu đỏ hoặc màu đen.
- 2) Nút gốc là màu đen.
- 3) Mỗi nút lá (nút NIL, nút trống) là màu đen.
- 4) Nếu một nút là màu đỏ, thì hai nút con của nó phải là màu đen. Điều này có nghĩa là không thể xuất hiện hai nút màu đỏ liền kề trên một đường.
- 5) Từ bất kỳ nút nào đến tất cả các lá của nó đều có cùng số lượng nút đen.

Do độ cân bằng của cây đỏ-đen thấp hơn cây AVL, cần thực hiện ít thao tác xoay hơn khi chèn và xóa, nhưng vẫn có hiệu suất cao trong thao tác tìm kiếm. Cây đỏ-đen thích hợp cho các tình huống có thao tác đọc và ghi cân bằng.

Đó là một số kiến thức cơ bản về cây đỏ-đen, các bạn đã có một ấn tượng tổng quan và hiểu TreeMap là gì.

### 01. Thứ tự tự nhiên

Mặc định, TreeMap sắp xếp các key theo thứ tự tự nhiên. Chẳng hạn như số nguyên, TreeMap sẽ sắp xếp theo thứ tự tăng dần 1, 2, 3, 4, 5.

```java
TreeMap<Integer,String> mapInt = new TreeMap<>();
mapInt.put(3, "abcde");
mapInt.put(2, "abcde");
mapInt.put(1, "abcde");
mapInt.put(5, "abcde");
mapInt.put(4, "abcde");

System.out.println(mapInt);
```

Kết quả đầu ra như sau:

```
{1=abcde, 2=abcde, 3=abcde, 4=abcde, 5=abcde}
```

TreeMap làm điều này như thế nào? Để hiểu rõ hơn, chúng ta hãy xem qua mã nguồn của phương thức `put()` của TreeMap:

```java
public V put(K key, V value) {
    Entry<K,V> t = root; // Gán nút gốc cho biến t
    if (t == null) { // Nếu nút gốc là null, tức là TreeMap rỗng
        compare(key, key); // Kiểm tra hợp lệ của key
        root = new Entry<>(key, value, null); // Tạo nút mới làm nút gốc
        size = 1; // Thiết lập kích thước là 1
        return null; // Trả về null, biểu thị chèn thành công
    }
    int cmp;
    Entry<K,V> parent;
    // Tách đường so sánh và con đường có thể so sánh
    Comparator<? super K> cpr = comparator; // Lấy comparator
    if (cpr != null) { // Nếu sử dụng Comparator
        do {
            parent = t; // Gán nút hiện tại cho parent
            cmp = cpr.compare(key, t.key); // So sánh key với key của t bằng Comparator
            if (cmp < 0) // Nếu key nhỏ hơn key của t
                t = t.left; // Tìm trong cây con bên trái của t
            else if (cmp > 0) // Nếu key lớn hơn key của t
                t = t.right; // Tìm trong cây con bên phải của t
            else // Nếu key bằng key của t
                return t.setValue(value); // Cập nhật giá trị của t
        } while (t != null);
    } else { // Nếu không sử dụng Comparator
        if (key == null) // Nếu key là null
            throw new NullPointerException(); // Ném ngoại lệ NullPointerException
        Comparable<? super K> k = (Comparable<? super K>) key; // Ép kiểu key sang Comparable
        do {
            parent = t; // Gán nút hiện tại cho parent
            cmp = k.compareTo(t.key); // So sánh key với key của t bằng Comparable
            if (cmp < 0) // Nếu key nhỏ hơn key của t
                t = t.left; // Tìm trong cây con bên trái của t
            else if (cmp > 0) // Nếu key lớn hơn key của t
                t = t.right; // Tìm trong cây con bên phải của t
            else // Nếu key bằng key của t
                return t.setValue(value); // Cập nhật giá trị của t
        } while (t != null);
    }
    // Nếu không tìm thấy key giống nhau, tạo nút mới và chèn vào TreeMap
    Entry<K,V> e = new Entry<>(key, value, parent); // Tạo nút mới
    if (cmp < 0) // Nếu key nhỏ hơn key của parent
        parent.left = e; // Đặt e làm con trái của parent
    else
        parent.right = e; // Đặt e làm con phải của parent
    fixAfterInsertion(e); // Cân bằng cây sau khi chèn
    size++; // Tăng kích thước lên 1
    return null; // Trả về null, biểu thị chèn thành công
}
```

- Đầu tiên, định nghĩa một biến `Entry` kiểu `Entry<K, V>` để biểu diễn nút gốc hiện tại.
- Nếu `t` là null, tức là TreeMap rỗng, tạo một nút mới làm nút gốc và thiết lập kích thước là 1.
- Nếu `t` không phải null, cần tìm nút tương ứng với key trong TreeMap. Vì các phần tử trong TreeMap là có thứ tự, có thể sử dụng cách tìm kiếm nhị phân.
- Nếu TreeMap sử dụng `Comparator` để sắp xếp, sử dụng `Comparator` để so sánh, nếu không, sử dụng `Comparable` để so sánh. Nếu tìm thấy key tương ứng, cập nhật giá trị của nó.
- Nếu không tìm thấy key tương ứng, tạo một nút mới và chèn vào TreeMap. Sau đó, sử dụng phương thức `fixAfterInsertion()` để cân bằng lại cây.
- Cuối cùng, tăng kích thước của TreeMap lên 1 và trả về null. Nếu đã cập nhật giá trị tương ứng, trả về giá trị ban đầu.

Chú ý dòng `cmp = k.compareTo(t.key)` là dòng mã để so sánh key, vì key là String, nên nó sẽ gọi phương thức `compareTo()` của lớp String để so sánh.

```java
public int compareTo(String anotherString) {
    // Lấy độ dài của chuỗi hiện tại và chuỗi khác
    int len1 = value.length;
    int len2 = anotherString.value.length;
    // Lấy độ dài nhỏ hơn của hai chuỗi làm giới hạn so sánh
    int lim = Math.min(len1, len2);
    // Lấy mảng ký tự của chuỗi hiện tại và chuỗi khác
    char v1[] = value;
    char v2[] = anotherString.value;

    int k = 0;
    // So sánh từng ký tự của hai chuỗi
    while (k < lim) {
        char c1 = v1[k];
        char c2 = v2[k];
        // Nếu hai ký tự không bằng nhau, trả về chênh lệch của chúng
        if (c1 != c2) {
            return c1 - c2;
        }
        k++;
    }
    // Nếu các ký tự trước đó của hai chuỗi đều bằng nhau, trả về chênh lệch độ dài của chúng
    return len1 - len2;
}
```

Xem ví dụ dưới đây:

```java
TreeMap<String,String> mapString = new TreeMap<>();
mapString.put("c", "abcde");
mapString.put("b", "abcde");
mapString.put("a", "abcde");
mapString.put("e", "abcde");
mapString.put("d", "abcde");

System.out.println(mapString);
```

Kết quả đầu ra như sau:

```
{a=abcde, b=abcde, c=abcde, d=abcde, e=abcde}
```

Kết quả cho thấy các phần tử được sắp xếp theo thứ tự tăng dần của các ký tự trong bảng chữ cái.

### 02. Sắp xếp theo thứ tự tùy chỉnh

Nếu thứ tự tự nhiên không đáp ứng được yêu cầu, bạn có thể chỉ định quy tắc sắp xếp khi khai báo đối tượng TreeMap.

```java
TreeMap<Integer,String> mapIntReverse = new TreeMap<>(Comparator.reverseOrder());
mapIntReverse.put(3, "abcde");
mapIntReverse.put(2, "abcde");
mapIntReverse.put(1, "abcde");
mapIntReverse.put(5, "abcde");
mapIntReverse.put(4, "abcde");

System.out.println(mapIntReverse);
```

TreeMap cung cấp constructor cho phép chỉ định Comparator để sắp xếp.

```java
public TreeMap(Comparator<? super K> comparator) {
    this.comparator = comparator;
}
```

`Comparator.reverseOrder()` trả về đối tượng Collections.ReverseComparator để đảo ngược thứ tự, rất tiện lợi.

```java
private static class ReverseComparator
        implements Comparator<Comparable<Object>>, Serializable {
    // Đối tượng duy nhất, dùng để đại diện cho bộ so sánh ngược
    static final ReverseComparator REVERSE_ORDER
            = new ReverseComparator();

    // Phương thức so sánh, so sánh ngược giữa hai đối tượng có thể so sánh được
    public int compare(Comparable<Object> c1, Comparable<Object> c2) {
        return c2.compareTo(c1); // Gọi phương thức compareTo() của c2 với tham số c1 để so sánh ngược
    }

    // Trong quá trình đảo ngược, trả về Collections.reverseOrder() để đảm bảo duy nhất
    private Object readResolve() {
        return Collections.reverseOrder();
    }

    // Trả về bộ so sánh thứ tự bình thường
    @Override
    public Comparator<Comparable<Object>> reversed() {
        return Comparator.naturalOrder();
    }
}
```

Vì vậy, kết quả xuất ra sẽ như sau:

```
{5=abcde, 4=abcde, 3=abcde, 2=abcde, 1=abcde}
```

HashMap không có thứ tự, thứ tự các phần tử thay đổi khi chèn thêm phần tử. Tuy nhiên, TreeMap luôn duy trì thứ tự theo quy tắc đã chỉ định từ đầu, điều này rất hữu ích cho các tình huống cần sắp xếp theo yêu cầu đặc biệt!

### 03. Lợi ích của việc sắp xếp

Vì các phần tử trong TreeMap đã được sắp xếp, việc tìm phần tử lớn nhất, nhỏ nhất, hoặc tất cả các phần tử lớn hơn hoặc nhỏ hơn một giá trị nào đó trở nên dễ dàng hơn nhiều.

```java
Integer highestKey = mapInt.lastKey();
Integer lowestKey = mapInt.firstKey();
Set<Integer> keysLessThan3 = mapInt.headMap(3).keySet();
Set<Integer> keysGreaterThanEqTo3 = mapInt.tailMap(3).keySet();

System.out.println(highestKey);
System.out.println(lowestKey);

System.out.println(keysLessThan3);
System.out.println(keysGreaterThanEqTo3);
```

TreeMap cung cấp các phương thức `lastKey()` và `firstKey()` để lấy key cuối cùng và key đầu tiên.

Phương thức `headMap()` trả về các key nhỏ hơn một giá trị chỉ định, trong khi `tailMap()` trả về các key lớn hơn hoặc bằng một giá trị chỉ định (bao gồm cả giá trị đó).

Dưới đây là kết quả xuất ra:

```
5
1
[1, 2]
[3, 4, 5]
```

Hãy xem ví dụ sau:

```java
TreeMap<Integer, String> treeMap = new TreeMap<>();
treeMap.put(1, "value1");
treeMap.put(2, "value2");
treeMap.put(3, "value3");
treeMap.put(4, "value4");
treeMap.put(5, "value5");

// Ví dụ sử dụng headMap, lấy các cặp key-value có key nhỏ hơn 3
Map<Integer, String> headMap = treeMap.headMap(3);
System.out.println(headMap); // Output: {1=value1, 2=value2}

// Ví dụ sử dụng tailMap, lấy các cặp key-value có key lớn hơn hoặc bằng 4
Map<Integer, String> tailMap = treeMap.tailMap(4);
System.out.println(tailMap); // Output: {4=value4, 5=value5}

// Ví dụ sử dụng subMap, lấy các cặp key-value có key từ 2 đến 4 (bao gồm cả 2 và 3)
Map<Integer, String> subMap = treeMap.subMap(2, 4);
System.out.println(subMap); // Output: {2=value2, 3=value3}
```

Các phương thức headMap, tailMap và subMap đã được sử dụng để lấy các cặp key-value thỏa mãn các điều kiện chỉ định.

### 04. Lựa chọn Map phù hợp

Trước khi học về TreeMap, chúng ta đã tìm hiểu về [HashMap](hashmap) và [LinkedHashMap](linkedhashmap). Vậy làm thế nào để lựa chọn giữa ba loại Map này?

Các yếu tố cần xem xét:

- **Có cần sắp xếp theo thứ tự tự nhiên hoặc thứ tự tùy chỉnh của các key không?** Nếu cần sắp xếp theo key, bạn có thể sử dụng TreeMap; nếu không cần sắp xếp, bạn có thể sử dụng HashMap hoặc LinkedHashMap.
  
- **Có cần giữ thứ tự chèn của các phần tử không?** Nếu cần giữ thứ tự chèn, bạn có thể sử dụng LinkedHashMap; nếu không cần, bạn có thể sử dụng TreeMap hoặc HashMap.

- **Có cần hiệu suất tìm kiếm cao không?** Nếu cần hiệu suất tìm kiếm cao, bạn có thể sử dụng LinkedHashMap hoặc HashMap vì thời gian tìm kiếm của chúng là O(1), trong khi của TreeMap là O(log n).

LinkedHashMap sử dụng bảng băm nội bộ để lưu trữ cặp key-value và duy trì thứ tự chèn bằng cách sử dụng một danh sách liên kết hai chiều. Tuy nhiên, thao tác tìm kiếm chỉ cần thực hiện trên bảng băm, không liên quan đến danh sách liên kết, do đó có độ phức tạp thời gian là $O(1)$.

Dưới đây là bảng so sánh để bạn có thể dễ dàng nhìn thấy:

| Đặc điểm              | TreeMap                    | HashMap                          | LinkedHashMap                      |
| --------------------- | -------------------------- | -------------------------------- | ---------------------------------- |
| Sắp xếp               | Hỗ trợ                     | Không hỗ trợ                     | Không hỗ trợ                       |
| Giữ thứ tự chèn       | Không đảm bảo              | Không đảm bảo                    | Đảm bảo                            |
| Hiệu suất tìm kiếm    | O(log n)                   | O(1)                             | O(1)                               |
| Chiếm dụng không gian | Thường lớn hơn             | Thường nhỏ hơn                   | Thường lớn hơn                     |
| Ứng dụng thích hợp    | Các tình huống cần sắp xếp | Các tình huống không cần sắp xếp | Các tình huống cần giữ thứ tự chèn |

Vậy là hết buổi học về TreeMap, hy vọng các bạn đã hiểu rõ về nó. Hẹn gặp lại các bạn ở bài học sau~