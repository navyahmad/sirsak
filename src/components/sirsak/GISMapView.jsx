import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { FaMapMarkerAlt, FaWarehouse, FaRoute, FaCrosshairs } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GISMapView = ({ pickupRequests, warehouseLocation, onMarkerClick }) => {
  const [mapCenter, setMapCenter] = useState([-6.2, 106.8]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Custom icons
  const warehouseIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2098/2098402.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  const warkopIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'REQUESTED': return '#f59e0b'; // Yellow
      case 'SCHEDULED': return '#3b82f6'; // Blue
      case 'PICKED_UP': return '#8b5cf6'; // Purple
      case 'POINT_GRANTED': return '#10b981'; // Green
      default: return '#6b7280'; // Gray
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1); // Distance in km
  };

  // Sort by distance from warehouse
  const sortedRequests = [...pickupRequests].sort((a, b) => {
    const distA = calculateDistance(a.lat, a.lng, warehouseLocation.lat, warehouseLocation.lng);
    const distB = calculateDistance(b.lat, b.lng, warehouseLocation.lat, warehouseLocation.lng);
    return distA - distB;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
    >
      {/* Map Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">GIS Map View</h2>
            <p className="text-gray-600">Monitoring lokasi warkop & rute pickup</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm">Terjadwal</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm">Menunggu</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">Selesai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[500px] relative">
        <MapContainer 
          center={mapCenter} 
          zoom={12} 
          className="h-full w-full z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Warehouse Marker */}
          <Marker 
            position={[warehouseLocation.lat, warehouseLocation.lng]}
            icon={warehouseIcon}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center">
                  <FaWarehouse className="text-blue-500 mr-2" />
                  <h3 className="font-bold">{warehouseLocation.name}</h3>
                </div>
                <p className="text-sm mt-2">Gudang utama pengolahan MLP</p>
                <p className="text-sm">Kapasitas: 5,000 kg/hari</p>
              </div>
            </Popup>
          </Marker>
          
          {/* Warkop Markers */}
          {sortedRequests.map((request) => (
            <Marker
              key={request.id}
              position={[request.lat, request.lng]}
              icon={warkopIcon}
              eventHandlers={{
                click: () => {
                  setSelectedRequest(request);
                  onMarkerClick?.(request);
                }
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-green-500 mr-2" />
                      <h3 className="font-bold">{request.warkopName}</h3>
                    </div>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ 
                        backgroundColor: `${getStatusColor(request.status)}20`,
                        color: getStatusColor(request.status)
                      }}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{request.address}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div>
                      <p className="text-gray-500">Estimasi</p>
                      <p className="font-semibold">{request.estimatedWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Jarak</p>
                      <p className="font-semibold">
                        {calculateDistance(request.lat, request.lng, warehouseLocation.lat, warehouseLocation.lng)} km
                      </p>
                    </div>
                  </div>
                  {request.status === 'SCHEDULED' && request.assignedDriver && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <p className="text-xs text-blue-700">
                        <FaRoute className="inline mr-1" />
                        Driver: {request.assignedDriver}
                      </p>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Draw lines from warehouse to scheduled pickups */}
          {sortedRequests
            .filter(req => req.status === 'SCHEDULED')
            .map((request) => (
              <Polyline
                key={request.id}
                positions={[
                  [warehouseLocation.lat, warehouseLocation.lng],
                  [request.lat, request.lng]
                ]}
                color="#3b82f6"
                weight={2}
                opacity={0.7}
                dashArray="5, 5"
              />
            ))}
        </MapContainer>
        
        {/* Legend Panel */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
            <FaCrosshairs className="mr-2" />
            Informasi Peta
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-2">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/2098/2098402.png" 
                  alt="Gudang" 
                  className="w-6 h-6"
                />
              </div>
              <span>Gudang Sirsak</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-2">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3082/3082383.png" 
                  alt="Warkop" 
                  className="w-5 h-5"
                />
              </div>
              <span>Lokasi Warkop</span>
            </div>
            <div className="mt-3">
              <p className="text-gray-600">
                <strong>{pickupRequests.filter(r => r.status === 'REQUESTED').length}</strong> menunggu pickup
              </p>
              <p className="text-gray-600">
                Rute biru: pickup terjadwal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Lokasi</p>
            <p className="text-xl font-bold text-gray-800">{pickupRequests.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Rata-rata Jarak</p>
            <p className="text-xl font-bold text-gray-800">
              {sortedRequests.length > 0 
                ? (sortedRequests.reduce((sum, req) => 
                    sum + parseFloat(calculateDistance(req.lat, req.lng, warehouseLocation.lat, warehouseLocation.lng)), 0) / sortedRequests.length
                  ).toFixed(1)
                : '0.0'
              } km
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Dalam Radius 10km</p>
            <p className="text-xl font-bold text-gray-800">
              {sortedRequests.filter(req => 
                parseFloat(calculateDistance(req.lat, req.lng, warehouseLocation.lat, warehouseLocation.lng)) <= 10
              ).length}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GISMapView;