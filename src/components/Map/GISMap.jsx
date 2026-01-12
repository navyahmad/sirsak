import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaWarehouse } from 'react-icons/fa';
import { sirsakWarehouse } from '../../data/mockData';
import { formatNumber } from '../../data/utils';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: -6.2088,
  lng: 106.8456
};

const GISMap = ({ branches, onBranchSelect, showDistances = false }) => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [map, setMap] = useState(null);

  // Function untuk menghitung jarak
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const sortedBranches = useMemo(() => {
    if (showDistances) {
      return branches.map(branch => ({
        ...branch,
        distance: calculateDistance(branch.lat, branch.lng, sirsakWarehouse.lat, sirsakWarehouse.lng)
      })).sort((a, b) => a.distance - b.distance);
    }
    return branches;
  }, [branches, showDistances]);

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-sirsak-primary text-white">
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt />
            <h3 className="font-semibold">Peta Lokasi Cabang</h3>
          </div>
        </div>
        
        <div className="relative">
          {/* NOTE: Untuk Google Maps, perlu API key. Kita buat fallback */}
          <div className="h-96 bg-gray-100 rounded flex items-center justify-center relative">
            {/* Fallback jika Google Maps tidak terload */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50" />
            
            {/* Warehouse Marker */}
            <div className="absolute" style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
              <div className="relative">
                <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <FaWarehouse className="h-6 w-6" />
                </div>
                <div className="absolute -top-2 -right-2 bg-white text-green-600 text-xs font-bold px-2 py-1 rounded shadow">
                  Gudang
                </div>
              </div>
            </div>

            {/* Branch Markers */}
            {sortedBranches.map((branch, index) => {
              // Hitung posisi relatif di peta (simulasi)
              const left = 30 + (index * 20) % 70;
              const top = 30 + (index * 15) % 70;
              
              return (
                <motion.div
                  key={branch.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => {
                    setSelectedBranch(branch);
                    onBranchSelect?.(branch);
                  }}
                >
                  <div className="relative group">
                    <div className="h-10 w-10 bg-sirsak-primary rounded-full flex items-center justify-center text-white shadow-lg">
                      <FaMapMarkerAlt className="h-5 w-5" />
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                      <div className="bg-white p-2 rounded-lg shadow-lg whitespace-nowrap text-sm">
                        <div className="font-semibold">{branch.name}</div>
                        <div className="text-gray-600 text-xs">{branch.estimatedWeight} kg</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Info Window */}
            {selectedBranch && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-xl max-w-xs z-10"
              >
                <button
                  onClick={() => setSelectedBranch(null)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
                <h4 className="font-bold text-sirsak-primary mb-2">{selectedBranch.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{selectedBranch.address}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Estimasi:</span>
                    <div className="font-semibold">{selectedBranch.estimatedWeight} kg</div>
                  </div>
                  {selectedBranch.distance && (
                    <div>
                      <span className="text-gray-500">Jarak:</span>
                      <div className="font-semibold">{selectedBranch.distance.toFixed(1)} km</div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    onBranchSelect?.(selectedBranch);
                    setSelectedBranch(null);
                  }}
                  className="mt-3 w-full py-2 bg-sirsak-primary text-white rounded-lg hover:bg-sirsak-secondary transition-colors"
                >
                  Pilih untuk Pickup
                </button>
              </motion.div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow">
              <div className="text-sm font-semibold mb-2">Legenda:</div>
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                  <span>Gudang Sirsak</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 bg-sirsak-primary rounded-full"></div>
                  <span>Cabang Warkop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {showDistances && (
          <div className="p-4 border-t">
            <h4 className="font-semibold mb-3">Urutan Pickup Berdasarkan Jarak</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {sortedBranches.map((branch, index) => (
                <motion.div
                  key={branch.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-3">
                    <span className="h-6 w-6 bg-sirsak-primary text-white rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="truncate">{branch.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {branch.distance?.toFixed(1) || '0.0'} km
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export tanpa Google Maps
export default GISMap;