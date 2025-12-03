const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

const categories = [
  // Ana Kategoriler
  { name: 'Emlak', description: 'Konut, işyeri, arsa, kiralık evler', icon: '🏠' },
  { name: 'Vasıta', description: 'Otomobil, motosiklet, bisiklet, kamyon', icon: '🚗' },
  { name: 'Yedek Parça, Aksesuar, Donanım', description: 'Araç yedek parçaları ve aksesuarları', icon: '🔧' },
  { name: 'İkinci El ve Sıfır Alışveriş', description: 'Elektronik, ev eşyaları, moda', icon: '🛍️' },
  { name: 'İş Makineleri & Sanayi', description: 'İş makineleri, sanayi ekipmanları', icon: '🏭' },
  { name: 'Ustalar ve Hizmetler', description: 'Tadilat, temizlik, nakliye hizmetleri', icon: '👷' },
  { name: 'Özel Ders Verenler', description: 'Eğitim, kurs, özel ders', icon: '👨‍🏫' },
  { name: 'İş İlanları', description: 'İş arayanlar ve işverenler', icon: '💼' },
  { name: 'Yardımlaşma', description: 'Bağış, yardım, sosyal sorumluluk', icon: '🤝' }
];

// Alt Kategoriler
const subcategories = {
  'Emlak': [
    'Konut Satılık', 'Konut Kiralık', 'İşyeri Satılık', 'İşyeri Kiralık', 
    'Arsa Satılık', 'Arsa Kiralık', 'Devre Mülk', 'Turistik Tesis'
  ],
  'Vasıta': [
    'Otomobil', 'Motosiklet', 'Bisiklet', 'Kamyon', 'Minibüs', 
    'Otobüs', 'Traktör', 'İş Makinesi', 'Deniz Aracı', 'Hava Aracı'
  ],
  'Yedek Parça, Aksesuar, Donanım': [
    'Otomobil Yedek Parça', 'Motosiklet Yedek Parça', 'Bisiklet Yedek Parça',
    'Lastik', 'Jant', 'Aksesuar', 'Donanım'
  ],
  'İkinci El ve Sıfır Alışveriş': [
    'Elektronik', 'Bilgisayar', 'Telefon', 'Tablet', 'TV, Ses, Görüntü',
    'Ev & Yaşam', 'Mobilya', 'Dekorasyon', 'Bahçe', 'Moda', 'Giyim',
    'Ayakkabı', 'Çanta', 'Saat', 'Mücevher', 'Spor', 'Hobi', 'Kitap',
    'Müzik', 'Film', 'Oyun', 'Antika', 'Koleksiyon'
  ],
  'İş Makineleri & Sanayi': [
    'İş Makinesi', 'Tarım Makinesi', 'İnşaat Makinesi', 'Sanayi Makinesi',
    'Elektrikli El Aleti', 'Kaynak Makinesi', 'Kompresör', 'Jeneratör'
  ],
  'Ustalar ve Hizmetler': [
    'Tadilat & Dekorasyon', 'Temizlik', 'Nakliye', 'Teknik Servis',
    'Güvenlik', 'Bahçıvanlık', 'Pet Bakım', 'Eğitim', 'Danışmanlık'
  ],
  'Özel Ders Verenler': [
    'Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'İngilizce',
    'Müzik', 'Resim', 'Dans', 'Spor', 'Yazılım', 'Dil'
  ],
  'İş İlanları': [
    'Tam Zamanlı', 'Yarı Zamanlı', 'Staj', 'Freelance', 'Uzaktan',
    'Muhasebe', 'Pazarlama', 'IT', 'İnsan Kaynakları', 'Satış'
  ],
  'Yardımlaşma': [
    'Bağış', 'Yardım', 'Sosyal Sorumluluk', 'Gönüllülük', 'Dayanışma'
  ]
};

const sampleUsers = [
  {
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    password: '123456',
    phone: '+90 532 123 45 67',
    location: { city: 'İstanbul', district: 'Kadıköy' },
    role: 'admin'
  },
  {
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    password: '123456',
    phone: '+90 533 234 56 78',
    location: { city: 'Ankara', district: 'Çankaya' }
  },
  {
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    password: '123456',
    phone: '+90 534 345 67 89',
    location: { city: 'İzmir', district: 'Konak' }
  }
];

const sampleProducts = [
  // Emlak
  {
    title: '3+1 Daire Satılık - Kadıköy',
    description: 'Kadıköy merkezde 3+1 daire. Balkonlu, asansörlü, güvenli site. Metroya 5 dakika yürüme mesafesi.',
    price: 2500000,
    condition: 'new',
    location: { city: 'İstanbul', district: 'Kadıköy' },
    tags: ['daire', 'satılık', 'kadıköy', '3+1'],
    specifications: {
      'Oda Sayısı': '3+1',
      'Metrekare': '120 m²',
      'Bina Yaşı': '5 yıl',
      'Kat': '4/8',
      'Isıtma': 'Kombi'
    }
  },
  // Vasıta
  {
    title: '2020 Model Honda Civic 1.6 Elegance',
    description: '2020 model Honda Civic, 1.6 motor, otomatik vites. Tek elden, servis bakımları düzenli yapılmış.',
    price: 450000,
    condition: 'like_new',
    location: { city: 'Ankara', district: 'Çankaya' },
    tags: ['honda', 'civic', 'otomobil', '2020'],
    specifications: {
      'Marka': 'Honda',
      'Model': 'Civic',
      'Yıl': '2020',
      'Motor': '1.6',
      'Vites': 'Otomatik',
      'Kilometre': '45.000 km'
    }
  },
  // Elektronik
  {
    title: 'iPhone 13 Pro Max 256GB',
    description: 'Sıfır iPhone 13 Pro Max, 256GB depolama alanı. Kutusu ve tüm aksesuarları mevcut. Garantisi devam ediyor.',
    price: 45000,
    condition: 'new',
    location: { city: 'İzmir', district: 'Konak' },
    tags: ['iphone', 'apple', 'telefon', 'sıfır'],
    specifications: {
      'Marka': 'Apple',
      'Model': 'iPhone 13 Pro Max',
      'Depolama': '256GB',
      'Renk': 'Graphite',
      'Garanti': 'Var'
    }
  },
  // Mobilya
  {
    title: 'Yeni Takım Yatak Odası - Antalya',
    description: 'Yeni takım yatak odası, gardırop, komodin, yatak başlığı dahil. Montaj yapılmış, kullanılmamış.',
    price: 8500,
    condition: 'new',
    location: { city: 'Antalya', district: 'Muratpaşa' },
    tags: ['yatak', 'odası', 'takım', 'mobilya'],
    specifications: {
      'Malzeme': 'Lamine',
      'Renk': 'Beyaz',
      'Durum': 'Sıfır',
      'Montaj': 'Yapılmış'
    }
  },
  // Motosiklet
  {
    title: 'Yamaha MT-07 2021 Model',
    description: '2021 model Yamaha MT-07, 700cc motor. Tek elden, az kullanılmış. Tüm bakımları yapılmış.',
    price: 180000,
    condition: 'like_new',
    location: { city: 'Bursa', district: 'Osmangazi' },
    tags: ['yamaha', 'mt07', 'motosiklet', '2021'],
    specifications: {
      'Marka': 'Yamaha',
      'Model': 'MT-07',
      'Yıl': '2021',
      'Motor': '700cc',
      'Kilometre': '8.500 km'
    }
  },
  // İş Makinesi
  {
    title: 'JCB 3CX Backhoe Loader',
    description: 'JCB 3CX kepçe yükleyici. İnşaat işleri için ideal. Bakımları düzenli yapılmış.',
    price: 850000,
    condition: 'good',
    location: { city: 'İstanbul', district: 'Beşiktaş' },
    tags: ['jcb', 'kepçe', 'iş', 'makinesi'],
    specifications: {
      'Marka': 'JCB',
      'Model': '3CX',
      'Yıl': '2018',
      'Motor': 'Dizel',
      'Çalışma Saati': '2.500 saat'
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/esatalim');
    console.log('MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Existing data cleared');

    // Create main categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Main categories created');

    // Create subcategories
    const subcategoryDocs = [];
    for (const [parentName, subcats] of Object.entries(subcategories)) {
      const parentCategory = createdCategories.find(cat => cat.name === parentName);
      if (parentCategory) {
        for (const subcatName of subcats) {
          subcategoryDocs.push({
            name: subcatName,
            description: `${subcatName} kategorisi`,
            parent: parentCategory._id,
            isActive: true
          });
        }
      }
    }
    
    if (subcategoryDocs.length > 0) {
      await Category.insertMany(subcategoryDocs);
      console.log('Subcategories created');
    }

    // Create users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log('Users created');

    // Create products with proper category assignments
    const categoryMap = {
      'Emlak': createdCategories.find(cat => cat.name === 'Emlak'),
      'Vasıta': createdCategories.find(cat => cat.name === 'Vasıta'),
      'İkinci El ve Sıfır Alışveriş': createdCategories.find(cat => cat.name === 'İkinci El ve Sıfır Alışveriş'),
      'İş Makineleri & Sanayi': createdCategories.find(cat => cat.name === 'İş Makineleri & Sanayi')
    };

    const productsWithReferences = sampleProducts.map((product, index) => {
      let categoryId = createdCategories[0]._id; // Default category
      
      // Assign correct category based on product type
      if (product.title.includes('Daire') || product.title.includes('Emlak')) {
        categoryId = categoryMap['Emlak']._id;
      } else if (product.title.includes('Honda') || product.title.includes('Yamaha') || product.title.includes('otomobil') || product.title.includes('motosiklet')) {
        categoryId = categoryMap['Vasıta']._id;
      } else if (product.title.includes('iPhone') || product.title.includes('Takım') || product.title.includes('mobilya')) {
        categoryId = categoryMap['İkinci El ve Sıfır Alışveriş']._id;
      } else if (product.title.includes('JCB') || product.title.includes('kepçe')) {
        categoryId = categoryMap['İş Makineleri & Sanayi']._id;
      }

      return {
        ...product,
        category: categoryId,
        seller: createdUsers[index % createdUsers.length]._id,
        images: [
          {
            url: `https://picsum.photos/400/300?random=${index + 1}`,
            alt: product.title
          }
        ]
      };
    });

    await Product.insertMany(productsWithReferences);
    console.log('Products created');

    console.log('Database seeded successfully!');
    console.log('\nTest accounts:');
    console.log('Admin: ahmet@example.com / 123456');
    console.log('User: ayse@example.com / 123456');
    console.log('User: mehmet@example.com / 123456');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase();
