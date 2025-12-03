import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Eye, 
  Trash2, 
  Package, 
  Heart, 
  DollarSign,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  title: string;
  price: number;
  images: Array<{ url: string; alt: string }>;
  views: number;
  status: string;
  createdAt: string;
  category: {
    name: string;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  const { data: userProducts, isLoading: productsLoading } = useQuery(
    'user-products',
    () => api.get(`/products/user/${user?.id}`).then(res => res.data),
    { enabled: !!user?.id }
  );

  const { data: userFavorites, isLoading: favoritesLoading } = useQuery(
    'user-favorites',
    () => api.get(`/users/${user?.id}/favorites`).then(res => res.data),
    { enabled: !!user?.id }
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusText = (status: string) => {
    const statuses = {
      active: 'Aktif',
      sold: 'Satıldı',
      inactive: 'Pasif'
    };
    return statuses[status as keyof typeof statuses] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      sold: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/products/${productId}`);
        toast.success('Ürün silindi');
        // Refetch products
        window.location.reload();
      } catch (error) {
        toast.error('Ürün silinirken hata oluştu');
      }
    }
  };

  const stats = [
    {
      name: 'Toplam İlan',
      value: userProducts?.length || 0,
      icon: Package,
      color: 'text-blue-600'
    },
    {
      name: 'Toplam Görüntülenme',
      value: userProducts?.reduce((sum: number, product: Product) => sum + product.views, 0) || 0,
      icon: Eye,
      color: 'text-green-600'
    },
    {
      name: 'Favorilerim',
      value: userFavorites?.length || 0,
      icon: Heart,
      color: 'text-red-600'
    },
    {
      name: 'Toplam Değer',
      value: userProducts?.reduce((sum: number, product: Product) => sum + product.price, 0) || 0,
      icon: DollarSign,
      color: 'text-yellow-600',
      isPrice: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Hesabınızı yönetin ve ilanlarınızı takip edin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.isPrice ? formatPrice(stat.value) : stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                İlanlarım
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'favorites'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Favorilerim
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">İlanlarım</h2>
                  <Link
                    to="/create-product"
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Yeni İlan</span>
                  </Link>
                </div>

                {productsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-gray-100 rounded-lg animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                        <div className="p-4">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userProducts?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProducts.map((product: Product) => (
                      <div key={product._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-w-16 aspect-h-12">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].url}
                              alt={product.images[0].alt || product.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                              <span className="text-gray-400 text-4xl">📦</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-gray-900 line-clamp-2 flex-1">
                              {product.title}
                            </h3>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
                              {getStatusText(product.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-primary-600">
                              {formatPrice(product.price)}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              <Eye className="h-4 w-4 mr-1" />
                              {product.views}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(product.createdAt)}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Link
                              to={`/products/${product._id}`}
                              className="flex-1 btn btn-outline text-center"
                            >
                              Görüntüle
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz ilanınız yok</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      İlk ilanınızı oluşturmak için başlayın.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/create-product"
                        className="btn btn-primary"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        İlan Oluştur
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Favorilerim</h2>

                {favoritesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-gray-100 rounded-lg animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                        <div className="p-4">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userFavorites?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userFavorites.map((product: Product) => (
                      <Link
                        key={product._id}
                        to={`/products/${product._id}`}
                        className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-w-16 aspect-h-12">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].url}
                              alt={product.images[0].alt || product.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                              <span className="text-gray-400 text-4xl">📦</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary-600">
                              {formatPrice(product.price)}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              <Eye className="h-4 w-4 mr-1" />
                              {product.views}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz favori ürününüz yok</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Beğendiğiniz ürünleri favorilere ekleyin.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/products"
                        className="btn btn-primary"
                      >
                        Ürünleri Keşfet
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
