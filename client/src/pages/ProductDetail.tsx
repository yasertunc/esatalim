import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapPin, 
  User, 
  Phone, 
  Heart, 
  Share2, 
  ArrowLeft,
  Flag
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const { data: product, isLoading } = useQuery(
    ['product', id],
    () => api.get(`/products/${id}`).then(res => res.data),
    { enabled: !!id }
  );

  const addToFavoritesMutation = useMutation(
    (productId: string) => api.post(`/users/${user?.id}/favorites`, { productId }),
    {
      onSuccess: () => {
        toast.success('Favorilere eklendi');
        queryClient.invalidateQueries(['product', id]);
      },
      onError: () => {
        toast.error('Favorilere eklenirken hata oluştu');
      }
    }
  );

  const removeFromFavoritesMutation = useMutation(
    (productId: string) => api.delete(`/users/${user?.id}/favorites/${productId}`),
    {
      onSuccess: () => {
        toast.success('Favorilerden çıkarıldı');
        queryClient.invalidateQueries(['product', id]);
      },
      onError: () => {
        toast.error('Favorilerden çıkarılırken hata oluştu');
      }
    }
  );

  const handleFavoriteToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isInFavorites()) {
      removeFromFavoritesMutation.mutate(id!);
    } else {
      addToFavoritesMutation.mutate(id!);
    }
  };

  const isInFavorites = () => {
    return user?.favorites?.some((fav: any) => fav._id === id) || false;
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link kopyalandı');
    }
  };

  const handleReport = () => {
    toast.error('Raporlama özelliği yakında eklenecek');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün bulunamadı</h1>
          <Link to="/products" className="btn btn-primary">
            Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Geri Dön
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-w-16 aspect-h-12 bg-white rounded-lg overflow-hidden border">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[currentImageIndex]?.url}
                  alt={product.images[currentImageIndex]?.alt || product.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-6xl">📦</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-primary-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || product.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-2 rounded-full ${
                      isInFavorites() 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${isInFavorites() ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full text-gray-400 hover:text-primary-600 hover:bg-primary-50"
                  >
                    <Share2 className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleReport}
                    className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Flag className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ürün Detayları</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Durum:</span>
                  <span className="ml-2 font-medium">{getConditionText(product.condition)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Kategori:</span>
                  <span className="ml-2 font-medium">{product.category?.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Konum:</span>
                  <span className="ml-2 font-medium">
                    {product.location.city}, {product.location.district}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Görüntülenme:</span>
                  <span className="ml-2 font-medium">{product.views}</span>
                </div>
                <div>
                  <span className="text-gray-500">Tarih:</span>
                  <span className="ml-2 font-medium">{formatDate(product.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Açıklama</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Satıcı Bilgileri</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{product.seller?.name}</h4>
                  <p className="text-sm text-gray-500">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {product.seller?.location?.city}, {product.seller?.location?.district}
                  </p>
                </div>
              </div>
              
              {showContactInfo ? (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {product.seller?.phone || 'Telefon numarası belirtilmemiş'}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowContactInfo(true)}
                  className="btn btn-primary w-full"
                >
                  İletişim Bilgilerini Göster
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Benzer Ürünler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would be populated with related products */}
            <div className="text-center py-8 text-gray-500">
              Benzer ürünler yakında eklenecek
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
