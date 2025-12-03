# 🚀 esatalim.com Deployment Rehberi

## Hızlı Başlangıç

### Seçenek 1: Vercel (Önerilen - Ücretsiz)

1. **GitHub'a Push Et**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Vercel'e Git**
   - https://vercel.com adresine git
   - GitHub hesabınla giriş yap
   - "New Project" tıkla
   - `esatalim` repo'sunu seç
   - Root Directory: `client` olarak ayarla
   - Environment Variables ekle:
     - `REACT_APP_API_URL` = Backend API URL
     - `REACT_APP_RECAPTCHA_SITE_KEY` = reCAPTCHA key
   - "Deploy" tıkla

3. **Custom Domain (Opsiyonel)**
   - Vercel Dashboard > Settings > Domains
   - `esatalim.com` ekle
   - DNS ayarlarını güncelle

---

### Seçenek 2: Netlify (Ücretsiz)

1. **Netlify'a Git**
   - https://netlify.com adresine git
   - GitHub ile giriş yap

2. **Site Oluştur**
   - "New site from Git" tıkla
   - GitHub > `esatalim` repo seç
   - Build command: `cd client && npm run build`
   - Publish directory: `client/build`
   - Environment Variables ekle
   - "Deploy site" tıkla

---

### Seçenek 3: Manuel Hosting

1. **Build Al**
   ```bash
   cd client
   npm run build
   ```

2. **`build` Klasörünü Upload Et**
   - cPanel, FTP veya hosting panelinize
   - `public_html` klasörüne yükleyin

3. **.htaccess (Apache için)**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## Backend Deployment

### Railway.app (Önerilen)

1. https://railway.app adresine git
2. "New Project" > "Deploy from GitHub"
3. `esatalim` repo seç
4. Root Directory: `/` (backend)
5. Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   PORT=5000
   ```

### Render.com

1. https://render.com adresine git
2. "New Web Service"
3. GitHub repo bağla
4. Build Command: `npm install`
5. Start Command: `npm start`

---

## Environment Variables

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://api.esatalim.com/api
REACT_APP_RECAPTCHA_SITE_KEY=6Le...
REACT_APP_SITE_URL=https://www.esatalim.com
```

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/esatalim
JWT_SECRET=super_secret_key_change_this
JWT_EXPIRE=30d
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://www.esatalim.com
```

---

## SSL/HTTPS

- **Vercel/Netlify**: Otomatik SSL
- **Custom Hosting**: Let's Encrypt kullanın
  ```bash
  sudo certbot --nginx -d esatalim.com -d www.esatalim.com
  ```

---

## Domain Ayarları (esatalim.com)

### DNS Kayıtları

| Tip | Host | Değer |
|-----|------|-------|
| A | @ | Vercel/Netlify IP |
| CNAME | www | cname.vercel-dns.com |
| CNAME | api | api-server.railway.app |

---

## Checklist

- [ ] Environment variables ayarlandı
- [ ] reCAPTCHA production key alındı
- [ ] MongoDB production cluster oluşturuldu
- [ ] CORS ayarları güncellendi
- [ ] SSL/HTTPS aktif
- [ ] Custom domain bağlandı
- [ ] Error tracking (Sentry) eklendi
- [ ] Analytics (Google Analytics) eklendi

---

## Yardım

Sorun yaşarsanız:
- 📧 yasertunc@gmail.com
- 📞 +90 (532) 790 32 60
