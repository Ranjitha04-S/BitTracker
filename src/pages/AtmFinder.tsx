import React, { useState, useEffect } from 'react';
import { MapPin, Search, List, Map as MapIcon, Loader2, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 
import { fetchBitcoinATMs } from '../services/atmService';

// Leaflet default icon fix (Professional look-kaaga)
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968260.png', // Bitcoin orange icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface ATM {
  id: string;
  lat: number;
  lon: number;
  name: string;
  address: string;
  hours: string;
  distance?: number;
}

const AtmFinder: React.FC = () => {
  const [atms, setAtms] = useState<ATM[]>([]);
  const [filteredAtms, setFilteredAtms] = useState<ATM[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [search, setSearch] = useState<string>('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            loadATMs(latitude, longitude);
          },
          (err) => {
            console.warn('Location blocked. Using default location (NYC).');
            const defaultLat = 40.7128;
            const defaultLon = -74.0060;
            setUserLocation([defaultLat, defaultLon]);
            loadATMs(defaultLat, defaultLon);
            setError('Showing ATMs in NYC. Please enable location for local results.');
          }
        );
      } else {
        setError('Geolocation not supported. Showing results for NYC.');
        loadATMs(40.7128, -74.0060);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    // Optimized Filtering Logic
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) {
      setFilteredAtms(atms);
    } else {
      setFilteredAtms(
        atms.filter(
          (atm) =>
            atm.name.toLowerCase().includes(searchTerm) ||
            atm.address.toLowerCase().includes(searchTerm)
        )
      );
    }
  }, [search, atms]);

  const loadATMs = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      // Fetching wide-area data (This is your "Aggregation" logic)
      const atmData = await fetchBitcoinATMs(lat, lon);
      
      const atmsWithDistance = atmData.map((atm: ATM) => ({
        ...atm,
        distance: calculateDistance(lat, lon, atm.lat, atm.lon),
      }));
      
      // Accuracy Sort: Distance based sorting
      atmsWithDistance.sort((a: ATM, b: ATM) => (a.distance || 0) - (b.distance || 0));
      
      setAtms(atmsWithDistance);
      setFilteredAtms(atmsWithDistance);
    } catch (err) {
      setError('CoinMap API is currently unreachable. Using regional fallback data.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Haversine formula for curved earth distance
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Bitcoin ATM Finder</h1>
          <p className="text-sm text-secondary-500">Discover and navigate to nearest crypto exchange points.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex bg-secondary-100 dark:bg-secondary-800 p-1 rounded-lg">
          <button
            onClick={() => setView('map')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
              view === 'map' ? 'bg-white dark:bg-secondary-700 text-bitcoin-orange shadow-sm' : 'text-secondary-600'
            }`}
          >
            <MapIcon className="h-4 w-4 mr-2" /> Map View
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
              view === 'list' ? 'bg-white dark:bg-secondary-700 text-bitcoin-orange shadow-sm' : 'text-secondary-600'
            }`}
          >
            <List className="h-4 w-4 mr-2" /> List View
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 group-focus-within:text-bitcoin-orange transition-colors" />
        <input
          type="text"
          placeholder="Search by city, name, or street..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl focus:ring-2 focus:ring-bitcoin-orange focus:border-transparent outline-none transition-all"
        />
      </div>

      {error && (
        <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-bitcoin-orange animate-spin mb-4" />
          <p className="text-secondary-500 font-medium">Aggregating ATM location data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {view === 'map' ? (
            <div className="h-[600px] rounded-2xl overflow-hidden border border-secondary-200 dark:border-secondary-700 shadow-xl z-0">
              {userLocation && (
                <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  
                  {/* User Marker */}
                  <Marker position={userLocation}>
                    <Popup><b>You are here</b></Popup>
                  </Marker>

                  {/* ATM Markers */}
                  {filteredAtms.map(atm => (
                    <Marker key={atm.id} position={[atm.lat, atm.lon]} icon={customIcon}>
                      <Popup>
                        <div className="p-1">
                          <h4 className="font-bold text-bitcoin-orange">{atm.name}</h4>
                          <p className="text-xs text-gray-600">{atm.address}</p>
                          <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${atm.lat},${atm.lon}`}
                            target="_blank" 
                            className="text-blue-500 text-xs font-bold mt-2 block"
                          >
                            Get Directions →
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAtms.map(atm => (
                <div key={atm.id} className="bg-white dark:bg-secondary-800 p-5 rounded-xl border border-secondary-200 dark:border-secondary-700 hover:border-bitcoin-orange transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-secondary-900 dark:text-white truncate pr-2">{atm.name}</h3>
                    <span className="bg-bitcoin-light dark:bg-bitcoin-dark text-bitcoin-orange text-xs px-2 py-1 rounded-full font-bold">
                      {atm.distance?.toFixed(1)} km
                    </span>
                  </div>
                  <p className="text-sm text-secondary-500 mb-4 line-clamp-2 h-10">{atm.address}</p>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${atm.lat},${atm.lon}`}
                    target="_blank" 
                    className="w-full flex justify-center items-center py-2 bg-secondary-100 dark:bg-secondary-700 hover:bg-bitcoin-orange hover:text-white rounded-lg text-sm font-bold transition-all"
                  >
                    <MapPin className="h-4 w-4 mr-2" /> Navigate
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AtmFinder;