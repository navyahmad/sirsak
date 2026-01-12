import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTruck, 
  FaMapMarkerAlt, 
  FaWeight, 
  FaCalendarAlt,
  FaChartPie,
  FaWarehouse
} from 'react-icons/fa';
import LayoutWrapper from '../components/layout/WarkopHeader';
import StatsCard from '../components/Dashboard/StatsCard';
import GISMap from '../components/Map/GISMap';
import PickupList from '../components/Pickup/PickupList';
import PickupSchedule from '../components/Pickup/PickupSchedule';
import { useApp } from '../contexts/AppContext';
import { pickupTeams, sirsakWarehouse } from '../data/mockData';
import { formatNumber } from '../data/utils';

const AdminSirsak = ({ onLogout }) => {
  const { brands, pickups } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPickup, setSelectedPickup] = useState(null);

  // Function untuk sort distance (pindahkan ke sini)
  const sortByDistance = (branches, warehouse) => {
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

    return branches.map(branch => ({
      ...branch,
      distance: calculateDistance(branch.lat, branch.lng, warehouse.lat, warehouse.lng)
    })).sort((a, b) => a.distance - b.distance);
  };

  // Calculate stats
  const totalPickups = pickups.length;
  const pendingPickups = pickups.filter(p => p.status === 'REQUESTED').length;
  const scheduledPickups = pickups.filter(p => p.status === 'SCHEDULED').length;
  const totalWeight = pickups.reduce((sum, p) => sum + (p.actualWeight || 0), 0);
  
  // Get all branches with distances
  const allBranches = brands.flatMap(brand => brand.branches);
  const branchesWithDistances = sortByDistance(allBranches, sirsakWarehouse);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-sirsak-primary to-sirsak-secondary rounded-2xl p-8 text-white"
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Admin Sirsak</h1>
                  <p className="opacity-90">Kelola pickup sampah, jadwalkan tim, dan monitoring data</p>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-white bg-opacity-20 p-4 rounded-full"
                  >
                    <FaTruck className="h-8 w-8" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-white bg-opacity-20 p-4 rounded-full"
                  >
                    <FaWarehouse className="h-8 w-8" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard 
                icon={FaTruck}
                label="Total Pickup"
                value={totalPickups}
                color="#10b981"
                delay={0.1}
              />
              <StatsCard 
                icon={FaCalendarAlt}
                label="Menunggu Jadwal"
                value={pendingPickups}
                color="#f59e0b"
                delay={0.2}
              />
              <StatsCard 
                icon={FaWeight}
                label="Berat Terkumpul"
                value={`${formatNumber(totalWeight)} kg`}
                color="#3b82f6"
                delay={0.3}
              />
              <StatsCard 
                icon={FaMapMarkerAlt}
                label="Lokasi Aktif"
                value={allBranches.length}
                color="#8b5cf6"
                delay={0.4}
              />
            </div>

            {/* Map View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GISMap 
                  branches={branchesWithDistances}
                  showDistances={true}
                  onBranchSelect={(branch) => console.log('Selected:', branch)}
                />
              </div>
              <div className="space-y-6">
                {/* Warehouse Info */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FaWarehouse className="h-8 w-8 text-sirsak-primary" />
                    <h4 className="font-bold text-gray-800">Gudang Sirsak</h4>
                  </div>
                  <p className="text-gray-600 mb-3">{sirsakWarehouse.address}</p>
                  <div className="text-sm text-gray-500">
                    Kapasitas: <span className="font-medium">5 ton/bulan</span>
                  </div>
                </div>

                {/* Pickup Teams */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h4 className="font-bold text-gray-800 mb-4">Tim Pickup</h4>
                  <div className="space-y-3">
                    {pickupTeams.map(team => (
                      <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-sm text-gray-500">{team.driver} - {team.vehicle}</div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {team.capacity} kg
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Pickups */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Pickup Menunggu</h3>
                <button 
                  onClick={() => setActiveTab('pickup')}
                  className="text-sirsak-primary hover:underline"
                >
                  Lihat Semua →
                </button>
              </div>
              <PickupList 
                pickups={pickups.filter(p => p.status === 'REQUESTED')}
                isAdminSirsak={true}
              />
            </div>
          </div>
        );

      case 'pickup':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Kelola Pickup</h3>
              <p className="text-gray-600">Jadwalkan dan pantau semua request pickup</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {['Semua', 'REQUESTED', 'SCHEDULED', 'PICKED_UP', 'WEIGHED'].map((filter, index) => (
                <motion.button
                  key={filter}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedPickup(filter === 'Semua' ? null : filter)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    (filter === 'Semua' && !selectedPickup) || selectedPickup === filter
                      ? 'bg-sirsak-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </motion.button>
              ))}
            </div>

            {/* Pickup List */}
            <PickupList 
              pickups={selectedPickup 
                ? pickups.filter(p => p.status === selectedPickup)
                : pickups
              }
              isAdminSirsak={true}
            />
          </div>
        );

      case 'scheduling':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Jadwalkan Pickup</h3>
              <p className="text-gray-600">Pilih pickup request dan tentukan jadwal</p>
            </div>

            {/* Pickup Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h4 className="font-bold text-gray-800 mb-4">Request Belum Dijadwalkan</h4>
                <div className="space-y-3">
                  {pickups
                    .filter(p => p.status === 'REQUESTED')
                    .map(pickup => (
                      <div
                        key={pickup.id}
                        onClick={() => setSelectedPickup(pickup)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedPickup?.id === pickup.id
                            ? 'border-sirsak-primary bg-sirsak-light'
                            : 'border-gray-200 hover:border-sirsak-primary'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium">Pickup #{pickup.id}</h5>
                            <p className="text-sm text-gray-500">{pickup.brandName}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{pickup.totalEstimatedWeight} kg</div>
                            <div className="text-xs text-gray-400">Estimasi</div>
                          </div>
                        </div>
                        <p className="text-sm mt-2">{pickup.branches.join(', ')}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                {selectedPickup ? (
                  <PickupSchedule pickup={selectedPickup} />
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <FaCalendarAlt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Pilih Request Pickup</h4>
                    <p className="text-gray-600">Pilih salah satu request di samping untuk menjadwalkan pickup</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Laporan & Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h4 className="font-bold mb-4">Statistik Pickup</h4>
                <div className="space-y-4">
                  {['REQUESTED', 'SCHEDULED', 'PICKED_UP', 'WEIGHED', 'POINT_GRANTED'].map(status => {
                    const count = pickups.filter(p => p.status === status).length;
                    const percentage = totalPickups > 0 ? (count / totalPickups * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{status}</span>
                          <span className="font-medium">{count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-sirsak-primary rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h4 className="font-bold mb-4">Data Berat Sampah</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Total Berat Terkumpul</span>
                    <span className="font-bold">{formatNumber(totalWeight)} kg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Rata-rata per Pickup</span>
                    <span className="font-bold">
                      {totalPickups > 0 ? formatNumber(totalWeight / totalPickups) : 0} kg
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Total Poin Diberikan</span>
                    <span className="font-bold">{formatNumber(totalWeight * 100)} poin</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Brand Teraktif</span>
                    <span className="font-bold">
                      {brands.length > 0 ? brands[0].name : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-800">Halaman tidak ditemukan</h3>
          </div>
        );
    }
  };

  return (
    <LayoutWrapper 
      userType="sirsak" 
      onLogout={onLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {renderContent}
    </LayoutWrapper>
  );
};

export default AdminSirsak;