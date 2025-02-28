import React, { useState, useEffect } from 'react';
import { Bus, Train, MapPin, Clock, Search, Languages, Loader2, Navigation } from 'lucide-react';
import axios from 'axios';

interface TransitGuideProps {
  preferredLanguage: 'en' | 'es';
}

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface Route {
  id: string;
  type: 'train' | 'bus' | 'mixed';
  name: string;
  origin: string;
  destination: string;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  transfers: number;
  stops?: string[];
  segments?: {
    type: 'train' | 'bus';
    name: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
  }[];
}

const TransitGuide: React.FC<TransitGuideProps> = ({ preferredLanguage }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es'>(preferredLanguage);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    // Reset location error when language changes
    setLocationError(null);
  }, [language]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        language === 'en'
          ? 'Geolocation is not supported by your browser'
          : 'La geolocalización no es compatible con tu navegador'
      );
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get address from coordinates
          // In a real app, you would use Google Maps Geocoding API
          // For demo purposes, we'll simulate this
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const address = "Georgia State University";
          
          setUserLocation({
            latitude,
            longitude,
            address
          });
          
          setOrigin(address);
        } catch (error) {
          console.error('Error getting address:', error);
          setLocationError(
            language === 'en'
              ? 'Failed to get your address'
              : 'No se pudo obtener tu dirección'
          );
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              language === 'en'
                ? 'Location permission denied'
                : 'Permiso de ubicación denegado'
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError(
              language === 'en'
                ? 'Location information unavailable'
                : 'Información de ubicación no disponible'
            );
            break;
          case error.TIMEOUT:
            setLocationError(
              language === 'en'
                ? 'Location request timed out'
                : 'La solicitud de ubicación expiró'
            );
            break;
          default:
            setLocationError(
              language === 'en'
                ? 'An unknown error occurred'
                : 'Ocurrió un error desconocido'
            );
        }
      }
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;
    
    setIsLoading(true);
    
    try {
      // This would be an API call to MARTA API or Google Maps Directions API
      // For demo purposes, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock transit routes
      const mockRoutes: Route[] = [
        {
          id: '1',
          type: 'train',
          name: language === 'en' ? 'Gold Line' : 'Línea Dorada',
          origin: origin,
          destination: destination,
          duration: '35 min',
          departureTime: '10:15 AM',
          arrivalTime: '10:50 AM',
          transfers: 0,
          stops: [
            'Five Points', 
            'Peachtree Center', 
            'Civic Center', 
            'North Avenue', 
            'Midtown', 
            'Arts Center', 
            'Lindbergh Center', 
            'Lenox', 
            'Brookhaven', 
            'Chamblee', 
            'Doraville'
          ]
        },
        {
          id: '2',
          type: 'bus',
          name: language === 'en' ? 'Route 39' : 'Ruta 39',
          origin: origin,
          destination: destination,
          duration: '45 min',
          departureTime: '10:05 AM',
          arrivalTime: '10:50 AM',
          transfers: 0,
          stops: [
            'GSU Student Center', 
            'Peachtree Center', 
            'North Avenue', 
            'Midtown', 
            'Arts Center', 
            'Lindbergh Center'
          ]
        },
        {
          id: '3',
          type: 'mixed',
          name: language === 'en' ? 'Bus + Train' : 'Autobús + Tren',
          origin: origin,
          destination: destination,
          duration: '50 min',
          departureTime: '10:00 AM',
          arrivalTime: '10:50 AM',
          transfers: 1,
          segments: [
            {
              type: 'bus',
              name: language === 'en' ? 'Route 39' : 'Ruta 39',
              from: origin,
              to: 'Arts Center Station',
              departureTime: '10:00 AM',
              arrivalTime: '10:25 AM'
            },
            {
              type: 'train',
              name: language === 'en' ? 'Gold Line' : 'Línea Dorada',
              from: 'Arts Center Station',
              to: destination,
              departureTime: '10:30 AM',
              arrivalTime: '10:50 AM'
            }
          ]
        }
      ];
      
      setRoutes(mockRoutes);
    } catch (error) {
      console.error('Error fetching transit routes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Bus className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">
            {language === 'en' ? 'Transit Guide' : 'Guía de Transporte'}
          </h2>
        </div>
        <button 
          onClick={toggleLanguage}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
        >
          <Languages className="h-5 w-5" />
          <span>{language === 'en' ? 'English' : 'Español'}</span>
        </button>
      </div>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Origin' : 'Origen'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="origin"
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="pl-10 w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'en' ? 'Starting location' : 'Ubicación de inicio'}
                required
              />
              <button
                type="button"
                onClick={getUserLocation}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800"
                title={language === 'en' ? 'Use my current location' : 'Usar mi ubicación actual'}
              >
                {isLocating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Navigation className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Destination' : 'Destino'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10 w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'en' ? 'Where to?' : '¿A dónde vas?'}
                required
              />
            </div>
          </div>
        </div>
        
        {locationError && (
          <div className="mt-2 text-sm text-red-600">
            {locationError}
          </div>
        )}
        
        {userLocation && (
          <div className="mt-2 text-sm text-green-600">
            {language === 'en' 
              ? 'Location detected: ' 
              : 'Ubicación detectada: '} 
            {userLocation.address}
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !origin.trim() || !destination.trim()}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>{language === 'en' ? 'Find Routes' : 'Buscar Rutas'}</span>
              </>
            )}
          </button>
        </div>
      </form>
      
      {routes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {language === 'en' ? 'Available Routes' : 'Rutas Disponibles'}
          </h3>
          
          {routes.map(route => (
            <div key={route.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {route.type === 'train' ? (
                    <Train className="h-5 w-5 text-blue-600 mr-2" />
                  ) : route.type === 'bus' ? (
                    <Bus className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <div className="flex items-center">
                      <Bus className="h-5 w-5 text-green-600 mr-1" />
                      <span className="mx-1">+</span>
                      <Train className="h-5 w-5 text-blue-600 ml-1" />
                    </div>
                  )}
                  <span className="font-medium text-gray-800 ml-2">{route.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {route.duration}
                </span>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">
                    {language === 'en' ? 'Departure' : 'Salida'}
                  </p>
                  <p className="text-sm font-medium">{route.departureTime}</p>
                  <p className="text-sm text-gray-700">{route.origin}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {language === 'en' ? 'Arrival' : 'Llegada'}
                  </p>
                  <p className="text-sm font-medium">{route.arrivalTime}</p>
                  <p className="text-sm text-gray-700">{route.destination}</p>
                </div>
              </div>
              
              {route.transfers > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">
                    {language === 'en' ? 'Transfers' : 'Transbordos'}: {route.transfers}
                  </p>
                  
                  {route.segments && (
                    <div className="space-y-2 mt-2">
                      {route.segments.map((segment, index) => (
                        <div key={index} className="flex items-start">
                          {segment.type === 'train' ? (
                            <Train className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                          ) : (
                            <Bus className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{segment.name}</p>
                            <p className="text-xs text-gray-600">
                              {segment.from} → {segment.to} ({segment.departureTime} - {segment.arrivalTime})
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {route.stops && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">
                    {language === 'en' ? 'Stops' : 'Paradas'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {route.stops.map((stop, index) => (
                      <React.Fragment key={stop}>
                        <span className="text-xs text-gray-700">{stop}</span>
                        {index < route.stops.length - 1 && (
                          <span className="text-xs text-gray-400">•</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {routes.length === 0 && !isLoading && (origin || destination) && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {language === 'en' 
              ? 'Enter both origin and destination to find transit routes.' 
              : 'Ingresa tanto el origen como el destino para encontrar rutas de transporte.'}
          </p>
        </div>
      )}
      
      <div className="text-center text-sm text-gray-500 mt-6">
        {language === 'en' 
          ? 'This guide provides MARTA bus and train routes in the Atlanta area.' 
          : 'Esta guía proporciona rutas de autobús y tren de MARTA en el área de Atlanta.'}
      </div>
    </div>
  );
};

export default TransitGuide;