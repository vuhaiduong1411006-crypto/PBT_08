/**
 * SHOPPING CART MODULE - GIỎ HÀNG E-COMMERCE
 * Bài B2 - Phiếu bài tập 08
 * Sử dụng Closure Pattern để tạo private data
 */

/**
 * Tạo giỏ hàng mới với Closure pattern
 * @returns {Object} Các phương thức quản lý giỏ hàng
 */
function createCart() {
    // Private data - chỉ có thể truy cập qua closure
    let items = [];
    let currentDiscount = null;
    let discountAmount = 0;
    
    /**
     * Định dạng giá tiền theo chuẩn Việt Nam
     * @param {number} price - Giá tiền
     * @returns {string} Chuỗi đã định dạng
     */
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + 'đ';
    };
    
    /**
     * Áp dụng mã giảm giá cho tổng tiền
     * @param {number} total - Tổng tiền trước giảm giá
     * @returns {number} Tổng tiền sau giảm giá
     */
    const applyDiscountToTotal = (total) => {
        if (currentDiscount === "SALE10") {
            discountAmount = total * 0.1;
            return total * 0.9;
        }
        if (currentDiscount === "SALE20") {
            discountAmount = total * 0.2;
            return total * 0.8;
        }
        if (currentDiscount === "FREESHIP") {
            discountAmount = Math.min(30000, total);
            return Math.max(0, total - 30000);
        }
        discountAmount = 0;
        return total;
    };
    
    /**
     * Tìm kiếm item trong giỏ hàng theo productId
     * @param {number} productId - ID sản phẩm
     * @returns {Object|undefined} Item tìm thấy hoặc undefined
     */
    const findItem = (productId) => {
        return items.find(item => item.product.id === productId);
    };
    
    // Public API - trả về object với các methods
    return {
        /**
         * Thêm sản phẩm vào giỏ hàng
         * Nếu sản phẩm đã có → tăng số lượng
         * @param {Object} product - Sản phẩm cần thêm { id, name, price }
         * @param {number} quantity - Số lượng (mặc định = 1)
         */
        addItem(product, quantity = 1) {
            if (!product || !product.id) {
                console.error("❌ Sản phẩm không hợp lệ!");
                return;
            }
            if (quantity <= 0) {
                console.error("❌ Số lượng phải lớn hơn 0!");
                return;
            }
            
            const existing = findItem(product.id);
            if (existing) {
                existing.quantity += quantity;
                console.log(`✅ Đã cập nhật ${product.name}: tăng lên ${existing.quantity}`);
            } else {
                items.push({ 
                    product: { ...product }, // Shallow copy để tránh mutation
                    quantity 
                });
                console.log(`✅ Đã thêm ${product.name} x${quantity} vào giỏ hàng`);
            }
        },
        
        /**
         * Xóa sản phẩm khỏi giỏ hàng theo id
         * @param {number} productId - ID sản phẩm cần xóa
         */
        removeItem(productId) {
            const index = items.findIndex(item => item.product.id === productId);
            if (index !== -1) {
                const removed = items[index];
                items.splice(index, 1);
                console.log(`🗑️ Đã xóa ${removed.product.name} khỏi giỏ hàng`);
            } else {
                console.log(`⚠️ Không tìm thấy sản phẩm với ID: ${productId}`);
            }
        },
        
        /**
         * Cập nhật số lượng sản phẩm
         * @param {number} productId - ID sản phẩm
         * @param {number} newQuantity - Số lượng mới (nếu <= 0 sẽ xóa)
         */
        updateQuantity(productId, newQuantity) {
            const item = findItem(productId);
            if (!item) {
                console.log(`⚠️ Không tìm thấy sản phẩm với ID: ${productId}`);
                return;
            }
            
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                const oldQuantity = item.quantity;
                item.quantity = newQuantity;
                console.log(`🔄 Đã cập nhật ${item.product.name}: ${oldQuantity} → ${newQuantity}`);
            }
        },
        
        /**
         * Tính tổng tiền giỏ hàng (đã áp dụng giảm giá)
         * @returns {number} Tổng tiền sau giảm giá
         */
        getTotal() {
            const subtotal = items.reduce((sum, item) => {
                return sum + (item.product.price * item.quantity);
            }, 0);
            return applyDiscountToTotal(subtotal);
        },
        
        /**
         * Lấy tổng tiền trước giảm giá
         * @returns {number} Tổng tiền gốc
         */
        getSubtotal() {
            return items.reduce((sum, item) => {
                return sum + (item.product.price * item.quantity);
            }, 0);
        },
        
        /**
         * Áp dụng mã giảm giá
         * @param {string} code - Mã giảm giá (SALE10, SALE20, FREESHIP)
         */
        applyDiscount(code) {
            const validCodes = ["SALE10", "SALE20", "FREESHIP"];
            if (validCodes.includes(code)) {
                currentDiscount = code;
                console.log(`🎉 Đã áp dụng mã giảm giá: ${code}`);
                this.printDiscountInfo();
            } else {
                console.log(`❌ Mã giảm giá "${code}" không hợp lệ!`);
                console.log(`   Mã hợp lệ: ${validCodes.join(", ")}`);
            }
        },
        
        /**
         * Xóa mã giảm giá đang áp dụng
         */
        removeDiscount() {
            if (currentDiscount) {
                console.log(`🗑️ Đã xóa mã giảm giá: ${currentDiscount}`);
                currentDiscount = null;
                discountAmount = 0;
            } else {
                console.log("⚠️ Không có mã giảm giá nào đang áp dụng!");
            }
        },
        
        /**
         * Hiển thị thông tin giảm giá
         */
        printDiscountInfo() {
            if (currentDiscount) {
                const subtotal = this.getSubtotal();
                const finalTotal = this.getTotal();
                const saved = subtotal - finalTotal;
                console.log(`   💰 Tiết kiệm: ${formatPrice(saved)}`);
                console.log(`   🏷️ Mã: ${currentDiscount}`);
            }
        },
        
        /**
         * In giỏ hàng dạng bảng đẹp
         */
        printCart() {
            if (items.length === 0) {
                console.log("\n🛒 Giỏ hàng trống!");
                console.log("═".repeat(60));
                return;
            }
            
            const subtotal = this.getSubtotal();
            const total = this.getTotal();
            const itemCount = this.getItemCount();
            
            console.log("\n" + "═".repeat(70));
            console.log("🛒 GIỎ HÀNG CỦA BẠN");
            console.log("═".repeat(70));
            console.log("│ # │ Tên sản phẩm                 │ SL │ Đơn giá       │ Thành tiền      │");
            console.log("├───┼──────────────────────────────┼────┼───────────────┼─────────────────┤");
            
            items.forEach((item, idx) => {
                const totalPrice = item.product.price * item.quantity;
                const nameDisplay = item.product.name.length > 28 
                    ? item.product.name.slice(0, 25) + "..." 
                    : item.product.name.padEnd(28);
                
                console.log(`│ ${(idx+1).toString().padEnd(2)} │ ${nameDisplay} │ ${item.quantity.toString().padEnd(2)} │ ${formatPrice(item.product.price).padStart(13)} │ ${formatPrice(totalPrice).padStart(15)} │`);
            });
            
            console.log("├───┴──────────────────────────────┴────┴───────────────┴─────────────────┤");
            
            if (currentDiscount) {
                console.log(`│ 💰 Tạm tính:                                      ${formatPrice(subtotal).padStart(15)} │`);
                console.log(`│ 🏷️ Giảm giá (${currentDiscount}):                        -${formatPrice(discountAmount).padStart(13)} │`);
                console.log("├─────────────────────────────────────────────────────────────────────┤");
            }
            
            console.log(`│ ✅ Tổng cộng:                                       ${formatPrice(total).padStart(15)} │`);
            console.log(`│ 📦 Tổng số sản phẩm: ${itemCount.toString().padStart(44)} │`);
            console.log("═".repeat(70));
        },
        
        /**
         * Lấy tổng số lượng sản phẩm (tổng quantity)
         * @returns {number} Tổng số lượng sản phẩm
         */
        getItemCount() {
            return items.reduce((sum, item) => sum + item.quantity, 0);
        },
        
        /**
         * Lấy số lượng mặt hàng khác nhau
         * @returns {number} Số loại sản phẩm
         */
        getUniqueItemCount() {
            return items.length;
        },
        
        /**
         * Xóa toàn bộ giỏ hàng
         */
        clearCart() {
            items = [];
            currentDiscount = null;
            discountAmount = 0;
            console.log("🗑️ Đã xóa toàn bộ giỏ hàng!");
        },
        
        /**
         * Lấy thông tin chi tiết giỏ hàng (debug)
         * @returns {Object} Thông tin giỏ hàng
         */
        getCartInfo() {
            return {
                items: items.map(item => ({
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    total: item.product.price * item.quantity
                })),
                subtotal: this.getSubtotal(),
                discount: currentDiscount,
                discountAmount: discountAmount,
                total: this.getTotal(),
                itemCount: this.getItemCount(),
                uniqueItems: this.getUniqueItemCount()
            };
        },
        
        /**
         * Kiểm tra giỏ hàng có trống không
         * @returns {boolean}
         */
        isEmpty() {
            return items.length === 0;
        }
    };
}

// ==================== DEMO & TEST ====================

console.log("\n" + "=".repeat(70));
console.log("🛍️ DEMO GIỎ HÀNG SHOPPING CART");
console.log("=".repeat(70));

// Tạo giỏ hàng mới
const cart = createCart();

console.log("\n📌 PHẦN 1: THÊM SẢN PHẨM VÀO GIỎ");
console.log("-".repeat(70));

// Thêm sản phẩm
cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1);
cart.addItem({ id: 3, name: "AirPods Pro", price: 6990000 }, 2);
cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1); // Tăng số lượng

// In giỏ hàng sau khi thêm
cart.printCart();

console.log("\n📌 PHẦN 2: ÁP DỤNG MÃ GIẢM GIÁ");
console.log("-".repeat(70));

// Áp dụng mã giảm giá
cart.applyDiscount("SALE10");
cart.printCart();

console.log("\n📌 PHẦN 3: CẬP NHẬT SỐ LƯỢNG");
console.log("-".repeat(70));

// Cập nhật số lượng
cart.updateQuantity(3, 3); // AirPods từ 2 lên 3
cart.updateQuantity(1, 1); // iPhone từ 2 xuống 1
cart.printCart();

console.log("\n📌 PHẦN 4: THỬ CÁC MÃ GIẢM GIÁ KHÁC");
console.log("-".repeat(70));

// Thử mã giảm giá khác
cart.applyDiscount("SALE20");
cart.printCart();

// Thử FREESHIP
cart.applyDiscount("FREESHIP");
cart.printCart();

console.log("\n📌 PHẦN 5: XÓA SẢN PHẨM");
console.log("-".repeat(70));

// Xóa sản phẩm
cart.removeItem(3); // Xóa AirPods
console.log(`Tổng số sản phẩm sau khi xóa: ${cart.getItemCount()}`);
cart.printCart();

console.log("\n📌 PHẦN 6: THÊM SẢN PHẨM MỚI");
console.log("-".repeat(70));

// Thêm sản phẩm mới
cart.addItem({ id: 5, name: "Samsung S24", price: 22990000 }, 1);
cart.addItem({ id: 7, name: "Galaxy Buds", price: 3490000 }, 2);
cart.printCart();

console.log("\n📌 PHẦN 7: XÓA GIẢM GIÁ");
console.log("-".repeat(70));

cart.removeDiscount();
cart.printCart();

console.log("\n📌 PHẦN 8: THÔNG TIN CHI TIẾT");
console.log("-".repeat(70));

const cartInfo = cart.getCartInfo();
console.log("📊 Thông tin chi tiết giỏ hàng:");
console.log(`   - Số loại sản phẩm: ${cartInfo.uniqueItems}`);
console.log(`   - Tổng số lượng: ${cartInfo.itemCount}`);
console.log(`   - Tạm tính: ${cartInfo.subtotal.toLocaleString('vi-VN')}đ`);
console.log(`   - Giảm giá: ${cartInfo.discountAmount.toLocaleString('vi-VN')}đ`);
console.log(`   - Thành tiền: ${cartInfo.total.toLocaleString('vi-VN')}đ`);
console.log("\n   Danh sách chi tiết:");
    cartInfo.items.forEach(item => {
    console.log(`   • ${item.name} x${item.quantity} = ${item.total.toLocaleString('vi-VN')}đ`);
});

console.log("\n📌 PHẦN 9: TẠO GIỎ HÀNG MỚI (KIỂM TRA TÍNH ĐỘC LẬP)");
console.log("-".repeat(70));

// Tạo giỏ hàng thứ hai để chứng minh closure hoạt động độc lập
const cart2 = createCart();
cart2.addItem({ id: 100, name: "Test Product", price: 100000 }, 1);
console.log("Giỏ hàng 1:");
cart.printCart();
console.log("\nGiỏ hàng 2:");
cart2.printCart();

console.log("\n📌 PHẦN 10: CLEAR CART");
console.log("-".repeat(70));

cart.clearCart();
cart.printCart();
console.log(`Giỏ hàng trống? ${cart.isEmpty() ? "✅ CÓ" : "❌ KHÔNG"}`);

// ==================== KIỂM TRA TÍNH NĂNG BẢO MẬT ====================
console.log("\n" + "=".repeat(70));
console.log("🔒 KIỂM TRA TÍNH BẢO MẬT CỦA CLOSURE");
console.log("=".repeat(70));

console.log("\n📌 Thử truy cập trực tiếp vào items (sẽ bị lỗi hoặc undefined):");
console.log(`   cart.items: ${typeof cart.items}`); // undefined
console.log(`   cart.currentDiscount: ${typeof cart.currentDiscount}`); // undefined
console.log(`   ✅ items là private, không thể truy cập từ bên ngoài!`);

// ==================== EXPORT MODULE ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createCart };
}

console.log("\n" + "=".repeat(70));
console.log("✅ HOÀN THÀNH DEMO GIỎ HÀNG!");
console.log("=".repeat(70) + "\n");