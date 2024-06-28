---
title: LinkedHashMap
tags:
  - java
categories:
  - java
order: 6
---
# LinkedHashMap chi tiết (kèm mã nguồn)

> Bài viết này sẽ đổi một chút phong cách để mang lại một chút không khí mới cho các bạn.

Có một câu tục ngữ nói rằng "mọi thứ đều không hoàn hảo", và HashMap cũng không phải là ngoại lệ. Nếu chúng ta cần một tập hợp các cặp khóa-giá trị được sắp xếp theo thứ tự chèn, thì HashMap sẽ không thể làm được. Vậy phải làm sao? Đây chính là lúc chúng ta cần đến ngôi sao chính của bài viết hôm nay: LinkedHashMap.

Xin chào các bạn, còn nhớ bài viết về [HashMap](/programming/java/collection/hashmap) không? Tôi cảm thấy viết rất tuyệt vời, dễ hiểu và sâu sắc vào mã nguồn, thực sự là phân tích một cách rõ ràng, dễ hiểu và rõ ràng. (Không cẩn thận lại ném ba thành ngữ, có văn hóa đấy nhé?) HashMap có thể nói là mọi thứ đều tốt, thật sự, chỉ cần bạn muốn sử dụng các cặp khóa-giá trị, bạn nên nghĩ ngay đến nó.

Để tăng hiệu suất tìm kiếm, khi chèn vào, HashMap đã thực hiện một lần thuật toán băm cho khóa, điều này dẫn đến việc các phần tử được chèn là không có thứ tự.

Các bạn nào vẫn không hiểu điều này, có thể quay lại [HashMap](/programming/java/collection/hashmap), xem phương thức băm, xem giải thích về `put()` mà tôi đã trình bày, bạn sẽ hiểu được, chúng ta hãy xem xét lại.

```java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,

               boolean evict) {
    HashMap.Node<K,V>[] tab; HashMap.Node<K,V> p; int n, i;
    // ①、Nếu mảng table là null, gọi phương thức resize để tạo mảng mặc định
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    // ②、Tính chỉ số, nếu vị trí đó không có giá trị, điền vào
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
}
```

Trong đó công thức này `i = (n - 1) & hash` tính toán giá trị sau khi khóa được đặt vào mảng (thùng) trong chỉ số (vị trí / vị trí), nhưng nó không theo thứ tự từ 0,1,2,3,4,5 để chèn các cặp khóa giá trị vào mảng, mà có một sự ngẫu nhiên nhất định.

Ví dụ về điều này.

```java
// Tạo một đối tượng HashMap, loại khóa là chuỗi, loại giá trị là chuỗi
Map<String, String> map = new HashMap<>();

// Sử dụng phương thức put() để thêm dữ liệu vào HashMap
map.put("chenmo", "沉默");
map.put("wanger", "王二");
map.put("chenqingyang", "陈清扬");

// Duyệt qua HashMap, xuất tất cả các cặp khóa-giá trị
for (Map.Entry<String, String> entry : map.entrySet()) {
    String key = entry.getKey();
    String value = entry.getValue();
    System.out.println("Key: " + key + ", Value: " + value);
}
```

Hãy xem kết quả đầu ra

```
Key: chenmo, Value: 沉默
Key: chenqingyang, Value: 陈清扬
Key: wanger, Value: 王二
```

So sánh kết quả đầu ra chỉ ra rằng, khi chèn vào là chèn theo thứ tự của im lặng, hai của Wang và chen Qing Yang, nhưng không phải lần lượt có thể duyệt qua các con đường: im lặng, 陈清扬, Wang nói vì thì dây không

### 01. Thứ tự chèn

Trong bài viết về [HashMap](/programming/java/collection/hashmap.html), tôi đã giải thích một điều, không biết các bạn còn nhớ không, đó là null sẽ được chèn vào vị trí đầu tiên của HashMap.

```java
Map<String, String> hashMap = new HashMap<>();
hashMap.put("沉", "沉默王二");
hashMap.put("默", "沉默王二");
hashMap.put("王", "沉默王二");
hashMap.put("二", "沉默王二");
hashMap.put(null, null);

for (String key : hashMap.keySet()) {
    System.out.println(key + " : " + hashMap.get(key));
}
```

Kết quả xuất ra là:

```
null : null
默 : 沉默王二
沉 : 沉默王二
王 : 沉默王二
二 : 沉默王二
```

Mặc dù null được đưa vào cuối cùng, nhưng khi duyệt qua và xuất ra, nó lại xuất hiện đầu tiên.

Bây giờ chúng ta hãy so sánh lại với LinkedHashMap.

```java
Map<String, String> linkedHashMap = new LinkedHashMap<>();
linkedHashMap.put("沉", "沉默王二");
linkedHashMap.put("默", "沉默王二");
linkedHashMap.put("王", "沉默王二");
linkedHashMap.put("二", "沉默王二");
linkedHashMap.put(null, null);

for (String key : linkedHashMap.keySet()) {
    System.out.println(key + " : " + linkedHashMap.get(key));
}
```

Kết quả xuất ra là:

```
沉 : 沉默王二
默 : 沉默王二
王 : 沉默王二
二 : 沉默王二
null : null
```

null được chèn vào cuối cùng và xuất ra cuối cùng.

Kết quả xuất ra lần này lại cho thấy rằng **HashMap là không có thứ tự, còn LinkedHashMap có thể duy trì thứ tự chèn**.

Vậy làm sao LinkedHashMap có thể làm được điều này? Tôi tin rằng các bạn cũng rất muốn biết nguyên nhân.

Để hiểu rõ, chúng ta cần nghiên cứu sâu hơn vào mã nguồn của LinkedHashMap. LinkedHashMap không ghi đè phương thức `put()` của HashMap mà ghi đè các phương thức nội bộ mà `put()` cần gọi, ví dụ như `newNode()`.

Đây là của HashMap.

```java
Node<K,V> newNode(int hash, K key, V value, Node<K,V> next) {
    return new Node<>(hash, key, value, next);
}
```

Đây là của LinkedHashMap.

```java
HashMap.Node<K,V> newNode(int hash, K key, V value, HashMap.Node<K,V> e) {
    LinkedHashMap.Entry<K,V> p =
            new LinkedHashMap.Entry<>(hash, key, value, e);
    linkNodeLast(p);
    return p;
}
```

Như trước, `LinkedHashMap.Entry` kế thừa từ `HashMap.Node` và bổ sung thêm hai trường `before` và `after` để duy trì mối quan hệ giữa các cặp khóa-giá trị.

```java
static class Entry<K,V> extends HashMap.Node<K,V> {
    Entry<K,V> before, after;
    Entry(int hash, K key, V value, Node<K,V> next) {
        super(hash, key, value, next);
    }
}
```

Trong LinkedHashMap, thứ tự của các nút trong danh sách liên kết được duy trì theo thứ tự chèn. Khi sử dụng phương thức `put()` để thêm một cặp khóa-giá trị vào LinkedHashMap, nó sẽ chèn nút mới vào cuối danh sách liên kết và cập nhật các thuộc tính `before` và `after` để duy trì mối quan hệ chuỗi — điều này được thực hiện bởi phương thức `linkNodeLast()`:

```java
/**
 * Chèn nút chỉ định vào cuối danh sách liên kết
 *
 * @param p Nút cần chèn
 */
private void linkNodeLast(LinkedHashMap.Entry<K,V> p) {
    LinkedHashMap.Entry<K,V> last = tail; // Lấy nút cuối của danh sách liên kết
    tail = p; // Đặt p làm nút cuối
    if (last == null)
        head = p; // Nếu danh sách liên kết rỗng, đặt p làm đầu
    else {
        p.before = last; // Đặt nút trước của p là nút cuối của danh sách liên kết
        last.after = p; // Đặt nút sau của nút cuối của danh sách liên kết là p
    }
}
```

Nhìn vào đây, LinkedHashMap khi thêm phần tử thứ nhất sẽ lấy head gán cho phần tử đầu, đến phần tử thứ hai thêm vào sẽ gán vào sau phần tử đầu tiên.

### 02. Thứ tự truy cập

LinkedHashMap không chỉ giữ được thứ tự chèn mà còn có thể giữ được thứ tự truy cập. Thao tác truy cập bao gồm sử dụng phương thức `get()`, `remove()` và `put()`.

Để giữ thứ tự truy cập, chúng ta cần chỉ định ba tham số khi khai báo LinkedHashMap.

```java
LinkedHashMap<String, String> map = new LinkedHashMap<>(16, .75f, true);
```

Tham số đầu tiên và thứ hai, các bạn đã quen thuộc khi đọc về [HashMap](https://javabetter.cn/collection/hashmap.html), đó là dung lượng ban đầu và hệ số tải.

Tham số thứ ba, nếu là true, đó biểu thị rằng LinkedHashMap sẽ duy trì thứ tự truy cập; nếu là false, nó sẽ duy trì thứ tự chèn. Mặc định là false.

```java
Map<String, String> linkedHashMap = new LinkedHashMap<>(16, .75f, true);
linkedHashMap.put("沉", "沉默王二");
linkedHashMap.put("默", "沉默王二");
linkedHashMap.put("王", "沉默王二");
linkedHashMap.put("二", "沉默王二");

System.out.println(linkedHashMap);

linkedHashMap.get("默");
System.out.println(linkedHashMap);

linkedHashMap.get("王");
System.out.println(linkedHashMap);
```

Kết quả xuất ra như sau:

```
{沉=沉默王二, 默=沉默王二, 王=沉默王二, 二=沉默王二}
{沉=沉默王二, 王=沉默王二, 二=沉默王二, 默=沉默王二}
{沉=沉默王二, 二=沉默王二, 默=沉默王二, 王=沉默王二}
```

Khi chúng ta sử dụng phương thức `get()` để truy cập phần tử có khóa là "默", trong kết quả xuất ra, cặp khóa-giá trị `默=沉默王二` sẽ được đưa lên đầu. Tương tự, khi truy cập phần tử có khóa là "王", cặp khóa-giá trị `王=沉默王二` sẽ được đưa lên đầu, còn `默=沉默王二` sẽ lên ngay sau.

Điều này có nghĩa là phần tử ít được truy cập nhất sẽ được đưa lên đầu. Điều này rất thú vị đúng không?

Chúng ta có thể sử dụng LinkedHashMap để thực hiện bộ nhớ cache LRU (Least Recently Used), tức là loại bỏ trang ít được sử dụng nhất gần đây. Đây là một thuật toán thay thế trang phổ biến được sử dụng, lựa chọn các trang đã không được sử dụng trong thời gian dài nhất để loại bỏ.

```java
/**
 * Lớp MyLinkedHashMap do người dùng tự định nghĩa, kế thừa từ lớp LinkedHashMap<K, V> mặc định trong Java.
 * Được sử dụng để triển khai bộ nhớ cache có kích thước cố định; khi bộ nhớ cache đạt đến dung lượng tối đa,
 * phần tử được thêm vào sớm nhất sẽ tự động bị loại bỏ để tạo không gian cho phần tử mới.
 *
 * @param <K> Kiểu của khóa
 * @param <V> Kiểu của giá trị
 */
public class MyLinkedHashMap<K, V> extends LinkedHashMap<K, V> {

    private static final int MAX_ENTRIES = 5; // Đại diện cho số lượng cặp khóa-giá trị tối đa mà MyLinkedHashMap có thể lưu trữ

    /**
     * Phương thức khởi tạo, gọi phương thức khởi tạo của lớp cha bằng super() và chuyển ba tham số: initialCapacity, loadFactor và accessOrder.
     *
     * @param initialCapacity Dung lượng ban đầu
     * @param loadFactor      Hệ số tải
     * @param accessOrder     Thứ tự truy cập
     */
    public MyLinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder) {
        super(initialCapacity, loadFactor, accessOrder);
    }

    /**
     * Ghi đè phương thức removeEldestEntry() của lớp cha, dùng để xác định liệu có nên loại bỏ phần tử đã thêm sớm nhất hay không.
     * Nếu trả về true, phần tử đã thêm sớm nhất sẽ bị xóa.
     *
     * @param eldest Phần tử đã thêm sớm nhất
     * @return Nếu số lượng phần tử hiện tại trong MyLinkedHashMap lớn hơn MAX_ENTRIES, trả về true; ngược lại, trả về false.
     */
    @Override
    protected boolean removeEldestEntry(Map.Entry eldest) {
        return size() > MAX_ENTRIES;
    }

}
```

MyLinkedHashMap là một lớp tự định nghĩa, kế thừa từ LinkedHashMap và ghi đè phương thức `removeEldestEntry()` để giới hạn Map chỉ có thể chứa tối đa 5 cặp khóa-giá trị. Nếu vượt quá, phần tử đã thêm sớm nhất sẽ tự động bị loại bỏ.