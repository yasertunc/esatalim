# www.esatalim.com - Online Satış Platformu

Modern bir online satış platformu. Kullanıcılar ürün satabilir, alabilir ve arama yapabilir.

## Özellikler

- 🏠 Ana sayfa ve ürün listeleme
- 🔍 Gelişmiş arama ve filtreleme
- 📱 Responsive tasarım
- 👤 Kullanıcı kayıt/giriş sistemi
- 📝 Ürün ekleme/düzenleme
- 💬 Mesajlaşma sistemi
- 📊 Dashboard ve istatistikler
- 🛡️ Gelişmiş güvenlik ve hata yönetimi
- 📚 Swagger API dokümantasyonu
- 🐳 Docker containerization
- 🧪 Test coverage
- ✅ Gelişmiş validation sistemi

## Teknolojiler

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Query

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (file upload)

## Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- MongoDB (yerel kurulum veya MongoDB Atlas)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd esatalim
```

2. **Tüm bağımlılıkları yükleyin:**
```bash
npm run install-all
```

3. **MongoDB'yi başlatın:**
```bash
# Yerel MongoDB kullanıyorsanız
mongod

# Veya MongoDB Atlas kullanıyorsanız, connection string'i .env dosyasına ekleyin
```

4. **Environment dosyasını oluşturun:**
```bash
# Server dizininde
cd server
cp env.example .env

# .env dosyasını düzenleyin:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/www.esatalim.com
# JWT_SECRET=your_jwt_secret_key_here
# NODE_ENV=development
```

5. **Veritabanını seed edin (opsiyonel):**
```bash
cd server
node seed.js
```

6. **Geliştirme sunucusunu başlatın:**
```bash
# Ana dizinde
npm run dev
```

7. **Tarayıcıda uygulamayı açın:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Dokümantasyonu: http://localhost:5000/api-docs

## Docker ile Çalıştırma

### Geliştirme Ortamı
```bash
# Geliştirme ortamını başlat
docker-compose -f docker-compose.dev.yml up --build

# Arka planda çalıştır
docker-compose -f docker-compose.dev.yml up -d --build
```

### Production Ortamı
```bash
# Production ortamını başlat
docker-compose up --build

# Arka planda çalıştır
docker-compose up -d --build
```

## Test Çalıştırma

### Backend Testleri
```bash
cd server
npm test
npm run test:coverage
```

### Frontend Testleri
```bash
cd client
npm test
```

### Test Hesapları
Seed script çalıştırıldıktan sonra:
- **Admin:** ahmet@example.com / 123456
- **Kullanıcı:** ayse@example.com / 123456
- **Kullanıcı:** mehmet@example.com / 123456

## Proje Yapısı

```
www.esatalim.com/
├── client/          # React frontend
├── server/          # Node.js backend
├── package.json     # Ana proje dosyası
└── README.md
```
