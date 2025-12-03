import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api } from '../services/api';
import { Shield, Users, MapPin, Eye, TrendingUp, Truck, Star, ChevronRight, Sparkles, Heart, ArrowRight, Zap, Gift, Percent, Tag } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  price: number;
  images: Array<{ url: string; alt: string }>;
  location: {
    city: string;
    district: string;
  };
  condition: string;
  views: number;
  createdAt: string;
}

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: featuredProducts, isLoading } = useQuery(
    'featured-products',
    () => api.get('/products?limit=8&sortBy=createdAt&sortOrder=desc').then(res => res.data.products)
  );

  const { data: categories } = useQuery(
    'categories',
    () => api.get('/categories').then(res => res.data)
  );

  const heroSlides = [
    {
      title: "Yeni Sezon Ürünleri",
      subtitle: "İhtiyacınız olan her şey tek tıkla kapınızda",
      cta: "Hemen Keşfet",
      gradient: "from-primary-600 via-primary-700 to-indigo-800",
      image: "🛍️"
    },
    {
      title: "Güvenli Alışveriş",
      subtitle: "Doğrulanmış satıcılar, güvenli ödeme seçenekleri",
      cta: "Satıcı Ol",
      gradient: "from-emerald-600 via-teal-600 to-cyan-700",
      image: "🛡️"
    },
    {
      title: "Özel Fırsatlar",
      subtitle: "Her gün yeni kampanyalar ve indirimler",
      cta: "Fırsatları Gör",
      gradient: "from-orange-500 via-red-500 to-pink-600",
      image: "🎁"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const getConditionText = (condition: string) => {
    const conditions = {
      new: 'Sıfır',
      like_new: 'Az Kullanılmış',
      good: 'İyi Durumda',
      fair: 'Orta Durumda',
      poor: 'Kötü Durumda'
    };
    return conditions[condition as keyof typeof conditions] || condition;
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      new: 'bg-green-100 text-green-700',
      like_new: 'bg-blue-100 text-blue-700',
      good: 'bg-yellow-100 text-yellow-700',
      fair: 'bg-orange-100 text-orange-700',
      poor: 'bg-red-100 text-red-700'
    };
    return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Slider */}
      <section className="relative overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            <div className={`bg-gradient-to-br ${slide.gradient} min-h-[500px] lg:min-h-[600px]`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="text-center lg:text-left lg:max-w-xl">
                    <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                      <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
                      <span className="text-white/90 text-sm font-medium">www.esatalim.com</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-white/80">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Link
                        to="/products"
                        className="group bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        {slide.cta}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        to="/create-product"
                        className="border-2 border-white/50 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
                      >
                        <Tag className="mr-2 h-5 w-5" />
                        Ücretsiz İlan Ver
                      </Link>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center justify-center">
                    <div className="text-9xl animate-float">{slide.image}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider current content (for layout) */}
        <div className={`bg-gradient-to-br ${heroSlides[currentSlide].gradient} min-h-[500px] lg:min-h-[600px]`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="text-center lg:text-left lg:max-w-xl">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
                  <span className="text-white/90 text-sm font-medium">www.esatalim.com</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-white/80">
                  {heroSlides[currentSlide].subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/products"
                    className="group bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    {heroSlides[currentSlide].cta}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/create-product"
                    className="border-2 border-white/50 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
                  >
                    <Tag className="mr-2 h-5 w-5" />
                    Ücretsiz İlan Ver
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="text-9xl animate-float">{heroSlides[currentSlide].image}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="relative -mt-8 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="h-7 w-7 text-primary-600" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-500">Aktif Kullanıcı</div>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Tag className="h-7 w-7 text-green-600" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">100K+</div>
              <div className="text-sm text-gray-500">Aktif İlan</div>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Star className="h-7 w-7 text-orange-600" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-500">Kullanıcı Puanı</div>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Truck className="h-7 w-7 text-purple-600" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">81 İl</div>
              <div className="text-sm text-gray-500">Türkiye Geneli</div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Banners */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-6 text-white group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <Zap className="h-8 w-8" />
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Günlük</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Flaş Fırsatlar</h3>
              <p className="text-white/80 text-sm mb-4">Her gün yenilenen süper indirimler</p>
              <Link to="/products" className="inline-flex items-center text-sm font-medium group-hover:underline">
                Keşfet <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <Gift className="h-8 w-8" />
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Yeni</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Yeni Üye Kampanyası</h3>
              <p className="text-white/80 text-sm mb-4">İlk alışverişe özel %10 indirim</p>
              <Link to="/register" className="inline-flex items-center text-sm font-medium group-hover:underline">
                Üye Ol <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <Percent className="h-8 w-8" />
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Sınırlı</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Haftalık İndirimler</h3>
              <p className="text-white/80 text-sm mb-4">Seçili ürünlerde %50'ye varan indirim</p>
              <Link to="/products" className="inline-flex items-center text-sm font-medium group-hover:underline">
                İncele <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Categories */}
          {categories && categories.length > 0 && (
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-32">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
                    <Tag className="h-5 w-5 text-primary-600" />
                  </div>
                  Kategoriler
                </h2>
                <div className="space-y-1">
                  {categories.filter((cat: any) => !cat.parent).map((category: any) => (
                    <Link
                      key={category._id}
                      to={`/products?category=${category._id}`}
                      className="group flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-indigo-50 transition-all duration-300"
                    >
                      <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                        {category.icon || '📦'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-700 group-hover:text-primary-600 truncate">
                          {category.name}
                        </h3>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
                
                {/* Tüm Kategoriler Linki */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Link
                    to="/products"
                    className="w-full flex items-center justify-center px-4 py-3 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-xl transition-colors font-semibold"
                  >
                    Tüm Ürünleri Gör
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Right Content - Featured Products */}
          <div className="flex-1">
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-orange-500/25">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Son Eklenen Ürünler</h2>
                    <p className="text-sm text-gray-500">En yeni ilanları keşfedin</p>
                  </div>
                </div>
                <Link
                  to="/products"
                  className="hidden sm:flex items-center text-primary-600 hover:text-primary-700 font-semibold group"
                >
                  Tümünü Gör
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded-2xl animate-pulse">
                      <div className="h-52 bg-gray-200 rounded-t-2xl"></div>
                      <div className="p-5">
                        <div className="h-5 bg-gray-200 rounded-lg mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {featuredProducts?.map((product: Product) => (
                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      className="group bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.title}
                            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-5xl">📦</span>
                          </div>
                        )}
                        {/* Favorite Button */}
                        <button 
                          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
                        </button>
                        {/* Condition Badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full ${getConditionColor(product.condition)}`}>
                            {getConditionText(product.condition)}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 mb-2 line-clamp-2 min-h-[48px]">
                          {product.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {product.location.city}, {product.location.district}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                            {formatPrice(product.price)}
                          </span>
                          <div className="flex items-center text-sm text-gray-400">
                            <Eye className="h-4 w-4 mr-1" />
                            {product.views}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Mobile View All Button */}
              <div className="mt-8 sm:hidden">
                <Link
                  to="/products"
                  className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-xl transition-colors"
                >
                  Tüm Ürünleri Gör
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>


      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Neden Biz?
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Neden www.esatalim.com?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Güvenli, hızlı ve kolay alışveriş deneyimi için doğru adrestesiniz
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Güvenli Alışveriş
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tüm üyelerimiz doğrulanmıştır. 256-bit SSL şifreleme ve güvenli ödeme seçenekleri ile alışveriş yapın.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                En İyi Fiyatlar
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Binlerce ürün arasından en uygun fiyatları bulun. Fiyat karşılaştırma ve indirim bildirimleri ile tasarruf edin.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Geniş Topluluk
              </h3>
              <p className="text-gray-600 leading-relaxed">
                50.000+ aktif kullanıcı ile bağlantı kurun. İhtiyacınız olan ürünleri anında bulun ve satın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Satmak İstediğiniz Bir Ürün mü Var?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Hemen ücretsiz ilan verin ve milyonlarca potansiyel alıcıya ulaşın. 
            İlk ilanınız için özel ayrıcalıklardan yararlanın!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-product"
              className="group inline-flex items-center justify-center bg-white text-primary-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <Tag className="mr-2 h-5 w-5" />
              Ücretsiz İlan Ver
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center border-2 border-white/50 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Satıcı Olarak Kayıt Ol
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
