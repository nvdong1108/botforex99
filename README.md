# BotForex99

Website giới thiệu bot giao dịch MT5, hướng dẫn mở tài khoản Exness / Vantage qua link đối tác và hướng dẫn cài bot.

## Chạy

```bash
npm install
npm start          # http://localhost:3000
npm run dev        # tự khởi động lại khi sửa server.js
```

Cần Node.js 18 trở lên. Đổi cổng: `PORT=8080 npm start`.

## Sửa nội dung thường gặp

| Muốn sửa | File |
|---|---|
| Link đối tác Exness/Vantage, mã đối tác, TikTok, Telegram, Zalo | `data/site.json` |
| Thêm / sửa / xóa bot | `data/bots.json` |
| File bot để tải (`.ex5`, `.set`) | bỏ vào `public/downloads/`, rồi ghi đường dẫn `/downloads/TenFile.ex5` vào `bots.json` |
| Menu và menu con | mảng `NAV` trong `public/assets/js/layout.js` |
| Màu, font, giao diện | `public/assets/css/style.css` (phần `:root` ở đầu file) |

Sửa `data/*.json` không cần khởi động lại server — tải lại trang là thấy.

### Thêm 1 bot

Thêm 1 object vào `data/bots.json`:

```json
{
  "id": "ten-bot",
  "name": "Tên bot",
  "platform": "MT5",
  "symbols": ["XAUUSD"],
  "timeframe": "M15",
  "style": "Theo xu hướng",
  "risk": "Thấp | Trung bình | Cao",
  "minDeposit": "500 USD",
  "version": "1.0.0",
  "updated": "2026-10-15",
  "status": "Đang chạy | Thử nghiệm",
  "description": "Mô tả ngắn",
  "features": ["Tính năng 1", "Tính năng 2"],
  "download": "/downloads/TenBot.ex5",
  "setFile": "/downloads/TenBot.set"
}
```

Để `"download": ""` thì nút hiện "Sắp có".

## Đếm lượt truy cập

- Lưu ở `data/visits.json` (tự tạo, không đưa lên git).
- 1 lượt = 1 phiên truy cập; tải lại trang trong vòng 30 phút không tính thêm.
- `unique` = số thiết bị/trình duyệt khác nhau (cookie 1 năm).
- Xem nhanh: `GET /api/visit`.

## Cấu trúc

```
server.js              Express: phục vụ web + API /api/visit, /api/bots, /api/site
data/                  site.json, bots.json, visits.json
public/
  index.html           Trang chủ (dashboard)
  bot/index.html       Danh sách bot (lọc theo trạng thái)
  huong-dan/           exness.html, vantage.html, cai-bot.html
  assets/css|js|img
  downloads/           File bot để tải
```
