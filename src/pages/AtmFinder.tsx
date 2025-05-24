import React, { useState, useEffect } from 'react';
import { MapPin, Search, List, Map as MapIcon, Loader2, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { fetchBitcoinATMs } from '../services/atmService';

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
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          // Fetch ATMs near the user's location
          loadATMs(latitude, longitude);
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Location access denied. Please enable location services or enter a location manually.');
          // Load ATMs with a default location (NYC)
          loadATMs(40.7128, -74.0060);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      // Load ATMs with a default location (NYC)
      loadATMs(40.7128, -74.0060);
    }
  }, []);

  useEffect(() => {
    // Filter ATMs based on search query
    if (search.trim() === '') {
      setFilteredAtms(atms);
    } else {
      const searchTerm = search.toLowerCase();
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
      const atmData = await fetchBitcoinATMs(lat, lon);
      
      // Add distance to each ATM
      const atmsWithDistance = atmData.map((atm: ATM) => ({
        ...atm,
        distance: calculateDistance(lat, lon, atm.lat, atm.lon),
      }));
      
      // Sort by distance
      atmsWithDistance.sort((a: ATM, b: ATM) => (a.distance || 0) - (b.distance || 0));
      
      setAtms(atmsWithDistance);
      setFilteredAtms(atmsWithDistance);
    } catch (err) {
      console.error('Failed to fetch ATMs:', err);
      setError('Failed to fetch Bitcoin ATMs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Bitcoin ATM Finder</h1>
        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <button
            onClick={() => setView('map')}
            className={`p-2 rounded-md ${
              view === 'map'
                ? 'bg-bitcoin-light dark:bg-bitcoin-dark text-bitcoin-orange'
                : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
            }`}
          >
            <MapIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-md ${
              view === 'list'
                ? 'bg-bitcoin-light dark:bg-bitcoin-dark text-bitcoin-orange'
                : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
            }`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-secondary-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error-500 bg-opacity-10 border-l-4 border-error-500 p-4 rounded">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-error-500 mr-2" />
            <span className="text-error-500">{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-12 w-12 text-bitcoin-orange animate-spin mb-4" />
          <p className="text-secondary-600 dark:text-secondary-400">Locating Bitcoin ATMs near you...</p>
        </div>
      )}

      {/* Map View */}
      {!loading && view === 'map' && (
        <div className="card p-0 overflow-hidden h-[70vh]">
          {userLocation ? (
            <MapContainer center={userLocation} zoom={13} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* User Location Marker */}
              <Marker position={userLocation}>
                <Popup>
                  <div className="font-medium">Your Location</div>
                </Popup>
              </Marker>
              
              {/* ATM Markers */}
              {filteredAtms.map((atm) => (
                <Marker key={atm.id} position={[atm.lat, atm.lon]}>
                  <Popup>
                    <div>
                      <h3 className="font-bold text-bitcoin-orange">{atm.name}</h3>
                      <p className="text-secondary-600 mt-1">{atm.address}</p>
                      {atm.hours && <p className="text-sm mt-1">Hours: {atm.hours}</p>}
                      {atm.distance && (
                        <p className="text-sm font-medium mt-2">
                          {atm.distance.toFixed(2)} km away
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-secondary-500">Map loading...</p>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {!loading && view === 'list' && (
        <div className="card divide-y divide-secondary-200 dark:divide-secondary-700">
          {filteredAtms.length === 0 ? (
            <div className="p-6 text-center">
              <MapPin className="h-10 w-10 text-secondary-400 mx-auto mb-3" />
              <p className="text-secondary-600 dark:text-secondary-400">No Bitcoin ATMs found in this area.</p>
            </div>
          ) : (
            filteredAtms.map((atm) => (
              <div key={atm.id} className="p-4 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
                <div className="flex justify-between">
                  <h3 className="font-bold text-secondary-900 dark:text-white">{atm.name}</h3>
                  {atm.distance && (
                    <span className="text-bitcoin-orange font-medium text-sm">
                      {atm.distance.toFixed(2)} km
                    </span>
                  )}
                </div>
                <p className="text-secondary-600 dark:text-secondary-400 mt-1">{atm.address}</p>
                {atm.hours && <p className="text-sm text-secondary-500 dark:text-secondary-500 mt-1">Hours: {atm.hours}</p>}
                <div className="mt-3 flex justify-between items-center">
                  <a
                    href={`https://maps.google.com/?q=${atm.lat},${atm.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bitcoin-orange text-sm font-medium hover:underline flex items-center"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Get Directions
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AtmFinder;