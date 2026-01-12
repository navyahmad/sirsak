import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaRecycle, 
  FaMapMarkerAlt, 
  FaTruck, 
  FaUsers, 
  FaGift, 
  FaChartBar,
  FaCoins 
} from 'react-icons/fa';
import LayoutWrapper from '../components/layout/WarkopHeader';
import StatsCard from '../components/Dashboard/StatsCard';
import PointDisplay from '../components/Dashboard/PointDisplay';
import ChartComponent from '../components/Dashboard/ChartComponent';
import GISMap from '../components/Map/GISMap';
import BranchManager from '../components/Branch/BranchManager';
import RequestForm from '../components/Pickup/RequestForm';
import PickupList from '../components/Pickup/PickupList';
import EmployeeManager from '../components/BPJS/EmployeeManager';
import BPJSCalculator from '../components/BPJS/BPJSCalculator';
import ProductCatalog from '../components/BPJS/ProductCatalog';
import { useApp } from '../contexts/AppContext';

const AdminWarkop = ({ onLogout }) => {
  const { brands, pickups, selectedBrand, setSelectedBrand } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Calculate stats
  const totalBranches = selectedBrand.branches.length;
  const totalWeight = selectedBrand.branches.reduce((sum, b) => sum + b.estimatedWeight, 0);
  const monthlyPoints = totalWeight * 100;
  const employees = 4; // Mock data

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
                  <h1 className="text-3xl font-bold mb-2">Selamat Datang, Admin {selectedBrand.name}!</h1>
                  <p className="opacity-90">Kelola sampah MLP, dapatkan poin, dan berikan manfaat untuk pegawai</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 md:mt-0"
                >
                  <FaRecycle className="h-16 w-16" />
                </motion.div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard 
                icon={FaMapMarkerAlt}
                label="Total Cabang"
                value={totalBranches}
                color="#10b981"
                delay={0.1}
              />
              <StatsCard 
                icon={FaRecycle}
                label="Sampah/Bulan"
                value={`${totalWeight} kg`}
                color="#059669"
                delay={0.2}
              />
              <StatsCard 
                icon={FaCoins}
                label="Poin/Bulan"
                value={monthlyPoints}
                color="#f59e0b"
                delay={0.3}
              />
              <StatsCard 
                icon={FaUsers}
                label="Total Pegawai"
                value={employees}
                color="#3b82f6"
                delay={0.4}
              />
            </div>

            {/* Points Display */}
            <PointDisplay 
              points={selectedBrand.totalPoints}
              onExchange={() => setActiveTab('products')}
            />

            {/* Map Preview */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Lokasi Cabang Anda</h3>
                <button 
                  onClick={() => setActiveTab('branches')}
                  className="text-sm text-sirsak-primary hover:underline"
                >
                  Lihat Semua →
                </button>
              </div>
              <div className="h-64">
                <GISMap 
                  branches={selectedBrand.branches} 
                  onBranchSelect={(branch) => console.log('Selected:', branch)}
                />
              </div>
            </div>

            {/* Chart */}
            <ChartComponent />

            {/* Recent Pickups */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Pickup Terbaru</h3>
                <button 
                  onClick={() => setActiveTab('pickup')}
                  className="text-sirsak-primary hover:underline"
                >
                  Lihat Semua →
                </button>
              </div>
              <PickupList pickups={pickups.filter(p => p.brandId === selectedBrand.id)} />
            </div>
          </div>
        );

      case 'branches':
        return <BranchManager brand={selectedBrand} />;

      case 'pickup':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Pickup Sampah</h3>
                <p className="text-gray-600">Request pickup untuk cabang yang memiliki sampah MLP</p>
              </div>
              <div className="text-sm text-gray-500">
                Total Request: {pickups.filter(p => p.brandId === selectedBrand.id).length}
              </div>
            </div>

            <RequestForm 
              brand={selectedBrand}
              onSuccess={() => alert('Pickup request berhasil dibuat!')}
            />

            <PickupList pickups={pickups.filter(p => p.brandId === selectedBrand.id)} />
          </div>
        );

      case 'employees':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Kelola Pegawai & BPJS</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EmployeeManager />
              </div>
              <div>
                <BPJSCalculator brand={selectedBrand} />
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-sirsak-primary to-sirsak-secondary rounded-xl p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Produk & Reward</h3>
                  <p>Poin Anda: {selectedBrand.totalPoints.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{selectedBrand.totalPoints.toLocaleString()}</div>
                  <div className="text-sm opacity-80">Total Poin</div>
                </div>
              </div>
            </div>

            <ProductCatalog brand={selectedBrand} />
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Laporan & Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h4 className="font-bold mb-4">Statistik Poin</h4>
                <ChartComponent />
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h4 className="font-bold mb-4">Ringkasan Bulan Ini</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Total Sampah Dikumpulkan</span>
                    <span className="font-bold">{totalWeight} kg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Total Poin Diperoleh</span>
                    <span className="font-bold">{monthlyPoints} poin</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Pickup Berhasil</span>
                    <span className="font-bold">
                      {pickups.filter(p => p.brandId === selectedBrand.id && p.status === 'POINT_GRANTED').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Biaya BPJS/Bulan</span>
                    <span className="font-bold">40,000 poin</span>
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
      userType="warkop" 
      onLogout={onLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {renderContent}
    </LayoutWrapper>
  );
};

export default AdminWarkop;