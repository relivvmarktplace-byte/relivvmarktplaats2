import React, { useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Netherlands center coordinates
const NETHERLANDS_CENTER = { lat: 52.1326, lng: 5.2913 };

const ProductMap = ({ 
  products = [], 
  center = NETHERLANDS_CENTER, 
  zoom = 8,
  height = "400px",
  onProductClick,
  className = ""
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [infoWindowAnchor, setInfoWindowAnchor] = useState(null);

  const handleMarkerClick = useCallback((product, marker) => {
    setSelectedProduct(product);
    setInfoWindowAnchor(marker);
    
    if (onProductClick) {
      onProductClick(product);
    }
  }, [onProductClick]);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedProduct(null);
    setInfoWindowAnchor(null);
  }, []);

  // Get marker color based on product condition
  const getMarkerColor = (condition) => {
    switch (condition) {
      case 'excellent': return '#22c55e';
      case 'good': return '#3b82f6';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6366f1';
    }
  };

  // Get condition display text
  const getConditionText = (condition) => {
    switch (condition) {
      case 'excellent': return 'Mükemmel';
      case 'good': return 'İyi';
      case 'fair': return 'Orta';
      case 'poor': return 'Kötü';
      default: return condition;
    }
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`h-[${height}] flex items-center justify-center bg-slate-100 rounded-lg ${className}`}>
        <div className="text-center text-slate-600">
          <p className="text-lg font-semibold mb-2">🗺️ Harita Yükleniyor...</p>
          <p>Google Maps API key yapılandırılıyor.</p>
        </div>
      </div>
    );
  }

  // Filter products that have valid coordinates
  const validProducts = products.filter(product => 
    product.pickup_location && 
    product.pickup_location.coordinates &&
    typeof product.pickup_location.coordinates.lat === 'number' &&
    typeof product.pickup_location.coordinates.lng === 'number'
  );

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className={`rounded-lg overflow-hidden border border-slate-200 ${className}`} style={{ height }}>
        <Map
          center={center}
          zoom={zoom}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          mapId="relivv-products-map"
        >
          {/* Render markers for each product */}
          {validProducts.map((product) => (
            <AdvancedMarker
              key={product.id}
              position={product.pickup_location.coordinates}
              onClick={(event) => handleMarkerClick(product, event.domEvent.target)}
            >
              <Pin
                background={getMarkerColor(product.condition)}
                borderColor={'white'}
                glyphColor={'white'}
                scale={1.2}
              />
            </AdvancedMarker>
          ))}

          {/* Info Window for selected product */}
          {selectedProduct && infoWindowAnchor && (
            <InfoWindow
              anchor={infoWindowAnchor}
              onCloseClick={handleInfoWindowClose}
            >
              <Card className="w-64 border-0 shadow-none">
                <CardContent className="p-4">
                  {/* Product Image */}
                  {selectedProduct.images && selectedProduct.images[0] && (
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  
                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-2">
                      {selectedProduct.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm line-clamp-2">
                      {selectedProduct.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-emerald-600">
                        €{selectedProduct.price}
                      </span>
                      <Badge 
                        style={{ backgroundColor: getMarkerColor(selectedProduct.condition) }}
                        className="text-white"
                      >
                        {getConditionText(selectedProduct.condition)}
                      </Badge>
                    </div>
                    
                    {/* Seller Info */}
                    <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {selectedProduct.seller_name ? selectedProduct.seller_name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-700">
                          {selectedProduct.seller_name || 'Anonim'}
                        </p>
                        <p className="text-xs text-slate-400">✓ Doğrulanmış profil</p>
                      </div>
                    </div>
                    
                    {/* Location */}
                    {selectedProduct.pickup_location && selectedProduct.pickup_location.address && (
                      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                        <p className="font-semibold">📍 Teslimat Konumu:</p>
                        <p className="mt-1">{selectedProduct.pickup_location.address}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </InfoWindow>
          )}
        </Map>
      </div>

      {/* Map Legend */}
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span>Mükemmel</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>İyi</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>Orta</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Kötü</span>
        </div>
      </div>
    </APIProvider>
  );
};

export default ProductMap;