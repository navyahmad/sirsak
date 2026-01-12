import { motion } from 'framer-motion';
import { 
  FaCoffee, 
  FaRecycle, 
  FaArrowRight,
  FaBuilding,
  FaTruckLoading
} from 'react-icons/fa';
import { GiRecycle } from 'react-icons/gi';

const LoginCard = ({ role, description, icon, color, onLogin }) => {
  const IconComponent = icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-green-300 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Icon Container */}
      <div className={`w-20 h-20 ${color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
        <IconComponent className="text-white text-3xl" />
      </div>
      
      {/* Role Title */}
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">
        {role}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 text-center mb-6 flex-grow">
        {description}
      </p>
      
      {/* Features List */}
      <div className="space-y-2 mb-6">
        {role === "Admin Warkop" ? (
          <>
            <div className="flex items-center text-gray-700">
              <FaCoffee className="text-green-500 mr-2" />
              <span className="text-sm">Kelola cabang warkop</span>
            </div>
            <div className="flex items-center text-gray-700">
              <GiRecycle className="text-green-500 mr-2" />
              <span className="text-sm">Request pickup sampah MLP</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaBuilding className="text-green-500 mr-2" />
              <span className="text-sm">Kelola poin & BPJS pegawai</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center text-gray-700">
              <FaTruckLoading className="text-blue-500 mr-2" />
              <span className="text-sm">Jadwalkan pickup sampah</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaRecycle className="text-blue-500 mr-2" />
              <span className="text-sm">Monitoring data & timbangan</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaBuilding className="text-blue-500 mr-2" />
              <span className="text-sm">Validasi poin & laporan</span>
            </div>
          </>
        )}
      </div>
      
      {/* Login Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLogin}
        className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center ${role === "Admin Warkop" ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
      >
        Masuk sebagai {role.split(' ')[1]}
        <FaArrowRight className="ml-2" />
      </motion.button>
    </motion.div>
  );
};

export default LoginCard;