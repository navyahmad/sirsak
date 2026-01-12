import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';

const NotificationPanel = ({ notifications = [], onClose, onMarkAsRead }) => {
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'info': return <FaInfoCircle className="text-blue-500" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-500" />;
      case 'success': return <FaCheckCircle className="text-green-500" />;
      default: return <FaBell className="text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-16 right-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaBell className="text-xl mr-3" />
            <div>
              <h3 className="font-bold text-lg">Notifications</h3>
              <p className="text-sm opacity-90">Permintaan pickup terbaru</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full">
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{notif.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">
                          {notif.time} • {notif.date}
                        </span>
                        {!notif.read && (
                          <button 
                            onClick={() => onMarkAsRead(notif.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Tandai dibaca
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FaBell className="text-4xl mx-auto mb-4 opacity-30" />
              <p>Tidak ada notifikasi baru</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <button className="w-full text-center text-blue-600 font-medium hover:text-blue-800">
          Lihat semua notifikasi
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationPanel;