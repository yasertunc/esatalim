import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../services/api';
import { 
  Upload, 
  X, 
  Plus, 
  MapPin, 
  Tag, 
  DollarSign, 
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductForm {
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  condition: string;
  location: {
    city: string;
    district: string;
  };
  tags: string[];
  specifications: Record<string, string>;
}

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProductForm>({
    defaultValues: {
      tags: [],
      specifications: {}
    }
  });

  const { data: categories } = useQuery(
    'categories',
    () => api.get('/categories').then(res => res.data)
  );

  const createProductMutation = useMutation(
    (formData: FormData) => api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    {
      onSuccess: () => {
        toast.success('Ürün başarıyla oluşturuldu!');
        queryClient.invalidateQueries('products');
        navigate('/dashboard');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Ürün oluşturulamadı');
      }
    }
  );

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      toast.error('En fazla 10 resim yükleyebilirsiniz');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const addTag = () => {
    if (tagInput.trim() && !watch('tags').includes(tagInput.trim())) {
      const newTags = [...watch('tags'), tagInput.trim()];
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = watch('tags').filter(tag => tag !== tagToRemove);
    setValue('tags', newTags);
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      const currentSpecs = watch('specifications') || {};
      setValue('specifications', {
        ...currentSpecs,
        [specKey.trim()]: specValue.trim()
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const currentSpecs = watch('specifications') || {};
    const newSpecs = { ...currentSpecs };
    delete newSpecs[key];
    setValue('specifications', newSpecs);
  };

  const onSubmit = (data: ProductForm) => {
    if (images.length === 0) {
      toast.error('En az bir resim yüklemelisiniz');
      return;
    }

    const formData = new FormData();
    
    // Add product data
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    if (data.subcategory) formData.append('subcategory', data.subcategory);
    formData.append('condition', data.condition);
    formData.append('location', JSON.stringify(data.location));
    formData.append('tags', JSON.stringify(data.tags));
    formData.append('specifications', JSON.stringify(data.specifications));

    // Add images
    images.forEach((image, index) => {
      formData.append('images', image);
    });

    createProductMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Yeni İlan Ver</h1>
            <p className="text-gray-600">Ürününüzü detaylı bir şekilde tanıtın</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ürün Başlığı *
                  </label>
                  <input
                    {...register('title', {
                      required: 'Ürün başlığı gereklidir',
                      minLength: {
                        value: 3,
                        message: 'Başlık en az 3 karakter olmalıdır'
                      }
                    })}
                    type="text"
                    className="input"
                    placeholder="Örn: iPhone 13 Pro Max 256GB"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    {...register('description', {
                      required: 'Açıklama gereklidir',
                      minLength: {
                        value: 10,
                        message: 'Açıklama en az 10 karakter olmalıdır'
                      }
                    })}
                    rows={4}
                    className="input"
                    placeholder="Ürününüz hakkında detaylı bilgi verin..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fiyat (TL) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('price', {
                          required: 'Fiyat gereklidir',
                          min: {
                            value: 0,
                            message: 'Fiyat 0\'dan büyük olmalıdır'
                          }
                        })}
                        type="number"
                        step="0.01"
                        className="input pl-10"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durum *
                    </label>
                    <select
                      {...register('condition', {
                        required: 'Durum seçimi gereklidir'
                      })}
                      className="input"
                    >
                      <option value="">Durum seçin</option>
                      <option value="new">Sıfır</option>
                      <option value="like_new">Az Kullanılmış</option>
                      <option value="good">İyi Durumda</option>
                      <option value="fair">Orta Durumda</option>
                      <option value="poor">Kötü Durumda</option>
                    </select>
                    {errors.condition && (
                      <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kategori</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ana Kategori *
                  </label>
                  <select
                    {...register('category', {
                      required: 'Kategori seçimi gereklidir'
                    })}
                    className="input"
                  >
                    <option value="">Kategori seçin</option>
                    {categories?.map((category: any) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Kategori
                  </label>
                  <input
                    {...register('subcategory')}
                    type="text"
                    className="input"
                    placeholder="Örn: Telefon, Laptop, Masaüstü"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Konum</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şehir *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      {...register('location.city', {
                        required: 'Şehir seçimi gereklidir'
                      })}
                      className="input pl-10"
                    >
                      <option value="">Şehir seçin</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  {errors.location?.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İlçe *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      {...register('location.district', {
                        required: 'İlçe seçimi gereklidir'
                      })}
                      className="input pl-10"
                      disabled={!selectedCity}
                    >
                      <option value="">İlçe seçin</option>
                      {selectedCity && districts[selectedCity as keyof typeof districts]?.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                  {errors.location?.district && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.district.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resimler</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="images" className="btn btn-outline cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Resim Yükle
                      </label>
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG, JPEG formatında, en fazla 10 resim
                    </p>
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Etiketler</h2>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="input flex-1"
                    placeholder="Etiket ekle..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn btn-outline"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {watch('tags')?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {watch('tags').map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Özellikler</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="input"
                    placeholder="Özellik adı"
                  />
                  <input
                    type="text"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="input"
                    placeholder="Değer"
                  />
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="btn btn-outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ekle
                  </button>
                </div>

                {Object.keys(watch('specifications') || {}).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(watch('specifications') || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium">{key}:</span>
                        <div className="flex items-center space-x-2">
                          <span>{value}</span>
                          <button
                            type="button"
                            onClick={() => removeSpecification(key)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={createProductMutation.isLoading}
                className="btn btn-primary"
              >
                {createProductMutation.isLoading ? 'Yayınlanıyor...' : 'İlanı Yayınla'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
