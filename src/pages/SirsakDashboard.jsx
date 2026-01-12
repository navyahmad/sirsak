import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSirsakStore } from '../stores/useSirsakStore';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import DashboardStats from '../components/sirsak/DashboardStats';
import PickupSchedule from '../components/sirsak/PickupSchedule';
import GISMapView from '../components/sirsak/GISMapView';
import WeightToPoints from '../components/sirsak/WeightToPoints';
import NotificationPanel from '../components/sirsak/NotificationPanel';
import { 
  FaBell, 
  FaTachometerAlt, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaTruckLoading,
  FaWeightHanging,
  FaChartBar,
  FaCog
} from 'react-icons/fa';
import { GiWeightScale } from 'react-icons/gi';

const SirsakDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get data from store
  const {
    pickupRequests,
    drivers,
    warehouseLocation,
    stats,
    recentActivities,
    schedulePickup,
    markAsPickedUp,
    recordWeightAndPoints,
    simulateNewRequest,
    addNotification
  } = useSirsakStore();

  // Notifications from recent activities
  const notifications = recentActivities
    .filter(activity => activity.action === 'Notification')
    .map(activity => ({
      id: activity.id,
      title: 'Permintaan Pickup Baru',
      message: activity.message || 'Warkop mengajukan pickup',
      time: activity.time,
      date: activity.date,
      type: 'info',
      read: false
    }));

  // Mobile menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { id: 'map', label: 'GIS Map', icon: FaMapMarkerAlt },
    { id: 'schedule', label: 'Schedule', icon: FaCalendarAlt },
    { id: 'pickup', label: 'Pickup', icon: FaTruckLoading },
    { id: 'weight', label: 'Weight', icon: GiWeightScale },
  ];

  // Render active tab content
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats 
              stats={stats} 
              onSimulateRequest={simulateNewRequest}
            />
            <PickupSchedule
              pickupRequests={pickupRequests}
              drivers={drivers}
              onSchedule={schedulePickup}
              onMarkAsPickedUp={markAsPickedUp}
            />
            <GISMapView
              pickupRequests={pickupRequests}
              warehouseLocation={warehouseLocation}
            />
          </div>
        );
      
      case 'map':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">GIS Map Monitoring</h2>
              <p className="text-gray-600">Pantau semua lokasi warkop & rute pickup secara real-time</p>
            </div>
            <GISMapView
              pickupRequests={pickupRequests}
              warehouseLocation={warehouseLocation}
            />
          </div>
        );
      
      case 'schedule':
        return (
          <PickupSchedule
            pickupRequests={pickupRequests}
            drivers={drivers}
            onSchedule={schedulePickup}
            onMarkAsPickedUp={markAsPickedUp}
          />
        );
      
      case 'pickup':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Manajemen Pickup</h2>
              <p className="text-gray-600">Kelola semua permintaan pickup dari warkop</p>
            </div>
            <PickupSchedule
              pickupRequests={pickupRequests}
              drivers={drivers}
              onSchedule={schedulePickup}
              onMarkAsPickedUp={markAsPickedUp}
            />
          </div>
        );
      
      case 'weight':
        return (
          <WeightToPoints
            pickupRequests={pickupRequests}
            onRecordWeight={recordWeightAndPoints}
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        userName="Admin Sirsak" 
        notifications={notifications.length}
        onLogout={onLogout}
      />

      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full shadow-lg flex items-center justify-center text-white"
        >
          {mobileMenuOpen ? '✕' : '☰'}
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
                  className={`flex flex-col items-center p-3 rounded-xl ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
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

      {/* Main Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
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

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationPanel
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
            onMarkAsRead={(id) => console.log('Mark as read:', id)}
          />
        )}
      </AnimatePresence>

      {/* Floating Action Button for Notifications */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNotifications(true)}
        className="fixed bottom-4 left-4 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center text-white z-40"
      >
        <FaBell className="text-xl" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default SirsakDashboard;