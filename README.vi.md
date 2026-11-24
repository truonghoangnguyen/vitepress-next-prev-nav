# vitepress-next-prev-nav

Plugin tự động tạo và hiển thị thanh điều hướng **Bài trước / Bài tiếp theo (`Prev / Next`)** cho các trang tài liệu trong VitePress dựa trên danh sách bài viết bạn cung cấp.

✨ **Đặc điểm nổi bật:**
- **Không cần tạo Theme/Layout custom**: Tự động tương thích 100% với giao diện mặc định (Default Theme) của VitePress thông qua `frontmatter.prev` và `frontmatter.next`.
- **Hỗ trợ CLI `gennav`**: Tự động quét thư mục `.md` và tạo file danh sách điều hướng (`nav.json`) cùng file mục lục (`mucluc.md`).
- **Hỗ trợ nhiều danh sách nav**: Dễ dàng phân chia nav cho từng mục/chủ đề khác nhau.

---

## 📦 Cài đặt

```bash
npm install vitepress-next-prev-nav
# hoặc
yarn add vitepress-next-prev-nav
# hoặc
pnpm add vitepress-next-prev-nav
```

---

## 🚀 Cách sử dụng (Chỉ 1 bước duy nhất)

Chỉ cần cấu hình trong file `.vitepress/config.ts` bằng cách sử dụng `defineConfig` và `FilelistNav` từ package:

```ts
// .vitepress/config.ts
import { defineConfig, FilelistNav } from 'vitepress-next-prev-nav'

// Danh sách các bài viết theo đúng thứ tự đọc
const myList = [
  { text: 'Mục lục', link: '/guide/mucluc' },
  { text: 'Bài 1: Giới thiệu', link: '/guide/bai-1' },
  { text: 'Bài 2: Cài đặt', link: '/guide/bai-2' },
]

export default defineConfig({
  // ... Các cấu hình VitePress khác của bạn
  plugins: [
    FilelistNav(myList)
  ]
})
```

🎉 **Xong!** VitePress sẽ tự động hiển thị nút chuyển bài ở cuối mỗi trang tài liệu có trong danh sách.

---

## 🛠 Tự động tạo danh sách bài viết bằng CLI `gennav`

Thay vì tự gõ danh sách bằng tay, bạn có thể dùng CLI `gennav` để quét tự động các file `.md` trong thư mục. Lệnh sẽ tự động sinh ra cả `nav.json` và file mục lục `mucluc.md`:

```bash
# Quét thư mục docs/feyman/ và tự động tạo cả nav.json và mucluc.md (docs/feyman/nav.json, docs/feyman/mucluc.md)
npx gennav docs/feyman/

# Tùy chỉnh đường dẫn xuất file (nếu muốn):
npx gennav docs/feyman/ -o docs/feyman/nav.json --toc docs/feyman/mucluc.md

# Tương tự cho thư mục khác:
npx gennav docs/math/
```

### 📋 Vai trò của file `mucluc.md` (Mục lục)

`mucluc.md` đóng vai trò là danh sách toàn bộ các trang trong tài liệu hoặc cuốn sách của bạn, tương tự như trang Mục lục (Table of Contents) trong các cuốn sách in truyền thống:

```markdown
- [1. PHẨM GIÁC NGỘ](/kinhtieubo/pali-vi/ud/vagga1-bodhivagga.md)
- [2. PHẨM MUCALINDA](/kinhtieubo/pali-vi/ud/vagga2-mucalindavagga.md)
- [3. PHẨM NANDA](/kinhtieubo/pali-vi/ud/vagga3-nandavagga.md)
```

Bạn có thể dễ dàng nhúng trực tiếp file này vào trang bìa hoặc `index.md` bằng cú pháp include có sẵn của VitePress:

```markdown
# My Book

<!--@include: ./meta/mucluc.md-->
```

Cách này giúp trang mục lục luôn tự động đồng bộ theo cấu trúc tài liệu mà không cần phải cập nhật liên kết bằng tay.

Sau đó import các file `nav.json` vào `.vitepress/config.ts`:

```ts
// .vitepress/config.ts
import { defineConfig, FilelistNav } from 'vitepress-next-prev-nav'
import feymanNav from '../docs/feyman/nav.json'
import mathNav from '../docs/math/nav.json'

export default defineConfig({
  plugins: [
    // Truyền nhiều nav dạng tham số riêng biệt:
    FilelistNav(feymanNav, mathNav)
    
    // ...hoặc truyền dạng mảng: FilelistNav([feymanNav, mathNav])
  ]
})
```

---

## 🎨 Tùy chọn: Sử dụng UI Component custom (`<NextPrevNav />`)

Mặc định, plugin tự động kích hoạt giao diện Next/Prev sẵn có của VitePress. Nếu bạn muốn **tự tùy chỉnh giao diện UI điều hướng riêng**, package có cung cấp sẵn component `<NextPrevNav />`:

1. **Đăng ký component trong `.vitepress/theme/index.js`:**
   ```js
   import DefaultTheme from 'vitepress/theme'
   import { registerNextPrevNav } from 'vitepress-next-prev-nav/theme'

   export default {
     extends: DefaultTheme,
     enhanceApp({ app }) {
       registerNextPrevNav(app)
     }
   }
   ```

2. **Dùng thẻ `<NextPrevNav />` trong file Vue Layout hoặc template của bạn.**

---

## 💡 Cách hoạt động

Plugin `FilelistNav` chạy trong quá trình VitePress build/dev. Nó tự động tính toán bài trước (`prev`) và bài sau (`next`) dựa trên thứ tự trong danh sách, sau đó inject vào `frontmatter` (`pageData.frontmatter.prev` & `pageData.frontmatter.next`) của từng trang `.md`. 

Do đó, VitePress Default Theme nhận diện được dữ liệu này và tự động hiển thị thanh điều hướng ở cuối bài viết.

---

## 🛠 Phát triển Package (Local Development)

```bash
# Cài đặt dependencies
npm install

# Build TypeScript & CLI bằng tsup
npm run build

# Thử nghiệm local với project VitePress khác
npm link
# Ở project VitePress test:
npm link vitepress-next-prev-nav
```

### Cấu trúc dự án

```
vitepress-next-prev-nav/
├── bin/
│   └── gennav.ts           # CLI entry point
├── src/
│   ├── index.ts            # Entry point chính (export FilelistNav, defineConfig)
│   ├── core/
│   │   └── filelist-nav.ts # Logic tính toán & gán frontmatter prev/next
│   ├── cli/
│   │   └── generate.ts     # Logic quét markdown files của gennav
│   └── theme/              # Vue Component tùy chọn nếu muốn custom UI
│       ├── index.js        # registerNextPrevNav(app)
│       ├── NextPrevNav.vue # Component UI custom
│       └── useNextPrevNav.js
```
