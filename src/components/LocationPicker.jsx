import React, { useState, useCallback, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Netherlands center coordinates
const NETHERLANDS_CENTER = { lat: 52.1326, lng: 5.2913 };

const LocationPicker = ({ onLocationSelect, initialLocation, className = "" }) => {
  const [markerPosition, setMarkerPosition] = useState(initialLocation || NETHERLANDS_CENTER);
  const [address, setAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState(NETHERLANDS_CENTER);

  // Reverse geocode coordinates to get address
  const reverseGeocode = useCallback(async (coordinates) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/reverse-geocode`, {
        lat: coordinates.lat,
        lng: coordinates.lng
      });
      
      if (response.data.success) {
        setAddress(response.data.address);
        return response.data.address;
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
    return null;
  }, []);

  // Geocode address to get coordinates
  const geocodeAddress = useCallback(async (addressText) => {
    if (!addressText.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/geocode`, {
        address: addressText
      });
      
      if (response.data.success) {
        const coordinates = response.data.coordinates;
        setMarkerPosition(coordinates);
        setMapCenter(coordinates);
        setAddress(response.data.formatted_address);
        
        // Notify parent component
        if (onLocationSelect) {
          onLocationSelect({
            coordinates,
            address: response.data.formatted_address,
            placeId: response.data.place_id
          });
        }
        
        toast.success('📍 Konum bulundu!');
      }
    } catch (error) {
      toast.error('Adres bulunamadı. Lütfen geçerli bir Hollanda adresi girin.');
    } finally {
      setLoading(false);
    }
  }, [onLocationSelect]);

  // Handle marker drag
  const handleMarkerDragEnd = useCallback(async (event) => {
    const position = event.latLng;
    const coordinates = {
      lat: position.lat(),
      lng: position.lng()
    };
    
    setMarkerPosition(coordinates);
    
    // Reverse geocode the new position
    const newAddress = await reverseGeocode(coordinates);
    
    // Notify parent component
    if (onLocationSelect) {
      onLocationSelect({
        coordinates,
        address: newAddress || 'Bilinmeyen konum',
        placeId: null
      });
    }
  }, [onLocationSelect, reverseGeocode]);

  // Initialize with reverse geocoding if we have initial coordinates
  useEffect(() => {
    if (initialLocation && !address) {
      reverseGeocode(initialLocation);
    }
  }, [initialLocation, address, reverseGeocode]);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    geocodeAddress(searchAddress);
  };

  // Handle current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setMarkerPosition(coordinates);
          setMapCenter(coordinates);
          
          const newAddress = await reverseGeocode(coordinates);
          
          if (onLocationSelect) {
            onLocationSelect({
              coordinates,
              address: newAddress || 'Mevcut konumunuz',
              placeId: null
            });
          }
          
          toast.success('📍 Mevcut konumunuz alındı!');
          setLoading(false);
        },
        () => {
          toast.error('Konum erişimi reddedildi veya mevcut değil.');
          setLoading(false);
        }
      );
    } else {
      toast.error('Tarayıcınız konum hizmetlerini desteklemiyor.');
    }
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-slate-600">
            <p className="text-lg font-semibold mb-2">🗺️ Harita Yükleniyor...</p>
            <p>Google Maps API key yapılandırılıyor.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">📍</span>
            <span>Teslimat Konumu Seçin</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Adres ara (örn: Damrak 1, Amsterdam)"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !searchAddress.trim()}>
              {loading ? '🔍...' : '🔍 Ara'}
            </Button>
          </form>

          {/* Current Location Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleCurrentLocation}
            disabled={loading}
            className="w-full"
          >
            {loading ? '📡 Konum alınıyor...' : '📡 Mevcut Konumu Kullan'}
          </Button>

          {/* Map */}
          <div className="h-64 w-full rounded-lg overflow-hidden border border-slate-200">
            <Map
              defaultCenter={mapCenter}
              defaultZoom={12}
              center={mapCenter}
              gestureHandling={'greedy'}
              disableDefaultUI={false}
              mapId="relivv-location-picker"
            >
              <AdvancedMarker
                position={markerPosition}
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
              >
                <Pin 
                  background={'#6366f1'} 
                  borderColor={'#4f46e5'} 
                  glyphColor={'white'}
                />
              </AdvancedMarker>
            </Map>
          </div>

          {/* Selected Address Display */}
          {address && (
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <p className="text-sm font-semibold text-slate-700 mb-1">Seçilen Konum:</p>
              <p className="text-slate-600">{address}</p>
              <p className="text-xs text-slate-500 mt-1">
                📐 {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="text-xs text-slate-500 space-y-1">
            <p>💡 <strong>İpucu:</strong> Mavi işaretçiyi sürükleyerek tam konumu ayarlayın</p>
            <p>🔍 Yukarıdaki arama kutusuna adres yazarak hızlı arama yapabilirsiniz</p>
            <p>📱 "Mevcut Konumu Kullan" ile bulunduğunuz yeri seçebilirsiniz</p>
          </div>
        </CardContent>
      </Card>
    </APIProvider>
  );
};

export default LocationPicker;