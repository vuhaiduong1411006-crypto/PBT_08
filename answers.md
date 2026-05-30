# PHẦN A — KIỂM TRA ĐỌC HIỂU (20 điểm)

## Câu A1 (5đ) — Function Declaration vs Expression vs Arrow

### 3 cách viết hàm `tinhThueBaoHiem(luong)`

```javascript
// 1. Function Declaration
function tinhThueBaoHiem(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    return { 
        thue: thue, 
        thuc_nhan: luong - thue 
    };
}

// 2. Function Expression
const tinhThueBaoHiemExp = function(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    return { 
        thue: thue, 
        thuc_nhan: luong - thue 
    };
};

// 3. Arrow Function
const tinhThueBaoHiemArrow = (luong) => {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    return { 
        thue: thue, 
        thuc_nhan: luong - thue 
    };
};

// Kiểm tra kết quả
console.log("=== KIỂM TRA HÀM TÍNH THUẾ ===");
console.log("Lương 15tr:", tinhThueBaoHiem(15000000));     // { thue: 1500000, thuc_nhan: 13500000 }
console.log("Lương 8tr:", tinhThueBaoHiemExp(8000000));    // { thue: 0, thuc_nhan: 8000000 }
console.log("Lương 20tr:", tinhThueBaoHiemArrow(20000000)); // { thue: 2000000, thuc_nhan: 18000000 }
Câu hỏi: 3 cách này có khác nhau về hoisting không?
Trả lời: CÓ khác nhau về hoisting.

1. Function Declaration - Được hoisting HOÀN TOÀN
javascript
// ✅ CÓ THỂ gọi trước khi định nghĩa
console.log("Kết quả sum:", sum(5, 3)); // Kết quả: 8

function sum(a, b) {
    return a + b;
}

// Giải thích: Trình duyệt đưa toàn bộ function lên đầu scope
2. Function Expression - KHÔNG được hoisting
javascript
// ❌ KHÔNG THỂ gọi trước khi định nghĩa
console.log("Kết quả multiply:", multiply(5, 3)); 
// ReferenceError: Cannot access 'multiply' before initialization

const multiply = function(a, b) {
    return a * b;
};

// Giải thích: Chỉ có biến multiply được hoisting (undefined), function chưa được gán
3. Arrow Function - KHÔNG được hoisting
javascript
// ❌ KHÔNG THỂ gọi trước khi định nghĩa
console.log("Kết quả divide:", divide(10, 2));
// ReferenceError: Cannot access 'divide' before initialization

const divide = (a, b) => a / b;

// Giải thích: Tương tự Function Expression
Bảng so sánh chi tiết:
Đặc điểm	Declaration	Expression	Arrow
Hoisting	✅ Có	❌ Không	❌ Không
Có thể gọi trước khi định nghĩa	✅ Có	❌ Không	❌ Không
Có this riêng	✅ Có	✅ Có	❌ Không (kế thừa)
Có arguments object	✅ Có	✅ Có	❌ Không
Dùng làm constructor	✅ Có	✅ Có	❌ Không
Câu A2 (5đ) — Scope & Closure
Đoạn 1: Dự đoán output
javascript
function counter() {
    let count = 0;
    return {
        increment: () => ++count,
        decrement: () => --count,
        getCount: () => count
    };
}
const c = counter();
console.log(c.increment());  // 1
console.log(c.increment());  // 2
console.log(c.increment());  // 3
console.log(c.decrement());  // 2
console.log(c.getCount());   // 2
Giải thích:

Biến count được closure "nhớ" qua mỗi lần gọi function

Mỗi lần gọi increment() hoặc decrement() đều thay đổi cùng một biến count

getCount() chỉ đọc giá trị hiện tại

Đoạn 2: Dự đoán output
javascript
// Đoạn 2:
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log("var:", i), 100);
}
for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log("let:", j), 200);
}
// Output sau 200ms:
// var: 3
// var: 3
// var: 3
// let: 0
// let: 1
// let: 2
Giải thích chi tiết:
Tại sao var cho kết quả 3,3,3?
Scope của var: var có function scope, không có block scope

Chỉ có một biến i: Trong suốt vòng lặp, chỉ có DUY NHẤT một biến i được sử dụng

Thời điểm chạy:

Vòng lặp chạy rất nhanh (< 1ms)

Sau 100ms, vòng lặp đã kết thúc, i = 3

Cả 3 setTimeout đều tham chiếu đến cùng biến i = 3

Kết quả: In ra 3, 3, 3

javascript
// Minh họa hoisting của var
var i;  // Hoisting lên đầu
for (i = 0; i < 3; i++) {
    // Chỉ có một i duy nhất
}
// Sau vòng lặp: i = 3
Tại sao let cho kết quả 0,1,2?
Scope của let: let có block scope

Mỗi lần lặp tạo biến mới: Mỗi iteration tạo một binding riêng cho j

Closure lưu giá trị: Mỗi setTimeout "chụp" lại giá trị của j tại thời điểm đó

Kết quả: In ra 0, 1, 2 tương ứng với từng lần lặp

javascript
// Mỗi lần lặp tạo một scope riêng
{ let j = 0; setTimeout(() => console.log(j), 200); }  // j = 0
{ let j = 1; setTimeout(() => console.log(j), 200); }  // j = 1
{ let j = 2; setTimeout(() => console.log(j), 200); }  // j = 2
Cách khắc phục với var dùng IIFE:
javascript
for (var i = 0; i < 3; i++) {
    (function(index) {
        setTimeout(() => console.log("fixed:", index), 100);
    })(i);
}
// Kết quả: fixed: 0, fixed: 1, fixed: 2
Câu A3 (5đ) — Array Methods
javascript
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 1. Lấy các số chẵn → [2, 4, 6, 8, 10]
const evenNumbers = nums.filter(n => n % 2 === 0);
console.log("1. Số chẵn:", evenNumbers);

// 2. Nhân mỗi số với 3 → [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
const multiplied = nums.map(n => n * 3);
console.log("2. Nhân 3:", multiplied);

// 3. Tính tổng tất cả → 55
const sum = nums.reduce((acc, n) => acc + n, 0);
console.log("3. Tổng:", sum);

// 4. Tìm số đầu tiên > 7 → 8
const firstGreaterThan7 = nums.find(n => n > 7);
console.log("4. Số đầu > 7:", firstGreaterThan7);

// 5. Kiểm tra CÓ số > 10 không → false
const hasGreaterThan10 = nums.some(n => n > 10);
console.log("5. Có số > 10 không:", hasGreaterThan10);

// 6. Kiểm tra TẤT CẢ đều > 0 → true
const allPositive = nums.every(n => n > 0);
console.log("6. Tất cả > 0:", allPositive);

// 7. Tạo mảng "Số X là [chẵn/lẻ]"
const descriptions = nums.map(n => `Số ${n} là ${n % 2 === 0 ? 'chẵn' : 'lẻ'}`);
console.log("7. Mô tả:", descriptions);

// 8. Đảo ngược mảng (không mutate gốc) → [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
const reversed = [...nums].reverse();
console.log("8. Đảo ngược:", reversed);
console.log("   Mảng gốc không đổi:", nums);
Tổng kết các method đã sử dụng:
Method	Công dụng	Return
filter()	Lọc phần tử theo điều kiện	Mảng mới
map()	Biến đổi từng phần tử	Mảng mới
reduce()	Tính toán tích lũy	Giá trị duy nhất
find()	Tìm phần tử đầu tiên thỏa mãn	Phần tử hoặc undefined
some()	Kiểm tra có ít nhất 1 phần tử thỏa	Boolean
every()	Kiểm tra tất cả phần tử thỏa	Boolean
reverse()	Đảo ngược mảng	Mảng đã đảo
Câu A4 (5đ) — Object Destructuring & Spread
Dự đoán output:
javascript
const product = {
    name: "iPhone 16",
    price: 25990000,
    specs: { ram: 8, storage: 256, color: "Titan" }
};

// Destructuring
const { name, price, specs: { ram, color } } = product;
console.log(name, price, ram, color);  
// Kết quả: iPhone 16 25990000 8 Titan

console.log(specs);                     
// Kết quả: ❌ ReferenceError: specs is not defined
// Giải thích: Vì đã destructuring specs: { ram, color }, biến specs không được tạo
Spread operator:
javascript
// Spread
const updated = { ...product, price: 23990000, sale: true };
console.log(updated.price);            // 23990000
console.log(updated.sale);             // true
console.log(product.price);            // 25990000 (gốc KHÔNG đổi)
Shallow copy issue:
javascript
// Spread gotcha
const copy = { ...product };
copy.specs.ram = 16;
console.log(product.specs.ram);        // 16 (đã bị thay đổi!)

// Giải thích: Spread chỉ copy shallow (nông), không copy nested objects
Giải thích chi tiết về Shallow Copy:
javascript
// Minh họa Shallow Copy
const original = {
    name: "iPhone",        // Primitive (string)
    price: 1000,           // Primitive (number)
    specs: { ram: 8 }      // Reference (object)
};

const shallowCopy = { ...original };

// Với primitive → tạo bản sao độc lập
shallowCopy.name = "Samsung";
console.log(original.name);  // "iPhone" (không đổi)

// Với reference → chỉ copy địa chỉ tham chiếu
shallowCopy.specs.ram = 16;
console.log(original.specs.ram);  // 16 (bị ảnh hưởng!)

// Cả hai cùng trỏ đến một object specs trong memory
Cách tạo Deep Copy (copy sâu):
javascript
// Cách 1: JSON (có hạn chế với Date, Function, undefined)
const deepCopy1 = JSON.parse(JSON.stringify(product));

// Cách 2: structuredClone (hiện đại)
const deepCopy2 = structuredClone(product);

// Cách 3: Thủ công với nested objects
const deepCopy3 = {
    ...product,
    specs: { ...product.specs }
};

// Test deep copy
const deepCopy = structuredClone(product);
deepCopy.specs.ram = 32;
console.log(product.specs.ram);  // 8 (không đổi) ✅
Bảng so sánh:
Tình huống	Kết quả	Giải thích
console.log(specs)	ReferenceError	Không có biến specs sau destructuring
updated.price	23990000	Spread ghi đè property
product.price	25990000	Object gốc không bị mutate
product.specs.ram sau khi copy.specs.ram = 16	16	Shallow copy - cùng tham chiếu
PHẦN C — SUY LUẬN (20 điểm)
Câu C1 (10đ) — Refactor Code
Code gốc (20+ dòng, khó đọc):
javascript
function processOrders(orders) {
    var result = [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].status === "completed") {
            if (orders[i].total > 100000) {
                var item = {};
                item.id = orders[i].id;
                item.customer = orders[i].customer;
                item.total = orders[i].total;
                item.discount = orders[i].total * 0.1;
                item.finalTotal = orders[i].total - item.discount;
                result.push(item);
            }
        }
    }
    // Bubble sort (O(n²))
    for (var j = 0; j < result.length; j++) {
        for (var k = j + 1; k < result.length; k++) {
            if (result[j].finalTotal < result[k].finalTotal) {
                var temp = result[j];
                result[j] = result[k];
                result[k] = temp;
            }
        }
    }
    return result;
}
Code sau refactor (8 dòng - giảm 60% số dòng):
javascript
const processOrders = (orders) => orders
    .filter(order => order.status === "completed" && order.total > 100000)
    .map(({ id, customer, total }) => ({
        id,
        customer,
        total,
        discount: total * 0.1,
        finalTotal: total * 0.9
    }))
    .sort((a, b) => b.finalTotal - a.finalTotal);
Các cải tiến chi tiết:
Khía cạnh	Code cũ	Code mới	Lợi ích
Số dòng code	20+ dòng	8 dòng	Dễ bảo trì hơn
Độ phức tạp	O(n²) do bubble sort	O(n log n) do sort()	Nhanh hơn với mảng lớn
Biến tạm	result, item, i, j, k, temp	Không có	Tránh lỗi scope
Vòng lặp	for manual	filter/map/sort chain	Declarative, dễ đọc
Mutation	Mutate result array	Immutable operations	An toàn hơn
Destructuring	orders[i].total	{ total }	Code ngắn gọn
Object shorthand	{ id: id }	{ id }	ES6+ hiện đại
Logic tính discount	total * 0.1	total * 0.1	Giữ nguyên nhưng ngắn hơn
Ví dụ chạy thử:
javascript
// Dữ liệu mẫu
const orders = [
    { id: 1, customer: "An", status: "completed", total: 200000 },
    { id: 2, customer: "Bình", status: "pending", total: 50000 },
    { id: 3, customer: "Chi", status: "completed", total: 150000 },
    { id: 4, customer: "Dũng", status: "completed", total: 300000 },
    { id: 5, customer: "Em", status: "completed", total: 80000 }
];

console.log(processOrders(orders));
// Kết quả:
// [
//   { id: 4, customer: "Dũng", total: 300000, discount: 30000, finalTotal: 270000 },
//   { id: 1, customer: "An", total: 200000, discount: 20000, finalTotal: 180000 },
//   { id: 3, customer: "Chi", total: 150000, discount: 15000, finalTotal: 135000 }
// ]
Giải thích từng bước:
javascript
// Bước 1: Lọc đơn hàng hoàn thành và > 100k
.filter(order => order.status === "completed" && order.total > 100000)

// Bước 2: Transform mỗi order thành object mới với các tính toán
.map(({ id, customer, total }) => ({  // Destructuring ngay trong parameter
    id,           // Shorthand property
    customer,     // Shorthand property  
    total,        // Shorthand property
    discount: total * 0.1,
    finalTotal: total * 0.9
}))

// Bước 3: Sắp xếp giảm dần theo finalTotal
.sort((a, b) => b.finalTotal - a.finalTotal)
Câu C2 (10đ) — Thiết kế API miniArray
javascript
const miniArray = {
    /**
     * map(arr, fn) - Tạo mảng mới bằng cách áp dụng fn lên từng phần tử
     * @param {Array} arr - Mảng đầu vào
     * @param {Function} fn - Hàm biến đổi (phần tử, index, mảng)
     * @returns {Array} Mảng mới đã biến đổi
     */
    map(arr, fn) {
        if (!Array.isArray(arr)) throw new Error("Tham số đầu phải là mảng");
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            result.push(fn(arr[i], i, arr));
        }
        return result;
    },
    
    /**
     * filter(arr, fn) - Lọc các phần tử thỏa mãn điều kiện fn
     * @param {Array} arr - Mảng đầu vào
     * @param {Function} fn - Hàm điều kiện (phần tử, index, mảng) → boolean
     * @returns {Array} Mảng mới chứa phần tử thỏa mãn
     */
    filter(arr, fn) {
        if (!Array.isArray(arr)) throw new Error("Tham số đầu phải là mảng");
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            if (fn(arr[i], i, arr)) {
                result.push(arr[i]);
            }
        }
        return result;
    },
    
    /**
     * reduce(arr, fn, initialValue) - Tích lũy giá trị qua từng phần tử
     * @param {Array} arr - Mảng đầu vào
     * @param {Function} fn - Hàm tích lũy (accumulator, current, index, mảng)
     * @param {*} initialValue - Giá trị khởi tạo (optional)
     * @returns {*} Giá trị tích lũy cuối cùng
     */
    reduce(arr, fn, initialValue) {
        if (!Array.isArray(arr)) throw new Error("Tham số đầu phải là mảng");
        if (arr.length === 0 && initialValue === undefined) {
            throw new Error("Reduce của mảng rỗng cần initialValue");
        }
        
        let accumulator = initialValue !== undefined ? initialValue : arr[0];
        let startIndex = initialValue !== undefined ? 0 : 1;
        
        for (let i = startIndex; i < arr.length; i++) {
            accumulator = fn(accumulator, arr[i], i, arr);
        }
        return accumulator;
    }
};

// === KIỂM THỬ TOÀN DIỆN ===
console.log("=== TEST MINIARRAY ===\n");

// Test 1: map
console.log("1. Test map:");
console.log(miniArray.map([1, 2, 3], x => x * 2));        // [2, 4, 6]
console.log(miniArray.map([1, 2, 3], (x, i) => x + i));   // [1, 3, 5]
console.log(miniArray.map([], x => x * 2));                // []

// Test 2: filter
console.log("\n2. Test filter:");
console.log(miniArray.filter([1, 2, 3, 4], x => x > 2));    // [3, 4]
console.log(miniArray.filter([1, 2, 3, 4], (x, i) => i % 2 === 0)); // [1, 3]
console.log(miniArray.filter([], x => x > 0));               // []

// Test 3: reduce
console.log("\n3. Test reduce:");
console.log(miniArray.reduce([1, 2, 3, 4], (a, b) => a + b, 0)); // 10
console.log(miniArray.reduce([1, 2, 3, 4], (a, b) => a + b));     // 10 (không initialValue)
console.log(miniArray.reduce([5, 10, 15], (a, b) => a * b, 1));    // 750
console.log(miniArray.reduce([1, 2, 3, 4], (a, b) => a * b));      // 24

// Test 4: Edge cases
console.log("\n4. Test edge cases:");
console.log(miniArray.map(["a", "b", "c"], x => x.toUpperCase())); // ["A", "B", "C"]
console.log(miniArray.filter([0, 1, false, 2, "", 3], Boolean));    // [1, 2, 3]
console.log(miniArray.reduce(["x", "y", "z"], (acc, cur) => acc + cur, "Letter: ")); // "Letter: xyz"

// Test 5: So sánh với built-in methods
console.log("\n5. So sánh với built-in:");
const testArr = [1, 2, 3, 4, 5];
console.log("Built-in map:", testArr.map(x => x * 3));
console.log("miniArray map:", miniArray.map(testArr, x => x * 3));
console.log("Built-in filter:", testArr.filter(x => x % 2 === 0));
console.log("miniArray filter:", miniArray.filter(testArr, x => x % 2 === 0));
console.log("Built-in reduce:", testArr.reduce((a, b) => a + b, 0));
console.log("miniArray reduce:", miniArray.reduce(testArr, (a, b) => a + b, 0));
Giải thích implementation:
1. map() - Biến đổi mảng
javascript
// Cách hoạt động:
map([1, 2, 3], x => x * 2)
// Bước 1: result = []
// Bước 2: fn(1, 0, arr) = 2 → push → [2]
// Bước 3: fn(2, 1, arr) = 4 → push → [2, 4]
// Bước 4: fn(3, 2, arr) = 6 → push → [2, 4, 6]
2. filter() - Lọc mảng
javascript
// Cách hoạt động:
filter([1, 2, 3, 4], x => x > 2)
// Bước 1: result = []
// Bước 2: 1 > 2? false → skip
// Bước 3: 2 > 2? false → skip
// Bước 4: 3 > 2? true → push 3 → [3]
// Bước 5: 4 > 2? true → push 4 → [3, 4]
3. reduce() - Tích lũy
javascript
// Cách hoạt động (có initialValue):
reduce([1, 2, 3], (a, b) => a + b, 0)
// Bước 1: acc = 0, startIndex = 0
// Bước 2: acc = fn(0, 1) = 1
// Bước 3: acc = fn(1, 2) = 3
// Bước 4: acc = fn(3, 3) = 6

// Cách hoạt động (không initialValue):
reduce([1, 2, 3], (a, b) => a + b)
// Bước 1: acc = arr[0] = 1, startIndex = 1
// Bước 2: acc = fn(1, 2) = 3
// Bước 3: acc = fn(3, 3) = 6
Xử lý edge cases:
javascript
// Mảng rỗng
miniArray.map([], x => x * 2)        // [] ✅
miniArray.filter([], x => x > 0)     // [] ✅
miniArray.reduce([], (a,b) => a+b)   // ❌ Error (cần initialValue)
miniArray.reduce([], (a,b) => a+b, 0) // 0 ✅

// Kiểm tra tham số
miniArray.map("not array", x => x)   // ❌ Error
