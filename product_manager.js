const products = [
    { id: 1, name: "iPhone 16", price: 25990000, category: "phone", stock: 15, rating: 4.5 },
    { id: 2, name: "MacBook Pro", price: 45990000, category: "laptop", stock: 8, rating: 4.8 },
    { id: 3, name: "AirPods Pro", price: 6990000, category: "accessory", stock: 50, rating: 4.3 },
    { id: 4, name: "iPad Air", price: 16990000, category: "tablet", stock: 0, rating: 4.6 },
    { id: 5, name: "Samsung S24", price: 22990000, category: "phone", stock: 20, rating: 4.4 },
    { id: 6, name: "Dell XPS 15", price: 35990000, category: "laptop", stock: 5, rating: 4.7 },
    { id: 7, name: "Galaxy Buds", price: 3490000, category: "accessory", stock: 100, rating: 4.1 },
    { id: 8, name: "Xiaomi Pad 6", price: 7990000, category: "tablet", stock: 25, rating: 4.2 },
    { id: 9, name: "Pixel 9", price: 19990000, category: "phone", stock: 12, rating: 4.6 },
    { id: 10, name: "ThinkPad X1", price: 32990000, category: "laptop", stock: 3, rating: 4.5 }
];

/**
 * 1. Lọc sản phẩm còn hàng (stock > 0)
 * @param {Array} products - Mảng sản phẩm
 * @returns {Array} Mảng sản phẩm còn hàng
 */
function getInStock(products) {
    return products.filter(product => product.stock > 0);
}

/**
 * 2. Lọc theo category VÀ khoảng giá
 * @param {Array} products - Mảng sản phẩm
 * @param {string} category - Danh mục sản phẩm
 * @param {number} minPrice - Giá tối thiểu
 * @param {number} maxPrice - Giá tối đa
 * @returns {Array} Mảng sản phẩm thỏa mãn
 */
function filterProducts(products, category, minPrice, maxPrice) {
    return products.filter(product => 
        product.category === category && 
        product.price >= minPrice && 
        product.price <= maxPrice
    );
}

/**
 * 3. Sắp xếp theo giá (tăng/giảm)
 * @param {Array} products - Mảng sản phẩm
 * @param {string} order - "asc" (tăng dần) hoặc "desc" (giảm dần)
 * @returns {Array} Mảng đã sắp xếp (không mutate gốc)
 */
function sortByPrice(products, order = "asc") {
    const sorted = [...products]; // Copy để không mutate gốc
    if (order === "asc") {
        return sorted.sort((a, b) => a.price - b.price);
    } else if (order === "desc") {
        return sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
}

/**
 * 4. Tìm sản phẩm rẻ nhất mỗi category
 * @param {Array} products - Mảng sản phẩm
 * @returns {Object} Object với key là category, value là sản phẩm rẻ nhất
 */
function cheapestByCategory(products) {
    // Lấy danh sách các category unique
    const categories = [...new Set(products.map(p => p.category))];
    
    // Với mỗi category, tìm sản phẩm có giá thấp nhất
    return categories.reduce((result, category) => {
        const productsInCategory = products.filter(p => p.category === category);
        const cheapest = productsInCategory.reduce((min, current) => 
            current.price < min.price ? current : min
        );
        result[category] = cheapest;
        return result;
    }, {});
}

/**
 * 5. Tính tổng giá trị kho (price × stock cho mỗi SP)
 * @param {Array} products - Mảng sản phẩm
 * @returns {number} Tổng giá trị kho
 */
function totalInventoryValue(products) {
    return products.reduce((total, product) => {
        return total + (product.price * product.stock);
    }, 0);
}

/**
 * 6. Tạo mảng chỉ chứa { name, formattedPrice }
 * @param {Array} products - Mảng sản phẩm
 * @returns {Array} Mảng object với name và formattedPrice
 */
function formatProductList(products) {
    return products.map(product => ({
        name: product.name,
        formattedPrice: product.price.toLocaleString('vi-VN') + 'đ'
    }));
}

/**
 * 7. Tính rating trung bình toàn bộ
 * @param {Array} products - Mảng sản phẩm
 * @returns {number} Rating trung bình (làm tròn 2 chữ số)
 */
function averageRating(products) {
    const sum = products.reduce((total, product) => total + product.rating, 0);
    return Number((sum / products.length).toFixed(2));
}

/**
 * 8. Tìm sản phẩm theo keyword (tìm trong name, case-insensitive)
 * @param {Array} products - Mảng sản phẩm
 * @param {string} keyword - Từ khóa tìm kiếm
 * @returns {Array} Mảng sản phẩm tìm được
 */
function searchProducts(products, keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(lowerKeyword)
    );
}

// ==================== HÀM HIỂN THỊ (FORMAT) ====================

/**
 * Hiển thị sản phẩm dạng bảng đẹp
 * @param {Array} products - Mảng sản phẩm
 * @param {string} title - Tiêu đề bảng
 */
function printTable(products, title = "DANH SÁCH SẢN PHẨM") {
    console.log("\n" + "=".repeat(80));
    console.log(`📦 ${title}`);
    console.log("=".repeat(80));
    console.log("│ ID │ Tên sản phẩm               │ Giá         │ Danh mục   │ Tồn kho │ Đánh giá │");
    console.log("├────┼────────────────────────────┼─────────────┼────────────┼─────────┼──────────┤");
    
    products.forEach(p => {
        const priceStr = p.price.toLocaleString('vi-VN').padStart(11);
        console.log(`│ ${p.id.toString().padEnd(2)} │ ${p.name.padEnd(26)} │ ${priceStr} │ ${p.category.padEnd(10)} │ ${p.stock.toString().padEnd(7)} │ ${p.rating.toFixed(1).padEnd(6)} │`);
    });
    console.log("=".repeat(80));
}

/**
 * Định dạng số tiền
 * @param {number} price - Giá tiền
 * @returns {string} Chuỗi đã định dạng
 */
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

// ==================== TEST & DEMO ====================

console.log("\n🛒 CHƯƠNG TRÌNH QUẢN LÝ SẢN PHẨM");
console.log("=".repeat(60));

// Test 1: Sản phẩm còn hàng
console.log("\n📋 1. SẢN PHẨM CÒN HÀNG:");
const inStock = getInStock(products);
console.log(`Tìm thấy ${inStock.length} sản phẩm còn hàng:`);
printTable(inStock, "SẢN PHẨM CÒN HÀNG");

// Test 2: Lọc theo category và giá
console.log("\n📋 2. LỌC SẢN PHẨM (Phone, 15-25 triệu):");
const filtered = filterProducts(products, "phone", 15000000, 25000000);
console.log(`Tìm thấy ${filtered.length} sản phẩm:`);
filtered.forEach(p => {
    console.log(`   • ${p.name}: ${formatPrice(p.price)}`);
});

// Test 3: Sắp xếp theo giá tăng dần
console.log("\n📋 3. SẮP XẾP THEO GIÁ (TĂNG DẦN):");
const sortedAsc = sortByPrice(products, "asc");
sortedAsc.forEach((p, idx) => {
    console.log(`   ${idx + 1}. ${p.name.padEnd(20)} ${formatPrice(p.price)}`);
});

// Test 4: Sắp xếp theo giá giảm dần
console.log("\n📋 4. SẮP XẾP THEO GIÁ (GIẢM DẦN):");
const sortedDesc = sortByPrice(products, "desc");
sortedDesc.forEach((p, idx) => {
    console.log(`   ${idx + 1}. ${p.name.padEnd(20)} ${formatPrice(p.price)}`);
});

// Test 5: Sản phẩm rẻ nhất theo từng category
console.log("\n📋 5. SẢN PHẨM RẺ NHẤT THEO CATEGORY:");
const cheapest = cheapestByCategory(products);
Object.entries(cheapest).forEach(([category, product]) => {
    console.log(`   • ${category.padEnd(10)}: ${product.name} - ${formatPrice(product.price)}`);
});

// Test 6: Tổng giá trị kho
console.log("\n📋 6. TỔNG GIÁ TRỊ KHO:");
const totalValue = totalInventoryValue(products);
console.log(`   💰 Tổng giá trị tồn kho: ${formatPrice(totalValue)}`);
console.log(`   📊 Chi tiết từng sản phẩm:`);
products.forEach(p => {
    const value = p.price * p.stock;
    if (p.stock > 0) {
        console.log(`      • ${p.name.padEnd(20)}: ${formatPrice(value)} (${p.stock} x ${formatPrice(p.price)})`);
    }
});

// Test 7: Format product list
console.log("\n📋 7. DANH SÁCH SẢN PHẨM ĐÃ FORMAT:");
const formattedList = formatProductList(products);
formattedList.forEach((item, idx) => {
    console.log(`   ${idx + 1}. ${item.name.padEnd(25)} → ${item.formattedPrice}`);
});

// Test 8: Rating trung bình
console.log("\n📋 8. ĐÁNH GIÁ TRUNG BÌNH:");
const avgRating = averageRating(products);
console.log(`   ⭐ Rating trung bình toàn bộ sản phẩm: ${avgRating}/5.0`);
console.log(`   📝 Chi tiết rating:`);
const sortedByRating = [...products].sort((a, b) => b.rating - a.rating);
sortedByRating.forEach(p => {
    const stars = "⭐".repeat(Math.floor(p.rating));
    console.log(`      • ${p.name.padEnd(20)}: ${p.rating}/5.0 ${stars}`);
});

// Test 9: Tìm kiếm sản phẩm
console.log("\n📋 9. TÌM KIẾM SẢN PHẨM:");
const searchKeyword = "pro";
const searchResults = searchProducts(products, searchKeyword);
console.log(`   🔍 Từ khóa "${searchKeyword}": Tìm thấy ${searchResults.length} sản phẩm`);
searchResults.forEach(p => {
    console.log(`      • ${p.name} - ${formatPrice(p.price)} (${p.category})`);
});

// Test 10: Thống kê theo category
console.log("\n📋 10. THỐNG KÊ THEO CATEGORY:");
const stats = products.reduce((acc, p) => {
    if (!acc[p.category]) {
        acc[p.category] = { count: 0, totalStock: 0, totalValue: 0 };
    }
    acc[p.category].count++;
    acc[p.category].totalStock += p.stock;
    acc[p.category].totalValue += p.price * p.stock;
    return acc;
}, {});

Object.entries(stats).forEach(([category, data]) => {
    console.log(`   📁 ${category.toUpperCase()}:`);
    console.log(`      • Số lượng SP: ${data.count}`);
    console.log(`      • Tổng tồn kho: ${data.totalStock}`);
    console.log(`      • Tổng giá trị: ${formatPrice(data.totalValue)}`);
});

// ==================== EXPORT MODULE ====================
// Export để dùng ở các file khác (nếu cần)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getInStock,
        filterProducts,
        sortByPrice,
        cheapestByCategory,
        totalInventoryValue,
        formatProductList,
        averageRating,
        searchProducts,
        products // export mảng gốc để dùng
    };
}

console.log("\n✅ HOÀN THÀNH TẤT CẢ CÁC TEST!");
console.log("=".repeat(60) + "\n");