# Website CV — Đỗ Đăng Tuân

Website CV/portfolio một trang, dựng bằng HTML/CSS/JS thuần (không cần build step).
Mỗi phiên bản giao diện được lưu trong một thư mục `v<version>/` riêng. Trang gốc
`index.html` là khung fullscreen, đọc `versions.json` để biết phiên bản cần hiển thị.

## Cấu trúc

```
my-cv/
├── index.html                    # khung fullscreen, đọc versions.json
├── versions.json                 # registry + trường display quyết định phiên bản hiển thị
├── cv.html                       # bản CV tối ưu cho in / ATS (nguồn tạo PDF)
├── favicon.svg
├── README.md
├── v1.1.0/                       # phiên bản 1.1.0 — giao diện "Signal"
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── v1.0.0/                       # snapshot đã phát hành của phiên bản 1.0.0
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── assets/                       # ảnh, font, PDF dùng chung cho mọi phiên bản
    ├── Do-Dang-Tuan-CV.pdf
    ├── portrait.png
    ├── gplayhub.jpg
    ├── landing.jpg
    ├── vexpo.jpg
    ├── vietdoodle.jpg
    ├── vdg-admin.jpg
    ├── og-cover.jpg
    └── fonts/                    # font self-hosted (Fraunces, Be Vietnam Pro, IBM Plex Mono)
```

Mỗi thư mục phiên bản có một file HTML (`index.html`) cùng CSS/JS snapshot của
phiên bản đó. Ảnh, font và PDF dùng chung từ `assets/` ở thư mục gốc.

## Chạy local

Cách nhanh trên Windows (dùng Node.js):

```powershell
npx --yes serve -l 8000 .
```

Hoặc nếu đã cài Python:

```bash
python3 -m http.server 8000
```

- `http://localhost:8000/` — hiển thị phiên bản được cấu hình trong `versions.json`.
- `http://localhost:8000/v1.1.0/` — mở trực tiếp phiên bản 1.1.0 (giao diện "Signal").
- `http://localhost:8000/v1.0.0/` — mở trực tiếp phiên bản 1.0.0.

Nên chạy HTTP server để `index.html` đọc được `versions.json` bằng `fetch`. Nếu mở
trực tiếp file, trang sẽ dùng iframe fallback trong `index.html` thay vì đọc JSON.

## Thêm phiên bản mới

1. Copy thư mục phiên bản hiện tại:

   ```powershell
   Copy-Item -Recurse .\v1.1.0 .\v1.2.0
   ```

2. Sửa `v1.2.0/index.html`, `v1.2.0/styles.css`, `v1.2.0/script.js`.
   Cập nhật `<meta name="version">`, `<meta name="build-date">` và footer trong
   `v1.2.0/index.html` sang phiên bản mới.

3. Thêm phiên bản vào `versions.json`:

   ```json
   {
     "latest": "1.2.0",
     "display": "1.2.0",
     "versions": [
       { "version": "1.2.0", "date": "2026-11-01", "path": "v1.2.0/index.html" },
       { "version": "1.1.0", "date": "2026-10-25", "path": "v1.1.0/index.html" },
       { "version": "1.0.0", "date": "2026-10-25", "path": "v1.0.0/index.html" }
     ]
   }
   ```

Các thư mục phiên bản đã phát hành nên được giữ nguyên; tạo thư mục mới khi cần
thay đổi giao diện để vẫn xem lại được phiên bản cũ.

## Tạo lại CV PDF

Chỉnh nội dung trong `cv.html`, sau đó chạy trên Windows với Microsoft Edge:

```powershell
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
$root = (Get-Location).Path.Replace("\", "/")
& $edge --headless=new --no-sandbox --disable-gpu --no-pdf-header-footer `
  --print-to-pdf="$PWD\assets\Do-Dang-Tuan-CV.pdf" `
  "file:///$root/cv.html"
```

Trên Linux/macOS có thể dùng Chrome:

```bash
google-chrome --headless=new --no-sandbox --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="assets/Do-Dang-Tuan-CV.pdf" \
  "file:///path/to/my-cv/cv.html"
```

Mọi phiên bản đều trỏ tới cùng một file PDF trong `assets/`, nên PDF luôn là bản mới
nhất sau khi tạo lại.

## Phiên bản

Website dùng Semantic Versioning (`MAJOR.MINOR.PATCH`). `versions.json` là nguồn dữ
liệu duy nhất cho danh sách phiên bản và phiên bản đang hiển thị:

```json
{
  "latest": "1.1.0",
  "display": "1.0.0",
  "versions": [
    { "version": "1.1.0", "date": "2026-10-25", "path": "v1.1.0/index.html" },
    { "version": "1.0.0", "date": "2026-10-25", "path": "v1.0.0/index.html" }
  ]
}
```

- `latest` — phiên bản mới nhất.
- `display` — phiên bản mà `index.html` hiển thị.
- `versions` — danh sách phiên bản, dùng để tra cứu `path` và `date`.

### Chọn phiên bản hiển thị

Sửa trường `display` trong `versions.json`:

- `"display": "1.0.0"` — hiển thị phiên bản 1.0.0 (giao diện gốc).
- `"display": "1.1.0"` — hiển thị phiên bản 1.1.0 (giao diện "Signal").
- `"display": "latest"` — hiển thị phiên bản mới nhất (`latest`).
- Nếu `display` trỏ tới phiên bản không tồn tại, trang tự quay về `latest`.

Thông tin phiên bản cũng được ghi trong `<meta name="version">`,
`<meta name="build-date">` và footer của từng `v<version>/index.html`.

Khi chạy qua HTTP server, chỉ cần đổi `display` là trang gốc tự tải đúng phiên bản.
Nếu muốn bản mở trực tiếp bằng `file://` cũng hiển thị đúng, cập nhật thêm `src`,
`data-version` và `data-date` của iframe trong `index.html`.

## Triển khai

Là thư mục tĩnh nên có thể deploy trực tiếp lên:

- **Netlify**: kéo thả thư mục này vào netlify.com/drop
- **Vercel**: `npx vercel` trong thư mục
- **GitHub Pages**: đưa toàn bộ nội dung lên nhánh `gh-pages`

Cần deploy cả `index.html`, `versions.json`, `assets/` và tất cả thư mục `v*/`.
Sau khi deploy, thay `og:image` bằng URL đầy đủ nếu cần preview khi share.

## Ghi chú về nội dung

- Website giữ đúng các dữ kiện trong CV gốc: kinh nghiệm, dự án, học vấn, chứng chỉ, giải thưởng.
- Một số câu được viết lại ngắn gọn, rõ kết quả hơn; bổ sung liên kết tới các sản phẩm đang chạy thật.
- Ngày sinh và giới tính chỉ xuất hiện trong CV PDF, không hiển thị trên website để hạn chế lộ thông tin cá nhân khi public.
- Ảnh chụp dự án được lấy trực tiếp từ các website/demo đang hoạt động.

## Font

Các font được self-host trong `assets/fonts/`:

- **Fraunces** — display/serif (SIL Open Font License)
- **Be Vietnam Pro** — nội dung (SIL Open Font License)
- **IBM Plex Mono** — nhãn, số liệu (SIL Open Font License)
