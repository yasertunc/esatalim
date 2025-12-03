import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  CreditCard, 
  Truck,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [contactCaptchaVerified, setContactCaptchaVerified] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const contactRecaptchaRef = useRef<ReCAPTCHA>(null);

  // reCAPTCHA site key - Production'da .env'den alınmalı
  const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Test key
  const isDevelopment = process.env.NODE_ENV === 'development';
  const SKIP_CAPTCHA = isDevelopment && !process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaVerified(!!token);
  };

  const handleContactCaptchaChange = (token: string | null) => {
    setContactCaptchaVerified(!!token);
  };

  const handleCaptchaError = () => {
    console.log('reCAPTCHA error - continuing without verification');
    // Hata durumunda kullanıcıyı engellemiyoruz
  };

  const handleCaptchaExpired = () => {
    setCaptchaVerified(false);
    setContactCaptchaVerified(false);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!SKIP_CAPTCHA && !captchaVerified) {
      setSubscribeStatus('error');
      setStatusMessage('Lütfen robot olmadığınızı doğrulayın');
      return;
    }

    if (!email || !email.includes('@')) {
      setSubscribeStatus('error');
      setStatusMessage('Geçerli bir e-posta adresi girin');
      return;
    }

    // Burada API'ye istek atılabilir
    try {
      // Simüle edilmiş başarılı abonelik
      setSubscribeStatus('success');
      setStatusMessage('Bültenimize başarıyla abone oldunuz!');
      setEmail('');
      setCaptchaVerified(false);
      recaptchaRef.current?.reset();
      
      // 5 saniye sonra mesajı temizle
      setTimeout(() => {
        setSubscribeStatus('idle');
        setStatusMessage('');
      }, 5000);
    } catch (error) {
      setSubscribeStatus('error');
      setStatusMessage('Bir hata oluştu, lütfen tekrar deneyin');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Fırsatları Kaçırmayın!
              </h3>
              <p className="text-primary-100">
                En yeni ürünler ve kampanyalardan haberdar olmak için bültenimize abone olun.
              </p>
            </div>
            <div className="w-full max-w-lg">
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta adresiniz"
                    className="flex-1 px-5 py-3 rounded-l-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    type="submit"
                    disabled={!SKIP_CAPTCHA && !captchaVerified}
                    className={`px-6 py-3 font-semibold rounded-r-xl transition-colors flex items-center ${
                      (SKIP_CAPTCHA || captchaVerified)
                        ? 'bg-white text-primary-600 hover:bg-gray-100' 
                        : 'bg-white/50 text-primary-400 cursor-not-allowed'
                    }`}
                  >
                    Abone Ol
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
                
                {/* reCAPTCHA */}
                {!SKIP_CAPTCHA && (
                  <div className="flex justify-center lg:justify-start">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={handleCaptchaChange}
                      onErrored={handleCaptchaError}
                      onExpired={handleCaptchaExpired}
                      theme="dark"
                      size="normal"
                    />
                  </div>
                )}

                {/* Status Message */}
                {subscribeStatus !== 'idle' && (
                  <div className={`flex items-center space-x-2 text-sm ${
                    subscribeStatus === 'success' ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {subscribeStatus === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span>{statusMessage}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-primary-600/20 rounded-xl flex items-center justify-center">
                <Shield className="h-7 w-7 text-primary-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Güvenli Alışveriş</h4>
                <p className="text-sm text-gray-400">256-bit SSL güvenlik sertifikası</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-green-600/20 rounded-xl flex items-center justify-center">
                <Truck className="h-7 w-7 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Hızlı Teslimat</h4>
                <p className="text-sm text-gray-400">Türkiye'nin her yerine kargo</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-orange-600/20 rounded-xl flex items-center justify-center">
                <CreditCard className="h-7 w-7 text-orange-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Kolay Ödeme</h4>
                <p className="text-sm text-gray-400">Tüm kartlara taksit imkanı</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">E</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">esatalim</span>
                <span className="text-sm text-gray-400 block -mt-1">.com</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Türkiye'nin en güvenilir ikinci el ve sıfır ürün alışveriş platformu. 
              Milyonlarca ürün, binlerce satıcı ile hizmetinizdeyiz.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Hızlı Bağlantılar</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link to="/create-product" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  İlan Ver
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Üye Ol
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Giriş Yap
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Popüler Kategoriler</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products?category=elektronik" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Elektronik
                </Link>
              </li>
              <li>
                <Link to="/products?category=giyim" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Giyim & Moda
                </Link>
              </li>
              <li>
                <Link to="/products?category=ev" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Ev & Yaşam
                </Link>
              </li>
              <li>
                <Link to="/products?category=spor" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Spor & Outdoor
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">İletişim</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Levent, İstanbul<br />
                  Türkiye
                </span>
              </li>
              
              {(SKIP_CAPTCHA || contactCaptchaVerified) ? (
                <>
                  <li className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary-400 flex-shrink-0" />
                    <a href="tel:+905327903260" className="text-gray-400 hover:text-primary-400 transition-colors">
                      +90 (532) 790 32 60
                    </a>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                    <a href="mailto:yasertunc@gmail.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                      yasertunc@gmail.com
                    </a>
                  </li>
                </>
              ) : (
                <li className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-500">
                    <Phone className="h-5 w-5 text-gray-600 flex-shrink-0" />
                    <span className="text-sm">İletişim bilgilerini görmek için doğrulama yapın</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-500">
                    <Mail className="h-5 w-5 text-gray-600 flex-shrink-0" />
                    <span className="text-sm blur-sm select-none">yasertunc@gmail.com</span>
                  </div>
                  
                  {/* Contact reCAPTCHA */}
                  {!SKIP_CAPTCHA && (
                    <div className="pt-3">
                      <p className="text-xs text-gray-500 mb-3">
                        Bot saldırılarına karşı koruma için doğrulama yapın:
                      </p>
                      <ReCAPTCHA
                        ref={contactRecaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleContactCaptchaChange}
                        onErrored={handleCaptchaError}
                        onExpired={handleCaptchaExpired}
                        theme="dark"
                        size="compact"
                      />
                    </div>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} esatalim.com. Tüm hakları saklıdır.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                Gizlilik Politikası
              </Link>
              <Link to="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                Kullanım Koşulları
              </Link>
              <Link to="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                Çerez Politikası
              </Link>
              <Link to="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                KVKK
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
