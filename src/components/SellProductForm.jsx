import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import LocationPicker from './LocationPicker';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SellProductForm = ({ onProductCreated }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [location, setLocation] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'good'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(t('common.error'));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      toast.error(t('sell.maxImages', { defaultValue: 'Maximum 5 images allowed' }));
      return;
    }

    // Validate file sizes
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(t('sell.imageTooLarge', { defaultValue: 'Image must be less than 5MB' }));
        return;
      }
    }

    setImages([...images, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleLocationSelected = (locationData) => {
    setLocation(locationData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!location) {
      toast.error(t('sell.locationRequired', { defaultValue: 'Please select a location on the map' }));
      return;
    }

    if (images.length === 0) {
      toast.error(t('sell.imagesRequired', { defaultValue: 'Please add at least one image' }));
      return;
    }

    if (!formData.category) {
      toast.error(t('sell.categoryRequired', { defaultValue: 'Please select a category' }));
      return;
    }

    setLoading(true);

    try {
      // Upload images first (chunked upload for large files)
      const imageUrls = [];
      
      for (const image of images) {
        const formDataImage = new FormData();
        formDataImage.append('file', image);
        
        try {
          const uploadResponse = await axios.post(`${API}/upload-image`, formDataImage, {
            headers: { 
              'Content-Type': 'multipart/form-data'
            },
            timeout: 30000 // 30 second timeout
          });
          
          imageUrls.push(uploadResponse.data.url);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          toast.error(t('sell.imageUploadFailed', { defaultValue: 'Failed to upload image. Please try smaller files.' }));
          setLoading(false);
          return;
        }
      }

      // Create product
      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        images: imageUrls,
        location_id: location.id
      };

      const response = await axios.post(`${API}/products`, productData);

      toast.success(t('sell.success', { defaultValue: '🎉 Product listed successfully!' }));
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: 'good'
      });
      setImages([]);
      setImagePreviews([]);
      setLocation(null);

      if (onProductCreated) {
        onProductCreated(response.data);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      const errorMessage = error.response?.data?.detail || t('sell.error', { defaultValue: 'Failed to list product. Please try again.' });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          🛍️ {t('sell.title', { defaultValue: 'Sell Your Item' })}
        </h1>
        <p className="text-slate-600 text-lg">
          {t('sell.subtitle', { defaultValue: 'List your pre-loved items and find them a new home' })}
        </p>
      </div>

      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="text-2xl">
            {t('sell.productDetails', { defaultValue: 'Product Details' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t('sell.productTitle', { defaultValue: 'Product Title' })} <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('sell.titlePlaceholder', { defaultValue: 'E.g., Vintage Leather Jacket' })}
                className="rounded-xl h-12 border-slate-300"
                maxLength={100}
                required
              />
              <p className="text-xs text-slate-500 mt-1">{formData.title.length}/100</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t('sell.description', { defaultValue: 'Description' })} <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('sell.descriptionPlaceholder', { defaultValue: 'Describe your item: condition, size, features, reason for selling...' })}
                className="rounded-xl min-h-32 border-slate-300"
                maxLength={1000}
                required
              />
              <p className="text-xs text-slate-500 mt-1">{formData.description.length}/1000</p>
            </div>

            {/* Price and Category Row */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t('sell.price', { defaultValue: 'Price' })} (€) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="999999"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="25.00"
                  className="rounded-xl h-12 border-slate-300"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t('sell.category', { defaultValue: 'Category' })} <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger className="rounded-xl h-12 border-slate-300">
                    <SelectValue placeholder={t('sell.selectCategory', { defaultValue: 'Select a category' })} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t('sell.condition', { defaultValue: 'Condition' })} <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
              >
                <SelectTrigger className="rounded-xl h-12 border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">
                    <span className="flex items-center">
                      ✨ {t('sell.conditionNew', { defaultValue: 'New - Never used' })}
                    </span>
                  </SelectItem>
                  <SelectItem value="like_new">
                    <span className="flex items-center">
                      💎 {t('sell.conditionLikeNew', { defaultValue: 'Like New - Barely used' })}
                    </span>
                  </SelectItem>
                  <SelectItem value="good">
                    <span className="flex items-center">
                      👍 {t('sell.conditionGood', { defaultValue: 'Good - Used with care' })}
                    </span>
                  </SelectItem>
                  <SelectItem value="fair">
                    <span className="flex items-center">
                      👌 {t('sell.conditionFair', { defaultValue: 'Fair - Some wear' })}
                    </span>
                  </SelectItem>
                  <SelectItem value="poor">
                    <span className="flex items-center">
                      ⚠️ {t('sell.conditionPoor', { defaultValue: 'Poor - Heavy wear' })}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t('sell.images', { defaultValue: 'Product Images' })} <span className="text-red-500">*</span> (Max 5)
              </label>
              
              <div className="space-y-4">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 bg-white"
                >
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-slate-700 font-medium mb-1">
                      {t('sell.clickToUpload', { defaultValue: 'Click to upload images' })}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t('sell.imageFormats', { defaultValue: 'PNG, JPG, WEBP (Max 5MB each)' })}
                    </p>
                    <p className="text-xs text-indigo-600 mt-2">
                      {images.length}/5 {t('sell.imagesUploaded', { defaultValue: 'images' })}
                    </p>
                  </div>
                </label>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-all"
                          title={t('common.delete')}
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-indigo-500 text-white text-xs px-2 py-1 rounded">
                            {t('sell.mainImage', { defaultValue: 'Main' })}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t('sell.location', { defaultValue: 'Location' })} <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">
                {t('sell.locationHelp', { defaultValue: 'Click on the map to set your item location' })}
              </p>
              <LocationPicker onLocationSelect={handleLocationSelected} />
              {location && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ {t('sell.locationSelected', { defaultValue: 'Location selected' })}: {location.address}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-200">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('sell.listing', { defaultValue: 'Listing Product...' })}
                  </span>
                ) : (
                  <>🚀 {t('sell.listProduct', { defaultValue: 'List My Product' })}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellProductForm;
