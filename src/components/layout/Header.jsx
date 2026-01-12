import { motion } from 'framer-motion';
import { FaBell, FaUserCircle, FaSignOutAlt, FaRecycle } from 'react-icons/fa';

const Header = ({ userName, notifications = 2, onLogout }) => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 md:px-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
            <FaRecycle className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">Admin Sirsak</h1>
            <p className="text-xs text-gray-500">Pengolahan Limbah MLP</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <FaBell className="text-gray-600 text-xl" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-800">{userName}</p>
              <p className="text-xs text-gray-500">Admin Pengolahan</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
              <FaUserCircle className="text-white text-2xl" />
            </div>
            
            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="hidden md:flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
            >
              <FaSignOutAlt className="mr-2" />
              Keluar
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;