# Noorani Panjabi Tailors & Fabrics (নূরানী পাঞ্জাবী টেইলার্স অ্যান্ড ফেব্রিক্স)

A modern, high-converting, aesthetic landing page designed specifically for custom men's tailoring, bespoke Panjabi, and bulk school & madrasa uniform orders in Bangladesh.

---

## ✨ Features Included

1. **Ultra-Modern Luxury Aesthetics:**
   - Royal Emerald Green & Gold/Champagne palette tailored for Islamic heritage & contemporary Bangladeshi fashion.
   - Fully responsive design (optimized for Android, iPhone, tablet, and desktop).
   - Glassmorphic navigation and animated micro-interactions.

2. **Customer Lead & Order Form with Telegram Bot Integration:**
   - Captures **Customer Name**, **Phone Number (+880)**, **Order Type** (Madrasa Bulk, School Bulk, Wholesale, Custom Tailoring), **Quantity**, **Fabric Preference**, **District (64 districts)**, and **Custom Notes / Measurements**.
   - Submits leads directly to your **Telegram Bot API** in real-time with clean HTML formatting, direct call, and direct WhatsApp links.
   - Built-in fallback: If the Telegram bot token is not configured yet or has network issues, a 1-click modal forwards the entire formatted order inquiry straight to your WhatsApp!

3. **Interactive Bulk Quotation Calculator:**
   - Real-time pricing calculator for Madrasa/School committees and wholesale traders.
   - Supports 20 to 1,000+ pieces with tiered bulk discounts (10% to 30% off).
   - Toggle matching Pyjamas (+৳320) and Institutional Logo Embroidery (+৳80).
   - "Apply to Order Form" button automatically prefills the main inquiry form with calculated specs.

4. **Direct WhatsApp & Social Media Integration:**
   - Pulsing floating WhatsApp chat widget with pre-filled message.
   - Mobile Sticky Quick-Action Bar (Call Now, WhatsApp, Order Form).
   - Direct Facebook Page links.

5. **Measurement Guide (মাপ দেওয়ার সহজ গাইড):**
   - Tabbed visual instructions for Length (ঝুল), Chest (বুক), Shoulder (তিরা), Sleeve (হাতা), and Collar (কলার).
   - Standard Ready-Made Size Chart (M 38, L 40, XL 42, XXL 44).

6. **In-Browser Settings Panel:**
   - Click **"টেলিগ্রাম ও পেজ সেটিংস পরিবর্তন"** in the footer to enter your Telegram Bot Token & Chat ID, test it live with a test ping, and save it directly in your browser.

---

## 🚀 Quick Setup & Configuration

You can configure your details in two easy ways:

### Option A: Edit `assets/js/config.js` (Recommended for Production)
Open `assets/js/config.js` and update:
```javascript
const CONFIG = {
  phone: "+880 1700-000000",
  whatsappNumber: "8801700000000", // (No plus sign, start with 880)
  facebookUrl: "https://facebook.com/your-page-here",
  telegram: {
    botToken: "1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ", // From @BotFather
    chatId: "123456789" // Your Chat ID
  }
};
```

### Option B: Use the In-Browser Settings Modal
1. Open `index.html` in your browser.
2. Scroll to the footer and click **"টেলিগ্রাম ও পেজ সেটিংস পরিবর্তন"** (Telegram & Page Settings).
3. Paste your **Bot Token** and **Chat ID**.
4. Click **"বট টেস্ট মেসেজ পাঠান"** (Test Message) to verify you receive the message on Telegram.
5. Click **"সেভ করুন"** (Save).

---

## 🤖 How to get your Telegram Bot Token & Chat ID

1. Open Telegram and search for **[@BotFather](https://t.me/BotFather)**.
2. Send `/newbot`, choose a name (e.g. `Noorani Orders Bot`) and a username (e.g. `noorani_orders_bot`).
3. BotFather will provide your **HTTP API Token** (e.g. `7123456789:AAEj...`).
4. Start a conversation with your new bot by pressing **Start** (`/start`).
5. To get your **Chat ID**, search for **[@userinfobot](https://t.me/userinfobot)** or **[@raw_data_bot](https://t.me/raw_data_bot)** on Telegram and click Start. It will instantly reply with your `Id` (e.g. `987654321`).
6. Paste both into `config.js` or the in-page settings modal.

---

## 🌐 How to Host Free (Ready to Deploy)

This project consists of pure HTML, modern CSS, and Vanilla JavaScript—meaning zero complicated build steps or server maintenance. You can host it 100% free on:
- **Netlify**: Drag-and-drop the `noorani-tailors` folder on [netlify.com](https://netlify.com).
- **Vercel**: Run `vercel` or link via GitHub.
- **GitHub Pages**: Upload to a GitHub repository and turn on Pages in Settings.
