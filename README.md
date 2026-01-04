# 🎓 Extension Đánh Giá Tự Động

> Tiện ích Chrome giúp sinh viên tự động điền form đánh giá giảng viên, tiết kiệm thời gian!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://www.google.com/chrome/)

---

## ✨ Tính Năng

✅ **Tự động điền tất cả câu hỏi** đánh giá  
✅ **Tự động điền phản hồi văn bản** ngẫu nhiên (45+ mẫu khác nhau)  
✅ **Tự động submit và chuyển trang**  
✅ **Xử lý nhiều môn học** liên tục  
✅ **Log chi tiết** quá trình thực hiện  
✅ **Bật/tắt dễ dàng** qua popup  
✅ **Reset tiến trình** bất cứ lúc nào  

---

## 📸 Screenshots

### Popup Extension
<img src="https://via.placeholder.com/320x500/667eea/ffffff?text=Extension+Popup" alt="Popup" width="300">

*Giao diện đơn giản, dễ sử dụng với gradient đẹp mắt*

### Dashboard Tự Động
<img src="https://via.placeholder.com/800x400/764ba2/ffffff?text=Dashboard+Running" alt="Dashboard" width="600">

*Extension tự động duyệt và xử lý tất cả môn học*

---

## 🚀 Cài Đặt

### Bước 1: Tải Extension

Download ZIP**
1. Click nút **Code** → **Download ZIP**
2. Giải nén file
3. Vào thư mục `extension`

### Bước 2: Cài vào Chrome

1. Mở Chrome, gõ vào thanh địa chỉ: `chrome://extensions/`
2. Bật **Developer mode** (góc trên bên phải)
3. Click **Load unpacked** (Tải tiện ích đã giải nén)
4. Chọn thư mục `extension`
5. Hoàn tất! Extension sẽ xuất hiện trên toolbar

![Hướng dẫn cài đặt](https://via.placeholder.com/600x300/667eea/ffffff?text=Installation+Guide)

---

## 📖 Hướng Dẫn Sử Dụng

### 1. Bật Extension

1. Click vào **icon Extension** trên toolbar
2. Bấm nút **"Bật"**
3. Icon sẽ chuyển sang màu xanh ✅

### 2. Vào Trang Đánh Giá

1. Vào trang đánh giá giảng viên của trường
2. Extension sẽ **tự động phát hiện** và bắt đầu

### 3. Ngồi Xem!

Extension sẽ tự động:
- ✅ Kiểm tra từng môn học
- ✅ Bỏ qua môn đã đánh giá
- ✅ Click "Chọn" vào môn chưa đánh giá
- ✅ Điền form tự động
- ✅ Submit và chuyển trang
- ✅ Tiếp tục với môn tiếp theo

### 4. Theo Dõi Tiến Trình

- Mở popup để xem log real-time
- Click **"Xem log chi tiết"** để xem hoạt động đầy đủ

---

## 🎯 Cách Hoạt Động

### Luồng Xử Lý (3 Trang)

```
📊 Dashboard
   ↓ Kiểm tra trạng thái môn học
   ↓ Click "Chọn" nếu chưa đánh giá
   
📝 Form Đánh Giá
   ↓ Tự động chọn mức 6 (hoặc 5)
   ↓ Điền Text1 & Text2 ngẫu nhiên
   ↓ Click btnTiepTuc
   
✅ Trang Xác Nhận
   ↓ Click btnTiepTucDanhGia
   ↓ Quay về Dashboard
   
🔄 Lặp lại cho môn tiếp theo...
```

### Phát Hiện Trang Tự Động

Extension tự động nhận biết:
- **Dashboard**: Có danh sách môn học (`gvMonHoc_lbTinhTrang_X`)
- **Form đánh giá**: Có radio buttons đánh giá (`gv*_rd6_*`)
- **Trang xác nhận**: Có nút `btnTiepTucDanhGia`

---

## 🛠️ Công Nghệ

- **Manifest V3** - Phiên bản mới nhất của Chrome Extension
- **Vanilla JavaScript** - Không dùng framework
- **Chrome Storage API** - Lưu trạng thái local
- **Content Scripts** - Tương tác với DOM
- **LocalStorage** - Lưu tiến trình đánh giá

---

## 📁 Cấu Trúc Project

```
extension/
├── manifest.json          # Cấu hình extension
├── content.js            # Logic tự động đánh giá
├── popup.html            # Giao diện popup
├── popup.js              # Logic popup
├── icon.png              # Icon extension
├── README.md             # File này
├── INSTALL_MANUAL.md     # Hướng dẫn cài manual
├── PRIVACY_POLICY.md     # Chính sách bảo mật
└── FREE_DISTRIBUTION.md  # Cách chia sẻ miễn phí
```

---

## ⚙️ Tùy Chỉnh

### Thay Đổi Nội Dung Text

Mở file `content.js`, tìm mảng `text1` và `text2` (dòng 45-139):

```javascript
const text1 = [
    "Nội dung phản hồi tích cực 1...",
    "Nội dung phản hồi tích cực 2...",
    // Thêm nội dung của bạn ở đây
];

const text2 = [
    "Ý kiến đóng góp 1...",
    "Ý kiến đóng góp 2...",
    // Thêm ý kiến của bạn ở đây
];
```

### Thay Đổi Delay

Trong `content.js`, tìm các hàm `await delay(milliseconds)`:

```javascript
await delay(1500);  // Đợi 1.5 giây
```

Tăng giá trị nếu trang load chậm, giảm nếu muốn nhanh hơn.

---

## 🔒 Quyền Riêng Tư

Extension này **KHÔNG** thu thập bất kỳ dữ liệu cá nhân nào:

- ❌ Không gửi dữ liệu ra ngoài
- ❌ Không tracking
- ❌ Không analytics
- ✅ Mọi dữ liệu chỉ lưu trên máy bạn
- ✅ Có thể xóa bất cứ lúc nào

Chi tiết: [PRIVACY_POLICY.md](PRIVACY_POLICY.md)

---

## ❓ FAQ

### Extension bị tắt khi tắt Chrome?
**Không**. Extension vẫn hoạt động, chỉ có trạng thái "Bật/Tắt" trong popup cần bật lại.

### Extension có hoạt động với mọi trường?
Extension được thiết kế cho form đánh giá sử dụng ASP.NET WebForms. Nếu trường bạn dùng hệ thống khác, có thể cần chỉnh sửa selector.

### Làm sao reset tiến trình?
Click icon extension → Bấm nút **"Reset"**.

### Extension có an toàn không?
Hoàn toàn an toàn. Code mở (open source), bạn có thể kiểm tra. Không có mã độc, không thu thập dữ liệu.

---

## 👨‍💻 Tác Giả

**[Ng Khoa]**

- Email: dangkhoash@gmail.com

---

## 🌟 Ủng Hộ Project

Nếu extension giúp ích cho bạn, hãy:

- ⭐ **Star** repo này
- 🍴 **Fork** và chia sẻ với bạn bè
- 🐛 Báo lỗi qua **Issues**
- 💡 Đề xuất tính năng mới

---

## 📜 Changelog

### v1.0.0 (2026-01-04)
- 🎉 Phát hành phiên bản đầu tiên
- ✅ Tự động điền form đánh giá
- ✅ Xử lý nhiều môn học
- ✅ UI popup đẹp với gradient
- ✅ Log chi tiết hoạt động
- ✅ Hỗ trợ thang điểm 1-5 và 1-6

---

<div align="center">

**Made with ❤️ for students**

[⬆ Về đầu trang](#-extension-đánh-giá-tự-động)

</div>

