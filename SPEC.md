# SPEC.md - Ultimate Speed Limited 官方網站

## 1. Concept & Vision

**Ultimate Speed Limited** — 專業平行進口電動車代理，專營全球高端電動車進口香港。

品牌形象：**Ambient Luxury EV** — 深邃黑色背景配合柔和電光藍光效，暗示潔淨能源與極速科技。設計語言参考 Lucid Motors：留白充足、漸層過渡自然、光效用於引導視覺而非刺激眼球。

核心情感：從疑惑到信任嘅旅程。每一個視覺細節都暗示著：專業、沉穩、可靠。

---

## 2. Design Language

### Aesthetic Direction
**Ambient Luxury EV** — 採用 Lucid Motors / 頂級電動車品牌嘅視覺語言：
- 深黑背景配合微光漸層，唔會純黑 (#0A0A0A 避免)
- 柔和嘅電光藍光效作為引導，唔係閃光
- 充足留白，讓眼睛休息
- 幾何圖形點綴，冇 emoji

### Color Palette
```
Primary Background:   #0D0D0D (深黑但唔純)
Secondary Background: #141414 (卡片/區塊背景)
Surface:             #1A1A1A (組件背景)
Border:              #2A2A2A (分隔線)
Electric Blue:       #00A8E0 (品牌主色 - 柔和版)
Electric Glow:       #00A8E820 (半透明光效)
Teal Accent:         #00D4AA (環保主題 - 柔和綠)
Gold Accent:         #C9A227 (點綴 - 謹慎使用)
White:               #FFFFFF (主文字)
Off-White:           #E5E5E5 (次要文字)
Muted Gray:         #888888 (三級文字)
Success:            #00D4AA (成功狀態)
```

### Typography
- **Headings**: Montserrat (600, 700 weight) — 簡潔現代
- **Body**: Inter (400, 500 weight) — 高可讀性
- **Accent Numbers**: Space Mono — 數字展示

### Spatial System
- 8px base unit
- Section padding: 120px vertical (desktop), 80px (mobile)
- Card padding: 32px
- Gap between elements: 24px
- Max content width: 1280px

### Motion Philosophy
- **Hero**: Manim 動畫背景 (柔和幾何 + 光效)
- **Scroll**: fade-in + translateY (0 → 0, 20px → 0), 500ms ease-out
- **Hover**: scale 1.01 + subtle border glow (唔係猛然發光)
- **Transitions**: 400ms ease-out 優先
- **光效**: 緩慢呼吸動畫 (6-8秒週期)，暗示「活著」但唔刺激

### Visual Design Principles (High-Contrast but Comfortable)
1. **漸層代替純色** — 背景用 #0D0D0D → #141414 漸層，避免死黑
2. **光效要有出口** — 所有 glow 都襯托深色背景，唔會單獨悬浮
3. **充足留白** — 每個 section 起碼 120px vertical padding
4. **對比度分層** — 主要文字 #FFFFFF，次要 #888888，三級 #555555
5. **藍光引導** — 電光藍只用於 active/hover/emphasis，唔係大範圍填充

---

## 3. Layout & Structure

### Single Page Flow

```
1. Navigation (sticky, transparent → #0D0D0D on scroll)
   - Logo: USL (左) + 底線裝飾
   - Links: 車款 / 服務 / 關於 / 聯絡 (中)
   - CTA: 立即查詢 (右)

2. Hero Section (100vh)
   - Manim 動畫背景 (柔和幾何 + 電光/Teal 光線)
   - Headline: 超越平凡
   - Subheadline: 專業搜羅頂級電動車，英國、澳洲、南非、日本四地直送
   - CTA: 探索車款

3. Vehicle Showcase (車款專區)
   - Filter tabs: 全部 / SUV / 轎車 / 跑車 / MPV / 輕型貨車
   - Tagline: 超越平凡，品質保證
   - Grid: 2x3 vehicle cards
   - 每 card: 主圖、型號名、年份、價格、specs 亮點

4. Services Section (服務專區)
   - 5 service cards in horizontal row (responsive: 3→2→1 col)
   - 每 card: 大型 step number (01-05) 背景浮水印 + 96px icon + 粗標題 + 描述
   - 背景: radial gradient glow (藍/綠色)
   - Card hover: 上浮 + 底部漸變閃光條 + icon glow
   - 底部: 藍→綠漸變線 (hover時顯示)

5. Stats Section (數據展示)
   - 3 key numbers with counting animation
   - 背景: 抽象幾何線條呼應品牌

6. About Section (關於我們)
   - 雙欄: 文字 left, 幾何視覺 right
   - 背景: 微光粒子效果

7. Process Section (服務流程)
   - 4 steps horizontal timeline
   - 每 step: number + 連接線 + 幾何 icon + title + description

8. Contact Section (聯絡我們)
   - 表單: 姓名 / 電話 / 電郵 / 車款興趣 / 訊息
   - 背景: 呼應 hero 嘅幾何元素

9. Footer
   - Logo + 版權 + 社交連結 (SVG icons)
```

### Responsive Strategy
- Desktop: > 1200px (full layout)
- Tablet: 768px - 1199px (2-column → 1-column, reduced padding)
- Mobile: < 768px (hamburger nav, stacked layout, 60px sections)

---

## 4. Features & Interactions

### Navigation
- Smooth scroll to sections (native CSS scroll-behavior)
- Active section: electric blue underline (2px)
- Mobile: hamburger → full-screen overlay (#0D0D0D background)
- Nav background: starts transparent, becomes solid after 50px scroll

### Hero Video
- Autoplay, muted, loop
- Manim-generated abstract animation
- Fallback: gradient background (#0D0D0D → #141414)

### Vehicle Cards
- Hover: card lifts (translateY: -4px) + electric blue border glow (0 0 20px #00A8E820)
- Image: scale 1.03 on hover (overflow hidden)
- Badge: "NEW" (electric blue, auto-assigned if listed within 7 days) / "SOLD" (muted gray)
- Click: scrolls to contact form with vehicle pre-selected

### Stats Counter
- Numbers count up when section enters viewport
- Triggers once only (using Intersection Observer)
- Duration: 2 seconds

### Contact Form
- Real-time validation on blur
- Required: 姓名, 電話
- Optional: 電郵, 車款興趣 (dropdown), 訊息
- Submit: button shows loading spinner → success/error message
- Error: red border (#ff4444) + message below field

### Scroll Animations
- Elements fade in + translateY when entering viewport
- Staggered delay for grids: 100ms between items
- Stats: number counting animation
- All animations use CSS transitions where possible

### SVG Icons (No Emoji)
- Chevron down: scroll indicator
- Menu/hamburger: mobile nav
- Car, Shield, Document, Truck: services
- Check, Phone, Mail: contact form
- Arrow right: CTAs
- All icons: stroke-based, 24x24 or 32x32, 1.5px stroke

---

## 5. Component Inventory

### NavBar
- States: transparent (top), solid (scrolled), mobile-open
- Logo: "USL" text + electric blue underline accent
- Links: hover → #00A8E0 color, 200ms transition
- CTA button: filled #00A8E0, hover → glow effect

### Hero Section
- Full viewport (100vh, min-height: 600px)
- Gradient overlay on video for text readability
- Large headline: clamp(2.5rem, 5vw, 4rem)
- Bouncing chevron scroll indicator

### Vehicle Card
- Container: #1A1A1A background, border-radius: 12px
- Image: aspect-ratio 16/9, object-fit cover
- Gradient overlay: transparent → rgba(0,0,0,0.7) at bottom
- Title: "2023 Toyota bZ4X" format
- Price: #00A8E0 color, right-aligned
- Specs row: up to 3 key specs, #888888 color
- States: default, hover (lift + glow), sold (grayscale)

### Service Pillar
- Icon: 48x48 SVG, stroke #00A8E0
- Title: Montserrat 600, #FFFFFF
- Description: Inter 400, #888888
- Hover: icon gets subtle glow

### Stats Item
- Number: Space Mono 700, 3.5rem, #FFFFFF
- Label: Inter 400, #888888, 0.9rem
- Subtle radial glow behind number

### Process Step
- Number: Montserrat 700, 2rem, #00A8E0
- Line connector: 1px #2A2A2A, dashed
- Icon: 40x40 SVG, centered
- Title: Montserrat 600, #FFFFFF
- Description: Inter 400, #888888
- States: inactive (#555555), active (#00A8E0 full)

### Form Input
- Container: #141414 background, 1px #2A2A2A border
- Focus: border-color #00A8E0, subtle glow
- Label: Inter 500, #888888, above input
- Error: border-color #ff4444, error message below
- Valid: border-color #00D4AA, checkmark icon

### CTA Button
- Primary: bg #00A8E0, color #FFFFFF, hover glow
- Secondary: border 1px #00A8E0, color #00A8E0, hover fill
- States: hover (glow), active (scale 0.98), disabled (#555555)

### Footer
- Background: #0D0D0D
- Logo: "USL" text
- Social icons: 24x24 SVG, #888888 → hover #00A8E0

---

## 6. Technical Approach

### Stack
- **HTML5** — semantic structure (header, nav, main, section, footer)
- **CSS3** — custom properties, flexbox, grid, @keyframes, scroll-behavior: smooth
- **Vanilla JavaScript** — form validation, intersection observer for animations
- **Manim** — hero video animation

### File Structure
```
ultimate-speed/
├── index.html
├── styles.css
├── script.js
├── SPEC.md
├── videos/
│   └── hero-animation.mp4
├── images/
│   └── vehicles/      (vehicle photos)
│   └── logo.svg        (USL logo)
└── assets/
    └── icons/          (SVG icons)
```

### Manim Hero Animation Concept
**Title**: "Convergence"
**Duration**: 30 seconds loop
**Visual Elements**:
- Abstract flowing lines representing energy paths
- Geometric shapes that suggest EV architecture
- Color palette: #00A8E0 (blue), #00D4AA (teal), #FFFFFF (white highlights)
- All on #0D0D0D background
- Speed: slow, meditative movements (nothing jarring)
- Particle effects that breathe rather than flash

**Mood Reference**: Lucid Motors website ambient motion, but simpler

### Performance
- Lazy load images (loading="lazy" attribute)
- Video: compressed, max 5MB, preload="metadata"
- CSS animations preferred over JS
- Intersection Observer for scroll triggers (no scroll event listeners)
- Font display: swap for web fonts

### Form Handling
- Client-side validation with real-time feedback
- Success state: green message + form reset
- Error state: red border + specific error message
- No backend for MVP — logs to console (future: integrate with messaging bot)

---

## 7. Content

### Hero
- Headline: 超越平凡
- Subheadline: 日本頂級電動車，極致進口體驗

### Services
1. **專業評估** — 深入分析進口可行性，確保符合香港法規
2. **電力安全報告** — 全面檢測電動車電力系統，保障駕駛安全
3. **代理申請** — 代辦所有進口文件，省時省力
4. **一站式交付** — 從日本採購到香港驗車，全程无忧

### USP (Stats)
- **330+** 電力安全報告
- **5+年** 行業經驗
- **100%** 客戶滿意度

### Process
1. **查詢** — 聯絡我們，講解需求
2. **評估** — 專業團隊分析可行性
3. **代理** — 代辦所有進口程序
4. **交付** — 汽車驗收，安心駕駛

### About
Ultimate Speed Limited 專營全球高端電動車進口業務。我們相信潔淨能源代表未來，致力為香港消費者引進最優質的日本電動車。每一台車都經過嚴格電力安全檢測，確保客戶安心駕駛。公司多年深耕汽車進口行業，累積豐富經驗，熟悉香港交通條例及進口法規，以專業態度為客戶提供一站式服務。

### Contact
- 標題: 立即查詢
- Subtitle: 填寫以下表格，我們將在24小時內回覆
- Privacy: 我們重視您的私隱，不會向第三方透露您的資料

---

## 8. Logo Design

### Concept: USL Flow
- Text: "USL" in Montserrat Bold
- Stylization: The 'U' has a subtle electric arc connecting top to bottom
- Or: The 'S' subtly shaped like a lightning bolt
- Color: "USL" in white, accent line in #00A8E0

### Alternative: Geometric Mark
- Abstract geometric shape suggesting forward motion
- Composed of 3 elements (for USL)
- Can exist standalone as favicon/icon

### Implementation
- Primary: SVG logo file
- Favicon: 32x32 version
- Wordmark: "ULTIMATE SPEED" below logo for footer

---

## 9. Implementation Phases

### Phase 1: Foundation
- [x] SPEC.md written
- [x] HTML structure with semantic markup
- [x] CSS design system (variables, base styles)
- [x] Logo SVG creation
- [x] Responsive layout

### Phase 2: Firebase Integration & Vehicle System
- [x] Firebase project setup (Firestore, Storage, Auth)
- [x] Vehicle Detail Modal (gallery + booking)
- [ ] Firestore vehicle data loading (real-time)
- [ ] Admin Panel (login, CRUD, image upload)
- [ ] Google Form + Apps Script integration
- [ ] Booking System (calendar + WhatsApp)

### Phase 3: Visual Polish
- [ ] Manim hero animation (optional - CSS fallback exists)
- [ ] Stats counter animation (Intersection Observer ready)

### Phase 4: Content & Launch
- [ ] Real vehicle data in Firestore
- [ ] Seed data population script
- [ ] GitHub Pages deployment

---

## 10. Firebase Architecture

### Firestore Structure
```
vehicles/{vehicleId}
  - brand: string
  - model: string
  - year: number
  - price: string
  - type: 'suv' | 'sedan' | 'sports' | 'mpv' | 'lightgoods'
  - specs: string[]
  - images: string[] (imgBB URLs - public, for Facebook/website sharing)
  - status: 'available' | 'new' | 'sold'
  - createdAt: timestamp
  - updatedAt: timestamp
  - createdBy: string (user email)
  - updatedBy: string (user email)

config/colleagues
  - list: [{name: string, phone: string}]

bookings/{bookingId}
  - vehicleId: string
  - vehicleName: string
  - date: string
  - time: string
  - clientName: string
  - clientPhone: string
  - colleagueName: string
  - colleaguePhone: string
  - status: 'pending' | 'confirmed'
  - createdAt: timestamp
```

### Firebase Config
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD2d2QoKUUWGLydDpgzQhBkyH5ONND0RNg",
  authDomain: "uslweb-c2d9c.firebaseapp.com",
  databaseURL: "https://uslweb-c2d9c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "uslweb-c2d9c",
  storageBucket: "uslweb-c2d9c.firebasestorage.app",
  messagingSenderId: "450947693009",
  appId: "1:450947693009:web:ab539d7233e04f8c0b48f0"
};
```

### Admin Panel
- Path: /admin/index.html (separate from main site)
- Auth: Firebase Email/Password
- Features: Vehicle CRUD, image upload, status toggle

### Booking Flow
1. Client clicks vehicle card → Detail Modal
2. Client clicks "預約睇車" → Booking Modal
3. Select date (28 days / 4 weeks, Tue-Sat, skip Sunday) + time slot (10:00-17:00)
   - Right panel: vehicle card with image, name, price, specs
   - Today highlighted with blue glow
4. Enter name + phone + select colleague
5. Confirm → Opens wa.me link with pre-filled message

---

## 11. Key Design Decisions Summary

| Decision | Choice | Reason |
|----------|--------|--------|
| Background | #0D0D0D → #141414 gradient | Avoids pure black, adds depth |
| Primary accent | #00A8E0 (soft blue) | Electric feel, not harsh |
| Secondary accent | #00D4AA (soft teal) | Environmental connection |
| Text contrast | #FFFFFF / #E5E5E5 / #888888 | Three-tier hierarchy |
| Animation speed | 400-600ms, ease-out | Smooth, not jarring |
| Glow style | 20px blur, 20% opacity | Subtle, not flashing |
| Spacing | 120px section padding | Breathing room |
| Typography | Montserrat + Inter | Clean, professional |
