import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { api } from '../services/api';
import { User, Mail, Phone, MapPin, Save, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileForm {
  name: string;
  email: string;
  phone?: string;
  location?: {
    city: string;
    district: string;
    address?: string;
  };
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: {
        city: user?.location?.city || '',
        district: user?.location?.district || '',
        address: user?.location?.address || ''
      }
    }
  });

  const updateProfileMutation = useMutation(
    (data: ProfileForm) => api.put(`/users/${user?.id}`, data),
    {
      onSuccess: () => {
        toast.success('Profil güncellendi');
        queryClient.invalidateQueries('user');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Profil güncellenemedi');
      }
    }
  );

  const onSubmit = (data: ProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep',
    'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir', 'Urfa', 'Malatya', 'Erzurum'
  ];

  const districts = {
    'İstanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Beyoğlu', 'Fatih', 'Üsküdar', 'Bakırköy'],
    'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Sincan', 'Etimesgut'],
    'İzmir': ['Konak', 'Karşıyaka', 'Bornova', 'Çiğli', 'Buca', 'Gaziemir'],
    'Bursa': ['Osmangazi', 'Nilüfer', 'Yıldırım', 'Gemlik', 'İnegöl'],
    'Antalya': ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Döşemealtı', 'Aksu']
  };

  const selectedCity = watch('location.city');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profil Ayarları</h1>
          <p className="text-gray-600">Hesap bilgilerinizi yönetin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-primary-600" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    {user?.role === 'admin' ? 'Yönetici' : 'Üye'}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-3" />
                  {user?.email}
                </div>
                {user?.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-3" />
                    {user.phone}
                  </div>
                )}
                {user?.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-3" />
                    {user.location.city}, {user.location.district}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleEdit}
                  className="w-full btn btn-outline flex items-center justify-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Profili Düzenle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Hesap Bilgileri</h3>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('name', {
                        required: 'Ad soyad gereklidir',
                        minLength: {
                          value: 2,
                          message: 'Ad soyad en az 2 karakter olmalıdır'
                        }
                      })}
                      type="text"
                      disabled={!isEditing}
                      className="input pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('email', {
                        required: 'E-posta gereklidir',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Geçerli bir e-posta adresi giriniz'
                        }
                      })}
                      type="email"
                      disabled={!isEditing}
                      className="input pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('phone', {
                        pattern: {
                          value: /^[0-9+\-\s()]+$/,
                          message: 'Geçerli bir telefon numarası giriniz'
                        }
                      })}
                      type="tel"
                      disabled={!isEditing}
                      className="input pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="+90 5XX XXX XX XX"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şehir
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        {...register('location.city')}
                        disabled={!isEditing}
                        className="input pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        <option value="">Şehir seçin</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İlçe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        {...register('location.district')}
                        disabled={!isEditing}
                        className="input pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        <option value="">İlçe seçin</option>
                        {selectedCity && districts[selectedCity as keyof typeof districts]?.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adres
                  </label>
                  <textarea
                    {...register('location.address')}
                    disabled={!isEditing}
                    rows={3}
                    className="input disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Detaylı adres bilgisi (opsiyonel)"
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-secondary"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isLoading}
                      className="btn btn-primary flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>
                        {updateProfileMutation.isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                      </span>
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Security Settings */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Güvenlik</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Şifre</h4>
                      <p className="text-sm text-gray-500">Son güncelleme: Hiçbir zaman</p>
                    </div>
                    <button className="btn btn-outline text-sm">
                      Şifreyi Değiştir
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">İki Faktörlü Doğrulama</h4>
                      <p className="text-sm text-gray-500">Hesabınızı ekstra güvenlik ile koruyun</p>
                    </div>
                    <button className="btn btn-outline text-sm">
                      Etkinleştir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
