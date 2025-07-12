# 🦇 Mighty Bat Bot

A stealth automation tool that clones a Facebook profile and sends friend requests to their friends — all using a spoofed, headless browser running on Railway.

---

## 📦 Features

- ✅ Fully stealth Puppeteer browser (via [Browserless.io](https://browserless.io))
- ✅ Scrapes Facebook public profile info + friends
- ✅ Creates spoofed Facebook accounts (via Mail-Vanish)
- ✅ Clones target’s bio/photo data
- ✅ Sends friend requests only to the target's **visible friends**
- ✅ Web interface + CLI mode
- ✅ Deployable to [Railway](https://railway.app/)

---

## 🚀 How to Use

### 🟩 1. Deploy to Railway

> Railway will auto-install and run `npm start`, launching the web server.

Make sure your project includes these files:
- `railway.json`
- `.env`
- `src/` folder with all logic
- `package.json` with `"start": "node src/webServer.js"`

---

### 🔧 2. .env Configuration

Create a `.env` file at the project root:

```env
PORT=5000
BROWSERLESS_API_KEY=your-browserless-api-key
MAIL_VANISH_URL=https://mail-vanish.com
DEFAULT_USER_AGENT=Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148
ACCEPT_LANGUAGE=en-US,en;q=0.9
LOG_LEVEL=info
