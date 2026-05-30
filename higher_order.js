/**
 * HIGHER-ORDER FUNCTIONS CHALLENGE
 * Bài B3 - Phiếu bài tập 08
 * Các hàm higher-order: pipe, memoize, debounce, retry
 */

/**
 * 1. pipe() - Nối chuỗi functions
 * Nhận vào nhiều hàm, trả về hàm mới thực thi tuần tự
 * @param {...Function} fns - Các hàm cần nối
 * @returns {Function} Hàm đã được pipe
 */
function pipe(...fns) {
    // Kiểm tra tất cả tham số đều là function
    if (!fns.every(fn => typeof fn === 'function')) {
        throw new Error('Tất cả tham số phải là function');
    }
    
    return function(value) {
        return fns.reduce((acc, fn) => fn(acc), value);
    };
}

/**
 * 2. memoize() - Cache kết quả
 * Lưu trữ kết quả của hàm để tránh tính toán lại
 * @param {Function} fn - Hàm cần memoize
 * @returns {Function} Hàm đã được memoize
 */
function memoize(fn) {
    if (typeof fn !== 'function') {
        throw new Error('Tham số phải là function');
    }
    
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            console.log(`📦 Memoize: Lấy từ cache cho key: ${key}`);
            return cache.get(key);
        }
        
        console.log(`⚙️ Memoize: Tính toán mới cho key: ${key}`);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}

/**
 * 3. debounce() - Chờ user ngừng gõ mới thực hiện
 * @param {Function} fn - Hàm cần debounce
 * @param {number} delay - Thời gian chờ (ms)
 * @returns {Function} Hàm đã được debounce
 */
function debounce(fn, delay) {
    if (typeof fn !== 'function') {
        throw new Error('Tham số đầu phải là function');
    }
    if (typeof delay !== 'number' || delay < 0) {
        throw new Error('Delay phải là số không âm');
    }
    
    let timer;
    
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            console.log(`⏰ Debounce: Thực thi sau ${delay}ms`);
            fn(...args);
        }, delay);
    };
}

/**
 * 4. retry() - Thử lại nếu lỗi
 * @param {Function} fn - Hàm async cần thử lại
 * @param {number} maxAttempts - Số lần thử tối đa
 * @returns {Promise} Kết quả của hàm
 */
async function retry(fn, maxAttempts = 3) {
    if (typeof fn !== 'function') {
        throw new Error('Tham số đầu phải là function');
    }
    if (typeof maxAttempts !== 'number' || maxAttempts < 1) {
        throw new Error('maxAttempts phải là số >= 1');
    }
    
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`🔄 Retry: Lần thử ${attempt}/${maxAttempts}`);
            const result = await fn();
            console.log(`✅ Retry: Thành công ở lần thử ${attempt}`);
            return result;
        } catch (error) {
            lastError = error;
            console.log(`❌ Retry: Lần thử ${attempt} thất bại: ${error.message}`);
            
            if (attempt === maxAttempts) {
                console.log(`💀 Retry: Đã thử ${maxAttempts} lần, tất cả đều thất bại`);
                throw lastError;
            }
            
            // Chờ 1s trước khi thử lại (tránh spam)
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// ==================== CÁC HÀM TIỆN ÍCH BỔ SUNG ====================

/**
 * 5. compose() - Ngược với pipe (thực thi từ phải sang trái)
 * @param {...Function} fns - Các hàm cần compose
 * @returns {Function} Hàm đã được compose
 */
function compose(...fns) {
    return pipe(...fns.reverse());
}

/**
 * 6. throttle() - Giới hạn số lần gọi hàm trong khoảng thời gian
 * @param {Function} fn - Hàm cần throttle
 * @param {number} limit - Thời gian giới hạn (ms)
 * @returns {Function} Hàm đã được throttle
 */
function throttle(fn, limit) {
    let inThrottle = false;
    
    return function(...args) {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

/**
 * 7. once() - Chỉ cho phép gọi hàm một lần duy nhất
 * @param {Function} fn - Hàm cần giới hạn
 * @returns {Function} Hàm chỉ chạy một lần
 */
function once(fn) {
    let called = false;
    let result;
    
    return function(...args) {
        if (!called) {
            called = true;
            result = fn(...args);
            return result;
        }
        console.log('⚠️ Once: Hàm này chỉ được gọi một lần!');
        return result;
    };
}

// ==================== DEMO & TEST ====================

console.log("\n" + "=".repeat(70));
console.log("🎯 HIGHER-ORDER FUNCTIONS DEMO");
console.log("=".repeat(70));

// ==================== TEST 1: PIPE ====================
console.log("\n📌 TEST 1: pipe() - Nối chuỗi functions");
console.log("-".repeat(50));

const processNumber = pipe(
    x => x * 2,           // 5 → 10
    x => x + 10,          // 10 → 20
    x => x.toString(),    // 20 → "20"
    x => `Kết quả: ${x}`  // "20" → "Kết quả: 20"
);

console.log(`processNumber(5) = ${processNumber(5)}`);
// Expected: "Kết quả: 20"

const calculatePrice = pipe(
    price => price * 0.9,           // Giảm 10%
    price => price * 1.1,           // Thêm VAT 10%
    price => Math.round(price),     // Làm tròn
    price => price.toLocaleString('vi-VN') + 'đ'  // Format
);

console.log(`Giá sau thuế của 1.000.000đ: ${calculatePrice(1000000)}`);
// Expected: 990.000đ

// Test pipe với nhiều hàm
const mathChain = pipe(
    x => x + 1,
    x => x * 2,
    x => x - 3,
    x => x / 2
);
console.log(`mathChain(5) = ${mathChain(5)}`); // ((5+1)*2-3)/2 = 4.5

// ==================== TEST 2: MEMOIZE ====================
console.log("\n📌 TEST 2: memoize() - Cache kết quả");
console.log("-".repeat(50));

// Hàm tính toán nặng
const factorial = memoize((n) => {
    if (n < 0) throw new Error('n phải >= 0');
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
});

console.log(`factorial(5) = ${factorial(5)}`);  // Tính toán mới
console.log(`factorial(5) = ${factorial(5)}`);  // Lấy từ cache
console.log(`factorial(6) = ${factorial(6)}`);  // Tính toán mới
console.log(`factorial(5) = ${factorial(5)}`);  // Lấy từ cache (vẫn còn)

// Memoize với nhiều tham số
const sum = memoize((a, b) => {
    console.log(`  Tính tổng ${a} + ${b}`);
    return a + b;
});

console.log(`sum(1, 2) = ${sum(1, 2)}`);
console.log(`sum(1, 2) = ${sum(1, 2)}`); // Lấy từ cache
console.log(`sum(2, 3) = ${sum(2, 3)}`); // Tính mới

// ==================== TEST 3: DEBOUNCE ====================
console.log("\n📌 TEST 3: debounce() - Chờ ngừng gõ");
console.log("-".repeat(50));

const searchAPI = debounce((query) => {
    console.log(`🔍 Đang tìm kiếm: "${query}"`);
    console.log(`   Kết quả tìm thấy cho "${query}" (simulated)`);
}, 1000);

console.log("User đang gõ: 'a'");
searchAPI("a");
setTimeout(() => {
    console.log("User đang gõ: 'ap'");
    searchAPI("ap");
}, 200);
setTimeout(() => {
    console.log("User đang gõ: 'app'");
    searchAPI("app");
}, 400);
setTimeout(() => {
    console.log("User đang gõ: 'appl'");
    searchAPI("appl");
}, 600);
setTimeout(() => {
    console.log("User đang gõ: 'apple'");
    searchAPI("apple");
}, 800);

setTimeout(() => {
    console.log("\n⏰ Sau 1.5 giây, chỉ 'apple' mới được tìm kiếm!");
}, 2000);

// ==================== TEST 4: RETRY ====================
console.log("\n📌 TEST 4: retry() - Thử lại khi lỗi");
console.log("-".repeat(50));

// Hàm giả lập API không ổn định
let attemptCount = 0;
const unstableAPI = async () => {
    attemptCount++;
    if (attemptCount < 3) {
        throw new Error(`Lỗi lần thử ${attemptCount}`);
    }
    return `Thành công sau ${attemptCount} lần thử!`;
};

// Reset counter cho test
attemptCount = 0;
console.log("\n📱 Test API không ổn định (sẽ thành công ở lần thứ 3):");
retry(unstableAPI, 5)
    .then(result => console.log(`🎉 Kết quả: ${result}`))
    .catch(error => console.log(`💥 Thất bại: ${error.message}`));

// Test với API luôn lỗi
let failCount = 0;
const alwaysFailAPI = async () => {
    failCount++;
    throw new Error(`Luôn lỗi ở lần thử ${failCount}`);
};

console.log("\n📱 Test API luôn lỗi (sẽ thất bại sau 3 lần):");
setTimeout(() => {
    failCount = 0;
    retry(alwaysFailAPI, 3)
        .then(result => console.log(`🎉 Kết quả: ${result}`))
        .catch(error => console.log(`💥 Thất bại sau 3 lần: ${error.message}`));
}, 4000);

// ==================== TEST 5: COMPOSE ====================
console.log("\n📌 TEST 5: compose() - Ngược với pipe");
console.log("-".repeat(50));

const add2 = x => x + 2;
const multiply3 = x => x * 3;
const subtract5 = x => x - 5;

const composed = compose(
    subtract5,  // Chạy cuối
    multiply3,  // Chạy giữa
    add2        // Chạy đầu
);

console.log(`composed(10) = ${composed(10)}`); 
// add2(10) = 12 → multiply3(12) = 36 → subtract5(36) = 31

const pipeVersion = pipe(add2, multiply3, subtract5);
console.log(`pipe(10) = ${pipeVersion(10)}`); // Kết quả giống nhau

// ==================== TEST 6: THROTTLE ====================
console.log("\n📌 TEST 6: throttle() - Giới hạn tần suất gọi");
console.log("-".repeat(50));

const logScroll = throttle((position) => {
    console.log(`📜 Scroll vị trí: ${position}`);
}, 2000);

console.log("User scroll nhanh trong 3 giây:");
logScroll(100);
logScroll(200);
logScroll(300);
setTimeout(() => logScroll(400), 500);
setTimeout(() => logScroll(500), 1000);
setTimeout(() => logScroll(600), 1500);
setTimeout(() => logScroll(700), 2500); // Lần này mới được gọi lại

// ==================== TEST 7: ONCE ====================
console.log("\n📌 TEST 7: once() - Chỉ gọi một lần");
console.log("-".repeat(50));

const initializeApp = once(() => {
    console.log("🚀 Khởi tạo ứng dụng...");
    return { status: "initialized", timestamp: Date.now() };
});

console.log(initializeApp()); // Chạy lần đầu
console.log(initializeApp()); // Không chạy, trả về kết quả cũ
console.log(initializeApp()); // Vẫn không chạy

// ==================== TEST 8: KẾT HỢP CÁC HIGHER-ORDER FUNCTIONS ====================
console.log("\n📌 TEST 8: Kết hợp các higher-order functions");
console.log("-".repeat(50));

// Kết hợp memoize + debounce
const expensiveSearch = memoize((query) => {
    console.log(`  🔍 Tìm kiếm đắt đỏ cho: ${query}`);
    return `Kết quả cho ${query}`;
});

const debouncedSearch = debounce((query) => {
    const result = expensiveSearch(query);
    console.log(`  📝 ${result}`);
}, 500);

console.log("Gõ 'javascript' nhiều lần (debounce + memoize):");
debouncedSearch("javascript");
debouncedSearch("javascript");
debouncedSearch("javascript");
setTimeout(() => {
    debouncedSearch("javascript");
    console.log("  ✅ Chỉ tính toán 1 lần (memoize) + debounce");
}, 600);

// ==================== TEST 9: ERROR HANDLING ====================
console.log("\n📌 TEST 9: Error handling");
console.log("-".repeat(50));

try {
    pipe(1, 2, 3); // Sẽ throw error
} catch (error) {
    console.log(`✅ pipe bắt lỗi: ${error.message}`);
}

try {
    const badMemoize = memoize(123);
} catch (error) {
    console.log(`✅ memoize bắt lỗi: ${error.message}`);
}

// ==================== PERFORMANCE COMPARISON ====================
console.log("\n📌 TEST 10: So sánh hiệu năng với memoize");
console.log("-".repeat(50));

const fibonacci = memoize((n) => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});

console.time("Fibonacci không cache (lần đầu)");
console.log(`fibonacci(35) = ${fibonacci(35)}`);
console.timeEnd("Fibonacci không cache (lần đầu)");

console.time("Fibonacci có cache (lần 2)");
console.log(`fibonacci(35) = ${fibonacci(35)}`);
console.timeEnd("Fibonacci có cache (lần 2)");

// ==================== UTILITY FUNCTIONS ====================
console.log("\n" + "=".repeat(70));
console.log("📚 TỔNG KẾT CÁC HIGHER-ORDER FUNCTIONS");
console.log("=".repeat(70));

const summary = [
    { name: "pipe()", desc: "Nối chuỗi functions từ trái sang phải", example: "pipe(f1, f2, f3)(x)" },
    { name: "compose()", desc: "Nối chuỗi functions từ phải sang trái", example: "compose(f1, f2, f3)(x)" },
    { name: "memoize()", desc: "Cache kết quả hàm để tránh tính toán lại", example: "memoize(expensiveFunc)" },
    { name: "debounce()", desc: "Chờ ngừng gọi mới thực thi", example: "debounce(searchAPI, 500)" },
    { name: "throttle()", desc: "Giới hạn số lần gọi trong khoảng thời gian", example: "throttle(scrollHandler, 1000)" },
    { name: "once()", desc: "Chỉ cho phép gọi hàm một lần", example: "once(initFunction)" },
    { name: "retry()", desc: "Tự động thử lại khi hàm thất bại", example: "retry(apiCall, 3)" }
];

console.table(summary);

// ==================== EXPORT MODULE ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        pipe,
        compose,
        memoize,
        debounce,
        throttle,
        once,
        retry
    };
}

console.log("\n✅ HOÀN THÀNH DEMO HIGHER-ORDER FUNCTIONS!");
console.log("=".repeat(70) + "\n");