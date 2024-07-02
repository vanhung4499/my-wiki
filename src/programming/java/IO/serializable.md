---
title: Serializable
tags:
  - java
categories:
  - java
order: 8
---
# Serializable Interface

Đối với việc serialize trong Java, trước đây tôi luôn có hiểu biết rất cơ bản - chỉ cần triển khai interface `Serializable` cho lớp cần được [serialize](serialize) là xong.

Tôi dường như không muốn nghiên cứu sâu hơn vì chỉ cần biết cách sử dụng là đủ rồi mà.

Nhưng theo thời gian, tôi gặp `Serializable` ngày càng nhiều, và tôi bắt đầu quan tâm đến nó. Đã đến lúc dành chút thời gian để nghiên cứu về nó.

### 01. Bắt đầu với lý thuyết

Serialize trong Java là một tập hợp các tính năng tiên phong được giới thiệu từ JDK 1.1, dùng để chuyển đổi các đối tượng Java thành mảng byte, tiện lợi cho việc lưu trữ hoặc truyền tải. Sau đó, có thể chuyển đổi mảng byte trở lại trạng thái ban đầu của đối tượng Java.

Ý tưởng của serialize là "đóng băng" trạng thái của đối tượng, sau đó ghi vào đĩa hoặc truyền qua mạng; ý tưởng của [deserialize](https://javabetter.cn/io/serialize.html) là "rã đông" trạng thái của đối tượng, khôi phục lại đối tượng Java có thể sử dụng.

Có một quy tắc trong serialize, đó là đối tượng cần serialize phải triển khai interface `Serializable`, nếu không sẽ ném ra ngoại lệ `NotSerializableException`.

Tốt, hãy xem định nghĩa của interface `Serializable`:

```java
public interface Serializable {
}
```

Không còn gì khác nữa!

Chỉ có một interface trống thôi mà, vậy mà lại có thể đảm bảo rằng lớp triển khai nó có thể được serialize và deserialize?

### 02. Tiếp theo là thực hành

Trước khi trả lời câu hỏi trên, chúng ta hãy tạo một lớp (chỉ có hai trường và các phương thức `getter/setter` tương ứng) để thực hiện serialize và deserialize.

```java
class Wanger {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

Tiếp theo, chúng ta tạo một lớp thử nghiệm, sử dụng `ObjectOutputStream` để ghi "Wanger 18 tuổi" vào tệp, thực chất là quá trình serialize; sau đó sử dụng `ObjectInputStream` để đọc "Wanger 18 tuổi" từ tệp ra, thực chất là quá trình deserialize. (Chúng ta đã học về [dòng tuần tự](https://javabetter.cn/io/serialize.html) trước đây)

```java
// Khởi tạo
Wanger wanger = new Wanger();
wanger.setName("王二");
wanger.setAge(18);
System.out.println(wanger);

// Ghi đối tượng vào tệp
try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("chenmo"))){
    oos.writeObject(wanger);
} catch (IOException e) {
    e.printStackTrace();
}

// Đọc đối tượng từ tệp
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(new File("chenmo")))){
    Wanger wanger1 = (Wanger) ois.readObject();
    System.out.println(wanger1);
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
```

Tuy nhiên, vì lớp `Wanger` không triển khai interface `Serializable`, nên khi chạy lớp thử nghiệm, sẽ xảy ra ngoại lệ và thông tin ngăn xếp như sau:

```
java.io.NotSerializableException: com.cmower.java_demo.xuliehua.Wanger
    at java.io.ObjectOutputStream.writeObject0(ObjectOutputStream.java:1184)
    at java.io.ObjectOutputStream.writeObject(ObjectOutputStream.java:348)
    at com.cmower.java_demo.xuliehua.Test.main(Test.java:21)
```

Dựa vào thông tin từ ngăn xếp, chúng ta xem xét phương thức `writeObject0()` của `ObjectOutputStream`. Một phần mã nguồn như sau:

```java
// Kiểm tra xem đối tượng có phải là kiểu chuỗi không, nếu có thì gọi phương thức writeString để serialize
if (obj instanceof String) {
    writeString((String) obj, unshared);
}
// Kiểm tra xem đối tượng có phải là kiểu mảng không, nếu có thì gọi phương thức writeArray để serialize
else if (cl.isArray()) {
    writeArray(obj, desc, unshared);
}
// Kiểm tra xem đối tượng có phải là kiểu enum không, nếu có thì gọi phương thức writeEnum để serialize
else if (obj instanceof Enum) {
    writeEnum((Enum<?>) obj, desc, unshared);
}
// Kiểm tra xem đối tượng có phải là kiểu có thể serialize không, nếu có thì gọi phương thức writeOrdinaryObject để serialize
else if (obj instanceof Serializable) {
    writeOrdinaryObject(obj, desc, unshared);
}
// Nếu đối tượng không thể serialize, thì ném ngoại lệ NotSerializableException
else {
if (extendedDebugInfo) {
    throw new NotSerializableException(
        cl.getName() + "\n" + debugInfoStack.toString());
} else {
    throw new NotSerializableException(cl.getName());
}
}
```

Nói cách khác, khi `ObjectOutputStream` serialize, nó sẽ kiểm tra loại của đối tượng được serialize là loại nào: chuỗi, mảng, enum hay `Serializable`. Nếu không phải loại nào trong số đó, nó sẽ ném ra ngoại lệ `NotSerializableException`.

Nếu `Wanger` thực hiện interface `Serializable`, nó có thể được serialize và deserialize.

```java
class Wanger implements Serializable{
    private static final long serialVersionUID = -2095916884810199532L;
    
    private String name;
    private int age;
}
```

Cụ thể, quá trình serialize diễn ra như thế nào?

Đối với `ObjectOutputStream`, khi serialize, nó sẽ lần lượt gọi các phương thức `writeObject()`→`writeObject0()`→`writeOrdinaryObject()`→`writeSerialData()`→`invokeWriteObject()`→`defaultWriteFields()`.

```java
private void defaultWriteFields(Object obj, ObjectStreamClass desc) throws IOException {
    // Lấy lớp của đối tượng và kiểm tra xem nó có thể serialize theo mặc định không
    Class<?> cl = desc.forClass();
    desc.checkDefaultSerialize();

    // Lấy số lượng và giá trị các trường kiểu nguyên thủy của đối tượng
    int primDataSize = desc.getPrimDataSize();
    desc.getPrimFieldValues(obj, primVals);
    // Ghi giá trị của các trường kiểu nguyên thủy vào luồng đầu ra
    bout.write(primVals, 0, primDataSize, false);

    // Lấy giá trị các trường không phải kiểu nguyên thủy của đối tượng
    ObjectStreamField[] fields = desc.getFields(false);
    Object[] objVals = new Object[desc.getNumObjFields()];
    int numPrimFields = fields.length - objVals.length;
    desc.getObjFieldValues(obj, objVals);
    // Vòng lặp để ghi giá trị các trường không phải kiểu nguyên thủy của đối tượng
    for (int i = 0; i < objVals.length; i++) {
        // Gọi phương thức writeObject0 để serialize và ghi các trường không phải kiểu nguyên thủy vào luồng đầu ra
        try {
            writeObject0(objVals[i], fields[numPrimFields + i].isUnshared());
        }
        // Nếu xảy ra ngoại lệ trong quá trình ghi, thì bao ngoại lệ thành IOException và ném ra
        catch (IOException ex) {
            if (abortIOException == null) {
                abortIOException = ex;
            }
        }
    }
}
```

Vậy deserialize diễn ra như thế nào?

Đối với `ObjectInputStream`, khi deserialize, nó sẽ lần lượt gọi các phương thức `readObject()`→`readObject0()`→`readOrdinaryObject()`→`readSerialData()`→`defaultReadFields()`.

```java
private void defaultReadFields(Object obj, ObjectStreamClass desc) throws IOException {
    // Lấy lớp của đối tượng và kiểm tra xem đối tượng có thuộc lớp đó không
    Class<?> cl = desc.forClass();
    if (cl != null && obj != null && !cl.isInstance(obj)) {
        throw new ClassCastException();
    }

    // Lấy số lượng và giá trị các trường kiểu nguyên thủy của đối tượng
    int primDataSize = desc.getPrimDataSize();
    if (primVals == null || primVals.length < primDataSize) {
        primVals = new byte[primDataSize];
    }
    // Đọc giá trị của các trường kiểu nguyên thủy từ luồng đầu vào và lưu trữ trong mảng primVals
    bin.readFully(primVals, 0, primDataSize, false);
    if (obj != null) {
        // Đặt giá trị của các trường kiểu nguyên thủy từ mảng primVals vào các trường tương ứng của đối tượng
        desc.setPrimFieldValues(obj, primVals);
    }

    // Lấy số lượng và giá trị các trường không phải kiểu nguyên thủy của đối tượng
    int objHandle = passHandle;
    ObjectStreamField[] fields = desc.getFields(false);
    Object[] objVals = new Object[desc.getNumObjFields()];
    int numPrimFields = fields.length - objVals.length;
    // Vòng lặp để đọc giá trị các trường không phải kiểu nguyên thủy của đối tượng
    for (int i = 0; i < objVals.length; i++) {
        // Gọi phương thức readObject0 để đọc giá trị các trường không phải kiểu nguyên thủy của đối tượng
        ObjectStreamField f = fields[numPrimFields + i];
        objVals[i] = readObject0(Object.class, f.isUnshared());
        // Nếu trường đó là một trường tham chiếu, thì đánh dấu nó phụ thuộc vào đối tượng này
        if (f.getField() != null) {
            handles.markDependency(objHandle, passHandle);
        }
    }
    if (obj != null) {
        // Đặt giá trị của các trường không phải kiểu nguyên thủy từ mảng objVals vào các trường tương ứng của đối tượng
        desc.setObjFieldValues(obj, objVals);
    }
    passHandle = objHandle;
}
```

Đến đây, có lẽ bạn đã hiểu ra tại sao interface `Serializable` lại được định nghĩa là trống. Nó chỉ đóng vai trò như một dấu hiệu, báo cho chương trình biết rằng các đối tượng thực hiện nó có thể được serialize, nhưng việc serialize và deserialize thực sự không cần nó để hoàn thành.

### 03. Một số điểm cần lưu ý

Nói thẳng vào vấn đề, các trường được sửa đổi bởi [`static`](/programming/java/oo/static) và [`transient`](transient) sẽ không được serialize.

Tại sao lại như vậy? Chúng ta hãy chứng minh trước rồi giải thích sau.

Đầu tiên, thêm hai trường vào lớp `Wanger`.

```java
class Wanger implements Serializable {
    private static final long serialVersionUID = -2095916884810199532L;

    private String name;
    private int age;

    public static String pre = "沉默";
    transient String meizi = "王三";

    @Override
    public String toString() {
        return "Wanger{" + "name=" + name + ",age=" + age + ",pre=" + pre + ",meizi=" + meizi + "}";
    }
}
```

Tiếp theo, trong lớp kiểm thử, in ra đối tượng trước và sau khi serialize, đồng thời thay đổi giá trị của trường `static` sau khi serialize và trước khi deserialize. Mã cụ thể như sau:

```java
// Khởi tạo
Wanger wanger = new Wanger();
wanger.setName("王二");
wanger.setAge(18);
System.out.println(wanger);

// Ghi đối tượng vào tệp
try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("chenmo"))){
    oos.writeObject(wanger);
} catch (IOException e) {
    e.printStackTrace();
}

// Thay đổi giá trị của trường static
Wanger.pre = "不沉默";

// Đọc đối tượng từ tệp
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(new File("chenmo")))){
    Wanger wanger1 = (Wanger) ois.readObject();
    System.out.println(wanger1);
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
```

Kết quả đầu ra:

```
Wanger{name=王二,age=18,pre=沉默,meizi=王三}
Wanger{name=王二,age=18,pre=不沉默,meizi=null}
```

Từ kết quả so sánh, chúng ta có thể thấy:

1. Trước khi serialize, giá trị của `pre` là "沉默", sau khi serialize, giá trị của `pre` đã được thay đổi thành "不沉默", và sau khi deserialize, giá trị của `pre` là "不沉默", chứ không phải trạng thái trước khi serialize là "沉默".

Tại sao lại như vậy? Bởi vì serialize lưu trữ trạng thái của đối tượng, trong khi các trường được sửa đổi bởi `static` thuộc về trạng thái của lớp, do đó có thể chứng minh serialize không lưu trữ các trường được sửa đổi bởi `static`.

2. Trước khi serialize, giá trị của `meizi` là "王三", sau khi deserialize, giá trị của `meizi` là `null`, chứ không phải trạng thái trước khi serialize là "王三".

Tại sao lại như vậy? `transient` có nghĩa là "tạm thời", nó có thể ngăn cản trường được serialize vào tệp. Sau khi deserialize, giá trị của trường `transient` được đặt về giá trị ban đầu, chẳng hạn như giá trị ban đầu của kiểu `int` là 0, giá trị ban đầu của đối tượng là `null`.

Nếu muốn nghiên cứu sâu mã nguồn, bạn có thể thấy đoạn mã sau trong `ObjectStreamClass`:

```java
private static ObjectStreamField[] getDefaultSerialFields(Class<?> cl) {
    // Lấy tất cả các trường được khai báo trong lớp
    Field[] clFields = cl.getDeclaredFields();
    ArrayList<ObjectStreamField> list = new ArrayList<>();
    int mask = Modifier.STATIC | Modifier.TRANSIENT;

    // Duyệt qua tất cả các trường, thêm các trường không phải static và transient vào danh sách
    for (int i = 0; i < clFields.length; i++) {
        Field field = clFields[i];
        int mods = field.getModifiers();
        if ((mods & mask) == 0) {
            // Tạo một đối tượng ObjectStreamField dựa trên tên trường, kiểu trường và khả năng serialize của trường
            ObjectStreamField osf = new ObjectStreamField(field.getName(), field.getType(), !Serializable.class.isAssignableFrom(cl));
            list.add(osf);
        }
    }

    int size = list.size();
    // Nếu danh sách rỗng, trả về một mảng ObjectStreamField rỗng, nếu không, chuyển đổi danh sách thành mảng ObjectStreamField và trả về
    return (size == 0) ? NO_FIELDS :
        list.toArray(new ObjectStreamField[size]);
}
```

Bạn thấy `Modifier.STATIC | Modifier.TRANSIENT` chứ? Các trường được đánh dấu bởi hai sửa đổi này không được đưa vào các trường được serialize, bạn đã hiểu chưa?

### 04. Một chút thông tin hữu ích

Ngoài `Serializable`, Java còn cung cấp một interface serialize khác là `Externalizable` (đọc hơi khó).

Hai interface này có gì khác nhau không? Thử là biết ngay.

Đầu tiên, thay thế interface `Serializable` của lớp `Wanger` bằng `Externalizable`.

```java
class Wanger implements Externalizable {
    private String name;
    private int age;

    public Wanger() {

    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return "Wanger{" + "name=" + name + ",age=" + age + "}";
    }

    @Override
    public void writeExternal(ObjectOutput out) throws IOException {

    }

    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {

    }
}
```

Lớp `Wanger` thực hiện interface `Externalizable` có một số điểm khác biệt so với lớp thực hiện interface `Serializable`:

1) Thêm một phương thức khởi tạo không tham số.

Khi sử dụng `Externalizable` để deserialize, nó sẽ gọi phương thức khởi tạo không tham số của lớp được serialize để tạo một đối tượng mới, sau đó sao chép giá trị của các trường của đối tượng được lưu trữ vào. Nếu không, sẽ ném ra ngoại lệ sau:

```
java.io.InvalidClassException: com.cmower.java_demo.xuliehua1.Wanger; no valid constructor
    at java.io.ObjectStreamClass$ExceptionInfo.newInvalidClassException(ObjectStreamClass.java:150)
    at java.io.ObjectStreamClass.checkDeserialize(ObjectStreamClass.java:790)
    at java.io.ObjectInputStream.readOrdinaryObject(ObjectInputStream.java:1782)
    at java.io.ObjectInputStream.readObject0(ObjectInputStream.java:1353)
    at java.io.ObjectInputStream.readObject(ObjectInputStream.java:373)
    at com.cmower.java_demo.xuliehua1.Test.main(Test.java:27)
```

2) Thêm hai phương thức `writeExternal()` và `readExternal()`, cần thiết để thực hiện interface `Externalizable`.

Sau đó, in ra đối tượng trước và sau khi serialize trong lớp kiểm thử.

```java
// Khởi tạo
Wanger wanger = new Wanger();
wanger.setName("王二");
wanger.setAge(18);
System.out.println(wanger);

// Ghi đối tượng vào tệp
try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("chenmo"));) {
    oos.writeObject(wanger);
} catch (IOException e) {
    e.printStackTrace();
}

// Đọc đối tượng từ tệp
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(new File("chenmo")));) {
    Wanger wanger1 = (Wanger) ois.readObject();
    System.out.println(wanger1);
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
// Wanger{name=王二,age=18}
// Wanger{name=null,age=0}
```

Từ kết quả đầu ra, ta có thể thấy các trường của đối tượng sau khi deserialize đều trở về giá trị mặc định, nghĩa là trạng thái của đối tượng trước khi serialize không được "đóng băng" lại.

Tại sao vậy? Vì chúng ta chưa ghi đè cụ thể các phương thức `writeExternal()` và `readExternal()` cho lớp `Wanger`. Vậy làm sao để ghi đè chúng?

```java
@Override
public void writeExternal(ObjectOutput out) throws IOException {
    out.writeObject(name);
    out.writeInt(age);
}

@Override
public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
    name = (String) in.readObject();
    age = in.readInt();
}
```

1) Gọi phương thức `writeObject()` của `ObjectOutput` để ghi trường `name` kiểu chuỗi vào luồng đầu ra;

2) Gọi phương thức `writeInt()` của `ObjectOutput` để ghi trường `age` kiểu số nguyên vào luồng đầu ra;

3) Gọi phương thức `readObject()` của `ObjectInput` để đọc trường `name` kiểu chuỗi từ luồng đầu vào;

4) Gọi phương thức `readInt()` của `ObjectInput` để đọc trường `age` kiểu số nguyên từ luồng đầu vào.

Chạy lại lớp kiểm thử, bạn sẽ thấy đối tượng có thể serialize và deserialize bình thường.

> serialize trước: Wanger{name=王二,age=18}
> serialize sau: Wanger{name=王二,age=18}

Tóm lại:

Externalizable và Serializable đều được sử dụng để serialize và deserialize các đối tượng Java, nhưng chúng có sự khác biệt sau:

1. Serializable là interface do thư viện chuẩn của Java cung cấp, còn Externalizable là interface con của Serializable;

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240702223842.png)

2. interface Serializable không cần thực hiện bất kỳ phương thức nào, chỉ cần đánh dấu lớp cần serialize là Serializable, trong khi interface Externalizable cần thực hiện hai phương thức writeExternal và readExternal;

3. interface Externalizable cung cấp khả năng kiểm soát serialize cao hơn, cho phép thực hiện các xử lý tùy chỉnh trong quá trình serialize và deserialize, chẳng hạn như mã hóa và giải mã một số thông tin nhạy cảm.

### 05. Một chút thông tin bổ sung

Hãy để tôi hỏi bạn trước, bạn có biết đoạn mã `private static final long serialVersionUID = -2095916884810199532L;` có tác dụng gì không?

Ừm...

`serialVersionUID` được gọi là ID serialize, nó là yếu tố quan trọng quyết định liệu đối tượng Java có thể deserialize thành công hay không. Khi deserialize, máy ảo Java sẽ so sánh `serialVersionUID` trong byte stream với `serialVersionUID` trong lớp được serialize, nếu giống nhau thì có thể thực hiện deserialize, nếu không sẽ ném ra ngoại lệ phiên bản serialize không khớp.

Khi một lớp thực hiện interface `Serializable`, IDE sẽ nhắc bạn rằng lớp đó nên có một ID serialize, như thế này:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240702223905.png)


1) Thêm một ID serialize phiên bản mặc định:

```java
private static final long serialVersionUID = 1L;
```

2) Thêm một ID serialize ngẫu nhiên không trùng lặp.

```java
private static final long serialVersionUID = -2095916884810199532L;
```

3) Thêm chú thích `@SuppressWarnings`.

```java
@SuppressWarnings("serial")
```

Lựa chọn như thế nào?

Trước hết, chúng ta sử dụng cách thứ hai, thêm một ID serialize ngẫu nhiên vào lớp được serialize.

```java
class Wanger implements Serializable {
    private static final long serialVersionUID = -2095916884810199532L;

    private String name;
    private int age;

    // Các mã khác bỏ qua
}
```

Sau đó, serialize một đối tượng `Wanger` vào tệp.

```java
// Khởi tạo
Wanger wanger = new Wanger();
wanger.setName("王二");
wanger.setAge(18);
System.out.println(wanger);

// Ghi đối tượng vào tệp
try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("chenmo"));) {
    oos.writeObject(wanger);
} catch (IOException e) {
    e.printStackTrace();
}
```

Lúc này, chúng ta thay đổi ID serialize của lớp `Wanger` một cách bí mật.

```java
// private static final long serialVersionUID = -2095916884810199532L;
private static final long serialVersionUID = -2095916884810199533L;
```

Được rồi, chuẩn bị deserialize nào.

```java
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(new File("chenmo")));) {
    Wanger wanger = (Wanger) ois.readObject();
    System.out.println(wanger);
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
```

Ồ, đã xảy ra lỗi.

```
java.io.InvalidClassException:  local class incompatible: stream classdesc 
serialVersionUID = -2095916884810199532,
local class serialVersionUID = -2095916884810199533
    at java.io.ObjectInputStream.readClassDesc(ObjectInputStream.java:1521)
    at com.cmower.java_demo.xuliehua1.Test.main(Test.java:27)
```

Thông tin ngoại lệ trong ngăn xếp cho biết rằng ID serialize đọc từ tệp không khớp với ID serialize cục bộ, không thể deserialize.

Vậy nếu chúng ta sử dụng phương pháp thứ ba, thêm chú thích `@SuppressWarnings("serial")` cho lớp `Wanger` thì sao?

```java
@SuppressWarnings("serial")
class Wanger implements Serializable {
    // Các mã khác bỏ qua
}
```

Được rồi, thử deserialize lại. Nhưng tiếc là vẫn báo lỗi.

```
java.io.InvalidClassException:  local class incompatible: stream classdesc 
serialVersionUID = -2095916884810199532, 
local class serialVersionUID = -3818877437117647968
    at java.io.ObjectInputStream.readClassDesc(ObjectInputStream.java:1521)
    at com.cmower.java_demo.xuliehua1.Test.main(Test.java:27)
```

Thông tin ngoại lệ trong ngăn xếp cho biết rằng ID serialize cục bộ là -3818877437117647968, và không khớp với ID serialize đọc từ tệp, không thể deserialize. Điều này cho thấy gì? Khi sử dụng chú thích `@SuppressWarnings("serial")`, chú thích này sẽ tự động tạo một ID serialize ngẫu nhiên cho lớp được serialize.

Do đó có thể chứng minh rằng, **Java Virtual Machine có cho phép deserialize hay không không chỉ phụ thuộc vào đường dẫn lớp và mã chức năng có nhất quán hay không, mà còn phụ thuộc rất nhiều vào việc ID serialize có nhất quán hay không**.

Nói cách khác, nếu không có yêu cầu đặc biệt, sử dụng ID serialize mặc định (1L) là được, điều này đảm bảo rằng mã nhất quán thì deserialize sẽ thành công.

```java
class Wanger implements Serializable {
    private static final long serialVersionUID = 1L;
    // Các mã khác bỏ qua
}
```