import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarkopStore } from '../stores/useWarkopStore';
import WarkopHeader from '../components/layout/WarkopHeader';
import Sidebar from '../components/layout/Sidebar';
import BranchManager from '../components/warkop/BranchManager';
import PickupRequestForm from '../components/warkop/PickupRequestForm';
import EmployeeManager from '../components/warkop/EmployeeManager';
import PointsSystem from '../components/warkop/PointsSystem';
import Marketplace from '../components/warkop/Marketplace';
import { 
  FaStore, 
  FaTruckLoading, 
  FaUsers, 
  FaCoins, 
  FaShoppingCart,
  FaChartBar,
  FaMapMarkerAlt,
  FaCog,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const WarkopDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('branches');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get data from store
  const {
    brand,
    branches,
    employees,
    pickupRequests,
    transactions,
    mlpProducts,
    addBranch,
    updateBranch,
    requestPickup,
    addEmployee,
    redeemForBPJS,
    purchaseProduct,
    simulatePointsGranted
  } = useWarkopStore();

  // Mobile menu items
  const menuItems = [
    { id: 'branches', label: 'Cabang', icon: FaStore },
    { id: 'pickup', label: 'Pickup', icon: FaTruckLoading },
    { id: 'employees', label: 'Pegawai', icon: FaUsers },
    { id: 'points', label: 'Poin', icon: FaCoins },
    { id: 'marketplace', label: 'Marketplace', icon: FaShoppingCart },
  ];

  // Render active tab content
  const renderContent = () => {
    switch(activeTab) {
      case 'branches':
        return (
          <BranchManager
            branches={branches}
            onAddBranch={addBranch}
            onUpdateBranch={updateBranch}
          />
        );
      
      case 'pickup':
        return (
          <PickupRequestForm
            branches={branches}
            pickupRequests={pickupRequests}
            onRequestPickup={requestPickup}
          />
        );
      
      case 'employees':
        return (
          <EmployeeManager
            employees={employees}
            branches={branches}
            onAddEmployee={addEmployee}
            onRedeemBPJS={redeemForBPJS}
          />
        );
      
      case 'points':
        return (
          <PointsSystem
            brand={brand}
            pickupRequests={pickupRequests}
            transactions={transactions}
          />
        );
      
      case 'marketplace':
        return (
          <Marketplace
            products={mlpProducts}
            brandPoints={brand.points}
            onPurchaseProduct={purchaseProduct}
          />
        );
      
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800">Halaman dalam pengembangan</h2>
            <p className="text-gray-600 mt-2">Fitur ini akan segera tersedia</p>
          </div>
        );
    }
  };

  // Stats for dashboard overview
  const stats = {
    activeBranches: branches.filter(b => b.status === 'active').length,
    pendingPickups: pickupRequests.filter(req => req.status === 'REQUESTED').length,
    activeEmployees: employees.filter(e => e.bpjsStatus === 'active').length,
    totalPoints: brand.points
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <WarkopHeader 
        brandName={brand.name}
        points={brand.points}
        onLogout={onLogout}
      />

      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="md:hidden fixed inset-x-4 bottom-20 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 p-4"
          >
            <div className="grid grid-cols-3 gap-2">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex flex-col items-center p-3 rounded-xl ${activeTab === item.id ? 'bg-green-50 text-green-600' : 'text-gray-700'}`}
                >
                  <item.icon className="text-xl mb-2" />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={onLogout}
                className="w-full py-2 bg-red-500 text-white rounded-lg font-medium"
              >
                Keluar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Stats Bar */}
      <div className="md:hidden p-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600">Cabang Aktif</p>
            <p className="text-lg font-bold text-green-600">{stats.activeBranches}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600">Total Poin</p>
            <p className="text-lg font-bold text-amber-600">{stats.totalPoints.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 py-6">
          {/* Brand Info */}
          <div className="px-6 mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-3">
                <FaStore className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{brand.name}</h2>
                <p className="text-xs text-gray-500">Admin Warkop</p>
              </div>
            </div>
            
            {/* Points Display */}
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center">
                <FaCoins className="text-amber-500 text-xl mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Poin</p>
                  <p className="text-2xl font-bold text-amber-600">{brand.points.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Tersedia untuk ditukar</p>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === item.id 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`text-xl mr-3 ${activeTab === item.id ? 'text-green-500' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                    {item.id === 'pickup' && stats.pendingPickups > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {stats.pendingPickups}
                      </span>
                    )}
                  </motion.button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Stats Footer */}
          <div className="px-4 mt-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
              <p className="text-sm font-medium">Pegawai dengan BPJS</p>
              <p className="text-2xl font-bold mt-1">{stats.activeEmployees}</p>
              <p className="text-xs opacity-90 mt-1">dari {employees.length} pegawai</p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Action Button for Quick Actions */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 left-4 flex flex-col space-y-2 z-40"
      >
        {/* Simulate Points Button (for demo) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            // Simulate points for demo
            if (pickupRequests.some(req => req.status === 'PICKED_UP')) {
              const request = pickupRequests.find(req => req.status === 'PICKED_UP');
              simulatePointsGranted(request.id, request.estimatedWeight + 5);
            }
          }}
          className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center text-white"
          title="Simulasi poin diterima (demo)"
        >
          <FaCoins />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WarkopDashboard;