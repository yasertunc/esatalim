import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Heart, MapPin, Eye, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

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
}

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery(
    'favorites',
    () => api.get('/users/favorites').then(res => res.data.favorites),
    { enabled: !!user }
  );

  const removeFavoriteMutation = useMutation(
    (productId: string) => api.delete(`/users/favorites/${productId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('favorites');
        toast.success('Ürün favorilerden kaldırıldı');
      },
      onError: () => {
        toast.error('Bir hata oluştu');
      }
    }
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const getConditionText = (condition: string) => {
    const conditions: Record<string, string> = {
      new: 'Sıfır',
      like_new: 'Az Kullanılmış',
      good: 'İyi Durumda',
      fair: 'Orta Durumda',
      poor: 'Kötü Durumda'
    };
    return conditions[condition] || condition;
  };

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      new: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      like_new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      good: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      fair: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      poor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[condition] || 'bg-gray-100 text-gray-700';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Favorilerinizi Görüntüleyin
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Favori ürünlerinizi görmek için giriş yapmanız gerekmektedir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center border-2 border-primary-600 text-primary-600 dark:text-primary-400 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Favorilerim
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {favorites?.length || 0} ürün favorilerinizde
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl animate-pulse">
                <div className="h-52 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
                <div className="p-5">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product: Product) => (
              <div
                key={product._id}
                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <Link to={`/products/${product._id}`} className="block">
                  <div className="relative">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.title}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {/* Condition Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full ${getConditionColor(product.condition)}`}>
                        {getConditionText(product.condition)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-2 line-clamp-2 min-h-[48px]">
                      {product.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {product.location.city}, {product.location.district}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
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
                
                {/* Remove Button */}
                <div className="px-5 pb-5">
                  <button
                    onClick={() => removeFavoriteMutation.mutate(product._id)}
                    disabled={removeFavoriteMutation.isLoading}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Favorilerden Kaldır</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Henüz Favori Ürününüz Yok
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca ulaşabilirsiniz.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Ürünleri Keşfet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
