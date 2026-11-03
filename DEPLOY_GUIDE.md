# Deploy Khanh Nguyen Portfolio lên Cloudflare Pages + Tên miền riêng

Tài liệu hướng dẫn từng bước để host miễn phí portfolio lên Cloudflare Pages và gắn tên miền riêng làm CV online.

---

## 1. Tổng quan

| Mục | Chi tiết |
| --- | --- |
| Hosting | Cloudflare Pages (miễn phí, không giới hạn băng thông, CDN toàn cầu) |
| Build | `npm run build` → output vào `dist/` |
| Domain | Mua riêng (khuyến nghị `.com` hoặc `.dev`), kết nối DNS về Cloudflare |
| SSL | Tự động, miễn phí |
| CI/CD | Tự động deploy mỗi khi push lên `main` |

---

## 2. Chuẩn bị

### 2.1. Yêu cầu

- Tài khoản GitHub có quyền push lên repo `khanhprt/khanh-nguyen-portfolio`
- Tài khoản Cloudflare miễn phí: <https://dash.cloudflare.com/sign-up>
- (Tuỳ chọn) Node.js 22.12+ để test build local

### 2.2. Copy cấu hình Cloudflare vào repo

Copy các file sau từ thư mục `cloudflare-config/` vào repo:

```bash
# Vào thư mục repo gốc
cd khanh-nguyen-portfolio

# Copy _headers và _redirects vào public/
cp cloudflare-config/public/_headers  public/_headers
cp cloudflare-config/public/_redirects public/_redirects

# Copy wrangler.toml vào gốc repo
cp cloudflare-config/wrangler.toml wrangler.toml

# Commit & push
git add public/_headers public/_redirects wrangler.toml
git commit -m "chore: add Cloudflare Pages config"
git push origin main
```

> ⚠️ Lưu ý: Vite sẽ tự động copy mọi file trong `public/` vào `dist/` khi build, nên `_headers` và `_redirects` sẽ được Cloudflare Pages đọc tự động.

---

## 3. Tạo Cloudflare Pages project

### Bước 1: Vào Cloudflare Pages

1. Đăng nhập <https://dash.cloudflare.com>
2. Menu trái → **Workers & Pages** → **Create** → **Pages** tab → **Connect to Git**

### Bước 2: Kết nối GitHub

1. Chọn **GitHub**, cấp quyền cho Cloudflare truy cập repo `khanh-nguyen-portfolio`
2. Có thể chọn **Only select repositories** để chỉ cấp 1 repo
3. Bấm **Install & Authorize**

### Bước 3: Cấu hình build

| Trường | Giá trị |
| --- | --- |
| Project name | `khanh-nguyen-portfolio` (sẽ thành subdomain `khanh-nguyen-portfolio.pages.dev`) |
| Production branch | `main` |
| Framework preset | `Vite` (hoặc để None) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | (để trống) |
| Environment variables | `NODE_VERSION` = `22.12` |

Bấm **Save and Deploy**. Đợi 2-3 phút cho build đầu tiên.

### Bước 4: Kiểm tra

Sau khi build xong, Cloudflare sẽ cấp URL dạng:
```
https://<project-name>.pages.dev
https://<commit-hash>.<project-name>.pages.dev  (preview cho mỗi commit)
```

Truy cập URL production để kiểm tra portfolio đã chạy đúng chưa.

---

## 4. Mua tên miền

Cloudflare **không bán tên miền trực tiếp** cho người dùng mới (chỉ hỗ trợ transfer). Nên mua qua nhà đăng ký rồi chuyển DNS về Cloudflare.

### 4.1. Nhà đăng ký khuyến nghị

| Nhà đăng ký | Tên miền `.com` | Đặc điểm |
| --- | --- | --- |
| **Porkbun** <https://porkbun.com> | ~$10.18/năm | Rẻ, không phí ẩn, free WHOIS privacy |
| **Cloudflare Registrar** (nếu được mời) | ~$9.77/năm | Giá cost, nhưng chỉ cho tài khoản đủ điều kiện |
| **Namecheap** <https://namecheap.com> | ~$9.58/năm (năm 1) | Phổ biến, dễ dùng |
| **Cloudflare Registrar** | ~$9.77/năm | Cost price, miễn phí WHOIS |

> Lời khuyên: Mua qua **Porkbun** hoặc **Cloudflare Registrar** vì giá tốt và không phí ẩn.

### 4.2. Gợi ý tên miền cho CV online

Kiểu phổ biến cho portfolio cá nhân:

| Kiểu | Ví dụ | Lợi ích |
| --- | --- | --- |
| `tên-họ.com` | `khanhnguyen.com` | Trực tiếp, chuyên nghiệp |
| `tên-họ.dev` | `khanhnguyen.dev` | Phù hợp profile dev |
| `tên.me` | `khanhnguyen.me` | Ngắn gọn, cá nhân hoá |
| `họ-tên-cv.com` | `khanh-nguyen-cv.com` | Rõ ràng mục đích |

> Kiểm tra sẵn có tại <https://porkbun.com/products/domains>

### 4.3. Quy trình mua

1. Tạo tài khoản Porkbun/Namecheap
2. Tìm tên miền → Add to cart
3. Bật **WHOIS Privacy** (miễn phí)
4. Thanh toán (~$10-15/năm)
5. Sau khi mua xong, vào dashboard quản lý DNS của domain

---

## 5. Kết nối tên miền với Cloudflare Pages

Có 2 cách, khuyến nghị **Cách A** (tốt nhất cho performance & bảo mật).

### Cách A: Chuyển DNS về Cloudflare (khuyến nghị)

#### Bước 1: Thêm site vào Cloudflare

1. Dashboard Cloudflare → **Add a Site** → nhập tên miền vừa mua
2. Chọn gói **Free**
3. Cloudflare sẽ quét DNS hiện tại và gợi ý 2 nameserver dạng:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
   (có thể là `aria.ns.cloudflare.com`, `duke.ns.cloudflare.com`...)

#### Bước 2: Đổi nameserver tại nhà đăng ký

1. Vào Porkbun/Namecheap → Domain Management → Nameservers
2. Đổi sang 2 nameserver Cloudflare cung cấp
3. Lưu. Đợi **5 phút - 24 giờ** để propagate (thường dưới 30 phút)

> Kiểm tra propagation: <https://whatsmydns.net>

#### Bước 3: Thêm custom domain vào Pages

1. Vào Cloudflare Pages → project `khanh-nguyen-portfolio` → tab **Custom domains**
2. **Set up a custom domain** → nhập `khanhnguyen.com`
3. Cloudflare sẽ tự thêm bản ghi `CNAME` hoặc `AAAA` trỏ về Pages (vì DNS đã trên Cloudflare → tự động, không cần thao tác thêm)
4. Bật **Always Use HTTPS** (mặc định Cloudflare đã bật)
5. (Tuỳ chọn) Thêm domain `www.khanhnguyen.com` → cấu hình redirect về apex

#### Bước 4: Kiểm tra SSL

- Cloudflare tự cấp SSL miễn phí (Edge Certificate)
- Vào **SSL/TLS** → chọn mode **Full** (nên dùng Full Strict khi có origin)
- Sau ~10-15 phút, truy cập `https://<tên-miền>` sẽ thấy portfolio

### Cách B: Thêm CNAME trực tiếp (không chuyển DNS)

Nếu không muốn đổi nameserver, có thể thêm CNAME tại nhà đăng ký:

1. Cloudflare Pages → Custom domains → Add `khanhnguyen.com`
2. Cloudflare hiển thị bản ghi cần thêm, ví dụ:
   ```
   CNAME  @  khanh-nguyen-portfolio.pages.dev
   CNAME  www  khanh-nguyen-portfolio.pages.dev
   ```
3. Tại Porkbun/Namecheap: thêm các bản ghi CNAME trên
4. Đợi DNS propagate (5-30 phút)
5. Cloudflare sẽ tự cấp SSL khi detect được CNAME

> Lưu ý: Cách B vẫn hoạt động, nhưng bạn sẽ **không** dùng được các tính năng bảo mật nâng cao của Cloudflare (WAF, Bot Fight Mode, Page Rules...). Khuyến nghị dùng Cách A.

---

## 6. Tối ưu sau khi deploy

### 6.1. Bật các tính năng Cloudflare miễn phí

Vào **Cloudflare Dashboard** → chọn domain → các mục sau:

| Tính năng | Vị trí | Lợi ích |
| --- | --- | --- |
| **Auto Minify** | Speed → Optimization | Tự nén HTML/CSS/JS (cần kiểm tra không vỡ layout) |
| **Brotli** | Speed → Optimization | Nén gzip tốt hơn, giảm ~20% payload |
| **Always Use HTTPS** | SSL/TLS → Edge Certificates | Tự redirect HTTP → HTTPS |
| **HSTS** | SSL/TLS → Edge Certificates | Bật nếu domain chỉ dùng cho web này |
| **Bot Fight Mode** | Security → Bots | Chặn bot spam |
| **Browser Cache TTL** | Caching → Configuration | Để `Respect Existing Headers` (dùng `_headers` đã cấu hình) |

### 6.2. Redirect `www` → apex (hoặc ngược lại)

Vào **Rules → Redirect Rules**:

| Tên | When | Then |
| --- | --- | --- |
| `www → apex` | `hostname eq "www.khanhnguyen.com"` | `redirect` to `https://khanhnguyen.com${http.request.uri.path}` với status 301 |

### 6.3. Bật analytics miễn phí

Cloudflare Web Analytics: <https://dash.cloudflare.com/?to=/:account/web-analytics>
- Free, không cookie, không tracking cá nhân
- Add snippet vào `index.html` hoặc bật qua Pages plugin

---

## 7. Quy trình deploy tự động (CI/CD)

Sau khi setup xong, mỗi lần push lên `main`:

1. Cloudflare Pages tự detect push qua GitHub webhook
2. Chạy `npm install` + `npm run build`
3. Deploy lên production domain
4. Deploy preview cho mỗi PR (URL dạng `<commit>.khanh-nguyen-portfolio.pages.dev`)

Để tắt preview deployments: Pages project → Settings → Builds & deployments → Preview deployments → Disable

---

## 8. Troubleshooting

### Build thất bại

```
Error: vite build --configLoader native
```

Thử đổi build command thành: `npx vite build` hoặc `node_modules/.bin/vite build`

### Trang trắng sau khi deploy

- Kiểm tra `dist/index.html` có asset path là `/assets/...` (absolute path). Nếu là relative `./assets/`, cần set `base: './'` trong `vite.config.js`.
- Kiểm tra `_redirects` đã được copy vào `dist/` (vào Cloudflare Pages → Deployment → Files để xem)

### Tên miền không truy cập được

- Kiểm tra DNS propagation: <https://whatsmydns.net>
- Kiểm tra nameserver đã đổi: `dig NS khanhnguyen.com`
- Cloudflare → DNS → Records → đảm bảo có bản ghi trỏ về Pages

### Lỗi mixed content

Vào SSL/TLS → Settings → đảm bảo mode là **Full** hoặc **Full (Strict)**

---

## 9. Chi phí tổng

| Mục | Chi phí |
| --- | --- |
| Cloudflare Pages | $0 |
| Cloudflare CDN/DNS | $0 |
| SSL certificate | $0 (Cloudflare cấp) |
| Tên miền `.com` | ~$10-15/năm |
| **Tổng** | **~$10-15/năm** (chỉ tiền domain) |

---

## 10. Tài liệu tham khảo

- Cloudflare Pages docs: <https://developers.cloudflare.com/pages/>
- Cloudflare DNS docs: <https://developers.cloudflare.com/dns/>
- Vite deployment guide: <https://vitejs.dev/guide/cli.html#vite-build>
- Porkbun domains: <https://porkbun.com/products/domains>
