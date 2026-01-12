import { motion } from 'framer-motion';
import { 
  FaTachometerAlt, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaTruckLoading,
  FaWeight,
  FaChartBar,
  FaBell,
  FaCog
} from 'react-icons/fa';
import { GiWeightScale } from 'react-icons/gi';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, color: 'text-blue-500' },
    { id: 'map', label: 'GIS Map View', icon: FaMapMarkerAlt, color: 'text-green-500' },
    { id: 'schedule', label: 'Pickup Schedule', icon: FaCalendarAlt, color: 'text-purple-500' },
    { id: 'pickup', label: 'Pickup Requests', icon: FaTruckLoading, color: 'text-yellow-500' },
    { id: 'weight', label: 'Weight to Points', icon: GiWeightScale, color: 'text-indigo-500' },
    { id: 'notifications', label: 'Notifications', icon: FaBell, color: 'text-red-500' },
    { id: 'reports', label: 'Reports', icon: FaChartBar, color: 'text-teal-500' },
    { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-500' },
  ];

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden md:flex flex-col w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 py-6"
    >
      {/* Logo */}
      <div className="px-6 mb-8">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-3">
            <GiWeightScale className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Sirsak Admin</h2>
            <p className="text-xs text-gray-500">Sistem Pengolahan Limbah</p>
          </div>
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
                  ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`text-xl mr-3 ${item.color}`} />
                <span className="font-medium">{item.label}</span>
                {item.id === 'notifications' && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                )}
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Stats Footer */}
      <div className="px-4 mt-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
          <p className="text-sm font-medium">Total Poin Diberikan</p>
          <p className="text-2xl font-bold mt-1">124,500</p>
          <p className="text-xs opacity-90 mt-1">dari 1,245 kg MLP</p>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;